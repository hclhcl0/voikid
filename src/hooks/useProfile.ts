'use client';

import { useProfileContext } from '@/context/ProfileContext';

export function useProfile() {
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
    isProfileModalOpen,
    openProfileModal,
    closeProfileModal,
  } = useProfileContext();

  return {
    profiles,
    activeProfile,
    activeProfileId,
    switchProfile: setActiveProfileId,
    createProfile,
    updateProfile,
    deleteProfile,
    getProfileStars,
    resetProfileProgress,
    isProfileModalOpen,
    openProfileModal,
    closeProfileModal,
  };
}
