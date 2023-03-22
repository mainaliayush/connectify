import bcrypt from "bcrypt";                        // Allows user to encrypt password
import jwt from "jsonwebtoken";                     //Give user webtoken for authorization
import User from "../models/User.js";

/* REGISTER USER */
export const register = async (req, res) => {       //Async because it is calling mongoDB. Backend->Database
    try {
      const {firstName,lastName, email, password, picturePath, friends, location, occupation
        } = req.body;
  
      const salt = await bcrypt.genSalt();                      //Creating random salt created by bcrypt
      const passwordHash = await bcrypt.hash(password, salt);   //Password Hash after salt
  
      const newUser = new User({                    //After salted and encrypted, authentication takes place and token is provided to the genuine User.
        firstName,
        lastName,
        email,
        password: passwordHash,                     //Hashed password now stored here in this object
        picturePath,
        friends,
        location,
        occupation,
        viewedProfile: Math.floor(Math.random() * 10000),       //Random Profileviews
        impressions: Math.floor(Math.random() * 10000),         //Random Impressions
      });
      const savedUser = await newUser.save();                   //User now saved
      res.status(201).json(savedUser);   
                //201: The request has succeeded and has led to the creation of a user.
                // Create the JSON version of the savedUser for the frontend to recieve this resopnse.
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
};
  
/* LOGGING IN */
export const login = async (req, res) => {
try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).json({ msg: "User does not exist. " });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. " });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    delete user.password;
    
    res.status(200).json({ token, user });
} catch (err) {
    res.status(500).json({ error: err.message });
}
};