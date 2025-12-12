// Admin credentials (Simple authentication)
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';

// Handle login form submission
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');

    // Validate credentials
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        // Save login session
        localStorage.setItem('adminLoggedIn', 'true');
        localStorage.setItem('adminUsername', username);

        // Redirect to admin dashboard
        window.location.href = 'admin.html';
    } else {
        // Show error
        errorMessage.textContent = 'Invalid username or password!';
        errorMessage.style.display = 'block';

        // Hide error after 3 seconds
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 3000);
    }
});

// Clear error on input
document.getElementById('username').addEventListener('input', function() {
    document.getElementById('errorMessage').style.display = 'none';
});

document.getElementById('password').addEventListener('input', function() {
    document.getElementById('errorMessage').style.display = 'none';
});
