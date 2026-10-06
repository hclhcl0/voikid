export type Grade = 1 | 2 | 3 | 4 | 5;
export type Skill = 'meaning' | 'listening' | 'spelling' | 'context' | 'application' | 'speaking';
export type PublicationStatus = 'draft' | 'source-verified' | 'content-reviewed' | 'ready' | 'published';
export type VerificationStatus = 'unverified' | 'verified';

export interface VocabularyItem {
  id: string;
  text: string;
  kind: 'word' | 'phrase' | 'expression';
  senses: { id: string; meaningVi: string; imageSrc?: string; emoji?: string; exampleEn: string; exampleVi: string }[];
  ipa?: string;
  audioSrc?: string;
  grade: Grade;
  unitId: string;
  lessonIds: string[];
  objectiveIds: string[];
  sourceReferences: string[];
  verificationStatus: VerificationStatus;
  version: number;
}

export interface LearningResource {
  id: string;
  version: number;
  kind: 'dialogue' | 'story' | 'picture-task';
  title: string;
  status: PublicationStatus;
  scenes: { id: string; speaker?: string; en: string; vi: string; vocabularyIds: string[] }[];
  objectiveIds: string[];
  sourceReferences: string[];
  application: { instruction: string; prompts: string[]; example: string; exampleVi: string };
  questions: { id: string; question: string; hint: string; answerId: string; options: { id: string; text: string }[] }[];
}

export interface CurriculumUnit {
  id: string;
  grade: Grade;
  bookEditionId: string;
  volume: 'unconfirmed';
  section: 'unit' | 'review' | 'starter' | 'extension';
  order: number;
  title: string;
  emoji: string;
  verificationStatus: VerificationStatus;
  status: PublicationStatus;
  sourceReferences: string[];
  lessons: { id: string; title: string; objectiveIds: string[] }[];
  objectives: { id: string; text: string; skill: Skill; origin: 'supplementary' }[];
  vocabulary: VocabularyItem[];
  resource?: LearningResource;
  excludedWordIds: string[];
}

interface ActivityBase {
  id: string;
  vocabularyId: string;
  senseId: string;
  objectiveIds: string[];
  skill: Skill;
  instruction: string;
  hint: string;
}
export type Activity =
  | (ActivityBase & { kind: 'meaning-choice' | 'word-choice' | 'listen-choice'; options: { id: string; text: string }[]; answerId: string; audioText?: string })
  | (ActivityBase & { kind: 'spelling' | 'dictation'; answers: string[]; audioText?: string })
  | (ActivityBase & { kind: 'letter-order'; tokens: { id: string; text: string }[]; answerTokenIds: string[]; answer: string })
  | (ActivityBase & { kind: 'context-choice'; text: string; options: { id: string; text: string }[]; answerId: string });

export interface AnswerEvidence {
  history?: { response: string; correct: boolean; at: string }[];
  activityId: string;
  vocabularyId: string;
  senseId: string;
  objectiveIds: string[];
  skill: Skill;
  attempts: number;
  firstCorrect: boolean;
  correct: boolean;
  hinted: boolean;
  revealed: boolean;
  audioPlayed: boolean;
  completedAt: string;
  response: string;
  reviewDueDate: string;
}

export interface LearningSession {
  id: string;
  profileId: string;
  unitId: string;
  contentVersion: number;
  mode: 'path' | Activity['kind'] | 'review';
  createdAt: string;
  updatedAt: string;
  stage: 'cards' | 'activities' | 'resource' | 'application' | 'result';
  cardIndex: number;
  cardMode: 'familiar' | 'recall' | 'listen';
  cardRatings: Record<string, 'remember' | 'again'>;
  activities: Activity[];
  activityIndex: number;
  evidence: Record<string, AnswerEvidence>;
  sceneIndex: number;
  resourceRead: boolean;
  applicationResponse: string;
  applicationCompleted: boolean;
  speakingPracticed: boolean;
  completed: boolean;
  rewardGranted: boolean;
}

export const CONTENT_VERSION = 2;
export const SKILL_LABELS: Record<Skill, string> = {
  meaning: 'Nhận biết nghĩa', listening: 'Nghe nhận biết', spelling: 'Cách viết',
  context: 'Hiểu trong câu', application: 'Vận dụng', speaking: 'Thực hành nói (chưa chấm)',
};
export const ACTIVITY_LABELS: Record<Activity['kind'], string> = {
  'meaning-choice': 'Từ → nghĩa', 'word-choice': 'Nghĩa → từ', 'listen-choice': 'Nghe → từ',
  spelling: 'Nhớ & viết', dictation: 'Nghe & viết', 'letter-order': 'Sắp chữ', 'context-choice': 'Hiểu trong câu',
};
