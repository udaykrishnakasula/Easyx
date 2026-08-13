# Halo — Landing Page (Hero from reference video)

## Problem statement
Recreate a premium cinematic hero section exactly from an uploaded screen recording
(Halo — "Your Wealth Works"): hero at absolute top, full viewport, navbar overlay,
floating/rotating 3D silver coins, lavender cinematic background, same composition on
desktop & mobile, no horizontal overflow, mobile-viewport-stable (svh/dvh).

## Architecture
- Frontend: React 19 (CRA/craco), framer-motion, Tailwind + custom CSS. No new libs added.
- 3D coins: pure CSS 3D transforms (front/back engraved faces + stacked-disc rim), GPU-only
  transform/opacity animations (spin + float + shadow). No WebGL.
- Assets in /app/frontend/public/assets/ (coin.png, flowers.png, hero_bg.jpg) generated + processed.
- Backend: unchanged default FastAPI scaffold.

## Implemented (2026-06)
- Full-screen hero (min-height:100svh, fallback 100vh) starting at 0px; navbar overlay.
- Heading "Your Wealth Works", subtext, "Join us" CTA (left-anchored); "Open Wallet" nav btn.
- Two 3D coins (lead + sub) with continuous rotation, float, soft shadow, engraved silver faces.
- Lavender atmospheric bg + blurred flowers + partner strip (Aave/Compound/MakerDAO/Chainlink/Curve).
- Same composition scaled via clamp()/vw across desktop & mobile.
- Below-fold: features (dark), stats (light), CTA band, footer.
- Fonts: Bricolage Grotesque (display) + Manrope (body).
- Verified: 1920, 1440, 1280, 1024, 768, 390, 393, 360 + landspace — no horizontal overflow,
  hero starts at top, no layout jump, consistent composition.

## Notes
- Buttons are visual-only placeholders (per user choice).
- prefers-reduced-motion disables coin animation.

## Backlog / Next
- P1: Wire "Open Wallet"/"Join us" to real routes/actions.
- P2: Add nav links + mobile menu; "How it works" section; scroll-linked coin parallax.

## Update (2026-06) — Coin animation fixes (UI/UX otherwise unchanged)
- Rotation sped up: lead 18s→3.2s, sub 22s→3.8s (still linear/continuous, no stutter/reset).
- Fixed paper-thin/disappearing flip: increased rim thickness (--t) + disc count (lead 46, sub 34),
  discs now double-sided (backface-visibility:visible) so the reeded metallic edge stays visible
  through 90deg. Verified frozen at rotateY(88deg) — solid edge, never vanishes.
- Added moving metallic sheen (coinSheen sweep synced to spin) + static specular hotspot; engraving
  and edge catch light. Subtle, screen-blended, no flashing.
- Unchanged: coin positions/sizes (--d), layout, typography, background, sections, responsiveness.
