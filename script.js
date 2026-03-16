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
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const pageInfo = document.getElementById('pageInfo');

let allMovies = [];
let filteredMovies = [];
let currentPage = 1;
const itemsPerPage = 12;

// 1. Ambil Data
async function init() {
    try {
        const res = await fetch('data.json');
        const data = await res.json();
        allMovies = data.films;
        filteredMovies = allMovies;
        renderMovies();
    } catch (err) {
        movieGrid.innerHTML = `<p style="grid-column: 1/-1; text-align:center; padding: 50px;">Gagal memuat data. Periksa file data.json Anda.</p>`;
    }
}

// 2. Tampilkan Film (Pagination)
function renderMovies() {
    movieGrid.innerHTML = '';
    
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const currentItems = filteredMovies.slice(start, end);

    if (currentItems.length === 0) {
        movieGrid.innerHTML = `<p style="grid-column: 1/-1; text-align:center; padding: 40px; opacity: 0.5;">Film tidak ditemukan.</p>`;
    }

    currentItems.forEach(movie => {
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.innerHTML = `
            <img src="${movie.poster}" alt="${movie.title}" loading="lazy" onerror="this.src='https://via.placeholder.com/300x450?text=No+Poster'">
            <div class="movie-info">
                <h3>${movie.title}</h3>
                <span>${movie.genre}</span>
            </div>
        `;
        card.onclick = () => openPlayer(movie);
        movieGrid.appendChild(card);
    });

    updateControls();
}

// 3. Live Search
searchInput.addEventListener('input', (e) => {
    const key = e.target.value.toLowerCase().trim();
    filteredMovies = allMovies.filter(m => 
        m.title.toLowerCase().includes(key) || m.genre.toLowerCase().includes(key)
    );
    currentPage = 1; 
    renderMovies();
});

// 4. Update Tombol Halaman
function updateControls() {
    const totalPages = Math.ceil(filteredMovies.length / itemsPerPage);
    pageInfo.innerText = `Halaman ${currentPage} / ${totalPages || 1}`;
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages || totalPages === 0;
}

prevBtn.onclick = () => { if(currentPage > 1) { currentPage--; renderMovies(); window.scrollTo(0,0); } };
nextBtn.onclick = () => { 
    const totalPages = Math.ceil(filteredMovies.length / itemsPerPage);
    if(currentPage < totalPages) { currentPage++; renderMovies(); window.scrollTo(0,0); } 
};

// 5. Filter Genre
genreBtns.forEach(btn => {
    btn.onclick = () => {
        document.querySelector('.genre-btn.active').classList.remove('active');
        btn.classList.add('active');
        const g = btn.dataset.genre;
        filteredMovies = g === 'All' ? allMovies : allMovies.filter(m => m.genre === g);
        currentPage = 1;
        renderMovies();
    };
});

// 6. Pemutar Video
function openPlayer(movie) {
    const idMatch = movie.url.match(/[-\w]{25,}/);
    if (idMatch) {
        videoPlayer.src = `https://drive.google.com/file/d/${idMatch[0]}/preview`;
        modalTitle.innerText = movie.title;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    } else {
        alert("Link Google Drive tidak valid!");
    }
}

// Kontrol UI
closeModalBtn.onclick = () => { 
    modal.style.display = 'none'; 
    videoPlayer.src = ''; 
    document.body.style.overflow = 'auto'; 
};

searchBtn.onclick = () => { searchOverlay.style.display = 'block'; searchInput.focus(); };

closeSearch.onclick = () => { 
    searchOverlay.style.display = 'none'; 
    searchInput.value = ''; 
    filteredMovies = allMovies; 
    currentPage = 1;
    renderMovies(); 
};

window.onclick = (e) => { if (e.target == modal) closeModalBtn.onclick(); };

init();
