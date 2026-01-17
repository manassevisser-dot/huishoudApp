// ==UserScript==
// @name         Safe GSA Harvester v9.3 (Fortified)
// @version      9.3.0
// @description  GSA Harvester met Safety Wrapper, Diagnostics & DOM Rollback
// @run-at       document-body
// @match        https://aistudio.google.com/*
// @grant        none
// ==/UserScript==

(function () {
    "use strict";
  
    /* ============================================================
       0. CONFIG
    ============================================================ */
  
    const SCRIPT_NAME = "GSA-HARVESTER-v9.3";
    const SAFETY_CONFIG = {
      STRICT_MODE_CHECK: true,
      TIMEOUT_MS: 30000, // 30 seconden voor lange harvests
      ENABLE_DOM_ROLLBACK: true,
      ENABLE_BRACKET_CHECK: true,
    };
  
    /* ============================================================
       AUDIT LOG
    ============================================================ */
  
    const Audit = {
      logs: [],
      log(action, details = "") {
        const entry = {
          time: new Date().toISOString(),
          action: `[${action}]`,
          details: details,
          location: window.location.href,
        };
        this.logs.push(entry);
        console.log(`📜 ${entry.time} ${entry.action}:`, details);
      },
      dump() {
        console.table(this.logs);
        return this.logs;
      },
    };
  
    /* ============================================================
       SELF-CHECK
    ============================================================ */
  
    function selfCheck(fn) {
      Audit.log("SELF-CHECK", "Starting static analysis...");
  
      try {
        const fnString = fn.toString();
        new Function(fnString);
  
        if (SAFETY_CONFIG.ENABLE_BRACKET_CHECK) {
          const stack = [];
          const pairs = { "(": ")", "[": "]", "{": "}" };
          for (let char of fnString) {
            if (["(", "[", "{"].includes(char)) {
              stack.push(char);
            } else if ([")", "]", "}"].includes(char)) {
              const last = stack.pop();
              if (pairs[last] !== char) {
                throw new Error(
                  `🔢 Bracket Mismatch! Expected closing for '${last}', found '${char}'.`,
                );
              }
            }
          }
          if (stack.length > 0) {
            throw new Error(`🔢 Unclosed Brackets found: ${stack.join(", ")}`);
          }
          Audit.log("SELF-CHECK", "Bracket count balanced.");
        }
  
        Audit.log("SELF-CHECK", "Passed.");
        return true;
      } catch (err) {
        Audit.log("SELF-CHECK-FAIL", err.message);
        console.error(`❌ [${SCRIPT_NAME}] Self-check FAILED.`);
        alert(`[${SCRIPT_NAME}] Aborted.\n${err.message}`);
        return false;
      }
    }
  
    /* ============================================================
       DOM GUARD (Rollback)
    ============================================================ */
  
    const DOMGuard = {
      addedNodes: [],
      observer: null,
  
      start() {
        if (!SAFETY_CONFIG.ENABLE_DOM_ROLLBACK) return;
        Audit.log("DOM-GUARD", "Monitoring mutations...");
  
        this.observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.type === "childList") {
              mutation.addedNodes.forEach((node) => {
                this.addedNodes.push(node);
              });
            }
          });
        });
  
        this.observer.observe(document.body, { childList: true, subtree: true });
      },
  
      stop() {
        if (this.observer) {
          this.observer.disconnect();
          Audit.log("DOM-GUARD", "Monitoring stopped.");
        }
      },
  
      rollback() {
        if (this.addedNodes.length === 0) return;
  
        Audit.log(
          "ROLLBACK",
          `Reverting ${this.addedNodes.length} DOM changes...`,
        );
        [...this.addedNodes].reverse().forEach((node) => {
          if (node.parentNode) {
            node.parentNode.removeChild(node);
          }
        });
        this.addedNodes = [];
        alert(`🧯 [${SCRIPT_NAME}] Critical Error! DOM changes rolled back.`);
      },
    };
  
    if (selfCheck(main)) {
      (async () => {
        DOMGuard.start();
  
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(
            () =>
              reject(
                new Error(
                  `⏱️ Timeout limit (${SAFETY_CONFIG.TIMEOUT_MS}ms) exceeded.`,
                ),
              ),
            SAFETY_CONFIG.TIMEOUT_MS,
          ),
        );
  
        try {
          await Promise.race([main(), timeoutPromise]);
          DOMGuard.stop();
          Audit.log("EXECUTION", "Finished successfully.");
        } catch (runtimeError) {
          console.error(`💥 [${SCRIPT_NAME}] Runtime Error:`, runtimeError);
          Audit.log("CRASH", runtimeError.message);
          DOMGuard.stop();
          DOMGuard.rollback();
          Audit.dump();
        }
      })();
    }
  })();
  