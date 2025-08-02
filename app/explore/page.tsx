"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { ArticleCard } from "@/components/article-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Grid3X3, List, TrendingUp, Users, BookOpen, Calendar, Eye, Heart } from "lucide-react"

import { useEffect } from "react"

// Fetch data from backend
function useBackendData() {
  const [articles, setArticles] = useState([])
  const [authors, setAuthors] = useState([])
  const [topics, setTopics] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch published articles
        const articlesRes = await fetch("http://localhost:3000/articles")
        if (articlesRes.ok) {
          const articlesData = await articlesRes.json()
          setArticles(articlesData)
        }

        // Fetch authors (users who have published articles)
        const authorsRes = await fetch("http://localhost:3000/users")
        if (authorsRes.ok) {
          const authorsData = await authorsRes.json()
          setAuthors(authorsData)
        }

        // Extract topics from articles' tags
        if (articlesData.length > 0) {
          const topicCounts: { [key: string]: number } = {}
          articlesData.forEach((article: any) => {
            if (article.tags) {
              const tags = typeof article.tags === 'string' ? article.tags.split(',') : article.tags
              tags.forEach((tag: string) => {
                const cleanTag = tag.trim()
                if (cleanTag) {
                  topicCounts[cleanTag] = (topicCounts[cleanTag] || 0) + 1
                }
              })
            }
          })
          
          // Convert to topics array and sort by count
          const topicsArray = Object.entries(topicCounts)
            .map(([name, count]) => ({
              name,
              count,
              growth: `+${Math.floor(Math.random() * 20 + 5)}%` // Simulated growth for now
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10) // Top 10 topics
          
          setTopics(topicsArray)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { articles, authors, topics, loading }
}

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTag, setSelectedTag] = useState("all")
  const [sortBy, setSortBy] = useState("trending")
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [activeTab, setActiveTab] = useState("articles")

  const { articles, authors, topics, loading } = useBackendData()
  
  const filteredArticles = articles.filter((article: any) => {
    const matchesSearch =
      article.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTag = selectedTag === "all" // For now, ignore tag filtering since we don't have tags implemented yet
    return matchesSearch && matchesTag
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 pb-16">
          <div className="text-center">
            <div className="text-lg">Loading articles...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 pt-24 pb-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4">
            Explore <span className="gradient-text">Developer Content</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover amazing articles, tutorials, and insights from developers around the world
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8 shadow-lg border-0 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              {/* Search */}
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  placeholder="Search articles, authors, or topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 text-lg bg-background"
                />
              </div>

              {/* Filters */}
              <div className="flex gap-3 w-full lg:w-auto">
                <Select value={selectedTag} onValueChange={setSelectedTag}>
                  <SelectTrigger className="w-full lg:w-[180px] h-12">
                    <SelectValue placeholder="All Topics" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Topics</SelectItem>
                    <SelectItem value="react">React</SelectItem>
                    <SelectItem value="typescript">TypeScript</SelectItem>
                    <SelectItem value="nextjs">Next.js</SelectItem>
                    <SelectItem value="ai">AI/ML</SelectItem>
                    <SelectItem value="devops">DevOps</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full lg:w-[180px] h-12">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="trending">Trending</SelectItem>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="views">Most Viewed</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex border rounded-lg bg-background">
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="icon"
                    onClick={() => setViewMode("list")}
                    className="h-12 w-12"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="icon"
                    onClick={() => setViewMode("grid")}
                    className="h-12 w-12"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="articles" className="gap-2">
                  <BookOpen className="w-4 h-4" />
                  Articles ({filteredArticles.length})
                </TabsTrigger>
                <TabsTrigger value="authors" className="gap-2">
                  <Users className="w-4 h-4" />
                  Authors
                </TabsTrigger>
                <TabsTrigger value="trending" className="gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Trending
                </TabsTrigger>
              </TabsList>

              <TabsContent value="articles">
                {viewMode === "list" ? (
                  <div className="space-y-6">
                    {filteredArticles.map((article, index) => (
                      <div key={article.id} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                        <ArticleCard article={article} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredArticles.map((article, index) => (
                      <div key={article.id} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                        <ArticleCard article={article} variant="compact" />
                      </div>
                    ))}
                  </div>
                )}

                {filteredArticles.length === 0 && (
                  <Card className="text-center py-12">
                    <CardContent>
                      <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No articles found</h3>
                      <p className="text-muted-foreground">Try adjusting your search or filters</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="authors">
                <div className="grid gap-4">
                  {authors.map((author, index) => (
                    <Card
                      key={author.username}
                      className="hover:shadow-md transition-shadow animate-fade-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Avatar className="w-12 h-12">
                              <AvatarImage src={author.avatar || "/placeholder.svg"} />
                              <AvatarFallback>{author.name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold">{author.name}</h3>
                              <p className="text-sm text-muted-foreground">@{author.username}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-muted-foreground">
                              {author.followers?.toLocaleString()} followers
                            </div>
                            <div className="text-sm text-muted-foreground">{author.articles} articles</div>
                          </div>
                          <Button variant="outline" size="sm">
                            Follow
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="trending">
                <div className="space-y-6">
                  {articles.slice(0, 3).map((article, index) => (
                    <Card
                      key={article.id}
                      className="hover:shadow-md transition-shadow animate-fade-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="text-2xl font-bold text-primary">#{index + 1}</div>
                          <div className="flex-1">
                            <h3 className="font-semibold mb-2">{article.title}</h3>
                            <p className="text-sm text-muted-foreground mb-3">{article.excerpt}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                {article.views?.toLocaleString()}
                              </span>
                              <span className="flex items-center gap-1">
                                <Heart className="w-3 h-3" />
                                {article.likes}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(article.publishedAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trending Topics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Trending Topics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {topics.map((topic, index) => (
                  <div
                    key={topic.name}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <div>
                      <div className="font-medium">{topic.name}</div>
                      <div className="text-xs text-muted-foreground">{topic.count} articles</div>
                    </div>
                    <Badge
                      variant="secondary"
                      className="text-green-600 bg-green-50 dark:bg-green-900 dark:text-green-300"
                    >
                      {topic.growth}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Popular Authors */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Popular Authors
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {authors.slice(0, 3).map((author) => (
                  <div key={author.username} className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={author.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{author.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{author.name}</div>
                      <div className="text-xs text-muted-foreground">{author.followers?.toLocaleString()} followers</div>
                    </div>
                    <Button variant="outline" size="sm">
                      Follow
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Community Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <div className="text-2xl font-bold text-primary">50K+</div>
                  <div className="text-sm text-muted-foreground">Articles Published</div>
                </div>
                <div className="text-center p-4 bg-blue-500/5 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">10K+</div>
                  <div className="text-sm text-muted-foreground">Active Writers</div>
                </div>
                <div className="text-center p-4 bg-green-500/5 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">1M+</div>
                  <div className="text-sm text-muted-foreground">Monthly Readers</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
