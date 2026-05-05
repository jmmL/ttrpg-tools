const SAMPLE_INPUT = `Slickware Killers
- Bounty level 5 - 72kcr
- “The ‘stars’ of the illegal snuff series *Kill ’Em All* appear to have established themselves in here in the Dream. We are offering 75kcr for each of them brought, in dead or alive. There are four know members, each of whom seems to be operating independently and without direct support from the producers. We are not authorised to offer a reward for the capture of their producers.”

Tau Sigma 7
- Bounty level 3 - 24kcr
- “Rare metal deposit [Key Type NM-109] detected on Tau Sigma 7. Request ground team for site access and sample retrieval. Geology unstable. Biology unconfirmed. For enquiries regarding on-site injury or harmful exposure, consult The Tempest Mercenary Company’s Contractor Handbook article F-7: Corporate Accountability Waiver.”

Butune Peace Force
- Bounty level 2 - 12-30kcr
- “As according to the Butune Peace Force Constitution, Szofia Woodhams must make herself available to us for questioning. Please locate her and bring her willingly to us.”

Distress Signal
- Bounty level unknown
- “A distress signal has been picked up coming from a research station of a bankrupt subsidiary of BAS-Lehman Ges.m.b.H. Used to be a pharmaceutical development lab. Maybe there’s something you can salvage…”`;

const state = {
  jobs: [],
  autoscrollHandle: null,
};

const el = {
  list: document.getElementById("jobList"),
  input: document.getElementById("jobInput"),
  themeSelect: document.getElementById("themeSelect"),
  glitchToggle: document.getElementById("glitchToggle"),
  glitchIntensity: document.getElementById("glitchIntensity"),
  dirtToggle: document.getElementById("dirtToggle"),
  dirtIntensity: document.getElementById("dirtIntensity"),
  autoscrollToggle: document.getElementById("autoscrollToggle"),
  autoscrollSpeed: document.getElementById("autoscrollSpeed"),
  fontScale: document.getElementById("fontScale"),
  lockToggle: document.getElementById("lockToggle"),
  controls: document.getElementById("controls"),
  wear: document.querySelector(".wear"),
  clockTime: document.getElementById("clockTime"),
  clockDate: document.getElementById("clockDate"),
};

