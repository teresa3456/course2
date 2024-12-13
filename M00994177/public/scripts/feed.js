function loadFeedPage() {
    const container = document.getElementById("app");
    container.innerHTML = "";

    const navBar = `
        <nav class="navbar">
            <div class="logo">RentalHub</div>
            <ul class="nav-links">
                <li><a href="/M00994177/home">Home</a></li>
                <li><a href="/M00994177/feed">Feed</a></li>
                <li><a href="/M00994177/post">Create Post</a></li>
                <li><a href="/M00994177/profile">Profile</a></li>


                
                <li><a href="#" onclick="logout()">LogOut</a></li>
            </ul>
        </nav>`;

    const properties = [
        {
            title: "Beachfront Villa",
            username: "Elena",
            price: "$16,000,000",
            description: "Touring a $16 Million Dubai Beachfront on Palm Jumeriah with INSANE views.",
            video: "/M00994177/images/video6.mp4"
        },
        {
            title: "Vertical Mansion",
            username:"Renter21",
            price: "$1,800,000",
            description: "Welcome to the world of luxury living in the heart of the city.",
            video: "/M00994177/images/video7.mp4",
        },
        {
            title: "Beachfront Condo",
            username: "Landlord78",
            price: "$24,000",
            description: "A stunning condo with a view of the ocean and modern amenities.",
            video: "/M00994177/images/video8.mp4",
        }
    ];

    const feed = `
        <section class="feed">
            ${properties
                .map(
                    (property, index) => `
                    <div class="feed-item scroll-animate ${index % 2 === 0 ? 'video-left' : 'video-right'}">
                        <div class="feed-content">
                            <div class="video-container">
                                <video class="feed-video" src="${property.video}" controls autoplay muted loop></video>
                            </div>
                            <div class="feed-details">
                                <div class="details-container">
                                    <h2 class="property-title">${property.title}</h2>
                                    <p class="property-username">${property.username}</p>
                                    <p class="property-description">${property.description}</p>
                                    <p class="property-price">${property.price}</p>
                                    <div class="actions">
                                        <button class="action-btn like-btn">Like</button>
                                        <button class="action-btn save-btn">Save</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`
                )
                .join("")}
        </section>`;

    container.innerHTML = navBar + feed;

    const style = document.createElement("style");
    style.textContent = `
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f9f9f9;
        }

        .navbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background-color: #f9f9f9;
            color: #fff;
            padding: 15px 40px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            position: fixed;
            width: 100%;
            top: 0;
            z-index: 1000;
        }

        .nav-links {
            list-style: none;
            display: flex;
            gap: 30px;
            margin: 0;
            padding: 0;
        }

        .nav-links a {
            color: grey;
            text-decoration: none;
            font-weight: 500;
        }

        .feed {
            max-width: 1200px;
            margin: 100px auto 40px;
            padding: 0 20px;
        }

        .feed-item {
            margin-bottom: 100px;
            background: white;
            border-radius: 12px;
            overflow: hidden;
        }

        .feed-content {
            display: flex;
            min-height: 600px;
        }

        .video-left .feed-content {
            flex-direction: row;
        }

        .video-right .feed-content {
            flex-direction: row-reverse;
        }

        .video-container {
            flex: 1;
            position: relative;
            max-width: 450px;
            padding: 20px;
            background-color: #f9f9f9; /* Add or modify this line to change the background color */
        }

        
        .feed-video {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 30px;
            box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
            background-color: #f9f9f9; /* Add or modify this line to change the video background */
        }

        .feed-details {
            flex: 1;
            padding: 40px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            text-align: center;
        }

        .details-container {
            max-width: 400px;
            margin: 0 auto;
        }

        .property-title {
            font-size: 1.5em;
            color: #333;
            margin-bottom: 40px;
            font-weight: 600;
        }

        .property-description {
            font-size: 1.2em;
            color: #666;
            line-height: 1.6;
            margin-bottom: 40px;
        }

        .property-price {
            font-size: 1.3em;
            color: #1e90ff;
            font-weight: 600;
            margin-bottom: 40px;
        }

        .actions {
            display: flex;
            gap: 15px;
            justify-content: center;
        }

        .action-btn {
            padding: 12px 24px;
            border: none;
            border-radius: 6px;
            font-size: 16px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .like-btn {
            background-color: #ff4757;
            color: white;
        }

        .save-btn {
            background-color: #1e90ff;
            color: white;
        }

        .like-btn:hover {
            background-color: grey;
        }

        .save-btn:hover {
            background-color: grey;
        }

        /* Animation styles */
        .scroll-animate {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }

        .scroll-animate.in-view {
            opacity: 1;
            transform: translateY(0);
        }

        @media (max-width: 768px) {
            .feed-content {
                flex-direction: column !important;
                min-height: auto;
            }

            .video-container {
                height: auto;
                width: 100%;
                max-width: none;
                padding: 10px;
            }

            .feed-details {
                padding: 20px;
            }
        }
    `;
    document.head.appendChild(style);

    // Add scroll animation
    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, {
        threshold: 0.1
    });

    document.querySelectorAll('.scroll-animate').forEach(element => {
        observer.observe(element);
    });
}

