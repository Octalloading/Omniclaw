'use client'

import dynamic from 'next/dynamic'

// Dynamic import to avoid SSR issues with Three.js
const OceanScene = dynamic(
  () => import('@/components/ocean/scene').then((mod) => mod.OceanScene),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="space-y-4 text-center">
          <div className="mx-auto h-16 w-16 animate-pulse rounded-full bg-primary/20" />
          <div className="space-y-2">
            <p className="text-xl font-medium text-foreground">OmniClaw</p>
            <p className="text-muted-foreground">Entering the White Sea...</p>
          </div>
        </div>
      </div>
    ),
  }
)

export default function Home() {
  return (
    <main className="h-screen w-full overflow-hidden bg-background">
      <OceanScene />
    </main>
  )
}
