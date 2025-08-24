import { Link } from 'react-router-dom'
import posts from '../data/blog-content.js'

function BlogList() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Ride Along Blog
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover smart commuting strategies, cost-saving tips, and real stories from Indian ride sharers. 
            Learn how shared transportation is transforming lives across India.
          </p>
        </div>

        {/* Featured Post */}
        {posts.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-6">Featured Article</h2>
            <div className="bg-zinc-800 rounded-xl overflow-hidden shadow-2xl border border-blue-500">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <img 
                    src={posts[0].coverImage} 
                    alt={posts[0].title}
                    className="w-full h-64 md:h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/api/placeholder/600/400'
                    }}
                  />
                </div>
                <div className="md:w-1/2 p-8">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {posts[0].tags.map((tag, index) => (
                      <span 
                        key={index} 
                        className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    {posts[0].title}
                  </h3>
                  <p className="text-gray-300 mb-6">
                    {posts[0].excerpt}
                  </p>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {posts[0].author.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-medium">{posts[0].author}</p>
                        <p className="text-gray-400 text-sm">
                          {new Date(posts[0].publishedAt).toLocaleDateString('en-IN')} • {posts[0].readingTime} min read
                        </p>
                      </div>
                    </div>
                  </div>
                  <Link 
                    to={`/blog/${posts[0].slug}`}
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Read Full Article →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Blog Posts Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">All Articles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article key={post.id} className="bg-zinc-800 rounded-xl overflow-hidden shadow-2xl border border-gray-700 hover:border-blue-500 transition-all duration-300 hover:transform hover:scale-105">
                <img 
                  src={post.coverImage} 
                  alt={post.title}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.src = '/api/placeholder/400/300'
                  }}
                />
                <div className="p-6">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.tags.slice(0, 2).map((tag, index) => (
                      <span 
                        key={index} 
                        className="bg-purple-600 text-white px-2 py-1 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-300 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">
                          {post.author.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{post.author}</p>
                        <p className="text-gray-400 text-xs">
                          {new Date(post.publishedAt).toLocaleDateString('en-IN')}
                        </p>
                      </div>
                    </div>
                    <span className="text-gray-400 text-sm">
                      {post.readingTime} min
                    </span>
                  </div>
                  <Link 
                    to={`/blog/${post.slug}`}
                    className="block w-full text-center bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                  >
                    Read Article
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-center">
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
              Find Rides
            </Link>
            <Link 
              to="/post"
              className="bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-400 transition-colors"
            >
              Post a Ride
            </Link>
          </div>
        </div>

        {/* SEO and Info Section */}
        <div className="mt-12 text-center">
          <p className="text-gray-400 text-sm">
            Stay updated with the latest insights on ride sharing, cost savings, and sustainable commuting in India. 
            Our blog covers everything from safety tips to environmental benefits of shared transportation.
          </p>
        </div>
      </div>
    </div>
  )
}

export default BlogList