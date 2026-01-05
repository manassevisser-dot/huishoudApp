**Geëxporteerd:** 4-1-2026, 12:24:47
**Aantal berichten:** 2

---
**User:**

Je zei:

wat gaat er mis in deze code? 

Private Sub btnOpslaan_Click()
    Dim wsDB As Worksheet
    Dim nieuweRij As Long
    Dim huidigeDatum As Date
    Dim maandNaam As String
    Dim dagNaam As String
    Dim weekNr As String
    Dim wijze As String
    
    If Optbtn1.Value = True Then
        wijze = "Contant"
    ElseIf Optbtn2.Value = True Then
        wijze = "Pin"
    ElseIf Optbtn3.Value = True Then
        wijze = "Creditcard"
    End If
    

    Set wsDB = ThisWorkbook.Sheets("Database")

    huidigeDatum = Date
    maandNaam = Format(huidigeDatum, "mmmm")
    dagNaam = Format(huidigeDatum, "dddd")
    weekNr = Format(huidigeDatum, "ww", vbMonday, vbFirstFourDays)

    nieuweRij = wsDB.Cells(wsDB.Rows.Count, "A").End(xlUp).Row + 1

    wsDB.Cells(nieuweRij, 1).Value = huidigeDatum
    wsDB.Cells(nieuweRij, 2).Value = maandNaam
    wsDB.Cells(nieuweRij, 3).Value = weekNr
    wsDB.Cells(nieuweRij, 4).Value = dagNaam
    wsDB.Cells(nieuweRij, 5).Value = cmbSoort.Value
    wsDB.Cells(nieuweRij, 6).Value = txtBedrag.Value
    wsDB.Cells(nieuweRij, 7).Value = wijze.Value

    cmbSoort.Value = ""
    txtBedrag.Value = ""
    

    MsgBox "Gegevens opgeslagen!", vbInformation
End Sub

---

**ChatGPT:**

Er zitten twee fouten in je code:

✅ FOUT 1 — wijze.Value bestaat niet
Je zet hierboven al:
vbaCode kopiërenwijze = "Contant"   ' of Pin / Creditcard

| Dan is wijze een string | dus moet je dit doen: |
| --- | --- |
| vbaCode kopiërenwsDB.Cells(nieuweRij | 7).Value = wijze |

Maar je schrijft:
vbaCode kopiërenwsDB.Cells(nieuweRij, 7).Value = wijze.Value

➡️ FOUT: een string heeft geen .Value property.
Hierdoor krijg je Object required of een vergelijkbare fout.

❗ FOUT 2 — De weeknummer formule is fout opgebouwd
Je gebruikt:
vbaCode kopiërenweekNr = Format(huidigeDatum, "ww", vbMonday, vbFirstFourDays)

Format ondersteunt geen extra argumenten zoals vbMonday of vbFirstFourDays.
Dat werkt enkel bij:
vbaCode kopiërenWorksheetFunction.WeekNum

Gebruik dus:
vbaCode kopiërenweekNr = WorksheetFunction.WeekNum(huidigeDatum, 2) ' 2 = week begint op maandag

⭐ GEFIXXTE EN WERKENDE CODE
vbaCode kopiërenPrivate Sub btnOpslaan_Click()
    Dim wsDB As Worksheet
    Dim nieuweRij As Long
    Dim huidigeDatum As Date
    Dim maandNaam As String
    Dim dagNaam As String
    Dim weekNr As Long
    Dim wijze As String

| ' Betaalwijze bepalen | ' Betaalwijze bepalen |
| --- | --- |
| If Optbtn1.Value = True Then | If Optbtn1.Value = True Then |
| wijze = "Contant" | wijze = "Contant" |
| ElseIf Optbtn2.Value = True Then | ElseIf Optbtn2.Value = True Then |
| wijze = "Pin" | wijze = "Pin" |
| ElseIf Optbtn3.Value = True Then | ElseIf Optbtn3.Value = True Then |
| wijze = "Creditcard" | wijze = "Creditcard" |
| End If | End If |

    Set wsDB = ThisWorkbook.Sheets("Database")

| maandNaam = Format(huidigeDatum | "mmmm") |
| --- | --- |
| dagNaam = Format(huidigeDatum | "dddd") |
| weekNr = WorksheetFunction.WeekNum(huidigeDatum | 2) ' maandag = weekstart |

    nieuweRij = wsDB.Cells(wsDB.Rows.Count, "A").End(xlUp).Row + 1

| wsDB.Cells(nieuweRij | 1).Value = huidigeDatum |
| --- | --- |
| wsDB.Cells(nieuweRij | 2).Value = maandNaam |
| wsDB.Cells(nieuweRij | 3).Value = weekNr |
| wsDB.Cells(nieuweRij | 4).Value = dagNaam |
| wsDB.Cells(nieuweRij | 5).Value = cmbSoort.Value |
| wsDB.Cells(nieuweRij | 6).Value = txtBedrag.Value |
| wsDB.Cells(nieuweRij | 7).Value = wijze |

    cmbSoort.Value = ""
    txtBedrag.Value = ""

    MsgBox "Gegevens opgeslagen!", vbInformation
End Sub

Wil je dat ik ook:
✓ lege invoervelden controleer?
✓ automatisch decimalen (bijv. € 5 → € 5,00) instel?
✓ datum/tijd toevoeg?
Laat het me weten!