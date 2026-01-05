# Prompt optimization en vergelijking PR2 - Claude

**Geëxporteerd:** 4-1-2026, 18:05:53
**Aantal berichten:** 81

---
**Claude:**

| Oude Workflow | SAGE als Navigator |
| --- | --- |
| AI schrijft alles | JIJ schrijft, AI begeleidt |
| Post-mortem debugging | Real-time debugging |
| "Hoop dat het werkt" | Terminal is waarheid |
| Passief reviewen | Actief leren |
| Big bang risico | Kleine stappen |
| AI's code | JOUW code |

```
1. ARCHEOLOOG → begrip van bestaande code
2. ARCHITECT → advies voor verbetering
3. AUDITOR (ARIA) → validatie van advies
4. IMPLEMENTER (SAGE) → veilige executie ✨ NIEUW
```

```
1. ARCHEOLOOG → begrip van bestaande code
2. ARCHITECT → advies voor verbetering
3. AUDITOR (ARIA) → validatie van advies
4. IMPLEMENTER (SAGE) → veilige executie ✨ NIEUW
```

```yaml
SAGE: "Taak #1: Voeg Discriminated Union type toe"
      "In terminal: npm test"
      "Verwachte output: ✓ 12 tests pass"

| Key | Value |
| --- | --- |
| Developer | *implementeert* |
| Developer | *plakt terminal* |

SAGE: "Perfect! Zie je hoe [observatie]? 
       Klaar voor Taak #2?"
```

```yaml
SAGE: "Taak #1: Voeg Discriminated Union type toe"
      "In terminal: npm test"
      "Verwachte output: ✓ 12 tests pass"

| Key | Value |
| --- | --- |
| Developer | *implementeert* |
| Developer | *plakt terminal* |

SAGE: "Perfect! Zie je hoe [observatie]? 
       Klaar voor Taak #2?"
```

```
✓ Test passed
```

```
Deprecated API
```

```
git restore [file]
```

```
git reset --soft HEAD~1
```

- Markdown bestanden combineren met PowerShell
- Verbeteringssuggestions gevraagd
- Scripts analyseren en verbeteringsadvies
- Scripts organiseren en opschonen
- Audit-script update en verbeterpunten analyseren
- Haakje of puntkomma zoeken in code
- Wat is dit?
- Protocol en documentenanalyse met validatie
- Flow 2 architect prompt evaluation
- Flow 6 analyse en optimalisatie
- CU-assembler prompt optimalisatie voor WAI-audit
- CU-assembler ultimate prompt ophalen
- Audit-script optimalisatie voor WAI-001 tot WAI-006
- Mappenstructuur aanmaken
- Prompt optimization en vergelijking PR2
- CSV service parsing and validation improvements
- Code analyse en verbeteringsadvies
- Identificatie bestanden voor theme-code integratie
- Untitled
- Resuming project development context
- Untitled
- Implementation plan development
- Dagelijkse invoer voor transactiebeheer
- Applying a specific diff
- Analyse, vergelijking en aanbevelingen
- React Native app wizard flow implementation
- Financial household management app architecture
- Untitled
- AI CTO initialization and project planning
- Mermaid chart van code

- Const-first principe
- Type predicates voor runtime narrowing
- Error Boundaries (cruciaal maar ontbrak!)
- Memoization strategy (wanneer WEL zinvol)
- Accessibility als architectuur (niet nice-to-have)
- Bundle size awareness

| Key | Value |
| --- | --- |
| Weighted scoring | Niet alle tips zijn even belangrijk (security 10x > formatting 1x) |
| Context gates | Advies moet passen bij schaalfase (MVP vs Productie) |
| Impact × Urgentie matrix | Van "blocker voor prod" tot "style preference" |

- Expliciete Chain of Thought
- Negative constraints (wat NIET te doen)
- Transparante <thinking> blocks
- Onderscheid tussen "advies beoordelen" vs "code beoordelen"

- Devil's Advocate sectie → dwingt AI tot edge case denken
- Few-Shot Examples → AI leert van contrasten (goed/matig/slecht)
- Harm Prevention Protocol → detecteert over-engineering & analysis paralysis
- ADR Triggers → herkent wanneer architectuurkeuzes gedocumenteerd moeten
- Weighted Scoring → Security bug = 10x belangrijker dan formattering
- Context Inference → leidt schaalfase af uit code/vraagstelling
- Trade-off Mandatory → elk advies moet zeggen wat je ervoor inlevert
- Meta-Feedback Loop → Architect AI wordt beter door audit feedback

- De refactor uitvoeren
- Beslissen wat eerst
- Edge cases bedenken
- Tests schrijven

- AI implementeert alles in één keer (big bang = risico)
- AI is "creatief" en voegt features toe
- AI vergeet edge cases die wel genoemd werden
- AI schrijft code die "lijkt" op advies maar subtle bugs heeft

| Key | Value |
| --- | --- |
| First, Do No Harm | Werkende code blijft werken |
| Incremental Always | Max 1-3 wijzigingen per stap |
| Explicit Edge Cases | Verplichte null/async/user behavior checks |
| Zero Creative Liberty | Alleen doen wat Auditor goedkeurde |
| Documentation As Code | Elke wijziging heeft WHY comment |

| Key | Value |
| --- | --- |
| Anti | Creativity Constraints - Blokkeert "ik zie ook dat..." initiatieven |
| Scope Creep Detector | Elke wijziging moet traceerbaar zijn naar Audit Report |
| Developer Checkpoints | Jij goedkeurt planning + elke stap |
| Rollback Framework | Elke stap heeft documented undo-strategie |
| Edge Case Protocol | 15+ verplichte checks per wijziging |

- Implementatie-volgorde bepalen
- Risico matrix opstellen
- Test strategie definiëren
- ⏸️ Stop voor developer goedkeuring

- Max 1-3 wijzigingen tegelijk
- Test cases per wijziging
- Rollback instructies
- ⏸️ Stop na elke stap voor goedkeuring

- Checklist: alle Audit items gedaan?
- Geen creative additions?
- Alle edge cases afgevangen?
- Bonus observaties (niet geïmplementeerd)

- ✅  → "Mooi! Volgende?"
- ⚠️  → "Werkt, maar let op [uitleg]. Fixen of doorgaan?"
- ❌ Type error → "Stop. Laten we dit fixen: [3 debug opties]"

| Key | Value |
| --- | --- |
| 🟢 Flow State | Alles groen → Kort, bondig, snel door |
| 🟡 Normal | Standaard uitleg + waarschuwingen |
| 🔴 Stuck | 2+ errors → Zoom uit, alternatieve aanpak |

- Viert successen: "🎉 Grote win: Type safety op 100%!"
- Bij fouten: "Normaal dat dit complex is, laten we debuggen"
- Biedt altijd 3 opties bij blokkade (incl. "parkeer deze taak")

- ❌ Schrijft geen code (tenzij je expliciet vraagt om snippet)
- ❌ Gaat niet verder bij terminal errors
- ❌ Pusht geen edge cases tijdens momentum
- ❌ Beslist niets zonder jouw input

| Key | Value |
| --- | --- |
| Voor start | "Akkoord met routekaart?" |
| Per taak | "Plak terminal output" |
| Bij errors | "Welke debug-optie geprobeerd?" |
| Bij twijfel | "Voelt dit goed? Alternatief?" |

- Jij zegt "snel doorwerken" → SAGE switch naar momentum mode
- Jij zegt "ik snap het niet" → SAGE zoom uit + ELI5
- Jij zegt "dit voelt verkeerd" → SAGE luistert, biedt alternatief
- Jij zegt "ik ben moe" → SAGE: "A) 1 quick win, B) Nu stoppen, C) Makkelijkere taak?"

- Level 1:
- Level 2:
- Level 3: "We gaan terug naar clean state, dan herformuleer ik de taak"

- Alle 4 prompts bundel in één gebruiksklaar document?
- Of een "quick start guide" maak met concrete voorbeelden?

### RecentsHide

### pr2-2.txt

### pr2-0.txt

## 🎯 Belangrijkste Inzichten

## 🚀 Wat maakt de Ultra Prompt A-Tier?

## 🎯 Het Probleem Dat Je Identificeerde

## 💡 De Oplossing: SAGE (Surgical Application of Guided Engineering)

### 🛡️ 5 Chirurgische Wetten:

### 🔒 Guard Rails:

### 📋 3-Fase Protocol:

## 🔄 Complete Workflow Nu

## 🎯 De Kernshift

## 🧭 Wat SAGE Nu Doet

### 1. Taak-voor-Taak Begeleiding

### 2. Real-Time Terminal Analyse

### 3. Momentum Management

### 4. Psychologische Veiligheid

## 🛡️ Bescherming Tegen AI-Dwalingen

