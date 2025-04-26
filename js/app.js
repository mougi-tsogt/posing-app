let poses = [];
let tips = [];
let favourites = JSON.parse(localStorage.getItem('favourites')) || [];
let currentCategory = '';
let currentItemIndex = 0;

const app = document.getElementById('app');

// Load data
Promise.all([
  fetch('poses.json').then(res => res.json()),
  fetch('tips.json').then(res => res.json())
]).then(([posesData, tipsData]) => {
  poses = posesData;
  tips = tipsData;
  showSplashScreen();
});

// --------- Main Screens -----------

function showSplashScreen() {
  app.innerHTML = `
    <div style="text-align:center;">
      <h1>Posing Guide</h1>
      <img src="images/placeholder.jpg" alt="App Summary" style="max-width:300px;"/>
      <div class="top-buttons">
        <button onclick="showPoseCategories()">📸 Poses</button>
        <button onclick="showTipCategories()">💡 Pro Tips</button>
        <button onclick="showFavourites()">❤️ My Favourites</button>
      </div>
    </div>
  `;
}

function showPoseCategories() {
  const categories = [...new Set(poses.map(p => p.category))];
  app.innerHTML = `<h2>Choose a Category</h2><div class="grid"></div><button onclick="showSplashScreen()">🔙 Home</button>`;
  const grid = app.querySelector('.grid');
  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'nav-button';
    btn.innerText = cat;
    btn.onclick = () => showCategory(cat);
    grid.appendChild(btn);
  });
}

function showTipCategories() {
  const tipCats = [...new Set(tips.map(t => t.category))];
  app.innerHTML = `<h2>Choose a Tip Category</h2><div class="grid"></div><button onclick="showSplashScreen()">🔙 Home</button>`;
  const grid = app.querySelector('.grid');
  tipCats.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'nav-button';
    btn.innerText = cat;
    btn.onclick = () => showTipCategory(cat);
    grid.appendChild(btn);
  });
}

function showFavourites() {
  const favs = poses.filter(p => favourites.includes(p.id));
  app.innerHTML = `<h2>My Favourites</h2><div class="grid"></div><button onclick="showSplashScreen()">🔙 Home</button>`;
  const grid = app.querySelector('.grid');
  if (favs.length === 0) {
    grid.innerHTML = "<p>No favourites yet!</p>";
  } else {
    favs.forEach(p => {
      const img = document.createElement('img');
      img.src = "images/" + p.image;
      img.alt = p.title;
      img.onclick = () => showPoseDetail(favs, favs.indexOf(p));
      grid.appendChild(img);
    });
  }
}

// --------- Poses and Tips -----------

function showCategory(category) {
  currentCategory = category;
  const items = poses.filter(p => p.category === category);
  app.innerHTML = `<h2>${category}</h2><div class="grid"></div><button onclick="showPoseCategories()">🔙 Back</button>`;
  const grid = app.querySelector('.grid');
  items.forEach((p, i) => {
    const img = document.createElement('img');
    img.src = "images/" + p.image;
    img.alt = p.title;
    img.onclick = () => showPoseDetail(items, i);
    grid.appendChild(img);
  });
}

function showTipCategory(category) {
  const items = tips.filter(t => t.category === category);
  app.innerHTML = `<h2>${category}</h2><div class="grid"></div><button onclick="showTipCategories()">🔙 Back</button>`;
  const grid = app.querySelector('.grid');
  items.forEach((t, i) => {
    const div = document.createElement('div');
    div.className = 'pose';
    div.innerHTML = `
      <h3>${t.title}</h3>
      <p>${t.description}</p>
    `;
    grid.appendChild(div);
  });
}

// --------- Detail Views -----------

function showPoseDetail(items, index) {
  currentItemIndex = index;
  const p = items[index];
  app.innerHTML = `
    <h2>${p.title}</h2>
    <img src="images/${p.image}" alt="${p.title}"/>
    <p>${p.description}</p>
    <button onclick="toggleFavourite('${p.id}')">
      ${favourites.includes(p.id) ? '❤️ Remove Favourite' : '🤍 Add Favourite'}
    </button><br/>
    <button onclick="showPrev(items)">⬅️ Previous</button>
    <button onclick="showNext(items)">➡️ Next</button><br/>
    <button onclick="backToCategory()">🔙 Back to ${p.category}</button>
  `;
}

function showPrev(items) {
  const newIndex = (currentItemIndex - 1 + items.length) % items.length;
  showPoseDetail(items, currentItemIndex);
}

function showNext(items) {
  const newIndex = (currentItemIndex + 1) % items.length;
  showPoseDetail(items, currentItemIndex);
}

function backToCategory() {
  showCategory(currentCategory);
}

// --------- Favourites System -----------

function toggleFavourite(id) {
  if (favourites.includes(id)) {
    favourites = favourites.filter(f => f !== id);
  } else {
    favourites.push(id);
  }
  localStorage.setItem('favourites', JSON.stringify(favourites));
  alert('Favourites updated!');
}
