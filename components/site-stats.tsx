'use client'

import { useEffect, useState } from 'react'
import { Card } from './ui/card'
import { Heart, ScrollText, Users, Star } from 'lucide-react'

interface Stats {
  totalRecipes: number
  totalUsers: number
  totalLikes: number
  totalFavorites: number
  popularCategories: Array<{ _id: string; count: number }>
}

export function SiteStats() {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats')
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des statistiques:', error)
      }
    }

    fetchStats()
  }, [])

  if (!stats) return null

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12">
      <h2 className="text-3xl font-bold text-center mb-8">Notre Communauté en Chiffres</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Recettes */}
        <Card className="p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow">
          <ScrollText className="w-12 h-12 text-primary mb-4" />
          <h3 className="text-4xl font-bold mb-2">{stats.totalRecipes}</h3>
          <p className="text-muted-foreground">Recettes Partagées</p>
        </Card>

        {/* Total Utilisateurs */}
        <Card className="p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow">
          <Users className="w-12 h-12 text-primary mb-4" />
          <h3 className="text-4xl font-bold mb-2">{stats.totalUsers}</h3>
          <p className="text-muted-foreground">Membres Actifs</p>
        </Card>

        {/* Total J'aime */}
        <Card className="p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow">
          <Heart className="w-12 h-12 text-primary mb-4" />
          <h3 className="text-4xl font-bold mb-2">{stats.totalLikes}</h3>
          <p className="text-muted-foreground">J'aime</p>
        </Card>

        {/* Total Favoris */}
        <Card className="p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow">
          <Star className="w-12 h-12 text-primary mb-4" />
          <h3 className="text-4xl font-bold mb-2">{stats.totalFavorites}</h3>
          <p className="text-muted-foreground">Favoris</p>
        </Card>
      </div>
    </div>
  )
}