import type { Metadata, Viewport } from 'next';
import { Nunito, Baloo_2, Lexend, Andika } from 'next/font/google';
import { AppProviders } from '@/components/AppProviders';
import './globals.css';

const nunito = Nunito({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '600', '700', '800', '900'],
  variable: '--font-nunito',
  display: 'swap',
});

const baloo2 = Baloo_2({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-baloo',
  display: 'swap',
});

const lexend = Lexend({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-lexend',
  display: 'swap',
});

const andika = Andika({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '700'],
  variable: '--font-andika',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'VocaKids – Luyện Từ Vựng Tiếng Anh Cho Bé',
  description:
    'Ứng dụng luyện đọc và nói từ vựng tiếng Anh vui nhộn dành cho trẻ em. Chấm điểm phát âm bằng AI, gamification với sao và pháo hoa!',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'VocaKids',
  },
  icons: {
    icon: '/icon-192.png',
    apple: '/icon-192.png',
  },
  keywords: ['học tiếng anh', 'từ vựng', 'trẻ em', 'phát âm', 'tiếng anh cho bé'],
};

export const viewport: Viewport = {
  themeColor: '#F97316',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${nunito.variable} ${baloo2.variable} ${lexend.variable} ${andika.variable}`}>
      <body className="font-nunito antialiased bg-[#FFF7ED] min-h-screen">
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}

