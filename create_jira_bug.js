const https = require('https');

const email = 'bhaumik41294@gmail.com';
const token = process.env.JIRA_API_TOKEN;
const baseUrl = 'myqatask.atlassian.net';
const auth = Buffer.from(`${email}:${token}`).toString('base64');

const bugPayload = {
  fields: {
    project: { key: 'SCRUM' },
    summary: 'Login error message delayed by 3 seconds for invalid credentials on freeCRM',
    issuetype: { name: 'Bug' },
    priority: { name: 'High' },
    description: {
      type: 'doc',
      version: 1,
      content: [
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Bug Summary' }]
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Login error message appears after a 3-second delay when invalid credentials are entered. Expected behavior is that the error should appear immediately (< 1 second).' }]
        },
        {
          type: 'heading',
          attrs: { level: 3 },
          content: [{ type: 'text', text: 'Steps to Reproduce' }]
        },
        {
          type: 'orderedList',
          content: [
            { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Navigate to https://ui.freecrm.com' }] }] },
            { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Enter invalid email: invalid@test.com' }] }] },
            { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Enter invalid password: wrongpassword' }] }] },
            { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Click the Login button' }] }] },
            { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Observe: error message appears after ~3 seconds' }] }] }
          ]
        },
        {
          type: 'heading',
          attrs: { level: 3 },
          content: [{ type: 'text', text: 'Expected Result' }]
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Error message should appear immediately after clicking Login (< 1 second).' }]
        },
        {
          type: 'heading',
          attrs: { level: 3 },
          content: [{ type: 'text', text: 'Actual Result' }]
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Error message appears after approximately 3 seconds delay.' }]
        },
        {
          type: 'heading',
          attrs: { level: 3 },
          content: [{ type: 'text', text: 'Environment' }]
        },
        {
          type: 'bulletList',
          content: [
            { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Application URL: https://ui.freecrm.com' }] }] },
            { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Browser: Chromium (Playwright MCP)' }] }] },
            { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'OS: Windows 10/11' }] }] },
            { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Execution Timestamp: ' + new Date().toISOString() }] }] },
            { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Test Case ID: TC_LOGIN_03' }] }] },
            { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Bug Type: Performance Bug' }] }] }
          ]
        },
        {
          type: 'heading',
          attrs: { level: 3 },
          content: [{ type: 'text', text: 'Attachments' }]
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Failure screenshot, HTML test execution report, and execution logs are attached to this ticket.' }]
        }
      ]
    },
    labels: ['Performance-Bug', 'Login', 'FreeCRM', 'Playwright-MCP', 'P1']
  }
};

const body = JSON.stringify(bugPayload);

const options = {
  hostname: baseUrl,
  path: '/rest/api/3/issue',
  method: 'POST',
  headers: {
    'Authorization': `Basic ${auth}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body)
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    if (res.statusCode === 201) {
      const result = JSON.parse(data);
      console.log('✅ JIRA Bug Created Successfully!');
      console.log(`   Issue Key: ${result.key}`);
      console.log(`   Issue ID: ${result.id}`);
      console.log(`   URL: https://myqatask.atlassian.net/browse/${result.key}`);
      // Save to file for attachment step
      require('fs').writeFileSync('jira_created_issue.json', JSON.stringify({ key: result.key, id: result.id, url: `https://myqatask.atlassian.net/browse/${result.key}` }, null, 2));
    } else {
      console.error(`❌ Failed to create JIRA bug. Status: ${res.statusCode}`);
      console.error(data);
    }
  });
});

req.on('error', (e) => console.error(`❌ Request error: ${e.message}`));
req.write(body);
req.end();
