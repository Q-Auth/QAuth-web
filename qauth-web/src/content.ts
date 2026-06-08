import { Fingerprint, KeyRound, QrCode, Zap } from "lucide-vue-next";
import type { Capability, Demo, Lang, RoadmapColumn } from "./types";

export const CLAIM_CODE = "K7Q9-M4VX-2PDA";
export const QR_LOGIN_PAYLOAD = "https://qauth.dev/approve?session=demo-login-session-7f3c&symbols=fox-moon-rocket-cherry";
export const VERIFY_EMOJIS = ["🦊", "🌙", "🚀", "🍒"];

export const copy = {
  zh: {
    demo: "进入 Demo",
    badge: "Device-first Authentication Engine",
    heroA: "把登录体验改成",
    heroB: "可信设备确认",
    heroDesc: "QAuth 是一套无密码认证引擎：Passkey、扫码确认、设备绑定、二次验证都在一个漂亮清晰的体验里完成。",
    cta1: "立即进入 Demo",
    cta2: "查看安全设计",
    trusted: "可信设备",
    qr: "扫码批准",
    passkey: "Passkey 登录",
    live: "实时状态",
    nav: {
      position: "定位",
      capabilities: "能力",
      flow: "流程",
      demos: "Demo",
      security: "安全",
      roadmap: "路线图",
    },
    sections: {
      capabilities: "它能解决什么",
      capabilitiesDesc: "不是又一个普通登录页，而是把高风险认证流程产品化。",
      flow: "认证流程一眼看懂",
      flowDesc: "电脑、手机、服务器状态清楚分层，用户知道自己在批准什么。",
      demo: "真实浏览器 Demo",
      demoDesc: "二维码、随机会话、Web Crypto 工作量证明和 WebAuthn 调用都使用浏览器真实能力。",
      docs: "开发者文档",
      security: "安全设计",
      roadmap: "产品路线图",
    },
    docsDesc: "接入设计、接口边界、状态机和部署方式的入口。",
    close: "关闭",
    copied: "已复制",
    copyCode: "复制领取码",
    copyFailed: "复制失败，请手动复制",
    replay: "重放事件流",
    openDemo: "运行",
    runRealAction: "运行真实操作",
    actionReady: "已生成真实会话",
    passkeyUnavailable: "当前环境无法完成 Passkey，但已调用浏览器 WebAuthn API。",
    backDemo: "返回 Demo",
    reset: "重置",
    claimCode: "领取码",
    verifySymbols: "核对屏幕符号",
  },
  en: {
    demo: "Open Demo",
    badge: "Device-first Authentication Engine",
    heroA: "Make sign-in feel like",
    heroB: "trusted device approval",
    heroDesc: "QAuth is a passwordless auth engine that brings passkeys, QR approval, device binding, and step-up verification into one polished flow.",
    cta1: "Open Demo Now",
    cta2: "View Security Design",
    trusted: "Trusted device",
    qr: "QR approval",
    passkey: "Passkey sign-in",
    live: "Live status",
    nav: {
      position: "Position",
      capabilities: "Capabilities",
      flow: "Flow",
      demos: "Demo",
      security: "Security",
      roadmap: "Roadmap",
    },
    sections: {
      capabilities: "What it fixes",
      capabilitiesDesc: "Not another generic login page — a productized high-risk authentication experience.",
      flow: "Auth flow at a glance",
      flowDesc: "Desktop, phone, and server states are separated clearly so users know what they approve.",
      demo: "Real browser demos",
      demoDesc: "QR sessions, random bindings, Web Crypto proof-of-work, and WebAuthn calls use real browser APIs.",
      docs: "Developer docs",
      security: "Security design",
      roadmap: "Product roadmap",
    },
    docsDesc: "Entry point for integration design, API boundaries, state machines, and deployment.",
    close: "Close",
    copied: "Copied",
    copyCode: "Copy claim code",
    copyFailed: "Copy failed; copy manually",
    replay: "Replay stream",
    openDemo: "Run",
    runRealAction: "Run real action",
    actionReady: "Real session generated",
    passkeyUnavailable: "This environment cannot finish passkey auth, but the browser WebAuthn API was invoked.",
    backDemo: "Back to Demo",
    reset: "Reset",
    claimCode: "Claim code",
    verifySymbols: "Verify symbols",
  },
} as const;

