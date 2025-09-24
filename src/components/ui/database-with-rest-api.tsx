"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Folder, HeartHandshakeIcon, SparklesIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DatabaseWithRestApiProps {
  className?: string;
  circleText?: string;
  badgeTexts?: {
    first: string;
    second: string;
    third: string;
    fourth: string;
  };
  buttonTexts?: {
    first: string;
    second: string;
  };
  title?: string;
  lightColor?: string;
}

const DatabaseWithRestApi = ({
  className,
  circleText,
  badgeTexts,
  buttonTexts,
  title,
  lightColor,
}: DatabaseWithRestApiProps) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      className={cn(
        "relative flex h-[500px] sm:h-[450px] w-full max-w-[700px] sm:max-w-[600px] flex-col items-center",
        className
      )}
    >
      <svg
        className="h-full w-full text-muted"
        width="100%"
        height="100%"
        viewBox="0 0 200 100"
      >
        <motion.g
          stroke="currentColor"
          fill="none"
          strokeWidth="0.6"
          strokeDasharray="100 100"
          pathLength="100"
          initial={{ strokeDashoffset: 100 }}
          animate={{ strokeDashoffset: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          <path d="M 31 10 v 15 q 0 5 5 5 h 59 q 5 0 5 5 v 10" />
          <path d="M 77 10 v 10 q 0 5 5 5 h 13 q 5 0 5 5 v 10" />
          <path d="M 124 10 v 10 q 0 5 -5 5 h -14 q -5 0 -5 5 v 10" />
          <path d="M 170 10 v 15 q 0 5 -5 5 h -60 q -5 0 -5 5 v 10" />
        </motion.g>
        <g stroke="currentColor" fill="none" strokeWidth="0.6">
          <g>
            <rect
              fill="#18181B"
              x="14"
              y="5"
              width="34"
              height="10"
              rx="5"
            ></rect>
            <DatabaseIcon x="18" y="7.5"></DatabaseIcon>
            <text
              x="28"
              y="12"
              fill="white"
              stroke="none"
              fontSize="6"
              fontWeight="500"
            >
              {badgeTexts?.first || "FIND"}
            </text>
          </g>
          <g>
            <rect
              fill="#18181B"
              x="60"
              y="5"
              width="34"
              height="10"
              rx="5"
            ></rect>
            <DatabaseIcon x="64" y="7.5"></DatabaseIcon>
            <text
              x="74"
              y="12"
              fill="white"
              stroke="none"
              fontSize="6"
              fontWeight="500"
            >
              {badgeTexts?.second || "ADD"}
            </text>
          </g>
          <g>
            <rect
              fill="#18181B"
              x="108"
              y="5"
              width="34"
              height="10"
              rx="5"
            ></rect>
            <DatabaseIcon x="112" y="7.5"></DatabaseIcon>
            <text
              x="122"
              y="12"
              fill="white"
              stroke="none"
              fontSize="6"
              fontWeight="500"
            >
              {badgeTexts?.third || "MIX"}
            </text>
          </g>
          <g>
            <rect
              fill="#18181B"
              x="150"
              y="5"
              width="40"
              height="10"
              rx="5"
            ></rect>
            <DatabaseIcon x="154" y="7.5"></DatabaseIcon>
            <text
              x="165"
              y="12"
              fill="white"
              stroke="none"
              fontSize="6"
              fontWeight="500"
            >
              {badgeTexts?.fourth || "REMOVE"}
            </text>
          </g>
        </g>
        <defs>
          <radialGradient id="db-blue-grad" fx="1">
            <stop offset="0%" stopColor={lightColor || "#9333ea"} />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
      </svg>
      <div className="absolute bottom-10 flex w-full flex-col items-center">
        <div className="absolute -bottom-4 h-[100px] w-[62%] rounded-lg bg-accent/30" />
        <div className="absolute -top-3 z-20 flex items-center justify-center rounded-lg border bg-[#101112] px-2 py-1 sm:-top-4 sm:py-1.5">
          <SparklesIcon className="size-3" />
          <span className="ml-2 text-[10px]">
            {title ? title : "Curated scent collection with premium fragrances"}
          </span>
        </div>
        <div className="absolute -bottom-8 z-30 grid h-[60px] w-[60px] place-items-center rounded-full border-t bg-[#141516] font-semibold text-xs">
          {circleText ? circleText : "PERFUME"}
        </div>
        <div className="relative z-10 flex h-[150px] w-full items-center justify-center overflow-hidden rounded-lg border bg-background shadow-md">
          <div className="absolute bottom-8 left-12 z-10 h-7 rounded-full bg-[#101112] px-3 text-xs border flex items-center gap-2 ">
            <HeartHandshakeIcon className="size-4" />
            <span>{buttonTexts?.first || "Scentance"}</span>
          </div>
          <div className="absolute right-16 z-10 hidden h-7 rounded-full bg-[#101112] px-3 text-xs sm:flex border items-center gap-2">
            <Folder className="size-4" />
            <span>{buttonTexts?.second || "Premium Collection"}</span>
          </div>
          <motion.div
            className="absolute -bottom-14 h-[100px] w-[100px] rounded-full border-t bg-accent/5"
            animate={shouldReduceMotion ? {} : { scale: [0.98, 1.02, 0.98, 1, 1, 1, 1, 1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-20 h-[145px] w-[145px] rounded-full border-t bg-accent/5"
            animate={shouldReduceMotion ? {} : { scale: [1, 1, 1, 0.98, 1.02, 0.98, 1, 1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-[100px] h-[190px] w-[190px] rounded-full border-t bg-accent/5"
            animate={shouldReduceMotion ? {} : { scale: [1, 1, 1, 1, 1, 0.98, 1.02, 0.98, 1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-[120px] h-[235px] w-[235px] rounded-full border-t bg-accent/5"
            animate={shouldReduceMotion ? {} : { scale: [1, 1, 1, 1, 1, 1, 0.98, 1.02, 0.98, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </div>
    </div>
  );
};

export default DatabaseWithRestApi;

const DatabaseIcon = ({ x = "0", y = "0" }: { x: string; y: string }) => {
  return (
    <svg
      x={x}
      y={y}
      xmlns="http://www.w3.org/2000/svg"
      width="5"
      height="5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5V19A9 3 0 0 0 21 19V5" />
      <path d="M3 12A9 3 0 0 0 21 12" />
    </svg>
  );
};