**Geëxporteerd:** 4-1-2026, 12:25:28
**Aantal berichten:** 2

---
**User:**

Je zei:

' ================================================
'                GLOBALE HULPFUNCTIES
' ================================================

' --- Controle of een sheet bestaat ---
Function SheetBestaat(sheetNaam As String) As Boolean
    Dim ws As Worksheet
    SheetBestaat = False
    
    For Each ws In ThisWorkbook.Worksheets
        If LCase(ws.Name) = LCase(sheetNaam) Then
            SheetBestaat = True
            Exit Function
        End If
    Next ws
End Function


' ================================================
'         USERFORM LATEN ZIEN
' ================================================

Sub ToonInvoerForm()
    frmInvoer.Show
End Sub


' ================================================
'      WEEK TOTALEN SAMENVATTEN IN DATABASE
' ================================================

Function WeekTotaalBestaat(weeknr As Long) As Boolean
    Dim ws As Worksheet
    Dim rng As Range
    
    Set ws = ThisWorkbook.Sheets("Database")
    Set rng = ws.Range("H:H").Find(weeknr, LookIn:=xlValues, LookAt:=xlWhole)
    
    WeekTotaalBestaat = Not rng Is Nothing
End Function


Function LaatsteMaandInMaandTabel() As String
    Dim ws As Worksheet
    Dim laatsteRij As Long
    
    Set ws = ThisWorkbook.Sheets("Database")
    laatsteRij = ws.Cells(ws.Rows.Count, "P").End(xlUp).Row
    
    If laatsteRij < 2 Then
        LaatsteMaandInMaandTabel = ""
    Else
        LaatsteMaandInMaandTabel = ws.Cells(laatsteRij, "P").Value
    End If
End Function


' ================================================
'              WEEKOVERZICHT MAKEN
' ================================================

Sub BerekenWeekTotaal()
    Dim ws As Worksheet
    Dim laatsteRij As Long, i As Long
    Dim vorigeWeek As Long
    Dim totaal As Double
    Dim catDict As Object
    Dim meestGebruiktCat As String
    Dim maxCount As Long
    Dim key As Variant

    Set ws = ThisWorkbook.Sheets("Database")
    laatsteRij = ws.Cells(ws.Rows.Count, "A").End(xlUp).Row
    vorigeWeek = DatePart("ww", Date, vbMonday, vbFirstFourDays) - 1

    Set catDict = CreateObject("Scripting.Dictionary")

    For i = 2 To laatsteRij
        If ws.Cells(i, 3).Value = vorigeWeek Then
            Dim bedrag As Double, categorie As String

            bedrag = ws.Cells(i, 6).Value
            categorie = ws.Cells(i, 5).Value
            
            totaal = totaal + bedrag
            
            If Not catDict.Exists(categorie) Then
                catDict(categorie) = 1
            Else
                catDict(categorie) = catDict(categorie) + 1
            End If
        End If
    Next i

    For Each key In catDict.Keys
        If catDict(key) > maxCount Then
            maxCount = catDict(key)
            meestGebruiktCat = key
        End If
    Next key
    
    Dim startCol As Long: startCol = 8
    Dim overzichtRow As Long
    
    overzichtRow = ws.Cells(ws.Rows.Count, startCol).End(xlUp).Row + 1
    
    If ws.Cells(1, startCol).Value = "" Then
        ws.Cells(1, startCol).Resize(1, 4).Value = Array("Weeknr", "Totaal", "Aantal categorieën", "Meest gebruikte categorie")
    End If

    ws.Cells(overzichtRow, startCol).Value = vorigeWeek
    ws.Cells(overzichtRow, startCol + 1).Value = totaal
    ws.Cells(overzichtRow, startCol + 2).Value = catDict.Count
    ws.Cells(overzichtRow, startCol + 3).Value = meestGebruiktCat
End Sub


' ================================================
'            MAANDOVERZICHT MAKEN
' ================================================

Sub BerekenMaandTotaal()
    ' (Jouw code hier is logisch en klopt)
    ' Heb alleen dubbele checks verwijderd en naming verbeterd
    ' Geen functionele wijzigingen behalve stabiliteit/leesbaarheid
    ' — kan ik ook volledig herschrijven als je dat wilt
    
    ' Laat dit voorlopig staan, geen conflicten.
End Sub


' ================================================
'          VASTE LASTEN NAAR DATABASE
' ================================================

Sub VerwerkVasteLasten()
    Dim wsInput As Worksheet, wsOutput As Worksheet
    Dim outputRij As Long
    Dim maand As String

    Set wsInput = ThisWorkbook.Sheets("Vast")
    Set wsOutput = ThisWorkbook.Sheets("Maand")

    maand = Format(Date, "YYYY-MM")

    outputRij = wsOutput.Cells(wsOutput.Rows.Count, "A").End(xlUp).Row + 1

    wsOutput.Cells(outputRij, 1).Value = maand
    wsOutput.Cells(outputRij, 2).Resize(1, 4).Value = wsInput.Range("B2:E2").Value

    MsgBox "Vaste last verwerkt voor maand " & maand, vbInformation
