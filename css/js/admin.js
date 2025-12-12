// Check if admin is logged in
function checkAuth() {
    if (!localStorage.getItem('adminLoggedIn')) {
        window.location.href = 'admin-login.html';
        return false;
    }
    
    // Display admin name
    const adminName = localStorage.getItem('adminUsername') || 'Admin';
    document.getElementById('adminName').textContent = adminName;
    return true;
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('adminLoggedIn');
        localStorage.removeItem('adminUsername');
        window.location.href = 'admin-login.html';
    }
}

// Show different sections
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });

    // Show selected section
    document.getElementById(sectionId).classList.add('active');

    // Update sidebar active state
    document.querySelectorAll('.sidebar-menu li').forEach(li => {
        li.classList.remove('active');
    });

    // Update page title
    let pageTitle = 'Dashboard';
    if (sectionId === 'articles') pageTitle = 'All Articles';
    if (sectionId === 'add-article') pageTitle = 'Add New Article';
    document.getElementById('pageTitle').textContent = pageTitle;
}

// Load dashboard statistics
function loadDashboardStats() {
    articlesCollection.get().then(snapshot => {
        const totalArticles = snapshot.size;
        document.getElementById('totalArticles').textContent = totalArticles;
        document.getElementById('recentPosts').textContent = Math.min(totalArticles, 5);

        // Calculate total views
        let totalViews = 0;
        snapshot.forEach(doc => {
            totalViews += doc.data().views || 0;
        });
        document.getElementById('totalViews').textContent = totalViews;

        // Load recent articles
        loadRecentArticles(snapshot);
    });
}

// Load recent articles for dashboard
function loadRecentArticles(snapshot) {
    const recentList = document.getElementById('recentArticlesList');
    recentList.innerHTML = '';

    const articles = [];
    snapshot.forEach(doc => {
        articles.push({ id: doc.id, ...doc.data() });
    });

    // Sort by date and take first 5
    articles.sort((a, b) => {
        const dateA = a.createdAt ? a.createdAt.seconds : 0;
        const dateB = b.createdAt ? b.createdAt.seconds : 0;
        return dateB - dateA;
    });

    articles.slice(0, 5).forEach(article => {
        const date = article.createdAt ? 
            new Date(article.createdAt.seconds * 1000).toLocaleDateString() : 'Recent';

        recentList.innerHTML += `
            <div class="article-item">
                <div class="article-info">
                    <h4>${article.title}</h4>
                    <p>${article.category} • ${date}</p>
                </div>
            </div>
        `;
    });
}

// Load all articles in table
function loadAllArticles() {
    const articlesTable = document.getElementById('articlesTable');
    articlesTable.innerHTML = '<div style="text-align:center; padding:2rem;"><i class="fas fa-spinner fa-spin"></i> Loading...</div>';

    articlesCollection.orderBy('createdAt', 'desc').get().then(snapshot => {
        articlesTable.innerHTML = '';

        if (snapshot.empty) {
            articlesTable.innerHTML = '<p style="text-align:center; padding:2rem; color:#718096;">No articles yet. Create your first article!</p>';
            return;
        }

        snapshot.forEach(doc => {
            const article = doc.data();
            const articleId = doc.id;
            const date = article.createdAt ? 
                new Date(article.createdAt.seconds * 1000).toLocaleDateString() : 'Recent';

            articlesTable.innerHTML += `
                <div class="article-item">
                    <div class="article-info">
                        <h4>${article.title}</h4>
                        <p>${article.category} • ${date} • ${article.views || 0} views</p>
                    </div>
                    <div class="article-actions">
                        <button class="btn-edit" onclick="editArticle('${articleId}')">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn-delete" onclick="deleteArticle('${articleId}')">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            `;
        });
    });
}

// Add new article or update existing
document.getElementById('articleForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const articleId = document.getElementById('articleId').value;
    const articleData = {
        title: document.getElementById('title').value,
        category: document.getElementById('category').value,
        author: document.getElementById('author').value,
        imageUrl: document.getElementById('imageUrl').value,
        excerpt: document.getElementById('excerpt').value,
        content: document.getElementById('content').value,
        views: 0
    };

    if (articleId) {
        // Update existing article
        articlesCollection.doc(articleId).update({
            ...articleData,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
            alert('Article updated successfully!');
            resetForm();
            loadAllArticles();
            loadDashboardStats();
            showSection('articles');
        }).catch(error => {
            alert('Error updating article: ' + error.message);
        });
    } else {
        // Add new article
        articlesCollection.add({
            ...articleData,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
            alert('Article published successfully!');
            resetForm();
            loadAllArticles();
            loadDashboardStats();
            showSection('articles');
        }).catch(error => {
            alert('Error publishing article: ' + error.message);
        });
    }
});

// Edit article
function editArticle(articleId) {
    articlesCollection.doc(articleId).get().then(doc => {
        if (!doc.exists) {
            alert('Article not found!');
            return;
        }

        const article = doc.data();

        // Fill form with article data
        document.getElementById('articleId').value = articleId;
        document.getElementById('title').value = article.title;
        document.getElementById('category').value = article.category;
        document.getElementById('author').value = article.author;
        document.getElementById('imageUrl').value = article.imageUrl;
        document.getElementById('excerpt').value = article.excerpt;
        document.getElementById('content').value = article.content;

        // Change form title
        document.getElementById('formTitle').textContent = 'Edit Article';

        // Show add-article section
        showSection('add-article');
    });
}

// Delete article
function deleteArticle(articleId) {
    if (confirm('Are you sure you want to delete this article? This action cannot be undone.')) {
        articlesCollection.doc(articleId).delete().then(() => {
            alert('Article deleted successfully!');
            loadAllArticles();
            loadDashboardStats();
        }).catch(error => {
            alert('Error deleting article: ' + error.message);
        });
    }
}

// Reset form
function resetForm() {
    document.getElementById('articleForm').reset();
    document.getElementById('articleId').value = '';
    document.getElementById('formTitle').textContent = 'Add New Article';
}

// Initialize admin panel
document.addEventListener('DOMContentLoaded', function() {
    if (checkAuth()) {
        loadDashboardStats();
        loadAllArticles();
    }
});