loadFeedPage();

async function displayPosts() {
    try {
        const response = await fetch('/M00994177/api/posts');
        if (response.ok) {
            const posts = await response.json();
            const feedContainer = document.getElementById('feedContainer');

            // Clears the feed container
            feedContainer.innerHTML = '';

            // Iterates over posts and prepend them to the feed container
            for (let i = posts.length - 1; i >= 0; i--) {
                const post = posts[i];
                const postContainer = createPostContainer(post);
                feedContainer.insertBefore(postContainer, feedContainer.firstChild);
            }
        } else {
            console.error('Failed to fetch posts:', response.statusText);
        }
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
}
// Function to create a container for posts
function createPostContainer(post) {
  // Creates post container
  const postContainer = document.createElement('div');
  postContainer.classList.add('feedPost', 'col-md-6');

  // Iterate over post images in reverse order (newest first)
  for (let i = post.images.length - 1; i >= 0; i--) {
    const imageUrl = post.images[i];

    // Creates image container
    const imageContainer = document.createElement('div');
    imageContainer.classList.add('image-container');
    postContainer.appendChild(imageContainer);

    // Creates image element
    const postImage = document.createElement('img');
    postImage.src = imageUrl;
    postImage.width = 420;
    postImage.height = 370;
    imageContainer.appendChild(postImage);

    // Creates under post container
    const underPostContainer = document.createElement('div');
    underPostContainer.classList.add('feed-underPost');
    imageContainer.appendChild(underPostContainer);

    // Creates profile picture
    const profilePicture = document.createElement('img');
    profilePicture.src = post.userProfilePictureUrl;
    profilePicture.width = 60;
    profilePicture.height = 60;
    underPostContainer.appendChild(profilePicture);

    // Creates username
    const username = document.createElement('p');
    username.textContent = post.username;
    underPostContainer.appendChild(username);

    // Creates icons for like, comment, and save
    const likeIcon = document.createElement('i');
    likeIcon.classList.add('bx', 'bxs-heart');
    underPostContainer.appendChild(likeIcon);

    const commentIcon = document.createElement('i');
    commentIcon.classList.add('bx', 'bx-comment-dots');
    underPostContainer.appendChild(commentIcon);

    const saveIcon = document.createElement('i');
    saveIcon.classList.add('bx', 'bxs-bookmark');
    underPostContainer.appendChild(saveIcon);
  }
  return postContainer;
}
// Follow/Unfollow logic
async function handleFollowUnfollow(username, button) {
    try {
        const action = button.textContent.toLowerCase();
        const response = await fetch('/M00994177/api/followUser', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, action }),
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        // Update button text based on the action
        button.textContent = action === 'follow' ? 'Unfollow' : 'Follow';
        console.log(`${action === 'follow' ? 'Followed' : 'Unfollowed'} ${username}`, data);
    } catch (error) {
        console.error('Error handling follow/unfollow:', error);
    }
}

