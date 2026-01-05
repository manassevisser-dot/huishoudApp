**Geëxporteerd:** 4-1-2026, 16:13:01
**Aantal berichten:** 178

---
**User:**

```
waitForTextContaining
```

---

**Gemini:**

```
import React from 'react';
import {
  screen,
  cleanup,
  fireEvent,
  waitFor,
  act
} from '@testing-library/react-native';
import { render } from '@test-utils/index'; // Gebruik je nieuwe render met providers
import { UndoScreen } from '../UndoScreen';
import { TransactionService } from '@services/transactionService';

---

**User:**

| * Helper om robuust tekst te vinden | zelfs als React Native deze opsplitst |
| --- | --- |
| searchText: string |  |
| } | options); |

---

**Gemini:**

| jest.mock('@services/transactionService' | () => ({ |
| --- | --- |
| getAllTransactions: jest.fn() |  |
| clearAll: jest.fn() |  |
| } |  |

---

**User:**

const mockedTx = TransactionService as jest.Mocked<typeof TransactionService>;

---

**Gemini:**

| jest.clearAllMocks() |  |
| --- | --- |
| }) |  |

---

**User:**

afterEach(cleanup);

---

**Gemini:**

| ] |  |
| --- | --- |
| mockedTx.getAllTransactions.mockResolvedValueOnce(mockData) |  |

---

**User:**

// ✅ FIX: Verwijder de handmatige 'await act' om de render heen
    render(<UndoScreen />);

---

**Gemini:**

| await waitForTextContaining('Boodschappen') |  |
| --- | --- |
| await waitForTextContaining('Tanken') |  |

---

**User:**

| expect(screen.toJSON()).toMatchSnapshot() |  |
| --- | --- |
| }) |  |

---

**Gemini:**

it('moet omgaan met undefined data van de service', async () => {
    mockedTx.getAllTransactions.mockResolvedValueOnce(undefined as any);

---

**User:**

// ✅ FIX: Direct renderen zonder act()
    render(<UndoScreen />);

---

**Gemini:**

| const counter = await screen.findByText(/Laatste transacties:\s*0/i) |  |
| --- | --- |
| expect(counter).toBeTruthy() |  |
| expect(screen.getByText(/Geen recente transacties/i)).toBeTruthy() |  |
| }) |  |

---

**User:**

| const mockData = [{ id: '1', description: 'Boodschappen', amount: 10 }] |  |
| --- | --- |
| mockedTx.getAllTransactions.mockResolvedValueOnce(mockData) |  |
| mockedTx.clearAll.mockResolvedValueOnce(undefined) |  |

---

**Gemini:**

// ✅ FIX: Direct renderen
    render(<UndoScreen />);

---

**User:**

// Wacht tot de initiele data is geladen
    await screen.findByText(/Boodschappen/i);

---

**Gemini:**

| Key | Value |
| --- | --- |
| // Actie | Verwijderen. fireEvent triggert intern de nodige act() calls. |
| fireEvent.press(screen.getByRole('button', { name | /Verwijder Alles/i })); |

---

**User:**

| expect(mockedTx.clearAll).toHaveBeenCalled() |  |
| --- | --- |
| expect(screen.getByText(/Laatste transacties:\s*0/i)).toBeTruthy() |  |
| }) |  |

---

**Gemini:**

// Controleer of de oude data echt weg is
    expect(screen.queryByText(/Boodschappen/i)).toBeNull();
  });
});
```

---

**User:**