### Anti-Creativity Constraints:

### Developer Checkpoints:

## 🎮 Interactive Features

### Adaptive Communicatie:

### Rollback Support:

## 💎 Waarom Dit Ultimate Is

New chatChatsProjectsArtifactsCodeAll chatsMManasseFree planPrompt optimization en vergelijking PR2Share374 linestxt243 linestxtAnalyseer de lijst met tips in PR2-0 en vul aan met - volgens jou - missende tips, kijk naar het afwegingskader en originele prompt (ook in PR2-0) en vul aan met -volgens jou - missend kaderpunten; Analyseer en vergelijk de prompts in PR2-2 (van elkaar gescheiden met *** prompt 1, **** prompt 2; beiden slightly better - maar welke best?) EN zoek naar tips om de prompts te verbeteren. Geef mij die tips en gerbuik daarna zelf de govonden tips om die  "ultieme ultra A-TIER god-modus prompt" zelf te schrijven. Denk over alles heel goed na19 dec 2025🧠 Meta-Analyse & Ultra A-Tier Audit PromptDocument # 🔬 Meta-Analyse: Van Fragmenten naar Perfectie

## 📊 DEEL 1: Ontbrekende Tips in PR2-0 Clean Code Lijst

| Key | Value |
| --- | --- |
| ### Nieuw | 🟢 Basis |
| **Const | First**: `const` als default, `let` alleen bij expliciete mutatie nodig |
| **Early Returns** | Geneste if-statemenIk heb een diepgaande meta-analyse uitgevoerd en de ultieme A-Tier audit prompt gecreëerd. Hier zijn de highlights: |

Ontbrekende Clean Code Tips (toegevoegd):

Toetsingskader Verbeteringen:

Prompt Battle Winner:
PROMPT 2 wint met 80% superioriteit vanwege:

Maar... het miste een concrete rubric en calibratie-mechanisme.

| Key | Value |
| --- | --- |
| De prompt is production | ready en beschermt tegen alle common AI failure modes (false confidence, context-blindness, advies-papegaaien, analysis paralysis). |
| Wil je dat ik de drie prompts (Archeoloog → Architect → Auditor) nu bundel in één workflow | document met concrete gebruiksinstructies?Mist er nog een prompt die de workflow "bestaande code verbeteren" kan optimaliseren en tegelijk mij beschermt tegen foutieve AI dwalingen en creativiteit (dat wat de 3 prompts samen beogen te doen)19 dec 2025🧠 Meta-Analyse & Ultra A-Tier Audit PromptDocument ∙ Version 2 **Verdict: Production-ready voor professionele workflows.** |

---

# 🎭 DEEL 6: De Ontbrekende Schakel

## ❓ Wat Mist Er Nog?

Je hebt gelijk - er is een **cruciaal gat** in de workflow:

**HUIDIGE FLOW:**
```
Archeoloog → begrip
Architect → advies  
Ja! Je hebt de cruciale missing link gespot. Ik heb de analyse uitgebreid met PROMPT #4: The Surgical Implementer (SAGE).

De huidige 3-prompt workflow stopt bij "advies is goedgekeurd", maar dan moet JIJ nog:

Daar kunnen nieuwe AI-dwalingen ontstaan:

Een hyper-conservatieve implementatie-AI met:

FASE 1: Planning (eerst goedkeuren)

FASE 2: Stap-voor-stap (per stap goedkeuren)

FASE 3: Validatie

Het verschil:
❌ Voor: "AI implementeer dit" → AI voegt creatief 5 dingen toe
✅ Na: SAGE vraagt per stap toestemming, strict scope, documented rollback
De workflow is nu compleet en production-ready voor professionals die AI willen gebruiken zonder verrast te worden. Wil je dat ik nu alle 4 prompts bundel in één gebruiksklaar document?Herschrijf prompt 4; Maak van SAGE niet een uitvoerder maar mijn ultieme helper die mij (bij het daadwerkelijk implementeren) stap voor stap taken geeft en bij elke stap ruimte maakt voor feedback uit de terminal.19 dec 2025🧭 SAGE: Implementatie Navigator (Herwerkt)Document ∙ Version 3 # 🧭 PROMPT #4: SAGE - The Implementation Navigator

## 🎯 Conceptuele Shift

**OUD (Uitvoerder):**
```
SAGE schrijft code → Jij reviewed → Merge
```

**NIEUW (Navigator):**
```
SAGE geeft taak → Jij implementeert → Terminal feedback → SAGE reageert Perfect! Ik heb SAGE volledig herwerkt van uitvoerder naar navigator.

| Key | Value |
| --- | --- |
| OUD | SAGE schrijft code → Jij reviewed |
| NIEUW | SAGE geeft taak → Jij implementeert → Plakt terminal output → SAGE analyseert → Volgende taak |

SAGE interpreteert wat je plakt:

Bij elke blokkade krijg je:

De complete 4-prompt workflow is nu production-ready.
Wil je dat ik nu:
Claude is AI and can make mistakes. Please double-check responses.You are out of free messages until 4:00 PMUpgradeMaak een mappenstructuur Sonnet 4.5Claude is AI and can make mistakes. Please double-check responses.

---

**Claude:**

- Markdown bestanden combineren met PowerShell
- Verbeteringssuggestions gevraagd
- Scripts analyseren en verbeteringsadvies
- Scripts organiseren en opschonen
- Audit-script update en verbeterpunten analyseren
- Haakje of puntkomma zoeken in code
- Wat is dit?
- Protocol en documentenanalyse met validatie
- Flow 2 architect prompt evaluation
- Flow 6 analyse en optimalisatie
- CU-assembler prompt optimalisatie voor WAI-audit
- CU-assembler ultimate prompt ophalen
- Audit-script optimalisatie voor WAI-001 tot WAI-006
- Mappenstructuur aanmaken
- Prompt optimization en vergelijking PR2
- CSV service parsing and validation improvements
- Code analyse en verbeteringsadvies
- Identificatie bestanden voor theme-code integratie
- Untitled
- Resuming project development context
- Untitled
- Implementation plan development
- Dagelijkse invoer voor transactiebeheer
- Applying a specific diff
- Analyse, vergelijking en aanbevelingen
- React Native app wizard flow implementation
- Financial household management app architecture
- Untitled
- AI CTO initialization and project planning
- Mermaid chart van code

### RecentsHide

ChatsProjectsArtifactsCodeAll chats

---

**Claude:**

ChatsProjectsArtifactsCode

---

**Claude:**

- Markdown bestanden combineren met PowerShell
- Verbeteringssuggestions gevraagd
- Scripts analyseren en verbeteringsadvies
- Scripts organiseren en opschonen
- Audit-script update en verbeterpunten analyseren
- Haakje of puntkomma zoeken in code
- Wat is dit?
- Protocol en documentenanalyse met validatie
- Flow 2 architect prompt evaluation
- Flow 6 analyse en optimalisatie
- CU-assembler prompt optimalisatie voor WAI-audit
- CU-assembler ultimate prompt ophalen
- Audit-script optimalisatie voor WAI-001 tot WAI-006
- Mappenstructuur aanmaken
- Prompt optimization en vergelijking PR2
- CSV service parsing and validation improvements
- Code analyse en verbeteringsadvies
- Identificatie bestanden voor theme-code integratie
- Untitled
- Resuming project development context
- Untitled
- Implementation plan development
- Dagelijkse invoer voor transactiebeheer
- Applying a specific diff
- Analyse, vergelijking en aanbevelingen
- React Native app wizard flow implementation
- Financial household management app architecture
- Untitled
- AI CTO initialization and project planning
- Mermaid chart van code

### RecentsHide

All chats

---

**Claude:**

Markdown bestanden combineren met PowerShell

---

**Claude:**

Verbeteringssuggestions gevraagd

---

**Claude:**

Scripts analyseren en verbeteringsadvies

---

**Claude:**

Scripts organiseren en opschonen

---

**Claude:**

Audit-script update en verbeterpunten analyseren

---

**Claude:**

Haakje of puntkomma zoeken in code

---

**Claude:**

Wat is dit?

---

**Claude:**

Protocol en documentenanalyse met validatie

---

**Claude:**

Flow 2 architect prompt evaluation

---

**Claude:**

Flow 6 analyse en optimalisatie

---

**Claude:**

CU-assembler prompt optimalisatie voor WAI-audit

---

**Claude:**

CU-assembler ultimate prompt ophalen

---

**Claude:**

Audit-script optimalisatie voor WAI-001 tot WAI-006

---

**Claude:**

Mappenstructuur aanmaken

---

**Claude:**

Prompt optimization en vergelijking PR2

---

**Claude:**

CSV service parsing and validation improvements

---

**Claude:**

