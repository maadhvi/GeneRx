const winston = require('winston');

// 1. Logger Setup
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'reports/failures/test.log' })
  ]
});

// 2. Appium Configuration
const AppiumConfig = {
  hostname: process.env.APPIUM_HOST || '127.0.0.1',
  port: parseInt(process.env.APPIUM_PORT, 10) || 4723,
  logLevel: 'error',
  capabilities: {
    'platformName': 'Android',
    'appium:automationName': 'UiAutomator2',
    'appium:app': process.env.APK_PATH || './app/app-release.apk',
    'appium:appPackage': process.env.APP_PACKAGE || 'com.company.app',
    'appium:appActivity': process.env.APP_ACTIVITY || 'com.company.app.MainActivity',
    'appium:noReset': false,
  }
};

module.exports = { AppiumConfig, logger };
