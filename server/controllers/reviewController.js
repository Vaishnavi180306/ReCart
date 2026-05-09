const Review = require("../models/Review");
const User = require("../models/User");

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res) => {
  try {
    const { reviewee, product, rating, comment } = req.body;

    // Prevent self-review
    if (req.user._id.toString() === reviewee) {
      return res.status(400).json({ message: "You cannot review yourself" });
    }

    const review = await Review.create({
      reviewer: req.user._id,
      reviewee,
      product,
      rating,
      comment,
    });

    // Update user trust score (average of all ratings)
    const allReviews = await Review.find({ reviewee });
    const avgRating =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    await User.findByIdAndUpdate(reviewee, { trustScore: Math.round(avgRating * 20) });

    const populated = await review.populate("reviewer", "name profilePhoto");
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get reviews for a user
// @route   GET /api/reviews/:userId
// @access  Public
const getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ reviewee: req.params.userId })
      .populate("reviewer", "name profilePhoto")
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createReview, getUserReviews };