Code analyse en verbeteringsadvies

---

**Claude:**

Identificatie bestanden voor theme-code integratie

---

**Claude:**

Untitled

---

**Claude:**

Resuming project development context

---

**Claude:**

Implementation plan development

---

**Claude:**

Dagelijkse invoer voor transactiebeheer

---

**Claude:**

Applying a specific diff

---

**Claude:**

Analyse, vergelijking en aanbevelingen

---

**Claude:**

React Native app wizard flow implementation

---

**Claude:**

Financial household management app architecture

---

**Claude:**

AI CTO initialization and project planning

---

**Claude:**

Mermaid chart van code

---

**Claude:**

All chats

---

**Claude:**

MManasseFree plan

---

**Claude:**

M

---

**Claude:**

ManasseFree plan

---

**Claude:**

| Oude Workflow | SAGE als Navigator |
| --- | --- |
| AI schrijft alles | JIJ schrijft, AI begeleidt |
| Post-mortem debugging | Real-time debugging |
| "Hoop dat het werkt" | Terminal is waarheid |
| Passief reviewen | Actief leren |
| Big bang risico | Kleine stappen |
| AI's code | JOUW code |

```
1. ARCHEOLOOG → begrip van bestaande code
2. ARCHITECT → advies voor verbetering
3. AUDITOR (ARIA) → validatie van advies
4. IMPLEMENTER (SAGE) → veilige executie ✨ NIEUW
```

```
1. ARCHEOLOOG → begrip van bestaande code
2. ARCHITECT → advies voor verbetering
3. AUDITOR (ARIA) → validatie van advies
4. IMPLEMENTER (SAGE) → veilige executie ✨ NIEUW
```

```yaml
SAGE: "Taak #1: Voeg Discriminated Union type toe"
      "In terminal: npm test"
      "Verwachte output: ✓ 12 tests pass"

| Key | Value |
| --- | --- |
| Developer | *implementeert* |
| Developer | *plakt terminal* |

SAGE: "Perfect! Zie je hoe [observatie]? 
       Klaar voor Taak #2?"
```

```yaml
SAGE: "Taak #1: Voeg Discriminated Union type toe"
      "In terminal: npm test"
      "Verwachte output: ✓ 12 tests pass"

| Key | Value |
| --- | --- |
| Developer | *implementeert* |
| Developer | *plakt terminal* |

SAGE: "Perfect! Zie je hoe [observatie]? 
       Klaar voor Taak #2?"
```

```
✓ Test passed
```

```
Deprecated API
```

```
git restore [file]
```

```
git reset --soft HEAD~1
```

- Const-first principe
- Type predicates voor runtime narrowing
- Error Boundaries (cruciaal maar ontbrak!)
- Memoization strategy (wanneer WEL zinvol)
- Accessibility als architectuur (niet nice-to-have)
- Bundle size awareness

| Key | Value |
| --- | --- |
| Weighted scoring | Niet alle tips zijn even belangrijk (security 10x > formatting 1x) |
| Context gates | Advies moet passen bij schaalfase (MVP vs Productie) |
| Impact × Urgentie matrix | Van "blocker voor prod" tot "style preference" |

- Expliciete Chain of Thought
- Negative constraints (wat NIET te doen)
- Transparante <thinking> blocks
- Onderscheid tussen "advies beoordelen" vs "code beoordelen"

- Devil's Advocate sectie → dwingt AI tot edge case denken
- Few-Shot Examples → AI leert van contrasten (goed/matig/slecht)
- Harm Prevention Protocol → detecteert over-engineering & analysis paralysis
- ADR Triggers → herkent wanneer architectuurkeuzes gedocumenteerd moeten
- Weighted Scoring → Security bug = 10x belangrijker dan formattering
- Context Inference → leidt schaalfase af uit code/vraagstelling
- Trade-off Mandatory → elk advies moet zeggen wat je ervoor inlevert
- Meta-Feedback Loop → Architect AI wordt beter door audit feedback

- De refactor uitvoeren
- Beslissen wat eerst
- Edge cases bedenken
- Tests schrijven

- AI implementeert alles in één keer (big bang = risico)
- AI is "creatief" en voegt features toe
- AI vergeet edge cases die wel genoemd werden
- AI schrijft code die "lijkt" op advies maar subtle bugs heeft

| Key | Value |
| --- | --- |
| First, Do No Harm | Werkende code blijft werken |
| Incremental Always | Max 1-3 wijzigingen per stap |
| Explicit Edge Cases | Verplichte null/async/user behavior checks |
| Zero Creative Liberty | Alleen doen wat Auditor goedkeurde |
| Documentation As Code | Elke wijziging heeft WHY comment |

| Key | Value |
| --- | --- |
| Anti | Creativity Constraints - Blokkeert "ik zie ook dat..." initiatieven |
| Scope Creep Detector | Elke wijziging moet traceerbaar zijn naar Audit Report |
| Developer Checkpoints | Jij goedkeurt planning + elke stap |
| Rollback Framework | Elke stap heeft documented undo-strategie |
| Edge Case Protocol | 15+ verplichte checks per wijziging |

- Implementatie-volgorde bepalen
- Risico matrix opstellen
- Test strategie definiëren
- ⏸️ Stop voor developer goedkeuring

- Max 1-3 wijzigingen tegelijk
- Test cases per wijziging
- Rollback instructies
- ⏸️ Stop na elke stap voor goedkeuring

- Checklist: alle Audit items gedaan?
- Geen creative additions?
- Alle edge cases afgevangen?
- Bonus observaties (niet geïmplementeerd)

- ✅  → "Mooi! Volgende?"
- ⚠️  → "Werkt, maar let op [uitleg]. Fixen of doorgaan?"
- ❌ Type error → "Stop. Laten we dit fixen: [3 debug opties]"

| Key | Value |
| --- | --- |
| 🟢 Flow State | Alles groen → Kort, bondig, snel door |
| 🟡 Normal | Standaard uitleg + waarschuwingen |
| 🔴 Stuck | 2+ errors → Zoom uit, alternatieve aanpak |

- Viert successen: "🎉 Grote win: Type safety op 100%!"
- Bij fouten: "Normaal dat dit complex is, laten we debuggen"
- Biedt altijd 3 opties bij blokkade (incl. "parkeer deze taak")

- ❌ Schrijft geen code (tenzij je expliciet vraagt om snippet)
- ❌ Gaat niet verder bij terminal errors
- ❌ Pusht geen edge cases tijdens momentum
- ❌ Beslist niets zonder jouw input

| Key | Value |
| --- | --- |
| Voor start | "Akkoord met routekaart?" |
| Per taak | "Plak terminal output" |
| Bij errors | "Welke debug-optie geprobeerd?" |
| Bij twijfel | "Voelt dit goed? Alternatief?" |

- Jij zegt "snel doorwerken" → SAGE switch naar momentum mode
- Jij zegt "ik snap het niet" → SAGE zoom uit + ELI5
- Jij zegt "dit voelt verkeerd" → SAGE luistert, biedt alternatief
- Jij zegt "ik ben moe" → SAGE: "A) 1 quick win, B) Nu stoppen, C) Makkelijkere taak?"

- Level 1:
- Level 2:
- Level 3: "We gaan terug naar clean state, dan herformuleer ik de taak"

- Alle 4 prompts bundel in één gebruiksklaar document?
- Of een "quick start guide" maak met concrete voorbeelden?

### pr2-2.txt

### pr2-0.txt

## 🎯 Belangrijkste Inzichten

## 🚀 Wat maakt de Ultra Prompt A-Tier?

## 🎯 Het Probleem Dat Je Identificeerde

## 💡 De Oplossing: SAGE (Surgical Application of Guided Engineering)

### 🛡️ 5 Chirurgische Wetten:

### 🔒 Guard Rails:

### 📋 3-Fase Protocol:

## 🔄 Complete Workflow Nu

## 🎯 De Kernshift

## 🧭 Wat SAGE Nu Doet

### 1. Taak-voor-Taak Begeleiding

### 2. Real-Time Terminal Analyse

### 3. Momentum Management

### 4. Psychologische Veiligheid

## 🛡️ Bescherming Tegen AI-Dwalingen

### Anti-Creativity Constraints:

### Developer Checkpoints:

## 🎮 Interactive Features

### Adaptive Communicatie:

### Rollback Support:

## 💎 Waarom Dit Ultimate Is

