"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Heart, MessageCircle, MoreHorizontal, Reply, Flag, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Comment {
  id: string
  content: string
  author: {
    id: string
    name: string
    username: string
    avatar?: string
  }
  createdAt: string
  likes: number
  isLiked: boolean
  replies?: Comment[]
}

interface CommentSectionProps {
  articleId: string
}

// Mock comments data
const mockComments: Comment[] = [
  {
    id: "1",
    content:
      "Great article! The explanation of Server Actions is particularly helpful. I've been struggling with understanding how to implement them properly, and this cleared up a lot of confusion.",
    author: {
      id: "user-1",
      name: "Alex Rodriguez",
      username: "alexrod",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    createdAt: "2024-01-16T08:30:00Z",
    likes: 12,
    isLiked: false,
    replies: [
      {
        id: "1-1",
        content: "Thanks Alex! I'm glad it helped. Server Actions are definitely a game-changer for form handling.",
        author: {
          id: "author-1",
          name: "Sarah Chen",
          username: "sarahchen",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        createdAt: "2024-01-16T09:15:00Z",
        likes: 5,
        isLiked: true,
      },
    ],
  },
  {
    id: "2",
    content:
      "The performance improvements with Turbopack are incredible! We've seen a 5x speed improvement in our development builds. Can't wait for it to be stable.",
    author: {
      id: "user-2",
      name: "Emily Watson",
      username: "emilyw",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    createdAt: "2024-01-16T10:45:00Z",
    likes: 8,
    isLiked: true,
  },
  {
    id: "3",
    content:
      "Quick question: Do you have any recommendations for testing Server Actions? I'm having trouble writing unit tests for them.",
    author: {
      id: "user-3",
      name: "Michael Johnson",
      username: "mikej",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    createdAt: "2024-01-16T11:20:00Z",
    likes: 3,
    isLiked: false,
  },
]

export function CommentSection({ articleId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(mockComments)
  const [newComment, setNewComment] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      const comment: Comment = {
        id: Date.now().toString(),
        content: newComment,
        author: {
          id: "current-user",
          name: "John Doe",
          username: "johndoe",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        createdAt: new Date().toISOString(),
        likes: 0,
        isLiked: false,
      }

      setComments([comment, ...comments])
      setNewComment("")
      setIsSubmitting(false)

      toast({
        title: "Comment posted!",
        description: "Your comment has been added to the discussion.",
      })
    }, 1000)
  }

  const handleSubmitReply = async (parentId: string) => {
    if (!replyContent.trim()) return

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      const reply: Comment = {
        id: `${parentId}-${Date.now()}`,
        content: replyContent,
        author: {
          id: "current-user",
          name: "John Doe",
          username: "johndoe",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        createdAt: new Date().toISOString(),
        likes: 0,
        isLiked: false,
      }

      setComments(
        comments.map((comment) => {
          if (comment.id === parentId) {
            return {
              ...comment,
              replies: [...(comment.replies || []), reply],
            }
          }
          return comment
        }),
      )

      setReplyContent("")
      setReplyingTo(null)
      setIsSubmitting(false)

      toast({
        title: "Reply posted!",
        description: "Your reply has been added to the discussion.",
      })
    }, 1000)
  }

  const handleLikeComment = (commentId: string, isReply = false, parentId?: string) => {
    if (isReply && parentId) {
      setComments(
        comments.map((comment) => {
          if (comment.id === parentId) {
            return {
              ...comment,
              replies: comment.replies?.map((reply) => {
                if (reply.id === commentId) {
                  return {
                    ...reply,
                    isLiked: !reply.isLiked,
                    likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1,
                  }
                }
                return reply
              }),
            }
          }
          return comment
        }),
      )
    } else {
      setComments(
        comments.map((comment) => {
          if (comment.id === commentId) {
            return {
              ...comment,
              isLiked: !comment.isLiked,
              likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
            }
          }
          return comment
        }),
      )
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
    return date.toLocaleDateString()
  }

  const CommentItem = ({
    comment,
    isReply = false,
    parentId,
  }: { comment: Comment; isReply?: boolean; parentId?: string }) => (
    <div className={`${isReply ? "ml-12 mt-4" : ""}`}>
      <div className="flex items-start gap-3">
        <Avatar className="w-10 h-10">
          <AvatarImage src={comment.author.avatar || "/placeholder.svg"} />
          <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold text-sm">{comment.author.name}</span>
            <span className="text-xs text-muted-foreground">@{comment.author.username}</span>
            {comment.author.id === "author-1" && (
              <Badge variant="secondary" className="text-xs">
                Author
              </Badge>
            )}
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs text-muted-foreground">{formatDate(comment.createdAt)}</span>
          </div>

          <p className="text-sm mb-3 leading-relaxed">{comment.content}</p>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleLikeComment(comment.id, isReply, parentId)}
              className={`h-8 px-2 gap-1 ${comment.isLiked ? "text-red-600" : "text-muted-foreground"}`}
            >
              <Heart className={`w-4 h-4 ${comment.isLiked ? "fill-current" : ""}`} />
              {comment.likes > 0 && <span className="text-xs">{comment.likes}</span>}
            </Button>

            {!isReply && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                className="h-8 px-2 gap-1 text-muted-foreground"
              >
                <Reply className="w-4 h-4" />
                <span className="text-xs">Reply</span>
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="gap-2">
                  <Flag className="w-4 h-4" />
                  Report
                </DropdownMenuItem>
                {comment.author.id === "current-user" && (
                  <DropdownMenuItem className="gap-2 text-destructive">
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Reply Form */}
          {replyingTo === comment.id && (
            <div className="mt-4 p-4 bg-muted/20 rounded-lg">
              <Textarea
                placeholder={`Reply to ${comment.author.name}...`}
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="mb-3 min-h-[80px] resize-none"
              />
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={() => handleSubmitReply(comment.id)}
                  disabled={!replyContent.trim() || isSubmitting}
                >
                  {isSubmitting ? "Posting..." : "Post Reply"}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setReplyingTo(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4">
              {comment.replies.map((reply) => (
                <CommentItem key={reply.id} comment={reply} isReply={true} parentId={comment.id} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Comments ({comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Comment Form */}
        <div className="space-y-4">
          <Textarea
            placeholder="Share your thoughts on this article..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[100px] resize-none"
          />
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">Be respectful and constructive in your comments.</p>
            <Button onClick={handleSubmitComment} disabled={!newComment.trim() || isSubmitting}>
              {isSubmitting ? "Posting..." : "Post Comment"}
            </Button>
          </div>
        </div>

        {/* Comments List */}
        <div className="space-y-6">
          {comments.length > 0 ? (
            comments.map((comment) => <CommentItem key={comment.id} comment={comment} />)
          ) : (
            <div className="text-center py-8">
              <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No comments yet</h3>
              <p className="text-muted-foreground">Be the first to share your thoughts on this article!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
