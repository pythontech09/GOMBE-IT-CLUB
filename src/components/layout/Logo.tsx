import React from "react";

interface LogoProps {
  className?: string;
}

export function Logo({ className = "w-8 h-8" }: LogoProps) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer Glow */}
      <circle cx="100" cy="100" r="98" fill="rgba(14, 165, 233, 0.03)" />
      
      {/* Outer Ring Border */}
      <circle cx="100" cy="100" r="95" fill="#080d1a" stroke="#475569" strokeWidth="2.5" />
      <circle cx="100" cy="100" r="74" stroke="#475569" strokeWidth="1.5" />

      {/* Decorative Outer Circle Nodes/Dots */}
      <circle cx="25" cy="100" r="2.5" fill="#94a3b8" />
      <circle cx="175" cy="100" r="2.5" fill="#94a3b8" />

      {/* Text Paths */}
      <defs>
        {/* Top Text Path (arc from left to right) */}
        <path
          id="textPathTop"
          d="M 22 100 A 78 78 0 0 1 178 100"
          fill="none"
        />
        {/* Bottom Text Path (arc from right to left, to keep text readable bottom-up) */}
        <path
          id="textPathBottom"
          d="M 178 100 A 78 78 0 0 1 22 100"
          fill="none"
        />
        {/* Arrow Gradient */}
        <linearGradient id="arrowGrad" x1="40" y1="160" x2="160" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="50%" stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#38bdf8" />
        </linearGradient>
        {/* Circuit Glow */}
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Top Text: GOMBE ICT CLUB */}
      <text fill="#ffffff" fontSize="13.5" fontWeight="900" fontFamily="monospace" letterSpacing="2.5" textAnchor="middle">
        <textPath href="#textPathTop" startOffset="50%">
          GOMBE ICT CLUB
        </textPath>
      </text>

      {/* Bottom Text: TRANSVERSING THE ICT GLOBE */}
      <text fill="#94a3b8" fontSize="8" fontWeight="bold" fontFamily="monospace" letterSpacing="1.2" textAnchor="middle">
        <textPath href="#textPathBottom" startOffset="50%">
          TRANSVERSING THE ICT GLOBE
        </textPath>
      </text>

      {/* Inner Globe / Cyber Grids (Left blue, Right orange) */}
      <g opacity="0.15">
        {/* Grid lines */}
        <line x1="100" y1="26" x2="100" y2="174" stroke="#475569" strokeWidth="1" />
        <line x1="26" y1="100" x2="174" y2="100" stroke="#475569" strokeWidth="1" />
        <circle cx="100" cy="100" r="62" stroke="#475569" strokeWidth="1" strokeDasharray="2,2" />
        <circle cx="100" cy="100" r="48" stroke="#475569" strokeWidth="1" strokeDasharray="3,3" />
      </g>

      {/* Left-side Cyber Network Nodes (Blue) */}
      <g stroke="#0ea5e9" strokeWidth="1.5" opacity="0.85">
        <path d="M 45 80 C 40 95, 45 120, 60 140" fill="none" />
        <path d="M 55 65 C 65 75, 60 100, 75 120" fill="none" strokeDasharray="2,2" />
        <line x1="45" y1="80" x2="55" y2="65" />
        <line x1="45" y1="110" x2="65" y2="110" />
        <line x1="50" y1="130" x2="70" y2="125" />
      </g>
      {/* Blue Circuit Dots */}
      <g fill="#0ea5e9" filter="url(#glow)">
        <circle cx="45" cy="80" r="3.5" />
        <circle cx="55" cy="65" r="2.5" />
        <circle cx="45" cy="110" r="3.5" />
        <circle cx="65" cy="110" r="2" />
        <circle cx="50" cy="130" r="3" />
        <circle cx="70" cy="125" r="2.5" />
        <circle cx="60" cy="140" r="3.5" />
      </g>

      {/* Right-side Cyber Network Nodes & Globe Latitudes (Orange) */}
      <g stroke="#f97316" strokeWidth="1.5" opacity="0.75">
        <path d="M 155 80 C 160 95, 155 120, 140 140" fill="none" />
        <path d="M 145 65 C 135 75, 140 100, 125 120" fill="none" strokeDasharray="1,2" />
        <line x1="155" y1="80" x2="145" y2="65" />
        <line x1="155" y1="110" x2="135" y2="110" />
        <line x1="150" y1="130" x2="130" y2="125" />
      </g>
      {/* Orange Circuit Dots */}
      <g fill="#f97316">
        <circle cx="155" cy="80" r="3" />
        <circle cx="145" cy="65" r="2" />
        <circle cx="155" cy="110" r="3" />
        <circle cx="135" cy="110" r="2.5" />
        <circle cx="150" cy="130" r="2.5" />
        <circle cx="130" cy="125" r="3" />
        <circle cx="140" cy="140" r="3" />
      </g>

      {/* Bottom Right Mechanical Gear (Orange) */}
      <g transform="translate(112, 112) rotate(15)" stroke="#ea580c" strokeWidth="1.5" fill="#f97316">
        {/* Center circle */}
        <circle cx="15" cy="15" r="14" fill="#080d1a" stroke="#ea580c" strokeWidth="2" />
        {/* Gear Teeth */}
        <path d="M 11 -2 L 19 -2 L 17 4 L 13 4 Z" />
        <path d="M 11 32 L 19 32 L 17 26 L 13 26 Z" />
        <path d="M -2 11 L -2 19 L 4 17 L 4 13 Z" />
        <path d="M 32 11 L 32 19 L 26 17 L 26 13 Z" />
        <path d="M 4 4 L 9 0 L 12 5 L 7 8 Z" />
        <path d="M 26 26 L 21 30 L 18 25 L 23 22 Z" />
        <path d="M 26 4 L 21 0 L 18 5 L 23 8 Z" />
        <path d="M 4 26 L 9 30 L 12 25 L 7 22 Z" />
      </g>

      {/* Traditional Gombe Thatched-Roof Hut Structure (The center icon) */}
      <g transform="translate(0, 5)">
        {/* Hut Pillar Walls / Circuitry lines */}
        <rect x="85" y="85" width="30" height="35" rx="3" fill="#0c1324" stroke="#475569" strokeWidth="2" />
        
        {/* Internal Circuit Lines inside the hut */}
        <line x1="93" y1="92" x2="93" y2="114" stroke="#0ea5e9" strokeWidth="1.5" />
        <line x1="100" y1="90" x2="100" y2="116" stroke="#f97316" strokeWidth="1.5" />
        <line x1="107" y1="92" x2="107" y2="114" stroke="#0ea5e9" strokeWidth="1.5" />
        
        <circle cx="93" cy="92" r="1.5" fill="#0ea5e9" />
        <circle cx="107" cy="114" r="1.5" fill="#0ea5e9" />
        <circle cx="100" cy="116" r="1.5" fill="#f97316" />

        {/* Traditional Roof (Triangle) */}
        <polygon
          points="100,50 78,85 122,85"
          fill="#0f172a"
          stroke="#f97316"
          strokeWidth="2.5"
        />
        
        {/* Roof Thatch details (horizontal & vertical patterns) */}
        <line x1="100" y1="50" x2="100" y2="85" stroke="#f97316" strokeWidth="1.2" />
        <line x1="100" y1="50" x2="89" y2="85" stroke="#f97316" strokeWidth="1" />
        <line x1="100" y1="50" x2="111" y2="85" stroke="#f97316" strokeWidth="1" />
        <line x1="84" y1="75" x2="116" y2="75" stroke="#f97316" strokeWidth="1" />
        <line x1="91" y1="65" x2="109" y2="65" stroke="#f97316" strokeWidth="1" />

        {/* Hut crown/tip details */}
        <line x1="100" y1="50" x2="100" y2="44" stroke="#f97316" strokeWidth="2" />
        <line x1="100" y1="44" x2="95" y2="40" stroke="#f97316" strokeWidth="1.5" />
        <line x1="100" y1="44" x2="105" y2="40" stroke="#f97316" strokeWidth="1.5" />
        <line x1="100" y1="44" x2="100" y2="38" stroke="#f97316" strokeWidth="1.5" />
      </g>

      {/* Big Dynamic Upward Arrow (Sleek tech pointer pointing up-right) */}
      <g filter="url(#glow)">
        {/* Bold white arrow shadow/border path */}
        <path
          d="M 68 152 L 138 82 M 138 82 L 120 80 M 138 82 L 136 100"
          stroke="#0c1122"
          strokeWidth="11"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.9"
        />
        {/* Shiny blue-to-cyan gradient arrow path */}
        <path
          d="M 68 152 L 138 82"
          stroke="url(#arrowGrad)"
          strokeWidth="6"
          strokeLinecap="round"
        />
        {/* Arrow head */}
        <path
          d="M 138 82 L 118 80 M 138 82 L 136 102"
          stroke="url(#arrowGrad)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      {/* Small Globe/Map Icon at the Bottom Center */}
      <g transform="translate(93, 168)" stroke="#f97316" strokeWidth="1" fill="none">
        <circle cx="7" cy="7" r="6" stroke="#0ea5e9" />
        <path d="M 7 1 A 6 6 0 0 0 7 13" stroke="#f97316" />
        <path d="M 7 1 A 3 6 0 0 0 7 13" />
        <path d="M 7 1 A 3 6 0 0 1 7 13" />
        <line x1="1" y1="7" x2="13" y2="7" />
        <line x1="3" y1="4" x2="11" y2="4" stroke="#0ea5e9" />
        <line x1="3" y1="10" x2="11" y2="10" stroke="#0ea5e9" />
      </g>
    </svg>
  );
}
