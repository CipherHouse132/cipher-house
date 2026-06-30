import React, { useState } from "react";

// Vanished History · Cipher House — Command Center
// Single-file React component. CRA / react-scripts compatible.
// Repo: CipherHouse132/cipher-house  ·  path: src/cipher_house.jsx
// Rebuilt clean Jun 30, 2026 (current-ops version).

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500&display=swap');
:root{
  --bg:#0a0a0f;--bg2:#111118;--bg3:#16161f;
  --border:rgba(255,255,255,0.07);--border2:rgba(255,255,255,0.12);
  --gold:#c9a84c;--gold2:#e8c96a;--gold-dim:rgba(201,168,76,0.12);--gold-dim2:rgba(201,168,76,0.2);
  --text:#f0ede6;--text2:#9b9891;--text3:#5a5855;
  --green:#4a9b6f;--green-bg:rgba(74,155,111,0.12);
  --amber:#d4854a;--amber-bg:rgba(212,133,74,0.12);
  --blue:#4a7fb5;--blue-bg:rgba(74,127,181,0.12);
}
*{box-sizing:border-box;margin:0;padding:0;}
.ch-app{background:var(--bg);color:var(--text);font-family:'DM Sans',sans-serif;font-size:14px;line-height:1.6;display:flex;height:100vh;overflow:hidden;}
.ch-side{width:228px;flex-shrink:0;background:var(--bg2);border-right:1px solid var(--border);display:flex;flex-direction:column;overflow-y:auto;}
.ch-logo{padding:24px 20px 18px;border-bottom:1px solid var(--border);}
.ch-logo-name{font-family:'Playfair Display',serif;font-size:21px;font-weight:900;color:var(--gold);letter-spacing:.04em;line-height:1;}
.ch-logo-sub{font-family:'DM Mono',monospace;font-size:9px;color:var(--text3);letter-spacing:.15em;text-transform:uppercase;margin-top:5px;}
.ch-nav{padding:10px 0;flex:1;}
.ch-nav-sec{font-family:'DM Mono',monospace;font-size:9px;color:var(--text3);letter-spacing:.12em;text-transform:uppercase;padding:12px 20px 6px;}
.ch-nav-item{display:flex;align-items:center;gap:10px;padding:9px 20px;cursor:pointer;color:var(--text2);font-size:13px;transition:all .15s;border-left:2px solid transparent;}
.ch-nav-item:hover{color:var(--text);background:rgba(255,255,255,0.03);}
.ch-nav-item.on{color:var(--gold);border-left-color:var(--gold);background:var(--gold-dim);}
.ch-ic{font-size:14px;width:18px;text-align:center;}
.ch-tagnew{margin-left:auto;font-family:'DM Mono',monospace;font-size:8px;letter-spacing:.05em;background:var(--gold);color:#0a0a0f;padding:1px 5px;border-radius:3px;}
.ch-status{margin:0 14px 16px;background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:12px 14px;}
.ch-sl{font-family:'DM Mono',monospace;font-size:9px;color:var(--text3);letter-spacing:.1em;text-transform:uppercase;margin-bottom:8px;}
.ch-sr{display:flex;justify-content:space-between;font-size:11px;color:var(--text2);padding:2px 0;}
.ch-sr b{color:var(--gold2);font-weight:500;}
.ch-main{flex:1;overflow-y:auto;background:var(--bg);}
.ch-panel{padding:30px 34px;}
.ch-title{font-family:'Playfair Display',serif;font-size:27px;font-weight:700;line-height:1.2;}
.ch-sub{font-size:13px;color:var(--text2);margin-top:6px;}
.ch-line{width:40px;height:2px;background:var(--gold);margin:12px 0 24px;border-radius:1px;}
.ch-grid4{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:24px;}
.ch-grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;}
.ch-grid2{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;}
.ch-stat{background:var(--bg2);border:1px solid var(--border);border-radius:10px;padding:15px;}
.ch-stat-l{font-family:'DM Mono',monospace;font-size:9px;color:var(--text3);letter-spacing:.1em;text-transform:uppercase;margin-bottom:6px;}
.ch-stat-v{font-size:19px;font-weight:500;}
.ch-stat-n{font-size:11px;color:var(--text3);margin-top:3px;}
.ch-sect{font-family:'DM Mono',monospace;font-size:10px;color:var(--text3);letter-spacing:.12em;text-transform:uppercase;margin:24px 0 13px;padding-bottom:8px;border-bottom:1px solid var(--border);}
.ch-card{background:var(--bg2);border:1px solid var(--border);border-radius:10px;padding:16px 18px;margin-bottom:14px;}
.ch-card.gold{border-color:rgba(201,168,76,.35);background:linear-gradient(135deg,var(--bg2),rgba(201,168,76,.04));}
.ch-ch{font-family:'Playfair Display',serif;font-size:16px;font-weight:700;margin-bottom:3px;}
.ch-pill{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:.06em;text-transform:uppercase;padding:2px 7px;border-radius:4px;margin-left:8px;}
.ch-pill.gnew{background:var(--gold);color:#0a0a0f;}
.ch-pill.lock{background:var(--green-bg);color:#7ac49b;}
.ch-pill.act{background:var(--blue-bg);color:#7aaad4;}
.ch-app p{color:var(--text2);margin-bottom:8px;}
.ch-app b{color:var(--text);font-weight:500;}
.ch-gold{color:var(--gold);}
.ch-app ul{list-style:none;}
.ch-li{padding:6px 0;border-bottom:1px solid var(--border);display:flex;gap:10px;align-items:flex-start;color:var(--text2);font-size:13px;}
.ch-li:last-child{border-bottom:none;}
.ch-d{color:var(--gold);flex-shrink:0;}
.ch-note{color:var(--text3);font-size:11.5px;}
.ch-mini{background:var(--bg2);border:1px solid var(--border);border-radius:10px;padding:14px 16px;}
.ch-mh{font-size:13px;font-weight:500;margin-bottom:4px;}
.ch-mp{font-size:11.5px;color:var(--text3);line-height:1.55;}
.ch-step{display:flex;gap:12px;align-items:flex-start;padding:11px 0;border-bottom:1px solid var(--border);}
.ch-step:last-child{border-bottom:none;}
.ch-sn{font-family:'DM Mono',monospace;font-size:11px;color:var(--gold);background:var(--gold-dim);border:1px solid var(--gold-dim2);width:24px;height:24px;border-radius:6px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.ch-st{font-size:13px;font-weight:500;}
.ch-sd{font-size:11.5px;color:var(--text3);}
.ch-tool{background:var(--bg2);border:1px solid var(--border);border-radius:10px;padding:13px 15px;display:flex;justify-content:space-between;align-items:flex-start;}
.ch-tn{font-size:13px;font-weight:500;margin-bottom:2px;}
.ch-tu{font-size:11px;color:var(--text3);}
.ch-cost{font-family:'DM Mono',monospace;font-size:10px;padding:3px 8px;border-radius:4px;white-space:nowrap;}
.ch-cost.free{background:var(--green-bg);color:#7ac49b;}
.ch-cost.paid{background:var(--amber-bg);color:#d4a574;}
.ch-cost.tbd{background:var(--blue-bg);color:#7aaad4;}
.ch-diag{border-left:3px solid var(--gold);background:var(--gold-dim);border-radius:0 8px 8px 0;padding:13px 16px;margin-bottom:12px;}
.ch-diag.warn{border-left-color:var(--amber);background:var(--amber-bg);}
.ch-dl{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:.1em;text-transform:uppercase;color:var(--gold2);margin-bottom:5px;}
.ch-diag.warn .ch-dl{color:#d4a574;}
.ch-banner{background:linear-gradient(135deg,rgba(201,168,76,.15),rgba(201,168,76,.05));border:1px solid rgba(201,168,76,.3);border-radius:10px;padding:15px 18px;margin-bottom:24px;display:flex;justify-content:space-between;align-items:center;gap:16px;}
.ch-bt{font-family:'Playfair Display',serif;font-size:15px;color:var(--gold);}
.ch-bs{font-size:12px;color:var(--text3);margin-top:3px;}
.ch-bd{font-family:'DM Mono',monospace;font-size:12px;color:var(--gold2);white-space:nowrap;}
.ch-case{display:flex;gap:10px;align-items:center;padding:8px 0;border-bottom:1px solid var(--border);font-size:12.5px;}
.ch-case:last-child{border-bottom:none;}
.ch-cn{font-family:'DM Mono',monospace;font-size:10px;color:var(--text3);width:42px;flex-shrink:0;}
.ch-ct{flex:1;color:var(--text2);}
.ch-cs{font-family:'DM Mono',monospace;font-size:9px;padding:2px 7px;border-radius:4px;white-space:nowrap;}
.ch-cs.live{background:var(--green-bg);color:#7ac49b;}
.ch-cs.lk{background:var(--gold-dim2);color:var(--gold2);}
.ch-cs.q{background:rgba(255,255,255,.05);color:var(--text3);}
.ch-main::-webkit-scrollbar,.ch-side::-webkit-scrollbar{width:4px;}
.ch-main::-webkit-scrollbar-thumb,.ch-side::-webkit-scrollbar-thumb{background:var(--border2);border-radius:2px;}
`;

const NAV = [
  { section: "Operations", items: [
    { id: "dash", icon: "◈", label: "Dashboard" },
    { id: "pipeline", icon: "⟳", label: "Production Pipeline" },
    { id: "sops", icon: "▤", label: "SOP Library" },
  ]},
  { section: "Intelligence", items: [
    { id: "retention", icon: "◎", label: "Retention Intel", tag: "NEW" },
    { id: "backlog", icon: "✦", label: "Season 2 Backlog", tag: "NEW" },
    { id: "calendar", icon: "◷", label: "Season 1 Cases" },
  ]},
  { section: "Resources", items: [
    { id: "tools", icon: "⊞", label: "Tool Stack" },
    { id: "comp", icon: "◉", label: "Competitors" },
  ]},
];

const SOPS = [
  ["Length / Quality", "No padding, ever — but never cut genuine story to save marginal runtime. Length follows what the story earns. No flat cap from theory; read each video's curve once views are big enough, then cut the specific sag."],
  ["Beat-Mapping (Jun 28)", "Timecode-anchor every section to real Cole-clip durations before sourcing a single asset. Beat-seconds must sum to measured runtime. Single-idea beats >15s → still + Ken Burns."],
  ["Footage Cut", "Cole on screen the whole video (V2); V1 footage is backdrop. Cut on CONTENT (new subject/place/turn), not a timer. Fewer clips per section is correct."],
  ["Ken Burns Motion", "Move toward meaning; ~10–15% zoom over the full hold; alternate direction beat-to-beat; extra subtle behind Cole; one move per still."],
  ["Thumbnail", "vidIQ = default. Manual Canva/Leonardo only for high-stakes (#012). Hard gate: never ship garbled text or off-model Cole; never screen/frame grabs."],
  ["Music", "3 tracks, one per emotional act, change at transition cards, ~−20dB under Cole. Producer-agnostic. YouTube Audio Library or CC-BY — never Pixabay."],
  ["Captions", "ALL captions (long-form + Shorts) in CapCut Pro, every video. Caption-fix pass: past-tense \"red\"→\"read\", proper-noun accuracy, before export."],
  ["Transition Cards", "FADE, not hard-cut. Black solid + Text+ \"THE ___\". Built last. Music swaps only at the act-boundary cards."],
  ["HeyGen Prep", "Strip ellipses; spell dates/numbers; past-tense \"read\"→\"red\" in the paste-block (caption-fix reverts it). Heteronym test render."],
  ["Overlays / On-screen aids", "Optional, not standard; accurate-only; upper-two-thirds clear of captions. Add ONLY when a retention curve shows a specific need — never pre-applied or retrofitted."],
];

const CASES = [
  ["#001", "Indus Valley — 5 Million People Vanished", "live", "LIVE"],
  ["#002", "The Minoans — World's Richest Trade Empire", "live", "LIVE"],
  ["#003", "The Bronze Age Collapse", "live", "LIVE"],
  ["#004", "Mansa Musa — Richest Man Who Ever Lived", "live", "LIVE"],
  ["#005", "Göbekli Tepe — Temple 6,000 Years Before", "live", "LIVE"],
  ["#006", "Khmer Empire / Angkor", "lk", "SHIPPED"],
  ["#007", "Rome — Currency Collapse", "lk", "LOCKED"],
  ["#008", "Maya Collapse", "q", "QUEUE"],
  ["#009", "Templars", "q", "QUEUE"],
  ["#010", "South Sea", "q", "QUEUE"],
  ["#011", "Easter Island", "q", "QUEUE"],
  ["#012", "Indus Valley Revisited — FINALE (A/B thumbnail)", "q", "QUEUE"],
];

const TOOLS = [
  ["Claude Max", "AI production partner — all creative & strategy", "$100/mo", "paid"],
  ["HeyGen", "Cole lip-synced clips · Brad voice", "$99/mo", "paid"],
  ["CapCut Pro", "ALL captions — long-form + Shorts", "$19.99/mo", "paid"],
  ["Leonardo.ai", "Cole expression thumbnails (Phoenix 1.0)", "TBD tier", "tbd"],
  ["DaVinci Resolve", "Full edit · V1 footage / V2 Cole / A1 audio", "Free", "free"],
  ["vidIQ Max", "Default thumbnails · SEO · competitor tracking", "paid", "paid"],
  ["YouTube Audio Library", "Music — no attribution required", "Free", "free"],
  ["Canva", "Thumbnail compositing for high-stakes A/B", "Free tier", "free"],
];

const COMP = [
  ["Fall of Civilizations", "Thesis anchor · 1.5M", false],
  ["Voices of the Past", "1.1M", false],
  ["Knowledgia", "2.2M · outlier: \"Before Columbus\" 141K (2.5×)", false],
  ["History with Cy", "296K · close tonal match — watch most", false],
  ["Dan Davis History", "382K", false],
  ["Ancient Architects", "636K · Matt Sibson", false],
  ["Michael Button", "222K · close match · study his \"ominous curiosity\" title lane (192K)", true],
];

export default function App() {
  const [panel, setPanel] = useState("dash");

  const Stat = ({ l, v, n }) => (
    <div className="ch-stat"><div className="ch-stat-l">{l}</div><div className="ch-stat-v">{v}</div><div className="ch-stat-n">{n}</div></div>
  );

  return (
    <div className="ch-app">
      <style>{CSS}</style>

      <div className="ch-side">
        <div className="ch-logo">
          <div className="ch-logo-name">VANISHED HISTORY</div>
          <div className="ch-logo-sub">Command Center · v2</div>
        </div>
        <nav className="ch-nav">
          {NAV.map((grp) => (
            <div key={grp.section}>
              <div className="ch-nav-sec">{grp.section}</div>
              {grp.items.map((it) => (
                <div key={it.id} className={"ch-nav-item" + (panel === it.id ? " on" : "")} onClick={() => setPanel(it.id)}>
                  <span className="ch-ic">{it.icon}</span> {it.label}
                  {it.tag && <span className="ch-tagnew">{it.tag}</span>}
                </div>
              ))}
            </div>
          ))}
        </nav>
        <div className="ch-status">
          <div className="ch-sl">Channel · 28d</div>
          <div className="ch-sr"><span>Subscribers</span><b>24</b></div>
          <div className="ch-sr"><span>Views</span><b>10.3K</b></div>
          <div className="ch-sr"><span>Watch hrs</span><b>70.1</b></div>
          <div className="ch-sr"><span>Shorts share</span><b>93.5%</b></div>
        </div>
      </div>

      <div className="ch-main">
        <div className="ch-panel">

          {panel === "dash" && (
            <div>
              <div className="ch-title">Command Center</div>
              <div className="ch-sub">Vanished History · Season 1 "The Vanishing" · updated Jun 30, 2026</div>
              <div className="ch-line" />
              <div className="ch-banner">
                <div><div className="ch-bt">Case #007 — Rome / Currency Collapse is locked</div><div className="ch-bs">Craft-9 script (~15:25), cold-open SOP applied, ready for HeyGen</div></div>
                <div className="ch-bd">NEXT → #008 Maya launch</div>
              </div>
              <div className="ch-grid4">
                <Stat l="Season" v="#001–#012" n='"The Vanishing"' />
                <Stat l="Live cases" v="#001–#006" n="#006 Khmer shipped" />
                <Stat l="Cadence" v="Mon/Wed/Fri" n="3 / week" />
                <Stat l="Host" v="Cole" n="original · Leonardo + HeyGen" />
              </div>
              <div className="ch-sect">The one-line diagnosis (Jun 2026)</div>
              <div className="ch-diag"><div className="ch-dl">Growth engine</div><p style={{ margin: 0 }}><b>Shorts are doing the work</b> — ~93.5% of all views come from the Shorts feed. Best hook: <span className="ch-gold">"They just stopped. No war. No plague."</span> at 23.1% CTR.</p></div>
              <div className="ch-diag warn"><div className="ch-dl">The bottleneck</div><p style={{ margin: 0 }}><b>Long-form launch CTR.</b> YouTube already serves the channel (~88% of long-form impressions from Browse + Suggested) but thumbnails don't convert — Browse ~3.6%, Suggested ~1.2%. Win CTR <b>at launch</b>; never retrofit dead back-catalog.</p></div>
            </div>
          )}

          {panel === "pipeline" && (
            <div>
              <div className="ch-title">Production Pipeline</div>
              <div className="ch-sub">Locked Jun 20, 2026 · each step a separate session, never collapsed or reordered</div>
              <div className="ch-line" />
              <div className="ch-card">
                {[
                  ["1", "Research + Script (Claude)", "Must exist before any HeyGen. Opens COLD per the cold-open SOP. Delivered as .md + Vanished History PDF, automatically."],
                  ["2", "HeyGen Cole clips", "Requires final script. Measured clip durations set each section's exact length. Run the paste-prep pass first."],
                  ["3", "Edit + Footage (one session)", "After Cole clips. Source section-by-section against real durations. DaVinci: footage V1 · Cole V2 · audio A1. Cards + music LAST."],
                  ["4", "Thumbnail (separate session)", "vidIQ default; Canva/Leonardo for high-stakes only. Cole on-model, 2–3 heavy words, reacting not posed."],
                  ["5", "Shorts", "Cut from finished main. Hook/Twist/Mystery + reusable Cole outro. CapCut captions. Pin comment + related-video → main."],
                ].map(([n, t, d]) => (
                  <div className="ch-step" key={n}><div className="ch-sn">{n}</div><div><div className="ch-st">{t}</div><div className="ch-sd">{d}</div></div></div>
                ))}
              </div>
              <p style={{ fontSize: 12, color: "var(--text3)" }}>Hard rules: never schedule HeyGen before the script exists; never schedule the edit before the Cole clips exist.</p>
            </div>
          )}

          {panel === "sops" && (
            <div>
              <div className="ch-title">SOP Library</div>
              <div className="ch-sub">The locked standards. New tonight: the cold-open rule.</div>
              <div className="ch-line" />
              <div className="ch-card gold">
                <div className="ch-ch">Cold Open <span className="ch-pill gnew">New · Jun 30</span></div>
                <p>Every script #007 onward opens <b>cold</b>: Cole's first line is the hook (a concrete object, a contradiction, the most shocking unresolved fact). <b>No "In the year ___" / "To understand ___"</b> throat-clear. Open 2–3 loops in ~75s; promise + withhold; seed the thesis question the close pays off.</p>
                <p style={{ margin: 0 }}><span className="ch-gold">Basis:</span> retention cliffs in the first 30–45s across 5 videos (Mansa Musa's "In the year 1324…" → 17.6% AVD). Worked model: #007's two-coins open.</p>
              </div>
              <div className="ch-grid2">
                {SOPS.map(([h, p]) => (
                  <div className="ch-mini" key={h}><div className="ch-mh">{h}</div><div className="ch-mp">{p}</div></div>
                ))}
              </div>
            </div>
          )}

          {panel === "retention" && (
            <div>
              <div className="ch-title">Retention Intel</div>
              <div className="ch-sub">From the Jun 30 review of 5 long-form videos + traffic-source + curves</div>
              <div className="ch-line" />
              <div className="ch-diag"><div className="ch-dl">Finding 1 · The cliff is at the door</div><p style={{ margin: 0 }}>Every long-form curve has the same shape: a cliff in the first 30–45s, then a healthy gentle slope. The body works — we lose people at the open. Fix = the cold-open SOP.</p></div>
              <div className="ch-diag"><div className="ch-dl">Finding 2 · CTR is the bottleneck, not newness</div><p style={{ margin: 0 }}>88% of long-form impressions come from Browse + Suggested — YouTube <b>is</b> recommending the channel. Browse ~3.6%, Suggested ~1.2% (target 4–6%). The click is the leak, not the reach.</p></div>
              <div className="ch-diag"><div className="ch-dl">Finding 3 · Win CTR at launch only</div><p style={{ margin: 0 }}>Back-catalog impressions are front-loaded at release, then flatline. A new thumbnail can't convert impressions YouTube has stopped serving. Nail the launch burst; don't retrofit dead videos.</p></div>
              <div className="ch-diag warn"><div className="ch-dl">Caveat · retention is a noisy signal right now</div><p style={{ margin: 0 }}>At 24 subs the algorithm is still learning who to serve. The "length kills" read (Mansa 17:27 @17.6% vs Bronze 15:44 @42.5%) is <b>weak evidence</b>: different sample sizes (160 vs 22 views) and a reach confound (more-served videos pull casual viewers who drag retention down). Read curves per video once views are big enough — don't pre-cap length.</p></div>
              <div className="ch-sect">What we do</div>
              <ul>
                <li className="ch-li"><span className="ch-d">1</span><span><b>Fuel the Shorts.</b> Template the 23.1%-CTR three-beat hook; consider 4–5 Shorts per case.</span></li>
                <li className="ch-li"><span className="ch-d">2</span><span><b>Convert Shorts → long-form + subs.</b> Pin comment + related-video every Short; ask for the sub in the outro.</span></li>
                <li className="ch-li"><span className="ch-d">3</span><span><b>Fix long-form launch packaging.</b> #006-rigor thumbnails + test the "ominous curiosity" title lane.</span></li>
                <li className="ch-li"><span className="ch-d">4</span><span><b>No padding, let length follow the story</b>, and read curves as data accumulates.</span></li>
              </ul>
            </div>
          )}

          {panel === "backlog" && (
            <div>
              <div className="ch-title">Season 2 Backlog</div>
              <div className="ch-sub">vidIQ Daily Ideas + analytics · on-thesis only · reference when mapping post-#012</div>
              <div className="ch-line" />
              <div className="ch-card">
                <div className="ch-ch">Shortlist <span className="ch-pill act">Very High / High</span></div>
                <ul>
                  {[
                    ["The Lost American City Bigger Than London", "Cahokia; pairs with our \"largest city\" hook"],
                    ["The Forgotten Empire Buried Beneath the Sahara", ""],
                    ["How a Pandemic Erased an Empire", ""],
                    ["What Destroyed the Ancient City of Palmyra?", ""],
                    ["The Hidden City Beneath Modern Istanbul", ""],
                    ["Why the Library of Alexandria Burned", ""],
                    ["The Day Pompeii Was Buried Alive — minute by minute", ""],
                    ["The Curse That Sank Mayan Capitals", "pairs with #008"],
                  ].map(([t, n]) => (
                    <li className="ch-li" key={t}><span className="ch-d">◆</span><span>{t}{n && <span className="ch-note"> — {n}</span>}</span></li>
                  ))}
                </ul>
              </div>
              <div className="ch-grid2">
                <div className="ch-card gold"><div className="ch-ch">Safest bet</div><p style={{ margin: 0 }}><span className="ch-gold">Göbekli Tepe follow-up</span> — the channel's strongest topic across Shorts and impressions. A deeper case is the lowest-risk swing.</p></div>
                <div className="ch-card"><div className="ch-ch">Trend candidate</div><p style={{ margin: 0 }}>The Cuba underwater "city older than the pyramids" (Guanahacabibes sonar anomaly). Atlantis-adjacent, evergreen — verify framing.</p></div>
              </div>
            </div>
          )}

          {panel === "calendar" && (
            <div>
              <div className="ch-title">Season 1 — The Vanishing</div>
              <div className="ch-sub">Cases #001–#012 · opens & closes on Indus Valley (full-circle bookend)</div>
              <div className="ch-line" />
              <div className="ch-card">
                {CASES.map(([n, t, c, s]) => (
                  <div className="ch-case" key={n}><span className="ch-cn">{n}</span><span className="ch-ct">{t}</span><span className={"ch-cs " + c}>{s}</span></div>
                ))}
              </div>
              <p style={{ fontSize: 11.5, color: "var(--text3)" }}>Finale callback: "Twelve cases ago, a civilization vanished. Tonight, we go back."</p>
            </div>
          )}

          {panel === "tools" && (
            <div>
              <div className="ch-title">Tool Stack</div>
              <div className="ch-sub">Current as of Jun 30, 2026</div>
              <div className="ch-line" />
              <div className="ch-grid2">
                {TOOLS.map(([n, u, c, k]) => (
                  <div className="ch-tool" key={n}><div><div className="ch-tn">{n}</div><div className="ch-tu">{u}</div></div><span className={"ch-cost " + k}>{c}</span></div>
                ))}
              </div>
              <p style={{ fontSize: 11.5, color: "var(--text3)", marginTop: 10 }}>Tracked: ~$219/mo (Claude + HeyGen + CapCut) + Leonardo tier once confirmed. Watch HeyGen credit burn as volume scales.</p>
            </div>
          )}

          {panel === "comp" && (
            <div>
              <div className="ch-title">Competitors</div>
              <div className="ch-sub">7 tracked in vidIQ · all on-thesis lost-civilizations / ancient mystery</div>
              <div className="ch-line" />
              <div className="ch-grid3">
                {COMP.map(([n, d, hot]) => (
                  <div className="ch-mini" key={n} style={hot ? { borderColor: "rgba(201,168,76,.3)" } : {}}>
                    <div className={"ch-mh" + (hot ? " ch-gold" : "")}>{n}</div><div className="ch-mp">{d}</div>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 11.5, color: "var(--text3)", marginTop: 10 }}>Dropped (off-thesis): Dark Docs, Kings & Generals. Weekly vidIQ intelligence review every Monday.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
