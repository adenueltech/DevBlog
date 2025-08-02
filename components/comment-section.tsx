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

export function CommentSection({ articleId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return

    setIsSubmitting(true)

    try {
      // TODO: Replace with actual API call to post comment
      // const response = await fetch(`/api/articles/${articleId}/comments`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`
      //   },
      //   body: JSON.stringify({ content: newComment })
      // })
      // const newCommentData = await response.json()
      // setComments([newCommentData, ...comments])
      
      setNewComment("")
      setIsSubmitting(false)

      toast({
        title: "Comment functionality ready",
        description: "Comment posting will be available when backend API is implemented.",
      })
    } catch (error) {
      setIsSubmitting(false)
      toast({
        title: "Error",
        description: "Failed to post comment. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleSubmitReply = async (parentId: string) => {
    if (!replyContent.trim()) return

    setIsSubmitting(true)

    try {
      // TODO: Replace with actual API call to post reply
      // const response = await fetch(`/api/comments/${parentId}/replies`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`
      //   },
      //   body: JSON.stringify({ content: replyContent })
      // })
      // const newReply = await response.json()
      // setComments(
      //   comments.map((comment) => {
      //     if (comment.id === parentId) {
      //       return {
      //         ...comment,
      //         replies: [...(comment.replies || []), newReply],
      //       }
      //     }
      //     return comment
      //   }),
      // )

      setReplyContent("")
      setReplyingTo(null)
      setIsSubmitting(false)

      toast({
        title: "Reply functionality ready",
        description: "Reply posting will be available when backend API is implemented.",
      })
    } catch (error) {
      setIsSubmitting(false)
      toast({
        title: "Error",
        description: "Failed to post reply. Please try again.",
        variant: "destructive"
      })
    }
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
            {/* TODO: Add author badge logic when user roles are implemented */}
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
                {/* TODO: Add delete option for comment author when user auth is implemented */}
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
