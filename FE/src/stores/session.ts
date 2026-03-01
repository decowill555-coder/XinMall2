import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export type SessionStatus = 'active' | 'expired' | 'refreshing' | 'invalid';

export interface SessionInfo {
  sessionId: string;
  userId: string;
  deviceId: string;
  deviceName: string;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  platform: 'ios' | 'android' | 'h5' | 'mp-weixin' | 'mp-alipay' | 'app';
  osVersion: string;
  appVersion: string;
  ip: string;
  location: string;
  createdAt: string;
  lastActiveAt: string;
  expiresAt: string;
}

export interface LoginRecord {
  id: string;
  userId: string;
  loginType: 'password' | 'sms' | 'wechat' | 'alipay' | 'apple';
  deviceId: string;
  deviceName: string;
  ip: string;
  location: string;
  success: boolean;
  failReason?: string;
  createdAt: string;
}

export interface SecuritySetting {
  twoFactorEnabled: boolean;
  twoFactorType: 'sms' | 'email' | 'authenticator' | null;
  loginNotification: boolean;
  suspiciousLoginAlert: boolean;
  sessionTimeout: number;
  maxConcurrentSessions: number;
}

const SESSION_TIMEOUT = 30 * 24 * 60 * 60 * 1000;
const REFRESH_THRESHOLD = 7 * 24 * 60 * 60 * 1000;

