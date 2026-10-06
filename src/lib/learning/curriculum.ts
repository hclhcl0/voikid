import { CATEGORIES } from '../vocabulary';
import { PILOT_DRAFTS } from './pilots';
import type { CurriculumUnit, Grade, Skill } from './types';

export const CURRICULUM_SOURCES = [
  { id: 'gs-portal', url: 'https://gs.hoclieu.vn/', title: 'Cổng học liệu Global Success', checkedAt: '2026-10-05', scope: 'Có sách học sinh lớp 1–5; lớp 3–5 có tập 1 và tập 2. Chưa đối chiếu mục lục và mục tiêu từng bài.' },
  { id: 'nxbgd-training', url: 'https://taphuan.nxbgd.vn/', title: 'Tập huấn NXBGD', checkedAt: '2026-10-05', scope: 'Chưa truy cập được nội dung để đối chiếu.' },
  { id: 'nxbgd', url: 'https://www.nxbgd.vn/', title: 'Nhà xuất bản Giáo dục Việt Nam', checkedAt: null, scope: 'Nguồn cần đối chiếu; chưa xác nhận ấn bản.' },
];

export const GRADE_CONFIG: Record<Grade, { choices: number; batch: number; writing: boolean; description: string }> = {
  1: { choices: 2, batch: 3, writing: false, description: 'Nghe, chạm chọn, nói theo câu ngắn.' },
  2: { choices: 3, batch: 4, writing: false, description: 'Chọn từ, sắp chữ, hỏi đáp có hỗ trợ.' },
  3: { choices: 3, batch: 5, writing: true, description: 'Đọc ngắn, nhớ cách viết, tạo câu theo mẫu.' },
  4: { choices: 4, batch: 6, writing: true, description: 'Nghe/đọc chi tiết và hội thoại có hướng dẫn.' },
  5: { choices: 4, batch: 7, writing: true, description: 'Dùng từ trong ngữ cảnh và nhiệm vụ giao tiếp.' },
};

const objectives: { skill: Skill; text: string }[] = [
  { skill: 'meaning', text: 'Nhận biết nghĩa của từ/cụm từ trong bộ từ hiện có.' },
  { skill: 'listening', text: 'Nghe và nhận diện từ/cụm từ.' },
  { skill: 'spelling', text: 'Tự nhớ mặt chữ và cách viết.' },
  { skill: 'context', text: 'Hiểu từ/cụm từ trong ngữ cảnh bổ trợ.' },
  { skill: 'application', text: 'Thực hành dùng mẫu câu trong tình huống có hỗ trợ.' },
  { skill: 'speaking', text: 'Nghe mẫu, nói và tự nghe lại; chưa chấm phát âm.' },
];

export const CURRICULUM: CurriculumUnit[] = CATEGORIES.filter(c => /^lop[1-5]$/.test(c.gradeId)).map((cat, index) => {
  const grade = Number(cat.gradeId.slice(3)) as Grade;
  const pilot = PILOT_DRAFTS.find(p => p.unitId === cat.id);
  const declaredUnit = cat.name_en.match(/^unit\s+(\d+)/i);
  const section = declaredUnit ? 'unit' : /^review/i.test(cat.name_en) ? 'review' : /^starter/i.test(cat.name_en) ? 'starter' : 'extension';
  const unitObjectives = objectives.map(o => ({ ...o, id: `${cat.id}:${o.skill}`, origin: 'supplementary' as const }));
  // Malformed imported expressions (missing meaning) are visible in the audit,
  // but never become questions. Pilot examples use only explicitly authored terms.
  const eligible = cat.words.filter(w => w.en.trim() && w.vi.trim() && (!pilot || pilot.examples[w.en.toLowerCase()]));
  const vocabulary = eligible.map(w => {
    const example = pilot?.examples[w.en.toLowerCase()];
    return {
      id: w.id, text: w.en, kind: /[?!]/.test(w.en) ? 'expression' as const : /\s/.test(w.en) ? 'phrase' as const : 'word' as const,
      senses: [{ id: `${w.id}:sense1`, meaningVi: w.vi, imageSrc: w.image_url, emoji: ['🔮', '🌊', '📝'].includes(w.emoji) ? undefined : w.emoji, exampleEn: example?.[0] ?? w.example_en, exampleVi: example?.[1] ?? w.example_vi }],
      ipa: w.phonetic, audioSrc: w.audio_url, grade, unitId: cat.id,
      lessonIds: [`${cat.id}:practice`], objectiveIds: unitObjectives.map(o => o.id),
      sourceReferences: ['local:src/lib/vocabulary.ts'], verificationStatus: 'unverified' as const, version: 1,
    };
  });
  return {
    id: cat.id, grade, bookEditionId: `global-success-lop${grade}-edition-unconfirmed`, volume: 'unconfirmed',
    section, order: declaredUnit ? Number(declaredUnit[1]) : index + 1,
    title: cat.name_vi, emoji: cat.emoji, verificationStatus: 'unverified', status: 'draft',
    sourceReferences: ['local:src/lib/vocabulary.ts', 'gs-portal'],
    lessons: [{ id: `${cat.id}:practice`, title: 'Chặng luyện bổ trợ', objectiveIds: unitObjectives.map(o => o.id) }],
    objectives: unitObjectives, vocabulary,
    excludedWordIds: cat.words.filter(w => !eligible.includes(w)).map(w => w.id),
    resource: pilot ? {
      id: `${cat.id}:context`, version: 1, kind: grade <= 2 ? 'picture-task' : 'dialogue', title: pilot.title, status: 'draft',
      scenes: pilot.scenes.map((s, i) => ({ id: `${cat.id}:scene${i + 1}`, speaker: s.speaker, en: s.en, vi: s.vi, vocabularyIds: vocabulary.filter(v => s.terms.includes(v.text.toLowerCase())).map(v => v.id) })),
      objectiveIds: [`${cat.id}:context`, `${cat.id}:application`], sourceReferences: ['local:src/lib/learning/pilots.ts'], application: pilot.application,
      questions: [{ id: `${cat.id}:context-detail`, question: pilot.comprehension.question, hint: pilot.comprehension.hint,
        answerId: vocabulary.find(v => v.text.toLowerCase() === pilot.comprehension.answer)!.id,
        options: pilot.comprehension.choices.slice(0, GRADE_CONFIG[grade].choices).map(term => vocabulary.find(v => v.text.toLowerCase() === term)!).map(v => ({ id: v.id, text: v.text })) }],
    } : undefined,
  };
});

