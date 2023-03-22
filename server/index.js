import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";    //Allows us to properly set path when we configure directories later on.
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";
import User from "./models/User.js";
import Post from "./models/Post.js";  
import { users, posts } from "./data/index.js";

/* CONFIGURATIONS */   //ALL MIDDLEWARE AND PACKAGE CONFIGUARTION //RUN IN BETWEEN THINGS

const __filename = fileURLToPath(import.meta.url);                          //config to grab file URL, specially when you use module in package.json
const __dirname = path.dirname(__filename);                                 //this is used only when you use modules in pachage.json
dotenv.config();                                                            //to use env files //dotenv package is a great way to keep passwords, API keys, and other sensitive data out of your code.
const app = express();
app.use(express.json());
app.use(helmet());                                                          //Helmet.js is a useful Node.js module that helps you secure HTTP headers returned by your Express apps.
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));                                                  //Morgan is another HTTP request logger middleware for Node.js that simplifies the process of logging requests to your application.
app.use(bodyParser.json({ limit: "30mb", extended: true }));                //Express body-parser is an npm module used to process data sent in an HTTP request body. It provides four express middleware for parsing JSON, Text, URL-encoded, and raw data sets over an HTTP request body. 
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());                                                            //Invoke croos origin resource sharing policy
app.use("/assets", express.static(path.join(__dirname, "public/assets")));  //Set the directory of where we keep our assets. Stored Locally.

/* FILE STORAGE */

const storage = multer.diskStorage({                                        //All this information came from girhub repo of multer 
  destination: function (req, file, cb) {
    cb(null, "public/assets");                                              //Anytime someone uploads file to your it will be save in the given destination: Public/Assets
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });                                         //Anytime we wanna upload file we will be using the variable "upload"

/* ROUTES WITH FILES */

app.post("/auth/register", upload.single("picture"), register);             //Format: app.post(path, middleware, logic)
app.post("/posts", verifyToken, upload.single("picture"), createPost);

/* ROUTES */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);



/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001;      //If the port 3001 does not work then we will have another port 6001 as backup
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

    /* ADD DATA ONE TIME */
    // User.insertMany(users);
    // Post.insertMany(posts);
  })
  .catch((error) => console.log(`${error} did not connect`));
  