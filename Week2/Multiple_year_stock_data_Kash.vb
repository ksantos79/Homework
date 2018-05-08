Sub yearlytotalbyticker()

    Dim ticker As String
    Dim summaryrow As Integer
    Dim tickertotal As Double
    Dim rowcount As Long
    Dim ws As Worksheet
    Dim openamount As Double
    Dim closeamount As Double
    Dim openclosedifference As Double
    Dim openclosepercent As Double
    Dim greatestpercentincrease As Double
    Dim greatestpercendecticker As String
    Dim greatestpercentdecrease As Double
    Dim greatestpercenincticker As String
    Dim greatestvolume As Double
    Dim greatestvolumeticker As String
    summaryrow = 2
    
    tickertotal = 0
    greatestpercentincrease = 0
    greatestpercentdecrease = 0
    greatestvolume = 0
    
    'Loop through all worksheets
    For Each ws In ActiveWorkbook.Worksheets
        'Find number of rows
        rowcount = ws.Cells(Rows.Count, "A").End(xlUp).Row
        
        'Set headers and row labels
        ws.Cells(1, 9).Value = "Ticker"
        ws.Cells(1, 10).Value = "Yearly Change"
        ws.Cells(1, 11).Value = "Percent Change"
        ws.Cells(1, 12).Value = "Total Stock Volume"
        ws.Cells(1, 16).Value = "Ticker"
        ws.Cells(1, 17).Value = "Value"
        ws.Cells(2, 15).Value = "Greatest % Increase"
        ws.Cells(3, 15).Value = "Greatest % Decrease"
        ws.Cells(4, 15).Value = "Greatest Total Volume"
        
        'Loop through data
        For i = 2 To rowcount
            If ws.Cells(i + 1, 1).Value <> ws.Cells(i, 1).Value Then
                
                ticker = ws.Cells(i, 1).Value
                tickertotal = tickertotal + ws.Cells(i, 7)
                closeamount = ws.Cells(i, 6).Value
                ws.Range("I" & summaryrow).Value = ticker
                
                
                
                If closamount = 0 And openamount = 0 Then
                    ws.Range("J" & summaryrow).Interior.ColorIndex = 4
                    ws.Range("J" & summaryrow).Value = 0
                    ws.Range("K" & summaryrow).Value = 0
                    openclosedifference = 0
                    openclosepercent = 0
                Else
                    openclosedifference = closeamount - openamount
                    openclosepercent = (closeamount / openamount) - 1
                    ws.Range("J" & summaryrow).Value = openclosedifference
                    If openclosedifference >= 0 Then
                        ws.Range("J" & summaryrow).Interior.ColorIndex = 4
                    Else
                        ws.Range("J" & summaryrow).Interior.ColorIndex = 3
                    End If
                    
                    ws.Range("K" & summaryrow).Value = openclosepercent
                End If
                ws.Range("K" & summaryrow).NumberFormat = "0.00%"
                ws.Range("L" & summaryrow).Value = tickertotal
                
                If tickertotal > greatestvolume Then
                    greatestvolumeticker = ticker
                    greatestvolume = tickertotal
                End If
                
                If openclosepercent > greatestpercentincrease Then
                    greatestpercenincticker = ticker
                    greatestpercentincrease = openclosepercent
                End If
                
                If openclosepercent < greatestpercentdecrease Then
                    greatestpercendecticker = ticker
                    greatestpercentdecrease = openclosepercent
                End If
                
                ws.Range("P2").Value = greatestpercenincticker
                ws.Range("Q2").Value = greatestpercentincrease
                ws.Range("Q2").NumberFormat = "0.00%"
                
                ws.Range("P3").Value = greatestpercendecticker
                ws.Range("Q3").Value = greatestpercentdecrease
                ws.Range("Q3").NumberFormat = "0.00%"
                
                ws.Range("P4").Value = greatestvolumeticker
                ws.Range("Q4").Value = greatestvolume
                
                summaryrow = summaryrow + 1
                
                tickertotal = 0
            Else
                tickertotal = tickertotal + ws.Cells(i, 7)
                If ws.Cells(i - 1, 1).Value <> ws.Cells(i, 1).Value Then
                    openamount = ws.Cells(i, 3).Value
                End If
                    
            End If
        Next i
        tickertotal = 0
        ticker = ""
        summaryrow = 2
        greatestpercentincrease = 0
        greatestpercentdecrease = 0
        greatestvolume = 0

    Next ws
    
End Sub

Sub reset()
    Dim ws As Worksheet
    
    For Each ws In ActiveWorkbook.Worksheets
        ws.Columns(9).EntireColumn.Delete
        ws.Columns(9).EntireColumn.Delete
        ws.Columns(9).EntireColumn.Delete
        ws.Columns(9).EntireColumn.Delete
        ws.Columns(9).EntireColumn.Delete
        ws.Columns(9).EntireColumn.Delete
        ws.Columns(9).EntireColumn.Delete
        ws.Columns(9).EntireColumn.Delete
        ws.Columns(9).EntireColumn.Delete
        
    Next ws
End Sub
