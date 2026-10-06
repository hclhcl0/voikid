import data from './patterns.json';
import type { CurriculumUnit } from '@/lib/learning/types';
import type { StorySource } from './types';
export const STORY_SOURCE_VERSION = data.version;
export const STORY_GENERATION_VERSION = 4;
export const STORY_SOURCES: StorySource[] = data.units;
export function storySource(unit:CurriculumUnit) {return unit.section==='unit'?STORY_SOURCES.find(s=>s.grade===unit.grade&&s.number===unit.order):undefined;}
