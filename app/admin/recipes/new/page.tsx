'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Plus, X, Save, Eye, Clock, Users, ChefHat } from 'lucide-react'
import { Recipe, Ingredient, RecipeStep, Category } from '@/lib/models'

export default function NewRecipePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [recipe, setRecipe] = useState<Partial<Recipe>>({
    title: '',
    description: '',
    content: '',
    category: '',
    difficulty: 'Facile',
    prepTime: 30,
    cookTime: 60,
    tags: [],
    ingredients: [],
    steps: [],
    images: [],
    isPublished: false
  })

  const [newTag, setNewTag] = useState('')
  const [newIngredient, setNewIngredient] = useState<Partial<Ingredient>>({
    name: '',
    quantity: 0,
    unit: 'g',
    notes: ''
  })
  const [newStep, setNewStep] = useState<Partial<RecipeStep>>({
    title: '',
    description: '',
    duration: 0
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories?active=true')
      const data = await response.json()
      if (response.ok) {
        setCategories(data)
        if (data.length > 0 && !recipe.category) {
          setRecipe(prev => ({ ...prev, category: data[0].id }))
        }
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories:', error)
    }
  }

  const handleAddTag = () => {
    if (newTag.trim() && !recipe.tags?.includes(newTag.trim())) {
      setRecipe(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()]
      }))
      setNewTag('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setRecipe(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }))
  }

  const handleAddIngredient = () => {
    if (newIngredient.name?.trim()) {
      const ingredient: Ingredient = {
        id: `ingredient_${Date.now()}`,
        name: newIngredient.name.trim(),
        quantity: newIngredient.quantity || 0,
        unit: newIngredient.unit || 'g',
        notes: newIngredient.notes?.trim() || ''
      }
      
      setRecipe(prev => ({
        ...prev,
        ingredients: [...(prev.ingredients || []), ingredient]
      }))
      
      setNewIngredient({
        name: '',
        quantity: 0,
        unit: 'g',
        notes: ''
      })
    }
  }

  const handleRemoveIngredient = (ingredientId: string) => {
    setRecipe(prev => ({
      ...prev,
      ingredients: prev.ingredients?.filter(ing => ing.id !== ingredientId) || []
    }))
  }

  const handleAddStep = () => {
    if (newStep.title?.trim() && newStep.description?.trim()) {
      const step: RecipeStep = {
        id: `step_${Date.now()}`,
        order: (recipe.steps?.length || 0) + 1,
        title: newStep.title.trim(),
        description: newStep.description.trim(),
        duration: newStep.duration || 0
      }
      
      setRecipe(prev => ({
        ...prev,
        steps: [...(prev.steps || []), step]
      }))
      
      setNewStep({
        title: '',
        description: '',
        duration: 0
      })
    }
  }

  const handleRemoveStep = (stepId: string) => {
    setRecipe(prev => ({
      ...prev,
      steps: prev.steps?.filter(step => step.id !== stepId) || []
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Calculer le poids total à partir des ingrédients
      const totalWeight = recipe.ingredients?.reduce((total, ing) => {
        if (ing.unit === 'g') return total + ing.quantity
        if (ing.unit === 'kg') return total + (ing.quantity * 1000)
        return total
      }, 0) || 0

      const recipeToSubmit = {
        ...recipe,
        baseWeight: totalWeight
      }

      const response = await fetch('/api/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipeToSubmit),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Une erreur est survenue')
        return
      }

      router.push('/admin/recipes')
    } catch {
      setError('Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Nouvelle recette</h1>
            <p className="text-muted-foreground">Créez une nouvelle recette de pâtisserie</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => router.back()}
            >
              Annuler
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Informations de base */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChefHat className="h-5 w-5" />
                Informations de base
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Titre de la recette *</Label>
                  <Input
                    id="title"
                    value={recipe.title}
                    onChange={(e) => setRecipe(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Ex: Crème Pâtissière Vanille"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Catégorie *</Label>
                  <Select
                    value={recipe.category}
                    onValueChange={(value) => setRecipe(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={recipe.description}
                  onChange={(e) => setRecipe(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Une brève description de la recette..."
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Contenu détaillé</Label>
                <Textarea
                  id="content"
                  value={recipe.content}
                  onChange={(e) => setRecipe(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Informations supplémentaires, conseils, variantes..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Image</Label>
                <div className="text-sm text-muted-foreground mb-2">
                  Format recommandé : 1200x800 pixels, max 2MB
                </div>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      // TODO: Implement image upload
                      console.log('Image à uploader:', file)
                    }
                  }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulté *</Label>
                  <Select
                    value={recipe.difficulty}
                    onValueChange={(value) => setRecipe(prev => ({ ...prev, difficulty: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Facile">Facile</SelectItem>
                      <SelectItem value="Moyen">Moyen</SelectItem>
                      <SelectItem value="Difficile">Difficile</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prepTime">Préparation (min) *</Label>
                  <Input
                    id="prepTime"
                    type="number"
                    value={recipe.prepTime?.toString() || '0'}
                    onChange={(e) => setRecipe(prev => ({ ...prev, prepTime: parseInt(e.target.value) || 0 }))}
                    min="0"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cookTime">Cuisson (min) *</Label>
                  <Input
                    id="cookTime"
                    type="number"
                    value={recipe.cookTime?.toString() || '0'}
                    onChange={(e) => setRecipe(prev => ({ ...prev, cookTime: parseInt(e.target.value) || 0 }))}
                    min="0"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
              <CardDescription>Ajoutez des mots-clés pour faciliter la recherche</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Ajouter un tag"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                />
                <Button type="button" onClick={handleAddTag}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recipe.tags?.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 ml-1"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Ingrédients */}
          <Card>
            <CardHeader>
              <CardTitle>Ingrédients</CardTitle>
              <CardDescription>Listez tous les ingrédients nécessaires</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                <Input
                  placeholder="Nom de l'ingrédient"
                  value={newIngredient.name}
                  onChange={(e) => setNewIngredient(prev => ({ ...prev, name: e.target.value }))}
                />
                <Input
                  type="number"
                  placeholder="Quantité"
                  value={newIngredient.quantity?.toString() || '0'}
                  onChange={(e) => setNewIngredient(prev => ({ ...prev, quantity: parseFloat(e.target.value) || 0 }))}
                />
                <Select
                  value={newIngredient.unit}
                  onValueChange={(value) => setNewIngredient(prev => ({ ...prev, unit: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="g">g</SelectItem>
                    <SelectItem value="kg">kg</SelectItem>
                    <SelectItem value="ml">ml</SelectItem>
                    <SelectItem value="cl">cl</SelectItem>
                    <SelectItem value="l">l</SelectItem>
                    <SelectItem value="pincée">pincée</SelectItem>
                    <SelectItem value="c.à.s">c.à.s</SelectItem>
                    <SelectItem value="c.à.c">c.à.c</SelectItem>
                    <SelectItem value="pièce">pièce</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Notes (optionnel)"
                  value={newIngredient.notes}
                  onChange={(e) => setNewIngredient(prev => ({ ...prev, notes: e.target.value }))}
                />
                <Button type="button" onClick={handleAddIngredient}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-2">
                {recipe.ingredients?.map((ingredient, index) => (
                  <div key={ingredient.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="font-medium">{ingredient.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {ingredient.quantity} {ingredient.unit}
                        {ingredient.notes && ` (${ingredient.notes})`}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveIngredient(ingredient.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Étapes */}
          <Card>
            <CardHeader>
              <CardTitle>Étapes de préparation</CardTitle>
              <CardDescription>Décrivez chaque étape de la recette</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Input
                  placeholder="Titre de l'étape"
                  value={newStep.title}
                  onChange={(e) => setNewStep(prev => ({ ...prev, title: e.target.value }))}
                />
                <Textarea
                  placeholder="Description de l'étape"
                  value={newStep.description}
                  onChange={(e) => setNewStep(prev => ({ ...prev, description: e.target.value }))}
                  rows={2}
                />
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Durée (min)"
                    value={newStep.duration?.toString() || '0'}
                    onChange={(e) => setNewStep(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                    className="w-32"
                  />
                  <Button type="button" onClick={handleAddStep}>
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter l'étape
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4">
                {recipe.steps?.map((step, index) => (
                  <div key={step.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">Étape {step.order}</Badge>
                          <h4 className="font-medium">{step.title}</h4>
                          {step.duration && step.duration > 0 && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              {step.duration} min
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveStep(step.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Publication */}
          <Card>
            <CardHeader>
              <CardTitle>Publication</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPublished"
                  checked={recipe.isPublished}
                  onChange={(e) => setRecipe(prev => ({ ...prev, isPublished: e.target.checked }))}
                  className="rounded"
                />
                <Label htmlFor="isPublished">Publier immédiatement</Label>
              </div>
            </CardContent>
          </Card>

          {error && (
            <div className="text-sm text-destructive text-center">
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
