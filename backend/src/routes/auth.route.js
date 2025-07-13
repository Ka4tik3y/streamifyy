import express from "express";
import {
  signup,
  login,
  logout,
  onboard,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);
router.post("/onboarding", authMiddleware, onboard);
router.get("/me", authMiddleware, (req, res) => {
  res.status(200).json({ secure: true, user: req.user });
});

export default router;
