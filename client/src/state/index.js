import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "light",
  user: null,
  token: null,
  posts: [],
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLogout: (state) => {
      state.user = null;                    //Reset incase of logout
      state.token = null;
    },
    setFriends: (state, action) => {        //Sets to local state
      if (state.user) {             //If user exists
        state.user.friends = action.payload.friends;
      } else {
        console.error("user friends non-existent :(");
      }
    },
    setPosts: (state, action) => {
      state.posts = action.payload.posts;
    },
    setPost: (state, action) => {
      const updatedPosts = state.posts.map((post) => {
        if (post._id === action.payload.post._id) return action.payload.post;
        return post;
      });
      state.posts = updatedPosts;
    },
    deletePost: (state, action) => {
      const { postId } = action.payload;
      console.log("Inside", action.payload)
      console.log("Inside", postId)
      state.posts = state.posts.filter((post) => post._id !== postId);
      console.log("Inside", state.posts)
    },
    addComment: (state, action) => {
      const { postId, comment } = action.payload;
      const idx = state.posts.find((post) => post._id === postId);
      if (idx){
        state.posts[idx].comments.push(comment)        
      }
    }
  },
});

export const { setMode, setLogin, setLogout, setFriends, setPosts, setPost, deletePost, addComment } =
  authSlice.actions; 
export default authSlice.reducer;