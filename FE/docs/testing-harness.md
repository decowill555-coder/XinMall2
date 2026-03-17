# XinMall 自动化测试与Bug修复 Harness

基于 Anthropic 的 "Effective harnesses for long-running agents" 文章，本文档定义了一套用于自动化测试和迭代修复系统 Bug 的方法论。

## 核心原则

### 1. 问题分析

AI Agent 在长时间运行的任务中面临两个主要失败模式：

1. **过度执行 (One-shotting)**: Agent 试图一次完成太多工作，导致上下文耗尽，留下半完成的功能
2. **过早完成 (Premature completion)**: Agent 看到一些进展后就认为任务完成，未能进行全面测试

### 2. 解决方案架构

```
┌─────────────────────────────────────────────────────────────────┐
│                    Bug Fixing Harness                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────┐    ┌─────────────────┐    ┌──────────────┐│
│  │  初始化 Agent   │───>│  测试 Agent     │───>│ 修复 Agent   ││
│  │  (Initializer)  │    │  (Tester)       │    │ (Coder)      ││
│  └─────────────────┘    └─────────────────┘    └──────────────┘│
│         │                      │                     │         │
│         v                      v                     v         │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                   状态管理文件                               ││
│  │  - feature_list.json (功能列表与状态)                        ││
│  │  - bug_list.json (Bug列表与状态)                             ││
│  │  - progress.md (进度记录)                                    ││
│  │  - test_results.json (测试结果)                              ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

## 工作流程

### Phase 1: 初始化 (首次运行)

```bash
# 运行初始化脚本
npm run test:init
```

初始化 Agent 执行以下任务：
1. 扫描项目结构，识别所有测试文件
2. 创建 `bug_list.json` 文件
3. 创建 `progress.md` 进度文件
4. 建立初始 git 状态

### Phase 2: 测试循环

```bash
# 运行测试循环
npm run test:cycle
```

每次循环包含以下步骤：

1. **获取状态**: 读取 progress.md 和 bug_list.json
2. **运行测试**: 执行所有测试用例
3. **分析结果**: 识别失败的测试
4. **选择修复**: 选择一个优先级最高的 Bug
5. **实施修复**: 修改代码
6. **验证修复**: 重新运行相关测试
7. **更新状态**: 更新 bug_list.json 和 progress.md

### Phase 3: 会话结束清理

每个 Agent 会话结束时：
1. 提交所有更改到 git
2. 更新 progress.md
3. 确保 bug_list.json 状态正确

## 文件结构

### bug_list.json

```json
{
  "lastUpdated": "2026-03-17T00:00:00Z",
  "summary": {
    "total": 10,
    "fixed": 3,
    "inProgress": 2,
    "pending": 5
  },
  "bugs": [
    {
      "id": "BUG-001",
      "title": "登录页面表单验证失败",
      "priority": "high",
      "category": "functional",
      "description": "用户输入无效手机号时，表单未能正确提示错误",
      "file": "src/pages-sub/user/login/index.vue",
      "testSteps": [
        "导航到登录页面",
        "输入无效手机号 '123'",
        "点击登录按钮",
        "验证错误提示是否显示"
      ],
      "status": "pending",
      "passes": false,
      "fixedBy": null,
      "fixedAt": null
    }
  ]
}
```

### progress.md

```markdown
# XinMall Bug 修复进度

## 当前会话
- **日期**: 2026-03-17
- **目标**: 修复登录页面验证问题

## 已完成
- [x] BUG-003: 修复首页轮播图加载问题
- [x] BUG-007: 修复搜索页面分页问题

## 进行中
- [ ] BUG-001: 登录表单验证

## 待处理
- [ ] BUG-002: ...
- [ ] BUG-004: ...

## 最近提交
- abc123: 修复首页轮播图加载问题
- def456: 修复搜索页面分页问题
```

### test_results.json

```json
{
  "timestamp": "2026-03-17T00:00:00Z",
  "summary": {
    "total": 50,
    "passed": 45,
    "failed": 5,
    "skipped": 0
  },
  "failures": [
    {
      "testName": "LoginForm > 手机号验证",
      "error": "Expected error message to be visible",
      "stack": "..."
    }
  ]
}
```

## Agent 行为指南

### 启动检查清单

每次 Agent 启动时执行：

1. **确认工作目录**
   ```bash
   pwd
   ```

2. **读取进度文件**
   ```bash
   cat docs/progress.md
   cat docs/bug_list.json
   ```

3. **检查 Git 历史**
   ```bash
   git log --oneline -10
   git status
   ```

4. **运行基础测试**
   ```bash
   npm run build:h5
   npm run test
   ```

### 选择 Bug 原则

优先级排序：
1. High priority + functional bugs
2. High priority + UI bugs
3. Medium priority bugs
4. Low priority bugs

### 修复流程

1. **理解问题**: 读取 Bug 描述和相关代码
2. **编写测试**: 如果没有覆盖该 Bug 的测试，先编写测试
3. **实施修复**: 修改代码
4. **验证修复**: 运行测试确认通过
5. **端到端验证**: 模拟用户行为验证功能
6. **更新状态**: 更新 bug_list.json 和 progress.md

### 会话结束检查清单

1. **代码状态**
   - [ ] 所有测试通过
   - [ ] 没有 TypeScript 错误
   - [ ] 代码格式正确

2. **文档更新**
   - [ ] bug_list.json 已更新
   - [ ] progress.md 已更新

3. **Git 提交**
   - [ ] 更改已暂存
   - [ ] 已提交并推送

## 测试策略

### 1. 单元测试

使用 Vitest 进行单元测试：

```bash
npm run test:unit
```

### 2. 组件测试

测试 Vue 组件的行为：

```bash
npm run test:component
```

### 3. 端到端测试

使用 Playwright 进行 E2E 测试：

```bash
npm run test:e2e
```

### 4. 构建验证

每次修复后验证构建：

```bash
npm run build:h5
npm run build:mp-weixin
```

## 防止常见失败模式

### 失败模式 1: 过度执行

**症状**: Agent 一次尝试修复多个 Bug

**预防**:
- 明确指示每次只修复一个 Bug
- 使用 bug_list.json 追踪状态
- 强制 Agent 选择最高优先级的单个 Bug

### 失败模式 2: 过早完成

**症状**: Bug 被标记为已修复，但实际仍有问题

**预防**:
- 要求 Agent 编写测试用例
- 要求端到端验证
- 使用 "passes" 字段追踪测试结果

### 失败模式 3: 环境混乱

**症状**: Agent 留下未完成的代码，下次启动时难以理解状态

**预防**:
- 每个 session 结束时提交 git
- 更新 progress.md
- 确保构建成功

## 命令参考

```bash
# 初始化测试环境
npm run test:init

# 运行所有测试
npm run test

# 运行测试循环 (发现并修复 Bug)
npm run test:cycle

# 运行特定测试
npm run test:file -- path/to/test.spec.ts

# 验证构建
npm run build:h5

# 检查 TypeScript
npm run type-check

# 代码格式化
npm run lint:fix
```

## 下一步

1. 创建 `docs/bug_list.json` 初始文件
2. 创建 `docs/progress.md` 初始文件
3. 运行测试识别现有 Bug
4. 开始迭代修复过程
