"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import {
  Heart,
  Bookmark,
  Share2,
  Eye,
  Clock,
  Calendar,
  ArrowLeft,
  Twitter,
  Facebook,
  Linkedin,
  Copy,
  MoreHorizontal,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { CommentSection } from "@/components/comment-section"

// No mock data - use only real backend data

export default function ArticlePage() {
  const params = useParams()
  const { toast } = useToast()
  const [article, setArticle] = useState<any>(null)
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState(true)

  // Fetch article data from database
  useEffect(() => {
    async function fetchArticle() {
      try {
        // Try to fetch by ID first (if slug is numeric), then by slug
        let response = await fetch(`http://localhost:3000/articles/${params.slug}`)
        
        if (!response.ok && !isNaN(Number(params.slug))) {
          // If slug is numeric, try as ID
          response = await fetch(`http://localhost:3000/articles/${params.slug}`)
        }
        
        if (response.ok) {
          const articleData = await response.json()
          // Transform backend data to match expected format
          const transformedArticle = {
            ...articleData,
            author: {
              ...articleData.author,
              username: articleData.author.username || articleData.author.name?.toLowerCase().replace(/\s+/g, '') || `user${articleData.author.id}`,
              avatar: articleData.author.avatar || "/placeholder.svg",
            },
            tags: articleData.tags ? articleData.tags.split(',') : [],
            isLiked: false,
            isBookmarked: false,
          }
          setArticle(transformedArticle)
          setIsLiked(transformedArticle.isLiked)
          setIsBookmarked(transformedArticle.isBookmarked)
          setLikesCount(transformedArticle.likes || 0)
        } else {
          setArticle(null)
        }
      } catch (error) {
        console.error("Error fetching article:", error)
        setArticle(null)
      } finally {
        setLoading(false)
      }
    }

    if (params.slug) {
      fetchArticle()
    }
  }, [params.slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-24">
          <div className="text-center">
            <div className="text-lg">Loading article...</div>
          </div>
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-24">
          <div className="text-center">
            <div className="text-lg">Article not found</div>
          </div>
        </div>
      </div>
    )
  }

  const handleLike = async () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLiked(!isLiked)
      setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1))
      setIsLoading(false)
      toast({
        title: isLiked ? "Removed from likes" : "Added to likes",
        description: isLiked ? "Article removed from your likes" : "Article added to your likes",
      })
    }, 500)
  }

  const handleBookmark = async () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsBookmarked(!isBookmarked)
      setIsLoading(false)
      toast({
        title: isBookmarked ? "Removed from bookmarks" : "Added to bookmarks",
        description: isBookmarked ? "Article removed from your bookmarks" : "Article saved to your bookmarks",
      })
    }, 500)
  }

  const handleShare = async (platform?: string) => {
    const url = window.location.href
    const title = article.title

    if (platform === "copy") {
      await navigator.clipboard.writeText(url)
      toast({
        title: "Link copied!",
        description: "Article link has been copied to your clipboard.",
      })
      return
    }

    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    }

    if (platform && shareUrls[platform as keyof typeof shareUrls]) {
      window.open(shareUrls[platform as keyof typeof shareUrls], "_blank", "width=600,height=400")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <article className="pt-24">
        {/* Back Button */}
        <div className="container mx-auto px-4 mb-6">
          <Button variant="ghost" asChild>
            <Link href="/" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Articles
            </Link>
          </Button>
        </div>

        {/* Article Header */}
        <header className="container mx-auto px-4 mb-8">
          <div className="max-w-4xl mx-auto">
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {(article.tags || []).map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="hover:bg-primary hover:text-primary-foreground cursor-pointer"
                >
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-serif mb-6 leading-tight">
              {article.title}
            </h1>

            {/* Excerpt */}
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">{article.excerpt}</p>

            {/* Author and Meta Info */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div className="flex items-center gap-4">
                <Link href={`/user/${article.author.username || article.author.email?.split('@')[0]}`}>
                  <Avatar className="w-12 h-12 cursor-pointer hover:ring-2 hover:ring-primary transition-all">
                    <AvatarImage src={article.author.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{article.author.name?.[0] || "U"}</AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/user/${article.author.username || article.author.email?.split('@')[0]}`}
                      className="font-semibold hover:text-primary transition-colors"
                    >
                      {article.author.name}
                    </Link>
                    <Button variant="outline" size="sm">
                      Follow
                    </Button>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(article.publishedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {article.readTime} min read
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {article.views.toLocaleString()} views
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <Button
                  variant={isLiked ? "default" : "outline"}
                  size="sm"
                  onClick={handleLike}
                  disabled={isLoading}
                  className="gap-2"
                >
                  <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
                  {likesCount}
                </Button>

                <Button
                  variant={isBookmarked ? "default" : "outline"}
                  size="sm"
                  onClick={handleBookmark}
                  disabled={isLoading}
                  className="gap-2"
                >
                  <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`} />
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                      <Share2 className="w-4 h-4" />
                      Share
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleShare("twitter")} className="gap-2">
                      <Twitter className="w-4 h-4" />
                      Share on Twitter
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShare("facebook")} className="gap-2">
                      <Facebook className="w-4 h-4" />
                      Share on Facebook
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShare("linkedin")} className="gap-2">
                      <Linkedin className="w-4 h-4" />
                      Share on LinkedIn
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShare("copy")} className="gap-2">
                      <Copy className="w-4 h-4" />
                      Copy Link
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Report Article</DropdownMenuItem>
                    <DropdownMenuItem>Block Author</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Cover Image */}
            {article.coverImage && (
              <div className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden mb-8">
                <Image
                  src={article.coverImage || "/placeholder.svg"}
                  alt={article.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}
          </div>
        </header>

        {/* Article Content */}
        <div className="container mx-auto px-4 mb-12">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-serif prose-headings:font-bold prose-p:leading-relaxed prose-pre:bg-muted prose-pre:border">
              {/* This would be replaced with a proper markdown renderer like react-markdown */}
              <div className="whitespace-pre-wrap font-serif text-lg leading-relaxed">{article.content}</div>
            </div>
          </div>
        </div>

        {/* Article Footer */}
        <div className="container mx-auto px-4 mb-12">
          <div className="max-w-4xl mx-auto">
            <Separator className="mb-8" />

            {/* Tags */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {(article.tags || []).map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="hover:bg-primary hover:text-primary-foreground cursor-pointer"
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Author Card */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Link href={`/user/${article.author.username || article.author.email?.split('@')[0]}`}>
                    <Avatar className="w-16 h-16 cursor-pointer hover:ring-2 hover:ring-primary transition-all">
                      <AvatarImage src={article.author.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="text-xl">{article.author.name?.[0] || "U"}</AvatarFallback>
                    </Avatar>
                  </Link>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <Link
                        href={`/user/${article.author.username || article.author.email?.split('@')[0]}`}
                        className="text-xl font-semibold hover:text-primary transition-colors"
                      >
                        {article.author.name}
                      </Link>
                      <Button variant="outline">Follow</Button>
                    </div>
                    <p className="text-muted-foreground mb-3">{article.author.bio || "No bio available"}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{(article.author.followers || 0).toLocaleString()} followers</span>
                      <span>{(article.author.following || 0).toLocaleString()} following</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Engagement Stats */}
            <div className="flex items-center justify-center gap-8 py-6 bg-muted/20 rounded-lg mb-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{likesCount}</div>
                <div className="text-sm text-muted-foreground">Likes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{article.comments}</div>
                <div className="text-sm text-muted-foreground">Comments</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{article.views.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Views</div>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div id="comments" className="container mx-auto px-4 pb-16">
          <div className="max-w-4xl mx-auto">
            <CommentSection articleId={article.id} />
          </div>
        </div>
      </article>
    </div>
  )
}
