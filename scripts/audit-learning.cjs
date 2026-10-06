/* eslint-disable @typescript-eslint/no-require-imports -- Audit shares the Node TypeScript test loader. */
const fs = require('node:fs');
const { load } = require('../tests/ts-loader.cjs');
const { CURRICULUM, CURRICULUM_SOURCES, validateCurriculum } = load('src/lib/learning/curriculum.ts');
const { CATEGORIES } = load('src/lib/vocabulary.ts');
const errors = validateCurriculum();
if (errors.length) throw new Error(errors.join('\n'));
const coverage = [1, 2, 3, 4, 5].map(grade => {
  const units = CURRICULUM.filter(u => u.grade === grade);
  return { grade, existingCategories: units.length, declaredUnitsUnverified: units.filter(u => u.section === 'unit').length, extensions: units.filter(u => u.section === 'extension').length, vocabularyItems: units.reduce((n, u) => n + u.vocabulary.length, 0), pilotResources: units.filter(u => u.resource).length, sourceVerified: 0, published: 0 };
});
const rows = CURRICULUM.map(unit => ({
  grade: unit.grade, book: `Tiếng Anh ${unit.grade} Global Success (đối chiếu dự kiến)`, edition: 'Chưa xác minh', volume: 'Chưa gán',
  section: unit.section, orderFromExistingData: unit.order, id: unit.id, legacyCategoryId: unit.id, titleFromExistingData: unit.title,
  communicationObjectives: unit.objectives, vocabulary: unit.vocabulary.map(v => ({ id: v.id, text: v.text, meaningVi: v.senses[0].meaningVi, exampleEn: v.senses[0].exampleEn, exampleVi: v.senses[0].exampleVi })),
  pronunciationTargets: 'IPA hiện có chưa đối chiếu mục tiêu âm theo Unit', lessons: unit.lessons,
  sourceReferences: unit.sourceReferences, verificationStatus: unit.verificationStatus, publicationStatus: unit.status,
  pilotResourceId: unit.resource?.id ?? null, omittedFromNewPractice: unit.excludedWordIds,
}));
const languageIssues = CATEGORIES.flatMap(c => c.words.filter(w => !w.en.trim() || !w.vi.trim() || /^We learn about /i.test(w.example_en) || (w.phonetic && !/^\/[\s\S]+\/$/.test(w.phonetic))).map(w => ({ categoryId: c.id, wordId: w.id, text: w.en, issues: [!w.vi.trim() ? 'missing-meaning' : null, /^We learn about /i.test(w.example_en) ? 'generic-generated-example-needs-review' : null, w.phonetic && !/^\/[\s\S]+\/$/.test(w.phonetic) ? 'ipa-needs-review' : null].filter(Boolean) })));
fs.mkdirSync('docs', { recursive: true });
fs.writeFileSync('docs/global-success-map.json', JSON.stringify({ generatedAt: '2026-10-05', note: 'Inventory, not a verified official contents list. No legacy IDs migrated.', sources: CURRICULUM_SOURCES, coverage, rows, languageIssues }, null, 2) + '\n');
console.table(coverage);
console.log(`Validated ${rows.length} categories. Flagged ${languageIssues.length} language items for review.`);
