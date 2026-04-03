"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

function pseudoRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function QuotesSection() {
  const quotesRef = useRef<HTMLElement>(null);
  const { scrollYProgress: quotesScrollProgress } = useScroll({
    target: quotesRef,
    offset: ["start end", "end start"],
  });

  const springConfig = { stiffness: 50, damping: 20, mass: 1.2 };
  const quotesTextYRaw = useTransform(quotesScrollProgress, [0, 1], [30, -30]);
  const quotesTextY = useSpring(quotesTextYRaw, springConfig);

  const ts = { stiffness: 120, damping: 20, mass: 0.8 };

  const textOp1Raw = useTransform(quotesScrollProgress, [0.35, 0.43], [0, 1]);
  const textY1Raw = useTransform(quotesScrollProgress, [0.35, 0.43], [60, 0]);
  const textOp1 = useSpring(textOp1Raw, ts);
  const textY1 = useSpring(textY1Raw, ts);

  const textOp2Raw = useTransform(quotesScrollProgress, [0.4, 0.48], [0, 1]);
  const textY2Raw = useTransform(quotesScrollProgress, [0.4, 0.48], [60, 0]);
  const textOp2 = useSpring(textOp2Raw, ts);
  const textY2 = useSpring(textY2Raw, ts);

  const textOp3Raw = useTransform(quotesScrollProgress, [0.45, 0.53], [0, 1]);
  const textY3Raw = useTransform(quotesScrollProgress, [0.45, 0.53], [60, 0]);
  const textOp3 = useSpring(textOp3Raw, ts);
  const textY3 = useSpring(textY3Raw, ts);

  const textOp4Raw = useTransform(quotesScrollProgress, [0.5, 0.58], [0, 1]);
  const textY4Raw = useTransform(quotesScrollProgress, [0.5, 0.58], [60, 0]);
  const textOp4 = useSpring(textOp4Raw, ts);
  const textY4 = useSpring(textY4Raw, ts);

  const textOp5Raw = useTransform(quotesScrollProgress, [0.55, 0.63], [0, 1]);
  const textY5Raw = useTransform(quotesScrollProgress, [0.55, 0.63], [60, 0]);
  const textOp5 = useSpring(textOp5Raw, ts);
  const textY5 = useSpring(textY5Raw, ts);

  const layer1YRaw = useTransform(quotesScrollProgress, [0, 1], [-80, 80]);
  const layer1Y = useSpring(layer1YRaw, springConfig);
  const layer2YRaw = useTransform(quotesScrollProgress, [0, 1], [150, -150]);
  const layer2Y = useSpring(layer2YRaw, springConfig);
  const layer3YRaw = useTransform(quotesScrollProgress, [0, 1], [300, -300]);
  const layer3Y = useSpring(layer3YRaw, springConfig);
  const layer4YRaw = useTransform(quotesScrollProgress, [0, 1], [550, -550]);
  const layer4Y = useSpring(layer4YRaw, springConfig);
  const layer5YRaw = useTransform(quotesScrollProgress, [0, 1], [850, -850]);
  const layer5Y = useSpring(layer5YRaw, springConfig);

  return (
    <section
      ref={quotesRef}
      className="relative w-full min-h-screen pt-40 pb-[300px] md:pt-[300px] md:pb-[440px] lg:pb-[520px] flex flex-col justify-center items-start bg-[#fcfcfc] overflow-visible z-10 font-['Montserrat',sans-serif]"
    >
      <div className="absolute top-[-1px] left-0 w-full flex flex-col z-30 pointer-events-none">
        <div className="h-[20px] md:h-[32px] w-full bg-[#1b0a33] shadow-[0_12px_15px_-3px_rgba(0,0,0,0.6)] z-50 relative"></div>
        <div className="h-[16px] md:h-[28px] w-full bg-[#3d245c] shadow-[0_12px_15px_-3px_rgba(0,0,0,0.4)] z-40 relative"></div>
        <div className="h-[16px] md:h-[28px] w-full bg-[#6a4299] shadow-[0_12px_15px_-3px_rgba(0,0,0,0.25)] z-30 relative"></div>
        <div className="h-[16px] md:h-[28px] w-full bg-[#9f88bd] shadow-[0_12px_15px_-3px_rgba(0,0,0,0.15)] z-20 relative"></div>
        <div className="h-[16px] md:h-[28px] w-full bg-[#dacfec] shadow-[0_12px_15px_-3px_rgba(0,0,0,0.08)] z-10 relative"></div>
        <div className="h-[16px] md:h-[28px] w-full bg-[#f6effb] shadow-[0_12px_15px_-3px_rgba(0,0,0,0.03)] z-0 relative"></div>
      </div>

      <div className="absolute inset-x-0 bottom-[140px] top-[140px] pointer-events-none z-0 overflow-hidden">
        {Array.from({ length: 60 }).map((_, i) => {
          const randVal = pseudoRandom(i + 10);
          const left = Math.pow(randVal, 0.4) * 100;
          const top = pseudoRandom(i + 20) * 100;
          const w = 8 + pseudoRandom(i + 30) * 28;
          const h = w * (0.8 + pseudoRandom(i + 40) * 1.5);

          let yTransform;
          if (w > 32) yTransform = layer5Y;
          else if (w > 26) yTransform = layer4Y;
          else if (w > 18) yTransform = layer3Y;
          else if (w > 12) yTransform = layer2Y;
          else yTransform = layer1Y;

          const delay = pseudoRandom(i + 70) * 0.4;
          const palettes = ["#9b59b6", "#8e44ad", "#a29bfe", "#6c5ce7", "#7d5fff", "#cd84f1", "#c56cf0"];
          const bg = palettes[Math.floor(pseudoRandom(i + 80) * palettes.length)];

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 0.8, scale: 1 }}
              viewport={{ once: true, margin: "50px" }}
              transition={{
                opacity: { duration: 0.5, delay },
                scale: { duration: 0.6, delay, type: "spring", bounce: 0.4 },
              }}
              className="absolute mix-blend-multiply"
              style={{
                left: `${left}%`,
                top: `${top}%`,
                width: `${w}px`,
                height: `${h}px`,
                background: bg,
                borderRadius: "0px",
                y: yTransform,
              }}
            />
          );
        })}

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] md:w-[70%] h-[90%] bg-[radial-gradient(circle_at_center,rgba(252,252,252,0.95)_0%,rgba(252,252,252,0.6)_50%,transparent_100%)] pointer-events-none z-0"></div>
      </div>

      <div className="relative z-10 w-full flex-1 max-w-[1240px] mx-auto flex flex-col justify-center items-start text-left px-8 md:px-20 pointer-events-none mt-[-20px] md:mt-[-40px]">
        <motion.div style={{ y: quotesTextY }} className="w-full">
          <h2 className="flex flex-col items-start justify-center text-[32px] sm:text-[40px] md:text-[56px] lg:text-[64px] font-medium text-[#1f1f1f] leading-[1.2] tracking-tight relative z-20 w-full">
            <motion.span
              style={{
                opacity: textOp1,
                y: textY1,
                textShadow: "0 0 30px rgba(252,252,252,1), 0 0 10px rgba(252,252,252,0.9)",
              }}
            >
              &quot;Belajarlah
            </motion.span>
            <motion.span
              style={{
                opacity: textOp2,
                y: textY2,
                textShadow: "0 0 30px rgba(252,252,252,1), 0 0 10px rgba(252,252,252,0.9)",
              }}
            >
              yang tinggi
            </motion.span>
            <motion.span
              style={{
                opacity: textOp3,
                y: textY3,
                textShadow: "0 0 30px rgba(252,252,252,1), 0 0 10px rgba(252,252,252,0.9)",
              }}
            >
              agar tidak
            </motion.span>
            <motion.span
              style={{
                opacity: textOp4,
                y: textY4,
                textShadow: "0 0 30px rgba(252,252,252,1), 0 0 10px rgba(252,252,252,0.9)",
              }}
            >
              mudah di
            </motion.span>
            <motion.span
              style={{
                opacity: textOp5,
                y: textY5,
                textShadow: "0 0 30px rgba(252,252,252,1), 0 0 10px rgba(252,252,252,0.9)",
              }}
            >
              bodoh-bodohi&quot;
            </motion.span>
          </h2>
        </motion.div>
      </div>

      <div className="absolute bottom-[-1px] left-0 w-full z-40 flex items-center justify-center h-[140px] sm:h-[180px] md:h-[260px] lg:h-[340px] gap-[2px] sm:gap-[3px] md:gap-[5px] px-2 md:px-4 pointer-events-none overflow-hidden pb-[16px] pt-[12px]">
        {Array.from({ length: 36 }).map((_, i) => {
          const x = i / 35;
          const wave1 = Math.sin(x * Math.PI * 2.5);
          const wave2 = Math.sin(x * Math.PI * 5);
          const pRand = pseudoRandom(i + 42);
          const pBase = 35 + wave1 * 25 + wave2 * 10;
          const totalHeight = Math.min(85, Math.max(15, pBase + pRand * 30));
          const oRand = pseudoRandom(i + 13);
          const orangeRatio = 0.2 + oRand * 0.35;
          const purpleRatio = 1 - orangeRatio;
          const shades = ["#f3effb", "#e6ddf7", "#d3bcee", "#af8ce6", "#8e5ee0", "#672cb9"];
          const colorIdx = Math.floor(pseudoRandom(i + 77) * shades.length);
          const purpleColor = shades[colorIdx];
          const fRand = pseudoRandom(i + 99);
          const hasFloat = fRand > 0.6;
          const floatGap = 6 + pseudoRandom(i + 11) * 20;
          const floatColor = shades[Math.floor(pseudoRandom(i + 33) * shades.length)];
          const animDelay = -pseudoRandom(i * 88) * 4;
          const duration = 2.5 + pseudoRandom(i * 55) * 2;

          return (
            <div key={i} className="flex-1 flex flex-col justify-center relative items-center h-full">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "100px" }}
                transition={{ duration: 0.7, delay: i * 0.015, ease: "easeOut" }}
                className="w-full h-full flex flex-col justify-center relative items-center"
              >
                {hasFloat && (
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration, repeat: Infinity, ease: "easeInOut", delay: animDelay }}
                    className="w-full absolute rounded-[1px] md:rounded-[2px]"
                    style={{
                      bottom: `calc(50% + ${totalHeight / 2}% + ${floatGap}px)`,
                      height: `${4 + pseudoRandom(i) * 10}px`,
                      backgroundColor: floatColor,
                    }}
                  />
                )}

                <motion.div
                  className="w-full flex flex-col overflow-hidden rounded-[1px] md:rounded-[2px]"
                  style={{ height: `${totalHeight}%`, originY: 0.5 }}
                  animate={{
                    scaleY: [1, 1.15, 0.85, 1],
                    y: [0, -4, 4, 0],
                  }}
                  transition={{
                    duration,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: animDelay,
                  }}
                >
                  <div className="w-full transition-all" style={{ flex: purpleRatio, backgroundColor: purpleColor }} />
                  <div className="w-full transition-all" style={{ flex: orangeRatio, backgroundColor: "#ffa515" }} />
                </motion.div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
