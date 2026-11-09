/**
 * AuraBackground — "Violet Horizon" Atmospheric Gradient.
 * Category: aura, Theme: dark.
 *
 * Architecture:
 * - Base color #100e0b is set on <body> in index.css.
 * - This container is completely transparent so mix-blend-mode layers
 *   composite directly against the body background.
 * - Layer 1: hard-light linear gradient with 100px (mobile) / 144px (desktop) blur
 * - Layer 2: soft-light linear gradient with 200px (mobile) / 260px (desktop) blur
 * - Layer 3: normal linear gradient (atmospheric depth vignette)
 */
export default function AuraBackground({ fixed = true }) {
  return (
    <div
      className={fixed ? 'aura-fixed' : 'aura-bg'}
      aria-hidden="true"
    >
      <div className="aura-layer-1" />
      <div className="aura-layer-2" />
      <div className="aura-layer-3" />
    </div>
  );
}

