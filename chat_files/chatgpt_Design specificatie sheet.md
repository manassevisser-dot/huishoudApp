**Geëxporteerd:** 4-1-2026, 12:27:21
**Aantal berichten:** 4

---
**User:**

Je zei:

Hierbij de goedgekeurde **Tekstuele Wireframes** en de **Handoff Documentatie** naar een **Definitieve Design Specificatie Sheet**. Dit is de *single source of truth* voor de Visuele Designer om de componenten in Figma te bouwen, met alle maatvoeringen en toegankelijkheidsregels (WCAG/RN) direct bij de hand. 

Dit is de "blauwdruk" die ingeleverd moet worden.

---

## 🛠️ Definitieve Design Specificatie Sheet (Input)

### Globale Constraints (Basis Instellingen)

| Categorie | Specificatie | WCAG/React Native Regel |
| :--- | :--- | :--- |
| **Primaire Afmetingen** | Gebruik **DP/PT** (Device-Independent Pixels/Points). Basisresolutie Figma: $375\times 812\text{pt}$ (iPhone 11/14). | RN Standaard. Garandeert schaalbaarheid. |
| **Touch Targets** | Alle klikbare gebieden (knoppen, lijstitems, toggles) | Minimaal $\mathbf{48 \times 48\text{dp/pt}}$. |
| **Contrast (Tekst)** | Normale tekst ($\leq 18\text{pt}$): $\mathbf{\geq 4.5:1}$. Grote tekst ($\geq 18\text{pt}$): $\mathbf{\geq 3:1}$. | WCAG 2.1 AA/AAA. Cruciaal voor slechtzienden en ouderen. |
| **Navigatie** | Gebruik **SafeAreaView** in de lay-out om te voorkomen dat de **Bottom Tab Bar** de iOS Home Indicator overlapt. | RN Constraint. |
| **Typografie (KPI's)** | Hoofdbedragen (op Dashboard) | Minimaal $\mathbf{28\text{pt}/\text{dp}}$. |

---

### Scherm 1: INVOER ("Transactie Toevoegen / Importeren")

| Component | Visuele Naam / Functie | Specificaties | 
| :--- | :--- | :--- |
| **Toggle Button Group** | Type Selectie (Uitgave/Inkomst) | **Afmeting:** Minimaal $48\text{dp}$ hoog. **Active State:** Gekleurde achtergrond (Rood/Groen) + 2pt/dp border. **Inactive State:** Grijs/neutraal, alleen label/icoon. |
| **Bedrag TextInput** | Het **"Hoeveel?"** Veld | **Font Size:** $\mathbf{28\text{pt}/\text{dp}}$. **Keyboard:** Numeriek. **Focus State:** Duidelijke 2pt/dp outline rond het veld. |
| **Selectie Velden** | Categorie, Datum, Rekening | **Visueel:** Standaard $48\text{dp}$ hoge TextInput style met **Pijl naar rechts (>)** icoon. Dit indiceert een pop-up (Modal/Bottom Sheet), geen directe invoer. |
| **CSV Upload Knop** | Secundaire functie | **Afmeting:** Minimaal $\mathbf{60\text{dp}}$ hoog. Gebruik een contrasterende kleur (secundaire merk-kleur) of een duidelijke outline. |
| **Primaire CTA** | **"Opslaan" Button** | **Afmeting:** $\mathbf{48\text{dp}}$ hoog, volledige breedte. **Kleur:** Primaire merk-kleur met hoog contrast. |
| **Privacy Indicator** | 🔒 Blijft op jouw apparaat | **Plaatsing:** Subtiel onder de CTA, kleine font size (12pt/dp). **WCAG:** Contrast $\geq 3:1$. |

---

### Scherm 2: DASHBOARD ("Cashflow Overzicht (Maandelijks)")

| Component | Visuele Naam / Functie | Specificaties voor Figma |
| :--- | :--- | :--- |
| **Hero KPI Bedrag** | Nog beschikbaar / Je tekort | **Font Size:** $\mathbf{32\text{pt}/\text{dp}}$ (grootste font op scherm). **Lay-out:** Centraal bovenaan. |
| **Empathische Helper** | Actionable text | **Taal:** "Kijk waar je kunt besparen ↓" (bij tekort). **Kleur:** Neutraal grijs. |
| **Vertical Bar Chart** | Inkomsten vs. Uitgaven | **Structuur:** Twee kolommen per tijdseenheid (Groen Inkomst / Rood Uitgave). **Labels:** X-as labels ($12\text{pt}/\text{dp}$) moeten direct leesbaar zijn.  |
| **Categorie Lijst Item** | Rij met Budget Progressie | **Hoogte:** $\mathbf{48\text{dp}}$. **Inhoud:** Icoon ($24\times 24\text{dp}$) + Naam + Bedrag + Progress Bar/Percentage. |
| **Progress Bar** | Budget Overzicht | **Kleurlogica:** Groen (0-75%), Geel (75-90%), Oranje (90-100%), Rood (100%+). **WCAG:** Het percentage moet **altijd** als tekstueel label naast de bar staan. |
| **Bottom Navigation Bar** | Hoofdnavigatie | **Hoogte:** $\geq 56\text{dp}$ + SafeAreaView insets. **Content:** Icoon **én** Label. **Iconen:** 1. Toevoegen (➕), 2. Overzicht (📊) [Actief], 3. Instellingen (⚙️).  |

---

### 4. Overdracht Procedure

De Visuele Designer wordt geadviseerd om direct te beginnen met:
1.  **Componentenbibliotheek:** Eerst de **globale constraints** (kleurpalet, typografie, $48\times 48\text{dp}$ knoppen) definiëren.
2.  **Toegankelijkheid Plugins:** Plugins zoals **Stark** of **A11y** gebruiken om het contrast van alle kleurcombinaties te valideren *tijdens* het ontwerpproces.
3.  **Houd David Aangehaakt:** Voor elke **afwijking** van de gespecificeerde $\text{dp}/\text{pt}$ maten of contrastverhoudingen, moet eerst **David** (de UX/UI Designer) geconsulteerd worden.

---

**ChatGPT:**

Je hebt nu de volledige Definitieve Design Specificatie Sheet aangeleverd — helder en compleet 👌
Alleen: ik zie nog geen opdracht of gewenste output van mij hierbij.
Wil je dat ik:

dit omzet naar een visueel blueprint-document?

er een image/wireframe-visual van genereer?

het herschrijf naar een formeel overdrachtsdocument (PDF/Markdown)?

of moet ik het controleren/aanvullen?

Laat me weten welke deliverable je nu wilt, dan maak ik ’m direct.

---

**User:**

Je zei:

Maak er een image/wireframe-visual van

---

**ChatGPT:**

![Gegenereerde afbeelding](https://chatgpt.com/backend-api/estuary/content?id=file_000000005fbc71f5b8f960945763c4cb&ts=490979&p=fs&cid=1&sig=fbd7d9650d7a61c635385d17a19c3346e1abb23ccbd649b132f63ab0cc8bce9f&v=0)

![Gegenereerde afbeelding](https://chatgpt.com/backend-api/estuary/content?id=file_000000005fbc71f5b8f960945763c4cb&ts=490979&p=fs&cid=1&sig=fbd7d9650d7a61c635385d17a19c3346e1abb23ccbd649b132f63ab0cc8bce9f&v=0)

![Gegenereerde afbeelding](https://chatgpt.com/backend-api/estuary/content?id=file_000000005fbc71f5b8f960945763c4cb&ts=490979&p=fs&cid=1&sig=fbd7d9650d7a61c635385d17a19c3346e1abb23ccbd649b132f63ab0cc8bce9f&v=0)