End Sub


' ================================================
'      MAAND SHEETS MAKEN — VERBETERDE VERSIE
' ================================================

Sub MaakMaandSheets()
    Dim wsBron As Worksheet
    Dim wsDoel As Worksheet
    Dim maanden As Variant, m As Variant
    Dim doelRij As Long
    Dim r As Long
    Dim rInkomen As Range, rUitgaven As Range
    Dim bedrag As Double, periode As String

    maanden = Array("Januari", "Februari", "Maart", "April", "Mei", "Juni", "Juli", "Augustus", "September", "Oktober", "November", "December")
    
    Set wsBron = ThisWorkbook.Sheets("Vast")
    
    For Each m In maanden
        
        ' --- SKIP als maandblad al bestaat ---
        If SheetBestaat(m) Then
            Debug.Print "Sheet bestaat al → " & m & " (overgeslagen)"
            GoTo NextMonth
        End If
        
        ' --- Nieuw sheet ---
        Set wsDoel = ThisWorkbook.Sheets.Add
        wsDoel.Name = m
        
        doelRij = 1
        wsDoel.Cells(doelRij, 1).Value = "Overzicht voor " & m
        wsDoel.Cells(doelRij, 1).Font.Bold = True
        doelRij = doelRij + 2
        
        ' --- Huishouden ---
        With wsDoel
            .Cells(doelRij, 1).Value = "Huishouden"
            .Cells(doelRij + 1, 1).Value = "Volwassenen": .Cells(doelRij + 1, 2).Value = 2
            .Cells(doelRij + 2, 1).Value = "Kinderen":    .Cells(doelRij + 2, 2).Value = 0
        End With
        
        doelRij = doelRij + 4
        
        ' --- Inkomsten ---
        wsDoel.Cells(doelRij, 1).Value = "Inkomsten"
        wsDoel.Cells(doelRij, 1).Font.Bold = True
        doelRij = doelRij + 2
        
        wsDoel.Cells(doelRij - 1, 1).Value = "Bron"
        wsDoel.Cells(doelRij - 1, 2).Value = "Bedrag"
        
        For Each rInkomen In wsBron.Range("A13:E24")
            
            If wsBron.Cells(rInkomen.Row, 3).Value <> "" Then
                periode = LCase(wsBron.Cells(rInkomen.Row, 2).Value)
                bedrag = wsBron.Cells(rInkomen.Row, 5).Value
                
                Select Case periode
                    Case "jaar": bedrag = bedrag / 12
                    Case "kwartaal": bedrag = bedrag / 3
                    Case "maand": bedrag = bedrag
                    Case "4 weken": bedrag = bedrag * 13 / 12
                End Select
                
                wsDoel.Cells(doelRij, 1).Value = wsBron.Cells(rInkomen.Row, 1).Value
                wsDoel.Cells(doelRij, 2).Value = Round(bedrag, 2)
                
                doelRij = doelRij + 1
            End If
        Next rInkomen
        
        wsDoel.Cells(doelRij, 1).Value = "Totaal inkomsten"
        wsDoel.Cells(doelRij, 2).Formula = "=SUM(B" & (doelRij - 1) & ":B6)"
        doelRij = doelRij + 2
        
        
        ' --- Uitgaven ---
        wsDoel.Cells(doelRij, 1).Value = "Uitgaven"
        wsDoel.Cells(doelRij, 1).Font.Bold = True
        doelRij = doelRij + 2
        
        wsDoel.Cells(doelRij - 1, 1).Value = "Categorie"
        wsDoel.Cells(doelRij - 1, 2).Value = "Bedrag"
        
        For Each rUitgaven In wsBron.Range("A40:A90")
            
            If wsBron.Cells(rUitgaven.Row, 3).Value <> "" Then
                periode = LCase(wsBron.Cells(rUitgaven.Row, 2).Value)
                bedrag = wsBron.Cells(rUitgaven.Row, 3).Value
                
                Select Case periode
                    Case "jaar": bedrag = bedrag / 12
                    Case "kwartaal": bedrag = bedrag / 3
                    Case "maand": bedrag = bedrag
                End Select
                
                wsDoel.Cells(doelRij, 1).Value = wsBron.Cells(rUitgaven.Row, 1).Value
                wsDoel.Cells(doelRij, 2).Value = Round(bedrag, 2)
                
                doelRij = doelRij + 1
            End If
        Next rUitgaven
        
        wsDoel.Cells(doelRij, 1).Value = "Totaal uitgaven"
        wsDoel.Cells(doelRij, 2).Formula = "=SUM(B" & (doelRij - 1) & ":B7)"
        doelRij = doelRij + 2
        
        
        ' --- Saldo ---
        wsDoel.Cells(doelRij, 1).Value = "Saldo"
        wsDoel.Cells(doelRij, 2).Formula = "=B" & (doelRij - 4) & "-B" & (doelRij - 2)
        
        
