import { notFound } from 'next/navigation';
import { curriculumForCategories } from '@/lib/learning/curriculum';
import { readContent } from '@/lib/backend/store';
export const dynamic = 'force-dynamic';
import { LearningPlayer } from '@/components/learning/LearningPlayer';
import {StoryReader} from '@/components/learning/StoryReader';
import {storySource} from '@/lib/stories/source';

export default async function UnitPage({ params }: { params: Promise<{ unitId: string }> }) {
  const { unitId } = await params;
  const unit = curriculumForCategories(readContent().categories.filter(c => !c.archived)).find(u => u.id === unitId);
  if (!unit) notFound();
  const source=storySource(unit);
  return source?<StoryReader unit={unit} source={source}/>:<LearningPlayer unit={unit} />;
}
