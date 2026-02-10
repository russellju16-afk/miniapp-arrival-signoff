import { antd, html } from "../utils/runtime.js";

const { Alert } = antd;

export function PageGuard(props) {
  const { loggedIn, message } = props;
  if (loggedIn) {
    return null;
  }
  return html`
    <${Alert}
      type="warning"
      showIcon=${true}
      message="你还没有登录后台"
      description=${message || "请先在顶部输入后台登录口令并点击登录，再进行操作"}
      style=${{ marginBottom: 12 }}
    />
  `;
}
