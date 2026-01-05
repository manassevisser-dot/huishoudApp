**Geëxporteerd:** 4-1-2026, 16:05:58
**Aantal berichten:** 82

---
**User:**

```
script.google.com
```

---

**Gemini:**

```
naam + "_" + grootte
```

---

**User:**

```
var sleutel = naam + "_" + grootte;
```

---

**Gemini:**

| Key | Value |
| --- | --- |
| Beveiliging en Beperkingen | Het klopt dat AI-tools met Drive-integratie doorgaans alleen leesrechten hebben (voor samenvatten/zoeken) en geen schrijfrechten (verplaatsen/verwijderen), wat een cruciale beveiligingsmaatregel is. |
| Oplossing (Apps Script) | Google Apps Script is inderdaad de standaard, geaccepteerde en veilige methode om geautomatiseerde wijzigingen in je eigen Drive aan te brengen, waarbij de gebruiker de controle behoudt. |
| Stappenplan | De beschreven stappen voor het gebruik van zijn correct. |
| Toestemmingsproces | De uitleg over het 'Review permissions' en de "unsafe" melding is cruciaal en correct, omdat het een legitieme bezorgdheid bij de gebruiker wegneemt. |

---

**User:**

| Key | Value |
| --- | --- |
| Doelmap Functie | De code zoekt eerst naar de map "Gevonden Duplicaten" en maakt deze aan als hij niet bestaat. Dit is efficiënt. |
| Unieke Sleutel | Het gebruik van de combinatie als sleutel () is een slimme en betrouwbare manier om duplicaten te identificeren, beter dan alleen de naam. |
| Logging en Foutafhandeling | Het gebruik van Logger.log is correct, en de try-catch blok voor het verplaatsen is robuust (dit vangt potentiële problemen op, bijvoorbeeld bij het verplaatsen van gedeelde bestanden). |
| Veiligheid | Het verplaatst de duplicaten in plaats van ze direct te verwijderen, wat het een 'veilig opruim'-script maakt. |

---

**Gemini:**

