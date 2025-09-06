'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { 
  ArrowLeft, 
  Mail, 
  Bell, 
  Heart, 
  MessageSquare,
  Star,
  BookOpen,
  Users,
  Shield,
  Smartphone
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

interface NotificationSettings {
  email: {
    newRecipes: boolean
    recipeLikes: boolean
    recipeComments: boolean
    following: boolean
    newsletters: boolean
    security: boolean
  }
  push: {
    newRecipes: boolean
    recipeLikes: boolean
    recipeComments: boolean
    following: boolean
    realTime: boolean
  }
}

export default function ProfilNotificationsPage() {
  const [loading, setLoading] = useState(false)
  const [settings, setSettings] = useState<NotificationSettings>({
    email: {
      newRecipes: true,
      recipeLikes: true,
      recipeComments: true,
      following: false,
      newsletters: true,
      security: true
    },
    push: {
      newRecipes: false,
      recipeLikes: true,
      recipeComments: true,
      following: false,
      realTime: true
    }
  })

  const handleEmailToggle = (key: keyof NotificationSettings['email']) => {
    setSettings(prev => ({
      ...prev,
      email: {
        ...prev.email,
        [key]: !prev.email[key]
      }
    }))
  }

  const handlePushToggle = (key: keyof NotificationSettings['push']) => {
    setSettings(prev => ({
      ...prev,
      push: {
        ...prev.push,
        [key]: !prev.push[key]
      }
    }))
  }

  const handleSave = async () => {
    setLoading(true)
    
    try {
      // Simuler la sauvegarde des paramètres
      await new Promise(resolve => setTimeout(resolve, 1500))
      toast.success('Paramètres de notification mis à jour')
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde')
    } finally {
      setLoading(false)
    }
  }

  const handleTestEmail = async () => {
    setLoading(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Email de test envoyé avec succès')
    } catch (error) {
      toast.error('Erreur lors de l\'envoi de l\'email de test')
    } finally {
      setLoading(false)
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
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">
            Choisissez comment et quand vous souhaitez être notifié
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Notifications par email */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Mail className="h-5 w-5" />
              <span>Notifications par email</span>
            </CardTitle>
            <CardDescription>
              Recevez des notifications importantes dans votre boîte mail
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="email-recipes" className="font-medium">
                    Nouvelles recettes
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Soyez informé des nouvelles recettes ajoutées par vos enseignants
                </p>
              </div>
              <Switch
                id="email-recipes"
                checked={settings.email.newRecipes}
                onCheckedChange={() => handleEmailToggle('newRecipes')}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <Heart className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="email-likes" className="font-medium">
                    J'aime sur mes recettes
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Notification quand quelqu'un aime une de vos recettes
                </p>
              </div>
              <Switch
                id="email-likes"
                checked={settings.email.recipeLikes}
                onCheckedChange={() => handleEmailToggle('recipeLikes')}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="email-comments" className="font-medium">
                    Commentaires sur mes recettes
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Notification pour les nouveaux commentaires
                </p>
              </div>
              <Switch
                id="email-comments"
                checked={settings.email.recipeComments}
                onCheckedChange={() => handleEmailToggle('recipeComments')}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="email-following" className="font-medium">
                    Activité des personnes suivies
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Nouvelles recettes des personnes que vous suivez
                </p>
              </div>
              <Switch
                id="email-following"
                checked={settings.email.following}
                onCheckedChange={() => handleEmailToggle('following')}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="email-newsletters" className="font-medium">
                    Newsletter et actualités
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Recevez les actualités du lycée et conseils pâtisserie
                </p>
              </div>
              <Switch
                id="email-newsletters"
                checked={settings.email.newsletters}
                onCheckedChange={() => handleEmailToggle('newsletters')}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="email-security" className="font-medium">
                    Alertes de sécurité
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Connexions suspectes et changements de sécurité (recommandé)
                </p>
              </div>
              <Switch
                id="email-security"
                checked={settings.email.security}
                onCheckedChange={() => handleEmailToggle('security')}
              />
            </div>

            <div className="pt-4">
              <Button variant="outline" onClick={handleTestEmail} disabled={loading}>
                Envoyer un email de test
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notifications push */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Smartphone className="h-5 w-5" />
              <span>Notifications push</span>
            </CardTitle>
            <CardDescription>
              Notifications instantanées sur votre navigateur ou application
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <Bell className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="push-realtime" className="font-medium">
                    Notifications en temps réel
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Activez les notifications push pour recevoir les alertes instantanément
                </p>
              </div>
              <Switch
                id="push-realtime"
                checked={settings.push.realTime}
                onCheckedChange={() => handlePushToggle('realTime')}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="push-recipes" className="font-medium">
                    Nouvelles recettes
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Notification push pour les nouvelles recettes
                </p>
              </div>
              <Switch
                id="push-recipes"
                checked={settings.push.newRecipes}
                onCheckedChange={() => handlePushToggle('newRecipes')}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <Heart className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="push-likes" className="font-medium">
                    J'aime sur mes recettes
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Notification push instantanée pour les j'aime
                </p>
              </div>
              <Switch
                id="push-likes"
                checked={settings.push.recipeLikes}
                onCheckedChange={() => handlePushToggle('recipeLikes')}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="push-comments" className="font-medium">
                    Commentaires
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Notifications push pour les nouveaux commentaires
                </p>
              </div>
              <Switch
                id="push-comments"
                checked={settings.push.recipeComments}
                onCheckedChange={() => handlePushToggle('recipeComments')}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="push-following" className="font-medium">
                    Personnes suivies
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Activité des personnes que vous suivez
                </p>
              </div>
              <Switch
                id="push-following"
                checked={settings.push.following}
                onCheckedChange={() => handlePushToggle('following')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Fréquence et horaires */}
        <Card>
          <CardHeader>
            <CardTitle>Fréquence et horaires</CardTitle>
            <CardDescription>
              Contrôlez quand vous recevez vos notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Résumé quotidien par email</Label>
                <select className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm">
                  <option value="never">Jamais</option>
                  <option value="daily">Quotidien</option>
                  <option value="weekly">Hebdomadaire</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label>Heure d'envoi</Label>
                <select className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm">
                  <option value="08:00">08:00</option>
                  <option value="12:00">12:00</option>
                  <option value="18:00">18:00</option>
                  <option value="20:00">20:00</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Jours de la semaine</Label>
              <div className="grid grid-cols-7 gap-2">
                {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="h-10 w-10 p-0"
                  >
                    {day}
                  </Button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Sélectionnez les jours où vous souhaitez recevoir les notifications
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Mode silencieux */}
        <Card>
          <CardHeader>
            <CardTitle>Mode silencieux</CardTitle>
            <CardDescription>
              Suspendre temporairement toutes les notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
              <div className="space-y-1">
                <p className="font-medium">Activer le mode silencieux</p>
                <p className="text-sm text-muted-foreground">
                  Toutes les notifications seront suspendues pendant la durée sélectionnée
                </p>
              </div>
              <Switch />
            </div>

            <div className="space-y-2">
              <Label>Durée du mode silencieux</Label>
              <select className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm">
                <option value="1h">1 heure</option>
                <option value="2h">2 heures</option>
                <option value="4h">4 heures</option>
                <option value="8h">8 heures</option>
                <option value="24h">24 heures</option>
                <option value="48h">48 heures</option>
                <option value="1w">1 semaine</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end space-x-4">
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
              'Enregistrer les paramètres'
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}