export const useSessionStore = defineStore('session', () => {
  const sessionInfo = ref<SessionInfo | null>(null);
  const sessionStatus = ref<SessionStatus>('invalid');
  const loginRecords = ref<LoginRecord[]>([]);
  const activeSessions = ref<SessionInfo[]>([]);
  const securitySettings = ref<SecuritySetting>({
    twoFactorEnabled: false,
    twoFactorType: null,
    loginNotification: true,
    suspiciousLoginAlert: true,
    sessionTimeout: SESSION_TIMEOUT,
    maxConcurrentSessions: 5
  });

  const lastActiveTime = ref<number>(Date.now());
  const refreshTokenTimer = ref<ReturnType<typeof setInterval> | null>(null);

  const isLoggedIn = computed(() => 
    sessionStatus.value === 'active' && sessionInfo.value !== null
  );

  const isSessionExpiringSoon = computed(() => {
    if (!sessionInfo.value) return false;
    
    const expiresAt = new Date(sessionInfo.value.expiresAt).getTime();
    const now = Date.now();
    const threshold = REFRESH_THRESHOLD;
    
    return expiresAt - now < threshold;
  });

  const sessionRemainingTime = computed(() => {
    if (!sessionInfo.value) return 0;
    
    const expiresAt = new Date(sessionInfo.value.expiresAt).getTime();
    const now = Date.now();
    
    return Math.max(0, expiresAt - now);
  });

  const currentDevice = computed(() => {
    if (!sessionInfo.value) return null;
    
    return {
      id: sessionInfo.value.deviceId,
      name: sessionInfo.value.deviceName,
      type: sessionInfo.value.deviceType,
      platform: sessionInfo.value.platform
    };
  });

  const otherSessions = computed(() => {
    if (!sessionInfo.value) return activeSessions.value;
    
    return activeSessions.value.filter(
      s => s.sessionId !== sessionInfo.value?.sessionId
    );
  });

  const hasMultipleSessions = computed(() => activeSessions.value.length > 1);

  const setSession = (info: SessionInfo) => {
    sessionInfo.value = info;
    sessionStatus.value = 'active';
    lastActiveTime.value = Date.now();
    
    startRefreshTimer();
    saveToStorage();
  };

  const updateSession = (updates: Partial<SessionInfo>) => {
    if (sessionInfo.value) {
      sessionInfo.value = {
        ...sessionInfo.value,
        ...updates,
        lastActiveAt: new Date().toISOString()
      };
      lastActiveTime.value = Date.now();
      saveToStorage();
    }
  };

  const clearSession = () => {
    sessionInfo.value = null;
    sessionStatus.value = 'invalid';
    lastActiveTime.value = 0;
    
    stopRefreshTimer();
    clearStorage();
  };

  const setSessionStatus = (status: SessionStatus) => {
    sessionStatus.value = status;
  };

  const refreshSession = async () => {
    if (!sessionInfo.value) return false;
    
    sessionStatus.value = 'refreshing';
    
    try {
      // const result = await authApi.refreshToken();
      // setSession(result);
      
      sessionStatus.value = 'active';
      return true;
    } catch (error) {
      sessionStatus.value = 'expired';
      return false;
    }
  };

  const startRefreshTimer = () => {
    stopRefreshTimer();
    
    const checkInterval = 60 * 1000;
    
    refreshTokenTimer.value = setInterval(() => {
      if (isSessionExpiringSoon.value) {
        refreshSession();
      }
      
      updateLastActive();
    }, checkInterval);
  };

  const stopRefreshTimer = () => {
    if (refreshTokenTimer.value) {
      clearInterval(refreshTokenTimer.value);
      refreshTokenTimer.value = null;
    }
  };

  const updateLastActive = () => {
    lastActiveTime.value = Date.now();
    
    if (sessionInfo.value) {
      sessionInfo.value.lastActiveAt = new Date().toISOString();
    }
  };

  const setLoginRecords = (records: LoginRecord[]) => {
    loginRecords.value = records;
  };

  const addLoginRecord = (record: LoginRecord) => {
    loginRecords.value.unshift(record);
    
    if (loginRecords.value.length > 50) {
      loginRecords.value = loginRecords.value.slice(0, 50);
    }
  };

  const setActiveSessions = (sessions: SessionInfo[]) => {
    activeSessions.value = sessions;
  };

  const terminateSession = (sessionId: string) => {
    activeSessions.value = activeSessions.value.filter(
      s => s.sessionId !== sessionId
    );
  };

  const terminateAllOtherSessions = () => {
    if (!sessionInfo.value) return;
    
    activeSessions.value = activeSessions.value.filter(
      s => s.sessionId === sessionInfo.value?.sessionId
    );
  };

  const updateSecuritySettings = (settings: Partial<SecuritySetting>) => {
    securitySettings.value = {
      ...securitySettings.value,
      ...settings
    };
    saveToStorage();
  };

  const enableTwoFactor = (type: SecuritySetting['twoFactorType']) => {
    securitySettings.value.twoFactorEnabled = true;
    securitySettings.value.twoFactorType = type;
    saveToStorage();
  };

  const disableTwoFactor = () => {
    securitySettings.value.twoFactorEnabled = false;
    securitySettings.value.twoFactorType = null;
    saveToStorage();
  };

  const checkSessionValidity = (): boolean => {
    if (!sessionInfo.value) {
      sessionStatus.value = 'invalid';
      return false;
    }
    
    const expiresAt = new Date(sessionInfo.value.expiresAt).getTime();
    const now = Date.now();
    
    if (now >= expiresAt) {
      sessionStatus.value = 'expired';
      return false;
    }
    
    sessionStatus.value = 'active';
    return true;
  };

  const getLoginHistory = (limit: number = 10) => 
    loginRecords.value.slice(0, limit);

  const getRecentLogins = (days: number = 7) => {
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    
    return loginRecords.value.filter(
      r => new Date(r.createdAt).getTime() >= cutoff
    );
  };

  const isSuspiciousLogin = (record: LoginRecord): boolean => {
    const recentLogins = getRecentLogins(7);
    const knownDevices = new Set(
      recentLogins.filter(r => r.success).map(r => r.deviceId)
    );
    
    return !knownDevices.has(record.deviceId);
  };

  const loadFromStorage = () => {
    const storedSession = uni.getStorageSync('session_info');
    if (storedSession) {
      sessionInfo.value = storedSession;
      
      if (checkSessionValidity()) {
        startRefreshTimer();
      }
    }
    
    const storedSettings = uni.getStorageSync('security_settings');
    if (storedSettings) {
      securitySettings.value = storedSettings;
    }
    
    const storedRecords = uni.getStorageSync('login_records');
    if (storedRecords) {
      loginRecords.value = storedRecords;
    }
  };

  const saveToStorage = () => {
    if (sessionInfo.value) {
      uni.setStorageSync('session_info', sessionInfo.value);
    }
    uni.setStorageSync('security_settings', securitySettings.value);
    uni.setStorageSync('login_records', loginRecords.value);
  };

  const clearStorage = () => {
    uni.removeStorageSync('session_info');
    uni.removeStorageSync('security_settings');
    uni.removeStorageSync('login_records');
  };

  loadFromStorage();

  return {
    sessionInfo,
    sessionStatus,
    loginRecords,
    activeSessions,
    securitySettings,
    lastActiveTime,
    isLoggedIn,
    isSessionExpiringSoon,
    sessionRemainingTime,
    currentDevice,
    otherSessions,
    hasMultipleSessions,
    setSession,
    updateSession,
    clearSession,
    setSessionStatus,
    refreshSession,
    startRefreshTimer,
    stopRefreshTimer,
    updateLastActive,
    setLoginRecords,
    addLoginRecord,
    setActiveSessions,
    terminateSession,
    terminateAllOtherSessions,
    updateSecuritySettings,
    enableTwoFactor,
    disableTwoFactor,
    checkSessionValidity,
    getLoginHistory,
    getRecentLogins,
    isSuspiciousLogin,
    loadFromStorage,
    saveToStorage,
    clearStorage
  };
});