```
import React from 'react';
import {
  screen,
  cleanup,
  fireEvent,
  waitFor,
  act
} from '@testing-library/react-native';
import { render } from '@test-utils/index'; // Gebruik je nieuwe render met providers
import { UndoScreen } from '../UndoScreen';
import { TransactionService } from '@services/transactionService';

---

**Gemini:**

| * Helper om robuust tekst te vinden | zelfs als React Native deze opsplitst |
| --- | --- |
| searchText: string |  |
| } | options); |

---

**User:**

| jest.mock('@services/transactionService' | () => ({ |
| --- | --- |
| getAllTransactions: jest.fn() |  |
| clearAll: jest.fn() |  |
| } |  |

---

**Gemini:**

const mockedTx = TransactionService as jest.Mocked<typeof TransactionService>;

---

**User:**

| jest.clearAllMocks() |  |
| --- | --- |
| }) |  |

---

**Gemini:**

afterEach(cleanup);

---

**User:**

| ] |  |
| --- | --- |
| mockedTx.getAllTransactions.mockResolvedValueOnce(mockData) |  |

---

**Gemini:**

// ✅ FIX: Verwijder de handmatige 'await act' om de render heen
    render(<UndoScreen />);

---

**User:**

| await waitForTextContaining('Boodschappen') |  |
| --- | --- |
| await waitForTextContaining('Tanken') |  |

---

**Gemini:**

| expect(screen.toJSON()).toMatchSnapshot() |  |
| --- | --- |
| }) |  |

---

**User:**

it('moet omgaan met undefined data van de service', async () => {
    mockedTx.getAllTransactions.mockResolvedValueOnce(undefined as any);

---

**Gemini:**

// ✅ FIX: Direct renderen zonder act()
    render(<UndoScreen />);

---

**User:**

| const counter = await screen.findByText(/Laatste transacties:\s*0/i) |  |
| --- | --- |
| expect(counter).toBeTruthy() |  |
| expect(screen.getByText(/Geen recente transacties/i)).toBeTruthy() |  |
| }) |  |

---

**Gemini:**

| const mockData = [{ id: '1', description: 'Boodschappen', amount: 10 }] |  |
| --- | --- |
| mockedTx.getAllTransactions.mockResolvedValueOnce(mockData) |  |
| mockedTx.clearAll.mockResolvedValueOnce(undefined) |  |

---

**User:**

// ✅ FIX: Direct renderen
    render(<UndoScreen />);

---

**Gemini:**

// Wacht tot de initiele data is geladen
    await screen.findByText(/Boodschappen/i);

---

**User:**

| Key | Value |
| --- | --- |
| // Actie | Verwijderen. fireEvent triggert intern de nodige act() calls. |
| fireEvent.press(screen.getByRole('button', { name | /Verwijder Alles/i })); |

---

**Gemini:**

| expect(mockedTx.clearAll).toHaveBeenCalled() |  |
| --- | --- |
| expect(screen.getByText(/Laatste transacties:\s*0/i)).toBeTruthy() |  |
| }) |  |

---

**User:**

// Controleer of de oude data echt weg is
    expect(screen.queryByText(/Boodschappen/i)).toBeNull();
  });
});
```

---

**Gemini:**

```
queryByText
```

---

**User:**

```
/Laatste transacties:\s*0/i
```

---

**Gemini:**

| Key | Value |
| --- | --- |
| act verwijderd rondom render | React Testing Library handelt dit intern af. Handmatige act blokken rondom renderen zorgen vaak voor onnodige complexiteit en waarschuwingen. |
| Robuuste Helpers | De helper is behouden om problemen met gesplitste tekst-nodes in React Native te voorkomen. |
| Async Consistency | We gebruiken findBy... en waitFor om de asynchrone lifecycle van de component (useEffect -> Service call -> State update) correct te volgen. |

---

**User:**

| - Snapshot Timing: Maak snapshots altijd na een await of findBy. Als je het direct na de render doet | staat je app waarschijnlijk nog in een "Loading" state. |
| --- | --- |
| - Regex in Tests: De \s* in is essentieel in React Native | omdat componenten zoals <Text> soms onzichtbare witruimte of line-breaks toevoegen tussen variabelen. |

---

**Gemini:**

Gemini
Test Verbeteringen UndoScreen Integratie
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

**User:**

// ... imports blijven gelijk

---

**Gemini:**

