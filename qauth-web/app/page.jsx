"use client";

import React, { useMemo, useRef, useState } from "react";

const EMOJIS = ["🦊", "🌙", "🚀", "🍒"];
const CLAIM = "K7Q9-M4VX-2PDA";
const DEMO_QR_URL = "https://auth.example.com/scan?sid=sid_demo_9f7a2c";

const features = [
  {
    icon: "🔐",
    title: "通行密钥优先",
    desc: "使用设备解锁、面容识别或指纹完成登录。服务器只保存公钥，不保存私钥或生物识别数据。",
  },
  {
    icon: "📱",
    title: "桌面扫码登录",
    desc: "电脑显示二维码，手机扫码确认，再把登录状态安全交回原电脑浏览器。",
  },
  {
    icon: "🧮",
    title: "计算挑战验证码",
    desc: "登录前让浏览器完成一次轻量计算任务，提高自动化刷接口和爆破备用入口的成本。",
  },
  {
    icon: "🗝️",
    title: "一次性领取码",
    desc: "旧浏览器无法使用实时通道时，可通过手机生成短时、一次性的手动登录码。",
  },
];

const flows = [
  {
    label: "手机登录",
    title: "手机直接使用通行密钥",
    steps: ["打开产品登录页", "点击使用通行密钥", "面容识别或设备解锁", "服务器验证后建立会话"],
  },
  {
    label: "电脑登录",
    title: "电脑扫码，手机确认",
    steps: ["电脑创建扫码会话", "二维码只包含会话编号", "手机扫码并核对请求", "手机通过通行密钥确认", "电脑领取会话并登录"],
  },
  {
    label: "抗滥用",
    title: "登录前完成计算挑战",
    steps: ["服务器生成短时挑战", "浏览器本地寻找答案", "服务器低成本验证", "通过后继续创建登录会话"],
  },
  {
    label: "旧浏览器",
    title: "手动输入一次性领取码",
    steps: ["电脑显示二维码", "手机扫码并完成验证", "手机显示一次性领取码", "电脑输入领取码", "领取码失效并完成登录"],
  },
];

const protections = [
  "默认不使用密码，降低密码泄露与撞库风险",
  "二维码中不放令牌、密钥或会话凭证",
  "电脑登录绑定原始浏览器，防止只拿到会话编号就登录",
  "领取码短时有效、一次性使用、服务端只保存哈希",
  "计算挑战绑定具体操作，不能跨接口复用",
  "敏感操作必须重新验证，防止登录后被直接改安全设置",
];

const limits = [
  "不能完全阻止实时中继式诱导攻击",
  "不能保护已被攻陷的手机或服务器",
  "不能阻止用户主动把一次性领取码发给攻击者",
  "不能替代通行密钥，只能作为抗滥用保护层",
];

const architecture = [
  { icon: "🖥️", title: "网页界面", items: ["通行密钥注册", "扫码登录", "手机确认", "计算挑战", "设备管理"] },
  { icon: "🧩", title: "接口服务", items: ["注册挑战", "登录验证", "扫码会话", "领取码校验", "计算挑战校验"] },
  { icon: "🔒", title: "认证核心", items: ["挑战生成", "响应验证", "设备绑定", "风险检查", "工作量证明"] },
  { icon: "🗄️", title: "数据存储", items: ["用户", "通行密钥", "会话", "设备", "扫码会话", "计算挑战"] },
];

const roadmap = [
  "真实通行密钥服务端验证",
  "数据库持久化",
  "扫码会话状态机",
  "实时通知或长轮询通道",
  "领取码生成与校验",
  "计算挑战难度策略",
  "设备管理页面",
  "高风险操作再验证",
];

const demoItems = [
  { id: "desktopQr", icon: "💻", title: "电脑二维码登录页", desc: "电脑显示二维码、请求符号、IP、地点、浏览器信息。" },
  { id: "mobileConfirm", icon: "📱", title: "手机扫码确认页", desc: "手机扫码后核对请求符号，再确认登录电脑。" },
  { id: "pow", icon: "🧮", title: "计算挑战验证码", desc: "纯前端寻找哈希答案，演示工作量证明式验证码。" },
  { id: "register", icon: "🔑", title: "注册通行密钥", desc: "调用浏览器的通行密钥注册能力，尝试创建凭据。" },
  { id: "passkeyLogin", icon: "👤", title: "通行密钥登录", desc: "调用浏览器的通行密钥登录能力，显示返回数据。" },
  { id: "classicDesktop", icon: "🔐", title: "电脑端领取码登录", desc: "老浏览器无实时通道时，手动输入手机返回的登录码。" },
  { id: "classicMobile", icon: "🛡️", title: "手机端返回领取码", desc: "手机验证后显示一次性登录码，用于旧浏览器备用登录。" },
];