export function getUnit(id: string) { return CURRICULUM.find(u => u.id === id); }
export function getPilot(grade: Grade) { return CURRICULUM.find(u => u.grade === grade && u.resource); }

export function validateCurriculum(units = CURRICULUM): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  for (const unit of units) {
    if (ids.has(unit.id)) errors.push(`Duplicate unit: ${unit.id}`);
    ids.add(unit.id);
    const wordIds = new Set<string>();
    const objectiveIds = new Set(unit.objectives.map(o => o.id));
    for (const word of unit.vocabulary) {
      if (wordIds.has(word.id)) errors.push(`Duplicate word: ${unit.id}/${word.id}`);
      wordIds.add(word.id);
      if (!word.text.trim() || !word.senses.length || word.senses.some(s => !s.meaningVi.trim())) errors.push(`Invalid sense: ${word.id}`);
      if (word.objectiveIds.some(id => !objectiveIds.has(id))) errors.push(`Invalid objective: ${word.id}`);
    }
    for (const scene of unit.resource?.scenes ?? []) {
      if (scene.vocabularyIds.some(id => !wordIds.has(id))) errors.push(`Invalid scene reference: ${scene.id}`);
    }
    for (const question of unit.resource?.questions ?? []) {
      if (!question.options.some(o => o.id === question.answerId) || question.options.some(o => !wordIds.has(o.id))) errors.push(`Invalid context answer: ${question.id}`);
    }
    if (unit.status === 'published' && (unit.verificationStatus !== 'verified' || (unit.resource && unit.resource.status !== 'published'))) errors.push(`Unreviewed publication: ${unit.id}`);
  }
  return errors;
}

/** Apply managed vocabulary while preserving the legacy IDs used by progress. */
export function curriculumForCategories(categories: (import('@/types').Category & { gradeId: string })[]): CurriculumUnit[] {
  return categories.filter(c => /^lop[1-5]$/.test(c.gradeId)).map((cat, index) => {
    const original = getUnit(cat.id);
    const grade = Number(cat.gradeId.slice(3)) as Grade;
    const unitObjectives = objectives.map(o => ({ ...o, id: `${cat.id}:${o.skill}`, origin: 'supplementary' as const }));
    const eligible = cat.words.filter(w => w.en.trim() && w.vi.trim());
    const vocabulary = eligible.map(w => {
      const baseline = CATEGORIES.find(c => c.id === cat.id)?.words.find(v => v.id === w.id);
      const authored = original?.vocabulary.find(v => v.id === w.id && v.text === w.en);
      return { id: w.id, text: w.en, kind: /\s/.test(w.en) ? 'phrase' as const : 'word' as const,
        senses: [{ id: `${w.id}:sense1`, meaningVi: w.vi, emoji: w.emoji, imageSrc: w.image_url, exampleEn: (w.example_en === baseline?.example_en ? authored?.senses[0].exampleEn : w.example_en) ?? w.example_en, exampleVi: (w.example_vi === baseline?.example_vi ? authored?.senses[0].exampleVi : w.example_vi) ?? w.example_vi }],
        ipa: w.phonetic, audioSrc: w.audio_url, grade, unitId: cat.id, lessonIds: [`${cat.id}:practice`], objectiveIds: unitObjectives.map(o => o.id), sourceReferences: ['server:catalog'], verificationStatus: 'unverified' as const, version: 1 };
    });
    const ids = new Set(vocabulary.map(v => v.id));
    const resource = original?.resource;
    const validResource = resource && resource.scenes.every(s => s.vocabularyIds.every(id => ids.has(id))) && resource.questions.every(q => q.options.every(o => ids.has(o.id))) && original.vocabulary.every(v => vocabulary.some(w => w.id === v.id && w.text.toLowerCase() === v.text.toLowerCase()));
    return { ...(original ?? {}), id: cat.id, grade, bookEditionId: `global-success-lop${grade}-edition-unconfirmed`, volume: 'unconfirmed' as const,
      section: original?.section ?? 'extension', order: original?.order ?? index + 1, title: cat.name_vi, emoji: cat.emoji, verificationStatus: 'unverified' as const, status: 'draft' as const,
      sourceReferences: ['server:catalog'], lessons: [{ id: `${cat.id}:practice`, title: 'Chặng luyện bổ trợ', objectiveIds: unitObjectives.map(o => o.id) }],
      objectives: unitObjectives, vocabulary, excludedWordIds: cat.words.filter(w => !eligible.includes(w)).map(w => w.id), resource: validResource ? resource : undefined };
  });
}

