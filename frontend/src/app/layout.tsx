import type { Metadata } from 'next'
import './globals.css';

export const metadata: Metadata = {
  title: 'Task Manager',
  description: 'A clean and simple task management system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
          {children}
        </div>
      </body>
    </html>
  )
}
