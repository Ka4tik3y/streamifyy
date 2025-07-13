import { StreamChat } from "stream-chat";
import dotenv from "dotenv";
dotenv.config();
const apikey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if (!apikey || !apiSecret) {
  throw new Error("Stream API key and secret are missing");
}
const streamClient = StreamChat.getInstance(apikey, apiSecret);

export const createStreamUser = async (userData) => {
  try {
    await streamClient.upsertUser({
      id: userData.id,
      name: userData.name,
      image: userData.image,
    });
    return userData;
  } catch (error) {
    console.error("Error creating Stream user:", error);
  }
};

export const generateStreamToken = async (userId) => {
  try {
    const userIdStr = userId.toString();
    if (!userId) {
      throw new Error("User ID is required to generate Stream token");
    }
    const token = streamClient.createToken(userIdStr);
    return token;
  } catch (error) {
    console.error("Error generating Stream token:", error);
    throw new Error("Failed to generate Stream token");
  }
};
