import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/mail.service.js";



/**
 * @desc Register a new user
 * @route POST /api/auth/register
 * @access Public
 * @body { username, email, password }
 */
export async function register(req, res) {
  try {
    const { username, email, password } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();
    const normalizedUsername = username?.trim();

    const isUserAlreadyExists = await userModel.findOne({
      $or: [{ email: normalizedEmail }, { username: normalizedUsername }],
    });

    if (isUserAlreadyExists) {
      return res.status(400).json({
        message: "User with this email or username already exists",
        success: false,
        err: "User already exists",
      });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        message: "Server configuration error",
        success: false,
        err: "JWT secret is missing",
      });
    }

    const user = await userModel.create({
      username: normalizedUsername,
      email: normalizedEmail,
      password,
    });

    const emailVerificationToken = jwt.sign(
      {
        email: user.email,
        type: "email-verification",
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    try {
      await sendEmail({
        to: normalizedEmail,
        subject: "Welcome to Perplexity!",
        html: `
                <p>Hi ${username},</p>
                <p>Thank you for registering at <strong>Perplexity</strong>. We're excited to have you on board!</p>
                <p>Please verify your email address by clicking the link below:</p>
                  <a href="http://localhost:3000/api/auth/verify-email?token=${emailVerificationToken}">Verify Email</a>
                <p>If you did not create an account, please ignore this email.</p>
                <p>Best regards,<br>The Perplexity Team</p>
               
        `,
      });
    } catch (mailError) {
      console.error("Verification email failed to send:", mailError);
      await user.deleteOne();
      return res.status(500).json({
        message: "Registration failed because the verification email could not be sent",
        success: false,
        err: "Verification email failed",
      });
    }

    return res.status(201).json({
      message: "User registered successfully. Please verify your email before logging in",
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Registration failed:", err);
    return res.status(500).json({
      message: err.message || "Registration failed",
      success: false,
      err: "Registration error",
    });
  }
}

export async function verifyEmail(req, res) {
  const { token } = req.query;
  if (!token) {
    return res.status(400).json({
      message: "Missing verification token",
      verified: false,
      err: "token missing",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.type && decoded.type !== "email-verification") {
      return res.status(400).json({
        message: "Invalid verification token",
        verified: false,
        err: "token type mismatch",
      });
    }

    const user = await userModel.findOne({ email: decoded.email });
    if (!user) {
      return res.status(400).json({
        message: "No account found for this verification link",
        verified: false,
        err: "user not found",
      });
    }
    if (user.verified) {
      return res.send(
        `<h1>Email already verified</h1>
        <p>Your email is already verified. You can log in to your account.</p>
        `,
      );
    }
    user.verified = true;

    await user.save();

    return res.send(
      `<h1>Email verified successfully</h1>
        <p>your email has been verified.you can now  log in to your account</p>
        `,
    );
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(400).json({
        message: "Verification link expired",
        verified: false,
        err: "token expired",
      });
    }

    return res.status(400).json({
      message: "Invalid verification token",
      verified: false,
      err: "token verification failed",
    });
  }
}
/**
 * @desc login a user
 * @route POST /api/auth/login
 * @access Public
 * @body { email, password }
 */
export async function login(req, res) {
  const { email, password } = req.body;
  const normalizedEmail = email?.trim().toLowerCase();
  const user = await userModel.findOne({ email: normalizedEmail });
  if (!user) {
    return res.status(400).json({
      message: "invalid email or password",
      success: false,
      err: "user not found",
    });
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return res.status(400).json({
      message: "invalid email or password",
      success: false,
      err: "Incorrect password",
    });
  }
  if (!user.verified) {
    return res.status(400).json({
      message: "please verify your email before logging in",
      success: false,
      err: "Email not verifies",
    });
  }
  const token = jwt.sign(
    {
      id: user._id,
      username: user.username,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );
   res.cookie("token", token);

  res.status(200).json({
    message: "user logged in successully",
    success: true,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
    },
  });
}
/**
 * @desc getme user data
 * @route POST /api/auth/get-me
 * @access Public
 * @body { username,email, password }
 */
export async function getMe(req,res){
  const userId=req.user.id
  const user=await userModel.findById(userId).select("-password")
  if(!user){
    return res.status(404).json({
      message:"User not found",
      success:false,
      err:"No user found with this id"
    })
  }
  return res.status(200).json({ 
    message:"User data fetched successfully",
    success:true,
    user
  })

}