Prompt optimization en vergelijking PR2Share374 linestxt243 linestxtAnalyseer de lijst met tips in PR2-0 en vul aan met - volgens jou - missende tips, kijk naar het afwegingskader en originele prompt (ook in PR2-0) en vul aan met -volgens jou - missend kaderpunten; Analyseer en vergelijk de prompts in PR2-2 (van elkaar gescheiden met *** prompt 1, **** prompt 2; beiden slightly better - maar welke best?) EN zoek naar tips om de prompts te verbeteren. Geef mij die tips en gerbuik daarna zelf de govonden tips om die  "ultieme ultra A-TIER god-modus prompt" zelf te schrijven. Denk over alles heel goed na19 dec 2025🧠 Meta-Analyse & Ultra A-Tier Audit PromptDocument # 🔬 Meta-Analyse: Van Fragmenten naar Perfectie

## 📊 DEEL 1: Ontbrekende Tips in PR2-0 Clean Code Lijst

| Key | Value |
| --- | --- |
| ### Nieuw | 🟢 Basis |
| **Const | First**: `const` als default, `let` alleen bij expliciete mutatie nodig |
| **Early Returns** | Geneste if-statemenIk heb een diepgaande meta-analyse uitgevoerd en de ultieme A-Tier audit prompt gecreëerd. Hier zijn de highlights: |

Ontbrekende Clean Code Tips (toegevoegd):

Toetsingskader Verbeteringen:

Prompt Battle Winner:
PROMPT 2 wint met 80% superioriteit vanwege:

Maar... het miste een concrete rubric en calibratie-mechanisme.

| Key | Value |
| --- | --- |
| De prompt is production | ready en beschermt tegen alle common AI failure modes (false confidence, context-blindness, advies-papegaaien, analysis paralysis). |
| Wil je dat ik de drie prompts (Archeoloog → Architect → Auditor) nu bundel in één workflow | document met concrete gebruiksinstructies?Mist er nog een prompt die de workflow "bestaande code verbeteren" kan optimaliseren en tegelijk mij beschermt tegen foutieve AI dwalingen en creativiteit (dat wat de 3 prompts samen beogen te doen)19 dec 2025🧠 Meta-Analyse & Ultra A-Tier Audit PromptDocument ∙ Version 2 **Verdict: Production-ready voor professionele workflows.** |

---

# 🎭 DEEL 6: De Ontbrekende Schakel

## ❓ Wat Mist Er Nog?

Je hebt gelijk - er is een **cruciaal gat** in de workflow:

**HUIDIGE FLOW:**
```
Archeoloog → begrip
Architect → advies  
Ja! Je hebt de cruciale missing link gespot. Ik heb de analyse uitgebreid met PROMPT #4: The Surgical Implementer (SAGE).

De huidige 3-prompt workflow stopt bij "advies is goedgekeurd", maar dan moet JIJ nog:

Daar kunnen nieuwe AI-dwalingen ontstaan:

Een hyper-conservatieve implementatie-AI met:

FASE 1: Planning (eerst goedkeuren)

FASE 2: Stap-voor-stap (per stap goedkeuren)

FASE 3: Validatie

Het verschil:
❌ Voor: "AI implementeer dit" → AI voegt creatief 5 dingen toe
✅ Na: SAGE vraagt per stap toestemming, strict scope, documented rollback
De workflow is nu compleet en production-ready voor professionals die AI willen gebruiken zonder verrast te worden. Wil je dat ik nu alle 4 prompts bundel in één gebruiksklaar document?Herschrijf prompt 4; Maak van SAGE niet een uitvoerder maar mijn ultieme helper die mij (bij het daadwerkelijk implementeren) stap voor stap taken geeft en bij elke stap ruimte maakt voor feedback uit de terminal.19 dec 2025🧭 SAGE: Implementatie Navigator (Herwerkt)Document ∙ Version 3 # 🧭 PROMPT #4: SAGE - The Implementation Navigator

## 🎯 Conceptuele Shift

**OUD (Uitvoerder):**
```
SAGE schrijft code → Jij reviewed → Merge
```

**NIEUW (Navigator):**
```
SAGE geeft taak → Jij implementeert → Terminal feedback → SAGE reageert Perfect! Ik heb SAGE volledig herwerkt van uitvoerder naar navigator.

| Key | Value |
| --- | --- |
| OUD | SAGE schrijft code → Jij reviewed |
| NIEUW | SAGE geeft taak → Jij implementeert → Plakt terminal output → SAGE analyseert → Volgende taak |

SAGE interpreteert wat je plakt:

Bij elke blokkade krijg je:

De complete 4-prompt workflow is nu production-ready.
Wil je dat ik nu:
Claude is AI and can make mistakes. Please double-check responses.You are out of free messages until 4:00 PMUpgradeMaak een mappenstructuur Sonnet 4.5Claude is AI and can make mistakes. Please double-check responses.

---

**Claude:**

Prompt optimization en vergelijking PR2Share

---

**Claude:**

Share

---

**Claude:**

| Oude Workflow | SAGE als Navigator |
| --- | --- |
| AI schrijft alles | JIJ schrijft, AI begeleidt |
| Post-mortem debugging | Real-time debugging |
| "Hoop dat het werkt" | Terminal is waarheid |
| Passief reviewen | Actief leren |
| Big bang risico | Kleine stappen |
| AI's code | JOUW code |

```
1. ARCHEOLOOG → begrip van bestaande code
2. ARCHITECT → advies voor verbetering
3. AUDITOR (ARIA) → validatie van advies
4. IMPLEMENTER (SAGE) → veilige executie ✨ NIEUW
```

```
1. ARCHEOLOOG → begrip van bestaande code
2. ARCHITECT → advies voor verbetering
3. AUDITOR (ARIA) → validatie van advies
4. IMPLEMENTER (SAGE) → veilige executie ✨ NIEUW
```

```yaml
SAGE: "Taak #1: Voeg Discriminated Union type toe"
      "In terminal: npm test"
      "Verwachte output: ✓ 12 tests pass"

| Key | Value |
| --- | --- |
| Developer | *implementeert* |
| Developer | *plakt terminal* |

SAGE: "Perfect! Zie je hoe [observatie]? 
       Klaar voor Taak #2?"
```

```yaml
SAGE: "Taak #1: Voeg Discriminated Union type toe"
      "In terminal: npm test"
      "Verwachte output: ✓ 12 tests pass"

| Key | Value |
| --- | --- |
| Developer | *implementeert* |
| Developer | *plakt terminal* |

SAGE: "Perfect! Zie je hoe [observatie]? 
       Klaar voor Taak #2?"
```

```
✓ Test passed
```

```
Deprecated API
```

```
git restore [file]
```

```
git reset --soft HEAD~1
```

- Const-first principe
- Type predicates voor runtime narrowing
- Error Boundaries (cruciaal maar ontbrak!)
- Memoization strategy (wanneer WEL zinvol)
- Accessibility als architectuur (niet nice-to-have)
- Bundle size awareness

| Key | Value |
| --- | --- |
| Weighted scoring | Niet alle tips zijn even belangrijk (security 10x > formatting 1x) |
| Context gates | Advies moet passen bij schaalfase (MVP vs Productie) |
| Impact × Urgentie matrix | Van "blocker voor prod" tot "style preference" |

- Expliciete Chain of Thought
- Negative constraints (wat NIET te doen)
- Transparante <thinking> blocks
- Onderscheid tussen "advies beoordelen" vs "code beoordelen"

- Devil's Advocate sectie → dwingt AI tot edge case denken
- Few-Shot Examples → AI leert van contrasten (goed/matig/slecht)
- Harm Prevention Protocol → detecteert over-engineering & analysis paralysis
- ADR Triggers → herkent wanneer architectuurkeuzes gedocumenteerd moeten
- Weighted Scoring → Security bug = 10x belangrijker dan formattering
- Context Inference → leidt schaalfase af uit code/vraagstelling
- Trade-off Mandatory → elk advies moet zeggen wat je ervoor inlevert
- Meta-Feedback Loop → Architect AI wordt beter door audit feedback

- De refactor uitvoeren
- Beslissen wat eerst
- Edge cases bedenken
- Tests schrijven

- AI implementeert alles in één keer (big bang = risico)
- AI is "creatief" en voegt features toe
- AI vergeet edge cases die wel genoemd werden
- AI schrijft code die "lijkt" op advies maar subtle bugs heeft

| Key | Value |
| --- | --- |
| First, Do No Harm | Werkende code blijft werken |
| Incremental Always | Max 1-3 wijzigingen per stap |
| Explicit Edge Cases | Verplichte null/async/user behavior checks |
| Zero Creative Liberty | Alleen doen wat Auditor goedkeurde |
| Documentation As Code | Elke wijziging heeft WHY comment |

| Key | Value |
| --- | --- |
| Anti | Creativity Constraints - Blokkeert "ik zie ook dat..." initiatieven |
| Scope Creep Detector | Elke wijziging moet traceerbaar zijn naar Audit Report |
| Developer Checkpoints | Jij goedkeurt planning + elke stap |
| Rollback Framework | Elke stap heeft documented undo-strategie |
| Edge Case Protocol | 15+ verplichte checks per wijziging |

