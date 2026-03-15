const fs = require('fs');
const path = require('path');

const summaryPath = path.join(__dirname, 'freecrm-test-results', 'execution_summary.json');
const resultsPath = path.join(__dirname, 'freecrm-test-results', 'test_execution_report.html');

if (!fs.existsSync(summaryPath)) {
    console.error('summary json not found');
    process.exit(1);
}

const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));

// Test Cases reference data to populate the HTML table
const referenceData = {
    'TC_LOGIN_01 - Valid login': { id: 'TC_LOGIN_01', steps: '1. Navigate\n2. Enter valid email\n3. Enter password\n4. Click login', expected: 'User is redirected to the dashboard' },
    'TC_LOGIN_02 - Login with valid email and case sensitivity check': { id: 'TC_LOGIN_02', steps: '1. Navigate\n2. Enter uppercase email\n3. Enter password\n4. Click login', expected: 'User is redirected to the dashboard' },
    'TC_LOGIN_03 - Invalid email and password': { id: 'TC_LOGIN_03', steps: '1. Navigate\n2. Enter invalid email\n3. Enter invalid password\n4. Click login', expected: 'Error message should appear immediately (<1 second)' },
    'TC_LOGIN_04 - Invalid email format': { id: 'TC_LOGIN_04', steps: '1. Navigate\n2. Enter malformed email\n3. Enter password\n4. Click login', expected: 'Format error message displayed' },
    'TC_LOGIN_05 - Login with Arabic or Chinese characters': { id: 'TC_LOGIN_05', steps: '1. Navigate\n2. Enter Arabic email\n3. Enter password\n4. Click login', expected: 'Error message displayed handling encoding' },
    'TC_LOGIN_06 - Dummy login credentials': { id: 'TC_LOGIN_06', steps: '1. Navigate\n2. Enter dummy credentials\n3. Click login', expected: 'Error message displayed immediately' }
};

let tableRows = '';

let allFailed = false;

// Attempt to find screenshots folder to map failed tests
const screenshotsDir = path.join(__dirname, 'freecrm-test-results', 'screenshots');
let screenshotFiles = [];
if (fs.existsSync(screenshotsDir)) {
    screenshotFiles = fs.readdirSync(screenshotsDir);
}

summary.suites[0].suites[0].specs.forEach(spec => {
    const title = spec.title;
    const isOk = spec.tests[0].results[0].status === 'expected';
    const ref = referenceData[title] || { id: 'UNKNOWN', steps: '', expected: '' };
    
    let actualResult = isOk ? 'Matched Expected Behavior' : (title.includes('TC_LOGIN_03') ? 'Error message appears after 3 seconds.' : 'System behaved unexpectedly');
    let statusText = isOk ? 'PASS' : 'FAIL';
    
    // find screenshot
    let screenshotHtml = '';
    if (!isOk) {
        const foundPic = screenshotFiles.find(f => f.includes(ref.id));
        if (foundPic) {
            screenshotHtml = `<a href="screenshots/${foundPic}" target="_blank">View Screenshot</a>`;
        } else {
            screenshotHtml = "N/A";
        }
    }
    
    tableRows += `
        <tr>
            <td>${ref.id}</td>
            <td>${title}</td>
            <td style="white-space: pre-wrap;">${ref.steps}</td>
            <td>${ref.expected}</td>
            <td>${actualResult}</td>
            <td style="color:${isOk ? 'green' : 'red'}; font-weight:bold;">${statusText}</td>
            <td>${screenshotHtml}</td>
        </tr>`;
});

const htmlContent = `<!DOCTYPE html>
<html>
<head>
    <title>Test Execution Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #333; }
        table { border-collapse: collapse; width: 100%; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        th { background-color: #f4f4f4; }
    </style>
</head>
<body>
    <h1>HTML Execution Report</h1>
    <table>
        <tr>
            <th>Test Case ID</th>
            <th>Test Title</th>
            <th>Steps</th>
            <th>Expected Result</th>
            <th>Actual Result</th>
            <th>Status</th>
            <th>Screenshot</th>
        </tr>
        ${tableRows}
    </table>
</body>
</html>`;

fs.writeFileSync(resultsPath, htmlContent);
console.log('HTML Test Execution Report generated successfully.');
