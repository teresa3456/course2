// Global variables
const STUDENTID = '/M00994177';
let isLoading = false;
let page = 1;

// Error handling function
// Error handling function function handleFetchError(error, endpoint) { if (error.message.includes('429')) { console.log('Rate limit exceeded. Please wait before trying again.'); Swal.fire({ title: 'Too Many Requests', text: 'Please wait a moment before trying again', icon: 'warning', timer: 3000 }); return; } console.error(`Error fetching ${endpoint}:`, error); } // Rate limit fetch function async function fetchWithRateLimit(url, options = {}) { try { const response = await fetch(url, { ...options, headers: { ...options.headers, 'Accept': 'application/json' } }); if (!response.ok) { if (response.status === 429) { throw new Error('Rate limit exceeded'); } throw new Error(`HTTP error! status: ${response.status}`); } return await response.json(); } catch (error) { handleFetchError(error, url); throw error; } }
// Check authentication status
async function checkAuthStatus() {
    console.log('checkAuthStatus called');
    try {
        const response = await fetch(`/M00994177/auth/status`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            }
        });

        // Check if the response is okay before parsing
        if (!response.ok) {
            const errorText = await response.text(); // Get error text if not ok
            console.error('Error checking auth status:', errorText);
            return { loggedIn: false };
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error checking auth status:', error);
        return { loggedIn: false };
    }
}
// Load profile page
async function loadProfilePage() {
    try {
        const response = await fetch(`/M00994177/profile`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const profileHTML = await response.text();
        document.getElementById('mainContent').innerHTML = profileHTML;

        // Optionally, you can call the profile.js script here if needed
        const script = document.createElement('script');
        script.src = '/M00994177/scripts/profile.js';
        document.body.appendChild(script);
    } catch (error) {
        console.error('Error loading profile page:', error);
        document.getElementById('mainContent').innerHTML = `
            <div class="error-message">
                <p>Failed to load profile. Please try again later.</p>
            </div>
        `;
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', async function() {
    console.log('DOM loaded - initializing app');

    // Check auth status first
    const authStatus = await checkAuthStatus();

    // Initialize app based on auth status
    if (authStatus.loggedIn) {
        console.log('User is logged in:', authStatus.username);
        // Show logged-in content
    } else {
        console.log('User is not logged in');
        // Show login/signup options
    }

    // Continue with your existing initialization
    handleNavigation(window.location.pathname);
    updateNavbarLinks();
});

// Navigation handler
function handleNavigation(path) {
    console.log('Handling navigation to:', path);
    const appContainer = document.getElementById('app');
    if (!appContainer) return;

    // Remove STUDENTID prefix if present
    const cleanPath = path.replace(STUDENTID, '').replace(/^\//, '');
    console.log('Clean path:', cleanPath);

    // Reset page number when navigating
    page = 1;
    isLoading = false;

    switch (cleanPath) {
        case '':
        case 'users':
            loadSignupPage();
            break;
        case 'home':
            loadHomePage();
            break;
        case 'explore':
            loadExplorePage();
            break;
        case 'feed':
            loadFeedPage();
            break;
        case 'profile':
            loadProfilePage();
            break;
        case 'post':
            loadPostPage();
            break;
        case 'login':
            loadLoginPage();
            break;
        default:
            loadSignupPage();
    }
}

// Update navbar links based on auth status
function updateNavbarLinks() {
    console.log('Updating navbar links');
    const navLinks = {
        'signup': `${STUDENTID}/users`,
        'login': `${STUDENTID}/login`,
        'home': `${STUDENTID}/home`,
        'explore': `${STUDENTID}/explore`,
        'feed': `${STUDENTID}/feed`,
        'post': `${STUDENTID}/post`,
        'profile': `${STUDENTID}/profile`
    };

    const navbar = document.querySelector('nav');
    if (!navbar) return;

    // Check authentication status
    fetch(`${STUDENTID}/login`, {
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        const isLoggedIn = data.loggedIn;
        console.log('Auth status:', isLoggedIn);

        const linksToShow = isLoggedIn 
            ? ['home', 'explore', 'feed', 'post', 'profile'] 
            : ['signup', 'login'];

        navbar.innerHTML = linksToShow
            .map(key => `<a href="${navLinks[key]}" class="nav-link">${key.charAt(0).toUpperCase() + key.slice(1)}</a>`)
            .join('');

        if (isLoggedIn) {
            const logoutBtn = document.createElement('button');
            logoutBtn.id = 'logout-btn';
            logoutBtn.className = 'logout-button';
            logoutBtn.textContent = 'Logout';
            logoutBtn.addEventListener('click', handleLogout);
            navbar.appendChild(logoutBtn);
        }
    })
    .catch(error => {
        console.error('Error checking auth status:', error);
        navbar.innerHTML = `
            <a href="${navLinks['signup']}" class="nav-link">Sign Up</a>
            <a href="${navLinks['login']}" class="nav-link">Login</a>
        `;
    });
}

// Handle Logout
async function handleLogout() {
    try {
        const response = await fetch(`${STUDENTID}/login`, {
            method: 'DELETE',
            credentials: 'include'
        });

        if (response.ok) {
            window.location.href = `${STUDENTID}/`;
        } else {
            console.error('Logout failed');
        }
    } catch (error) {
        console.error('Logout error:', error);
    }
}

// Load Signup Page
function loadSignupPage() {
    console.log("Loading Signup Page...");
    const appContainer = document.getElementById('app');
    appContainer.innerHTML = `
        <div class="login-container">
            <video autoplay loop muted class="background-video">
                <source src="/images/home.mp4" type="video/mp4">
                Your browser does not support the video tag.
            </video>
            <div class="login-box">
                <h2>Register</h2>
                <form id="registerForm">
                    <div id="errorContainer"></div>
                    <div class="input-box">
                        <input type="text" id="username" placeholder="Username" required>
                        <span class="icon">👤</span>
                    </div>
                    <div class="input-box">
                        <input type="password" id="password" placeholder="Password" required>
                        <span class="icon">🔒</span>
                    </div>
                    <div class="input-box">
                        <input type="password" id="confirmPassword" placeholder="Confirm Password" required>
                        <span class="icon">🔒</span>
                    </div>
                    <button type="submit">Register</button>
                    <p>Already have an account? <a href="/M00994177/login">Login</a></p>
                </form>
            </div>
        </div>`;

    appContainer.setAttribute('data-page', 'users');

    // Add event listener to the registration form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegistration);
    }
}

async function handleRegistration(event) {
    event.preventDefault();
    const errorContainer = document.getElementById('errorContainer');
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Clear previous errors
    errorContainer.innerHTML = '';

    // Validation
    if (!username || !password) {
        errorContainer.innerHTML = '<p class="error">Please fill in all fields</p>';
        return;
    }

    if (password !== confirmPassword) {
        errorContainer.innerHTML = '<p class="error">Passwords do not match</p>';
        return;
    }

    const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*\d)[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
    if (!passwordRegex.test(password)) {
        errorContainer.innerHTML = `
            <p class="error">
                Password must be at least 8 characters long, include at least one symbol, and one number.
            </p>`;
        return;
    }

    try {
        const response = await fetch(`${STUDENTID}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.status === 201) {
            // Show success message
            Swal.fire({
                title: 'Success!',
                text: 'Registration successful! Redirecting to login...',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            }).then(() => {
                window.location.href = `${STUDENTID}/login`;
            });
        } else {
            errorContainer.innerHTML = `<p class="error">${data.message}</p>`;
        }
    } catch (error) {
        errorContainer.innerHTML = '<p class="error">An error occurred. Please try again later.</p>';
        console.error('Registration error:', error);
    }
}

function loadLoginPage() {
    console.log("Loading Login Page...");
    const appContainer = document.getElementById('app');
    appContainer.innerHTML = `
        <div class="login-container">
            <video autoplay loop muted class="background-video">
                <source src="/images/home.mp4" type="video/mp4">
                Your browser does not support the video tag.
            </video>
            <div class="login-box">
                <h2>Login</h2>
                <form id="loginForm">
                    <div id="errorContainer"></div>
                    <div class="input-box">
                        <input type="text" id="loginUsername" placeholder="Username" required>
                        <span class="icon">👤</span>
                    </div>
                    <div class="input-box">
                        <input type="password" id="loginPassword" placeholder="Password" required>
                        <span class="icon">🔒</span>
                    </div>
                    <button type="submit">Login</button>
                    <p>Don't have an account? <a href="/M00994177/users">Register</a></p>
                </form>
            </div>
        </div>`;

    appContainer.setAttribute('data-page', 'login');

    // Add event listener to login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
}

// ... existing code ...

function LoadProfilePage() {
    // Set up the HTML structure for the profile page
    const profileHTML = `
        <div id="profileContainer">
            <h1 id="username"></h1>
            <img id="profilePicture" alt="Profile Picture" />
            <p id="bio"></p>
            <h2>Followers</h2>
            <ul id="followerList"></ul>
            <h2>Following</h2>
            <ul id="followingList"></ul>
        </div>
    `;
  
    // Insert the profile HTML into a container element
    document.getElementById('profilePage').innerHTML = profileHTML;
  
    // Fetch user data from the /users endpoint
    fetch('/M00994177/users')
        .then(response => response.json())
        .then(userData => {
            // Display user name, profile picture, and bio
            document.getElementById('username').innerText = userData.name;
            document.getElementById('profilePicture').src = userData.profilePicture;
            document.getElementById('bio').innerText = userData.bio;
  
            // Fetch user contents from the /contents endpoint
            return fetch('/M00994177/contents');
        })
        .then(response => response.json())
        .then(contentsData => {
            // Display following and follower list
            document.getElementById('followingList').innerHTML = contentsData.following.map(user => `<li>${user}</li>`).join('');
            document.getElementById('followerList').innerHTML = contentsData.followers.map(user => `<li>${user}</li>`).join('');
        })
        .catch(error => console.error('Error loading profile:', error));
  }
  
  // ... existing code ...
// Handle Login Form Submission
async function handleLogin(event) {
    event.preventDefault();
    const errorContainer = document.getElementById('errorContainer');
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;

    // Clear previous errors
    errorContainer.innerHTML = '';

    if (!username || !password) {
        errorContainer.innerHTML = '<p class="error">Please fill in all fields</p>';
        return;
    }

    try {
        const response = await fetch(`${STUDENTID}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.status === 200) {
            // Show success message
            Swal.fire({
                title: 'Welcome back!',
                text: 'Login successful! Redirecting...',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            }).then(() => {
                window.location.href = `${STUDENTID}/feed`; // Redirect to home page
            });
        } else {
            errorContainer.innerHTML = `<p class="error">${data.message}</p>`;
        }
    } catch (error) {
        errorContainer.innerHTML = '<p class="error">An error occurred. Please try again later.</p>';
        console.error('Login error:', error);
    }
}

// Load Home Page
function loadHomePage() {
    const appContainer = document.getElementById('app');
    appContainer.innerHTML = `
        <section id="banner">
            <video autoplay loop muted class="background-video">
                <source src="/images/home.mp4" type="video/mp4">
                Your browser does not support the video tag.
            </video>
            <div class="search-container">
                <h2>View Luxury Properties All Around the World</h2>
                <form>
                    <select>
                        <option>City</option>
                    </select>
                    <select>
                        <option>Property Type</option>
                    </select>
                    <select>
                        <option>Offer Type</option>
                    </select>
                    <button type="submit">Search</button>
                </form>
            </div>
        </section>
        <section class="popular-cities" data-aos="fade-up" data-aos-duration="1000" data-aos-once="false">
            <h2>Popular Cities</h2>
            <div class="city-cards">
                <div class="city-card" style="background-image: url('/images/Grand\ Baie.jpg');">
                    <div class="city-name">Grand Baie</div>
                </div>
                <div class="city-card" style="background-image: url('/images/Moka.jpg');">
                    <div class="city-name">Moka</div>
                </div>
                <div class="city-card" style="background-image: url('/images/Pereybere.jpg');">
                    <div class="city-name">Pereybere</div>
                </div>
            </div>
        </section>
        <section class="who-we-are" data-aos="fade-up" data-aos-duration="1000" data-aos-once="false">
            <div class="content" data-aos="fade-up">
                <h2>WHO WE ARE</h2>
                <p>
                    Welcome! We introduce you to our social networking website that is created with the sole-purpose of showcasing luxury rentals all around the world, 
                    offering a diverse range of options to meet your needs. We give you the platform to directly communicate with buyers and sellers
                    for a smooth and easy transition.
                </p>
            </div>
            <div class="image" data-aos="fade-up">
                <img src="/images/about us.jpg" alt="About Us">
            </div>
        </section>
        <script>
            AOS.init();
        </script>`;
    appContainer.setAttribute('data-page', 'home');
}

// Add event listener to logout button
document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
});

// Update navigation links
function updateNavLinks() {
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === window.location.pathname) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}