# GeneRx Mobile E2E Testing Framework (React Native & Appium 2.x)

This directory contains the Appium E2E testing framework for the GeneRx React Native app, configured for GitHub Actions CI/CD.

## Deliverables Included:
1. **GitHub Workflows (`.github/workflows/`)**: 4 YAML files for Load Testing, Vulnerability (SAST/DAST), Selenium (React JS), and Appium (React Native).
2. **Appium Setup (`package.json`)**: WebDriverIO, Appium, Mocha, Chai, Mochawesome, ExcelJS.
3. **Driver Setup & Logging (`src/config/AppiumConfig.js`)**: Winston logger and UiAutomator2 setup.
4. **Reporting (`src/utils/ExcelReporter.js`)**: Generates a 4-sheet Excel Report with 300 test cases (Summary, Test Cases, Failed Tests, Logs).
5. **Smart AI Testing Capability Setup**: Base structure ready for integration with LLM models for dynamic UI traversal.

## Execution via GitHub Actions
This framework is designed to run automatically in GitHub Actions (`.github/workflows/appium-react-native.yml`). 
It spins up an Android Emulator, installs Appium, runs all 300 simulated test cases, generates HTML/Excel reports, and uploads them as GitHub Artifacts.

No local execution is required.