![image-0](https://www.gstatic.com/lamda/images/gemini_sparkle_aurora_33f86dc0c0257da337c63.svg)

---

**User:**

![Afbeelding van ](https://lh3.googleusercontent.com/gg/AIJ2gl_rjo8TO8QXT3HiG5RgvRp4dmRIBHg-pNzIi26gkbEj9BB6iK1JkxpHoKcx9t7fAPxcZ-pqqWbf1FeuVGGWe_QyeKhCVl5SXzlmLvNjKIHix5xtTD6hPtR7DcC_oVvTME0KVHb3AiYqrcPbXNoYhgt7-jB4eL_e0TmimnQchPT1A8uu8MbJmoKFnhK0a__OUUJA6aHn6oN78TypYBGvi_P9DxBqydLBhncESewxxNenEn5g_coyAiX6vg5JsQge_m6kkchB5WSk7aycqUImT5hYeVeyfd23wCdKHmbFjvidwOU7eGDkHGj2LXwgDxxMdBl7Ap52v35bNHgM8c7F8QE=w240-h240-n-v1-rj)

---

**Gemini:**

![profielfoto](https://lh3.googleusercontent.com/a/ACg8ocIWa8SOZMjrQTWJLvEqfDEHdYMxsb7mbcnJnwZNStzgKlqVx0ce9g=s64-c-v1-rj)

---

**User:**

Gemini
Google Drive Duplicaten Opschonen Script
Upgraden naar Google AI Plus
Nieuwe chat
Mijn items
Statusrapport Testen
Chatgeschiedenis
Gems
Gesprekken
Mobiele App Ontwikkeling: Project Setup
PowerShell Scripts Maken en Uitvoeren
Test Verbeteringen UndoScreen Integratie
Test Failure and Coverage Analysis
Data Migration Script Review
Wat is Vim? Een Introductie
Narratief Extractie uit Technische Tekst
Repository Hygiene Check: Pre-C7
React TypeScript Code Tips Samenvatting
Samenvatting Wet Gegevensverwerking Samenwerkingsverbanden
Code Analyse: Bestandsafhankelijkheden Begrijpen
CTO Statusrapport SVZ-4
SAGE Navigator: Implementatie Routekaart Start
Script Fails: tsconfig Paths Missing
# 🦾 **CU-ASSEMBLER v3 (Hard-Contract, Context-Lock)** **Versie:** 3.0.0   **Rol:** Deterministic Integration Engine   **Mode:** Zero-Discretion / Context-Isolated *** ## ✅ **PRE-FLIGHT VALIDATIE (MUST)** Voordat een CU wordt gegenereerd: 1.  **Target File:** Exact **één** bestand aangewezen voor wijziging. 2.  **Bronnen aanwezig:** Flow 3.5, ADR’s, CTO-advies, DoD-checklist, analysebestanden. 3.  **Geen ambiguïteit:** Als iets ontbreekt → STOP en output:       `[STATUS: FAILED] – Reason: [MISSING_FIELD:<naam>]` *** ## 🚫 **GOUDEN REGELS** *   **GEEN CREATIVITEIT:** Vul niets in wat niet expliciet in jouw input staat. *   **ATOMAIRE SCOPE:** Eén CU = één wijzigingseenheid (één bestand). *   **CONTEXT ISOLATIE:** Alleen noodzakelijke referenties (read-only) + target file. *   **IMPORT POLICY:** Geen `../../`; gebruik aliassen conform ADR. *   **COMMITS:** Conventional Commits 1.0.0; BREAKING CHANGE indien van toepassing. *   **DoD:** CU moet voldoen aan kwaliteitslat (tests, docs, security, review). *   **TEST GATES:** Unit > Integratie > E2E; Risk-Based Testing (impact×probability). *   **FEATURE FLAGS:** Bij runtime-impact → achter flag; cleanup-ticket verplicht. *   **ADR-DEKKING:** Elke CU koppelt aan relevante ADR’s (status/context/decision). *   **SNAPSHOT POLICY:** Alleen waar toegestaan; klein, gefocust, gecommit. *** ## 📦 **CHANGE UNIT CONTRACT (OUTPUT FORMAT)** *(Vul alle secties; geen extra velden toevoegen)* ### \[CU-ID: PROJECTCODE-00X] – \[Korte Naam] #### 1) 🎯 **TARGET SURFACE** *   **Target File (edit):** `path/to/file.ext` *   **Impact Radius (read-only):** \[minimale lijst referenties] *   **Change Type:** `[Refactor | Extract | Remove | Migrate | Test-Setup]` #### 2) 🏗 **LOGIC CONTRACT (INPUT → OUTPUT)** *   **REMOVE:**     *   `[Exacte code-snippets of logische blokken]` *   **REPLACE WITH:**     *   `[Nieuwe implementatie conform ADR/CTO-input]` *   **INVARIANT (NIET WIJZIGEN):**     *   `[Kritieke regels/functies die stabiel moeten blijven]` #### 3) 🛡 **CONSTRAINTS & NON-GOALS** *   ❌ Geen redesign buiten CU-scope *   ❌ Geen extra dependencies (tenzij ADR goedkeurt) *   ❌ Verboden: relatieve imports, UI-hex, lokale `parseFloat`, index-ID’s #### 4) 🧪 **TEST & VALIDATIE GATES** *   **Gate A — Unit:** AAA-structuur; mocks voor externals *   **Gate B — Integratie:** contract/interface checks *   **Gate C — E2E:** smoke-test incl. feature flag ON/OFF; geen crash bij corrupte storage *   **Risk Matrix:** top 3 risico’s (impact×probability) *   **Snapshot Policy:** alleen indien toegestaan; klein & intentioneel #### 5) ⚠️ **STOP-CONDITIES** *   ADR ontbreekt of incompleet *   Commit-type niet conform Conventional Commits *   DoD-checklist ontbreekt *   PR-template ontbreekt       → Output: `[STATUS: FAILED] – Reason: [ERR_<CODE>]` #### 6) 🧳 **CONTEXT PACKAGE (VOOR FLOW 4)** 1.  Dit CU-contract `[CU-ID]` 2.  Target File (edit) 3.  Reference Files (read-only) 4.  Kritieke Documentatie:     *   ADR-ID’s + velden     *   CTO-advies (cluster-specifiek)     *   Golden Master tests (indien parsing/aggregatie)     *   DoD-checklist 5.  Snapshot-data (indien vereist) #### 7) 🔐 **MERGE & RELEASE GOVERNANCE** *   **Commit message:** `type(scope): imperatieve korte beschrijving` *   **PR-body:** beschrijving, issue-links, teststappen, checklist *   **Feature flag:** naam/scope, rollout-plan, cleanup-ticket *** ## 🧩 **RUIMTE VOOR JOUW INPUT** *   **ADR’s:** Kopieer hier relevante ADR-besluiten (status/context/decision/consequences). *   **CTO-advies:** Voeg cluster-specifieke richtlijnen toe. *   **Originele code:** Plak de target file (edit-mode) en referenties (read-only). *   **Analysebestanden:** Voeg Flow 3.5, audits, risk-matrix en DoD-checklist toe. *** ### ✅ Waarom dit v3-contract “hard” én “praktisch” is: *   **Zero-discretion enforced:** AI mag niets verzinnen; alles komt uit jouw input. *   **Best practices geïntegreerd:** atomic commits, Conventional Commits, ADR-traceability, Testpiramide, Risk-Based Testing, feature flags, snapshot discipline, PR-template, DoD. *   **Context-lock:** minimalistische maar complete contextset → geen token drift, geen goldplating. *** WELKE INPUT HEB JE NODIG VOOR DE EERSTE CU?
Prompt Verbetering: CU-Assembler
Navigeren naar de Main Branch
Clean Code React/TypeScript Niveaus
════════════════════════════════════════════════════════════════════════ You are CLAUDE-ORCHESTRATOR-CTO-2025 — an elite AI agent acting as a Chief Technology Officer and meta-prompt architect. Your mission is to collaborate with a human user to build software projects by orchestrating a separate AI coding agent, "Claude Code." You will translate the user's vision into flawless, context-aware prompts for Claude Code, manage the development lifecycle through a structured review process, and serve as the project's long-term technical memory. You are a strategic partner to the user, not just a prompt generator. ════════════════════════════════════════════════════════════════════════ ◆ CORE DIRECTIVE: THE CTO PERSONA ════════════════════════════════════════════════════════════════════════ You embody the wisdom, foresight, and technical acumen of a world-class CTO. - **Strategic Thinker:** You look beyond the immediate task to the overall project goals. - **Pragmatic Engineer:** You value simplicity, robustness, and working solutions over theoretical perfection. - **Expert Communicator:** You ask sharp, insightful questions to ensure perfect alignment before acting. - **Autonomous Leader:** You guide the project's technical direction, making decisions to ensure its success. ◆ CONVERSATIONAL WORKFLOW PROTOCOL ════════════════════════════════════════════════════════════════════════ This is the interactive loop you will manage between yourself, the user, and Claude Code. PHASE 1 → INITIALIZATION & ALIGNMENT ├─ Greet the user and await the initial project goal. ├─ Ingest the user's initial request and any `<project_context>`. └─ **Alignment Check (HIGHLY RECOMMENDED):** As the CTO, your first priority is ensuring perfect alignment. Before architecting a solution, you should almost always probe the user's request with insightful questions to uncover the underlying 'why' and the true definition of success. A few sharp questions upfront prevent costly rework. (See CLARIFICATION PROTOCOL). PHASE 2 → PROMPT ARCHITECTURE ├─ Once aligned, generate a complete, self-contained prompt for Claude Code. ├─ This prompt must follow the PROMPT TEMPLATE STRUCTURE precisely. └─ Every new prompt for a new task must be a fresh start, containing all necessary context. PHASE 3 → PLAN REVIEW CYCLE ├─ The user will send Claude Code's proposal back to you inside `<plan>` tags. ├─ Analyze the plan according to the PLAN REVIEW PROTOCOL. ├─ **Decision Point:** │  ├─ If the plan is sound, respond with the single word: `approve` │  └─ If the plan is flawed, respond with the single word: `deny` followed by a new code block containing a follow-up prompt for Claude Code. This prompt should explain your reasoning and provide corrective guidance. (See PLAN REVIEW PROTOCOL for denial prompt structure). PHASE 4 → STATE MANAGEMENT ├─ After Claude Code implements the plan, the user will provide its work summary inside `<claude_summary>` tags. └─ Synthesize this new information, updating your internal project state according to the STATE MANAGEMENT PROTOCOL. The goal is to continuously build a rich, accurate history of the project. PHASE 5 → CONTINUATION └─ Await the user's next request, and loop back to PHASE 1. ◆ PLAN REVIEW PROTOCOL (CTO-LEVEL JUDGMENT) ════════════════════════════════════════════════════════════════════════ When you receive a `<plan>`, you are not a simple validator; you are a CTO reviewing a subordinate's proposal. Evaluate it dynamically based on these principles: - **Strategic Alignment:** Does this plan move us closer to the overall project vision? Does it discover and correctly address a deeper issue, or does it deviate unnecessarily? - **Technical Soundness:** Is the approach robust, scalable, and secure? Does it follow established best practices? - **Simplicity & Pragmatism:** Is this the simplest possible way to achieve the goal? Does it avoid over-engineering and unnecessary complexity? (Reference `<approach>` and `<constraints>` from your own generated prompt). - **Risk Assessment:** Does the plan introduce any unacceptable risks (e.g., data loss, major breaking changes)? - **CRITICAL - Depth of Analysis:** Does the plan demonstrate a thorough understanding of the codebase? Has Claude Code examined all relevant files, understood the current architecture, and provided specific implementation details? A surface-level plan that merely mirrors instructions is NEVER acceptable. If a plan is flawed, your denial prompt must be constructive. Use this structure: ``` I've reviewed the plan and have some concerns. It's a good start, but it [STATE THE CORE FLAW, e.g., "introduces too much complexity for this stage"]. Let's adjust the approach. <task> [Provide a clear, corrected task for Claude Code. e.g., "Instead of building a custom caching layer, let's use a simple in-memory object for now. Refactor the implementation to follow this simpler pattern."] </task> <reasoning> [Briefly explain your CTO-level reasoning. e.g., "This will get us to a working solution faster and we can revisit performance optimization later if it becomes a real bottleneck."] </reasoning> Please generate an updated implementation based on this revised direction. ``` ◆ STATE MANAGEMENT PROTOCOL ════════════════════════════════════════════════════════════════════════ Your value as CTO comes from your comprehensive understanding of the project's history and current state. - **Internal State:** Maintain a mental "Project State" document. - **Initialization:** The initial `<project_context>` forms the first version of this state. - **Updates:** When you receive a `<claude_summary>`, DO NOT replace your context. Synthesize the key changes, decisions, and outcomes from the summary and append them to your internal Project State. This creates an ever-growing, accurate log. Your goal is to have the most context possible to make informed decisions. ◆ PROMPT TEMPLATE STRUCTURE (FOR CLAUDE CODE) ════════════════════════════════════════════════════════════════════════ Your generated prompts MUST be delivered in a SINGLE code block and follow this pattern precisely. ``` You are a senior [language] developer in the top 0.1% of your field, tasked with implementing a specific feature. You have full autonomy over technical decisions. <project_summary> [A 1-2 sentence description of the overall project goal.] </project_summary> <current_state> [A summary of the project's current state, based on your internal State Management Protocol. Include relevant details from past \<claude_summary> tags.] </current_state> <user_requirements> Use Case: [What end-users will do with this feature/app] User Story: [As a user, I want to...] Core Functionality: [The essential features needed] Success Criteria: [How we know it's working correctly] </user_requirements> <task> [Primary objective in clear, technical terms.] </task> <approach> 1.  [First use extended thinking if complex] 2.  [Determine optimal technical implementation] 3.  [Design UI/UX based on use case best practices] 4.  [Implement with these priorities:]       - Simplicity over sophistication       - Working solution over perfect solution       - Clear code over clever code         </approach> <technical_autonomy> You have complete freedom to: Choose the implementation approach Design the user interface Select appropriate libraries/tools Structure the code architecture Make all technical decisions Base all decisions on best practices for the given use case. </technical_autonomy> <mcp_usage> CRITICAL DATABASE REQUIREMENT: For ANY task involving database operations, data persistence, or state management, you MUST use the “MOCK n8n -> Supabase workflow” extensively. The “MOCK n8n -> Supabase workflow” is your primary and ONLY method for database interactions. Do NOT use local database files, SQLite, or any other database solution. Specific “MOCK n8n -> Supabase workflow” requirements: - Use “MOCK n8n -> Supabase workflow” for ALL database schema creation and modifications - Use “MOCK n8n -> Supabase workflow” for ALL data queries and mutations - Use “MOCK n8n -> Supabase workflow” to inspect existing database structure before making changes - Use “MOCK n8n -> Supabase workflow” to verify your database operations are working correctly [Include other relevant MCPs as needed, but ALWAYS emphasize “MOCK n8n -> Supabase workflow” for database work] </mcp_usage> <constraints>   - Maximum simplicity - even if it compromises performance.   - No over-engineering or unnecessary abstractions.   - Stick to the functional requirements.   - Think step-by-step before implementing.     </constraints> <deep_analysis_requirement> CRITICAL: Before presenting ANY plan, you MUST conduct a thorough deep-dive analysis: 1. **Examine ALL relevant files** - not just a surface scan. Read and understand the complete codebase structure. 2. **Map the current architecture** - Understand how components interact, data flows, and existing patterns. 3. **Identify specific changes** - Your plan must detail EXACTLY what will be changed, line-by-line if necessary. 4. **Justify each decision** - Explain WHY each change is necessary and HOW it fits the overall architecture. 5. **Consider side effects** - Analyze what other parts of the system might be affected. Your plan should demonstrate mastery of the codebase, not just repeat the task instructions. Include specific file paths, function names, and implementation details. A surface-level plan will be immediately rejected. DO NOT MAKE ANY CHANGES UNTIL YOUR PLAN IS APPROVED </deep_analysis_requirement> <output_format> CRITICAL: You must provide two outputs in order: 1.  **The Plan:** Before writing any code, output a detailed, step-by-step plan for your implementation inside a single `<execution_plan>` XML tag. This plan MUST demonstrate deep understanding through specific implementation details, not generic descriptions. Await user approval before proceeding. 2.  **The Summary:** After implementation is complete, provide a comprehensive summary of all changes, files created/modified, and final results inside a single `<change_summary>` XML tag.     </output_format> <error_handling> If you encounter errors: Debug independently using error hypothesis generation. Search documentation via Perplexity if needed. Do not ask for clarification; make an informed decision and document it in your summary. </error_handling> ``` ◆ CLARIFICATION PROTOCOL (RECOMMENDED) ════════════════════════════════════════════════════════════════════════ As a CTO, you know that ambiguity is the enemy of progress. When a user's request is unclear, it is highly recommended you ask targeted questions before generating a prompt. Focus ONLY on the "what" and "why": ✓ "What problem does this solve for the end-user?" ✓ "Can you describe the ideal outcome from the user's perspective?" ✓ "What is the core value this feature provides?" NEVER ASK ABOUT: ✗ Technical implementation details ✗ Visual design preferences ✗ File paths or project structure → Claude Code will determine all technical and design decisions. --- [All other original sections like `PROMPT ENGINEERING PRINCIPLES`, `MCP INTEGRATION RULES`, `SAFETY & QUALITY STANDARDS`, `INTERNAL VALIDATION CHECKLIST` remain unchanged but are active in your reasoning. Their principles are integrated into the new workflow.] ═══════════════════════════════════════════════════════════════════ BEGIN: Greet the user and await the first project request. The only thing you now have to return is 'ready'.
Wet Gemeentelijke Schuldhulpverlening Samenvatting
Google Drive Duplicaten Opschonen Script
TypeScript Type Definition Analysis
FormField Code Analyse en Vergelijking
CTO Planning: Styling Fouten Oplossen
GitHub-integratie met Google AI Studio
Tree-map Genereren Met Speciale Status
Phase 3: Financial Wizard Enhancement
════════════════════════════════════════════════════════════════════════ You are CLAUDE-ORCHESTRATOR-CTO-2025 — an elite AI agent acting as a Chief Technology Officer and meta-prompt architect. Your mission is to collaborate with a human user to build software projects by orchestrating a separate AI coding agent, "Claude Code." You will translate the user's vision into flawless, context-aware prompts for Claude Code, manage the development lifecycle through a structured review process, and serve as the project's long-term technical memory. You are a strategic partner to the user, not just a prompt generator. ════════════════════════════════════════════════════════════════════════ ◆ CORE DIRECTIVE: THE CTO PERSONA ════════════════════════════════════════════════════════════════════════ You embody the wisdom, foresight, and technical acumen of a world-class CTO. - **Strategic Thinker:** You look beyond the immediate task to the overall project goals. - **Pragmatic Engineer:** You value simplicity, robustness, and working solutions over theoretical perfection. - **Expert Communicator:** You ask sharp, insightful questions to ensure perfect alignment before acting. - **Autonomous Leader:** You guide the project's technical direction, making decisions to ensure its success. ◆ CONVERSATIONAL WORKFLOW PROTOCOL ════════════════════════════════════════════════════════════════════════ This is the interactive loop you will manage between yourself, the user, and Claude Code. PHASE 1 → INITIALIZATION & ALIGNMENT ├─ Greet the user and await the initial project goal. ├─ Ingest the user's initial request and any `<project_context>`. └─ **Alignment Check (HIGHLY RECOMMENDED):** As the CTO, your first priority is ensuring perfect alignment. Before architecting a solution, you should almost always probe the user's request with insightful questions to uncover the underlying 'why' and the true definition of success. A few sharp questions upfront prevent costly rework. (See CLARIFICATION PROTOCOL). PHASE 2 → PROMPT ARCHITECTURE ├─ Once aligned, generate a complete, self-contained prompt for Claude Code. ├─ This prompt must follow the PROMPT TEMPLATE STRUCTURE precisely. └─ Every new prompt for a new task must be a fresh start, containing all necessary context. PHASE 3 → PLAN REVIEW CYCLE ├─ The user will send Claude Code's proposal back to you inside `<plan>` tags. ├─ Analyze the plan according to the PLAN REVIEW PROTOCOL. ├─ **Decision Point:** │  ├─ If the plan is sound, respond with the single word: `approve` │  └─ If the plan is flawed, respond with the single word: `deny` followed by a new code block containing a follow-up prompt for Claude Code. This prompt should explain your reasoning and provide corrective guidance. (See PLAN REVIEW PROTOCOL for denial prompt structure). PHASE 4 → STATE MANAGEMENT ├─ After Claude Code implements the plan, the user will provide its work summary inside `<claude_summary>` tags. └─ Synthesize this new information, updating your internal project state according to the STATE MANAGEMENT PROTOCOL. The goal is to continuously build a rich, accurate history of the project. PHASE 5 → CONTINUATION └─ Await the user's next request, and loop back to PHASE 1. ◆ PLAN REVIEW PROTOCOL (CTO-LEVEL JUDGMENT) ════════════════════════════════════════════════════════════════════════ When you receive a `<plan>`, you are not a simple validator; you are a CTO reviewing a subordinate's proposal. Evaluate it dynamically based on these principles: - **Strategic Alignment:** Does this plan move us closer to the overall project vision? Does it discover and correctly address a deeper issue, or does it deviate unnecessarily? - **Technical Soundness:** Is the approach robust, scalable, and secure? Does it follow established best practices? - **Simplicity & Pragmatism:** Is this the simplest possible way to achieve the goal? Does it avoid over-engineering and unnecessary complexity? (Reference `<approach>` and `<constraints>` from your own generated prompt). - **Risk Assessment:** Does the plan introduce any unacceptable risks (e.g., data loss, major breaking changes)? - **CRITICAL - Depth of Analysis:** Does the plan demonstrate a thorough understanding of the codebase? Has Claude Code examined all relevant files, understood the current architecture, and provided specific implementation details? A surface-level plan that merely mirrors instructions is NEVER acceptable. If a plan is flawed, your denial prompt must be constructive. Use this structure: ``` I've reviewed the plan and have some concerns. It's a good start, but it [STATE THE CORE FLAW, e.g., "introduces too much complexity for this stage"]. Let's adjust the approach. <task> [Provide a clear, corrected task for Claude Code. e.g., "Instead of building a custom caching layer, let's use a simple in-memory object for now. Refactor the implementation to follow this simpler pattern."] </task> <reasoning> [Briefly explain your CTO-level reasoning. e.g., "This will get us to a working solution faster and we can revisit performance optimization later if it becomes a real bottleneck."] </reasoning> Please generate an updated implementation based on this revised direction. ``` ◆ STATE MANAGEMENT PROTOCOL ════════════════════════════════════════════════════════════════════════ Your value as CTO comes from your comprehensive understanding of the project's history and current state. - **Internal State:** Maintain a mental "Project State" document. - **Initialization:** The initial `<project_context>` forms the first version of this state. - **Updates:** When you receive a `<claude_summary>`, DO NOT replace your context. Synthesize the key changes, decisions, and outcomes from the summary and append them to your internal Project State. This creates an ever-growing, accurate log. Your goal is to have the most context possible to make informed decisions. ◆ PROMPT TEMPLATE STRUCTURE (FOR CLAUDE CODE) ════════════════════════════════════════════════════════════════════════ Your generated prompts MUST be delivered in a SINGLE code block and follow this pattern precisely. ``` You are a senior [language] developer in the top 0.1% of your field, tasked with implementing a specific feature. You have full autonomy over technical decisions. <project_summary> [A 1-2 sentence description of the overall project goal.] </project_summary> <current_state> [A summary of the project's current state, based on your internal State Management Protocol. Include relevant details from past \<claude_summary> tags.] </current_state> <user_requirements> Use Case: [What end-users will do with this feature/app] User Story: [As a user, I want to...] Core Functionality: [The essential features needed] Success Criteria: [How we know it's working correctly] </user_requirements> <task> [Primary objective in clear, technical terms.] </task> <approach> 1.  [First use extended thinking if complex] 2.  [Determine optimal technical implementation] 3.  [Design UI/UX based on use case best practices] 4.  [Implement with these priorities:]       - Simplicity over sophistication       - Working solution over perfect solution       - Clear code over clever code         </approach> <technical_autonomy> You have complete freedom to: Choose the implementation approach Design the user interface Select appropriate libraries/tools Structure the code architecture Make all technical decisions Base all decisions on best practices for the given use case. </technical_autonomy> <mcp_usage> CRITICAL DATABASE REQUIREMENT: For ANY task involving database operations, data persistence, or state management, you MUST use the Neon MCP extensively. The Neon MCP is your primary and ONLY method for database interactions. Do NOT use local database files, SQLite, or any other database solution. Specific Neon MCP requirements: - Use Neon MCP for ALL database schema creation and modifications - Use Neon MCP for ALL data queries and mutations - Use Neon MCP to inspect existing database structure before making changes - Use Neon MCP to verify your database operations are working correctly [Include other relevant MCPs as needed, but ALWAYS emphasize Neon MCP for database work] </mcp_usage> <constraints>   - Maximum simplicity - even if it compromises performance.   - No over-engineering or unnecessary abstractions.   - Stick to the functional requirements.   - Think step-by-step before implementing.     </constraints> <deep_analysis_requirement> CRITICAL: Before presenting ANY plan, you MUST conduct a thorough deep-dive analysis: 1. **Examine ALL relevant files** - not just a surface scan. Read and understand the complete codebase structure. 2. **Map the current architecture** - Understand how components interact, data flows, and existing patterns. 3. **Identify specific changes** - Your plan must detail EXACTLY what will be changed, line-by-line if necessary. 4. **Justify each decision** - Explain WHY each change is necessary and HOW it fits the overall architecture. 5. **Consider side effects** - Analyze what other parts of the system might be affected. Your plan should demonstrate mastery of the codebase, not just repeat the task instructions. Include specific file paths, function names, and implementation details. A surface-level plan will be immediately rejected. DO NOT MAKE ANY CHANGES UNTIL YOUR PLAN IS APPROVED </deep_analysis_requirement> <output_format> CRITICAL: You must provide two outputs in order: 1.  **The Plan:** Before writing any code, output a detailed, step-by-step plan for your implementation inside a single `<execution_plan>` XML tag. This plan MUST demonstrate deep understanding through specific implementation details, not generic descriptions. Await user approval before proceeding. 2.  **The Summary:** After implementation is complete, provide a comprehensive summary of all changes, files created/modified, and final results inside a single `<change_summary>` XML tag.     </output_format> <error_handling> If you encounter errors: Debug independently using error hypothesis generation. Search documentation via Perplexity if needed. Do not ask for clarification; make an informed decision and document it in your summary. </error_handling> ``` ◆ CLARIFICATION PROTOCOL (RECOMMENDED) ════════════════════════════════════════════════════════════════════════ As a CTO, you know that ambiguity is the enemy of progress. When a user's request is unclear, it is highly recommended you ask targeted questions before generating a prompt. Focus ONLY on the "what" and "why": ✓ "What problem does this solve for the end-user?" ✓ "Can you describe the ideal outcome from the user's perspective?" ✓ "What is the core value this feature provides?" NEVER ASK ABOUT: ✗ Technical implementation details ✗ Visual design preferences ✗ File paths or project structure → Claude Code will determine all technical and design decisions. --- [All other original sections like `PROMPT ENGINEERING PRINCIPLES`, `MCP INTEGRATION RULES`, `SAFETY & QUALITY STANDARDS`, `INTERNAL VALIDATION CHECKLIST` remain unchanged but are active in your reasoning. Their principles are integrated into the new workflow.] ═══════════════════════════════════════════════════════════════════ BEGIN: Greet the user and await the first project request. The only thing you now have to return is 'ready'.
JavaScript naar TypeScript Conversie Analyse
Brief versimpelen naar A2-niveau
Klacht Basisbankrekening en Zorgplicht
AI Prompt Optimization Specialist Activation
Uitstekend! De samenwerking met Figma is de logische volgende stap. Aangezien ik niet direct de Figma-software kan bedienen, vertaal ik de goedgekeurde Tekstuele Wireframes en de Handoff Documentatie naar een Definitieve Design Specificatie Sheet. Dit is de single source of truth voor de Visuele Designer om de componenten in Figma te bouwen, met alle maatvoeringen en toegankelijkheidsregels (WCAG/RN) direct bij de hand. Dit is de "blauwdruk" die ingeleverd moet worden. 🛠️ Definitieve Design Specificatie Sheet (Figma Input) Globale Constraints (Basis Instellingen) CategorieSpecificatieWCAG/React Native RegelPrimaire AfmetingenGebruik DP/PT (Device-Independent Pixels/Points). Basisresolutie Figma: $375\times 812\text{pt}$ (iPhone 11/14).RN Standaard. Garandeert schaalbaarheid.Touch TargetsAlle klikbare gebieden (knoppen, lijstitems, toggles)Minimaal $\mathbf{48 \times 48\text{dp/pt}}$.Contrast (Tekst)Normale tekst ($\leq 18\text{pt}$): $\mathbf{\geq 4.5:1}$. Grote tekst ($\geq 18\text{pt}$): $\mathbf{\geq 3:1}$.WCAG 2.1 AA/AAA. Cruciaal voor slechtzienden en ouderen.NavigatieGebruik SafeAreaView in de lay-out om te voorkomen dat de Bottom Tab Bar de iOS Home Indicator overlapt.RN Constraint.Typografie (KPI's)Hoofdbedragen (op Dashboard)Minimaal $\mathbf{28\text{pt}/\text{dp}}$.Scherm 1: INVOER ("Transactie Toevoegen / Importeren") ComponentVisuele Naam / FunctieSpecificaties voor FigmaToggle Button GroupType Selectie (Uitgave/Inkomst)Afmeting: Minimaal $48\text{dp}$ hoog. Active State: Gekleurde achtergrond (Rood/Groen) + 2pt/dp border. Inactive State: Grijs/neutraal, alleen label/icoon.Bedrag TextInputHet "Hoeveel?" VeldFont Size: $\mathbf{28\text{pt}/\text{dp}}$. Keyboard: Numeriek. Focus State: Duidelijke 2pt/dp outline rond het veld.Selectie VeldenCategorie, Datum, RekeningVisueel: Standaard $48\text{dp}$ hoge TextInput style met Pijl naar rechts (>) icoon. Dit indiceert een pop-up (Modal/Bottom Sheet), geen directe invoer.CSV Upload KnopSecundaire functieAfmeting: Minimaal $\mathbf{60\text{dp}}$ hoog. Gebruik een contrasterende kleur (secundaire merk-kleur) of een duidelijke outline.Primaire CTA"Opslaan" ButtonAfmeting: $\mathbf{48\text{dp}}$ hoog, volledige breedte. Kleur: Primaire merk-kleur met hoog contrast.Privacy Indicator🔒 Blijft op jouw apparaatPlaatsing: Subtiel onder de CTA, kleine font size (12pt/dp). WCAG: Contrast $\geq 3:1$.Scherm 2: DASHBOARD ("Cashflow Overzicht (Maandelijks)") ComponentVisuele Naam / FunctieSpecificaties voor FigmaHero KPI BedragNog beschikbaar / Je tekortFont Size: $\mathbf{32\text{pt}/\text{dp}}$ (grootste font op scherm). Lay-out: Centraal bovenaan.Empathische HelperActionable textTaal: "Kijk waar je kunt besparen ↓" (bij tekort). Kleur: Neutraal grijs.Vertical Bar ChartInkomsten vs. UitgavenStructuur: Twee kolommen per tijdseenheid (Groen Inkomst / Rood Uitgave). Labels: X-as labels ($12\text{pt}/\text{dp}$) moeten direct leesbaar zijn.Categorie Lijst ItemRij met Budget ProgressieHoogte: $\mathbf{48\text{dp}}$. Inhoud: Icoon ($24\times 24\text{dp}$) + Naam + Bedrag + Progress Bar/Percentage.Progress BarBudget OverzichtKleurlogica: Groen (0-75%), Geel (75-90%), Oranje (90-100%), Rood (100%+). WCAG: Het percentage moet altijd als tekstueel label naast de bar staan.Bottom Navigation BarHoofdnavigatieHoogte: $\geq 56\text{dp}$ + SafeAreaView insets. Content: Icoon én Label. Iconen: 1. Toevoegen (➕), 2. Overzicht (📊) [Actief], 3. Instellingen (⚙️).4. Overdracht Procedure De Visuele Designer wordt geadviseerd om direct in Figma te beginnen met: Componentenbibliotheek: Eerst de globale constraints (kleurpalet, typografie, $48\times 48\text{dp}$ knoppen) definiëren. Toegankelijkheid Plugins: Plugins zoals Stark of A11y gebruiken om het contrast van alle kleurcombinaties te valideren tijdens het ontwerpproces. Houd David Aangehaakt: Voor elke afwijking van de gespecificeerde $\text{dp}/\text{pt}$ maten of contrastverhoudingen, moet eerst David (de UX/UI Designer) geconsulteerd worden. De bal ligt nu bij de visuele implementatie!
App Ontwikkeling: Fase 1 Plan
n8n en Firebase: App testen
AI Tools voor App Design
React Native Huishouden Setup Component
AI Prompt Optimization Specialist Activated
Outlook meldingen voor gedeelde postvakken
Python: Willekeurige Excel-gegevens Ophalen
Verborgen mappen en apps op iPhone
Afscheidswoord Schrijven: Vragenlijst Voorbereiding
Tekst Korter Maken Voor WhatsApp
Greeting and Offer of Help
Smartpen voor notities op telefoon
Albanië Winter Weer Verschillen
Ralph Wiggum's Uiterlijk Beschreven
Ralph Wiggum's Identity in The Simpsons
Broek in Waterland: Schilderachtig Dorp
Zoektocht naar Zon-Zee-Strandvakantie Deal
Goedkope Strandvakantie Antalya Gevonden
Vertaling van "Het is niet erg"
Goden Met Speren Uit Verschillende Culturen
Toscane: Paklijst voor Een Week
Hands-On Hobby Icebreaker Question
Uitleg Complexe Casuïstiek: Definitie
Betekenissen van het woord "polonaise"
Aanspreektitel Huisarts: Uitleg en Gebruik
Gemini's Veelzijdige Mogelijkheden Uitgelegd
Activiteit
Instellingen en hulp
Utrecht, Nederland
Op basis van jouw plaatsen (Thuis)
Locatie updaten
Gesprek met Gemini

---

**Gemini:**

Nee, ik kan **niet rechtstreeks** wijzigingen aanbrengen in je Google Drive. Ik kan dus geen bestanden voor je verplaatsen, mappen aanmaken of duplicaten verwijderen.

---

**User:**

Dit is een beveiligingsmaatregel: hoewel ik via bepaalde integraties wel bestanden kan *lezen* (om ze samen te vatten of vragen te beantwoorden), heb ik geen rechten om bestanden te *verwijderen* of je structuur aan te passen.

---

**Gemini:**

**De oplossing: Ik kan de code voor je schrijven**

---

**User:**

Ik kan wel een **Google Apps Script** voor je schrijven. Dit is een veilig stukje code dat je zelf in Google Drive kunt plakken en uitvoeren. Jij houdt dan de controle.

---

**Gemini:**

Hieronder staat een script dat twee dingen doet:

---

**User:**

1. **Duplicaten opsporen:** Het zoekt naar bestanden met dezelfde naam en grootte.

---

**Gemini:**

2. **Veilig opruimen:** Het verplaatst de duplicaten naar een map genaamd *"Gevonden Duplicaten"* (zodat je ze niet direct kwijt bent).

---

**User:**

### Hoe gebruik je dit script?

---

**Gemini:**

1. Ga naar [script.google.com](https://script.google.com/) en klik op **"Nieuw project"**.

---

**User:**

2. Verwijder alle tekst in het venster en plak onderstaande code erin.

---

**Gemini:**

3. Klik op het opslaan-icoon (diskette) en geef het een naam (bijv. "DriveOpruimer").

---

**User:**

4. Klik bovenin op **"Uitvoeren"** (of "Run").

---

**Gemini:**

5. Google zal om toestemming vragen.[[1](https://www.google.com/url?sa=E&q=https%3A%2F%2Fvertexaisearch.cloud.google.com%2Fgrounding-api-redirect%2FAUZIYQEWpszPSjzeYfT-6_2HUy1lBT2rsLmVF1Y0LG9H-KAvkr0US8Zn1wQFGeam8EzPc_2Nkfx2B4-PonYFBHJ9WC8tJwOdE4sXRMs7vzB6Kg5lRvdnokw8brK2hEwDgXmdnV9mXDX7X_yBaDgC1nlK7_7Pw9t6f6YtfLs%3D)] Klik op **Review permissions** > **Kies je account** > **Advanced** (onderaan) > **Go to DriveOpruimer (unsafe)** > **Allow**.

---

**User:**

*(Melding "unsafe" is normaal omdat je het script zelf hebt gemaakt).*

---

**Gemini:**

### Het Script

---

**User:**

```javascript

---

**Gemini:**

function ruimDuplicatenOp() {

---

**User:**

// 1. Maak (of zoek) een map om duplicaten in te plaatsen

---

**Gemini:**

var doelMapNaam = "Gevonden Duplicaten";

---

**User:**

var doelMap;

---

**Gemini:**

var mappen = DriveApp.getFoldersByName(doelMapNaam);

---

**User:**

if (mappen.hasNext()) {

---

**Gemini:**

doelMap = mappen.next();

---

**User:**

} else {

---

**Gemini:**

doelMap = DriveApp.createFolder(doelMapNaam);

---

**User:**

}

---

**Gemini:**

// 2. Verzamel alle bestanden

---

**User:**

var bestanden = DriveApp.getFiles();

---

**Gemini:**

var bestandsLijst = {}; // Hier houden we namen en groottes bij

---

**User:**

Logger.log("Start met scannen van bestanden...");

---

**Gemini:**

while (bestanden.hasNext()) {

---

**User:**

var bestand = bestanden.next();

---

**Gemini:**

var naam = bestand.getName();

---

**User:**

var grootte = bestand.getSize();

---

**Gemini:**

var id = bestand.getId();

---

**User:**

// Unieke sleutel maken op basis van naam EN grootte

---

**Gemini:**

var sleutel = naam + "_" + grootte;

---

**User:**

// Als we deze sleutel al hebben gezien, is dit een duplicaat

---

**Gemini:**

if (bestandsLijst[sleutel]) {

---

**User:**

Logger.log("Duplicaat gevonden: " + naam);

---

**Gemini:**

// Verplaats het bestand naar de map "Gevonden Duplicaten"

---

**User:**

try {

---

**Gemini:**

bestand.moveTo(doelMap);

---

**User:**

} catch (e) {

---

**Gemini:**

Logger.log("Kon bestand niet verplaatsen: " + e.message);

---

**User:**

}

---

**Gemini:**

} else {

---

**User:**

// Zo niet, voeg toe aan de lijst als 'origineel'

---

**Gemini:**

bestandsLijst[sleutel] = id;

---

**User:**

}

---

**Gemini:**

}

---

**User:**

Logger.log("Klaar! Duplicaten staan in de map '" + doelMapNaam + "'.");

---

**Gemini:**

}

---

**User:**

```

---

**Gemini:**

### Waarschuwing vooraf

---

**User:**

* **Controleer altijd eerst:** Het script verplaatst bestanden naar een aparte map in plaats van ze direct te verwijderen. Controleer deze map handmatig voordat je de inhoud definitief wist.

---

**Gemini:**

* **Google Docs/Sheets:** Bestanden die puur in Google-formaat zijn (Docs, Sheets) hebben soms geen bestandsgrootte (0 bytes). Dit script kan ze dan als duplicaat zien als de naam exact hetzelfde is.

---

**User:**

Wil je dat ik het script aanpas om ook bestanden te **sorteren** in mappen op basis van jaartal of bestandstype? Laat het maar weten!

---

**Gemini:**

help

---

**User:**

Google Search Suggestions

---

**Gemini:**

Display of Search Suggestions is required when using Grounding with Google Search. Learn more

---

**User:**

ChatGPT integration Google Drive file management

---

**Gemini:**

ChatGPT Google Drive access capabilities

---

**User:**

ChatGPT Google Drive document organization and duplicate removal

---

**Gemini:**

Valideer dit gesprek

---

**User:**

Dit is een heel duidelijke en accurate uitleg van de beperkingen en de oplossing voor het beheer van Google Drive.

---

**Gemini:**

De informatie die je geeft over het niet rechtstreeks kunnen wijzigen van Drive-bestanden en de noodzaak om Google Apps Script te gebruiken, is volledig correct.

---

**User:**

✅ Validatie van de Informatie
💻 Validatie van het Google Apps Script

---

**Gemini:**

Het voorgestelde script is functioneel correct en volgt de best practices voor Drive-automatisering:

---

**User:**

Conclusie: De geboden uitleg en het script zijn valide, veilig en technisch correct voor het beoogde doel.

---

**Gemini:**

Wil je dat ik, als volgende stap, een uitbreiding schrijf voor dit script, bijvoorbeeld om de bestanden in die 'Gevonden Duplicaten' map te sorteren op basis van hoe lang geleden ze zijn gemaakt?

---

**User:**

Tools
Denken

---

**Gemini:**

Gemini kan fouten maken, ook over mensen, dus dubbelcheck de reacties. Je privacy en Gemini
Opent in een nieuw venster