function GlobalStyles() {
  return (
    <style>{`
      html { scroll-behavior: smooth; }
      @keyframes qauthPageIn {
        from { opacity: 0; transform: translateY(14px) scale(0.992); filter: blur(3px); }
        to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
      }
      @keyframes qauthModalOverlayIn {
        from { opacity: 0; backdrop-filter: blur(0); }
        to { opacity: 1; backdrop-filter: blur(18px); }
      }
      @keyframes qauthModalPanelIn {
        from { opacity: 0; transform: translateY(26px) scale(0.94); filter: blur(6px); }
        to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
      }
      @keyframes qauthModalOverlayOut {
        from { opacity: 1; backdrop-filter: blur(18px); }
        to { opacity: 0; backdrop-filter: blur(0); }
      }
      @keyframes qauthModalPanelOut {
        from { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        to { opacity: 0; transform: translateY(18px) scale(0.96); filter: blur(5px); }
      }
      @keyframes qauthSoftIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .qauth-page-enter { animation: qauthPageIn 360ms cubic-bezier(.22,1,.36,1) both; }
      .qauth-soft-enter { animation: qauthSoftIn 520ms cubic-bezier(.22,1,.36,1) both; }
      .qauth-modal-overlay-open { animation: qauthModalOverlayIn 260ms cubic-bezier(.22,1,.36,1) both; }
      .qauth-modal-overlay-close { animation: qauthModalOverlayOut 220ms cubic-bezier(.22,1,.36,1) both; }
      .qauth-modal-panel-open { animation: qauthModalPanelIn 360ms cubic-bezier(.22,1,.36,1) both; }
      .qauth-modal-panel-close { animation: qauthModalPanelOut 220ms cubic-bezier(.22,1,.36,1) both; }
      .qauth-hide-scrollbar::-webkit-scrollbar { width: 10px; }
      .qauth-hide-scrollbar::-webkit-scrollbar-thumb { background: rgba(24,24,27,.22); border-radius: 999px; border: 3px solid transparent; background-clip: content-box; }
      @media (prefers-reduced-motion: reduce) {
        html { scroll-behavior: auto; }
        .qauth-page-enter, .qauth-soft-enter, .qauth-modal-overlay-open, .qauth-modal-overlay-close, .qauth-modal-panel-open, .qauth-modal-panel-close { animation: none !important; }
      }
    `}</style>
  );
}

