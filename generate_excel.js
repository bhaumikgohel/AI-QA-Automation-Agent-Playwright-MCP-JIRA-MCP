const xlsx = require('xlsx');

const testCases = [
    {
        "Test Case ID": "TC_LOGIN_01",
        "Test Case Title": "Valid login",
        "Requirement": "User should log in with valid credentials",
        "Preconditions": "User must have a registered account",
        "Test Steps": "1. Navigate to https://freecrm.com\n2. Enter valid email\n3. Enter valid password\n4. Click login button",
        "Test Data": "Email: user@example.com, Password: Password123",
        "Expected Result": "User is redirected to the dashboard",
        "Priority": "High",
        "Severity": "Critical",
        "Test Type": "Positive"
    },
    {
        "Test Case ID": "TC_LOGIN_02",
        "Test Case Title": "Login with valid email and case sensitivity check",
        "Requirement": "Email should not be case-sensitive",
        "Preconditions": "User must have a registered account",
        "Test Steps": "1. Navigate to https://freecrm.com\n2. Enter valid email in uppercase\n3. Enter valid password\n4. Click login button",
        "Test Data": "Email: USER@EXAMPLE.COM, Password: Password123",
        "Expected Result": "User is redirected to the dashboard",
        "Priority": "Medium",
        "Severity": "Major",
        "Test Type": "Positive"
    },
    {
        "Test Case ID": "TC_LOGIN_03",
        "Test Case Title": "Invalid email and password",
        "Requirement": "User should not log in with invalid credentials",
        "Preconditions": "None",
        "Test Steps": "1. Navigate to https://freecrm.com\n2. Enter invalid email\n3. Enter invalid password\n4. Click login button",
        "Test Data": "Email: invalid@test.com, Password: wrongpassword",
        "Expected Result": "Error message should appear immediately (<1 second)",
        "Priority": "High",
        "Severity": "Critical",
        "Test Type": "Negative"
    },
    {
        "Test Case ID": "TC_LOGIN_04",
        "Test Case Title": "Invalid email format",
        "Requirement": "System should format validate email",
        "Preconditions": "None",
        "Test Steps": "1. Navigate to https://freecrm.com\n2. Enter malformed email\n3. Enter password\n4. Click login button",
        "Test Data": "Email: dummyemail, Password: Password123",
        "Expected Result": "Format error message displayed",
        "Priority": "Medium",
        "Severity": "Minor",
        "Test Type": "Negative"
    },
    {
        "Test Case ID": "TC_LOGIN_05",
        "Test Case Title": "Login with Arabic or Chinese characters",
        "Requirement": "System should handle foreign language input properly",
        "Preconditions": "None",
        "Test Steps": "1. Navigate to https://freecrm.com\n2. Enter email with special characters\n3. Enter password\n4. Click login button",
        "Test Data": "Email: اختبار@example.com, Password: Password123",
        "Expected Result": "Error message displayed handling encoding",
        "Priority": "Low",
        "Severity": "Minor",
        "Test Type": "Negative"
    },
    {
        "Test Case ID": "TC_LOGIN_06",
        "Test Case Title": "Dummy login credentials",
        "Requirement": "Prevent basic dummy bot attacks",
        "Preconditions": "None",
        "Test Steps": "1. Navigate to https://freecrm.com\n2. Enter dummy credentials\n3. Click login button",
        "Test Data": "Email: admin@admin.com, Password: admin",
        "Expected Result": "Error message displayed immediately",
        "Priority": "Low",
        "Severity": "Minor",
        "Test Type": "Negative"
    }
];

const ws = xlsx.utils.json_to_sheet(testCases);
const wb = xlsx.utils.book_new();
xlsx.utils.book_append_sheet(wb, ws, "TestCases");
xlsx.writeFile(wb, "freecrm-test-results/freecrm_login_testcases.xlsx");
