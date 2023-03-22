import express from "express";
import {getUser, getUserFriends, addRemoveFriend} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/:id", verifyToken, getUser);                       // Users/someID send by frontend call it to Database
router.get("/:id/friends", verifyToken, getUserFriends);        // User's Friend

/* UPDATE */
router.patch("/:id/:friendId", verifyToken, addRemoveFriend);

export default router;