const countriescontainer = document.querySelector(".card-container");
const inputField = document.querySelector(".input-text");
const mainPage = document.querySelector(".top-page");
const detailsPage = document.querySelector(".section-card-details");
const goBackBtn = document.querySelector(".btn-back");
const details = document.querySelector(".details");
const darkModeBtn = document.querySelector(".dark-mode-btn");
const icon = document.querySelector(".fa-regular");
const darkModeText = document.querySelector(".dark-mode-text");
const filterBtn = document.querySelector("select");

// Get data value for dark mode from local storage
const themeValue = JSON.parse(localStorage.getItem("theme"));

if (themeValue) document.body.classList.add(themeValue);

// Render Error Markup
const renderError = function (parentEl, msg) {
  const html = `
  <h2>${msg}</h3>
`;
  parentEl.innerHTML = "";
  parentEl.insertAdjacentHTML("afterbegin", html);
};

// Render Spinner Markup
const renderSpinner = function (parentEl) {
  const html = `
  <img class='spinner' src="loading-4.gif" alt="">
  `;
  parentEl.innerHTML = "";
  parentEl.insertAdjacentHTML("afterbegin", html);
};

// Render all countries card markup
const renderCardsMarkup = function (data, parentEl) {
  const allCountiesCards = data
    .map(function (card) {
      return `
    <div class="col-lg-3 col-md-6 col-sm-12 d-flex align-items-stretch justify-content-center bootcard">
        <div class="card section-card ">
        <img
            src="${card.flags.png}"
            class="card-img-top section-card__image"
            alt="..."
        />
        <div class="card-body section-card__body">
            <h3 class="card-title"><strong>${card.name.common}</strong></h3>
            <p class="card-text"><strong>Population:</strong> ${card.population.toLocaleString()}</p>
            <p class="card-text"><strong>Region:</strong> ${card.region}</p>
            
            <p class="card-text"><strong>Capital:</strong> ${
              !card.capital ? "nil" : card.capital?.at(0)
            }</p>
        </div>
        </div>
     </div>
    `;
    })
    .join("");

  countriescontainer.innerHTML = "";
  countriescontainer.insertAdjacentHTML("afterbegin", allCountiesCards);
};

// Render each card details markup
const renderDetailsMarkup = function (data, parentEl) {
  const html = `
      
  <div class="container ">
    <div class="row">
      <div class="col-md-6 p-5">
        <img src="${data[0].flags.png}" alt="" width="80%" />
      </div>
      <div class="col-md-6 p-2">
        <div class="row g-4 align-items-center">
          <div class="col-12 country-title-col">
            <h3 class="country-title"><strong>${
              data[0].name.common
            }</strong></h3>
          </div>
          <div class="col-md-6 lh-base">
            <p class="country-text">
              <strong>Native name:</strong>
              ${
                data[0].name.nativeName[
                  `${Object.keys(data[0].name.nativeName)[0]}`
                ].common
              }
            </p>
            <p class="country-text">
              <strong>Population:</strong> ${data[0].population.toLocaleString()}
            </p>
            <p class="country-text"><strong>Region:</strong> ${
              data[0].region
            }</p>
            <p class="country-text">
              <strong>Sub Region:</strong> ${data[0].subregion}
            </p>
            <p class="country-text"><strong>Capital:</strong> ${
              data[0].capital[0]
            }</p>
          </div>
          <div class="col-md-6 lh-sm">
            <p class="country-text">
              <strong>Top Level Domain:</strong> ${data[0].tld}
            </p>
            <p class="country-text"><strong>Currencies:</strong> ${
              data[0].currencies[`${Object.keys(data[0].currencies)[0]}`].name
            }</p>
            <p class="country-text">
              <strong>Languages:</strong> ${
                data[0].languages[`${Object.keys(data[0].languages)[0]}`]
              }
            </p>
          </div>

          
           <div class="row g-1 p-2">
            <div class="col-3 country-text">
              <strong>Border Countries:</strong>
             </div>
          <div class='col'>
          
          <div class='row test'>
               ${
                 data[0].borders
                   ? data[0].borders
                       .map(
                         (bor) => `
            <div class="col-3 coun-code">
              <a href="#"> ${bor}</a>
             </div>
           `
                       )
                       .join("")
                   : ""
               }
           </div>
          </div>
         </div>
         </div>
        </div>
     
    </div>
  </div>
    `;
  parentEl.innerHTML = "";
  parentEl.insertAdjacentHTML("afterbegin", html);
};

