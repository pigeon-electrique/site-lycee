'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChefHat, Clock, Users, Star, Heart, ArrowLeft, Play, User } from 'lucide-react'
import Link from 'next/link'
import { IngredientsCalculator } from '@/components/ingredients-calculator'
import { RecipeActions } from '@/components/recipe-actions'

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
  ingredients: Array<{
    id: string
    name: string
    quantity: number
    unit: string
    notes?: string
  }>
  steps: RecipeStep[]
  rating: number
  likes: number
  createdAt: string
}

interface RecipeStep {
  id: string
  title: string
  description: string
  image?: string
  duration?: number
  temperature?: number
}

export default function RecipeDetailPage() {
  const params = useParams()
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await fetch(`/api/recipes/${params.id}`)
        const data = await response.json()
        if (response.ok) {
          setRecipe(data)
        }
        setLoading(false)
      } catch (error) {
        console.error('Erreur lors de la récupération de la recette:', error)
        setLoading(false)
      }
    }

    fetchRecipe()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto p-6">
          <div className="space-y-6">
            <div className="h-8 bg-muted rounded animate-pulse w-1/3" />
            <div className="h-64 bg-muted rounded animate-pulse" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-32 bg-muted rounded animate-pulse" />
                <div className="h-32 bg-muted rounded animate-pulse" />
              </div>
              <div className="h-64 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto p-6 text-center">
          <h1 className="text-2xl font-bold mb-4">Recette non trouvée</h1>
          <Button asChild>
            <Link href="/recettes">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour aux recettes
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto p-6">
        {/* Navigation */}
        <div className="mb-6">
          <Button asChild variant="ghost">
            <Link href="/recettes">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour aux recettes
            </Link>
          </Button>
        </div>

        {/* Header de la recette */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="outline">{recipe.category}</Badge>
            <Badge 
              variant={recipe.difficulty === 'Facile' ? 'default' : 
                      recipe.difficulty === 'Moyen' ? 'secondary' : 'destructive'}
            >
              {recipe.difficulty}
            </Badge>
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm">{recipe.rating}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Heart className="h-4 w-4 text-red-500" />
              <span className="text-sm">{recipe.likes || 0} j'aime</span>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold mb-4">{recipe.title}</h1>
          <p className="text-xl text-muted-foreground mb-6">{recipe.description}</p>
          
          {/* Image placeholder */}
          <div className="aspect-video bg-muted rounded-lg mb-6 flex items-center justify-center">
            <ChefHat className="h-24 w-24 text-muted-foreground" />
          </div>
          
          {/* Infos rapides */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Préparation</p>
                <p className="font-semibold">{recipe.prepTime} min</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Cuisson</p>
                <p className="font-semibold">{recipe.cookTime} min</p>
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex flex-wrap gap-4">
            <Button asChild size="lg">
              <Link href={`/recettes/${recipe.id}/cook`}>
                <Play className="mr-2 h-5 w-5" />
                Faire la recette
              </Link>
            </Button>
            
            <RecipeActions 
              recipeId={recipe.id}
              initialLikes={recipe.likes || 0}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Ingrédients */}
          <Card>
            <CardHeader>
              <CardTitle>Ingrédients</CardTitle>
              <CardDescription>Calculateur de proportions</CardDescription>
            </CardHeader>
            <CardContent>
              <IngredientsCalculator 
                ingredients={recipe.ingredients}
                baseIngredient="farine"
              />
            </CardContent>
          </Card>

          {/* Étapes */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Préparation</CardTitle>
                <CardDescription>Suivez les étapes dans l&apos;ordre</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {recipe.steps.map((step, index) => (
                    <div key={step.id} className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                          {index + 1}
                        </div>
                      </div>
                      <div className="flex-1 space-y-2">
                        <h4 className="font-semibold">{step.title}</h4>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                        <div className="flex gap-4 text-xs text-muted-foreground">
                          {step.duration && (
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{step.duration} min</span>
                            </div>
                          )}
                          {step.temperature && (
                            <div className="flex items-center space-x-1">
                              <span>🌡️</span>
                              <span>{step.temperature}°C</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}