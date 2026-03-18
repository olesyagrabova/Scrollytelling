/**
 * HOOKED ON SCREENS — Smartphone Addiction Scrollytelling
 * Classic sticky format: text scrolls left, viz panel freezes right
 *
 * Usage:
 *   1. <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/7.8.5/d3.min.js"></script>
 *   2. <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Bebas+Neue&family=Lora:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">
 *   3. <div id="scrollytelling-root"></div>
 *   4. <script src="smartphone_addiction_scrolly.js"></script>
 */

(function () {
  "use strict";

  // ─── COLOUR TOKENS ───────────────────────────────────────
  const C = {
    bg:     "#0d0d14",
    panel:  "#13131c",
    border: "#1f1f2e",
    text:   "#e4e4f0",
    muted:  "#686880",
    dim:    "#2a2a3a",
    red:    "#ff3c5a",
    cyan:   "#00d4f0",
    yellow: "#ffcb47",
    green:  "#3ddc84",
    orange: "#ff8c42",
  };

  // ─── STORY STEPS ─────────────────────────────────────────
  const STEPS = [
    {
      id: "intro",
      chapter: null,
      headline: "A generation raised by screens.",
      body: `Smartphones arrived in most teenagers' pockets around 2012. Within a decade, the effects on youth mental health, sleep, and social development became impossible to ignore.<br><br>This is what the data shows.`,
      stat: null,
    },
    {
      id: "screen-time",
      chapter: "01 — Screen Time",
      headline: "Nearly 9 hours a day. Every day.",
      body: `The average 15–18 year old now spends close to <strong>9 hours</strong> per day on screens — more than they spend sleeping. Even 8–10 year olds average over 4 hours daily, mostly on YouTube and gaming platforms.`,
      stat: { value: "7–9h", label: "avg. teen daily screen time", source: "Common Sense Media, 2023" },
    },
    {
      id: "social-media",
      chapter: "02 — Social Media",
      headline: "Social media commands 3+ hours alone.",
      body: `Of total screen time, social media platforms (TikTok, Instagram, Snapchat, YouTube) consume over 3 hours per day for the average teen. Algorithmic feeds are engineered to maximise time-on-app at all costs.`,
      stat: { value: "95%", label: "of U.S. teens own a smartphone", source: "Pew Research Center, 2023" },
    },
    {
      id: "depression",
      chapter: "03 — Mental Health",
      headline: "Depression rates doubled since 2012.",
      body: `Since smartphones crossed 50% teen ownership in 2012, adolescent depression and anxiety have climbed sharply — especially among girls. Teen girls spending 5+ hours daily on social media are <strong>2.5× more likely</strong> to be depressed.`,
      stat: { value: "+145%", label: "rise in teen depression (2010–2020)", source: "CDC YRBSS, 2021" },
    },
    {
      id: "sleep",
      chapter: "04 — Sleep",
      headline: "Phones in the bedroom steal sleep.",
      body: `Blue light suppresses melatonin. Teens using phones after 10 PM lose an average of <strong>1.2 hours</strong> of sleep per night. Over a week, that's an entire lost night of sleep. Yet 72% of teens sleep with their phone within arm's reach.`,
      stat: { value: "22%", label: "of teens get the recommended 9h sleep", source: "NSF, 2023" },
    },
    {
      id: "unlocks",
      chapter: "05 — Compulsion",
      headline: "132 times a day, the phone wins.",
      body: `By age 18, the average teen unlocks their phone <strong>132 times per day</strong> — once every 7 minutes of waking life. Variable-reward notifications borrow directly from slot-machine psychology to keep users coming back.`,
      stat: { value: "132×", label: "avg. daily phone unlocks at age 18", source: "APA, 2023" },
    },
    {
      id: "esteem",
      chapter: "06 — Self-Image",
      headline: "More social media, lower self-esteem.",
      body: `Instagram's own internal research (leaked 2021) found 32% of teen girls said the platform made them feel worse about their bodies. The pattern holds across platforms: self-esteem scores drop consistently as daily usage rises.`,
      stat: { value: "46%", label: "of teens say social media worsens body image", source: "Common Sense Media, 2022" },
    },
    {
      id: "solutions",
      chapter: "The Way Forward",
      headline: "Awareness and limits work.",
      body: `Teens who actively set screen-time limits report meaningful improvements in sleep, anxiety, and academic focus. Phone-free bedrooms, designated offline hours, and school phone policies are all evidence-backed interventions.`,
      stat: { value: "71%", label: "report better sleep after setting limits", source: "Common Sense Media, 2022" },
    },
  ];

  // ─── DATA ────────────────────────────────────────────────
  const DATA = {
    screenTime: [
      { group: "Ages 8–10",  hours: 4.4 },
      { group: "Ages 11–12", hours: 5.9 },
      { group: "Ages 13–14", hours: 7.2 },
      { group: "Ages 15–16", hours: 8.1 },
      { group: "Ages 17–18", hours: 8.9 },
    ],
    socialMedia: [
      { platform: "TikTok",    mins: 105 },
      { platform: "YouTube",   mins: 82 },
      { platform: "Instagram", mins: 64 },
      { platform: "Snapchat",  mins: 48 },
      { platform: "Other",     mins: 31 },
    ],
    mentalHealth: [
      { year: 2010, girls: 21,  boys: 10   },
      { year: 2012, girls: 22,  boys: 10.5 },
      { year: 2014, girls: 26,  boys: 12   },
      { year: 2016, girls: 31,  boys: 14   },
      { year: 2018, girls: 36,  boys: 16   },
      { year: 2020, girls: 41,  boys: 20   },
      { year: 2022, girls: 46,  boys: 23   },
    ],
    sleep: [
      { mins: 0,   sleep: 9.1 }, { mins: 30,  sleep: 8.8 },
      { mins: 60,  sleep: 8.4 }, { mins: 90,  sleep: 8.0 },
      { mins: 120, sleep: 7.7 }, { mins: 150, sleep: 7.4 },
      { mins: 180, sleep: 7.1 }, { mins: 210, sleep: 6.8 },
      { mins: 240, sleep: 6.4 }, { mins: 270, sleep: 6.0 },
      { mins: 300, sleep: 5.8 },
    ],
    unlocks: [
      { age: 10, n: 35  }, { age: 11, n: 48  }, { age: 12, n: 62  },
      { age: 13, n: 79  }, { age: 14, n: 91  }, { age: 15, n: 105 },
      { age: 16, n: 118 }, { age: 17, n: 126 }, { age: 18, n: 132 },
    ],
    selfEsteem: [
      { hrs: 0, score: 8.2 }, { hrs: 0.5, score: 8.0 }, { hrs: 1, score: 7.8 },
      { hrs: 1.5, score: 7.4 }, { hrs: 2, score: 7.0 }, { hrs: 2.5, score: 6.7 },
      { hrs: 3, score: 6.3 }, { hrs: 3.5, score: 6.0 }, { hrs: 4, score: 5.6 },
      { hrs: 4.5, score: 5.3 }, { hrs: 5, score: 4.9 }, { hrs: 5.5, score: 4.6 },
      { hrs: 6, score: 4.2 },
    ],
    solutions: [
      { label: "Better sleep",        pct: 71 },
      { label: "Less anxiety",        pct: 63 },
      { label: "More free time",      pct: 58 },
      { label: "Better grades",       pct: 52 },
    ],
  };

  // ════════════════════════════════════════════════════════
  // CSS
  // ════════════════════════════════════════════════════════
  const CSS = `
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: auto; }

    body {
      background: ${C.bg};
      color: ${C.text};
      font-family: 'Lora', Georgia, serif;
      font-size: 16px;
      line-height: 1.7;
      overflow-x: hidden;
    }

    /* ── PROGRESS BAR ── */
    #st-progress {
      position: fixed; top: 0; left: 0; height: 2px; width: 0;
      background: linear-gradient(90deg, ${C.red}, ${C.cyan});
      z-index: 200; transition: width 0.1s linear;
    }

    /* ── HERO ── */
    #st-hero {
      min-height: 100vh;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      text-align: center; padding: 60px 40px;
      background: radial-gradient(ellipse at 50% 30%, #1c0a1c 0%, ${C.bg} 65%);
      position: relative;
    }
    #st-hero .hero-eyebrow {
      font-family: 'Space Mono', monospace;
      font-size: 0.7rem; letter-spacing: 0.35em;
      color: ${C.red}; text-transform: uppercase;
      margin-bottom: 28px; opacity: 0;
      animation: stFadeUp 0.7s ease 0.4s forwards;
    }
    #st-hero h1 {
      font-family: 'Bebas Neue', Impact, sans-serif;
      font-size: clamp(5rem, 16vw, 13rem);
      line-height: 0.87; letter-spacing: -0.01em;
      color: ${C.text}; opacity: 0;
      animation: stFadeUp 0.8s ease 0.6s forwards;
    }
    #st-hero h1 span { color: ${C.red}; display: block; }
    #st-hero .hero-sub {
      font-style: italic; font-size: clamp(1rem, 1.8vw, 1.2rem);
      color: ${C.muted}; max-width: 500px; margin-top: 30px; opacity: 0;
      animation: stFadeUp 0.9s ease 0.9s forwards;
    }
    .hero-cue {
      position: absolute; bottom: 36px;
      display: flex; flex-direction: column; align-items: center; gap: 8px;
      opacity: 0; animation: stFadeUp 1s ease 1.4s forwards;
    }
    .hero-cue span {
      font-family: 'Space Mono', monospace;
      font-size: 0.6rem; letter-spacing: 0.3em; color: ${C.muted}; text-transform: uppercase;
    }
    .hero-cue-line {
      width: 1px; height: 36px;
      background: linear-gradient(to bottom, ${C.cyan}, transparent);
      animation: stPulse 1.6s ease-in-out infinite;
    }

    /* ── SCROLLY CONTAINER ── */
    #st-scrolly {
      max-width: 1180px; margin: 0 auto; padding: 0 24px;
      display: flex; gap: 0; position: relative;
    }

    /* LEFT: text steps */
    #st-steps {
      flex: 0 0 42%; padding: 0 48px 0 0;
    }

    .st-step {
      min-height: 100vh;
      display: flex; flex-direction: column; justify-content: center;
      padding: 80px 0;
      opacity: 0.25;
      transition: opacity 0.5s ease;
    }
    .st-step.active { opacity: 1; }

    .st-step-chapter {
      font-family: 'Space Mono', monospace;
      font-size: 0.65rem; letter-spacing: 0.3em;
      color: ${C.cyan}; text-transform: uppercase;
      margin-bottom: 16px;
    }
    .st-step h2 {
      font-family: 'Bebas Neue', sans-serif;
      font-size: clamp(2rem, 4vw, 3.2rem);
      line-height: 1; color: ${C.text};
      margin-bottom: 20px; letter-spacing: 0.02em;
    }
    .st-step p {
      font-size: 0.98rem; line-height: 1.8;
      color: #a8a8c0; margin-bottom: 10px;
    }
    .st-step strong { color: ${C.text}; font-weight: 600; }

    .st-stat-box {
      margin-top: 24px;
      border-left: 3px solid ${C.red};
      padding: 14px 18px;
      background: rgba(255,60,90,0.07);
    }
    .st-stat-value {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 3rem; line-height: 1; color: ${C.red};
      letter-spacing: 0.03em;
    }
    .st-stat-label {
      font-family: 'Space Mono', monospace;
      font-size: 0.68rem; color: #8888a0; margin-top: 4px;
    }
    .st-stat-source {
      font-family: 'Space Mono', monospace;
      font-size: 0.58rem; color: ${C.muted}; margin-top: 6px;
    }

    /* RIGHT: sticky viz */
    #st-viz-wrap {
      flex: 0 0 58%;
      position: sticky; top: 0;
      height: 100vh;
      display: flex; align-items: center; justify-content: center;
    }

    #st-viz-panel {
      width: 100%; height: calc(100vh - 80px);
      background: ${C.panel};
      border: 1px solid ${C.border};
      border-radius: 6px;
      position: relative; overflow: hidden;
      display: flex; flex-direction: column;
    }

    #st-viz-panel::before {
      content: '';
      position: absolute; top: 0; left: 0; right: 0; height: 2px;
      background: linear-gradient(90deg, ${C.red}, ${C.cyan});
    }

    .st-viz-header {
      padding: 18px 24px 0;
      font-family: 'Space Mono', monospace;
      font-size: 0.6rem; letter-spacing: 0.2em;
      text-transform: uppercase; color: ${C.muted};
      flex-shrink: 0;
    }

    #st-chart-area {
      flex: 1; position: relative; min-height: 0;
    }

    /* Each chart layer */
    .st-chart-layer {
      position: absolute; inset: 0;
      opacity: 0;
      transition: opacity 0.6s ease;
      pointer-events: none;
      display: flex; align-items: center; justify-content: center;
    }
    .st-chart-layer.active {
      opacity: 1;
      pointer-events: auto;
    }
    .st-chart-layer svg { width: 100%; height: 100%; }

    /* ── TOOLTIP ── */
    #st-tip {
      position: fixed;
      background: #1a1a2a; border: 1px solid #333348;
      color: ${C.text}; font-family: 'Space Mono', monospace;
      font-size: 0.7rem; padding: 7px 11px; border-radius: 3px;
      pointer-events: none; z-index: 300; opacity: 0;
      transition: opacity 0.15s; line-height: 1.5;
    }

    /* ── OUTRO ── */
    #st-outro {
      min-height: 80vh;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      text-align: center; padding: 80px 40px;
      background: radial-gradient(ellipse at 50% 60%, #071a0d 0%, ${C.bg} 65%);
    }
    #st-outro h2 {
      font-family: 'Bebas Neue', sans-serif;
      font-size: clamp(3rem, 8vw, 8rem);
      line-height: 0.9; color: ${C.text}; margin-bottom: 24px;
    }
    #st-outro h2 .g { color: ${C.green}; }
    #st-outro p {
      font-size: 1.05rem; line-height: 1.8; color: ${C.muted};
      max-width: 540px; margin: 0 auto 16px;
    }
    .st-sources {
      font-family: 'Space Mono', monospace;
      font-size: 0.58rem; color: #3a3a55;
      line-height: 1.9; max-width: 680px; margin-top: 30px;
    }

    /* ── ANIMATIONS ── */
    @keyframes stFadeUp {
      from { opacity: 0; transform: translateY(28px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes stPulse {
      0%,100% { opacity: 0.3; transform: scaleY(0.8); }
      50%      { opacity: 1;   transform: scaleY(1.2); }
    }

    /* ── RESPONSIVE ── */
    @media (max-width: 860px) {
      #st-scrolly { flex-direction: column; }
      #st-steps { flex: none; padding-right: 0; }
      #st-viz-wrap {
        position: sticky; top: 0; flex: none;
        height: 50vh; width: 100%;
        z-index: 10;
      }
      #st-viz-panel { height: 100%; border-radius: 0; border-left: none; border-right: none; }
      .st-step { min-height: 80vh; }
    }
  `;

  // ════════════════════════════════════════════════════════
  // HTML SKELETON
  // ════════════════════════════════════════════════════════
  function buildHTML(root) {
    const stepsHTML = STEPS.map((s, i) => `
      <div class="st-step" data-step="${i}">
        ${s.chapter ? `<span class="st-step-chapter">${s.chapter}</span>` : ""}
        <h2>${s.headline}</h2>
        <p>${s.body}</p>
        ${s.stat ? `
          <div class="st-stat-box">
            <div class="st-stat-value">${s.stat.value}</div>
            <div class="st-stat-label">${s.stat.label}</div>
            <div class="st-stat-source">— ${s.stat.source}</div>
          </div>` : ""}
      </div>
    `).join("");

    const layerIds = ["intro","screen-time","social-media","depression","sleep","unlocks","esteem","solutions"];

    root.innerHTML = `
      <div id="st-progress"></div>
      <div id="st-tip"></div>

      <!-- HERO -->
      <section id="st-hero">
        <span class="hero-eyebrow">A Data Story · 2024</span>
        <h1>HOOKED<span>ON SCREENS</span></h1>
        <p class="hero-sub">Smartphone addiction is reshaping the mental health, sleep, and social lives of an entire generation.</p>
        <div class="hero-cue"><span>Scroll</span><div class="hero-cue-line"></div></div>
      </section>

      <!-- SCROLLY BODY -->
      <div id="st-scrolly">

        <!-- LEFT: narrative steps -->
        <div id="st-steps">${stepsHTML}</div>

        <!-- RIGHT: sticky viz -->
        <div id="st-viz-wrap">
          <div id="st-viz-panel">
            <div class="st-viz-header" id="st-viz-label">Visualisation</div>
            <div id="st-chart-area">
              ${layerIds.map(id => `<div class="st-chart-layer" id="layer-${id}"><svg id="svg-${id}"></svg></div>`).join("")}
            </div>
          </div>
        </div>
      </div>

      <!-- OUTRO -->
      <section id="st-outro">
        <h2>AWARENESS<br>IS<br><span class="g">POWER.</span></h2>
        <p>The data is clear. Understanding it is the first step toward change — for parents, educators, policymakers, and young people themselves.</p>
        <p>Screen-free bedrooms, app limits, and honest conversations are all evidence-backed places to start.</p>
        <div class="st-sources">
          Sources: Pew Research Center 2023 · CDC YRBSS 2021 · National Sleep Foundation 2023 ·
          Common Sense Media 2022 · Jonathan Haidt "The Anxious Generation" 2024 ·
          American Psychological Association 2023 · WSJ / Meta internal research leak 2021
        </div>
      </section>
    `;
  }

  // ════════════════════════════════════════════════════════
  // VIZ LABEL MAP
  // ════════════════════════════════════════════════════════
  const VIZ_LABELS = {
    "intro":        "About this story",
    "screen-time":  "Daily screen time by age group (hours)",
    "social-media": "Time on social media platforms (min/day)",
    "depression":   "Teens reporting persistent sadness/hopelessness (%)",
    "sleep":        "Sleep hours vs. nightly device use",
    "unlocks":      "Daily phone unlocks by age",
    "esteem":       "Self-esteem score vs. social media use",
    "solutions":    "Teens who set limits report (% agreeing)",
  };

  // ════════════════════════════════════════════════════════
  // TOOLTIP
  // ════════════════════════════════════════════════════════
  let tipEl;
  function showTip(html, event) {
    tipEl.innerHTML = html;
    tipEl.style.opacity = 1;
    tipEl.style.left = (event.clientX + 14) + "px";
    tipEl.style.top  = (event.clientY - 10) + "px";
  }
  function hideTip() { tipEl.style.opacity = 0; }

  // ════════════════════════════════════════════════════════
  // CHART HELPERS
  // ════════════════════════════════════════════════════════
  function svgOf(id) {
    return d3.select(`#svg-${id}`);
  }

  function dims(svgEl) {
    const n = svgEl.node();
    const W = n.clientWidth  || n.parentElement.clientWidth  || 500;
    const H = n.clientHeight || n.parentElement.clientHeight || 380;
    return { W, H };
  }

  const MONO = "'Space Mono', monospace";
  const axisStyle = (sel) => sel
    .call(g => g.select(".domain").remove())
    .selectAll("text")
    .attr("fill", C.muted)
    .attr("font-family", MONO)
    .attr("font-size", "0.6rem");

  function gridH(g, x, iH) {
    g.selectAll(".gh").data(x.ticks ? x.ticks(5) : []).join("line")
      .attr("x1", d => x(d)).attr("x2", d => x(d))
      .attr("y1", 0).attr("y2", iH)
      .attr("stroke", C.dim).attr("stroke-dasharray", "3,3");
  }

  function gridV(g, y, iW) {
    g.selectAll(".gv").data(y.ticks ? y.ticks(5) : []).join("line")
      .attr("x1", 0).attr("x2", iW)
      .attr("y1", d => y(d)).attr("y2", d => y(d))
      .attr("stroke", C.dim).attr("stroke-dasharray", "3,3");
  }

  // ════════════════════════════════════════════════════════
  // CHART: INTRO (phone silhouette + opening stat)
  // ════════════════════════════════════════════════════════
  function buildIntro() {
    const svg = svgOf("intro");
    const { W, H } = dims(svg);
    svg.attr("viewBox", `0 0 ${W} ${H}`);

    const g = svg.append("g");

    // Background glow
    g.append("ellipse")
      .attr("cx", W/2).attr("cy", H/2)
      .attr("rx", 140).attr("ry", 200)
      .attr("fill", C.red).attr("opacity", 0.04);

    // Phone frame
    const pw = 100, ph = 180, px = W/2 - pw/2, py = H/2 - ph/2;
    g.append("rect")
      .attr("x", px).attr("y", py).attr("width", pw).attr("height", ph)
      .attr("rx", 14).attr("fill", "none")
      .attr("stroke", C.muted).attr("stroke-width", 1.5);

    // Screen
    g.append("rect")
      .attr("x", px+6).attr("y", py+14).attr("width", pw-12).attr("height", ph-28)
      .attr("rx", 6).attr("fill", "#1a1a28");

    // Screen glow
    g.append("rect")
      .attr("x", px+6).attr("y", py+14).attr("width", pw-12).attr("height", ph-28)
      .attr("rx", 6).attr("fill", C.cyan).attr("opacity", 0.06);

    // Notch
    g.append("rect")
      .attr("x", W/2-15).attr("y", py+6).attr("width", 30).attr("height", 5)
      .attr("rx", 2.5).attr("fill", C.dim);

    // Home button
    g.append("circle")
      .attr("cx", W/2).attr("cy", py+ph-8)
      .attr("r", 5).attr("fill", "none")
      .attr("stroke", C.dim).attr("stroke-width", 1.2);

    // Big stat text
    g.append("text")
      .attr("x", W/2).attr("y", H/2 - 40)
      .attr("text-anchor", "middle")
      .attr("fill", C.red)
      .attr("font-family", "'Bebas Neue', sans-serif")
      .attr("font-size", "2.8rem")
      .text("7–9h");

    g.append("text")
      .attr("x", W/2).attr("y", H/2)
      .attr("text-anchor", "middle")
      .attr("fill", C.muted)
      .attr("font-family", MONO)
      .attr("font-size", "0.62rem")
      .text("per day, every day");

    // Surrounding ring of labels
    const labels = ["TikTok", "Instagram", "Snapchat", "YouTube", "Gaming", "Messages"];
    labels.forEach((l, i) => {
      const angle = (i / labels.length) * Math.PI * 2 - Math.PI / 2;
      const r = 190;
      const lx = W/2 + Math.cos(angle) * r;
      const ly = H/2 + Math.sin(angle) * r;
      g.append("text")
        .attr("x", lx).attr("y", ly)
        .attr("text-anchor", "middle").attr("dominant-baseline", "middle")
        .attr("fill", C.muted).attr("font-family", MONO)
        .attr("font-size", "0.62rem").attr("opacity", 0.7)
        .text(l);

      // Leader
      const dx = Math.cos(angle), dy = Math.sin(angle);
      g.append("line")
        .attr("x1", W/2 + dx*60).attr("y1", H/2 + dy*100)
        .attr("x2", W/2 + dx*(r-36)).attr("y2", H/2 + dy*(r-16))
        .attr("stroke", C.dim).attr("stroke-width", 0.5)
        .attr("stroke-dasharray", "3,3");
    });
  }

  // ════════════════════════════════════════════════════════
  // CHART: SCREEN TIME (horizontal bars)
  // ════════════════════════════════════════════════════════
  function buildScreenTime() {
    const svg = svgOf("screen-time");
    const { W, H } = dims(svg);
    const M = { top: 20, right: 70, bottom: 30, left: 90 };
    const iW = W - M.left - M.right, iH = H - M.top - M.bottom;
    svg.attr("viewBox", `0 0 ${W} ${H}`);

    const g = svg.append("g").attr("transform", `translate(${M.left},${M.top})`);
    const x = d3.scaleLinear().domain([0, 10]).range([0, iW]);
    const y = d3.scaleBand().domain(DATA.screenTime.map(d => d.group)).range([0, iH]).padding(0.35);
    const col = d3.scaleSequential().domain([4, 9]).interpolator(d3.interpolateRgb("#004060", C.red));

    gridH(g, x, iH);

    const bars = g.selectAll(".bar").data(DATA.screenTime).join("rect")
      .attr("y", d => y(d.group)).attr("height", y.bandwidth())
      .attr("x", 0).attr("width", 0)
      .attr("fill", d => col(d.hours)).attr("rx", 2)
      .style("cursor", "crosshair")
      .on("mousemove", (ev, d) => showTip(`<strong>${d.group}</strong><br>${d.hours}h per day`, ev))
      .on("mouseleave", hideTip);

    bars.transition().duration(900).delay((d,i) => i*100).attr("width", d => x(d.hours));

    g.selectAll(".bl").data(DATA.screenTime).join("text")
      .attr("x", d => x(d.hours) + 5)
      .attr("y", d => y(d.group) + y.bandwidth()/2)
      .attr("dominant-baseline", "middle")
      .attr("fill", C.text).attr("font-family", MONO).attr("font-size", "0.65rem")
      .attr("opacity", 0).text(d => d.hours + "h")
      .transition().duration(500).delay((d,i) => i*100+800).attr("opacity", 1);

    g.append("g").call(d3.axisLeft(y).tickSize(0)).call(axisStyle).selectAll("text").attr("dx", -4);
    g.append("g").attr("transform", `translate(0,${iH})`).call(d3.axisBottom(x).ticks(5).tickFormat(d => d+"h")).call(axisStyle);
  }

  // ════════════════════════════════════════════════════════
  // CHART: SOCIAL MEDIA (donut / bar)
  // ════════════════════════════════════════════════════════
  function buildSocialMedia() {
    const svg = svgOf("social-media");
    const { W, H } = dims(svg);
    const M = { top: 20, right: 70, bottom: 30, left: 100 };
    const iW = W - M.left - M.right, iH = H - M.top - M.bottom;
    svg.attr("viewBox", `0 0 ${W} ${H}`);

    const g = svg.append("g").attr("transform", `translate(${M.left},${M.top})`);
    const maxVal = d3.max(DATA.socialMedia, d => d.mins);
    const x = d3.scaleLinear().domain([0, maxVal + 10]).range([0, iW]);
    const y = d3.scaleBand().domain(DATA.socialMedia.map(d => d.platform)).range([0, iH]).padding(0.3);
    const cols = [C.red, C.orange, C.yellow, C.cyan, C.muted];

    gridH(g, x, iH);

    const bars = g.selectAll(".bar").data(DATA.socialMedia).join("rect")
      .attr("y", d => y(d.platform)).attr("height", y.bandwidth())
      .attr("x", 0).attr("width", 0)
      .attr("fill", (d,i) => cols[i]).attr("rx", 2)
      .style("cursor", "crosshair")
      .on("mousemove", (ev, d) => showTip(`<strong>${d.platform}</strong><br>${d.mins} min/day`, ev))
      .on("mouseleave", hideTip);

    bars.transition().duration(900).delay((d,i) => i*110).attr("width", d => x(d.mins));

    g.selectAll(".bl").data(DATA.socialMedia).join("text")
      .attr("x", d => x(d.mins) + 5).attr("y", d => y(d.platform) + y.bandwidth()/2)
      .attr("dominant-baseline", "middle")
      .attr("fill", C.text).attr("font-family", MONO).attr("font-size", "0.65rem")
      .attr("opacity", 0).text(d => d.mins + " min")
      .transition().duration(500).delay((d,i) => i*110+800).attr("opacity", 1);

    g.append("g").call(d3.axisLeft(y).tickSize(0)).call(axisStyle).selectAll("text").attr("dx", -4);
    g.append("g").attr("transform", `translate(0,${iH})`).call(d3.axisBottom(x).ticks(5).tickFormat(d => d+"m")).call(axisStyle);
  }

  // ════════════════════════════════════════════════════════
  // CHART: DEPRESSION (dual line)
  // ════════════════════════════════════════════════════════
  function buildDepression() {
    const svg = svgOf("depression");
    const { W, H } = dims(svg);
    const M = { top: 30, right: 30, bottom: 40, left: 50 };
    const iW = W - M.left - M.right, iH = H - M.top - M.bottom;
    svg.attr("viewBox", `0 0 ${W} ${H}`);

    const g = svg.append("g").attr("transform", `translate(${M.left},${M.top})`);
    const x = d3.scaleLinear().domain([2010, 2022]).range([0, iW]);
    const y = d3.scaleLinear().domain([0, 54]).range([iH, 0]);

    gridV(g, y, iW);

    // Annotation: 2012 inflection
    g.append("line")
      .attr("x1", x(2012)).attr("x2", x(2012))
      .attr("y1", 0).attr("y2", iH)
      .attr("stroke", C.yellow).attr("stroke-dasharray", "4,3").attr("opacity", 0.5);

    g.append("text")
      .attr("x", x(2012) + 5).attr("y", 14)
      .attr("fill", C.yellow).attr("font-family", MONO).attr("font-size", "0.55rem")
      .text("50% teen smartphone ownership →");

    const lineGen = key => d3.line().x(d => x(d.year)).y(d => y(d[key])).curve(d3.curveCatmullRom);
    const areaGen = key => d3.area().x(d => x(d.year)).y0(iH).y1(d => y(d[key])).curve(d3.curveCatmullRom);

    const pal = { girls: C.red, boys: C.cyan };

    ["girls","boys"].forEach(key => {
      g.append("path").datum(DATA.mentalHealth)
        .attr("fill", pal[key]).attr("opacity", 0.07)
        .attr("d", areaGen(key));

      const path = g.append("path").datum(DATA.mentalHealth)
        .attr("fill","none").attr("stroke", pal[key])
        .attr("stroke-width", key==="girls"?2.5:1.8)
        .attr("d", lineGen(key));

      const len = path.node().getTotalLength();
      path.attr("stroke-dasharray", len).attr("stroke-dashoffset", len)
        .transition().duration(1400).delay(200).ease(d3.easeCubicInOut)
        .attr("stroke-dashoffset", 0);

      g.selectAll(`.dot-${key}`).data(DATA.mentalHealth).join("circle")
        .attr("cx", d => x(d.year)).attr("cy", d => y(d[key]))
        .attr("r", 3.5).attr("fill", pal[key])
        .style("cursor", "crosshair")
        .on("mousemove", (ev, d) => showTip(`${d.year} · ${key==="girls"?"♀":"♂"}: ${d[key]}%`, ev))
        .on("mouseleave", hideTip);
    });

    // Legend
    [["girls", C.red, "♀ Girls"], ["boys", C.cyan, "♂ Boys"]].forEach(([k, c, l], i) => {
      g.append("rect").attr("x", iW-90).attr("y", i*18).attr("width", 16).attr("height", 3).attr("fill", c);
      g.append("text").attr("x", iW-70).attr("y", i*18+4)
        .attr("fill", c).attr("font-family", MONO).attr("font-size", "0.6rem").text(l);
    });

    g.append("g").attr("transform", `translate(0,${iH})`).call(d3.axisBottom(x).ticks(6).tickFormat(d3.format("d"))).call(axisStyle);
    g.append("g").call(d3.axisLeft(y).ticks(5).tickFormat(d => d+"%")).call(axisStyle);
  }

  // ════════════════════════════════════════════════════════
  // CHART: SLEEP (scatter + regression)
  // ════════════════════════════════════════════════════════
  function buildSleep() {
    const svg = svgOf("sleep");
    const { W, H } = dims(svg);
    const M = { top: 20, right: 30, bottom: 50, left: 50 };
    const iW = W - M.left - M.right, iH = H - M.top - M.bottom;
    svg.attr("viewBox", `0 0 ${W} ${H}`);

    const g = svg.append("g").attr("transform", `translate(${M.left},${M.top})`);
    const x = d3.scaleLinear().domain([0, 320]).range([0, iW]);
    const y = d3.scaleLinear().domain([5, 10]).range([iH, 0]);

    gridV(g, y, iW);

    // Recommended line
    [9].forEach(hr => {
      g.append("line").attr("x1",0).attr("x2",iW).attr("y1",y(hr)).attr("y2",y(hr))
        .attr("stroke", C.green).attr("stroke-dasharray","0").attr("opacity",0.4);
      g.append("text").attr("x", iW-2).attr("y", y(hr)-5)
        .attr("fill", C.green).attr("text-anchor","end")
        .attr("font-family", MONO).attr("font-size","0.55rem")
        .text("recommended min ↓");
    });

    // Regression
    const n = DATA.sleep.length;
    const sx = d3.sum(DATA.sleep, d=>d.mins), sy = d3.sum(DATA.sleep, d=>d.sleep);
    const sxy = d3.sum(DATA.sleep, d=>d.mins*d.sleep), sx2 = d3.sum(DATA.sleep, d=>d.mins*d.mins);
    const slope = (n*sxy - sx*sy)/(n*sx2 - sx*sx);
    const intercept = (sy - slope*sx)/n;

    const tp = g.append("path").datum([[0,intercept],[310,slope*310+intercept]])
      .attr("fill","none").attr("stroke",C.red).attr("stroke-width",1.8)
      .attr("stroke-dasharray","5,4")
      .attr("d", d3.line().x(d=>x(d[0])).y(d=>y(d[1])));
    const tl = tp.node().getTotalLength();
    tp.attr("stroke-dasharray",tl).attr("stroke-dashoffset",tl)
      .transition().duration(1100).delay(400).attr("stroke-dashoffset",0);

    g.selectAll(".sdot").data(DATA.sleep).join("circle")
      .attr("cx", d=>x(d.mins)).attr("cy", iH).attr("r",5)
      .attr("fill", C.cyan).attr("opacity",0.75)
      .style("cursor","crosshair")
      .on("mousemove",(ev,d)=>showTip(`Device: ${d.mins}min<br>Sleep: ${d.sleep}h`,ev))
      .on("mouseleave",hideTip)
      .transition().duration(700).delay((d,i)=>i*45).attr("cy",d=>y(d.sleep));

    // Axis labels
    g.append("text").attr("x",iW/2).attr("y",iH+40)
      .attr("text-anchor","middle").attr("fill",C.muted)
      .attr("font-family",MONO).attr("font-size","0.6rem")
      .text("Nightly device use after 10pm (minutes)");

    g.append("g").attr("transform",`translate(0,${iH})`).call(d3.axisBottom(x).ticks(6).tickFormat(d=>d+"m")).call(axisStyle);
    g.append("g").call(d3.axisLeft(y).ticks(5).tickFormat(d=>d+"h")).call(axisStyle);
  }

  // ════════════════════════════════════════════════════════
  // CHART: UNLOCKS (area)
  // ════════════════════════════════════════════════════════
  function buildUnlocks() {
    const svg = svgOf("unlocks");
    const { W, H } = dims(svg);
    const M = { top: 20, right: 40, bottom: 50, left: 50 };
    const iW = W - M.left - M.right, iH = H - M.top - M.bottom;
    svg.attr("viewBox", `0 0 ${W} ${H}`);

    const g = svg.append("g").attr("transform", `translate(${M.left},${M.top})`);
    const x = d3.scaleLinear().domain([10, 18]).range([0, iW]);
    const y = d3.scaleLinear().domain([0, 160]).range([iH, 0]);

    gridV(g, y, iW);

    const defs = svg.append("defs");
    const gr = defs.append("linearGradient").attr("id","ug").attr("gradientUnits","userSpaceOnUse").attr("x1",0).attr("y1",0).attr("x2",0).attr("y2",iH);
    gr.append("stop").attr("offset","0%").attr("stop-color",C.orange).attr("stop-opacity",0.45);
    gr.append("stop").attr("offset","100%").attr("stop-color",C.orange).attr("stop-opacity",0.01);

    const area = d3.area().x(d=>x(d.age)).y0(iH).y1(d=>y(d.n)).curve(d3.curveCatmullRom);
    const line = d3.line().x(d=>x(d.age)).y(d=>y(d.n)).curve(d3.curveCatmullRom);

    g.append("path").datum(DATA.unlocks).attr("fill","url(#ug)").attr("d",area);

    const lp = g.append("path").datum(DATA.unlocks).attr("fill","none").attr("stroke",C.orange).attr("stroke-width",2.5).attr("d",line);
    const ll = lp.node().getTotalLength();
    lp.attr("stroke-dasharray",ll).attr("stroke-dashoffset",ll).transition().duration(1300).delay(100).attr("stroke-dashoffset",0);

    g.selectAll(".udot").data(DATA.unlocks).join("circle")
      .attr("cx",d=>x(d.age)).attr("cy",d=>y(d.n)).attr("r",5)
      .attr("fill",C.orange).attr("opacity",0)
      .style("cursor","crosshair")
      .on("mousemove",(ev,d)=>showTip(`Age ${d.age}<br>${d.n} unlocks/day`,ev))
      .on("mouseleave",hideTip)
      .transition().duration(300).delay((d,i)=>i*80+1200).attr("opacity",1);

    g.append("text").attr("x",iW/2).attr("y",iH+40)
      .attr("text-anchor","middle").attr("fill",C.muted)
      .attr("font-family",MONO).attr("font-size","0.6rem")
      .text("Age");

    g.append("g").attr("transform",`translate(0,${iH})`).call(d3.axisBottom(x).ticks(8).tickFormat(d=>"Age "+d)).call(axisStyle);
    g.append("g").call(d3.axisLeft(y).ticks(5).tickFormat(d=>d+"×")).call(axisStyle);
  }

  // ════════════════════════════════════════════════════════
  // CHART: SELF ESTEEM (colour scatter)
  // ════════════════════════════════════════════════════════
  function buildEsteem() {
    const svg = svgOf("esteem");
    const { W, H } = dims(svg);
    const M = { top: 20, right: 30, bottom: 50, left: 55 };
    const iW = W - M.left - M.right, iH = H - M.top - M.bottom;
    svg.attr("viewBox", `0 0 ${W} ${H}`);

    const g = svg.append("g").attr("transform", `translate(${M.left},${M.top})`);
    const x = d3.scaleLinear().domain([0, 6.5]).range([0, iW]);
    const y = d3.scaleLinear().domain([3, 9]).range([iH, 0]);
    const col = d3.scaleSequential().domain([4,8]).interpolator(d3.interpolateRgb(C.red, C.cyan));

    gridV(g, y, iW);

    // Connecting line
    const lp = g.append("path").datum(DATA.selfEsteem)
      .attr("fill","none").attr("stroke","#2a2a40").attr("stroke-width",1.5)
      .attr("d", d3.line().x(d=>x(d.hrs)).y(d=>y(d.score)).curve(d3.curveCatmullRom));
    const ll = lp.node().getTotalLength();
    lp.attr("stroke-dasharray",ll).attr("stroke-dashoffset",ll)
      .transition().duration(1000).delay(200).attr("stroke-dashoffset",0);

    g.selectAll(".edot").data(DATA.selfEsteem).join("circle")
      .attr("cx",d=>x(d.hrs)).attr("cy",iH)
      .attr("r",7).attr("fill",d=>col(d.score))
      .attr("stroke","#0d0d14").attr("stroke-width",1.5)
      .style("cursor","crosshair")
      .on("mousemove",(ev,d)=>showTip(`${d.hrs}h/day<br>Self-esteem: ${d.score}/10`,ev))
      .on("mouseleave",hideTip)
      .transition().duration(700).delay((d,i)=>i*55+400).attr("cy",d=>y(d.score));

    g.append("text").attr("x",iW/2).attr("y",iH+40)
      .attr("text-anchor","middle").attr("fill",C.muted)
      .attr("font-family",MONO).attr("font-size","0.6rem")
      .text("Social media hours per day");

    g.append("g").attr("transform",`translate(0,${iH})`).call(d3.axisBottom(x).ticks(7).tickFormat(d=>d+"h")).call(axisStyle);
    g.append("g").call(d3.axisLeft(y).ticks(5).tickFormat(d=>d+"/10")).call(axisStyle);
  }

  // ════════════════════════════════════════════════════════
  // CHART: SOLUTIONS (horizontal bars)
  // ════════════════════════════════════════════════════════
  function buildSolutions() {
    const svg = svgOf("solutions");
    const { W, H } = dims(svg);
    const M = { top: 20, right: 70, bottom: 30, left: 110 };
    const iW = W - M.left - M.right, iH = H - M.top - M.bottom;
    svg.attr("viewBox", `0 0 ${W} ${H}`);

    const g = svg.append("g").attr("transform", `translate(${M.left},${M.top})`);
    const x = d3.scaleLinear().domain([0, 100]).range([0, iW]);
    const y = d3.scaleBand().domain(DATA.solutions.map(d=>d.label)).range([0, iH]).padding(0.3);

    // Tracks
    g.selectAll(".trk").data(DATA.solutions).join("rect")
      .attr("x",0).attr("y",d=>y(d.label)).attr("width",iW).attr("height",y.bandwidth())
      .attr("fill",C.dim).attr("rx",2);

    const bars = g.selectAll(".sbar").data(DATA.solutions).join("rect")
      .attr("x",0).attr("y",d=>y(d.label)).attr("width",0).attr("height",y.bandwidth())
      .attr("fill",C.green).attr("rx",2)
      .style("cursor","crosshair")
      .on("mousemove",(ev,d)=>showTip(`<strong>${d.label}</strong><br>${d.pct}%`,ev))
      .on("mouseleave",hideTip);

    bars.transition().duration(900).delay((d,i)=>i*120).attr("width",d=>x(d.pct));

    g.selectAll(".slbl").data(DATA.solutions).join("text")
      .attr("x",d=>x(d.pct)+5).attr("y",d=>y(d.label)+y.bandwidth()/2)
      .attr("dominant-baseline","middle").attr("fill",C.green)
      .attr("font-family",MONO).attr("font-size","0.65rem").attr("opacity",0)
      .text(d=>d.pct+"%")
      .transition().duration(400).delay((d,i)=>i*120+800).attr("opacity",1);

    g.append("g").call(d3.axisLeft(y).tickSize(0)).call(axisStyle).selectAll("text").attr("dx",-4);
    g.append("g").attr("transform",`translate(0,${iH})`).call(d3.axisBottom(x).ticks(5).tickFormat(d=>d+"%")).call(axisStyle);
  }

  // ════════════════════════════════════════════════════════
  // SCROLLYTELLING ENGINE
  // ════════════════════════════════════════════════════════
  const STEP_IDS = ["intro","screen-time","social-media","depression","sleep","unlocks","esteem","solutions"];

  let currentStep = -1;

  function activateStep(idx) {
    if (idx === currentStep) return;
    currentStep = idx;

    // Update text opacity
    document.querySelectorAll(".st-step").forEach((el, i) => {
      el.classList.toggle("active", i === idx);
    });

    // Switch chart layer
    document.querySelectorAll(".st-chart-layer").forEach((el, i) => {
      el.classList.toggle("active", i === idx);
    });

    // Update viz label
    const id = STEP_IDS[idx];
    document.getElementById("st-viz-label").textContent = VIZ_LABELS[id] || "";
  }

  function initScroll() {
    const steps = document.querySelectorAll(".st-step");
    const bar   = document.getElementById("st-progress");

    // Activate first step immediately
    activateStep(0);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const idx = parseInt(entry.target.dataset.step, 10);
          activateStep(idx);
        }
      });
    }, {
      rootMargin: "-35% 0px -55% 0px", // trigger when step is roughly in middle of viewport
      threshold: 0,
    });

    steps.forEach(el => observer.observe(el));

    // Progress bar
    window.addEventListener("scroll", () => {
      const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
      bar.style.width = Math.min(pct, 100) + "%";
    }, { passive: true });
  }

  // ════════════════════════════════════════════════════════
  // INIT
  // ════════════════════════════════════════════════════════
  function init() {
    const root = document.getElementById("scrollytelling-root");
    if (!root) { console.error("[scrolly] #scrollytelling-root not found"); return; }
    if (typeof d3 === "undefined") { console.error("[scrolly] D3 v7 required"); return; }

    // Inject styles
    const style = document.createElement("style");
    style.textContent = CSS;
    document.head.appendChild(style);

    // Fonts
    if (!document.querySelector('link[href*="Bebas"]')) {
      const lk = document.createElement("link");
      lk.rel = "stylesheet";
      lk.href = "https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Bebas+Neue&family=Lora:ital,wght@0,400;0,600;1,400&display=swap";
      document.head.appendChild(lk);
    }

    // Build HTML
    buildHTML(root);
    tipEl = document.getElementById("st-tip");

    // Build all charts (they're hidden until activated)
    buildIntro();
    buildScreenTime();
    buildSocialMedia();
    buildDepression();
    buildSleep();
    buildUnlocks();
    buildEsteem();
    buildSolutions();

    // Start scroll engine
    initScroll();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();
