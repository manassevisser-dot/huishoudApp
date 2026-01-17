// ==UserScript==
// @name         Safe GSA Harvester v9.3 (Fortified)
// @version      9.3.0
// @description  GSA Harvester met Safety Wrapper, Diagnostics & DOM Rollback
// @run-at       document-body
// @match        [https://aistudio.google.com/](https://aistudio.google.com/)*
// @grant        none
// ==/UserScript==

async function main() {
    Audit.log("EXECUTION", "GSA Harvester starting...");

    /**
     * CONFIG
     */
    const CONFIG = {
      ENDPOINT: "HIER_JE_PIPEDREAM_URL_PLAKKEN",
      SELECTORS: {
        turn: "ms-chat-turn",
        userText: '.user-query-text, .query-text, [class*="user-message"]',
        aiText:
          '.model-response-text, .response-text, [class*="model-message"]',
        thoughtPanel: "mat-expansion-panel-header",
        thoughtContent:
          'mat-expansion-panel-content, .model-thought-container, [class*="thought"]',
      },
      UI_REFRESH_RATE: 2000,
    };

    /**
     * STATE
     */
    if (!window.GSA_STATE) {
      window.GSA_STATE = {
        isRunning: false,
        totalTurns: 0,
        processedTurns: 0,
        harvest: [],
        diagnostics: { ok: true, missing: [] },
      };
    }

    /**
     * DIAGNOSTICS
     */
    function runDiagnostics() {
      const missing = [];
      Object.entries(CONFIG.SELECTORS).forEach(([key, sel]) => {
        if (!document.querySelector(sel)) {
          missing.push(key);
        }
      });
      window.GSA_STATE.diagnostics = {
        ok: missing.length === 0,
        missing: missing,
        checkedAt: new Date().toISOString(),
      };
      return window.GSA_STATE.diagnostics;
    }

    /**
     * EXTRACTION LOGIC
     */
    function extractData(turn) {
      const userEl = turn.querySelector(CONFIG.SELECTORS.userText);
      const aiEl = turn.querySelector(CONFIG.SELECTORS.aiText);

      if (userEl?.innerText?.trim())
        return { role: "User", content: userEl.innerText.trim() };
      if (aiEl?.innerText?.trim())
        return { role: "AI", content: aiEl.innerText.trim() };
      return null;
    }

    async function handleThoughts(turn) {
      const header = turn.querySelector(CONFIG.SELECTORS.thoughtPanel);
      if (header && header.getAttribute("aria-expanded") !== "true") {
        const icon = header.querySelector(".footer-icon");
        if (icon && !icon.classList.contains("expanded")) {
          ["mousedown", "mouseup", "click"].forEach((eventType) => {
            header.dispatchEvent(
              new MouseEvent(eventType, {
                bubbles: true,
                cancelable: true,
                view: window,
              }),
            );
          });
        }
        await new Promise((r) => setTimeout(r, 600));
      }
      return (
        turn
          .querySelector(CONFIG.SELECTORS.thoughtContent)
          ?.innerText?.trim() || null
      );
    }

    /**
     * UI ENGINE
     */
    function renderUI() {
      if (document.getElementById("gsa-panel-v9")) {
        updateUIStats();
        return;
      }

      const panel = document.createElement("div");
      panel.id = "gsa-panel-v9";
      panel.style.cssText = `position:fixed;bottom:20px;right:20px;z-index:999999;background:#111;color:#0f0;font-family:monospace;padding:15px;border-radius:10px;width:300px;box-shadow:0 0 20px rgba(0,255,0,0.4);border:2px solid #333;`;
      panel.innerHTML = `
        <div style="border-bottom:1px solid #333;margin-bottom:10px;padding-bottom:5px;display:flex;justify-content:space-between;align-items:center;font-weight:bold;">
          <span>GSA HARVESTER v9.3</span>
          <span id="gsa-alarm" title="Selector Status" style="font-size:18px;cursor:help;">●</span>
        </div>
        <div id="gsa-counter" style="margin-bottom:10px;font-size:18px;text-align:center;">Turns: 0 / 0</div>
        <div id="gsa-status" style="font-size:11px;margin-bottom:8px;color:#888;">Status: Ready</div>
        <button id="gsa-start-btn" style="cursor:pointer;background:#222;color:#0f0;border:1px solid #0f0;padding:10px;width:100%;margin-bottom:10px;font-weight:bold;">▶ Start Oogst</button>
        <button id="gsa-send-btn" disabled style="cursor:not-allowed;background:#111;color:#444;border:1px solid #444;padding:10px;width:100%;font-weight:bold;">📤 Send to Pipedream</button>
        <div id="gsa-log" style="height:100px;overflow-y:auto;font-size:11px;color:#0c0;margin-top:10px;background:#000;padding:5px;border:1px solid #222;"></div>
      `;
      document.body.appendChild(panel);

      document.getElementById("gsa-start-btn").onclick = startHarvest;
      document.getElementById("gsa-send-btn").onclick = sendToPipedream;

      const diag = runDiagnostics();
      updateUIStats();
      if (!diag.ok) {
        logUI(`⚠️ Mis: ${diag.missing.join(", ")}`);
      }
    }

    function updateUIStats() {
      const diag = runDiagnostics();
      const alarm = document.getElementById("gsa-alarm");
      const counter = document.getElementById("gsa-counter");
      const status = document.getElementById("gsa-status");

      if (alarm) {
        alarm.style.color = diag.ok ? "#0f0" : "#f00";
        alarm.title = diag.ok
          ? "Alle selectors gevonden"
          : `MISSEND: ${diag.missing.join(", ")}`;
      }

      if (counter) {
        counter.innerText = `Turns: ${window.GSA_STATE.processedTurns} / ${window.GSA_STATE.totalTurns}`;
      }

      if (status) {
        if (diag.ok) {
          status.innerText = "Status: Alle systemen nominaal";
          status.style.color = "#0f0";
        } else {
          status.innerText = `Status: Missende selectors (${diag.missing.length})`;
          status.style.color = "#f00";
        }
      }
    }

    function logUI(msg) {
      const log = document.getElementById("gsa-log");
      if (log) {
        log.innerHTML += `> ${msg}<br>`;
        log.scrollTop = log.scrollHeight;
      }
    }

    /**
     * ACTIONS
     */
    async function startHarvest() {
      if (window.GSA_STATE.isRunning) return;

      const diag = runDiagnostics();
      if (!diag.ok) {
        logUI(`⚠️ FOUT: Missende elementen (${diag.missing.join(", ")}).`);
        return;
      }

      window.GSA_STATE.isRunning = true;
      window.GSA_STATE.harvest = [];
      window.GSA_STATE.processedTurns = 0;

      const turns = Array.from(
        document.querySelectorAll(CONFIG.SELECTORS.turn),
      );
      window.GSA_STATE.totalTurns = turns.length;
      logUI(`Scan gestart: ${turns.length} turns gevonden.`);

      for (let i = 0; i < turns.length; i++) {
        turns[i].scrollIntoView({ block: "center" });
        await new Promise((r) => setTimeout(r, 300));
        const data = extractData(turns[i]);
        if (data) {
          const entry = {
            ...data,
            timestamp: new Date().toISOString(),
          };
          if (data.role === "AI") {
            entry.thoughts = await handleThoughts(turns[i]);
          }
          window.GSA_STATE.harvest.push(entry);
          window.GSA_STATE.processedTurns = i + 1;
          updateUIStats();
        }
        await new Promise((r) => setTimeout(r, 150));
      }

      window.GSA_STATE.isRunning = false;
      const sendBtn = document.getElementById("gsa-send-btn");
      sendBtn.disabled = false;
      sendBtn.style.cssText =
        "cursor:pointer;background:#003300;color:#0f0;border:1px solid #0f0;padding:10px;width:100%;font-weight:bold;";
      logUI("Oogst compleet. Klaar voor verzending.");
    }

    async function sendToPipedream() {
      if (CONFIG.ENDPOINT.includes("HIER_JE_PIPEDREAM_URL")) {
        return logUI("❌ FOUT: Plak eerst je URL in CONFIG!");
      }
      logUI("Data verzenden...");
      try {
        const res = await fetch(CONFIG.ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            metadata: {
              timestamp: new Date().toISOString(),
              source: window.location.href,
              turnsCount: window.GSA_STATE.harvest.length,
              diagnostics: window.GSA_STATE.diagnostics,
            },
            payload: window.GSA_STATE.harvest,
          }),
        });
        if (res.ok) logUI("✅ Succes! Data staat in Pipedream.");
        else logUI(`❌ Fout: ${res.status}`);
      } catch (e) {
        logUI(`❌ Netwerkfout: ${e.message}`);
      }
    }

    // Start UI & Heartbeat
    setInterval(renderUI, CONFIG.UI_REFRESH_RATE);
    renderUI();

    Audit.log("EXECUTION", "GSA Harvester initialized successfully");
    return "GSA Harvester Ready";
  }
