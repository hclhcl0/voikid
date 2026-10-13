/**
 * Phản hồi rung haptic xúc giác cho thiết bị di động (Web Haptics API)
 */
export function triggerHaptic(type: 'light' | 'medium' | 'success' | 'warning' = 'light'): void {
  if (typeof window === 'undefined' || !('vibrate' in navigator)) return;
  try {
    if (type === 'light') {
      navigator.vibrate(8);
    } else if (type === 'medium') {
      navigator.vibrate(18);
    } else if (type === 'success') {
      navigator.vibrate([12, 40, 25]);
    } else if (type === 'warning') {
      navigator.vibrate([30, 50, 30]);
    }
  } catch {
    // Trình duyệt không hỗ trợ hoặc chặn quyền rung
  }
}
