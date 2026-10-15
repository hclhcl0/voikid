export interface ParentAiSettings { enabled: boolean; dailyLimit: number }
export const defaultParentAiSettings: ParentAiSettings = { enabled: false, dailyLimit: 5 };
export function validateParentAiSettings(value: unknown): asserts value is ParentAiSettings {
  const s = value as ParentAiSettings;
  if (!s || typeof s.enabled !== 'boolean' || !Number.isInteger(s.dailyLimit) || s.dailyLimit < 0 || s.dailyLimit > 1000) throw new Error('Giới hạn AI phụ huynh phải từ 0 đến 1.000 lượt mỗi ngày.');
}
