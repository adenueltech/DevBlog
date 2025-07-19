"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, TrendingUp, Users, BookOpen, Sparkles } from "lucide-react"

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentWordIndex, setCurrentWordIndex] = useState(0)

  const rotatingWords = ["Developers", "Engineers", "Creators", "Innovators", "Builders"]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % rotatingWords.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const stats = [
    { icon: Users, label: "Active Writers", value: "10K+" },
    { icon: BookOpen, label: "Articles Published", value: "50K+" },
    { icon: TrendingUp, label: "Monthly Readers", value: "1M+" },
  ]

  const trendingTopics = ["React", "Next.js", "TypeScript", "AI/ML", "Web3", "DevOps"]

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-muted/20 pt-16">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-primary/5 to-blue-500/5 rounded-full blur-3xl animate-spin-slow" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main Heading */}
          <div className="mb-6 animate-fade-in">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors">
              <Sparkles className="w-3 h-3 mr-1" />
              Welcome to the Future of Developer Content
            </Badge>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-serif mb-6 leading-tight">
              Stories by{" "}
              <span className="relative">
                <span className="gradient-text animate-scale-in">{rotatingWords[currentWordIndex]}</span>
              </span>
              <br />
              <span className="text-muted-foreground">for Developers</span>
            </h1>
          </div>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed animate-slide-up">
            Discover in-depth articles, tutorials, and insights from the developer community. Learn, share, and grow
            with thousands of passionate developers.
          </p>

          {/* Search Bar */}
          <div className="mb-8 animate-slide-up delay-200">
            <div className="relative max-w-2xl mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-full blur-xl" />
              <div className="relative flex items-center bg-background border-2 border-muted rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow">
                <Search className="w-5 h-5 text-muted-foreground ml-4" />
                <Input
                  placeholder="Search for articles, topics, or authors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 border-0 bg-transparent text-lg placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <Button size="lg" className="rounded-full px-8">
                  Explore
                </Button>
              </div>
            </div>
          </div>

          {/* Trending Topics */}
          <div className="mb-12 animate-slide-up delay-300">
            <p className="text-sm text-muted-foreground mb-4">Trending topics:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {trendingTopics.map((topic, index) => (
                <Badge
                  key={topic}
                  variant="secondary"
                  className="hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {topic}
                </Badge>
              ))}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-slide-up delay-400">
            <Button
              size="lg"
              asChild
              className="text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              <Link href="/explore">
                Start Reading
                <TrendingUp className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="text-lg px-8 py-6 rounded-full hover:bg-primary hover:text-primary-foreground transition-all hover:scale-105 bg-transparent"
            >
              <Link href="/register">
                Join Community
                <Users className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto animate-slide-up delay-500">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="text-center p-6 rounded-2xl bg-card/50 backdrop-blur-sm border hover:shadow-lg transition-all duration-300 hover:scale-105"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-muted-foreground/30 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  )
}
