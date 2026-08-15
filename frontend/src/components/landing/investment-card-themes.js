// -----------------------------------------------------------------------------
// Material themes for the InvestmentCard.
// One physical card model, four materials. UI-only.
// -----------------------------------------------------------------------------



const DIAMOND = {
  faceBackground: [
    "linear-gradient(135deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 45%)",
    "linear-gradient(30deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 12%, rgba(255,255,255,0) 45%, rgba(255,255,255,0.14) 55%, rgba(255,255,255,0) 88%)",
    "linear-gradient(150deg, rgba(180,210,240,0.22) 0%, rgba(180,210,240,0) 20%, rgba(255,255,255,0) 55%, rgba(200,220,255,0.18) 80%)",
    "conic-gradient(from 200deg at 65% 40%, rgba(255,255,255,0.18), rgba(200,230,255,0) 25%, rgba(230,210,255,0.14) 50%, rgba(255,255,255,0) 75%, rgba(255,255,255,0.16) 100%)",
    "conic-gradient(from 20deg at 50% 50%, #ffffff 0deg, #dfeaf7 30deg, #e6dff7 60deg, #f7dfe9 95deg, #fef2dc 130deg, #e6f7ef 165deg, #dff0fa 200deg, #e9e0f7 235deg, #ffffff 270deg, #d8e6f4 305deg, #ffffff 360deg)",
    "linear-gradient(160deg, #e4f0ff 0%, #ffffff 36%, #d6e3fb 70%, #e7ddfb 100%)",
  ].join(","),
  faceShadow: [
    "inset 0 0 0 1px rgba(255,255,255,0.75)",
    "inset 0 1px 0 rgba(255,255,255,0.95)",
    "inset 0 -1px 0 rgba(90,120,160,0.4)",
    "inset 8px 8px 24px rgba(255,255,255,0.35)",
    "inset -10px -14px 30px rgba(80,110,150,0.25)",
  ].join(","),
  prismatic:
    "linear-gradient(115deg, rgba(255,90,120,0.22) 0%, rgba(255,180,90,0.20) 15%, rgba(255,240,120,0.20) 30%, rgba(120,230,160,0.20) 45%, rgba(90,180,255,0.30) 60%, rgba(140,120,255,0.30) 78%, rgba(220,120,255,0.22) 100%)",
  prismaticOpacity: 1,
  prismaticBlend: "screen",
  sparkleBackground: "white",
  sparkleShadow:
    "0 0 7px 1px rgba(255,255,255,0.95), 0 0 14px 3px rgba(150,210,255,0.7)",
  glow: "radial-gradient(60% 55% at 50% 55%, rgba(140,210,255,0.9) 0%, rgba(190,165,255,0.55) 42%, rgba(200,215,235,0) 78%)",
  highlightStops:
    "rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.08) 40%, rgba(255,255,255,0) 70%",
  chipBackground:
    "conic-gradient(from 20deg at 50% 50%, #ffffff 0deg, #dfeaf7 60deg, #e6dff7 120deg, #fef2dc 180deg, #dff0fa 240deg, #e9e0f7 300deg, #ffffff 360deg), linear-gradient(160deg,#eef4fb,#dbe6f3)",
  chipShadow:
    "inset 0 0 0 1px rgba(255,255,255,0.7), inset 0 0 0 2px rgba(90,120,160,0.25)",
  ringFrom: "#8fa3bd",
  ringTo: "#334155",
  ringTrack: "rgba(255,255,255,0.15)",
  gradGlyph: "linear-gradient(180deg,#64748b 0%,#0f172a 100%)",
  gradAmount: "linear-gradient(180deg,#1e293b 0%,#64748b 100%)",
  gradReturn: "linear-gradient(180deg,#334155 0%,#0f172a 100%)",
  gradTitle: "linear-gradient(180deg,#1e293b 0%,#64748b 100%)",
  brandInk: "#1e293b",
  label: "#64748b",
  sublabel: "#475569",
  value: "#0f172a",
  issued: "#334155",
  strong: "#0f172a",
  body: "#334155",
  muted: "#64748b",
  faint: "#94a3b8",
  hairline: "rgba(15,23,42,0.15)",
  hairlineSoft: "rgba(15,23,42,0.10)",
  pillBg: "rgba(255,255,255,0.40)",
  pillBorder: "rgba(15,23,42,0.20)",
  pillInk: "#0f172a",
  serialBg: "rgba(255,255,255,0.30)",
  serialBorder: "rgba(15,23,42,0.15)",
  serialInk: "#1e293b",
  timelineLine: "linear-gradient(90deg,#334155 0%,#7dd3fc 50%,#334155 100%)",
  timelineNode: "#1e293b",
  timelineNodeRing: "rgba(255,255,255,0.7)",
  timelineDot: "#0ea5e9",
  timelineDotShadow:
    "0 0 0 3px rgba(14,165,233,0.25), 0 0 8px rgba(14,165,233,0.6)",
  accent: "#059669",
  signatureInk: "rgba(30,41,59,0.85)",
  signatureRule: "rgba(15,23,42,0.25)",
  sealRing:
    "conic-gradient(from 0deg,#ffffff,#dfeaf7,#e6dff7,#f7dfe9,#fef2dc,#e6f7ef,#dff0fa,#ffffff)",
  sealFace:
    "radial-gradient(circle at 35% 30%, #ffffff 0%, #dbe6f3 70%, #b8c7dc 100%)",
  sealShadow:
    "inset 0 0 0 1px rgba(255,255,255,0.7), inset 0 -2px 4px rgba(90,120,160,0.35)",
  sealInk: "#1e293b",
  shineFront:
    "linear-gradient(115deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.35) 45%, rgba(255,255,255,0.55) 50%, rgba(255,255,255,0.35) 55%, rgba(255,255,255,0) 100%)",
  shineBack:
    "linear-gradient(115deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.22) 45%, rgba(255,255,255,0.35) 50%, rgba(255,255,255,0.22) 55%, rgba(255,255,255,0) 100%)",
  bodyShadow:
    "0 30px 60px -20px rgba(6,20,40,0.7), 0 10px 25px -10px rgba(6,20,40,0.5)",
};

