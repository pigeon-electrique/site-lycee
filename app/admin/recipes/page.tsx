'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash2, Eye, EyeOff, Star, ArrowLeft } from 'lucide-react'
import { Recipe, Category } from '@/lib/models'
import { AdminBackButton } from '@/components/admin-back-button'

export default function RecipesPage() {
  const router = useRouter()
  
  // Vérifions les pages de catégories et utilisateurs
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [published, setPublished] = useState('all')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [categories, setCategories] = useState<Category[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)

  const fetchRecipes = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(search && { search }),
        ...(category !== 'all' && { category }),
        ...(published !== 'all' && { published })
      })

      const response = await fetch(`/api/recipes?${params}`)
      const data = await response.json()

      if (response.ok) {
        setRecipes(data.recipes)
        setTotalPages(data.pagination.pages)
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des recettes:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true)
      const response = await fetch('/api/categories')
      const data = await response.json()
      if (response.ok) {
        setCategories(data)
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories:', error)
    } finally {
      setLoadingCategories(false)
    }
  }

  useEffect(() => {
    fetchRecipes()
  }, [page, search, category, published])

  useEffect(() => {
    fetchCategories()
  }, [])

  const getCategory = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId)
  }

  const getCategoryColorClass = (categoryId: string) => {
    const category = getCategory(categoryId)
    if (!category) return 'bg-gray-100 text-gray-800'
    
    // Convert hex color to bg/text classes
    const hex = category.color.replace('#', '')
    return `bg-[#${hex}]/10 text-[#${hex}]`
  }

  const handleDelete = async (recipeId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette recette ?')) return

    try {
      const response = await fetch(`/api/recipes/${recipeId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchRecipes()
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto py-8 px-4">
        <AdminBackButton />
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Gestion des recettes</h1>
          <p className="text-muted-foreground">Gérez toutes les recettes du site</p>
        </div>
        <Button onClick={() => router.push('/admin/recipes/new')}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle recette
        </Button>
      </div>

      {/* Filtres */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Recherche</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Titre, description, tags..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Catégorie</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les catégories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les catégories</SelectItem>
                  {!loadingCategories && categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Statut</label>
              <Select value={published} onValueChange={setPublished}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="true">Publiées</SelectItem>
                  <SelectItem value="false">Brouillons</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">&nbsp;</label>
              <Button
                variant="outline"
                onClick={() => {
                  setSearch('')
                  setCategory('all')
                  setPublished('all')
                }}
                className="w-full"
              >
                <Filter className="h-4 w-4 mr-2" />
                Réinitialiser
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tableau des recettes */}
      <Card>
        <CardHeader>
          <CardTitle>Recettes ({recipes.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Chargement...</div>
          ) : recipes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Aucune recette trouvée
            </div>
          ) : (
            <div className="space-y-2">
              {recipes.map((recipe) => {
                const category = getCategory(recipe.category)
                return (
                  <div
                    key={recipe.id}
                    className="flex items-start justify-between p-4 border rounded-lg"
                  >
                    <div className="space-y-1">
                      <div className="font-medium">{recipe.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {recipe.description}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {category && (
                          <Badge className={getCategoryColorClass(recipe.category)}>
                            {category.name}
                          </Badge>
                        )}
                        {recipe.rating > 0 && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-current" />
                              {recipe.rating.toFixed(1)} ({recipe.ratingCount})
                            </span>
                          </>
                        )}
                      </div>
                      {recipe.tags && recipe.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {recipe.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {recipe.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{recipe.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/recettes/${recipe.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/admin/recipes/${recipe.id}/edit`)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(recipe.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
      </div>
    </div>
  )
}
