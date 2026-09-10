import type { Metadata } from 'next';
import { Inter, JetBrains_Mono, Space_Grotesk } from 'next/font/google';
import { SiteHeader } from '@/components/site-header';
import { ScrollScene } from '@/components/3d/ScrollScene';
import { LenisProvider } from '@/components/providers/LenisProvider';
import { CustomCursor } from '@/components/ui/CustomCursor';
import { Footer } from '@/components/ui/Footer';
import { techVrikshLogoUrl } from '@/app/data';
import { BrandLoader } from '@/components/ui/BrandLoader';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk'
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter'
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono'
});

export const metadata: Metadata = {
  title: 'Tech Vriksh',
  description: 'A student-driven technology community connecting people, ideas and opportunities across India.',
  icons: {
    icon: techVrikshLogoUrl,
    shortcut: techVrikshLogoUrl,
    apple: techVrikshLogoUrl,
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" href="/tech-vriksh-logo.webp" as="image" type="image/webp" fetchPriority="high" />
      </head>
      <body className={`${spaceGrotesk.variable} ${inter.variable} ${jetBrainsMono.variable} tv-shell flex flex-col min-h-screen`}>
        <BrandLoader />
        <LenisProvider>
          <ScrollScene />
          <SiteHeader />
          <div className="flex-1 flex flex-col tv-content-layer">{children}</div>
          <Footer />
        </LenisProvider>
      </body>
    </html>
  );
}
