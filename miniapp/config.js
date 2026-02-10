const config = {
  // 默认联调地址；若使用临时隧道（如 trycloudflare）请手动替换，隧道失效会出现 530。
  API_BASE_URL: 'http://127.0.0.1:3000',
  REQUEST_TIMEOUT: 15000,
  USE_LEGACY_MINI_PATH: false,
  MINI_API_PREFIX: '/api/mini',
  MINI_API_PREFIX_LEGACY: '/mini',
  APP_VERSION: 'M4',
  PRIVACY_POLICY_URL: '',
  USER_AGREEMENT_URL: '',
  CUSTOMER_SERVICE_PHONE: '',
  // 当前示例默认走 base64 提交（兼容 /api/mini/deliveries/:id/sign）。
  // 如你后端后续支持 uploadFile，可打开该开关并在签收页改用上传模式。
  ENABLE_UPLOAD_FILE: false,
  UPLOAD_FILE_URL: '',
  SIGN_SUBMIT_MODE: 'base64'
};

module.exports = config;
