# Samenvatting van Belangrijkste Acties

- **Uniformeer button-plaatsing via specs**: Gebruik `LayoutSpecsHelpers.PlaceButtonFromSpec` of `BuildButtonsFromSpecs`.
- **Aanroepvolgorde per UserForm**:
  1. `EnsureBackgroundImage(Me)`
  2. Controls bouwen
  3. Knoppen plaatsen via specs
  4. `FrmLayoutSafeAreaDyn(Me)`
  5. `HookEventsDynamic(Me)`
- **Hover-functionaliteit**: Zorg dat `_hover` shapes bestaan en Tag is correct ingesteld.
- **Optionele achtergrond via specs**: Voeg Key=Background in `tblLayoutSpecs` toe.
- **Validatie & Navigatie**: Controleer dat Next/Prev knoppen correct werken en validatieregels actief zijn.


## Workflow Visualisatie

```mermaid
flowchart TD
    A[Start: UserForm Initialize] --> B[EnsureBackgroundImage]
    B --> C[Build Controls]
    C --> D[Place Buttons via Specs]
    D --> E[FrmLayoutSafeAreaDyn]
    E --> F[HookEventsDynamic]
    F --> G{Resize Event?}
    G -->|Ja| E
    G -->|Nee| H[Ready for User Interaction]

    subgraph Forms
        I[frmHuishouden]
        J[frmVast (MultiPage)]
        K[frmInvoer]
    end

    H --> I
    I --> J
    J --> K
```
