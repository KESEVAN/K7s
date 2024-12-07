// DOM Elements
const addWorkBtn = document.getElementById('addWorkBtn');
const addWorkModal = document.getElementById('addWorkModal');
const addWorkForm = document.getElementById('addWorkForm');
const cancelWorkBtn = document.getElementById('cancelWorkBtn');
const worksContainer = document.getElementById('worksContainer');

const API_URL = '/api';

// Event Listeners
addWorkBtn.addEventListener('click', () => {
    addWorkModal.classList.remove('hidden');
});

cancelWorkBtn.addEventListener('click', () => {
    addWorkModal.classList.add('hidden');
    addWorkForm.reset();
});

addWorkForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const title = document.getElementById('workTitle').value;
    const description = document.getElementById('workDescription').value;
    const link = document.getElementById('workLink').value;
    
    try {
        const response = await fetch(`${API_URL}/works`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title,
                description,
                link
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create work');
        }

        await loadWorks();
        addWorkModal.classList.add('hidden');
        addWorkForm.reset();
    } catch (error) {
        console.error('Error creating work:', error);
        alert(error.message || 'Failed to create work. Please try again.');
    }
});

// Functions
async function deleteWork(id) {
    try {
        const response = await fetch(`${API_URL}/works/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to delete work');
        }

        await loadWorks();
    } catch (error) {
        console.error('Error deleting work:', error);
        alert(error.message || 'Failed to delete work. Please try again.');
    }
}

async function loadWorks() {
    try {
        const response = await fetch(`${API_URL}/works`);
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch works');
        }
        
        const works = await response.json();
        renderWorks(works);
    } catch (error) {
        console.error('Error loading works:', error);
        worksContainer.innerHTML = `<p class="text-red-500">${error.message || 'Failed to load works. Please refresh the page.'}</p>`;
    }
}

function renderWorks(works) {
    worksContainer.innerHTML = '';
    
    if (!works.length) {
        worksContainer.innerHTML = '<p class="text-gray-500">No works added yet.</p>';
        return;
    }
    
    works.forEach(work => {
        const workCard = document.createElement('div');
        workCard.className = 'goal-card';
        workCard.innerHTML = `
            <h3>${work.title}</h3>
            <p>${work.description}</p>
            ${work.link ? `<a href="${work.link}" target="_blank" class="text-accent hover:text-accent-light block mb-4">View Project →</a>` : ''}
            <button onclick="deleteWork('${work._id}')" class="delete-btn">
                Delete Work
            </button>
        `;
        worksContainer.appendChild(workCard);
    });
}

// Initial load
loadWorks();
