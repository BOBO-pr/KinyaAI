import React from 'react';

export const KinyaSphere: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const dimensions = {
    sm: 'w-24 h-24',
    md: 'w-48 h-48 md:w-64 md:h-64',
    lg: 'w-64 h-64 md:w-80 md:h-80',
  }[size];

  return (
    <div className={`relative flex items-center justify-center ${dimensions} select-none`}>
      {/* Outer ambient blur */}
      <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-2xl animate-pulse-glow" />

      {/* Orbit ring 1 */}
      <div className="absolute inset-[-12px] rounded-full border border-emerald-500/20 animate-spin" style={{ animationDuration: '18s' }}>
        <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_12px_#10B981] absolute -top-1.5 left-1/2 -translate-x-1/2" />
      </div>

      {/* Orbit ring 2 (angled) */}
      <div
        className="absolute inset-[-4px] rounded-full border border-emerald-400/30 animate-spin"
        style={{ animationDuration: '12s', animationDirection: 'reverse', transform: 'rotate(45deg)' }}
      >
        <div className="w-2.5 h-2.5 rounded-full bg-mint-300 shadow-[0_0_10px_#6EE7B7] absolute -bottom-1 left-1/2 -translate-x-1/2" />
      </div>

      {/* Inner Glowing 3D Orb */}
      <div className="relative w-full h-full rounded-full bg-gradient-to-tr from-[#064e3b] via-[#059669] to-[#34d399] shadow-[inset_0_0_50px_rgba(0,0,0,0.8),0_0_40px_rgba(16,185,129,0.4)] flex items-center justify-center overflow-hidden border border-emerald-300/30">
        {/* Core highlight */}
        <div className="absolute top-4 left-6 w-1/3 h-1/3 rounded-full bg-white/25 blur-md" />
        
        {/* Central emblem */}
        <div className="z-10 text-center flex flex-col items-center">
          <div className="text-2xl md:text-3xl font-extrabold tracking-wider text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
            KINYA
          </div>
          <div className="text-xs uppercase tracking-[0.25em] text-emerald-200 font-semibold">
            AI Core
          </div>
        </div>

        {/* Dynamic mesh lines */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.5)_90%)]" />
      </div>
    </div>
  );
};
