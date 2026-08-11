const express = require("express");
const { UserAuth } = require("../Middlewares/auth");
const Chat = require("../models/Chat");
const User = require("../models/User");
const ConnectionRequest = require("../models/ConnectRequest");

const chatRouter = express.Router();

chatRouter.get("/chat", UserAuth, async (req, res) => {
  try {
    const userId = req.user._id;

    // Find all chats containing the current user
    const chats = await Chat.find({
      participants: userId
    }).populate("participants", "firstName lastName photoUrl about skills");

    // Extract the other participant from each chat
    const people = chats
      .map(chat => {
        return chat.participants.find(
          participant => participant._id.toString() !== userId.toString()
        );
      })
      .filter(Boolean);

    // Deduplicate people (safety filter in case of multiple chat documents per pair)
    const seen = new Set();
    const uniquePeople = people.filter(person => {
      const idStr = person._id.toString();
      if (seen.has(idStr)) {
        return false;
      }
      seen.add(idStr);
      return true;
    });

    res.status(200).json(uniquePeople);
  } catch (err) {
    res.status(500).json({ message: "Error fetching chat list: " + err.message });
  }
});

chatRouter.get("/chat/:targetUserId", UserAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    const { targetUserId } = req.params;
    console.log("GET /chat/:targetUserId hit. loggedInUser =", userId, "targetUserId =", targetUserId);

    // Check if target user exists
    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ message: "Target user not found" });
    }

    // Verify if users are connected
    const areConnected = await ConnectionRequest.areConnected(userId, targetUserId);
    if (!areConnected) {
      return res.status(400).json({ message: "Users are not connected" });
    }

    // Find chat
    let chat = await Chat.findOne({
      participants: { $all: [userId, targetUserId] }
    })
    .populate("participants", "firstName lastName photoUrl")
    .populate("messages.senderId", "firstName lastName photoUrl");

    // If chat doesn't exist, create an empty chat
    if (!chat) {
      chat = new Chat({
        participants: [userId, targetUserId],
        messages: []
      });
      await chat.save();
      // Populate newly created chat before returning
      chat = await Chat.findById(chat._id)
        .populate("participants", "firstName lastName photoUrl")
        .populate("messages.senderId", "firstName lastName photoUrl");
    }

    res.status(200).json(chat);
  } catch (err) {
    res.status(500).json({ message: "Error fetching chat: " + err.message });
  }
});

module.exports = chatRouter;
