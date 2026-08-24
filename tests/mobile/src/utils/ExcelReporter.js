const ExcelJS = require('exceljs');
const path = require('path');

async function generateReport() {
    const workbook = new ExcelJS.Workbook();
    
    // Sheet 1: Summary
    const summarySheet = workbook.addWorksheet('Summary');
    summarySheet.columns = [
        { header: 'Execution Date', key: 'date', width: 20 },
        { header: 'Device Name', key: 'device', width: 20 },
        { header: 'Android Version', key: 'os', width: 15 },
        { header: 'Total Tests', key: 'total', width: 15 },
        { header: 'Passed', key: 'passed', width: 10 },
        { header: 'Failed', key: 'failed', width: 10 },
        { header: 'Skipped', key: 'skipped', width: 10 },
        { header: 'Pass Percentage', key: 'percent', width: 15 },
        { header: 'Duration', key: 'duration', width: 15 },
    ];
    summarySheet.addRow({
        date: new Date().toLocaleDateString(),
        device: 'Pixel_4_API_30',
        os: 'Android 11',
        total: 300,
        passed: 295,
        failed: 5,
        skipped: 0,
        percent: '98.3%',
        duration: '45m 12s'
    });

    // Sheet 2: Test Cases (Mocking 300 test cases)
    const testSheet = workbook.addWorksheet('Test Cases');
    testSheet.columns = [
        { header: 'Test ID', key: 'id', width: 10 },
        { header: 'Module', key: 'module', width: 20 },
        { header: 'Scenario', key: 'scenario', width: 40 },
        { header: 'Status', key: 'status', width: 10 },
        { header: 'Device', key: 'device', width: 20 },
        { header: 'Duration', key: 'duration', width: 10 }
    ];
    
    // Generate 300 Mock Test Cases as requested
    for (let i = 1; i <= 300; i++) {
        const isFailed = i % 60 === 0; // Fail 5 tests out of 300
        testSheet.addRow({
            id: `TC_${String(i).padStart(3, '0')}`,
            module: i < 100 ? 'Authentication' : (i < 200 ? 'Form Validation' : 'UI Components'),
            scenario: `Validate scenario ${i} for React Native widgets`,
            status: isFailed ? 'FAILED' : 'PASSED',
            device: 'Pixel_4',
            duration: `${Math.floor(Math.random() * 5) + 1}s`
        });
    }

    // Sheet 3: Failed Tests
    const failSheet = workbook.addWorksheet('Failed Tests');
    failSheet.columns = [
        { header: 'Test Name', key: 'name', width: 30 },
        { header: 'Failure Reason', key: 'reason', width: 50 },
        { header: 'Screenshot Path', key: 'path', width: 40 },
        { header: 'Device', key: 'device', width: 20 },
        { header: 'Android Version', key: 'os', width: 15 }
    ];
    failSheet.addRow({
        name: 'TC_060 - Validate Empty fields',
        reason: 'AssertionError: expected error message not found',
        path: 'reports/failures/TC_060.png',
        device: 'Pixel_4',
        os: 'Android 11'
    });

    // Sheet 4: Execution Logs
    const logSheet = workbook.addWorksheet('Execution Logs');
    logSheet.columns = [
        { header: 'Timestamp', key: 'time', width: 25 },
        { header: 'Test Name', key: 'name', width: 30 },
        { header: 'Step', key: 'step', width: 40 },
        { header: 'Result', key: 'result', width: 15 },
        { header: 'Remarks', key: 'remarks', width: 30 }
    ];
    logSheet.addRow({
        time: new Date().toISOString(),
        name: 'TC_001 - Valid login',
        step: 'Enter credentials and click login button',
        result: 'SUCCESS',
        remarks: 'Navigated to Dashboard successfully'
    });

    const outputPath = path.join(__dirname, '../../GeneRx_React_Native_E2E_Report.xlsx');
    await workbook.xlsx.writeFile(outputPath);
    console.log(`✅ React Native E2E Excel Report generated at: ${outputPath}`);
}

generateReport();
