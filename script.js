const movieGrid = document.getElementById('movieGrid');
const searchOverlay = document.getElementById('searchOverlay');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const closeSearch = document.getElementById('closeSearch');
const modal = document.getElementById('videoModal');
const videoPlayer = document.getElementById('videoPlayer');
const modalTitle = document.getElementById('modalTitle');
const closeModalBtn = document.querySelector('.close-modal');
const genreBtns = document.querySelectorAll('.genre-btn');

let allMovies = [];

async function init() {
    try {
        const res = await fetch('data.json');
        const data = await res.json();
        allMovies = data.films;
        renderMovies(allMovies);
    } catch (err) {
        movieGrid.innerHTML = `<p style="grid-column: 1/-1; text-align:center;">Gagal memuat data.</p>`;
    }
}

function renderMovies(movies) {
    movieGrid.innerHTML = '';
    movies.forEach(movie => {
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.innerHTML = `
            <img src="${movie.poster}" alt="${movie.title}" loading="lazy">
            <div class="movie-info">
                <h3>${movie.title}</h3>
                <span>${movie.genre}</span>
            </div>
        `;
        card.onclick = () => openPlayer(movie);
        movieGrid.appendChild(card);
    });
}

// Fungsi Pencarian
searchInput.addEventListener('input', (e) => {
    const keyword = e.target.value.toLowerCase();
    const filtered = allMovies.filter(m => 
        m.title.toLowerCase().includes(keyword) || 
        m.genre.toLowerCase().includes(keyword)
    );
    renderMovies(filtered);
});

// Kontrol Modal & Filter (Sama seperti sebelumnya)
function openPlayer(movie) {
    const videoIdMatch = movie.url.match(/[-\w]{25,}/);
    if (videoIdMatch) {
        videoPlayer.src = `https://drive.google.com/file/d/${videoIdMatch[0]}/preview`;
        modalTitle.innerText = movie.title;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

closeModalBtn.onclick = () => {
    modal.style.display = 'none';
    videoPlayer.src = '';
    document.body.style.overflow = 'auto';
};

searchBtn.onclick = () => {
    searchOverlay.style.display = 'block';
    searchInput.focus();
};

closeSearch.onclick = () => {
    searchOverlay.style.display = 'none';
    searchInput.value = '';
    renderMovies(allMovies);
};

genreBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('.genre-btn.active').classList.remove('active');
        btn.classList.add('active');
        const genre = btn.dataset.genre;
        const filtered = genre === 'All' ? allMovies : allMovies.filter(m => m.genre === genre);
        renderMovies(filtered);
    });
});

init();
