package reports

import (
	"io"

	"github.com/xuri/excelize/v2"
)

func GenerateExcel(w io.Writer, sheetName string, headers []string, rows [][]any) error {
	f := excelize.NewFile()
	defer f.Close()

	index, err := f.NewSheet(sheetName)
	if err != nil {
		return err
	}

	f.SetActiveSheet(index)
	if sheetName != "Sheet1" {
		f.DeleteSheet("Sheet1")
	}

	style, err := f.NewStyle(&excelize.Style{
		Font: &excelize.Font{Bold: true, Color: "FFFFFF"},
		Fill: excelize.Fill{Type: "pattern", Color: []string{"4F81BD"}, Pattern: 1},
	})
	if err != nil {
		return err
	}

	for i, h := range headers {
		cell, _ := excelize.CoordinatesToCellName(i+1, 1)
		f.SetCellValue(sheetName, cell, h)
		f.SetCellStyle(sheetName, cell, cell, style)
	}

	for rowIndex, rowData := range rows {
		for colIndex, value := range rowData {
			cell, err := excelize.CoordinatesToCellName(colIndex+1, rowIndex+2)
			if err != nil {
				return err
			}
			f.SetCellValue(sheetName, cell, value)
		}
	}

	for i := range headers {
		colName, err := excelize.ColumnNumberToName(i + 1)
		if err != nil {
			return err
		}

		f.SetColWidth(sheetName, colName, colName, 20)
	}

	return f.Write(w)
}
