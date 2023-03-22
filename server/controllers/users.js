import User from "../models/User.js";

/* READ */
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;              //Grab ID from that particular string
    const user = await User.findById(id);   //Now grab the information from the ID
    res.status(200).json(user);             //Send back to the frontend
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    const friends = await Promise.all(      //Making multiple API calls to the database
      user.friends.map((id) => User.findById(id))   //Grab user by ID and find all their information
    );
    const formattedFriends = friends.map(       //Formatiing it in a proper way for the frontend 
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );
    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((id) => id !== friendId);  //Removing user from the friendlist     
      friend.friends = friend.friends.filter((id) => id !== id);    //Removing your friend's ID from their friend's list
    } else {
      user.friends.push(friendId);          //Now if they are not included, add them into the friendlist.
      friend.friends.push(id);              //In both these function, if one removes other as a friend, it will be romoved in the other account too.
    }
    await user.save();              //Saving the updated list
    await friend.save();            //Saving the updated list

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );
    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};