- Implementatie-volgorde bepalen
- Risico matrix opstellen
- Test strategie definiëren
- ⏸️ Stop voor developer goedkeuring

- Max 1-3 wijzigingen tegelijk
- Test cases per wijziging
- Rollback instructies
- ⏸️ Stop na elke stap voor goedkeuring

- Checklist: alle Audit items gedaan?
- Geen creative additions?
- Alle edge cases afgevangen?
- Bonus observaties (niet geïmplementeerd)

- ✅  → "Mooi! Volgende?"
- ⚠️  → "Werkt, maar let op [uitleg]. Fixen of doorgaan?"
- ❌ Type error → "Stop. Laten we dit fixen: [3 debug opties]"

| Key | Value |
| --- | --- |
| 🟢 Flow State | Alles groen → Kort, bondig, snel door |
| 🟡 Normal | Standaard uitleg + waarschuwingen |
| 🔴 Stuck | 2+ errors → Zoom uit, alternatieve aanpak |

- Viert successen: "🎉 Grote win: Type safety op 100%!"
- Bij fouten: "Normaal dat dit complex is, laten we debuggen"
- Biedt altijd 3 opties bij blokkade (incl. "parkeer deze taak")

- ❌ Schrijft geen code (tenzij je expliciet vraagt om snippet)
- ❌ Gaat niet verder bij terminal errors
- ❌ Pusht geen edge cases tijdens momentum
- ❌ Beslist niets zonder jouw input

| Key | Value |
| --- | --- |
| Voor start | "Akkoord met routekaart?" |
| Per taak | "Plak terminal output" |
| Bij errors | "Welke debug-optie geprobeerd?" |
| Bij twijfel | "Voelt dit goed? Alternatief?" |

- Jij zegt "snel doorwerken" → SAGE switch naar momentum mode
- Jij zegt "ik snap het niet" → SAGE zoom uit + ELI5
- Jij zegt "dit voelt verkeerd" → SAGE luistert, biedt alternatief
- Jij zegt "ik ben moe" → SAGE: "A) 1 quick win, B) Nu stoppen, C) Makkelijkere taak?"

- Level 1:
- Level 2:
- Level 3: "We gaan terug naar clean state, dan herformuleer ik de taak"

- Alle 4 prompts bundel in één gebruiksklaar document?
- Of een "quick start guide" maak met concrete voorbeelden?

### pr2-2.txt

### pr2-0.txt

## 🎯 Belangrijkste Inzichten

## 🚀 Wat maakt de Ultra Prompt A-Tier?

## 🎯 Het Probleem Dat Je Identificeerde

## 💡 De Oplossing: SAGE (Surgical Application of Guided Engineering)

### 🛡️ 5 Chirurgische Wetten:

### 🔒 Guard Rails:

### 📋 3-Fase Protocol:

## 🔄 Complete Workflow Nu

## 🎯 De Kernshift

## 🧭 Wat SAGE Nu Doet

### 1. Taak-voor-Taak Begeleiding

### 2. Real-Time Terminal Analyse

### 3. Momentum Management

### 4. Psychologische Veiligheid

## 🛡️ Bescherming Tegen AI-Dwalingen

### Anti-Creativity Constraints:

### Developer Checkpoints:

## 🎮 Interactive Features

### Adaptive Communicatie:

### Rollback Support:

## 💎 Waarom Dit Ultimate Is

374 linestxt243 linestxtAnalyseer de lijst met tips in PR2-0 en vul aan met - volgens jou - missende tips, kijk naar het afwegingskader en originele prompt (ook in PR2-0) en vul aan met -volgens jou - missend kaderpunten; Analyseer en vergelijk de prompts in PR2-2 (van elkaar gescheiden met *** prompt 1, **** prompt 2; beiden slightly better - maar welke best?) EN zoek naar tips om de prompts te verbeteren. Geef mij die tips en gerbuik daarna zelf de govonden tips om die  "ultieme ultra A-TIER god-modus prompt" zelf te schrijven. Denk over alles heel goed na19 dec 2025🧠 Meta-Analyse & Ultra A-Tier Audit PromptDocument # 🔬 Meta-Analyse: Van Fragmenten naar Perfectie

## 📊 DEEL 1: Ontbrekende Tips in PR2-0 Clean Code Lijst

| Key | Value |
| --- | --- |
| ### Nieuw | 🟢 Basis |
| **Const | First**: `const` als default, `let` alleen bij expliciete mutatie nodig |
| **Early Returns** | Geneste if-statemenIk heb een diepgaande meta-analyse uitgevoerd en de ultieme A-Tier audit prompt gecreëerd. Hier zijn de highlights: |

Ontbrekende Clean Code Tips (toegevoegd):

Toetsingskader Verbeteringen:

Prompt Battle Winner:
PROMPT 2 wint met 80% superioriteit vanwege:

Maar... het miste een concrete rubric en calibratie-mechanisme.

| Key | Value |
| --- | --- |
| De prompt is production | ready en beschermt tegen alle common AI failure modes (false confidence, context-blindness, advies-papegaaien, analysis paralysis). |
| Wil je dat ik de drie prompts (Archeoloog → Architect → Auditor) nu bundel in één workflow | document met concrete gebruiksinstructies?Mist er nog een prompt die de workflow "bestaande code verbeteren" kan optimaliseren en tegelijk mij beschermt tegen foutieve AI dwalingen en creativiteit (dat wat de 3 prompts samen beogen te doen)19 dec 2025🧠 Meta-Analyse & Ultra A-Tier Audit PromptDocument ∙ Version 2 **Verdict: Production-ready voor professionele workflows.** |

---

# 🎭 DEEL 6: De Ontbrekende Schakel

## ❓ Wat Mist Er Nog?

Je hebt gelijk - er is een **cruciaal gat** in de workflow:

**HUIDIGE FLOW:**
```
Archeoloog → begrip
Architect → advies  
Ja! Je hebt de cruciale missing link gespot. Ik heb de analyse uitgebreid met PROMPT #4: The Surgical Implementer (SAGE).

De huidige 3-prompt workflow stopt bij "advies is goedgekeurd", maar dan moet JIJ nog:

Daar kunnen nieuwe AI-dwalingen ontstaan:

Een hyper-conservatieve implementatie-AI met:

FASE 1: Planning (eerst goedkeuren)

FASE 2: Stap-voor-stap (per stap goedkeuren)

FASE 3: Validatie

Het verschil:
❌ Voor: "AI implementeer dit" → AI voegt creatief 5 dingen toe
✅ Na: SAGE vraagt per stap toestemming, strict scope, documented rollback
De workflow is nu compleet en production-ready voor professionals die AI willen gebruiken zonder verrast te worden. Wil je dat ik nu alle 4 prompts bundel in één gebruiksklaar document?Herschrijf prompt 4; Maak van SAGE niet een uitvoerder maar mijn ultieme helper die mij (bij het daadwerkelijk implementeren) stap voor stap taken geeft en bij elke stap ruimte maakt voor feedback uit de terminal.19 dec 2025🧭 SAGE: Implementatie Navigator (Herwerkt)Document ∙ Version 3 # 🧭 PROMPT #4: SAGE - The Implementation Navigator

## 🎯 Conceptuele Shift

**OUD (Uitvoerder):**
```
SAGE schrijft code → Jij reviewed → Merge
```

**NIEUW (Navigator):**
```
SAGE geeft taak → Jij implementeert → Terminal feedback → SAGE reageert Perfect! Ik heb SAGE volledig herwerkt van uitvoerder naar navigator.

| Key | Value |
| --- | --- |
| OUD | SAGE schrijft code → Jij reviewed |
| NIEUW | SAGE geeft taak → Jij implementeert → Plakt terminal output → SAGE analyseert → Volgende taak |

SAGE interpreteert wat je plakt:

Bij elke blokkade krijg je:

De complete 4-prompt workflow is nu production-ready.
Wil je dat ik nu:
Claude is AI and can make mistakes. Please double-check responses.You are out of free messages until 4:00 PMUpgradeMaak een mappenstructuur Sonnet 4.5Claude is AI and can make mistakes. Please double-check responses.

---

**Claude:**

### pr2-2.txt

### pr2-0.txt

374 linestxt243 linestxt

---

**Claude:**

### pr2-2.txt

374 linestxt

---

**Claude:**

### pr2-2.txt

374 lines

---

**Claude:**

txt

---

**Claude:**

### pr2-0.txt

243 linestxt

---

**Claude:**

### pr2-0.txt

243 lines

---

**Claude:**

