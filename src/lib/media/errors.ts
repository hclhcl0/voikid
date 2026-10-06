export class MediaError extends Error {
  constructor(public code:string,public providerStatus?:number,public providerCode?:string) {
    super(code);
    this.name='MediaError';
  }
}

export function providerAudioError(status:number,payload:unknown):MediaError {
  const detail=(payload as {detail?:{code?:unknown;status?:unknown}}|null)?.detail;
  const raw=detail?.code ?? detail?.status;
  // Never forward arbitrary provider messages: they can contain submitted text or credentials.
  const providerCode=typeof raw==='string' && /^[a-zA-Z0-9_-]{1,80}$/.test(raw) ? raw : undefined;
  let code='PROVIDER';
  if(providerCode==='paid_plan_required'||status===402)code='PAID_VOICE';
  else if(providerCode==='detected_unusual_activity')code='UNUSUAL_ACTIVITY';
  else if(providerCode==='quota_exceeded')code='QUOTA';
  else if(providerCode==='voice_not_found')code='VOICE_NOT_FOUND';
  else if(providerCode==='invalid_api_key')code='INVALID_KEY';
  else if(status===401)code='INVALID_KEY';
  else if(status===403)code='PERMISSION';
  else if(status===404)code='VOICE_NOT_FOUND';
  else if(status===429)code='QUOTA';
  else if(status===400||status===422)code='INVALID_REQUEST';
  return new MediaError(code,status,providerCode);
}

export function audioFailure(error:unknown):MediaError {
  if(error instanceof MediaError)return error;
  const e=error as {code?:string;name?:string;message?:string;cause?:{code?:string}};
  if(['EACCES','EPERM','EROFS','ENOSPC'].includes(e?.code??''))return new MediaError('STORAGE');
  if(e?.name==='TimeoutError'||e?.name==='AbortError')return new MediaError('TIMEOUT');
  if(e?.message==='fetch failed'||e?.cause?.code)return new MediaError('NETWORK');
  return new MediaError(e?.message && ['DISABLED','BUSY','INVALID'].includes(e.message)?e.message:'PROVIDER');
}
