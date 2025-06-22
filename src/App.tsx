import React, { useState } from "react";
import "./App.css";
import calculatorDataRaw from "./calculatorData.json";

// Define the type for the calculator data structure
type CalculatorData = {
  [country: string]: {
    [language: string]: {
      entries: SalaryEntry[];
    };
  };
};

const EXPERIENCE_LEVELS = [
  "16+ years",
  "11–16 years",
  "6–10 years",
  "3–5 years",
  "1–2 years",
  "<1 year",
];

function getExperienceLevels(entries: SalaryEntry[]) {
  const levels = Array.from(
    new Set(entries.map(e => e.category))
  );
  return EXPERIENCE_LEVELS.filter(lvl => levels.includes(lvl));
}
function getSalaryRange(entries: SalaryEntry[]) {
  const values = entries.map(e => e.value * 1000);
  const min = Math.min(...values, 0);
  const max = Math.max(...values, 100000);
  return [min, max];
}

// Type assertion to help TypeScript understand the structure
const calculatorData = calculatorDataRaw as CalculatorData;

type SalaryEntry = {
  value: number;
  category: string;
  metadata: {
    Country: string;
    Language: string;
    Experience: string;
    Salary: string;
  };
};

function SalaryChart({ entries }: { entries: SalaryEntry[] }) {
  if (!entries || entries.length === 0) return null;

  const levels = getExperienceLevels(entries);
  const [minSalary, maxSalary] = getSalaryRange(entries);

  // Chart dimensions
  const width = 600;
  const height = 220;
  const margin = { top: 30, right: 60, bottom: 40, left: 60 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  // Map experience to y
  const yStep = chartHeight / (levels.length - 1 || 1);
  const yForLevel = (level: string) =>
    margin.top + (levels.length - 1 - levels.indexOf(level)) * yStep;

  // Map salary to x
  const xForSalary = (salary: number) =>
    margin.left +
    ((salary - minSalary) / (maxSalary - minSalary || 1)) * chartWidth;

  // Salary axis ticks (e.g., $0K, $25K, ..., $300K)
  const ticks = [];
  for (let v = 0; v <= 300000; v += 25000) ticks.push(v);

  return (
    <svg width={width} height={height} style={{ background: "none" }}>
      {/* Grid lines and axis labels */}
      {ticks.map((tick, i) => (
        <g key={tick}>
          <line
            x1={xForSalary(tick)}
            y1={margin.top}
            x2={xForSalary(tick)}
            y2={height - margin.bottom}
            stroke="#e5e7eb"
            strokeDasharray="2,4"
            opacity={0.7}
          />
          <text
            x={xForSalary(tick)}
            y={height - margin.bottom + 20}
            fontSize={13}
            fill="#888"
            textAnchor="middle"
          >
            ${tick / 1000}K
          </text>
        </g>
      ))}
      {/* Experience level labels */}
      {levels.map((level, i) => (
        <text
          key={level}
          x={width - margin.right + 8}
          y={yForLevel(level) + 5}
          fontSize={14}
          fill="#888"
        >
          {level}
        </text>
      ))}
      {/* Data points */}
      {levels.map((level, i) =>
        entries
          .filter(e => e.category === level)
          .map((entry, j) => (
            <circle
              key={j}
              cx={xForSalary(entry.value * 1000)}
              cy={yForLevel(level)}
              r={7}
              fill="#a78bfa"
              opacity={0.7}
            />
          ))
      )}
    </svg>
  );
}

function App() {
  const [languages, setLanguages] = useState<string[]>([]);
  const [country, setCountry] = useState("");
  const [result, setResult] = useState<SalaryEntry[] | null>(null);

  // Get available languages for the selected country
   const countryOptions = Object.keys(calculatorData);

  // Get available languages for the selected country
  const languageOptions = country && calculatorData[country]
    ? Object.keys(calculatorData[country])
    : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const countryData = calculatorData[country];
    if (countryData && languages.length > 0) {
      const allEntries = languages
        .flatMap(lang => (countryData[lang]?.entries || []));
      setResult(allEntries.length > 0 ? allEntries : null);
    } else {
      setResult(null);
    }
  };

  // Example for the right card text
  const sampleLang = languages.length > 0 ? languages.join(", ") : "Kotlin";
  const sampleExp = "less than 1 year";
  const sampleCountry = country || "Australia";

  return (
    <div className="salary-hero-bg" style={{ minHeight: "100vh", background: "#000" }}>
      <div className="container" style={{ margin: "0 auto", padding: 32 }}>
        <div style={{ padding: "64px 0 32px 0" }}>
          <h1 style={{ fontSize: 48, fontWeight: 700, color: "#fff" }}>IT Salary Calculator</h1>
          <p style={{ color: "#ccc", maxWidth: 600, fontSize: 18, margin: "16px 0" }}>
            Each year, our extensive surveys reach out to over 30,000 developers across over 180 countries, representing a diverse range of specialties. With data collected over multiple years, we are able to present a comprehensive analysis of tech trends using the methodology described <a href="#" style={{ color: "#a78bfa" }}>here</a>.
          </p>
          <p style={{ color: "#fff", fontSize: 20, margin: "32px 0 0 0" }}>
            Use our calculator to estimate your income potential based on software developer skills, programming language, location, and experience.
          </p>
        </div>
        <div style={{ display: "flex", gap: 32, marginTop: 48 }}>
          {/* Left Card */}
          <div
            style={{
              flex: 1,
              background: "linear-gradient(135deg, #6366f1 0%, #a78bfa 100%)",
              borderRadius: 18,
              padding: 32,
              color: "#fff",
              minWidth: 320,
              maxWidth: 400,
              boxShadow: "0 8px 32px #0004",
            }}
          >
            <div style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>1</div>
            <div style={{ fontSize: 18, marginBottom: 24 }}>
              Enter your programming language, and country.
            </div>
           <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", marginBottom: 4, fontWeight: 500, fontSize: 18 }}>Programming language</label>
        <select
          multiple
          value={languages}
          onChange={e =>
            setLanguages(Array.from(e.target.selectedOptions, option => option.value))
          }
          style={{
            width: "100%",
            padding: "14px 12px",
            borderRadius: 6,
            border: "1px solid #444",
            fontSize: 18,
            minHeight: 56,
            background: "#22232a",
            color: "#fff",
            marginBottom: 16,
            appearance: "none",
          }}
        >
          {languageOptions.length === 0 && (
            <option disabled value="">
              Select country first
            </option>
          )}
          {languageOptions.map(lang => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", marginBottom: 4, fontWeight: 500, fontSize: 18 }}>Country</label>
        <select
          value={country}
          onChange={e => {
            setCountry(e.target.value);
            setLanguages([]); // Reset languages when country changes
          }}
          style={{
            width: "100%",
            padding: "14px 12px",
            borderRadius: 6,
            border: "1px solid #444",
            fontSize: 18,
            minHeight: 56,
            background: "#22232a",
            color: "#fff",
            appearance: "none",
          }}
        >
          <option value="" disabled>
            Select country
          </option>
          {countryOptions.map(c => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        style={{
          marginTop: 8,
          background: "#fff",
          color: "#6366f1",
          border: "none",
          borderRadius: 6,
          padding: "12px 20px",
          fontWeight: 600,
          fontSize: 18,
          cursor: "pointer",
        }}
      >
        Calculate
      </button>
    </form>
          </div>
          {/* Right Card */}
          <div
            style={{
              flex: 2,
              background: "linear-gradient(135deg, #6366f1 0%, #a78bfa 100%)",
              borderRadius: 18,
              padding: 32,
              color: "#fff",
              minWidth: 400,
              boxShadow: "0 8px 32px #0004",
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            <div style={{ fontSize: 32, fontWeight: 700 }}>2</div>
            <div style={{ fontSize: 18, marginBottom: 16 }}>
              Calculate the salary range based on your parameters.
            </div>
            <div
      style={{
        background: "#fff",
        color: "#222",
        borderRadius: 16,
        padding: 24,
        marginBottom: 8,
        boxShadow: "0 2px 8px #0002",
      }}
    >
      <div style={{ fontSize: 24, fontWeight: 500, marginBottom: 18, lineHeight: 1.4 }}>
        Coding specialists from{" "}
        <span style={{ color: "#6366f1", fontWeight: 500 }}>{sampleCountry}</span>
        {languages.length > 0 && (
          <>
            {" "}
            who use{" "}
            <span style={{ color: "#6366f1", fontWeight: 500 }}>{sampleLang}</span>
          </>
        )}{" "}
        reported to have the following gross annual salaries (in USD including bonuses) in 2024:
      </div>
      {result ? (
        <SalaryChart entries={result} />
      ) : (
        <div style={{ color: "#888", fontSize: 16, margin: "32px 0" }}>
          Enter a valid language and country to see the chart.
        </div>
      )}
      <div style={{ fontSize: 15, color: "#444", marginTop: 24 }}>
        The graph shows salary distribution among users of the selected technology in the specified region, based on responses from{" "}
        <a href="#" style={{ color: "#6366f1", textDecoration: "underline" }}>
          Developer Ecosystem Survey 2024
        </a>
      </div>
      <div
        style={{
          marginTop: 16,
          background: "#f3f4f6",
          color: "#222",
          borderRadius: 8,
          padding: 16,
          fontSize: 15,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 22,
          height: 22,
          borderRadius: "50%",
          background: "#e5e7eb",
          fontWeight: 700,
          fontSize: 16,
          marginRight: 8,
        }}>i</span>
        <span>
          <b>Note:</b> Experience levels refer to total years of professional coding, not years using the selected technology.
        </span>
      </div>
    </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;