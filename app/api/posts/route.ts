import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { getAllPosts } from '@/lib/posts'

const postsDirectory = path.join(process.cwd(), 'data/blog')

export async function GET() {
  try {
    const posts = await getAllPosts()
    return NextResponse.json({ posts })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const postData = await request.json()

    // Create filename
    const slug = postData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    const filename = `${postData.date}-${slug}.mdx`
    const filepath = path.join(postsDirectory, filename)

    // Create frontmatter
    const frontmatter = `---
title: '${postData.title}'
date: '${postData.date}'
tags: [${postData.tags.map((tag: string) => `'${tag}'`).join(', ')}]
draft: false
summary: '${postData.summary}'
---

${postData.content}`

    // Ensure directory exists
    if (!fs.existsSync(postsDirectory)) {
      fs.mkdirSync(postsDirectory, { recursive: true })
    }

    // Write file
    fs.writeFileSync(filepath, frontmatter, 'utf8')

    return NextResponse.json({
      success: true,
      filename,
      message: 'Post created successfully!',
    })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      {
        error: 'Failed to create post',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
