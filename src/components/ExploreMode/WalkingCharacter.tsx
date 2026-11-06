import React from 'react';

export interface WalkingCharacterProps {
  x: number; // percentage 0 - 100
  y: number; // percentage 0 - 100
  scale?: number; // perspective scale e.g. 0.4 - 1.1
  facing?: 'away' | 'left' | 'right' | 'towards';
  isMoving?: boolean;
}

export const WalkingCharacter: React.FC<WalkingCharacterProps> = ({
  x,
  y,
  scale = 1.0,
  facing = 'away',
  isMoving = true,
}) => {
  // Determine horizontal flip or orientation
  const isLeft = facing === 'left';
  const isRight = facing === 'right';
  const isTowards = facing === 'towards';
  const isAway = facing === 'away' || (!isLeft && !isRight && !isTowards);

  return (
    <div
      className="absolute pointer-events-none select-none z-30 transition-transform duration-75 ease-linear"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: `translate(-50%, -100%) scale(${scale})`,
        transformOrigin: '50% 100%',
      }}
    >
      <style>{`
        @keyframes walkLegLeft {
          0% { transform: rotate(-22deg); }
          50% { transform: rotate(22deg); }
          100% { transform: rotate(-22deg); }
        }
        @keyframes walkLegRight {
          0% { transform: rotate(22deg); }
          50% { transform: rotate(-22deg); }
          100% { transform: rotate(22deg); }
        }
        @keyframes walkArmLeft {
          0% { transform: rotate(18deg); }
          50% { transform: rotate(-18deg); }
          100% { transform: rotate(18deg); }
        }
        @keyframes walkArmRight {
          0% { transform: rotate(-18deg); }
          50% { transform: rotate(18deg); }
          100% { transform: rotate(-18deg); }
        }
        @keyframes walkTorsoBob {
          0%, 100% { transform: translateY(0px); }
          25%, 75% { transform: translateY(-2.5px); }
          50% { transform: translateY(0px); }
        }
        @keyframes shadowPulse {
          0%, 100% { transform: scaleX(1) scaleY(1); opacity: 0.6; }
          50% { transform: scaleX(0.88) scaleY(0.85); opacity: 0.45; }
        }
        @keyframes footstepGlow {
          0%, 100% { opacity: 0.8; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.3); }
        }
      `}</style>

      {/* SVG Container: Width 52px, Height 110px */}
      <div className="relative flex flex-col items-center">
        {/* Soft Ground Contact Shadow */}
        <div
          className="absolute -bottom-1 w-12 h-3.5 bg-black/70 rounded-full blur-[2.5px]"
          style={{
            animation: isMoving ? 'shadowPulse 0.55s ease-in-out infinite' : 'none',
          }}
        />

        {/* Foot Contact Neon Pulse */}
        <div
          className="absolute -bottom-0.5 w-6 h-2 bg-[#34f480]/60 rounded-full blur-[3px]"
          style={{
            animation: isMoving ? 'footstepGlow 0.55s ease-in-out infinite' : 'none',
          }}
        />

        {/* Humanoid SVG Avatar */}
        <svg
          width="48"
          height="104"
          viewBox="0 0 48 104"
          className="relative drop-shadow-[0_4px_10px_rgba(0,0,0,0.85)]"
          style={{
            transform: isLeft ? 'scaleX(-1)' : 'scaleX(1)',
          }}
        >
          <defs>
            {/* Gradients for Luxury Resort Apparel */}
            <linearGradient id="jacketGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e3a2b" />
              <stop offset="50%" stopColor="#15291e" />
              <stop offset="100%" stopColor="#0c1711" />
            </linearGradient>

            <linearGradient id="pantsGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2c332e" />
              <stop offset="100%" stopColor="#191c1a" />
            </linearGradient>

            <linearGradient id="backpackGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#28e070" />
              <stop offset="60%" stopColor="#15803d" />
              <stop offset="100%" stopColor="#0d4621" />
            </linearGradient>

            <linearGradient id="skinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f3c699" />
              <stop offset="100%" stopColor="#d8a374" />
            </linearGradient>

            <filter id="charGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#34f480" floodOpacity="0.35" />
            </filter>
          </defs>

          {/* Torso & Head Group with Vertical Bob */}
          <g
            style={{
              animation: isMoving ? 'walkTorsoBob 0.55s ease-in-out infinite' : 'none',
            }}
          >
            {/* Head & Hair */}
            <g id="head">
              {/* Hair Base */}
              <circle cx="24" cy="14" r="8.5" fill="#1b1713" />
              <path
                d="M 16 14 Q 24 6 32 14 Q 24 10 16 14 Z"
                fill="#2b231d"
              />
              {/* Skin Tone Face / Neck */}
              <circle cx="24" cy="16" r="6.5" fill="url(#skinGrad)" />
              {/* Neck */}
              <rect x="22" y="21" width="4" height="4.5" rx="1.5" fill="url(#skinGrad)" />

              {/* Facing Details */}
              {isAway && (
                // Back of Head Hair Detail
                <path
                  d="M 16.5 13 Q 24 8 31.5 13 Q 30 20 24 21 Q 18 20 16.5 13 Z"
                  fill="#1b1713"
                />
              )}

              {isTowards && (
                // Face Details: Subtle Eyes / Sunglasses
                <g>
                  <rect x="20" y="14" width="8" height="2.5" rx="1" fill="#111" />
                </g>
              )}
            </g>

            {/* Torso / Jacket */}
            <g id="torso">
              {/* Jacket Body */}
              <path
                d="M 15 25 L 33 25 L 31 52 L 17 52 Z"
                fill="url(#jacketGrad)"
                stroke="#34f480"
                strokeWidth="0.8"
                strokeOpacity="0.4"
                rx="2"
              />

              {/* Collar Accent */}
              <path
                d="M 20 25 L 24 30 L 28 25"
                fill="none"
                stroke="#34f480"
                strokeWidth="1.2"
                strokeLinecap="round"
              />

              {/* Back View: Sleek Resort Daypack / Backpack */}
              {isAway && (
                <g id="backpack">
                  <rect
                    x="18"
                    y="28"
                    width="12"
                    height="17"
                    rx="3.5"
                    fill="url(#backpackGrad)"
                    stroke="#4ade80"
                    strokeWidth="0.8"
                  />
                  <line x1="18" y1="36" x2="30" y2="36" stroke="#22c55e" strokeWidth="1" />
                  <circle cx="24" cy="33" r="1.5" fill="#34f480" />
                  {/* Shoulder Straps */}
                  <line x1="17" y1="26" x2="19" y2="40" stroke="#10b981" strokeWidth="1.2" />
                  <line x1="31" y1="26" x2="29" y2="40" stroke="#10b981" strokeWidth="1.2" />
                </g>
              )}

              {/* Side / Profile View Details */}
              {(isLeft || isRight) && (
                <g id="profileBag">
                  <path
                    d="M 17 28 C 13 32, 13 42, 17 44 Z"
                    fill="url(#backpackGrad)"
                    stroke="#4ade80"
                    strokeWidth="0.8"
                  />
                </g>
              )}
            </g>

            {/* Left Arm (Swing) */}
            <g
              id="leftArm"
              style={{
                transformOrigin: '16px 26px',
                animation: isMoving ? 'walkArmLeft 0.55s ease-in-out infinite' : 'none',
              }}
            >
              <rect x="13.5" y="26" width="3.5" height="18" rx="1.8" fill="url(#jacketGrad)" />
              <circle cx="15.2" cy="45" r="2" fill="url(#skinGrad)" />
            </g>

            {/* Right Arm (Swing in Counter-direction) */}
            <g
              id="rightArm"
              style={{
                transformOrigin: '32px 26px',
                animation: isMoving ? 'walkArmRight 0.55s ease-in-out infinite' : 'none',
              }}
            >
              <rect x="31" y="26" width="3.5" height="18" rx="1.8" fill="url(#jacketGrad)" />
              <circle cx="32.8" cy="45" r="2" fill="url(#skinGrad)" />
            </g>
          </g>

          {/* Left Leg (Hips to Shoes) */}
          <g
            id="leftLeg"
            style={{
              transformOrigin: '20px 52px',
              animation: isMoving ? 'walkLegLeft 0.55s ease-in-out infinite' : 'none',
            }}
          >
            {/* Thigh & Calf */}
            <path
              d="M 18.5 52 L 22.5 52 L 21.5 76 L 19 76 Z"
              fill="url(#pantsGrad)"
            />
            <path
              d="M 19 76 L 21.5 76 L 21 95 L 18 95 Z"
              fill="url(#pantsGrad)"
            />
            {/* Sneaker / Walking Shoe */}
            <path
              d="M 16.5 95 L 22.5 95 L 22.5 100 L 15.5 100 Q 15 97 16.5 95 Z"
              fill="#ffffff"
            />
            <line x1="15.5" y1="100" x2="22.5" y2="100" stroke="#34f480" strokeWidth="1.2" />
          </g>

          {/* Right Leg (Counter-stride) */}
          <g
            id="rightLeg"
            style={{
              transformOrigin: '28px 52px',
              animation: isMoving ? 'walkLegRight 0.55s ease-in-out infinite' : 'none',
            }}
          >
            {/* Thigh & Calf */}
            <path
              d="M 25.5 52 L 29.5 52 L 29 76 L 26.5 76 Z"
              fill="url(#pantsGrad)"
            />
            <path
              d="M 26.5 76 L 29 76 L 30 95 L 27 95 Z"
              fill="url(#pantsGrad)"
            />
            {/* Sneaker / Walking Shoe */}
            <path
              d="M 25.5 95 L 31.5 95 L 32.5 100 L 25.5 100 Q 24.5 97 25.5 95 Z"
              fill="#ffffff"
            />
            <line x1="25.5" y1="100" x2="32.5" y2="100" stroke="#34f480" strokeWidth="1.2" />
          </g>
        </svg>
      </div>
    </div>
  );
};

