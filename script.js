document.addEventListener('DOMContentLoaded', () => {
    // Initialize the pie chart without hardcoded values
    const ctx = document.getElementById('calorie-chart').getContext('2d');

    calorieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Remaining Calories', 'Consumed Calories'],
            datasets: [{
                data: [0, 0], // Start with empty data
                backgroundColor: ['#43cea2 ', '#185a9d']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
            }
        }
    });
});

function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.style.display = 'none';
    });
    document.getElementById(tabId).style.display = 'block';
}

function calculateTDEE() {
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value);
    const age = parseInt(document.getElementById('age').value);
    const gender = document.getElementById('gender').value;
    const activity = parseFloat(document.getElementById('activity').value);

    if (isNaN(weight) || isNaN(height) || isNaN(age) || isNaN(activity)) {
        alert('Please fill in all fields correctly.');
        return;
    }

    const bmr = gender === 'male'
        ? 10 * weight + 6.25 * height - 5 * age + 5
        : 10 * weight + 6.25 * height - 5 * age - 161;
    const tdee = bmr * activity;

    document.getElementById('tdee-result').innerText = `Your TDEE is ${tdee.toFixed(2)} calories.`;

    // Initialize the pie chart with the calculated TDEE
    totalCalories = tdee; // Use the calculated TDEE value
    remainingCalories = totalCalories;

    calorieChart.data.datasets[0].data = [remainingCalories, 0]; // Update with calculated TDEE
    calorieChart.update();

    // Update the remaining calories text and make it visible
    const remainingCaloriesElement = document.getElementById('remaining-calories');
    if (remainingCaloriesElement) {
        remainingCaloriesElement.innerText = `Remaining Calories: ${remainingCalories.toFixed(2)}`;
        remainingCaloriesElement.style.display = 'block';
    } else {
        console.error('Remaining Calories element not found.');
    }
}

function updateRemainingCaloriesText() {
    const foodList = document.getElementById('food-list').children;
    let consumedCalories = 0;

    for (const item of foodList) {
        const caloriesMatch = item.innerText.match(/(\d+) calories/);
        if (caloriesMatch) {
            consumedCalories += parseInt(caloriesMatch[1]);
        }
    }

    const remainingCalories = totalCalories - consumedCalories;
    document.getElementById('remaining-calories').innerText = `Remaining Calories: ${remainingCalories}`;
}

function addFood() {
    const foodName = document.getElementById('food-name').value;
    const calories = parseFloat(document.getElementById('calories').value);
    const protein = parseFloat(document.getElementById('protein').value);
    const carbs = parseFloat(document.getElementById('carbs').value);
    const fat = parseFloat(document.getElementById('fat').value);

    if (!foodName || isNaN(calories) || isNaN(protein) || isNaN(carbs) || isNaN(fat)) {
        alert('Please fill in all fields correctly.');
        return;
    }

    const foodList = document.getElementById('food-list');
    const listItem = document.createElement('li');
    listItem.innerText = `${foodName} - ${calories} calories (Protein: ${protein}g, Carbs: ${carbs}g, Fat: ${fat}g)`;
    foodList.appendChild(listItem);

    document.getElementById('food-form').reset();

    // Update the consumed and remaining calories after adding a food item
    const foodListItems = document.getElementById('food-list').children;
    let consumedCalories = 0;

    for (const item of foodListItems) {
        const caloriesMatch = item.innerText.match(/(\d+) calories/);
        if (caloriesMatch) {
            consumedCalories += parseInt(caloriesMatch[1]);
        }
    }

    const remainingCalories = totalCalories - consumedCalories;
    document.getElementById('remaining-calories').innerText = `Remaining Calories: ${remainingCalories.toFixed(2)}`;

    // Update the pie chart
    if (calorieChart) {
        calorieChart.data.datasets[0].data = [remainingCalories, consumedCalories];
        calorieChart.update();
    }
}

function addExercise() {
    const exercise = document.getElementById('exercise').value;
    const sets = parseInt(document.getElementById('sets').value);
    const reps = parseInt(document.getElementById('reps').value);

    if (!exercise || isNaN(sets) || isNaN(reps)) {
        alert('Please fill in all fields correctly.');
        return;
    }

    const workoutList = document.getElementById('workout-list');
    const listItem = document.createElement('li');
    listItem.innerText = `${exercise} - ${sets} sets x ${reps} reps`;
    workoutList.appendChild(listItem);

    document.getElementById('workout-form').reset();
}

document.getElementById('protein').addEventListener('input', updateCaloriesFromMacros);
document.getElementById('carbs').addEventListener('input', updateCaloriesFromMacros);
document.getElementById('fat').addEventListener('input', updateCaloriesFromMacros);

function updateCaloriesFromMacros() {
    const protein = parseFloat(document.getElementById('protein').value) || 0;
    const carbs = parseFloat(document.getElementById('carbs').value) || 0;
    const fat = parseFloat(document.getElementById('fat').value) || 0;

    const calories = (protein * 4) + (carbs * 4) + (fat * 9);
    document.getElementById('calories').value = calories.toFixed(2);
}