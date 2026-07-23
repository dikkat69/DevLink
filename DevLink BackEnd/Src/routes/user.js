const express = require('express');
const ConnectionRequest = require("../models/ConnectRequest");
const { UserAuth } = require("../Middlewares/auth");
const User = require('../models/User');

const userRouter = express.Router();

const USER_SAFE_FIELDS = ["firstName", "lastName", "age","gender","photoUrl", "about","skills"];

userRouter.get('/user/requests/received', UserAuth, async (req, res) => {

    try{
        const loggedUser = req.user;

        const receivedRequests = await ConnectionRequest.find({
            toID: loggedUser._id,
            status: 'interested',
        }).populate("fromID", USER_SAFE_FIELDS);

        res.json({ message : "Data Fetched Successfully ",data :receivedRequests });

    }
    catch (err) {
    res.status(400).json({ message: "ERROR : " + err.message });
  }

});

userRouter.get('/user/connections', UserAuth, async (req, res) => {

    try{
        const loggedUser = req.user;

        const connections = await ConnectionRequest.find({
            $or: [
                { fromID: loggedUser._id, status: 'accepted' },
                { toID: loggedUser._id, status: 'accepted' }
            ]
        }).populate("fromID",USER_SAFE_FIELDS).populate("toID",USER_SAFE_FIELDS);

        const data = connections.map((rows) => {
            if(rows.fromID._id.toString() === loggedUser._id.toString()) {
                return rows.toID;
            }
            return rows.fromID;
        });

        res.json({ message : "Data Fetched Successfully ",data });
    }
    catch (err) {
    res.status(400).json({ message: "ERROR : " + err.message });
  }
});

userRouter.get('/feed', UserAuth, async (req, res) => {

    try{
        const loggedUser = req.user;

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit > 50 ? limit = 50 : limit;

        const skip = (page - 1) * limit;

        const connections = await ConnectionRequest.find({
            $or: [
                { fromID: loggedUser._id,},
                { toID: loggedUser._id, }
            ]
        })

        const hideUsersfromFeed = new Set();

        hideUsersfromFeed.add(loggedUser._id.toString());

        connections.forEach((req) =>{
            hideUsersfromFeed.add(req.fromID.toString());
            hideUsersfromFeed.add(req.toID.toString());
            
        });
        
        const users = await User.find({
            _id: { $nin: Array.from(hideUsersfromFeed) }
        }).select(USER_SAFE_FIELDS)
        .skip(skip)
        .limit(limit);

        res.json({ message : "Feed Fetched Successfully ",data : users});
    }
    catch (err) {
    res.status(400).json({ message: "ERROR : " + err.message });
  }
});

module.exports = userRouter;