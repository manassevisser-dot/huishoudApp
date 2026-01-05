**Geëxporteerd:** 4-1-2026, 12:26:28
**Aantal berichten:** 2

---
**User:**

Je zei:

Waar kan ik in VBA -editor excel het volgende vinden (ik heb nl-versie) Als compile errors verschijnen: Tools->References -> zorg dat "Microsoft Forms 2.0 Object Library" aangevinkt is.

---

**ChatGPT:**

In de Nederlandse versie van de VBA-editor heet het menu Extra → Verwijzingen.
Daar vind je dezelfde lijst met libraries (“References”).
✔ Zo kom je erbij

Druk ALT + F11 om de VBA-editor te openen.

Ga in de menubalk naar Extra.

Kies Verwijzingen…

In de lijst zoek je Microsoft Forms 2.0 Object Library en vink je het aan.

Klik OK.

⚠ Belangrijk als je Forms 2.0 niet ziet
In sommige Excel-installaties verschijnt Microsoft Forms 2.0 Object Library niet standaard. Dit kun je oplossen door:
Optie A — Voeg een willekeurige UserForm toe

In de VBA-editor: Invoegen → UserForm.

Ga weer naar Extra → Verwijzingen.

Nu staat Microsoft Forms 2.0 Object Library vrijwel altijd in de lijst.

| Key | Value |
| --- | --- |
| Optie B | Alleen als het echt nodig is |
| Mocht het nog steeds niet zichtbaar zijn, kun je een MSForms | object forceren door bijv. een TextBox of ComboBox op je UserForm te plaatsen. Daarna verschijnt de library vrijwel altijd in de lijst. |

Wil je dat ik check of jouw code Forms 2.0 wel écht nodig heeft? Dat voorkomt soms onnodige problemen.