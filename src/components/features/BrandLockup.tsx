/**
 * Kiri brand lockup: bronze jeweler's loupe beside the tracked small-caps
 * wordmark. Matches "Variation 03 · All-Caps Small-Caps Trailed" in the
 * Figma loupe-lockups board. Sizing is set per context in components.css
 * (.brand / .wordmark rules); the SVG scales from a 36px master.
 */
export default function BrandLockup() {
  return (
    <>
      <svg
        className="brand-loupe"
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
      >
        <g filter="url(#kl-card-shadow)">
          <rect x="7.8" y="4.8" width="14.4" height="19.8" rx="1.5" fill="#322014" />
          <rect x="7.8" y="4.8" width="14.4" height="19.8" rx="1.5" fill="url(#kl-card-sheen)" />
          <rect x="7.95" y="4.95" width="14.1" height="19.5" rx="1.35" stroke="url(#kl-bronze-card)" strokeWidth="0.3" />
        </g>
        <rect x="9.3" y="6.3" width="11.4" height="7.8" rx="0.6" fill="black" fillOpacity="0.25" />
        <g filter="url(#kl-handle-shadow)">
          <rect x="22.95" y="23.85" width="3" height="7.8" rx="1.5" transform="rotate(-45 22.95 23.85)" fill="url(#kl-bronze-handle)" />
          <rect x="23.056" y="23.85" width="2.85" height="7.65" rx="1.425" transform="rotate(-45 23.056 23.85)" stroke="#59361F" strokeWidth="0.15" />
        </g>
        <g filter="url(#kl-barrel-shadow)">
          <circle cx="20.4" cy="18.6" r="6.6" fill="url(#kl-bronze-barrel)" />
          <circle cx="20.4" cy="18.6" r="6.45" stroke="#59361F" strokeWidth="0.3" />
        </g>
        <g filter="url(#kl-lens-inner)">
          <circle cx="20.4" cy="18.6" r="4.8" fill="white" fillOpacity="0.08" />
          <circle cx="20.4" cy="18.6" r="4.8" fill="url(#kl-lens-sheen)" />
        </g>
        <circle cx="20.4" cy="18.6" r="4.725" stroke="white" strokeOpacity="0.2" strokeWidth="0.15" />
        <circle cx="18.45" cy="16.05" r="1.05" fill="white" fillOpacity="0.4" />
        <circle cx="20.25" cy="14.85" r="0.45" fill="white" fillOpacity="0.45" />
        <defs>
          <filter id="kl-card-shadow" x="6" y="4.2" width="18" height="23.4" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
            <feOffset dy="1.2" />
            <feGaussianBlur stdDeviation="0.9" />
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0" />
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
            <feOffset dy="0.3" />
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
            <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
            <feBlend mode="normal" in2="shape" result="effect2_innerShadow" />
          </filter>
          <filter id="kl-handle-shadow" x="22.37" y="22.05" width="8.795" height="8.794" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
            <feOffset dy="0.9" />
            <feGaussianBlur stdDeviation="0.6" />
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.4 0" />
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
          </filter>
          <filter id="kl-barrel-shadow" x="10.8" y="10.8" width="19.2" height="19.2" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
            <feOffset dy="1.8" />
            <feGaussianBlur stdDeviation="1.5" />
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.45 0" />
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
            <feOffset dy="0.45" />
            <feGaussianBlur stdDeviation="0.15" />
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
            <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.3 0" />
            <feBlend mode="normal" in2="shape" result="effect2_innerShadow" />
          </filter>
          <filter id="kl-lens-inner" x="15.6" y="13.8" width="9.6" height="10.2" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
            <feOffset dy="0.6" />
            <feGaussianBlur stdDeviation="0.45" />
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.35 0" />
            <feBlend mode="normal" in2="shape" result="effect1_innerShadow" />
          </filter>
          <linearGradient id="kl-card-sheen" x1="7.8" y1="4.8" x2="22.2" y2="4.8" gradientUnits="userSpaceOnUse">
            <stop stopColor="white" stopOpacity="0.19" />
            <stop offset="1" stopOpacity="0.31" />
          </linearGradient>
          <linearGradient id="kl-bronze-card" x1="15" y1="4.8" x2="5.58" y2="11.65" gradientUnits="userSpaceOnUse">
            <stop stopColor="#C5A681" />
            <stop offset="1" stopColor="#7E4E2D" />
          </linearGradient>
          <linearGradient id="kl-bronze-handle" x1="24.45" y1="23.85" x2="21.84" y2="24.86" gradientUnits="userSpaceOnUse">
            <stop stopColor="#C5A681" />
            <stop offset="1" stopColor="#7E4E2D" />
          </linearGradient>
          <linearGradient id="kl-bronze-barrel" x1="20.4" y1="12" x2="13.8" y2="18.6" gradientUnits="userSpaceOnUse">
            <stop stopColor="#C5A681" />
            <stop offset="1" stopColor="#7E4E2D" />
          </linearGradient>
          <linearGradient id="kl-lens-sheen" x1="15.6" y1="13.8" x2="25.2" y2="13.8" gradientUnits="userSpaceOnUse">
            <stop stopColor="white" stopOpacity="0.28" />
            <stop offset="1" stopColor="white" stopOpacity="0.02" />
          </linearGradient>
        </defs>
      </svg>
      <span className="brand-word">Kiri</span>
    </>
  );
}
