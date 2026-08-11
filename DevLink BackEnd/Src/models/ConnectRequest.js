const mongoose = require("mongoose");

const ConnectionRequestSchema = new mongoose.Schema({

    fromID:{
        type : mongoose.Schema.Types.ObjectId,
        required: true,
        ref : 'User',
    },
    toID:{
        type : mongoose.Schema.Types.ObjectId,
        required: true,
        ref : 'User',
    },
    status:{
        type: String,
        enum: { values : [ 'interested' , 'ignored' , 'accepted', 'rejected'],
                message: '{VALUE} is not a valid status'
        },

        required: true,
    },
},
{ timestamps: true, } );


ConnectionRequestSchema.index({ fromID: 1, toID: 1 }, { unique: true });

ConnectionRequestSchema.statics.areConnected = async function (userId, targetUserId) {
    try {
        console.log("areConnected check: userId =", userId, "targetUserId =", targetUserId);
        const userObjId = new mongoose.Types.ObjectId(userId.toString());
        const targetObjId = new mongoose.Types.ObjectId(targetUserId.toString());
        
        const connection = await this.findOne({
            $or: [
                { fromID: userObjId, toID: targetObjId, status: 'accepted' },
                { fromID: targetObjId, toID: userObjId, status: 'accepted' }
            ]
        });
        console.log("areConnected result:", !!connection);
        return !!connection;
    } catch (err) {
        console.error("Error in areConnected casting:", err);
        return false;
    }
};

ConnectionRequestSchema.pre("save", function () {
    if (this.fromID.equals(this.toID)) {
        throw new Error("A user cannot send a connection request to themselves.");
    }
});




const ConnectionRequestModel = mongoose.model('ConnectionRequest', ConnectionRequestSchema);

module.exports = ConnectionRequestModel;