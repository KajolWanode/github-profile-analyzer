import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Legend,
} from "recharts";

type RawLangA = { language: string; percent: number };
type RawLangB = { name: string; percentage: number; bytes?: number };
type Lang = { name: string; percentage: number };

interface LanguagePieChartProps {
  data?: Array<RawLangA | RawLangB>;
  height?: number;
}

const languageColors: Record<string, string> = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  Go: "#00ADD8",
  Rust: "#dea584",
  Ruby: "#701516",
  PHP: "#4F5D95",
  Swift: "#ffac45",
  Kotlin: "#A97BFF",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Shell: "#89e051",
  Dart: "#00B4AB",
  Vue: "#41b883",
};

export default function LanguagePieChart({ data, height = 260 }: LanguagePieChartProps) {
  const [langs, setLangs] = useState<Lang[]>(() => {
    if (!data) return [];
    return data.map((d) => {
      if ((d as RawLangA).language !== undefined) {
        const r = d as RawLangA;
        return { name: r.language, percentage: r.percent };
      }
      const r = d as RawLangB;
      return { name: r.name, percentage: r.percentage };
    });
  });

  useEffect(() => {
    let mounted = true;
    async function fetchData() {
      if (data) return;
      try {
        const res = await fetch("/languages.json");
        if (!res.ok) return;
        const json = await res.json();
        if (!mounted) return;
        const mapped: Lang[] = json.map((d: any) => {
          if (d.language !== undefined && d.percent !== undefined) return { name: d.language, percentage: d.percent };
          if (d.name !== undefined && d.percentage !== undefined) return { name: d.name, percentage: d.percentage };
          return { name: String(d.name || d.language || "Unknown"), percentage: Number(d.percentage || d.percent || 0) };
        });
        setLangs(mapped);
      } catch (e) {
        // silent
      }
    }
    fetchData();
    return () => { mounted = false; };
  }, [data]);

  useEffect(() => {
    if (!data) return;
    const mapped: Lang[] = data.map((d) => {
      if ((d as RawLangA).language !== undefined) {
        const r = d as RawLangA;
        return { name: r.language, percentage: r.percent };
      }
      const r = d as RawLangB;
      return { name: r.name, percentage: r.percentage };
    });
    setLangs(mapped);
  }, [data]);

  if (!langs || langs.length === 0) {
    return <div className="min-h-[200px] flex items-center justify-center text-muted-foreground">No language data</div>;
  }

  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie data={langs} dataKey="percentage" nameKey="name" cx="50%" cy="45%" innerRadius={50} outerRadius={80} label={(entry) => `${entry.name}`}>
            {langs.map((entry) => (
              <Cell key={entry.name} fill={languageColors[entry.name] || "#6e7681"} />
            ))}
          </Pie>
          <RechartsTooltip formatter={(value: number) => `${value}%`} />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
