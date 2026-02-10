import {
  antd,
  html,
  ReactDOM,
  useEffect,
  useMemo,
  useState
} from "./utils/runtime.js";
import {
  clearAdminToken,
  getAdminToken,
  maskSecret,
  setAdminApiHooks,
  setAdminToken,
  verifyAdminToken
} from "./services/adminApi.js";
import { AppSidebar } from "./components/AppSidebar.js";
import { AuthBar } from "./components/AuthBar.js";
import { DashboardPage } from "./pages/DashboardPage.js";
import { ApplicationsPage } from "./pages/ApplicationsPage.js";
import { CustomersPage } from "./pages/CustomersPage.js";
import { ProductsPage } from "./pages/ProductsPage.js";
import { OrdersPage } from "./pages/OrdersPage.js";
import { SyncPage } from "./pages/SyncPage.js";
import { DiagnosticsPage } from "./pages/DiagnosticsPage.js";
import { RequestsPage } from "./pages/RequestsPage.js";
import { SettingsPage } from "./pages/SettingsPage.js";

const { ConfigProvider, Layout, message } = antd;
const { Content, Sider } = Layout;

const HASH_PREFIX = "#/";

function resolveNavFromHash(hash) {
  const clean = String(hash || "").trim();
  if (!clean.startsWith(HASH_PREFIX)) {
    return "dashboard";
  }
  const key = clean.slice(HASH_PREFIX.length).toLowerCase();
  const validKeys = new Set([
    "dashboard",
    "applications",
    "customers",
    "products",
    "orders",
    "sync",
    "diagnostics",
    "requests",
    "settings"
  ]);
  return validKeys.has(key) ? key : "dashboard";
}

function setHashByNav(key) {
  window.location.hash = `${HASH_PREFIX}${key}`;
}

function renderPage(navKey, loggedIn) {
  switch (navKey) {
    case "applications":
      return html`<${ApplicationsPage} loggedIn=${loggedIn} />`;
    case "customers":
      return html`<${CustomersPage} loggedIn=${loggedIn} />`;
    case "products":
      return html`<${ProductsPage} loggedIn=${loggedIn} />`;
    case "orders":
      return html`<${OrdersPage} loggedIn=${loggedIn} />`;
    case "sync":
      return html`<${SyncPage} loggedIn=${loggedIn} />`;
    case "diagnostics":
      return html`<${DiagnosticsPage} loggedIn=${loggedIn} />`;
    case "requests":
      return html`<${RequestsPage} loggedIn=${loggedIn} />`;
    case "settings":
      return html`<${SettingsPage} loggedIn=${loggedIn} />`;
    case "dashboard":
    default:
      return html`<${DashboardPage} loggedIn=${loggedIn} />`;
  }
}

function App() {
  const [token, setToken] = useState(getAdminToken());
  const [loggedIn, setLoggedIn] = useState(false);
  const [checking, setChecking] = useState(false);
  const [activeNav, setActiveNav] = useState(resolveNavFromHash(window.location.hash));
  const maskedToken = useMemo(() => {
    const current = token.trim();
    return current ? maskSecret(current) : "";
  }, [token]);

  useEffect(() => {
    const onHashChange = () => {
      setActiveNav(resolveNavFromHash(window.location.hash));
    };
    window.addEventListener("hashchange", onHashChange);
    return () => {
      window.removeEventListener("hashchange", onHashChange);
    };
  }, []);

  useEffect(() => {
    const currentToken = getAdminToken();
    if (!currentToken) {
      setLoggedIn(false);
      return;
    }
    let alive = true;
    (async () => {
      setChecking(true);
      try {
        await verifyAdminToken(currentToken);
        if (!alive) return;
        setLoggedIn(true);
      } catch {
        if (!alive) return;
        setLoggedIn(false);
      } finally {
        if (alive) {
          setChecking(false);
        }
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    setAdminApiHooks({
      onUnauthorized: () => {
        setLoggedIn(false);
        setToken("");
        setActiveNav("dashboard");
        setHashByNav("dashboard");
      }
    });
    return () => {
      setAdminApiHooks({});
    };
  }, []);

  const onLogin = async () => {
    const nextToken = token.trim();
    if (!nextToken) {
      message.warning("请输入后台登录口令");
      return;
    }
    setChecking(true);
    try {
      await verifyAdminToken(nextToken);
      setAdminToken(nextToken);
      setLoggedIn(true);
      message.success("后台登录成功");
    } catch (err) {
      setLoggedIn(false);
      message.error(err?.message || "登录失败，请检查口令");
    } finally {
      setChecking(false);
    }
  };

  const onLogout = () => {
    clearAdminToken();
    setToken("");
    setLoggedIn(false);
    setActiveNav("dashboard");
    setHashByNav("dashboard");
    message.info("已退出后台登录");
  };

  const onCopyToken = async () => {
    const value = token.trim() || getAdminToken();
    if (!value) {
      message.warning("当前没有可复制的登录口令");
      return;
    }
    try {
      await navigator.clipboard.writeText(value);
      message.success("登录口令已复制");
    } catch {
      message.error("复制失败，请手动复制");
    }
  };

  const onNavChange = (nextKey) => {
    setActiveNav(nextKey);
    setHashByNav(nextKey);
  };

  return html`
    <${ConfigProvider}
      theme=${{
        token: {
          colorPrimary: "#1E3A8A",
          colorPrimaryHover: "#274B9F",
          colorPrimaryActive: "#162C6B",
          colorInfo: "#2563EB",
          colorSuccess: "#16A34A",
          colorWarning: "#D97706",
          colorError: "#DC2626",
          colorBgLayout: "#F6F8FB",
          colorBgContainer: "#FFFFFF",
          colorBorder: "#E5E7EB",
          colorBorderSecondary: "#D1D5DB",
          colorText: "#0F172A",
          colorTextSecondary: "#334155",
          colorTextTertiary: "#64748B",
          borderRadius: 8,
          fontSize: 13
        },
        components: {
          Menu: {
            itemSelectedBg: "#EEF2FF",
            itemSelectedColor: "#1E3A8A",
            itemHoverColor: "#1E3A8A",
            itemHoverBg: "#EEF2FF",
            itemColor: "#334155",
            activeBarHeight: 0
          },
          Layout: {
            bodyBg: "#F6F8FB",
            siderBg: "#FFFFFF"
          },
          Table: {
            headerBg: "#F8FAFC",
            headerColor: "#334155",
            borderColor: "#E5E7EB"
          }
        }
      }}
    >
      <div className="admin-root">
        <${AuthBar}
          token=${token}
          loggedIn=${loggedIn}
          checking=${checking}
          maskedToken=${maskedToken}
          onTokenChange=${setToken}
          onLogin=${onLogin}
          onCopyToken=${onCopyToken}
          onLogout=${onLogout}
        />
        <${Layout} className="admin-main-layout">
          <${Sider} width=${250} className="admin-sider" theme="light">
            <${AppSidebar} activeKey=${activeNav} onChange=${onNavChange} />
          <//>
          <${Content} className="admin-content">
            ${renderPage(activeNav, loggedIn)}
          <//>
        <//>
      </div>
    <//>
  `;
}

try {
  const rootEl = document.getElementById("root");
  if (!rootEl) {
    throw new Error("root element not found");
  }
  ReactDOM.createRoot(rootEl).render(html`<${App} />`);
} catch (error) {
  if (typeof window.__renderAdminFatal === "function") {
    window.__renderAdminFatal(
      "后台初始化失败",
      error instanceof Error ? error.stack || error.message : String(error)
    );
  } else {
    throw error;
  }
}
