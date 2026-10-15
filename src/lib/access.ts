export function canManageFamily(role:string|undefined,backendAdmin=false):boolean {
  if(role==='student')return false;
  return role==='parent'||role==='admin'||backendAdmin;
}
