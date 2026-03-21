import { Router } from "express";
import adminMiddleware from "../middleware/adminMiddleware.js";
import {
  adminLogin,
  getAllUsers,
  getUserById,
  impersonateUser,
  getUserTeam,
  getWallet,
  updateWallet,
} from "../controllers/adminController.js";

const router = Router();

// Public
router.post("/login", adminLogin);

// Protected — admin only
router.get("/users", adminMiddleware, getAllUsers);
router.get("/users/:id", adminMiddleware, getUserById);
router.post("/users/:id/impersonate", adminMiddleware, impersonateUser);
router.get("/users/:id/team", adminMiddleware, getUserTeam);
router.get("/users/:id/wallet", adminMiddleware, getWallet);
router.post("/wallet/update", adminMiddleware, updateWallet);

export default router;