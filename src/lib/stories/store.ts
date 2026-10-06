import * as fs from 'node:fs';
import * as path from 'node:path';
import type { StoryLesson } from './types';
const directory=()=>path.join(process.env.VOCAKIDS_CONTENT_DIR||path.join(process.cwd(),'data','backend'),'stories');
function file(hash:string) {if(!/^[a-f0-9]{64}$/.test(hash)) throw new Error('Invalid story id');return path.join(directory(),`${hash}.json`);}
export function readStory(hash:string):StoryLesson|null {const target=file(hash);return fs.existsSync(target)?JSON.parse(fs.readFileSync(target,'utf8')):null;}
export function saveStory(hash:string,story:StoryLesson) {fs.mkdirSync(directory(),{recursive:true});const target=file(hash),tmp=`${target}.${process.pid}.tmp`;fs.writeFileSync(tmp,JSON.stringify(story),{mode:0o600});fs.renameSync(tmp,target);}
function vocabularyFile(hash:string) {if(!/^[a-f0-9]{64}$/.test(hash))throw new Error('Invalid vocabulary id');return path.join(directory(),'vocabulary',`${hash}.json`);}
export function readVocabulary(hash:string):unknown {const target=vocabularyFile(hash);return fs.existsSync(target)?JSON.parse(fs.readFileSync(target,'utf8')):null;}
export function saveVocabulary(hash:string,vocabulary:StoryLesson['vocabulary']) {const target=vocabularyFile(hash);fs.mkdirSync(path.dirname(target),{recursive:true});const tmp=`${target}.${process.pid}.tmp`;fs.writeFileSync(tmp,JSON.stringify({vocabulary}),{mode:0o600});fs.renameSync(tmp,target);}