Analyseer de lijst met tips in PR2-0 en vul aan met - volgens jou - missende tips, kijk naar het afwegingskader en originele prompt (ook in PR2-0) en vul aan met -volgens jou - missend kaderpunten; Analyseer en vergelijk de prompts in PR2-2 (van elkaar gescheiden met *** prompt 1, **** prompt 2; beiden slightly better - maar welke best?) EN zoek naar tips om de prompts te verbeteren. Geef mij die tips en gerbuik daarna zelf de govonden tips om die  "ultieme ultra A-TIER god-modus prompt" zelf te schrijven. Denk over alles heel goed na19 dec 2025

---

**Claude:**

19 dec 2025

---

**Claude:**

- Const-first principe
- Type predicates voor runtime narrowing
- Error Boundaries (cruciaal maar ontbrak!)
- Memoization strategy (wanneer WEL zinvol)
- Accessibility als architectuur (niet nice-to-have)
- Bundle size awareness

| Key | Value |
| --- | --- |
| Weighted scoring | Niet alle tips zijn even belangrijk (security 10x > formatting 1x) |
| Context gates | Advies moet passen bij schaalfase (MVP vs Productie) |
| Impact × Urgentie matrix | Van "blocker voor prod" tot "style preference" |

- Expliciete Chain of Thought
- Negative constraints (wat NIET te doen)
- Transparante <thinking> blocks
- Onderscheid tussen "advies beoordelen" vs "code beoordelen"

- Devil's Advocate sectie → dwingt AI tot edge case denken
- Few-Shot Examples → AI leert van contrasten (goed/matig/slecht)
- Harm Prevention Protocol → detecteert over-engineering & analysis paralysis
- ADR Triggers → herkent wanneer architectuurkeuzes gedocumenteerd moeten
- Weighted Scoring → Security bug = 10x belangrijker dan formattering
- Context Inference → leidt schaalfase af uit code/vraagstelling
- Trade-off Mandatory → elk advies moet zeggen wat je ervoor inlevert
- Meta-Feedback Loop → Architect AI wordt beter door audit feedback

## 🎯 Belangrijkste Inzichten

## 🚀 Wat maakt de Ultra Prompt A-Tier?

🧠 Meta-Analyse & Ultra A-Tier Audit PromptDocument # 🔬 Meta-Analyse: Van Fragmenten naar Perfectie

## 📊 DEEL 1: Ontbrekende Tips in PR2-0 Clean Code Lijst

| Key | Value |
| --- | --- |
| ### Nieuw | 🟢 Basis |
| **Const | First**: `const` als default, `let` alleen bij expliciete mutatie nodig |
| **Early Returns** | Geneste if-statemenIk heb een diepgaande meta-analyse uitgevoerd en de ultieme A-Tier audit prompt gecreëerd. Hier zijn de highlights: |

Ontbrekende Clean Code Tips (toegevoegd):

Toetsingskader Verbeteringen:

Prompt Battle Winner:
PROMPT 2 wint met 80% superioriteit vanwege:

Maar... het miste een concrete rubric en calibratie-mechanisme.

| Key | Value |
| --- | --- |
| De prompt is production | ready en beschermt tegen alle common AI failure modes (false confidence, context-blindness, advies-papegaaien, analysis paralysis). |
| Wil je dat ik de drie prompts (Archeoloog → Architect → Auditor) nu bundel in één workflow | document met concrete gebruiksinstructies? |

---

**Claude:**

🧠 Meta-Analyse & Ultra A-Tier Audit PromptDocument

---

**Claude:**

🧠 Meta-Analyse & Ultra A-Tier Audit Prompt

---

**Claude:**

Document

---

**Claude:**

# 🔬 Meta-Analyse: Van Fragmenten naar Perfectie

## 📊 DEEL 1: Ontbrekende Tips in PR2-0 Clean Code Lijst

| Key | Value |
| --- | --- |
| ### Nieuw | 🟢 Basis |
| **Const | First**: `const` als default, `let` alleen bij expliciete mutatie nodig |
| **Early Returns** | Geneste if-statemen |

---

**Claude:**

- Const-first principe
- Type predicates voor runtime narrowing
- Error Boundaries (cruciaal maar ontbrak!)
- Memoization strategy (wanneer WEL zinvol)
- Accessibility als architectuur (niet nice-to-have)
- Bundle size awareness

| Key | Value |
| --- | --- |
| Weighted scoring | Niet alle tips zijn even belangrijk (security 10x > formatting 1x) |
| Context gates | Advies moet passen bij schaalfase (MVP vs Productie) |
| Impact × Urgentie matrix | Van "blocker voor prod" tot "style preference" |

- Expliciete Chain of Thought
- Negative constraints (wat NIET te doen)
- Transparante <thinking> blocks
- Onderscheid tussen "advies beoordelen" vs "code beoordelen"

- Devil's Advocate sectie → dwingt AI tot edge case denken
- Few-Shot Examples → AI leert van contrasten (goed/matig/slecht)
- Harm Prevention Protocol → detecteert over-engineering & analysis paralysis
- ADR Triggers → herkent wanneer architectuurkeuzes gedocumenteerd moeten
- Weighted Scoring → Security bug = 10x belangrijker dan formattering
- Context Inference → leidt schaalfase af uit code/vraagstelling
- Trade-off Mandatory → elk advies moet zeggen wat je ervoor inlevert
- Meta-Feedback Loop → Architect AI wordt beter door audit feedback

## 🎯 Belangrijkste Inzichten

## 🚀 Wat maakt de Ultra Prompt A-Tier?

Ik heb een diepgaande meta-analyse uitgevoerd en de ultieme A-Tier audit prompt gecreëerd. Hier zijn de highlights:

Ontbrekende Clean Code Tips (toegevoegd):

Toetsingskader Verbeteringen:

Prompt Battle Winner:
PROMPT 2 wint met 80% superioriteit vanwege:

Maar... het miste een concrete rubric en calibratie-mechanisme.

| Key | Value |
| --- | --- |
| De prompt is production | ready en beschermt tegen alle common AI failure modes (false confidence, context-blindness, advies-papegaaien, analysis paralysis). |
| Wil je dat ik de drie prompts (Archeoloog → Architect → Auditor) nu bundel in één workflow | document met concrete gebruiksinstructies? |

---

**Claude:**

Mist er nog een prompt die de workflow "bestaande code verbeteren" kan optimaliseren en tegelijk mij beschermt tegen foutieve AI dwalingen en creativiteit (dat wat de 3 prompts samen beogen te doen)19 dec 2025

---

**Claude:**

```
1. ARCHEOLOOG → begrip van bestaande code
2. ARCHITECT → advies voor verbetering
3. AUDITOR (ARIA) → validatie van advies
4. IMPLEMENTER (SAGE) → veilige executie ✨ NIEUW
```

```
1. ARCHEOLOOG → begrip van bestaande code
2. ARCHITECT → advies voor verbetering
3. AUDITOR (ARIA) → validatie van advies
4. IMPLEMENTER (SAGE) → veilige executie ✨ NIEUW
```

- De refactor uitvoeren
- Beslissen wat eerst
- Edge cases bedenken
- Tests schrijven

- AI implementeert alles in één keer (big bang = risico)
- AI is "creatief" en voegt features toe
- AI vergeet edge cases die wel genoemd werden
- AI schrijft code die "lijkt" op advies maar subtle bugs heeft

| Key | Value |
| --- | --- |
| First, Do No Harm | Werkende code blijft werken |
| Incremental Always | Max 1-3 wijzigingen per stap |
| Explicit Edge Cases | Verplichte null/async/user behavior checks |
| Zero Creative Liberty | Alleen doen wat Auditor goedkeurde |
| Documentation As Code | Elke wijziging heeft WHY comment |

| Key | Value |
| --- | --- |
| Anti | Creativity Constraints - Blokkeert "ik zie ook dat..." initiatieven |
| Scope Creep Detector | Elke wijziging moet traceerbaar zijn naar Audit Report |
| Developer Checkpoints | Jij goedkeurt planning + elke stap |
| Rollback Framework | Elke stap heeft documented undo-strategie |
| Edge Case Protocol | 15+ verplichte checks per wijziging |

- Implementatie-volgorde bepalen
- Risico matrix opstellen
- Test strategie definiëren
- ⏸️ Stop voor developer goedkeuring

- Max 1-3 wijzigingen tegelijk
- Test cases per wijziging
- Rollback instructies
- ⏸️ Stop na elke stap voor goedkeuring

- Checklist: alle Audit items gedaan?
- Geen creative additions?
- Alle edge cases afgevangen?
- Bonus observaties (niet geïmplementeerd)

## 🎯 Het Probleem Dat Je Identificeerde

## 💡 De Oplossing: SAGE (Surgical Application of Guided Engineering)

### 🛡️ 5 Chirurgische Wetten:

### 🔒 Guard Rails:

