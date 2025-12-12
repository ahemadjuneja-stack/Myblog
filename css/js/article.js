// Get article ID from URL
function getArticleId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// Load single article details
function loadArticle() {
    const articleId = getArticleId();
    const loadingArticle = document.getElementById('loadingArticle');
    const articleContent = document.getElementById('articleContent');

    if (!articleId) {
        loadingArticle.innerHTML = '<p style="color:red;">Invalid article ID</p>';
        return;
    }

    // Fetch article from Firebase
    articlesCollection
        .doc(articleId)
        .get()
        .then((doc) => {
            if (!doc.exists) {
                loadingArticle.innerHTML = '<p style="color:red;">Article not found</p>';
                return;
            }

            const article = doc.data();

            // Format date
            const date = article.createdAt ? 
                new Date(article.createdAt.seconds * 1000).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }) : 'Recent';

            // Update page title
            document.title = `${article.title} - Sufism Blog`;

            // Display article
            document.getElementById('articleImage').src = article.imageUrl;
            document.getElementById('articleImage').alt = article.title;
            document.getElementById('articleCategory').textContent = article.category;
            document.getElementById('articleTitle').textContent = article.title;
            document.getElementById('articleDate').textContent = date;
            document.getElementById('articleAuthor').textContent = article.author;
            document.getElementById('articleBody').innerHTML = article.content.replace(/\n/g, '<br><br>');

            // Hide loading, show content
            loadingArticle.style.display = 'none';
            articleContent.style.display = 'block';

            // Update view count (optional)
            updateViewCount(articleId);
        })
        .catch((error) => {
            console.error('Error loading article:', error);
            loadingArticle.innerHTML = '<p style="color:red;">Error loading article</p>';
        });
}

// Update article view count
function updateViewCount(articleId) {
    articlesCollection.doc(articleId).update({
        views: firebase.firestore.FieldValue.increment(1)
    }).catch(err => console.log('View count update failed:', err));
}

// Share article function
function shareArticle() {
    const title = document.getElementById('articleTitle').textContent;
    const url = window.location.href;

    if (navigator.share) {
        navigator.share({
            title: title,
            url: url
        }).catch(err => console.log('Error sharing:', err));
    } else {
        // Fallback: Copy to clipboard
        navigator.clipboard.writeText(url).then(() => {
            alert('Article link copied to clipboard!');
        });
    }
}

// Load article when page loads
document.addEventListener('DOMContentLoaded', loadArticle);