export const capabilities: Record<Lang, Capability[]> = {
  zh: [
    { icon: Fingerprint, title: "Passkey 优先", desc: "用设备解锁、面容或指纹完成登录，服务端只保存公钥。" },
    { icon: QrCode, title: "电脑扫码确认", desc: "二维码只包含会话编号，手机核对请求后把会话交回原浏览器。" },
    { icon: Zap, title: "抗滥用挑战", desc: "敏感入口前增加轻量计算挑战，提高机器人刷接口成本。" },
    { icon: KeyRound, title: "一次性领取码", desc: "老浏览器没有实时通道时，也能通过短时手动码完成登录。" },
  ],
  en: [
    { icon: Fingerprint, title: "Passkey-first", desc: "Sign in with device unlock, Face ID, or fingerprint. The server stores public keys only." },
    { icon: QrCode, title: "Desktop QR approval", desc: "The QR contains only a session id; phone approval returns the session to the original browser." },
    { icon: Zap, title: "Abuse challenge", desc: "A lightweight puzzle before sensitive entry points raises bot and brute-force costs." },
    { icon: KeyRound, title: "One-time claim code", desc: "Legacy browsers can still sign in with a short-lived manual fallback code." },
  ],
};

export const flow: Record<Lang, string[]> = {
  zh: ["电脑创建扫码会话", "手机扫码并核对设备符号", "Passkey / 设备解锁批准", "服务端校验绑定关系", "原浏览器自动登录"],
  en: ["Desktop creates QR session", "Phone scans and checks symbols", "Passkey / device unlock approves", "Server validates device binding", "Original browser signs in"],
};

export const demoItems: Record<Lang, Demo[]> = {
  zh: [
    { id: "desktopQr", icon: "💻", title: "电脑二维码登录", desc: "桌面展示二维码、设备符号和实时等待状态。", accent: "from-sky-500 to-cyan-400", steps: ["生成 login_session_id", "展示二维码", "等待手机扫码", "领取已批准会话"] },
    { id: "mobileConfirm", icon: "📱", title: "手机确认登录", desc: "手机核对地点、设备和屏幕符号后批准。", accent: "from-violet-500 to-fuchsia-500", steps: ["扫描二维码", "核对请求来源", "设备解锁", "批准本次登录"] },
    { id: "pow", icon: "🧮", title: "计算挑战", desc: "浏览器完成轻量工作量证明后继续登录。", accent: "from-amber-500 to-orange-500", steps: ["拉取挑战", "本地寻找 nonce", "提交证明", "继续认证"] },
    { id: "register", icon: "🔐", title: "Passkey 注册", desc: "调用浏览器 WebAuthn 创建真实 Passkey 凭证。", accent: "from-emerald-500 to-teal-400", steps: ["创建注册挑战", "调用浏览器 Passkey", "保存公钥", "绑定可信设备"] },
    { id: "passkeyLogin", icon: "🛡️", title: "Passkey 登录", desc: "调用浏览器 WebAuthn 获取真实签名断言。", accent: "from-indigo-500 to-blue-500", steps: ["创建登录挑战", "设备完成签名", "服务端验证签名", "建立会话"] },
    { id: "classicDesktop", icon: "🗝️", title: "电脑领取码", desc: "没有实时通道时，电脑输入手机显示的一次性码。", accent: "from-rose-500 to-pink-500", steps: ["手机完成验证", "显示领取码", "电脑输入领取码", "领取码失效"] },
    { id: "classicMobile", icon: "📲", title: "手机领取码", desc: "手机端生成短时一次性登录码。", accent: "from-lime-500 to-emerald-400", steps: ["核对电脑符号", "设备验证", "生成 60 秒码", "提示电脑输入"] },
    { id: "sseFlow", icon: "📡", title: "SSE 状态流", desc: "演示连接、扫码、批准、领取会话的事件流。", accent: "from-slate-700 to-zinc-500", steps: ["连接已建立", "手机已扫码", "手机已确认", "电脑领取会话"] },
  ],
  en: [
    { id: "desktopQr", icon: "💻", title: "Desktop QR sign-in", desc: "Desktop shows QR, symbols, and live waiting state.", accent: "from-sky-500 to-cyan-400", steps: ["Create login_session_id", "Show QR code", "Wait for phone scan", "Claim approved session"] },
    { id: "mobileConfirm", icon: "📱", title: "Mobile approval", desc: "Phone checks location, device, and screen symbols before approval.", accent: "from-violet-500 to-fuchsia-500", steps: ["Scan QR", "Review request source", "Unlock device", "Approve this sign-in"] },
    { id: "pow", icon: "🧮", title: "Proof challenge", desc: "Browser solves a light proof-of-work before continuing.", accent: "from-amber-500 to-orange-500", steps: ["Fetch challenge", "Find nonce locally", "Submit proof", "Continue auth"] },
    { id: "register", icon: "🔐", title: "Passkey registration", desc: "Call browser WebAuthn to create a real passkey credential.", accent: "from-emerald-500 to-teal-400", steps: ["Create challenge", "Call browser passkey", "Store public key", "Bind trusted device"] },
    { id: "passkeyLogin", icon: "🛡️", title: "Passkey sign-in", desc: "Call browser WebAuthn to request a real signed assertion.", accent: "from-indigo-500 to-blue-500", steps: ["Create login challenge", "Device signs", "Server verifies", "Create session"] },
    { id: "classicDesktop", icon: "🗝️", title: "Desktop claim code", desc: "Desktop enters a one-time code shown on phone when realtime is unavailable.", accent: "from-rose-500 to-pink-500", steps: ["Phone verifies", "Show claim code", "Desktop enters code", "Code expires"] },
    { id: "classicMobile", icon: "📲", title: "Mobile claim code", desc: "Phone generates a short-lived one-time sign-in code.", accent: "from-lime-500 to-emerald-400", steps: ["Check desktop symbols", "Verify device", "Generate 60s code", "Prompt desktop entry"] },
    { id: "sseFlow", icon: "📡", title: "SSE status stream", desc: "Show connect, scan, approve, and claim-session events.", accent: "from-slate-700 to-zinc-500", steps: ["Connection opened", "Phone scanned", "Phone approved", "Desktop claimed session"] },
  ],
};

