import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'

// キャッシュ用の変数
let cachedVrmFiles: string[] | null = null
let cacheTimestamp: number = 0
const CACHE_DURATION = 60000 // 1分間キャッシュ

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // キャッシュが有効な場合はキャッシュを返す
  const now = Date.now()
  if (cachedVrmFiles && now - cacheTimestamp < CACHE_DURATION) {
    res.setHeader('Cache-Control', 'public, max-age=60')
    return res.status(200).json(cachedVrmFiles)
  }

  const vrmDir = path.join(process.cwd(), 'public/vrm')

  try {
    if (!fs.existsSync(vrmDir)) {
      return res.status(404).json({ error: 'VRM directory not found' })
    }
    const files = await fs.promises.readdir(vrmDir)
    const vrmFiles = files.filter((file) => file.endsWith('.vrm'))

    // キャッシュを更新
    cachedVrmFiles = vrmFiles
    cacheTimestamp = now

    res.setHeader('Cache-Control', 'public, max-age=60')
    res.status(200).json(vrmFiles)
  } catch (error) {
    console.error('Error reading VRM directory:', error)
    res.status(500).json({
      error: 'Failed to get VRM file list',
    })
  }
}
