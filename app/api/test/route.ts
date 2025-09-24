import { NextResponse } from 'next/server'

export async function GET() {
  const diagnostics = {
    timestamp: new Date().toISOString(),
    api_status: 'working',
    environment: {
      github_client_id: process.env.GITHUB_CLIENT_ID ? 'set' : 'missing',
      github_client_secret: process.env.GITHUB_CLIENT_SECRET ? 'set' : 'missing',
      node_env: process.env.NODE_ENV,
    },
    oauth_config: {
      auth_endpoint: '/api/oauth',
      callback_url: 'https://research.gelora.study/api/oauth',
    },
  }

  return NextResponse.json(diagnostics, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
