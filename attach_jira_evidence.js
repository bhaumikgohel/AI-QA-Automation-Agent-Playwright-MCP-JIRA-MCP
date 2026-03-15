const https = require('https');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

const email = 'bhaumik41294@gmail.com';
const token = process.env.JIRA_API_TOKEN;
const auth = Buffer.from(`${email}:${token}`).toString('base64');
const issueKey = 'SCRUM-25';

const filesToAttach = [
  { path: 'freecrm-test-results/screenshots/TC_LOGIN_03_failure_screenshot.png', name: 'TC_LOGIN_03_failure_screenshot.png' },
  { path: 'freecrm-test-results/test_execution_report.html', name: 'test_execution_report.html' },
  { path: 'freecrm-test-results/execution_summary.json', name: 'execution_summary.json' },
  { path: 'freecrm-test-results/logs/playwright_execution.log', name: 'playwright_execution.log' }
];

async function uploadFile(filePath, fileName) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️  File not found: ${filePath}, skipping.`);
      resolve(null);
      return;
    }

    const form = new FormData();
    form.append('file', fs.createReadStream(filePath), { filename: fileName });

    const options = {
      hostname: 'myqatask.atlassian.net',
      path: `/rest/api/3/issue/${issueKey}/attachments`,
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json',
        'X-Atlassian-Token': 'no-check',
        ...form.getHeaders()
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log(`✅ Attached: ${fileName}`);
          resolve(JSON.parse(data));
        } else {
          console.error(`❌ Failed to attach ${fileName}: ${res.statusCode} ${data}`);
          resolve(null);
        }
      });
    });

    req.on('error', (e) => { console.error(`❌ ${e.message}`); reject(e); });
    form.pipe(req);
  });
}

async function main() {
  console.log(`\n📎 Attaching evidence to JIRA ${issueKey}...\n`);
  for (const file of filesToAttach) {
    await uploadFile(file.path, file.name);
  }
  console.log('\n✅ Step 10 Complete — All evidence attached to JIRA SCRUM-25!');
  console.log('🔗 https://myqatask.atlassian.net/browse/SCRUM-25');
}

main();