const SILVER = {
  faceBackground: [
    "linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 42%)",
    "linear-gradient(28deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 14%, rgba(255,255,255,0) 46%, rgba(255,255,255,0.18) 56%, rgba(255,255,255,0) 90%)",
    "linear-gradient(150deg, rgba(188,193,201,0.28) 0%, rgba(188,193,201,0) 22%, rgba(255,255,255,0) 58%, rgba(196,201,209,0.24) 82%)",
    "conic-gradient(from 210deg at 62% 38%, rgba(255,255,255,0.22), rgba(190,208,226,0) 26%, rgba(210,224,238,0.18) 52%, rgba(255,255,255,0) 76%, rgba(255,255,255,0.2) 100%)",
    "conic-gradient(from 15deg at 50% 50%, #ffffff 0deg, #e8eef4 40deg, #cfd9e3 75deg, #f2f6fa 110deg, #d7e1ea 150deg, #ffffff 190deg, #c9d5e1 230deg, #eef3f8 275deg, #d3dde7 315deg, #ffffff 360deg)",
    "linear-gradient(160deg, #f3f6fa 0%, #ffffff 38%, #ccd7e2 100%)",
  ].join(","),
  faceShadow: [
    "inset 0 0 0 1px rgba(255,255,255,0.8)",
    "inset 0 1px 0 rgba(255,255,255,0.95)",
    "inset 0 -1px 0 rgba(88,110,134,0.45)",
    "inset 8px 8px 24px rgba(255,255,255,0.4)",
    "inset -10px -14px 30px rgba(84,106,132,0.28)",
  ].join(","),
  prismatic:
    "linear-gradient(115deg, rgba(255,255,255,0.24) 0%, rgba(198,216,234,0.18) 22%, rgba(255,255,255,0.26) 44%, rgba(176,198,222,0.18) 66%, rgba(255,255,255,0.24) 88%, rgba(206,222,238,0.16) 100%)",
  prismaticOpacity: 0.45,
  prismaticBlend: "screen",
  sparkleBackground: "white",
  sparkleShadow:
    "0 0 6px 1px rgba(255,255,255,0.95), 0 0 12px 2px rgba(206,210,216,0.55)",
  glow: "radial-gradient(60% 55% at 50% 55%, rgba(214,218,224,0.62) 0%, rgba(180,185,192,0.28) 45%, rgba(200,205,212,0) 75%)",
  highlightStops:
    "rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.1) 40%, rgba(255,255,255,0) 70%",
  chipBackground:
    "conic-gradient(from 15deg at 50% 50%, #ffffff 0deg, #e8eef4 60deg, #cfd9e3 120deg, #f7fafc 180deg, #d3dde7 240deg, #eef3f8 300deg, #ffffff 360deg), linear-gradient(160deg,#f3f6fa,#ccd7e2)",
  chipShadow:
    "inset 0 0 0 1px rgba(255,255,255,0.75), inset 0 0 0 2px rgba(88,110,134,0.28)",
  ringFrom: "#9fb0c2",
  ringTo: "#334155",
  ringTrack: "rgba(255,255,255,0.2)",
  gradGlyph: "linear-gradient(180deg,#7b8a9c 0%,#1f2937 100%)",
  gradAmount: "linear-gradient(180deg,#1f2937 0%,#7b8a9c 100%)",
  gradReturn: "linear-gradient(180deg,#3b4859 0%,#111827 100%)",
  gradTitle: "linear-gradient(180deg,#1f2937 0%,#7b8a9c 100%)",
  brandInk: "#1f2937",
  label: "#64748b",
  sublabel: "#4b5563",
  value: "#111827",
  issued: "#374151",
  strong: "#111827",
  body: "#374151",
  muted: "#64748b",
  faint: "#94a3b8",
  hairline: "rgba(17,24,39,0.16)",
  hairlineSoft: "rgba(17,24,39,0.10)",
  pillBg: "rgba(255,255,255,0.45)",
  pillBorder: "rgba(17,24,39,0.20)",
  pillInk: "#111827",
  serialBg: "rgba(255,255,255,0.35)",
  serialBorder: "rgba(17,24,39,0.15)",
  serialInk: "#1f2937",
  timelineLine: "linear-gradient(90deg,#334155 0%,#a8c4dd 50%,#334155 100%)",
  timelineNode: "#1f2937",
  timelineNodeRing: "rgba(255,255,255,0.75)",
  timelineDot: "#5b8fb9",
  timelineDotShadow:
    "0 0 0 3px rgba(91,143,185,0.25), 0 0 8px rgba(91,143,185,0.55)",
  accent: "#0f766e",
  signatureInk: "rgba(31,41,55,0.85)",
  signatureRule: "rgba(17,24,39,0.25)",
  sealRing:
    "conic-gradient(from 0deg,#ffffff,#e8eef4,#cfd9e3,#ffffff,#d3dde7,#f2f6fa,#c9d5e1,#ffffff)",
  sealFace:
    "radial-gradient(circle at 35% 30%, #ffffff 0%, #d8e1ea 70%, #b0bdca 100%)",
  sealShadow:
    "inset 0 0 0 1px rgba(255,255,255,0.75), inset 0 -2px 4px rgba(88,110,134,0.38)",
  sealInk: "#1f2937",
  shineFront: DIAMOND.shineFront,
  shineBack: DIAMOND.shineBack,
  bodyShadow:
    "0 30px 60px -20px rgba(10,22,38,0.7), 0 10px 25px -10px rgba(10,22,38,0.5)",
};

