'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/navbar'
import { AdminBackButton } from '@/components/admin-back-button'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Settings, 
  Mail, 
  Globe, 
  Shield, 
  Database, 
  Trash2, 
  AlertTriangle,
  RefreshCcw,
  Save
} from 'lucide-react'

interface SiteSettings {
  name: string
  description: string
  contactEmail: string
  maintenanceMode: boolean
  allowRegistration: boolean
  recipesPerPage: number
  maxImageSize: number
  requireEmailVerification: boolean
  autoDeleteInactiveUsers: boolean
  inactiveUserDays: number
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>({
    name: 'Pâtisserie',
    description: 'Partagez vos meilleures recettes de pâtisserie',
    contactEmail: 'contact@patisserie.fr',
    maintenanceMode: false,
    allowRegistration: true,
    recipesPerPage: 12,
    maxImageSize: 5,
    requireEmailVerification: true,
    autoDeleteInactiveUsers: false,
    inactiveUserDays: 365
  })

  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Charger les paramètres au démarrage
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch('/api/admin/settings')
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des paramètres')
        }
        const data = await response.json()
        setSettings(data)
      } catch (error) {
        console.error('Erreur:', error)
        setError('Impossible de charger les paramètres')
      }
    }
    loadSettings()
  }, [])

  const handleSave = async () => {
    try {
      setIsSaving(true)
      setError(null)
      
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings)
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Erreur lors de la sauvegarde')
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
      setError(error instanceof Error ? error.message : 'Erreur lors de la sauvegarde')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto py-8 px-4">
        <AdminBackButton />
        
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Paramètres du site</h1>
            <p className="text-muted-foreground">Configurez les paramètres généraux du site</p>
          </div>
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="min-w-[120px]"
          >
            {isSaving ? (
              <RefreshCcw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Enregistrer
          </Button>
        </div>

        {error && (
          <div className="rounded-md bg-destructive/10 p-4 mb-8">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-destructive">Erreur</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">
              <Settings className="h-4 w-4 mr-2" />
              Général
            </TabsTrigger>
            <TabsTrigger value="site">
              <Globe className="h-4 w-4 mr-2" />
              Site
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="h-4 w-4 mr-2" />
              Sécurité
            </TabsTrigger>
            <TabsTrigger value="maintenance">
              <Database className="h-4 w-4 mr-2" />
              Maintenance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Informations générales</CardTitle>
                <CardDescription>Paramètres principaux du site</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom du site</Label>
                    <Input
                      id="name"
                      value={settings.name}
                      onChange={e => setSettings(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={settings.description}
                      onChange={e => setSettings(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email de contact</Label>
                    <Input
                      id="email"
                      type="email"
                      value={settings.contactEmail}
                      onChange={e => setSettings(prev => ({ ...prev, contactEmail: e.target.value }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="site" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres du site</CardTitle>
                <CardDescription>Configuration de l'affichage et du contenu</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="recipesPerPage">Nombre de recettes par page</Label>
                  <Input
                    id="recipesPerPage"
                    type="number"
                    min="4"
                    max="48"
                    step="4"
                    value={settings.recipesPerPage}
                    onChange={e => setSettings(prev => ({ ...prev, recipesPerPage: parseInt(e.target.value) }))}
                  />
                  <p className="text-sm text-muted-foreground">
                    Nombre de recettes affichées par page dans la liste des recettes
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxImageSize">Taille maximale des images (MB)</Label>
                  <Input
                    id="maxImageSize"
                    type="number"
                    min="1"
                    max="10"
                    value={settings.maxImageSize}
                    onChange={e => setSettings(prev => ({ ...prev, maxImageSize: parseInt(e.target.value) }))}
                  />
                  <p className="text-sm text-muted-foreground">
                    Taille maximale autorisée pour les images de recettes
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Sécurité</CardTitle>
                <CardDescription>Paramètres de sécurité et d'inscription</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Autoriser les inscriptions</Label>
                    <p className="text-sm text-muted-foreground">
                      Permettre aux nouveaux utilisateurs de créer un compte
                    </p>
                  </div>
                  <Switch
                    checked={settings.allowRegistration}
                    onCheckedChange={checked => setSettings(prev => ({ ...prev, allowRegistration: checked }))}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Vérification des emails</Label>
                    <p className="text-sm text-muted-foreground">
                      Exiger la vérification de l'email lors de l'inscription
                    </p>
                  </div>
                  <Switch
                    checked={settings.requireEmailVerification}
                    onCheckedChange={checked => setSettings(prev => ({ ...prev, requireEmailVerification: checked }))}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="maintenance" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Mode maintenance</CardTitle>
                    <CardDescription>Activer/désactiver l'accès au site</CardDescription>
                  </div>
                  <Switch
                    checked={settings.maintenanceMode}
                    onCheckedChange={checked => setSettings(prev => ({ ...prev, maintenanceMode: checked }))}
                  />
                </div>
              </CardHeader>
              <CardContent>
                {settings.maintenanceMode && (
                  <div className="rounded-md bg-yellow-500/15 p-4">
                    <div className="flex">
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-500">Mode maintenance actif</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                          Le site est actuellement en mode maintenance. Seuls les administrateurs peuvent y accéder.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Nettoyage automatique</CardTitle>
                <CardDescription>Gestion des comptes inactifs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Suppression automatique</Label>
                    <p className="text-sm text-muted-foreground">
                      Supprimer automatiquement les comptes inactifs
                    </p>
                  </div>
                  <Switch
                    checked={settings.autoDeleteInactiveUsers}
                    onCheckedChange={checked => setSettings(prev => ({ ...prev, autoDeleteInactiveUsers: checked }))}
                  />
                </div>

                {settings.autoDeleteInactiveUsers && (
                  <div className="space-y-2">
                    <Label htmlFor="inactiveDays">Délai d'inactivité (jours)</Label>
                    <Input
                      id="inactiveDays"
                      type="number"
                      min="30"
                      value={settings.inactiveUserDays}
                      onChange={e => setSettings(prev => ({ ...prev, inactiveUserDays: parseInt(e.target.value) }))}
                    />
                    <p className="text-sm text-muted-foreground">
                      Nombre de jours d'inactivité avant la suppression du compte
                    </p>
                  </div>
                )}

                <div className="rounded-md bg-destructive/10 p-4">
                  <div className="flex">
                    <Trash2 className="h-5 w-5 text-destructive" />
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-destructive">Zone dangereuse</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        La suppression automatique des comptes est irréversible. Les utilisateurs seront notifiés par email avant la suppression.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
