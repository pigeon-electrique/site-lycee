'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Crown, CheckCircle, AlertCircle } from 'lucide-react'

export function AdminInit() {
  const { data: session, update } = useSession()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleInitAdmin = async () => {
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/auth/init-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setSuccess(true)
        // Rafraîchir la session pour mettre à jour le rôle
        await update()
      } else {
        setError(data.error || 'Erreur lors de la définition du rôle admin')
      }
    } catch {
      setError('Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  if (!session) return null

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-yellow-500" />
          Initialisation Admin
        </CardTitle>
        <CardDescription>
          Le premier utilisateur connecté peut devenir administrateur
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Utilisateur actuel :</span>
          <Badge variant="outline">{session.user?.name}</Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Rôle actuel :</span>
          <Badge variant={session.user?.role === 'admin' ? 'default' : 'secondary'}>
            {session.user?.role || 'user'}
          </Badge>
        </div>

        {session.user?.role === 'admin' ? (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm">Vous êtes déjà administrateur</span>
          </div>
        ) : success ? (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm">Rôle admin défini avec succès !</span>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-start gap-2 text-amber-600">
              <AlertCircle className="h-4 w-4 mt-0.5" />
              <div className="text-sm">
                <p>En tant que premier utilisateur, vous pouvez devenir administrateur.</p>
                <p className="text-xs mt-1">
                  Cela vous donnera accès au dashboard admin et à la gestion des recettes.
                </p>
              </div>
            </div>
            
            <Button 
              onClick={handleInitAdmin}
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Définition en cours...' : 'Devenir Administrateur'}
            </Button>
            
            {error && (
              <div className="text-sm text-red-600 bg-red-50 dark:bg-red-950 p-2 rounded">
                {error}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
