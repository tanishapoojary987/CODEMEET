let violationCount = 0;

// Automatically start exam functionality when the page loads
window.onload = function () {
  requestFullscreenMode(); // Enter fullscreen immediately on page load
  startWebcam(); // Start webcam after fullscreen mode is requested
};

// Enable Fullscreen and exam monitoring
function startExam() {
  // Detect Tab switching
  window.addEventListener('blur', () => {
    logViolation('User attempted to switch tabs or lost focus');
    endExam(); // End the exam if tab is switched
  });

  // Detect Fullscreen Exit
  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) {
      logViolation('User exited fullscreen mode');
      endExam(); // End the exam if fullscreen mode is exited
    }
  });

  // Handle window resizing (important to track users trying to escape fullscreen)
  window.addEventListener('resize', () => {
    if (!document.fullscreenElement) {
      logViolation('User resized the window or exited fullscreen');
      endExam(); // End the exam if window is resized
    }
  });

  // Disable right-click and copying
  document.addEventListener('contextmenu', event => event.preventDefault());
  document.addEventListener('copy', event => event.preventDefault());
}

// Start Webcam Feed and enable Fullscreen after
function startWebcam() {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      document.getElementById('webcam').srcObject = stream;
      console.log('Webcam started');
      
      // Start exam monitoring after webcam starts
      startExam();
    })
    .catch(error => {
      console.error("Webcam Error: ", error);
    });
}

// Request Fullscreen Mode
function requestFullscreenMode() {
  if (document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen();
  } else if (document.documentElement.mozRequestFullScreen) { // Firefox
    document.documentElement.mozRequestFullScreen();
  } else if (document.documentElement.webkitRequestFullscreen) { // Chrome, Safari, Opera
    document.documentElement.webkitRequestFullscreen();
  } else if (document.documentElement.msRequestFullscreen) { // IE/Edge
    document.documentElement.msRequestFullscreen();
  }
}

// End the Exam Immediately
function endExam() {
  alert("You have violated the exam rules. The exam is terminated.");
  window.location.href = '/terminate'; // Redirect to the termination page
}

// Log Violations
function logViolation(message) {
  violationCount++;
  document.getElementById('warning').classList.remove('hidden');
  console.log(message);
  sendViolationToServer(message);
}

// Send Violations to Server
function sendViolationToServer(message) {
  fetch('/log-violation', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ message, timestamp: new Date() })
  });
}