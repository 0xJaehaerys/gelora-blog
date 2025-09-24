import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const postsDirectory = path.join(process.cwd(), 'data/blog')

export interface Post {
  slug: string
  title: string
  date: string
  tags: string[]
  summary: string
  content: string
  draft?: boolean
}

export async function getAllPosts(): Promise<Post[]> {
  try {
    if (!fs.existsSync(postsDirectory)) {
      return []
    }

    const files = fs.readdirSync(postsDirectory)
    const posts = files
      .filter((file) => file.endsWith('.mdx'))
      .map((file) => {
        const filePath = path.join(postsDirectory, file)
        const fileContent = fs.readFileSync(filePath, 'utf8')
        const { data, content } = matter(fileContent)

        return {
          slug: file.replace('.mdx', ''),
          title: data.title || 'Untitled',
          date: data.date || new Date().toISOString().split('T')[0],
          tags: data.tags || [],
          summary: data.summary || '',
          content: content,
          draft: data.draft || false,
        }
      })
      .filter((post) => !post.draft)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    return posts
  } catch (error) {
    console.error('Error reading posts:', error)
    return []
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const filePath = path.join(postsDirectory, `${slug}.mdx`)

    if (!fs.existsSync(filePath)) {
      return null
    }

    const fileContent = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(fileContent)

    return {
      slug,
      title: data.title || 'Untitled',
      date: data.date || new Date().toISOString().split('T')[0],
      tags: data.tags || [],
      summary: data.summary || '',
      content: content,
      draft: data.draft || false,
    }
  } catch (error) {
    console.error('Error reading post:', error)
    return null
  }
}
