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

ConnectionRequestSchema.pre("save", function () {
    if (this.fromID.equals(this.toID)) {
        throw new Error("A user cannot send a connection request to themselves.");
    }
});




const ConnectionRequestModel = mongoose.model('ConnectionRequest', ConnectionRequestSchema);

module.exports = ConnectionRequestModel;