// Get all countries data from API
const getCountries = async function () {
  try {
    // render spinner
    renderSpinner(countriescontainer);

    // Get country data
    const res = await fetch("https://restcountries.com/v3.1/all");

    // throw error for successful promise
    if (!res.ok) throw new Error("Problem getting country from server");
    const countriesData = await res.json();

    // render country on page
    renderCardsMarkup(countriesData, countriescontainer);
  } catch (err) {
    //render error on page
    renderError(countriescontainer, err.message);
  }
};

// render country data on page load
getCountries();

// Event listener for switching between light and dark mode

darkModeBtn.addEventListener("click", function () {
  document.body.classList.toggle("dark-theme");

  if (document.body.classList.contains("dark-theme")) {
    icon.classList.remove("fa-moon");
    icon.classList.add("fa-sun");
    darkModeText.textContent = "Light Mode";
  } else {
    icon.classList.remove("fa-sun");
    icon.classList.add("fa-moon");
    darkModeText.textContent = "Dark Mode";
  }

  // store dark mode class to local storage
  const { value } = document.body.classList;
  localStorage.setItem("theme", JSON.stringify(value));
});

// Event listener for search functionality
inputField.addEventListener("keyup", function (e) {
  // value from input box to lowercase
  const searchTerm = e.target.value.toLowerCase();

  // get all cards
  const allCards = document.querySelectorAll(".bootcard");

  // logic=-- if search term is found in country name display card as block otherwise none
  Array.from(allCards).forEach((card) => {
    const title = card.querySelector("h3").textContent;
    if (title.toLowerCase().indexOf(searchTerm) === -1) {
      card.classList.add("d-none");
    } else {
      card.classList.remove("d-none");
    }
  });
});

// Event listener for loading details about a particular country card
countriescontainer.addEventListener("click", async function (e) {
  try {
    // Guard clouse for event delegation
    if (!e.target.closest(".section-card")) return;

    // Remove hidden class from details page
    detailsPage.classList.remove("hidden");

    //Render spinner
    renderSpinner(details);

    // Get country name from clicked card
    const countryName = e.target
      .closest(".section-card")
      .querySelector("h3").textContent;

    // Add hidden class to main page
    mainPage.classList.add("hidden");

    //load country data from API
    const res = await fetch(
      `https://restcountries.com/v3.1/name/${countryName}`
    );
    // throw error for successful promise
    if (!countryName === "Antarctica") throw new error();
    if (!res.ok) throw new Error("Problem getting country data");
    const countryDetails = await res.json();

    // render markup on page
    renderDetailsMarkup(countryDetails, details);
  } catch (err) {
    // render error on page
    renderError(details, err.message);
  }
});

//Event listener on back button to return to home page
goBackBtn.addEventListener("click", function () {
  // clear input field incase there was a search previously
  inputField.value = "";

  // add hidden class to details page
  detailsPage.classList.add("hidden");

  //remove hidden class from main page
  mainPage.classList.remove("hidden");

  // render spinner
  renderSpinner(countriescontainer);

  // get all countries data and load on page
  getCountries();
});

//event listener for loading border countries
detailsPage.addEventListener("click", async function (e) {
  try {
    // guard clause for event delegation
    if (!e.target.closest(".coun-code")) return;

    // render spinner on page
    renderSpinner(details);

    //get country code from border button
    const countryCode = e.target.closest(".coun-code").textContent.trim();

    // load country data from api using code
    const res = await fetch(
      `https://restcountries.com/v3.1/alpha/${countryCode}`
    );
    const countryDetails = await res.json();

    // render markup on page
    renderDetailsMarkup(countryDetails, details);
  } catch (err) {
    //render error on page
    renderError(details, err.message);
  }
});

//Event litener for filtering countries by region
filterBtn.addEventListener("change", async function (e) {
  try {
    //render spinner
    renderSpinner(countriescontainer);

    //get region data from select button
    const region = e.target.value;

    // get region data from API
    const res = await fetch(
      e.target.value === "all"
        ? "https://restcountries.com/v3.1/all"
        : `https://restcountries.com/v3.1/region/${region}`
    );
    const regionData = await res.json();

    // render region cards on page
    renderCardsMarkup(regionData, countriescontainer);
  } catch (err) {
    // render error
    renderError(countriescontainer, err.message);
  }
});
