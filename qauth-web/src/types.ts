import type { Component } from "vue";

export type Lang = "zh" | "en";
export type RoutePath = "/" | "/demo" | "/docs" | "/security" | "/roadmap";
export type DemoId = "desktopQr" | "mobileConfirm" | "pow" | "register" | "passkeyLogin" | "classicDesktop" | "classicMobile" | "sseFlow";
export type HomeSection = "capabilities" | "flow" | "demos";

export type Demo = {
  id: DemoId;
  icon: string;
  title: string;
  desc: string;
  accent: string;
  steps: string[];
};

export type Capability = {
  icon: Component;
  title: string;
  desc: string;
};

export type RoadmapColumn = {
  title: string;
  items: string[];
};

export type NavTarget = {
  label: string;
  to: RoutePath;
  hash?: `#${HomeSection}`;
};