function Button({ children, className = "", variant = "solid", ...props }) {
  const styles = {
    solid: "bg-zinc-950 text-white hover:bg-zinc-800",
    outline: "border border-zinc-200 bg-white text-zinc-950 hover:bg-zinc-50",
    ghost: "bg-transparent text-zinc-600 hover:bg-zinc-100",
    danger: "bg-red-600 text-white hover:bg-red-700",
    success: "bg-emerald-600 text-white hover:bg-emerald-700",
  };
  return (
    <button
      className={`inline-flex items-center justify-center font-medium transition disabled:pointer-events-none disabled:opacity-50 ${styles[variant] || styles.solid} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

function Card({ children, className = "" }) {
  return <section className={`rounded-[2rem] border border-zinc-200 bg-white/90 shadow-sm ${className}`}>{children}</section>;
}

function Info({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-zinc-50 p-3 ring-1 ring-zinc-200">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-xl shadow-sm">{icon}</div>
      <div className="min-w-0">
        <p className="text-xs text-zinc-500">{label}</p>
        <p className="truncate text-sm font-medium text-zinc-950">{value}</p>
      </div>
    </div>
  );
}

function DemoFrame({ title, subtitle, tag, children }) {
  return (
    <div className="text-zinc-950">
      <div className="mb-5 flex flex-col gap-3 rounded-[2rem] border border-zinc-200 bg-white/80 p-4 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div>
          <p className="mb-1 text-xs font-medium tracking-[0.2em] text-zinc-500">{tag}</p>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">{subtitle}</p>
        </div>
        <div className="rounded-2xl bg-zinc-50 px-4 py-3 text-xs leading-5 text-zinc-500 ring-1 ring-zinc-200">
          纯前端演示 · 数据不会提交到服务器
        </div>
      </div>
      {children}
    </div>
  );
}

function DemoQRCode({ size = "large" }) {
  const filled = new Set([0,1,2,9,10,11,18,19,20,6,7,8,15,16,17,24,25,26,54,55,56,63,64,65,72,73,74,4,13,22,31,40,49,58,67,76,30,32,34,38,42,46,50,52,60,62,68,70]);
  const wrap = size === "large" ? "h-64 w-64" : "h-56 w-56";
  return (
    <div className={`relative mx-auto flex ${wrap} items-center justify-center rounded-[2rem] bg-white p-4 shadow-inner ring-1 ring-zinc-200`}>
      <div className="grid h-full w-full grid-cols-9 grid-rows-9 gap-1">
        {Array.from({ length: 81 }).map((_, i) => (
          <div key={i} className={filled.has(i) ? "rounded-sm bg-zinc-950" : "rounded-sm bg-zinc-100"} />
        ))}
      </div>
      <div className="absolute rounded-2xl bg-white p-3 text-3xl shadow-sm">▣</div>
    </div>
  );
}

function EmojiStrip({ big = false }) {
  return (
    <div className="flex justify-center gap-2">
      {EMOJIS.map((e) => (
        <div key={e} className={`${big ? "h-16 w-16 text-3xl" : "h-12 w-12 text-2xl"} flex items-center justify-center rounded-2xl bg-zinc-100 ring-1 ring-zinc-200`}>
          {e}
        </div>
      ))}
    </div>
  );
}

function Pill({ children }) {
  return <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm text-white/85 backdrop-blur">{children}</span>;
}

function SectionTitle({ eyebrow, title, desc }) {
  return (
    <div className="mx-auto mb-10 max-w-3xl text-center">
      <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-sky-50 px-4 py-2 text-sm font-medium text-sky-700 ring-1 ring-sky-100">
        ✨ {eyebrow}
      </div>
      <h2 className="text-3xl font-bold tracking-tight text-slate-950 md:text-5xl">{title}</h2>
      <p className="mt-4 text-base leading-8 text-slate-600 md:text-lg">{desc}</p>
    </div>
  );
}

function HomePage({ openDemo }) {
  const nav = ["定位", "能力", "流程", "演示", "安全", "路线图"];
  const [open, setOpen] = useState(false);

  return (
    <div className="qauth-page-enter min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <a href="#top" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-xl text-white shadow-lg shadow-slate-900/20">盾</div>
            <div>
              <div className="text-lg font-bold tracking-tight">QAuth</div>
              <div className="text-xs text-slate-500">身份验证引擎</div>
            </div>
          </a>

          <nav className="hidden items-center gap-6 md:flex">
            {nav.map((item) => (
              <a key={item} href={`#${item}`} className="text-sm font-medium text-slate-600 transition hover:text-slate-950">
                {item}
              </a>
            ))}
          </nav>

          <button onClick={() => openDemo("desktopQr")} className="hidden rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5 hover:bg-slate-800 md:inline-flex">
            打开演示
          </button>

          <button onClick={() => setOpen(!open)} className="rounded-xl border border-slate-200 p-2 md:hidden" aria-label="打开导航">
            {open ? "关闭" : "菜单"}
          </button>
        </div>

        {open && (
          <div className="border-t border-slate-200 bg-white px-5 py-4 md:hidden">
            <div className="flex flex-col gap-3">
              {nav.map((item) => (
                <a key={item} href={`#${item}`} onClick={() => setOpen(false)} className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
                  {item}
                </a>
              ))}
              <button onClick={() => { setOpen(false); openDemo("desktopQr"); }} className="rounded-xl bg-slate-950 px-3 py-3 text-left text-sm font-medium text-white">打开演示</button>
            </div>
          </div>
        )}
      </header>

      <main id="top">
        <section className="relative overflow-hidden bg-slate-950 px-5 py-20 text-white md:py-28">
          <div className="absolute inset-0 opacity-40">
            <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-sky-500 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-indigo-500 blur-3xl" />
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.16),transparent_32%),linear-gradient(to_bottom,transparent,rgba(2,6,23,1))]" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <div className="mb-6 flex flex-wrap gap-2">
                <Pill>无密码</Pill>
                <Pill>设备优先</Pill>
                <Pill>扫码确认</Pill>
                <Pill>计算挑战</Pill>
              </div>
              <h1 className="max-w-4xl text-5xl font-black leading-tight tracking-tight md:text-7xl">
                让登录回到
                <span className="block bg-gradient-to-r from-sky-200 via-white to-indigo-200 bg-clip-text text-transparent">可信设备本身</span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-9 text-slate-300 md:text-xl">
                QAuth 是一个可复用的身份验证引擎，专为无密码、设备驱动的登录体验设计。它运行在你的产品背后，让用户看到产品品牌，同时由 QAuth 负责安全认证。
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <button onClick={() => openDemo("desktopQr")} className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-slate-950 shadow-2xl shadow-white/10 transition hover:-translate-y-0.5">
                  进入可点击演示 →
                </button>
                <a href="#能力" className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/10">
                  查看方案能力
                </a>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 rounded-[2.5rem] bg-white/10 blur-2xl" />
              <div className="relative rounded-[2rem] border border-white/15 bg-white/10 p-4 shadow-2xl backdrop-blur-xl">
                <div className="rounded-[1.5rem] bg-white p-4 text-slate-950 shadow-2xl">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <div className="text-sm text-slate-500">登录 Banana</div>
                      <div className="text-xl font-bold">使用可信设备安全登录</div>
                    </div>
                    <div className="rounded-2xl bg-slate-950 p-3 text-2xl text-white">▦</div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
                    <div className="rounded-3xl bg-slate-100 p-5">
                      <DemoQRCode size="small" />
                      <div className="mt-4 text-center text-sm font-semibold text-slate-700">请用手机相机扫码</div>
                    </div>

                    <div className="space-y-3">
                      <div className="rounded-3xl border border-slate-200 p-4">
                        <div className="mb-2 text-sm font-semibold text-slate-500">请求标识</div>
                        <EmojiStrip />
                      </div>
                      <div className="rounded-3xl border border-slate-200 p-4">
                        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-500">📱 手机确认</div>
                        <div className="space-y-2 text-sm text-slate-700">
                          <div className="flex justify-between gap-4"><span>请求设备</span><strong>桌面浏览器</strong></div>
                          <div className="flex justify-between gap-4"><span>登录地点</span><strong>广东 · 中国</strong></div>
                          <div className="flex justify-between gap-4"><span>验证方式</span><strong>通行密钥</strong></div>
                        </div>
                      </div>
                      <button onClick={() => openDemo("mobileConfirm")} className="w-full rounded-2xl bg-slate-950 py-3 font-bold text-white shadow-lg shadow-slate-900/20">
                        打开手机确认演示
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 text-center text-xs text-slate-400">身份验证由 QAuth 驱动</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="定位" className="px-5 py-20 md:py-28">
          <div className="mx-auto max-w-7xl">
            <SectionTitle
              eyebrow="产品定位"
              title="QAuth 不是登录品牌，而是认证底座"
              desc="用户应该看到你的产品名称，例如“登录 Banana”。QAuth 在背后提供通行密钥、扫码确认、计算挑战、领取码备用和会话管理能力。"
            />
            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-[2rem] bg-white p-8 shadow-xl shadow-slate-200/70 ring-1 ring-slate-200">
                <div className="mb-5 text-sm font-bold text-slate-400">用户看到</div>
                <div className="text-3xl font-black">登录 Banana</div>
                <p className="mt-4 leading-7 text-slate-600">登录页主标题保持产品品牌，不把 QAuth 当作第三方登录按钮展示。</p>
              </div>
              <div className="rounded-[2rem] bg-slate-950 p-8 text-white shadow-xl shadow-slate-900/20">
                <div className="mb-5 text-sm font-bold text-slate-400">底层负责</div>
                <div className="text-3xl font-black">QAuth</div>
                <p className="mt-4 leading-7 text-slate-300">处理认证挑战、设备绑定、扫码会话、领取码、计算挑战和会话签发。</p>
              </div>
              <div className="rounded-[2rem] bg-white p-8 shadow-xl shadow-slate-200/70 ring-1 ring-slate-200">
                <div className="mb-5 text-sm font-bold text-slate-400">页脚说明</div>
                <div className="text-3xl font-black">身份验证由 QAuth 驱动</div>
                <p className="mt-4 leading-7 text-slate-600">既保留技术可信感，又不会干扰产品本身的品牌表达。</p>
              </div>
            </div>
          </div>
        </section>

        <section id="能力" className="bg-white px-5 py-20 md:py-28">
          <div className="mx-auto max-w-7xl">
            <SectionTitle
              eyebrow="核心能力"
              title="围绕可信设备构建登录体验"
              desc="QAuth 默认不把密码当成入口，而是把用户已经拥有并信任的设备作为主要认证器。"
            />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {features.map((item) => (
                <div key={item.title} className="rounded-[2rem] border border-slate-200 bg-slate-50 p-7 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/80">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-2xl text-white">{item.icon}</div>
                  <h3 className="mt-6 text-xl font-bold">{item.title}</h3>
                  <p className="mt-3 leading-7 text-slate-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="流程" className="px-5 py-20 md:py-28">
          <div className="mx-auto max-w-7xl">
            <SectionTitle
              eyebrow="主要流程"
              title="从新设备到旧浏览器，都有清晰路径"
              desc="现代设备优先使用通行密钥，电脑端优先扫码确认，高风险入口可加入计算挑战，旧环境则降级到手动领取码。"
            />
            <div className="grid gap-6 lg:grid-cols-4">
              {flows.map((flow) => (
                <div key={flow.title} className="rounded-[2rem] bg-white p-7 shadow-xl shadow-slate-200/70 ring-1 ring-slate-200">
                  <div className="mb-5 inline-flex rounded-full bg-sky-50 px-4 py-2 text-sm font-bold text-sky-700">{flow.label}</div>
                  <h3 className="text-2xl font-black">{flow.title}</h3>
                  <div className="mt-7 space-y-4">
                    {flow.steps.map((step, i) => (
                      <div key={step} className="flex gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-950 text-sm font-bold text-white">{i + 1}</div>
                        <div className="pt-1 text-sm font-medium leading-6 text-slate-700">{step}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="演示" className="bg-white px-5 py-20 md:py-28">
          <div className="mx-auto max-w-7xl">
            <SectionTitle
              eyebrow="可点击演示"
              title="把认证流程做成可以点得动的原型"
              desc="点击卡片后，演示会以居中的弹窗打开。背景会虚化，点击右上角关闭按钮或背景空白处都可以平滑关闭。"
            />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {demoItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => openDemo(item.id)}
                  className="group rounded-[2rem] border border-zinc-200 bg-white/90 p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md"
                >
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-950 text-2xl text-white shadow-sm">{item.icon}</div>
                  <h2 className="text-xl font-semibold tracking-tight">{item.title}</h2>
                  <p className="mt-2 min-h-[48px] text-sm leading-6 text-zinc-600">{item.desc}</p>
                  <div className="mt-5 inline-flex items-center rounded-2xl bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-700 ring-1 ring-zinc-200 group-hover:bg-zinc-950 group-hover:text-white">
                    打开弹窗 →
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section id="安全" className="bg-slate-950 px-5 py-20 text-white md:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white ring-1 ring-white/10">🔒 安全模型</div>
                <h2 className="text-3xl font-black tracking-tight md:text-5xl">二维码不是秘密，原浏览器绑定才是关键</h2>
                <p className="mt-5 text-lg leading-9 text-slate-300">
                  QAuth 的扫码登录只把会话编号放入二维码。真正领取桌面会话时，必须同时验证手机已批准，以及电脑浏览器里保存的安全令牌是否匹配。计算挑战只负责提高自动化请求成本，不替代身份验证。
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="rounded-[2rem] border border-emerald-400/20 bg-emerald-400/10 p-7">
                  <div className="mb-5 flex items-center gap-3 text-xl font-bold text-emerald-100">✅ 重点防护</div>
                  <div className="space-y-4">
                    {protections.map((item) => (
                      <div key={item} className="flex gap-3 text-sm leading-6 text-emerald-50/90">
                        <span>✓</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[2rem] border border-amber-400/20 bg-amber-400/10 p-7">
                  <div className="mb-5 flex items-center gap-3 text-xl font-bold text-amber-100">⚠️ 仍需警惕</div>
                  <div className="space-y-4">
                    {limits.map((item) => (
                      <div key={item} className="flex gap-3 text-sm leading-6 text-amber-50/90">
                        <span>!</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white px-5 py-20 md:py-28">
          <div className="mx-auto max-w-7xl">
            <SectionTitle
              eyebrow="系统结构"
              title="模块清晰，方便接入不同产品"
              desc="QAuth 可以作为独立服务部署，也可以作为产品内部认证模块存在。"
            />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {architecture.map((block) => (
                <div key={block.title} className="rounded-[2rem] border border-slate-200 bg-slate-50 p-7">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm ring-1 ring-slate-200">{block.icon}</div>
                  <h3 className="mt-5 text-xl font-black">{block.title}</h3>
                  <div className="mt-5 space-y-3">
                    {block.items.map((item) => (
                      <div key={item} className="rounded-2xl bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-100">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="路线图" className="px-5 py-20 md:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="overflow-hidden rounded-[2.5rem] bg-slate-950 text-white shadow-2xl shadow-slate-900/20">
              <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
                <div className="p-8 md:p-12">
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/10">🔄 接下来实现</div>
                  <h2 className="text-3xl font-black tracking-tight md:text-5xl">从设计稿走向可运行认证核心</h2>
                  <p className="mt-5 text-lg leading-9 text-slate-300">
                    当前适合先做最小可用版本：通行密钥注册与登录、扫码会话、桌面领取、领取码备用、计算挑战，再逐步补齐设备管理和备用验证。
                  </p>
                </div>
                <div className="bg-white/5 p-8 md:p-12">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {roadmap.map((item, index) => (
                      <div key={item} className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-4 ring-1 ring-white/10">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-sm font-black text-slate-950">{index + 1}</div>
                        <div className="font-semibold text-slate-100">{item}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white px-5 py-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 text-center md:flex-row md:items-center md:justify-between md:text-left">
          <div>
            <div className="text-lg font-black">QAuth</div>
            <div className="mt-1 text-sm text-slate-500">可复用的无密码身份验证引擎</div>
          </div>
          <div className="text-sm text-slate-500">身份验证由 QAuth 驱动</div>
        </div>
      </footer>
    </div>
  );
}

function DemoModal({ page, closing, setPage, closeDemo }) {
  if (!page) return null;

  const titles = {
    desktopQr: "电脑二维码登录页",
    mobileConfirm: "手机扫码确认页",
    pow: "计算挑战验证码",
    register: "注册通行密钥",
    passkeyLogin: "通行密钥登录",
    classicDesktop: "电脑端领取码登录",
    classicMobile: "手机端返回领取码",
  };

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/45 p-3 sm:p-6 ${closing ? "qauth-modal-overlay-close" : "qauth-modal-overlay-open"}`}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) closeDemo();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={titles[page] || "QAuth 演示"}
    >
      <div className={`relative flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-[2rem] border border-white/60 bg-white/95 shadow-2xl shadow-slate-950/30 ring-1 ring-slate-900/10 backdrop-blur-xl ${closing ? "qauth-modal-panel-close" : "qauth-modal-panel-open"}`}>
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-zinc-200 bg-white/90 px-4 py-3 backdrop-blur sm:px-5">
          <div className="min-w-0">
            <p className="text-xs font-medium tracking-[0.2em] text-zinc-400">QAUTH DEMO</p>
            <h2 className="truncate text-base font-semibold text-zinc-950 sm:text-lg">{titles[page] || "演示"}</h2>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={page}
              onChange={(e) => setPage(e.target.value)}
              className="hidden h-10 rounded-2xl border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-700 outline-none ring-zinc-300 focus:ring-4 sm:block"
            >
              {demoItems.map((item) => (
                <option key={item.id} value={item.id}>{item.title}</option>
              ))}
            </select>
            <button
              onClick={closeDemo}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-xl font-semibold text-zinc-700 ring-1 ring-zinc-200 transition hover:rotate-90 hover:bg-zinc-950 hover:text-white"
              aria-label="关闭演示"
            >
              ×
            </button>
          </div>
        </div>

        <div className="qauth-hide-scrollbar overflow-y-auto bg-[radial-gradient(circle_at_top_left,#f4f4f5,transparent_35%),linear-gradient(180deg,#fff,#f4f4f5)] p-4 sm:p-6">
          {page === "desktopQr" && <DesktopQrDemo />}
          {page === "mobileConfirm" && <MobileConfirmDemo />}
          {page === "pow" && <ProofChallengeDemo />}
          {page === "register" && <WebAuthnDemo mode="register" />}
          {page === "passkeyLogin" && <WebAuthnDemo mode="login" />}
          {page === "classicDesktop" && <ClassicDesktopDemo />}
          {page === "classicMobile" && <ClassicMobileDemo />}
        </div>
      </div>
    </div>
  );
}

function DesktopQrDemo() {
  return (
    <DemoFrame tag="电脑登录" title="电脑端二维码登录" subtitle="二维码里只放会话编号。请求符号只显示在电脑屏幕上，不放进二维码。">
      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <div className="p-5 sm:p-8">
            <div className="rounded-[2rem] bg-zinc-50 p-5 ring-1 ring-zinc-200">
              <p className="text-center text-sm font-medium text-zinc-600">请用手机相机扫描二维码</p>
              <div className="mt-5"><DemoQRCode /></div>
              <div className="mt-6 rounded-2xl bg-white p-5 text-center shadow-sm ring-1 ring-zinc-200">
                <p className="mb-3 text-sm font-medium text-zinc-600">电脑屏幕验证符号</p>
                <EmojiStrip big />
                <p className="mt-3 text-xs text-zinc-500">手机上不要自动显示这组符号，必须让用户从电脑屏幕读取。</p>
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-5">
          <Card>
            <div className="p-5 sm:p-6">
              <h2 className="mb-4 text-lg font-semibold">登录请求信息</h2>
              <div className="space-y-3">
                <Info icon="🧩" label="会话编号" value="sid_demo_9f7a2c" />
                <Info icon="🌐" label="电脑地址" value="223.104.68.xxx" />
                <Info icon="📍" label="大概地点" value="广东 · 中国" />
                <Info icon="💻" label="浏览器" value="Chrome on Windows 11" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-5 sm:p-6">
              <h2 className="mb-3 text-lg font-semibold">二维码内容演示</h2>
              <div className="break-all rounded-2xl bg-zinc-950 p-4 font-mono text-xs leading-6 text-zinc-100">{DEMO_QR_URL}</div>
              <Button className="mt-4 h-12 w-full rounded-2xl" variant="outline">↻ 重新生成二维码</Button>
            </div>
          </Card>
        </div>
      </div>
    </DemoFrame>
  );
}

function MobileConfirmDemo() {
  const [input, setInput] = useState(["", "", "", ""]);
  const [approved, setApproved] = useState(false);
  const matched = input.join("") === EMOJIS.join("");

  return (
    <DemoFrame tag="手机确认" title="手机扫码确认页" subtitle="手机扫码后显示登录地点、地址、浏览器，并要求用户从电脑屏幕核对请求符号。">
      <div className="mx-auto max-w-md">
        <section className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-sm">
          <div className="bg-zinc-950 p-5 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs tracking-[0.2em] text-zinc-400">手机确认</p>
                <h2 className="mt-1 text-2xl font-semibold">确认电脑登录</h2>
              </div>
              <span className="text-3xl">📱</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-zinc-300">请确认这是你本人正在操作的电脑。地址不做限制，只用于展示。</p>
          </div>

          <div className="space-y-4 p-5">
            <Info icon="💻" label="请求设备" value="Chrome on Windows 11" />
            <Info icon="📍" label="登录地点" value="广东 · 中国" />
            <Info icon="🌐" label="登录地址" value="223.104.68.xxx" />

            <div className="rounded-[1.5rem] border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
              <div className="mb-1 flex items-center gap-2 font-semibold"><span>⚠️</span> 核对电脑屏幕上的符号</div>
              这组符号不在二维码里。请从电脑屏幕读取后在手机上选择，确认你正在批准正确的电脑登录。
            </div>

            <div>
              <p className="mb-3 text-sm font-medium text-zinc-700">选择电脑上的 4 个符号</p>
              <div className="grid grid-cols-4 gap-2">
                {input.map((value, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      const next = [...input];
                      next[i] = EMOJIS[i];
                      setInput(next);
                    }}
                    className={`h-14 rounded-2xl text-2xl ring-1 transition ${value ? "bg-emerald-50 ring-emerald-200" : "bg-zinc-50 ring-zinc-200"}`}
                  >
                    {value || "?"}
                  </button>
                ))}
              </div>
              <Button onClick={() => setInput(["", "", "", ""])} variant="ghost" className="mt-2 w-full rounded-2xl">清空选择</Button>
            </div>

            <Button disabled={!matched || approved} onClick={() => setApproved(true)} className="h-12 w-full rounded-2xl text-base">
              {approved ? "✅ 已验证成功" : "👤 确认这是我的电脑，允许登录"}
            </Button>

            {approved && (
              <div className="rounded-2xl bg-emerald-50 p-4 text-sm leading-6 text-emerald-900 ring-1 ring-emerald-100">
                手机已完成验证。真实项目中，这一步会把通行密钥验证结果提交到服务器，再由服务器通知电脑端。
              </div>
            )}
          </div>
        </section>
      </div>
    </DemoFrame>
  );
}

function bytesToBase64URL(bytes) {
  const binary = Array.from(new Uint8Array(bytes), (b) => String.fromCharCode(b)).join("");
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function randomBytes(length = 32) {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return bytes;
}

function displayCredential(credential, type) {
  const result = {
    id: credential.id,
    type: credential.type,
    rawId: credential.rawId ? bytesToBase64URL(credential.rawId) : undefined,
    authenticatorAttachment: credential.authenticatorAttachment,
    response: {},
  };

  const keys = type === "register"
    ? ["clientDataJSON", "attestationObject"]
    : ["clientDataJSON", "authenticatorData", "signature", "userHandle"];

  for (const key of keys) {
    if (credential.response?.[key]) result.response[key] = bytesToBase64URL(credential.response[key]);
  }

  return result;
}

function WebAuthnDemo({ mode }) {
  const isRegister = mode === "register";
  const [status, setStatus] = useState(isRegister ? "等待注册" : "等待登录");
  const [output, setOutput] = useState("");
  const rpId = typeof window === "undefined" ? "" : window.location.hostname;

  async function run() {
    setOutput("");
    setStatus(isRegister ? "正在调用浏览器通行密钥注册能力……" : "正在调用浏览器通行密钥登录能力……");

    try {
      if (!window.isSecureContext) throw new Error("通行密钥需要安全上下文，例如 HTTPS 或本机环境。");
      if (!window.PublicKeyCredential) throw new Error("当前浏览器不支持通行密钥。");

      if (isRegister) {
        const credential = await navigator.credentials.create({
          publicKey: {
            challenge: randomBytes(32),
            rp: {
              name: "QAuth 演示",
              id: rpId,
            },
            user: {
              id: randomBytes(16),
              name: "demo-user@example.com",
              displayName: "演示用户",
            },
            pubKeyCredParams: [
              { type: "public-key", alg: -7 },
              { type: "public-key", alg: -257 },
            ],
            authenticatorSelection: {
              authenticatorAttachment: "platform",
              residentKey: "required",
              requireResidentKey: true,
              userVerification: "required",
            },
            attestation: "none",
            timeout: 60000,
          },
        });
        setStatus("注册调用完成。真实项目要把这个结果发给后端验证并保存公钥。");
        setOutput(JSON.stringify(displayCredential(credential, "register"), null, 2));
      } else {
        const assertion = await navigator.credentials.get({
          publicKey: {
            challenge: randomBytes(32),
            rpId,
            userVerification: "required",
            timeout: 60000,
          },
        });
        setStatus("登录调用完成。真实项目要把返回数据发给后端验签。");
        setOutput(JSON.stringify(displayCredential(assertion, "login"), null, 2));
      }
    } catch (err) {
      setStatus(isRegister ? "注册失败或被取消" : "登录失败或被取消");
      setOutput(JSON.stringify({ name: err.name, message: err.message }, null, 2));
    }
  }

  return (
    <DemoFrame
      tag={isRegister ? "注册" : "登录"}
      title={isRegister ? "注册通行密钥" : "使用通行密钥登录"}
      subtitle={isRegister ? "调用浏览器接口，演示创建通行密钥。" : "调用浏览器接口，演示获取登录断言。"}
    >
      <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
        <Card>
          <div className="p-5 sm:p-8">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-950 text-3xl text-white">{isRegister ? "🔑" : "👤"}</div>
            <p className="mb-2 text-xs font-medium tracking-[0.2em] text-zinc-500">{isRegister ? "注册" : "登录"}</p>
            <h2 className="text-3xl font-semibold tracking-tight">{isRegister ? "注册通行密钥" : "通行密钥登录"}</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-600">
              {isRegister ? "这个页面只演示前端调用。真实项目必须由后端生成挑战，并验证返回结果。" : "这里用可发现凭据演示，不指定凭据列表。真实项目中挑战必须来自后端。"}
            </p>

            <div className="mt-5 rounded-2xl bg-zinc-50 p-4 text-sm leading-6 text-zinc-600 ring-1 ring-zinc-200">
              <div className="mb-1 font-semibold text-zinc-950">⚠️ 运行限制</div>
              当前演示会自动使用当前页面 origin 的 hostname（{rpId || "不可用"}）作为 WebAuthn 域名。请在目标域名下通过 HTTPS 访问。
            </div>

            <Button onClick={run} className="mt-5 h-12 w-full rounded-2xl text-base">
              {isRegister ? "🛡️ 创建通行密钥" : "🛡️ 使用通行密钥登录"}
            </Button>
          </div>
        </Card>

        <Card>
          <div className="p-5 sm:p-8">
            <h2 className="text-lg font-semibold">前端返回数据</h2>
            <div className="mt-3 rounded-2xl bg-zinc-50 p-4 text-sm text-zinc-700 ring-1 ring-zinc-200">{status}</div>
            <pre className="mt-4 max-h-[560px] overflow-auto rounded-2xl bg-zinc-950 p-4 text-xs leading-6 text-zinc-100">
              {output || (isRegister ? "// 点击创建后，这里会显示通行密钥注册返回数据。" : "// 点击登录后，这里会显示通行密钥登录返回数据。")}
            </pre>
          </div>
        </Card>
      </div>
    </DemoFrame>
  );
}

async function sha256Hex(text) {
  const data = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash), (b) => b.toString(16).padStart(2, "0")).join("");
}

function ProofChallengeDemo() {
  const [difficulty, setDifficulty] = useState(3);
  const [status, setStatus] = useState("等待开始");
  const [running, setRunning] = useState(false);
  const [nonce, setNonce] = useState(0);
  const [hash, setHash] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [verified, setVerified] = useState(false);
  const stopRef = useRef(false);
  const challenge = useMemo(() => "qauth:qr_new:sid_demo_9f7a2c:1746000000", []);
  const target = "0".repeat(difficulty);

  async function start() {
    if (!crypto?.subtle) {
      setStatus("当前环境不支持浏览器哈希计算接口。");
      return;
    }

    stopRef.current = false;
    setRunning(true);
    setVerified(false);
    setNonce(0);
    setHash("");
    setElapsed(0);
    setStatus("正在计算，请稍候……");
    const startTime = performance.now();

    let i = 0;
    while (!stopRef.current) {
      const h = await sha256Hex(`${challenge}:${i}`);
      if (i % 10 === 0) {
        setNonce(i);
        setHash(h);
        setElapsed(Math.round(performance.now() - startTime));
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
      if (h.startsWith(target)) {
        setNonce(i);
        setHash(h);
        setElapsed(Math.round(performance.now() - startTime));
        setVerified(true);
        setRunning(false);
        setStatus("计算挑战通过。真实项目中，浏览器会把 nonce 发给服务器验证。");
        return;
      }
      i += 1;
    }

    setRunning(false);
    setStatus("已停止计算。");
  }

  function stop() {
    stopRef.current = true;
  }

  return (
    <DemoFrame tag="计算挑战" title="工作量证明式验证码" subtitle="浏览器寻找一个 nonce，让挑战文本加 nonce 后的哈希满足前导 0 条件。服务器只需要算一次哈希就能验证。">
      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <div className="p-5 sm:p-8">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-950 text-3xl text-white">🧮</div>
            <h2 className="text-3xl font-semibold tracking-tight">轻量计算验证</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-600">
              这不是身份验证方式，而是抗滥用保护层。它适合放在创建二维码会话、提交领取码、备用登录验证之前。
            </p>

            <div className="mt-5 rounded-2xl bg-zinc-50 p-4 ring-1 ring-zinc-200">
              <label className="text-sm font-medium text-zinc-700">难度：前导 0 数量</label>
              <div className="mt-3 flex items-center gap-3">
                <input
                  type="range"
                  min="2"
                  max="5"
                  value={difficulty}
                  disabled={running}
                  onChange={(e) => setDifficulty(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex h-10 w-12 items-center justify-center rounded-xl bg-white font-mono text-sm ring-1 ring-zinc-200">{difficulty}</div>
              </div>
              <p className="mt-2 text-xs leading-5 text-zinc-500">演示里建议用 2 到 4。难度越高，等待越久。</p>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <Button disabled={running} onClick={start} className="h-12 rounded-2xl text-base">开始计算</Button>
              <Button disabled={!running} onClick={stop} variant="outline" className="h-12 rounded-2xl text-base">停止</Button>
            </div>

            {verified && (
              <div className="mt-5 rounded-2xl bg-emerald-50 p-4 text-sm leading-6 text-emerald-900 ring-1 ring-emerald-100">
                ✅ 已找到有效答案。这个结果可以作为创建二维码登录会话前的抗刷证明。
              </div>
            )}
          </div>
        </Card>

        <Card>
          <div className="p-5 sm:p-8">
            <h2 className="text-lg font-semibold">挑战状态</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Info icon="🎯" label="目标" value={`哈希以 ${target} 开头`} />
              <Info icon="⏱️" label="耗时" value={`${elapsed} 毫秒`} />
              <Info icon="🔢" label="当前 nonce" value={String(nonce)} />
              <Info icon="✅" label="状态" value={verified ? "已通过" : running ? "计算中" : "未通过"} />
            </div>

            <div className="mt-5 rounded-2xl bg-zinc-50 p-4 ring-1 ring-zinc-200">
              <p className="mb-2 text-sm font-medium text-zinc-700">挑战文本</p>
              <div className="break-all rounded-xl bg-white p-3 font-mono text-xs leading-6 text-zinc-700 ring-1 ring-zinc-200">{challenge}</div>
            </div>

            <div className="mt-5 rounded-2xl bg-zinc-950 p-4 text-zinc-100">
              <p className="mb-2 text-sm font-medium text-zinc-300">当前哈希</p>
              <div className="min-h-[72px] break-all font-mono text-xs leading-6">{hash || "等待计算结果……"}</div>
            </div>

            <div className="mt-4 rounded-2xl bg-amber-50 p-4 text-sm leading-6 text-amber-900 ring-1 ring-amber-200">
              真实项目中还要检查：挑战未过期、未使用、绑定具体操作、绑定风险策略，并在通过后立即标记为已使用。
            </div>
          </div>
        </Card>
      </div>
    </DemoFrame>
  );
}

function ClassicDesktopDemo() {
  const [value, setValue] = useState("");
  const [done, setDone] = useState(false);
  const valid = value.trim().toUpperCase() === CLAIM;

  return (
    <DemoFrame tag="电脑领取码" title="电脑端领取码登录" subtitle="用于没有实时通道的老浏览器：手机完成验证后显示一次性领取码，电脑手动输入。">
      <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
        <Card>
          <div className="p-5 sm:p-8">
            <div className="rounded-[2rem] bg-zinc-50 p-5 ring-1 ring-zinc-200">
              <DemoQRCode size="small" />
              <div className="mt-5 rounded-2xl bg-white p-4 text-center shadow-sm ring-1 ring-zinc-200">
                <p className="mb-3 text-sm font-medium text-zinc-600">电脑屏幕验证符号</p>
                <EmojiStrip />
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-5 sm:p-8">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-2xl ring-1 ring-emerald-100">🛡️</div>
            <h2 className="text-2xl font-semibold tracking-tight">输入手机上的一次性登录码</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-600">演示码：<span className="font-mono font-semibold">{CLAIM}</span>。真实项目中应短期有效、一次性、只存哈希。</p>

            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="K7Q9-M4VX-2PDA"
              className="mt-6 h-12 w-full rounded-2xl border border-zinc-200 bg-white px-4 font-mono text-sm outline-none ring-zinc-300 focus:ring-4"
            />

            <Button disabled={!valid || done} onClick={() => setDone(true)} className="mt-4 h-12 w-full rounded-2xl text-base">
              {done ? "✅ 登录成功" : "→ 提交登录码"}
            </Button>

            {done && (
              <div className="mt-4 rounded-2xl bg-emerald-50 p-4 text-sm leading-6 text-emerald-900 ring-1 ring-emerald-100">
                演示：电脑已拿到登录结果。真实项目中，服务器会在当前电脑响应里设置安全会话。
              </div>
            )}
          </div>
        </Card>
      </div>
    </DemoFrame>
  );
}

function ClassicMobileDemo() {
  const [step, setStep] = useState(0);

  return (
    <DemoFrame tag="手机领取码" title="手机端返回领取码" subtitle="手机验证成功后显示一次性登录码，用于没有实时通道的电脑浏览器。">
      <div className="mx-auto max-w-md">
        <section className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-sm">
          <div className="bg-zinc-950 p-5 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs tracking-[0.2em] text-zinc-400">手机备用登录</p>
                <h2 className="mt-1 text-2xl font-semibold">返回一次性登录码</h2>
              </div>
              <span className="text-3xl text-zinc-300">🛡️</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-zinc-300">手机验证成功后，把登录码手动输入电脑。</p>
          </div>

          <div className="space-y-4 p-5">
            <Info icon="💻" label="请求设备" value="Chrome on Windows 11" />
            <Info icon="📍" label="登录地点" value="广东 · 中国" />
            <Info icon="🌐" label="登录地址" value="223.104.68.xxx" />

            {step === 0 && (
              <>
                <div className="rounded-2xl bg-zinc-50 p-4 ring-1 ring-zinc-200">
                  <p className="mb-3 text-sm font-medium text-zinc-700">请核对电脑屏幕上的符号</p>
                  <EmojiStrip />
                </div>
                <Button onClick={() => setStep(1)} className="h-12 w-full rounded-2xl text-base">👤 模拟设备验证</Button>
              </>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <div className="rounded-[1.5rem] bg-emerald-50 p-4 text-sm leading-6 text-emerald-900 ring-1 ring-emerald-100">
                  <div className="mb-1 flex items-center gap-2 font-semibold"><span>✅</span> 手机验证成功</div>
                  请把下面的一次性登录码输入电脑页面。真实项目中它应该 60 秒过期并且只能使用一次。
                </div>

                <div className="rounded-[1.5rem] bg-zinc-950 p-5 text-center text-white shadow-sm">
                  <p className="text-xs tracking-[0.2em] text-zinc-400">一次性登录码</p>
                  <p className="mt-3 select-all font-mono text-2xl font-semibold tracking-wider">{CLAIM}</p>
                </div>

                <Button variant="outline" className="h-12 w-full rounded-2xl">📋 复制登录码</Button>
              </div>
            )}
          </div>
        </section>
      </div>
    </DemoFrame>
  );
}

export default function QAuthIntroWebsite() {
  const [modalPage, setModalPage] = useState(null);
  const [closing, setClosing] = useState(false);
  const closeTimer = useRef(null);

  function openDemo(page) {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setClosing(false);
    setModalPage(page);
  }

  function closeDemo() {
    if (!modalPage || closing) return;
    setClosing(true);
    closeTimer.current = setTimeout(() => {
      setModalPage(null);
      setClosing(false);
    }, 230);
  }

  return (
    <>
      <GlobalStyles />
      <HomePage openDemo={openDemo} />
      <DemoModal page={modalPage} closing={closing} setPage={setModalPage} closeDemo={closeDemo} />
    </>
  );
}