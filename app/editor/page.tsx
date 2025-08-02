"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import {
  Save,
  Eye,
  Send,
  ImageIcon,
  Bold,
  Italic,
  LinkIcon,
  List,
  Code,
  Quote,
  Heading1,
  Heading2,
  X,
} from "lucide-react"

export default function EditorPage() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [currentTag, setCurrentTag] = useState("")
  const [coverImage, setCoverImage] = useState("")
  const [isPreview, setIsPreview] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  // Auto-save functionality
  useEffect(() => {
    const autoSave = setTimeout(() => {
      if (title || content) {
        handleSaveDraft()
      }
    }, 30000) // Auto-save every 30 seconds

    return () => clearTimeout(autoSave)
  }, [title, content])

  const handleSaveDraft = async () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Missing content",
        description: "Please add a title and content before saving.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)
    try {
      const token = localStorage.getItem("access_token")
      if (!token) {
        toast({
          title: "Authentication required",
          description: "Please log in to save your article.",
          variant: "destructive",
        })
        setIsSaving(false)
        return
      }

      const response = await fetch("http://localhost:3000/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          content,
          excerpt,
          status: "draft",
        }),
      })

      if (response.ok) {
        toast({
          title: "Draft saved",
          description: "Your article has been saved as a draft.",
        })
      } else {
        throw new Error("Failed to save draft")
      }
    } catch (error) {
      toast({
        title: "Save failed",
        description: "Failed to save your draft. Please try again.",
        variant: "destructive",
      })
    }
    setIsSaving(false)
  }

  const handlePublish = async () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Missing content",
        description: "Please add a title and content before publishing.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)
    try {
      const token = localStorage.getItem("access_token")
      if (!token) {
        toast({
          title: "Authentication required",
          description: "Please log in to publish your article.",
          variant: "destructive",
        })
        setIsSaving(false)
        return
      }

      const response = await fetch("http://localhost:3000/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          content,
          excerpt,
          status: "published",
        }),
      })

      if (response.ok) {
        toast({
          title: "Article published!",
          description: "Your article is now live and visible to readers.",
        })
        // Clear the form after successful publish
        setTitle("")
        setContent("")
        setExcerpt("")
        setTags([])
        setCoverImage("")
      } else {
        throw new Error("Failed to publish article")
      }
    } catch (error) {
      toast({
        title: "Publish failed",
        description: "Failed to publish your article. Please try again.",
        variant: "destructive",
      })
    }
    setIsSaving(false)
  }

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim()) && tags.length < 5) {
      setTags([...tags, currentTag.trim()])
      setCurrentTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const insertMarkdown = (syntax: string) => {
    const textarea = document.getElementById("content") as HTMLTextAreaElement
    if (textarea) {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const selectedText = content.substring(start, end)

      let newText = ""
      switch (syntax) {
        case "bold":
          newText = `**${selectedText || "bold text"}**`
          break
        case "italic":
          newText = `*${selectedText || "italic text"}*`
          break
        case "link":
          newText = `[${selectedText || "link text"}](url)`
          break
        case "code":
          newText = `\`${selectedText || "code"}\``
          break
        case "quote":
          newText = `> ${selectedText || "quote"}`
          break
        case "h1":
          newText = `# ${selectedText || "Heading 1"}`
          break
        case "h2":
          newText = `## ${selectedText || "Heading 2"}`
          break
        case "list":
          newText = `- ${selectedText || "list item"}`
          break
        default:
          newText = selectedText
      }

      const newContent = content.substring(0, start) + newText + content.substring(end)
      setContent(newContent)

      // Focus back to textarea
      setTimeout(() => {
        textarea.focus()
        textarea.setSelectionRange(start + newText.length, start + newText.length)
      }, 0)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 pt-24 pb-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold font-serif">Write Article</h1>
            <p className="text-muted-foreground">Share your knowledge with the developer community</p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handleSaveDraft} disabled={isSaving}>
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Saving..." : "Save Draft"}
            </Button>
            <Button variant="outline" onClick={() => setIsPreview(!isPreview)}>
              <Eye className="w-4 h-4 mr-2" />
              {isPreview ? "Edit" : "Preview"}
            </Button>
            <Button onClick={handlePublish} disabled={isSaving}>
              <Send className="w-4 h-4 mr-2" />
              Publish
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Editor */}
          <div className="lg:col-span-3">
            <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Title */}
                  <div>
                    <Label htmlFor="title" className="text-base font-medium">
                      Title
                    </Label>
                    <Input
                      id="title"
                      placeholder="Enter your article title..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="mt-2 text-lg h-12 border-0 bg-muted/50 focus:bg-background transition-colors"
                    />
                  </div>

                  {/* Excerpt */}
                  <div>
                    <Label htmlFor="excerpt" className="text-base font-medium">
                      Excerpt
                    </Label>
                    <Textarea
                      id="excerpt"
                      placeholder="Write a brief description of your article..."
                      value={excerpt}
                      onChange={(e) => setExcerpt(e.target.value)}
                      className="mt-2 min-h-[80px] border-0 bg-muted/50 focus:bg-background transition-colors resize-none"
                    />
                  </div>

                  {/* Cover Image */}
                  <div>
                    <Label htmlFor="cover" className="text-base font-medium">
                      Cover Image URL (Optional)
                    </Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        id="cover"
                        placeholder="https://example.com/image.jpg"
                        value={coverImage}
                        onChange={(e) => setCoverImage(e.target.value)}
                        className="border-0 bg-muted/50 focus:bg-background transition-colors"
                      />
                      <Button variant="outline" size="icon">
                        <ImageIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Editor Toolbar */}
                  <div className="border-t pt-4">
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Button variant="outline" size="sm" onClick={() => insertMarkdown("bold")}>
                        <Bold className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => insertMarkdown("italic")}>
                        <Italic className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => insertMarkdown("link")}>
                        <LinkIcon className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => insertMarkdown("code")}>
                        <Code className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => insertMarkdown("quote")}>
                        <Quote className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => insertMarkdown("h1")}>
                        <Heading1 className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => insertMarkdown("h2")}>
                        <Heading2 className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => insertMarkdown("list")}>
                        <List className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Content Editor */}
                    <Tabs value={isPreview ? "preview" : "edit"} className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="edit" onClick={() => setIsPreview(false)}>
                          Write
                        </TabsTrigger>
                        <TabsTrigger value="preview" onClick={() => setIsPreview(true)}>
                          Preview
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="edit" className="mt-4">
                        <Textarea
                          id="content"
                          placeholder="Start writing your article... (Markdown supported)"
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                          className="min-h-[500px] border-0 bg-muted/50 focus:bg-background transition-colors resize-none font-mono text-sm"
                        />
                      </TabsContent>

                      <TabsContent value="preview" className="mt-4">
                        <div className="min-h-[500px] p-6 border rounded-lg bg-muted/20">
                          {content ? (
                            <div className="prose prose-lg max-w-none dark:prose-invert">
                              {/* This would be replaced with a proper markdown renderer */}
                              <div className="whitespace-pre-wrap font-serif leading-relaxed">{content}</div>
                            </div>
                          ) : (
                            <div className="text-center text-muted-foreground py-20">
                              <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
                              <p>Nothing to preview yet. Start writing to see your content here.</p>
                            </div>
                          )}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tags</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a tag..."
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addTag()}
                    className="text-sm"
                  />
                  <Button onClick={addTag} size="sm" disabled={tags.length >= 5}>
                    Add
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>

                <p className="text-xs text-muted-foreground">Add up to 5 tags to help readers find your article</p>
              </CardContent>
            </Card>

            {/* Publishing Options */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Publishing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Status</Label>
                  <Badge variant="outline" className="w-fit">
                    Draft
                  </Badge>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Visibility</Label>
                  <p className="text-sm text-muted-foreground">This article will be public when published</p>
                </div>

                <div className="pt-4 space-y-2">
                  <Button
                    className="w-full"
                    onClick={handlePublish}
                    disabled={!title.trim() || !content.trim() || isSaving}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Publish Article
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={handleSaveDraft}
                    disabled={isSaving}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save as Draft
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Writing Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Writing Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <p>Use clear, descriptive headings to structure your content</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <p>Include code examples and practical tips</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <p>Add relevant tags to help readers discover your article</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <p>Write a compelling excerpt to summarize your article</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
