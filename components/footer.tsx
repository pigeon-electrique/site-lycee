'use client'

import Link from 'next/link'
import { Separator } from '@/components/ui/separator'
import { useSiteConfig } from '@/hooks/use-site-config'

export function Footer() {
  const currentYear = new Date().getFullYear()
  const siteConfig = useSiteConfig()

  return (
    <footer className="w-full border-t bg-background">
      <div className="w-full max-w-[1400px] mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-16">
          <div className="md:ml-16">
            <h3 className="font-semibold mb-4">À propos</h3>
            <p className="text-sm text-muted-foreground">
              {siteConfig.name} recueil de recettes du lycée Georges Frêches
            </p>
          </div>
          <div className="md:ml-24">
            <h3 className="font-semibold mb-4">Liens utiles</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/cgu" className="text-muted-foreground hover:text-foreground transition-colors">
                  Conditions Générales d'Utilisation
                </Link>
              </li>
              <li>
                <Link href="/mentions-legales" className="text-muted-foreground hover:text-foreground transition-colors">
                  Mentions Légales
                </Link>
              </li>
              <li>
                <Link href="/politique-confidentialite" className="text-muted-foreground hover:text-foreground transition-colors">
                  Politique de Confidentialité
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            © {currentYear} {siteConfig.name}. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  )
}
