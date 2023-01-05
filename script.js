const countriescontainer = document.querySelector(".card-container");
const inputField = document.querySelector(".input-text");
const mainPage = document.querySelector(".top-page");
const detailsPage = document.querySelector(".section-card-details");
const goBackBtn = document.querySelector(".btn-back");
const details = document.querySelector(".details");
const darkModeBtn = document.querySelector(".dark-mode-btn");
const icon = document.querySelector(".fa-regular");
const darkModeText = document.querySelector(".dark-mode-text");

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
});

const renderError = function (parentEl, msg) {
  const html = `
  <h2>${msg}</h3>
`;

  parentEl.innerHTML = "";
  parentEl.insertAdjacentHTML("afterbegin", html);
};

const renderSpinner = function (parentEl) {
  const html = `
  <img class='spinner' src="loading-4.gif" alt="">
  `;

  parentEl.innerHTML = "";
  parentEl.insertAdjacentHTML("afterbegin", html);
};

const getCountries = async function () {
  try {
    renderSpinner(countriescontainer);
    const res = await fetch("https://restcountries.com/v3.1/all");

    if (!res.ok) throw new Error("Problem getting country from server");

    const data = await res.json();
    console.log(data);
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
  } catch (err) {
    renderError(countriescontainer, err.message);
    // console.error(err.message);
  }
};

getCountries();

inputField.addEventListener("keyup", function (e) {
  const searchTerm = e.target.value.toLowerCase();

  const allCards = document.querySelectorAll(".bootcard");

  Array.from(allCards).forEach((card) => {
    const title = card.querySelector("h3").textContent;
    if (title.toLowerCase().indexOf(searchTerm) === -1) {
      card.classList.add("d-none");
    } else {
      card.classList.remove("d-none");
    }
  });
});

countriescontainer.addEventListener("click", async function (e) {
  try {
    if (!e.target.closest(".section-card")) return;
    detailsPage.classList.remove("hidden");
    renderSpinner(details);
    const countryName = e.target
      .closest(".section-card")
      .querySelector("h3").textContent;
    console.log(countryName);
    mainPage.classList.add("hidden");

    const res = await fetch(
      `https://restcountries.com/v3.1/name/${countryName}`
    );

    if (!countryName === "Antarctica") throw new error();
    if (!res.ok) throw new Error("Problem getting country data");
    const countryDetails = await res.json();

    const html = `
      
    <div class="container ">
      <div class="row">
        <div class="col-md-6 p-5">
          <img src="${countryDetails[0].flags.png}" alt="" width="80%" />
        </div>
        <div class="col-md-6 p-2">
          <div class="row g-4 align-items-center">
            <div class="col-12 country-title-col">
              <h3 class="country-title"><strong>${
                countryDetails[0].name.common
              }</strong></h3>
            </div>
            <div class="col-md-6 lh-base">
              <p class="country-text">
                <strong>Native name:</strong>
                ${
                  countryDetails[0].name.nativeName[
                    `${Object.keys(countryDetails[0].name.nativeName)[0]}`
                  ].common
                }
              </p>
              <p class="country-text">
                <strong>Population:</strong> ${countryDetails[0].population.toLocaleString()}
              </p>
              <p class="country-text"><strong>Region:</strong> ${
                countryDetails[0].region
              }</p>
              <p class="country-text">
                <strong>Sub Region:</strong> ${countryDetails[0].subregion}
              </p>
              <p class="country-text"><strong>Capital:</strong> ${
                countryDetails[0].capital[0]
              }</p>
            </div>
            <div class="col-md-6 lh-sm">
              <p class="country-text">
                <strong>Top Level Domain:</strong> ${countryDetails[0].tld}
              </p>
              <p class="country-text"><strong>Currencies:</strong> ${
                countryDetails[0].currencies[
                  `${Object.keys(countryDetails[0].currencies)[0]}`
                ].name
              }</p>
              <p class="country-text">
                <strong>Languages:</strong> ${
                  countryDetails[0].languages[
                    `${Object.keys(countryDetails[0].languages)[0]}`
                  ]
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
                   countryDetails[0].borders
                     ? countryDetails[0].borders
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

    details.innerHTML = "";
    details.insertAdjacentHTML("afterbegin", html);
  } catch (err) {
    renderError(details, err.message);
  }
});

goBackBtn.addEventListener("click", function () {
  inputField.value = "";
  detailsPage.classList.add("hidden");
  mainPage.classList.remove("hidden");
  renderSpinner(countriescontainer);
  getCountries();
});

const borderCountry = document.querySelector(".test");

detailsPage.addEventListener("click", async function (e) {
  try {
    if (!e.target.closest(".coun-code")) return;
    // details.innerHTML = "";
    renderSpinner(details);
    const countryCode = e.target.closest(".coun-code").textContent.trim();

    const res = await fetch(
      `https://restcountries.com/v3.1/alpha/${countryCode}`
    );
    const countryDetails = await res.json();

    const html = `
      
    <div class="container details">
      <div class="row ">
        <div class="col-md-6 p-5">
          <img src="${countryDetails[0].flags.png}" alt="" width="80%" />
        </div>
        <div class="col-md-6 p-2">
          <div class="row g-4">
            <div class="col-12 country-title-col">
              <h3 class="country-title"><strong>${
                countryDetails[0].name.common
              }</strong></h3>
            </div>
            <div class="col-md-6 lh-base">
              <p class="country-text">
                <strong>Native name:</strong>
                ${
                  countryDetails[0].name.nativeName[
                    `${Object.keys(countryDetails[0].name.nativeName)[0]}`
                  ].common
                }
              </p>
              <p class="country-text">
                <strong>Population:</strong> ${countryDetails[0].population.toLocaleString()}
              </p>
              <p class="country-text"><strong>Region:</strong> ${
                countryDetails[0].region
              }</p>
              <p class="country-text">
                <strong>Sub Region:</strong> ${countryDetails[0].subregion}
              </p>
              <p class="country-text"><strong>Capital:</strong> ${
                countryDetails[0].capital[0]
              }</p>
            </div>
            <div class="col-md-6 lh-sm">
              <p class="country-text">
                <strong>Top Level Domain:</strong> ${countryDetails[0].tld}
              </p>
              <p class="country-text"><strong>Currencies:</strong> ${
                countryDetails[0].currencies[
                  `${Object.keys(countryDetails[0].currencies)[0]}`
                ].name
              }</p>
              <p class="country-text">
                <strong>Languages:</strong> ${
                  countryDetails[0].languages[
                    `${Object.keys(countryDetails[0].languages)[0]}`
                  ]
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
                   countryDetails[0].borders
                     ? countryDetails[0].borders
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

    details.insertAdjacentHTML("afterbegin", html);
  } catch (err) {
    renderError(details, err.message);
  }
});

const filterBtn = document.querySelector("select");

filterBtn.addEventListener("change", async function (e) {
  try {
    renderSpinner(countriescontainer);

    const region = e.target.value;
    const res = await fetch(
      e.target.value === "all"
        ? "https://restcountries.com/v3.1/all"
        : `https://restcountries.com/v3.1/region/${region}`
    );
    const data = await res.json();

    const regionCards = data
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
    countriescontainer.insertAdjacentHTML("afterbegin", regionCards);
  } catch (err) {
    renderError(countriescontainer, err.message);
  }
});
