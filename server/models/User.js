import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    firstName: {        //the object firstName must have a type of string length(2-50) and must be required=true.
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    lastName: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,    //Email must be unique
    },
    password: {
      type: String,
      required: true,
      min: 5,
    },
    picturePath: {
      type: String,
      default: "",
    },
    friends: {
      type: Array,
      default: [],
    },
    location: String,
    occupation: String,
    viewedProfile: Number,
    impressions: Number,
  },
  { timestamps: true }    //Provides automatic dates when it is created and updated.
);

const User = mongoose.model("User", UserSchema);
export default User;