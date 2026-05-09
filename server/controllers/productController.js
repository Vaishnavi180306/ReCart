const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

// Helper to upload image buffer to Cloudinary
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "recart_products" },
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// @desc    Get all products (with search/filter)
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const { keyword, category, condition, minPrice, maxPrice, campusOnly, college } = req.query;

    let query = {};

    // Basic Search
    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ];
    }

    // Filters
    if (category) query.category = category;
    if (condition) query.condition = condition;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Campus Only mode
    if (campusOnly === "true" && college) {
      // Need to find products where the seller belongs to the specified college
      // For simplicity in MVP, we might populate seller later or require it in the query
      // Let's assume we do a join or have a separate route for it.
      // For now, we'll fetch all matching products, then filter by populated seller college
    }

    const products = await Product.find(query)
      .populate("seller", "name college isVerified")
      .sort({ createdAt: -1 }); // Newest first

    // Filter campus only if requested
    let finalProducts = products;
    if (campusOnly === "true" && college) {
      finalProducts = products.filter(
        (p) => p.seller && p.seller.college === college
      );
    }

    res.json(finalProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "seller",
      "name college isVerified trustScore profilePhoto"
    );

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private
const createProduct = async (req, res) => {
  try {
    const { title, description, price, category, condition, location, isNegotiable, acceptsExchange, isCampusOnly } = req.body;

    // Handle Image Uploads
    let imageResults = [];
    if (req.files && req.files.length > 0) {
      // Check if Cloudinary credentials exist
      if (!process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME === "placeholder") {
         return res.status(500).json({ message: "Cloudinary credentials not configured on the server." });
      }

      const uploadPromises = req.files.map((file) => uploadToCloudinary(file.buffer));
      const uploadedImages = await Promise.all(uploadPromises);
      
      imageResults = uploadedImages.map((img) => ({
        url: img.secure_url,
        public_id: img.public_id,
      }));
    }

    const product = new Product({
      seller: req.user._id,
      title,
      description,
      price: Number(price),
      category,
      condition,
      location,
      isNegotiable: isNegotiable === "true" || isNegotiable === true,
      acceptsExchange: acceptsExchange === "true" || acceptsExchange === true,
      isCampusOnly: isCampusOnly === "true" || isCampusOnly === true,
      images: imageResults,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if user is the seller
    if (product.seller.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(401).json({ message: "Not authorized to delete this product" });
    }

    // Delete images from Cloudinary
    if (product.images && product.images.length > 0) {
      const deletePromises = product.images.map((img) =>
        cloudinary.uploader.destroy(img.public_id)
      );
      await Promise.all(deletePromises);
    }

    await product.deleteOne();
    res.json({ message: "Product removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  deleteProduct,
};
