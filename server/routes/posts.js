import express from "express";
import { getFeedPosts, getUserPosts, likePost, commentPost, deletePost } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/", verifyToken, getFeedPosts);                 //Grab the user feed when we are on the home page
router.get("/:userId/posts", verifyToken, getUserPosts);    //Only the relevant user's post

/* UPDATE */
router.patch("/:id/like", verifyToken, likePost);           //For linking and Unliking the posts
router.patch("/:id/comment", verifyToken, commentPost);           //For linking and Unliking the posts


/* DELETE */
router.post("/delete/:id", deletePost);           //For linking and Unliking the posts

export default router;