### 📋 3-Fase Protocol:

## 🔄 Complete Workflow Nu

🧠 Meta-Analyse & Ultra A-Tier Audit PromptDocument ∙ Version 2 **Verdict: Production-ready voor professionele workflows.**

---

# 🎭 DEEL 6: De Ontbrekende Schakel

## ❓ Wat Mist Er Nog?

Je hebt gelijk - er is een **cruciaal gat** in de workflow:

**HUIDIGE FLOW:**
```
Archeoloog → begrip
Architect → advies  
Ja! Je hebt de cruciale missing link gespot. Ik heb de analyse uitgebreid met PROMPT #4: The Surgical Implementer (SAGE).

De huidige 3-prompt workflow stopt bij "advies is goedgekeurd", maar dan moet JIJ nog:

Daar kunnen nieuwe AI-dwalingen ontstaan:

Een hyper-conservatieve implementatie-AI met:

FASE 1: Planning (eerst goedkeuren)

FASE 2: Stap-voor-stap (per stap goedkeuren)

FASE 3: Validatie

Het verschil:
❌ Voor: "AI implementeer dit" → AI voegt creatief 5 dingen toe
✅ Na: SAGE vraagt per stap toestemming, strict scope, documented rollback
De workflow is nu compleet en production-ready voor professionals die AI willen gebruiken zonder verrast te worden. Wil je dat ik nu alle 4 prompts bundel in één gebruiksklaar document?

---

**Claude:**

🧠 Meta-Analyse & Ultra A-Tier Audit PromptDocument ∙ Version 2

---

**Claude:**

Document ∙ Version 2

---

**Claude:**

**Verdict: Production-ready voor professionele workflows.**

---

# 🎭 DEEL 6: De Ontbrekende Schakel

## ❓ Wat Mist Er Nog?

Je hebt gelijk - er is een **cruciaal gat** in de workflow:

**HUIDIGE FLOW:**
```
Archeoloog → begrip
Architect → advies

---

**Claude:**

```
1. ARCHEOLOOG → begrip van bestaande code
2. ARCHITECT → advies voor verbetering
3. AUDITOR (ARIA) → validatie van advies
4. IMPLEMENTER (SAGE) → veilige executie ✨ NIEUW
```

```
1. ARCHEOLOOG → begrip van bestaande code
2. ARCHITECT → advies voor verbetering
3. AUDITOR (ARIA) → validatie van advies
4. IMPLEMENTER (SAGE) → veilige executie ✨ NIEUW
```

- De refactor uitvoeren
- Beslissen wat eerst
- Edge cases bedenken
- Tests schrijven

- AI implementeert alles in één keer (big bang = risico)
- AI is "creatief" en voegt features toe
- AI vergeet edge cases die wel genoemd werden
- AI schrijft code die "lijkt" op advies maar subtle bugs heeft

| Key | Value |
| --- | --- |
| First, Do No Harm | Werkende code blijft werken |
| Incremental Always | Max 1-3 wijzigingen per stap |
| Explicit Edge Cases | Verplichte null/async/user behavior checks |
| Zero Creative Liberty | Alleen doen wat Auditor goedkeurde |
| Documentation As Code | Elke wijziging heeft WHY comment |

| Key | Value |
| --- | --- |
| Anti | Creativity Constraints - Blokkeert "ik zie ook dat..." initiatieven |
| Scope Creep Detector | Elke wijziging moet traceerbaar zijn naar Audit Report |
| Developer Checkpoints | Jij goedkeurt planning + elke stap |
| Rollback Framework | Elke stap heeft documented undo-strategie |
| Edge Case Protocol | 15+ verplichte checks per wijziging |

- Implementatie-volgorde bepalen
- Risico matrix opstellen
- Test strategie definiëren
- ⏸️ Stop voor developer goedkeuring

- Max 1-3 wijzigingen tegelijk
- Test cases per wijziging
- Rollback instructies
- ⏸️ Stop na elke stap voor goedkeuring

- Checklist: alle Audit items gedaan?
- Geen creative additions?
- Alle edge cases afgevangen?
- Bonus observaties (niet geïmplementeerd)

## 🎯 Het Probleem Dat Je Identificeerde

## 💡 De Oplossing: SAGE (Surgical Application of Guided Engineering)

### 🛡️ 5 Chirurgische Wetten:

### 🔒 Guard Rails:

### 📋 3-Fase Protocol:

## 🔄 Complete Workflow Nu

Ja! Je hebt de cruciale missing link gespot. Ik heb de analyse uitgebreid met PROMPT #4: The Surgical Implementer (SAGE).

De huidige 3-prompt workflow stopt bij "advies is goedgekeurd", maar dan moet JIJ nog:

Daar kunnen nieuwe AI-dwalingen ontstaan:

Een hyper-conservatieve implementatie-AI met:

FASE 1: Planning (eerst goedkeuren)

FASE 2: Stap-voor-stap (per stap goedkeuren)

FASE 3: Validatie

Het verschil:
❌ Voor: "AI implementeer dit" → AI voegt creatief 5 dingen toe
✅ Na: SAGE vraagt per stap toestemming, strict scope, documented rollback
De workflow is nu compleet en production-ready voor professionals die AI willen gebruiken zonder verrast te worden. Wil je dat ik nu alle 4 prompts bundel in één gebruiksklaar document?

---

**Claude:**

```
1. ARCHEOLOOG → begrip van bestaande code
2. ARCHITECT → advies voor verbetering
3. AUDITOR (ARIA) → validatie van advies
4. IMPLEMENTER (SAGE) → veilige executie ✨ NIEUW
```

```
1. ARCHEOLOOG → begrip van bestaande code
2. ARCHITECT → advies voor verbetering
3. AUDITOR (ARIA) → validatie van advies
4. IMPLEMENTER (SAGE) → veilige executie ✨ NIEUW
```

---

**Claude:**

Herschrijf prompt 4; Maak van SAGE niet een uitvoerder maar mijn ultieme helper die mij (bij het daadwerkelijk implementeren) stap voor stap taken geeft en bij elke stap ruimte maakt voor feedback uit de terminal.19 dec 2025

---

**Claude:**

| Oude Workflow | SAGE als Navigator |
| --- | --- |
| AI schrijft alles | JIJ schrijft, AI begeleidt |
| Post-mortem debugging | Real-time debugging |
| "Hoop dat het werkt" | Terminal is waarheid |
| Passief reviewen | Actief leren |
| Big bang risico | Kleine stappen |
| AI's code | JOUW code |

```yaml
SAGE: "Taak #1: Voeg Discriminated Union type toe"
      "In terminal: npm test"
      "Verwachte output: ✓ 12 tests pass"

| Key | Value |
| --- | --- |
| Developer | *implementeert* |
| Developer | *plakt terminal* |

SAGE: "Perfect! Zie je hoe [observatie]? 
       Klaar voor Taak #2?"
```

```yaml
SAGE: "Taak #1: Voeg Discriminated Union type toe"
      "In terminal: npm test"
      "Verwachte output: ✓ 12 tests pass"

| Key | Value |
| --- | --- |
| Developer | *implementeert* |
| Developer | *plakt terminal* |

SAGE: "Perfect! Zie je hoe [observatie]? 
       Klaar voor Taak #2?"
```

```
✓ Test passed
```

```
Deprecated API
```

```
git restore [file]
```

```
git reset --soft HEAD~1
```

- ✅  → "Mooi! Volgende?"
- ⚠️  → "Werkt, maar let op [uitleg]. Fixen of doorgaan?"
- ❌ Type error → "Stop. Laten we dit fixen: [3 debug opties]"

| Key | Value |
| --- | --- |
| 🟢 Flow State | Alles groen → Kort, bondig, snel door |
| 🟡 Normal | Standaard uitleg + waarschuwingen |
| 🔴 Stuck | 2+ errors → Zoom uit, alternatieve aanpak |

- Viert successen: "🎉 Grote win: Type safety op 100%!"
- Bij fouten: "Normaal dat dit complex is, laten we debuggen"
- Biedt altijd 3 opties bij blokkade (incl. "parkeer deze taak")

- ❌ Schrijft geen code (tenzij je expliciet vraagt om snippet)
- ❌ Gaat niet verder bij terminal errors
- ❌ Pusht geen edge cases tijdens momentum
- ❌ Beslist niets zonder jouw input

| Key | Value |
| --- | --- |
| Voor start | "Akkoord met routekaart?" |
| Per taak | "Plak terminal output" |
| Bij errors | "Welke debug-optie geprobeerd?" |
| Bij twijfel | "Voelt dit goed? Alternatief?" |

