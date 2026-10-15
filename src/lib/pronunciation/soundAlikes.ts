// These are transcription spellings, not permission to skip acoustic assessment.
// Keep the list explicit: edit distance can turn genuinely different sounds into matches.
const GROUPS = [
  ['two', 'to', 'too'],
  ['four', 'for'],
  ['one', 'won'],
  ['eight', 'ate'],
  ['see', 'sea'],
  ['hear', 'here'],
  ['right', 'write'],
  ['week', 'weak'],
  ['no', 'know'],
  ['sun', 'son'],
  ['blue', 'blew'],
  ['new', 'knew'],
  ['buy', 'by', 'bye'],
  ['eye', 'i'],
  ['meet', 'meat'],
  ['pair', 'pear'],
  ['flower', 'flour'],
  ['night', 'knight'],
  ['be', 'bee'],
];
const SPELLINGS = new Map(GROUPS.flatMap(group => group.map(word => [word, group[0]] as const)));

export function normalizeSoundAlikes(tokens: string[], locale: string): string[] {
  if (!/^en(?:-|$)/i.test(locale)) return tokens;
  // Preserve two tokens so sentence omissions and complete-response repetitions
  // still work. A weak "a" in "a clock" can be transcribed instead of "o'clock".
  const words = tokens.flatMap(token => token === 'oclock' ? ['o', 'clock'] : [token]);
  return words.map((word, index) => word === 'a' && words[index + 1] === 'clock'
    ? 'o'
    : SPELLINGS.get(word) ?? word);
}
