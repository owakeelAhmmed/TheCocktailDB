
const searchInput = document.getElementById('searchInput');
const drinksList = document.getElementById('drinksList');
const drinkCount = document.getElementById('drinkCount');
const result = document.getElementById('cardShow');
let drinks = [];


const showAlert = () => {
    const alert = document.getElementById('alertBox');
    alert.classList.remove('d-none');

    setTimeout(() => {
        if(alert){
            alert.classList.add('d-none');
        }
    }, 3000);
}


const addToCart = (drinkName, drinkImg) => {

        const totalCount = drinks.reduce((sum, drink) => sum + drink.count, 0);
    
        const existingDrink = drinks.find(drink => drink.name === drinkName);

        if(existingDrink){
            if(existingDrink.count >= 7){
                showAlert();
                return;
            }
            existingDrink.count += 1;
        } else {
            drinks.push({
                name: drinkName,
                img: drinkImg,
                count: 1
            })
        }
            cartDrinks();
}

const cartDrinks = () => {
    drinksList.innerHTML = drinks.map((drink, index) => 
        `
        <div class="d-flex align-items-center gap-3 border-bottom py-2">
            <strong>${index + 1}.</strong>
            <img src="${drink.img}" alt="${drink.name}" width="50" class="rounded">
            <span>${drink.name}</span>
            <span class="badge bg-primary">${drink.count}</span>
        </div>
    `).join('');


    const totalCount = drinks.reduce((sum, d) => sum + d.count, 0);
    drinkCount.textContent = totalCount;
    drinkCount.textContent = drinks.length;
}



const loadDefaultDrinks = async () => {
    const res = await fetch('https://www.thecocktaildb.com/api/json/v1/1/search.php?f=a');
    const data = await res.json();
    if(data.drinks){
        displayDrinks(data.drinks);
    } else{
        result.innerHTML = `<h4 class="text-danger">No drinks found</h4>`;
    }
};


const searchHandle = () => {
    const query = searchInput.value.trim();
    if(!query){
        result.innerHTML = `<h4 class="text-danger">Please enter a drink name</h4>`;
        return;
    }

    fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${query}`)
    .then(res => res.json())
    .then(data => {
        if(data.drinks){
            displayDrinks(data.drinks);
        } else {
            result.innerHTML = `<h4 class="text-danger w-[50%] text-center">No drinks found for "${query}"</h4>`;
        }
    }).catch(error => {
        console.error('Error fetching drinks:', error);
        result.innerHTML = `<h4 class="text-danger">An error occurred while fetching drinks</h4>`;
    });
}

const showDetails = (drinkId) => {
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${drinkId}`)
    .then(res => res.json())
    .then(data => {
        const drink = data.drinks[0];
        const modatBody = document.getElementById('modalBodyContent');
        modatBody.innerHTML = `
        
        <img src="${drink.strDrinkThumb}" class="custom-img mb-3" alt="${drink.strDrink}">
        <h4>${drink.strDrink}</h4>
        <p><strong>Category:</strong> ${drink.strCategory}</p>
        <p><strong>Instructions:</strong> ${drink.strInstructions}</p>
        <p><strong>Glass:</strong> ${drink.strGlass}</p>
        <p><strong>Alcoholic:</strong> ${drink.strAlcoholic}</p>
        <p><strong>Instructions:</strong> ${drink.strInstructions}</p>
      `;
      const modal = new bootstrap.Modal(document.getElementById('mealDetailModal'));
      modal.show();
    })
}


const displayDrinks = (drinks) => {
    result.innerHTML = drinks.map(drink => `
        <div class="col">
            <div class="card h-100">
                <img src="${drink.strDrinkThumb}" class="card-img-top" alt="${drink.strDrink}">
                <div class="card-body">
                    <h5 class="card-title">${drink.strDrink}</h5>
                    <h5 class="card-title">${drink.strGlass}</h5>
                    <h5 class="card-title">${drink.strInstructions.slice(0,20)}...</h5>
               <div class="d-flex justify-content-evenly mt-4">
                    <button type="button" class="btn btn-success" onClick="addToCart('${drink.strDrink}', '${drink.strDrinkThumb}')">Add to cart</button>
                    <button type="button" class="btn btn-success" onClick="showDetails('${drink.idDrink}')">Details</button>
                </div>
                </div>
                
            </div>
        </div>
    `).join('');
};


const handleSearch = async () => {
    const input = document.getElementById('searchInput').value.trim();
    if (!input) return;
    const res = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${input}`);
    const data = await res.json();
    if (data.drinks) {
        displayDrinks(data.drinks);
    } else {
        result.innerHTML = `<h4 class="text-danger">No drinks found for "${input}"</h4>`;
    }
};

loadDefaultDrinks();
