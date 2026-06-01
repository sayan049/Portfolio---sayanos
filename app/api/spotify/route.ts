import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get('q')
  if (!query) return NextResponse.json({ error: 'Missing query' }, { status: 400 })

  const clientId = process.env.SPOTIFY_CLIENT_ID
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    return NextResponse.json({ error: 'Missing Spotify credentials in .env.local' }, { status: 500 })
  }

  try {
    // 1. Get access token
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64')
      },
      body: 'grant_type=client_credentials'
    })

    const tokenData = await tokenResponse.json()
    if (!tokenResponse.ok) {
      throw new Error(tokenData.error_description || 'Failed to get Spotify token')
    }

    const accessToken = tokenData.access_token

    // 2. Search tracks
    const searchResponse = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })

    const searchData = await searchResponse.json()
    if (!searchResponse.ok) {
      throw new Error(searchData.error?.message || 'Failed to search Spotify')
    }

    return NextResponse.json(searchData)
  } catch (error: any) {
    console.error('Spotify API Error:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