const GOLD = {
  faceBackground: [
    "linear-gradient(135deg, rgba(255,252,240,0.55) 0%, rgba(255,255,255,0) 44%)",
    "linear-gradient(28deg, rgba(255,246,214,0.24) 0%, rgba(255,255,255,0) 14%, rgba(255,255,255,0) 46%, rgba(255,244,206,0.2) 56%, rgba(255,255,255,0) 90%)",
    "linear-gradient(150deg, rgba(168,124,54,0.24) 0%, rgba(168,124,54,0) 24%, rgba(255,255,255,0) 58%, rgba(150,108,44,0.24) 84%)",
    "conic-gradient(from 205deg at 64% 38%, rgba(255,255,255,0.24), rgba(224,178,88,0) 26%, rgba(238,206,142,0.2) 52%, rgba(255,255,255,0) 76%, rgba(255,246,214,0.22) 100%)",
    "conic-gradient(from 18deg at 50% 50%, #fff7e2 0deg, #f3dca4 38deg, #d9b463 72deg, #fdf1d0 108deg, #c9a052 148deg, #f7e6bb 188deg, #b98f45 228deg, #f6e3b4 272deg, #d8b268 312deg, #fff7e2 360deg)",
    "linear-gradient(160deg, #fdf3dc 0%, #f0dda8 38%, #bd9346 100%)",
  ].join(","),
  faceShadow: [
    "inset 0 0 0 1px rgba(255,246,214,0.75)",
    "inset 0 1px 0 rgba(255,252,235,0.9)",
    "inset 0 -1px 0 rgba(120,84,28,0.45)",
    "inset 8px 8px 24px rgba(255,246,214,0.35)",
    "inset -10px -14px 30px rgba(122,86,30,0.3)",
  ].join(","),
  prismatic:
    "linear-gradient(115deg, rgba(255,240,190,0.24) 0%, rgba(214,166,80,0.18) 22%, rgba(255,250,220,0.26) 44%, rgba(186,138,60,0.18) 66%, rgba(255,244,205,0.24) 88%, rgba(222,180,102,0.18) 100%)",
  prismaticOpacity: 0.9,
  prismaticBlend: "screen",
  sparkleBackground: "#fffbe9",
  sparkleShadow:
    "0 0 6px 1px rgba(255,246,214,0.95), 0 0 12px 2px rgba(226,182,96,0.6)",
  glow: "radial-gradient(60% 55% at 50% 55%, rgba(240,200,120,0.7) 0%, rgba(190,140,60,0.35) 45%, rgba(200,170,110,0) 75%)",
  highlightStops:
    "rgba(255,250,228,0.5) 0%, rgba(255,246,214,0.1) 40%, rgba(255,255,255,0) 70%",
  chipBackground:
    "conic-gradient(from 18deg at 50% 50%, #fff7e2 0deg, #f3dca4 60deg, #d9b463 120deg, #fdf1d0 180deg, #c9a052 240deg, #f6e3b4 300deg, #fff7e2 360deg), linear-gradient(160deg,#fdf3dc,#bd9346)",
  chipShadow:
    "inset 0 0 0 1px rgba(255,248,224,0.75), inset 0 0 0 2px rgba(120,84,28,0.28)",
  ringFrom: "#c9a052",
  ringTo: "#4a3312",
  ringTrack: "rgba(255,248,224,0.25)",
  gradGlyph: "linear-gradient(180deg,#a67c33 0%,#3f2c11 100%)",
  gradAmount: "linear-gradient(180deg,#3f2c11 0%,#a67c33 100%)",
  gradReturn: "linear-gradient(180deg,#5a3f18 0%,#2e2009 100%)",
  gradTitle: "linear-gradient(180deg,#3f2c11 0%,#a67c33 100%)",
  brandInk: "#3f2c11",
  label: "#7c5c26",
  sublabel: "#6b4c1e",
  value: "#33240c",
  issued: "#5a4118",
  strong: "#33240c",
  body: "#5a4118",
  muted: "#7c5c26",
  faint: "#96773f",
  hairline: "rgba(58,40,14,0.20)",
  hairlineSoft: "rgba(58,40,14,0.14)",
  pillBg: "rgba(255,250,232,0.45)",
  pillBorder: "rgba(58,40,14,0.25)",
  pillInk: "#33240c",
  serialBg: "rgba(255,250,232,0.35)",
  serialBorder: "rgba(58,40,14,0.2)",
  serialInk: "#3f2c11",
  timelineLine: "linear-gradient(90deg,#5a4118 0%,#f0d089 50%,#5a4118 100%)",
  timelineNode: "#3f2c11",
  timelineNodeRing: "rgba(255,250,232,0.8)",
  timelineDot: "#b8862f",
  timelineDotShadow:
    "0 0 0 3px rgba(184,134,47,0.25), 0 0 8px rgba(184,134,47,0.6)",
  accent: "#15803d",
  signatureInk: "rgba(63,44,17,0.9)",
  signatureRule: "rgba(58,40,14,0.3)",
  sealRing:
    "conic-gradient(from 0deg,#fff7e2,#f3dca4,#d9b463,#fdf1d0,#c9a052,#f7e6bb,#b98f45,#fff7e2)",
  sealFace:
    "radial-gradient(circle at 35% 30%, #fff8e6 0%, #e6c684 70%, #b8913f 100%)",
  sealShadow:
    "inset 0 0 0 1px rgba(255,248,224,0.75), inset 0 -2px 4px rgba(120,84,28,0.4)",
  sealInk: "#3f2c11",
  shineFront:
    "linear-gradient(115deg, rgba(255,250,225,0) 0%, rgba(255,250,225,0.35) 45%, rgba(255,255,240,0.6) 50%, rgba(255,250,225,0.35) 55%, rgba(255,250,225,0) 100%)",
  shineBack:
    "linear-gradient(115deg, rgba(255,250,225,0) 0%, rgba(255,250,225,0.22) 45%, rgba(255,255,240,0.38) 50%, rgba(255,250,225,0.22) 55%, rgba(255,250,225,0) 100%)",
  bodyShadow:
    "0 30px 60px -20px rgba(38,25,6,0.72), 0 10px 25px -10px rgba(38,25,6,0.5)",
};

