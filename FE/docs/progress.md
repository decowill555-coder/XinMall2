# XinMall Bug 修复进度

## 当前会话
- **日期**: 2026-03-17
- **目标**: 系统性扫描并修复项目中的 Bug

## 进行中
(暂无)

## 已完成
- [x] BUG-002: HTTP 工具 token 刷新逻辑 (2026-03-17)
  - 添加 `refreshAccessToken` 函数，支持 token 自动刷新
  - 401 响应时先尝试刷新 token，刷新成功后重试原请求
  - 添加 `skipAuthRefresh` 选项跳过刷新逻辑
  - 更新 userStore 添加 `setRefreshToken` 和 `setTokens` 方法
  - 更新登录和注册页面保存 refreshToken
- [x] BUG-001: parseInt 缺少 radix 参数 (2026-03-17)
  - 为所有 parseInt 调用添加 radix 参数 (10)

## 待处理
- [ ] BUG-003: console.log 遗留在生产代码中
- [ ] BUG-004: loginByWechat/loginByAlipay 未实现真实登录
- [ ] BUG-005: TypeScript 类型检查无法运行

## 扫描结果摘要

### 已检查项
- ✅ 空 catch 块 - 未发现
- ✅ @ts-ignore/@ts-nocheck - 未发现
- ✅ localStorage/sessionStorage 直接使用 - 未发现 (使用 uni API)
- ✅ setTimeout/setInterval 清理 - WebSocket 相关代码已正确处理
- ✅ 空的 console 日志 - 已记录为 BUG-003

### 发现问题
1. **parseInt 缺少 radix** - ✅ 已修复
2. **Token 刷新机制缺失** - ✅ 已修复
3. **社交登录未实现** - 仅显示提示
4. **TypeScript 检查失败** - 工具链问题

## 最近提交
- 1916faae: fix: 自动化Bug修复 - Token刷新与parseInt radix参数
- 4f44ed97: claude对项目的优化 (API集成优化)
- 23f39012: 前端页面优化
- d0bf1e62: 前端组件修改
