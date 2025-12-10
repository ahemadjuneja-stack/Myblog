// DOM Elements
const categoriesContainer = document.getElementById('categoriesContainer');
const featuredPosts = document.getElementById('featuredPosts');
const recentPosts = document.getElementById('recentPosts');

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    console.log('Islamic Notes Platform Loaded');
    
    // Load categories
    loadCategories();
    
    // Load featured posts
    loadFeaturedPosts();
    
    // Load recent posts
    loadRecentPosts();
    
    // Setup mobile menu
    setupMobileMenu();
});

// Load Categories
async function loadCategories() {
    try {
        const categories = [
            { id: 'quran', name: 'Quran Tafseer', icon: 'fas fa-book-quran', count: 0 },
            { id: 'hadith', name: 'Hadith Collection', icon: 'fas fa-book', count: 0 },
            { id: 'fiqh', name: 'Fiqh & Jurisprudence', icon: 'fas fa-balance-scale', count: 0 },
            { id: 'seerah', name: 'Seerah & History', icon: 'fas fa-history', count: 0 },
            { id: 'duas', name: 'Duas & Supplications', icon: 'fas fa-hands-praying', count: 0 },
            { id: 'salah', name: 'Salah & Worship', icon: 'fas fa-mosque', count: 0 },
            { id: 'character', name: 'Islamic Character', icon: 'fas fa-heart', count: 0 },
            { id: 'family', name: 'Family & Society', icon: 'fas fa-users', count: 0 }
        ];

        // Get post count for each category
        for (let category of categories) {
            const querySnapshot = await db.collection('posts')
                .where('category', '==', category.id)
                .where('published', '==', true)
                .get();
            category.count = querySnapshot.size;
        }

        // Display categories
        displayCategories(categories);
    } catch (error) {
        console.error('Error loading categories:', error);
        categoriesContainer.innerHTML = '<div class="error">Error loading categories. Please refresh.</div>';
    }
}

// Display Categories
function displayCategories(categories) {
    categoriesContainer.innerHTML = '';
    
    categories.forEach(category => {
        const categoryCard = document.createElement('div');
        categoryCard.className = 'category-card';
        categoryCard.setAttribute('data-category', category.id);
        categoryCard.onclick = () => window.location.href = `categories.html?category=${category.id}`;
        
        categoryCard.innerHTML = `
            <div class="category-icon">
                <i class="${category.icon}"></i>
            </div>
            <h3>${category.name}</h3>
            <div class="category-count">${category.count} Notes</div>
        `;
        
        categoriesContainer.appendChild(categoryCard);
    });
}

// Load Featured Posts
async function loadFeaturedPosts() {
    try {
        const querySnapshot = await db.collection('posts')
            .where('featured', '==', true)
            .where('published', '==', true)
            .orderBy('createdAt', 'desc')
            .limit(6)
            .get();
        
        displayPosts(querySnapshot, featuredPosts);
    } catch (error) {
        console.error('Error loading featured posts:', error);
        featuredPosts.innerHTML = '<div class="error">Error loading featured posts.</div>';
    }
}

// Load Recent Posts
async function loadRecentPosts() {
    try {
        const querySnapshot = await db.collection('posts')
            .where('published', '==', true)
            .orderBy('createdAt', 'desc')
            .limit(6)
            .get();
        
        displayPosts(querySnapshot, recentPosts);
    } catch (error) {
        console.error('Error loading recent posts:', error);
        recentPosts.innerHTML = '<div class="error">Error loading recent posts.</div>';
    }
}

// Display Posts
function displayPosts(querySnapshot, container) {
    container.innerHTML = '';
    
    if (querySnapshot.empty) {
        container.innerHTML = `
            <div class="no-posts" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                <i class="fas fa-book-open" style="font-size: 3rem; color: #2E8B57; margin-bottom: 20px;"></i>
                <h3 style="color: #0A2647;">No notes available yet</h3>
                <p style="color: #666;">Be the first to share Islamic knowledge!</p>
                <a href="admin.html" class="btn-primary" style="margin-top: 20px;">
                    <i class="fas fa-plus-circle"></i> Add First Note
                </a>
            </div>
        `;
        return;
    }
    
    querySnapshot.forEach(doc => {
        const post = doc.data();
        const postId = doc.id;
        
        const postCard = document.createElement('div');
        postCard.className = 'post-card';
        
        const formattedDate = new Date(post.createdAt?.toDate()).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        
        postCard.innerHTML = `
            <div class="post-image">
                ${post.imageUrl ? 
                    `<img src="${post.imageUrl}" alt="${post.title}" style="width: 100%; height: 100%; object-fit: cover;">` : 
                    `<div style="width: 100%; height: 100%; background: linear-gradient(135deg, #2E8B57, #0A2647); display: flex; align-items: center; justify-content: center; color: white;">
                        <i class="fas fa-book-open" style="font-size: 3rem;"></i>
                    </div>`
                }
            </div>
            <div class="post-content">
                <h3 class="post-title">${post.title}</h3>
                <p class="post-excerpt">${post.excerpt || post.content.substring(0, 150)}...</p>
                <div class="post-meta">
                    <span class="post-category">${getCategoryName(post.category)}</span>
                    <span class="post-date">${formattedDate}</span>
                </div>
            </div>
        `;
        
        postCard.onclick = () => viewPost(postId);
        container.appendChild(postCard);
    });
}

// Get Category Name
function getCategoryName(categoryId) {
    const categories = {
        'quran': 'Quran',
        'hadith': 'Hadith',
        'fiqh': 'Fiqh',
        'seerah': 'Seerah',
        'duas': 'Duas',
        'salah': 'Salah',
        'character': 'Character',
        'family': 'Family'
    };
    return categories[categoryId] || 'Islamic Notes';
}

// View Single Post
function viewPost(postId) {
    window.location.href = `post.html?id=${postId}`;
}

// Setup Mobile Menu
function setupMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
            if (navMenu.style.display === 'flex') {
                navMenu.style.flexDirection = 'column';
                navMenu.style.position = 'absolute';
                navMenu.style.top = '100%';
                navMenu.style.left = '0';
                navMenu.style.right = '0';
                navMenu.style.backgroundColor = 'white';
                navMenu.style.padding = '20px';
                navMenu.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
            }
        });
        
        // Close menu on window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                navMenu.style.display = '';
            }
        });
    }
}

// Search Functionality
document.querySelector('.nav-search button')?.addEventListener('click', performSearch);
document.querySelector('.nav-search input')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') performSearch();
});

function performSearch() {
    const searchInput = document.querySelector('.nav-search input');
    const query = searchInput.value.trim();
    
    if (query) {
        window.location.href = `categories.html?search=${encodeURIComponent(query)}`;
    }
}
