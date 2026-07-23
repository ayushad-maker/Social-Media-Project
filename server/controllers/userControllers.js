import fs from "fs";
import User from "../models/user.js";
import imageKit from "../config/imageKit.js";
import Connection from "../models/Connections.js";

//get User data
export const getUserData = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const user = await User.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "user is not found" });
    }

    return res.json({ success: true, user });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

//update user data

export const getUpdatedUserData = async (req, res) => {
  try {
    const { userId } = await req.auth();

    let { username, bio, location, full_name } = req.body;

    // Find current user
    const tempUser = await User.findById(userId);

    if (!tempUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Keep old values if empty
    username = username || tempUser.username;
    bio = bio ?? tempUser.bio;
    location = location ?? tempUser.location;
    full_name = full_name ?? tempUser.full_name;

    // Check username availability
    if (username !== tempUser.username) {
      const existingUser = await User.findOne({ username });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Username already exists",
        });
      }
    }

    const updatedData = {
      username,
      bio,
      location,
      full_name,
    };

    // Uploaded files
    const profile = req.files?.profile?.[0];
    const cover = req.files?.cover?.[0];

    // ==========================
    // Upload Profile Image
    // ==========================
    if (profile) {
      const fileBuffer = profile.buffer
        ? profile.buffer
        : fs.readFileSync(profile.path);

      const response = await imageKit.upload({
        file: fileBuffer,
        fileName: profile.originalname,
      });

      updatedData.profile_picture = imageKit.url({
        path: response.filePath,
        transformation: [
          {
            quality: "auto",
          },
          {
            format: "webp",
          },
          {
            width: "512",
          },
        ],
      });
    }

    // ==========================
    // Upload Cover Image
    // ==========================
    if (cover) {
      const fileBuffer = cover.buffer
        ? cover.buffer
        : fs.readFileSync(cover.path);

      const response = await imageKit.upload({
        file: fileBuffer,
        fileName: cover.originalname,
      });

      updatedData.cover_photo = imageKit.url({
        path: response.filePath,
        transformation: [
          {
            quality: "auto",
          },
          {
            format: "webp",
          },
          {
            width: "1280",
          },
        ],
      });
    }

    // Update user
    const user = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Find User using username,email or full name
export const discoveryUsers = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { input } = req.body;

    const allUsers = await User.find({
      $or: [
        { username: new RegExp(input, "i") },
        { email: new RegExp(input, "i") },
        { full_name: new RegExp(input, "i") },
        { location: new RegExp(input, "i") },
      ],
    });

    const filteredUsers = allUsers.filter((user) => user._id !== userId);
    res.json({ success: true, users: filteredUsers });
  } catch (error) {}
};

//Follow User
export const followUser = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { id } = req.body;

    const user = await User.findById(userId);

    if (user.following.includes(id)) {
      return res.json({
        success: false,
        message: "you are already following this user",
      });
    }

    user.following.push(id);
    await user.save();

    const toUser = await User.findById(id);
    toUser.followers.push(userId);
    await toUser.save();

    return res.json({
      success: true,
      message: "Now you are following this User.",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

//Unfollow User
export const UnfollowUser = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { id } = req.body;

    const user = await User.findById(userId);
    user.following = user.following.filter((user) => user !== id);
    await user.save();

    const toUser = await User.findById(id);
    toUser.followers = toUser.followers.filter((user) => user !== userId);

    await toUser.save();

    return res.json({
      success: true,
      message: "now you are successfully unfollow this user.",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

//connections request

export const sendConnectionsRequest = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { id } = req.body;

    const last24hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const connectionsRequests = await Connection.find({
      from_user_id: userId,
      createdAt: { $gt: last24hours },
    });

    if (connectionsRequests.length >= 20) {
      return res.json({
        success: false,
        message:
          "You have sent more than 20 request already in the last 24 hours",
      });
    }

    //check if user is already exits or not

    const connection = await Connection.findById({
      $or: [
        { from_user_id: userId, to_user_id: id },
        { from_user_id: id, to_user_id: userId },
      ],
    });

    if (!connection) {
      await Connection.create({
        from_user_id: userId,
        to_user_id: id,
      });

      return res.json({
        success: true,
        message: "Connections request send successfully.",
      });
    } else if (connection && connection.status === "accepted") {
      return res.json({
        success: false,
        message: "You are already accepted the connection request",
      });
    } else {
      return res.json({
        success: false,
        message: "the connection request is still pending",
      });
    }
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const getUserConnections = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { id } = req.body;

    const user = await Connection.findById(userId).populate(
      "connections followers following",
    );

    const connections = user.connections;
    const followers = user.followers;
    const following = user.following;

    const pendingConnections = (
      await Connection.find({ to_user_id: userId, status: "pending" }).populate(
        "from_user_id",
      )
    ).map((connection) => connection.from_user_id);

    res.json({
      success: true,
      connections,
      followers,
      following,
      pendingConnections,
    });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};
