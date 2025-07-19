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

// Mock data
const mockArticles = [
  {
    id: "1",
    title: "Building Scalable React Applications with Next.js 14",
    excerpt:
      "Learn how to leverage the latest features in Next.js 14 to build performant and scalable React applications with server components and improved routing.",
    coverImage: "/placeholder.svg?height=400&width=600",
    author: { name: "Sarah Chen", avatar: "/placeholder.svg?height=40&width=40", username: "sarahchen" },
    publishedAt: "2024-01-15",
    readTime: 8,
    tags: ["React", "Next.js", "JavaScript", "Web Development"],
    likes: 234,
    comments: 45,
    views: 1234,
  },
  {
    id: "2",
    title: "The Complete Guide to TypeScript in 2024",
    excerpt:
      "Master TypeScript with this comprehensive guide covering advanced types, generics, decorators, and best practices for modern development.",
    coverImage: "/placeholder.svg?height=400&width=600",
    author: { name: "Alex Rodriguez", avatar: "/placeholder.svg?height=40&width=40", username: "alexrod" },
    publishedAt: "2024-01-12",
    readTime: 12,
    tags: ["TypeScript", "JavaScript", "Programming"],
    likes: 189,
    comments: 32,
    views: 2156,
  },
  {
    id: "3",
    title: "Microservices Architecture: Lessons from Production",
    excerpt:
      "Real-world insights and lessons learned from implementing microservices at scale, including common pitfalls and best practices.",
    coverImage: "/placeholder.svg?height=400&width=600",
    author: { name: "Michael Johnson", avatar: "/placeholder.svg?height=40&width=40", username: "mikej" },
    publishedAt: "2024-01-10",
    readTime: 15,
    tags: ["Architecture", "Backend", "DevOps", "Microservices"],
    likes: 156,
    comments: 28,
    views: 1876,
  },
  {
    id: "4",
    title: "AI-Powered Development: Tools That Will Change Your Workflow",
    excerpt:
      "Explore the latest AI tools and techniques that are revolutionizing how developers write, test, and deploy code.",
    coverImage: "/placeholder.svg?height=400&width=600",
    author: { name: "Emily Watson", avatar: "/placeholder.svg?height=40&width=40", username: "emilyw" },
    publishedAt: "2024-01-08",
    readTime: 10,
    tags: ["AI", "Machine Learning", "Developer Tools", "Productivity"],
    likes: 298,
    comments: 67,
    views: 3421,
  },
  {
    id: "5",
    title: "Modern CSS Techniques for Better Web Design",
    excerpt:
      "Discover the latest CSS features and techniques that will help you create stunning, responsive web designs.",
    coverImage: "/placeholder.svg?height=400&width=600",
    author: { name: "David Kim", avatar: "/placeholder.svg?height=40&width=40", username: "davidk" },
    publishedAt: "2024-01-05",
    readTime: 7,
    tags: ["CSS", "Web Design", "Frontend", "Responsive"],
    likes: 145,
    comments: 23,
    views: 987,
  },
  {
    id: "6",
    title: "Database Optimization Strategies for High-Traffic Apps",
    excerpt: "Learn proven strategies to optimize database performance and handle millions of requests efficiently.",
    coverImage: "/placeholder.svg?height=400&width=600",
    author: { name: "Lisa Park", avatar: "/placeholder.svg?height=40&width=40", username: "lisap" },
    publishedAt: "2024-01-03",
    readTime: 14,
    tags: ["Database", "Performance", "Backend", "Optimization"],
    likes: 203,
    comments: 41,
    views: 2543,
  },
]

const popularAuthors = [
  {
    name: "Sarah Chen",
    username: "sarahchen",
    avatar: "/placeholder.svg?height=40&width=40",
    followers: 12500,
    articles: 24,
  },
  {
    name: "Alex Rodriguez",
    username: "alexrod",
    avatar: "/placeholder.svg?height=40&width=40",
    followers: 8900,
    articles: 18,
  },
  {
    name: "Emily Watson",
    username: "emilyw",
    avatar: "/placeholder.svg?height=40&width=40",
    followers: 15600,
    articles: 31,
  },
  {
    name: "Michael Johnson",
    username: "mikej",
    avatar: "/placeholder.svg?height=40&width=40",
    followers: 7200,
    articles: 15,
  },
]

const trendingTopics = [
  { name: "React", count: 1234, growth: "+12%" },
  { name: "TypeScript", count: 987, growth: "+8%" },
  { name: "Next.js", count: 756, growth: "+15%" },
  { name: "AI/ML", count: 543, growth: "+25%" },
  { name: "DevOps", count: 432, growth: "+5%" },
  { name: "Web3", count: 321, growth: "+18%" },
]

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTag, setSelectedTag] = useState("all")
  const [sortBy, setSortBy] = useState("trending")
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [activeTab, setActiveTab] = useState("articles")

  const filteredArticles = mockArticles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTag =
      selectedTag === "all" || article.tags.some((tag) => tag.toLowerCase().includes(selectedTag.toLowerCase()))
    return matchesSearch && matchesTag
  })

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
                  {popularAuthors.map((author, index) => (
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
                              {author.followers.toLocaleString()} followers
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
                  {mockArticles.slice(0, 3).map((article, index) => (
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
                {trendingTopics.map((topic, index) => (
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
                {popularAuthors.slice(0, 3).map((author) => (
                  <div key={author.username} className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={author.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{author.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{author.name}</div>
                      <div className="text-xs text-muted-foreground">{author.followers.toLocaleString()} followers</div>
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