const PLATINUM = {
  faceBackground: [
    "linear-gradient(135deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0) 42%)",
    "linear-gradient(28deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 14%, rgba(255,255,255,0) 46%, rgba(255,255,255,0.07) 56%, rgba(255,255,255,0) 90%)",
    "linear-gradient(150deg, rgba(190,210,230,0.10) 0%, rgba(190,210,230,0) 24%, rgba(255,255,255,0) 58%, rgba(170,190,212,0.10) 84%)",
    "conic-gradient(from 205deg at 64% 38%, rgba(255,255,255,0.10), rgba(200,220,240,0) 26%, rgba(210,225,240,0.07) 52%, rgba(255,255,255,0) 76%, rgba(255,255,255,0.09) 100%)",
    "conic-gradient(from 18deg at 50% 50%, #2b3138 0deg, #1a1e23 40deg, #343b43 78deg, #14171b 118deg, #2f363e 158deg, #191d22 200deg, #3a424b 240deg, #16191d 285deg, #262c33 320deg, #2b3138 360deg)",
    "linear-gradient(160deg, #23272d 0%, #0e1013 45%, #1c2026 100%)",
  ].join(","),
  faceShadow: [
    "inset 0 0 0 1px rgba(214,226,238,0.22)",
    "inset 0 1px 0 rgba(235,244,252,0.28)",
    "inset 0 -1px 0 rgba(0,0,0,0.6)",
    "inset 8px 8px 24px rgba(255,255,255,0.05)",
    "inset -10px -14px 30px rgba(0,0,0,0.55)",
  ].join(","),
  prismatic:
    "linear-gradient(115deg, rgba(255,255,255,0.10) 0%, rgba(170,196,222,0.08) 24%, rgba(255,255,255,0.12) 46%, rgba(150,178,206,0.08) 68%, rgba(255,255,255,0.10) 90%, rgba(180,200,222,0.07) 100%)",
  prismaticOpacity: 0.45,
  prismaticBlend: "screen",
  sparkleBackground: "#f2f7fc",
  sparkleShadow:
    "0 0 6px 1px rgba(235,244,252,0.85), 0 0 12px 2px rgba(170,200,230,0.5)",
  glow: "radial-gradient(60% 55% at 50% 55%, rgba(150,178,206,0.32) 0%, rgba(90,110,132,0.20) 45%, rgba(60,70,84,0) 75%)",
  highlightStops:
    "rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.05) 40%, rgba(255,255,255,0) 70%",
  chipBackground:
    "conic-gradient(from 18deg at 50% 50%, #e8eef4 0deg, #aab8c6 60deg, #6f7c8a 120deg, #dfe7ef 180deg, #8b98a6 240deg, #cbd5df 300deg, #e8eef4 360deg), linear-gradient(160deg,#c8d2dc,#7c8894)",
  chipShadow:
    "inset 0 0 0 1px rgba(255,255,255,0.5), inset 0 0 0 2px rgba(0,0,0,0.35)",
  ringFrom: "#e2e8f0",
  ringTo: "#8b98a6",
  ringTrack: "rgba(255,255,255,0.12)",
  gradGlyph: "linear-gradient(180deg,#ffffff 0%,#9aa8b6 100%)",
  gradAmount: "linear-gradient(180deg,#ffffff 0%,#98a6b4 100%)",
  gradReturn: "linear-gradient(180deg,#f1f5f9 0%,#a8b4c0 100%)",
  gradTitle: "linear-gradient(180deg,#ffffff 0%,#98a6b4 100%)",
  brandInk: "#e2e8f0",
  label: "#94a3b8",
  sublabel: "#b0bcc9",
  value: "#f8fafc",
  issued: "#cbd5e1",
  strong: "#f1f5f9",
  body: "#cbd5e1",
  muted: "#94a3b8",
  faint: "#7c8794",
  hairline: "rgba(226,232,240,0.22)",
  hairlineSoft: "rgba(226,232,240,0.14)",
  pillBg: "rgba(255,255,255,0.08)",
  pillBorder: "rgba(226,232,240,0.28)",
  pillInk: "#e2e8f0",
  serialBg: "rgba(255,255,255,0.06)",
  serialBorder: "rgba(226,232,240,0.22)",
  serialInk: "#e2e8f0",
  timelineLine: "linear-gradient(90deg,#64748b 0%,#e2e8f0 50%,#64748b 100%)",
  timelineNode: "#e2e8f0",
  timelineNodeRing: "rgba(15,18,22,0.85)",
  timelineDot: "#cbd5e1",
  timelineDotShadow:
    "0 0 0 3px rgba(203,213,225,0.18), 0 0 8px rgba(203,213,225,0.5)",
  accent: "#34d399",
  signatureInk: "rgba(241,245,249,0.9)",
  signatureRule: "rgba(226,232,240,0.35)",
  sealRing:
    "conic-gradient(from 0deg,#ffffff,#c7d2dd,#8b98a6,#eef3f8,#77848f,#dbe3ea,#9fadba,#ffffff)",
  sealFace:
    "radial-gradient(circle at 35% 30%, #4b545e 0%, #23282e 65%, #14171b 100%)",
  sealShadow:
    "inset 0 0 0 1px rgba(226,232,240,0.4), inset 0 -2px 4px rgba(0,0,0,0.6)",
  sealInk: "#e2e8f0",
  shineFront:
    "linear-gradient(115deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.18) 45%, rgba(255,255,255,0.32) 50%, rgba(255,255,255,0.18) 55%, rgba(255,255,255,0) 100%)",
  shineBack:
    "linear-gradient(115deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.12) 45%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.12) 55%, rgba(255,255,255,0) 100%)",
  bodyShadow:
    "0 30px 60px -20px rgba(0,0,0,0.85), 0 10px 25px -10px rgba(0,0,0,0.6)",
};

