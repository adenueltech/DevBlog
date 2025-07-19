"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, TrendingUp, Hash, BookOpen, Users, ArrowRight, Star, Flame } from "lucide-react"
import Link from "next/link"

// Mock data for topics
const allTopics = [
  {
    id: "react",
    name: "React",
    description: "A JavaScript library for building user interfaces with component-based architecture.",
    articleCount: 1234,
    followerCount: 45600,
    color: "bg-blue-500",
    trending: true,
    growth: "+15%",
    icon: "⚛️",
  },
  {
    id: "typescript",
    name: "TypeScript",
    description: "A strongly typed programming language that builds on JavaScript.",
    articleCount: 987,
    followerCount: 32100,
    color: "bg-blue-600",
    trending: true,
    growth: "+12%",
    icon: "📘",
  },
  {
    id: "nextjs",
    name: "Next.js",
    description: "The React framework for production with hybrid static & server rendering.",
    articleCount: 756,
    followerCount: 28900,
    color: "bg-black",
    trending: true,
    growth: "+18%",
    icon: "▲",
  },
  {
    id: "ai-ml",
    name: "AI & Machine Learning",
    description: "Artificial intelligence, machine learning algorithms, and data science.",
    articleCount: 543,
    followerCount: 67800,
    color: "bg-purple-500",
    trending: true,
    growth: "+25%",
    icon: "🤖",
  },
  {
    id: "devops",
    name: "DevOps",
    description: "Development operations, CI/CD, containerization, and infrastructure.",
    articleCount: 432,
    followerCount: 23400,
    color: "bg-orange-500",
    trending: false,
    growth: "+8%",
    icon: "🔧",
  },
  {
    id: "web3",
    name: "Web3 & Blockchain",
    description: "Decentralized web, blockchain technology, and cryptocurrency development.",
    articleCount: 321,
    followerCount: 19200,
    color: "bg-yellow-500",
    trending: true,
    growth: "+22%",
    icon: "⛓️",
  },
  {
    id: "python",
    name: "Python",
    description: "A versatile programming language for web development, data science, and automation.",
    articleCount: 876,
    followerCount: 41300,
    color: "bg-green-500",
    trending: false,
    growth: "+5%",
    icon: "🐍",
  },
  {
    id: "javascript",
    name: "JavaScript",
    description: "The programming language of the web, enabling interactive and dynamic content.",
    articleCount: 1567,
    followerCount: 52100,
    color: "bg-yellow-400",
    trending: false,
    growth: "+3%",
    icon: "🟨",
  },
  {
    id: "css",
    name: "CSS & Design",
    description: "Cascading Style Sheets, web design, and user interface styling.",
    articleCount: 654,
    followerCount: 31800,
    color: "bg-pink-500",
    trending: false,
    growth: "+7%",
    icon: "🎨",
  },
  {
    id: "backend",
    name: "Backend Development",
    description: "Server-side development, APIs, databases, and system architecture.",
    articleCount: 789,
    followerCount: 35600,
    color: "bg-gray-600",
    trending: false,
    growth: "+6%",
    icon: "⚙️",
  },
  {
    id: "mobile",
    name: "Mobile Development",
    description: "iOS, Android, React Native, and cross-platform mobile app development.",
    articleCount: 445,
    followerCount: 27300,
    color: "bg-indigo-500",
    trending: false,
    growth: "+9%",
    icon: "📱",
  },
  {
    id: "security",
    name: "Cybersecurity",
    description: "Web security, ethical hacking, and secure coding practices.",
    articleCount: 298,
    followerCount: 18700,
    color: "bg-red-500",
    trending: false,
    growth: "+11%",
    icon: "🔒",
  },
]

const featuredTopics = allTopics.filter((topic) => topic.trending).slice(0, 4)
const trendingTopics = allTopics.sort((a, b) => Number.parseInt(b.growth) - Number.parseInt(a.growth)).slice(0, 6)
const popularTopics = allTopics.sort((a, b) => b.followerCount - a.followerCount).slice(0, 6)

export default function TopicsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const filteredTopics = allTopics.filter(
    (topic) =>
      topic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getTopicsByTab = () => {
    switch (activeTab) {
      case "trending":
        return trendingTopics
      case "popular":
        return popularTopics
      case "featured":
        return featuredTopics
      default:
        return filteredTopics
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 pt-24 pb-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4">
            Explore <span className="gradient-text">Topics</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover and follow topics that interest you. Stay updated with the latest articles and discussions.
          </p>
        </div>

        {/* Search */}
        <Card className="mb-8 shadow-lg border-0 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Search topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 text-lg bg-background"
              />
            </div>
          </CardContent>
        </Card>

        {/* Featured Topics Banner */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold font-serif mb-6 flex items-center gap-2">
            <Star className="w-6 h-6 text-yellow-500" />
            Featured Topics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredTopics.map((topic, index) => (
              <Card
                key={topic.id}
                className="group hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer border-0 bg-gradient-to-br from-card to-muted/20 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4">{topic.icon}</div>
                  <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">{topic.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{topic.description}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3 h-3" />
                      {topic.articleCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {topic.followerCount.toLocaleString()}
                    </span>
                  </div>
                  <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {topic.growth}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Topics Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all" className="gap-2">
              <Hash className="w-4 h-4" />
              All Topics ({filteredTopics.length})
            </TabsTrigger>
            <TabsTrigger value="trending" className="gap-2">
              <Flame className="w-4 h-4" />
              Trending
            </TabsTrigger>
            <TabsTrigger value="popular" className="gap-2">
              <Users className="w-4 h-4" />
              Popular
            </TabsTrigger>
            <TabsTrigger value="featured" className="gap-2">
              <Star className="w-4 h-4" />
              Featured
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getTopicsByTab().map((topic, index) => (
                <Card
                  key={topic.id}
                  className="group hover:shadow-lg transition-all duration-300 cursor-pointer animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{topic.icon}</div>
                        <div>
                          <CardTitle className="text-lg group-hover:text-primary transition-colors">
                            {topic.name}
                          </CardTitle>
                          {topic.trending && (
                            <Badge variant="secondary" className="mt-1 text-xs">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              Trending
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4 line-clamp-2">{topic.description}</CardDescription>

                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          {topic.articleCount} articles
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {topic.followerCount.toLocaleString()}
                        </span>
                      </div>
                      <Badge variant="outline" className="text-green-600 border-green-200">
                        {topic.growth}
                      </Badge>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        Follow
                      </Button>
                      <Button asChild size="sm" className="flex-1">
                        <Link href={`/explore?topic=${topic.id}`}>Explore</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {getTopicsByTab().length === 0 && (
              <Card className="text-center py-12">
                <CardContent>
                  <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No topics found</h3>
                  <p className="text-muted-foreground">Try adjusting your search query</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center bg-gradient-to-br from-primary/10 to-blue-500/10 border-primary/20">
            <CardContent className="p-6">
              <BookOpen className="w-8 h-8 text-primary mx-auto mb-3" />
              <div className="text-2xl font-bold text-primary mb-1">
                {allTopics.reduce((sum, topic) => sum + topic.articleCount, 0).toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Total Articles</div>
            </CardContent>
          </Card>

          <Card className="text-center bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
            <CardContent className="p-6">
              <Hash className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-green-600 mb-1">{allTopics.length}</div>
              <div className="text-sm text-muted-foreground">Active Topics</div>
            </CardContent>
          </Card>

          <Card className="text-center bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
            <CardContent className="p-6">
              <Users className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {allTopics.reduce((sum, topic) => sum + topic.followerCount, 0).toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Topic Followers</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
