const express = require('express');
const { UserAuth } = require("../Middlewares/auth");
const { validateUpdateData } = require("../utils/validator");
const bcrypt = require("bcrypt");
const validator = require("validator");


const profileRouter = express.Router();

profileRouter.get('/profile/view', UserAuth, async (req,res) =>{
     
    const user = req.user;
    try{ 
    res.send(user);
    } 
    catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }  
});

profileRouter.patch('/profile/edit', UserAuth, async (req,res) =>{

    try{

        if(!validateUpdateData(req.body)){
        throw new Error("Invalid Update Fields")};

        const loggedInUser = req.user;

        Object.keys(req.body).forEach((key) => {
            loggedInUser[key] = req.body[key];
        });

        await loggedInUser.save();

        res.json({message:`${loggedInUser.firstName}'s profile updated successfully`, data : loggedInUser});
    }
    catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

profileRouter.patch('/profile/updatePassword', UserAuth, async (req,res) =>{

    try{

        const loggedInUser = req.user;
        const { oldPassword, newPassword } = req.body;

        const isMatch = await bcrypt.compare(oldPassword, loggedInUser.password);
        if(!isMatch){
            throw new Error("Old Password is incorrect");
        }
        if(!newPassword || !validator.isStrongPassword(newPassword)){
            throw new Error("Please enter a strong Password");
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        loggedInUser.password = hashedPassword;
        await loggedInUser.save();

        res.json({message:`${loggedInUser.firstName}'s password updated successfully`});
    }
    catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

module.exports = profileRouter;