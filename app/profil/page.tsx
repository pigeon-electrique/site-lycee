'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  User, 
  Settings, 
  Shield, 
  Mail, 
  Camera, 
  Edit,
  Calendar,
  Award,
  Heart,
  BookOpen,
  Star
} from 'lucide-react'
import Link from 'next/link'

interface UserStats {
  recipesLiked: number
  favoriteRecipes: number
  joinDate: string
}

interface UserActivity {
  type: 'like' | 'create' | 'update'
  text: string
  date: string
}

export default function ProfilPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<UserStats | null>(null)
  const [activity, setActivity] = useState<UserActivity[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch stats et activité depuis l'API
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    if (session?.user) {
      setLoading(true)

      // Récupérer les stats
      fetch(`/api/user/${session.user.id}/stats`)
        .then(res => res.json())
        .then(data => {
          setStats({
            recipesLiked: data.recipesLiked,
            favoriteRecipes: data.favoriteRecipes,
            joinDate: data.joinDate
          })
        })

      // Récupérer l'activité récente
      fetch(`/api/user/${session.user.id}/activity`)
        .then(res => res.json())
        .then(data => setActivity(data))
        .finally(() => setLoading(false))
    }
  }, [session, status, router])

  if (status === 'loading' || loading) {
    return (
      <div className="container mx-auto max-w-6xl p-4">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="md:col-span-1 space-y-4">
              <div className="h-64 bg-muted rounded-lg"></div>
              <div className="h-48 bg-muted rounded-lg"></div>
            </div>
            <div className="md:col-span-3 space-y-6">
              <div className="h-32 bg-muted rounded-lg"></div>
              <div className="h-48 bg-muted rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!session?.user) return null

  // Calcul ancienneté
  const daysOld = stats?.joinDate
    ? Math.floor((new Date().getTime() - new Date(stats.joinDate).getTime()) / (1000 * 60 * 60 * 24))
    : 0

  return (
    <div className="container mx-auto max-w-6xl p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Mon Profil</h1>
        <p className="text-muted-foreground">Gérez vos informations personnelles et vos préférences</p>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={session.user.image || ''} alt={session.user.name || ''} />
                    <AvatarFallback className="text-2xl">{session.user.name?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                  <Button size="icon" variant="outline" className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full" asChild>
                    <Link href="/profil/photo">
                      <Camera className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>

                <div className="text-center space-y-1">
                  <h3 className="font-semibold text-lg">{session.user.name}</h3>
                  <p className="text-sm text-muted-foreground">{session.user.email}</p>
                  <Badge variant="secondary" className="mt-2">
                    {session.user.role === 'admin' ? 'Administrateur' : 'Étudiant'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Paramètres</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/profil/informations">
                  <User className="mr-2 h-4 w-4" />
                  Informations personnelles
                </Link>
              </Button>

              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/profil/securite">
                  <Shield className="mr-2 h-4 w-4" />
                  Sécurité et mot de passe
                </Link>
              </Button>

              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/profil/notifications">
                  <Mail className="mr-2 h-4 w-4" />
                  Notifications
                </Link>
              </Button>

              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/profil/preferences">
                  <Settings className="mr-2 h-4 w-4" />
                  Préférences
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Contenu principal */}
        <div className="md:col-span-3 space-y-6">
          {/* Statistiques */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Heart className="h-8 w-8 text-red-500" />
                  <div>
                    <p className="text-2xl font-bold">{stats?.recipesLiked}</p>
                    <p className="text-sm text-muted-foreground">J'aime donnés</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Star className="h-8 w-8 text-yellow-500" />
                  <div>
                    <p className="text-2xl font-bold">{stats?.favoriteCount}</p>
                    <p className="text-sm text-muted-foreground">Favoris</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold">{daysOld}</p>
                    <p className="text-sm text-muted-foreground">Jours d'ancienneté</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Informations du compte */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Informations du compte</CardTitle>
                <CardDescription>Vos informations principales</CardDescription>
              </div>
              <Button variant="outline" asChild>
                <Link href="/profil/informations">
                  <Edit className="mr-2 h-4 w-4" />
                  Modifier
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nom complet</label>
                  <p className="text-sm text-muted-foreground">{session.user.name || 'Non renseigné'}</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Adresse email</label>
                  <p className="text-sm text-muted-foreground">{session.user.email}</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Rôle </label>
                  <Badge variant={session.user.role === 'admin' ? 'default' : 'secondary'}>
                    {session.user.role === 'admin' ? 'Administrateur' : 'Étudiant'}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Date d'inscription</label>
                  <p className="text-sm text-muted-foreground">
                    {stats?.joinDate ? new Date(stats.joinDate).toLocaleDateString('fr-FR') : 'Non disponible'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activité récente */}
          <Card>
            <CardHeader>
              <CardTitle>Activité récente</CardTitle>
              <CardDescription>Vos dernières actions sur la plateforme</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activity.length > 0 ? (
                  activity.map((act, idx) => (
                    <div key={idx} className="flex items-start space-x-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        act.type === 'like' ? 'bg-green-500' :
                        act.type === 'create' ? 'bg-blue-500' : 'bg-yellow-500'
                      }`}></div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm">{act.text}</p>
                        <p className="text-xs text-muted-foreground">{new Date(act.date).toLocaleString('fr-FR')}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">Aucune activité récente.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