export const CARD_THEMES = {
  silver: SILVER,
  gold: GOLD,
  diamond: DIAMOND,
  platinum: PLATINUM,
};


export const CARD_DATA = {
  silver: {
    brand: "Silver",
    certificateBrand: "Silver Reserve",
    front: {
      plan: "Silver",
      investment: "$300",
      lockPeriod: "60 Days",
      returnPct: "160%",
      status: "Active",
      progress: 45,
    },
    back: {
      investorName: "John Carter",
      investmentId: "INV-2026-0002",
      startDate: "XX XX 2026",
      maturityDate: "XX XX 2026",
      expectedReturn: "$600",
      status: "Active",
    },
  },
  gold: {
    brand: "Gold",
    certificateBrand: "Gold Reserve",
    front: {
      plan: "Gold",
      investment: "$1,000",
      lockPeriod: "60 Days",
      returnPct: "160%",
      status: "Active",
      progress: 45,
    },
    back: {
      investorName: "John Carter",
      investmentId: "INV-2026-0003",
      startDate: "XX XX 2026",
      maturityDate: "XX XX 2026",
      expectedReturn: "$2,000",
      status: "Active",
    },
  },
  diamond: {
    brand: "Diamond",
    certificateBrand: "Diamond Reserve",
    front: {
      plan: "Diamond",
      investment: "$5,000",
      lockPeriod: "60 Days",
      returnPct: "200%",
      status: "Active",
      progress: 45,
    },
    back: {
      investorName: "John Carter",
      investmentId: "INV-2026-0001",
      startDate: "XX XX 2026",
      maturityDate: "XX XX 2026",
      expectedReturn: "$8,000",
      status: "Active",
    },
  },
  platinum: {
    brand: "Platinum",
    certificateBrand: "Platinum Reserve",
    front: {
      plan: "Platinum",
      investment: "$5,000",
      lockPeriod: "60 Days",
      returnPct: "200%",
      status: "Active",
      progress: 45,
    },
    back: {
      investorName: "John Carter",
      investmentId: "INV-2026-0004",
      startDate: "XX XX 2026",
      maturityDate: "XX XX 2026",
      expectedReturn: "$10,000",
      status: "Active",
    },
  },
};
