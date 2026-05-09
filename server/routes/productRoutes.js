const express = require("express");
const router = express.Router();
const { getProducts, getProductById, createProduct, deleteProduct } = require("../controllers/productController");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");

router.route("/")
  .get(getProducts)
  .post(protect, upload.array("images", 5), createProduct); // Max 5 images

router.route("/:id")
  .get(getProductById)
  .delete(protect, deleteProduct);

module.exports = router;
