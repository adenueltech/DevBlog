// API Configuration for DevBlog
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  
  // User endpoints
  USER_ME: '/users/me',
  USER_ARTICLES: '/users/me/articles',
  USER_BY_USERNAME: (username: string) => `/users/${username}`,
  
  // Article endpoints
  ARTICLES: '/articles',
  ARTICLE_BY_ID: (id: string) => `/articles/${id}`,
  
  // Analytics endpoints
  ANALYTICS: '/analytics',
} as const

// API utility functions
export class ApiClient {
  private baseUrl: string

  constructor() {
    this.baseUrl = API_BASE_URL
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    
    // Get token from localStorage if available
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error)
      throw error
    }
  }

  // Auth methods
  async login(credentials: { email: string; password: string }) {
    return this.request(API_ENDPOINTS.LOGIN, {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
  }

  async register(userData: { email: string; password: string; name: string; username: string }) {
    return this.request(API_ENDPOINTS.REGISTER, {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }

  // User methods
  async getCurrentUser() {
    return this.request(API_ENDPOINTS.USER_ME)
  }

  async getUserArticles() {
    return this.request(API_ENDPOINTS.USER_ARTICLES)
  }

  async getUserByUsername(username: string) {
    return this.request(API_ENDPOINTS.USER_BY_USERNAME(username))
  }

  // Article methods
  async getArticles() {
    return this.request(API_ENDPOINTS.ARTICLES)
  }

  async getArticleById(id: string) {
    return this.request(API_ENDPOINTS.ARTICLE_BY_ID(id))
  }

  async createArticle(articleData: any) {
    return this.request(API_ENDPOINTS.ARTICLES, {
      method: 'POST',
      body: JSON.stringify(articleData),
    })
  }

  async updateArticle(id: string, articleData: any) {
    return this.request(API_ENDPOINTS.ARTICLE_BY_ID(id), {
      method: 'PUT',
      body: JSON.stringify(articleData),
    })
  }

  async deleteArticle(id: string) {
    return this.request(API_ENDPOINTS.ARTICLE_BY_ID(id), {
      method: 'DELETE',
    })
  }

  // Analytics methods
  async getAnalytics() {
    return this.request(API_ENDPOINTS.ANALYTICS)
  }
}

// Create a singleton instance
export const apiClient = new ApiClient()

// Utility function to check if user is authenticated
export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false
  return !!localStorage.getItem('access_token')
}

// Utility function to logout user
export const logout = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token')
    window.location.href = '/login'
  }
}

// Utility function to handle API errors
export const handleApiError = (error: any): string => {
  if (error.message) {
    return error.message
  }
  return 'An unexpected error occurred. Please try again.'
}