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