NextMonth:
    Next m
    
    MsgBox "Maandsheets aangemaakt (bestaande overgeslagen)."
End Sub

---

**ChatGPT:**

Dank je voor het delen van je volledige VBA-module. Ik heb er een grondige blik op geworpen. Er zitten een paar punten in je code die je zeker kunt verbeteren of die mogelijk fouten kunnen veroorzaken. Ik geef een overzicht per belangrijk onderdeel en enkele concrete suggesties.

1. SheetBestaat
Deze functie is correct en robuust. Klein puntje: je gebruikt LCase, wat prima is, maar je kunt ook StrComp(ws.Name, sheetNaam, vbTextCompare) = 0 gebruiken voor een iets nettere vergelijking.

2. BerekenWeekTotaal

| Key | Value |
| --- | --- |
| Het gebruik van DatePart("ww", Date, vbMonday, vbFirstFourDays) | 1 berekent de vorige week van het huidige jaar. Dat is goed, maar kan fout gaan aan het begin van een jaar (week 1 minus 1 = 0). Misschien beter: |
| vbaCode kopiërenvorigeWeek = DatePart("ww", Date | 7, vbMonday, vbFirstFourDays) |

catDict en meestGebruiktCat werken goed.

Klein verbeterpunt: Je gebruikt ws.Cells(overzichtRow, startCol).Resize(1, 4).Value = Array(...). Dat werkt prima, maar het maakt de kopregel dynamisch. Eventueel kun je dit alleen één keer doen bij een nieuw blad.

3. VerwerkVasteLasten

Correct en duidelijk.

Tip: je gebruikt Format(Date, "YYYY-MM"). In VBA is het beter "yyyy-mm" (kleine letters), anders krijg je soms onverwachte resultaten op andere locale instellingen.

4. MaakMaandSheets
Hier zitten een paar punten die problemen kunnen geven:

Berekening van totaal inkomsten en uitgaven
vbaCode kopiërenwsDoel.Cells(doelRij, 2).Formula = "=SUM(B" & (doelRij - 1) & ":B6)"

B6 is hard-coded. Als je rijen boven 6 verschuiven, klopt dit niet.

Beter:
vbaCode kopiërenwsDoel.Cells(doelRij, 2).Formula = "=SUM(B7:B" & (doelRij - 1) & ")"

of dynamisch op basis van startrij inkomsten/uitgaven.

Herhaling van code

Zowel bij inkomsten als uitgaven heb je bijna dezelfde logica voor periode en bedrag. Dit kan in een aparte helper-functie, bijv. Function BerekenMaandBedrag(bedrag As Double, periode As String) As Double.

Dubbele checks

Je checkt of een cel in kolom 3 niet leeg is (wsBron.Cells(rInkomen.Row, 3).Value <> "") voordat je berekent. Dat is prima, maar kijk uit dat bij inkomsten de juiste kolom wordt gebruikt (B2:E2 bij vaste lasten, A13:E24 bij inkomsten). Soms klopt de kolomindex niet.

Rijenbereik in loops

Je doet For Each rInkomen In wsBron.Range("A13:E24") en gebruikt dan wsBron.Cells(rInkomen.Row, 3). Dat werkt, maar is minder duidelijk. Beter:
vbaCode kopiërenFor i = 13 To 24
    If wsBron.Cells(i, 3).Value <> "" Then ...
Next i

| Key | Value |
| --- | --- |
| Saldo | formule |
| vbaCode kopiërenwsDoel.Cells(doelRij, 2).Formula = "=B" & (doelRij | 4) & "-B" & (doelRij - 2) |

Ook hier kan dynamischer, anders klopt het soms niet als je rijen toevoegt.

5. Algemene tips

Voeg altijd Option Explicit bovenaan je module toe. Dit voorkomt typefouten.

Overweeg helper-functies te maken voor:

Berekenen van maandbedrag op basis van periode

Het toevoegen van kopteksten

Het berekenen van totaal per categorie/inkomen/uitgaven

💡 Conclusie:
De code werkt grotendeels, maar de grootste risico’s zitten in de hard-coded rijnummers bij de formules voor totaal inkomsten/uitgaven en saldo. Ook de weekberekening kan in januari fout gaan.
Als je wilt, kan ik jouw MaakMaandSheets volledig herschrijven zodat alles dynamisch is, geen harde rijnummers gebruikt, overzichtelijker is en minder kans op fouten geeft.
Wil je dat ik dat doe?