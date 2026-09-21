# 青甘大环线自驾路线图

2026 婚假自驾旅行的交互式网页路线图：9/21 从新乡获嘉县亢村镇出发，经洛阳、西安到西宁，走标准青甘大环线，回程走甘南线，10/5 到家，10/6-10/7 休息。

**在线访问：https://asen2011-debug.github.io/travel/**（GitHub Pages，push 到 main 自动部署）

## 功能

- 地图分段着色绘制：去程（蓝）、环线（橙）、回程（绿），路线贴合真实公路（OSRM 几何）
- 每晚住宿点标注日期标签（如 "9/25 大柴旦"），点击查看当日详情
- 4 种回程方案对比切换：A 甘南线（推荐）/ B 川北若尔盖线 / C 原路高速返回 / D 青藏线变体
- 侧边栏逐日行程单，点击与地图联动（飞行定位 + 高亮）
- 高德 / OSM 双底图切换，桌面与移动端自适应

## 本地运行

```bash
npm install
npm run dev        # http://localhost:4620
```

## 其他命令

```bash
npm run build          # 类型检查并构建到 dist/
npm run lint           # oxlint
npm run fetch:routes   # 重新从 OSRM 抓取公路几何到 src/data/routeGeometry.json
```

## 技术栈

Vite + React 19 + TypeScript + Tailwind CSS 4 + Leaflet。行程数据在 `src/data/itinerary.ts`，路线几何在 `src/data/routeGeometry.json`（由 `scripts/fetch-routes.mjs` 生成，已提交，无需每次重新抓取）。
