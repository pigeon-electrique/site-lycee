'use client'

import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  ArrowLeft, 
  Shield, 
  Key, 
  Smartphone, 
  Mail,
  Eye,
  EyeOff,
  CheckCircle,
  AlertTriangle,
  Trash2
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

export default function ProfilSecuritePage() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  })

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (passwords.new !== passwords.confirm) {
      toast.error('Les nouveaux mots de passe ne correspondent pas')
      return
    }

    if (passwords.new.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères')
      return
    }

    setLoading(true)
    
    try {
      // Simuler la mise à jour du mot de passe
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast.success('Mot de passe mis à jour avec succès')
      setPasswords({ current: '', new: '', confirm: '' })
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du mot de passe')
    } finally {
      setLoading(false)
    }
  }

  const handleToggle2FA = async () => {
    setLoading(true)
    
    try {
      // Simuler l'activation/désactivation de la 2FA
      await new Promise(resolve => setTimeout(resolve, 1500))
      setTwoFactorEnabled(!twoFactorEnabled)
      toast.success(
        twoFactorEnabled 
          ? 'Authentification à deux facteurs désactivée' 
          : 'Authentification à deux facteurs activée'
      )
    } catch (error) {
      toast.error('Erreur lors de la configuration de la 2FA')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {
      return
    }

    setLoading(true)
    
    try {
      // Simuler la suppression du compte
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast.success('Compte supprimé avec succès')
      await signOut({ callbackUrl: '/' })
    } catch (error) {
      toast.error('Erreur lors de la suppression du compte')
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
          <h1 className="text-3xl font-bold">Sécurité</h1>
          <p className="text-muted-foreground">
            Gérez votre mot de passe et vos paramètres de sécurité
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Statut de sécurité */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Statut de sécurité</span>
            </CardTitle>
            <CardDescription>
              Vue d'ensemble de la sécurité de votre compte
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-800 dark:text-green-200">Email vérifié</p>
                  <p className="text-sm text-green-600 dark:text-green-400">Votre email est confirmé</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="font-medium text-yellow-800 dark:text-yellow-200">2FA désactivée</p>
                  <p className="text-sm text-yellow-600 dark:text-yellow-400">Activez la 2FA pour plus de sécurité</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Changement de mot de passe */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Key className="h-5 w-5" />
              <span>Mot de passe</span>
            </CardTitle>
            <CardDescription>
              Modifiez votre mot de passe pour sécuriser votre compte
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={passwords.current}
                    onChange={(e) => setPasswords(prev => ({ ...prev, current: e.target.value }))}
                    placeholder="Votre mot de passe actuel"
                    className="pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? 'text' : 'password'}
                      value={passwords.new}
                      onChange={(e) => setPasswords(prev => ({ ...prev, new: e.target.value }))}
                      placeholder="Nouveau mot de passe"
                      className="pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={passwords.confirm}
                      onChange={(e) => setPasswords(prev => ({ ...prev, confirm: e.target.value }))}
                      placeholder="Confirmer le mot de passe"
                      className="pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="text-sm text-muted-foreground">
                <p>Le mot de passe doit contenir :</p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>Au moins 6 caractères</li>
                  <li>Une combinaison de lettres et chiffres recommandée</li>
                </ul>
              </div>

              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Mise à jour...
                  </>
                ) : (
                  'Mettre à jour le mot de passe'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Authentification à deux facteurs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Smartphone className="h-5 w-5" />
              <span>Authentification à deux facteurs (2FA)</span>
            </CardTitle>
            <CardDescription>
              Ajoutez une couche de sécurité supplémentaire à votre compte
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="font-medium">Authentification par application</p>
                <p className="text-sm text-muted-foreground">
                  Utilisez une application comme Google Authenticator ou Authy
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={twoFactorEnabled ? "default" : "secondary"}>
                  {twoFactorEnabled ? "Activée" : "Désactivée"}
                </Badge>
                <Switch
                  checked={twoFactorEnabled}
                  onCheckedChange={handleToggle2FA}
                  disabled={loading}
                />
              </div>
            </div>

            {twoFactorEnabled && (
              <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <p className="text-sm font-medium text-green-800 dark:text-green-200">
                    Authentification à deux facteurs activée
                  </p>
                </div>
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                  Votre compte est maintenant protégé par la 2FA
                </p>
              </div>
            )}

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="font-medium">Authentification par email</p>
                <p className="text-sm text-muted-foreground">
                  Recevez un code par email lors de la connexion
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">Disponible</Badge>
                <Switch defaultChecked />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sessions actives */}
        <Card>
          <CardHeader>
            <CardTitle>Sessions actives</CardTitle>
            <CardDescription>
              Gérez les appareils connectés à votre compte
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Session actuelle</p>
                    <p className="text-sm text-muted-foreground">
                      Chrome sur Windows • France • Maintenant
                    </p>
                  </div>
                </div>
                <Badge variant="outline">Actuel</Badge>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <div>
                    <p className="font-medium">iPhone Safari</p>
                    <p className="text-sm text-muted-foreground">
                      Safari sur iOS • France • Il y a 2 jours
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  Déconnecter
                </Button>
              </div>
            </div>

            <Button variant="outline" className="w-full">
              Déconnecter tous les autres appareils
            </Button>
          </CardContent>
        </Card>

        {/* Zone de danger */}
        <Card className="border-red-200 dark:border-red-800">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-600 dark:text-red-400">
              <AlertTriangle className="h-5 w-5" />
              <span>Zone de danger</span>
            </CardTitle>
            <CardDescription>
              Actions irréversibles concernant votre compte
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20">
              <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">
                Supprimer mon compte
              </h4>
              <p className="text-sm text-red-600 dark:text-red-400 mb-3">
                Cette action est irréversible. Toutes vos données seront définitivement supprimées.
              </p>
              <Button 
                variant="destructive" 
                onClick={handleDeleteAccount}
                disabled={loading}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Supprimer mon compte
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}