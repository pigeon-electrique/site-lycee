'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Heart, Star } from 'lucide-react'
import { toast } from 'sonner'

interface RecipeActionsProps {
  recipeId: string
  initialLikes: number
  className?: string
}

export function RecipeActions({ recipeId, initialLikes, className = "" }: RecipeActionsProps) {
  const { data: session } = useSession()
  const [liked, setLiked] = useState(false)
  const [favorited, setFavorited] = useState(false)
  const [likes, setLikes] = useState(initialLikes)
  const [loading, setLoading] = useState(false)

  // Récupérer le statut initial (liked/favorited) de l'utilisateur
  useEffect(() => {
    if (session?.user) {
      fetch(`/api/recipes/${recipeId}/status`)
        .then(res => res.json())
        .then(data => {
          setLiked(data.liked)
          setFavorited(data.favorited)
        })
        .catch(error => {
          console.error('Erreur lors de la récupération du statut:', error)
        })
    }
  }, [recipeId, session])

  const handleLike = async () => {
    if (!session?.user) {
      toast.error('Vous devez être connecté pour aimer une recette')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/recipes/${recipeId}/like`, {
        method: 'POST',
      })

      const data = await response.json()

      if (response.ok) {
        setLiked(data.liked)
        setLikes(data.likes)
        toast.success(data.liked ? 'Recette aimée !' : 'Like retiré')
      } else {
        toast.error(data.error || 'Erreur lors du like')
      }
    } catch (error) {
      console.error('Erreur lors du like:', error)
      toast.error('Erreur lors du like')
    } finally {
      setLoading(false)
    }
  }

  const handleFavorite = async () => {
    if (!session?.user) {
      toast.error('Vous devez être connecté pour ajouter aux favoris')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/recipes/${recipeId}/favorite`, {
        method: 'POST',
      })

      const data = await response.json()

      if (response.ok) {
        setFavorited(data.favorited)
        toast.success(data.favorited ? 'Ajouté aux favoris !' : 'Retiré des favoris')
      } else {
        toast.error(data.error || 'Erreur lors de l\'ajout aux favoris')
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout aux favoris:', error)
      toast.error('Erreur lors de l\'ajout aux favoris')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`flex gap-2 ${className}`}>
      <Button
        variant="outline"
        onClick={handleLike}
        disabled={loading}
        className={liked ? 'text-red-500 border-red-500' : ''}
      >
        <Heart className={`mr-2 h-4 w-4 ${liked ? 'fill-red-500' : ''}`} />
        J'aime ({likes})
      </Button>

      <Button
        variant="outline"
        onClick={handleFavorite}
        disabled={loading}
        className={favorited ? 'text-yellow-500 border-yellow-500' : ''}
      >
        <Star className={`mr-2 h-4 w-4 ${favorited ? 'fill-yellow-500' : ''}`} />
        {favorited ? 'Dans mes favoris' : 'Ajouter aux favoris'}
      </Button>
    </div>
  )
}