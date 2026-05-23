const TRAVEL_DATA_URL = 'travel_recommendation_api.json';

const aliasGroups = {
  beach: new Set(['beach', 'beaches']),
  temple: new Set(['temple', 'temples']),
  country: new Set(['country', 'countries'])
};

const state = {
  activeView: 'home',
  catalog: {
    beaches: [],
    temples: [],
    cities: [],
    all: []
  }
};

const viewButtons = document.querySelectorAll('[data-view-target]');
const pageViews = document.querySelectorAll('[data-view]');
const header = document.querySelector('[data-site-header]');
const searchToolbar = document.querySelector('[data-search-toolbar]');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const resetButton = document.getElementById('clear-button');
const resultsArea = document.getElementById('results-area');
const contactForm = document.getElementById('contact-form');
const contactStatus = document.getElementById('contact-status');

document.addEventListener('DOMContentLoaded', initialize);

function initialize() {
  bindNavigation();
  bindSearch();
  bindContactForm();

  const initialView = getViewFromHash();
  setView(initialView, { updateHash: false });

  loadTravelData()
    .then(() => renderIdleState())
    .catch((error) => {
      renderErrorState(error);
    });

  window.addEventListener('hashchange', () => {
    const nextView = getViewFromHash();
    setView(nextView, { updateHash: false });
  });
}

function bindNavigation() {
  viewButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      const targetView = button.dataset.viewTarget;
      if (!targetView) {
        return;
      }

      event.preventDefault();
      setView(targetView);
    });
  });
}

function bindSearch() {
  searchForm.addEventListener('submit', handleSearch);
  resetButton.addEventListener('click', handleClear);
}

function bindContactForm() {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!contactForm.reportValidity()) {
      contactStatus.textContent = 'Please complete the required fields before submitting.';
      return;
    }

    contactStatus.textContent = 'Thanks for reaching out. We will respond soon.';
    contactForm.reset();
  });
}

async function loadTravelData() {
  const response = await fetch(TRAVEL_DATA_URL);

  if (!response.ok) {
    throw new Error(`Unable to load ${TRAVEL_DATA_URL} (${response.status})`);
  }

  const data = await response.json();
  state.catalog = buildCatalog(data);
}

function buildCatalog(data) {
  const beaches = (data.beaches || []).map((item) => createCatalogItem(item, 'beach', 'Beach'));
  const temples = (data.temples || []).map((item) => createCatalogItem(item, 'temple', 'Temple'));

  const cities = (data.countries || []).flatMap((country) => {
    return (country.cities || []).map((city) =>
      createCatalogItem(city, 'country', 'Country', {
        countryName: country.name,
        cityName: city.name
      })
    );
  });

  return {
    beaches,
    temples,
    cities,
    all: [...beaches, ...temples, ...cities]
  };
}

function createCatalogItem(item, categoryKey, categoryLabel, extra = {}) {
  return {
    name: item.name,
    description: item.description,
    imageUrl: item.imageUrl,
    categoryKey,
    categoryLabel,
    countryName: extra.countryName || item.countryName || categoryLabel,
    searchTerms: [item.name, item.description, categoryLabel, categoryKey, extra.countryName || '', extra.cityName || '']
      .map(normalizeText)
      .filter(Boolean)
  };
}

function handleSearch(event) {
  event.preventDefault();

  const query = searchInput.value.trim();
  if (!query) {
    renderPromptState();
    return;
  }

  const results = searchRecommendations(query);
  if (!results.length) {
    renderNoMatchesState(query);
    return;
  }

  renderResults(results, query);
}

function handleClear() {
  searchInput.value = '';
  renderIdleState();
  searchInput.focus();
}

function searchRecommendations(query) {
  const normalizedQuery = normalizeText(query);
  const matchedIntent = resolveSearchIntent(normalizedQuery);

  if (matchedIntent === 'beach') {
    return state.catalog.beaches;
  }

  if (matchedIntent === 'temple') {
    return state.catalog.temples;
  }

  if (matchedIntent === 'country') {
    return state.catalog.cities;
  }

  return state.catalog.all.filter((item) => {
    return item.searchTerms.some((term) => term.includes(normalizedQuery));
  });
}

