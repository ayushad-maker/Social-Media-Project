import fs from "fs";
import imageKit from "../config/imagekit";
import Message from "../models/Message";
//create an empty object to store server side event connections
const connections = {};

// Controller function for the SSE endpoint
export const sseController = (req, res) => {
  const { userId } = req.params;
  console.log("New client connected: ", userId);

  //set SSE headers
  res.setHeaders("Content-type", "text/event-stream");
  res.setHeaders("Cache-Control", "no-cache");
  res.setHeaders("Connection", "keep-alive");
  res.setHeaders("Access-Control-Allow-Origin", "*");

  //Add the Client's response object to the connections object
  connections[userId] = res;

  //send an initial event to the client
  res.write("log: Connected to SSE stream\n\n");

  //Handle client disconnection
  req.on("Close", () => {
    //Remove the client's response object from the connections array
    delete connections[userId];
    console.log("Client disconnected");
  });
};

export const sendMessage = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { to_user_id, text } = req.body;
    const image = req.file;

    const media_url = "";

    const media_type = image ? "image" : "text";

    if (media_type === "image") {
      const fileBuffer = fs.readFileSync(image.path);
      const response = await imageKit.upload({
        file: fileBuffer,
        fileName: image.originalname,
      });

      media_url = imageKit.url({
        path: response.filePath,
        transformation: [
          { quality: "auto" },
          { format: "webp" },
          { width: "1280" },
        ],
      });
    }

    const message = await Message.create({
      from_user_id: userId,
      to_user_id,
      message_type,
      text,
      media_url,
    });

    res.json({ success: true, message });
    //send message to_user_id using SSE

    const messageWithUserData = await Message.findById(message._id).populate(
      "from_user_id",
    );

    if (connections[to_user_id]) {
      connections[to_user_id].write(
        `data: ${JSON.stringify(messageWithUserData)}\n\n`,
      );
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, status: 400, message: error.message });
  }
};
