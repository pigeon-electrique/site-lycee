'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  ArrowLeft, 
  Settings, 
  Moon, 
  Sun, 
  Globe, 
  Eye,
  Filter,
  Layout,
  Palette,
  Volume2
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  language: string
  itemsPerPage: number
  showImages: boolean
  autoPlay: boolean
  animations: boolean
  compactView: boolean
  defaultFilter: string
  sortBy: string
  showDifficulty: boolean
  showCookingTime: boolean
  soundEffects: boolean
}

export default function ProfilPreferencesPage() {
  const [loading, setLoading] = useState(false)
  const [preferences, setPreferences] = useState<UserPreferences>({
    theme: 'system',
    language: 'fr',
    itemsPerPage: 12,
    showImages: true,
    autoPlay: false,
    animations: true,
    compactView: false,
    defaultFilter: 'all',
    sortBy: 'recent',
    showDifficulty: true,
    showCookingTime: true,
    soundEffects: false
  })

  const handleToggle = (key: keyof UserPreferences) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const handleSelectChange = (key: keyof UserPreferences, value: string | number) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSave = async () => {
    setLoading(true)
    
    try {
      // Simuler la sauvegarde des préférences
      await new Promise(resolve => setTimeout(resolve, 1500))
      toast.success('Préférences sauvegardées avec succès')
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    if (confirm('Êtes-vous sûr de vouloir remettre les préférences par défaut ?')) {
      setPreferences({
        theme: 'system',
        language: 'fr',
        itemsPerPage: 12,
        showImages: true,
        autoPlay: false,
        animations: true,
        compactView: false,
        defaultFilter: 'all',
        sortBy: 'recent',
        showDifficulty: true,
        showCookingTime: true,
        soundEffects: false
      })
      toast.success('Préférences remises par défaut')
    }
  }

  return (
    <div className="container mx-auto max-w-4xl p-4">
      {/* Header avec bouton retour */}
      <div className="mb-6 flex items-center space-x-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/profil">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Préférences</h1>
          <p className="text-muted-foreground">
            Personnalisez votre expérience sur la plateforme
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Apparence */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Palette className="h-5 w-5" />
              <span>Apparence</span>
            </CardTitle>
            <CardDescription>
              Personnalisez l'apparence de l'interface
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="font-medium">Thème</Label>
                <p className="text-sm text-muted-foreground">
                  Choisissez entre le thème clair, sombre ou automatique
                </p>
              </div>
              <Select
                value={preferences.theme}
                onValueChange={(value) => handleSelectChange('theme', value)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">
                    <div className="flex items-center space-x-2">
                      <Sun className="h-4 w-4" />
                      <span>Clair</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="dark">
                    <div className="flex items-center space-x-2">
                      <Moon className="h-4 w-4" />
                      <span>Sombre</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="system">Automatique</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="animations" className="font-medium">
                  Animations
                </Label>
                <p className="text-sm text-muted-foreground">
                  Activer les animations et transitions
                </p>
              </div>
              <Switch
                id="animations"
                checked={preferences.animations}
                onCheckedChange={() => handleToggle('animations')}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="compact-view" className="font-medium">
                  Vue compacte
                </Label>
                <p className="text-sm text-muted-foreground">
                  Affichage plus dense avec moins d'espacement
                </p>
              </div>
              <Switch
                id="compact-view"
                checked={preferences.compactView}
                onCheckedChange={() => handleToggle('compactView')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Langue et région */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="h-5 w-5" />
              <span>Langue et région</span>
            </CardTitle>
            <CardDescription>
              Paramètres de localisation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="font-medium">Langue</Label>
                <p className="text-sm text-muted-foreground">
                  Langue d'affichage de l'interface
                </p>
              </div>
              <Select
                value={preferences.language}
                onValueChange={(value) => handleSelectChange('language', value)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Affichage des recettes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Layout className="h-5 w-5" />
              <span>Affichage des recettes</span>
            </CardTitle>
            <CardDescription>
              Personnalisez l'affichage des listes de recettes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="font-medium">Recettes par page</Label>
                <p className="text-sm text-muted-foreground">
                  Nombre de recettes affichées par page
                </p>
              </div>
              <Select
                value={preferences.itemsPerPage.toString()}
                onValueChange={(value) => handleSelectChange('itemsPerPage', parseInt(value))}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6">6</SelectItem>
                  <SelectItem value="12">12</SelectItem>
                  <SelectItem value="24">24</SelectItem>
                  <SelectItem value="48">48</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="show-images" className="font-medium">
                  Afficher les images
                </Label>
                <p className="text-sm text-muted-foreground">
                  Montrer les photos des recettes dans les listes
                </p>
              </div>
              <Switch
                id="show-images"
                checked={preferences.showImages}
                onCheckedChange={() => handleToggle('showImages')}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="show-difficulty" className="font-medium">
                  Afficher la difficulté
                </Label>
                <p className="text-sm text-muted-foreground">
                  Montrer le niveau de difficulté des recettes
                </p>
              </div>
              <Switch
                id="show-difficulty"
                checked={preferences.showDifficulty}
                onCheckedChange={() => handleToggle('showDifficulty')}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="show-time" className="font-medium">
                  Afficher le temps de préparation
                </Label>
                <p className="text-sm text-muted-foreground">
                  Montrer la durée estimée de préparation
                </p>
              </div>
              <Switch
                id="show-time"
                checked={preferences.showCookingTime}
                onCheckedChange={() => handleToggle('showCookingTime')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Filtres par défaut */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Filtres et tri par défaut</span>
            </CardTitle>
            <CardDescription>
              Définissez vos préférences de filtrage et de tri
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Filtre par défaut</Label>
                <Select
                  value={preferences.defaultFilter}
                  onValueChange={(value) => handleSelectChange('defaultFilter', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les recettes</SelectItem>
                    <SelectItem value="favorites">Mes favoris</SelectItem>
                    <SelectItem value="my-recipes">Mes recettes</SelectItem>
                    <SelectItem value="recent">Récentes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Tri par défaut</Label>
                <Select
                  value={preferences.sortBy}
                  onValueChange={(value) => handleSelectChange('sortBy', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Plus récentes</SelectItem>
                    <SelectItem value="popular">Plus populaires</SelectItem>
                    <SelectItem value="rating">Mieux notées</SelectItem>
                    <SelectItem value="alphabetical">Alphabétique</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Multimédia */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Volume2 className="h-5 w-5" />
              <span>Multimédia</span>
            </CardTitle>
            <CardDescription>
              Paramètres audio et vidéo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="auto-play" className="font-medium">
                  Lecture automatique des vidéos
                </Label>
                <p className="text-sm text-muted-foreground">
                  Démarrer automatiquement les vidéos de recettes
                </p>
              </div>
              <Switch
                id="auto-play"
                checked={preferences.autoPlay}
                onCheckedChange={() => handleToggle('autoPlay')}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="sound-effects" className="font-medium">
                  Effets sonores
                </Label>
                <p className="text-sm text-muted-foreground">
                  Sons de notification et d'interaction
                </p>
              </div>
              <Switch
                id="sound-effects"
                checked={preferences.soundEffects}
                onCheckedChange={() => handleToggle('soundEffects')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={handleReset}>
            Remettre par défaut
          </Button>
          
          <div className="flex space-x-4">
            <Button variant="outline" asChild>
              <Link href="/profil">
                Annuler
              </Link>
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Enregistrement...
                </>
              ) : (
                'Enregistrer les préférences'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}