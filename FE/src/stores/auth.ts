import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export type UserRole = 'guest' | 'user' | 'seller' | 'vip' | 'admin';

export type Permission = 
  | 'product:view'
  | 'product:publish'
  | 'product:edit'
  | 'product:delete'
  | 'order:view'
  | 'order:create'
  | 'order:cancel'
  | 'order:refund'
  | 'shop:create'
  | 'shop:manage'
  | 'user:profile:edit'
  | 'user:address:manage'
  | 'message:send'
  | 'comment:publish'
  | 'coupon:use'
  | 'vip:access'
  | 'admin:dashboard'
  | 'admin:user:manage'
  | 'admin:product:audit';

export interface RolePermission {
  role: UserRole;
  permissions: Permission[];
  inherits?: UserRole[];
}

export interface AuthState {
  isAuthenticated: boolean;
  isInitialized: boolean;
  userId: string | null;
  role: UserRole;
  permissions: Permission[];
  authTime: string | null;
  lastChecked: string | null;
}

const ROLE_PERMISSIONS: RolePermission[] = [
  {
    role: 'guest',
    permissions: ['product:view', 'order:view'],
    inherits: []
  },
  {
    role: 'user',
    permissions: [
      'product:view',
      'order:view',
      'order:create',
      'order:cancel',
      'order:refund',
      'user:profile:edit',
      'user:address:manage',
      'message:send',
      'comment:publish',
      'coupon:use'
    ],
    inherits: ['guest']
  },
  {
    role: 'seller',
    permissions: [
      'product:publish',
      'product:edit',
      'product:delete',
      'shop:create',
      'shop:manage'
    ],
    inherits: ['user']
  },
  {
    role: 'vip',
    permissions: ['vip:access'],
    inherits: ['user']
  },
  {
    role: 'admin',
    permissions: [
      'admin:dashboard',
      'admin:user:manage',
      'admin:product:audit'
    ],
    inherits: ['seller', 'vip']
  }
];

const getAllPermissionsForRole = (role: UserRole): Permission[] => {
  const roleConfig = ROLE_PERMISSIONS.find(r => r.role === role);
  if (!roleConfig) return [];
  
  let permissions = [...roleConfig.permissions];
  
  if (roleConfig.inherits) {
    roleConfig.inherits.forEach(inheritedRole => {
      permissions = [...permissions, ...getAllPermissionsForRole(inheritedRole)];
    });
  }
  
  return [...new Set(permissions)];
};