export const docsItems: Record<Lang, string[]> = {
  zh: ["API 设计", "WebAuthn 验证流程", "扫码会话状态机", "数据库设计", "部署方式", "OAuth / OIDC 兼容设计"],
  en: ["API design", "WebAuthn verification", "QR session state machine", "Database schema", "Deployment", "OAuth / OIDC compatibility"],
};

export const protections: Record<Lang, string[]> = {
  zh: ["二维码不携带令牌或密钥", "电脑登录绑定原始浏览器", "领取码短时有效且一次性使用", "敏感操作需要重新验证", "计算挑战绑定具体操作", "服务端只保存必要的公钥与哈希"],
  en: ["QR carries no tokens or keys", "Desktop sign-in binds to the original browser", "Claim codes are short-lived and one-time", "Sensitive actions require fresh verification", "Challenges bind to concrete operations", "Server stores only necessary public keys and hashes"],
};

export const roadmap: Record<Lang, RoadmapColumn[]> = {
  zh: [
    { title: "当前可体验", items: ["真实二维码与会话生成", "8 个真实浏览器 Demo", "主题与语言切换", "Web Crypto / WebAuthn 浏览器调用"] },
    { title: "正在实现", items: ["WebAuthn 服务端验证", "扫码状态机", "设备管理页面", "审计日志"] },
    { title: "未来计划", items: ["OAuth / OIDC 接入层", "风险策略控制台", "多产品租户", "生产部署模板"] },
  ],
  en: [
    { title: "Available now", items: ["Real QR and session generation", "8 real browser demos", "Theme and language toggle", "Web Crypto / WebAuthn browser calls"] },
    { title: "In progress", items: ["WebAuthn server verification", "QR session state machine", "Device management", "Audit logs"] },
    { title: "Planned", items: ["OAuth / OIDC layer", "Risk policy console", "Multi-product tenants", "Production deployment templates"] },
  ],
};
