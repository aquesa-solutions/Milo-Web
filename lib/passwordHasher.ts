"use server";

import * as argon2 from "argon2";

export default async function passwordHasher(password: string): Promise<{
  ok: false
} | {
  ok: true,
  password: string
}> {
  try {
    const hashedPassword = await argon2.hash(
      password, {
        type: argon2.argon2id,
        memoryCost: 65536,
        timeCost: 3,
        parallelism: 4
      }
    )

    return {
      ok: true,
      password: hashedPassword
    }
  } catch (error) {
    console.error("Error hashing password:", error)

    return {
      ok: false
    }
  }
}