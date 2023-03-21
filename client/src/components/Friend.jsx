import {
  PersonAddOutlined,
  PersonRemoveOutlined,
  DeleteOutlined,
} from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deletePost, setFriends } from "state";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

const Friend = ({ friendId, name, subtitle, userPicturePath, postId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { _id } = useSelector((state) => state.user);
  const lado = useSelector((state) => state);
  console.log("ABCD", lado)

  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.friends);
  const { userId } = useParams();

  const { palette } = useTheme();
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  const isFriend = friends.find((friend) => friend._id === friendId);
  const isMyself = _id == friendId;
  const compare = _id == userId;
  const [posts, setPosts] = useState([]); ////////      NEW    ///////////

  const patchFriend = async () => {
    const response = await fetch(
      `http://localhost:3001/users/${_id}/${friendId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    dispatch(setFriends({ friends: data }));
  };

  const handleDelete = async () => {
    const response = await fetch(`http://localhost:3001/posts/delete/${postId}` , {
      method: "POST",
      body: {},
    });
    dispatch(deletePost({postId: postId}))
  };


  return (
    <FlexBetween>
      <FlexBetween gap="1rem">
        <UserImage image={userPicturePath} size="55px" />
        <Box
          onClick={() => {
            navigate(`/profile/${friendId}`);
            navigate(0);
          }}
        >
          <Typography
            color={main}
            variant="h5"
            fontWeight="500"
            sx={{
              "&:hover": {
                color: "#7B3F00",
                cursor: "pointer",
              },
            }}
          >
            {name}
          </Typography>
          <Typography color={medium} fontSize="0.75rem">
            {subtitle}
          </Typography>
        </Box>
      </FlexBetween>
      {!isMyself && (
        <IconButton
          onClick={() => patchFriend()}
          sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
        >
          {isFriend ? (
            <PersonRemoveOutlined sx={{ color: primaryDark }} />
          ) : (
            <PersonAddOutlined sx={{ color: primaryDark }} />
          )}
        </IconButton>
      )}
      {isMyself && compare && (
        <IconButton
          onClick={() => {}}
          sx={{ backgroundColor: "#FFFFFF", p: "0.6rem" }}
        >
          <DeleteOutlined
            sx={{ color: "#A91B0D ", fontSize: "1.2rem" }}
            onClick={handleDelete}
          />
        </IconButton>
      )}
    </FlexBetween>
  );
};

export default Friend;
