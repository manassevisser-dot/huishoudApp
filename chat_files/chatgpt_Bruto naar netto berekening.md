**Geëxporteerd:** 4-1-2026, 12:31:57
**Aantal berichten:** 6

---
**User:**

Je zei:

Is het te achterhalen hoe brutoinkomen naar nettoinkomen berekend wordt?

---

**ChatGPT:**

| Key | Value |
| --- | --- |
| Ja, het is goed mogelijk om te achterhalen hoe bruto | inkomen naar netto-inkomen wordt berekend, al hangt het wel af van het land en de specifieke regels voor belastingen, premies en aftrekposten. Omdat je in Nederland bent, kan ik uitleggen hoe het daar werkt. |
| 1️⃣ Bruto naar netto | de hoofdlijnen |
| Het bruto | inkomen is het bedrag dat je verdient vóór belastingen en premies. Het netto-inkomen is wat je uiteindelijk “op je rekening” krijgt. Om van bruto naar netto te gaan, moet je meestal rekening houden met: |

Loonbelasting / inkomstenbelasting

Progressief tarief (schijven), afhankelijk van hoeveel je verdient.

In 2025 bijvoorbeeld:

Schijf 1: €0 – €77.000 → 36,93% (inclusief premie volksverzekeringen)

Schijf 2: >€77.000 → 49,50%

Premies volksverzekeringen

AOW, Anw, WLZ (voor iedereen die in NL woont of werkt).

Worden vaak al gecombineerd met de eerste schijf van de loonbelasting.

Werknemersverzekeringen

WW, ZW, WIA, etc. (worden door werkgever ingehouden).

Pensioenpremies

Worden meestal door werkgever ingehouden en zijn afhankelijk van je pensioenregeling.

Overige inhoudingen

Zorgpremie (basisverzekering)

Mogelijke vrijwillige inhoudingen (bijv. vakbond, spaarregeling)

Belastingkortingen

Algemene heffingskorting

Arbeidskorting

Eventueel andere kortingen (inkomensafhankelijk)

2️⃣ Formulematig
Een vereenvoudigde berekening kan zo worden weergegeven:
Netto-inkomen=Bruto-inkomen−Loonbelasting−Premies werknemersverzekeringen−Pensioenpremie+Belastingkortingen\text{Netto-inkomen} = \text{Bruto-inkomen} 
- \text{Loonbelasting} 
- \text{Premies werknemersverzekeringen} 
- \text{Pensioenpremie} 
+ \text{Belastingkortingen}Netto-inkomen=Bruto-inkomen−Loonbelasting−Premies werknemersverzekeringen−Pensioenpremie+Belastingkortingen
Voor iemand met alleen loon en standaardkortingen kan je het vaak terugbrengen tot:
Netto≈Bruto−(Bruto×Gemiddeld belastingtarief)+Kortingen\text{Netto} \approx \text{Bruto} - (\text{Bruto} \times \text{Gemiddeld belastingtarief}) + \text{Kortingen}Netto≈Bruto−(Bruto×Gemiddeld belastingtarief)+Kortingen
Het “gemiddeld belastingtarief” kan je berekenen door de belasting in elke schijf te wegen naar het inkomen dat in die schijf valt.

Als je wilt, kan ik een stap-voor-stap rekenmodel in Excel of TypeScript maken waarmee je exact van bruto naar netto kunt berekenen voor een willekeurig inkomen in Nederland, inclusief alle kortingen en premies.
Wil je dat ik dat doe?

---

**User:**

Je zei:

Ja, maak een typescript rekenmodel voor brute-netto berekening. Neem alle beschikbare gegevens tot je die je kan vinden op het internet in de formules; ga ervanuit dat sommige variabelen makkelijk geinjecteertd worden door gebruikers van mijn app

---

**ChatGPT:**

![image-0](https://www.google.com/s2/favicons?domain=https://www.deloitte.com&sz=32)

![image-1](https://www.google.com/s2/favicons?domain=https://www.kvk.nl&sz=32)

![image-2](https://www.google.com/s2/favicons?domain=https://www.meijburg.nl&sz=32)

---

**User:**

Je zei:

breidt uit met een nett naar bruto formule

---

**ChatGPT:**

Perfect! Het omrekenen van netto naar bruto is iets ingewikkelder, omdat je in Nederland met progressieve belasting en heffingskortingen werkt. Het kan niet in één simpele formule, maar we kunnen het iteratief / numeriek benaderen. Ik breid je bestaande TypeScript-module uit met een nettoNaarBruto() functie.

| nettoTarget: number |  |
| --- | --- |
| tolerance: number = 1 |  |

| for (let i = 0; i < maxIter; i++) { | for (let i = 0; i < maxIter; i++) { |
| --- | --- |
| const nettoGuess = brutoNaarNetto(brutoGuess).netto; | const nettoGuess = brutoNaarNetto(brutoGuess).netto; |
| const error = nettoGuess - nettoTarget; | const error = nettoGuess - nettoTarget; |

| if (Math.abs(error) <= tolerance) { | if (Math.abs(error) <= tolerance) { |
| --- | --- |
| return brutoGuess; | return brutoGuess; |
| } | } |

| upper = brutoGuess |  |
| --- | --- |
| lower = brutoGuess |  |

    brutoGuess = (upper + lower) / 2;
  }

| console.warn("Max iteraties bereikt, resultaat is een benadering") |  |
| --- | --- |
| return brutoGuess |  |

| const gewensteNetto = 32000 |  |
| --- | --- |
| const berekendBruto = nettoNaarBruto(gewoneNetto) |  |
| `) |  |

🔹 Hoe werkt dit?

We gebruiken een binaire zoekmethode:

Begin met een aannemelijk minimum (0) en maximum (200k) bruto.

Bereken het netto bij de gokwaarde.

Pas de gokwaarde aan afhankelijk of de berekende netto te hoog of te laag is.

Stop zodra het verschil binnen een tolerantie valt (standaard €1).

Retourneer het gevonden bruto.

🔹 Wat dit model nog steeds eenvoudig maakt

Alle parameters van belasting, premies en heffingskortingen blijven injecteerbaar.

Je kunt dezelfde taxBrackets2025 en baseTaxCredits gebruiken.

Kan makkelijk uitgebreid worden naar maand/uur, 30%-regeling, of andere aftrekposten.

Als je wilt, kan ik dit model volledig combineren in één TypeScript-module waarin je beide richtingen (bruto → netto & netto → bruto) direct kan gebruiken en waar alle parameters configureerbaar zijn voor een app‑omgeving.
Wil je dat ik dat doe?