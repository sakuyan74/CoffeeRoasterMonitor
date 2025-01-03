'use client';

import './globals.css';
import { Inter } from 'next/font/google';
import { BarChart3, Settings, Home, Search } from 'lucide-react';
import { Button } from './components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const inter = Inter({ subsets: ['latin'] });

interface NavItem {
  icon: typeof Home;
  label: string;
  href: string;
  title: string;
}

const navItems: NavItem[] = [
  { icon: Home, label: 'ダッシュボード', href: '/', title: '焙煎ダッシュボード' },
  { icon: Search, label: '焙煎履歴検索', href: '/search', title: '焙煎履歴検索' },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const currentPage = navItems.find(item => item.href === pathname) || navItems[0];

  return (
    <html lang="ja">
      <body className={inter.className}>
        <div className="flex min-h-screen bg-gray-100">
          {/* サイドバー */}
          <aside className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
            <div className="flex h-full flex-col gap-y-5 px-6 py-4">
              <div className="flex h-16 items-center">
                <h1 className="text-xl font-bold text-gray-900">コーヒー焙煎モニター</h1>
              </div>
              <nav className="flex flex-1 flex-col">
                <ul className="flex flex-1 flex-col gap-y-2">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <li key={item.href}>
                        <Link href={item.href}>
                          <Button
                            variant="ghost"
                            className={cn(
                              'w-full justify-start gap-x-3',
                              'hover:bg-gray-100 hover:text-gray-900',
                              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400',
                              isActive && 'bg-gray-100 text-gray-900'
                            )}
                          >
                            <Icon className="h-5 w-5" />
                            {item.label}
                          </Button>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>
          </aside>

          {/* メインコンテンツ */}
          <main className="flex-1 pl-64">
            <div className="flex h-full flex-col">
              <header className="sticky top-0 z-10 bg-white shadow-sm">
                <div className="flex h-16 items-center gap-x-4 px-6">
                  <h2 className="text-lg font-semibold text-gray-900">{currentPage.title}</h2>
                </div>
              </header>

              <div className="flex-1 px-6 py-8">
                <div className="rounded-lg bg-white p-6 shadow-md">
                  {children}
                </div>
              </div>
            </div>
          </main>
        </div>
      </body>
    </html>
  );
} 