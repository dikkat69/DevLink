const express = require("express");
const { UserAuth } = require("../Middlewares/auth");
const UserModel = require("../models/User");
const ConnectionRequest = require("../models/ConnectRequest");



const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:userId",
  UserAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.userId;
      const status = req.params.status;

      const validStatuses = ["interested", "ignored"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status value." });
      }

      if (fromUserId.toString() === toUserId) {
        return res.status(400).json({ message: "You cannot send request to yourself." });
      }

      const toUser = await UserModel.findById(toUserId);
      if (!toUser) {
        return res.status(404).json({ message: "User not found." });
      }

      const existingRequest = await ConnectionRequest.findOne({
        $or: [
                { fromID: fromUserId, toID: toUserId },
                { fromID: toUserId, toID: fromUserId },
             ],
        });


      if (existingRequest) {
        return res
          .status(400)
          .json({ message: "Connection request already exists." });
      }

      const connectionRequest = new ConnectionRequest({
            fromID: fromUserId,
            toID: toUserId,
            status,
       });

    const statusMessages = {
    interested: "Connection request sent successfully",
    ignored: "User has been ignored successfully",
    };

await connectionRequest.save();

    res.status(201).json({
    message: statusMessages[status],
        data: connectionRequest,
});

    } catch (err) {
      res.status(500).json({
        message: "Error sending connection request",
        error: err.message,
      });
    }
  }
);

requestRouter.post("/request/review/:status/:requestId", UserAuth, async(req, res) => {
  try {
    const loggedUser = req.user; 
    const { status, requestId } = req.params;
    const allowedStatus = ["accepted", "rejected"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Status not allowed!" });
    }

    const connectionRequest = await ConnectionRequest.findOne({ 
      _id: requestId,
      toID: loggedUser._id, 
      status: "interested" 
    });

    if (!connectionRequest) {
      return res.status(404).json({ message: "Connection Request not Found!" }); 
    }

    connectionRequest.status = status;

    const data = await connectionRequest.save(); 

    res.json({ message: "Connection request " + status, data });
  }
  catch (err) {
    res.status(500).json({ message: "Error: " + err.message });
  }
});

module.exports = requestRouter;