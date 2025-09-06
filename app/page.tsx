'use client'

import { ClientWrapper } from '@/components/client-wrapper'
import { AdminInit } from '@/components/admin-init'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChefHat, Heart, ArrowRight } from 'lucide-react'
import { FeaturedRecipes } from '@/components/featured-recipes'
import { SiteStats } from '@/components/site-stats'
import Link from 'next/link'

export default function Home() {
  return (
    <ClientWrapper>
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center">
        <div className="container mx-auto max-w-4xl">
          <div className="space-y-6">
            <div className="flex justify-center">
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                Lycée Professionnel Pâtisserie
              </Badge>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Recettes de{' '}
              <span className="text-primary">Pâtisserie</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Découvrez et partagez les meilleures recettes de pâtisserie 
              avec vos camarades de classe. Crèmes, génoises, glaces et plus encore.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/recettes">
                  Explorer les recettes
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/recettes?category=favorites">
                  <Heart className="mr-2 h-4 w-4" />
                  Mes favoris
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Site Stats */}
      <SiteStats />
      
      {/* Featured Recipes with Title */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto">
          <FeaturedRecipes />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center max-w-2xl">
          <h2 className="text-3xl font-bold mb-4">
            Prêt à commencer à pâtisser ?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Rejoignez vos camarades et partagez vos créations culinaires
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link href="/recettes">
              Commencer maintenant
              <ChefHat className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </ClientWrapper>
  )
}
