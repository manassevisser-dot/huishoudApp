**Geëxporteerd:** 4-1-2026, 12:30:59
**Aantal berichten:** 4

---
**User:**

Je zei:

Geef mij zoveel mogelijk formules om financiële analyses te maken

---

**ChatGPT:**

Hier is een uitgebreide, praktisch geordende formule-verzameling voor financiële analyses. Ik heb ze gegroepeerd zodat je ze direct kunt toepassen in Excel / Sheets / BI-tools / code en ook kunt gebruiken in beleids-, uitkerings- of huishoudanalyses (sluit aan bij jouw werk rond bestaanszekerheid en besluitlogica).

1. Basis financiële rekenkunde
Totale waarde
iniCode kopiërenTotaal = Σ (waarde_i)

Gemiddelde
iniCode kopiërenGemiddelde = Σ x / n

Gewogen gemiddelde
cssCode kopiërenΣ (x × gewicht) / Σ gewicht

Percentage
matlabCode kopiërenDeel / Geheel × 100%

Index (basisjaar = 100)
iniCode kopiërenIndex = (Huidige waarde / Basiswaarde) × 100

2. Inkomsten, uitgaven & saldo
Netto inkomen
nginxCode kopiërenBruto inkomen − Belastingen − Premies

Beschikbaar inkomen
nginxCode kopiërenNetto inkomen + Toeslagen − Vaste lasten

Maandelijks saldo
nginxCode kopiërenInkomsten − Uitgaven

Structureel tekort
nginxCode kopiërenStructurele uitgaven − Structurele inkomsten

Spaarquote
nginxCode kopiërenSparen / Netto inkomen

3. Groei, trend & verandering
Absolute groei
nginxCode kopiërenNieuw − Oud

Relatieve groei
(Nieuw − Oud) / Oud

Groei in %
((Nieuw − Oud) / Oud) × 100

Samengestelde groei (CAGR)
scssCode kopiëren( Eind / Begin )^(1/n) − 1

Trend (lineair)
iniCode kopiëreny = a + bt

4. Kasstromen & tijdswaarde van geld
Toekomstige waarde (FV)
iniCode kopiërenFV = PV × (1 + r)^n

Contante waarde (PV)
iniCode kopiërenPV = FV / (1 + r)^n

Netto Contante Waarde (NCW / NPV)
cssCode kopiërenΣ (Kasstroom_t / (1 + r)^t) − Initiële investering

Interne opbrengstvoet (IRR)
iniCode kopiërenNCW = 0

Payback-periode
nginxCode kopiërenInvestering / Jaarlijkse kasstroom

5. Schulden & draagkracht
Schuldquote
nginxCode kopiërenTotale schuld / Jaarinkomen

Aflossingsratio
nginxCode kopiërenMaandelijkse aflossing / Netto maandinkomen

Rente-lastenratio
nginxCode kopiërenRentelasten / Netto inkomen

Beslagvrije ruimte (vereenvoudigd)
nginxCode kopiërenNetto inkomen − beslagvrije voet

Leencapaciteit
mathematicaCode kopiërenMax maandlast / (Rente + Aflossingsfactor)

6. Liquiditeit & buffers
Liquiditeitsratio
nginxCode kopiërenVlottende activa / Kortlopende verplichtingen

Buffermaanden
nginxCode kopiërenVrij beschikbaar vermogen / Maanduitgaven

Noodbuffer
Code kopiëren3–6 × maandelijkse vaste lasten

7. Kosten- en efficiëntieanalyse
Kostprijs per eenheid
nginxCode kopiërenTotale kosten / Aantal eenheden

Marginale kosten
Δ Totale kosten / Δ Output

Kostenratio
nginxCode kopiërenKosten / Opbrengsten

Efficiency
cssCode kopiërenOutput / Input

8. Break-even & scenarioanalyse
Break-even punt
nginxCode kopiërenVaste kosten / (Prijs − Variabele kosten)

Scenario-impact
nginxCode kopiërenNieuw saldo − Huidig saldo

Gevoeligheidsanalyse
powershellCode kopiërenΔ Resultaat / Δ Parameter

9. Ongelijkheid & verdeling
Gini-coëfficiënt
scssCode kopiëren1 − Σ (Yi + Yi−1)(Xi − Xi−1)

Mediaan
kotlinCode kopiërenMiddenwaarde gesorteerde data

P90 / P10 ratio
Code kopiëren90e percentiel / 10e percentiel

10. Beleids- en uitkeringsanalyse (NL-gericht)
Vervangingsratio
nginxCode kopiërenUitkering / Laatstverdiend loon

Armoede-gap
nginxCode kopiërenArmoedegrens − Beschikbaar inkomen

