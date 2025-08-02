"use client"

import { useState } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Eye,
  Heart,
  MessageCircle,
  Users,
  Calendar,
  Clock,
  Globe,
  Smartphone,
  Monitor,
  BarChart3,
  PieChart,
  Activity,
} from "lucide-react"

import { useEffect } from "react";

function useAnalyticsData() {
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const res = await fetch("http://localhost:3000/analytics/me", { credentials: "include" });
      const data = await res.json();
      setAnalyticsData(data);
      setLoading(false);
    }
    fetchData();
  }, []);

  return { analyticsData, loading };
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30d");
  const [activeTab, setActiveTab] = useState("overview");
  const { analyticsData, loading } = useAnalyticsData();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  if (!analyticsData) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">No analytics data found.</div>;
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const formatPercentage = (num: number) => {
    const sign = num >= 0 ? "+" : ""
    return `${sign}${num.toFixed(1)}%`
  }

  const getChangeIcon = (change: number) => {
    return change >= 0 ? (
      <TrendingUp className="w-4 h-4 text-green-600" />
    ) : (
      <TrendingDown className="w-4 h-4 text-red-600" />
    )
  }

  const getChangeColor = (change: number) => {
    return change >= 0 ? "text-green-600" : "text-red-600"
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 pt-24 pb-16">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" asChild>
            <Link href="/dashboard" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold font-serif">Analytics</h1>
            <p className="text-muted-foreground">Track your content performance and audience insights</p>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="articles" className="gap-2">
              <Activity className="w-4 h-4" />
              Articles
            </TabsTrigger>
            <TabsTrigger value="audience" className="gap-2">
              <Users className="w-4 h-4" />
              Audience
            </TabsTrigger>
            <TabsTrigger value="traffic" className="gap-2">
              <Globe className="w-4 h-4" />
              Traffic
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Eye className="w-8 h-8 text-blue-600" />
                    <div className={`flex items-center gap-1 ${getChangeColor(analyticsData.overview?.viewsChange ?? 0)}`}>
                      {getChangeIcon(analyticsData.overview?.viewsChange ?? 0)}
                      <span className="text-sm font-medium">
                        {formatPercentage(analyticsData.overview?.viewsChange ?? 0)}
                      </span>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    {formatNumber(analyticsData.overview?.totalViews ?? 0)}
                  </div>
                  <p className="text-sm text-blue-600 dark:text-blue-400">Total Views</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 border-red-200 dark:border-red-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Heart className="w-8 h-8 text-red-600" />
                    <div className={`flex items-center gap-1 ${getChangeColor(analyticsData.overview?.likesChange ?? 0)}`}>
                      {getChangeIcon(analyticsData.overview?.likesChange ?? 0)}
                      <span className="text-sm font-medium">
                        {formatPercentage(analyticsData.overview?.likesChange ?? 0)}
                      </span>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-red-900 dark:text-red-100">
                    {formatNumber(analyticsData.overview?.totalLikes ?? 0)}
                  </div>
                  <p className="text-sm text-red-600 dark:text-red-400">Total Likes</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <MessageCircle className="w-8 h-8 text-green-600" />
                    <div className={`flex items-center gap-1 ${getChangeColor(analyticsData.overview?.commentsChange ?? 0)}`}>
                      {getChangeIcon(analyticsData.overview?.commentsChange ?? 0)}
                      <span className="text-sm font-medium">
                        {formatPercentage(analyticsData.overview?.commentsChange ?? 0)}
                      </span>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                    {formatNumber(analyticsData.overview?.totalComments ?? 0)}
                  </div>
                  <p className="text-sm text-green-600 dark:text-green-400">Total Comments</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Users className="w-8 h-8 text-purple-600" />
                    <div
                      className={`flex items-center gap-1 ${getChangeColor(analyticsData.overview?.followersChange ?? 0)}`}
                    >
                      {getChangeIcon(analyticsData.overview?.followersChange ?? 0)}
                      <span className="text-sm font-medium">
                        {formatPercentage(analyticsData.overview?.followersChange ?? 0)}
                      </span>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                    {formatNumber(analyticsData.overview?.totalFollowers ?? 0)}
                  </div>
                  <p className="text-sm text-purple-600 dark:text-purple-400">Followers</p>
                </CardContent>
              </Card>
            </div>

            {/* Charts Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Views Over Time</CardTitle>
                  <CardDescription>Daily views for the selected period</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">Chart visualization would go here</p>
                      <p className="text-sm text-muted-foreground">Integration with Chart.js or Recharts</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Engagement Metrics</CardTitle>
                  <CardDescription>Likes and comments over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
                    <div className="text-center">
                      <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">Engagement chart would go here</p>
                      <p className="text-sm text-muted-foreground">Shows likes, comments, and engagement rate</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Articles Tab */}
          <TabsContent value="articles">
            <Card>
              <CardHeader>
                <CardTitle>Article Performance</CardTitle>
                <CardDescription>Detailed analytics for each of your published articles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(analyticsData.articles ?? []).map((article, index) => (
                    <div
                      key={article.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold line-clamp-1">{article.title}</h3>
                          <Badge variant="secondary">{article.status}</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(article.publishedAt).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {article.readTime} min read
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 text-sm">
                        <div className="text-center">
                          <div className="flex items-center gap-1 mb-1">
                            <Eye className="w-4 h-4 text-blue-600" />
                            <span className="font-semibold">{formatNumber(article.views)}</span>
                          </div>
                          <div className={`text-xs ${getChangeColor(article.viewsChange)}`}>
                            {formatPercentage(article.viewsChange)}
                          </div>
                        </div>

                        <div className="text-center">
                          <div className="flex items-center gap-1 mb-1">
                            <Heart className="w-4 h-4 text-red-600" />
                            <span className="font-semibold">{article.likes}</span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {((article.likes / article.views) * 100).toFixed(1)}%
                          </div>
                        </div>

                        <div className="text-center">
                          <div className="flex items-center gap-1 mb-1">
                            <MessageCircle className="w-4 h-4 text-green-600" />
                            <span className="font-semibold">{article.comments}</span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {((article.comments / article.views) * 100).toFixed(1)}%
                          </div>
                        </div>

                        <div className="text-center">
                          <div className="text-sm font-semibold text-primary">{article.engagement.toFixed(1)}%</div>
                          <div className="text-xs text-muted-foreground">Engagement</div>
                        </div>

                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/article/${article.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}>View</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Audience Tab */}
          <TabsContent value="audience">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Countries */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Top Countries
                  </CardTitle>
                  <CardDescription>Where your readers are located</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(analyticsData.demographics?.countries ?? []).map((country, index) => (
                      <div key={country.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-xs font-semibold">
                            {index + 1}
                          </div>
                          <span className="font-medium">{country.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{country.percentage}%</div>
                          <div className="text-xs text-muted-foreground">{formatNumber(country.views)} views</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Devices */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Monitor className="w-5 h-5" />
                    Device Types
                  </CardTitle>
                  <CardDescription>How readers access your content</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(analyticsData.demographics?.devices ?? []).map((device) => (
                      <div key={device.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {device.name === "Desktop" && <Monitor className="w-5 h-5 text-blue-600" />}
                          {device.name === "Mobile" && <Smartphone className="w-5 h-5 text-green-600" />}
                          {device.name === "Tablet" && <PieChart className="w-5 h-5 text-purple-600" />}
                          <span className="font-medium">{device.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{device.percentage}%</div>
                          <div className="text-xs text-muted-foreground">{formatNumber(device.views)} views</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Traffic Tab */}
          <TabsContent value="traffic">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Traffic Sources
                </CardTitle>
                <CardDescription>Where your readers are coming from</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(analyticsData.demographics?.referrers ?? []).map((referrer, index) => (
                    <div key={referrer.name} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">{referrer.name}</span>
                        <Badge variant="outline">{referrer.percentage}%</Badge>
                      </div>
                      <div className="text-2xl font-bold text-primary mb-1">{formatNumber(referrer.views)}</div>
                      <div className="text-sm text-muted-foreground">views</div>
                      <div className="w-full bg-muted rounded-full h-2 mt-3">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${referrer.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
