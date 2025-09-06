export interface User {
  _id?: string
  id: string
  name: string
  email: string
  image?: string
  role: 'user' | 'admin'
  createdAt: Date
  updatedAt: Date
  avatar?: string
  bio?: string
  isActive: boolean
  lastLogin?: Date
}

export interface Recipe {
  _id?: string
  id: string
  title: string
  description: string
  content: string
  category: string // ID de la catégorie
  image?: string
  images: string[]
  ingredients: Ingredient[]
  steps: RecipeStep[]
  prepTime: number // en minutes
  cookTime: number // en minutes
  baseWeight: number // en grammes
  difficulty: 'Facile' | 'Moyen' | 'Difficile'
  author: {
    id: string
    name: string
    email: string
  }
  tags: string[]
  views: number
  likes: number
  rating: number
  ratingCount: number
  isPublished: boolean
  isFeatured: boolean
  createdAt: Date
  updatedAt: Date
  publishedAt?: Date
}

export interface Ingredient {
  id: string
  name: string
  quantity: number
  unit: string
  notes?: string
}

export interface RecipeStep {
  id: string
  order: number
  title: string
  description: string
  image?: string
  duration?: number // en minutes
  temperature?: number // en °C
}

export interface Category {
  _id?: string
  id: string
  name: string
  description: string
  color: string
  icon: string
  isActive: boolean
  recipeCount: number
  createdAt: Date
  updatedAt: Date
}

export interface RecipeView {
  _id?: string
  id: string
  recipeId: string
  userId?: string
  ip: string
  userAgent: string
  viewedAt: Date
}

export interface RecipeRating {
  _id?: string
  id: string
  recipeId: string
  userId: string
  rating: number // 1-5
  comment?: string
  createdAt: Date
}

export interface SiteSettings {
  _id?: string
  id: string
  siteName: string
  siteDescription: string
  siteUrl: string
  logo?: string
  favicon?: string
  theme: 'light' | 'dark' | 'auto'
  allowRegistration: boolean
  requireEmailVerification: boolean
  maxRecipesPerUser: number
  maxFileSize: number // en MB
  allowedImageTypes: string[]
  maintenanceMode: boolean
  maintenanceMessage?: string
  analytics: {
    googleAnalyticsId?: string
    enableTracking: boolean
  }
  social: {
    facebook?: string
    instagram?: string
    twitter?: string
  }
  contact: {
    email: string
    phone?: string
    address?: string
  }
  updatedAt: Date
  updatedBy: string
}

export interface DashboardStats {
  totalRecipes: number
  totalUsers: number
  totalViews: number
  averageRating: number
  recipesThisWeek: number
  usersThisMonth: number
  viewsThisMonth: number
  popularRecipes: Recipe[]
  recentUsers: User[]
  recentRecipes: Recipe[]
}

export interface SiteStats {
  _id?: string
  totalRecipes: number
  totalUsers: number
  totalViews: number
  lastUpdated: Date
}
