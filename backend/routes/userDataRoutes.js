import express from "express";
import UserData from "../models/UserData.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ==========================
   SAVE RESULT (HISTORY)
========================== */
router.post("/save", protect, async (req, res) => {
  try {
    const { type, input, result } = req.body;

    const saved = await UserData.create({
      userId: req.user._id,
      type,
      input,
      result,
      isFavorite: false,
    });

    res.json({ success: true, saved });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ==========================
   GET HISTORY
========================== */
router.get("/history", protect, async (req, res) => {
  try {
    const data = await UserData.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ==========================
   TOGGLE FAVORITE
========================== */
router.put("/favorite/:id", protect, async (req, res) => {
  try {
    const item = await UserData.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!item) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    item.isFavorite = !item.isFavorite;
    await item.save();

    res.json({ success: true, item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ==========================
   GET FAVORITES
========================== */
router.get("/favorites", protect, async (req, res) => {
  try {
    const favs = await UserData.find({
      userId: req.user._id,
      isFavorite: true,
    }).sort({ createdAt: -1 });

    res.json({ success: true, data: favs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
