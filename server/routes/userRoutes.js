const express = require("express");
const router = express.Router();
const { getUserById, updateProfile, toggleWishlist, getWishlist, getMyListings } = require("../controllers/userController");
const { protect } = require("../middleware/auth");

router.get("/wishlist", protect, getWishlist);
router.get("/my-listings", protect, getMyListings);
router.put("/profile", protect, updateProfile);
router.put("/wishlist/:productId", protect, toggleWishlist);
router.get("/:id", getUserById);

module.exports = router;
