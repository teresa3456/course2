// UI Component for Profile Page
const ProfileUI = {
    render(container, userData) {
      container.innerHTML = `
        <div class="profile-container">
          <div class="profile-header">
            <div class="profile-image-container">
              <img id="profileImage" src="${userData.profilePicture || '/images/default-avatar.png'}" alt="Profile Picture">
              <button id="changePhotoBtn" class="edit-photo-btn">
                <i class="fas fa-camera"></i> Change Photo
              </button>
            </div>
            <div class="profile-info">
              <h1 id="userName">${userData.username}</h1>
              <div class="stats">
                <div class="stat-item">
                  <span class="stat-count">${userData.followers}</span>
                  <span class="stat-label">Followers</span>
                </div>
                <div class="stat-item">
                  <span class="stat-count">${userData.following}</span>
                  <span class="stat-label">Following</span>
                </div>
              </div>
              <div class="bio-section">
                <p id="userBio" class="bio-text">${userData.bio || 'No bio yet'}</p>
                <button id="editBioBtn" class="edit-btn">Edit Bio</button>
              </div>
            </div>
          </div>
          <div class="profile-tabs">
            <button class="tab-btn active" data-tab="followers">Followers</button>
            <button class="tab-btn" data-tab="following">Following</button>
          </div>
          <div id="tabContent" class="tab-content"></div>
        </div>
      `;
    }
  };
  
