# Handleiding: InjectQualifiedModules Macro

## Doel
Automatisch alle modules vervangen door gekwalificeerde versies uit .txt-bestanden.

## Vereisten
1. Zet alle .txt-bestanden (Utils.txt, Reporting.txt, MonthlySheet.txt, enz.) in dezelfde map als het Excel-bestand.
2. Schakel toegang tot VBA-project in:
   - Excel → Bestand → Opties → Vertrouwenscentrum → Instellingen → Macro-instellingen → Vink **"Vertrouwens­toegang tot het VBA project-objectmodel"** aan.

## Installatie
1. Open VBA-editor (Alt+F11).
2. Voeg een nieuwe standaardmodule toe (Insert → Module).
3. Plak de inhoud van `macro_inject_qualified.txt` in deze module.

## Uitvoeren
1. Ga terug naar Excel → Alt+F8 → kies `InjectQualifiedModules` → klik **Run**.
2. De macro:
   - Verwijdert bestaande standaardmodules en classmodules.
   - Injecteert nieuwe code uit .txt-bestanden.
   - Update ThisWorkbook en bestaande UserForms.

## Na afloop
- Compileer: VBA-editor → Debug → Compile VBAProject.
- Test functionaliteit (Workbook_Open, forms, rapportage).

## Belangrijk
- Forms worden niet aangemaakt uit .txt; alleen code wordt geüpdatet.
- Enum-fouten voorkomen: gebruik `Utils.dbDate` etc.
- Nz-fouten opgelost: gebruik directe checks of Public Nz in Utils.
