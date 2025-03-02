import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { findUserByEmail } from "../../database/fetch";
import { createToken } from "../../utils/jwt";
import { setCookie } from "../../utils/cookies";

export const handleAuthLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }

    const token = createToken(user);
    setCookie(res, token);

    const { password: _, ...userData } = user;
    return res.json({ user: userData });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
}; 