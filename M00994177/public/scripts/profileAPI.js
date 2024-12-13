// API Service for Profile Page
const ProfileAPI = {
    async getUserProfile() {
      try {
        const response = await fetch('/api/profile');
        if (!response.ok) throw new Error('Failed to fetch profile');
        return await response.json();
      } catch (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }
    },
  
    async updateProfilePicture(formData) {
      try {
        const response = await fetch('/api/profile/photo', {
          method: 'POST',
          body: formData
        });
        if (!response.ok) throw new Error('Failed to update profile picture');
        return await response.json();
      } catch (error) {
        console.error('Error updating profile picture:', error);
        throw error;
      }
    },
  
    async updateBio(bio) {
      try {
        const response = await fetch('/api/profile/bio', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ bio })
        });
        if (!response.ok) throw new Error('Failed to update bio');
        return await response.json();
      } catch (error) {
        console.error('Error updating bio:', error);
        throw error;
      }
    }
  };
