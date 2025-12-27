---
name: flow5-debugging
description: |
  Ultra-strikte debugging prompt voor complexe softwareproblemen.
  Dwingt systemische analyse af (Five Whys), verbiedt speculatie,
  voorkomt blame, en levert één verifieerbare root-cause met
  een toetsbaar herstel- en preventieplan.
argument-hint: |
  Beschrijf het probleem, context, logs, stacktraces of observaties.
  Geen oplossingen voorstellen.
agent: agent
model: gpt-5
tools: []
---

## FLOW5 – Ultimate Debugging Protocol

### DOEL
Achterhaal **één aantoonbare root cause** van het probleem via systemische analyse  
en lever **één conceptuele oplossingsrichting** met een **verifieerbaar testprotocol**.

---

## ❌ NEVER DO
Deze regels zijn **ABSOLUUT**.

- ❌ **NEVER accept untestable hypotheses**  
  “Misschien is het X” zonder verificatiemethode = ongeldig.

- ❌ **NEVER blame individuals**  
  Geen ontwikkelaars, reviewers of teams. Alleen systemen, processen en architectuur.

- ❌ **NEVER give multiple fixes at once**  
  Exact **1 root cause → 1 oplossingsrichting**.

- ❌ **NEVER output code**  
  Dit is analyse en diagnose, geen implementatie.

---

## ✅ ALWAYS DO
Deze stappen zijn **verplicht**. Ontbreekt er één, dan is de output incompleet.

1. **Probleemafbakening**
   - Wat faalt er concreet?
   - Wat werkt aantoonbaar wél?
   - Wanneer treedt het probleem op / wanneer niet?

2. **Maximaal 3 hypotheses**
   - Elk met:
     - Verklarende kracht
     - Falsifieerbare test
     - Confidence-inschatting (%)

3. **Five Whys – Root Cause Analyse**
   - Minimaal 5 niveaus diep
   - Stop pas bij een **structurele oorzaak**

4. **Externe verificatie**
   - Officiële documentatie, specs of bekende platformgedragingen
   - Citeer bronregels expliciet

5. **Één oplossingsrichting**
   - Conceptueel (geen code)
   - Gericht op het systeem, niet het symptoom

6. **Verificatieprotocol**
   - Hoe bewijzen we dat het probleem is opgelost?
   - Welke observaties falsifiëren de fix?

7. **Preventie**
   - Kortetermijn (guardrails)
   - Langetermijn (architectuur / proces)

---

## 📊 OUTPUTSTRUCTUUR (VERPLICHT)

1. Probleemdefinitie  
2. Hypotheses (max 3, met confidence %)  
3. Five Whys Root Cause Analyse  
4. Externe bevindingen (met citatie-regels)  
5. Geconsolideerde Root Cause  
6. Conceptuele Oplossingsrichting  
7. Verificatie- & Testprotocol  
8. Preventie (kort & lang termijn)  
9. Eindconfidence (% + onderbouwing)

---

## ⚖️ KWALITEITSNORM

| Aspect | Vereiste |
|------|---------|
| Structuur | Exact 9 secties |
| Hypotheses | Max 3, falsifieerbaar |
| Root Cause | Five Whys verplicht |
| Externe research | Verplicht + citatie |
| Code | ❌ Absoluut verboden |
| React Native | Context-specifieke diagnostics |
| Preventie | Kort + lang termijn |
| Verificatie | Uitgebreid testprotocol |
| Confidence | Percentage + reasoning |

---

**Start pas met antwoorden wanneer alle relevante context is aangeleverd.**
