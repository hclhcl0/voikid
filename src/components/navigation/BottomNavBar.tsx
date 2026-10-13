'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { BookOpen, Gift, Users, Settings } from 'lucide-react';
import { triggerHaptic } from '@/lib/haptics';

interface NavItem {
  href: string;
  label: string;
  Icon: typeof BookOpen;
  badge?: string;
  color: string;
  activeColor: string;
}

const navItems: NavItem[] = [
  {
    href: '/',
    label: 'Bài học',
    Icon: BookOpen,
    color: 'text-slate-500',
    activeColor: 'text-orange-600',
  },
  {
    href: '/stickers',
    label: 'Sticker',
    Icon: Gift,
    color: 'text-slate-500',
    activeColor: 'text-pink-600',
  },
  {
    href: '/parent',
    label: 'Phụ huynh',
    Icon: Users,
    color: 'text-slate-500',
    activeColor: 'text-blue-600',
  },
  {
    href: '/admin',
    label: 'Cài đặt',
    Icon: Settings,
    color: 'text-slate-500',
    activeColor: 'text-orange-600',
  },
];

export function BottomNavBar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Thanh điều hướng nhanh ứng dụng"
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden border-t-2 border-orange-200/80 bg-white/95 backdrop-blur-md pb-[env(safe-area-inset-bottom,0px)] shadow-[0_-8px_20px_rgba(0,0,0,0.06)]"
    >
      <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-1.5">
        {navItems.map((item) => {
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => triggerHaptic('light')}
              className="relative flex flex-1 flex-col items-center justify-center py-1 touch-spring active:scale-90 transition-transform"
            >
              <div className="relative flex items-center justify-center">
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute -inset-1.5 rounded-2xl bg-orange-100"
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  />
                )}
                <item.Icon
                  className={`relative z-10 h-5 w-5 transition-colors ${
                    isActive ? item.activeColor : item.color
                  }`}
                />
                {item.badge && !isActive && (
                  <span className="absolute -top-1.5 -right-2.5 rounded-full bg-gradient-to-r from-red-500 to-orange-500 px-1 py-0.2 text-[9px] font-black leading-none text-white shadow-sm animate-pulse">
                    {item.badge}
                  </span>
                )}
              </div>
              <span
                className={`relative z-10 mt-1 text-[11px] font-extrabold tracking-tight transition-colors ${
                  isActive ? 'text-slate-900 font-black' : 'text-slate-500'
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
