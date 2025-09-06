'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  ChefHat, 
  Clock, 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Play, 
  Pause, 
  RotateCcw,
  Thermometer,
} from 'lucide-react'
import Link from 'next/link'

interface Recipe {
  id: string
  title: string
  description: string
  category: string
  prepTime: number
  cookTime: number
  servings: number
  difficulty: 'facile' | 'moyen' | 'difficile'
  image?: string
  rating: number
  author: string
  ingredients: Array<{
    id: string
    name: string
    quantity: number
    unit: string
    notes?: string
  }>
  steps: RecipeStep[]
}

interface RecipeStep {
  id: string
  title: string
  description: string
  image?: string
  duration?: number
  temperature?: number
}

export default function CookRecipePage() {
  const params = useParams()
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())
  const [isPlaying, setIsPlaying] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/recipes/${params.id}`)
        const data = await response.json()

        if (response.ok) {
          setRecipe(data)
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de la recette:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRecipe()
  }, [params.id])

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsPlaying(false)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isPlaying, timeRemaining])

  const startTimer = (duration: number) => {
    setTimeRemaining(duration * 60) // Convertir en secondes
    setIsPlaying(true)
  }

  const toggleTimer = () => {
    setIsPlaying(!isPlaying)
  }

  const resetTimer = () => {
    setTimeRemaining(0)
    setIsPlaying(false)
  }

  const nextStep = () => {
    if (currentStep < recipe!.steps.length - 1) {
      // Marquer l'étape actuelle comme terminée avant de passer à la suivante
      const newCompleted = new Set(completedSteps)
      newCompleted.add(currentStep)
      setCompletedSteps(newCompleted)
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      // Dévalider l'étape actuelle quand on revient en arrière
      const newCompleted = new Set(completedSteps)
      newCompleted.delete(currentStep)
      setCompletedSteps(newCompleted)
      setCurrentStep(currentStep - 1)
    }
  }

  const toggleStepComplete = (stepIndex: number) => {
    const newCompleted = new Set(completedSteps)
    if (newCompleted.has(stepIndex)) {
      // Si on dévalide une étape, dévalider aussi toutes les étapes suivantes
      for (let i = stepIndex; i < recipe!.steps.length; i++) {
        newCompleted.delete(i)
      }
    } else {
      // Si on valide une étape, valider aussi toutes les étapes précédentes
      for (let i = 0; i <= stepIndex; i++) {
        newCompleted.add(i)
      }
    }
    setCompletedSteps(newCompleted)
  }

  const progress = recipe ? ((completedSteps.size / recipe.steps.length) * 100) : 0

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto p-6">
          <div className="space-y-6">
            <div className="h-8 bg-muted rounded animate-pulse w-1/3" />
            <div className="h-64 bg-muted rounded animate-pulse" />
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

  const currentStepData = recipe.steps[currentStep]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto p-6">
        {/* Navigation */}
        <div className="mb-6">
          <Button asChild variant="ghost">
            <Link href={`/recettes/${recipe.id}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à la recette
            </Link>
          </Button>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{recipe.title}</h1>
          <p className="text-muted-foreground mb-6">{recipe.description}</p>
          
          {/* Progress */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Progression</span>
              <span className="text-sm text-muted-foreground">
                {completedSteps.size} / {recipe.steps.length} étapes
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Étape actuelle */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">
                      Étape {currentStep + 1} sur {recipe.steps.length}
                    </CardTitle>
                    <CardDescription>{currentStepData.title}</CardDescription>
                  </div>
                  <Badge 
                    variant={completedSteps.has(currentStep) ? 'default' : 'outline'}
                    className="text-lg px-3 py-1"
                  >
                    {completedSteps.has(currentStep) ? 'Terminée' : 'En cours'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Image placeholder */}
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <ChefHat className="h-16 w-16 text-muted-foreground" />
                </div>
                
                {/* Description */}
                <p className="text-lg leading-relaxed">{currentStepData.description}</p>
                
                {/* Infos de l'étape */}
                <div className="flex gap-4">
                  {currentStepData.duration && (
                    <div className="flex items-center space-x-2">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm">{currentStepData.duration} minutes</span>
                    </div>
                  )}
                  {currentStepData.temperature && (
                    <div className="flex items-center space-x-2">
                      <Thermometer className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm">{currentStepData.temperature}°C</span>
                    </div>
                  )}
                </div>
                
                {/* Timer */}
                {currentStepData.duration && (
                  <Card className="bg-muted/50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">Minuteur</h4>
                          <p className="text-sm text-muted-foreground">
                            {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {timeRemaining === 0 ? (
                            <Button onClick={() => startTimer(currentStepData.duration!)}>
                              <Play className="h-4 w-4 mr-2" />
                              Démarrer
                            </Button>
                          ) : (
                            <>
                              <Button onClick={toggleTimer} variant="outline">
                                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                              </Button>
                              <Button onClick={resetTimer} variant="outline">
                                <RotateCcw className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Navigation des étapes */}
            <Card>
              <CardHeader>
                <CardTitle>Étapes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {recipe.steps.map((step, index) => (
                    <div
                      key={step.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        index === currentStep
                          ? 'border-primary bg-primary/5'
                          : completedSteps.has(index)
                          ? 'border-green-500 bg-green-50 dark:bg-green-950'
                          : 'border-muted hover:border-muted-foreground/50'
                      }`}
                      onClick={() => setCurrentStep(index)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                          completedSteps.has(index)
                            ? 'bg-green-500 text-white'
                            : index === currentStep
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {completedSteps.has(index) ? <Check className="h-3 w-3" /> : index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{step.title}</p>
                          {step.duration && (
                            <p className="text-xs text-muted-foreground">{step.duration} min</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Navigation */}
                <div className="space-y-3 mt-6 px-3">
                  <Button onClick={prevStep} disabled={currentStep === 0} variant="outline" className="w-full">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Précédent
                  </Button>
                  {currentStep === recipe.steps.length - 1 ? (
                    <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                      <Link href={`/recettes/${recipe.id}`}>
                        <Check className="mr-2 h-4 w-4" />
                        Terminer
                      </Link>
                    </Button>
                  ) : (
                    <Button onClick={nextStep} className="w-full">
                      Suivant
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Ingrédients */}
            <Card>
              <CardHeader>
                <CardTitle>Ingrédients</CardTitle>
                <CardDescription>Pour {recipe.servings} portions</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {recipe.ingredients.map((ingredient) => (
                    <li key={ingredient.id} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm">
                        {ingredient.quantity} {ingredient.unit} {ingredient.name}
                        {ingredient.notes && <span className="text-muted-foreground ml-1">({ingredient.notes})</span>}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
