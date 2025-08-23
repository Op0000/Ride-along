import { useParams, Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import posts from '../data/posts.js'

function BlogPost() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [relatedPosts, setRelatedPosts] = useState([])

  useEffect(() => {
    // Find the post by slug
    const foundPost = posts.find(p => p.slug === slug)
    if (!foundPost) {
      navigate('/blog')
      return
    }
    
    setPost(foundPost)

    // Find related posts (same tags or different posts)
    const related = posts
      .filter(p => p.id !== foundPost.id)
      .filter(p => p.tags.some(tag => foundPost.tags.includes(tag)))
      .slice(0, 3)
    
    // If no related posts found, just get other posts
    if (related.length === 0) {
      setRelatedPosts(posts.filter(p => p.id !== foundPost.id).slice(0, 3))
    } else {
      setRelatedPosts(related)
    }

    // Update page title and meta description for SEO
    document.title = `${foundPost.title} - Ride Along Blog`
    
    // Add meta description
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', foundPost.excerpt)
    } else {
      const meta = document.createElement('meta')
      meta.name = 'description'
      meta.content = foundPost.excerpt
      document.head.appendChild(meta)
    }
  }, [slug, navigate])

  // Function to convert markdown-like content to HTML
  const formatContent = (content) => {
    return content
      .replace(/^# (.*$)/gm, '<h1 class="text-4xl font-bold text-white mb-6 mt-8">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-3xl font-bold text-white mb-4 mt-8">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-2xl font-semibold text-blue-300 mb-3 mt-6">$1</h3>')
      .replace(/^\*\*(.*?)\*\*/gm, '<strong class="text-white font-semibold">$1</strong>')
      .replace(/^\- (.*$)/gm, '<li class="text-gray-300 mb-1">$1</li>')
      .replace(/\n\n/g, '</p><p class="text-gray-300 mb-4 leading-relaxed">')
      .replace(/\n/g, '<br>')
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Breadcrumb */}
      <div className="bg-black bg-opacity-20 py-4">
        <div className="max-w-4xl mx-auto px-4">
          <nav className="text-gray-300">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span className="mx-2">›</span>
            <Link to="/blog" className="hover:text-white transition-colors">Blog</Link>
            <span className="mx-2">›</span>
            <span className="text-white">{post.title}</span>
          </nav>
        </div>
      </div>

      {/* Article Header */}
      <div className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {post.tags.map((tag, index) => (
                <span 
                  key={index} 
                  className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              {post.title}
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              {post.excerpt}
            </p>
            
            {/* Author and Meta Info */}
            <div className="flex items-center justify-center gap-6 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">
                    {post.author.charAt(0)}
                  </span>
                </div>
                <div className="text-left">
                  <p className="text-white font-medium">{post.author}</p>
                  <p className="text-gray-400 text-sm">Author</p>
                </div>
              </div>
              <div className="text-center">
                <p className="text-white font-medium">
                  {new Date(post.publishedAt).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <p className="text-gray-400 text-sm">{post.readingTime} min read</p>
              </div>
            </div>

            {/* Cover Image */}
            <div className="rounded-xl overflow-hidden shadow-2xl mb-8">
              <img 
                src={post.coverImage} 
                alt={post.title}
                className="w-full h-64 md:h-96 object-cover"
                onError={(e) => {
                  e.target.src = '/api/placeholder/800/400'
                }}
              />
            </div>
          </div>

          {/* Article Content */}
          <article className="prose prose-lg prose-invert max-w-none">
            <div 
              className="text-gray-300 leading-relaxed"
              dangerouslySetInnerHTML={{ 
                __html: `<p class="text-gray-300 mb-4 leading-relaxed">${formatContent(post.content)}</p>` 
              }}
            />
          </article>

          {/* Call to Action Section */}
          <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Start Your Ride Sharing Journey?
            </h2>
            <p className="text-xl text-blue-100 mb-6">
              Join thousands of smart commuters who are saving money and reducing stress with Ride Along
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/search"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                🔍 Find Rides
              </Link>
              <Link 
                to="/post"
                className="bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-400 transition-colors"
              >
                📝 Post a Ride
              </Link>
            </div>
          </div>

          {/* Social Sharing */}
          <div className="mt-8 text-center">
            <h3 className="text-xl font-semibold text-white mb-4">Share this article</h3>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  const url = window.location.href
                  const text = `Check out this article: ${post.title}`
                  if (navigator.share) {
                    navigator.share({ title: post.title, text, url })
                  } else {
                    navigator.clipboard.writeText(`${text} ${url}`)
                    alert('Link copied to clipboard!')
                  }
                }}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                📱 Share
              </button>
              <button
                onClick={() => {
                  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`
                  window.open(url, '_blank')
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                🐦 Twitter
              </button>
              <button
                onClick={() => {
                  const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`
                  window.open(url, '_blank')
                }}
                className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg transition-colors"
              >
                💼 LinkedIn
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="py-16 bg-black bg-opacity-20">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              Related Articles
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <article key={relatedPost.id} className="bg-zinc-800 rounded-xl overflow-hidden shadow-2xl border border-gray-700 hover:border-blue-500 transition-all duration-300">
                  <img 
                    src={relatedPost.coverImage} 
                    alt={relatedPost.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.src = '/api/placeholder/400/300'
                    }}
                  />
                  <div className="p-6">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {relatedPost.tags.slice(0, 2).map((tag, index) => (
                        <span 
                          key={index} 
                          className="bg-purple-600 text-white px-2 py-1 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-lg font-bold text-white mb-3 line-clamp-2">
                      {relatedPost.title}
                    </h3>
                    <p className="text-gray-300 mb-4 line-clamp-2 text-sm">
                      {relatedPost.excerpt}
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-gray-400 text-xs">
                        {relatedPost.readingTime} min read
                      </span>
                    </div>
                    <Link 
                      to={`/blog/${relatedPost.slug}`}
                      className="block w-full text-center bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-medium transition-colors text-sm"
                    >
                      Read Article
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Back to Blog */}
      <div className="py-8 text-center">
        <Link 
          to="/blog"
          className="inline-flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors"
        >
          ← Back to Blog
        </Link>
      </div>
    </div>
  )
}

export default BlogPost