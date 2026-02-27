export interface TabItem {
  name: string;      // 唯一标识 (e.g., 'home')
  label: string;     // 显示文字 (e.g., '首页')
  icon: string;      // 默认图标 class (e.g., 'home')
  activeIcon: string;// 选中状态图标 class (e.g., 'home-fill')
  path: string;      // 路由路径
  isSpecial?: boolean; // 是否为中间的发布按钮
  badge?: number;    // 消息红点
}