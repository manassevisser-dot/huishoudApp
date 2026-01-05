# Stappenplan v5.3 – Implementatie & Test

Dit document bevat een volledig stappenplan vanaf INI [22_test_frminvoer]. Het is **superduidelijk** en geschikt voor Notepad++ inklapbare secties.

## 1. Sanity-check
Voer een sanity-check uit om te controleren of alle vereiste shapes, specs en modules aanwezig zijn.
- Open `frmDebugDashboard` en klik op **Sanity-check**.
- Verwacht: rapport met OK/Waarschuwing/FOUT per asset en specs.
- Fix ontbrekende shapes of tabelrijen in `Referenties!tblLayoutSpecs`.

### Codevoorbeeld
```vba
Call modSanityChecks.RunAssetSanity(True)
```

## 2. Patches per UserForm
### frmHuishouden
```vba
Private Sub UserForm_Initialize()
FormHelpers.EnsureBackgroundImage Me
frmBuilders.BuildForm_Huishouden Me
LayoutSpecsHelpers.BuildButtonsFromSpecs Me
FormLayout.FrmLayoutSafeAreaDyn Me
FormEvents.HookEventsDynamic Me
End Sub
```

### frmVast
```vba
Private Sub UserForm_Initialize()
FormHelpers.EnsureBackgroundImage Me
frmBuilders.BuildFrmVast Me
LayoutSpecsHelpers.PlaceButtonFromSpec Me, FormLayout.DYN_PREFIX & "imgBtnVorige", "Prev"
LayoutSpecsHelpers.PlaceButtonFromSpec Me, FormLayout.DYN_PREFIX & "imgBtnVolgende", "Next"
LayoutSpecsHelpers.PlaceButtonFromSpec Me, FormLayout.DYN_PREFIX & "imgBtnOpslaan", "Save"
LayoutSpecsHelpers.PlaceButtonFromSpec Me, FormLayout.DYN_PREFIX & "imgBtnAnnuleren", "Cancel"
FormLayout.FrmLayoutSafeAreaDyn Me
FormEvents.HookEventsDynamic Me
End Sub
```

### frmInvoer
```vba
Private Sub UserForm_Initialize()
FormEvents.BuildDynamicFrmInvoer Me
LayoutSpecsHelpers.BuildButtonsFromSpecs Me
FormLayout.FrmLayoutSafeAreaDyn Me
FormEvents.HookEventsDynamic Me
End Sub
```

### Optie later toevoegen; weet niet waar code te plaatsten
## 3. Optionele Background via Specs
Voeg een rij toe in `tblLayoutSpecs` met Key=Background en ShapeName=bg_frmInvoer_landscape.
### Codepatch
```vba
Public Function GetBackgroundShapeNameFromSpecs() As String
GetBackgroundShapeNameFromSpecs = CStr(GetLayoutSpec("Background", "ShapeName"))
End Function
```

## 4. Validatie & Navigatie
- frmHuishouden: Adults + Children == TotalPersons (1..8).
- frmVast: Minimaal 1 geldige rij of 'Geen vaste ...' vlag.
- frmInvoer: Bedrag > 0 en categorie gekozen.
- Next/Prev knoppen activeren/deactiveren op basis van validatie.

## 5. Testplan
- Scenario: only_one_adult → Next enabled, frmVast opent.
- Scenario: two_adults_one_child → sums validate, navigation werkt.
- Scenario: hover-check → `_hover` zichtbaar binnen 100ms.
- Resize: Safe-area herpositioneert controls correct.

## 6. Documentatie & Backup
- Documenteer bevindingen in ErrorLog.
- Update handover-bestanden (handover_copilot_v3.yaml).
- Sla op als .xlsm en maak een backup.
