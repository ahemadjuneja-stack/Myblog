// DOM Elements
const quranPosts = document.getElementById('quranPosts');
const hadeesPosts = document.getElementById('hadeesPosts');

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    console.log('Ummat-e-Nabi Platform Loaded');
    
    // Load Quran posts
    loadQuranPosts();
    
    // Load Hadees posts
    loadHadeesPosts();
    
    // Check authentication status
    checkAuthStatus();
});

// Load Quran Posts
async function loadQuranPosts() {
    try {
        const querySnapshot = await db.collection('posts')
            .where('type', '==', 'quran')
            .orderBy('date', 'desc')
            .limit(10)
            .get();
        
        displayPosts(querySnapshot, quranPosts, 'quran');
    } catch (error) {
        console.error('Error loading Quran posts:', error);
        quranPosts.innerHTML = '<div class="error">Error loading Quran verses. Please refresh.</div>';
    }
}

// Load Hadees Posts
async function loadHadeesPosts() {
    try {
        const querySnapshot = await db.collection('posts')
            .where('type', '==', 'hadees')
            .orderBy('date', 'desc')
            .limit(10)
            .get();
        
        displayPosts(querySnapshot, hadeesPosts, 'hadees');
    } catch (error) {
        console.error('Error loading Hadees posts:', error);
        hadeesPosts.innerHTML = '<div class="error">Error loading Hadees. Please refresh.</div>';
    }
}

// Display Posts
function displayPosts(querySnapshot, container, type) {
    container.innerHTML = '';
    
    if (querySnapshot.empty) {
        container.innerHTML = `
            <div class="no-posts" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                <i class="fas fa-book${type === 'quran' ? '-quran' : ''}" style="font-size: 3rem; color: #2E8B57; margin-bottom: 20px;"></i>
                <h3 style="color: #0A2647;">No ${type === 'quran' ? 'Quran verses' : 'Hadees'} available yet</h3>
                <p style="color: #666;">Be the first to share Islamic knowledge!</p>
                <a href="admin.html" class="btn-post" style="margin-top: 20px;">
                    <i class="fas fa-plus-circle"></i> Add First ${type === 'quran' ? 'Quran Verse' : 'Hadees'}
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
        
        // Format date
        let formattedDate = 'Recent';
        if (post.date && post.date.toDate) {
            const date = post.date.toDate();
            formattedDate = date.toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });
        } else if (post.date) {
            formattedDate = post.date;
        }
        
        // Get icon based on type
        const typeIcon = type === 'quran' ? 'fa-book-quran' : 'fa-book';
        const typeText = type === 'quran' ? 'Quran' : 'Hadees';
        
        postCard.innerHTML = `
            <div class="post-content">
                <p class="post-title">${post.content || post.title}</p>
                ${post.reference ? `<div class="post-reference">${post.reference}</div>` : ''}
            </div>
            <div class="post-meta">
                <span class="post-type"><i class="fas ${typeIcon}"></i> ${typeText}</span>
                <span class="post-date"><i class="far fa-calendar"></i> ${formattedDate}</span>
            </div>
        `;
        
        container.appendChild(postCard);
    });
}

// Check Authentication Status
function checkAuthStatus() {
    auth.onAuthStateChanged((user) => {
        if (user) {
            console.log('User is logged in:', user.email);
            // You can show admin link or other privileged content
        } else {
            console.log('User is not logged in');
        }
    });
}

// Search Functionality (if needed)
function performSearch() {
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        const query = searchInput.value.trim();
        if (query) {
            // Implement search functionality here
            console.log('Searching for:', query);
        }
    }
}

// Share functionality
function sharePost(postId, title) {
    if (navigator.share) {
        navigator.share({
            title: 'Ummat-e-Nabi ﷺ',
            text: title,
            url: window.location.href + '?post=' + postId
        });
    } else {
        // Fallback: Copy to clipboard
        const textArea = document.createElement('textarea');
        textArea.value = title + '\n\n' + window.location.href;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('Post link copied to clipboard!');
    }
}