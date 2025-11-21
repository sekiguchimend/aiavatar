import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'

// キャッシュ用の変数
let cachedBackgrounds: string[] | null = null
let cacheTimestamp: number = 0
const CACHE_DURATION = 60000 // 1分間キャッシュ

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // キャッシュが有効な場合はキャッシュを返す
  const now = Date.now()
  if (cachedBackgrounds && now - cacheTimestamp < CACHE_DURATION) {
    res.setHeader('Cache-Control', 'public, max-age=60')
    return res.status(200).json(cachedBackgrounds)
  }

  try {
    const backgroundsDir = path.join(process.cwd(), 'public/backgrounds')

    if (!fs.existsSync(backgroundsDir)) {
      fs.mkdirSync(backgroundsDir, { recursive: true })
      cachedBackgrounds = []
      cacheTimestamp = now
      res.setHeader('Cache-Control', 'public, max-age=60')
      return res.status(200).json([])
    }

    const files = fs.readdirSync(backgroundsDir)
    const imageFiles = files.filter((file) => {
      const extension = path.extname(file).toLowerCase()
      return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(extension)
    })

    // キャッシュを更新
    cachedBackgrounds = imageFiles
    cacheTimestamp = now

    res.setHeader('Cache-Control', 'public, max-age=60')
    res.status(200).json(imageFiles)
  } catch (error) {
    console.error('Error fetching background list:', error)
    res.status(500).json({ error: 'Failed to fetch background list' })
  }
}