export const useAuthStore = defineStore('auth', () => {
  const state = ref<AuthState>({
    isAuthenticated: false,
    isInitialized: false,
    userId: null,
    role: 'guest',
    permissions: [],
    authTime: null,
    lastChecked: null
  });

  const customPermissions = ref<Permission[]>([]);

  const isAuthenticated = computed(() => state.value.isAuthenticated);
  const isInitialized = computed(() => state.value.isInitialized);
  const currentRole = computed(() => state.value.role);
  const allPermissions = computed(() => [
    ...state.value.permissions,
    ...customPermissions.value
  ]);

  const isGuest = computed(() => state.value.role === 'guest');
  const isUser = computed(() => state.value.role === 'user');
  const isSeller = computed(() => state.value.role === 'seller');
  const isVip = computed(() => state.value.role === 'vip');
  const isAdmin = computed(() => state.value.role === 'admin');

  const hasPermission = (permission: Permission): boolean => {
    return allPermissions.value.includes(permission);
  };

  const hasAnyPermission = (permissions: Permission[]): boolean => {
    return permissions.some(p => allPermissions.value.includes(p));
  };

  const hasAllPermissions = (permissions: Permission[]): boolean => {
    return permissions.every(p => allPermissions.value.includes(p));
  };

  const canPublish = computed(() => hasPermission('product:publish'));
  const canManageShop = computed(() => hasPermission('shop:manage'));
  const canAccessVip = computed(() => hasPermission('vip:access'));
  const canAccessAdmin = computed(() => hasPermission('admin:dashboard'));

  const setAuth = (userId: string, role: UserRole = 'user') => {
    state.value = {
      isAuthenticated: true,
      isInitialized: true,
      userId,
      role,
      permissions: getAllPermissionsForRole(role),
      authTime: new Date().toISOString(),
      lastChecked: new Date().toISOString()
    };
    
    saveToStorage();
  };

  const setRole = (role: UserRole) => {
    state.value.role = role;
    state.value.permissions = getAllPermissionsForRole(role);
    state.value.lastChecked = new Date().toISOString();
    
    saveToStorage();
  };

  const clearAuth = () => {
    state.value = {
      isAuthenticated: false,
      isInitialized: true,
      userId: null,
      role: 'guest',
      permissions: getAllPermissionsForRole('guest'),
      authTime: null,
      lastChecked: null
    };
    
    customPermissions.value = [];
    clearStorage();
  };

  const addCustomPermission = (permission: Permission) => {
    if (!customPermissions.value.includes(permission)) {
      customPermissions.value.push(permission);
    }
  };

  const removeCustomPermission = (permission: Permission) => {
    customPermissions.value = customPermissions.value.filter(p => p !== permission);
  };

  const setCustomPermissions = (permissions: Permission[]) => {
    customPermissions.value = permissions;
  };

  const upgradeToSeller = () => {
    if (state.value.isAuthenticated && state.value.role === 'user') {
      setRole('seller');
      return true;
    }
    return false;
  };

  const upgradeToVip = () => {
    if (state.value.isAuthenticated) {
      if (state.value.role === 'user') {
        setRole('vip');
      } else if (state.value.role === 'seller') {
        const sellerPerms = getAllPermissionsForRole('seller');
        const vipPerms = getAllPermissionsForRole('vip');
        state.value.permissions = [...new Set([...sellerPerms, ...vipPerms])];
      }
      return true;
    }
    return false;
  };

  const downgradeToUser = () => {
    if (state.value.isAuthenticated && state.value.role !== 'user') {
      setRole('user');
      return true;
    }
    return false;
  };

  const checkAuth = async (): Promise<boolean> => {
    state.value.lastChecked = new Date().toISOString();
    
    try {
      // const result = await authApi.checkAuth();
      // if (result.valid) {
      //   setAuth(result.userId, result.role);
      //   return true;
      // }
      
      return state.value.isAuthenticated;
    } catch (error) {
      clearAuth();
      return false;
    }
  };

  const initialize = async () => {
    loadFromStorage();
    
    if (state.value.isAuthenticated) {
      await checkAuth();
    }
    
    state.value.isInitialized = true;
  };

  const getPermissionsByModule = (module: string): Permission[] => {
    return allPermissions.value.filter(p => p.startsWith(`${module}:`));
  };

  const canView = (resource: string): boolean => {
    return hasPermission(`${resource}:view` as Permission);
  };

  const canCreate = (resource: string): boolean => {
    return hasPermission(`${resource}:create` as Permission);
  };

  const canEdit = (resource: string): boolean => {
    return hasPermission(`${resource}:edit` as Permission);
  };

  const canDelete = (resource: string): boolean => {
    return hasPermission(`${resource}:delete` as Permission);
  };

  const loadFromStorage = () => {
    const stored = uni.getStorageSync('auth_state');
    if (stored) {
      state.value = {
        ...state.value,
        ...stored
      };
    }
    
    const storedCustom = uni.getStorageSync('custom_permissions');
    if (storedCustom) {
      customPermissions.value = storedCustom;
    }
  };

  const saveToStorage = () => {
    uni.setStorageSync('auth_state', {
      isAuthenticated: state.value.isAuthenticated,
      userId: state.value.userId,
      role: state.value.role,
      permissions: state.value.permissions,
      authTime: state.value.authTime,
      lastChecked: state.value.lastChecked
    });
    
    uni.setStorageSync('custom_permissions', customPermissions.value);
  };

  const clearStorage = () => {
    uni.removeStorageSync('auth_state');
    uni.removeStorageSync('custom_permissions');
  };

  const getRoleLabel = (role: UserRole): string => {
    const labels: Record<UserRole, string> = {
      guest: '游客',
      user: '普通用户',
      seller: '卖家',
      vip: 'VIP会员',
      admin: '管理员'
    };
    return labels[role] || role;
  };

  const getRoleIcon = (role: UserRole): string => {
    const icons: Record<UserRole, string> = {
      guest: 'user',
      user: 'user',
      seller: 'shop',
      vip: 'crown',
      admin: 'setting'
    };
    return icons[role] || 'user';
  };

  return {
    state,
    customPermissions,
    isAuthenticated,
    isInitialized,
    currentRole,
    allPermissions,
    isGuest,
    isUser,
    isSeller,
    isVip,
    isAdmin,
    canPublish,
    canManageShop,
    canAccessVip,
    canAccessAdmin,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    setAuth,
    setRole,
    clearAuth,
    addCustomPermission,
    removeCustomPermission,
    setCustomPermissions,
    upgradeToSeller,
    upgradeToVip,
    downgradeToUser,
    checkAuth,
    initialize,
    getPermissionsByModule,
    canView,
    canCreate,
    canEdit,
    canDelete,
    loadFromStorage,
    saveToStorage,
    clearStorage,
    getRoleLabel,
    getRoleIcon
  };
});
