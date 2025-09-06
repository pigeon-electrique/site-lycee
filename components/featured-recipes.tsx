'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Clock, Users, ChefHat, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'

interface Recipe {
  _id: string
  title: string
  description: string
  category: string
  preparationTime: number
  difficulty: string
  image?: string
  views: number
}

export function FeaturedRecipes() {
  const [featuredRecipes, setFeaturedRecipes] = useState<Recipe[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadFeaturedRecipes = async () => {
      try {
        const response = await fetch('/api/recipes/featured')
        if (response.ok) {
          const data = await response.json()
          setFeaturedRecipes(data)
        }
      } catch (error) {
        console.error('Erreur lors du chargement des recettes:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadFeaturedRecipes()
  }, [])

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Recettes en vedette</h2>
          <p className="text-muted-foreground">
            Les recettes les plus populaires de la classe
          </p>
        </div>
        
        <div className="flex justify-center w-full">
          <div className={`grid gap-6 w-full ${
            !isLoading ? (
              featuredRecipes.length === 1 
                ? 'md:w-2/3 lg:w-1/3' 
                : featuredRecipes.length === 2 
                  ? 'md:grid-cols-2 max-w-4xl' 
                  : 'md:grid-cols-2 lg:grid-cols-3 max-w-6xl'
            ) : 'md:grid-cols-2 lg:grid-cols-3 max-w-6xl'
          }`}>
            {isLoading ? (
              <Card className="group hover:shadow-lg transition-shadow animate-pulse">
                <CardHeader>
                  <div className="aspect-video bg-muted rounded-lg mb-4" />
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-1/4" />
                    <div className="h-6 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-2/3" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-1/2" />
                    <div className="h-8 bg-muted rounded w-full" />
                  </div>
                </CardContent>
              </Card>
            ) : (
              featuredRecipes.map((recipe) => (
                <Card key={recipe._id} className="group hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
                      <ChefHat className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{recipe.category}</Badge>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span className="text-sm">{recipe.views} vues</span>
                      </div>
                    </div>
                    <CardTitle className="group-hover:text-primary transition-colors">
                      {recipe.title}
                    </CardTitle>
                    <CardDescription>{recipe.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{recipe.preparationTime} min</span>
                      </div>
                      <Badge 
                        variant={recipe.difficulty === 'facile' ? 'default' : 
                                recipe.difficulty === 'moyen' ? 'secondary' : 'destructive'}
                      >
                        {recipe.difficulty}
                      </Badge>
                    </div>
                    <Button asChild className="w-full">
                      <Link href={`/recettes/${recipe._id}`}>
                        Voir la recette
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
        
        <div className="text-center mt-12">
          <Button asChild variant="outline" size="lg">
            <Link href="/recettes">
              Voir toutes les recettes
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
