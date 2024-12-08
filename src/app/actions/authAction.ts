"use server";

import bcrypt from "bcrypt";
import { prisma } from "../../lib/client";
import { generateAccessToken, verifyToken } from "@/lib/jwt";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function loginAction({
  username,
  password,
}: {
  username: string;
  password: string;
}) {
  const user = await prisma.user.findUnique({
    where: { username },
    include: { companies: true },
  });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error("Invalid username or password");
  }

  const accessToken = generateAccessToken({
    id: user.id,
    role: user.role,
    company: user.companies,
  });

  const cookieStore = await cookies();
  cookieStore.set("access_token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 15,
  });

  return { success: true, user: { id: user.id, role: user.role } };
}

export async function getUser() {
  "use server";
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  const decoded = verifyToken(accessToken as string);
  if (decoded && typeof decoded === "object" && decoded.id && decoded.role) {
    return {
      id: decoded.id,
      role: decoded.role,
    };
  }
}

export const logout = async () => {
  const cookieStore = await cookies();

  cookieStore.set("access_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: -1,
  });

  return { success: true, message: "Logged out successfully" };
};
