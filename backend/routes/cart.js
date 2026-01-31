const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart.js");
const Product = require("../models/Product.js");

// Middleware: check user
const isAuthenticated = (req, res, next) => {
  const userId = req.query.userId;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized. Login first." });
  }
  req.userId = userId;
  next();
};

// =====================
// GET CART ITEMS
// =====================
router.get("/", isAuthenticated, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.userId }).populate("items.product");
    if (!cart) return res.status(200).json({ items: [] });
    res.status(200).json({ items: cart.items });
  } catch (err) {
    console.log("Error fetching cart:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// =====================
// ADD ITEM TO CART
// =====================
router.post("/add", isAuthenticated, async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (product.stock < quantity) {
      return res.status(400).json({ message: "Not enough stock" });
    }

    let cart = await Cart.findOne({ user: req.userId });
    if (!cart) cart = new Cart({ user: req.userId, items: [] });

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    // 🔥 Decrease stock
    product.stock -= quantity;

    await product.save();
    await cart.save();

    const updatedCart = await Cart.findOne({ user: req.userId }).populate("items.product");
    res.status(200).json({ items: updatedCart.items });
  } catch (err) {
    console.log("Error adding to cart:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// =====================
// REMOVE ITEM FROM CART
// =====================
router.post("/remove", isAuthenticated, async (req, res) => {
  const { productId } = req.body;

  try {
    const cart = await Cart.findOne({ user: req.userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(
      (i) => i.product.toString() === productId
    );
    if (!item) return res.status(404).json({ message: "Item not found" });

    // 🔥 Restore stock
    const product = await Product.findById(productId);
    product.stock += item.quantity;
    await product.save();

    cart.items = cart.items.filter(
      (i) => i.product.toString() !== productId
    );

    await cart.save();

    const updatedCart = await Cart.findOne({ user: req.userId }).populate("items.product");
    res.status(200).json({ items: updatedCart.items });
  } catch (err) {
    console.log("Error removing item:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// =====================
// UPDATE QUANTITY (+ / -)
// =====================
router.post("/update-quantity", isAuthenticated, async (req, res) => {
  const { productId, increment } = req.body;

  try {
    const cart = await Cart.findOne({ user: req.userId }).populate("items.product");
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(
      (i) => i.product._id.toString() === productId
    );
    if (!item) return res.status(404).json({ message: "Item not found" });

    const product = await Product.findById(productId);

    if (increment) {
      if (product.stock <= 0) {
        return res.status(400).json({ message: "Out of stock" });
      }
      item.quantity += 1;
      product.stock -= 1;
    } else {
      if (item.quantity > 1) {
        item.quantity -= 1;
        product.stock += 1;
      }
    }

    await product.save();
    await cart.save();

    const updatedCart = await Cart.findOne({ user: req.userId }).populate("items.product");
    res.status(200).json({ items: updatedCart.items });
  } catch (err) {
    console.log("Error updating quantity:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
