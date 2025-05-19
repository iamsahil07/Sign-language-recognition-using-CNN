// let detectedLetters = [];
// let lastLetter = "";
// let lastLetterTime = Date.now();

// // Function to fetch detected text from backend
// function fetchDetectedText() {
//     fetch('http://127.0.0.1:5001/get_text')
//         .then(response => response.json())
//         .then(data => {
//             let letter = data.detected_text.trim();

//             // Only add if different from last detected letter
//             if (letter && letter !== lastLetter) {
//                 let currentTime = Date.now();

//                 // Ignore repeated detections within 500ms
//                 if (currentTime - lastLetterTime > 500) {
//                     detectedLetters.push(letter);
//                     lastLetter = letter;
//                     lastLetterTime = currentTime;
//                 }
//             }

//             // Display formed word
//             document.getElementById("detectedText").innerText = detectedLetters.join('');
//         })
//         .catch(error => console.error("Error fetching detected text:", error));
// }

// // Update detected letters every 500ms
// setInterval(fetchDetectedText, 500);








































// let detectedLetters = [];
// let wordHistory = [];
// let lastLetter = "";
// let lastLetterTime = Date.now();

// // Function to fetch detected text from backend
// function fetchDetectedText() {
//     fetch('/get_text')  // Changed to relative URL
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }
//             return response.json();
//         })
//         .then(data => {
//             let letter = data.detected_text.trim();

//             // Only add if different from last detected letter
//             if (letter && letter !== lastLetter) {
//                 let currentTime = Date.now();

//                 // Ignore repeated detections within 500ms
//                 if (currentTime - lastLetterTime > 500) {
//                     // Add letter to detected letters
//                     detectedLetters.push(letter);
                    
//                     // Update last letter and time
//                     lastLetter = letter;
//                     lastLetterTime = currentTime;

//                     // Automatically build word
//                     updateWord();
//                 }
//             }
//         })
//         .catch(error => {
//             console.error("Error fetching detected text:", error);
//         });
// }

// // Function to update and display current word
// function updateWord() {
//     // Display current detected letters
//     document.getElementById("detectedText").innerText = detectedLetters.join('');
    
//     // Build and display current word
//     let currentWord = detectedLetters.join('');
//     document.getElementById("currentWord").innerText = currentWord;
// }

// // Function to speak the current word
// function speakWord() {
//     let currentWord = detectedLetters.join('');
//     if ('speechSynthesis' in window) {
//         const utterance = new SpeechSynthesisUtterance(currentWord);
//         window.speechSynthesis.speak(utterance);
//     } else {
//         alert('Text-to-speech not supported in this browser');
//     }
// }

// // Function to clear last letter
// function clearLastLetter() {
//     if (detectedLetters.length > 0) {
//         detectedLetters.pop();
//         updateWord();
//     }
// }

// // Function to clear all letters
// function clearAllLetters() {
//     detectedLetters = [];
//     updateWord();
// }

// // Function to save current word to history
// function saveWord() {
//     let currentWord = detectedLetters.join('');
//     if (currentWord) {
//         wordHistory.push(currentWord);
//         updateWordHistory();
//         clearAllLetters();
//     }
// }

// // Function to update word history display
// function updateWordHistory() {
//     const historyElement = document.getElementById("wordHistory");
//     historyElement.innerHTML = wordHistory.map((word, index) => 
//         `<div class="history-word">${index + 1}. ${word}</div>`
//     ).join('');
// }

// // Update detected letters every 500ms
// setInterval(fetchDetectedText, 500);

// // Attach event listeners when DOM is fully loaded
// document.addEventListener('DOMContentLoaded', () => {
//     document.getElementById('speakWordBtn').addEventListener('click', speakWord);
//     document.getElementById('clearLastBtn').addEventListener('click', clearLastLetter);
//     document.getElementById('clearAllBtn').addEventListener('click', clearAllLetters);
//     document.getElementById('saveWordBtn').addEventListener('click', saveWord);
// });



















let detectedLetters = [];
let wordHistory = [];
let lastLetter = "";
let lastLetterTime = Date.now();

// Function to fetch detected text from backend
function fetchDetectedText() {
    fetch('/get_text')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            let letter = data.detected_text.trim();

            // Only add if different from last detected letter
            if (letter && letter !== lastLetter) {
                let currentTime = Date.now();

                // Ignore repeated detections within 500ms
                if (currentTime - lastLetterTime > 500) {
                    // Add letter to detected letters
                    detectedLetters.push(letter);
                    
                    // Update last letter and time
                    lastLetter = letter;
                    lastLetterTime = currentTime;

                    // Automatically build word
                    updateWord();
                }
            }
        })
        .catch(error => {
            console.error("Error fetching detected text:", error);
        });
}

// Function to update and display current word
function updateWord() {
    // Display current detected letters
    document.getElementById("detectedText").innerText = detectedLetters.join('');
    
    // Build and display current word
    let currentWord = detectedLetters.join('');
    document.getElementById("currentWord").innerText = currentWord;
}

// Function to speak the current word
function speakWord() {
    let currentWord = detectedLetters.join('');
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(currentWord);
        window.speechSynthesis.speak(utterance);
    } else {
        alert('Text-to-speech not supported in this browser');
    }
}

// Function to clear last letter
function clearLastLetter() {
    if (detectedLetters.length > 0) {
        detectedLetters.pop();
        updateWord();
    }
}

// Function to clear all letters
function clearAllLetters() {
    detectedLetters = [];
    updateWord();
}

// Function to add space
function addSpace() {
    detectedLetters.push(' ');
    updateWord();
}

// Function to save current word to history
function saveWord() {
    let currentWord = detectedLetters.join('');
    if (currentWord.trim()) {
        wordHistory.push(currentWord);
        updateWordHistory();
        clearAllLetters();
    }
}

// Function to update word history display
function updateWordHistory() {
    const historyElement = document.getElementById("wordHistory");
    historyElement.innerHTML = wordHistory.map((word, index) => 
        `<div class="history-word">${index + 1}. ${word}</div>`
    ).join('');
}

// Update detected letters every 500ms
setInterval(fetchDetectedText, 500);

// Attach event listeners when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('speakWordBtn').addEventListener('click', speakWord);
    document.getElementById('clearLastBtn').addEventListener('click', clearLastLetter);
    document.getElementById('clearAllBtn').addEventListener('click', clearAllLetters);
    document.getElementById('saveWordBtn').addEventListener('click', saveWord);
    document.getElementById('addSpaceBtn').addEventListener('click', addSpace);
});