"use server"

import { getCloudflareContext } from "@opennextjs/cloudflare"
import { DeviceConfig, GlobalConfig, DEFAULT_GLOBAL_CONFIG } from "@/types/iot"
import { revalidatePath } from "next/cache"

const PREFIX_DEVICE = "device:"
const KEY_GLOBAL_CONFIG = "config:global"
const KEY_CURRENT_DEVICE_ID = "state:currentDeviceId"

export async function getGlobalConfig(): Promise<GlobalConfig> {
  const { env } = await getCloudflareContext()
  const val = await env.YOU.get(KEY_GLOBAL_CONFIG)
  if (!val) return DEFAULT_GLOBAL_CONFIG
  try {
    return JSON.parse(val)
  } catch (e) {
    return DEFAULT_GLOBAL_CONFIG
  }
}

export async function updateGlobalConfig(config: GlobalConfig) {
  const { env } = await getCloudflareContext()
  await env.YOU.put(KEY_GLOBAL_CONFIG, JSON.stringify(config))
  revalidatePath("/settings")
  return { success: true }
}

export async function getDevices(): Promise<DeviceConfig[]> {
  const { env } = await getCloudflareContext()
  const list = await env.YOU.list({ prefix: PREFIX_DEVICE })
  const devices: DeviceConfig[] = []
  for (const key of list.keys) {
    const val = await env.YOU.get(key.name)
    if (val) {
      try {
        devices.push(JSON.parse(val))
      } catch (e) {
        console.error(`Failed to parse device config for ${key.name}:`, e)
      }
    }
  }
  return devices
}

export async function getDevice(id: string): Promise<DeviceConfig | null> {
  const { env } = await getCloudflareContext()
  const val = await env.YOU.get(`${PREFIX_DEVICE}${id}`)
  if (!val) return null
  try {
    return JSON.parse(val)
  } catch (e) {
    return null
  }
}

export async function saveDevice(device: DeviceConfig) {
  const { env } = await getCloudflareContext()
  const key = `${PREFIX_DEVICE}${device.id}`
  const existing = await env.YOU.get(key)
  let toSave = { ...device }
  
  if (!existing) {
    toSave.createdAt = new Date().toISOString()
  } else {
    // Preserve createdAt if it exists in the storage
    try {
      const parsedExisting = JSON.parse(existing)
      toSave.createdAt = parsedExisting.createdAt || new Date().toISOString()
    } catch (e) {
      toSave.createdAt = new Date().toISOString()
    }
  }

  await env.YOU.put(key, JSON.stringify(toSave))
  revalidatePath("/devices")
  return { success: true }
}

export async function deleteDevice(id: string) {
  const { env } = await getCloudflareContext()
  await env.YOU.delete(`${PREFIX_DEVICE}${id}`)
  
  // If current device is deleted, clear it
  const current = await env.YOU.get(KEY_CURRENT_DEVICE_ID)
  if (current === id) {
    await env.YOU.delete(KEY_CURRENT_DEVICE_ID)
  }

  revalidatePath("/devices")
  return { success: true }
}

export async function getCurrentDeviceId(): Promise<string | null> {
  const { env } = await getCloudflareContext()
  return await env.YOU.get(KEY_CURRENT_DEVICE_ID)
}

export async function setCurrentDeviceId(id: string | null) {
  const { env } = await getCloudflareContext()
  if (id) {
    await env.YOU.put(KEY_CURRENT_DEVICE_ID, id)
  } else {
    await env.YOU.delete(KEY_CURRENT_DEVICE_ID)
  }
  return { success: true }
}
