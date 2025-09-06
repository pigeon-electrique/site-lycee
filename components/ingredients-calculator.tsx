'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Label } from '@/components/ui/label'
import { Calculator } from 'lucide-react'

interface Ingredient {
  id: string
  name: string
  quantity: number
  unit: string
  notes?: string
}

interface IngredientsCalculatorProps {
  ingredients: Ingredient[]
  baseIngredient?: string // Par exemple "farine" pour la recette de base
}

export function IngredientsCalculator({ ingredients: initialIngredients }: IngredientsCalculatorProps) {
  const [ingredients, setIngredients] = useState(initialIngredients)
  const [editingValues, setEditingValues] = useState<{ [key: string]: string }>({})
  const [totalWeight, setTotalWeight] = useState(0)

  // Calculer le poids total
  useEffect(() => {
    const total = ingredients
      .filter(ing => ing.unit === 'g' || ing.unit === 'kg')
      .reduce((sum, ing) => {
        const quantity = ing.unit === 'kg' ? ing.quantity * 1000 : ing.quantity
        return sum + quantity
      }, 0)
    setTotalWeight(total)
  }, [ingredients])

  // Convertir une quantité en grammes
  const toGrams = (quantity: number, unit: string) => {
    return unit === 'kg' ? quantity * 1000 : quantity
  }

  // Convertir de grammes vers l'unité d'origine
  const fromGrams = (grams: number, unit: string) => {
    return unit === 'kg' ? grams / 1000 : grams
  }

  // Gérer le changement temporaire pendant la saisie
  const handleInputChange = (ingredientId: string, value: string) => {
    setEditingValues(prev => ({
      ...prev,
      [ingredientId]: value
    }))
  }

  // Gérer la validation de la nouvelle valeur (sur Enter ou perte de focus)
  const handleQuantityConfirm = (ingredientId: string) => {
    const newValue = editingValues[ingredientId]
    if (!newValue) return

    const newQuantity = Math.max(0.1, parseFloat(newValue) || 0.1)
    const ingredient = ingredients.find(ing => ing.id === ingredientId)
    if (!ingredient) return

    // Calculer le ratio basé sur la nouvelle quantité
    const oldQuantityInGrams = Math.max(0.1, toGrams(ingredient.quantity, ingredient.unit))
    const newQuantityInGrams = toGrams(newQuantity, ingredient.unit)
    const ratio = newQuantityInGrams / oldQuantityInGrams

    // Ne pas mettre à jour si le ratio est trop extrême ou invalide
    if (!isFinite(ratio) || ratio <= 0 || ratio > 1000000) {
      // Réinitialiser la valeur en cours d'édition
      setEditingValues(prev => ({
        ...prev,
        [ingredientId]: ingredient.quantity.toFixed(1)
      }))
      return
    }

    // Mettre à jour toutes les quantités proportionnellement
    const updatedIngredients = ingredients.map(ing => ({
      ...ing,
      quantity: Math.max(0.1, fromGrams(toGrams(ing.quantity, ing.unit) * ratio, ing.unit))
    }))

    setIngredients(updatedIngredients)
    // Réinitialiser toutes les valeurs en cours d'édition avec les nouvelles valeurs
    setEditingValues(
      updatedIngredients.reduce((acc, ing) => ({
        ...acc,
        [ing.id]: ing.quantity.toFixed(1)
      }), {})
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          <span>Calculateur d'ingrédients</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Badge variant="secondary" className="mb-2">
            Masse totale: {totalWeight.toFixed(0)}g
          </Badge>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ingrédient</TableHead>
                <TableHead className="w-[150px] text-right">Quantité</TableHead>
                {/* <TableHead className="w-[150px]">Notes</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {ingredients.map((ingredient) => (
                <TableRow key={ingredient.id}>
                  <TableCell>{ingredient.name}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Input
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={editingValues[ingredient.id] || ingredient.quantity.toFixed(1)}
                        onChange={(e) => handleInputChange(ingredient.id, e.target.value)}
                        onBlur={() => handleQuantityConfirm(ingredient.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.currentTarget.blur()
                          }
                        }}
                        className="w-24 text-right"
                      />
                      <span className="w-8">{ingredient.unit}</span>
                    </div>
                  </TableCell>
                  {/* <TableCell>{ingredient.notes}</TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
