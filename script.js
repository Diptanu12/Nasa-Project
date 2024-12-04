const API_KEY = "AKHQ6VoAAQGJ4rVf4JffTkaikdacDJ2CMRGxJIrj";
const BASE_URL = "https://api.nasa.gov/planetary/apod";

const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
const currentImageContainer = document.getElementById("current-image-container");
const searchHistoryList = document.getElementById("search-history");

async function getCurrentImageOfTheDay() {
  const currentDate = new Date().toISOString().split("T")[0];
  await getImageOfTheDay(currentDate);
}

async function getImageOfTheDay(date) {
  try {
    const response = await fetch(`${BASE_URL}?date=${date}&api_key=${API_KEY}`);
    const data = await response.json();
    if (data.error) {
      currentImageContainer.innerHTML = `<p>Error: ${data.error.message}</p>`;
      return;
    }
    currentImageContainer.innerHTML = `
      <h3>${data.title}</h3>
      <img src="${data.url}" alt="${data.title}">
      <p>${data.explanation}</p>
    `;
    saveSearch(date);
    addSearchToHistory();
  } catch (error) {
    currentImageContainer.innerHTML = `<p>Error fetching data. Please try again later.</p>`;
  }
}

function saveSearch(date) {
  const searches = JSON.parse(localStorage.getItem("searches")) || [];
  if (!searches.includes(date)) {
    searches.push(date);
    localStorage.setItem("searches", JSON.stringify(searches));
  }
}

function addSearchToHistory() {
  const searches = JSON.parse(localStorage.getItem("searches")) || [];
  searchHistoryList.innerHTML = "";
  searches.forEach((date) => {
    const li = document.createElement("li");
    li.textContent = date;
    li.addEventListener("click", () => getImageOfTheDay(date));
    searchHistoryList.appendChild(li);
  });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const date = input.value;
  if (date) getImageOfTheDay(date);
});

document.addEventListener("DOMContentLoaded", () => {
  getCurrentImageOfTheDay();
  addSearchToHistory();
});
