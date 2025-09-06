'use client'

import { useState, useEffect } from 'react'

interface SiteConfig {
  name: string
  description: string
  contactEmail: string
}

export function useSiteConfig() {
  const [config, setConfig] = useState<SiteConfig>({
    name: 'Pâtisserie',
    description: 'recueil de recettes du lycée Georges Frêches',
    contactEmail: 'contact@patisserie.fr'
  })

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const response = await fetch('/api/admin/settings')
        if (response.ok) {
          const data = await response.json()
          setConfig({
            name: data.name,
            description: data.description,
            contactEmail: data.contactEmail
          })
        }
      } catch (error) {
        console.error('Erreur lors du chargement de la configuration:', error)
      }
    }

    loadConfig()
  }, [])

  return config
}