// Load posts on DOMContentLoaded
function loadPosts() {
    displayPosts();

    window.addEventListener('DOMContentLoaded', () => {
        const searchInput = document.querySelector('#search-feedPage input[name="q"]');
        const searchResultsContainer = document.getElementById('search-results');

        searchInput.addEventListener('input', async () => {
            const searchTerm = searchInput.value.trim();
            if (!searchTerm) {
                searchResultsContainer.style.display = 'none';
                return;
            }

            try {
                const response = await fetch(`/M00994177/api/searchUsers?q=${encodeURIComponent(searchTerm)}`);
                if (!response.ok) throw new Error('Failed to fetch search results');

                const users = await response.json();
                searchResultsContainer.innerHTML = '';
                searchResultsContainer.style.display = 'block';

                users.forEach(user => {
                    const userElement = document.createElement('li');
                    userElement.textContent = `@${user.username}`;
                    searchResultsContainer.appendChild(userElement);
                });
            } catch (error) {
                console.error('Error fetching search results:', error);
            }
        });

        document.addEventListener('click', event => {
            if (!searchResultsContainer.contains(event.target) && event.target !== searchInput) {
                searchResultsContainer.style.display = 'none';
            }
        });
    });
}


async function loadUserFeed() {
    try {
        const response = await fetch('/M00994177/api/posts', {
            credentials: 'include'
        });
        
        if (!response.ok) {
            throw new Error('Failed to load feed');
        }
        
        const posts = await response.json();
        displayUserFeed(posts);
    } catch (error) {
        console.error('Error loading feed:', error);
        alert('Failed to load feed. Please try again.');
    }
}

function displayUserFeed(posts) {
    const feedContainer = document.getElementById('feed');
    feedContainer.innerHTML = '';

    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'feed-post';
        postElement.innerHTML = `
            <div class="post-header">
                <span class="username">${post.username}</span>
            </div>
            <video src="/M00994177/uploads/${post.video}" controls class="post-video"></video>
            <div class="post-details">
                <p class="caption">${post.caption}</p>
                <p class="location">${post.location || ''}</p>
                <p class="price">${post.price ? '$' + post.price : ''}</p>
            </div>
        `;
        feedContainer.appendChild(postElement);
    });
}

async function handlePostSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData();
    formData.append('video', document.getElementById('videoInput').files[0]);
    formData.append('caption', document.getElementById('captionInput').value);
    formData.append('location', document.getElementById('locationInput').value);
    formData.append('price', document.getElementById('priceInput').value);

    try {
        const response = await fetch('/M00994177/uploads', {
            method: 'POST',
            body: formData,
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Failed to create post');
        }

        alert('Post created successfully!');
        document.getElementById('postForm').reset();
        loadUserFeed();
    } catch (error) {
        console.error('Error creating post:', error);
        alert('Failed to create post. Please try again.');
    }
}

async function toggleLike(postId) {
    try {
        const response = await fetch(`/M00994177/api/posts/${postId}/like`, {
            method: 'POST',
            credentials: 'include'
        });
        if (!response.ok) throw new Error('Failed to toggle like');
        loadFeedPage(); // Refresh the feed
    } catch (error) {
        console.error('Error toggling like:', error);
    }
}

async function toggleSave(postId) {
    try {
        const response = await fetch(`/M00994177/api/posts/${postId}/save`, {
            method: 'POST',
            credentials: 'include'
        });
        if (!response.ok) throw new Error('Failed to toggle save');
        loadFeedPage(); // Refresh the feed
    } catch (error) {
        console.error('Error toggling save:', error);
    }
}