Marginale druk
scssCode kopiëren1 − (Δ Netto inkomen / Δ Bruto inkomen)

Toeslag-afbouw
nginxCode kopiërenAfbouwpercentage × Extra inkomen

Werk-loont
nginxCode kopiërenNetto inkomen werk − Netto inkomen uitkering

11. Risico & onzekerheid
Variantie
cssCode kopiërenΣ (x − μ)² / n

Standaarddeviatie
√ Variantie

Value at Risk (VaR)
mathematicaCode kopiërenMax verwacht verlies bij α%

Worst-case scenario
nginxCode kopiërenMinimum uitkomstenverdeling

12. Samengestelde huishoudformules (praktisch)
Financiële stress-indicator
scssCode kopiëren(Vaste lasten / Netto inkomen) > 0,6

Betaalbaarheid wonen
nginxCode kopiërenWoonlasten / Netto inkomen

Kwetsbaarheidsindex
( Schuldenratio + Kostenratio + Inkomensonzekerheid ) / 3

13. Excel-/Sheets-equivalenten
objectivecCode kopiëren=NPV()
=IRR()
=CAGR()
=AVERAGE()
=SUM()
=PERCENTILE()
=STDEV()

Wil je vervolgstappen?
Ik kan dit verder omzetten naar:

📊 Excel-template (huishouden / beleid / dashboard)

🧮 Beslisboomformules (zoals bij jouw uitkeringentool)

🧠 Score-model / index (bestaanszekerheid, risicoprofiel)

⚙️ TypeScript / Python formules (voor je app)

Zeg maar waar je het voor gebruikt, dan maak ik het operationeel i.p.v. theoretisch.

---

**User:**

Je zei:

📊 Excel-template (huishouden / beleid / dashboard)  🧮 Beslisboomformules (zoals bij jouw uitkeringentool)  🧠 Score-model / index (bestaanszekerheid, risicoprofiel)  Alle bovenstaande formules,  en deze drie, maar dan in typscript in 1 bestand

---

**ChatGPT:**

| Key | Value |
| --- | --- |
| Financial Models· typescriptKopiërenBewerkenDownloaden/* financialModels.ts | ------------------------------------------------- Centrale verzameling van financiële formules + - Huishoud Excel-logica (1-op-1 formules) - Beslisboomformules (uitkering / beleid) - Score-model bestaanszekerheid & risicoprofiel Doel: - Direct bruikbaar in frontend (React / RN) - Herbruikbaar in backend / decision engines - Volledig deterministisch (geen side-effects)*//* ================================================== 1. BASIS FINANCIËLE FUNCTIES================================================== */export const sum = (values: number[]): number => values.reduce((a, b) => a + b, 0);export const average = (values: number[]): number => values.length === 0 ? 0 : sum(values) / values.length;export const weightedAverage = (values: number[], weights: number[]): number => { const totalWeight = sum(weights); if (totalWeight === 0) return 0; return values.reduce((acc, v, i) => acc + v * (weights[i] ?? 0), 0) / totalWeight;};export const percentage = (part: number, total: number): number => total === 0 ? 0 : part / total;export const indexValue = (current: number, base: number): number => base === 0 ? 0 : (current / base) * 100;Klaar. |
| Je hebt nu één samenhangend TypeScript | bestand met: |

📊 Excel-equivalente huishoudformules (1-op-1 vertaalbaar)

🧮 Beslisboomlogica (uitkering / beleid, deterministisch)

🧠 Score-model bestaanszekerheid + risicoprofiel

🔢 Alle kernformules (inkomen, groei, NPV, schulden, risico)

Dit bestand is bewust sober en beleidsproof opgezet:

geen framework-afhankelijkheid

geschikt voor frontend, backend én decision engines

makkelijk te testen

uitbreidbaar zonder refactors

Hoe je dit praktisch inzet

Excel → TypeScript: elke functie is direct herleidbaar tot een cel-formule

Beslisboom: heeftRechtOpBijstand → aanvullendeUitkering → score → risicoprofiel

Dashboard: scores (0–100) zijn direct visualiseerbaar

Beleid: drempels (bijstandsnorm, vermogensgrens) zijn parametrisch

Volgende logische uitbreidingen (zeg maar wat je wilt)

🔁 Exacte NL-bijstandsnormen & toeslag-afbouw modelleren

🌳 Volledige beslisboom (PW, IOAW, IOAZ, AOW, ANW, Wajong)

📊 Dashboard-ready selectors (per huishouden / scenario)

🧪 Testcases (edge cases, extreme huishoudens)

🧩 Opsplitsen in domain modules zonder duplicatie

Dit is een sterke kern voor een serieuze bestaanszekerheids-tool.
Zeg welke richting je nu op wilt, dan bouw ik daarop door.