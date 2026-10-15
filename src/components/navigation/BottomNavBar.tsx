"use client";
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {BookOpen,BookOpenText,Gamepad2,Gift,RotateCcw,UsersRound} from 'lucide-react';
import {useAuth} from '@/context/AuthContext';
import {navigationActive,primaryNavigation,type AppSection} from '@/lib/navigation';
const icons={learning:BookOpen,reading:BookOpenText,games:Gamepad2,stickers:Gift,family:UsersRound,review:RotateCcw};
export function BottomNavBar(){
  const pathname=usePathname(),{account}=useAuth();
  return <nav className="ui-app-nav" aria-label="Điều hướng chính"><div className="ui-app-nav-inner">{primaryNavigation(account?.role).map(item=>{
    const active=navigationActive(item.id as AppSection,pathname,account?.role),Icon=icons[item.id as AppSection];
    return <Link key={item.id} href={item.href} aria-current={active?'page':undefined} className="ui-nav-item"><Icon aria-hidden="true" className="h-5 w-5"/><span>{item.label}</span></Link>;
  })}</div></nav>;
}
