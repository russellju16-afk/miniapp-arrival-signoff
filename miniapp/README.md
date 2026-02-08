# 微信小程序（原生）- 线上签收与对账

## 1. 项目说明

本项目使用微信小程序原生技术栈：`WXML + WXSS + JavaScript`。

已实现页面：

- `pages/login` 登录（输入 token / 扫码 / 粘贴板识别）
- `pages/products/list` 商城首页（搜索、排序、仅看有货、收藏、最近搜索）
- `pages/products/detail` 商品详情（多规格、收藏、加入购物车、立即购买）
- `pages/cart/index` 购物车（勾选结算、全选、数量调整、去结算）
- `pages/checkout/index` 结算页（地址、配送、优惠券、备注、提交订单）
- `pages/orders/list` 订单列表（状态筛选 + 订单号搜索 + 分页加载）
- `pages/orders/detail` 订单详情（取消订单、再次购买、结算信息回显）
- `pages/favorites/index` 收藏商品列表
- `pages/history/index` 浏览足迹
- `pages/address/index` 地址管理（增删改/设默认/导入微信地址）
- `pages/coupons/index` 优惠券中心（可用/已使用/过期）
- `pages/deliveries/list` 待签收列表
- `pages/deliveries/detail` 签收单详情
- `pages/deliveries/sign` 手写签名 + 拍照上传 + 提交签收
- `pages/statements/list` 对账单列表（日期筛选）
- `pages/statements/detail` 对账单详情 + 确认无误
- `pages/mine/index` 个人中心（商城资产统计、协议/隐私/客服、退出登录）

## 2. 后端接口要求

默认对接主线接口：

- `POST /api/mini/login`
- `GET /api/mini/products`
- `GET /api/mini/products/:id`
- `GET /api/mini/cart`
- `POST /api/mini/cart/items`
- `PATCH /api/mini/cart/items/:id`
- `DELETE /api/mini/cart/items/:id`
- `POST /api/mini/orders`
- `GET /api/mini/orders`
- `GET /api/mini/orders/:id`
- `POST /api/mini/orders/:id/cancel`
- `GET /api/mini/deliveries`
- `GET /api/mini/deliveries/:id`
- `POST /api/mini/deliveries/:id/sign`
- `GET /api/mini/statements`
- `GET /api/mini/statements/:id`
- `POST /api/mini/statements/:id/confirm`

兼容回退（可选）：

- `USE_LEGACY_MINI_PATH=true` 时改走旧路径 `/mini/*`

## 3. 本地运行步骤

1. 打开微信开发者工具。
2. 选择“导入项目”，项目目录选择本目录 `miniapp`。
3. `AppID`：开发调试可使用测试号（或你自己的小程序 AppID）。
4. 导入后在 `miniapp/config.js` 修改：

```js
API_BASE_URL: 'http://你的后端地址:3000'
APP_VERSION: 'M4'
PRIVACY_POLICY_URL: 'https://yourdomain.com/privacy'
USER_AGREEMENT_URL: 'https://yourdomain.com/agreement'
CUSTOMER_SERVICE_PHONE: '400-xxxx-xxxx'
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

- 登录接口 `/api/mini/login` 使用 body 传 `{ token }`
- 其他 `/api/mini/*` 接口自动带：`Authorization: Bearer <token>`
- token 与 customerId 缓存在本地 storage 中

## 6. 签收图片提交方式

当前默认是 `base64`，与现有后端接口兼容。

配置文件：

- `SIGN_SUBMIT_MODE: 'base64'`

如你后端后续支持 `uploadFile`，可在 `config.js` 打开相关开关并扩展签收页逻辑。

## 7. 微信开发者工具联调步骤

1. 启动后端：`npm run dev`
2. 初始化 core 库：`npm run core:db:push`
3. 触发同步：`npm run sync:deliveries`
4. 管理接口签发客户 token：`POST /api/admin/customers/token/issue`
5. 在小程序登录页输入 token 完成登录
6. 先走“商城闭环”：选品 -> 加购/立即购买 -> 结算 -> 下单 -> 查单/复购
7. 再走“交付闭环”：签收 -> 对账 -> 确认
