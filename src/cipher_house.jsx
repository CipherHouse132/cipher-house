import { useState, useEffect, useRef, useCallback } from "react";

// ─── SUPABASE SYNC CONFIG ────────────────────────────────────────────────────
const SUPABASE_URL = "https://dmktuxnxzjdajxfnlttp.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRta3R1eG54empkYWp4Zm5sdHRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA2Mjg4NTEsImV4cCI6MjA5NjIwNDg1MX0.Ti2Am69_VBeEJouOjZkiriTWUXF49D6BgcyEIC_FklA";

const SYNC_ON =
  SUPABASE_URL.startsWith("http") &&
  !SUPABASE_URL.includes("YOUR_") &&
  SUPABASE_ANON_KEY.length > 20 &&
  !SUPABASE_ANON_KEY.includes("YOUR_");

const REST = `${SUPABASE_URL.replace(/\/+$/, "")}/rest/v1/progress`;
const sbHeaders = {
  "apikey": SUPABASE_ANON_KEY,
  "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
  "Content-Type": "application/json",
};

async function sbFetchAll() {
  if (!SYNC_ON) return null;
  try {
    const res = await fetch(`${REST}?select=id,checked`, { headers: sbHeaders });
    if (!res.ok) return null;
    const rows = await res.json();
    return new Set(rows.filter(r => r.checked).map(r => r.id));
  } catch { return null; }
}

async function sbSet(id, checked) {
  if (!SYNC_ON) return;
  try {
    await fetch(`${REST}?on_conflict=id`, {
      method: "POST",
      headers: { ...sbHeaders, "Prefer": "resolution=merge-duplicates" },
      body: JSON.stringify({ id, checked, updated_at: new Date().toISOString() }),
    });
  } catch {}
}

