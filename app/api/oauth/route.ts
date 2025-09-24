import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const state = searchParams.get('state')

  if (!code) {
    return NextResponse.json({ error: 'Authorization code not found' }, { status: 400 })
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code: code,
      }),
    })

    const tokenData = await tokenResponse.json()

    if (tokenData.error) {
      return NextResponse.json({ error: tokenData.error_description }, { status: 400 })
    }

    // Return success page with token for CMS
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>GitHub Authorization Success</title>
      <style>
        body { font-family: 'JetBrains Mono', monospace; background: #000; color: #fff; padding: 40px; text-align: center; }
        .success { color: #4ade80; }
      </style>
    </head>
    <body>
      <h1 class="success">✅ GitHub Authorization Successful!</h1>
      <p>You can now close this window and return to the CMS.</p>
      <script>
        // Post message to parent window (CMS)
        if (window.opener) {
          window.opener.postMessage({
            type: 'authorization_github',
            token: '${tokenData.access_token}',
            provider: 'github'
          }, window.location.origin);
          window.close();
        }
      </script>
    </body>
    </html>
    `

    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html' },
    })
  } catch (error) {
    console.error('OAuth error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
