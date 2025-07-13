import { generateStreamToken } from "../lib/stream.js";
export async function getStreamToken(req, res) {
  try {
    const userId = req.user._id;
    const token = await generateStreamToken(userId);
    res.status(200).json({ token });
  } catch (error) {
    console.log("Error in generating stream token:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
