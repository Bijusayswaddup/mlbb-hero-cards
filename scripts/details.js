// ========== CONFIGURATION ==========
const HEROES_DATA_URL = '/mlbb-hero-cards/data/heroes.json';
const DEFAULT_HERO_ID = 1; // Fallback if no ID found

// ========== STATE ==========
let currentHero = null;
let currentImageType = 'model'; // 'model' or 'splash'

// ========== DOM ELEMENTS ==========
const heroContent = document.querySelector('.hero-content');
const backButton = document.getElementById('back-btn');

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const heroId = getHeroIdFromURL();
        const heroes = await loadHeroData();
        currentHero = heroes.find(h => h.id == heroId) || heroes[0];
        
        if (!currentHero) throw new Error('Hero not found');
        renderHeroDetails();
        setupEventListeners();
    } catch (error) {
        handleError(error);
    }
});

// ========== DATA LOADING ==========
async function loadHeroData() {
    const response = await fetch(HEROES_DATA_URL);
    if (!response.ok) throw new Error('Failed to load data');
    return await response.json();
}

function getHeroIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get('id')) || DEFAULT_HERO_ID;
}

// ========== RENDER FUNCTIONS ==========
function renderHeroDetails() {
    heroContent.innerHTML = `
        <section class="hero-header">
            <h1 class="hero-name">${currentHero.name}</h1>
            <p class="hero-role">${currentHero.role}</p>
        </section>
        <div class="grid">
            <section class="image-gallery">
                <div class="gallery-tabs">
                    <button class="gallery-tab ${currentImageType === 'model' ? 'active' : ''}" 
                            data-type="model">
                        3D Model
                    </button>
                    <button class="gallery-tab ${currentImageType === 'splash' ? 'active' : ''}" 
                            data-type="splash">
                        Splash Art
                    </button>
                </div>
                <img class="gallery-image" 
                    src="${window.location.origin}/mlbb-hero-cards/${currentHero.images[currentImageType]}" 
                    alt="${currentHero.name}">
            </section>

            <section class="stats-section">
                <h2 class="section-title">Attributes</h2>
                ${renderStats()}
            </section>
        </div>

        ${renderSkillsSection()}

        <section class="skins-section">
            <h2 class="section-title">Skins</h2>
            ${renderSkinCarousel()}
        </section>
    `;

    // Animate progress bars after render
    setTimeout(animateProgressBars, 100);
}

function renderStats() {
    return `
    <div class="stats-grid">
        ${Object.entries(currentHero.stats).map(([stat, value]) => `
            <div class="stat-item">
                <div class="stat-header">
                    <span class="stat-label">${stat}</span>
                    <span class="stat-value">${value}/10</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" 
                         style="width: ${value * 10}%"
                         data-value="${value}"></div>
                </div>
            </div>
        `).join('')}
    </div>`;
}

function renderSkillsSection() {
    return `
    <section class="skills-section">
        <h2 class="section-title">Abilities</h2>
        <div class="skills-grid">
            ${currentHero.skills.map((skill, index) => `
                <div class="skill-card">
                    <div class="skill-icon">
                        <img src="${window.location.origin}/mlbb-hero-cards/${skill.icon}" alt="${skill.name}">
                    </div>
                    <div class="skill-info">
                        <h3 class="skill-name">${skill.name}</h3>
                        <p class="skill-desc">${skill.description}</p>
                        <div class="skill-meta">
                            <span>Cooldown: ${skill.cooldown}s</span>
                            <span>Cost: ${skill.manaCost} Mana</span>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    </section>`;
}

function renderSkinCarousel() {
    return `
    <div class="skins-carousel">
        ${currentHero.skins.map((skin, index) => `
            <div class="skin-card" data-index="${index}">
                <img class="skin-image" 
                     src="${window.location.origin}/mlbb-hero-cards/${skin.image}" 
                     alt="${skin.name}">
                <div class="skin-info">
                    <h3 class="skin-name">${skin.name}</h3>
                    ${index === 0 ? '<span class="skin-badge">Default</span>' : ''}
                </div>
            </div>
        `).join('')}
    </div>`;
}

// ========== ANIMATIONS ==========
function animateProgressBars() {
    document.querySelectorAll('.progress-fill').forEach(bar => {
        bar.style.width = bar.style.width; // Trigger animation
    });
}

// ========== EVENT HANDLERS ==========
function setupEventListeners() {
    // Back button
    backButton.addEventListener('click', () => {
        window.location.href = '${window.location.origin}/mlbb-hero-cards/index.html';
    });

    // Image tabs
    document.querySelectorAll('.gallery-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            currentImageType = tab.dataset.type;
            document.querySelectorAll('.gallery-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            document.querySelector('.gallery-image').src = currentHero.images[currentImageType];
        });
    });

    // Skin carousel navigation
    const carousel = document.querySelector('.skins-carousel');
    if (carousel) {
        let isDown = false;
        let startX;
        let scrollLeft;

        carousel.addEventListener('mousedown', (e) => {
            isDown = true;
            startX = e.pageX - carousel.offsetLeft;
            scrollLeft = carousel.scrollLeft;
        });

        carousel.addEventListener('mouseleave', () => {
            isDown = false;
        });

        carousel.addEventListener('mouseup', () => {
            isDown = false;
        });

        carousel.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - carousel.offsetLeft;
            const walk = (x - startX) * 2;
            carousel.scrollLeft = scrollLeft - walk;
        });
    }
}

// ========== ERROR HANDLING ==========
function handleError(error) {
    console.error('Error:', error);
    heroContent.innerHTML = `
        <div class="error-state">
            <h2>Hero Data Unavailable</h2>
            <p>${error.message}</p>
            <button onclick="window.location.href='${window.location.origin}/mlbb-hero-cards/index.html'">Return to Heroes</button>
        </div>
    `;
}
