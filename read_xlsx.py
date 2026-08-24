import pandas as pd
import sys

file_path = r"e:\PDD App\node_modules\E2E_Test_Report_PancreaScan_2026-06-09T16-22-48.xlsx"
try:
    df = pd.read_excel(file_path)
    print("Columns:", df.columns.tolist())
    if not df.empty:
        print("First row:", df.iloc[0].to_dict())
except Exception as e:
    print("Error:", e)
