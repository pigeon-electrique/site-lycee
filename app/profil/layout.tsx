import { ClientWrapper } from '@/components/client-wrapper'

export default function ProfilLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClientWrapper>
      {children}
    </ClientWrapper>
  )
}