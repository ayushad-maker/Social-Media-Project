import fs from "fs";
import imageKit from "../config/imagekit.js";
import Story from "../models/Story.js";
import User from "../models/User.js";

export const addUserStory = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { content, media_type, background_color } = req.body;
    const media = req.file;
    let media_url = " ";

    //upload media to imagekit
    if (media.type === "image" || media.type === "video") {
      const fileBuffer = fs.readFileSync(media.path);
      const response = await imageKit.upload({
        file: fileBuffer,
        fileName: media.originalname,
      });
      media_url = response.url;
    }

    const story = await Story.create({
      user: userId,
      content,
      media_url,
      media_type,
      background_color,
    });

    // schedule stoory deletion after 24 hours

    await inngest.send({
      name: "app/story.delete",
      data: { storyId: story._id },
    });

    res.json({ success: true, message: "Story added successfully." });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, status: 400, message: error.message });
  }
};

export const getStory = async (req, res) => {
  try {
    const { userId } = req.auth();
    const user = await User.findById(userId);

    const userIds = [userId, ...user.following, ...user.connections];

    const stories = await Story.find({ user: { $in: userIds } })
      .populate("user")
      .sort({ createdAt: -1 });

    res.json({ success: true, stories });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
