# 微信小程序（原生）- 线上签收与对账

## 1. 项目说明

本项目使用微信小程序原生技术栈：`WXML + WXSS + JavaScript`。

已实现页面：

- `pages/login` 登录（支持输入 token、扫码解析 token）
- `pages/deliveries/list` 待签收列表
- `pages/deliveries/detail` 签收单详情
- `pages/deliveries/sign` 手写签名 + 拍照上传 + 提交签收
- `pages/statements/list` 对账单列表（日期筛选）
- `pages/statements/detail` 对账单详情 + 确认无误

## 2. 后端接口要求

默认对接你当前后端接口：

- `POST /mini/login`
- `GET /mini/deliveries`
- `GET /mini/deliveries/:id`
- `POST /mini/deliveries/:id/sign`
- `GET /mini/statements`
- `GET /mini/statements/:id`
- `POST /mini/statements/:id/confirm`

## 3. 本地运行步骤

1. 打开微信开发者工具。
2. 选择“导入项目”，项目目录选择本目录 `miniapp`。
3. `AppID`：开发调试可使用测试号（或你自己的小程序 AppID）。
4. 导入后在 `miniapp/config.js` 修改：

```js
API_BASE_URL: 'http://你的后端地址:3000'
```

示例：

- 本机联调（开发者工具内后端也在本机）：`http://127.0.0.1:3000`
- 局域网真机联调：`http://192.168.x.x:3000`
- 线上环境：`https://api.yourdomain.com`

## 4. request 合法域名配置（开发环境说明）

### 4.1 开发者工具本地调试

可在开发者工具中进入：

- “详情” -> “本地设置” -> 勾选 `不校验合法域名、web-view（业务域名）、TLS 版本以及 HTTPS 证书`

这样可直接请求 `http://127.0.0.1:3000` 之类地址，适合本地开发。

### 4.2 真机调试/线上必须配置

在微信公众平台（小程序后台）配置服务器域名：

- 位置：开发 -> 开发管理 -> 开发设置 -> 服务器域名
- 在 `request 合法域名` 中添加你的后端 HTTPS 域名（必须 HTTPS，且证书有效）

例如：

- `https://api.example.com`

## 5. 鉴权说明

- 登录接口 `/mini/login` 使用 body 传 `{ token }`
- 其他 `/mini/*` 接口自动带：`Authorization: Bearer <token>`
- token 与 customerId 缓存在本地 storage 中

## 6. 签收图片提交方式

当前默认是 `base64`，与现有后端接口兼容。

配置文件：

- `SIGN_SUBMIT_MODE: 'base64'`

如你后端后续支持 `uploadFile`，可在 `config.js` 打开相关开关并扩展签收页逻辑。
