import pandas as pd
file1 = r'C:\Users\gmaad\Downloads\demo report website\E2E_Test_Report_MindDump.xlsx'
df = pd.read_excel(file1, header=None)
print("Length:", len(df))
