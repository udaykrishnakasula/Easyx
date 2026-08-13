import React, { useMemo } from "react";

/**
 * Pure CSS 3D coin: front + back engraved faces with a stacked-disc rim
 * that gives real depth while spinning. GPU-only transforms (rotate/translate).
 */
export default function Coin({ variant = "lead", discs = 22, testId }) {
  const layers = useMemo(() => {
    return Array.from({ length: discs }, (_, i) => {
      const frac = discs === 1 ? 0 : -1 + (2 * i) / (discs - 1);
      return frac.toFixed(3);
    });
  }, [discs]);

  return (
    <div className={`coin-wrap coin-wrap--${variant}`} data-testid={testId} aria-hidden="true">
      <div className="coin-perspective">
        <div className="coin-tilt">
          <div className="coin-float">
            <div className="coin">
              {layers.map((frac, i) => (
                <div
                  key={i}
                  className="coin__disc"
                  style={{ transform: `translateZ(calc(var(--t) * ${frac}))` }}
                />
              ))}
              <div
                className="coin__face coin__face--front"
                style={{ transform: "translateZ(var(--t))", backgroundImage: `url(${process.env.PUBLIC_URL}/assets/coin.png)` }}
              />
              <div
                className="coin__face coin__face--back"
                style={{ transform: "translateZ(calc(var(--t) * -1)) rotateY(180deg)", backgroundImage: `url(${process.env.PUBLIC_URL}/assets/coin.png)` }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="coin-shadow" />
    </div>
  );
}
