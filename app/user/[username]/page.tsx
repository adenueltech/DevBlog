"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { ArticleCard } from "@/components/article-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Link as LinkIcon, 
  Users, 
  BookOpen, 
  Eye, 
  Heart,
  UserPlus,
  UserCheck
} from "lucide-react"

export default function UserProfilePage() {
  const params = useParams()
  const [user, setUser] = useState<any>(null)
  const [userArticles, setUserArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isFollowing, setIsFollowing] = useState(false)
  const [activeTab, setActiveTab] = useState("articles")

  useEffect(() => {
    async function fetchUserData() {
      try {
        // Fetch user data
        const userRes = await fetch(`http://localhost:3000/users`)
        if (userRes.ok) {
          const users = await userRes.json()
          console.log("All users:", users)
          console.log("Looking for username:", params.username)
          
          const foundUser = users.find((u: any) => {
            const userUsername = u.username || u.name?.toLowerCase().replace(/\s+/g, '') || `user${u.id}` || u.email?.split('@')[0]
            console.log("Checking user:", u.name, "username:", userUsername, "looking for:", params.username)
            return userUsername === params.username || u.id.toString() === params.username
          })
          
          console.log("Found user:", foundUser)
          
          if (foundUser) {
            setUser(foundUser)
            
            // Fetch user's articles
            const articlesRes = await fetch(`http://localhost:3000/articles`)
            if (articlesRes.ok) {
              const allArticles = await articlesRes.json()
              const userArticles = allArticles.filter((article: any) => article.authorId === foundUser.id)
              setUserArticles(userArticles)
            }
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setLoading(false)
      }
    }

    if (params.username) {
      fetchUserData()
    }
  }, [params.username])

  const handleFollow = () => {
    setIsFollowing(!isFollowing)
    // TODO: Implement actual follow/unfollow API call
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-24">
          <div className="text-center">
            <div className="text-lg">Loading profile...</div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-24">
          <div className="text-center">
            <div className="text-lg">User not found</div>
            <Link href="/">
              <Button className="mt-4">Back to Home</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const publishedArticles = userArticles.filter(article => article.status === 'published')
  const totalViews = publishedArticles.reduce((sum, article) => sum + (article.views || 0), 0)
  const totalLikes = publishedArticles.reduce((sum, article) => sum + (article.likes || 0), 0)

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24">
        {/* Back Button */}
        <div className="container mx-auto px-4 mb-6">
          <Button variant="ghost" asChild>
            <Link href="/" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
          </Button>
        </div>

        {/* Profile Header */}
        <div className="container mx-auto px-4 mb-8">
          <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Avatar and Basic Info */}
                <div className="flex flex-col items-center md:items-start">
                  <Avatar className="w-32 h-32 mb-4">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="text-4xl">{user.name?.[0] || "U"}</AvatarFallback>
                  </Avatar>
                  <Button 
                    onClick={handleFollow}
                    className={`w-full md:w-auto ${isFollowing ? 'bg-green-600 hover:bg-green-700' : ''}`}
                  >
                    {isFollowing ? (
                      <>
                        <UserCheck className="w-4 h-4 mr-2" />
                        Following
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Follow
                      </>
                    )}
                  </Button>
                </div>

                {/* Profile Details */}
                <div className="flex-1">
                  <h1 className="text-3xl font-bold font-serif mb-2">{user.name}</h1>
                  <p className="text-muted-foreground mb-4">@{user.username || user.name?.toLowerCase().replace(/\s+/g, '') || `user${user.id}` || user.email?.split('@')[0]}</p>
                  
                  {user.bio && (
                    <p className="text-lg mb-4 leading-relaxed">{user.bio}</p>
                  )}

                  <div className="flex flex-wrap gap-4 mb-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Joined {new Date(user.createdAt).toLocaleDateString('en-US', { 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </div>
                    {user.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {user.location}
                      </div>
                    )}
                    {user.website && (
                      <div className="flex items-center gap-1">
                        <LinkIcon className="w-4 h-4" />
                        <a 
                          href={user.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:text-primary transition-colors"
                        >
                          {user.website}
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-primary/5 rounded-lg">
                      <div className="text-2xl font-bold text-primary">{publishedArticles.length}</div>
                      <div className="text-sm text-muted-foreground">Articles</div>
                    </div>
                    <div className="text-center p-4 bg-blue-500/5 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{totalViews.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Total Views</div>
                    </div>
                    <div className="text-center p-4 bg-red-500/5 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">{totalLikes}</div>
                      <div className="text-sm text-muted-foreground">Total Likes</div>
                    </div>
                    <div className="text-center p-4 bg-green-500/5 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">0</div>
                      <div className="text-sm text-muted-foreground">Followers</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Tabs */}
        <div className="container mx-auto px-4 pb-16">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="articles" className="gap-2">
                <BookOpen className="w-4 h-4" />
                Articles ({publishedArticles.length})
              </TabsTrigger>
              <TabsTrigger value="about" className="gap-2">
                <Users className="w-4 h-4" />
                About
              </TabsTrigger>
            </TabsList>

            <TabsContent value="articles" className="mt-8">
              {publishedArticles.length > 0 ? (
                <div className="space-y-6">
                  {publishedArticles.map((article, index) => (
                    <div key={article.id} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                      <ArticleCard article={article} />
                    </div>
                  ))}
                </div>
              ) : (
                <Card className="text-center py-12">
                  <CardContent>
                    <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No articles yet</h3>
                    <p className="text-muted-foreground">This user hasn't published any articles yet.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="about" className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>About {user.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Bio</h4>
                    <p className="text-muted-foreground">
                      {user.bio || "This user hasn't added a bio yet."}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Activity</h4>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div>Published {publishedArticles.length} articles</div>
                      <div>Joined {new Date(user.createdAt).toLocaleDateString()}</div>
                      <div>Total article views: {totalViews.toLocaleString()}</div>
                    </div>
                  </div>

                  {user.website && (
                    <div>
                      <h4 className="font-semibold mb-2">Website</h4>
                      <a 
                        href={user.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {user.website}
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}