"use client"

import { useState } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  PenTool,
  Eye,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Edit3,
  Trash2,
  TrendingUp,
  Users,
  BookOpen,
  Calendar,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

function useUserDashboardData() {
  const [userData, setUserData] = useState<any>(null)
  const [userArticles, setUserArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)

  // Function to refresh data
  const refreshData = () => {
    setRefreshKey(prev => prev + 1)
  }

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          setUserData(null);
          setLoading(false);
          return;
        }

        // Fetch user data with JWT token
        const userRes = await fetch("http://localhost:3000/users/me", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        })
        if (userRes.ok) {
          const user = await userRes.json()
          setUserData(user)
        }

        // Fetch user articles with JWT token
        const articlesRes = await fetch("http://localhost:3000/users/me/articles", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        })
        if (articlesRes.ok) {
          let articles = await articlesRes.json()
          if (!Array.isArray(articles)) articles = [];
          setUserArticles(articles)
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setUserData(null);
      }
      setLoading(false)
    }
    fetchData()
  }, [refreshKey])

  return { userData, userArticles, loading, refreshData }
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const { userData, userArticles, loading, refreshData } = useUserDashboardData()

  // Refresh data when the page becomes visible (user returns from settings)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        refreshData()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [refreshData])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }
  if (!userData) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">User not found or not authenticated.</div>
  }

  const publishedArticles = userArticles.filter((article) => article.status === "published")
  const draftArticles = userArticles.filter((article) => article.status === "draft")

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 pt-24 pb-16">
        {/* Header */}
        <div className="flex flex-col lg:flex-row gap-8 mb-8">
          {/* Profile Section */}
          <Card className="lg:w-80 shadow-lg border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader className="text-center">
              <Avatar className="w-20 h-20 mx-auto mb-4">
              <AvatarImage src={userData.avatar || "/placeholder.svg"} />
              <AvatarFallback className="text-2xl">{userData.name?.[0]}</AvatarFallback>
              </Avatar>
              <CardTitle className="text-xl">{userData.name}</CardTitle>
              <CardDescription>@{userData.username}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">{userData.bio}</p>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              Joined{" "}
              {userData.joinedDate ? new Date(userData.joinedDate).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
              }) : "-"}
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="text-center">
              <div className="text-2xl font-bold text-primary">{userData.stats?.articles ?? 0}</div>
              <div className="text-xs text-muted-foreground">Articles</div>
              </div>
              <div className="text-center">
              <div className="text-2xl font-bold text-primary">{userData.stats?.followers?.toLocaleString() ?? 0}</div>
              <div className="text-xs text-muted-foreground">Followers</div>
              </div>
              <div className="text-center">
              <div className="text-2xl font-bold text-primary">{userData.stats?.following ?? 0}</div>
              <div className="text-xs text-muted-foreground">Following</div>
              </div>
              <div className="text-center">
              <div className="text-2xl font-bold text-primary">{userData.stats?.totalViews?.toLocaleString() ?? 0}</div>
              <div className="text-xs text-muted-foreground">Total Views</div>
              </div>
              </div>
              
              <Button className="w-full" asChild>
              <Link href="/settings">Edit Profile</Link>
              </Button>
              </CardContent>
          </Card>

          {/* Main Content */}
          <div className="flex-1">
            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button size="lg" asChild className="flex-1 h-14 text-lg">
                <Link href="/editor">
                  <PenTool className="w-5 h-5 mr-2" />
                  Write New Article
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="flex-1 h-14 text-lg bg-transparent">
                <Link href="/analytics">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  View Analytics
                </Link>
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Views</p>
                      <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                        {userData.stats?.totalViews?.toLocaleString() ?? "0"}
                      </p>
                    </div>
                    <Eye className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 border-red-200 dark:border-red-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-red-600 dark:text-red-400">Total Likes</p>
                      <p className="text-2xl font-bold text-red-900 dark:text-red-100">
                        {userData.stats?.totalLikes?.toLocaleString() ?? "0"}
                      </p>
                    </div>
                    <Heart className="w-8 h-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600 dark:text-green-400">Published</p>
                      <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                        {publishedArticles.length}
                      </p>
                    </div>
                    <BookOpen className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Followers</p>
                      <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                        {userData.stats?.followers?.toLocaleString() ?? "0"}
                      </p>
                    </div>
                    <Users className="w-8 h-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Articles Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="published">Published ({publishedArticles.length})</TabsTrigger>
                <TabsTrigger value="drafts">Drafts ({draftArticles.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                      <CardDescription>Your latest articles and their performance</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {publishedArticles.slice(0, 3).map((article) => (
                          <div
                            key={article.id}
                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex-1">
                              <h4 className="font-medium mb-1">{article.title}</h4>
                              <p className="text-sm text-muted-foreground mb-2">{article.excerpt}</p>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Eye className="w-3 h-3" />
                                  {article.views}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Heart className="w-3 h-3" />
                                  {article.likes}
                                </span>
                                <span className="flex items-center gap-1">
                                  <MessageCircle className="w-3 h-3" />
                                  {article.comments}
                                </span>
                              </div>
                            </div>
                            <Badge variant="secondary">{article.status}</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="published" className="mt-6">
                <div className="space-y-4">
                  {publishedArticles.map((article) => (
                    <Card key={article.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-semibold">{article.title}</h3>
                              <Badge
                                variant="secondary"
                                className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              >
                                Published
                              </Badge>
                            </div>
                            <p className="text-muted-foreground mb-4">{article.excerpt}</p>

                            <div className="flex items-center gap-6 text-sm text-muted-foreground">
                              <span>Published {new Date(article.publishedAt!).toLocaleDateString()}</span>
                              <span className="flex items-center gap-1">
                                <Eye className="w-4 h-4" />
                                {article.views} views
                              </span>
                              <span className="flex items-center gap-1">
                                <Heart className="w-4 h-4" />
                                {article.likes} likes
                              </span>
                              <span className="flex items-center gap-1">
                                <MessageCircle className="w-4 h-4" />
                                {article.comments} comments
                              </span>
                            </div>
                          </div>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/article/${article.id}`}>
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Article
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/editor/${article.id}`}>
                                  <Edit3 className="w-4 h-4 mr-2" />
                                  Edit
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="drafts" className="mt-6">
                <div className="space-y-4">
                  {draftArticles.map((article) => (
                    <Card key={article.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-semibold">{article.title}</h3>
                              <Badge
                                variant="outline"
                                className="border-yellow-300 text-yellow-700 dark:border-yellow-600 dark:text-yellow-400"
                              >
                                Draft
                              </Badge>
                            </div>
                            <p className="text-muted-foreground mb-4">{article.excerpt}</p>

                            <div className="flex items-center gap-4">
                              <Button asChild>
                                <Link href={`/editor/${article.id}`}>
                                  <Edit3 className="w-4 h-4 mr-2" />
                                  Continue Writing
                                </Link>
                              </Button>
                              <Button variant="outline" size="sm">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Draft
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {draftArticles.length === 0 && (
                    <Card>
                      <CardContent className="p-12 text-center">
                        <PenTool className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No drafts yet</h3>
                        <p className="text-muted-foreground mb-4">
                          Start writing your next article and save it as a draft.
                        </p>
                        <Button asChild>
                          <Link href="/editor">
                            <PenTool className="w-4 h-4 mr-2" />
                            Start Writing
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
