'use client'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { ModalProvider, QueryProvider, SocketProvider, ThemeProvider } from '@/components/provider'
import Toaster from '@/components/toast'

const font = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Discord Clone',
  description: 'Discord Clone Created by Sergio Suramin S.Kom as a practice',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={font.className}>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} storageKey="discord-clone-theme">
            <SocketProvider>
              <QueryProvider>
                <ModalProvider />
                {children}
                <Toaster />
              </QueryProvider>
            </SocketProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
