import React, { useId } from 'react';

function HomeLogoMark({ variant = 'nav' }) {
  const rawId = useId();
  const uid = rawId.replace(/[^a-zA-Z0-9]/g, '');
  const faceId = `mec-logo-face-${uid}`;
  const sheenId = `mec-logo-sheen-${uid}`;
  const markClass =
    variant === 'footer' ? 'home-landing__brand-mark home-landing__brand-mark--footer' : 'home-landing__brand-mark';

  return (
    <span className={markClass} aria-hidden="true">
      <svg className="home-landing__brand-svg" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" focusable="false">
        <defs>
          <linearGradient id={faceId} x1="6" y1="8" x2="42" y2="42" gradientUnits="userSpaceOnUse">
            <stop stopColor="#5eead4" />
            <stop offset="0.45" stopColor="#14b8a6" />
            <stop offset="1" stopColor="#0ea5e9" />
          </linearGradient>
          <linearGradient id={sheenId} x1="12" y1="4" x2="36" y2="28" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ffffff" stopOpacity="0.35" />
            <stop offset="0.55" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="44" height="44" rx="13" fill={`url(#${faceId})`} />
        <rect x="2" y="2" width="44" height="44" rx="13" fill={`url(#${sheenId})`} />
        <g transform="translate(24 23.5) scale(1.36) translate(-12 -11.85)">
          <path
            fill="#f8fafc"
            fillOpacity="0.98"
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          />
        </g>
      </svg>
    </span>
  );
}

export default HomeLogoMark;
