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
    console.log('Creating post:', postData)

    // Validate required fields
    if (!postData.title || !postData.content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 })
    }

    // Create filename
    const slug = postData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    const filename = `${postData.date}-${slug}.mdx`
    const filepath = path.join(postsDirectory, filename)

    // Check if file already exists
    if (fs.existsSync(filepath)) {
      return NextResponse.json(
        { error: `Post with filename ${filename} already exists` },
        { status: 409 }
      )
    }

    // Create frontmatter
    const frontmatter = `---
title: '${postData.title.replace(/'/g, "''")}'
date: '${postData.date}'
tags: [${postData.tags.map((tag: string) => `'${tag.replace(/'/g, "''")}'`).join(', ')}]
draft: false
summary: '${postData.summary.replace(/'/g, "''")}'
---

${postData.content}`

    // Ensure directory exists
    if (!fs.existsSync(postsDirectory)) {
      console.log('Creating posts directory:', postsDirectory)
      fs.mkdirSync(postsDirectory, { recursive: true })
    }

    // Write file
    console.log('Writing file to:', filepath)
    fs.writeFileSync(filepath, frontmatter, 'utf8')
    console.log('File written successfully')

    return NextResponse.json({
      success: true,
      filename,
      filepath,
      message: 'Post created successfully!',
    })
  } catch (error) {
    console.error('Error creating post:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      {
        error: 'Failed to create post',
        details: errorMessage,
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const postData = await request.json()
    const { originalFilename, ...updatedData } = postData

    console.log('Updating post:', originalFilename, updatedData)

    if (!originalFilename) {
      return NextResponse.json(
        { error: 'Original filename is required for updates' },
        { status: 400 }
      )
    }

    // Create new filename from updated title
    const slug = updatedData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    const newFilename = `${updatedData.date}-${slug}.mdx`
    const originalPath = path.join(postsDirectory, originalFilename)
    const newPath = path.join(postsDirectory, newFilename)

    // Check if original file exists
    if (!fs.existsSync(originalPath)) {
      return NextResponse.json({ error: 'Original post not found' }, { status: 404 })
    }

    // Create updated frontmatter
    const frontmatter = `---
title: '${updatedData.title.replace(/'/g, "''")}'
date: '${updatedData.date}'
tags: [${updatedData.tags.map((tag: string) => `'${tag.replace(/'/g, "''")}'`).join(', ')}]
draft: false
summary: '${updatedData.summary.replace(/'/g, "''")}'
---

${updatedData.content}`

    // Write updated file
    fs.writeFileSync(newPath, frontmatter, 'utf8')

    // Remove old file if filename changed
    if (originalFilename !== newFilename) {
      fs.unlinkSync(originalPath)
    }

    return NextResponse.json({
      success: true,
      filename: newFilename,
      originalFilename,
      message: 'Post updated successfully!',
    })
  } catch (error) {
    console.error('Error updating post:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      {
        error: 'Failed to update post',
        details: errorMessage,
      },
      { status: 500 }
    )
  }
}
