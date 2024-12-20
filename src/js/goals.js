// DOM Elements
const addGoalBtn = document.getElementById('addGoalBtn');
const addGoalModal = document.getElementById('addGoalModal');
const addGoalForm = document.getElementById('addGoalForm');
const cancelGoalBtn = document.getElementById('cancelGoalBtn');
const goalsContainer = document.getElementById('goalsContainer');

const API_URL = '/api';

// Event Listeners
addGoalBtn.addEventListener('click', () => {
    addGoalModal.classList.remove('hidden');
});

cancelGoalBtn.addEventListener('click', () => {
    addGoalModal.classList.add('hidden');
    addGoalForm.reset();
});

addGoalForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const title = document.getElementById('goalTitle').value;
    const description = document.getElementById('goalDescription').value;
    const endDate = document.getElementById('goalEndDate').value;
    
    try {
        const response = await fetch(`${API_URL}/goals`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title,
                description,
                endDate
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create goal');
        }

        await loadGoals();
        addGoalModal.classList.add('hidden');
        addGoalForm.reset();
    } catch (error) {
        console.error('Error creating goal:', error);
        alert(error.message || 'Failed to create goal. Please try again.');
    }
});

// Functions
async function deleteGoal(id) {
    try {
        const response = await fetch(`${API_URL}/goals/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to delete goal');
        }

        await loadGoals();
    } catch (error) {
        console.error('Error deleting goal:', error);
        alert(error.message || 'Failed to delete goal. Please try again.');
    }
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

async function loadGoals() {
    try {
        const response = await fetch(`${API_URL}/goals`);
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch goals');
        }
        
        const goals = await response.json();
        renderGoals(goals);
    } catch (error) {
        console.error('Error loading goals:', error);
        goalsContainer.innerHTML = `<p class="text-red-500">${error.message || 'Failed to load goals. Please refresh the page.'}</p>`;
    }
}

function renderGoals(goals) {
    goalsContainer.innerHTML = '';
    
    if (!goals.length) {
        goalsContainer.innerHTML = '<p class="text-gray-500">No goals added yet.</p>';
        return;
    }
    
    goals.forEach(goal => {
        const goalCard = document.createElement('div');
        goalCard.className = 'goal-card';
        goalCard.innerHTML = `
            <h3>${goal.title}</h3>
            <p>${goal.description}</p>
            <p class="text-sm text-gray-500">Due: ${formatDate(goal.end_date)}</p>
            <button onclick="deleteGoal('${goal._id}')" class="delete-btn">
                Delete Goal
            </button>
        `;
        goalsContainer.appendChild(goalCard);
    });
}

// Initial load
loadGoals();
