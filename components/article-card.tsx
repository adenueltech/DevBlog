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
    tags: string[]
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

  // Create slug from title for URL
  const slug = article.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")

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
        <Link href={`/article/${slug}`}>
          <div className="relative">
            {article.coverImage && (
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={article.coverImage || "/placeholder.svg"}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>
            )}
            <div className="absolute top-4 left-4">
              <Badge className="bg-primary/90 text-primary-foreground">Featured</Badge>
            </div>
          </div>

          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={article.author.avatar || "/placeholder.svg"} />
                <AvatarFallback>{article.author.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm">{article.author.name}</p>
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

            <h2 className="text-2xl font-bold font-serif mb-3 group-hover:text-primary transition-colors line-clamp-2">
              {article.title}
            </h2>
            <p className="text-muted-foreground mb-4 line-clamp-3 leading-relaxed">{article.excerpt}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {article.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Link>

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
              <Button variant="ghost" size="sm" className="hover:bg-blue-50 hover:text-blue-600">
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
      <Link href={`/article/${slug}`}>
        <div className="flex">
          {article.coverImage && (
            <div className="relative w-32 h-32 flex-shrink-0">
              <Image
                src={article.coverImage || "/placeholder.svg"}
                alt={article.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}

          <CardContent className="flex-1 p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={article.author.avatar || "/placeholder.svg"} />
                <AvatarFallback className="text-xs">{article.author.name[0]}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{article.author.name}</span>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs text-muted-foreground">
                {new Date(article.publishedAt).toLocaleDateString()}
              </span>
            </div>

            <h3 className="font-bold font-serif mb-2 group-hover:text-primary transition-colors line-clamp-2">
              {article.title}
            </h3>

            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{article.excerpt}</p>

            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {article.tags.slice(0, 2).map((tag) => (
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
      </Link>
    </Card>
  )
}
