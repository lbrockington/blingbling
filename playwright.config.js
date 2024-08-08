const { devices } = require('@playwright/test');

module.exports = {
    name: 'Fools Good',
    testDir: './tests',
    timeout: 120000,
    use: {
        ignoreHTTPSErrors: true,
        baseURL: 'http://sdetchallenge.fetch.com/',
    },
    projects: [
        {
            name: 'Chromium',
            use: { ...devices['Desktop Chrome'] },
        }
    ],
    reporter: 'list',
};
