'use client'

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Home, Search, Menu, Coffee, PlusCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  title: string;
}

const navItems: NavItem[] = [
  {
    href: "/",
    label: "ダッシュボード",
    icon: <Home className="h-5 w-5" />,
    title: "焙煎ダッシュボード",
  },
  {
    href: "/roasting/register/list",
    label: "未登録の焙煎一覧",
    icon: <PlusCircle className="h-5 w-5" />,
    title: "未登録の焙煎一覧",
  },
  {
    href: "/roasting/sessions/list",
    label: "焙煎履歴検索",
    icon: <Search className="h-5 w-5" />,
    title: "焙煎履歴検索",
  },
  {
    href: "/beans",
    label: "豆情報",
    icon: <Coffee className="h-5 w-5" />,
    title: "豆情報",
  },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const currentPage = navItems.find(item => item.href === pathname) || navItems[0];

  const NavContent = () => (
    <nav className="space-y-2">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={() => setIsOpen(false)}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium",
            "transition-colors hover:bg-gray-100",
            pathname === item.href ? "bg-gray-100 text-gray-900" : "text-gray-600"
          )}
        >
          {item.icon}
          {item.label}
        </Link>
      ))}
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* PC用サイドバー */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 z-20 w-64 bg-white shadow-lg">
        <div className="flex h-full flex-col gap-y-5 px-6 py-4">
          <div className="flex h-16 items-center">
            <h1 className="text-xl font-bold">Coffee Roaster</h1>
          </div>
          <div className="flex-1">
            <NavContent />
          </div>
        </div>
      </aside>

      {/* モバイル用ヘッダー */}
      <div className="fixed top-0 left-0 right-0 z-30 lg:hidden">
        <header className="bg-white border-b px-4 h-16 flex items-center justify-between shadow-sm">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
                <span className="sr-only">メニューを開く</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
              <div className="flex flex-col h-full">
                <div className="px-4 py-6 border-b">
                  <h1 className="text-xl font-bold">Coffee Roaster</h1>
                </div>
                <div className="px-3 py-4">
                  <NavContent />
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <h2 className="text-lg font-semibold">{currentPage.title}</h2>
          <div className="w-10" />
        </header>
      </div>

      {/* メインコンテンツ */}
      <main className={cn(
        "flex-1 min-h-screen bg-gray-50",
        "lg:pl-64", // PC表示時のサイドバー分のパディング
        "pt-16 lg:pt-6" // モバイル表示時のヘッダー分のパディング
      )}>
        <div className="container mx-auto px-4">
          <div className="hidden lg:block mb-6">
            <h2 className="text-2xl font-semibold">{currentPage.title}</h2>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}

