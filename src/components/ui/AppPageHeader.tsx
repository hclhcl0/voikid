import Link from 'next/link';
import type {ReactNode} from 'react';
import {ArrowLeft} from 'lucide-react';
import {ChildBadge} from '@/components/ChildBadge';

export function AppPageHeader({title,description,backHref='/',backLabel='Trang chủ',actions,profile=true,compact=false,inset=false}:{title:string;description?:string;backHref?:string;backLabel?:string;actions?:ReactNode;profile?:boolean;compact?:boolean;inset?:boolean}){
  return <header className={`ui-page-header ${compact?'ui-page-header--compact':''} ${inset?'ui-page-header--inset':''}`}>
    <div className="ui-header-top"><Link href={backHref} className="ui-back"><ArrowLeft aria-hidden="true" className="h-4 w-4"/>{backLabel}</Link><div className="ui-header-actions">{profile&&<ChildBadge variant="compact"/>}{actions}</div></div>
    <div className="ui-header-copy"><h1 className="ui-page-title">{title}</h1>{description&&<p className="ui-page-description">{description}</p>}</div>
  </header>;
}
