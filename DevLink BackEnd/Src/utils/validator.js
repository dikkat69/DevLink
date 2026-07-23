const validator = require("validator");

const validateSignupData = (data) => {
  const { firstName, lastName, emailId, password } = data;

  if (!firstName || firstName.length < 4 || firstName.length > 50) {
    throw new Error("First Name is invalid");
  } 
  if (!validator.isEmail(emailId)) {
    throw new Error("Email is invalid");
  } 
  if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong Password");
  }
};

const validateUpdateData = (data) => {

  const allowedFields = ["firstName", "lastName", "age", "gender", "about","photoUrl", "skills"];

  const isEditAllowed = Object.keys(data).every((field) => allowedFields.includes(field));

  return isEditAllowed;
};

module.exports = { validateSignupData , validateUpdateData };