// ─── DESIGN TOKENS ──────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:       #09090e;
    --bg2:      #0f0f17;
    --bg3:      #14141e;
    --border:   rgba(255,255,255,0.07);
    --border2:  rgba(255,255,255,0.13);
    --gold:     #c9a84c;
    --gold2:    #e8c96a;
    --gold-dim: rgba(201,168,76,0.10);
    --gold-dim2:rgba(201,168,76,0.18);
    --text:     #f0ede6;
    --text2:    #9b9891;
    --text3:    #55524f;
    --green:    #3d8f62;
    --green-bg: rgba(61,143,98,0.12);
    --red:      #b83c2e;
    --red-bg:   rgba(184,60,46,0.10);
    --blue:     #3d6fa8;
    --blue-bg:  rgba(61,111,168,0.12);
    --amber:    #c97a3a;
    --amber-bg: rgba(201,122,58,0.12);
    --purple:   #7050a0;
    --purple-bg:rgba(112,80,160,0.12);
    --radius:   10px;
    --sidebar:  230px;
  }

  html, body, #root { height: 100%; background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 14px; line-height: 1.6; overflow: hidden; }

  body::before {
    content: '';
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E");
    opacity: 0.5;
  }

  .app { display: flex; height: 100vh; position: relative; z-index: 1; overflow: hidden; }

  .sidebar {
    width: var(--sidebar); flex-shrink: 0;
    background: var(--bg2); border-right: 1px solid var(--border);
    display: flex; flex-direction: column; overflow-y: auto; overflow-x: hidden;
  }
  .sidebar::-webkit-scrollbar { width: 3px; }
  .sidebar::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 2px; }

  .logo { padding: 22px 18px 18px; border-bottom: 1px solid var(--border); }
  .logo-name { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 900; color: var(--gold); letter-spacing: 0.06em; line-height: 1; }
  .logo-sub { font-family: 'DM Mono', monospace; font-size: 9px; color: var(--text3); letter-spacing: 0.14em; text-transform: uppercase; margin-top: 5px; }

  .nav { padding: 10px 0; flex: 1; }
  .nav-section { font-family: 'DM Mono', monospace; font-size: 9px; color: var(--text3); letter-spacing: 0.12em; text-transform: uppercase; padding: 14px 18px 5px; }
  .nav-item {
    display: flex; align-items: center; gap: 9px;
    padding: 8px 18px; cursor: pointer; color: var(--text2); font-size: 12.5px;
    border-left: 2px solid transparent; transition: all 0.15s;
    user-select: none;
  }
  .nav-item:hover { color: var(--text); background: rgba(255,255,255,0.03); }
  .nav-item.active { color: var(--gold); border-left-color: var(--gold); background: var(--gold-dim); }
  .nav-icon { font-size: 13px; width: 16px; text-align: center; flex-shrink: 0; }

  .progress-box { margin: 0 12px 16px; background: var(--bg3); border: 1px solid var(--border); border-radius: 8px; padding: 11px 13px; }
  .prog-label { font-family: 'DM Mono', monospace; font-size: 9px; color: var(--text3); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 7px; }
  .prog-track { height: 3px; background: rgba(255,255,255,0.06); border-radius: 2px; overflow: hidden; margin-bottom: 5px; }
  .prog-fill { height: 100%; background: var(--gold); border-radius: 2px; transition: width 0.4s ease; }
  .prog-stats { font-size: 11px; color: var(--text2); display: flex; justify-content: space-between; }

  .main { flex: 1; overflow-y: auto; overflow-x: hidden; display: flex; flex-direction: column; }
  .main::-webkit-scrollbar { width: 4px; }
  .main::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 2px; }

  .panel { padding: 28px 32px; animation: fadeUp 0.2s ease; }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

  .panel-header { margin-bottom: 24px; }
  .panel-title { font-family: 'Playfair Display', serif; font-size: 26px; font-weight: 700; color: var(--text); line-height: 1.2; }
  .panel-sub { font-size: 13px; color: var(--text2); margin-top: 5px; }
  .gold-line { width: 36px; height: 2px; background: var(--gold); margin-top: 12px; border-radius: 1px; }

  .stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 24px; }
  .stat-card { background: var(--bg2); border: 1px solid var(--border); border-radius: var(--radius); padding: 14px; }
  .stat-label { font-family: 'DM Mono', monospace; font-size: 9px; color: var(--text3); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 5px; }
  .stat-val { font-size: 19px; font-weight: 500; color: var(--text); }
  .stat-note { font-size: 11px; color: var(--text3); margin-top: 3px; }

  .section-title { font-family: 'DM Mono', monospace; font-size: 10px; color: var(--text3); letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid var(--border); }

  .day-block { margin-bottom: 24px; }
  .day-header { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; flex-wrap: wrap; }
  .day-badge { font-family: 'DM Mono', monospace; font-size: 10px; font-weight: 500; padding: 4px 11px; border-radius: 20px; letter-spacing: 0.04em; white-space: nowrap; }
  .badge-wed { background: var(--purple-bg); color: #a070d0; border: 1px solid rgba(112,80,160,0.3); }
  .badge-thu { background: var(--blue-bg); color: #6090c8; border: 1px solid rgba(61,111,168,0.3); }
  .badge-fri { background: var(--amber-bg); color: #c8904a; border: 1px solid rgba(201,122,58,0.3); }
  .badge-sat { background: var(--gold-dim2); color: var(--gold2); border: 1px solid rgba(201,168,76,0.3); }
  .badge-sun { background: var(--green-bg); color: #60b080; border: 1px solid rgba(61,143,98,0.3); }
  .badge-mon { background: rgba(201,168,76,0.22); color: var(--gold2); border: 1px solid rgba(201,168,76,0.45); }
  .day-title-text { font-size: 14px; font-weight: 500; color: var(--text); }
  .day-sub-text { font-size: 12px; color: var(--text3); margin-top: 1px; }

  .task-card {
    background: var(--bg2); border: 1px solid var(--border); border-radius: var(--radius);
    padding: 14px 16px; margin-bottom: 7px;
    display: flex; gap: 12px; align-items: flex-start;
    cursor: pointer; transition: border-color 0.15s, background 0.15s;
  }
  .task-card:hover { border-color: var(--border2); }
  .task-card.done { background: rgba(61,143,98,0.05); border-color: rgba(61,143,98,0.2); }
  .check-box {
    width: 19px; height: 19px; border-radius: 5px; border: 1.5px solid var(--border2);
    flex-shrink: 0; margin-top: 2px; display: flex; align-items: center; justify-content: center;
    transition: all 0.2s; background: transparent;
  }
  .task-card.done .check-box { background: var(--green); border-color: var(--green); }
  .check-icon { color: white; font-size: 10px; display: none; }
  .task-card.done .check-icon { display: block; }
  .task-body { flex: 1; }
  .task-name { font-size: 13.5px; font-weight: 500; color: var(--text); margin-bottom: 4px; }
  .task-card.done .task-name { text-decoration: line-through; color: var(--text3); }
  .task-desc { font-size: 12px; color: var(--text2); line-height: 1.65; }
  .task-card.done .task-desc { color: var(--text3); }
  .task-meta { display: flex; gap: 5px; flex-wrap: wrap; margin-top: 7px; }
  .tag { font-family: 'DM Mono', monospace; font-size: 10px; padding: 2px 7px; border-radius: 4px; }
  .tag-free { background: var(--green-bg); color: #60b080; }
  .tag-paid { background: var(--amber-bg); color: #c8904a; }
  .tag-time { background: rgba(255,255,255,0.05); color: var(--text3); }
  .tag-urgent { background: var(--red-bg); color: #d06050; }

  .task-links { margin-top: 7px; display: flex; flex-wrap: wrap; gap: 5px; }
  .task-link { font-family: 'DM Mono', monospace; font-size: 10px; color: var(--gold); background: var(--gold-dim); border: 1px solid rgba(201,168,76,0.2); padding: 2px 8px; border-radius: 4px; text-decoration: none; }

  .cal-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 24px; }
  .cal-card { background: var(--bg2); border: 1px solid var(--border); border-radius: var(--radius); padding: 14px; }
  .cal-card.featured { border-color: rgba(201,168,76,0.3); background: linear-gradient(135deg, var(--bg2), rgba(201,168,76,0.03)); }
  .cal-week { font-family: 'DM Mono', monospace; font-size: 9px; color: var(--gold); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 5px; }
  .cal-theme { font-size: 13px; font-weight: 500; color: var(--text); margin-bottom: 10px; line-height: 1.3; }
  .cal-video { padding: 6px 0; border-bottom: 1px solid var(--border); font-size: 12px; color: var(--text2); display: flex; gap: 7px; align-items: flex-start; }
  .cal-video:last-child { border-bottom: none; }
  .cal-day { font-family: 'DM Mono', monospace; font-size: 10px; color: var(--text3); white-space: nowrap; margin-top: 1px; flex-shrink: 0; }

  .niche-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 24px; }
  .niche-card { background: var(--bg2); border: 1px solid var(--border); border-radius: var(--radius); padding: 16px; }
  .niche-card.top { border-color: rgba(201,168,76,0.4); }
  .niche-rank { font-family: 'DM Mono', monospace; font-size: 9px; color: var(--text3); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 5px; }
  .niche-name { font-family: 'Playfair Display', serif; font-size: 15px; font-weight: 700; color: var(--text); margin-bottom: 3px; }
  .niche-cpm { font-size: 20px; font-weight: 500; color: var(--gold); margin-bottom: 9px; }
  .niche-row { display: flex; justify-content: space-between; font-size: 12px; padding: 4px 0; border-bottom: 1px solid var(--border); }
  .niche-row:last-child { border-bottom: none; }
  .niche-row-label { color: var(--text3); }
  .niche-row-val { color: var(--text2); font-weight: 500; }

  .tools-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 9px; margin-bottom: 24px; }
  .tool-card { background: var(--bg2); border: 1px solid var(--border); border-radius: var(--radius); padding: 13px 15px; display: flex; justify-content: space-between; align-items: flex-start; }
  .tool-name { font-size: 13.5px; font-weight: 500; color: var(--text); margin-bottom: 3px; }
  .tool-use { font-size: 12px; color: var(--text3); }
  .tool-cost { font-family: 'DM Mono', monospace; font-size: 11px; padding: 3px 8px; border-radius: 4px; white-space: nowrap; }
  .cost-free { background: var(--green-bg); color: #60b080; }
  .cost-paid { background: var(--amber-bg); color: #c8904a; }

  .auto-row { display: flex; align-items: center; gap: 12px; padding: 11px 0; border-bottom: 1px solid var(--border); }
  .auto-row:last-child { border-bottom: none; }
  .auto-task { flex: 1; font-size: 13px; color: var(--text); }
  .auto-tool { font-size: 11px; color: var(--text3); margin-top: 2px; }
  .auto-bar-wrap { width: 110px; }
  .auto-bar-bg { height: 4px; background: rgba(255,255,255,0.05); border-radius: 3px; overflow: hidden; }
  .auto-bar-fill { height: 100%; border-radius: 3px; }
  .auto-label { font-family: 'DM Mono', monospace; font-size: 10px; margin-top: 3px; }
  .fill-full { background: var(--green); }
  .fill-part { background: var(--amber); }
  .fill-human { background: var(--red); }
  .label-full { color: #60b080; }
  .label-part { color: #c8904a; }
  .label-human { color: #d06050; }
  .auto-time { font-family: 'DM Mono', monospace; font-size: 11px; text-align: right; width: 70px; flex-shrink: 0; }
  .time-before { color: var(--text3); text-decoration: line-through; }
  .time-after { color: var(--gold); font-weight: 500; }

  .mono-timeline { position: relative; padding-left: 22px; }
  .mono-timeline::before { content: ''; position: absolute; left: 7px; top: 0; bottom: 0; width: 1px; background: var(--border); }
  .mono-item { position: relative; margin-bottom: 18px; }
  .mono-dot { position: absolute; left: -19px; top: 4px; width: 10px; height: 10px; border-radius: 50%; border: 2px solid var(--border2); background: var(--bg); }
  .mono-item.active .mono-dot { background: var(--gold); border-color: var(--gold); }
  .mono-item.future .mono-dot { background: var(--bg3); border-color: var(--border); }
  .mono-phase { font-family: 'DM Mono', monospace; font-size: 9px; color: var(--text3); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 3px; }
  .mono-title { font-size: 13.5px; font-weight: 500; color: var(--text); margin-bottom: 3px; }
  .mono-desc { font-size: 12px; color: var(--text3); line-height: 1.55; }
  .mono-earn { font-family: 'DM Mono', monospace; font-size: 11px; color: var(--gold); margin-top: 4px; }

  .ov-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 24px; }
  .ov-card { background: var(--bg2); border: 1px solid var(--border); border-radius: var(--radius); padding: 18px; cursor: pointer; transition: all 0.2s; }
  .ov-card:hover { border-color: var(--gold); background: rgba(201,168,76,0.03); }
  .ov-icon { font-size: 22px; margin-bottom: 9px; }
  .ov-title { font-family: 'Playfair Display', serif; font-size: 17px; font-weight: 700; color: var(--text); margin-bottom: 5px; }
  .ov-desc { font-size: 12px; color: var(--text3); line-height: 1.6; }
  .ov-arrow { color: var(--gold); font-size: 16px; margin-top: 10px; }

  .launch-banner {
    background: linear-gradient(135deg, rgba(201,168,76,0.13), rgba(201,168,76,0.04));
    border: 1px solid rgba(201,168,76,0.28); border-radius: var(--radius);
    padding: 14px 18px; margin-bottom: 24px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .launch-text { font-family: 'Playfair Display', serif; font-size: 15px; color: var(--gold); }
  .launch-sub { font-size: 12px; color: var(--text3); margin-top: 2px; }
  .launch-date { font-family: 'DM Mono', monospace; font-size: 12px; color: var(--gold2); font-weight: 500; }

  .ai-dock {
    position: fixed; bottom: 0; left: var(--sidebar); right: 0;
    background: linear-gradient(to top, var(--bg) 70%, transparent);
    padding: 16px 24px 20px; z-index: 100;
    transition: all 0.3s ease;
  }
  .ai-bar {
    display: flex; gap: 10px; align-items: flex-end;
    background: var(--bg2); border: 1px solid var(--border2);
    border-radius: 12px; padding: 10px 14px;
    box-shadow: 0 -8px 32px rgba(0,0,0,0.4);
    transition: border-color 0.2s;
  }
  .ai-bar:focus-within { border-color: rgba(201,168,76,0.4); }
  .ai-label { font-family: 'DM Mono', monospace; font-size: 9px; color: var(--gold); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 4px; flex-shrink: 0; padding-top: 2px; }
  .ai-input {
    flex: 1; background: transparent; border: none; outline: none;
    color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 13px;
    resize: none; min-height: 20px; max-height: 120px; line-height: 1.5;
  }
  .ai-input::placeholder { color: var(--text3); }
  .ai-send {
    background: var(--gold); color: var(--bg); border: none;
    border-radius: 7px; padding: 6px 14px; font-size: 12px; font-weight: 600;
    cursor: pointer; flex-shrink: 0; transition: all 0.15s;
    font-family: 'DM Mono', monospace; letter-spacing: 0.04em;
    align-self: flex-end;
  }
  .ai-send:hover { background: var(--gold2); }
  .ai-send:disabled { opacity: 0.4; cursor: not-allowed; }

  .ai-panel {
    position: fixed; bottom: 0; left: var(--sidebar); right: 0;
    background: var(--bg2); border-top: 1px solid var(--border2);
    z-index: 99; display: flex; flex-direction: column;
    transition: height 0.3s ease;
  }
  .ai-panel-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 10px 20px; border-bottom: 1px solid var(--border);
    flex-shrink: 0;
  }
  .ai-panel-title { font-family: 'DM Mono', monospace; font-size: 10px; color: var(--gold); letter-spacing: 0.1em; text-transform: uppercase; }
  .ai-close { background: none; border: none; color: var(--text3); cursor: pointer; font-size: 16px; padding: 2px 6px; }
  .ai-close:hover { color: var(--text); }
  .ai-messages { flex: 1; overflow-y: auto; padding: 16px 20px; display: flex; flex-direction: column; gap: 12px; }
  .ai-messages::-webkit-scrollbar { width: 3px; }
  .ai-messages::-webkit-scrollbar-thumb { background: var(--border2); }
  .ai-msg { padding: 10px 14px; border-radius: 8px; font-size: 13px; line-height: 1.65; }
  .ai-msg.user { background: var(--gold-dim); color: var(--text); align-self: flex-end; max-width: 80%; border: 1px solid var(--gold-dim2); }
  .ai-msg.assistant { background: var(--bg3); color: var(--text2); align-self: flex-start; max-width: 90%; border: 1px solid var(--border); white-space: pre-wrap; }
  .ai-msg.loading { color: var(--text3); font-style: italic; }
  .ai-typing { display: inline-flex; gap: 4px; align-items: center; }
  .ai-typing span { width: 5px; height: 5px; background: var(--gold); border-radius: 50%; animation: blink 1.2s infinite; }
  .ai-typing span:nth-child(2) { animation-delay: 0.2s; }
  .ai-typing span:nth-child(3) { animation-delay: 0.4s; }
  @keyframes blink { 0%,80%,100% { opacity: 0.2; } 40% { opacity: 1; } }

  .quick-prompts { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 8px; }
  .qp { font-family: 'DM Mono', monospace; font-size: 10px; padding: 4px 10px; border-radius: 6px; background: var(--bg3); border: 1px solid var(--border); color: var(--text2); cursor: pointer; transition: all 0.15s; }
  .qp:hover { border-color: var(--gold); color: var(--gold); }

  .case-card { background: var(--bg2); border: 1px solid var(--border); border-radius: var(--radius); padding: 14px 16px; margin-bottom: 12px; }
  .case-card.complete { border-color: rgba(61,143,98,0.3); }
  .case-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
  .case-num { font-family: 'DM Mono', monospace; font-size: 10px; color: var(--gold); letter-spacing: 0.06em; }
  .case-title { font-size: 13px; font-weight: 500; color: var(--text); margin-bottom: 2px; }
  .case-launch { font-size: 11px; color: var(--text3); }
  .case-detail-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; font-size: 12px; }
  .case-detail-label { font-family: 'DM Mono', monospace; font-size: 9px; color: var(--text3); letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 3px; }
  .case-detail-val { color: var(--text2); line-height: 1.5; }
  .badge-complete { background: var(--green-bg); color: #60b080; padding: 2px 8px; border-radius: 4px; font-size: 10px; font-family: 'DM Mono', monospace; }
  .badge-upcoming { background: var(--blue-bg); color: #6090c8; padding: 2px 8px; border-radius: 4px; font-size: 10px; font-family: 'DM Mono', monospace; }

  .phase-card { border-radius: var(--radius); padding: 16px 18px; margin-bottom: 14px; }
  .phase-card.ph1 { background: var(--bg2); border: 1px solid rgba(112,80,160,0.3); }
  .phase-card.ph2 { background: var(--bg2); border: 1px solid rgba(61,143,98,0.3); }
  .phase-card.ph3 { background: var(--bg2); border: 1px solid rgba(201,122,58,0.3); }
  .phase-card.ph4 { background: var(--bg2); border: 1px solid rgba(184,60,46,0.3); }
  .phase-title { font-size: 15px; font-weight: 600; color: var(--text); margin-bottom: 4px; }
  .phase-sub { font-size: 11px; color: var(--text3); margin-bottom: 10px; font-family: 'DM Mono', monospace; }
  .phase-stats { display: grid; grid-template-columns: repeat(4,1fr); gap: 8px; margin-bottom: 10px; }
  .phase-stat { background: rgba(255,255,255,0.03); border-radius: 6px; padding: 8px 10px; }
  .phase-stat-label { font-size: 9px; color: var(--text3); text-transform: uppercase; letter-spacing: 0.08em; font-family: 'DM Mono', monospace; }
  .phase-stat-val { font-size: 14px; font-weight: 500; color: var(--text); margin-top: 2px; }
  .phase-desc { font-size: 12px; color: var(--text3); line-height: 1.65; }

  .portfolio-table { width: 100%; border-collapse: collapse; font-size: 12px; }
  .portfolio-table th { text-align: left; padding: 8px 12px; color: var(--text3); font-weight: 500; font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; font-family: 'DM Mono', monospace; border-bottom: 1px solid var(--border); }
  .portfolio-table td { padding: 10px 12px; border-bottom: 1px solid var(--border); vertical-align: middle; }
  .portfolio-table tr:last-child td { border-bottom: none; }
  .status-badge { padding: 2px 8px; border-radius: 4px; font-size: 10px; font-family: 'DM Mono', monospace; }
  .status-active { background: var(--green-bg); color: #60b080; }
  .status-ph2 { background: var(--blue-bg); color: #6090c8; }
  .status-ph3 { background: var(--amber-bg); color: #c8904a; }
  .status-ph3b { background: var(--amber-bg); color: #c8904a; opacity: 0.7; }
  .status-ph4 { background: var(--red-bg); color: #d06050; }

  .sop-box { background: var(--bg2); border: 1px solid var(--border); border-radius: var(--radius); padding: 14px 18px; margin-bottom: 20px; }
  .sop-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 10px; }
  .sop-item { font-size: 12px; color: var(--text3); line-height: 1.6; }
  .sop-item strong { color: var(--gold); font-weight: 500; display: block; margin-bottom: 2px; }

  .info-box { background: var(--bg2); border: 1px solid rgba(201,168,76,0.25); border-radius: var(--radius); padding: 14px 18px; margin-bottom: 20px; }
  .info-title { font-size: 12px; font-weight: 500; color: var(--gold); margin-bottom: 6px; }
  .info-body { font-size: 12px; color: var(--text3); line-height: 1.7; }

  /* ─── TRAJECTORY PANEL STYLES ─── */
  .traj-phase-label { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; padding: 3px 10px; border-radius: 20px; display: inline-block; margin-bottom: 10px; }
  .traj-bridge { background: var(--blue-bg); color: #6090c8; border: 1px solid rgba(61,111,168,0.3); }
  .traj-commit { background: var(--gold-dim2); color: var(--gold2); border: 1px solid rgba(201,168,76,0.35); }
  .traj-optimize { background: var(--purple-bg); color: #a070d0; border: 1px solid rgba(112,80,160,0.3); }
  .vid-row { background: var(--bg2); border: 1px solid var(--border); border-radius: 8px; padding: 12px 15px; margin-bottom: 6px; display: flex; gap: 12px; align-items: flex-start; }
  .vid-row.produced { border-color: rgba(61,143,98,0.3); background: rgba(61,143,98,0.04); }
  .vid-row.thesis { border-color: rgba(201,168,76,0.35); }
  .vid-row.canary { border-color: rgba(112,80,160,0.35); }
  .vid-num { font-family: 'DM Mono', monospace; font-size: 12px; color: var(--gold); min-width: 28px; flex-shrink: 0; margin-top: 1px; }
  .vid-body { flex: 1; }
  .vid-topic { font-size: 13px; font-weight: 500; color: var(--text); margin-bottom: 2px; }
  .vid-title { font-size: 12px; color: var(--gold2); font-style: italic; margin-bottom: 3px; }
  .vid-note { font-size: 11.5px; color: var(--text3); line-height: 1.5; }
  .vid-flag { font-family: 'DM Mono', monospace; font-size: 9px; padding: 2px 7px; border-radius: 3px; background: var(--gold-dim); color: var(--gold2); margin-left: 6px; vertical-align: middle; letter-spacing: 0.04em; }

  /* ─── PRODUCTION LOOP PANEL STYLES ─── */
  .step-flow { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 20px; }
  .step-chip { font-family: 'DM Mono', monospace; font-size: 10px; padding: 5px 10px; border-radius: 6px; background: var(--bg3); border: 1px solid var(--border); color: var(--text2); }
  .step-n { color: var(--gold); margin-right: 4px; }
  .short-row { background: var(--bg2); border: 1px solid var(--border); border-radius: 8px; padding: 12px 15px; margin-bottom: 6px; }
  .short-label { font-size: 13px; font-weight: 500; color: var(--text); margin-bottom: 3px; }
  .short-desc { font-size: 12px; color: var(--text3); line-height: 1.5; }
  .gate-row { display: flex; align-items: flex-start; gap: 14px; padding: 10px 0; border-bottom: 1px solid var(--border); }
  .gate-row:last-child { border-bottom: none; }
  .gate-label { font-family: 'DM Mono', monospace; font-size: 10px; color: var(--gold); white-space: nowrap; min-width: 80px; flex-shrink: 0; margin-top: 2px; }
  .gate-desc { font-size: 12.5px; color: var(--text2); line-height: 1.55; }

  /* ─── CHANNEL LINEUP STYLES ─── */
  .lineup-item { background: var(--bg2); border: 1px solid var(--border); border-radius: var(--radius); padding: 14px 16px; margin-bottom: 8px; display: flex; gap: 14px; align-items: flex-start; }
  .lineup-item.lead { border-color: rgba(201,168,76,0.4); background: linear-gradient(135deg, var(--bg2), rgba(201,168,76,0.03)); }
  .lineup-item.ch1 { border-color: rgba(61,143,98,0.3); }
  .lineup-rank { font-family: 'Playfair Display', serif; font-size: 24px; font-weight: 900; color: var(--gold); line-height: 1; min-width: 32px; flex-shrink: 0; margin-top: 2px; }
  .lineup-body { flex: 1; }
  .lineup-name { font-size: 14px; font-weight: 600; color: var(--text); margin-bottom: 3px; }
  .lineup-role { font-size: 12px; color: var(--text3); margin-bottom: 7px; line-height: 1.5; }
  .lineup-tags { display: flex; gap: 5px; flex-wrap: wrap; }
  .ltag { font-family: 'DM Mono', monospace; font-size: 10px; padding: 2px 8px; border-radius: 4px; background: rgba(255,255,255,0.05); color: var(--text2); }
  .ltag-rpm { background: var(--gold-dim); color: var(--gold2); }
  .ltag-live { background: var(--green-bg); color: #60b080; }
  .ltag-blue { background: var(--blue-bg); color: #6090c8; }

  .panel { padding-bottom: 100px; }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 2px; }

  /* ─── MOBILE ─── */
  .mobile-bar { display: none; }
  .mobile-nav { display: none; }
  .mobile-scrim { display: none; }

  @media (max-width: 820px) {
    html, body, #root { font-size: 15px; overflow: auto; }
    .app { flex-direction: column; height: auto; min-height: 100vh; }
    .sidebar {
      position: fixed; top: 0; left: 0; bottom: 0; z-index: 60;
      width: 80vw; max-width: 300px;
      transform: translateX(-100%); transition: transform 0.25s ease;
      box-shadow: 0 0 40px rgba(0,0,0,0.6);
    }
    .sidebar.open { transform: translateX(0); }
    .mobile-scrim.show { display: block; position: fixed; inset: 0; background: rgba(0,0,0,0.55); z-index: 55; }
    .mobile-bar {
      display: flex; align-items: center; justify-content: space-between;
      position: sticky; top: 0; z-index: 50;
      background: var(--bg2); border-bottom: 1px solid var(--border);
      padding: 12px 16px;
    }
    .mobile-bar .mb-name { font-family: 'Playfair Display', serif; font-size: 17px; font-weight: 900; color: var(--gold); letter-spacing: 0.05em; }
    .mobile-bar .mb-burger { font-size: 22px; color: var(--text); background: none; border: none; cursor: pointer; line-height: 1; padding: 4px 8px; }
    .main { overflow: visible; }
    .panel { padding: 20px 16px 120px; }
    .panel-title { font-size: 21px; }
    .stat-grid { grid-template-columns: repeat(2, 1fr); }
    .ov-grid { grid-template-columns: 1fr; }
    .case-detail-grid { grid-template-columns: 1fr; }
    .ai-dock, .ai-panel { left: 0 !important; }
    .ai-dock { bottom: 56px; }
    .mobile-nav {
      display: flex; position: fixed; bottom: 0; left: 0; right: 0; z-index: 50;
      background: var(--bg2); border-top: 1px solid var(--border);
      height: 56px;
    }
    .mobile-nav .mn-item {
      flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center;
      gap: 2px; color: var(--text2); font-size: 9px; cursor: pointer; border: none; background: none;
      letter-spacing: 0.04em;
    }
    .mobile-nav .mn-item.active { color: var(--gold); }
    .mobile-nav .mn-icon { font-size: 16px; line-height: 1; }
    .task-card { padding: 14px; }
    .nav-item { padding: 12px 18px; font-size: 14px; }
  }

  @media (max-width: 420px) {
    .stat-grid { grid-template-columns: 1fr; }
  }
`;

// ─── DATA ──────────────────────────────────────────────────────────────────

const SCHEDULE = {
  "2026-06-05": ["🎞️ Case #001 — Full footage hunt (7–10pm) using the footage map", "🎙️ Confirm Case #001 voiceover is exported"],
  "2026-06-06": ["✅ The Investigator designed (v5 final) + transparent PNG", "✅ HeyGen Creator set up + Brad voice imported via ElevenLabs API", "✅ All 5 sections generated — Investigator talking, lip-sync confirmed", "✅ 5 HeyGen MP4s saved to HeyGen Character folder"],
  "2026-06-07": ["🎬 Pre-edit check + DaVinci assembly + Ken Burns stills", "📝 Character overlays + text overlays + captions + color grade", "🖼️ Thumbnail (Version A + B) + channel trailer", "💾 Export main video + 3 Shorts"],
  "2026-06-08": ["👁️ QC watch-through + channel optimization", "🔍 SEO title + description + tags + affiliate links", "⬆️ Upload attempt + AI disclosure (interrupted by account lockout)"],
  "2026-06-09": ["✅ Google account appeal approved", "✅ 3 Shorts cut + captioned (CapCut Pro added)", "✅ FINAL4 exported — burned-in captions on main video"],
  "2026-06-10": ["✅ New channel LIVE — @vanishedhistorych on watchvanished@gmail.com · isolated Chrome profile · branded + playlist created", "✅ FINAL4 uploaded — thumbnail, SEO title, description, tags set → scheduled Thu 2pm PST", "✅ 3 Shorts uploaded → scheduled 2:30 / 4:00 / 6:00pm PST", "✅ Old YouTube channel on majorandkae@gmail.com DELETED — multi-account signal permanently removed", "✅ Chrome profiles locked — Claude extension lives in Work profile ONLY, never Vanished", "✅ Case #002 — Deep research + full script + upload package done (Göbekli Tepe)"],
  "2026-06-11": ["🚀 CASE #001 LIVE 2pm PST — post pinned comment within 5 min (saved in Cases panel)", "📱 Shorts auto-publish 2:30 / 4:00 / 6:00pm — after 2pm add related-video link to each Short", "🌐 Reddit seeding — r/AncientCivilizations + r/UnsolvedMysteries", "💬 Reply to every comment", "🎙️ Case #002 — HeyGen Cole clips (Göbekli Tepe) ✅ Done"],
  "2026-06-12": ["✍️ Case #003 — Research + script (The Minoans)", "🎞️ Case #002 — Footage", "📊 Weekly analytics check"],
  "2026-06-13": ["🎙️ Case #003 — Voiceover", "🎬 Case #002 — Edit + thumbnail", "📱 Case #002 — 3 Shorts"],
  "2026-06-14": ["✍️ Case #004 — Research + script (Bronze Age Collapse)", "⬆️ Case #002 — Upload + schedule", "🎞️ Case #003 — Footage", "🖼️ Case #001 — Version B thumbnail"],
  "2026-06-15": ["📹 CASE #002 GOES LIVE 2pm — pinned comment + 3 Shorts", "🌐 Reddit + Quora seeding (Case #002)", "🎙️ Case #004 — Voiceover", "🎬 Case #003 — Edit", "📱 Case #003 — 3 Shorts", "💬 Comment replies"],
  "2026-06-16": ["⬆️ Case #003 — Upload + schedule", "🎞️ Case #004 — Footage", "🎭 HeyGen — character generation Case #004"],
  "2026-06-17": ["✍️ Case #005 — Research + script (Mansa Musa & Mali)", "📹 CASE #003 GOES LIVE 2pm", "🌐 Reddit + Quora seeding (Case #003)", "🎬 Case #004 — Edit", "📱 Case #004 — 3 Shorts", "💬 Comment replies"],
  "2026-06-18": ["⬆️ Case #004 — Upload + schedule", "🎙️ Case #005 — Voiceover", "🖼️ Case #002 — Version B thumbnail"],
  "2026-06-19": ["✍️ Case #006 — Research + script (Khmer Empire / Angkor)", "📹 CASE #004 GOES LIVE 2pm", "🌐 Reddit + Quora seeding (Case #004)", "🎞️ Case #005 — Footage", "📊 Weekly analytics check", "💬 Comment replies"],
  "2026-06-20": ["🎙️ Case #006 — Voiceover", "🎬 Case #005 — Edit", "🎭 HeyGen — character Cases #005/#006/#007", "📱 Case #005 — 3 Shorts", "🖼️ Case #003 — Version B thumbnail"],
  "2026-06-21": ["✍️ Case #007 — Research + script (Rome's Currency Collapse)", "⬆️ Case #005 — Upload + schedule", "🎞️ Case #006 — Footage"],
  "2026-06-22": ["📹 CASE #005 GOES LIVE 2pm", "🌐 Reddit + Quora seeding (Case #005)", "🎙️ Case #007 — Voiceover", "🎬 Case #006 — Edit", "📱 Case #006 — 3 Shorts", "💬 Comment replies"],
  "2026-06-23": ["⬆️ Case #006 — Upload + schedule", "🎞️ Case #007 — Footage"],
  "2026-06-24": ["✍️ Case #008 — Research + script (The Maya Collapse)", "📹 CASE #006 GOES LIVE 2pm", "🌐 Reddit + Quora seeding (Case #006)", "🎬 Case #007 — Edit", "📱 Case #007 — 3 Shorts", "💬 Comment replies"],
  "2026-06-25": ["⬆️ Case #007 — Upload + schedule", "🎙️ Case #008 — Voiceover", "🖼️ Case #001 — A/B thumbnail check (results)"],
  "2026-06-26": ["✍️ Case #009 — Research + script (Templar Treasure)", "📹 CASE #007 GOES LIVE 2pm", "🌐 Reddit + Quora seeding (Case #007)", "🎞️ Case #008 — Footage", "🎭 HeyGen — character Case #008", "📊 Weekly analytics check", "💬 Comment replies"],
  "2026-06-27": ["🎙️ Case #009 — Voiceover", "🎬 Case #008 — Edit", "🎭 HeyGen — character Cases #009/#010", "📱 Case #008 — 3 Shorts", "🖼️ Version B thumbnails — Cases #004/#005/#006"],
  "2026-06-28": ["✍️ Case #010 — Research + script (South Sea Bubble)", "⬆️ Case #008 — Upload + schedule", "🎞️ Case #009 — Footage"],
  "2026-06-29": ["📹 CASE #008 GOES LIVE 2pm", "🌐 Reddit + Quora seeding (Case #008)", "🎙️ Case #010 — Voiceover", "🎬 Case #009 — Edit", "📱 Case #009 — 3 Shorts", "🖼️ Case #002 — A/B check", "💬 Comment replies"],
  "2026-06-30": ["⬆️ Case #009 — Upload + schedule", "🎞️ Case #010 — Footage"],
  "2026-07-01": ["✍️ Case #011 — Research + script (Easter Island)", "📹 CASE #009 GOES LIVE 2pm", "🌐 Reddit + Quora seeding (Case #009)", "🎬 Case #010 — Edit", "📱 Case #010 — 3 Shorts", "💰 Monthly monetization milestone check", "🖼️ Case #003 — A/B check", "💬 Comment replies"],
  "2026-07-02": ["⬆️ Case #010 — Upload + schedule", "🎙️ Case #011 — Voiceover"],
  "2026-07-03": ["✍️ Case #012 — Research + script (Indus Valley Revisited)", "📹 CASE #010 GOES LIVE 2pm", "🌐 Reddit + Quora seeding (Case #010)", "🎞️ Case #011 — Footage", "🎭 HeyGen — character Cases #011/#012", "📊 Weekly analytics check", "💬 Comment replies"],
  "2026-07-04": ["🎙️ Case #012 — Voiceover", "🎬 Case #011 — Edit", "📱 Case #011 — 3 Shorts", "🖼️ Version B thumbnails — Cases #007/#008/#009"],
  "2026-07-05": ["⬆️ Case #011 — Upload + schedule", "🎞️ Case #012 — Footage"],
  "2026-07-06": ["📹 CASE #011 GOES LIVE 2pm", "🎬 Case #012 — Edit", "📱 Case #012 — 3 Shorts", "📊 Monthly Business Review #1", "🔍 vidIQ outlier analysis", "📅 Month 2 content planning", "💬 Comment replies"],
  "2026-07-07": ["⬆️ Case #012 — Upload + schedule", "🌐 Reddit + Quora seeding (Case #011)"],
  "2026-07-08": ["📹 CASE #012 GOES LIVE 2pm — final video of Month 1 🎉", "🌐 Reddit + Quora seeding (Case #012)", "🖼️ A/B check — Cases #004/#005/#006", "💬 Comment replies"],
};

function recurringFor(dateStr, scheduled = []) {
  const d = new Date(dateStr + "T12:00:00");
  const day = d.getDay();
  const dom = d.getDate();
  const firstMonday = day === 1 && dom <= 7;
  const out = [];
  const has = (kw) => [...scheduled, ...out].some(s => s.toLowerCase().includes(kw));
  // Growth Systems rhythms (also shown in Production Loop operating rhythm)
  if ([1,3,5].includes(day) && !has("comment repl")) out.push("💬 Comment reply session — 8:30pm, ~15 min");
  if (day === 5 && !has("analytics")) out.push("📊 Weekly analytics check — 6pm · views, CTR, retention, traffic");
  if (dom === 1 && !has("monetization")) out.push("💰 Monetization milestone check — track toward 500 subs / YPP");
  if (firstMonday && !has("business review")) out.push("📈 Monthly Business Review — analytics + revenue + phase triggers");
  if (firstMonday && !has("outlier")) out.push("🔍 vidIQ outlier analysis — find breakout topics before making them");
  if (firstMonday && !has("content planning")) out.push("📅 Next-month content planning — lock the next 12 cases");
  // Single-channel weekly SOP (SOPs & Workflow panel)
  const sop = {
    1: ["voiceover", "🎙️ SOP — Voiceover + footage day (3–4 hrs)"],
    2: ["edit", "🎬 SOP — DaVinci edit day (2–3 hrs)"],
    3: ["upload", "🖼️ SOP — Thumbnail + upload day (2–3 hrs)"],
    4: ["seeding", "🌐 SOP — Community + distribution day (1–2 hrs)"],
    5: ["analytics", "📋 SOP — Analytics + next-week prep (2–3 hrs)"],
    6: ["batch", "⚡ SOP — Batch production sprint (4–6 hrs)"],
  }[day];
  if (sop && !has(sop[0])) out.push(sop[1]);
  return out;
}

const TASKS = {
  wed: [
    { id: "w1", name: "Create your YouTube channel", desc: "youtube.com → profile → Create a channel → Use custom name → 'Vanished History'. Do NOT use your personal account name.", links: [{label:"youtube.com →", url:"https://youtube.com"}], tags:[{t:"Free",c:"free"},{t:"10 min",c:"time"},{t:"Do first",c:"urgent"}] },
    { id: "w2", name: "Write and add channel description", desc: "YouTube Studio → Customization → Basic Info. Description: 'We investigate lost civilizations, vanished empires, and the wealth and power that disappeared from history. New videos Mon, Wed, Fri.'", tags:[{t:"Free",c:"free"},{t:"15 min",c:"time"}] },
    { id: "w3", name: "Design logo and channel banner in Canva", desc: "Logo 800×800px: dark bg (#1a1a2e), bold serif font, magnifying glass icon. Banner 2560×1440px: same dark bg, channel name + tagline + schedule. White + amber/gold text only.", links:[{label:"canva.com →", url:"https://canva.com"}], tags:[{t:"Free",c:"free"},{t:"45–60 min",c:"time"}] },
    { id: "w4", name: "Upload logo, banner + set watermark", desc: "YouTube Studio → Customization → Branding tab. Upload logo and banner. Set watermark to your logo, display entire video. Hit Publish.", tags:[{t:"Free",c:"free"},{t:"10 min",c:"time"}] },
    { id: "w5", name: "Set up Google AdSense", desc: "adsense.google.com → Get started → create account with your channel email. Takes 1–2 days to verify — start tonight to avoid delays at monetization.", links:[{label:"adsense.google.com →", url:"https://adsense.google.com"}], tags:[{t:"Free",c:"free"},{t:"20 min",c:"time"},{t:"1–2 day delay!",c:"urgent"}] },
    { id: "w6", name: "Create all tool accounts", desc: "Sign up using your channel email: vidIQ (connect to YouTube), HeyGen ($50/mo Pro — Cole lip-sync + voiceover), Canva. Download DaVinci Resolve 21 (free) and CapCut (free).", links:[{label:"vidiq.com →",url:"https://vidiq.com"},{label:"heygen.com →",url:"https://heygen.com"},{label:"blackmagicdesign.com →",url:"https://www.blackmagicdesign.com/products/davinciresolve"}], tags:[{t:"~$50/mo",c:"paid"},{t:"30 min",c:"time"}] },
  ],
  thu: [
    { id: "t1", name: "Delete old footage + map script to visual needs", desc: "Delete all previously downloaded footage. Map each of the 5 script sections to specific visual needs before searching Friday. S1 Hook: dramatic ruins. S2 Background: Mohenjo-daro brick streets, maps. S3 Mystery: stone seals, artifacts. S4 Theories: drought/dried riverbeds. S5 Ending: wide atmospheric landscapes.", tags:[{t:"Free",c:"free"},{t:"8:30–9:00pm",c:"time"}] },
    { id: "t2", name: "Research the Indus Valley + generate script", desc: "Ask Claude to research: most shocking facts, the 4 collapse theories, why no writing has been deciphered, the simultaneous collapse. Then generate full 5-section voiceover script (1,600–1,800 words) + 4 SEO title options + 200-word description + chapters + pinned comment.", tags:[{t:"Claude",c:"free"},{t:"6:00–8:30pm",c:"time"},{t:"Most critical",c:"urgent"}] },
  ],
  fri: [
    { id: "f1", name: "Full section-by-section footage search", desc: "Using Thursday's visual map: find cold open clip FIRST (one dramatic ruins shot, 4 seconds). Then by section. Archive.org: 'Mohenjo-daro', 'Indus Valley', 'Harappa'. Wikimedia: maps, diagrams, seal photos. Pexels: 'ancient ruins', 'dried riverbed', 'desert landscape'. 25–35 clips total.", links:[{label:"archive.org →",url:"https://archive.org"},{label:"Wikimedia →",url:"https://commons.wikimedia.org"},{label:"pexels.com →",url:"https://pexels.com"}], tags:[{t:"Free",c:"free"},{t:"7:00–10:00pm",c:"time"}] },
    { id: "f2", name: "Generate Cole clips in HeyGen (voiceover + lip-sync)", desc: "heygen.com → Cole (Photo Avatar) → Use in video → Add a script → voice: Cipher House (Brad). ⚠️ Remove all '...' before pasting — HeyGen vocalizes ellipses. 5 sections → download Cole_S1–S5.mp4. Audio on A1 in DaVinci · Cole video on V2.", links:[{label:"heygen.com →",url:"https://heygen.com"}], tags:[{t:"$50/mo",c:"paid"},{t:"6:00–9:00pm",c:"time"}] },
  ],
  sat: [
    { id: "s1", name: "Design The Investigator + export transparent PNG", desc: "Character locked at v5 final: male, serious/mysterious, dark trench coat (#4a3828), gold belt (#c9a84c), two simple oval hands, grounded head/neck, pale skin (#e8d5b0), dark hair (#2a1f14). Exported as transparent-background PNG (880×1600px).", tags:[{t:"Done",c:"free"},{t:"Locked v5",c:"urgent"}] },
    { id: "s2", name: "Set up HeyGen + import Brad voice + create Cole", desc: "HeyGen Pro ($50/mo). Avatar → Add a look → upload VH_Character_V1_Upscaled.png → Cole created. Voice: Import from 3rd party → ElevenLabs → paste API key → Brad voice named 'Cipher House'. ElevenLabs cancelled Jun 11 — voice already imported and saved in HeyGen permanently.", tags:[{t:"$50/mo",c:"paid"},{t:"Cole debut Case #002",c:"urgent"}] },
    { id: "s3", name: "Generate all 5 sections in HeyGen", desc: "Avatar → Quick create. Avatar: The Investigator · Voice: Hey Its Brad · 720p. Paste each script section. Generate all 5: Hook, Background, Mystery, Theories, Ending. Lip-sync confirmed. Download each MP4.", tags:[{t:"HeyGen",c:"paid"},{t:"5 sections",c:"time"}] },
    { id: "s4", name: "Save all 5 HeyGen MP4s", desc: "Save to 'Video 1 — Indus Valley / HeyGen Character': VH_Case001_S1_Hook_HeyGen.mp4 · S2_Background · S3_Mystery · S4_Theories · S5_Ending.", tags:[{t:"Done",c:"free"},{t:"5 MP4s",c:"time"}] },
  ],
  sun: [
    { id: "su1", name: "Pre-edit check + DaVinci assembly", desc: "Audio check: play all 5 HeyGen MP4s back to back. Footage verify: ☐ Cold open ☐ S1 Hook clips ☐ S2 Background clips ☐ S3 Mystery clips ☐ S4 Theories clips ☐ S5 Ending clips. DaVinci Resolve → New Project → 1920×1080 24fps. Import all assets. Timeline: audio track first → footage on V1 (Investigator overlays later removed — final video faceless). Cold open: 4-second dramatic ruins shot, music only.", tags:[{t:"Free",c:"free"},{t:"7:00–10:00am",c:"time"},{t:"Cold open first",c:"urgent"}] },
    { id: "su2", name: "Text overlays + captions + color grade (faceless)", desc: "Faceless final cut for Case #001 — Investigator overlays removed. Text overlays: 5 MILLION PEOPLE · NO DECIPHERED SCRIPT · 1,000+ YEARS · 113-YEAR DROUGHT · CASE #001. Captions: CapCut Pro burned-in pass (FINAL4). Color grade: warm + slightly desaturated on footage.", tags:[{t:"Free",c:"free"},{t:"10:00am–12:00pm",c:"time"}] },
    { id: "su3", name: "Thumbnail (A + B) + channel trailer", desc: "Canva 1280×720px. Version A: dark bg + Cole + bold gold text + CASE #001 + ruins bg. Version B: change ONE thing (expression OR text). Channel trailer: deferred to Case #002+ once the HeyGen character is live.", links:[{label:"canva.com →",url:"https://canva.com"}], tags:[{t:"Free",c:"free"},{t:"12:00–2:30pm",c:"time"}] },
    { id: "su4", name: "Export main video + 3 Shorts", desc: "DaVinci Resolve → Deliver page → YouTube preset 1080p H.264 → save VH_Case001_IndusValley_FINAL4.mp4 (FINAL2 = music swap after Pixabay claim · FINAL3 = re-edit · FINAL4 = CapCut burned-in captions). While rendering: create 3 Shorts in 9:16 vertical format. Short #1 Hook · Short #2 Mystery reveal · Short #3 Ending CTA.", tags:[{t:"Free",c:"free"},{t:"2:30–5:00pm",c:"time"}] },
  ],
  mon: [
    { id: "m1", name: "QC watch-through + channel optimization", desc: "Upload VH_Case001_IndusValley_FINAL4.mp4 as Unlisted. Watch the entire video. Check: ☐ audio sync ☐ burned-in captions readable ☐ text overlays ☐ music at -20dB (Kevin MacLeod) ☐ pacing cuts every ~7s. Then: YouTube Studio → channel keywords → update channel description → create playlist 'Vanished History — The Cases'.", tags:[{t:"Free",c:"free"},{t:"7:00–10:00am",c:"time"},{t:"Never skip QC",c:"urgent"}] },
    { id: "m2", name: "SEO title + description + tags + affiliate links", desc: "Title: 'The Indus Valley Civilization: 5 Million People Vanished and No One Knows Why' (vidIQ-optimized). Description hook: '5 million people. 1,000 cities. All gone — simultaneously. No war. No plague. No explanation.' Add 200–300 words + chapters + affiliate links.", tags:[{t:"Free",c:"free"},{t:"10:00am–12:00pm",c:"time"}] },
    { id: "m3", name: "✅ DONE — Uploaded + scheduled Thu Jun 11 · 2pm PST on @vanishedhistorych", desc: "☐ 1080p no black bars ☐ Audio clear ☐ Captions on ☐ Text overlays present ☐ Thumbnail A uploaded ☐ SEO title ☐ Description 200–300 words + keywords + chapters (affiliate link from Case #004 onward) ☐ 8–12 tags ☐ Category: Education ☐ End screen ☐ Playlist. ⚠️ AI DISCLOSURE: Details → 'Altered or synthetic content' → YES. Scheduled: Thursday June 11, 2026, 2:00 PM PST.", tags:[{t:"Free",c:"free"},{t:"12:00–2:00pm",c:"time"},{t:"⚠️ AI Disclosure",c:"urgent"}] },
  ],
  launch: [
    { id: "l1", name: "2pm — Case #001 goes live · Post pinned comment immediately", desc: "Within 5 minutes post the locked pinned comment (full text saved in the Cases panel under Case #001): \"Something doesn't add up. The climate theory is the most convincing — four droughts, one lasting 113 years. But archaeologists keep finding cities that were already being abandoned before the worst droughts hit. Which means either the climate wasn't the cause — or something else triggered the collapse first, and the drought finished it off. No invasion evidence. No mass graves. No signs of disease. A civilization of 5 million people with better plumbing than 1800s London just... quietly unraveled. What do you think started it? 👇\" Pin it.", tags:[{t:"Within 5 min",c:"urgent"},{t:"Free",c:"free"}] },
    { id: "l2", name: "Shorts auto-publish 2:30 / 4:00 / 6:00pm — add related-video links after 2pm", desc: "All 3 Shorts already uploaded + scheduled with AI disclosure: 2:30pm 'They just stopped. No war. No plague. No explanation.' · 4:00pm 'One drought lasted 113 years. Another lasted 164.' · 6:00pm 'We still can't read a single word they ever wrote'. After the main video is live: open each Short → Video elements → Add related video → link Case #001.", tags:[{t:"After 2pm",c:"urgent"},{t:"Free",c:"free"}] },
    { id: "l3", name: "Reddit seeding — r/AncientCivilizations + r/UnsolvedMysteries", desc: "Find active threads about the Indus Valley. Engage genuinely first — answer a question or add context. Then share your video as a follow-up resource. Never just drop a link.", tags:[{t:"Free",c:"free"},{t:"Ongoing",c:"time"}] },
    { id: "l4", name: "Reply to every comment for the first 24 hours", desc: "Check YouTube Studio analytics: CTR, watch time, impressions at 24hr and 48hr. Reply to every comment. Early engagement signals quality to the algorithm.", tags:[{t:"Free",c:"free"},{t:"Ongoing",c:"time"}] },
  ],
  c002: [
    { id: "c002s", name: "Case #002 — Research + script (Göbekli Tepe)", desc: "Ask Claude: the 11,600-year-old temple complex built 6,000 years before Stonehenge by 'hunter-gatherers', only 5% excavated, deliberately buried — by whom and why? Full 5-section script + SEO titles + description + chapters + pinned comment.", tags:[{t:"Claude",c:"free"},{t:"Wed Jun 10 · 5pm",c:"time"}] },
    { id: "c002v", name: "Case #002 — HeyGen clips ✅ (Göbekli Tepe)", desc: "DONE Jun 11. HeyGen · Cole (Photo Avatar) · Cipher House voice (Brad). 5 sections generated. ⚠️ Edit day: trim 04_Theories tail + weird sound in 05_Ending before 'I reed'. ElevenLabs MP3s also recorded as backup — use either for A1 audio.", tags:[{t:"HeyGen",c:"paid"},{t:"Thu Jun 11 · Done ✅",c:"time"}] },
    { id: "c002f", name: "Case #002 — Footage (Göbekli Tepe)", desc: "Cold open: T-shaped pillars emerging from the Turkish hillside. S1: excavation site (Wikimedia). S2: Anatolian plateau, hunter-gatherer context. S3: carved pillar close-ups, animal reliefs. S4: deliberate-burial dig layers. S5: wide site aerial at dusk. 25–35 clips.", tags:[{t:"Free",c:"free"},{t:"Fri Jun 12 · 5pm",c:"time"}] },
    { id: "c002e", name: "Case #002 — Edit + thumbnail + 3 Shorts (Göbekli Tepe)", desc: "Cole is already in HeyGen (character debut). DaVinci Resolve: 4s cold open → footage on V1 + Cole overlay on V2 (LumaKeyer High 0.1, Zoom 0.6, X:0.600 Y:-0.350) → text overlays: 11,600 YEARS OLD · 6,000 YEARS BEFORE STONEHENGE · ONLY 5% EXCAVATED · A HIDDEN TRIANGLE → export → CapCut Pro burned-in captions. Thumbnail: Cole (shocked/awe). 3 Shorts.", tags:[{t:"Free",c:"free"},{t:"Sat Jun 13 · 7am",c:"time"}] },
    { id: "c002u", name: "Case #002 — Upload + schedule (Mon Jun 15 2pm PST)", desc: "Full upload checklist. ⚠️ AI DISCLOSURE: Details → Altered or synthetic content → CHECK. Schedule: June 15 at 2:00 PM PST.", tags:[{t:"Free",c:"free"},{t:"Sun Jun 14 · 10am",c:"time"},{t:"⚠️ AI Disclosure",c:"urgent"}] },
  ]
};

const TRACKER_STEPS = [
  { key:"script",    icon:"✍️", label:"Research + script",          note:"Claude researches + writes 5-section script · RULE: answer the core question in first 30–60s with a specific name/date/place · SEO titles · 200-word description · chapters · pinned comment" },
    { key:"voiceover", icon:"🎙️", label:"Voiceover",                  note:"HeyGen · Cole (Photo Avatar) · Cipher House voice (Brad) · Remove all '...' before pasting · 5 sections → 5 MP4 clips · audio on A1, Cole video on V2 in DaVinci" },
  { key:"footage",   icon:"🎞️", label:"Footage hunt",               note:"Cold open first · section-by-section · 25–35 clips · archive.org / Wikimedia / Pexels" },
  { key:"heygen",    icon:"🎭", label:"HeyGen — Cole clips",   note:"Cole clips generated WITH the voiceover in one HeyGen session (audio + lip-sync together) · this step is a pre-edit-day checkpoint: verify all 5 Cole MP4s are saved before edit day" },
  { key:"edit",      icon:"🎬", label:"Edit + Version A thumbnail",  note:"DaVinci Resolve → footage background + character overlay → text overlays → export FINAL.mp4 → CapCut Pro burned-in captions → Canva thumbnail A" },
  { key:"shorts",    icon:"📱", label:"3 Shorts created",            note:"Title = most compelling line from that clip + #Shorts · desc 'The full story: [link]' · 9:16 · CapCut burned-in captions · remixing ON · playlist · no custom thumbnail/tags" },
  { key:"upload",    icon:"⬆️", label:"Upload + schedule",           note:"QC watch-through · full description + SEO + chapters · playlist · ⚠️ AI DISCLOSURE → YES · schedule main 2pm PST + 3 Shorts 2:30 / 4:00 / 6:00pm" },
  { key:"launch",    icon:"🚀", label:"Launch day",                  note:"Main live 2pm · pinned comment within 5 min · Shorts auto-publish 2:30 / 4:00 / 6:00pm · after 2pm add related-video link to each Short · Reddit seeding" },
  { key:"seeding",   icon:"🌐", label:"Reddit + Quora seeding",      note:"Engage genuinely first, then share · topic-specific subreddits · high-view Quora question + link" },
  { key:"comments",  icon:"💬", label:"Comment replies (48 hrs)",    note:"Reply to every comment in first 24–48 hrs · heart the rest · pin best viewer theory" },
  { key:"thumbB",    icon:"🖼️", label:"Version B thumbnail",         note:"3–5 days after launch · duplicate Version A · change ONE thing (expression OR text) · start Test & Compare" },
  { key:"abcheck",   icon:"📊", label:"A/B check (14 days)",         note:"14 days after launch · check Test & Compare results · keep the winning thumbnail permanently" },
];

const GROWTH_SYSTEMS = [
  { key:"analytics",  icon:"📊", label:"Weekly analytics check",          cadence:"Every Friday",       note:"Views, CTR, watch time, traffic sources · note overperformers + low-CTR videos to fix" },
  { key:"comments_w", icon:"💬", label:"Comment reply session",           cadence:"Mon / Wed / Fri",    note:"Zero unanswered comments in Month 1 · strongest early algorithmic signal there is" },
  { key:"monetize",   icon:"💰", label:"Monetization milestone check",    cadence:"1st of month",       note:"500 subs → Channel Membership · 1,000 subs + 4,000 hrs → apply YPP immediately" },
  { key:"vidiq",      icon:"🔍", label:"vidIQ outlier analysis",          cadence:"First Monday",       note:"Run outlier tool on Knowledgia, Voices of the Past, Dark Docs · find breakout topics before making them" },
  { key:"review",     icon:"📈", label:"Monthly Business Review",         cadence:"First Monday",       note:"Analytics + revenue + tool stack + phase-trigger check · Claude builds next month's calendar" },
  { key:"planning",   icon:"📅", label:"Next-month content planning",     cadence:"Monthly",            note:"Lock next 12 cases · data-driven topic selection from real analytics" },
];

const CASES = [
  { num:"001", title:"Indus Valley Civilization", launch:"Thu Jun 11", status:"complete", overlays:"5 MILLION PEOPLE · NO DECIPHERED SCRIPT · 1,000+ YEARS · 113-YEAR DROUGHT", cold:"Dramatic ancient ruins wide shot · 4s · music only", footage:"Mohenjo-daro ruins · dried riverbeds · Indus seals · archaeological dig · desert landscapes", expression:"Faceless video · Cole on thumbnail", reddit:"r/AncientCivilizations · r/history", schedule:"SCHEDULED ✓ Thu Jun 11 2pm PST on @vanishedhistorych — FINAL4 uploaded, thumbnail + SEO set, playlist added", shorts:"2:30pm 'They just stopped. No war. No plague. No explanation.' · 4:00pm 'One drought lasted 113 years. Another lasted 164.' · 6:00pm 'We still can't read a single word they ever wrote' — all scheduled · add related-video links after 2pm", pinnedComment:"Something doesn't add up. The climate theory is the most convincing — four droughts, one lasting 113 years. But archaeologists keep finding cities that were already being abandoned before the worst droughts hit. Which means either the climate wasn't the cause — or something else triggered the collapse first, and the drought finished it off. No invasion evidence. No mass graves. No signs of disease. A civilization of 5 million people with better plumbing than 1800s London just... quietly unraveled. What do you think started it? 👇" },
  { num:"002", title:"Göbekli Tepe", launch:"Mon Jun 15", status:"upcoming", overlays:"11,600 YEARS OLD · 6,000 YEARS BEFORE STONEHENGE · ONLY 5% EXCAVATED · BURIED FOR 10,000 YEARS · A HIDDEN TRIANGLE", cold:"Aerial push-in on T-shaped pillars emerging from Turkish hillside at dusk · 4s · music only", footage:"Göbekli Tepe excavation (Wikimedia) · Turkish plateau · carved pillars close-up · Pillar 43 Vulture Stone · Karahan Tepe · archaeological dig layers", expression:"Shocked/awe · Cole's debut", reddit:"r/AncientCivilizations · r/archaeology", schedule:"✅ Script + SEO package done Jun 10 · HeyGen Cole clips + VO Jun 11 (done) · Footage Jun 12 · Edit Jun 13 · Upload Jun 14 · ⚠️ Trim 04_Theories.mp3 tail + 05_Ending.mp3 weird sound before edit", shorts:"S1 'They called it a cemetery. It was the oldest structure on Earth' · S2 'A perfect triangle, drawn 11,000 years before blueprints existed' · S3 'After 11,000 years... one of them is looking back' — schedule 2:30/4:00/6:00pm on launch day", pinnedComment:"Here's what I can't get past. We're told 'simple' hunter-gatherers built this — no writing, no math, no architects. But the three oldest enclosures form a perfect equilateral triangle, accurate to 25 centimeters. That's not improvisation. That's a blueprint... drawn by someone 11,000 years before blueprints existed. And then, right as farming took over the world — the thing this site may have started — they abandoned it. Forever. So what was it? A temple? The first town? Something else entirely? Drop your theory below 👇 I read every single one." },
  { num:"003", title:"The Minoans", launch:"Wed Jun 17", status:"upcoming", overlays:"EUROPE'S FIRST SUPERPOWER · 1,500 YEARS OF WEALTH · THERA ERUPTION · PALACES WITH PLUMBING", cold:"Knossos palace ruins wide shot — Mediterranean light", footage:"Knossos ruins (Wikimedia) · Crete coastline (Pexels) · Minoan frescoes · Santorini caldera · ancient trade-route maps", expression:"Serious/knowing", reddit:"r/AncientCivilizations · r/history", schedule:"Script Jun 12 · VO Jun 13 · Footage Jun 14 · Edit Jun 15 · Upload Jun 16" },
  { num:"004", title:"The Bronze Age Collapse", launch:"Fri Jun 19", status:"upcoming", overlays:"1177 BC · 8 CIVILIZATIONS · 50 YEARS · TOTAL SYSTEM FAILURE", cold:"Storm over the Mediterranean or burning ancient city — ominous", footage:"Hittite & Mycenaean ruins (Wikimedia) · Sea Peoples reliefs · Mediterranean coastlines (Pexels) · ancient trade-network maps", expression:"Grave/intense · THESIS VIDEO — announces the new identity", reddit:"r/history · r/AncientCivilizations", schedule:"Script Jun 14 · VO Jun 15 · Footage Jun 16 · Edit Jun 17 · Upload Jun 18" },
  { num:"005", title:"Mansa Musa & the Mali Empire", launch:"Mon Jun 22", status:"upcoming", overlays:"RICHEST HUMAN EVER · CRASHED EGYPT'S ECONOMY · GOLD BEYOND COUNTING · TIMBUKTU", cold:"Gold close-up or Saharan caravan silhouette at dusk", footage:"Sahara caravans (Pexels) · Djinguereber mosque & Timbuktu manuscripts (Wikimedia) · Catalan Atlas · medieval gold-trade maps", expression:"Awe/knowing", reddit:"r/history · r/AskHistorians", schedule:"Script Jun 17 · VO Jun 18 · Footage Jun 19 · Edit Jun 20 · Upload Jun 21" },
  { num:"006", title:"The Khmer Empire / Angkor", launch:"Wed Jun 24", status:"upcoming", overlays:"LARGEST PRE-INDUSTRIAL CITY · 1,000 SQ KM · WATER EMPIRE · SWALLOWED BY JUNGLE", cold:"Angkor Wat dawn silhouette — epic scale", footage:"Angkor Wat aerials (Pexels) · Ta Prohm jungle ruins · bas-reliefs (Wikimedia) · LiDAR city-grid maps · Cambodian waterways", expression:"Awe/wide eyes", reddit:"r/AncientCivilizations · r/history", schedule:"Script Jun 19 · VO Jun 20 · Footage Jun 21 · Edit Jun 22 · Upload Jun 23" },
  { num:"007", title:"How Rome Debased Its Currency to Death", launch:"Fri Jun 26", status:"upcoming", overlays:"94% SILVER → 5% · 1,000%+ INFLATION · 50 EMPERORS IN 50 YEARS · THE DENARIUS", cold:"Roman denarius macro shot — dramatic single-source lighting", footage:"Roman coins (Wikimedia) · Forum & Colosseum (Pexels) · emperor busts · ancient mint imagery · archive.org Rome footage", expression:"Serious/warning · strongest modern-relevance hook", reddit:"r/history · r/AskHistorians", schedule:"Script Jun 21 · VO Jun 22 · Footage Jun 23 · Edit Jun 24 · Upload Jun 25" },
  { num:"008", title:"The Maya Collapse", launch:"Mon Jun 29", status:"upcoming", overlays:"90% POPULATION LOSS · MEGA-DROUGHT · DEFORESTATION · CITIES SWALLOWED WHOLE", cold:"Tikal temple rising from jungle canopy — misty dawn", footage:"Tikal & Palenque ruins (Pexels) · Maya glyphs (Wikimedia) · jungle-canopy aerials · cenotes · drought imagery", expression:"Concerned/grave", reddit:"r/AncientCivilizations · r/history", schedule:"Script Jun 24 · VO Jun 25 · Footage Jun 26 · Edit Jun 27 · Upload Jun 28" },
  { num:"009", title:"Lost Treasure of the Knights Templar", launch:"Wed Jul 1", status:"upcoming", overlays:"FRIDAY THE 13TH, 1307 · EUROPE'S FIRST BANKERS · FLEET VANISHED · NEVER FOUND", cold:"Candlelit medieval vault or Templar cross — shadowy", footage:"Templar castles & Temple Church (Wikimedia) · medieval manuscripts · La Rochelle harbor · crusader imagery (archive.org)", expression:"Knowing/mysterious · tests the pure lost-wealth vein", reddit:"r/UnsolvedMysteries · r/history", schedule:"Script Jun 26 · VO Jun 27 · Footage Jun 28 · Edit Jun 29 · Upload Jun 30" },
  { num:"010", title:"The South Sea Bubble", launch:"Fri Jul 3", status:"upcoming", overlays:"1720 · 1,000% RISE · TOTAL COLLAPSE · NEWTON LOST A FORTUNE", cold:"Hogarth-style 1720 London chaos engraving — frantic energy", footage:"South Sea Bubble & Hogarth prints (Wikimedia) · 18th-century London (archive.org) · stock certificates · tulip imagery", expression:"Disbelief/warning · CANARY TEST — boldest lean toward Business Forensics", reddit:"r/history · r/AskHistorians", schedule:"Script Jun 28 · VO Jun 29 · Footage Jun 30 · Edit Jul 1 · Upload Jul 2" },
  { num:"011", title:"Easter Island / Rapa Nui", launch:"Mon Jul 6", status:"upcoming", overlays:"887 MOAI · EVERY TREE GONE · 90% COLLAPSE · THE ISLAND THAT CONSUMED ITSELF", cold:"Moai row silhouette at sunset — iconic", footage:"Moai statues (Pexels) · Rano Raraku quarry (Wikimedia) · Pacific aerials · barren-vs-forested comparisons", expression:"Grave/reflective", reddit:"r/AncientCivilizations · r/history", schedule:"Script Jul 1 · VO Jul 2 · Footage Jul 3 · Edit Jul 4 · Upload Jul 5" },
  { num:"012", title:"Indus Valley — Revisited", launch:"Wed Jul 8", status:"upcoming", overlays:"RICHEST TRADE NETWORK OF THE ANCIENT WORLD · 1,000+ CITIES · STANDARDIZED WEIGHTS · CALLBACK TO CASE #001", cold:"Mohenjo-daro ruins — same shot family as Case #001, full circle", footage:"Mohenjo-daro (reuse Case #001 library) · Indus seals & weights (Wikimedia) · Mesopotamia trade-route maps · Persian Gulf", expression:"Confident/knowing · before/after reframe comparison", reddit:"r/AncientCivilizations · r/history", schedule:"Script Jul 3 · VO Jul 4 · Footage Jul 5 · Edit Jul 6 · Upload Jul 7" },
];

// ─── NEW: VANISHED HISTORY CONTENT TRAJECTORY DATA ──────────────────────────
const TRAJECTORY = {
  repositioning: "Drift from 'historical mysteries' toward lost civilizations, lost wealth, and collapsed empires — through the lens of what they had and what happened to it. Same archive footage, same research effort — better CPM, finance-adjacent advertisers, clearer hook.",
  steeringRule: "After Video 8, look at which vein won: pure lost-civilization (4,6,8), wealth-and-power (5,7), or treasure/mystery (9). Whichever has the best retention × CTR becomes the spine for Videos 13+. Video 10 is the canary — if it performs, push further toward markets; if it flops, pull back to civilizations.",
  holdTheLine: "Stay on the history side of 'history that attracts money-minded viewers' — never become 'a finance channel wearing a toga.' That distinct identity is what makes the channel valuable as a resale asset.",
  phases: [
    {
      id: "bridge",
      label: "Phase 1 · Bridge",
      desc: "Videos 1–3 · Establish category, soft-lean toward 'lost sophistication'",
      cls: "traj-bridge",
      videos: [
        { num:"01", topic:"Indus Valley Civilization", title:'"The Indus Valley Civilization: 5 Million People Vanished and No One Knows Why"', note:"SCHEDULED Thu Jun 11 2pm PST on @vanishedhistorych + 3 Shorts 2:30/4/6pm — faceless, burned-in captions, Kevin MacLeod music, Leonardo thumbnail. Sets the algorithm's first impression.", flag:"SCHEDULED", cls:"produced" },
        { num:"02", topic:"Göbekli Tepe", title:'"Göbekli Tepe: The Temple Built 6,000 Years Before Stonehenge — and No One Knows Why"', note:"Script done Jun 10 — hidden triangle, burial-revision twist, 2025 Karahan Tepe face. Plants the 'lost sophistication' seed. vidIQ-validate title at upload.", flag:"SCRIPTED", cls:"produced" },
        { num:"03", topic:"The Minoans", title:'"How the World\'s Richest Trade Empire Collapsed"', note:"Introduces wealth & trade power for the first time. Word 'collapsed' conditions audience for Phase 2.", flag:"", cls:"" },
      ]
    },
    {
      id: "commit",
      label: "Phase 2 · Commit",
      desc: "Videos 4–8 · Wealth and collapse front and center",
      cls: "traj-commit",
      decision: "Decision point — after Video 3 you have Video 1's data. Retention, CTR, and traffic source tells you whether to lean or lunge into Phase 2.",
      videos: [
        { num:"04", topic:"The Bronze Age Collapse", title:'"How Every Empire Fell in the Same 50 Years"', note:"Thesis statement video. Formally announces the channel's new identity. 1177 BC — the entire interconnected world collapsed almost simultaneously.", flag:"THESIS", cls:"thesis" },
        { num:"05", topic:"Mansa Musa & the Mali Empire", title:"The richest individual in human history", note:"Pure wealth-and-power story. Highly searchable, strong CPM pull, perfectly on-thesis.", flag:"", cls:"" },
        { num:"06", topic:"The Khmer Empire / Angkor", title:"Largest pre-industrial city on earth, abandoned to jungle", note:"Staggering wealth & engineering, water control, trade dominance, collapse.", flag:"", cls:"" },
        { num:"07", topic:"How Rome Debased Its Currency to Death", title:"History that rhymes with modern monetary anxiety", note:"Strongest present-day-relevance hook. Clearest crossover toward Business Forensics. Highest CPM topic on this list.", flag:"HIGHEST CPM", cls:"thesis" },
        { num:"08", topic:"The Maya Collapse", title:"Why advanced societies collapse — drought & resource overshoot", note:"Sustainability/resource angle gives present-day weight beyond a standard retelling.", flag:"", cls:"" },
      ]
    },
    {
      id: "optimize",
      label: "Phase 3 · Optimize",
      desc: "Videos 9–12 · Test the edges, then double down",
      cls: "traj-optimize",
      videos: [
        { num:"09", topic:"Lost Treasure of the Knights Templar", title:"Tests the pure 'lost wealth mystery' vein", note:"Power, money, sudden destruction, missing fortune. Likely high CTR — watch retention.", flag:"", cls:"" },
        { num:"10", topic:"The South Sea Bubble / Tulip Mania", title:"A historical financial mania — boldest test", note:"Leans hardest toward Business Forensics. If it performs, you've found the most lucrative edge. If it flops, audience wants civilizations not markets.", flag:"CANARY", cls:"canary" },
        { num:"11", topic:"Easter Island / Rapa Nui", title:"Collapse and resource depletion", note:"High search demand. Tests whether the reframe holds on a heavily-covered topic.", flag:"", cls:"" },
        { num:"12", topic:"Indus Valley — revisited through trade & economy", title:"Callback to Video 1, now through the wealth-and-trade lens", note:"Demonstrates channel evolution. Direct before/after reframe comparison in your own analytics.", flag:"", cls:"" },
      ]
    }
  ]
};

// ─── NEW: UPDATED EMPIRE CHANNEL LINEUP ─────────────────────────────────────
const CHANNEL_LINEUP = [
  { rank:"1", name:"Vanished History", role:"Foundation & system-building channel · reframing toward lost wealth & collapsed empires", rpm:"$12–20 RPM (post-pivot)", launch:"Launches Jun 11", trigger:"—", proj:"$500–2k by Month 12", cls:"ch1", tags:["live", "rpm-low", "resale: 24–48x"] },
  { rank:"2", name:"Business & Financial Forensics ⭐", role:"How companies actually make money — hidden revenue models, profit breakdowns. Strongest concept (8.5/10). Your breakout channel.", rpm:"$15–25 RPM", launch:"Aug 2026", trigger:"60 days stable execution", proj:"$2k–5k by Month 12", cls:"lead", tags:["blue", "breakout", "lead"] },
  { rank:"3", name:"Personal Finance for Online Business Owners", role:"Irregular income, solopreneur taxes, reinvestment. Highest RPM niche on platform. Launched into audience you already built.", rpm:"$25–50 RPM", launch:"Q1 2027", trigger:"Ch2 in YPP", proj:"Adds $5k–10k", cls:"", tags:["highest earner"] },
  { rank:"4", name:"AI Tools & Systems", role:"Tools & systems for small operations — evergreen, infinite supply. Decoupled from Cipher House. Lives or dies by affiliate conversion, not views.", rpm:"$20–40 RPM", launch:"Q3 2027", trigger:"Combined $2k+/mo", proj:"Adds $2k–4k", cls:"", tags:["affiliate play"] },
  { rank:"5", name:"Financial Crime & Corporate Fraud", role:"True crime that pays like business content. White-collar/corporate fraud — cross-pollinates with all four channels. Underserved lane.", rpm:"$10–18 RPM", launch:"Q1 2028", trigger:"1 hire in place", proj:"Adds $2k–5k", cls:"", tags:["volume play"] },
];

const SCALING_GATES = [
  { from:"Ch1 → Ch2", rule:"System stability gate", desc:"60 days of consistent execution without scrambling. Not monetization — the workflow is documented, repeatable, and runs on rhythm not hustle." },
  { from:"Ch2 → Ch3", rule:"Monetization gate", desc:"Channel 2 in YPP before Channel 3 launches." },
  { from:"Ch3 → Ch4", rule:"Revenue gate", desc:"Combined $2k+/month before Channel 4 launches." },
  { from:"Ch4 → Ch5", rule:"Team gate", desc:"At least one hire (VA / editor) in place before Channel 5." },
];

const QUICK_PROMPTS_BY_PANEL = {
  overview: ["What should I focus on today?", "How is Cipher House tracking vs plan?", "What's my next major milestone?"],
  tasks: ["Write Case #001 pinned comment", "Give me a pre-launch checklist", "What should I do right now?"],
  cases: ["Write the Case #002 full script", "Research Göbekli Tepe for me", "Write Case #003 Minoans script", "Write SEO title options for Case #004", "Write the pinned comment for Case #005"],
  calendar: ["Build Month 2 content calendar", "Suggest 3 outlier video topics", "Write hooks for Week 2 videos"],
  niches: ["Which channel should I launch second?", "What's the best CPM niche right now?"],
  growth: ["Write a Reddit post for Case #001", "Write a Quora answer about the Indus Valley", "Draft 3 Short titles for Case #001"],
  tools: ["What new AI tools should I know about?", "Is HeyGen still the best option for Cole?"],
  automation: ["How can I speed up my production?", "How do I batch produce 3 channels?"],
  monetization: ["When will I hit YPP at current pace?", "Draft an Audible affiliate pitch", "How do I land my first sponsorship?"],
  empire: ["When should I launch Channel 2?", "Build Channel 2 launch plan", "What's my Month 12 revenue projection?"],
  trajectory: ["Write full script for Video 2 (Göbekli Tepe)", "Write the Minoans script with wealth framing", "Write 4 title options for the Bronze Age Collapse", "What should Case #004 pivot to if Indus underperforms?"],
  prodloop: ["Write the pinned comment for Case #001", "Draft all 3 Short CTAs for Case #001", "Write the Version B thumbnail brief for Case #001"],
  lineup: ["Build the Business Forensics channel launch plan", "What's my revenue projection at Month 18?", "When exactly should I start Channel 2?"],
  portfolio: ["Deep dive on Business Forensics niche", "Compare Financial Crime vs Dark Psychology for Ch5", "What should Channel 3 be?"],
  revenue: ["Build a 12-month revenue projection", "How do I land my first brand deal?", "What digital product should I create first?"],
  sop: ["Write the SOP for script production", "Optimize my batch production workflow"],
  os: ["Run my monthly business review", "What are my top 3 priorities this month?"],
};

// ─── COMPONENTS ─────────────────────────────────────────────────────────────

function TaskCard({ task, done, onToggle }) {
  return (
    <div className={`task-card ${done ? "done" : ""}`} onClick={() => onToggle(task.id)}>
      <div className="check-box"><span className="check-icon">✓</span></div>
      <div className="task-body">
        <div className="task-name">{task.name}</div>
        <div className="task-desc">{task.desc}</div>
        {task.links && (
          <div className="task-links">
            {task.links.map((l, i) => <a key={i} className="task-link" href={l.url} target="_blank" rel="noopener noreferrer">{l.label}</a>)}
          </div>
        )}
        {task.tags && (
          <div className="task-meta">
            {task.tags.map((t, i) => <span key={i} className={`tag tag-${t.c}`}>{t.t}</span>)}
          </div>
        )}
      </div>
    </div>
  );
}

function DayBlock({ badge, badgeClass, title, sub, tasks, doneSet, onToggle }) {
  return (
    <div className="day-block">
      <div className="day-header">
        <span className={`day-badge ${badgeClass}`}>{badge}</span>
        <div>
          <div className="day-title-text">{title}</div>
          {sub && <div className="day-sub-text">{sub}</div>}
        </div>
      </div>
      {tasks.map(t => <TaskCard key={t.id} task={t} done={doneSet.has(t.id)} onToggle={onToggle} />)}
    </div>
  );
}

// ─── PANELS ─────────────────────────────────────────────────────────────────

function TodayWidget({ setPanel }) {
  const now = new Date();
  const dateStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}`;
  const pretty = now.toLocaleDateString("en-US", { weekday:"long", month:"long", day:"numeric" });
  const scheduled = SCHEDULE[dateStr] || [];
  const recurring = recurringFor(dateStr, scheduled);
  const items = [...scheduled, ...recurring];
  let nextLabel = null, nextItems = [];
  if (items.length === 0) {
    const future = Object.keys(SCHEDULE).filter(d => d > dateStr).sort();
    if (future.length) {
      nextLabel = new Date(future[0]+"T12:00:00").toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"});
      nextItems = SCHEDULE[future[0]];
    }
  }
  return (
    <div className="info-box" style={{borderColor:"rgba(201,168,76,0.4)", marginBottom:20}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:10}}>
        <div className="info-title" style={{fontSize:13,marginBottom:0}}>◷ Today — {pretty}</div>
        <span style={{fontFamily:"'DM Mono', monospace",fontSize:10,color:"var(--text3)"}}>{items.length ? `${items.length} action${items.length>1?"s":""}` : "clear"}</span>
      </div>
      {items.length > 0 ? (
        <div style={{display:"flex",flexDirection:"column",gap:7}}>
          {items.map((it,i) => (
            <div key={i} style={{display:"flex",gap:9,alignItems:"flex-start",fontSize:13,color:"var(--text)",lineHeight:1.5}}>
              <span style={{color:"var(--gold)",marginTop:1}}>›</span><span>{it}</span>
            </div>
          ))}
        </div>
      ) : (
        <div style={{fontSize:12.5,color:"var(--text3)",lineHeight:1.6}}>
          No production tasks scheduled today.
          {nextLabel && <> Next up — <span style={{color:"var(--text2)"}}>{nextLabel}</span>: {nextItems[0]}{nextItems.length>1?` (+${nextItems.length-1} more)`:""}</>}
        </div>
      )}
      <div style={{marginTop:12,display:"flex",gap:8,flexWrap:"wrap"}}>
        <button onClick={()=>setPanel("tracker")} style={{background:"var(--gold-dim)",border:"1px solid var(--gold-dim2)",color:"var(--gold2)",borderRadius:7,padding:"6px 12px",fontSize:11.5,cursor:"pointer",fontFamily:"inherit"}}>Open Production Tracker →</button>
        <button onClick={()=>setPanel("calendar")} style={{background:"transparent",border:"1px solid var(--border2)",color:"var(--text2)",borderRadius:7,padding:"6px 12px",fontSize:11.5,cursor:"pointer",fontFamily:"inherit"}}>View Calendar →</button>
      </div>
    </div>
  );
}

function OverviewPanel({ setPanel, doneCount, totalTasks }) {
  return (
    <div>
      <div className="panel-header">
        <div className="panel-title">Cipher House — Business Command Center</div>
        <div className="panel-sub">YouTube Automation Empire · Channel 1 active · 5-channel portfolio in development</div>
        <div className="gold-line" />
      </div>
      <div className="launch-banner">
        <div>
          <div className="launch-text">Case #001 — scheduled ✓ launches Thursday 🚀</div>
          <div className="launch-sub">The Indus Valley Civilization: 5 Million People Vanished and No One Knows Why</div>
        </div>
        <div className="launch-date">Thu Jun 11 · 2:00 PM PST</div>
      </div>
      <TodayWidget setPanel={setPanel} />
      <div className="stat-grid">
        <div className="stat-card"><div className="stat-label">Active channels</div><div className="stat-val">1 of 5</div><div className="stat-note">Vanished History live</div></div>
        <div className="stat-card"><div className="stat-label">Monthly tool cost</div><div className="stat-val">$170</div><div className="stat-note">Full AI stack</div></div>
        <div className="stat-card"><div className="stat-label">Month 24 target</div><div className="stat-val">$20K+/mo</div><div className="stat-note">5-channel portfolio</div></div>
        <div className="stat-card"><div className="stat-label">Tasks complete</div><div className="stat-val">{doneCount}/{totalTasks}</div><div className="stat-note">launch checklist</div></div>
      </div>
      <div className="section-title">Quick navigation</div>
      <div className="ov-grid">
        {[
          {icon:"✦", title:"Production Plan", desc:"9-day launch checklist + Cases #002–#012 full production schedule.", panel:"tasks"},
          {icon:"◷", title:"Content Calendar", desc:"12 videos across 4 weekly themes. Every title planned and ready.", panel:"calendar"},
          {icon:"◈", title:"Cases #001–#012", desc:"Full production details — footage notes, overlays, cold opens for every case.", panel:"cases"},
          {icon:"↑", title:"Growth Tactics", desc:"Reddit seeding, Quora, A/B thumbnails, outlier analysis — every tactic documented.", panel:"growth"},
          {icon:"↗", title:"Content Trajectory", desc:"12-video reframe plan — from mysteries to lost wealth & collapsed empires.", panel:"trajectory"},
          {icon:"◈", title:"Scaling Roadmap", desc:"5-phase plan from Channel 1 to 5-channel media company.", panel:"empire"},
        ].map(c => (
          <div key={c.panel} className="ov-card" onClick={() => setPanel(c.panel)}>
            <div className="ov-icon">{c.icon}</div>
            <div className="ov-title">{c.title}</div>
            <div className="ov-desc">{c.desc}</div>
            <div className="ov-arrow">→</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TasksPanel({ doneSet, onToggle }) {
  const allGroups = [
    { badge:"Wed Jun 3 · 6:00–9:00pm", cls:"badge-wed", title:"Channel setup + accounts", sub:"Pure admin — no creative work yet", tasks: TASKS.wed },
    { badge:"Thu Jun 4 · 6:00–9:00pm", cls:"badge-thu", title:"Research + footage prep + script", sub:"Delete old footage · map visual needs · write script", tasks: TASKS.thu },
    { badge:"Fri Jun 5 · 7:00–10:00pm", cls:"badge-fri", title:"Voiceover + full footage search", sub:"Section-by-section · cold open first · 25–35 clips", tasks: TASKS.fri },
    { badge:"Sat Jun 6 · Complete ✅", cls:"badge-sat", title:"Character Build Day — The Investigator (since retired)", sub:"Design v5 → transparent PNG → HeyGen setup → 5 sections generated", tasks: TASKS.sat },
    { badge:"Sun Jun 7 · 7:00am–5:00pm", cls:"badge-sun", title:"Edit Day — DaVinci + overlays + export", sub:"Assembly → character overlays → thumbnail → 3 Shorts → export", tasks: TASKS.sun },
    { badge:"Mon Jun 8 · 7:00am–2:00pm", cls:"badge-mon", title:"QC + Upload + Schedule", sub:"Watch-through → SEO → music swap (Pixabay claim → Kevin MacLeod) → re-export FINAL2", tasks: TASKS.mon },
    { badge:"Thu Jun 11 · 2:00pm PST · LAUNCH DAY", cls:"badge-mon", title:"Case #001 goes live 🚀", sub:"Pinned comment + 3 Shorts + Reddit · reply to every comment", tasks: TASKS.launch },
    { badge:"Wed Jun 10 – Sun Jun 14 · launches Mon Jun 15", cls:"badge-wed", title:"Case #002 — Göbekli Tepe production", sub:"Script → Voiceover → Footage → Edit → Upload", tasks: TASKS.c002 },
    { badge:"Jun 15 – Jul 8", cls:"badge-fri", title:"Cases #003–#012 — rolling production", sub:"Every remaining case runs the same 12-step Production Loop · per-case details in the Cases panel · dates in Content Calendar", tasks: [] },
  ];
  const totalTasks = Object.values(TASKS).flat().length;
  const done = Object.values(TASKS).flat().filter(t => doneSet.has(t.id)).length;
  return (
    <div>
      <div className="panel-header">
        <div className="panel-title">Full Production Plan</div>
        <div className="panel-sub">Click each task to mark complete. Cases #001–#002 fully expanded · Cases #003–#012 in Cases panel.</div>
        <div className="gold-line" />
      </div>
      <div className="stat-grid">
        <div className="stat-card"><div className="stat-label">Total tasks</div><div className="stat-val">{totalTasks}</div><div className="stat-note">across all days</div></div>
        <div className="stat-card"><div className="stat-label">Completed</div><div className="stat-val">{done}</div><div className="stat-note">tasks done</div></div>
        <div className="stat-card"><div className="stat-label">Case #001 launch</div><div className="stat-val">Thu Jun 11</div><div className="stat-note">2:00 PM PST</div></div>
        <div className="stat-card"><div className="stat-label">Final launch</div><div className="stat-val">Jul 8</div><div className="stat-note">Case #012</div></div>
      </div>
      {allGroups.map((g, i) => (
        <DayBlock key={i} badge={g.badge} badgeClass={g.cls} title={g.title} sub={g.sub} tasks={g.tasks} doneSet={doneSet} onToggle={onToggle} />
      ))}
    </div>
  );
}

function CalendarPanel() {
  const weeks = [
    { week:"Week 1 · Phase 1 — Bridge", theme:"Lost sophistication — establish the category", featured:true, videos:[
      {day:"Thu Jun 11", title:"The Indus Valley Civilization: 5 Million People Vanished and No One Knows Why"},
      {day:"Mon Jun 15", title:"Göbekli Tepe: The Temple Built 6,000 Years Before Stonehenge — and No One Knows Why"},
      {day:"Wed Jun 17", title:"The Minoans: How the World's Richest Trade Empire Collapsed"},
    ]},
    { week:"Week 2 · Phase 2 — The reframe", theme:"Collapsed empires & lost wealth — the new identity", featured:false, videos:[
      {day:"Fri Jun 19", title:"The Bronze Age Collapse: How Every Empire Fell in the Same 50 Years"},
      {day:"Mon Jun 22", title:"Mansa Musa: The Richest Human Who Ever Lived — and the Empire That Vanished"},
      {day:"Wed Jun 24", title:"The Khmer Empire: The Largest City on Earth, Abandoned to the Jungle"},
    ]},
    { week:"Week 3 · Phase 2 — Wealth & power", theme:"Money, collapse, and missing fortunes", featured:false, videos:[
      {day:"Fri Jun 26", title:"How Rome Debased Its Currency to Death"},
      {day:"Mon Jun 29", title:"The Maya Collapse: Why Advanced Societies Destroy Themselves"},
      {day:"Wed Jul 1", title:"The Lost Treasure of the Knights Templar"},
    ]},
    { week:"Week 4 · Phase 3 — Testing the veins", theme:"Financial mania, resource collapse, and the callback", featured:false, videos:[
      {day:"Fri Jul 3", title:"The South Sea Bubble: The First Time an Entire Nation Went Financially Insane"},
      {day:"Mon Jul 6", title:"Easter Island: The Civilization That Consumed Itself"},
      {day:"Wed Jul 8", title:"The Indus Valley, Revisited: The Ancient World's Richest Trade Network"},
    ]},
  ];
  return (
    <div>
      <div className="panel-header">
        <div className="panel-title">30-Day Content Calendar</div>
        <div className="panel-sub">12 videos · launch Thu Jun 11, then Mon/Wed/Fri 2pm PST · pivot arc: mysteries → lost wealth & collapsed empires</div>
        <div className="gold-line" />
      </div>
      <div className="stat-grid">
        <div className="stat-card"><div className="stat-label">Total videos</div><div className="stat-val">12</div><div className="stat-note">Month 1</div></div>
        <div className="stat-card"><div className="stat-label">Upload time</div><div className="stat-val">2pm PST</div><div className="stat-note">optimal for history niche</div></div>
        <div className="stat-card"><div className="stat-label">Target length</div><div className="stat-val">10–15 min</div><div className="stat-note">max watch time</div></div>
        <div className="stat-card"><div className="stat-label">All topics</div><div className="stat-val">Evergreen</div><div className="stat-note">rank for years</div></div>
      </div>
      <div className="cal-grid">
        {weeks.map((w, i) => (
          <div key={i} className={`cal-card ${w.featured ? "featured" : ""}`}>
            <div className="cal-week">{w.week}</div>
            <div className="cal-theme">{w.theme}</div>
            {w.videos.map((v, j) => (
              <div key={j} className="cal-video">
                <span className="cal-day">{v.day}</span><span>{v.title}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="info-box">
        <div className="info-title">Month 2 planning — Jul 6 after Business Review #1</div>
        <div className="info-body">Cases #013–#024 planned using Month 1 analytics + vidIQ outlier data. Rule: Month 2 calendar locked before Case #009 launches Jul 1. Never be less than 2 weeks ahead on content. Ask Claude to build the full Month 2 calendar during the Jul 6 review.</div>
      </div>
    </div>
  );
}

function ProductionTrackerPanel({ trackerSet, onToggleStep }) {
  const [expanded, setExpanded] = useState("002");
  const totalSteps = CASES.length * TRACKER_STEPS.length;
  const doneSteps = CASES.reduce((acc, c) =>
    acc + TRACKER_STEPS.filter(s => trackerSet.has(`${c.num}:${s.key}`)).length, 0);
  const pct = Math.round((doneSteps / totalSteps) * 100);
  return (
    <div>
      <div className="panel-header">
        <div className="panel-title">Production Tracker</div>
        <div className="panel-sub">Every case · all 12 airtight steps · click any step to mark it done.</div>
        <div className="gold-line" />
      </div>
      <div className="stat-grid">
        <div className="stat-card"><div className="stat-label">Steps complete</div><div className="stat-val">{doneSteps}/{totalSteps}</div><div className="stat-note">across 12 cases</div></div>
        <div className="stat-card"><div className="stat-label">Overall progress</div><div className="stat-val">{pct}%</div><div className="stat-note">full pipeline</div></div>
        <div className="stat-card"><div className="stat-label">Steps per case</div><div className="stat-val">12</div><div className="stat-note">script → A/B check</div></div>
        <div className="stat-card"><div className="stat-label">Shorts total</div><div className="stat-val">36</div><div className="stat-note">3 per video</div></div>
      </div>
      <div className="info-box" style={{marginBottom:20}}>
        <div className="info-title">The 12-step pipeline — applied to every single video</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,fontSize:11,color:"var(--text3)",lineHeight:1.5,marginTop:4}}>
          {TRACKER_STEPS.map((s,i) => (
            <div key={s.key}><span style={{color:"var(--gold2)"}}>{i+1}. {s.icon} {s.label}</span></div>
          ))}
        </div>
      </div>
      {CASES.map((c) => {
        const caseDone = TRACKER_STEPS.filter(s => trackerSet.has(`${c.num}:${s.key}`)).length;
        const caseComplete = caseDone === TRACKER_STEPS.length;
        return (
          <div key={c.num} className={`case-card ${caseComplete ? "complete" : ""}`} style={{marginBottom:12}}>
            <div className="case-header" style={{cursor:"pointer"}} onClick={() => setExpanded(expanded === c.num ? null : c.num)}>
              <div>
                <div className="case-num">CASE #{c.num}</div>
                <div className="case-title">{c.title}</div>
                <div className="case-launch">{c.launch} · 2pm PST</div>
              </div>
              <div style={{display:"flex",gap:10,alignItems:"center"}}>
                <div style={{textAlign:"right"}}>
                  <div style={{fontFamily:"'DM Mono', monospace",fontSize:13,color:caseComplete?"var(--green)":"var(--gold)"}}>{caseDone}/{TRACKER_STEPS.length}</div>
                  <div style={{width:70,height:3,background:"rgba(255,255,255,0.08)",borderRadius:2,marginTop:4,overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${(caseDone/TRACKER_STEPS.length)*100}%`,background:caseComplete?"var(--green)":"var(--gold)",borderRadius:2,transition:"width 0.3s"}} />
                  </div>
                </div>
                <span style={{color:"var(--text3)",fontSize:16,transition:"transform 0.2s",transform:expanded===c.num?"rotate(180deg)":"rotate(0deg)"}}>⌄</span>
              </div>
            </div>
            {expanded === c.num && (
              <div style={{borderTop:"1px solid var(--border)",paddingTop:10,marginTop:10}}>
                {TRACKER_STEPS.map((s) => {
                  const id = `${c.num}:${s.key}`;
                  const done = trackerSet.has(id);
                  return (
                    <div key={s.key} className={`task-card ${done ? "done" : ""}`} onClick={() => onToggleStep(id)} style={{marginBottom:6}}>
                      <div className="check-box"><span className="check-icon">✓</span></div>
                      <div className="task-body">
                        <div className="task-name">{s.icon} {s.label}</div>
                        <div className="task-desc">{s.note}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function GrowthSystemsPanel({ trackerSet, onToggleStep }) {
  return (
    <div>
      <div className="panel-header">
        <div className="panel-title">Growth Systems</div>
        <div className="panel-sub">The recurring engines that run alongside production. These never stop — they compound.</div>
        <div className="gold-line" />
      </div>
      <div className="info-box" style={{marginBottom:20}}>
        <div className="info-title">Why these matter</div>
        <div style={{fontSize:12,color:"var(--text3)",lineHeight:1.6}}>Per-video work gets the video live. These systems are what turn 12 videos into a growing channel: engagement signals, data-driven topic selection, and never missing a monetization window.</div>
      </div>
      {GROWTH_SYSTEMS.map((s) => (
        <div key={s.key} className="task-card" style={{marginBottom:8, cursor:"default"}}>
          <div className="task-body">
            <div className="task-name">{s.icon} {s.label} <span style={{color:"var(--gold2)",fontFamily:"'DM Mono', monospace",fontSize:11,marginLeft:6,background:"var(--gold-dim)",border:"1px solid var(--gold-dim2)",borderRadius:4,padding:"1px 7px"}}>{s.cadence}</span></div>
            <div className="task-desc">{s.note}</div>
          </div>
        </div>
      ))}
      <div className="info-box" style={{marginTop:14, borderColor:"rgba(201,168,76,0.35)"}}>
        <div className="info-title">⟳ These are rhythms, not a checklist</div>
        <div style={{fontSize:12,color:"var(--text3)",lineHeight:1.6}}>Nothing here gets "completed." Each item auto-appears in the <b>Today</b> widget on the Dashboard on its cadence — Mon/Wed/Fri comment sessions, Friday analytics, first-Monday reviews, 1st-of-month monetization checks — alongside that day's production tasks.</div>
      </div>
    </div>
  );
}
function CasesPanel() {
  const [expanded, setExpanded] = useState(null);
  return (
    <div>
      <div className="panel-header">
        <div className="panel-title">Cases #001–#012 Production Plan</div>
        <div className="panel-sub">Footage direction · text overlays · cold opens · production schedule for every case.</div>
        <div className="gold-line" />
      </div>
      <div className="info-box" style={{marginBottom:20}}>
        <div className="info-title">Production SOP — same workflow every video</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:10,fontSize:12,color:"var(--text3)",lineHeight:1.6}}>
          {[["✍️ D-5","Script","Claude researches + writes · SEO · chapters · pinned comment"],["🎭 D-4","Character + Voice","Paste 5 sections into HeyGen · Cole talking · Brad voice (audio + lip-sync in one pass) · 5 MP4s"],["🎞️ D-3","Footage","Cold open first · section-by-section · 25–35 clips"],["🎬 D-2","Edit","Footage background → character overlays → text → export → CapCut burned-in captions"],["⬆️ D-1","Upload","QC watch · full checklist · ⚠️ AI disclosure · schedule 2pm PST"]].map(([icon,title,desc],i) => (
            <div key={i}><span style={{color:"var(--gold2)"}}>{icon} {title}</span><br/>{desc}</div>
          ))}
        </div>
      </div>
      {CASES.map((c) => (
        <div key={c.num} className={`case-card ${c.status}`} style={{cursor:"pointer"}} onClick={() => setExpanded(expanded === c.num ? null : c.num)}>
          <div className="case-header">
            <div>
              <div className="case-num">CASE #{c.num}</div>
              <div className="case-title">{c.title}</div>
              <div className="case-launch">{c.launch} · 2pm PST</div>
            </div>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              <span className={c.status === "complete" ? "badge-complete" : "badge-upcoming"}>{c.status === "complete" ? "✓ Complete" : "Upcoming"}</span>
              <span style={{color:"var(--text3)",fontSize:16,transition:"transform 0.2s",transform:expanded===c.num?"rotate(180deg)":"rotate(0deg)"}}>⌄</span>
            </div>
          </div>
          {expanded === c.num && (
            <div style={{borderTop:"1px solid var(--border)",paddingTop:12,marginTop:4}}>
              <div className="case-detail-grid">
                <div><div className="case-detail-label">Production schedule</div><div className="case-detail-val" style={{fontSize:11,color:"var(--text3)"}}>{c.schedule}</div></div>
                <div><div className="case-detail-label">Text overlays</div><div className="case-detail-val">{c.overlays}</div></div>
                <div><div className="case-detail-label">Cold open</div><div className="case-detail-val">{c.cold}</div></div>
                <div style={{gridColumn:"span 2"}}><div className="case-detail-label">Footage direction</div><div className="case-detail-val" style={{color:"var(--text3)"}}>{c.footage}</div></div>
                <div><div className="case-detail-label">Thumbnail · Reddit</div><div className="case-detail-val">{c.expression} · CASE #{c.num}</div><div style={{fontSize:11,color:"var(--text3)",marginTop:2}}>{c.reddit}</div></div>
                {c.shorts && <div style={{gridColumn:"span 2"}}><div className="case-detail-label">3 Shorts — titles + schedule</div><div className="case-detail-val" style={{fontSize:11,color:"var(--text3)"}}>{c.shorts}</div></div>}
                <div style={{gridColumn:"span 2"}}><div className="case-detail-label">Pinned comment — ready to copy on launch day</div><div className="case-detail-val" style={{fontSize:11,color:c.pinnedComment?"var(--text2)":"var(--text3)",fontStyle:c.pinnedComment?"normal":"italic"}}>{c.pinnedComment || "Written with the script on D-5 — lead with a specific contradiction from the video, end with a question 👇"}</div></div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function NichesPanel() {
  return (
    <div>
      <div className="panel-header">
        <div className="panel-title">Niche Research</div>
        <div className="panel-sub">The 5-channel empire — every niche researched, sequenced by launch trigger</div>
        <div className="gold-line" />
      </div>
      <div className="niche-grid">
        {[
          {rank:"⭐ Channel 1 — Launch week",name:"Vanished History — lost wealth & collapsed empires",cpm:"$12–20 RPM",top:true,rows:[["Status","Launches Thu Jun 11"],["Competition","Low"],["AI producible","Very easy"],["Evergreen","Yes"],["Projection","$500–2k/mo by Month 12"],["Footage cost","Free (archive.org)"]]},
          {rank:"#2 — Aug 2026 · ⭐ breakout",name:"Business & Financial Forensics",cpm:"$15–25 RPM",top:false,rows:[["Status","Launch Aug 2026"],["Competition","Low–medium"],["Concept score","8.5/10 — strongest"],["Evergreen","Yes"],["Sponsor appeal","Very high (B2B)"],["Trigger","60 days of Ch1 stability"]]},
          {rank:"#3 — Q1 2027 · highest RPM",name:"Personal Finance for Online Business Owners",cpm:"$25–50 RPM",top:false,rows:[["Status","Q1 2027"],["Competition","Medium"],["RPM rank","Highest on platform"],["Evergreen","Yes"],["Audience","Built from Ch 1–2"],["Trigger","Ch2 monetized"]]},
          {rank:"#4 — Q3 2027 · decoupled",name:"AI Tools & Systems",cpm:"$20–40 RPM",top:false,rows:[["Status","Q3 2027"],["Competition","Medium"],["Revenue driver","Affiliate conversion, not views"],["Evergreen","Yes — systems, not news"],["Brand","Decoupled from Cipher House"],["Footage cost","Free (screen record)"]]},
          {rank:"#5 — Q1 2028 · cross-pollinator",name:"Financial Crime & Corporate Fraud",cpm:"$10–18 RPM",top:false,rows:[["Status","Q1 2028"],["Competition","Low — underserved lane"],["Niche","True crime that pays like business"],["Evergreen","Yes"],["Synergy","Cross-pollinates all 4 channels"],["Trigger","1 hr/wk spare capacity"]]},
        ].map((n,i) => (
          <div key={i} className={"niche-card " + (n.top ? "top" : "")}>
            <div className="niche-rank">{n.rank}</div>
            <div className="niche-name">{n.name}</div>
            <div className="niche-cpm">{n.cpm}</div>
            {n.rows.map(([l,v],j) => <div key={j} className="niche-row"><span className="niche-row-label">{l}</span><span className="niche-row-val" style={{color: v.includes("✓") ? "var(--green)" : "var(--text2)"}}>{v}</span></div>)}
          </div>
        ))}
      </div>
      <div className="info-box">
        <div className="info-title">The power move — combine niches 1 & 2</div>
        <div className="info-body">"Business history" content — like "How the East India Company became richer than most countries" — combines the free archive-footage workflow of history with business-content CPMs. This is exactly the reframe Vanished History is executing from Video 4 onward, and it feeds directly into Channel 2's audience.</div>
      </div>
    </div>
  );
}
function GrowthPanel() {
  return (
    <div>
      <div className="panel-header">
        <div className="panel-title">Growth Tactics</div>
        <div className="panel-sub">Advanced strategies beyond the basics — implement as you grow</div>
        <div className="gold-line" />
      </div>
      <div className="section-title">Every video — launch day additions</div>
      <div className="sop-box">
        {[
          ["Video chapters (6–8 per video)","YouTube Studio · 5 min · keyword-rich titles only · free"],
          ["200–300 word description","Prose with keywords + affiliate links + subscribe CTA · Google indexes this"],
          ["3 Shorts per long-form video","Each chapter = a natural Short · 3x better than 1 Short · cut in DaVinci then caption in CapCut"],
          ["Reddit seeding (within 48hrs)","r/UnsolvedMysteries · r/AncientCivilizations · engage first, link second"],
          ["Quora answer (within 48hrs)","Find question with 10K+ views · write substantive answer · link at end · ranks on Google"],
          ["Reply to ALL comments (6 months)","Not just 24 hours · 20 min/day · builds loyal core audience"],
          ["A/B thumbnail test (after 1K views)","YouTube Studio → Content → Thumbnail → Test & Compare · check after 2 weeks"],
        ].map(([t,d],i) => (
          <div key={i} style={{padding:"10px 0",borderBottom:"1px solid var(--border)",fontSize:12}}>
            <div style={{fontWeight:500,color:"var(--text)",marginBottom:3}}>{t}</div>
            <div style={{color:"var(--text3)",lineHeight:1.6}}>{d}</div>
          </div>
        ))}
      </div>
      <div className="section-title">Shorts funnel — CTA template</div>
      <div className="info-box">
        <div className="info-title">Shorts are loss leaders — the funnel is the point</div>
        <div style={{fontSize:12,color:"var(--text3)",lineHeight:1.7,marginBottom:10}}>Shorts RPM is only $0.03–$0.10 per 1,000 views. Their real value is funneling viewers into your long-form library where you earn $5–$10 RPM. Every Short must point back to the full video with a curiosity-gap CTA.</div>
        <div style={{display:"flex",flexDirection:"column",gap:8,fontSize:12,color:"var(--text3)",lineHeight:1.5}}>
          <div><span style={{color:"var(--gold)"}}>Shorts #1 & #2:</span> "The full story is on the channel — this is just 60 seconds of it 👇" + link</div>
          <div><span style={{color:"var(--gold)"}}>Short #3 (ending):</span> "If that ending bothered you, the full breakdown is on the channel" + link — highest long-form conversion</div>
          <div><span style={{color:"var(--gold)"}}>Every Short:</span> #Shorts + ⚠️ AI-assisted content disclosure</div>
        </div>
      </div>
      <div className="section-title">Month 2 milestones (~20 videos)</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        {[
          ["📧 Email List","Free on Mailchimp or Kit. Lead magnet: 'Get the full case file PDF.' Add to every description and pinned comment. None of your major competitors have this."],
          ["💬 Discord Community","Free. Channels: #case-discussions, #your-theories, #suggest-a-case. Post a question every launch day. Knowledgia, Voices of the Past, Dark Docs all skip this."],
        ].map(([t,d],i) => (
          <div key={i} className="info-box"><div className="info-title">{t}</div><div className="info-body">{d}</div></div>
        ))}
      </div>
    </div>
  );
}

function ToolsPanel() {
  const tools = [
    {name:"Claude (Max)",use:"Script, research, SEO, strategy — primary AI partner",cost:"$100/mo",paid:true},
    {name:"HeyGen (Pro)",use:"Cole lip-synced clips + voiceover (Brad via imported API). Audio on A1, Cole video on V2 in DaVinci. Case #001 faceless — Cole debuts Case #002 onward. ElevenLabs cancelled Jun 11.",cost:"$50/mo",paid:true},
    {name:"Leonardo.ai (Essential)",use:"CANCELLED Jun 11 — Cole already built. Resubscribe when a new channel character is needed.",cost:"Cancelled",paid:false},
    {name:"DaVinci Resolve 21",use:"Primary editor — footage, overlays, text, music, color, export",cost:"Free",paid:false},
    {name:"CapCut Pro",use:"Burned-in auto-captions for ALL videos (long-form + Shorts) + 9:16 Shorts reframe",cost:"$19.99/mo",paid:true},
    {name:"Canva",use:"Thumbnail design, banner, logo",cost:"Free tier",paid:false},
    {name:"vidIQ (Max trial)",use:"SEO, keyword + outlier research, competitor tracking (5 channels), title optimizer, Daily Ideas. Max trial active since Jun 11 — keep vs downgrade decision Jul 11 (framework in calendar event)",cost:"$0 until Jul 11",paid:false},
    {name:"archive.org",use:"Public-domain historical footage — core source",cost:"Free",paid:false},
    {name:"Wikimedia Commons",use:"Historical images, maps, diagrams",cost:"Free",paid:false},
    {name:"Pexels",use:"Stock footage — ruins, landscapes, atmospheric",cost:"Free",paid:false},
    {name:"Incompetech (Kevin MacLeod)",use:"Royalty-free music with attribution. Replaced Pixabay after content-ID claim on Case #001",cost:"Free + credit",paid:false},
    {name:"Google AdSense",use:"Linked for ad monetization",cost:"Free",paid:false},
  ];
  return (
    <div>
      <div className="panel-header">
        <div className="panel-title">Tool Stack</div>
        <div className="panel-sub">$170/mo total — replaces $2,000–5,000/mo in freelancer costs</div>
        <div className="gold-line" />
      </div>
      <div className="stat-grid">
        <div className="stat-card"><div className="stat-label">Monthly cost</div><div className="stat-val">$170</div><div className="stat-note">full AI stack</div></div>
        <div className="stat-card"><div className="stat-label">Freelancer cost</div><div className="stat-val">$0</div><div className="stat-note">100% AI produced</div></div>
        <div className="stat-card"><div className="stat-label">Free tools</div><div className="stat-val">{tools.filter(t=>!t.paid).length} of {tools.length}</div><div className="stat-note">no subscription</div></div>
        <div className="stat-card"><div className="stat-label">Profit margin</div><div className="stat-val">90%+</div><div className="stat-note">at portfolio scale</div></div>
      </div>
      <div className="tools-grid">
        {tools.map((t,i) => (
          <div key={i} className="tool-card">
            <div><div className="tool-name">{t.name}</div><div className="tool-use">{t.use}</div></div>
            <span className={`tool-cost ${t.paid ? "cost-paid" : "cost-free"}`}>{t.cost}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AutomationPanel() {
  const rows = [
    {task:"Topic & keyword research",tool:"vidIQ + Claude",fill:100,label:"Full AI",cls:"full",before:"60 min",after:"5 min"},
    {task:"Script writing",tool:"Claude",fill:100,label:"Full AI",cls:"full",before:"3–4 hrs",after:"15 min"},
    {task:"Voiceover narration",tool:"HeyGen Brad (Cole lip-sync + audio)",fill:100,label:"Full AI",cls:"full",before:"2 hrs",after:"10 min"},
    {task:"Captions / subtitles",tool:"CapCut Pro auto-captions — burned in, all videos",fill:100,label:"Full AI",cls:"full",before:"60 min",after:"2 min"},
    {task:"Title, description & tags",tool:"Claude + vidIQ",fill:100,label:"Full AI",cls:"full",before:"45 min",after:"5 min"},
    {task:"Upload scheduling",tool:"YouTube Studio",fill:100,label:"Full AI",cls:"full",before:"20 min",after:"2 min"},
    {task:"Video assembly & editing",tool:"DaVinci Resolve 21 (free)",fill:50,label:"Manual",cls:"part",before:"3–4 hrs",after:"2–3 hrs"},
    {task:"Thumbnail design",tool:"Cole + Canva → you review",fill:60,label:"Partial AI",cls:"part",before:"45 min",after:"15 min"},
    {task:"Niche & topic strategy",tool:"Your judgment — Claude informs",fill:20,label:"Human only",cls:"human",after:"30 min/wk"},
    {task:"Quality control",tool:"You — watch every video before upload",fill:20,label:"Human only",cls:"human",after:"15 min/video"},
  ];
  return (
    <div>
      <div className="panel-header">
        <div className="panel-title">Automation Map</div>
        <div className="panel-sub">85–90% of production is fully automated. Your role is direction + quality control.</div>
        <div className="gold-line" />
      </div>
      <div className="stat-grid">
        <div className="stat-card"><div className="stat-label">Fully automated</div><div className="stat-val" style={{color:"var(--green)"}}>6 tasks</div><div className="stat-note">AI does 100%</div></div>
        <div className="stat-card"><div className="stat-label">Partially automated</div><div className="stat-val" style={{color:"var(--amber)"}}>2 tasks</div><div className="stat-note">AI drafts, you review</div></div>
        <div className="stat-card"><div className="stat-label">Human only</div><div className="stat-val" style={{color:"var(--red)"}}>2 tasks</div><div className="stat-note">strategy + QC</div></div>
        <div className="stat-card"><div className="stat-label">Time per video</div><div className="stat-val" style={{color:"var(--gold)"}}>1.5–2 hrs</div><div className="stat-note">down from 12–16 hrs</div></div>
      </div>
      <div className="sop-box">
        {rows.map((r,i) => (
          <div key={i} className="auto-row">
            <div style={{flex:1}}><div className="auto-task">{r.task}</div><div className="auto-tool">{r.tool}</div></div>
            <div className="auto-bar-wrap">
              <div className="auto-bar-bg"><div className={`auto-bar-fill fill-${r.cls}`} style={{width:`${r.fill}%`}} /></div>
              <div className={`auto-label label-${r.cls}`}>{r.label}</div>
            </div>
            <div className="auto-time">
              {r.before && <div className="time-before">{r.before}</div>}
              <div className="time-after">{r.after}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MonetizationPanel() {
  const items = [
    {phase:"Week 3–4 · after first views arrive",title:"Affiliate marketing",desc:"Apply for Amazon Associates once you have initial traffic (~Case #004–005). Amazon requires 3 sales in 180 days or the account closes — applying with zero audience risks losing the account. Add one topic-specific book link per video. Audible bounty ($5–10/trial) and CuriosityStream ($10/subscription) via same account.",earn:"Potential: $50–500/mo · scales with views · apply at Case #004",active:true},
    {phase:"500 subscribers",title:"Channel memberships + Super Thanks",desc:"Early YPP tier. Exclusive content, badges, direct tips. Apply as soon as you hit 500 subs + 3,000 watch hours.",earn:"Potential: $100–500/mo per channel",active:true},
    {phase:"1,000 subscribers + 4,000 watch hours",title:"YouTube Partner Program (AdSense)",desc:"Full ad revenue access. History channels earn $5–10 RPM — 100K views = $500–1,000/month.",earn:"At 100K views/mo: $500–1,000 · At 500K views/mo: $2,500–5,000",active:false},
    {phase:"2,000–5,000 subscribers",title:"Brand sponsorships",desc:"Pitch brands directly: Curiosity Stream, Nebula, Audible, MasterClass, Skillshare. History channels: $1,000–5,000 per integration. Finance channels: $2,000–15,000.",earn:"$200–5,000 per integration depending on channel size",active:false},
    {phase:"Month 18 — Channel 1 first",title:"Digital products",desc:"Case file PDFs, research packs, extended content. Zero marginal cost, highest margin. A $19 pack sold to 1% of 50K subscribers = $9,500 in a single launch.",earn:"Highest margin stream — scales to $3,000–15,000/mo at portfolio scale",active:false},
    {phase:"Phase 4 — long term",title:"IP licensing + channel acquisition",desc:"License channel content to streaming platforms. Acquire channels at 10K–50K subscribers for faster monetization.",earn:"Uncapped — this is where real media company value is built",active:false},
  ];
  return (
    <div>
      <div className="panel-header">
        <div className="panel-title">Monetization Roadmap</div>
        <div className="panel-sub">Multiple revenue streams — some start day 1, others unlock over time</div>
        <div className="gold-line" />
      </div>
      <div className="stat-grid">
        <div className="stat-card"><div className="stat-label">YPP threshold</div><div className="stat-val">1K subs</div><div className="stat-note">+ 4K watch hours</div></div>
        <div className="stat-card"><div className="stat-label">Time to monetize</div><div className="stat-val">4–8 mo</div><div className="stat-note">consistent uploads</div></div>
        <div className="stat-card"><div className="stat-label">History RPM</div><div className="stat-val">$5–10</div><div className="stat-note">per 1,000 views</div></div>
        <div className="stat-card"><div className="stat-label">At 100K subs</div><div className="stat-val">$800–2,500</div><div className="stat-note">AdSense/month</div></div>
      </div>
      <div className="mono-timeline">
        {items.map((item,i) => (
          <div key={i} className={`mono-item ${item.active ? "active" : "future"}`}>
            <div className="mono-dot" />
            <div className="mono-phase">{item.phase}</div>
            <div className="mono-title">{item.title}</div>
            <div className="mono-desc">{item.desc}</div>
            <div className="mono-earn">{item.earn}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── NEW: CONTENT TRAJECTORY PANEL ──────────────────────────────────────────
function TrajectoryPanel() {
  return (
    <div>
      <div className="panel-header">
        <div className="panel-title">Vanished History — Content Trajectory</div>
        <div className="panel-sub">12-video reframe plan · from historical mysteries to lost wealth & collapsed empires</div>
        <div className="gold-line" />
      </div>

      <div className="info-box" style={{borderColor:"rgba(201,168,76,0.4)"}}>
        <div className="info-title">The repositioning, in one line</div>
        <div className="info-body">{TRAJECTORY.repositioning}</div>
      </div>

      <div className="stat-grid">
        <div className="stat-card"><div className="stat-label">RPM before pivot</div><div className="stat-val">$8–15</div><div className="stat-note">generic mysteries</div></div>
        <div className="stat-card"><div className="stat-label">RPM after pivot</div><div className="stat-val">$12–20</div><div className="stat-note">finance-adjacent</div></div>
        <div className="stat-card"><div className="stat-label">Pivot video</div><div className="stat-val">#4</div><div className="stat-note">Bronze Age Collapse</div></div>
        <div className="stat-card"><div className="stat-label">Canary test</div><div className="stat-val">#10</div><div className="stat-note">financial mania</div></div>
      </div>

      {TRAJECTORY.phases.map((phase, pi) => (
        <div key={phase.id} style={{marginBottom:28}}>
          {phase.decision && (
            <div className="info-box" style={{borderColor:"rgba(61,111,168,0.3)",marginBottom:12}}>
              <div className="info-title">↓ Decision point</div>
              <div className="info-body">{phase.decision}</div>
            </div>
          )}
          <div style={{marginBottom:10}}>
            <span className={`traj-phase-label ${phase.cls}`}>{phase.label}</span>
            <span style={{fontSize:12,color:"var(--text3)",marginLeft:10}}>{phase.desc}</span>
          </div>
          {phase.videos.map((v) => (
            <div key={v.num} className={`vid-row ${v.cls}`}>
              <div className="vid-num">{v.num}</div>
              <div className="vid-body">
                <div className="vid-topic">
                  {v.topic}
                  {v.flag && <span className="vid-flag">{v.flag}</span>}
                </div>
                <div className="vid-title">{v.title}</div>
                <div className="vid-note">{v.note}</div>
              </div>
            </div>
          ))}
        </div>
      ))}

      <div className="section-title">The steering rules</div>
      <div className="info-box">
        <div className="info-title">Pivot on data, not theory</div>
        <div className="info-body">{TRAJECTORY.steeringRule}</div>
      </div>
      <div className="info-box">
        <div className="info-title">The one line to hold</div>
        <div className="info-body">{TRAJECTORY.holdTheLine}</div>
      </div>
    </div>
  );
}

// ─── NEW: PRODUCTION LOOP PANEL ──────────────────────────────────────────────
function ProductionLoopPanel() {
  const steps = [
    { n:"1", icon:"✍️", label:"Research + script", note:"Claude researches + writes · answer core question in first 30–60s · SEO titles · description · chapters · pinned comment" },
    { n:"2", icon:"🎙️", label:"Voiceover + Cole clips", note:"HeyGen · Cole (Photo Avatar) · Cipher House voice (Brad) · Remove all '...' from script before pasting · 5 sections → 5 MP4 clips · audio on A1, Cole video on V2 · Case #002 uses ElevenLabs MP3s already recorded" },
    { n:"3", icon:"🎞️", label:"Footage hunt", note:"Cold open first · section-by-section · 25–35 clips · archive.org / Wikimedia / Pexels" },
    { n:"4", icon:"🎭", label:"HeyGen — already done in step 2", note:"Cole clips generated in step 2 alongside voiceover. No separate HeyGen session needed from Case #003 onward." },
    { n:"5", icon:"🎬", label:"Edit + Thumbnail A", note:"DaVinci Resolve → footage background + character overlay → text overlays → export FINAL.mp4 → CapCut Pro burned-in captions → Canva thumbnail A" },
    { n:"6", icon:"📱", label:"3 Shorts created", note:"Title = most compelling line from that clip + #Shorts · desc 'The full story: [link]' · 9:16 · CapCut burned-in captions · remixing ON · playlist · no custom thumbnail/tags" },
    { n:"7", icon:"⬆️", label:"Upload + schedule", note:"QC watch-through · description + SEO + chapters · playlist · affiliate link from Case #004 onward · ⚠️ AI DISCLOSURE → YES · schedule main 2pm PST + 3 Shorts 2:30 / 4:00 / 6:00pm" },
    { n:"8", icon:"🚀", label:"Launch day", note:"Main live 2pm · pinned comment within 5 min · Shorts auto-publish 2:30 / 4:00 / 6:00pm · after 2pm add related-video link to each Short · Reddit seeding" },
    { n:"9", icon:"🌐", label:"Reddit + Quora seeding", note:"Engage genuinely first, then share · topic-specific subreddits · high-view Quora question + link" },
    { n:"10", icon:"💬", label:"Comment replies (48 hrs)", note:"Reply to every comment in first 24–48 hrs · heart the rest · pin best viewer theory" },
    { n:"11", icon:"🖼️", label:"Version B thumbnail", note:"3–5 days after launch · duplicate Version A · change ONE thing (expression OR text, not both) · start Test & Compare" },
    { n:"12", icon:"📊", label:"A/B check (14 days)", note:"14 days after launch · check Test & Compare · keep the winner permanently" },
  ];

  const shorts = [
    { label:"Short #1 — The Hook", desc:"Most shocking opening moment (0:00–1:00 of long-form). The thing that stops the scroll." },
    { label:"Short #2 — The Key Reveal", desc:"The central unanswered question or most surprising fact from the body of the video." },
    { label:"Short #3 — The Unresolved Ending", desc:"The closing question — drives comments and subscribes. 'What do you think really happened?' Highest long-form conversion rate." },
  ];

  return (
    <div>
      <div className="panel-header">
        <div className="panel-title">Production Loop</div>
        <div className="panel-sub">The 12-step per-video system — applied identically to every case, every channel</div>
        <div className="gold-line" />
      </div>

      <div className="section-title">The 12-step loop</div>
      <div style={{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"var(--radius)",padding:"8px 18px",marginBottom:24}}>
        {steps.map((s) => (
          <div key={s.n} className="gate-row">
            <div className="gate-label">{s.icon} {s.n}.</div>
            <div className="gate-desc"><strong style={{color:"var(--text)"}}>{s.label}</strong> — {s.note}</div>
          </div>
        ))}
      </div>

      <div className="section-title">3 Shorts per video — 36 total in Month 1</div>
      {shorts.map((s, i) => (
        <div key={i} className="short-row">
          <div className="short-label">{s.label}</div>
          <div className="short-desc">{s.desc}</div>
        </div>
      ))}
      <div className="info-box" style={{marginTop:12}}>
        <div className="info-title">Short specs + CTA</div>
        <div className="info-body">Up to 3 min · vertical 9:16 · CapCut burned-in captions · ⚠️ AI disclosure · schedule 2:30 / 4:00 / 6:00pm PST on launch day.<br/><br/>Title: most compelling line from that clip + #Shorts · Description: "The full story: [main video link]" · Remixing: ALLOWED (helps Shorts discovery) · Playlist: "Vanished History — The Cases" (everything goes in one playlist) · No custom thumbnail, no tags — YouTube ignores both for Shorts.<br/><br/>After the main video goes live: open each Short → Video elements → Add related video → link the full video.</div>
      </div>

      <div className="section-title">Thumbnail A/B system</div>
      <div style={{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"var(--radius)",padding:"8px 18px",marginBottom:20}}>
        <div className="gate-row"><div className="gate-label">Edit day</div><div className="gate-desc">Create <strong style={{color:"var(--text)"}}>Version A</strong> — primary thumbnail, uploaded at launch.</div></div>
        <div className="gate-row"><div className="gate-label">3–5 days</div><div className="gate-desc">Create <strong style={{color:"var(--text)"}}>Version B</strong> — change ONE thing only: expression OR text, never both.</div></div>
        <div className="gate-row"><div className="gate-label">14 days</div><div className="gate-desc"><strong style={{color:"var(--text)"}}>A/B check</strong> — compare CTR in Test & Compare, keep the winner permanently.</div></div>
      </div>
      <div className="info-box">
        <div className="info-title">What moves CTR most</div>
        <div className="info-body">Character expression (shocked vs serious vs concerned) and text (question vs statement vs number). Keep thumbnail text style identical across all videos — same font, placement, color. That visual grammar is itself an algorithm signal.</div>
      </div>

      <div className="section-title">Post-launch growth checklist — every video</div>
      <div style={{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"var(--radius)",padding:"8px 18px",marginBottom:20}}>
        {[
          ["+5 min", "Pinned comment posted"],
          ["Pre-sched", "Shorts publish 2:30 / 4:00 / 6:00pm · after 2pm add related-video link to each"],
          ["Launch day", "Reddit seeding (topic-specific subreddits)"],
          ["+48 hrs", "Quora answer + reply to all comments"],
          ["Every video (affiliate from Case #004)", "Topic-specific affiliate link · added to playlist · end screen set"],
        ].map(([t,d],i) => (
          <div key={i} className="gate-row"><div className="gate-label">{t}</div><div className="gate-desc">{d}</div></div>
        ))}
      </div>

      <div className="section-title">Operating rhythm — auto-populates in Today on the Dashboard</div>
      <div style={{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"var(--radius)",padding:"8px 18px"}}>
        {[
          ["Mon/Wed/Fri", "Comment reply session — 8:30pm after gym, ~15 min"],
          ["Every Friday", "Weekly analytics check — 6pm, 15 min. Views, CTR, retention, traffic source"],
          ["First Monday", "Monthly Business Review + vidIQ outlier analysis"],
          ["1st of month", "Monetization milestone check — track toward YPP"],
        ].map(([t,d],i) => (
          <div key={i} className="gate-row"><div className="gate-label">{t}</div><div className="gate-desc">{d}</div></div>
        ))}
      </div>
    </div>
  );
}

// ─── NEW: CHANNEL LINEUP PANEL ───────────────────────────────────────────────
function LineupPanel({ setPanel }) {
  return (
    <div>
      <div className="panel-header">
        <div className="panel-title">The Empire — Channel Lineup</div>
        <div className="panel-sub">5 channels ranked by business merit · a money-and-systems through-line connects all five</div>
        <div className="gold-line" />
      </div>

      <div className="stat-grid">
        <div className="stat-card"><div className="stat-label">Total channels</div><div className="stat-val">5</div><div className="stat-note">staggered build</div></div>
        <div className="stat-card"><div className="stat-label">Combined target</div><div className="stat-val">$20k+/mo</div><div className="stat-note">by end 2028</div></div>
        <div className="stat-card"><div className="stat-label">Lead channel</div><div className="stat-val">Ch2</div><div className="stat-note">Business Forensics</div></div>
        <div className="stat-card"><div className="stat-label">Build horizon</div><div className="stat-val">2.5 yrs</div><div className="stat-note">from Jun 11 launch</div></div>
      </div>

      <div className="section-title">Ranked by business merit</div>
      {CHANNEL_LINEUP.map((ch) => (
        <div key={ch.rank} className={`lineup-item ${ch.cls}`}>
          <div className="lineup-rank">{ch.rank}</div>
          <div className="lineup-body">
            <div className="lineup-name">{ch.name}</div>
            <div className="lineup-role">{ch.role}</div>
            <div className="lineup-tags">
              {ch.cls === "ch1" && <span className="ltag ltag-live">● Launches Jun 11</span>}
              {ch.cls !== "ch1" && <span className="ltag ltag-blue">{ch.launch}</span>}
              <span className="ltag ltag-rpm">{ch.rpm}</span>
              <span className="ltag">{ch.proj}</span>
              <span className="ltag">Gate: {ch.trigger}</span>
            </div>
          </div>
        </div>
      ))}

      <div className="section-title" style={{marginTop:28}}>Scaling gates — each gets stricter</div>
      <div style={{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"var(--radius)",padding:"8px 18px",marginBottom:20}}>
        {SCALING_GATES.map((g) => (
          <div key={g.from} className="gate-row">
            <div className="gate-label">{g.from}</div>
            <div className="gate-desc"><strong style={{color:"var(--text)"}}>{g.rule}</strong> — {g.desc}</div>
          </div>
        ))}
      </div>

      <div className="section-title">The three rules</div>
      <div className="info-box">
        <div className="info-title">Rule 1 — Don't launch until the current channel runs without scrambling</div>
        <div className="info-body">System stability over monetization. The workflow is documented, repeatable, and runs on rhythm not hustle. For Ch1→Ch2 that's 60 days of consistent execution.</div>
      </div>
      <div className="info-box">
        <div className="info-title">Rule 2 — Every dollar of early revenue gets reinvested</div>
        <div className="info-body">Into tools, hiring, and growth until $5k/month combined. That's the inflection point where Cipher House compounds.</div>
      </div>
      <div className="info-box">
        <div className="info-title">Rule 3 — You are the strategist, not the producer</div>
        <div className="info-body">Document every process from the start. Build as if you're going to hand each channel off, even while running it solo. That discipline is what separates media companies from YouTube hobbyists.</div>
      </div>

      <div style={{marginTop:20}}>
        <button onClick={() => setPanel("empire")} style={{background:"var(--gold-dim)",border:"1px solid var(--gold-dim2)",color:"var(--gold2)",borderRadius:7,padding:"8px 16px",fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>View full Scaling Roadmap →</button>
      </div>
    </div>
  );
}

function FormatMatrix() {
  const ROWS = [
    ["Structure","The fixed episode arc — same beats every video"],
    ["Hook rule","What must happen in the first 30–60s to stop the scroll"],
    ["Visual identity","The look that makes a thumbnail/frame instantly recognizable"],
    ["Voice","The narration identity — locked settings, same every video"],
    ["Length","Long-form target + short-form funnel format"],
    ["Close","How every video ends to drive engagement + subscribes"],
  ];
  const CHANNELS = [
    {
      name:"Vanished History",status:"Channel 1 · live",live:true,
      cells:[
        "Hook → Background → Mystery → Theories → Unresolved Ending",
        "Core question answered with a specific name / date / place in first 60s",
        "Cole (HeyGen, from Case #002 — Case #001 faceless) + archive / Wikimedia / Pexels footage. Wealth/collapse framing from Video 4.",
        "HeyGen Brad (Cipher House voice) — deep, measured, authoritative",
        "13–14 min long-form + 3 vertical Shorts",
        "Open-ended question → 'I read every single one' → subscribe",
      ]
    },
    {name:"Channel 2",status:"Business Forensics · Aug 2026",live:false,cells:["—","—","—","—","—","—"]},
  ];
  const labelW=150,colW=210;
  return (
    <div style={{overflowX:"auto",paddingBottom:4}}>
      <div style={{minWidth:labelW+colW*CHANNELS.length,fontSize:11.5}}>
        <div style={{display:"flex",borderBottom:"1px solid var(--border2)"}}>
          <div style={{width:labelW,flexShrink:0,padding:"7px 10px 7px 0",fontFamily:"'DM Mono', monospace",fontSize:9,letterSpacing:"0.1em",textTransform:"uppercase",color:"var(--text3)"}}>Format row</div>
          {CHANNELS.map((ch,i) => (
            <div key={i} style={{width:colW,flexShrink:0,padding:"7px 10px",borderLeft:"1px solid var(--border)"}}>
              <div style={{fontWeight:600,color:ch.live?"var(--gold2)":"var(--text3)",fontSize:12.5}}>{ch.name}</div>
              <div style={{fontFamily:"'DM Mono', monospace",fontSize:8.5,letterSpacing:"0.06em",textTransform:"uppercase",color:ch.live?"var(--green)":"var(--text3)",marginTop:2}}>{ch.status}</div>
            </div>
          ))}
        </div>
        {ROWS.map(([rowName,rowDef],r) => (
          <div key={r} style={{display:"flex",borderBottom:r===ROWS.length-1?"none":"1px solid var(--border)"}}>
            <div style={{width:labelW,flexShrink:0,padding:"9px 10px 9px 0"}}>
              <div style={{color:"var(--gold)",fontWeight:500}}>{rowName}</div>
              <div style={{color:"var(--text3)",fontSize:10.5,lineHeight:1.45,marginTop:2}}>{rowDef}</div>
            </div>
            {CHANNELS.map((ch,i) => (
              <div key={i} style={{width:colW,flexShrink:0,padding:"9px 10px",borderLeft:"1px solid var(--border)",color:ch.live?"var(--text2)":"var(--text3)",lineHeight:1.45,fontStyle:ch.live?"normal":"italic"}}>{ch.cells[r]}</div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function EmpirePanel() {
  const phases = [
    {cls:"ph1",title:"Phase 1 — Master the system",sub:"Jun 2026 – Dec 2026 · Channel 1 only · Vanished History",stats:[["Focus","1 channel"],["Videos","72+"],["Milestone","1K subs + YPP"],["Revenue","$300–800/mo"]],desc:"Lock in the production workflow until it takes under 3 hours per video. Hit YPP at 1,000 subs + 4,000 watch hours (expected months 4–8). Drift Vanished History from generic mysteries toward lost wealth & collapsed empires starting Video 4. Do NOT launch Channel 2 before Month 6 or 60 days stable execution."},
    {cls:"ph2",title:"Phase 2 — First expansion",sub:"Aug 2026 · Add Channel 2 · Business & Financial Forensics",stats:[["Channels","2 active"],["Trigger","60 days stable"],["Ch2 RPM","$15–25"],["Revenue","$1,500–4,000/mo"]],desc:"Launch Channel 2 (Business & Financial Forensics — how companies actually make money, hidden revenue models, profit breakdowns). This is your strongest-positioned channel (8.5/10 confidence). Apply all Channel 1 learnings. Your Channel 1 audience crossovers naturally."},
    {cls:"ph3",title:"Phase 3 — Portfolio build",sub:"Q1–Q3 2027 · Channels 3 + 4 · Personal Finance & AI Tools",stats:[["Channels","4 active"],["Ch3 RPM","$25–50"],["Revenue","$5,000–12,000/mo"],["Hours/wk","45–55"]],desc:"Launch Channel 3 (Personal Finance for Online Business Owners — highest RPM niche on YouTube). Then Channel 4 (AI Tools & Systems — decoupled from Cipher House, evergreen format, affiliate-revenue driven). Launch digital products on Channel 1. Build email lists and Discord communities."},
    {cls:"ph4",title:"Phase 4 — Media company",sub:"Q1 2028 onward · Channel 5 · Financial Crime & Corporate Fraud",stats:[["Channels","5 active"],["Ch5 RPM","$10–18"],["Revenue","$20,000–50,000/mo"],["Role","CEO strategy only"]],desc:"Launch Channel 5 (Financial Crime & Corporate Fraud — true crime that pays like business content. Cross-pollinates with all four channels). Evaluate channel acquisition. Diversify: podcast, newsletter, Patreon, content licensing. Consider one part-time VA/channel manager."},
  ];
  return (
    <div>
      <div className="panel-header">
        <div className="panel-title">Scaling Roadmap</div>
        <div className="panel-sub">4-phase plan to build Cipher House — just us and the AI stack</div>
        <div className="gold-line" />
      </div>
      <div className="stat-grid">
        <div className="stat-card"><div className="stat-label">End goal</div><div className="stat-val">5 channels</div><div className="stat-note">full portfolio</div></div>
        <div className="stat-card"><div className="stat-label">Timeline</div><div className="stat-val">18–24 mo</div><div className="stat-note">to full portfolio</div></div>
        <div className="stat-card"><div className="stat-label">Monthly tool cost</div><div className="stat-val">$170</div><div className="stat-note">no freelancers needed</div></div>
        <div className="stat-card"><div className="stat-label">Month 24 target</div><div className="stat-val">$20K+</div><div className="stat-note">combined monthly</div></div>
      </div>
      {phases.map((p,i) => (
        <div key={i} className={`phase-card ${p.cls}`}>
          <div className="phase-title">{p.title}</div>
          <div className="phase-sub">{p.sub}</div>
          <div className="phase-stats">
            {p.stats.map(([l,v],j) => <div key={j} className="phase-stat"><div className="phase-stat-label">{l}</div><div className="phase-stat-val">{v}</div></div>)}
          </div>
          <div className="phase-desc">{p.desc}</div>
        </div>
      ))}
      <div className="info-box" style={{borderColor:"rgba(201,168,76,0.4)"}}>
        <div className="info-title">The Niche Format doctrine</div>
        <div style={{fontSize:12.5,color:"var(--text3)",lineHeight:1.7,marginBottom:14}}>A niche is a topic. A <span style={{color:"var(--gold2)"}}>niche format</span> is the repeatable system that turns that topic into a content machine. The format is what separates you from every other channel. Every new channel fills in all six rows before video 1.</div>
        <FormatMatrix />
      </div>
      <div className="info-box">
        <div className="info-title">The 7 non-negotiable rules of scaling</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,fontSize:12,color:"var(--text3)",lineHeight:1.6}}>
          {["Never launch a new channel before the previous one is profitable","Every channel uses the same production system — no new tools at launch","Each new channel targets a higher CPM niche than the previous","Reinvest 50% of all revenue until Month 18","Document every SOP before starting a new channel","Monthly analytics review — first Monday of every month","Channel 1 always comes first — never let flagship quality drop"].map((r,i) => (
            <div key={i}><span style={{color:"var(--gold)",fontWeight:500}}>{i+1}.</span> {r}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PortfolioPanel() {
  return (
    <div>
      <div className="panel-header">
        <div className="panel-title">Channel Portfolio</div>
        <div className="panel-sub">5-channel empire · $170/mo tool cost · ranked by business merit</div>
        <div className="gold-line" />
      </div>
      <div style={{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"var(--radius)",overflow:"auto",marginBottom:24}}>
        <table className="portfolio-table">
          <thead>
            <tr><th>Channel</th><th>Niche</th><th>Status</th><th>Launch</th><th>RPM target</th><th>Gate trigger</th><th>Month 24–30</th></tr>
          </thead>
          <tbody>
            {[
              {name:"Vanished History",niche:"Lost civilizations & collapsed empires",status:"active",launch:"Jun 2026",rpm:"$12–20",trigger:"—",proj:"$500–2k/mo"},
              {name:"Business & Financial Forensics",niche:"How companies actually make money",status:"ph2",launch:"Aug 2026",rpm:"$15–25",trigger:"60 days stable execution",proj:"$2k–5k/mo"},
              {name:"Personal Finance for Builders",niche:"Solopreneur finance & tax",status:"ph3",launch:"Q1 2027",rpm:"$25–50",trigger:"Ch2 in YPP",proj:"$5k–12k/mo"},
              {name:"AI Tools & Systems",niche:"AI automation for small operations",status:"ph3b",launch:"Q3 2027",rpm:"$20–40",trigger:"Combined $2k+/mo",proj:"$2k–4k/mo"},
              {name:"Financial Crime & Corporate Fraud",niche:"White-collar crime narratives",status:"ph4",launch:"Q1 2028",rpm:"$10–18",trigger:"1 hire in place",proj:"$2k–5k/mo"},
            ].map((ch,i) => (
              <tr key={i}>
                <td style={{color:"var(--gold)",fontWeight:500}}>{ch.name}</td>
                <td style={{color:"var(--text2)"}}>{ch.niche}</td>
                <td><span className={`status-badge status-${ch.status}`}>{ch.status==="active"?"Active":ch.status==="ph2"?"Phase 2":ch.status==="ph3"?"Phase 3 · 1st":ch.status==="ph3b"?"Phase 3 · 2nd":"Phase 4"}</span></td>
                <td style={{color:"var(--text2)"}}>{ch.launch}</td>
                <td style={{color:"var(--text2)"}}>{ch.rpm}</td>
                <td style={{color:"var(--text3)",fontSize:11}}>{ch.trigger}</td>
                <td style={{color:"#60b080",fontFamily:"var(--font-mono)",fontSize:11}}>{ch.proj}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="info-box">
        <div className="info-title">The portfolio through-line</div>
        <div className="info-body">Business, money, and systems thinking run through Channels 2, 3, 4, and 5. Vanished History drifts toward this from Video 4. Each channel's audience crossovers naturally to the next. That cross-pollination is a real strategic asset — not an afterthought.</div>
      </div>
    </div>
  );
}

function RevenuePanel() {
  return (
    <div>
      <div className="panel-header">
        <div className="panel-title">Revenue Model</div>
        <div className="panel-sub">All revenue streams across all channels · built to compound</div>
        <div className="gold-line" />
      </div>
      <div className="stat-grid">
        <div className="stat-card"><div className="stat-label">Month 12</div><div className="stat-val">$300–800</div><div className="stat-note">Channel 1 only</div></div>
        <div className="stat-card"><div className="stat-label">Month 18</div><div className="stat-val">$1.5K–4K</div><div className="stat-note">Channels 1+2</div></div>
        <div className="stat-card"><div className="stat-label">Month 24</div><div className="stat-val">$5K–12K</div><div className="stat-note">Channels 1–4</div></div>
        <div className="stat-card"><div className="stat-label">Month 30+</div><div className="stat-val">$20K–50K</div><div className="stat-note">Full portfolio</div></div>
      </div>
      <MonetizationPanel />
    </div>
  );
}

function SOPPanel() {
  return (
    <div>
      <div className="panel-header">
        <div className="panel-title">SOPs & Production Workflow</div>
        <div className="panel-sub">Standard operating procedures — the same system deployed across every channel</div>
        <div className="gold-line" />
      </div>
      <div className="section-title">Google account hygiene — hard rules (locked Jun 10)</div>
      <div className="sop-box" style={{marginBottom:24}}>
        {[
          ["Vanished profile","watchvanished@gmail.com ONLY · zero extensions · zero other accounts · all YouTube Studio work happens here","Never break"],
          ["Work profile","GOAT account + Claude-in-Chrome extension + Google Calendar · the ONLY profile the extension lives in","Extension home"],
          ["DRIPS 2 EAZY profile","majorandkae@gmail.com personal · YouTube channel deleted Jun 10 — no YouTube association remains","Clean"],
          ["The rule","The extension never touches the Vanished profile. No account ever signs into two profiles. This is what prevents a third lockout.","Non-negotiable"],
        ].map(([t,d,time],i) => (
          <div key={i} className="auto-row">
            <div style={{flex:1}}><div className="auto-task">{t}</div><div className="auto-tool">{d}</div></div>
            <div className="auto-time"><div className="time-after">{time}</div></div>
          </div>
        ))}
      </div>
      <div className="section-title">Single channel weekly schedule (25–30 hrs/wk) — each day auto-appears in Today</div>
      <div className="sop-box">
        {[
          ["Monday — HeyGen clips + footage","HeyGen → Cole lip-sync + voiceover (Brad) · paste script section by section · remove '...' → 5 MP4 clips · Archive.org + Pexels footage","3–4 hrs"],
          ["Tuesday — DaVinci edit","Footage background → character overlays → text overlays → color grade → export → CapCut burned-in captions","2–3 hrs"],
          ["Wednesday — Thumbnail + upload","Cole → Canva layout → YouTube Studio → SEO → chapters → AI disclosure","2–3 hrs"],
          ["Thursday — Community + distribution","Reddit seeding → Quora answer → pinned comment → Short upload → reply to all comments","1–2 hrs"],
          ["Friday — Analytics + next week prep","YouTube Studio analytics → Claude writes next 3 scripts → content calendar updated","2–3 hrs"],
          ["Saturday — Batch production sprint","Generate 2–3 HeyGen Cole clip sets + edit multiple videos back to back · builds 1-week buffer","4–6 hrs"],
        ].map(([t,d,time],i) => (
          <div key={i} className="auto-row">
            <div style={{flex:1}}><div className="auto-task">{t}</div><div className="auto-tool">{d}</div></div>
            <div className="auto-time"><div className="time-after">{time}</div></div>
          </div>
        ))}
      </div>
      <div className="section-title">Claude's standing responsibilities — every channel</div>
      <div className="info-box">
        <div className="sop-grid">
          {[["Research","Full topic research for every video across all channels"],["Scripts","AI voiceover-optimized scripts, all sections, all channels"],["SEO","Titles, descriptions, tags, chapters for every video"],["Strategy","Monthly outlier analysis, content calendars, niche research"],["Community","Pinned comments, Reddit answers, Quora answers pre-written"],["Intelligence","Proactively flag new tools, algorithm changes, opportunities"],["Channel launches","Full launch plans for Channels 2–5 when triggered"],["Business reviews","Monthly analytics review and strategic recommendations"]].map(([l,d],i) => (
            <div key={i} className="sop-item"><strong>{l}</strong>{d}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

function OSPanel() {
  return (
    <div>
      <div className="panel-header">
        <div className="panel-title">Business OS</div>
        <div className="panel-sub">Master operating system — channel status, monthly review framework, partnership model</div>
        <div className="gold-line" />
      </div>
      <div className="section-title">Channel status tracker</div>
      <div style={{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"var(--radius)",overflow:"auto",marginBottom:24}}>
        <table className="portfolio-table">
          <thead><tr><th>Channel</th><th>Niche</th><th>Status</th><th>Launch</th><th>RPM</th><th>Gate trigger</th></tr></thead>
          <tbody>
            {[
              ["Vanished History","Lost civilizations & collapsed empires","active","Jun 2026","$12–20","—"],
              ["Business & Financial Forensics","How companies actually make money","ph2","Aug 2026","$15–25","60 days stable execution"],
              ["Personal Finance for Builders","Solopreneur finance & tax","ph3","Q1 2027","$25–50","Ch2 in YPP"],
              ["AI Tools & Systems","AI automation for small operations","ph3b","Q3 2027","$20–40","Combined $2k+/mo"],
              ["Financial Crime & Corporate Fraud","White-collar crime narratives","ph4","Q1 2028","$10–18","1 hire in place"],
            ].map(([n,ni,st,la,rpm,trig],i) => (
              <tr key={i}>
                <td style={{color:"var(--gold)",fontWeight:500}}>{n}</td>
                <td style={{color:"var(--text2)"}}>{ni}</td>
                <td><span className={`status-badge status-${st}`}>{st==="active"?"Active":st==="ph2"?"Phase 2":st==="ph3"?"Phase 3 · 1st":st==="ph3b"?"Phase 3 · 2nd":"Phase 4"}</span></td>
                <td style={{color:"var(--text2)"}}>{la}</td>
                <td style={{color:"var(--text2)"}}>{rpm}</td>
                <td style={{color:"var(--text3)",fontSize:11}}>{trig}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="section-title">Monthly business review — first Monday of every month</div>
      <div className="sop-box">
        {[
          ["Analytics review — all active channels","Views, watch time, CTR, RPM, top videos, subscriber growth · identify what's working and why","30 min"],
          ["vidIQ outlier analysis — all competitors","Knowledgia, Voices of the Past, Dark Docs + niche competitors for Channels 2–5","30 min"],
          ["Content calendar rebuild — next 30 days","Claude builds 12–36 video titles per channel based on outlier data and analytics","Claude"],
          ["Revenue review — all streams","AdSense + affiliate + sponsorship + digital products · compare vs previous month","20 min"],
          ["Tool stack review","Are all tools still best-in-class? New tools flagged? Cost optimizations?","15 min"],
          ["Phase trigger check","Hit YPP? Time to launch next channel? Run through scaling gate criteria","15 min"],
        ].map(([t,d,time],i) => (
          <div key={i} className="auto-row">
            <div style={{flex:1}}><div className="auto-task">{t}</div><div className="auto-tool">{d}</div></div>
            <div className="auto-time"><div className="time-after">{time}</div></div>
          </div>
        ))}
      </div>
      <div className="info-box">
        <div className="info-title">The Cipher House partnership model</div>
        <div className="info-body">Cipher House runs on two things: Claude's intelligence and your execution. Claude handles everything that requires thinking — research, scripting, SEO, strategy, competitive analysis, channel launch planning, business reviews, content calendars, and proactively flagging improvements. You handle everything that requires clicking — production, uploads, community engagement, and final quality review. Every month this partnership gets more efficient as systems improve and the production workflow becomes faster. The business scales because the system scales.</div>
      </div>
    </div>
  );
}


// ─── APP ────────────────────────────────────────────────────────────────────

const NAV = [
  { section: "Overview", items: [{ id:"overview", icon:"◈", label:"Dashboard" }] },
  { section: "Launch Plan", items: [
    { id:"tasks",    icon:"✦", label:"Production Plan" },
    { id:"tracker",  icon:"☑", label:"Production Tracker" },
    { id:"calendar", icon:"◷", label:"Content Calendar" },
    { id:"cases",    icon:"◎", label:"Cases #001–#012" },
  ]},
  { section: "Channel 1", items: [
    { id:"trajectory", icon:"↗", label:"Content Trajectory" },
    { id:"niches",     icon:"◎", label:"Niche Research" },
    { id:"growth",     icon:"↑", label:"Growth Tactics" },
    { id:"systems",    icon:"⟲", label:"Growth Systems" },
    { id:"prodloop",   icon:"⚙", label:"Production Loop" },
    { id:"tools",      icon:"⊞", label:"Tool Stack" },
    { id:"automation", icon:"⟳", label:"Automation Map" },
    { id:"monetization", icon:"◈", label:"Monetization" },
  ]},
  { section: "The Empire", items: [
    { id:"lineup",    icon:"⬡", label:"Channel Lineup" },
    { id:"empire",    icon:"◈", label:"Scaling Roadmap" },
    { id:"portfolio", icon:"◎", label:"Channel Portfolio" },
    { id:"revenue",   icon:"◈", label:"Revenue Model" },
    { id:"sop",       icon:"◷", label:"SOPs & Workflow" },
    { id:"os",        icon:"⊞", label:"Business OS" },
  ]},
];

export default function App() {
  const [panel, setPanel] = useState("overview");
  const [doneSet, setDoneSet] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem("ch_tasks") || "[]")); } catch { return new Set(); }
  });

  const allTaskIds = Object.values(TASKS).flat().map(t => t.id);

  const toggleTask = useCallback((id) => {
    setDoneSet(prev => {
      const next = new Set(prev);
      const nowChecked = !next.has(id);
      nowChecked ? next.add(id) : next.delete(id);
      try { localStorage.setItem("ch_tasks", JSON.stringify([...next])); } catch {}
      sbSet(`task:${id}`, nowChecked);
      return next;
    });
  }, []);

  const doneCount = allTaskIds.filter(id => doneSet.has(id)).length;
  const pct = allTaskIds.length > 0 ? Math.round((doneCount / allTaskIds.length) * 100) : 0;

  const [trackerSet, setTrackerSet] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem("ch_tracker") || "[]")); } catch { return new Set(); }
  });
  const toggleStep = useCallback((id) => {
    setTrackerSet(prev => {
      const next = new Set(prev);
      const nowChecked = !next.has(id);
      nowChecked ? next.add(id) : next.delete(id);
      try { localStorage.setItem("ch_tracker", JSON.stringify([...next])); } catch {}
      sbSet(`trk:${id}`, nowChecked);
      return next;
    });
  }, []);

  const [syncStatus, setSyncStatus] = useState(SYNC_ON ? "syncing" : "local");
  useEffect(() => {
    if (!SYNC_ON) return;
    let cancelled = false;
    (async () => {
      const cloud = await sbFetchAll();
      if (cancelled) return;
      if (!cloud) { setSyncStatus("offline"); return; }
      const taskIds = new Set([...cloud].filter(k => k.startsWith("task:")).map(k => k.slice(5)));
      const trkIds  = new Set([...cloud].filter(k => k.startsWith("trk:")).map(k => k.slice(4)));
      setDoneSet(taskIds);
      setTrackerSet(trkIds);
      try {
        localStorage.setItem("ch_tasks", JSON.stringify([...taskIds]));
        localStorage.setItem("ch_tracker", JSON.stringify([...trkIds]));
      } catch {}
      setSyncStatus("synced");
    })();
    return () => { cancelled = true; };
  }, []);

  const PANELS = {
    overview:     <OverviewPanel setPanel={setPanel} doneCount={doneCount} totalTasks={allTaskIds.length} />,
    tasks:        <TasksPanel doneSet={doneSet} onToggle={toggleTask} />,
    tracker:      <ProductionTrackerPanel trackerSet={trackerSet} onToggleStep={toggleStep} />,
    systems:      <GrowthSystemsPanel trackerSet={trackerSet} onToggleStep={toggleStep} />,
    calendar:     <CalendarPanel />,
    cases:        <CasesPanel />,
    trajectory:   <TrajectoryPanel />,
    niches:       <NichesPanel />,
    growth:       <GrowthPanel />,
    prodloop:     <ProductionLoopPanel />,
    tools:        <ToolsPanel />,
    automation:   <AutomationPanel />,
    monetization: <MonetizationPanel />,
    lineup:       <LineupPanel setPanel={setPanel} />,
    empire:       <EmpirePanel />,
    portfolio:    <PortfolioPanel />,
    revenue:      <RevenuePanel />,
    sop:          <SOPPanel />,
    os:           <OSPanel />,
  };

  const [drawerOpen, setDrawerOpen] = useState(false);
  const go = (id) => { setPanel(id); setDrawerOpen(false); };
  const BOTTOM_NAV = [
    { id:"overview",  icon:"◈", label:"Home" },
    { id:"tracker",   icon:"☑", label:"Tracker" },
    { id:"calendar",  icon:"◷", label:"Calendar" },
    { id:"cases",     icon:"◎", label:"Cases" },
  ];

  return (
    <>
      <style>{css}</style>
      <div className="mobile-bar">
        <div className="mb-name">CIPHER HOUSE</div>
        <button className="mb-burger" onClick={() => setDrawerOpen(o => !o)} aria-label="Menu">☰</button>
      </div>
      <div className={`mobile-scrim ${drawerOpen ? "show" : ""}`} onClick={() => setDrawerOpen(false)} />
      <div className="app">
        <div className={`sidebar ${drawerOpen ? "open" : ""}`}>
          <div className="logo">
            <div className="logo-name">CIPHER HOUSE</div>
            <div className="logo-sub">YouTube Automation Empire</div>
          </div>
          <nav className="nav">
            {NAV.map(sec => (
              <div key={sec.section}>
                <div className="nav-section">{sec.section}</div>
                {sec.items.map(item => (
                  <div key={item.id} className={`nav-item ${panel === item.id ? "active" : ""}`} onClick={() => go(item.id)}>
                    <span className="nav-icon">{item.icon}</span>{item.label}
                  </div>
                ))}
              </div>
            ))}
          </nav>
          <div className="progress-box">
            <div className="prog-label">Launch Progress</div>
            <div className="prog-track"><div className="prog-fill" style={{width:`${pct}%`}} /></div>
            <div className="prog-stats"><span>{doneCount} done</span><span>{pct}%</span></div>
          </div>
        </div>
        <div className="main">
          <div className="panel">
            {PANELS[panel] || PANELS.overview}
          </div>
        </div>
      </div>
      <nav className="mobile-nav">
        {BOTTOM_NAV.map(item => (
          <button key={item.id} className={`mn-item ${panel === item.id ? "active" : ""}`} onClick={() => go(item.id)}>
            <span className="mn-icon">{item.icon}</span>{item.label}
          </button>
        ))}
      </nav>
    </>
  );
}
