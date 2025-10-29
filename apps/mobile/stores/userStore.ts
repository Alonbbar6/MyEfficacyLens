import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserPreferences, UserLocation } from '../types';

interface UserState {
  preferences: UserPreferences;
  isOnboarded: boolean;
  setLocation: (location: UserLocation) => Promise<void>;
  followPolitician: (politicianId: string) => Promise<void>;
  unfollowPolitician: (politicianId: string) => Promise<void>;
  trackBill: (billId: string) => Promise<void>;
  untrackBill: (billId: string) => Promise<void>;
  remindEvent: (eventId: string) => Promise<void>;
  unremindEvent: (eventId: string) => Promise<void>;
  toggleNotifications: () => Promise<void>;
  toggleDarkMode: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
  loadPreferences: () => Promise<void>;
}

const defaultPreferences: UserPreferences = {
  location: {},
  followedPoliticians: [],
  trackedBills: [],
  remindedEvents: [],
  notificationsEnabled: true,
  darkMode: false,
};

export const useUserStore = create<UserState>((set, get) => ({
  preferences: defaultPreferences,
  isOnboarded: false,

  loadPreferences: async () => {
    try {
      const stored = await AsyncStorage.getItem('userPreferences');
      const onboarded = await AsyncStorage.getItem('isOnboarded');
      
      if (stored) {
        const parsed = JSON.parse(stored);
        // Ensure darkMode is a boolean
        if (parsed.darkMode !== undefined) {
          parsed.darkMode = Boolean(parsed.darkMode);
        }
        set({ preferences: parsed });
      }
      if (onboarded) {
        set({ isOnboarded: Boolean(JSON.parse(onboarded)) });
      }
    } catch (error) {
      console.error('Failed to load preferences:', error);
    }
  },

  setLocation: async (location: UserLocation) => {
    const newPreferences = {
      ...get().preferences,
      location,
    };
    set({ preferences: newPreferences });
    await AsyncStorage.setItem('userPreferences', JSON.stringify(newPreferences));
  },

  followPolitician: async (politicianId: string) => {
    const current = get().preferences.followedPoliticians;
    if (!current.includes(politicianId)) {
      const newPreferences = {
        ...get().preferences,
        followedPoliticians: [...current, politicianId],
      };
      set({ preferences: newPreferences });
      await AsyncStorage.setItem('userPreferences', JSON.stringify(newPreferences));
    }
  },

  unfollowPolitician: async (politicianId: string) => {
    const newPreferences = {
      ...get().preferences,
      followedPoliticians: get().preferences.followedPoliticians.filter(id => id !== politicianId),
    };
    set({ preferences: newPreferences });
    await AsyncStorage.setItem('userPreferences', JSON.stringify(newPreferences));
  },

  trackBill: async (billId: string) => {
    const current = get().preferences.trackedBills;
    if (!current.includes(billId)) {
      const newPreferences = {
        ...get().preferences,
        trackedBills: [...current, billId],
      };
      set({ preferences: newPreferences });
      await AsyncStorage.setItem('userPreferences', JSON.stringify(newPreferences));
    }
  },

  untrackBill: async (billId: string) => {
    const newPreferences = {
      ...get().preferences,
      trackedBills: get().preferences.trackedBills.filter(id => id !== billId),
    };
    set({ preferences: newPreferences });
    await AsyncStorage.setItem('userPreferences', JSON.stringify(newPreferences));
  },

  remindEvent: async (eventId: string) => {
    const current = get().preferences.remindedEvents;
    if (!current.includes(eventId)) {
      const newPreferences = {
        ...get().preferences,
        remindedEvents: [...current, eventId],
      };
      set({ preferences: newPreferences });
      await AsyncStorage.setItem('userPreferences', JSON.stringify(newPreferences));
    }
  },

  unremindEvent: async (eventId: string) => {
    const newPreferences = {
      ...get().preferences,
      remindedEvents: get().preferences.remindedEvents.filter(id => id !== eventId),
    };
    set({ preferences: newPreferences });
    await AsyncStorage.setItem('userPreferences', JSON.stringify(newPreferences));
  },

  toggleNotifications: async () => {
    const newPreferences = {
      ...get().preferences,
      notificationsEnabled: !get().preferences.notificationsEnabled,
    };
    set({ preferences: newPreferences });
    await AsyncStorage.setItem('userPreferences', JSON.stringify(newPreferences));
  },

  toggleDarkMode: async () => {
    const newPreferences = {
      ...get().preferences,
      darkMode: !get().preferences.darkMode,
    };
    set({ preferences: newPreferences });
    await AsyncStorage.setItem('userPreferences', JSON.stringify(newPreferences));
  },

  completeOnboarding: async () => {
    set({ isOnboarded: true });
    await AsyncStorage.setItem('isOnboarded', JSON.stringify(true));
  },
}));
