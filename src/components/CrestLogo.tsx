/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface CrestLogoProps {
  className?: string;
  size?: number;
}

export default function CrestLogo({ className = 'text-teal-800', size = 48 }: CrestLogoProps) {
  return (
    <svg
      width={size}
      height={(size * 230) / 220}
      viewBox="0 0 220 230"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      id="college-official-crest-svg"
    >
      {/* Outer Circle Background */}
      <circle cx="110" cy="100" r="90" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />
      <circle cx="110" cy="100" r="86" fill="none" stroke="#ea580c" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />

      {/* Symmetric Wreaths (Paddy/Laurel branches) */}
      {/* Left Laurel Branch */}
      <g id="left-laurel-branch">
        <path d="M 32,95 C 18,55 55,25 105,23" fill="none" stroke="#1A202C" strokeWidth="2" strokeLinecap="round" />
        <path d="M 28,90 Q 20,85 24,78 Q 30,83 28,90 Z" fill="#1A202C" />
        <path d="M 34,88 Q 38,80 32,75 Q 28,82 34,88 Z" fill="#1A202C" />
        
        <path d="M 24,75 Q 16,68 22,61 Q 28,66 24,75 Z" fill="#1A202C" />
        <path d="M 30,73 Q 36,65 30,58 Q 24,65 30,73 Z" fill="#1A202C" />
        
        <path d="M 23,58 Q 17,48 25,43 Q 31,49 23,58 Z" fill="#1A202C" />
        <path d="M 29,56 Q 37,46 31,41 Q 25,49 29,56 Z" fill="#1A202C" />
        
        <path d="M 29,42 Q 25,32 35,29 Q 39,36 29,42 Z" fill="#1A202C" />
        <path d="M 37,42 Q 44,32 38,27 Q 32,35 37,42 Z" fill="#1A202C" />
        
        <path d="M 43,29 Q 42,18 52,19 Q 53,27 43,29 Z" fill="#1A202C" />
        <path d="M 49,30 Q 57,21 51,16 Q 45,23 49,30 Z" fill="#1A202C" />
        
        <path d="M 61,21 Q 62,10 71,13 Q 70,21 61,21 Z" fill="#1A202C" />
        <path d="M 66,24 Q 75,17 70,11 Q 63,16 66,24 Z" fill="#1A202C" />

        <path d="M 80,18 Q 83,8 91,12 Q 88,20 80,18 Z" fill="#1A202C" />
        <path d="M 83,22 Q 93,17 88,11 Q 81,15 83,22 Z" fill="#1A202C" />
      </g>

      {/* Right Laurel Branch (Mirrored) */}
      <g id="right-laurel-branch" transform="translate(220, 0) scale(-1, 1)">
        <path d="M 32,95 C 18,55 55,25 105,23" fill="none" stroke="#1A202C" strokeWidth="2" strokeLinecap="round" />
        <path d="M 28,90 Q 20,85 24,78 Q 30,83 28,90 Z" fill="#1A202C" />
        <path d="M 34,88 Q 38,80 32,75 Q 28,82 34,88 Z" fill="#1A202C" />
        
        <path d="M 24,75 Q 16,68 22,61 Q 28,66 24,75 Z" fill="#1A202C" />
        <path d="M 30,73 Q 36,65 30,58 Q 24,65 30,73 Z" fill="#1A202C" />
        
        <path d="M 23,58 Q 17,48 25,43 Q 31,49 23,58 Z" fill="#1A202C" />
        <path d="M 29,56 Q 37,46 31,41 Q 25,49 29,56 Z" fill="#1A202C" />
        
        <path d="M 29,42 Q 25,32 35,29 Q 39,36 29,42 Z" fill="#1A202C" />
        <path d="M 37,42 Q 44,32 38,27 Q 32,35 37,42 Z" fill="#1A202C" />
        
        <path d="M 43,29 Q 42,18 52,19 Q 53,27 43,29 Z" fill="#1A202C" />
        <path d="M 49,30 Q 57,21 51,16 Q 45,23 49,30 Z" fill="#1A202C" />
        
        <path d="M 61,21 Q 62,10 71,13 Q 70,21 61,21 Z" fill="#1A202C" />
        <path d="M 66,24 Q 75,17 70,11 Q 63,16 66,24 Z" fill="#1A202C" />

        <path d="M 80,18 Q 83,8 91,12 Q 88,20 80,18 Z" fill="#1A202C" />
        <path d="M 83,22 Q 93,17 88,11 Q 81,15 83,22 Z" fill="#1A202C" />
      </g>

      {/* Red-Orange Crescent Banner with curve */}
      <path
        d="M 24,105 C 32,143 65,175 110,175 C 155,175 188,143 196,105 C 180,135 150,158 110,158 C 70,158 40,135 24,105 Z"
        fill="#ea580c"
        stroke="#c2410c"
        strokeWidth="1"
      />

      <defs>
        {/* Curved text path running through middle of crescent */}
        <path id="crestMottoPath" d="M 36,122 A 76,76 0 0,0 184,122" fill="none" />
      </defs>

      <text fill="#ffffff" className="font-sans font-black tracking-normal" style={{ fontSize: '7.6px' }}>
        <textPath href="#crestMottoPath" startOffset="50%" textAnchor="middle">
          MAY THE DIVINE LIGHT ENLIGHTEN US
        </textPath>
      </text>

      {/* Central elements setup */}
      {/* 1. Tall Brass Lamp Stand (LHS) */}
      <g id="brass-lamp-stand">
        {/* Base */}
        <ellipse cx="68" cy="141" rx="10" ry="3.5" fill="#ca8a04" stroke="#854d0e" strokeWidth="0.8" />
        <path d="M 62,140 C 62,135 74,135 74,140 Z" fill="#eab308" stroke="#854d0e" strokeWidth="0.5" />
        {/* Baluster Column */}
        <line x1="68" y1="135" x2="68" y2="65" stroke="#ca8a04" strokeWidth="2.2" />
        <path d="M 66.5,135 L 69.5,135 L 68.8,115 L 67.2,115 Z" fill="#ca8a04" />
        {/* Decorative beads/rings */}
        <circle cx="68" cy="122" r="2.2" fill="#eab308" stroke="#854d0e" strokeWidth="0.4" />
        <circle cx="68" cy="105" r="2.2" fill="#eab308" stroke="#854d0e" strokeWidth="0.4" />
        <circle cx="68" cy="88" r="2.2" fill="#eab308" stroke="#854d0e" strokeWidth="0.4" />
        <circle cx="68" cy="74" r="2.2" fill="#eab308" stroke="#854d0e" strokeWidth="0.4" />
        {/* Top Cup holding the oil */}
        <path d="M 60,65 Q 68,68 76,65 L 73,59 Q 68,61 63,59 Z" fill="#ca8a04" stroke="#854d0e" strokeWidth="0.8" />
        {/* Flame of lamp */}
        <path d="M 68,59 Q 65,51 68,43 Q 71,51 68,59 Z" fill="#ea580c" className="animate-pulse" />
        <path d="M 68,57 Q 66.2,52 68,47 Q 69.8,52 68,57 Z" fill="#facc15" />
      </g>

      {/* 2. Wooden Column Table (Center) */}
      <g id="wooden-table">
        {/* Base shadow */}
        <ellipse cx="110" cy="144" rx="18" ry="4.5" fill="#fef08a" opacity="0.3" />
        {/* Table leg base */}
        <ellipse cx="110" cy="142" rx="18" ry="4" fill="#ca8a04" stroke="#854d0e" strokeWidth="1" />
        {/* Turned Column */}
        <path d="M 106,140 Q 110,136 114,140 L 113,98 L 107,98 Z" fill="#a16207" stroke="#854d0e" strokeWidth="0.8" />
        {/* Key collar rings */}
        <ellipse cx="110" cy="115" rx="6.5" ry="1.8" fill="#ca8a04" stroke="#854d0e" strokeWidth="0.4" />
        <ellipse cx="110" cy="126" rx="7.5" ry="2" fill="#ca8a04" stroke="#854d0e" strokeWidth="0.4" />
        {/* Table Top Disk */}
        <ellipse cx="110" cy="98" rx="25" ry="5.5" fill="#a16207" stroke="#854d0e" strokeWidth="1.2" />
        <ellipse cx="110" cy="95" rx="25" ry="5" fill="#ca8a04" stroke="#a16207" strokeWidth="0.6" />
      </g>

      {/* 3. Stack of 3 Scholarly Books (Center on Table) */}
      <g id="scholarly-books-stack">
        {/* Bottom Book 3 */}
        <path d="M 90,92 H 130 V 95 H 90 Z" fill="#1e293b" />
        <rect x="91" y="92.5" width="38" height="2" fill="#ffffff" />
        <line x1="90" y1="92" x2="90" y2="95" stroke="#0f172a" strokeWidth="1" />

        {/* Middle Book 2 */}
        <path d="M 88,86 H 128 V 89 H 88 Z" fill="#0f172a" />
        <rect x="89" y="86.5" width="38" height="2" fill="#f8fafc" />
        <line x1="88" y1="86" x2="88" y2="89" stroke="#020617" strokeWidth="1" />

        {/* Top Book 1 */}
        <path d="M 89,80 H 129 V 83 H 89 Z" fill="#334155" />
        <rect x="90" y="80.5" width="38" height="2" fill="#ffffff" />
        <line x1="89" y1="80" x2="89" y2="83" stroke="#1e293b" strokeWidth="1" />
      </g>

      {/* 4. Silver/Incense Burner Pot (RHS) */}
      <g id="incense-pot">
        {/* Stand Base */}
        <ellipse cx="150" cy="141" rx="9" ry="3" fill="#475569" stroke="#1e293b" strokeWidth="0.8" />
        <line x1="150" y1="140" x2="150" y2="126" stroke="#475569" strokeWidth="2.4" />
        {/* Pot cup */}
        <path d="M 142,126 C 142,116 158,116 158,126 Z" fill="#64748b" stroke="#1e293b" strokeWidth="0.8" />
        <ellipse cx="150" cy="122" rx="6.5" ry="1.8" fill="#1e293b" />
        {/* Smoke trails */}
        <path
          d="M 150,121 C 144,105 154,92 146,75"
          fill="none"
          stroke="#94a3b8"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.6"
          className="animate-pulse"
        />
        <path
          d="M 152,121 C 158,107 148,95 154,80"
          fill="none"
          stroke="#cbd5e1"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.4"
          className="animate-pulse"
        />
      </g>

      {/* Green Trapezoidal Ground block representing the base */}
      <polygon points="56,170 164,170 184,185 36,185" fill="#a3e635" stroke="#65a30d" strokeWidth="1.2" />

      {/* White Rectangular Plaque */}
      {/* Plaque back shadow */}
      <rect x="27" y="186" width="168" height="34" rx="4" fill="#cbd5e1" />
      {/* Real plaque */}
      <rect x="25" y="184" width="170" height="36" rx="4" fill="#FFFFFF" stroke="#475569" strokeWidth="1.2" />

      {/* Text in the base plaque */}
      <text
        x="110"
        y="201"
        fill="#ea580c"
        className="font-sans font-black tracking-wider"
        style={{ fontSize: '13.5px', fontWeight: 900 }}
        textAnchor="middle"
      >
        THB COLLEGE
      </text>
      <text
        x="110"
        y="214"
        fill="#0F172A"
        className="font-sans font-black tracking-widest"
        style={{ fontSize: '9.5px', fontWeight: 850 }}
        textAnchor="middle"
      >
        JAMUGURIHAT
      </text>
    </svg>
  );
}
