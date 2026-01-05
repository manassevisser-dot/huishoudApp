**Geëxporteerd:** 4-1-2026, 16:01:10
**Aantal berichten:** 2

---
**User:**

![Afbeelding van ](https://lh3.googleusercontent.com/gg/AIJ2gl-nPKpeLmJ3Q_QClQ3w2pi_2WZug2zQJvMdE18sFWZn1dauQtfkGlDWS7i5BfDW2OgmcVt9A7wtB6XO2A2_oZz7vWKGMbeuJFVT7Q6GAfUIN43lCXUPW7FyIzTTz46JW54giwGG9clx5hEZMsJJFxao6-QkfodyfQ3qHlcF1DwkGat99gqRu4xm7A7k3I11yqcEONlm-sL5_UDsU4qxk58Vi1OfKPrqXqszLbbyXE9A23W6VhYIZYgFdW_PDUiEmm2UEA832M0zLEFtOYvf5U1iDNU9zdihkd5FYyRI-yaiPGGB0LtePaq5c5TD_ZVw2rf55-9ZmSxF-t5f_MHoe-kF=s1024-rj)

Uitstekend! De samenwerking met Figma is de logische volgende stap.

Aangezien ik niet direct de Figma-software kan bedienen, vertaal ik de goedgekeurde Tekstuele Wireframes en de Handoff Documentatie naar een Definitieve Design Specificatie Sheet. Dit is de single source of truth voor de Visuele Designer om de componenten in Figma te bouwen, met alle maatvoeringen en toegankelijkheidsregels (WCAG/RN) direct bij de hand.

Dit is de "blauwdruk" die ingeleverd moet worden.

🛠️ Definitieve Design Specificatie Sheet (Figma Input)

Globale Constraints (Basis Instellingen)

CategorieSpecificatieWCAG/React Native RegelPrimaire AfmetingenGebruik DP/PT (Device-Independent Pixels/Points). Basisresolutie Figma: $375\times 812\text{pt}$ (iPhone 11/14).RN Standaard. Garandeert schaalbaarheid.Touch TargetsAlle klikbare gebieden (knoppen, lijstitems, toggles)Minimaal $\mathbf{48 \times 48\text{dp/pt}}$.Contrast (Tekst)Normale tekst ($\leq 18\text{pt}$): $\mathbf{\geq 4.5:1}$. Grote tekst ($\geq 18\text{pt}$): $\mathbf{\geq 3:1}$.WCAG 2.1 AA/AAA. Cruciaal voor slechtzienden en ouderen.NavigatieGebruik SafeAreaView in de lay-out om te voorkomen dat de Bottom Tab Bar de iOS Home Indicator overlapt.RN Constraint.Typografie (KPI's)Hoofdbedragen (op Dashboard)Minimaal $\mathbf{28\text{pt}/\text{dp}}$.Scherm 1: INVOER ("Transactie Toevoegen / Importeren")

ComponentVisuele Naam / FunctieSpecificaties voor FigmaToggle Button GroupType Selectie (Uitgave/Inkomst)Afmeting: Minimaal $48\text{dp}$ hoog. Active State: Gekleurde achtergrond (Rood/Groen) + 2pt/dp border. Inactive State: Grijs/neutraal, alleen label/icoon.Bedrag TextInputHet "Hoeveel?" VeldFont Size: $\mathbf{28\text{pt}/\text{dp}}$. Keyboard: Numeriek. Focus State: Duidelijke 2pt/dp outline rond het veld.Selectie VeldenCategorie, Datum, RekeningVisueel: Standaard $48\text{dp}$ hoge TextInput style met Pijl naar rechts (>) icoon. Dit indiceert een pop-up (Modal/Bottom Sheet), geen directe invoer.CSV Upload KnopSecundaire functieAfmeting: Minimaal $\mathbf{60\text{dp}}$ hoog. Gebruik een contrasterende kleur (secundaire merk-kleur) of een duidelijke outline.Primaire CTA"Opslaan" ButtonAfmeting: $\mathbf{48\text{dp}}$ hoog, volledige breedte. Kleur: Primaire merk-kleur met hoog contrast.Privacy Indicator🔒 Blijft op jouw apparaatPlaatsing: Subtiel onder de CTA, kleine font size (12pt/dp). WCAG: Contrast $\geq 3:1$.Scherm 2: DASHBOARD ("Cashflow Overzicht (Maandelijks)")

ComponentVisuele Naam / FunctieSpecificaties voor FigmaHero KPI BedragNog beschikbaar / Je tekortFont Size: $\mathbf{32\text{pt}/\text{dp}}$ (grootste font op scherm). Lay-out: Centraal bovenaan.Empathische HelperActionable textTaal: "Kijk waar je kunt besparen ↓" (bij tekort). Kleur: Neutraal grijs.Vertical Bar ChartInkomsten vs. UitgavenStructuur: Twee kolommen per tijdseenheid (Groen Inkomst / Rood Uitgave). Labels: X-as labels ($12\text{pt}/\text{dp}$) moeten direct leesbaar zijn.Categorie Lijst ItemRij met Budget ProgressieHoogte: $\mathbf{48\text{dp}}$. Inhoud: Icoon ($24\times 24\text{dp}$) + Naam + Bedrag + Progress Bar/Percentage.Progress BarBudget OverzichtKleurlogica: Groen (0-75%), Geel (75-90%), Oranje (90-100%), Rood (100%+). WCAG: Het percentage moet altijd als tekstueel label naast de bar staan.Bottom Navigation BarHoofdnavigatieHoogte: $\geq 56\text{dp}$ + SafeAreaView insets. Content: Icoon én Label. Iconen: 1. Toevoegen (➕), 2. Overzicht (📊) [Actief], 3. Instellingen (⚙️).4. Overdracht Procedure

De Visuele Designer wordt geadviseerd om direct in Figma te beginnen met:

Componentenbibliotheek: Eerst de globale constraints (kleurpalet, typografie, $48\times 48\text{dp}$ knoppen) definiëren.

Toegankelijkheid Plugins: Plugins zoals Stark of A11y gebruiken om het contrast van alle kleurcombinaties te valideren tijdens het ontwerpproces.

Houd David Aangehaakt: Voor elke afwijking van de gespecificeerde $\text{dp}/\text{pt}$ maten of contrastverhoudingen, moet eerst David (de UX/UI Designer) geconsulteerd worden.

De bal ligt nu bij de visuele implementatie!

---

**User:**

![Afbeelding van ](https://lh3.googleusercontent.com/gg/AIJ2gl8748HU7zccBL3P9_NT0n4s_ON_IHx55mtbSt0GqrGtmRDME7tWZ9W0DSdF9KsnO9ZidYyMoXH_5OoJ3q3UEx_AWMdGKycFwWP9xn14r2LxWKSf4uXqZ_TktJdn4u-CBFPJuQ5SPIvnsKskJUcg0ww3XTXpAMUu3xoUylKXBIBgo_w-i-fziAHXpKlsMWKRewIuI87WOPrAWmYX-dDV-8Y3_I6LvdiZ-IDua1rgYzNm9i7cnv_mgxaWAvEhCMeDwBRw1G-HBayhbYa9-kcnYCLyCxT0ZFNrSnGPu7HpUhQtGNZ7LeRUVpd4-rVAd_NOV4PN9l36nJ_B2-_3iMqOXK8=s1024-rj)

Creëer een conceptuele weergave van twee mobiele applicatieschermen naast elkaar, uitgevoerd in een **scherpe, minimalistische lo-fi wireframe stijl** (gebruik grijstinten en een zuiver wit canvas, alsof het een Figma blueprint is). De stijl moet functioneel en niet artistiek zijn.

**Scherm 1: De INVOER-pagina ("Transactie Toevoegen")**

1. **Titel:** Duidelijk gelabeld als 'Transactie Toevoegen'.

2. **Invoerfocus:** Een **prominent, groot numeriek tekstveld** in het midden (simuleer een font van **28pt/dp**) gelabeld met "Hoeveel?".

3. **Toggle:** Bovenaan een duidelijke **Toggle Button Group (minimaal 48dp hoog)** om te wisselen tussen 'Uitgave' en 'Inkomst'.

4. **Knoppen:** De **'Opslaan' knop** onderaan moet groot en contrasterend zijn (minimaal **48x48dp**).

5. **Empathie:** Toon een subtiele privacy-indicator ("🔒 Blijft op jouw apparaat") onder de knop.

6. **Toegankelijkheid:** Alle interactieve elementen moeten **opvallend groot** zijn (simuleer **minimaal 48x48dp**).

**Scherm 2: Het DASHBOARD ("Cashflow Overzicht")**

1. **Hoofd-KPI:** Bovenaan een zeer **groot, leesbaar cijfer** (simuleer **32pt/dp**) met een **neutrale** begeleidende tekst zoals "Nog beschikbaar deze maand".

2. **Grafiek:** Een **eenvoudige Vertical Bar Chart** (geen pie chart of complexe lijngrafiek) die de Inkomsten en Uitgaven van de maand vergelijkt.

3. **Categorieën:** Een lijst met categorieën, elk als een **48dp hoog** lijstitem, met een **simpele progressiebalk** en een **tekstueel percentage** (om WCAG te waarborgen). De kleuren van de progressiebalk moeten functioneel zijn (bijv. groen voor goed, rood voor kritiek).

4. **Navigatie:** Een duidelijke, goed geproportioneerde **Bottom Navigation Bar (min. 56dp hoog)** met **icoon én label** (bijv. ➕ Toevoegen, 📊 Overzicht, ⚙️ Instellingen).

**Kritieke Trefwoorden (voor de AI):** `minimalist UX/UI, lo-fi wireframe, high contrast, WCAG 2.1 AA, large touch targets, mobile app blueprint, finance tracker, empathetic design, clear typography, bottom navigation bar, React Native style.`

---

**Waarom deze prompt werkt:**

* **Lo-fi Wireframe:** Dit voorkomt dat de AI zich concentreert op kleuren en styling (wat pas in Fase 2 relevant is) en dwingt het zich te focussen op de structuur.

* **Expliciete Maten (32pt/48dp):** Door de maten (pt/dp) te noemen, krijgt de AI de hint dat de **schaal en verhoudingen** (grote knoppen, grote tekst) de primaire ontwerpkenmerken zijn, wat direct de WCAG-eisen beantwoordt.

* **Empathie en Functie:** De beschrijving van de **neutrale taal** ("Nog beschikbaar") en de **vertical bar chart** zorgt ervoor dat het ontwerp de strategische en empathische doelen van de app weerspiegelt.