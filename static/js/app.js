const socket = io();

let chairs = {};

const chairGrid = document.getElementById('chairGrid');
const freeCountEl = document.getElementById('freeCount');
const occupiedCountEl = document.getElementById('occupiedCount');

// Create chair card
function createChairCard(chairId, chair) {
    const card = document.createElement('div');
    card.className = `chair-card ${chair.occupied ? 'occupied' : 'free'}`;
    card.dataset.chair = chairId;
    card.innerHTML = `
        <div class="chair-id">${chairId}</div>
        <div class="status">${chair.occupied ? 'Occupied' : 'FREE'}</div>
        <div class="fsr-value">FSR: ${chair.fsr}</div>
        <div class="timestamp">${new Date(chair.time * 1000).toLocaleTimeString()}</div>
    `;
    chairGrid.appendChild(card);
}

// Update stats
function updateStats() {
    const freeChairs = Object.values(chairs).filter(c => !c.occupied).length;
    const occupiedChairs = Object.values(chairs).filter(c => c.occupied).length;
    
    freeCountEl.textContent = freeChairs;
    occupiedCountEl.textContent = occupiedChairs;
}

// Load all chairs
function loadChairs() {
    Object.keys(chairs).forEach(chairId => {
        const existingCard = document.querySelector(`[data-chair="${chairId}"]`);
        if (existingCard) {
            // Update existing
            existingCard.className = `chair-card ${chairs[chairId].occupied ? 'occupied' : 'free'}`;
            existingCard.querySelector('.status').textContent = chairs[chairId].occupied ? 'Occupied' : 'FREE';
            existingCard.querySelector('.fsr-value').textContent = `FSR: ${chairs[chairId].fsr}`;
            existingCard.querySelector('.timestamp').textContent = new Date(chairs[chairId].time * 1000).toLocaleTimeString();
        } else {
            // Create new
            createChairCard(chairId, chairs[chairId]);
        }
    });
    updateStats();
}

// Socket events
socket.on('connect', () => {
    console.log('✅ LIVE connection established!');
});

socket.on('status_update', (data) => {
    chairs[data.chair_id] = {
        occupied: data.occupied,
        fsr: data.fsr_value || 0,
        time: Date.now() / 1000
    };
    loadChairs();
});

// Initialize
window.addEventListener('load', () => {
    // Create initial chairs
    for (let i = 1; i <= 5; i++) {
        chairs[`Chair_${i}`] = { occupied: i === 3, fsr: i === 3 ? 2500 : 100, time: Date.now() / 1000 };
    }
    loadChairs();
});
