'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface SiteConfig {
  name: string
  description: string
  contactEmail: string
  maintenanceMode: boolean
  allowRegistration: boolean
  recipesPerPage: number
  maxImageSize: number
  requireEmailVerification: boolean
  autoDeleteInactiveUsers: boolean
  inactiveUserDays: number
}

interface SiteConfigContextType {
  config: SiteConfig | null
  isLoading: boolean
  updateConfig: (newConfig: SiteConfig) => void
  refreshConfig: () => Promise<void>
}

const defaultConfig: SiteConfig = {
  name: 'Pâtisserie',
  description: 'Partagez vos meilleures recettes de pâtisserie',
  contactEmail: 'contact@patisserie.fr',
  maintenanceMode: false,
  allowRegistration: true,
  recipesPerPage: 12,
  maxImageSize: 5,
  requireEmailVerification: true,
  autoDeleteInactiveUsers: false,
  inactiveUserDays: 365
}

const SiteConfigContext = createContext<SiteConfigContextType | undefined>(undefined)

interface SiteConfigProviderProps {
  children: ReactNode
}

export function SiteConfigProvider({ children }: SiteConfigProviderProps) {
  const [config, setConfig] = useState<SiteConfig | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchConfig = async () => {
    try {
      const response = await fetch('/api/site-config')
      if (response.ok) {
        const data = await response.json()
        setConfig(data)
      } else {
        setConfig(defaultConfig)
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la configuration:', error)
      setConfig(defaultConfig)
    } finally {
      setIsLoading(false)
    }
  }

  const updateConfig = (newConfig: SiteConfig) => {
    setConfig(newConfig)
  }

  const refreshConfig = async () => {
    await fetchConfig()
  }

  useEffect(() => {
    fetchConfig()
  }, [])

  return (
    <SiteConfigContext.Provider value={{ 
      config, 
      isLoading, 
      updateConfig, 
      refreshConfig 
    }}>
      {children}
    </SiteConfigContext.Provider>
  )
}

export function useSiteConfig() {
  const context = useContext(SiteConfigContext)
  if (context === undefined) {
    throw new Error('useSiteConfig must be used within a SiteConfigProvider')
  }
  return context
}