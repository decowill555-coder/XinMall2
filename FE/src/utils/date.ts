/**
 * 日期时间处理工具
 * 核心解决：uni-app/iOS 日期解析兼容性、社区相对时间显示
 */

/**
 * 安全解析日期 (解决 iOS 不支持 '2023-01-01' 横杠连接符的问题)
 */
const parseDate = (date: string | number | Date): Date => {
  if (date instanceof Date) return date;
  if (typeof date === 'number') return new Date(date);
  if (typeof date === 'string') {
    if (date.includes('T')) {
      return new Date(date);
    }
    return new Date(date.replace(/-/g, '/'));
  }
  return new Date();
};

/**
 * 格式化为相对时间 (社区/IM 常用)
 * 刚刚、3分钟前、2小时前、昨天、3天前、2023-01-01
 */
export const formatTimeAgo = (time: string | number | Date): string => {
  const date = parseDate(time);
  const now = new Date();
  const diff = (now.getTime() - date.getTime()) / 1000; // 秒数差

  if (diff < 60) return '刚刚';
  
  const minutes = Math.floor(diff / 60);
  if (minutes < 60) return `${minutes}分钟前`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}小时前`;
  
  const days = Math.floor(hours / 24);
  if (days === 1) return '昨天';
  if (days < 7) return `${days}天前`;
  
  // 超过一周显示具体日期
  return formatDate(date, 'yyyy-mm-dd');
};

/**
 * 标准日期格式化
 * @param time 时间
 * @param format 格式模版 (yyyy-mm-dd hh:MM:ss)
 */
export const formatDate = (
  time: string | number | Date, 
  format: string = 'yyyy-mm-dd hh:MM:ss'
): string => {
  const date = parseDate(time);
  
  const opt: Record<string, string> = {
    'y+': date.getFullYear().toString(),
    'm+': (date.getMonth() + 1).toString(),
    'd+': date.getDate().toString(),
    'h+': date.getHours().toString(),
    'M+': date.getMinutes().toString(),
    's+': date.getSeconds().toString(),
  };

  let ret;
  for (let k in opt) {
    ret = new RegExp('(' + k + ')').exec(format);
    if (ret) {
      // 补零操作: 9 -> 09
      format = format.replace(
        ret[1], 
        (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, '0'))
      );
    }
  }
  return format;
};

/**
 * 倒计时计算器 (用于订单支付倒计时)
 * @param endTimeStr 结束时间字符串
 * @returns { d, h, m, s }
 */
export const getCountdown = (endTimeStr: string | number) => {
  const end = parseDate(endTimeStr).getTime();
  const now = Date.now();
  const diff = end - now;

  if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0, finished: true };

  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const s = Math.floor((diff % (1000 * 60)) / 1000);

  return { d, h, m, s, finished: false };
};