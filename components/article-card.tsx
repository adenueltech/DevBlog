"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, Bookmark, Share2, Clock } from "lucide-react"

interface ArticleCardProps {
  article: {
    id: string
    title: string
    excerpt: string
    coverImage?: string
    author: {
      name: string
      avatar?: string
      username: string
    }
    publishedAt: string
    readTime: number
    tags?: string[]
    likes: number
    comments: number
    isLiked?: boolean
    isBookmarked?: boolean
  }
  variant?: "default" | "featured" | "compact"
}

export function ArticleCard({ article, variant = "default" }: ArticleCardProps) {
  const [isLiked, setIsLiked] = useState(article.isLiked || false)
  const [isBookmarked, setIsBookmarked] = useState(article.isBookmarked || false)
  const [likesCount, setLikesCount] = useState(article.likes)

  // Use article ID for URL
  const articleUrl = `/article/${article.id}`
  
  // Generate user profile URL - use username directly from mock data
  const userProfileUrl = `/user/${article.author.username}`

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsLiked(!isLiked)
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1))
  }

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsBookmarked(!isBookmarked)
  }

  if (variant === "featured") {
    return (
      <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-background to-muted/20">
        <div className="relative">
          {article.coverImage && (
            <Link href={articleUrl}>
              <div className="relative h-64 overflow-hidden cursor-pointer">
                <Image
                  src={article.coverImage || "/placeholder.svg"}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>
            </Link>
          )}
          <div className="absolute top-4 left-4">
            <Badge className="bg-primary/90 text-primary-foreground">Featured</Badge>
          </div>
        </div>

        <CardContent className="p-6">
          <div className="flex items-start space-x-4 mb-4">
            <Link href={userProfileUrl}>
              <Avatar className="h-12 w-12 flex-shrink-0 cursor-pointer hover:ring-2 hover:ring-primary transition-all">
                <AvatarImage src={article.author.avatar || "/placeholder.svg"} />
                <AvatarFallback>{article.author.name?.[0] || "U"}</AvatarFallback>
              </Avatar>
            </Link>
            <div className="flex-1 min-w-0 space-y-1">
              <Link href={userProfileUrl} className="block">
                <p className="font-medium text-sm hover:text-primary transition-colors">{article.author.name}</p>
              </Link>
              <div className="flex items-center text-xs text-muted-foreground space-x-2">
                <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                <span>•</span>
                <div className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {article.readTime} min read
                </div>
              </div>
            </div>
          </div>

          <Link href={articleUrl}>
            <h2 className="text-2xl font-bold font-serif mb-3 hover:text-primary transition-colors line-clamp-2 cursor-pointer">
              {article.title}
            </h2>
          </Link>
          <Link href={articleUrl}>
            <p className="text-muted-foreground mb-4 line-clamp-3 leading-relaxed cursor-pointer hover:text-foreground transition-colors">{article.excerpt}</p>
          </Link>

          <div className="flex flex-wrap gap-2 mb-4">
            {(article.tags || []).slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>

        <CardFooter className="px-6 py-4 border-t bg-muted/20">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={`hover:bg-red-50 hover:text-red-600 ${isLiked ? "text-red-600" : ""}`}
              >
                <Heart className={`w-4 h-4 mr-1 ${isLiked ? "fill-current" : ""}`} />
                {likesCount}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-blue-50 hover:text-blue-600"
                onClick={(e) => {
                  e.preventDefault()
                  window.location.href = `${articleUrl}#comments`
                }}
              >
                <MessageCircle className="w-4 h-4 mr-1" />
                {article.comments}
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBookmark}
                className={`hover:bg-yellow-50 hover:text-yellow-600 ${isBookmarked ? "text-yellow-600" : ""}`}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`} />
              </Button>
              <Button variant="ghost" size="sm" className="hover:bg-green-50 hover:text-green-600">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm">
      <div className="flex">
        {article.coverImage && (
          <Link href={articleUrl}>
            <div className="relative w-32 h-32 flex-shrink-0 cursor-pointer">
              <Image
                src={article.coverImage || "/placeholder.svg"}
                alt={article.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          </Link>
        )}

        <CardContent className="flex-1 p-4">
          <div className="flex items-center space-x-3 mb-2">
            <Link href={userProfileUrl}>
              <Avatar className="h-8 w-8 flex-shrink-0 cursor-pointer hover:ring-2 hover:ring-primary transition-all">
                <AvatarImage src={article.author.avatar || "/placeholder.svg"} />
                <AvatarFallback className="text-xs">{article.author.name?.[0] || "U"}</AvatarFallback>
              </Avatar>
            </Link>
            <div className="flex-1 min-w-0">
              <Link href={userProfileUrl}>
                <span className="text-sm font-medium hover:text-primary transition-colors block truncate">{article.author.name}</span>
              </Link>
              <div className="flex items-center text-xs text-muted-foreground space-x-2">
                <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <Link href={articleUrl}>
            <h3 className="font-bold font-serif mb-2 hover:text-primary transition-colors line-clamp-2 cursor-pointer">
              {article.title}
            </h3>
          </Link>

          <Link href={articleUrl}>
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2 cursor-pointer hover:text-foreground transition-colors">{article.excerpt}</p>
          </Link>

          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-1">
              {(article.tags || []).slice(0, 2).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex items-center space-x-3 text-xs text-muted-foreground">
              <div className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {article.readTime}m
              </div>
              <div className="flex items-center">
                <Heart className="w-3 h-3 mr-1" />
                {likesCount}
              </div>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}
