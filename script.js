const movieGrid = document.getElementById('movieGrid');
const searchInput = document.getElementById('searchInput');
const genreBtns = document.querySelectorAll('.genre-btn');
const modal = document.getElementById('videoModal');
const videoPlayer = document.getElementById('videoPlayer');
const modalTitle = document.getElementById('modalTitle');
const modalGenre = document.getElementById('modalGenre');
const closeModal = document.querySelector('.close-modal');

let allMovies = [];

// Load data dari JSON
async function initApp() {
    try {
        const res = await fetch('data.json');
        const data = await res.json();
        allMovies = data.films;
        renderMovies(allMovies);
    } catch (err) {
        movieGrid.innerHTML = `<p style="color:red">Gagal memuat film. Pastikan data.json tersedia.</p>`;
    }
}

function renderMovies(movies) {
    movieGrid.innerHTML = '';
    if (movies.length === 0) {
        movieGrid.innerHTML = `<p>Film tidak ditemukan.</p>`;
        return;
    }
    
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

function openPlayer(movie) {
    // Ambil ID Drive dari URL (Mendukung link download/view)
    const videoId = movie.url.match(/[-\w]{25,}/);
    if (videoId) {
        videoPlayer.src = `https://drive.google.com/file/d/${videoId[0]}/preview`;
        modalTitle.innerText = movie.title;
        modalGenre.innerText = movie.genre;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    } else {
        alert("Link Google Drive tidak valid!");
    }
}

closeModal.onclick = () => {
    modal.style.display = 'none';
    videoPlayer.src = '';
    document.body.style.overflow = 'auto';
};

// Tutup modal jika klik di luar box
window.onclick = (e) => { if (e.target == modal) closeModal.onclick(); };

// Filter Genre
genreBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('.genre-btn.active').classList.remove('active');
        btn.classList.add('active');
        
        const selected = btn.dataset.genre;
        const filtered = selected === 'All' ? allMovies : allMovies.filter(m => m.genre === selected);
        renderMovies(filtered);
    });
});

// Fitur Cari (Real-time)
searchInput.addEventListener('input', (e) => {
    const keyword = e.target.value.toLowerCase();
    const filtered = allMovies.filter(m => m.title.toLowerCase().includes(keyword));
    renderMovies(filtered);
});

initApp();
