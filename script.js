const suggestions = [
  "A futuristic city at sunset",
  "A dragon made of clouds",
  "Cyberpunk Tokyo street",
  "A cat astronaut floating in space",
  "Underwater castle glowing with jellyfish",
  "A surreal dreamscape of melting clocks",
  "A robot painting a self-portrait",
  "A forest made of glass",
  "A neon jungle with glowing animals",
  "A steampunk airship battle",
  "A magical library in the sky",
  "A pixelated desert with floating pyramids",
  "A cosmic whale swimming through stars",
  "A haunted carnival at midnight",
  "A watercolor galaxy explosion",
  "A retro diner on Mars",
  "A butterfly made of fire",
  "A portal opening in a quiet meadow",
  "A mountain shaped like a sleeping giant",
  "A futuristic train flying over oceans"
];

let suggestionIndex = 0;
let suggestionInterval;

const promptInput = document.getElementById('prompt');
const suggestionText = document.getElementById('suggestion');
const generateBtn = document.getElementById('generateBtn');
const loading = document.getElementById('loading');
const result = document.getElementById('result');

// 🔁 Rotate suggestions
function showNextSuggestion() {
  suggestionText.style.opacity = 0;
  setTimeout(() => {
    suggestionText.textContent = suggestions[suggestionIndex];
    suggestionText.style.opacity = 1;
    suggestionIndex = (suggestionIndex + 1) % suggestions.length;
  }, 500);
}

function startSuggestionLoop() {
  suggestionInterval = setInterval(showNextSuggestion, 3000);
  showNextSuggestion();
}

function stopSuggestionLoop() {
  clearInterval(suggestionInterval);
  suggestionText.style.opacity = 0;
}

// 🚀 Start rotating on load
startSuggestionLoop();

// 🛑 Stop when user types
promptInput.addEventListener('input', () => {
  if (promptInput.value.trim().length > 0) {
    stopSuggestionLoop();
  } else {
    startSuggestionLoop();
  }
});

// 🎨 Generate AI Art
generateBtn.addEventListener('click', async () => {
  const prompt = promptInput.value.trim();
  if (!prompt) {
    alert('Please enter a prompt!');
    return;
  }

  // Reset UI
  result.style.display = 'none';
  result.style.opacity = 0;
  loading.style.display = 'flex';

  try {
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });

    const data = await res.json();
    result.src = data.image;

    result.onload = () => {
      loading.style.display = 'none';
      result.style.display = 'block';
      setTimeout(() => {
        result.style.opacity = 1;
      }, 100); // slight delay for smoother transition
    };
  } catch (err) {
    loading.style.display = 'none';
    alert('Something went wrong. Try again!');
  }
});
window.addEventListener('DOMContentLoaded', () => {
  // your suggestion loop code here
});