describe('UndoScreen Integratie Tests', () => {

---

**User:**

// ... beforeEach/afterEach blijven gelijk

---

**Gemini:**

it('moet transacties laden en de omschrijvingen tonen (met snapshot)', async () => {

---

**User:**

const mockData = [

---

**Gemini:**

{ id: '1', amount: 12.5, description: 'Boodschappen' },

---

**User:**

{ id: '2', amount: 45.0, description: 'Tanken' },

---

**Gemini:**

];

---

**User:**

mockedTx.getAllTransactions.mockResolvedValueOnce(mockData);

---

**Gemini:**

// ✅ FIX 1: Verwijder de 'await act' om de render heen

---

**User:**

render(<UndoScreen />);

---

**Gemini:**

// Wacht tot de data zichtbaar is via de robuuste helper

---

**User:**

await waitForTextContaining('Boodschappen');

---

**Gemini:**

await waitForTextContaining('Tanken');

---

**User:**

// Snapshot is nu veilig omdat de UI 'settled' is

---

**Gemini:**

expect(screen.toJSON()).toMatchSnapshot();

---

**User:**

});

---

**Gemini:**

it('moet omgaan met undefined data van de service', async () => {

---

**User:**

mockedTx.getAllTransactions.mockResolvedValueOnce(undefined as any);

---

**Gemini:**

// ✅ FIX 2: Gewoon direct renderen

---

**User:**

render(<UndoScreen />);

---

**Gemini:**

const counter = await screen.findByText(/Laatste transacties:\s*0/i);

---

**User:**

expect(counter).toBeTruthy();

---

**Gemini:**

expect(screen.getByText(/Geen recente transacties/i)).toBeTruthy();

---

**User:**

});

---

**Gemini:**

it('moet alle transacties verwijderen als op de knop wordt gedrukt', async () => {

---

**User:**

const mockData = [{ id: '1', description: 'Boodschappen', amount: 10 }];

---

**Gemini:**

mockedTx.getAllTransactions.mockResolvedValueOnce(mockData);

---

**User:**

mockedTx.clearAll.mockResolvedValueOnce(undefined);

---

**Gemini:**

// ✅ FIX 3: Gewoon direct renderen

---

**User:**

render(<UndoScreen />);

---

**Gemini:**

await screen.findByText(/Boodschappen/i);

---

**User:**

// Actie: Verwijderen (fireEvent heeft intern al act, maar mag eromheen blijven als het async is)

---

**Gemini:**

fireEvent.press(screen.getByRole('button', { name: /Verwijder Alles/i }));

---

**User:**

await waitFor(() => {

---

**Gemini:**

expect(mockedTx.clearAll).toHaveBeenCalled();

---

**User:**

expect(screen.getByText(/Laatste transacties:\s*0/i)).toBeTruthy();

---

**Gemini:**

});

---

**User:**

expect(screen.queryByText(/Boodschappen/i)).toBeNull();

---

**Gemini:**

});

---

**User:**

});

---

**Gemini:**

=========

---

**User:**

import React from 'react';

---

**Gemini:**

import {

---

**User:**

screen,

---

**Gemini:**

cleanup,

---

**User:**

fireEvent,

---

**Gemini:**

waitFor,

---

**User:**

act

---

**Gemini:**

} from '@testing-library/react-native';

---

**User:**

import { render } from '@test-utils/index'; // Gebruik je nieuwe render met providers

---

**Gemini:**

import { UndoScreen } from '../UndoScreen';

---

**User:**

import { TransactionService } from '@services/transactionService';

---

**Gemini:**

/**

---

**User:**

* Helper om robuust tekst te vinden, zelfs als React Native deze opsplitst

---

**Gemini:**

* in de Virtual DOM (zoals bij "Boodschappen: € 12.5")

---

**User:**

*/

---

**Gemini:**

async function waitForTextContaining(

---

**User:**

searchText: string,

---

**Gemini:**

options?: { timeout?: number }

---

**User:**

): Promise<void> {

---

**Gemini:**

await waitFor(() => {

---

**User:**

const allTexts = screen.toJSON();

---

**Gemini:**

const stringified = JSON.stringify(allTexts);

---

**User:**

expect(stringified).toContain(searchText);

---

**Gemini:**

}, options);

---

**User:**

}

---

**Gemini:**

// 1. Mock de service

---

**User:**

jest.mock('@services/transactionService', () => ({

---

**Gemini:**

TransactionService: {

---

**User:**

getAllTransactions: jest.fn(),

---

**Gemini:**

clearAll: jest.fn(),

---

**User:**

},

---

**Gemini:**

}));

---

**User:**

const mockedTx = TransactionService as jest.Mocked<typeof TransactionService>;

---

