"use client";

import { motion } from "motion/react";

export default function WaveDivider({ 
  position = 'bottom', 
  colorClass = 'fill-brown-50',
  animated = true
}: { 
  position?: 'top' | 'bottom', 
  colorClass?: string,
  animated?: boolean
}) {
  return (
    <div className={`absolute left-0 w-full overflow-hidden leading-none z-10 ${position === 'top' ? 'top-0 rotate-180' : 'bottom-0'}`}>
      <motion.svg 
        viewBox="0 0 1440 320" 
        preserveAspectRatio="none" 
        className="relative block w-full h-[60px] md:h-[120px]"
        animate={animated ? { scaleY: [1, 1.2, 1] } : {}}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: 'bottom' }}
      >
        <path 
          className={colorClass}
          d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,149.3C960,160,1056,160,1152,138.7C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        ></path>
      </motion.svg>
    </div>
  );
}
