'use client'

import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function AdminBackButton() {
  return (
    <Button
      variant="ghost"
      className="mb-8"
      asChild
    >
      <Link href="/admin">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour au panneau d'administration
      </Link>
    </Button>
  )
}
