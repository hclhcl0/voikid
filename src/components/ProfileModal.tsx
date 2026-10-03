'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProfileContext, AVATAR_LIST, COLOR_THEMES } from '@/context/ProfileContext';
import { GRADE_LEVELS } from '@/lib/vocabulary';
import { UserProfile } from '@/types';
import { useAdminContext } from '@/context/AdminContext';

export function ProfileModal() {
  const {
    profiles,
    activeProfile,
    activeProfileId,
    setActiveProfileId,
    createProfile,
    updateProfile,
    deleteProfile,
    getProfileStars,
    resetProfileProgress,
    loginWithCodeOrName,
    isProfileModalOpen,
    closeProfileModal,
  } = useProfileContext();

  const [mode, setMode] = useState<'list' | 'code_login' | 'create' | 'edit'>('list');
  const [editingProfileId, setEditingProfileId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('🦁');
  const [gradeId, setGradeId] = useState('lop1');
  const [color, setColor] = useState('orange');
  const [customCode, setCustomCode] = useState('');
  const [error, setError] = useState('');

  // Code login state
  const [loginQuery, setLoginQuery] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginMsg, setLoginMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleOpenCreate = () => {
    setName('');
    const usedAvatars = new Set(profiles.map((p) => p.avatar));
    const nextAv = AVATAR_LIST.find((a) => !usedAvatars.has(a.emoji)) || AVATAR_LIST[0];
    setAvatar(nextAv.emoji);
    setGradeId('lop1');
    setColor('orange');
    setCustomCode('');
    setError('');
    setMode('create');
  };

  const handleOpenEdit = (profile: UserProfile, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingProfileId(profile.id);
    setName(profile.name);
    setAvatar(profile.avatar);
    setGradeId(profile.gradeId || 'lop1');
    setColor(profile.color || 'orange');
    setCustomCode(profile.code || '');
    setError('');
    setMode('edit');
  };

  const handleSave = async () => {
    const cleanName = name.trim();
    if (!cleanName) {
      setError('Vui lòng nhập tên của bé!');
      return;
    }

    if (mode === 'create') {
      await createProfile({
        name: cleanName,
        avatar,
        gradeId,
        color,
        code: customCode.trim() ? customCode.trim().toUpperCase() : undefined,
      });
    } else if (mode === 'edit' && editingProfileId) {
      updateProfile(editingProfileId, {
        name: cleanName,
        avatar,
        gradeId,
        color,
        code: customCode.trim() ? customCode.trim().toUpperCase() : undefined,
      });
    }

    setMode('list');
    setEditingProfileId(null);
  };

  const handleCopyCode = (code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleCodeLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginQuery.trim()) {
      setLoginMsg({ type: 'error', text: 'Vui lòng nhập tên hoặc mã tài khoản của bé!' });
      return;
    }
    setLoginLoading(true);
    setLoginMsg(null);

    const res = await loginWithCodeOrName(loginQuery) as { success: boolean; message?: string; profile?: { name: string } };
    setLoginLoading(false);

    if (res.success && res.profile) {
      setLoginMsg({ type: 'success', text: res.message || `Đã đăng nhập thành công cho ${res.profile.name}!` });
      setTimeout(() => {
        closeProfileModal();
        setLoginMsg(null);
        setLoginQuery('');
        setMode('list');
      }, 1200);
    } else {
      setLoginMsg({ type: 'error', text: res.message || 'Không tìm thấy tài khoản bé.' });
    }
  };

  const { isAdmin, openAdminModal } = useAdminContext();

  const handleDelete = (profile: UserProfile, e: React.MouseEvent) => {
    e.stopPropagation();
    if (profiles.length <= 1) {
      alert('Cần giữ lại ít nhất 1 tài khoản bé!');
      return;
    }

    const doDelete = () => {
      if (confirm(`Bạn có chắc muốn xóa tài khoản của "${profile.name}"? Dữ liệu sao và tiến trình học của bé sẽ bị xóa.`)) {
        deleteProfile(profile.id);
      }
    };

    if (!isAdmin) {
      openAdminModal(doDelete);
    } else {
      doDelete();
    }
  };

  const handleResetProgress = (profile: UserProfile, e: React.MouseEvent) => {
    e.stopPropagation();
    const doReset = () => {
      if (confirm(`Đặt lại toàn bộ số sao và tiến trình học của "${profile.name}" về 0?`)) {
        resetProfileProgress(profile.id);
        alert(`Đã đặt lại dữ liệu của ${profile.name}!`);
      }
    };

    if (!isAdmin) {
      openAdminModal(doReset);
    } else {
      doReset();
    }
  };

  if (!isProfileModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="bg-white rounded-3xl w-full max-w-md shadow-2xl border-[3px] border-orange-200 overflow-hidden my-auto"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 p-5 text-white relative">
            <button
              onClick={closeProfileModal}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/30 backdrop-blur text-white font-black flex items-center justify-center hover:bg-white/40 transition-colors"
              aria-label="Đóng"
            >
              ✕
            </button>
            <div className="flex items-center gap-3">
              <span className="text-3xl">👨‍👩‍👧</span>
              <div>
                <h3 className="font-black text-xl leading-tight drop-shadow-sm">
                  {mode === 'list' && 'Đăng Nhập & Đổi Bé Học'}
                  {mode === 'code_login' && 'Đăng Nhập Từ Máy Khác 📲'}
                  {mode === 'create' && 'Thêm Bé Mới 🎈'}
                  {mode === 'edit' && 'Chỉnh Sửa Hồ Sơ ✏️'}
                </h3>
                <p className="text-white/90 text-xs font-semibold">
                  {mode === 'list' && 'Chọn tài khoản bé hoặc đăng nhập bằng mã'}
                  {mode === 'code_login' && 'Nhập Tên hoặc Mã tài khoản để đồng bộ tiến trình'}
                  {mode === 'create' && 'Tạo hồ sơ và tự động cấp mã đăng nhập'}
                  {mode === 'edit' && 'Cập nhật thông tin và mã tài khoản của bé'}
                </p>
              </div>
            </div>

            {/* Sub navigation tabs */}
            {(mode === 'list' || mode === 'code_login') && (
              <div className="flex gap-1.5 mt-4 p-1 rounded-2xl bg-black/10 backdrop-blur-xs">
                <button
                  type="button"
                  onClick={() => setMode('list')}
                  className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    mode === 'list' ? 'bg-white text-orange-600 shadow-sm' : 'text-white/80 hover:text-white'
                  }`}
                >
                  👶 Danh sách bé ({profiles.length})
                </button>
                <button
                  type="button"
                  onClick={() => setMode('code_login')}
                  className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    mode === 'code_login' ? 'bg-white text-orange-600 shadow-sm' : 'text-white/80 hover:text-white'
                  }`}
                >
                  🔑 Nhập mã đăng nhập
                </button>
              </div>
            )}
          </div>

          {/* Modal Body */}
          <div className="p-5 max-h-[75vh] overflow-y-auto">
            {mode === 'list' ? (
              <div className="space-y-4">
                {/* Profile Cards */}
                <div className="space-y-2.5">
                  {profiles.map((p) => {
                    const isActive = p.id === activeProfileId;
                    const stars = getProfileStars(p.id);
                    const grade = GRADE_LEVELS.find((g) => g.id === p.gradeId) || GRADE_LEVELS[1];
                    const theme = COLOR_THEMES[p.color] || COLOR_THEMES.orange;
                    const code = p.code || 'CHUA_CO';

                    return (
                      <motion.div
                        key={p.id}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setActiveProfileId(p.id);
                          closeProfileModal();
                        }}
                        className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer relative flex items-center gap-3.5 ${
                          isActive
                            ? 'bg-amber-50/90 border-amber-400 shadow-md ring-2 ring-amber-300/50'
                            : 'bg-white hover:bg-gray-50 border-gray-200'
                        }`}
                      >
                        {/* Avatar */}
                        <div
                          className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${theme.bg} flex items-center justify-center text-3xl shadow-md shrink-0`}
                        >
                          {p.avatar}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-black text-gray-800 text-base truncate">{p.name}</h4>
                            {isActive && (
                              <span className="text-[10px] bg-amber-500 text-white font-black px-2 py-0.5 rounded-full shrink-0">
                                Đang học ✓
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-gray-500 font-semibold">{grade.label}</span>
                            <span className="text-gray-300">•</span>
                            <span className="text-xs font-black text-amber-600 flex items-center gap-0.5">
                              ⭐ {stars} sao
                            </span>
                          </div>

                          {/* Kid Account Code Badge */}
                          <div className="mt-1 flex items-center gap-1.5">
                            <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-amber-100/80 text-amber-800 border border-amber-200">
                              Mã: {code}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => handleCopyCode(code, e)}
                              className="text-[10px] text-gray-400 hover:text-orange-600 font-bold px-1.5 py-0.5 rounded transition-colors"
                              title="Sao chép mã đăng nhập để dùng trên điện thoại khác"
                            >
                              {copiedCode === code ? '✓ Đã chép' : '📋 Chép mã'}
                            </button>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={(e) => handleOpenEdit(p, e)}
                            className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center text-xs font-bold transition-colors"
                            title="Chỉnh sửa"
                          >
                            ✏️
                          </button>
                          {profiles.length > 1 && (
                            <button
                              onClick={(e) => handleDelete(p, e)}
                              className="w-8 h-8 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-500 flex items-center justify-center text-xs font-bold transition-colors"
                              title="Xóa hồ sơ"
                            >
                              🗑️
                            </button>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Add child button */}
                <button
                  onClick={handleOpenCreate}
                  className="w-full py-3.5 px-4 rounded-2xl border-2 border-dashed border-orange-300 bg-orange-50/60 hover:bg-orange-100/70 text-orange-600 font-black text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                >
                  <span className="text-lg">+</span> Thêm tài khoản bé mới
                </button>
              </div>
            ) : mode === 'code_login' ? (
              /* Code / Name Login Form */
              <form onSubmit={handleCodeLogin} className="space-y-4">
                <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-2xl">
                  <p className="text-xs text-amber-800 leading-relaxed font-semibold">
                    💡 <strong>Đồng bộ nhiều thiết bị:</strong> Nhập Tên của bé hoặc Mã tài khoản (ví dụ <code className="bg-white px-1.5 py-0.5 rounded font-mono font-bold text-amber-700">BONG88</code>) để tải toàn bộ số sao và bài học của bé về máy này!
                  </p>
                </div>

                {loginMsg && (
                  <div
                    className={`p-3.5 rounded-2xl text-xs font-bold ${
                      loginMsg.type === 'success'
                        ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                        : 'bg-rose-50 border border-rose-200 text-rose-700'
                    }`}
                  >
                    {loginMsg.text}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-black text-gray-700 mb-1.5 uppercase tracking-wide">
                    Tên bé hoặc Mã tài khoản:
                  </label>
                  <input
                    type="text"
                    value={loginQuery}
                    onChange={(e) => setLoginQuery(e.target.value)}
                    placeholder="Ví dụ: Bé Bống hoặc BONG88..."
                    className="w-full px-4 py-3 rounded-2xl border-2 border-orange-200 focus:border-orange-500 focus:outline-hidden text-gray-800 font-bold text-base bg-orange-50/20"
                    autoFocus
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('list');
                      setLoginMsg(null);
                    }}
                    className="flex-1 py-3 rounded-2xl border-2 border-gray-200 text-gray-600 font-black text-sm hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    Quay lại
                  </button>
                  <button
                    type="submit"
                    disabled={loginLoading}
                    className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-sm shadow-md transition-all cursor-pointer disabled:opacity-50"
                  >
                    {loginLoading ? 'Đang kiểm tra...' : 'Vào học ngay 🚀'}
                  </button>
                </div>
              </form>
            ) : (
              /* Create / Edit Form */
              <div className="space-y-4">
                {error && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-xs font-bold">
                    ⚠️ {error}
                  </div>
                )}

                {/* Child Name */}
                <div>
                  <label className="block text-xs font-black text-gray-700 mb-1.5 uppercase tracking-wide">
                    Tên của bé:
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ví dụ: Bé Bống, Minh Quân, Bo..."
                    className="w-full px-4 py-3 rounded-2xl border-2 border-orange-200 focus:border-orange-500 focus:outline-hidden text-gray-800 font-bold text-sm bg-orange-50/20"
                    maxLength={30}
                    autoFocus
                  />
                </div>

                {/* Optional Custom Account Code */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-black text-gray-700 uppercase tracking-wide">
                      Mã tài khoản (tùy chọn):
                    </label>
                    <span className="text-[11px] text-gray-400">Tự tạo nếu để trống</span>
                  </div>
                  <input
                    type="text"
                    value={customCode}
                    onChange={(e) => setCustomCode(e.target.value.toUpperCase())}
                    placeholder="Ví dụ: BONG88, BO12..."
                    className="w-full px-4 py-2.5 rounded-2xl border-2 border-orange-200 focus:border-orange-500 focus:outline-hidden text-gray-800 font-mono font-bold text-sm bg-orange-50/20 uppercase"
                    maxLength={15}
                  />
                </div>

                {/* Grade Selection */}
                <div>
                  <label className="block text-xs font-black text-gray-700 mb-1.5 uppercase tracking-wide">
                    Lớp của bé:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {GRADE_LEVELS.map((g) => (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => setGradeId(g.id)}
                        className={`py-2 px-2 rounded-xl text-xs font-bold border-2 transition-all cursor-pointer ${
                          gradeId === g.id
                            ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                            : 'bg-gray-50 hover:bg-gray-100 text-gray-600 border-gray-200'
                        }`}
                      >
                        {g.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Avatar Picker */}
                <div>
                  <label className="block text-xs font-black text-gray-700 mb-1.5 uppercase tracking-wide">
                    Chọn con vật đại diện:
                  </label>
                  <div className="grid grid-cols-6 gap-2">
                    {AVATAR_LIST.map((av) => (
                      <button
                        key={av.emoji}
                        type="button"
                        onClick={() => setAvatar(av.emoji)}
                        className={`h-11 rounded-2xl flex items-center justify-center text-2xl border-2 transition-all cursor-pointer ${
                          avatar === av.emoji
                            ? 'bg-amber-100 border-amber-500 scale-110 shadow-sm ring-2 ring-amber-300'
                            : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
                        }`}
                        title={av.name}
                      >
                        {av.emoji}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Theme */}
                <div>
                  <label className="block text-xs font-black text-gray-700 mb-1.5 uppercase tracking-wide">
                    Màu sắc yêu thích:
                  </label>
                  <div className="flex gap-2">
                    {Object.entries(COLOR_THEMES).map(([k, t]) => (
                      <button
                        key={k}
                        type="button"
                        onClick={() => setColor(k)}
                        className={`w-9 h-9 rounded-full bg-gradient-to-br ${t.bg} border-2 transition-all cursor-pointer ${
                          color === k ? 'ring-3 ring-orange-500 scale-110 border-white' : 'border-transparent opacity-80 hover:opacity-100'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Edit extra actions */}
                {mode === 'edit' && editingProfileId && (
                  <div className="pt-2 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={(e) => {
                        const p = profiles.find((x) => x.id === editingProfileId);
                        if (p) handleResetProgress(p, e);
                      }}
                      className="text-xs text-rose-500 hover:text-rose-600 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      🔄 Đặt lại sao và tiến trình của bé này về 0
                    </button>
                  </div>
                )}

                {/* Buttons */}
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('list');
                      setEditingProfileId(null);
                    }}
                    className="flex-1 py-3 rounded-2xl border-2 border-gray-200 text-gray-600 font-black text-sm hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    Quay lại
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-sm shadow-md transition-all cursor-pointer"
                  >
                    {mode === 'create' ? 'Tạo tài khoản' : 'Lưu thay đổi'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