function parseJobs(text) {
  const blocks = text.trim().split(/\n\s*\n+/).map((b) => b.trim()).filter(Boolean);
  return blocks.map((block) => {
    const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
    const name = lines[0]?.replace(/^[-*#\s]+/, "") || "Unknown Job";
    const bountyLine = lines.find((l) => /bounty level/i.test(l)) || "Bounty level unknown - unknown";
    const [, levelRaw = "Unknown", rewardRaw = "Unknown"] = bountyLine.match(/bounty level\s*([^\-]+)(?:\-\s*(.+))?/i) || [];
    const descLine = lines.filter((l) => l !== lines[0] && l !== bountyLine).join(" ").replace(/^[-*]\s*/, "");
    const description = descLine.replace(/[“”]/g, '"').replace(/^"|"$/g, "") || "No description provided.";
    return {
      name,
      level: `Bounty Level ${levelRaw.trim()}`,
      reward: rewardRaw.trim(),
      description,
    };
  });
}

function renderJobs() {
  el.list.innerHTML = "";
  state.jobs.forEach((job, i) => {
    const article = document.createElement("article");
    article.className = "job-card";
    article.innerHTML = `
      <div class="job-head">
        <div class="job-index">${String(i + 1).padStart(2, "0")}</div>
        <div>
          <div class="meta-row"><span class="key">Name:</span><span>${job.name}</span></div>
          <div class="meta-row"><span class="key">Level:</span><span>${job.level}</span></div>
          <div class="meta-row"><span class="key">Reward:</span><span>${job.reward}</span></div>
        </div>
      </div>
      <div class="description"><strong>Description:</strong>\n${job.description}</div>
    `;
    el.list.appendChild(article);
  });
}

function setTheme(theme) {
  document.body.dataset.theme = theme;
}

function persistSettings() {
  const data = {
    theme: el.themeSelect.value,
    glitch: el.glitchToggle.checked,
    glitchIntensity: el.glitchIntensity.value,
    dirt: el.dirtToggle.checked,
    dirtIntensity: el.dirtIntensity.value,
    autoscroll: el.autoscrollToggle.checked,
    autoscrollSpeed: el.autoscrollSpeed.value,
    fontScale: el.fontScale.value,
    lock: el.lockToggle.checked,
    jobsRaw: el.input.value,
  };
  localStorage.setItem("mothershipBoard", JSON.stringify(data));
}

function applySettings(saved) {
  if (!saved) return;
  el.themeSelect.value = saved.theme || "green";
  el.glitchToggle.checked = !!saved.glitch;
  el.glitchIntensity.value = saved.glitchIntensity || 25;
  el.dirtToggle.checked = !!saved.dirt;
  el.dirtIntensity.value = saved.dirtIntensity || 30;
  el.autoscrollToggle.checked = !!saved.autoscroll;
  el.autoscrollSpeed.value = saved.autoscrollSpeed || 3;
  el.fontScale.value = saved.fontScale || 100;
  el.lockToggle.checked = !!saved.lock;
  el.input.value = saved.jobsRaw || SAMPLE_INPUT;
}

function applyFx() {
  document.body.dataset.glitch = el.glitchToggle.checked ? "1" : "0";
  document.querySelector(".screen-shell").style.animationDuration = `${Math.max(0.05, 0.5 - el.glitchIntensity.value / 200)}s`;
  el.wear.style.opacity = el.dirtToggle.checked ? String(el.dirtIntensity.value / 100) : "0";
  document.documentElement.style.setProperty("--font-scale", `${el.fontScale.value}%`);
}

function updateAutoScroll() {
  if (state.autoscrollHandle) {
    clearInterval(state.autoscrollHandle);
    state.autoscrollHandle = null;
  }
  if (el.autoscrollToggle.checked) {
    const step = Number(el.autoscrollSpeed.value);
    state.autoscrollHandle = setInterval(() => {
      const max = el.list.scrollHeight - el.list.clientHeight;
      if (el.list.scrollTop >= max) el.list.scrollTop = 0;
      else el.list.scrollTop += step;
    }, 80);
  }
}

function tickClock() {
  const now = new Date();
  el.clockTime.textContent = now.toLocaleTimeString("en-US", { hour12: false });
  el.clockDate.textContent = now.toLocaleDateString("en-US", { year: "2-digit", month: "2-digit", day: "2-digit" });
}

document.getElementById("applyTextBtn").addEventListener("click", () => {
  state.jobs = parseJobs(el.input.value);
  renderJobs();
  persistSettings();
});

document.getElementById("loadDefaultBtn").addEventListener("click", () => {
  el.input.value = SAMPLE_INPUT;
  state.jobs = parseJobs(SAMPLE_INPUT);
  renderJobs();
  persistSettings();
});

document.getElementById("fileInput").addEventListener("change", async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  const content = await file.text();
  el.input.value = content;
  state.jobs = parseJobs(content);
  renderJobs();
  persistSettings();
});

[el.themeSelect, el.glitchToggle, el.glitchIntensity, el.dirtToggle, el.dirtIntensity, el.autoscrollToggle, el.autoscrollSpeed, el.fontScale, el.lockToggle]
  .forEach((ctrl) => ctrl.addEventListener("input", () => {
    setTheme(el.themeSelect.value);
    applyFx();
    updateAutoScroll();
    el.controls.classList.toggle("hidden", el.lockToggle.checked);
    persistSettings();
  }));

document.addEventListener("keydown", (event) => {
  if (event.key.toLowerCase() === "g") el.controls.classList.toggle("hidden");
  if (event.key === "ArrowDown") el.list.scrollTop += 120;
  if (event.key === "ArrowUp") el.list.scrollTop -= 120;
});

(function init() {
  const saved = JSON.parse(localStorage.getItem("mothershipBoard") || "null");
  applySettings(saved);
  setTheme(el.themeSelect.value);
  applyFx();
  state.jobs = parseJobs(el.input.value || SAMPLE_INPUT);
  renderJobs();
  updateAutoScroll();
  tickClock();
  setInterval(tickClock, 1000);
})();
