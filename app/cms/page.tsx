'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Post {
  title: string
  date: string
  tags: string[]
  summary: string
  content: string
}

export default function CMSPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [currentPost, setCurrentPost] = useState<Post>({
    title: '',
    date: new Date().toISOString().split('T')[0],
    tags: ['ethereum'],
    summary: '',
    content: '',
  })
  const router = useRouter()

  useEffect(() => {
    // Load existing posts
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts')
      const data = await response.json()
      setPosts(data.posts || [])
    } catch (error) {
      console.error('Failed to fetch posts:', error)
    }
  }

  const savePost = async () => {
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentPost),
      })

      if (response.ok) {
        alert('Post saved successfully!')
        setIsCreating(false)
        fetchPosts()
        router.refresh()
      } else {
        alert('Failed to save post')
      }
    } catch (error) {
      console.error('Save error:', error)
      alert('Error saving post')
    }
  }

  return (
    <div className="min-h-screen bg-black font-mono text-white">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 border-b border-gray-800 pb-6">
          <h1 className="mb-2 text-4xl font-bold">GELORA_CMS</h1>
          <p className="text-gray-400">Content Management System</p>
        </div>

        {!isCreating ? (
          // Posts List
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Blog Posts</h2>
              <button
                onClick={() => setIsCreating(true)}
                className="border border-gray-600 bg-transparent px-6 py-2 text-white transition hover:bg-gray-800"
              >
                + NEW POST
              </button>
            </div>

            <div className="grid gap-4">
              {posts.map((post, index) => (
                <div
                  key={index}
                  className="border border-gray-800 p-4 transition hover:border-gray-600"
                >
                  <h3 className="mb-2 text-xl font-bold">{post.title}</h3>
                  <p className="mb-2 text-gray-400">{post.summary}</p>
                  <div className="flex gap-2 text-sm text-gray-500">
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.tags?.join(', ')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Post Editor
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Create New Post</h2>
              <div className="space-x-4">
                <button
                  onClick={() => setIsCreating(false)}
                  className="border border-gray-600 px-4 py-2 text-gray-400 hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={savePost}
                  className="bg-white px-6 py-2 text-black transition hover:bg-gray-200"
                >
                  PUBLISH
                </button>
              </div>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              {/* Editor */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="mb-2 block text-sm font-bold">
                    Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={currentPost.title}
                    onChange={(e) => setCurrentPost({ ...currentPost, title: e.target.value })}
                    className="w-full border border-gray-700 bg-gray-900 p-3 text-white focus:border-gray-500"
                    placeholder="Your post title..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="date" className="mb-2 block text-sm font-bold">
                      Date
                    </label>
                    <input
                      id="date"
                      type="date"
                      value={currentPost.date}
                      onChange={(e) => setCurrentPost({ ...currentPost, date: e.target.value })}
                      className="w-full border border-gray-700 bg-gray-900 p-3 text-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="tags" className="mb-2 block text-sm font-bold">
                      Tags
                    </label>
                    <input
                      id="tags"
                      type="text"
                      value={currentPost.tags.join(', ')}
                      onChange={(e) =>
                        setCurrentPost({
                          ...currentPost,
                          tags: e.target.value.split(',').map((t) => t.trim()),
                        })
                      }
                      className="w-full border border-gray-700 bg-gray-900 p-3 text-white"
                      placeholder="ethereum, defi, protocol"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="summary" className="mb-2 block text-sm font-bold">
                    Summary
                  </label>
                  <textarea
                    id="summary"
                    value={currentPost.summary}
                    onChange={(e) => setCurrentPost({ ...currentPost, summary: e.target.value })}
                    className="h-20 w-full border border-gray-700 bg-gray-900 p-3 text-white"
                    placeholder="Brief description for SEO and previews..."
                  />
                </div>

                <div>
                  <label htmlFor="content" className="mb-2 block text-sm font-bold">
                    Content (Markdown)
                  </label>
                  <textarea
                    id="content"
                    value={currentPost.content}
                    onChange={(e) => setCurrentPost({ ...currentPost, content: e.target.value })}
                    className="w-full border border-gray-700 bg-gray-900 p-3 font-mono text-sm text-white"
                    rows={20}
                    placeholder="# Your Post Title

Write your content here in Markdown...

## Subheading

- List item
- Another item

```javascript
// Code example
console.log('Hello Ethereum!');
```"
                  />
                </div>
              </div>

              {/* Preview */}
              <div className="border border-gray-800 p-6">
                <h3 className="mb-4 border-b border-gray-800 pb-2 text-lg font-bold">Preview</h3>
                <div className="prose prose-invert max-w-none">
                  <h1 className="mb-4 text-3xl font-bold">
                    {currentPost.title || 'Untitled Post'}
                  </h1>
                  <div className="mb-4 text-sm text-gray-400">
                    {currentPost.date} • {currentPost.tags.join(', ')}
                  </div>
                  <p className="mb-6 text-gray-300 italic">{currentPost.summary}</p>
                  <div className="whitespace-pre-wrap">{currentPost.content}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
