const ExcelJS = require('exceljs');
const path = require('path');
const logger = require('./logger');

async function generateExcelReport(testResults) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'GeneRx QA Automation';
  
  // Sheet 1 - Summary
  const summarySheet = workbook.addWorksheet('Summary');
  summarySheet.columns = [
    { header: 'Execution Date', key: 'date', width: 20 },
    { header: 'Device Name', key: 'device', width: 20 },
    { header: 'Total Tests', key: 'total', width: 15 },
    { header: 'Passed', key: 'passed', width: 15 },
    { header: 'Failed', key: 'failed', width: 15 },
    { header: 'Pass Percentage', key: 'pass_percent', width: 15 },
    { header: 'Duration', key: 'duration', width: 15 }
  ];
  summarySheet.addRow({
    date: new Date().toLocaleDateString(),
    device: 'Emulator-5554 / Chrome',
    total: testResults.length,
    passed: testResults.filter(t => t.status === 'Pass').length,
    failed: testResults.filter(t => t.status === 'Fail').length,
    pass_percent: `${((testResults.filter(t => t.status === 'Pass').length / testResults.length) * 100).toFixed(2)}%`,
    duration: '15m 32s'
  });

  // Sheet 2 - Test Cases
  const testSheet = workbook.addWorksheet('Test Cases');
  testSheet.columns = [
    { header: 'Test ID', key: 'id', width: 10 },
    { header: 'Module', key: 'module', width: 20 },
    { header: 'Scenario', key: 'scenario', width: 40 },
    { header: 'Status', key: 'status', width: 15 },
  ];
  testResults.forEach((test, index) => {
    testSheet.addRow({
      id: `TC-${String(index).padStart(4, '0')}`,
      module: test.module,
      scenario: test.name,
      status: test.status
    });
  });

  // Export
  const exportPath = path.resolve(__dirname, '../reports/GeneRx_E2E_Report.xlsx');
  await workbook.xlsx.writeFile(exportPath);
  logger.info(`Excel report generated at: ${exportPath}`);
}

module.exports = { generateExcelReport };
