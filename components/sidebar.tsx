'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { 
  ChefHat, 
  IceCream, 
  Cake, 
  Cookie, 
  Coffee, 
  Heart,
  Star
} from 'lucide-react'

interface Category {
  id: string
  name: string
  description: string
  icon: string
  color: string
  recipeCount: number
}

interface SidebarProps {
  categories: Category[]
  selectedCategory?: string
  onCategorySelect?: (categoryId: string) => void
}

const categoryIcons: { [key: string]: React.ComponentType<{ className?: string }> } = {
  'cremes': Heart,
  'genoises': Cake,
  'glaces': IceCream,
  'biscuits': Cookie,
  'boissons': Coffee,
  'favorites': Star,
}

export function Sidebar({ categories, selectedCategory, onCategorySelect }: SidebarProps) {
  const [favorites] = useState<string[]>([])


  return (
    <div className="w-64 border-r bg-background">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Catégories</h2>
        
        <ScrollArea className="h-[calc(100vh-8rem)]">
          <div className="space-y-2">
            {/* Toutes les recettes */}
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => onCategorySelect?.('all')}
            >
              <ChefHat className="mr-2 h-4 w-4" />
              Toutes les recettes
            </Button>

            {/* Favoris */}
            <Button
              variant={selectedCategory === 'favorites' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => onCategorySelect?.('favorites')}
            >
              <Star className="mr-2 h-4 w-4" />
              Favoris
              <Badge variant="secondary" className="ml-auto">
                {favorites.length}
              </Badge>
            </Button>

            {/* Catégories avec accordion */}
            <Accordion type="multiple" className="w-full">
              {categories.map((category) => {
                const IconComponent = categoryIcons[category.icon] || ChefHat
                
                return (
                  <AccordionItem key={category.id} value={category.id}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center space-x-2">
                                                <IconComponent
                          className="h-4 w-4"
                        />
                        <span>{category.name}</span>
                        <Badge variant="outline" className="ml-auto">
                          {category.recipeCount}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="pl-6 space-y-1">
                        <p className="text-sm text-muted-foreground mb-2">
                          {category.description}
                        </p>
                        <Button
                          variant={selectedCategory === category.id ? 'default' : 'ghost'}
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => onCategorySelect?.(category.id)}
                        >
                          Voir les recettes
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )
              })}
            </Accordion>
          </div>
        </ScrollArea>

        {/* Statistiques rapides */}
        <div className="mt-6 p-3 bg-muted rounded-lg">
          <h3 className="text-sm font-medium mb-2">Statistiques</h3>
          <div className="space-y-1 text-xs text-muted-foreground">
            <div className="flex justify-between">
              <span>Total recettes</span>
              <span>{categories.reduce((acc, cat) => acc + cat.recipeCount, 0)}</span>
            </div>
            <div className="flex justify-between">
              <span>Favoris</span>
              <span>{favorites.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
