import { FaBolt, FaChartBar, FaUserShield } from "react-icons/fa6";
import React from "react";

const config: Record<
  string,
  { label: string; icon: React.ReactNode; bg: string; border: string }
> = {
  "personal-experience": {
    label: "From Our Experience",
    icon: <FaUserShield className="h-5 w-5" />,
    bg: "bg-blue-50 dark:bg-blue-900/20",
    border: "border-blue-200 dark:border-blue-800",
  },
  "unique-insight": {
    label: "Unique Insight",
    icon: <FaBolt className="h-5 w-5" />,
    bg: "bg-amber-50 dark:bg-amber-900/20",
    border: "border-amber-200 dark:border-amber-800",
  },
  "original-data": {
    label: "Original Data",
    icon: <FaChartBar className="h-5 w-5" />,
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    border: "border-emerald-200 dark:border-emerald-800",
  },
};

const InsightBox = ({
  type,
  children,
}: {
  type: keyof typeof config;
  children: React.ReactNode;
}) => {
  const { label, icon, bg, border } = config[type] ?? config["unique-insight"];

  return (
    <div className={`not-prose my-8 rounded-lg border-l-4 ${border} ${bg} p-5`}>
      <div className="mb-2 flex items-center gap-2 font-semibold text-text dark:text-darkmode-text">
        {icon}
        {label}
      </div>
      <div className="m-0 leading-relaxed text-text/80 dark:text-darkmode-text/80">
        {children}
      </div>
    </div>
  );
};

export default InsightBox;