function resolveSearchIntent(normalizedQuery) {
  for (const [intent, values] of Object.entries(aliasGroups)) {
    if (values.has(normalizedQuery)) {
      return intent;
    }
  }

  return null;
}

function renderIdleState() {
  resultsArea.innerHTML = `
    <div class="empty-state" id="results-empty-state">
      <h3>Ready when you are</h3>
      <p>Enter a keyword in the search bar and click Search to see matching travel recommendations.</p>
    </div>
  `;
}

function renderPromptState() {
  resultsArea.innerHTML = `
    <div class="empty-state" id="results-empty-state">
      <h3>Enter a keyword</h3>
      <p>Try beach, temple, or country to get started.</p>
    </div>
  `;
}

function renderNoMatchesState(query) {
  resultsArea.innerHTML = `
    <div class="empty-state" id="results-empty-state">
      <h3>No recommendations found</h3>
      <p>We could not find any matches for "${escapeHtml(query)}". Try beach, temple, country, or a destination name.</p>
    </div>
  `;
}

function renderErrorState(error) {
  resultsArea.innerHTML = `
    <div class="empty-state" id="results-empty-state">
      <h3>Data loading issue</h3>
      <p>${escapeHtml(error.message)}. Open the page through a local server so the JSON file can be fetched.</p>
    </div>
  `;
}

function renderResults(results, query) {
  const heading = buildResultsHeading(query);

  resultsArea.innerHTML = `
    <div class="results-summary">
      <strong>${escapeHtml(heading)}</strong>
      <span>${results.length} recommendation${results.length === 1 ? '' : 's'}</span>
    </div>
    <div class="results-grid">
      ${results.map(renderResultCard).join('')}
    </div>
  `;
}

function buildResultsHeading(query) {
  const normalizedQuery = normalizeText(query);

  if (aliasGroups.beach.has(normalizedQuery)) {
    return 'Beach escapes';
  }

  if (aliasGroups.temple.has(normalizedQuery)) {
    return 'Temple journeys';
  }

  if (aliasGroups.country.has(normalizedQuery)) {
    return 'Country recommendations';
  }

  return `Search results for "${query}"`;
}

function renderResultCard(item) {
  const metaLabel = item.categoryKey === 'country' ? `Country: ${item.countryName}` : `Category: ${item.categoryLabel}`;

  return `
    <article class="result-card">
      <img src="${escapeAttribute(item.imageUrl)}" alt="${escapeAttribute(item.name)}">
      <div class="result-card__content">
        <p class="result-card__meta">
          <span class="chip">${escapeHtml(item.categoryLabel)}</span>
          <span class="chip">${escapeHtml(metaLabel)}</span>
        </p>
        <h3>${escapeHtml(item.name)}</h3>
        <p>${escapeHtml(item.description)}</p>
      </div>
    </article>
  `;
}

function setView(viewName, options = { updateHash: true }) {
  state.activeView = viewName;

  pageViews.forEach((view) => {
    const isActive = view.dataset.view === viewName;
    view.hidden = !isActive;
    view.classList.toggle('is-active', isActive);
  });

  viewButtons.forEach((button) => {
    button.classList.toggle('is-active', button.dataset.viewTarget === viewName);
  });

  if (header) {
    header.classList.toggle('header--compact', viewName !== 'home');
  }

  if (searchToolbar) {
    searchToolbar.hidden = viewName !== 'home';
  }

  if (options.updateHash) {
    history.replaceState(null, '', `#${viewName}`);
  }
}

function getViewFromHash() {
  const hash = window.location.hash.replace('#', '').trim();
  if (['home', 'about', 'contact'].includes(hash)) {
    return hash;
  }

  return 'home';
}

function normalizeText(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ');
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeAttribute(value) {
  return escapeHtml(value).replace(/`/g, '&#96;');
}