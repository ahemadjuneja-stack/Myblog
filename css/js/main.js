// Load all articles from Firebase and display on homepage
function loadArticles() {
    const articlesContainer = document.getElementById('articlesContainer');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const noArticles = document.getElementById('noArticles');

    // Show loading
    loadingSpinner.style.display = 'block';
    articlesContainer.innerHTML = '';
    noArticles.style.display = 'none';

    // Fetch articles from Firebase (sorted by date, newest first)
    articlesCollection
        .orderBy('createdAt', 'desc')
        .get()
        .then((snapshot) => {
            loadingSpinner.style.display = 'none';

            if (snapshot.empty) {
                noArticles.style.display = 'block';
                return;
            }

            snapshot.forEach((doc) => {
                const article = doc.data();
                const articleId = doc.id;

                // Format date
                const date = article.createdAt ? 
                    new Date(article.createdAt.seconds * 1000).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    }) : 'Recent';

                // Create article card HTML
                const articleCard = `
                    <article class="article-card" onclick="openArticle('${articleId}')">
                        <div class="article-image">
                            <img src="${article.imageUrl}" alt="${article.title}" onerror="this.src='https://via.placeholder.com/600x400?text=No+Image'">
                            <span class="article-category">${article.category}</span>
                        </div>
                        <div class="article-content">
                            <div class="article-meta">
                                <span><i class="far fa-calendar"></i> ${date}</span>
                                <span><i class="far fa-user"></i> ${article.author}</span>
                            </div>
                            <h3 class="article-title">${article.title}</h3>
                            <p class="article-excerpt">${article.excerpt}</p>
                            <a href="#" class="read-more">Read More <i class="fas fa-arrow-right"></i></a>
                        </div>
                    </article>
                `;

                articlesContainer.innerHTML += articleCard;
            });
        })
        .catch((error) => {
            console.error('Error loading articles:', error);
            loadingSpinner.style.display = 'none';
            articlesContainer.innerHTML = '<p style="text-align:center; color:red;">Error loading articles. Please try again later.</p>';
        });
}

// Open single article page
function openArticle(articleId) {
    window.location.href = `article.html?id=${articleId}`;
}

// Search functionality
document.getElementById('searchInput')?.addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const articleCards = document.querySelectorAll('.article-card');

    articleCards.forEach(card => {
        const title = card.querySelector('.article-title').textContent.toLowerCase();
        const excerpt = card.querySelector('.article-excerpt').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || excerpt.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
});

// Load articles when page loads
document.addEventListener('DOMContentLoaded', loadArticles);
