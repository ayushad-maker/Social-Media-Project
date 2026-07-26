import fs from "fs";
import imageKit from "../config/imagekit.js";
import Story from "../models/Story";

export const addUserStory = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { content, media_type, background_color } = req.body;
    const media = req.file;
    let media_url = " ";

    //upload media to imagekit
    if (media.type == "image" || media.type == "video") {
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

    res.json({success:true,message:"Story added successfully."})
  } catch (error) {
    console.log(error);
    return res.json({ success: false, status: 400, message: error.message });
  }
};
