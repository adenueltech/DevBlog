"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { ArticleCard } from "@/components/article-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, Clock, Star, Filter } from "lucide-react"
import { apiClient } from "@/lib/api"
import { LoadingCard } from "@/components/ui/loading"

// Hook to fetch articles from backend
function useArticles() {
  const [articles, setArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchArticles() {
      try {
        const data = await apiClient.getArticles()
        setArticles(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error("Error fetching articles:", error)
        // Keep articles as empty array on error
        setArticles([])
      } finally {
        setLoading(false)
      }
    }

    fetchArticles()
  }, [])

  return { articles, loading }
}

// Fallback mock data for when no articles exist
const mockArticles = [
  {
    id: "1",
    title: "Building Scalable React Applications with Next.js 14",
    excerpt:
      "Learn how to leverage the latest features in Next.js 14 to build performant and scalable React applications with server components and improved routing.",
    coverImage: "/placeholder.svg?height=400&width=600",
    author: {
      name: "Sarah Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      username: "sarahchen",
    },
    publishedAt: "2024-01-15",
    readTime: 8,
    tags: ["React", "Next.js", "JavaScript", "Web Development"],
    likes: 234,
    comments: 45,
    isLiked: false,
    isBookmarked: true,
  },
  {
    id: "2",
    title: "The Complete Guide to TypeScript in 2024",
    excerpt:
      "Master TypeScript with this comprehensive guide covering advanced types, generics, decorators, and best practices for modern development.",
    coverImage: "/placeholder.svg?height=400&width=600",
    author: {
      name: "Alex Rodriguez",
      avatar: "/placeholder.svg?height=40&width=40",
      username: "alexrod",
    },
    publishedAt: "2024-01-12",
    readTime: 12,
    tags: ["TypeScript", "JavaScript", "Programming"],
    likes: 189,
    comments: 32,
    isLiked: true,
    isBookmarked: false,
  },
  {
    id: "3",
    title: "Microservices Architecture: Lessons from Production",
    excerpt:
      "Real-world insights and lessons learned from implementing microservices at scale, including common pitfalls and best practices.",
    coverImage: "/placeholder.svg?height=400&width=600",
    author: {
      name: "Michael Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      username: "mikej",
    },
    publishedAt: "2024-01-10",
    readTime: 15,
    tags: ["Architecture", "Backend", "DevOps", "Microservices"],
    likes: 156,
    comments: 28,
    isLiked: false,
    isBookmarked: false,
  },
  {
    id: "4",
    title: "AI-Powered Development: Tools That Will Change Your Workflow",
    excerpt:
      "Explore the latest AI tools and techniques that are revolutionizing how developers write, test, and deploy code.",
    coverImage: "/placeholder.svg?height=400&width=600",
    author: {
      name: "Emily Watson",
      avatar: "/placeholder.svg?height=40&width=40",
      username: "emilyw",
    },
    publishedAt: "2024-01-08",
    readTime: 10,
    tags: ["AI", "Machine Learning", "Developer Tools", "Productivity"],
    likes: 298,
    comments: 67,
    isLiked: true,
    isBookmarked: true,
  },
]

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("trending")
  const [isLoading, setIsLoading] = useState(false)
  const { articles, loading } = useArticles()

  // Transform backend articles to match the expected format
  const transformedArticles = articles.map((article: any) => ({
    ...article,
    id: article.id.toString(),
    author: {
      name: article.author.name,
      avatar: article.author.avatar || "/placeholder.svg",
      username: article.author.username || article.author.name?.toLowerCase().replace(/\s+/g, '') || `user${article.author.id}`,
    },
    tags: article.tags ? article.tags.split(',') : [],
    likes: article.likes || 0,
    comments: article.comments || 0,
    isLiked: false,
    isBookmarked: false,
  }))

  // Use real articles if available, otherwise fallback to mock data
  const displayArticles = transformedArticles.length > 0 ? transformedArticles : mockArticles
  const featuredArticle = displayArticles[0]
  const regularArticles = displayArticles.slice(1)

  if (loading) {
    return (
      <div className="min-h-screen pt-24 bg-background">
        <Navbar />
        
        {/* Hero Section Skeleton */}
        <div className="pt-16">
          <HeroSection />
        </div>

        {/* Loading Articles */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold font-serif">Latest Articles</h2>
            </div>
            
            <div className="grid gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <LoadingCard key={i} />
              ))}
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 bg-background">
      <Navbar />

      {/* Hero Section */}
      <div className="pt-16">
        <HeroSection />
      </div>

      {/* Featured Article Section */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold font-serif mb-2">Featured Story</h2>
              <p className="text-muted-foreground">Hand-picked by our editorial team</p>
            </div>
            <Badge className="bg-primary/10 text-primary border-primary/20">
              <Star className="w-3 h-3 mr-1" />
              Editor's Choice
            </Badge>
          </div>

          <div className="animate-fade-in">
            <ArticleCard article={featuredArticle} variant="featured" />
          </div>
        </div>
      </section>

      {/* Articles Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold font-serif">Latest Articles</h2>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
          </div>

          {/* Tabs for different article categories */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="trending" className="gap-2">
                <TrendingUp className="w-4 h-4" />
                Trending
              </TabsTrigger>
              <TabsTrigger value="recent" className="gap-2">
                <Clock className="w-4 h-4" />
                Recent
              </TabsTrigger>
              <TabsTrigger value="featured" className="gap-2">
                <Star className="w-4 h-4" />
                Featured
              </TabsTrigger>
            </TabsList>

            <TabsContent value="trending" className="mt-8">
              <div className="grid gap-6">
                {regularArticles.map((article, index) => (
                  <div key={article.id} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                    <ArticleCard article={article} />
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="recent" className="mt-8">
              <div className="grid gap-6">
                {[...regularArticles].reverse().map((article, index) => (
                  <div key={article.id} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                    <ArticleCard article={article} />
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="featured" className="mt-8">
              <div className="grid gap-6">
                {regularArticles
                  .filter((article) => article.isBookmarked)
                  .map((article, index) => (
                    <div key={article.id} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                      <ArticleCard article={article} />
                    </div>
                  ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Load More Button */}
          <div className="text-center mt-12">
            <Button
              size="lg"
              variant="outline"
              onClick={() => setIsLoading(true)}
              disabled={isLoading}
              className="px-8 hover:bg-primary hover:text-primary-foreground transition-all hover:scale-105"
            >
              {isLoading ? "Loading..." : "Load More Articles"}
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
