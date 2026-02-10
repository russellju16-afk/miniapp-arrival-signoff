import htm from "/admin/assets/vendor/htm.module.js";

const ReactGlobal = window.React;
const ReactDomGlobal = window.ReactDOM;
const AntdGlobal = window.antd;

if (!ReactGlobal || !ReactDomGlobal || !AntdGlobal) {
  const missing = [];
  if (!ReactGlobal) missing.push("页面运行库");
  if (!ReactDomGlobal) missing.push("页面渲染库");
  if (!AntdGlobal) missing.push("界面组件库");
  throw new Error(`${missing.join(" / ")} 加载失败`);
}

export const React = ReactGlobal;
export const ReactDOM = ReactDomGlobal;
export const antd = AntdGlobal;
export const html = htm.bind(ReactGlobal.createElement);

export const {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef
} = ReactGlobal;
