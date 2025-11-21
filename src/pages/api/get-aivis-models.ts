import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

interface AivisModel {
  uuid: string
  name: string
  description?: string
  creator_name?: string
  tags?: string[]
  voice_timbre?: string
  category?: string
}

interface AivisModelsResponse {
  models: AivisModel[]
  total: number
  page: number
  limit: number
}

type Data = AivisModelsResponse | { error: string }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const {
    keyword = '',
    tags = [],
    categories = [],
    voice_timbres = [],
    license_types = [],
    sort = 'download',
    page = 1,
    limit = 24,
  } = req.query

  const apiUrl = 'https://api.aivis-project.com/v1/aivm-models/search'

  try {
    const params: any = {
      sort,
      page: parseInt(page as string),
      limit: parseInt(limit as string),
    }

    if (keyword) params.keyword = keyword
    if (Array.isArray(tags) && tags.length > 0) params.tags = tags
    if (Array.isArray(categories) && categories.length > 0)
      params.categories = categories
    if (Array.isArray(voice_timbres) && voice_timbres.length > 0)
      params.voice_timbres = voice_timbres
    if (Array.isArray(license_types) && license_types.length > 0)
      params.license_types = license_types

    const response = await axios.get(apiUrl, {
      params,
      timeout: 10000,
    })

    console.log('AIVIS API Response:', JSON.stringify(response.data, null, 2))

    const models = response.data.aivm_models || []
    const total = response.data.total || 0

    res.status(200).json({
      models: models.map((model: any) => ({
        uuid: model.aivm_model_uuid,
        name: model.model_name || model.name,
        description: model.description,
        creator_name: model.user?.name || model.user?.handle,
        tags: model.tags,
        voice_timbre: model.voice_timbre,
        category: model.category,
        has_styles: model.has_styles,
        default_style_id: model.default_style_id,
      })),
      total,
      page: parseInt(page as string),
      limit: parseInt(limit as string),
    })
  } catch (error) {
    console.error('Error fetching AIVIS models:', error)
    if (axios.isAxiosError(error) && error.response) {
      console.error('Response data:', error.response.data)
      console.error('Response status:', error.response.status)
    }
    res.status(500).json({ error: 'Failed to fetch AIVIS models' })
  }
}
