import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  getBalance,
  getDirectTeam,
  getAllTeam,
  activateId,
  getActivationHistory,
  getAllIncome,
  getReferralIncome,
  requestWithdrawal,
  getWithdrawalHistory,
  submitTicket,
  changePassword,
} from "../controllers/dashController.js";

const router = Router();

// Balance
router.get("/balance",              authMiddleware, getBalance);

// Team
router.get("/team/direct",          authMiddleware, getDirectTeam);
router.get("/team/all",             authMiddleware, getAllTeam);

// Activation
router.post("/activate",            authMiddleware, activateId);
router.get("/activations",          authMiddleware, getActivationHistory);

// Income
router.get("/income",               authMiddleware, getAllIncome);
router.get("/income/referral",      authMiddleware, getReferralIncome);

// Withdrawal
router.post("/withdraw",            authMiddleware, requestWithdrawal);
router.get("/withdrawals",          authMiddleware, getWithdrawalHistory);

// Support
router.post("/support",             authMiddleware, submitTicket);

// Password
router.post("/profile/password",    authMiddleware, changePassword);

export default router;