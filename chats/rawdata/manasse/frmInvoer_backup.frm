VERSION 5.00
Begin {C62A69F0-16DC-11CE-9E98-00AA00574A4F} frmInvoer 
   Caption         =   "Hoeveel heb je vandaag uitgegeven?"
   ClientHeight    =   4310
   ClientLeft      =   110
   ClientTop       =   450
   ClientWidth     =   5880
   OleObjectBlob   =   "frmInvoer_backup.frx":0000
   StartUpPosition =   2  'CenterScreen
End
Attribute VB_Name = "frmInvoer"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False

Private Sub OptionButton2_Click()

End Sub

Private Sub SpinButton1_Change()

End Sub

Private Sub Optbtn1_Click()

End Sub

Private Sub txtBedrag_KeyPress(ByVal KeyAscii As MSForms.ReturnInteger)
    ' Sta alleen cijfers en komma/punt toe
    If Not (KeyAscii >= 48 And KeyAscii <= 57) And KeyAscii <> 44 And KeyAscii <> 46 And KeyAscii <> 8 Then
        KeyAscii = 0
    End If
End Sub

Private Sub UserForm_Initialize()
    ' Toon dag en weeknummer
    lblDag.Caption = "Het is vandaag " & Format(Date, "dddd")
    lblWeek.Caption = "Het is week: " & Format(Date, "ww", vbMonday, vbFirstFourDays)

    
    ' Vul ComboBox
    cmbSoort.Clear
    cmbSoort.AddItem "Bestellen"
    cmbSoort.AddItem "Roken"
    cmbSoort.AddItem "Uitje"
    cmbSoort.AddItem "Hapje/Drankje"
    cmbSoort.AddItem "Vervoer"
    cmbSoort.AddItem "Cadeau"
    cmbSoort.AddItem "Lisa"
    cmbSoort.AddItem "Kyra"
    cmbSoort.AddItem "Kleding e.d"
End Sub

Private Sub btnOpslaan_Click()
    Dim wsDB As Worksheet
    Dim nieuweRij As Long
    Dim huidigeDatum As Date
    Dim maandNaam As String
    Dim dagNaam As String
    Dim weeknr As String
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
    weeknr = Format(huidigeDatum, "ww", vbMonday, vbFirstFourDays)

    nieuweRij = wsDB.Cells(wsDB.Rows.Count, "A").End(xlUp).Row + 1

    wsDB.Cells(nieuweRij, 1).Value = huidigeDatum
    wsDB.Cells(nieuweRij, 2).Value = maandNaam
    wsDB.Cells(nieuweRij, 3).Value = weeknr
    wsDB.Cells(nieuweRij, 4).Value = dagNaam
    wsDB.Cells(nieuweRij, 5).Value = cmbSoort.Value
    wsDB.Cells(nieuweRij, 6).Value = txtBedrag.Value
    wsDB.Cells(nieuweRij, 7).Value = wijze

    cmbSoort.Value = ""
    txtBedrag.Value = ""
    Optbtn1.Value = False
    Optbtn2.Value = False
    Optbtn3.Value = False

    MsgBox "Gegevens opgeslagen!", vbInformation
End Sub
