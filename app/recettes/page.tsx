'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Navbar } from '@/components/navbar'
import { Sidebar } from '@/components/sidebar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ChefHat, Clock, Star, Search, Grid, List, Heart } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

interface Recipe {
  id: string
  title: string
  description: string
  category: string
  prepTime: number
  cookTime: number
  difficulty: 'Facile' | 'Moyen' | 'Difficile'
  image?: string
  baseWeight: number
  rating: number
  likes: number
  createdAt: string
}

interface Category {
  id: string
  name: string
  description: string
  icon: string
  color: string
  recipeCount: number
}

function RecipesContent() {
  const searchParams = useSearchParams()
  const { data: session } = useSession()
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all')
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [sortBy, setSortBy] = useState('newest')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFavorites, setShowFavorites] = useState(searchParams.get('view') === 'favorites')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Récupérer les catégories
        const categoryResponse = await fetch('/api/categories')
        const categoryData = await categoryResponse.json()
        
        if (categoryResponse.ok) {
          setCategories(categoryData)
        }

        // Si on affiche les favoris, utiliser l'API des favoris
        if (showFavorites && session?.user) {
          const favoriteResponse = await fetch('/api/user/favorites')
          const favoriteData = await favoriteResponse.json()
          
          if (favoriteResponse.ok) {
            setRecipes(favoriteData.recipes)
          } else if (favoriteResponse.status === 401) {
            toast.error('Vous devez être connecté pour voir vos favoris')
            setShowFavorites(false)
          }
        } else {
          // Récupérer les recettes normalement
          const params = new URLSearchParams({
            ...(selectedCategory !== 'all' && { category: selectedCategory }),
            ...(searchQuery && { search: searchQuery }),
            ...(sortBy && { sort: sortBy })
          })

          const recipeResponse = await fetch(`/api/recipes?${params}`)
          const recipeData = await recipeResponse.json()
          
          if (recipeResponse.ok) {
            setRecipes(recipeData.recipes || [])
          }
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error)
        toast.error('Erreur lors du chargement des recettes')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [selectedCategory, searchQuery, sortBy, showFavorites, session])

  const handleLikesChange = (recipeId: string, newLikes: number) => {
    setRecipes(prevRecipes => 
      prevRecipes.map(recipe => 
        recipe.id === recipeId 
          ? { ...recipe, likes: newLikes }
          : recipe
      )
    )
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // La recherche se fait automatiquement via le state
  }

  const filteredRecipes = recipes.filter(recipe => {
    if (showFavorites) return true // Les favoris sont déjà filtrés par l'API
    
    const matchesCategory = selectedCategory === 'all' || recipe.category === selectedCategory
    const matchesSearch = searchQuery === '' || 
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const sortedRecipes = [...filteredRecipes].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      case 'rating':
        return b.rating - a.rating
      case 'likes':
        return (b.likes || 0) - (a.likes || 0)
      case 'prepTime':
        return a.prepTime - b.prepTime
      case 'title':
        return a.title.localeCompare(b.title)
      default:
        return 0
    }
  })

  // Composant RecipeCard intégré
  const RecipeCard = ({ recipe }: { recipe: Recipe }) => {
    const [liked, setLiked] = useState(false)
    const [favorited, setFavorited] = useState(false)
    const [likes, setLikes] = useState(recipe.likes || 0)
    const [actionLoading, setActionLoading] = useState(false)

    useEffect(() => {
      if (session?.user) {
        fetch(`/api/recipes/${recipe.id}/status`)
          .then(res => res.json())
          .then(data => {
            setLiked(data.liked)
            setFavorited(data.favorited)
          })
          .catch(() => {})
      }
    }, [recipe.id, session])

    const handleQuickLike = async (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      
      if (!session?.user) {
        toast.error('Vous devez être connecté pour aimer une recette')
        return
      }

      setActionLoading(true)
      try {
        const response = await fetch(`/api/recipes/${recipe.id}/like`, {
          method: 'POST',
        })

        const data = await response.json()

        if (response.ok) {
          setLiked(data.liked)
          setLikes(data.likes)
          handleLikesChange(recipe.id, data.likes)
          toast.success(data.liked ? 'Recette aimée !' : 'Like retiré')
        } else {
          toast.error(data.error || 'Erreur lors du like')
        }
      } catch (error) {
        console.error('Erreur lors du like:', error)
        toast.error('Erreur lors du like')
      } finally {
        setActionLoading(false)
      }
    }

    const handleQuickFavorite = async (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      
      if (!session?.user) {
        toast.error('Vous devez être connecté pour ajouter aux favoris')
        return
      }

      setActionLoading(true)
      try {
        const response = await fetch(`/api/recipes/${recipe.id}/favorite`, {
          method: 'POST',
        })

        const data = await response.json()

        if (response.ok) {
          setFavorited(data.favorited)
          toast.success(data.favorited ? 'Ajouté aux favoris !' : 'Retiré des favoris')
          
          // Si on était sur la page favoris et qu'on retire le favori, supprimer de la liste
          if (showFavorites && !data.favorited) {
            setRecipes(prev => prev.filter(r => r.id !== recipe.id))
          }
        } else {
          toast.error(data.error || 'Erreur lors de l\'ajout aux favoris')
        }
      } catch (error) {
        console.error('Erreur lors de l\'ajout aux favoris:', error)
        toast.error('Erreur lors de l\'ajout aux favoris')
      } finally {
        setActionLoading(false)
      }
    }

    return (
      <Card className="group hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
            <ChefHat className="h-12 w-12 text-muted-foreground" />
          </div>
          <div className="flex items-center justify-between">
            <Badge variant="outline">
              {categories.find(c => c.id === recipe.category)?.name || recipe.category}
            </Badge>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm">{recipe.rating}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Heart className="h-4 w-4 text-red-500" />
                <span className="text-sm">{likes}</span>
              </div>
            </div>
          </div>
          <CardTitle className="group-hover:text-primary transition-colors">
            {recipe.title}
          </CardTitle>
          <CardDescription className="line-clamp-2">
            {recipe.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{recipe.prepTime + recipe.cookTime} min</span>
            </div>
            <Badge 
              variant={recipe.difficulty === 'Facile' ? 'default' :
                      recipe.difficulty === 'Moyen' ? 'secondary' : 'destructive'}
            >
              {recipe.difficulty}
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button asChild className="flex-1">
              <Link href={`/recettes/${recipe.id}`}>
                Voir la recette
              </Link>
            </Button>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={handleQuickLike}
                disabled={actionLoading}
                className={liked ? 'text-red-500 border-red-500' : ''}
              >
                <Heart className={`h-4 w-4 ${liked ? 'fill-red-500' : ''}`} />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleQuickFavorite}
                disabled={actionLoading}
                className={favorited ? 'text-yellow-500 border-yellow-500' : ''}
              >
                <Star className={`h-4 w-4 ${favorited ? 'fill-yellow-500' : ''}`} />
              </Button>
              <Button variant="outline" size="icon" asChild>
                <Link href={`/recettes/${recipe.id}/cook`}>
                  <ChefHat className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex">
          <div className="w-64 h-screen bg-muted animate-pulse" />
          <div className="flex-1 p-6">
            <div className="space-y-4">
              <div className="h-8 bg-muted rounded animate-pulse" />
              <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-64 bg-muted rounded animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="flex">
        {!showFavorites && (
          <Sidebar 
            categories={categories}
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
          />
        )}
        
        <main className={`p-6 ${showFavorites ? 'flex-1' : 'flex-1'}`}>
          {/* Header avec onglets */}
          <div className="mb-8">
            <div className="flex items-center space-x-8 mb-6">
              <button
                onClick={() => setShowFavorites(false)}
                className={`text-2xl font-bold pb-2 border-b-2 transition-colors ${
                  !showFavorites ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                Toutes les recettes
              </button>
              {session?.user && (
                <button
                  onClick={() => setShowFavorites(true)}
                  className={`text-2xl font-bold pb-2 border-b-2 transition-colors ${
                    showFavorites ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Mes favoris
                </button>
              )}
            </div>
            
            <p className="text-muted-foreground mb-6">
              {showFavorites
                ? `Vos recettes favorites (${sortedRecipes.length})`
                : selectedCategory === 'all' 
                  ? `Découvrez nos ${sortedRecipes.length} recettes de pâtisserie`
                  : categories.find(c => c.id === selectedCategory)?.description
              }
            </p>

            {/* Barre de recherche et filtres */}
            {!showFavorites && (
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <form onSubmit={handleSearch} className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Rechercher une recette..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </form>
                
                <div className="flex gap-2">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Trier par" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Plus récent</SelectItem>
                      <SelectItem value="oldest">Plus ancien</SelectItem>
                      <SelectItem value="rating">Mieux noté</SelectItem>
                      <SelectItem value="likes">Plus aimé</SelectItem>
                      <SelectItem value="prepTime">Temps de prép</SelectItem>
                      <SelectItem value="title">Titre A-Z</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <div className="flex border rounded-md">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className="rounded-r-none"
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className="rounded-l-none"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Résultats */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {sortedRecipes.length} recette{sortedRecipes.length > 1 ? 's' : ''} trouvée{sortedRecipes.length > 1 ? 's' : ''}
              </p>
            </div>

            {sortedRecipes.length === 0 ? (
              <div className="text-center py-12">
                <ChefHat className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {showFavorites ? 'Aucun favori' : 'Aucune recette trouvée'}
                </h3>
                <p className="text-muted-foreground">
                  {showFavorites 
                    ? 'Commencez à ajouter des recettes à vos favoris !' 
                    : 'Essayez de modifier vos critères de recherche'
                  }
                </p>
              </div>
            ) : (
              <div className={
                viewMode === 'grid' 
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "space-y-4"
              }>
                {sortedRecipes.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default function RecipesPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <RecipesContent />
    </Suspense>
  )
}