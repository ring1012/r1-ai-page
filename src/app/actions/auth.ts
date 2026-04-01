"use server"

import { getCloudflareContext } from "@opennextjs/cloudflare"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { hashPassword, verifyPassword } from "@/lib/crypto"

const AUTH_COOKIE = "r1-auth-token"
const KEY_PASSWORD_HASH = "auth:password_hash"
const DEFAULT_PASSWORD = "admin" // Plain default

export async function login(password: string) {
  const { env } = await getCloudflareContext()
  
  // Try to get hash from KV
  let storedHash = await env.YOU.get(KEY_PASSWORD_HASH)
  
  if (!storedHash) {
    // Check if there's an old plain password still there
    const oldPlain = await env.YOU.get("auth:password")
    if (oldPlain) {
      // Migrate it now!
      storedHash = await hashPassword(oldPlain)
      await env.YOU.put(KEY_PASSWORD_HASH, storedHash)
      await env.YOU.delete("auth:password")
    } else {
      // Use default hash
      storedHash = await hashPassword(DEFAULT_PASSWORD)
    }
  }

  const isValid = await verifyPassword(password, storedHash)

  if (isValid) {
    const c = await cookies()
    c.set(AUTH_COOKIE, "authorized-session-id-" + Date.now(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })
    return { success: true }
  }

  return { success: false, message: "密码错误" }
}

export async function logout() {
  const c = await cookies()
  c.delete(AUTH_COOKIE)
  redirect("/login")
}

export async function checkAuth() {
  const c = await cookies()
  return !!c.get(AUTH_COOKIE)
}

/**
 * Initialize or reset the password in KV
 */
export async function initializePassword(password: string) {
  const { env } = await getCloudflareContext()
  const hash = await hashPassword(password)
  await env.YOU.put(KEY_PASSWORD_HASH, hash)
  return { success: true, message: "密码设置完成 (已加密)" }
}

/**
 * Update password for authenticated users
 */
export async function updatePassword(newPassword: string) {
  if (!(await checkAuth())) {
    return { success: false, message: "未授权" }
  }
  
  if (newPassword.length < 8) {
    return { success: false, message: "密码长度至少为 8 位" }
  }

  const { env } = await getCloudflareContext()
  const hash = await hashPassword(newPassword)
  await env.YOU.put(KEY_PASSWORD_HASH, hash)
  
  // Optional: logout after change
  // const c = await cookies()
  // c.delete(AUTH_COOKIE)
  
  return { success: true, message: "密码修改成功" }
}
