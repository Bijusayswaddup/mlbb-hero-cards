// ========== CONFIGURATION ==========
const HEROES_DATA_URL = '/data/heroes.json';
const LOADING_TIPS = [
    "Analyzing hero patterns...",
    "Optimizing skill trees...",
    "Calibrating battle metrics...",
    "Synchronizing with the Abyss...",
    "Initializing neural network...",
    "Loading hero statistics...",
    "Evaluating team compositions...",
    "Assessing enemy strategies...",
    "Preparing battlefield simulations...",
    "Updating hero abilities...",
    "Calculating damage outputs...",
    "Reviewing past match performances...",
    "Enhancing matchmaking algorithms...",
    "Gathering player feedback...",
    "Refining item builds...",
    "Simulating hero synergies...",
    "Analyzing map control strategies...",
    "Optimizing resource management...",
    "Loading new hero skins...",
    "Preparing for epic battles...",
    "Examining win rates...",
    "Adjusting skill cooldowns...",
    "Forecasting enemy movements...",
    "Testing new gameplay mechanics...",
    "Analyzing crowd control effects...",
    "Evaluating jungle paths...",
    "Optimizing lane strategies...",
    "Loading seasonal events...",
    "Preparing for ranked matches...",
    "Enhancing visual effects..."
];

// ========== STATE MANAGEMENT ==========
let allHeroes = [];
let currentFilters = {
    searchTerm: '',
    role: 'all'
};

// ========== DOM ELEMENTS ==========
const heroGrid = document.getElementById('hero-grid');
const searchInput = document.getElementById('search');
const loadingScreen = document.getElementById('loading-screen');
const loadingTips = document.getElementById('loading-tips');

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', async () => {
    showLoadingTips();
    
    try {
        const response = await fetch(HEROES_DATA_URL);
        allHeroes = await response.json();
        initializeApp();
    } catch (error) {
        showError("Failed to load hero data. Please try again later.");
    }
});

function initializeApp() {
    // Hide loading screen after minimum display time
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.remove();
            document.querySelector('.container').classList.remove('hidden');
        }, 500);
    }, 2000);

    setupEventListeners();
    renderHeroGrid(allHeroes);
}

// ========== EVENT HANDLERS ==========
function setupEventListeners() {
    // Search input
    searchInput.addEventListener('input', (e) => {
        currentFilters.searchTerm = e.target.value.toLowerCase();
        filterAndRender();
    });

    // Role filters
    document.querySelectorAll('input[name="role"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            currentFilters.role = e.target.value;
            filterAndRender();
        });
    });

    // Hero card clicks
    heroGrid.addEventListener('click', (e) => {
        const card = e.target.closest('.hero-card');
        if (card) {
            const heroId = card.dataset.id;
            showHeroDetails(heroId);
        }
    });
}

// ========== FILTERING LOGIC ==========
function filterAndRender() {
    const filtered = allHeroes.filter(hero => {
        const matchesSearch = hero.name.toLowerCase().includes(currentFilters.searchTerm);
        const matchesRole = currentFilters.role === 'all' || hero.role === currentFilters.role;
        return matchesSearch && matchesRole;
    });
    
    renderHeroGrid(filtered);
}

// ========== RENDER FUNCTIONS ==========
function renderHeroGrid(heroes) {
    heroGrid.innerHTML = heroes.map(hero => `
        <div class="hero-card" data-id="${hero.id}">
            <img src="${hero.icon}" alt="${hero.name}" loading="lazy">
            <h3>${hero.name}</h3>
            <p class="hero-id">#${hero.id.toString().padStart(3, '0')}</p>
            <span class="hero-role">${hero.role}</span>
        </div>
    `).join('');
}

// ========== LOADING FUNCTIONS ==========
function showLoadingTips() {
    let currentTip = 0;
    loadingTips.textContent = LOADING_TIPS[0];
    
    const tipInterval = setInterval(() => {
        currentTip = (currentTip + 1) % LOADING_TIPS.length;
        loadingTips.textContent = LOADING_TIPS[currentTip];
    }, 1500);

    setTimeout(() => clearInterval(tipInterval), 2000);
}

// ========== NAVIGATION ==========
function showHeroDetails(heroId) {
    window.location.href = `details.html?id=${heroId}`;
}

// ========== ERROR HANDLING ==========
function showError(message) {
    const errorEl = document.createElement('div');
    errorEl.className = 'error-message';
    errorEl.innerHTML = `
        <div class="error-icon">⚠️</div>
        <p>${message}</p>
    `;
    document.body.appendChild(errorEl);
}
