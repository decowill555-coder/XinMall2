/**
 * XinMall 登录自动化脚本
 * 用于浏览器控制台快速登录测试环境
 *
 * 使用方法:
 * 1. 打开 http://localhost:5173
 * 2. 打开浏览器控制台 (F12)
 * 3. 复制粘贴此脚本并执行
 *
 * 或者通过 Chrome DevTools MCP 执行:
 * mcp__chrome-devtools__evaluate_script({ function: <此脚本内容> })
 */

async function xinmallLogin(phone = '13800138001', password = '123456') {
  // 检查是否已登录
  const token = localStorage.getItem('token');
  if (token) {
    console.log('[XinMall] 已检测到token，尝试验证...');
    try {
      const response = await fetch('http://localhost:8080/api/user/info', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        console.log('[XinMall] Token有效，已登录');
        return { success: true, message: '已登录' };
      }
    } catch (e) {
      console.log('[XinMall] Token验证失败，重新登录');
    }
  }

  // 直接调用登录API
  console.log(`[XinMall] 正在登录: ${phone}`);
  try {
    const response = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, password })
    });

    const result = await response.json();

    if (result.success && result.data) {
      // 保存token到localStorage
      localStorage.setItem('token', result.data.token);
      localStorage.setItem('refreshToken', result.data.refreshToken);

      // 保存用户信息
      if (result.data.user) {
        localStorage.setItem('userInfo', JSON.stringify(result.data.user));
      }

      console.log('[XinMall] 登录成功!', result.data.user);

      // 刷新页面以应用登录状态
      // window.location.reload();

      return { success: true, user: result.data.user, token: result.data.token };
    } else {
      console.error('[XinMall] 登录失败:', result.message);
      return { success: false, message: result.message };
    }
  } catch (error) {
    console.error('[XinMall] 登录出错:', error);
    return { success: false, error: error.message };
  }
}

// 导航到用户资料页面
function navigateToUserProfile(userId) {
  const url = `/#/pages-sub/community/user/index?id=${userId}`;
  window.location.hash = url;
  console.log(`[XinMall] 导航到用户资料页面: userId=${userId}`);
}

// 导航到粉丝列表
function navigateToFollowers(userId) {
  const url = `/#/pages-sub/user/follow/index?userId=${userId}&tab=followers`;
  window.location.hash = url;
  console.log(`[XinMall] 导航到粉丝列表: userId=${userId}`);
}

// 导航到关注列表
function navigateToFollowing(userId) {
  const url = `/#/pages-sub/user/follow/index?userId=${userId}&tab=following`;
  window.location.hash = url;
  console.log(`[XinMall] 导航到关注列表: userId=${userId}`);
}

// 执行登录
xinmallLogin().then(result => {
  if (result.success) {
    console.log('[XinMall] 登录完成，可以开始测试');
    console.log('[XinMall] 可用命令:');
    console.log('  - navigateToUserProfile(2)  // 查看用户ID=2的资料');
    console.log('  - navigateToFollowers(1)   // 查看粉丝列表');
    console.log('  - navigateToFollowing(1)   // 查看关注列表');
  }
});

// 导出函数供后续使用
window.xinmallLogin = xinmallLogin;
window.navigateToUserProfile = navigateToUserProfile;
window.navigateToFollowers = navigateToFollowers;
window.navigateToFollowing = navigateToFollowing;
