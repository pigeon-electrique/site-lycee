'use client'

import { useState, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  ArrowLeft, 
  Upload, 
  Camera, 
  Trash2, 
  RotateCw,
  Download
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

export default function ProfilPhotoPage() {
  const { data: session } = useSession()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [rotation, setRotation] = useState(0)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      toast.error('Veuillez sélectionner un fichier image')
      return
    }

    // Vérifier la taille (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Le fichier est trop volumineux (max 2MB)')
      return
    }

    // Créer l'aperçu
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviewImage(e.target?.result as string)
      setRotation(0)
    }
    reader.readAsDataURL(file)
  }

  const handleSave = async () => {
    if (!previewImage) return

    setLoading(true)
    
    try {
      // Simuler l'upload de l'image
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast.success('Photo de profil mise à jour avec succès')
      // Redirection après sauvegarde
      // router.push('/profil')
    } catch (error) {
      toast.error('Erreur lors de la mise à jour de la photo')
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer votre photo de profil ?')) {
      return
    }

    setLoading(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      toast.success('Photo de profil supprimée')
      setPreviewImage(null)
    } catch (error) {
      toast.error('Erreur lors de la suppression')
    } finally {
      setLoading(false)
    }
  }

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360)
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
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
          <h1 className="text-3xl font-bold">Photo de profil</h1>
          <p className="text-muted-foreground">
            Modifiez ou supprimez votre photo de profil
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Aperçu actuel */}
        <Card>
          <CardHeader>
            <CardTitle>Photo actuelle</CardTitle>
            <CardDescription>
              Votre photo de profil visible par les autres utilisateurs
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <Avatar className="w-32 h-32">
              <AvatarImage 
                src={session?.user?.image || ''} 
                alt={session?.user?.name || ''} 
              />
              <AvatarFallback className="text-4xl">
                {session?.user?.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            
            <div className="text-center space-y-2">
              <p className="font-medium">{session?.user?.name}</p>
              <p className="text-sm text-muted-foreground">
                {session?.user?.image ? 'Photo personnalisée' : 'Photo par défaut'}
              </p>
            </div>

            {session?.user?.image && (
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={handleRemove}
                disabled={loading}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Supprimer la photo
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Upload et aperçu */}
        <Card>
          <CardHeader>
            <CardTitle>Nouvelle photo</CardTitle>
            <CardDescription>
              Téléchargez une nouvelle photo de profil
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {previewImage ? (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div 
                    className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-border"
                    style={{ transform: `rotate(${rotation}deg)` }}
                  >
                    <img 
                      src={previewImage} 
                      alt="Aperçu" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="flex justify-center space-x-2">
                  <Button variant="outline" size="sm" onClick={handleRotate}>
                    <RotateCw className="mr-2 h-4 w-4" />
                    Rotation
                  </Button>
                  <Button variant="outline" size="sm" onClick={triggerFileInput}>
                    <Upload className="mr-2 h-4 w-4" />
                    Changer
                  </Button>
                </div>

                <div className="flex space-x-2">
                  <Button 
                    className="flex-1" 
                    onClick={handleSave}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Enregistrement...
                      </>
                    ) : (
                      'Enregistrer'
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setPreviewImage(null)}
                  >
                    Annuler
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div 
                  className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
                  onClick={triggerFileInput}
                >
                  <Camera className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium mb-2">
                    Télécharger une photo
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Cliquez pour sélectionner ou glissez-déposez une image
                  </p>
                  <Button variant="outline">
                    <Upload className="mr-2 h-4 w-4" />
                    Choisir un fichier
                  </Button>
                </div>

                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• Formats acceptés : JPG, PNG, GIF</p>
                  <p>• Taille maximum : 2MB</p>
                  <p>• Résolution recommandée : 400x400px minimum</p>
                  <p>• L'image sera automatiquement recadrée en cercle</p>
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </CardContent>
        </Card>
      </div>

      {/* Conseils */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Conseils pour une bonne photo de profil</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-medium">✅ À faire :</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Utilisez une photo récente</li>
                <li>• Montrez clairement votre visage</li>
                <li>• Choisissez un arrière-plan neutre</li>
                <li>• Assurez-vous que l'éclairage est bon</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">❌ À éviter :</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Photos floues ou de mauvaise qualité</li>
                <li>• Images avec plusieurs personnes</li>
                <li>• Photos trop sombres</li>
                <li>• Contenu inapproprié</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}