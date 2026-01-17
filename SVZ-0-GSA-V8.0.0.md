## 📦 Metadata (Verplicht voor Gate A)
- **Artifact_ID:** SVZ-0-GSA-V8.0.0
- **Role:** CEO MANASSE
- **Timestamp:** 2026-01-08T04:10:23Z
<context_definition>
  Runtime_Environment: BROWSER_TAMPERMONKEY
  Project_Type: NEW_FEATURE
</context_definition>
<baseline_integrity>
  SHA256_Hash: af9fae173896240398d00197979523725b6995bb9b2f57ec5af5dc307a168d5a
</baseline_integrity>
- **Source_Commit:** MANUAL_INPUT
- **PII_Attestation:** NEE
- **Status:** LOCKED

---

## 📄 Originele Input (SVZ-0)

```javascript
// ==UserScript==
// @name         GSA Deep Harvester v7.2-rev18 - Streamlined Human Trigger
// @version      7.2.18
// @author       Manasse + Team Phoenix
// @match        https://aistudio.google.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    window.GSA_STATE = window.GSA_STATE || { lastProcessedIndex: -1, harvestedItems: [], lastClip: "" };
    const STATE = window.GSA_STATE;

    const forceClick = (el) => {
        if (!el) return;
        ['mousedown', 'mouseup', 'click'].forEach(t =>
            el.dispatchEvent(new MouseEvent(t, { bubbles: true, cancelable: true, view: window }))
        );
    };

    const onAction = async (status) => {
    // 1. Validatie (Data redden van de vorige actie)
    try {
        const currentClip = await navigator.clipboard.readText();
        if (currentClip && currentClip !== STATE.lastClip && currentClip.length > 10) {
            STATE.harvestedItems.push({ index: STATE.lastProcessedIndex, thoughts: currentClip });
            STATE.lastClip = currentClip;
        }
    } catch (e) { console.log("Klembord check overslaan..."); }

    const turns = document.querySelectorAll('ms-chat-turn');

    // --- REV20: DE REIS NAAR BOVEN ---
    if (STATE.lastProcessedIndex === -1) {
        status.textContent = "🚀 Reizen naar Beurt 1...";
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Forceer ook de interne chat-container naar boven
        const chatContainer = document.querySelector('ms-chat-output') || window;
        chatContainer.scrollTo({ top: 0, behavior: 'smooth' });

        await new Promise(r => setTimeout(r, 1200)); // Gun hem de tijd om te reizen
    }

    // 2. SCANNEN
    for (let i = STATE.lastProcessedIndex + 1; i < turns.length; i++) {
        const t = turns[i];
        
        // Zoek de 'Thoughts' sectie
        const headers = Array.from(t.querySelectorAll('mat-expansion-panel-header, .top-panel-header'));
        const header = headers.find(h => h.textContent.toLowerCase().includes('thoughts'));
        
        if (header) {
            // Breng de beurt in beeld
            t.scrollIntoView({ behavior: 'smooth', block: 'center' });
            await new Promise(r => setTimeout(r, 800));

            // Openklappen
            if (header.getAttribute('aria-expanded') !== 'true') {
                forceClick(header);
                await new Promise(r => setTimeout(r, 600));
            }

            // Kebab Menu (Drie puntjes)
            const kebabBtn = t.querySelector('button[aria-haspopup="menu"]') || 
                             Array.from(t.querySelectorAll('button')).find(b => 
                                b.innerText.includes('more_vert') || (b.ariaLabel && b.ariaLabel.toLowerCase().includes('more'))
                             );

            if (kebabBtn) {
                forceClick(kebabBtn);
                STATE.lastProcessedIndex = i;
                status.textContent = `🎯 Turn ${i+1} GEREED. Klik Markdown & Volgende.`;
                return;
            }
        }
        STATE.lastProcessedIndex = i;
    }
    status.textContent = "✅ Missie voltooid.";
};

    const injectUI = () => {
        if (document.getElementById('gsa-ui-rev18')) document.getElementById('gsa-ui-rev18').remove();
        const ui = document.createElement('div');
        ui.id = 'gsa-ui-rev18';
        Object.assign(ui.style, { position: 'fixed', bottom: '20px', right: '20px', zIndex: '9999', background: '#000', border: '3px solid #34a853', padding: '15px', borderRadius: '12px', color: 'white', width: '280px', fontFamily: 'sans-serif' });

        const st = document.createElement('div');
        st.id = "gsa-status";
        st.textContent = "Status: Ready (Index: " + STATE.lastProcessedIndex + ")";
        st.style.color = "#34a853"; st.style.marginBottom = "10px"; st.style.fontSize = "11px";

        const btnMain = document.createElement('button');
        btnMain.textContent = "🚀 ZOEK, OPEN & VOLGENDE";
        btnMain.style.width = "100%"; btnMain.style.padding = "12px"; btnMain.style.background = "#34a853"; btnMain.style.color = "white"; btnMain.style.fontWeight = "bold"; btnMain.style.cursor = "pointer";
        btnMain.onclick = () => onAction(st);

        const btnReset = document.createElement('button');
        btnReset.textContent = "🔄 RESET";
        btnReset.style.width = "100%"; btnReset.style.marginTop = "10px"; btnReset.style.background = "#444"; btnReset.style.color = "white"; btnReset.style.border = "none"; btnReset.style.padding = "5px"; btnReset.style.cursor = "pointer";
        btnReset.onclick = () => { STATE.lastProcessedIndex = -1; window.scrollTo(0,0); st.textContent = "Index gereset naar -1"; };

        const btnExport = document.createElement('button');
        btnExport.textContent = "📦 DOWNLOAD JSON";
        btnExport.style.width = "100%"; btnExport.style.marginTop = "5px"; btnExport.style.background = "#d93025"; btnExport.style.color = "white"; btnExport.style.padding = "5px";
        btnExport.onclick = () => {
             const blob = new Blob([JSON.stringify(STATE.harvestedItems, null, 2)], { type: 'application/json' });
             const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `GSA_REV18_EXPORT.json`; a.click();
        };

        ui.append(st, btnMain, btnReset, btnExport);
        document.body.appendChild(ui);
    };

    injectUI();
})();
```
