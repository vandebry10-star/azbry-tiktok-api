// index.js
// Azbry TikTok Downloader API (free, pakai tikwm backend)

const express = require('express')
const axios = require('axios')

const app = express()
const PORT = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.json({
    status: true,
    creator: 'FebryWesker | Azbry-MD',
    message: 'Azbry TikTok API aktif ✔',
    usage: '/tiktok?url=LINK_TIKTOK'
  })
})

// GET /tiktok?url=...
app.get('/tiktok', async (req, res) => {
  const url = req.query.url

  if (!url) {
    return res.status(400).json({
      status: false,
      message: 'Parameter "url" wajib diisi, contoh: /tiktok?url=LINK_TIKTOK'
    })
  }

  try {
    const api = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`
    const { data } = await axios.get(api, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    })

    if (!data || data.code !== 0 || !data.data) {
      return res.status(500).json({
        status: false,
        message: 'Gagal mengambil data dari TikTok (api error)',
        raw: data
      })
    }

    const d = data.data

    const result = {
      id: d.id,
      region: d.region,
      title: d.title,
      cover: d.cover,
      origin_cover: d.origin_cover,
      no_watermark: d.play,
      watermark: d.wmplay,
      music: d.music,
      music_info: {
        title: d.music_info?.title,
        author: d.music_info?.author,
        duration: d.music_info?.duration
      },
      author: {
        unique_id: d.author?.unique_id,
        nickname: d.author?.nickname,
        avatar: d.author?.avatar
      }
    }

    return res.json({
      status: true,
      creator: 'FebryWesker | Azbry-MD',
      source: 'tikwm.com',
      result
    })
  } catch (e) {
    console.error('Error /tiktok:', e.message)
    return res.status(500).json({
      status: false,
      message: 'Terjadi error saat memproses URL TikTok',
      error: e.message
    })
  }
})

app.listen(PORT, () => {
  console.log(`Azbry TikTok API jalan di port ${PORT}`)
})
