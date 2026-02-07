const config = {
  API_BASE_URL: 'http://127.0.0.1:3000',
  REQUEST_TIMEOUT: 15000,
  // 当前示例默认走 base64 提交（兼容现有 /mini/deliveries/:id/sign）。
  // 如你后端后续支持 uploadFile，可打开该开关并在签收页改用上传模式。
  ENABLE_UPLOAD_FILE: false,
  UPLOAD_FILE_URL: '',
  SIGN_SUBMIT_MODE: 'base64'
};

module.exports = config;
