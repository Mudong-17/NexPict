require('dotenv').config();
const { notarize } = require('@electron/notarize');

module.exports = async function notarizing(context) {
  // 如果不是 macOS，直接返回
  if (context.electronPlatformName !== 'darwin') {
    return;
  }

  // 检查环境变量
  const { APPLE_ID, APPLE_APP_SPECIFIC_PASSWORD, APPLE_TEAM_ID } = process.env;
  console.log(
    '🚀 ~ notarizing ~  APPLE_ID, APPLE_APP_SPECIFIC_PASSWORD, APPLE_TEAM_ID :',
    APPLE_ID,
    APPLE_APP_SPECIFIC_PASSWORD,
    APPLE_TEAM_ID,
  );

  const appName = context.packager.appInfo.productFilename;
  const appPath = `${context.appOutDir}/${appName}.app`;

  console.log('开始公证流程...');
  console.log('应用路径:', appPath);

  try {
    await notarize({
      tool: 'notarytool',
      appPath,
      appleId: APPLE_ID,
      appleIdPassword: APPLE_APP_SPECIFIC_PASSWORD,
      teamId: APPLE_TEAM_ID,
    });

    console.log('公证完成');
  } catch (error) {
    console.error('公证失败:', error);
    throw error;
  }
};
