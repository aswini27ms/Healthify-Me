let recipes = JSON.parse(localStorage.getItem('recipes')) || [];

function addRecipe() {
    const name = document.getElementById('recipeName').value;
    const ingredients = document.getElementById('recipeIngredients').value;
    const instructions = document.getElementById('recipeInstructions').value;
    const imageInput = document.getElementById('recipeImage');
    let imageUrl = '';

    if (imageInput.files && imageInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            imageUrl = e.target.result;
            saveRecipe(name, ingredients, instructions, imageUrl);
        };
        reader.readAsDataURL(imageInput.files[0]);
    } else {
        saveRecipe(name, ingredients, instructions, '');
    }
}

function saveRecipe(name, ingredients, instructions, imageUrl) {
    if (name && ingredients && instructions) {
        const newRecipe = { name, ingredients, instructions, imageUrl, reviews: [], ratings: [] };
        recipes.push(newRecipe);
        localStorage.setItem('recipes', JSON.stringify(recipes));
        displayRecipes();
        clearForm();
    } else {
        alert('Please fill out all fields');
    }
}

function displayRecipes(filteredRecipes = recipes) {
    const recipeContainer = document.getElementById('recipeContainer');
    recipeContainer.innerHTML = '';

    filteredRecipes.forEach((recipe, index) => {
        const recipeItem = document.createElement('div');
        recipeItem.classList.add('recipe-item');

        recipeItem.innerHTML = `
            <h2>${recipe.name}</h2>
            <img src="${recipe.imageUrl}" alt="${recipe.name}">
            <p><strong>Average Rating:</strong> ${calculateAverageRating(recipe)}</p>
            <button class="delete-button" onclick="deleteRecipe(${index})">Delete</button>
        `;

        recipeItem.addEventListener('click', () => toggleRecipeDetails(recipeItem, index));

        recipeContainer.appendChild(recipeItem);
    });
}

function calculateAverageRating(recipe) {
    const averageRating = recipe.ratings.length ? (recipe.ratings.reduce((a, b) => a + b) / recipe.ratings.length).toFixed(1) : 'No ratings';
    return averageRating;
}

function toggleRecipeDetails(recipeItem, index) {
    const isActive = recipeItem.classList.toggle('active');

    if (isActive) {
        const recipe = recipes[index];
        const recipeDetails = document.createElement('div');
        recipeDetails.classList.add('recipe-item-details');
        recipeDetails.innerHTML = `
            <p><strong>Ingredients:</strong> ${recipe.ingredients}</p>
            <p><strong>Instructions:</strong> ${recipe.instructions}</p>
            <div class="review">
                <h3>Reviews</h3>
                ${recipe.reviews.length > 0 ? recipe.reviews.map(review => `<p>${review}</p>`).join('') : '<p>No reviews yet.</p>'}
                <textarea id="review-${index}" placeholder="Add a review"></textarea>
                <button onclick="addReview(${index})">Submit Review</button>
                <div class="rating">
                    ${[5, 4, 3, 2, 1].map(star => `
                        <input type="radio" id="star${star}-${index}" name="rating-${index}" value="${star}">
                        <label for="star${star}-${index}">&#9733;</label>
                    `).join('')}
                </div>
            </div>
        `;
        recipeItem.appendChild(recipeDetails);
    } else {
        const recipeDetails = recipeItem.querySelector('.recipe-item-details');
        recipeDetails.remove();
    }
}

function clearForm() {
    document.getElementById('recipeName').value = '';
    document.getElementById('recipeIngredients').value = '';
    document.getElementById('recipeInstructions').value = '';
    document.getElementById('recipeImage').value = '';
}

function addReview(index) {
    const reviewText = document.getElementById(`review-${index}`).value;
    const rating = document.querySelector(`input[name="rating-${index}"]:checked`);
    if (reviewText) {
        recipes[index].reviews.push(reviewText);
    }
    if (rating) {
        recipes[index].ratings.push(Number(rating.value));
    }
    localStorage.setItem('recipes', JSON.stringify(recipes));
    displayRecipes();
}

function deleteRecipe(index) {
    recipes.splice(index, 1);
    localStorage.setItem('recipes', JSON.stringify(recipes));
    displayRecipes();
}

document.getElementById('search').addEventListener('input', function (e) {
    const query = e.target.value.toLowerCase();
    const filteredRecipes = recipes.filter(recipe =>
        recipe.name.toLowerCase().includes(query) ||
        recipe.ingredients.toLowerCase().includes(query) ||
        recipe.instructions.toLowerCase().includes(query)
    );
    displayRecipes(filteredRecipes);
});

document.addEventListener('DOMContentLoaded', function () {
    displayRecipes();
});
