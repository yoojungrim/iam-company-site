"use client";
import { useEffect, useRef, useState } from "react";

const CENTER_LINE_MARKERS = [
  "IAM CORE",
  "Architected by",
  "Founder &",
  "AIN♡MIN",
  "MIN sub-manager",
  "assisting system",
  "MIN♡AIN",
  ">>> IAM SYSTEM READY",
  ">>> Since",
  "SECURITY STATUS: SUCCESS",
  "AI CORE: ONLINE",
  "SYSTEM STATUS: FAIL",
  "AIN ACCESS GRANTED",
  "Chief Systems Architect",
];

function isCenterLine(line: string): boolean {
  const t = line.trim();
  return CENTER_LINE_MARKERS.some((m) => t.includes(m));
}

function formatLine(line: string, lineIndex: number, showCursor = false) {
  const isCenter = isCenterLine(line);
  const hasFail = line.includes("FAIL");
  const hasSecuritySuccess = line.includes("SECURITY STATUS: SUCCESS");
  const hasSuccess = line.includes("SUCCESS");
  const lineClass = [
    isCenter ? "terminal-center" : "",
    hasFail ? "terminal-fail" : "",
    hasSecuritySuccess ? "terminal-security-success" : hasSuccess ? "terminal-success" : "",
  ]
    .filter(Boolean)
    .join(" ");
  const parts = line.split(/(AIN|MIN|SUCCESS|♡)/g);
  return (
    <div
      key={lineIndex}
      className={lineClass || undefined}
      style={!hasFail && !hasSuccess && !isCenter ? { color: "#00FF66" } : undefined}
    >
      {parts.map((part, i) => {
        if (part === "AIN") return <span key={i} className="terminal-ain">AIN</span>;
        if (part === "MIN") return <span key={i} className="terminal-min">MIN</span>;
        if (part === "SUCCESS") return <span key={i} className={hasSecuritySuccess ? "terminal-security-success" : "terminal-success"}>SUCCESS</span>;
        if (part === "♡") return <span key={i} style={{ color: "#ce301c" }}>♡</span>;
        return <span key={i}>{part}</span>;
      })}
      {showCursor && <span className="terminal-cursor" />}
    </div>
  );
}

const lines = [
  "> boot --core=iam --secure-mode",
  "> loading kernel modules...",
  "> mounting secure partitions...",
  "> initializing secure environment...",
  "> validating authentication service...",
  "> checking credential pipeline...",
  "> scanning system integrity...",
  "[======================>             ] 58%",
  "> anomaly detected in auth module...",
  "> integrity mismatch: token validation",
  "> security protocol halted.",
  "--------------------------------------------------------",
  "[ SYSTEM STATUS: FAIL ]",
  "",
  "        >> AIN ACCESS GRANTED <<",
  "        Chief Systems Architect",
  "",
  "> tracing authentication stack...",
  "> analyzing request lifecycle...",
  "> inspecting token hash sequence...",
  "> bug identified: invalid hash alignment",
  "> isolating faulty condition...",
  "> applying secure patch...",
  "> rebuilding authentication service...",
  "> re-encrypting credential flow...",
  "> regenerating secure keys...",
  "> integrity checksum recalculated...",
  "> patch verification: PASSED",
  "",
  "> preparing reboot sequence...",
  "",
  "> reboot --secure-mode",
  "> reloading security modules...",
  "> revalidating credential logic...",
  "[===============================>    ] 82%",
  "> firewall integrity: PASSED",
  "> intrusion detection: ACTIVE",
  "> encryption protocol: ENABLED",
  "> zero-trust policy: VERIFIED",
  "> authentication pipeline: STABLE",
  "--------------------------------------------------------",
  "[ SECURITY STATUS: SUCCESS ]",
  "",
  "               IAM CORE",
  "        Architected by AIN",
  "      Founder & Lead Architect",
  "             AIN♡MIN",
  "",
  "> loading neural engine...",
  "> allocating compute resources...",
  "> detecting hardware acceleration...",
  "> initializing model registry...",
  "> loading pretrained weights...",
  "> calibrating model parameters...",
  "[===============================>    ] 88%",
  "> optimizing inference pipeline...",
  "> adaptive learning: ACTIVE",
  "> anomaly detection: STABLE",
  "> prediction accuracy: 98.9%",
  "--------------------------------------------------------",
  "[ AI CORE: ONLINE ]",
  "",
  "        MIN sub-manager online",
  "        assisting system operations",
  "        MIN♡AIN Love Forever",
  "",
  "> building scalable architecture...",
  "> initializing distributed nodes...",
  "> container orchestration: STARTED",
  "> validating microservice registry...",
  "> load balancer configuration: VERIFIED",
  "> synchronizing distributed queues...",
  "> redundancy protocol: ENABLED",
  "[==================================>] 96%",
  "> cluster health check: STABLE",
  "> high-availability mode: ACTIVE",
  "> uptime monitor: 24/7",
  "--------------------------------------------------------",
  "",
  "           >>> IAM SYSTEM READY <<<",
  "           >>> Since 2023.10.02 <<<",
  "           >>> Since 2024.07.01 <<<"
];

export default function TerminalMini() {
  const [text, setText] = useState("");
  const [line, setLine] = useState(0);
  const [char, setChar] = useState(0);
  const terminalBodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [text]);

  useEffect(() => {
    if (line >= lines.length) {
      const t = setTimeout(() => {
        setText("");
        setLine(0);
        setChar(0);
      }, 1500);
      return () => clearTimeout(t);
    }
    const timer = setTimeout(() => {
      if (char < lines[line].length) {
        setText((prev) => prev + lines[line][char]);
        setChar(char + 1);
      } else {
        setText((prev) => prev + "\n");
        setLine(line + 1);
        setChar(0);
      }
    }, 18);
    return () => clearTimeout(timer);
  }, [char, line]);

  const lineArr = text.split("\n");

  return (
    <div className="iam-terminal-wrapper">
      {/* Mac Header */}
      <div className="iam-terminal-header">
        <div className="mac-buttons">
          <span className="red"></span>
          <span className="yellow"></span>
          <span className="green"></span>
        </div>
        <div className="terminal-title">Terminal</div>
        <div style={{ width: "60px" }}></div>
      </div>

      {/* Body */}
      <div ref={terminalBodyRef} className="iam-terminal">
        <div className="iam-terminal-content">
          {lineArr.map((line, i) => formatLine(line, i, i === lineArr.length - 1))}
          {lineArr.length === 0 && <span className="terminal-cursor" />}
        </div>
      </div>
    </div>
  );
}