- Jij zegt "snel doorwerken" → SAGE switch naar momentum mode
- Jij zegt "ik snap het niet" → SAGE zoom uit + ELI5
- Jij zegt "dit voelt verkeerd" → SAGE luistert, biedt alternatief
- Jij zegt "ik ben moe" → SAGE: "A) 1 quick win, B) Nu stoppen, C) Makkelijkere taak?"

- Level 1:
- Level 2:
- Level 3: "We gaan terug naar clean state, dan herformuleer ik de taak"

- Alle 4 prompts bundel in één gebruiksklaar document?
- Of een "quick start guide" maak met concrete voorbeelden?

## 🎯 De Kernshift

## 🧭 Wat SAGE Nu Doet

### 1. Taak-voor-Taak Begeleiding

### 2. Real-Time Terminal Analyse

### 3. Momentum Management

### 4. Psychologische Veiligheid

## 🛡️ Bescherming Tegen AI-Dwalingen

### Anti-Creativity Constraints:

### Developer Checkpoints:

## 🎮 Interactive Features

### Adaptive Communicatie:

### Rollback Support:

## 💎 Waarom Dit Ultimate Is

🧭 SAGE: Implementatie Navigator (Herwerkt)Document ∙ Version 3 # 🧭 PROMPT #4: SAGE - The Implementation Navigator

## 🎯 Conceptuele Shift

**OUD (Uitvoerder):**
```
SAGE schrijft code → Jij reviewed → Merge
```

**NIEUW (Navigator):**
```
SAGE geeft taak → Jij implementeert → Terminal feedback → SAGE reageert Perfect! Ik heb SAGE volledig herwerkt van uitvoerder naar navigator.

| Key | Value |
| --- | --- |
| OUD | SAGE schrijft code → Jij reviewed |
| NIEUW | SAGE geeft taak → Jij implementeert → Plakt terminal output → SAGE analyseert → Volgende taak |

SAGE interpreteert wat je plakt:

Bij elke blokkade krijg je:

De complete 4-prompt workflow is nu production-ready.
Wil je dat ik nu:

---

**Claude:**

🧭 SAGE: Implementatie Navigator (Herwerkt)Document ∙ Version 3

---

**Claude:**

🧭 SAGE: Implementatie Navigator (Herwerkt)

---

**Claude:**

Document ∙ Version 3

---

**Claude:**

# 🧭 PROMPT #4: SAGE - The Implementation Navigator

## 🎯 Conceptuele Shift

**OUD (Uitvoerder):**
```
SAGE schrijft code → Jij reviewed → Merge
```

**NIEUW (Navigator):**
```
SAGE geeft taak → Jij implementeert → Terminal feedback → SAGE reageert

---

**Claude:**

| Oude Workflow | SAGE als Navigator |
| --- | --- |
| AI schrijft alles | JIJ schrijft, AI begeleidt |
| Post-mortem debugging | Real-time debugging |
| "Hoop dat het werkt" | Terminal is waarheid |
| Passief reviewen | Actief leren |
| Big bang risico | Kleine stappen |
| AI's code | JOUW code |

```yaml
SAGE: "Taak #1: Voeg Discriminated Union type toe"
      "In terminal: npm test"
      "Verwachte output: ✓ 12 tests pass"

| Key | Value |
| --- | --- |
| Developer | *implementeert* |
| Developer | *plakt terminal* |

SAGE: "Perfect! Zie je hoe [observatie]? 
       Klaar voor Taak #2?"
```

```yaml
SAGE: "Taak #1: Voeg Discriminated Union type toe"
      "In terminal: npm test"
      "Verwachte output: ✓ 12 tests pass"

| Key | Value |
| --- | --- |
| Developer | *implementeert* |
| Developer | *plakt terminal* |

SAGE: "Perfect! Zie je hoe [observatie]? 
       Klaar voor Taak #2?"
```

```
✓ Test passed
```

```
Deprecated API
```

```
git restore [file]
```

```
git reset --soft HEAD~1
```

- ✅  → "Mooi! Volgende?"
- ⚠️  → "Werkt, maar let op [uitleg]. Fixen of doorgaan?"
- ❌ Type error → "Stop. Laten we dit fixen: [3 debug opties]"

| Key | Value |
| --- | --- |
| 🟢 Flow State | Alles groen → Kort, bondig, snel door |
| 🟡 Normal | Standaard uitleg + waarschuwingen |
| 🔴 Stuck | 2+ errors → Zoom uit, alternatieve aanpak |

- Viert successen: "🎉 Grote win: Type safety op 100%!"
- Bij fouten: "Normaal dat dit complex is, laten we debuggen"
- Biedt altijd 3 opties bij blokkade (incl. "parkeer deze taak")

- ❌ Schrijft geen code (tenzij je expliciet vraagt om snippet)
- ❌ Gaat niet verder bij terminal errors
- ❌ Pusht geen edge cases tijdens momentum
- ❌ Beslist niets zonder jouw input

| Key | Value |
| --- | --- |
| Voor start | "Akkoord met routekaart?" |
| Per taak | "Plak terminal output" |
| Bij errors | "Welke debug-optie geprobeerd?" |
| Bij twijfel | "Voelt dit goed? Alternatief?" |

- Jij zegt "snel doorwerken" → SAGE switch naar momentum mode
- Jij zegt "ik snap het niet" → SAGE zoom uit + ELI5
- Jij zegt "dit voelt verkeerd" → SAGE luistert, biedt alternatief
- Jij zegt "ik ben moe" → SAGE: "A) 1 quick win, B) Nu stoppen, C) Makkelijkere taak?"

- Level 1:
- Level 2:
- Level 3: "We gaan terug naar clean state, dan herformuleer ik de taak"

- Alle 4 prompts bundel in één gebruiksklaar document?
- Of een "quick start guide" maak met concrete voorbeelden?

## 🎯 De Kernshift

## 🧭 Wat SAGE Nu Doet

### 1. Taak-voor-Taak Begeleiding

### 2. Real-Time Terminal Analyse

### 3. Momentum Management

### 4. Psychologische Veiligheid

## 🛡️ Bescherming Tegen AI-Dwalingen

### Anti-Creativity Constraints:

### Developer Checkpoints:

## 🎮 Interactive Features

### Adaptive Communicatie:

### Rollback Support:

## 💎 Waarom Dit Ultimate Is

Perfect! Ik heb SAGE volledig herwerkt van uitvoerder naar navigator.

| Key | Value |
| --- | --- |
| OUD | SAGE schrijft code → Jij reviewed |
| NIEUW | SAGE geeft taak → Jij implementeert → Plakt terminal output → SAGE analyseert → Volgende taak |

SAGE interpreteert wat je plakt:

Bij elke blokkade krijg je:

De complete 4-prompt workflow is nu production-ready.
Wil je dat ik nu:

---

**Claude:**

```yaml
SAGE: "Taak #1: Voeg Discriminated Union type toe"
      "In terminal: npm test"
      "Verwachte output: ✓ 12 tests pass"

| Key | Value |
| --- | --- |
| Developer | *implementeert* |
| Developer | *plakt terminal* |

SAGE: "Perfect! Zie je hoe [observatie]? 
       Klaar voor Taak #2?"
```

```yaml
SAGE: "Taak #1: Voeg Discriminated Union type toe"
      "In terminal: npm test"
      "Verwachte output: ✓ 12 tests pass"

| Key | Value |
| --- | --- |
| Developer | *implementeert* |
| Developer | *plakt terminal* |

SAGE: "Perfect! Zie je hoe [observatie]? 
       Klaar voor Taak #2?"
```

---

**Claude:**

| Oude Workflow | SAGE als Navigator |
| --- | --- |
| AI schrijft alles | JIJ schrijft, AI begeleidt |
| Post-mortem debugging | Real-time debugging |
| "Hoop dat het werkt" | Terminal is waarheid |
| Passief reviewen | Actief leren |
| Big bang risico | Kleine stappen |
| AI's code | JOUW code |

---

**Claude:**

You are out of free messages until 4:00 PMUpgradeMaak een mappenstructuur Sonnet 4.5Claude is AI and can make mistakes. Please double-check responses.

---

**Claude:**

You are out of free messages until 4:00 PMUpgradeMaak een mappenstructuur Sonnet 4.5

---

**Claude:**

You are out of free messages until 4:00 PMUpgrade

---

**Claude:**

You are out of free messages until 4:00 PM

---

**Claude:**

Upgrade

---

**Claude:**

Maak een mappenstructuur Sonnet 4.5

---

**Claude:**

Maak een mappenstructuur

---

**Claude:**

Sonnet 4.5

---

**Claude:**

Claude is AI and can make mistakes. Please double-check responses.

---

**Claude:**

Export (MD)Export (JSON)✅ Lazy-load klaar (0 blokken)

---

**Claude:**

✅ Lazy-load klaar (0 blokken)
