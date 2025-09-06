'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  ChefHat, 
  Users, 
  Eye, 
  Plus, 
  Settings, 
  TrendingUp,
  Star,
  Tag
} from 'lucide-react'
import Link from 'next/link'

interface Stats {
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

interface Recipe {
  id: string
  title: string
  category: string
  author: string
  createdAt: string
  views: number
  rating: number
  isPublished: boolean
}

interface User {
  id: string
  name: string
  email: string
  role: string
  createdAt: string
  lastLogin: string
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session || session.user?.role !== 'admin') {
      router.push('/')
      return
    }

    fetchStats()
  }, [session, status, router])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/dashboard')
      const data = await response.json()

      if (response.ok) {
        setStats(data)
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto p-6">
          <div className="space-y-6">
            <div className="h-8 bg-muted rounded animate-pulse w-1/3" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!session || session.user?.role !== 'admin') {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Tableau de bord</h1>
          <p className="text-muted-foreground">
            Gérez les recettes, utilisateurs et statistiques du site
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recettes</CardTitle>
              <ChefHat className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalRecipes}</div>
              <p className="text-xs text-muted-foreground">
                +{stats?.recipesThisWeek || 0} cette semaine
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                +{stats?.usersThisMonth || 0} ce mois
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vues</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalViews}</div>
              <p className="text-xs text-muted-foreground">
                +{stats?.viewsThisMonth || 0} ce mois
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Engagement</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.averageRating?.toFixed(1) || '0.0'}</div>
              <p className="text-xs text-muted-foreground">
                Note moyenne des recettes
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
                      <TabsList>
              <TabsTrigger value="overview">Vue d&apos;ensemble</TabsTrigger>
              <TabsTrigger value="recipes">Recettes</TabsTrigger>
              <TabsTrigger value="categories">Catégories</TabsTrigger>
              <TabsTrigger value="users">Utilisateurs</TabsTrigger>
              <TabsTrigger value="settings">Paramètres</TabsTrigger>
            </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recettes populaires */}
              <Card>
                <CardHeader>
                  <CardTitle>Recettes populaires</CardTitle>
                  <CardDescription>Les recettes les plus consultées</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats?.popularRecipes && stats.popularRecipes.length > 0 ? (
                      stats.popularRecipes.map((recipe, index) => (
                        <div key={recipe.id || `recipe-${index}`} className="flex items-center space-x-4">
                          <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                            {index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{recipe.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {recipe.category} • {recipe.author.name}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center space-x-1">
                              <Eye className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs">{recipe.views}</span>
                            </div>
                            {recipe.rating > 0 && (
                              <div className="flex items-center space-x-1">
                                <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                                <span className="text-xs">{recipe.rating.toFixed(1)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">Aucune recette populaire</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Utilisateurs récents */}
              <Card>
                <CardHeader>
                  <CardTitle>Utilisateurs récents</CardTitle>
                  <CardDescription>Nouveaux membres de la communauté</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats?.recentUsers && stats.recentUsers.length > 0 ? (
                      stats.recentUsers.map((user, index) => (
                        <div key={user.id || `user-${index}`} className="flex items-center space-x-4">
                          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-sm font-semibold">
                            {user.name.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{user.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                          </div>
                          <div className="text-right">
                            <Badge variant={user.role === 'admin' ? 'default' : 'outline'} className="text-xs">
                              {user.role}
                            </Badge>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">Aucun utilisateur récent</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="recipes" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Gestion des recettes</h2>
              <Button asChild>
                <Link href="/admin/recipes/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Nouvelle recette
                </Link>
              </Button>
            </div>
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <ChefHat className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Gestion des recettes</h3>
                  <p className="text-muted-foreground mb-4">
                    Créez, modifiez et gérez les recettes de pâtisserie
                  </p>
                  <Button asChild>
                    <Link href="/admin/recipes">
                      Voir toutes les recettes
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Gestion des catégories</h2>
              <Button asChild>
                <Link href="/admin/categories">
                  <Plus className="mr-2 h-4 w-4" />
                  Gérer les catégories
                </Link>
              </Button>
            </div>
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <Tag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Gestion des catégories</h3>
                  <p className="text-muted-foreground mb-4">
                    Créez et gérez les catégories de recettes
                  </p>
                  <Button asChild>
                    <Link href="/admin/categories">
                      Gérer les catégories
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Gestion des utilisateurs</h2>
              <Button variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Paramètres
              </Button>
            </div>
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Gestion des utilisateurs</h3>
                  <p className="text-muted-foreground mb-4">
                    Gérez les comptes, rôles et permissions
                  </p>
                  <Button asChild>
                    <Link href="/admin/users">
                      Gérer les utilisateurs
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-2xl font-bold">Paramètres du site</h2>
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <Settings className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Paramètres du site</h3>
                  <p className="text-muted-foreground mb-4">
                    Configurez l'apparence, les fonctionnalités et les paramètres
                  </p>
                  <Button asChild>
                    <Link href="/admin/settings">
                      Configurer
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
