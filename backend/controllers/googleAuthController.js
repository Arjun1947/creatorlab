import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { initFirebaseAdmin } from "../config/firebaseAdmin.js";

export const googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ success: false, message: "idToken missing" });
    }

    const admin = initFirebaseAdmin();

    const decoded = await admin.auth().verifyIdToken(idToken);

    const email = decoded.email;
    const name = decoded.name || "Google User";

    if (!email) {
      return res.status(400).json({ success: false, message: "Google email missing" });
    }

    // ✅ Find or create user
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        password: "GOOGLE_AUTH_USER", // dummy
      });
    }

    // ✅ Generate token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      success: true,
      message: "Google login successful ✅",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("GOOGLE LOGIN ERROR:", err.message);
    return res.status(500).json({
      success: false,
      message: "Google login failed ❌",
    });
  }
};
