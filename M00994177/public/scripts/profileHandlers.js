// Event Handlers for Profile Page
const ProfileHandlers = {
    init() {
      this.setupPhotoUpload();
      this.setupBioEdit();
      this.setupTabs();
    },
  
    setupPhotoUpload() {
      const changePhotoBtn = document.getElementById('changePhotoBtn');
      if (changePhotoBtn) {
        changePhotoBtn.addEventListener('click', () => {
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = 'image/*';
          input.onchange = async (e) => {
            const file = e.target.files[0];
            if (file) {
              const formData = new FormData();
              formData.append('profilePicture', file);
              
              try {
                const response = await fetch('/api/profile/photo', {
                  method: 'POST',
                  body: formData
                });
                
                if (response.ok) {
                  const data = await response.json();
                  document.getElementById('profileImage').src = data.imageUrl;
                }
              } catch (error) {
                console.error('Error uploading photo:', error);
              }
            }
          };
          input.click();
        });
      }
    },
  
    setupBioEdit() {
      const editBioBtn = document.getElementById('editBioBtn');
      if (editBioBtn) {
        editBioBtn.addEventListener('click', () => {
          const bioText = document.getElementById('userBio');
          const currentBio = bioText.textContent;
          
          const textarea = document.createElement('textarea');
          textarea.value = currentBio;
          textarea.className = 'bio-edit-textarea';
          
          const saveBtn = document.createElement('button');
          saveBtn.textContent = 'Save';
          saveBtn.className = 'save-btn';
          
          bioText.replaceWith(textarea);
          editBioBtn.replaceWith(saveBtn);
          
          saveBtn.addEventListener('click', async () => {
            try {
              const response = await fetch('/api/profile/bio', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ bio: textarea.value })
              });
              
              if (response.ok) {
                bioText.textContent = textarea.value;
                textarea.replaceWith(bioText);
                saveBtn.replaceWith(editBioBtn);
              }
            } catch (error) {
              console.error('Error saving bio:', error);
            }
          });
        });
      }
    },
  
    setupTabs() {
      const tabButtons = document.querySelectorAll('.tab-btn');
      const tabContent = document.getElementById('tabContent');
      
      tabButtons.forEach(button => {
        button.addEventListener('click', async () => {
          tabButtons.forEach(btn => btn.classList.remove('active'));
          button.classList.add('active');
          
          const tab = button.dataset.tab;
          try {
            const response = await fetch(`/api/profile/${tab}`);
            const data = await response.json();
            
            tabContent.innerHTML = data.users.map(user => `
              <div class="user-item">
                <img src="${user.profilePicture}" alt="${user.username}">
                <span>${user.username}</span>
              </div>
            `).join('');
          } catch (error) {
            console.error(`Error loading ${tab}:`, error);
          }
        });
      });
    }
  };
  
  