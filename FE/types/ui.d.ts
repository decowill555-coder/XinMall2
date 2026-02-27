// src/types/ui.d.ts

/** 基础尺寸 */
export type UiSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/** 基础颜色意图 */
export type UiColorIntent = 'primary' | 'success' | 'warning' | 'danger' | 'info';

/** 按钮变体 */
export type UiButtonVariant = 'solid' | 'outline' | 'ghost' | 'glass' | 'text';

/** 表单校验结果 */
export interface ValidateResult {
  valid: boolean;
  message?: string;
}

/** 选项类型 (用于 Select, Radio Group) */
export interface UiOption {
  label: string;
  value: string | number;
  disabled?: boolean;
  icon?: string; // 可选图标
}