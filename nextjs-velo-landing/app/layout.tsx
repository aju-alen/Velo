import { Figtree } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { siteConfig } from '@/lib/seo';
import './globals.css';

const figtree = Figtree({
  subsets: ['latin'],
  variable: '--font-figtree',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={figtree.variable}>
      <body className={`${figtree.className} antialiased`}>
        <div className="flex flex-col min-h-screen max-w-[100vw]">
          <Navbar />
          <main className="flex-1 pt-24">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}

export const metadata = {
  metadataBase: new URL(siteConfig.url),
};
