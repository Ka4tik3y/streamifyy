import User from "../models/User.model.js";
import FriendRequest from "../models/Friend.model.js";

export async function getRecommendedUsers(req, res) {
  try {
    const currentUserId = req.user._id;
    const currentUser = req.user;
    const recommendedUser = await User.find({
      $and: [
        { _id: { $ne: currentUserId } },
        { _id: { $nin: currentUser.friends } },
        { isOnboarded: true },
      ],
    });
    res.status(200).json({
      message: "Recommended users fetched successfully",
      recommendedUsers: recommendedUser,
    });
  } catch (error) {
    console.log("Error in fetching recommended users:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getMyFriends(req, res) {
  try {
    const currentUserId = req.user._id;
    const currentUser = await User.findById(currentUserId)
      .select("friends")
      .populate(
        "friends",
        "fullName profilePicture nativeLanguage learningLanguage"
      );

    res.status(200).json({
      message: "Friends fetched successfully",
      friends: currentUser.friends,
    });
  } catch (error) {
    console.log("Error in fetching friends:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function sendFriendRequest(req, res) {
  try {
    const myId = req.user._id;
    const { id: friendId } = req.params;

    if (myId === friendId) {
      return res
        .status(400)
        .json({ message: "You cannot send a friend request to yourself" });
    }

    const recipient = await User.findById(friendId);
    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found" });
    }

    if (recipient.friends.includes(myId)) {
      return res
        .status(400)
        .json({ message: "You are already friends with this user" });
    }

    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: myId, recipient: friendId },
        { sender: friendId, recipient: myId },
      ],
    });

    if (existingRequest) {
      return res.status(400).json({ message: "Friend request already sent" });
    }

    const friendRequest = await FriendRequest.create({
      sender: myId,
      recipient: friendId,
    });

    return res.status(201).json({
      message: "Friend request sent successfully",
      friendRequest,
    });
  } catch (error) {
    console.error("Error in sending friend request:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function acceptFriendRequest(req, res) {
  try {
    const { id: requestId } = req.params;
    const request = await FriendRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: "Friend request not found" });
    }
    if (request.recipient.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to accept this request" });
    }

    request.status = "accepted"; // ✅ FIXED
    await request.save();

    await User.findByIdAndUpdate(request.sender, {
      $addToSet: { friends: request.recipient },
    });
    await User.findByIdAndUpdate(request.recipient, {
      $addToSet: { friends: request.sender },
    });

    res.status(200).json({
      message: "Friend request accepted successfully",
    });
  } catch (error) {
    console.error("Error in accepting friend request:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
}


export async function getFriendRequests(req, res) {
  try {
    const incomingRequests = await FriendRequest.find({
      recipient: req.user.id,
      status: "pending",
    }).populate("sender", "fullName profilePicture nativeLanguage learningLanguage");

    const acceptedRequests = await FriendRequest.find({
      sender: req.user.id,
      status: "accepted",
    }).populate("recipient", "fullName profilePicture");

    res.status(200).json({
      incomingRequests,
      acceptedRequests,
    });
  } catch (error) {
    console.log("Error in getFriendRequests controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}


export async function getOutgoingFriendRequests(req, res) {
  try {
    const outgoingRequests = await FriendRequest.find({
      sender: req.user._id,
      status: "pending",
    }).populate(
      "recipient",
      "fullName profilePicture nativeLanguage learningLanguage"
    );
    res.status(200).json({
      message: "Outgoing friend requests fetched successfully",
      outgoingRequests,
    });
  } catch (error) {
    console.log("Error in fetching outgoing friend requests:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
