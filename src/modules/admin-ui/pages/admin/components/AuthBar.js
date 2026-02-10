import { antd, html, useEffect, useState } from "../utils/runtime.js";

const { Button, Input, Popconfirm, Tag, Space, Tooltip } = antd;

export function AuthBar(props) {
  const {
    token,
    loggedIn,
    checking,
    maskedToken,
    onTokenChange,
    onLogin,
    onCopyToken,
    onLogout
  } = props;
  const [showTokenInput, setShowTokenInput] = useState(!loggedIn);

  useEffect(() => {
    setShowTokenInput(!loggedIn);
  }, [loggedIn]);

  return html`
    <div className="admin-auth-header">
      <div className="admin-auth-row">
        <div className="admin-auth-title">后台登录</div>
        <${Tooltip} title=${loggedIn ? "已登录，可使用全部后台功能" : "未登录，功能受限"}>
          <${Tag} color=${loggedIn ? "success" : "warning"}>
            <span className=${`status-dot ${loggedIn ? "ok" : "warn"}`}></span>
            ${loggedIn ? "已登录" : "未登录"}
          <//>
        <//>

        ${showTokenInput || !loggedIn
          ? html`
              <${Input.Password}
                value=${token}
                onChange=${(event) => onTokenChange(event.target.value)}
                placeholder="请输入后台登录口令"
                style=${{ width: 320 }}
                disabled=${checking}
              />
              <${Button}
                type="primary"
                loading=${checking}
                onClick=${onLogin}
                disabled=${!token || checking}
              >
                ${loggedIn ? "更新口令" : "登录"}
              <//>
            `
          : null}

        ${loggedIn
          ? html`
              <${Button}
                type="link"
                size="small"
                onClick=${() => setShowTokenInput((prev) => !prev)}
              >
                ${showTokenInput ? "收起输入框" : "重新输入口令"}
              <//>
            `
          : null}

        <${Popconfirm}
          title="确认退出后台登录？"
          okText="确认退出"
          cancelText="取消"
          onConfirm=${onLogout}
          disabled=${!loggedIn || checking}
        >
          <${Button}
            type="text"
            disabled=${!loggedIn || checking}
          >
            退出
          <//>
        <//>

        <${Space} className="admin-muted">
          <span className="nowrap">当前口令：${maskedToken || "-"}</span>
          <${Tooltip} title="复制口令">
            <${Button}
              type="text"
              size="small"
              className="copy-icon-btn"
              onClick=${onCopyToken}
              disabled=${(!token && !loggedIn) || checking}
            >
              ⧉
            <//>
          <//>
          <span className="nowrap">系统会自动在请求中携带登录口令</span>
        <//>
      </div>
    </div>
  `;
}
