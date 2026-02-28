/**
 * 货币与数值格式化工具
 * 针对数码电商的高客单价与社区互动数据进行优化
 */

// 价格拆分接口定义
interface PriceParts {
  symbol: string;  // 符号 (¥)
  integer: string; // 整数部分 (1299)
  decimal: string; // 小数部分 (00)
  full: string;    // 完整字符串 (¥1,299.00)
}

/**
 * 格式化价格 - 基础方法
 * @param value 金额
 * @param decimals 小数位
 * @param symbol 货币符号
 */
export const formatPrice = (
  value: number | string,
  decimals: number = 2,
  symbol: string = '¥'
): string => {
  const num = Number(value);
  if (isNaN(num)) return `${symbol}0.00`;
  
  // 使用 fixed 解决浮点数精度，并利用正则添加千分位
  const parts = num.toFixed(decimals).toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  
  return `${symbol}${parts.join('.')}`;
};

/**
 * 拆分价格 - 用于 UiPrice 组件实现 "¥(小) 1299(大) .00(小)" 样式
 * @param value 金额
 */
export const splitPrice = (value: number | string): PriceParts => {
  const priceStr = formatPrice(value, 2, ''); // 不带符号格式化
  const [integer, decimal] = priceStr.split('.');
  
  return {
    symbol: '¥',
    integer: integer,
    decimal: decimal,
    full: `¥${priceStr}`
  };
};

/**
 * 格式化社区互动数字 (点赞/浏览量)
 * 规则：
 * < 1000: 直接显示
 * 1k - 1w: 显示 1.2k
 * > 1w: 显示 1.2w
 * > 10w: 显示 10w+
 */
export const formatNumber = (value: number | string): string => {
  const num = Number(value);
  if (isNaN(num)) return '0';

  if (num < 1000) {
    return num.toString();
  } else if (num < 10000) {
    return (num / 1000).toFixed(1) + 'k';
  } else if (num < 100000) {
    return (num / 10000).toFixed(1) + 'w';
  } else {
    return '10w+';
  }
};

/**
 * 银行卡号脱敏
 * @param cardNo 622202******1234
 */
export const maskBankCard = (cardNo: string): string => {
  if (!cardNo) return '';
  return cardNo.replace(/^(\d{4})\d+(\d{4})$/, '$1 **** **** $2');
};