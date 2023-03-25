import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;
const searchBox = document.querySelector('#search-box');
const countryInfo = document.querySelector('.country-info');
const countryList = document.querySelector('.country-list');

searchBox.addEventListener('input', debounce(onSearchBox, DEBOUNCE_DELAY));

function onSearchBox() {
  const searchName = document.querySelector('#search-box').value.trim();
  countryInfo.innerHTML = '';
  countryList.innerHTML = '';
  console.log(searchName);

  if (!searchName) {
    return;
  }
  fetchCountries(searchName)
    .then(data => {
      createResponse(data);
      return data;
    })
    .catch(error =>
      Notiflix.Notify.failure('Oops, there is no country with that name')
    );
}

function createResponse(data) {
  if (data.length > 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
    return;
  }
  if (data.length === 1) {
    renderCountry(data);
    return;
  }
  renderCountries(data);
}

function renderCountries(countries) {
  const markup = countries
    .map(({ flags, name }) => {
      return `<li><img class="flag" src="${flags.svg}" alt="flag" width='50'>
    <h2 class="name">${name.official}</h2></li>`;
    })
    .join('');
  countryList.insertAdjacentHTML('beforeend', markup);
}

function renderCountry(country) {
  const markup = country
    .map(({ name, capital, population, flags, languages }) => {
      return `<img class="flag" src="${flags.svg}" alt="flag" width='50'>
    <h2 class="country_name">${name.official}</h2>
    <p class="country_capital">Capital: <span>${capital}</span></p>
    <p class="country_population">Population: <span>${population}</span></p>
    <p class="country_languages">Languages: <span>${Object.values(
      languages
    )}</span></p>`;
    })
    .join('');
  countryInfo.insertAdjacentHTML('beforeend', markup);
}