**Gemini:**

describe('UndoScreen Integratie Tests', () => {

---

**User:**

beforeEach(() => {

---

**Gemini:**

jest.clearAllMocks();

---

**User:**

});

---

**Gemini:**

afterEach(cleanup);

---

**User:**

it('moet transacties laden en de omschrijvingen tonen (met snapshot)', async () => {

---

**Gemini:**

const mockData = [

---

**User:**

{ id: '1', amount: 12.5, description: 'Boodschappen' },

---

**Gemini:**

{ id: '2', amount: 45.0, description: 'Tanken' },

---

**User:**

];

---

**Gemini:**

mockedTx.getAllTransactions.mockResolvedValueOnce(mockData);

---

**User:**

// We renderen binnen act() omdat de useEffect direct een state-update triggert

---

**Gemini:**

await act(async () => {

---

**User:**

render(<UndoScreen />);

---

**Gemini:**

});

---

**User:**

// Wacht tot de data zichtbaar is via de robuuste helper

---

**Gemini:**

await waitForTextContaining('Boodschappen');

---

**User:**

await waitForTextContaining('Tanken');

---

**Gemini:**

// Snapshot is nu veilig omdat de UI 'settled' is

---

**User:**

expect(screen.toJSON()).toMatchSnapshot();

---

**Gemini:**

});

---

**User:**

it('moet omgaan met undefined data van de service', async () => {

---

**Gemini:**

mockedTx.getAllTransactions.mockResolvedValueOnce(undefined as any);

---

**User:**

await act(async () => {

---

**Gemini:**

render(<UndoScreen />);

---

**User:**

});

---

**Gemini:**

// Gebruik de regex fix uit "de fix.txt"

---

**User:**

const counter = await screen.findByText(/Laatste transacties:\s*0/i);

---

**Gemini:**

expect(counter).toBeTruthy();

---

**User:**

expect(screen.getByText(/Geen recente transacties/i)).toBeTruthy();

---

**Gemini:**

});

---

**User:**

it('moet alle transacties verwijderen als op de knop wordt gedrukt', async () => {

---

**Gemini:**

const mockData = [{ id: '1', description: 'Boodschappen', amount: 10 }];

---

**User:**

mockedTx.getAllTransactions.mockResolvedValueOnce(mockData);

---

**Gemini:**

mockedTx.clearAll.mockResolvedValueOnce(undefined);

---

**User:**

await act(async () => {

---

**Gemini:**

render(<UndoScreen />);

---

**User:**

});

---

**Gemini:**

// Wacht tot initieel geladen

---

**User:**

await screen.findByText(/Boodschappen/i);

---

**Gemini:**

// Actie: Verwijderen

---

**User:**

await act(async () => {

---

**Gemini:**

fireEvent.press(screen.getByRole('button', { name: /Verwijder Alles/i }));

---

**User:**

});

---

**Gemini:**

// Wacht tot de service is aangeroepen EN de UI is bijgewerkt naar 0

---

**User:**

await waitFor(() => {

---

**Gemini:**

expect(mockedTx.clearAll).toHaveBeenCalled();

---

**User:**

expect(screen.getByText(/Laatste transacties:\s*0/i)).toBeTruthy();

---

**Gemini:**

});

---

**User:**

expect(screen.queryByText(/Boodschappen/i)).toBeNull();

---

**Gemini:**

});

---

**User:**

});

---

**Gemini:**

==========

---

**User:**

voeg boevenstaande toe aan onderstaande

---

**Gemini:**

Het lijkt erop dat je de eerdere verbeteringen (de "Fixes" waarbij act handmatig werd verwijderd) wilt samenvoegen met de volledige testfile-structuur. In de onderstaande versie heb ik de code geconsolideerd.

---

**User:**

Wat is er aangepast?
TypeScript
Belangrijke tips voor het testen:

---

**Gemini:**

Zal ik ook een voorbeeld toevoegen van hoe je een Error state (bijv. als de service crasht) kunt testen in dit scherm?

---

**User:**

Tools
Snel

---

**Gemini:**

Gemini kan fouten maken, ook over mensen, dus dubbelcheck de reacties. Je privacy en Gemini
Opent in een nieuw venster