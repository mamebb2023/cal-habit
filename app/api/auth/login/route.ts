import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "@/lib/mongoose";
import User from "@/models/user.model"; // Assume you have a User model in MongoDB

// Secret key for JWT (use environment variables in production)
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json(); // Use req.json() to parse the request body

  if (!email || !password) {
    return NextResponse.json(
      { message: "Email and password are required" },
      { status: 400 }
    );
  }

  // Connect to the database
  await connectToDatabase();

  // Find the user by email
  const user = await User.findOne({ email });

  if (!user) {
    return NextResponse.json(
      { message: "Invalid email or password" },
      { status: 401 }
    );
  }

  // Compare the password with the hashed password stored in the database
  const isPasswordValid = password === user.password;

  if (!isPasswordValid) {
    return NextResponse.json(
      { message: "Invalid email or password" },
      { status: 401 }
    );
  }

  // Create a JWT token (you can also include user info like the user ID)
  const token = jwt.sign(
    user.toJSON(), // User info
    JWT_SECRET,
    { expiresIn: "3d" } // Token expiration time (3 day)
  );

  // Set the token in a cookie (optional, for added security)
  const headers = new Headers();
  headers.set(
    "Set-Cookie",
    `token=${token}; Path=/; HttpOnly; Max-Age=${60 * 60 * 24 * 3}; SameSite=Strict`
  );

  // Respond with the token
  return NextResponse.json({ message: "Login successful", token }, { headers });
}
