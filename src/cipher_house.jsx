import { useState, useEffect, useRef, useCallback } from "react";

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

  /* Noise texture */
  body::before {
    content: '';
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E");
    opacity: 0.5;
  }

  .app { display: flex; height: 100vh; position: relative; z-index: 1; overflow: hidden; }

  /* ── SIDEBAR ── */
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

  /* ── MAIN ── */
  .main { flex: 1; overflow-y: auto; overflow-x: hidden; display: flex; flex-direction: column; }
  .main::-webkit-scrollbar { width: 4px; }
  .main::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 2px; }

  .panel { padding: 28px 32px; animation: fadeUp 0.2s ease; }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

  .panel-header { margin-bottom: 24px; }
  .panel-title { font-family: 'Playfair Display', serif; font-size: 26px; font-weight: 700; color: var(--text); line-height: 1.2; }
  .panel-sub { font-size: 13px; color: var(--text2); margin-top: 5px; }
  .gold-line { width: 36px; height: 2px; background: var(--gold); margin-top: 12px; border-radius: 1px; }

  /* ── STAT GRID ── */
  .stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 24px; }
  .stat-card { background: var(--bg2); border: 1px solid var(--border); border-radius: var(--radius); padding: 14px; }
  .stat-label { font-family: 'DM Mono', monospace; font-size: 9px; color: var(--text3); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 5px; }
  .stat-val { font-size: 19px; font-weight: 500; color: var(--text); }
  .stat-note { font-size: 11px; color: var(--text3); margin-top: 3px; }

  /* ── SECTION TITLE ── */
  .section-title { font-family: 'DM Mono', monospace; font-size: 10px; color: var(--text3); letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid var(--border); }

  /* ── TASK CARDS ── */
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

  /* ── LINKS ── */
  .task-links { margin-top: 7px; display: flex; flex-wrap: wrap; gap: 5px; }
  .task-link { font-family: 'DM Mono', monospace; font-size: 10px; color: var(--gold); background: var(--gold-dim); border: 1px solid rgba(201,168,76,0.2); padding: 2px 8px; border-radius: 4px; text-decoration: none; }

  /* ── CALENDAR CARDS ── */
  .cal-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 24px; }
  .cal-card { background: var(--bg2); border: 1px solid var(--border); border-radius: var(--radius); padding: 14px; }
  .cal-card.featured { border-color: rgba(201,168,76,0.3); background: linear-gradient(135deg, var(--bg2), rgba(201,168,76,0.03)); }
  .cal-week { font-family: 'DM Mono', monospace; font-size: 9px; color: var(--gold); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 5px; }
  .cal-theme { font-size: 13px; font-weight: 500; color: var(--text); margin-bottom: 10px; line-height: 1.3; }
  .cal-video { padding: 6px 0; border-bottom: 1px solid var(--border); font-size: 12px; color: var(--text2); display: flex; gap: 7px; align-items: flex-start; }
  .cal-video:last-child { border-bottom: none; }
  .cal-day { font-family: 'DM Mono', monospace; font-size: 10px; color: var(--text3); white-space: nowrap; margin-top: 1px; flex-shrink: 0; }

  /* ── NICHE CARDS ── */
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

  /* ── TOOL CARDS ── */
  .tools-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 9px; margin-bottom: 24px; }
  .tool-card { background: var(--bg2); border: 1px solid var(--border); border-radius: var(--radius); padding: 13px 15px; display: flex; justify-content: space-between; align-items: flex-start; }
  .tool-name { font-size: 13.5px; font-weight: 500; color: var(--text); margin-bottom: 3px; }
  .tool-use { font-size: 12px; color: var(--text3); }
  .tool-cost { font-family: 'DM Mono', monospace; font-size: 11px; padding: 3px 8px; border-radius: 4px; white-space: nowrap; }
  .cost-free { background: var(--green-bg); color: #60b080; }
  .cost-paid { background: var(--amber-bg); color: #c8904a; }

  /* ── AUTOMATION ROWS ── */
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

  /* ── MONETIZATION TIMELINE ── */
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

  /* ── OVERVIEW CARDS ── */
  .ov-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 24px; }
  .ov-card { background: var(--bg2); border: 1px solid var(--border); border-radius: var(--radius); padding: 18px; cursor: pointer; transition: all 0.2s; }
  .ov-card:hover { border-color: var(--gold); background: rgba(201,168,76,0.03); }
  .ov-icon { font-size: 22px; margin-bottom: 9px; }
  .ov-title { font-family: 'Playfair Display', serif; font-size: 17px; font-weight: 700; color: var(--text); margin-bottom: 5px; }
  .ov-desc { font-size: 12px; color: var(--text3); line-height: 1.6; }
  .ov-arrow { color: var(--gold); font-size: 16px; margin-top: 10px; }

  /* ── LAUNCH BANNER ── */
  .launch-banner {
    background: linear-gradient(135deg, rgba(201,168,76,0.13), rgba(201,168,76,0.04));
    border: 1px solid rgba(201,168,76,0.28); border-radius: var(--radius);
    padding: 14px 18px; margin-bottom: 24px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .launch-text { font-family: 'Playfair Display', serif; font-size: 15px; color: var(--gold); }
  .launch-sub { font-size: 12px; color: var(--text3); margin-top: 2px; }
  .launch-date { font-family: 'DM Mono', monospace; font-size: 12px; color: var(--gold2); font-weight: 500; }

  /* ── AI ASSISTANT ── */
  .ai-dock {
    position: fixed; bottom: 0; left: var(--sidebar); right: 0;
    background: linear-gradient(to top, var(--bg) 70%, transparent);
    padding: 16px 24px 20px; z-index: 100;
    transition: all 0.3s ease;
  }
  .ai-dock.expanded { bottom: 0; }
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

  /* ── AI RESPONSE PANEL ── */
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

  /* ── QUICK PROMPTS ── */
  .quick-prompts { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 8px; }
  .qp { font-family: 'DM Mono', monospace; font-size: 10px; padding: 4px 10px; border-radius: 6px; background: var(--bg3); border: 1px solid var(--border); color: var(--text2); cursor: pointer; transition: all 0.15s; }
  .qp:hover { border-color: var(--gold); color: var(--gold); }

  /* ── CASE CARDS ── */
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

  /* ── EMPIRE PHASE CARDS ── */
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

  /* ── PORTFOLIO TABLE ── */
  .portfolio-table { width: 100%; border-collapse: collapse; font-size: 12px; }
  .portfolio-table th { text-align: left; padding: 8px 12px; color: var(--text3); font-weight: 500; font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; font-family: 'DM Mono', monospace; border-bottom: 1px solid var(--border); }
  .portfolio-table td { padding: 10px 12px; border-bottom: 1px solid var(--border); vertical-align: middle; }
  .portfolio-table tr:last-child td { border-bottom: none; }
  .status-badge { padding: 2px 8px; border-radius: 4px; font-size: 10px; font-family: 'DM Mono', monospace; }
  .status-active { background: var(--green-bg); color: #60b080; }
  .status-ph2 { background: var(--blue-bg); color: #6090c8; }
  .status-ph3 { background: var(--amber-bg); color: #c8904a; }
  .status-ph4 { background: var(--red-bg); color: #d06050; }

  /* ── SOP ROWS ── */
  .sop-box { background: var(--bg2); border: 1px solid var(--border); border-radius: var(--radius); padding: 14px 18px; margin-bottom: 20px; }
  .sop-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 10px; }
  .sop-item { font-size: 12px; color: var(--text3); line-height: 1.6; }
  .sop-item strong { color: var(--gold); font-weight: 500; display: block; margin-bottom: 2px; }

  /* ── INFO BOX ── */
  .info-box { background: var(--bg2); border: 1px solid rgba(201,168,76,0.25); border-radius: var(--radius); padding: 14px 18px; margin-bottom: 20px; }
  .info-title { font-size: 12px; font-weight: 500; color: var(--gold); margin-bottom: 6px; }
  .info-body { font-size: 12px; color: var(--text3); line-height: 1.7; }

  /* content bottom padding for AI dock */
  .panel { padding-bottom: 100px; }

  /* scrollbar */
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 2px; }
`;

// ─── DATA ──────────────────────────────────────────────────────────────────

const TASKS = {
  wed: [
    { id: "w1", name: "Create your YouTube channel", desc: "youtube.com → profile → Create a channel → Use custom name → 'Vanished History'. Do NOT use your personal account name.", links: [{label:"youtube.com →", url:"https://youtube.com"}], tags:[{t:"Free",c:"free"},{t:"10 min",c:"time"},{t:"Do first",c:"urgent"}] },
    { id: "w2", name: "Write and add channel description", desc: "YouTube Studio → Customization → Basic Info. Description: 'We investigate history's greatest unsolved mysteries — lost civilizations, vanished peoples, forgotten empires. New videos Mon, Wed, Fri.'", tags:[{t:"Free",c:"free"},{t:"15 min",c:"time"}] },
    { id: "w3", name: "Design logo and channel banner in Canva", desc: "Logo 800×800px: dark bg (#1a1a2e), bold serif font, magnifying glass icon. Banner 2560×1440px: same dark bg, channel name + tagline + schedule. White + amber/gold text only.", links:[{label:"canva.com →", url:"https://canva.com"}], tags:[{t:"Free",c:"free"},{t:"45–60 min",c:"time"}] },
    { id: "w4", name: "Upload logo, banner + set watermark", desc: "YouTube Studio → Customization → Branding tab. Upload logo and banner. Set watermark to your logo, display entire video. Hit Publish.", tags:[{t:"Free",c:"free"},{t:"10 min",c:"time"}] },
    { id: "w5", name: "Set up Google AdSense", desc: "adsense.google.com → Get started → create account with your channel email. Takes 1–2 days to verify — start tonight to avoid delays at monetization.", links:[{label:"adsense.google.com →", url:"https://adsense.google.com"}], tags:[{t:"Free",c:"free"},{t:"20 min",c:"time"},{t:"1–2 day delay!",c:"urgent"}] },
    { id: "w6", name: "Create all tool accounts", desc: "Sign up using your channel email: ElevenLabs (free tier), vidIQ (connect to YouTube), Pictory ($19/mo), Higgsfield ($9/mo), Canva. Bookmark archive.org and commons.wikimedia.org.", links:[{label:"elevenlabs.io →",url:"https://elevenlabs.io"},{label:"vidiq.com →",url:"https://vidiq.com"},{label:"higgsfield.ai →",url:"https://higgsfield.ai"},{label:"pictory.ai →",url:"https://pictory.ai"}], tags:[{t:"~$28/mo",c:"paid"},{t:"30 min",c:"time"}] },
  ],
  thu: [
    { id: "t1", name: "Delete old footage + map script to visual needs", desc: "Delete all previously downloaded footage. Map each of the 5 script sections to specific visual needs before searching Friday. S1 Hook: dramatic ruins. S2 Background: Mohenjo-daro brick streets, maps. S3 Mystery: stone seals, artifacts. S4 Theories: drought/dried riverbeds. S5 Ending: wide atmospheric landscapes.", tags:[{t:"Free",c:"free"},{t:"8:30–9:00pm",c:"time"}] },
    { id: "t2", name: "Research the Indus Valley + generate script", desc: "Ask Claude to research: most shocking facts, the 4 collapse theories, why no writing has been deciphered, the simultaneous collapse. Then generate full 5-section voiceover script (1,600–1,800 words) + 4 SEO title options + 200-word description + chapters + pinned comment.", tags:[{t:"Claude",c:"free"},{t:"6:00–8:30pm",c:"time"},{t:"Most critical",c:"urgent"}] },
  ],
  fri: [
    { id: "f1", name: "Full section-by-section footage search", desc: "Using Thursday's visual map: find cold open clip FIRST (one dramatic ruins shot, 4 seconds). Then by section. Archive.org: 'Mohenjo-daro', 'Indus Valley', 'Harappa'. Wikimedia: maps, diagrams, seal photos. Pexels: 'ancient ruins', 'dried riverbed', 'desert landscape'. 25–35 clips total. Also check audio levels on all 5 MP3s back to back tonight.", links:[{label:"archive.org →",url:"https://archive.org"},{label:"Wikimedia →",url:"https://commons.wikimedia.org"},{label:"pexels.com →",url:"https://pexels.com"}], tags:[{t:"Free",c:"free"},{t:"7:00–10:00pm",c:"time"}] },
    { id: "f2", name: "Generate voiceover in ElevenLabs", desc: "elevenlabs.io → Text to Speech → Brad (Clear Narrator). Settings: Stability 60%, Similarity 78%, Style Exaggeration 18%, 192kbps. Paste each section → generate → download. 5 MP3 files. Listen all back to back — check volume consistency. Re-generate any robotic sentences.", links:[{label:"elevenlabs.io →",url:"https://elevenlabs.io"}], tags:[{t:"$11/mo",c:"paid"},{t:"6:00–9:00pm",c:"time"}] },
  ],
  sat: [
    { id: "s1", name: "Pre-edit check — audio levels + footage verify", desc: "Before opening Pictory: (1) Play all 5 MP3s back to back — check volume is consistent across all sections. (2) Open footage folder and verify clips exist for every script section including cold open. If any section has a gap — fill it before editing. Mismatched footage is the #1 quality killer.", tags:[{t:"Free",c:"free"},{t:"7:00–7:30am",c:"time"},{t:"Do before Pictory",c:"urgent"}] },
    { id: "s2", name: "Pictory edit — cold open + 5 sections + overlays", desc: "Pictory → Script to Video → upload 5 MP3s in order. ADD COLD OPEN FIRST: 4-second dramatic ruins clip, music only, no narration. Review auto-matched footage — swap anything that doesn't match. Text overlays: 5 MILLION PEOPLE · NO DECIPHERED SCRIPT · 1,000+ YEARS · 113-YEAR DROUGHT. Captions on. Music 10–15%. Export 'VH_Case001_FINAL.mp4'.", links:[{label:"pictory.ai →",url:"https://pictory.ai"}], tags:[{t:"$19/mo",c:"paid"},{t:"7:30–10:30am",c:"time"}] },
    { id: "s3", name: "Create Higgsfield channel character", desc: "higgsfield.ai → Create → Avatar. Prompt: 'A mysterious, authoritative historian-investigator. Dark academic aesthetic. Dramatic cinematic lighting. Serious expression. Dark background. Documentary style. 35-45 years old. Knowing, intense gaze.' Generate 10–15 variations. Lock in ONE character — used on every thumbnail forever. Generate 4 expression variants: shocked, serious, concerned, pointing.", links:[{label:"higgsfield.ai →",url:"https://higgsfield.ai"}], tags:[{t:"$9/mo",c:"paid"},{t:"9:30–11:00am",c:"time"}] },
    { id: "s4", name: "Design Case #001 thumbnail + create Short", desc: "Canva 1280×720px: Higgsfield character (shocked expression) left side. Bold gold text right: title. 'CASE #001' top-left. Dark ruins background at 20% opacity. Then: Pictory → export most shocking 45–60 seconds as 9:16 vertical Short → save as 'VH_Case001_SHORT.mp4'.", links:[{label:"canva.com →",url:"https://canva.com"}], tags:[{t:"Free tier",c:"free"},{t:"11:00am–1:00pm",c:"time"}] },
    { id: "s5", name: "Create 90-second channel trailer", desc: "Script: 'At Vanished History, we investigate the mysteries that textbooks skip. Lost civilizations, vanished empires, the events no one can fully explain. Every Monday, Wednesday, and Friday — a new case. I'm glad you're here.' Record in ElevenLabs (Brad voice), edit in Pictory, upload to YouTube Studio → Customization → Layout → Channel trailer.", tags:[{t:"Free",c:"free"},{t:"1:00–2:30pm",c:"time"}] },
  ],
  sun: [
    { id: "su1", name: "Channel optimization — keywords + description + playlist", desc: "YouTube Studio → Settings → Channel → Basic Info → add 20 channel keywords. Update channel description (SEO version with keywords). Create playlist 'Vanished History — The Cases'. Add affiliate links: Audible, Great Courses, Skillshare to about section.", tags:[{t:"Free",c:"free"},{t:"7:00–9:00am",c:"time"}] },
    { id: "su2", name: "Quality control watch-through", desc: "Upload as Unlisted first. Watch the entire video. Check: audio sync, footage quality, caption display, pacing, cold open timing. Fix anything in Pictory and re-export if needed. Ask: would I watch this if I found it randomly?", tags:[{t:"Free",c:"free"},{t:"9:00–11:00am",c:"time"},{t:"Never skip QC",c:"urgent"}] },
    { id: "su3", name: "Upload + optimize + schedule for Thu Jun 11 2pm PST", desc: "☐ 1080p no black bars ☐ Audio clear ☐ Captions on ☐ Higgsfield character thumbnail + CASE #001 ☐ SEO title ☐ 200-word description + affiliate links ☐ 6-8 keyword chapters ☐ 8-12 tags ☐ Category: Education ☐ End screen ☐ Playlist ☐ ⚠️ AI DISCLOSURE: Details → 'Altered or synthetic content' → CHECK → Schedule: June 11, 2:00 PM PST.", tags:[{t:"Free",c:"free"},{t:"11:00am–1:00pm",c:"time"},{t:"⚠️ AI Disclosure",c:"urgent"}] },
  ],
  launch: [
    { id: "l1", name: "2pm — Case #001 goes live · Post pinned comment immediately", desc: "Within 5 minutes of going live post pinned comment: 'Most historians blame the climate. But the timing doesn't fully add up — the cities were already declining before the worst droughts hit. What's your theory? Drop it below 👇 I read every single one.' Pin it.", tags:[{t:"Within 5 min",c:"urgent"},{t:"Free",c:"free"}] },
    { id: "l2", name: "Upload Case #001 Short within 1 hour of launch", desc: "Upload VH_Case001_SHORT.mp4. Title: 'A civilization of 5 million people — and we can't read a word they wrote 🤯'. Add #Shorts to description. Link to main video. ⚠️ AI Disclosure on Short too.", tags:[{t:"Within 1 hr",c:"urgent"},{t:"Free",c:"free"}] },
    { id: "l3", name: "Reddit seeding — r/AncientCivilizations + r/UnsolvedMysteries", desc: "Find active threads about the Indus Valley. Engage genuinely first — answer a question or add context. Then share your video as a follow-up resource. Never just drop a link. 'I actually made a full deep-dive on this: [link]'", tags:[{t:"Free",c:"free"},{t:"Ongoing",c:"time"}] },
    { id: "l4", name: "Reply to every comment for the first 24 hours", desc: "Check YouTube Studio analytics: CTR, watch time, impressions at 24hr and 48hr. Reply to every comment. Even a simple 'Great question!' reply counts. Early engagement signals quality to the algorithm.", tags:[{t:"Free",c:"free"},{t:"Ongoing",c:"time"}] },
  ],
  c002: [
    { id: "c002s", name: "Case #002 — Research + script (Roanoke Colony)", desc: "Ask Claude: the CROATOAN inscription, John White's 3-year return voyage, 4 theories, Virginia Dare, 2012 Hatteras Island discovery. Full 5-section script + SEO titles + description + chapters + pinned comment + Reddit post for r/UnsolvedMysteries.", tags:[{t:"Claude",c:"free"},{t:"Wed Jun 10 · 5pm",c:"time"}] },
    { id: "c002v", name: "Case #002 — Voiceover (Roanoke)", desc: "ElevenLabs Brad · Stability 60% · Similarity 78% · Style 18% · 192kbps. 5 sections → 5 MP3s. Play all back to back — volume consistency check. Save to 'Case #002 — Roanoke / Audio'.", tags:[{t:"ElevenLabs",c:"paid"},{t:"Thu Jun 11 · 5pm",c:"time"}] },
    { id: "c002f", name: "Case #002 — Footage (Roanoke)", desc: "Cold open: dramatic NC coastline or misty forest. S1: colonial ships (archive.org). S2: Elizabethan England, colonial maps (Wikimedia). S3: CROATOAN carving (Wikimedia), forest. S4: Native American imagery. S5: wide coastal landscape. 25–35 clips. Higgsfield for gaps.", tags:[{t:"Free",c:"free"},{t:"Fri Jun 12 · 5pm",c:"time"}] },
    { id: "c002e", name: "Case #002 — Edit + thumbnail + Short (Roanoke)", desc: "Pre-edit: ☐ volume check ☐ footage verified. Pictory: 4s cold open → 5 MPs → overlays: CROATOAN · 115 COLONISTS · 3 YEARS MISSING · VIRGINIA DARE → captions → export VH_Case002_FINAL.mp4. Thumbnail: Higgsfield concerned + CASE #002. Short → VH_Case002_SHORT.mp4.", tags:[{t:"Pictory",c:"paid"},{t:"Sat Jun 13 · 7am",c:"time"}] },
    { id: "c002u", name: "Case #002 — Upload + schedule (Mon Jun 15 2pm PST)", desc: "Full upload checklist. ⚠️ AI DISCLOSURE: Details → Altered or synthetic content → CHECK. Schedule: June 15 at 2:00 PM PST. Save pinned comment + Short + Reddit post ready to paste on launch day.", tags:[{t:"Free",c:"free"},{t:"Sun Jun 14 · 10am",c:"time"},{t:"⚠️ AI Disclosure",c:"urgent"}] },
  ]
};

const CASES = [
  { num:"001", title:"Indus Valley Civilization", launch:"Thu Jun 11", status:"complete", overlays:"5 MILLION PEOPLE · NO DECIPHERED SCRIPT · 1,000+ YEARS · 113-YEAR DROUGHT", cold:"Dramatic ancient ruins wide shot · 4s · music only", footage:"Mohenjo-daro ruins · dried riverbeds · Indus seals · archaeological dig · desert landscapes", expression:"Shocked/awe", reddit:"r/AncientCivilizations · r/history", schedule:"PRODUCTION COMPLETE" },
  { num:"002", title:"The Roanoke Colony", launch:"Mon Jun 15", status:"upcoming", overlays:"CROATOAN · 115 COLONISTS · 3 YEARS MISSING · VIRGINIA DARE", cold:"Dramatic NC coastline or misty forest", footage:"Colonial ships (archive.org) · NC coastline · CROATOAN carving (Wikimedia) · Elizabethan England · forest wilderness", expression:"Concerned/troubled", reddit:"r/UnsolvedMysteries · r/history", schedule:"Script Jun 10 · VO Jun 11 · Footage Jun 12 · Edit Jun 13 · Upload Jun 14" },
  { num:"003", title:"Göbekli Tepe", launch:"Wed Jun 17", status:"upcoming", overlays:"11,600 YEARS OLD · 6,000 YEARS BEFORE STONEHENGE · ONLY 5% EXCAVATED · DELIBERATELY BURIED", cold:"T-shaped pillars wide shot emerging from Turkish hillside", footage:"Göbekli Tepe excavation (Wikimedia — excellent) · Turkish plateau · carved pillars close-up · archaeological dig", expression:"Shocked/awe", reddit:"r/AncientCivilizations · r/archaeology", schedule:"Script Jun 12 · VO Jun 13 · Footage Jun 14 · Edit Jun 15 · Upload Jun 16" },
  { num:"004", title:"The Nazi Code Mathematician", launch:"Fri Jun 19", status:"upcoming", overlays:"ERASED FROM HISTORY · 2 YEARS SHORTER · ENIGMA · MARIAN REJEWSKI", cold:"Enigma machine close-up — gears rotating, dramatic lighting", footage:"WWII archival (archive.org — vast) · Enigma machine (Wikimedia) · Bletchley Park · wartime Europe. NO graphic violence.", expression:"Serious/intense", reddit:"r/history · r/WWII", schedule:"Script Jun 14 · VO Jun 15 · Footage Jun 16 · Edit Jun 17 · Upload Jun 18" },
  { num:"005", title:"The Hidden Empire", launch:"Mon Jun 22", status:"upcoming", overlays:"Empire scale stat · HALF THE WORLD · ERASED · peak power dates", cold:"Vast landscape establishing scale — steppes, desert, or mountains", footage:"Confirm empire during research. Central Asian steppes (Pexels) · empire maps (Wikimedia) · ancient ruins", expression:"Serious/knowing", reddit:"r/history · r/AncientCivilizations", schedule:"Script Jun 17 · VO Jun 18 · Footage Jun 19 · Edit Jun 20 · Upload Jun 21" },
  { num:"006", title:"The Black Death's Real Origin", launch:"Wed Jun 24", status:"upcoming", overlays:"1338 · 700 YEARS · DNA EVIDENCE · PATIENT ZERO", cold:"Misty ancient graveyard — dark, atmospheric", footage:"Medieval graveyard (Pexels) · Kyrgyzstan landscape · Totentanz art (Wikimedia — public domain) · Silk Road maps", expression:"Concerned/troubled", reddit:"r/history · r/AskHistorians", schedule:"Script Jun 19 · VO Jun 20 · Footage Jun 21 · Edit Jun 22 · Upload Jun 23" },
  { num:"007", title:"The Russian Crown Jewels Heist", launch:"Fri Jun 26", status:"upcoming", overlays:"Jewel value · 1917 · NEVER RECOVERED · ROMANOV", cold:"Crown jewel glamour close-up — gold and diamonds", footage:"Russian imperial imagery (archive.org) · Diamond Fund photos (Wikimedia) · Bolshevik revolution archival (archive.org — excellent)", expression:"Shocked/wide eyes", reddit:"r/history · r/UnsolvedMysteries", schedule:"Script Jun 21 · VO Jun 22 · Footage Jun 23 · Edit Jun 24 · Upload Jun 25" },
  { num:"008", title:"The Franz Ferdinand Assassination", launch:"Mon Jun 29", status:"upcoming", overlays:"6 ASSASSINS · WRONG TURN · 28 JUNE 1914 · THE BLACK HAND", cold:"1914 archival street footage or Franz Ferdinand portrait", footage:"WWI archival (archive.org) · Sarajevo 1914 (Wikimedia) · Franz Ferdinand photos · Austria-Hungary imperial. NO graphic violence.", expression:"Serious/intense", reddit:"r/history · r/WWI", schedule:"Script Jun 24 · VO Jun 25 · Footage Jun 26 · Edit Jun 27 · Upload Jun 28" },
  { num:"009", title:"The Royal Court Poisoner", launch:"Wed Jul 1", status:"upcoming", overlays:"Court death count · date · NEVER IDENTIFIED · poison name (confirm during research)", cold:"Darkened palace corridor or poison bottle close-up", footage:"Identify court during research. Royal court paintings (Wikimedia — vast public domain) · apothecary bottles · palace imagery", expression:"Knowing/sinister", reddit:"r/history · r/UnsolvedMysteries", schedule:"Script Jun 26 · VO Jun 27 · Footage Jun 28 · Edit Jun 29 · Upload Jun 30" },
  { num:"010", title:"The Baghdad Battery", launch:"Fri Jul 3", status:"upcoming", overlays:"2,000 YEARS · ELECTRICITY? · 1.1 VOLTS · MESOPOTAMIA", cold:"Baghdad Battery artifact close-up, dramatic single-source lighting", footage:"Baghdad Battery photos (Wikimedia — excellent) · ancient Mesopotamian ruins · Iraq Museum · electricity contrast (Pexels)", expression:"Shocked/disbelief", reddit:"r/AncientCivilizations · r/history", schedule:"Script Jun 28 · VO Jun 29 · Footage Jun 30 · Edit Jul 1 · Upload Jul 2" },
  { num:"011", title:"How Egyptians Moved the Stones", launch:"Mon Jul 6", status:"upcoming", overlays:"2,500,000 LBS · 2.3 MILLION STONES · NOT SLAVES · WET SAND", cold:"Great Pyramid dawn aerial — epic scale", footage:"Great Pyramid footage (archive.org — extensive) · Giza aerial (Pexels) · Nile river · stonecutting imagery", expression:"Awe/wide eyes", reddit:"r/AncientCivilizations · r/AskHistorians", schedule:"Script Jul 1 · VO Jul 2 · Footage Jul 3 · Edit Jul 4 · Upload Jul 5" },
  { num:"012", title:"The Antikythera Mechanism", launch:"Wed Jul 8", status:"upcoming", overlays:"37 BRONZE GEARS · 2,000 YEARS OLD · 1,400 YEAR GAP · ECLIPSE PREDICTION", cold:"Mechanism gear close-up — dramatic bronze reveal", footage:"Mechanism photos (Wikimedia — stunning) · Athens National Museum · Greek ruins · Mediterranean sea", expression:"Disbelief/shocked", reddit:"r/AncientCivilizations · r/history", schedule:"Script Jul 3 · VO Jul 4 · Footage Jul 5 · Edit Jul 6 · Upload Jul 7" },
];

const QUICK_PROMPTS_BY_PANEL = {
  overview: ["What should I focus on today?", "How is Cipher House tracking vs plan?", "What's my next major milestone?"],
  tasks: ["Write Case #001 pinned comment", "Give me a pre-launch checklist", "What should I do right now?"],
  cases: ["Write the Case #002 full script", "Research the Roanoke Colony for me", "Write Case #003 Göbekli Tepe script", "Write SEO title options for Case #004", "Write the pinned comment for Case #005"],
  calendar: ["Build Month 2 content calendar", "Suggest 3 outlier video topics", "Write hooks for Week 2 videos"],
  niches: ["Which channel should I launch second?", "Analyze Business Autopsies niche", "What's the best CPM niche right now?"],
  growth: ["Write a Reddit post for Case #001", "Write a Quora answer about the Indus Valley", "Draft 3 Short titles for Case #001"],
  tools: ["Should I upgrade ElevenLabs?", "Is there a better tool than Pictory?", "What new AI tools should I know about?"],
  automation: ["How can I speed up my production?", "How do I batch produce 3 channels?"],
  monetization: ["When will I hit YPP at current pace?", "Draft an Audible affiliate pitch", "How do I land my first sponsorship?"],
  empire: ["When should I launch Channel 2?", "Build Channel 2 launch plan", "What's my Month 12 revenue projection?"],
  portfolio: ["Deep dive on Wealth Code niche", "Compare Dark Psychology vs AI Decoded", "What should Channel 3 be?"],
  revenue: ["Build a 12-month revenue projection", "How do I land my first brand deal?", "What digital product should I create first?"],
  sop: ["Write the SOP for script production", "Optimize my batch production workflow"],
  os: ["Run my monthly business review", "What are my top 3 priorities this month?"],
};

// ─── COMPONENTS ─────────────────────────────────────────────────────────────

function TaskCard({ task, done, onToggle }) {
  return (
    <div className={`task-card ${done ? "done" : ""}`} onClick={() => onToggle(task.id)}>
      <div className="check-box">
        <span className="check-icon">✓</span>
      </div>
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

function OverviewPanel({ setPanel, doneCount, totalTasks }) {
  return (
    <div>
      <div className="panel-header">
        <div className="panel-title">Cipher House — Business Command Center</div>
        <div className="panel-sub">YouTube Automation Empire · Channel 1 active · 4-channel portfolio in development</div>
        <div className="gold-line" />
      </div>
      <div className="launch-banner">
        <div>
          <div className="launch-text">Case #001 launches Thursday Jun 11</div>
          <div className="launch-sub">The city that vanished overnight: what really happened to the Indus Valley civilization?</div>
        </div>
        <div className="launch-date">Jun 11 · 2:00 PM PST</div>
      </div>
      <div className="stat-grid">
        <div className="stat-card"><div className="stat-label">Active channels</div><div className="stat-val">1 of 5</div><div className="stat-note">Vanished History live</div></div>
        <div className="stat-card"><div className="stat-label">Monthly tool cost</div><div className="stat-val">$88</div><div className="stat-note">Full AI stack</div></div>
        <div className="stat-card"><div className="stat-label">Month 24 target</div><div className="stat-val">$20K+/mo</div><div className="stat-note">4–5 channels</div></div>
        <div className="stat-card"><div className="stat-label">Tasks complete</div><div className="stat-val">{doneCount}/{totalTasks}</div><div className="stat-note">launch checklist</div></div>
      </div>
      <div className="section-title">Quick navigation</div>
      <div className="ov-grid">
        {[
          {icon:"✦", title:"Production Plan", desc:"9-day launch checklist + Cases #002–#012 full production schedule.", panel:"tasks"},
          {icon:"◷", title:"Content Calendar", desc:"12 videos across 4 weekly themes. Every title planned and ready.", panel:"calendar"},
          {icon:"◈", title:"Cases #001–#012", desc:"Full production details — footage notes, overlays, cold opens for every case.", panel:"cases"},
          {icon:"↑", title:"Growth Tactics", desc:"Reddit seeding, Quora, A/B thumbnails, outlier analysis — every tactic documented.", panel:"growth"},
          {icon:"◈", title:"Scaling Roadmap", desc:"4-phase plan from Channel 1 to 5-channel media company.", panel:"empire"},
          {icon:"◎", title:"Channel Portfolio", desc:"All 5 planned channels with RPM, triggers, and revenue projections.", panel:"portfolio"},
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
    { badge:"Sat Jun 6 · 7:00am–2:30pm", cls:"badge-sat", title:"Edit + character + thumbnail + trailer", sub:"Pre-edit check → Pictory → Higgsfield → Canva", tasks: TASKS.sat },
    { badge:"Sun Jun 7 · 7:00am–1:00pm", cls:"badge-sun", title:"Channel optimization + upload + schedule", sub:"Done by 1pm — Case #001 goes live Thursday", tasks: TASKS.sun },
    { badge:"Thu Jun 11 · 2:00pm PST · LAUNCH DAY", cls:"badge-mon", title:"Case #001 goes live 🚀", sub:"Pinned comment + Short + Reddit · reply to every comment", tasks: TASKS.launch },
    { badge:"Wed Jun 10 – Sun Jun 14", cls:"badge-wed", title:"Case #002 — Roanoke Colony production", sub:"Script → Voiceover → Footage → Edit → Upload", tasks: TASKS.c002 },
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
        <div className="stat-card"><div className="stat-label">Case #001 launch</div><div className="stat-val">Jun 11</div><div className="stat-note">2:00 PM PST</div></div>
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
    { week:"Week 1", theme:"Lost civilizations & vanished peoples", featured:true, videos:[
      {day:"Mon Jun 11", title:"The city that vanished overnight: what really happened to the Indus Valley civilization?"},
      {day:"Wed Jun 15", title:"The Roanoke colony: 115 people disappeared without a trace — the truth historians ignore"},
      {day:"Fri Jun 17", title:"Göbekli Tepe: the temple that rewrote human history (and what we're still hiding)"},
    ]},
    { week:"Week 2", theme:"Hidden figures & suppressed history", featured:false, videos:[
      {day:"Mon Jun 19", title:"The mathematician who cracked Nazi codes — and was erased from history"},
      {day:"Wed Jun 22", title:"The empire that ruled half the world — and why you've never heard of it"},
      {day:"Fri Jun 24", title:"The Black death's real origin: what scientists found in a 700-year-old graveyard"},
    ]},
    { week:"Week 3", theme:"Historical crimes & conspiracies", featured:false, videos:[
      {day:"Mon Jun 26", title:"The greatest heist in history: who really stole the Russian crown jewels?"},
      {day:"Wed Jun 29", title:"The assassination that history got wrong: what actually happened to Archduke Franz Ferdinand"},
      {day:"Fri Jul 1", title:"The poisoner who killed an entire royal court — and was never caught"},
    ]},
    { week:"Week 4", theme:"Ancient engineering & impossible objects", featured:false, videos:[
      {day:"Mon Jul 3", title:"The Baghdad battery: did ancient Persians invent electricity 2,000 years ago?"},
      {day:"Wed Jul 6", title:"How did ancient Egyptians move 2.5-million-pound stones? Engineers finally have an answer"},
      {day:"Fri Jul 8", title:"The Antikythera mechanism: a 2,000-year-old computer that shouldn't exist"},
    ]},
  ];

  return (
    <div>
      <div className="panel-header">
        <div className="panel-title">30-Day Content Calendar</div>
        <div className="panel-sub">12 videos · Mon/Wed/Fri · 2pm PST · 4 weekly themes</div>
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
                <span className="cal-day">{v.day}</span>
                <span>{v.title}</span>
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

function CasesPanel() {
  const [expanded, setExpanded] = useState(null);
  return (
    <div>
      <div className="panel-header">
        <div className="panel-title">Cases #001–#012 Production Plan</div>
        <div className="panel-sub">Footage direction · text overlays · cold opens · production schedule for every case. Click a case to expand.</div>
        <div className="gold-line" />
      </div>
      <div className="info-box" style={{marginBottom:20}}>
        <div className="info-title">Production SOP — same workflow every video</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:10,fontSize:12,color:"var(--text3)",lineHeight:1.6}}>
          {[["✍️ D-5","Script","Claude researches + writes · SEO · chapters · pinned comment"],["🎙️ D-4","Voiceover","Brad · 60/78/18 · 192kbps · 5 MP3s · volume check"],["🎞️ D-3","Footage","Cold open first · section-by-section · 25–35 clips · Higgsfield for gaps"],["🎬 D-2","Edit","Audio check → Pictory → cold open → overlays → captions → export"],["⬆️ D-1","Upload","QC watch · full checklist · ⚠️ AI disclosure · schedule 2pm PST"]].map(([icon,title,desc],i) => (
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
        <div className="panel-sub">Top 3 matches based on interests, budget, and low-competition goal</div>
        <div className="gold-line" />
      </div>
      <div className="niche-grid">
        {[
          {rank:"⭐ Best match — your channel",name:"Historical mysteries",cpm:"$5–10 RPM",top:true,rows:[["Competition","Low ✓"],["Budget fit","$50–200/mo ✓"],["AI producible","Very easy"],["Evergreen","Yes"],["At 100K subs","$800–2,500/mo"],["Footage cost","Free (archive.org)"]]},
          {rank:"#2 — future expansion",name:"AI tools & tech tutorials",cpm:"$16–28 RPM",top:false,rows:[["Competition","Medium"],["Budget fit","$50–200/mo ✓"],["AI producible","Very easy"],["Evergreen","Partial"],["At 100K subs","$1,200–4,500/mo"],["Footage cost","Free (screen record)"]]},
          {rank:"#3 — power move combo",name:"Business case studies",cpm:"$14–35 RPM",top:false,rows:[["Competition","Low–medium"],["Budget fit","$50–200/mo ✓"],["AI producible","Easy"],["Evergreen","Yes"],["At 100K subs","$2,000–5,000/mo"],["Sponsor appeal","Very high (B2B)"]]},
        ].map((n,i) => (
          <div key={i} className={`niche-card ${n.top ? "top" : ""}`}>
            <div className="niche-rank">{n.rank}</div>
            <div className="niche-name">{n.name}</div>
            <div className="niche-cpm">{n.cpm}</div>
            {n.rows.map(([l,v],j) => <div key={j} className="niche-row"><span className="niche-row-label">{l}</span><span className="niche-row-val" style={{color: v.includes("✓") ? "var(--green)" : "var(--text2)"}}>{v}</span></div>)}
          </div>
        ))}
      </div>
      <div className="info-box">
        <div className="info-title">The power move — combine niches 1 & 3</div>
        <div className="info-body">"Business history" channels — like "How the East India Company became richer than most countries" — combine the free archive-footage workflow of history with the $14–35 CPM of business content. This is Channel 2: Business Autopsies.</div>
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
          ["3 Shorts per long-form video","Each chapter = a natural Short · 3x better than 1 Short · built into Pictory"],
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
      <div className="section-title">Monthly — first Monday</div>
      <div className="sop-box">
        <div style={{padding:"10px 0",fontSize:12}}>
          <div style={{fontWeight:500,color:"var(--text)",marginBottom:3}}>vidIQ outlier analysis — Knowledgia, Voices of the Past, Dark Docs</div>
          <div style={{color:"var(--text3)",lineHeight:1.6}}>Find videos that got 3–10x their channel average. Reverse engineer why. Build your version. This is how you find your viral video before you make it.</div>
        </div>
      </div>
      <div className="section-title">Month 2 milestones (~20 videos)</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        {[
          ["📧 Email List","Free on Mailchimp or Kit. Lead magnet: 'Get the full case file PDF.' Add to every description and pinned comment. None of your major competitors have this — biggest gap in the niche."],
          ["💬 Discord Community","Free. Channels: #case-discussions, #your-theories, #suggest-a-case. Post a question every launch day. Knowledgia, Voices of the Past, Dark Docs all skip this. You don't have to."],
        ].map(([t,d],i) => (
          <div key={i} className="info-box">
            <div className="info-title">{t}</div>
            <div className="info-body">{d}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ToolsPanel() {
  const tools = [
    {name:"Claude",use:"Script writing, research, outlines, SEO metadata, strategy",cost:"~$20/mo",paid:true},
    {name:"ElevenLabs (Brad voice)",use:"AI voiceover — Creator tier, 192kbps, Stability 60%/Similarity 78%/Style 18%",cost:"$11/mo",paid:true},
    {name:"Pictory AI",use:"Auto-assemble video from script + voiceover + stock footage",cost:"$19/mo",paid:true},
    {name:"Higgsfield AI",use:"Channel character for thumbnails + custom cinematic B-roll clips",cost:"From $9/mo",paid:true},
    {name:"Canva",use:"Thumbnail design, channel banner, logo",cost:"Free tier",paid:false},
    {name:"vidIQ",use:"SEO, keyword research, tags, outlier analysis, analytics insights",cost:"Free tier",paid:false},
    {name:"archive.org",use:"Free public domain historical footage — core source for history niche",cost:"Free",paid:false},
    {name:"Wikimedia Commons",use:"Free historical images, maps, diagrams, artifact photos",cost:"Free",paid:false},
    {name:"Pexels",use:"Free stock footage — ancient ruins, landscapes, atmospheric",cost:"Free",paid:false},
    {name:"YouTube Audio Library",use:"Royalty-free music — cinematic, dark ambient, documentary",cost:"Free",paid:false},
    {name:"HappyScribe",use:"Auto-generate SRT caption files from MP3 voiceover",cost:"Free tier",paid:false},
    {name:"Google AdSense",use:"Link to YouTube for ad monetization — set up before launch",cost:"Free",paid:false},
  ];
  return (
    <div>
      <div className="panel-header">
        <div className="panel-title">Tool Stack</div>
        <div className="panel-sub">$88/mo total — replaces $2,000–5,000/mo in freelancer costs</div>
        <div className="gold-line" />
      </div>
      <div className="stat-grid">
        <div className="stat-card"><div className="stat-label">Monthly cost</div><div className="stat-val">$88</div><div className="stat-note">full AI stack</div></div>
        <div className="stat-card"><div className="stat-label">Freelancer cost</div><div className="stat-val">$0</div><div className="stat-note">100% AI produced</div></div>
        <div className="stat-card"><div className="stat-label">Free tools</div><div className="stat-val">8 of 12</div><div className="stat-note">no subscription</div></div>
        <div className="stat-card"><div className="stat-label">Profit margin</div><div className="stat-val">90%+</div><div className="stat-note">at portfolio scale</div></div>
      </div>
      <div className="tools-grid">
        {tools.map((t,i) => (
          <div key={i} className="tool-card">
            <div>
              <div className="tool-name">{t.name}</div>
              <div className="tool-use">{t.use}</div>
            </div>
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
    {task:"Voiceover narration",tool:"ElevenLabs Brad",fill:100,label:"Full AI",cls:"full",before:"2 hrs",after:"10 min"},
    {task:"Captions / subtitles",tool:"Pictory auto-captions",fill:100,label:"Full AI",cls:"full",before:"60 min",after:"2 min"},
    {task:"Title, description & tags",tool:"Claude + vidIQ",fill:100,label:"Full AI",cls:"full",before:"45 min",after:"5 min"},
    {task:"Upload scheduling",tool:"YouTube Studio",fill:100,label:"Full AI",cls:"full",before:"20 min",after:"2 min"},
    {task:"Video assembly & editing",tool:"Pictory AI",fill:70,label:"Partial AI",cls:"part",before:"3–4 hrs",after:"30–45 min"},
    {task:"Thumbnail design",tool:"Higgsfield + Canva → you review",fill:60,label:"Partial AI",cls:"part",before:"45 min",after:"15 min"},
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
            <div style={{flex:1}}>
              <div className="auto-task">{r.task}</div>
              <div className="auto-tool">{r.tool}</div>
            </div>
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
    {phase:"Day 1 — every channel from launch",title:"Affiliate marketing",desc:"Add affiliate links to every video description from your very first upload. Audible, Great Courses, Skillshare for Channel 1. No subscriber minimum — this earns before you're monetized.",earn:"Potential: $50–500/mo early · scales with views",active:true},
    {phase:"500 subscribers",title:"Channel memberships + Super Thanks",desc:"Early YPP tier. Exclusive content, badges, direct tips. Apply as soon as you hit 500 subs + 3,000 watch hours.",earn:"Potential: $100–500/mo per channel",active:true},
    {phase:"1,000 subscribers + 4,000 watch hours",title:"YouTube Partner Program (AdSense)",desc:"Full ad revenue access. History channels earn $5–10 RPM — 100K views = $500–1,000/month. Apply through YouTube Studio → Monetization.",earn:"At 100K views/mo: $500–1,000 · At 500K views/mo: $2,500–5,000",active:false},
    {phase:"2,000–5,000 subscribers",title:"Brand sponsorships",desc:"Pitch brands directly: Curiosity Stream, Nebula, Audible, MasterClass, Skillshare. History channels: $1,000–5,000 per integration. Finance channels: $2,000–15,000.",earn:"$200–5,000 per integration depending on channel size",active:false},
    {phase:"Month 18 — Channel 1 first",title:"Digital products",desc:"Case file PDFs, research packs, extended content. Zero marginal cost, highest margin. A $19 pack sold to 1% of 50K subscribers = $9,500 in a single launch.",earn:"Highest margin stream — scales to $3,000–15,000/mo at portfolio scale",active:false},
    {phase:"Phase 4 — long term",title:"IP licensing + channel acquisition",desc:"License channel content to streaming platforms. Acquire channels at 10K–50K subscribers ($5K–50K) for faster monetization. The channels become Cipher House IP assets.",earn:"Uncapped — this is where real media company value is built",active:false},
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

function EmpirePanel() {
  const phases = [
    {cls:"ph1",title:"Phase 1 — Master the system",sub:"Jun 2026 – Dec 2026 · Channel 1 only · Vanished History",stats:[["Focus","1 channel"],["Videos","72+"],["Milestone","1K subs + YPP"],["Revenue","$300–800/mo"]],desc:"Lock in the production workflow until it takes under 3 hours per video. Hit YPP at 1,000 subs + 4,000 watch hours (expected months 4–8). Build the data foundation — by video 30 you have real analytics that directly inform Channel 2. Do NOT launch Channel 2 before Month 6 or YPP approval."},
    {cls:"ph2",title:"Phase 2 — First expansion",sub:"Jan 2027 – Jun 2027 · Add Channel 2 · Business Autopsies",stats:[["Channels","2 active"],["Trigger","YPP approved"],["Ch2 RPM","$14–35"],["Revenue","$1,500–3,500/mo"]],desc:"Launch Channel 2 (Business Autopsies) in a higher-CPM niche using the same production system. Apply all Channel 1 learnings. Claude handles scripting and SEO for both channels. Reinvest 50% of all Channel 1 revenue. Weekly hours: 35–45."},
    {cls:"ph3",title:"Phase 3 — Portfolio build",sub:"Jul 2027 – Dec 2027 · Channels 3 + 4 · Batch production",stats:[["Channels","4 active"],["Weekly videos","12 total"],["Revenue","$5,000–12,000/mo"],["Hours/wk","45–55"]],desc:"Launch Channels 3 (Wealth Code) and 4 (Dark Psychology). Batch production: Monday all voiceovers, Tue/Wed all edits, Thursday all uploads, Friday community + Shorts + analytics. Launch digital products on Channel 1. Build email lists and Discord communities."},
    {cls:"ph4",title:"Phase 4 — Media company",sub:"2028 onward · 5+ channels · $20K–50K/mo",stats:[["Channels","5–8 active"],["Possible hire","1 channel manager"],["Revenue","$20,000–50,000/mo"],["Role","CEO strategy only"]],desc:"Launch Channel 5 (AI Decoded). Evaluate channel acquisition. Diversify beyond YouTube: podcast, newsletter, Patreon, content licensing. Consider one part-time channel manager at $800–1,500/mo only if upload volume exceeds solo capacity."},
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
        <div className="stat-card"><div className="stat-label">Timeline</div><div className="stat-val">18–24 mo</div><div className="stat-note">full daily commitment</div></div>
        <div className="stat-card"><div className="stat-label">Monthly tool cost</div><div className="stat-val">$88</div><div className="stat-note">no freelancers needed</div></div>
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
        <div className="panel-sub">5-channel empire · $88/mo tool cost · no freelancers required</div>
        <div className="gold-line" />
      </div>
      <div style={{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"var(--radius)",overflow:"auto",marginBottom:24}}>
        <table className="portfolio-table">
          <thead>
            <tr>
              <th>Channel</th><th>Niche</th><th>Status</th><th>Launch</th><th>RPM target</th><th>Trigger</th><th>Month 24–30</th>
            </tr>
          </thead>
          <tbody>
            {[
              {name:"Vanished History",niche:"Historical mysteries",status:"active",launch:"Jun 2026",rpm:"$5–10",trigger:"—",proj:"$800–2,500/mo"},
              {name:"Business Autopsies",niche:"Business history",status:"ph2",launch:"Jan 2027",rpm:"$14–35",trigger:"Ch1 YPP approved",proj:"$2,000–6,000/mo"},
              {name:"Wealth Code",niche:"Personal finance",status:"ph3",launch:"Jul 2027",rpm:"$18–45",trigger:"Ch2 monetized",proj:"$4,000–12,000/mo"},
              {name:"Dark Psychology",niche:"Psychology / behavior",status:"ph3",launch:"Oct 2027",rpm:"$8–15",trigger:"Ch3 launched",proj:"$1,500–4,000/mo"},
              {name:"AI Decoded",niche:"AI / tech explainers",status:"ph4",launch:"2028",rpm:"$8–20",trigger:"Ch4 launched + stable",proj:"$2,000–8,000/mo"},
            ].map((ch,i) => (
              <tr key={i}>
                <td style={{color:"var(--gold)",fontWeight:500}}>{ch.name}</td>
                <td style={{color:"var(--text2)"}}>{ch.niche}</td>
                <td><span className={`status-badge status-${ch.status}`}>{ch.status === "active" ? "Active" : ch.status === "ph2" ? "Phase 2" : ch.status === "ph3" ? "Phase 3" : "Phase 4"}</span></td>
                <td style={{color:"var(--text2)"}}>{ch.launch}</td>
                <td style={{color:"var(--text2)"}}>{ch.rpm}</td>
                <td style={{color:"var(--text3)",fontSize:11}}>{ch.trigger}</td>
                <td style={{color:"#60b080",fontFamily:"var(--font-mono)",fontSize:11}}>{ch.proj}</td>
              </tr>
            ))}
          </tbody>
        </table>
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
        <div className="stat-card"><div className="stat-label">Month 18</div><div className="stat-val">$1.5K–3.5K</div><div className="stat-note">Channels 1+2</div></div>
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
      <div className="section-title">Single channel weekly schedule (25–30 hrs/wk)</div>
      <div className="sop-box">
        {[
          ["Monday — Voiceover + footage","ElevenLabs → paste 1 script section by section → 5 MP3s → Archive.org + Pexels footage","3–4 hrs"],
          ["Tuesday — Pictory edit","Script to Video → review clips → text overlays → captions → export","2–3 hrs"],
          ["Wednesday — Thumbnail + upload","Higgsfield character → Canva layout → YouTube Studio → SEO → chapters → AI disclosure","2–3 hrs"],
          ["Thursday — Community + distribution","Reddit seeding → Quora answer → pinned comment → Short upload → reply to all comments","1–2 hrs"],
          ["Friday — Analytics + next week prep","YouTube Studio analytics → Claude writes next 3 scripts → content calendar updated","2–3 hrs"],
          ["Saturday — Batch production sprint","Generate 2–3 voiceovers + edit multiple videos back to back · builds 1-week buffer","4–6 hrs"],
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
          <thead><tr><th>Channel</th><th>Niche</th><th>Status</th><th>Launch</th><th>RPM</th><th>Next trigger</th></tr></thead>
          <tbody>
            {[
              ["Vanished History","Historical mysteries","active","Jun 2026","$5–10","—"],
              ["Business Autopsies","Business history","ph2","Jan 2027","$14–35","Ch1 YPP approved"],
              ["Wealth Code","Personal finance","ph3","Jul 2027","$18–45","Ch2 monetized"],
              ["Dark Psychology","Psychology","ph3","Oct 2027","$8–15","Ch3 launched"],
              ["AI Decoded","AI / tech","ph4","2028","$8–20","Ch4 launched + stable"],
            ].map(([n,ni,st,la,rpm,trig],i) => (
              <tr key={i}>
                <td style={{color:"var(--gold)",fontWeight:500}}>{n}</td>
                <td style={{color:"var(--text2)"}}>{ni}</td>
                <td><span className={`status-badge status-${st}`}>{st==="active"?"Active":st==="ph2"?"Phase 2":st==="ph3"?"Phase 3":"Phase 4"}</span></td>
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
          ["Phase trigger check","Hit YPP? Time to launch next channel? Run through phase launch criteria","15 min"],
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

// ─── AI ASSISTANT ──────────────────────────────────────────────────────────

function AIAssistant({ currentPanel }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const quickPrompts = QUICK_PROMPTS_BY_PANEL[currentPanel] || QUICK_PROMPTS_BY_PANEL.overview;

  useEffect(() => {
    if (messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = useCallback(async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput("");
    setOpen(true);
    setMessages(prev => [...prev, { role: "user", content: msg }]);
    setLoading(true);

    const systemPrompt = `You are Claude, the AI business partner for Cipher House — a YouTube automation empire being built by a solo creator. You have full context on the business:

BUSINESS: Cipher House — YouTube automation empire. 5-channel plan. Solo operator + Claude partnership.

CHANNEL 1: Vanished History (@vanishedhistory). Niche: historical mysteries. Upload: Mon/Wed/Fri 2pm PST. Voice: Brad (ElevenLabs Creator, 192kbps, Stability 60%, Similarity 78%, Style 18%). Series: "Vanished History — The Cases" (Case #001, #002...). Launch: Thu Jun 11 2026. Tool stack: ElevenLabs ($11) + Pictory ($19) + Higgsfield ($9) + Canva (free) + vidIQ (free) = $88/mo total.

SCALING PLAN: Phase 1 (Ch1 only, Jun–Dec 2026) → Phase 2 (launch Business Autopsies, Jan 2027, $14-35 RPM) → Phase 3 (Wealth Code + Dark Psychology, Jul–Oct 2027) → Phase 4 (AI Decoded, 2028, $20K-50K/mo target).

CASES #001-#012: All planned with production schedules, footage notes, text overlays, and cold opens.

KEY RULES: Never launch new channel before previous is profitable. Every channel uses same production system. 50% revenue reinvested until Month 18. Monthly review first Monday every month. AI disclosure on every upload.

CURRENT PANEL: ${currentPanel}

Be direct, specific, and actionable. Reference Cipher House specifics. When writing scripts, write the FULL script. When giving SEO titles, give 4 options. When doing research, be thorough. Keep responses well-formatted.`;

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: systemPrompt,
          messages: [...history, { role: "user", content: msg }]
        })
      });
      const data = await response.json();
      const reply = data.content?.find(b => b.type === "text")?.text || "Sorry, I couldn't get a response.";
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: "assistant", content: "Connection error. Please try again." }]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages, currentPanel]);

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <>
      {open && messages.length > 0 && (
        <div className="ai-panel" style={{height: "40vh"}}>
          <div className="ai-panel-header">
            <span className="ai-panel-title">Claude · Cipher House AI Partner</span>
            <button className="ai-close" onClick={() => setOpen(false)}>×</button>
          </div>
          <div className="ai-messages">
            {messages.map((m, i) => (
              <div key={i} className={`ai-msg ${m.role}`}>
                {m.role === "assistant" && loading && i === messages.length - 1 ? (
                  <div className="ai-typing"><span/><span/><span/></div>
                ) : m.content}
              </div>
            ))}
            {loading && messages[messages.length-1]?.role === "user" && (
              <div className="ai-msg assistant loading"><div className="ai-typing"><span/><span/><span/></div></div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      )}
      <div className="ai-dock" style={{bottom: open && messages.length > 0 ? "40vh" : 0}}>
        <div className="quick-prompts">
          {quickPrompts.map((p, i) => (
            <button key={i} className="qp" onClick={() => send(p)}>{p}</button>
          ))}
        </div>
        <div className="ai-bar">
          <div style={{flexShrink:0,paddingTop:2}}>
            <div className="ai-label">Ask Claude</div>
          </div>
          <textarea
            ref={textareaRef}
            className="ai-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Write a script, research a topic, build a content calendar..."
            rows={1}
          />
          <button className="ai-send" onClick={() => send()} disabled={loading || !input.trim()}>
            {loading ? "..." : "Send"}
          </button>
        </div>
      </div>
    </>
  );
}

// ─── APP ────────────────────────────────────────────────────────────────────

const NAV = [
  { section: "Overview", items: [{ id:"overview", icon:"◈", label:"Dashboard" }] },
  { section: "Launch Plan", items: [
    { id:"tasks", icon:"✦", label:"Production Plan" },
    { id:"calendar", icon:"◷", label:"Content Calendar" },
    { id:"cases", icon:"◎", label:"Cases #001–#012" },
  ]},
  { section: "Channel 1", items: [
    { id:"niches", icon:"◎", label:"Niche Research" },
    { id:"growth", icon:"↑", label:"Growth Tactics" },
    { id:"tools", icon:"⊞", label:"Tool Stack" },
    { id:"automation", icon:"⟳", label:"Automation Map" },
    { id:"monetization", icon:"◈", label:"Monetization" },
  ]},
  { section: "The Empire", items: [
    { id:"empire", icon:"◈", label:"Scaling Roadmap" },
    { id:"portfolio", icon:"◎", label:"Channel Portfolio" },
    { id:"revenue", icon:"◈", label:"Revenue Model" },
    { id:"sop", icon:"◷", label:"SOPs & Workflow" },
    { id:"os", icon:"⊞", label:"Business OS" },
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
      next.has(id) ? next.delete(id) : next.add(id);
      try { localStorage.setItem("ch_tasks", JSON.stringify([...next])); } catch {}
      return next;
    });
  }, []);

  const doneCount = allTaskIds.filter(id => doneSet.has(id)).length;
  const pct = allTaskIds.length > 0 ? Math.round((doneCount / allTaskIds.length) * 100) : 0;

  const PANELS = {
    overview: <OverviewPanel setPanel={setPanel} doneCount={doneCount} totalTasks={allTaskIds.length} />,
    tasks: <TasksPanel doneSet={doneSet} onToggle={toggleTask} />,
    calendar: <CalendarPanel />,
    cases: <CasesPanel />,
    niches: <NichesPanel />,
    growth: <GrowthPanel />,
    tools: <ToolsPanel />,
    automation: <AutomationPanel />,
    monetization: <MonetizationPanel />,
    empire: <EmpirePanel />,
    portfolio: <PortfolioPanel />,
    revenue: <RevenuePanel />,
    sop: <SOPPanel />,
    os: <OSPanel />,
  };

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <div className="sidebar">
          <div className="logo">
            <div className="logo-name">CIPHER HOUSE</div>
            <div className="logo-sub">YouTube Automation Empire</div>
          </div>
          <nav className="nav">
            {NAV.map(sec => (
              <div key={sec.section}>
                <div className="nav-section">{sec.section}</div>
                {sec.items.map(item => (
                  <div
                    key={item.id}
                    className={`nav-item ${panel === item.id ? "active" : ""}`}
                    onClick={() => setPanel(item.id)}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    {item.label}
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
      <AIAssistant currentPanel={panel} />
    </>
  );
}
