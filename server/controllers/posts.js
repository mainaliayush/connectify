import Post from "../models/Post.js";
import User from "../models/User.js";

/* CREATE */
export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body;
    const user = await User.findById(userId);
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comments: [],
    });
    console.log(user.picturePath)
    await newPost.save();

    const post = await Post.find();
    res.status(201).json(post);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

/* READ */
export const getFeedPosts = async (req, res) => {
  try {
    const post = await Post.find();
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = await Post.find({ userId });
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE LIKE BUTTON */
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);
    const isLiked = post.likes.get(userId);    

    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};


/* POST COMMENT */
export const commentPost = async(req, res) => {
  try{
    const { postId, userId, comments } = req.body;

    if (postId || !userId || !comments) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const post = await Post.findById(_id)
    if (!post){
      return res.status(404).json({message: "Post not found" });
    }
    const comment = {userId, comments}
    post.comment.push(comment)
    await post.save();
    res.status(201).json(comment);
  }
  catch(err){
    res.status(500).json({ message: err.message });
  }
}

/* DELETE */
export const deletePost = async(req, res) => {
  try{
    // console.log(req.params)
    const postId = req.params.id;
    const complete = await Post.findByIdAndDelete(postId);
    if(!complete){
      return res.status(404).json({message: "Post not Found"});
    }
    const posts = await Post.find();
    res.status(200).json(posts);
  }catch(err){
    res.status(500).json({ message: err.message });
}}