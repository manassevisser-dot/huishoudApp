VERSION 1.0 CLASS
BEGIN
  MultiUse = -1  'True
END
Attribute VB_Name = "ThisWorkbook"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = True
Private Sub Workbook_Open()
    ' Controleer of vorige week verwerkt is
    Dim vorigeWeek As Long
    vorigeWeek = DatePart("ww", Date, vbMonday, vbFirstFourDays) - 1

    If Weekday(Date, vbMonday) = 1 Then
        ' Maandag: automatisch berekenen als nog niet gedaan
        If Not WeekTotaalBestaat(vorigeWeek) Then
            Call BerekenWeekTotaal
        End If
    Else
        ' Andere dag: check en vraag gebruiker
        If Not WeekTotaalBestaat(vorigeWeek) Then
            Dim antwoord As VbMsgBoxResult
            antwoord = MsgBox("Weektotaal vorige week ontbreekt. Nu berekenen?", vbYesNo + vbQuestion, "Weekoverzicht")
            If antwoord = vbYes Then Call BerekenWeekTotaal
        End If
    End If

    ' Controleer of vorige maand verwerkt is
    If Format(Date, "YYYY-MM") <> LaatsteMaandInMaandTabel() Then
        Call BerekenMaandTotaal
    End If
End Sub
