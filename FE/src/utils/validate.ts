/**
 * 表单校验工具
 * 包含：手机号、身份证(C2B回收实名)、价格、密码等
 */

/**
 * 校验手机号 (中国大陆)
 * 宽松模式，只要是 1 开头 11 位即可，防止运营商新增号段导致校验失败
 */
export const isMobile = (value: string): boolean => {
  const reg = /^1[3-9]\d{9}$/;
  return reg.test(value);
};

/**
 * 校验电子邮箱
 */
export const isEmail = (value: string): boolean => {
  const reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
  return reg.test(value);
};

/**
 * 校验身份证号 (简单校验格式，用于前端初步拦截)
 * 用于 C2B 回收业务的实名认证环节
 */
export const isIdCard = (value: string): boolean => {
  const reg = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
  return reg.test(value);
};

/**
 * 校验价格输入 (允许两位小数的非负浮点数)
 * 用于发布闲置商品
 */
export const isPrice = (value: string): boolean => {
  // 排除 0 和 0.00
  if (parseFloat(value) <= 0) return false;
  // 允许整数或最多两位小数
  const reg = /^\d+(\.\d{1,2})?$/;
  return reg.test(value);
};

/**
 * 校验密码强度
 * 必须包含字母和数字，长度 8-20 位
 */
export const isStrongPassword = (value: string): boolean => {
  const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$/;
  return reg.test(value);
};

/**
 * 校验是否为空 (包括 null, undefined, '', 空数组, 空对象)
 */
export const isEmpty = (value: any): boolean => {
  if (value === null || value === undefined || value === '') return true;
  if (Array.isArray(value) && value.length === 0) return true;
  if (typeof value === 'object' && Object.keys(value).length === 0) return true;
  return false;
};

/**
 * 校验验证码 (6位数字)
 */
export const isAuthCode = (value: string): boolean => {
  const reg = /^\d{6}$/;
  return reg.test(value);
};