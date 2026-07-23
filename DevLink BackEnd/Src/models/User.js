const mongoose = require("mongoose");
const validator = require("validator");
const jwt =  require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 50,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address: " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter a Strong Password: " + value);
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
  type: String,
  lowercase: true,
  enum: ["male", "female", "confused"],
  default: "male",
    },
    photoUrl: {
      type: String,
      default: "https://geographyandyou.com/images/user-profile.png",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid Photo URL: " + value);
        }
      },
    },
    about: {
      type: String,
      default: "This is a default about of the user!",
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJWT = function(){
  const user = this;
  // use the secret from environment so it stays in sync with verification
  const secret = process.env.JWT_SECRET || "fallbackSecret";
  const token = jwt.sign({ _id : user._id }, secret, { expiresIn: '7d' });
  return token;
}

userSchema.methods.validatePassword = async function(InputPassword){
  const user = this;
  const passwordHash = user.password;
   return await bcrypt.compare(InputPassword,passwordHash);  
}

module.exports = mongoose.model("User", userSchema);