/**
 * UltimateMine Universal Download Engine
 * Handles URL parsing, JSON fetching, 404 validation, and timer execution.
 */

const CONFIG = {
    timerSeconds: 25,
    jsonDbPath: '../downloads.json',
    circleRadius: 52 // Matches CSS SVG radius
};

// DOM Elements
const elLoader = document.getElementById('loader');
const elDownloadSection = document.getElementById('download-section');
const elErrorSection = document.getElementById('error-section');
const elTimerWrapper = document.getElementById('timer-wrapper');
const elCountdownText = document.getElementById('countdown-text');
const elProgressCircle = document.getElementById('progress-circle');
const elActionWrapper = document.getElementById('action-wrapper');
const elDownloadBtn = document.getElementById('download-btn');

document.addEventListener('DOMContentLoaded', initDownloadSystem);

async function initDownloadSystem() {
    try {
        // 1. Sanitize and Get URL Parameter
        const urlParams = new URLSearchParams(window.location.search);
        const downloadId = urlParams.get('id');

        if (!downloadId || downloadId.trim() === '') {
            return showError();
        }

        // 2. Fetch JSON Database
        const response = await fetch(CONFIG.jsonDbPath);
        if (!response.ok) throw new Error('Database fetch failed');
        
        const database = await response.json();

        // 3. Validate ID
        if (!database.hasOwnProperty(downloadId)) {
            return showError();
        }

        // 4. Setup Download Link
        const downloadData = database[downloadId];
        setupDownload(downloadData.link);

    } catch (error) {
        console.error('Download System Error:', error);
        showError();
    }
}

function setupDownload(url) {
    // Hide skeleton, show active download section
    elLoader.classList.remove('active');
    elDownloadSection.classList.remove('hidden');
    elDownloadSection.classList.add('fade-in');

    // Attach URL to button (Fallback)
    elDownloadBtn.href = url;
    
    // Start Timer
    startTimer(url);
}

function startTimer(redirectUrl) {
    let timeLeft = CONFIG.timerSeconds;
    const circumference = 2 * Math.PI * CONFIG.circleRadius;
    
    // Initialize Circle SVG offset
    elProgressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
    elProgressCircle.style.strokeDashoffset = 0;

    elCountdownText.textContent = timeLeft;

    const timerInterval = setInterval(() => {
        timeLeft--;
        elCountdownText.textContent = timeLeft;

        // Calculate offset for smooth circular animation
        const offset = circumference - (timeLeft / CONFIG.timerSeconds) * circumference;
        elProgressCircle.style.strokeDashoffset = offset;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            onTimerComplete(redirectUrl);
        }
    }, 1000);
}

function onTimerComplete(redirectUrl) {
    // Hide timer
    elTimerWrapper.style.display = 'none';

    // Show button with animation
    elActionWrapper.classList.remove('hidden');
    elActionWrapper.classList.add('fade-in');

    // Smooth Scroll slightly down to focus on button and native ad
    window.scrollBy({
        top: 150,
        behavior: 'smooth'
    });

    // Handle Direct click event for strict requirements
    elDownloadBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = redirectUrl;
    });
}

function showError() {
    elLoader.classList.remove('active');
    elDownloadSection.classList.add('hidden');
    
    elErrorSection.classList.remove('hidden');
    elErrorSection.classList.add('fade-in');
}
