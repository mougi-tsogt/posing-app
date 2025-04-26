
let poses = [];
let favourites = JSON.parse(localStorage.getItem('favourites')) || [];

fetch('poses.json')
  .then(res => res.json())
  .then(data => {
    poses = data;
    loadCategories();
    loadPoses();
  });

function loadCategories() {
  const categories = [...new Set(poses.map(p => p.category))];
  const nav = document.getElementById('categories');
  nav.innerHTML = '';
  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.textContent = cat;
    btn.onclick = () => loadPoses(cat);
    nav.appendChild(btn);
  });
}

function loadPoses(category = '') {
  const section = document.getElementById('pose-list');
  const favSection = document.getElementById('favourites');
  favSection.style.display = 'none';
  section.style.display = 'block';
  section.innerHTML = '';
  poses.filter(p => !category || p.category === category).forEach(p => {
    const div = document.createElement('div');
    div.className = 'pose';
div.innerHTML = `
      <h3>${p.title}</h3>
      <img src="images/${p.image}" alt="${p.title}" />
      <p>${p.description}</p>
      <button onclick="toggleFavourite('${p.id}')">
        ${favourites.includes(p.id) ? '❤️' : '🤍'} Favourite
      </button>
    `;
    section.appendChild(div);
  });
}

function toggleFavourite(id) {
  if (favourites.includes(id)) {
    favourites = favourites.filter(f => f !== id);
  } else {
    favourites.push(id);
  }
  localStorage.setItem('favourites', JSON.stringify(favourites));
  loadPoses();
}

function showFavourites() {
  const favSection = document.getElementById('favourites');
  const section = document.getElementById('pose-list');
  section.style.display = 'none';
  favSection.style.display = 'block';
  favSection.innerHTML = '<h2>Your Favourites</h2>';
  poses.filter(p => favourites.includes(p.id)).forEach(p => {
    const div = document.createElement('div');
    div.className = 'pose';
    div.innerHTML = `
      <h3>${p.title}</h3>
      <img src="images/${p.image}" alt="${p.title}" />
      <p>${p.description}</p>
    `;
    favSection.appendChild(div);
  });
}
