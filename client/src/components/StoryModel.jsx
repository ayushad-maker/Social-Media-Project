import { useAuth } from "@clerk/react";
import { ArrowLeft, Sparkle, TextIcon, Upload } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";

const StoryModel = ({ setShowModel, fetchStories }) => {
  const bgColors = [
    "#4f46e5",
    "#7c3aed",
    "#db2777",
    "#e11d48",
    "#ca8a04",
    "#0d9488",
  ];

  const { getToken } = useAuth();
  const [mode, setMode] = useState("text");
  const [background, setBackgroud] = useState(bgColors[0]);
  const [text, setText] = useState("");
  const [media, setMedia] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const MAX_VIDEO_DURATION = 60;
  const MAX_VIDEO_SIZE_MB = 50;

  const handleMediaUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith("video")) {
        if (file.size > MAX_VIDEO_SIZE_MB * 1024 * 1024) {
          toast.error(
            `video file size cannot exceed more than ${MAX_VIDEO_SIZE_MB} MB`,
          );
          setMedia(null);
          setPreviewUrl(null);
          return;
        }

        const video = document.createElement("video");
        video.preload = "metadata";
        video.onloadedmetadata = () => {
          window.URL.revokeObjectURL(video.src);
          if (video.duration > MAX_VIDEO_DURATION) {
            toast.error("Video duration cannot exceed 1 minute.");
            setMedia(null);
            setPreviewUrl(null);
          } else {
            setMedia(file);
            setPreviewUrl(URL.createObjectURL(file));
            setText("");
            setMode("media");
          }
        };
        video.src = URL.createObjectURL(file);
      } else if (file.type.startsWith("image")) {
        setMedia(file);
        setPreviewUrl(URL.createObjectURL(file));
        setText("");
        setMode("media");
      }
    }
  };

  const handleCreateStroy = async () => {
    try {
      const media_type =
        mode === "media"
          ? media?.type.startsWith("image")
            ? "image"
            : "video"
          : "text";

      if (media_type === "text" && !text) {
        throw new Error("Please enter some text");
      }

      let formData = new FormData();
      formData.append("content", text);
      formData.append("media_type", media_type);
      formData.append("media", media);
      formData.append("background_color", background);

      const token = await getToken();
      const { data } = await api.post("/api/stories/create", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setShowModel(false);
        toast.success("Story created successfully.");
        fetchStories();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("Status:", error.response?.status);
      console.log("URL:", error.config?.url);
      console.log("Response:", error.response?.data);
    }
  };

  return (
    <div className="fixed inset-0 z-100 min-h-screen bg-black/80 backdrop-blur text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-4 flex items-center justify-between">
          <button
            onClick={() => setShowModel(false)}
            className="text-white p-2 cursor-pointer"
          >
            <ArrowLeft />
          </button>
          <h2 className="text-lg font-semibold">Create Story</h2>
          <span className="w-10"></span>
        </div>

        <div
          className="rounded-lg h-96 flex items-center justify-center relative"
          style={{ backgroundColor: background }}
        >
          {mode === "text" && (
            <textarea
              className="bg-transparent text-white w-full h-full p-6 text-lg resize-none focus:outline-none"
              placeholder="what's on your point"
              onChange={(e) => setText(e.target.value)}
              value={text}
            />
          )}

          {mode === "media" &&
            previewUrl &&
            (media?.type.startsWith("image") ? (
              <img
                src={previewUrl}
                alt=""
                className="object-contain max-h-full "
              />
            ) : (
              <video src={previewUrl} className="object-contain max-h-full" />
            ))}
        </div>

        <div>
          {bgColors.map((color, index) => (
            <button
              key={index}
              className="w-8 h-8 rounded-full m-1 cursor-pointer border-2 border-white"
              style={{ backgroundColor: color }}
              onClick={() => setBackgroud(color)}
            />
          ))}
        </div>

        <div className="flex gap-2 mt-4">
          <button
            onClick={() => {
              setMode("text");
              setMedia(null);
              setPreviewUrl(null);
            }}
            className={`flex flex-1 items-center justify-center gap-2 p-2 rounded cursor-pointer ${mode === "text" ? "bg-white text-black" : "bg-zinc-800"}`}
          >
            <TextIcon size={18} /> Text
          </button>

          <label
            className={`flex flex-1 items-center justify-center gap-2 p-2 rounded cursor-pointer ${mode === "media" ? "bg-white text-black" : "bg-white text-zinc-800"}`}
          >
            <input
              onChange={handleMediaUpload}
              type="file"
              accept="image/*, video/*"
              className="hidden"
            />{" "}
            <Upload />
            Photo/Video
          </label>
        </div>

        <button
          onClick={() =>
            toast.promise(handleCreateStroy(), {
              loading: "Saving...",
              success: "Story created successfully!",
              error: (err) => err.message,
            })
          }
          className="flex items-center justify-center gap-2 text-white py-3 mt-4 w-full rounded bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 active:scale-95 transition cursor-pointer"
        >
          <Sparkle /> Create Story
        </button>
      </div>
    </div>
  );
};

export default StoryModel;
