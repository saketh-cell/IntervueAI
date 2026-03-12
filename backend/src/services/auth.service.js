const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const generateToken = require("../utils/generateToken");
const sendEmail = require("../utils/sendEmail");
const { welcomeEmail } = require("../utils/emailTemplates");

const registerUser = async (name, email, password) => {
  const userExists = await User.findOne({ email });

  if (userExists) throw new Error("User already registered");

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const loginUrl = `${process.env.CLIENT_URL}/login`;
  const forgotUrl = `${process.env.CLIENT_URL}/forgot-password`;

  try {
    await sendEmail({
      to: user.email,
      subject: "Welcome to InterviewIQ",
      html: welcomeEmail(user.name, loginUrl, forgotUrl),
    });
  } catch (emailError) {
    console.error("Welcome email failed:", emailError.message);
  }

  const token = generateToken(user._id);

  return {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
    token,
  };
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) throw new Error("Invalid email or password");

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) throw new Error("Invalid email or password");

  const token = generateToken(user._id);

  return {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
    token,
  };
};

module.exports = { registerUser, loginUser };