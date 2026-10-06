import type {NextRequest} from 'next/server';
import {isBackendAdmin} from '@/lib/backend/auth';
import {getAccountFromRequest} from '@/lib/auth';
import {readFamilies} from '@/lib/backend/families';
export function mediaRole(req:NextRequest){if(isBackendAdmin(req))return 'admin';const payload=getAccountFromRequest(req);return readFamilies().accounts.find(a=>a.id===payload?.accountId)?.role;}
