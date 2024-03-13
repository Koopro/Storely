<template>
  <v-container>
    <v-row>
      <v-col>
        <v-form ref="form">
          <!-- Image Upload Input -->
          <v-file-input
            label="Select Profile Image"
            prepend-icon="mdi-camera"
            accept="image/*"
            @change="handleFileChange"
          ></v-file-input>


          <!-- Image Preview -->
          <v-img :src="imagePreview" aspect-ratio="1" contain v-if="imagePreview"></v-img>

          <!-- Upload Button -->
          <v-btn color="primary" @click="uploadImage">Upload Image</v-btn>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      imageFile: null, // Holds the selected file object
      imagePreview: null, // URL for the preview image
    };
  },
  watch: {
    // Automatically update preview when a new file is selected
    imageFile(newFile) {
      if (newFile) {
        const reader = new FileReader();
        reader.onload = e => {
          this.imagePreview = e.target.result;
        };
        reader.readAsDataURL(newFile);
      } else {
        this.imagePreview = null; // Clear the preview if no file is selected
      }
    }
  },
  methods: {
    handleFileChange(event) {
    const files = event.target.files || event.dataTransfer.files;
    if (!files.length) return;
    this.imageFile = files[0]; // Manually set the file
  },
  async uploadImage() {
  const formData = new FormData();
  formData.append('profileImage', this.imageFile);
  
  // Ensure this token retrieval line is correctly placed and defined
  const token = localStorage.getItem('authToken'); // Correctly retrieve the token

  if (!token) {
    console.error('Token is not available.');
    return;
  }

  try {
    const response = await axios.post('http://localhost:3000/api/uploadProfileImage', formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    console.log('Upload successful', response.data);
    // Handle success scenario
  } catch (error) {
    console.error('Failed to upload image:', error.response ? error.response.data : 'Unknown error');
    // Handle error scenario
  }
}


  },
  watch: {
  imageFile(newFile) {
    console.log(newFile); // Check the output to ensure it's a File object
    if (newFile && newFile instanceof Blob) { // Ensure newFile is a Blob
      const reader = new FileReader();
      reader.onload = e => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(newFile);
    } else {
      this.imagePreview = null;
    }
  }
},

};
</script>

<style scoped>
/* Additional styling as needed */
</style>
