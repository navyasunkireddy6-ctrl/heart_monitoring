# CardioFusion AI
Complete responsive website for **AI-Based Multimodal Heart and Pulse Rate Monitoring Using ECG and Smartphone PPG**.

## Features
- Professional biomedical/AI presentation website
- ECG simulated real-time waveform
- Smartphone camera access for PPG demonstration
- Signal-quality dashboard
- ECG vs PPG comparison
- System architecture
- Machine-learning pipeline
- Dataset/validation section
- Mobile responsive design

## Run
Install Node.js LTS from https://nodejs.org/, then run:

```bash
npm install
npm start
```

Open http://localhost:3000 in a browser.

For camera access, use HTTPS or localhost. If camera permission is unavailable, the site remains usable in simulation mode.

## Scientific scope
ECG is used for heart-rate estimation from electrical cardiac activity.
Smartphone camera PPG is used for peripheral pulse-rate estimation from optical blood-volume changes.
Public ECG data are used for development/simulated replay and are not synchronized with live smartphone PPG.
Possible rhythm classification is a research output, not a diagnosis.
**Prototype / Research System — Not for Clinical Diagnosis.**

## GitHub
Upload all files to a public repository. Do not commit passwords, API keys or other secrets.
