// Function to load the Post Submission Page
function loadPostPage() {
    const container = document.getElementById("app");
    if (!container) return console.error("Container element not found");

    // Add CSS styles
    const styles = `
        body {
            font-family: 'Arial', sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
        }
        nav {
            display: flex;
            justify-content: space-between;
            background-color: #fff;
            padding: 10px 20px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        nav a {
            text-decoration: none;
            color: #333;
            margin: 0 15px;
        }
        .sell-button {
            background-color: #007bff;
            color: white;
            padding: 10px 15px;
            border-radius: 5px;
        }
        .logout-button {
            background-color: #dc3545;
            color: white;
            padding: 10px 15px;
            border-radius: 5px;
        }
        .post-page {
            background-color: #ffffff;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            margin-top: 20px;
        }
        h2 {
            color: #333;
        }
        label {
            display: block;
            margin: 10px 0 5px;
            color: #555;
        }
        input[type="text"],
        textarea,
        input[type="file"] {
            width: 100%;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            margin-bottom: 15px;
        }
        button[type="submit"] {
            background-color: #28a745;
            color: white;
            padding: 10px 15px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
        button[type="submit"]:hover {
            background-color: #218838;
        }
        .message {
            margin-top: 15px;
            font-weight: bold;
        }
    `;

    // Create a style element and append it to the head
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // Render the post submission form
    container.innerHTML = `
        <nav>
            <a href="/M00994177/home">Home</a>
            <a href="/M00994177/feed">Feed</a>
            <a href="/M00994177/explore">Explore</a>
            <a href="/M00994177/post">Create Post</a>
            <a href="/M00994177/profile">Profile</a>
            <a href="/M00994177/login" class="sell-button">Login</a>
            <a href="/M00994177/users" class="sell-button">Register</a>
            <button id="logout-btn" class="logout-button">Logout</button>
        </nav>
        <div class="post-page">
            <h2>Submit a New Post</h2>
            <form id="postForm">
                <label for="title">Title:</label>
                <input type="text" id="title" name="title" required />

                <label for="price">Price:</label>
                <input type="text" id="price" name="price" required />

                <label for="description">Description:</label>
                <textarea id="description" name="description" required></textarea>

                <label for="video">Upload Video:</label>
                <input type="file" id="video" name="video" accept="video/*" required />

                <button type="submit">Submit Post</button>
            </form>
            <div id="postMessage" class="message"></div>
        </div>
    `;

    // Attach form submission event
    const postForm = document.getElementById("postForm");
    const postMessage = document.getElementById("postMessage");

    postForm.onsubmit = function (event) {
        event.preventDefault();

        // Create FormData for file upload
        const formData = new FormData(postForm);

        // Make a POST request to the server
        fetch("/M00994177/submitPost", {
            method: "POST",
            body: formData,
        })
            .then(function (response) {
                if (!response.ok) {
                    throw new Error("Failed to submit post: " + response.statusText);
                }
                return response.json();
            })
            .then(function (data) {
                if (data.success) {
                    postMessage.textContent = "Post submitted successfully!";
                    postMessage.style.color = "green";

                    // Clear the form
                    postForm.reset();

                    // Reload the feed
                    loadFeedPage();
                } else {
                    throw new Error(data.message || "Unknown error occurred");
                }
            })
            .catch(function (error) {
                postMessage.textContent = error.message;
                postMessage.style.color = "red";
            });
    };
}

// Logout Function
function logout() {
    alert("Logging out...");
    window.location.href = "/M00994177/logout";
}