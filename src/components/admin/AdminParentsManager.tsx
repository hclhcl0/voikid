'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { GRADE_LEVELS } from '@/lib/vocabulary';
import { AVATAR_LIST } from '@/context/ProfileContext';

interface ChildSummary {
  id: string;
  name: string;
  gradeId: string;
  avatar: string;
  stars: number;
  wordsStudied: number;
  lastActiveDate: string;
}

interface ParentAccountSummary {
  id: string;
  email: string;
  displayName: string;
  role: string;
  children: ChildSummary[];
  customWordsCount: number;
}

export function AdminParentsManager() {
  const [parents, setParents] = useState<ParentAccountSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Reset password modal
  const [resetModalParent, setResetModalParent] = useState<ParentAccountSummary | null>(null);
  const [newPassword, setNewPassword] = useState('123456');
  const [submittingReset, setSubmittingReset] = useState(false);

  // Create parent modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newPw, setNewPw] = useState('123456');
  const [newName, setNewName] = useState('');
  const [newChildName, setNewChildName] = useState('');
  const [newChildGrade, setNewChildGrade] = useState('lop1');
  const [newChildAvatar, setNewChildAvatar] = useState('🐰');
  const [submittingCreate, setSubmittingCreate] = useState(false);

  // Fetch parent list
  const fetchParents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/family', { cache: 'no-store' });
      const data = await res.json();
      if (res.ok&&data.success && Array.isArray(data.parents)) {
        setParents(data.parents);
      }else{setParents([]);setMsg({type:'error',text:'Phiên quản trị không còn hiệu lực.'});}
    } catch {
      setParents([]);
      setMsg({ type: 'error', text: 'Không tải được danh sách phụ huynh.' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchParents();
  }, [fetchParents]);

  // Handle Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetModalParent) return;
    if (newPassword.length < 6) {
      setMsg({ type: 'error', text: 'Mật khẩu phải từ 6 ký tự trở lên!' });
      return;
    }

    setSubmittingReset(true);
    setMsg(null);
    try {
      const res = await fetch('/api/admin/family', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'admin_reset_password',
          parentId: resetModalParent.id,
          newPassword,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMsg({ type: 'success', text: data.message || `Đã đổi mật khẩu cho ${resetModalParent.email} thành công!` });
        setResetModalParent(null);
        setNewPassword('123456');
      } else {
        setMsg({ type: 'error', text: data.message || 'Không đổi được mật khẩu.' });
      }
    } catch (err: any) {
      setMsg({ type: 'error', text: err?.message || 'Lỗi kết nối khi đổi mật khẩu.' });
    } finally {
      setSubmittingReset(false);
    }
  };

  // Handle Delete Parent
  const handleDeleteParent = async (parent: ParentAccountSummary) => {
    const confirmMsg = `Bạn có chắc chắn muốn xóa tài khoản phụ huynh "${parent.email}"?\n\nTất cả hồ sơ các bé (${parent.children.map(c => c.name).join(', ') || '0'}) và tiến độ liên quan sẽ bị xóa hoàn toàn.`;
    if (!window.confirm(confirmMsg)) return;

    setMsg(null);
    try {
      const res = await fetch('/api/admin/family', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'admin_delete_parent',
          parentId: parent.id,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMsg({ type: 'success', text: data.message || `Đã xóa tài khoản ${parent.email}.` });
        fetchParents();
      } else {
        setMsg({ type: 'error', text: data.message || 'Không xóa được tài khoản.' });
      }
    } catch (err: any) {
      setMsg({ type: 'error', text: err?.message || 'Lỗi khi xóa tài khoản.' });
    }
  };

  // Handle Create Parent
  const handleCreateParent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim() || !newPw.trim()) {
      setMsg({ type: 'error', text: 'Vui lòng nhập email và mật khẩu!' });
      return;
    }
    if (newPw.length < 6) {
      setMsg({ type: 'error', text: 'Mật khẩu phải từ 6 ký tự trở lên!' });
      return;
    }

    setSubmittingCreate(true);
    setMsg(null);
    try {
      const res = await fetch('/api/admin/family', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'admin_create_parent',
          email: newEmail.trim().toLowerCase(),
          password: newPw,
          displayName: newName.trim() || newEmail.trim().split('@')[0],
          childName: newChildName.trim() || 'Bé',
          childGradeId: newChildGrade,
          childAvatar: newChildAvatar,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMsg({ type: 'success', text: data.message || `Đã tạo tài khoản cho ${newEmail} thành công!` });
        setShowCreateModal(false);
        setNewEmail('');
        setNewPw('123456');
        setNewName('');
        setNewChildName('');
        fetchParents();
      } else {
        setMsg({ type: 'error', text: data.message || 'Không tạo được tài khoản.' });
      }
    } catch (err: any) {
      setMsg({ type: 'error', text: err?.message || 'Lỗi khi tạo tài khoản.' });
    } finally {
      setSubmittingCreate(false);
    }
  };

  // Filter parents by search
  const filteredParents = parents.filter(p => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      p.email.toLowerCase().includes(q) ||
      p.displayName.toLowerCase().includes(q) ||
      p.children.some(c => c.name.toLowerCase().includes(q))
    );
  });

  const totalChildren = parents.reduce((sum, p) => sum + p.children.length, 0);
  const totalStars = parents.reduce((sum, p) => sum + p.children.reduce((cSum, c) => cSum + c.stars, 0), 0);

  return (
    <section className="space-y-5 rounded-2xl border bg-white p-6 shadow-xs">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">👨‍👩‍👧</span>
            <h2 className="text-lg font-bold text-gray-800">Quản Lý Phụ Huynh & Học Sinh</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Xem danh sách gia đình đã đăng ký, theo dõi tiến độ các bé và hỗ trợ đặt lại mật khẩu.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchParents}
            disabled={loading}
            className="py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
          >
            {loading ? 'Đang tải…' : '🔄 Làm mới'}
          </button>
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="py-2 px-3.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <span>➕</span>
            <span>Thêm Phụ Huynh</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3.5 bg-orange-50/80 rounded-2xl border border-orange-200 text-center">
          <span className="text-xs font-bold text-orange-700 uppercase tracking-wide">Phụ Huynh</span>
          <div className="text-2xl font-black text-orange-900 mt-0.5">{parents.length}</div>
        </div>
        <div className="p-3.5 bg-amber-50/80 rounded-2xl border border-amber-200 text-center">
          <span className="text-xs font-bold text-amber-700 uppercase tracking-wide">Học Sinh</span>
          <div className="text-2xl font-black text-amber-900 mt-0.5">{totalChildren}</div>
        </div>
        <div className="p-3.5 bg-emerald-50/80 rounded-2xl border border-emerald-200 text-center">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">Tổng Sao Tích Lũy</span>
          <div className="text-2xl font-black text-emerald-900 mt-0.5">⭐ {totalStars}</div>
        </div>
      </div>

      {/* Status Message */}
      {msg && (
        <div
          role="status"
          className={`p-3 rounded-xl text-xs font-bold text-center ${
            msg.type === 'success'
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
              : 'bg-rose-100 text-rose-800 border border-rose-200'
          }`}
        >
          {msg.text}
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="🔍 Tìm kiếm theo Email, Tên phụ huynh, hoặc Tên bé..."
          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs font-bold text-slate-800 focus:bg-white focus:border-orange-500 focus:outline-hidden"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
          >
            ✕
          </button>
        )}
      </div>

      {/* Parents List */}
      {loading ? (
        <div className="text-center py-8 text-xs text-slate-400 font-bold animate-pulse">
          Đang tải danh sách tài khoản…
        </div>
      ) : filteredParents.length === 0 ? (
        <div className="text-center py-8 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500 font-medium">
          {search ? 'Không tìm thấy phụ huynh phù hợp với từ khóa.' : 'Chưa có tài khoản phụ huynh nào đăng ký.'}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredParents.map(parent => (
            <div
              key={parent.id}
              className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-orange-200 transition-colors shadow-xs"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                {/* Parent Info */}
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-lg shrink-0">
                    {parent.displayName ? parent.displayName.charAt(0).toUpperCase() : '👤'}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-800">
                      {parent.displayName || parent.email}
                    </h4>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">{parent.email}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setResetModalParent(parent);
                      setNewPassword('123456');
                      setMsg(null);
                    }}
                    className="py-1.5 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-xs font-bold transition-colors cursor-pointer"
                    title="Đặt lại mật khẩu cho phụ huynh"
                  >
                    🔑 Đổi mật khẩu
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteParent(parent)}
                    className="py-1.5 px-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold transition-colors cursor-pointer"
                    title="Xóa tài khoản này"
                  >
                    🗑️ Xóa
                  </button>
                </div>
              </div>

              {/* Children Badges */}
              <div className="mt-3 pt-3 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide block mb-1.5">
                  👶 Các bé trong gia đình ({parent.children.length}):
                </span>
                {parent.children.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">Chưa tạo hồ sơ bé nào.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {parent.children.map(child => {
                      const grade = GRADE_LEVELS.find(g => g.id === child.gradeId)?.label || child.gradeId;
                      return (
                        <div
                          key={child.id}
                          className="flex items-center gap-2 py-1 px-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium"
                        >
                          <span className="text-base">{child.avatar}</span>
                          <span className="font-bold text-slate-700">{child.name}</span>
                          <span className="text-slate-400 font-semibold">• {grade}</span>
                          <span className="font-bold text-amber-600">⭐ {child.stars} sao</span>
                          {child.wordsStudied > 0 && (
                            <span className="text-[11px] text-slate-500 font-semibold">({child.wordsStudied} từ)</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* RESET PASSWORD MODAL */}
      {resetModalParent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border-2 border-orange-200 space-y-4">
            <div className="text-center">
              <span className="text-3xl mb-1 inline-block">🔑</span>
              <h3 className="font-black text-lg text-slate-800">Đặt Lại Mật Khẩu</h3>
              <p className="text-xs text-slate-500 font-mono mt-0.5">{resetModalParent.email}</p>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wide">
                  Mật khẩu mới (tối thiểu 6 ký tự):
                </label>
                <input
                  type="text"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Nhập mật khẩu mới..."
                  required
                  minLength={6}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono font-bold text-sm focus:border-orange-500 focus:outline-hidden"
                  autoFocus
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setNewPassword('123456')}
                  className="py-1 px-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-[11px] cursor-pointer"
                >
                  Gán mặc định: 123456
                </button>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setResetModalParent(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submittingReset}
                  className="flex-1 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs cursor-pointer disabled:opacity-50"
                >
                  {submittingReset ? 'Đang lưu…' : 'Lưu mật khẩu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE PARENT MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border-2 border-orange-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="text-center">
              <span className="text-3xl mb-1 inline-block">👨‍👩‍👧</span>
              <h3 className="font-black text-lg text-slate-800">Thêm Tài Khoản Phụ Huynh</h3>
              <p className="text-xs text-slate-500">Tạo tài khoản phụ huynh và hồ sơ bé đầu tiên</p>
            </div>

            <form onSubmit={handleCreateParent} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wide">
                  Tên phụ huynh (Bố / Mẹ):
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="Ví dụ: Mẹ Lan, Bố Tuấn..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wide">
                  Email đăng nhập:
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  placeholder="phuhuynh@example.com"
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wide">
                  Mật khẩu ban đầu:
                </label>
                <input
                  type="text"
                  value={newPw}
                  onChange={e => setNewPw(e.target.value)}
                  placeholder="123456"
                  required
                  minLength={6}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold font-mono"
                />
              </div>

              <div className="pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-orange-600 mb-1 uppercase tracking-wide">
                  👶 Tên của bé:
                </label>
                <input
                  type="text"
                  value={newChildName}
                  onChange={e => setNewChildName(e.target.value)}
                  placeholder="Ví dụ: Bé Bống..."
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold mb-2"
                />

                <div className="grid grid-cols-3 gap-1.5 mb-2">
                  {GRADE_LEVELS.map(g => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setNewChildGrade(g.id)}
                      className={`py-1 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                        newChildGrade === g.id
                          ? 'bg-orange-600 text-white border-orange-600'
                          : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-6 gap-1.5">
                  {AVATAR_LIST.slice(0, 6).map(av => (
                    <button
                      key={av.emoji}
                      type="button"
                      onClick={() => setNewChildAvatar(av.emoji)}
                      className={`h-8 rounded-lg flex items-center justify-center text-lg border transition-all cursor-pointer ${
                        newChildAvatar === av.emoji
                          ? 'bg-amber-100 border-amber-500 scale-105'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      {av.emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submittingCreate}
                  className="flex-1 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs cursor-pointer disabled:opacity-50"
                >
                  {submittingCreate ? 'Đang tạo…' : 'Tạo Phụ Huynh'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
