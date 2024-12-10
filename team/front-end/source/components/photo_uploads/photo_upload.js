import { NavBarComponent } from '../NavBarComponent/navbar.js';
export class PhotoUploadsFeature {

    constructor() {
        this.db = null;
        this.loadCSS();
        this.initDatabase();
    }

    loadCSS() {
        const styleSheet = document.createElement("link");
        styleSheet.rel = "stylesheet";
        styleSheet.href = "components/photo_uploads/photo_upload.css";
        document.head.appendChild(styleSheet);
    }

    initDatabase() {
        const request = indexedDB.open('ImageDB', 1);

        request.onupgradeneeded = function(event) {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('images')) {
                db.createObjectStore('images', { keyPath: 'id', autoIncrement: true });
            }
        };

        request.onsuccess = function(event) {
            console.log('Database initialized');
            this.db = event.target.result;
            this.loadSavedImage();
        }.bind(this);

        request.onerror = function(event) {
            console.error('Database failed to open', event.target.error);
        };
    }

    loadSavedImage() {
        if (this.db) {
            const transaction = this.db.transaction('images', 'readonly');
            const store = transaction.objectStore('images');
            const getRequest = store.getAll();

            getRequest.onsuccess = () => {
                const images = getRequest.result;
                if (images.length > 0) {
                    const latestImage = images[images.length - 1].image;
                    this.displayImage(latestImage);
                    //load restaurant too
                    const latestRestaurant = images[images.length - 1].restaurant;
                    const textInput = document.getElementById('restaurant');
                    textInput.value = latestRestaurant;
                }
            };

            getRequest.onerror = (err) => {
                console.error('Error retrieving images from IndexedDB:', err);
            };
        } else {
            console.error('Database is not initialized');
        }
    }

    displayImage(imageSrc) {
        const imagePreview = document.getElementById('imagePreview');
        const imagePreviewText = document.getElementById('imagePreviewText');
        
        if (imagePreview) {
            imagePreview.src = imageSrc;
            imagePreview.style.display = 'block';
            imagePreviewContainer.style.display = 'block';
        }
        
        if (imagePreviewText) {
            imagePreviewText.style.display = 'block';
            imagePreviewContainer.style.display = 'block';
        }
    }


    saveImageToIndexedDB(file) {
        if (!this.db) {
            console.error('Database not initialized');
            return;
        }

        const transaction = this.db.transaction('images', 'readwrite');
        const store = transaction.objectStore('images');

        const reader = new FileReader();
        reader.onload = function(e) {
            const imageBlob = new Blob([e.target.result], { type: file.type });
            const addRequest = store.add({ image: imageBlob, name: file.name, timestamp: Date.now() });

            addRequest.onsuccess = function() {
                console.log('Image saved successfully.');
            };

            addRequest.onerror = function() {
                console.error('Failed to save image:', addRequest.error);
            };
        };

        reader.onerror = function() {
            console.error('Error reading file:', reader.error);
        };

        reader.readAsArrayBuffer(file);
    }

    clearAllImages() {
        if (this.db) {
            const transaction = this.db.transaction('images', 'readwrite');
            const store = transaction.objectStore('images');
            const clearRequest = store.clear();

            clearRequest.onsuccess = () => {
                console.log('All images cleared from IndexedDB');
                this.clearImagePreview();
                const textInput = document.getElementById('restaurant');
                textInput.value = '';
            };

            clearRequest.onerror = (err) => {
                console.error('Error clearing images from IndexedDB:', err);
            };
        } else {
            console.error('Database is not initialized');
        }
    }

    clearImagePreview() {
        const imagePreview = document.getElementById('imagePreview');
        const imagePreviewText = document.getElementById('imagePreviewText');
        
        if (imagePreview) {
            imagePreview.src = '';
            imagePreview.style.display = 'none';
            imagePreviewContainer.style.display = 'block';
        }
        
        if (imagePreviewText) {
            imagePreviewText.style.display = 'none';
            imagePreviewContainer.style.display = 'none';
        }
    }

    render() {
        const full_container = document.createElement('div');
        const container = document.createElement('div');
        container.style.marginTop = '20px';
        container.id = 'main-container';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.alignItems = 'center'; // center horizontal
        container.style.justifyContent = 'center'; // center vertical
        container.style.textAlign = 'center'; // center align text in container

        const navBar = new NavBarComponent();
        full_container.appendChild(navBar.render());

        const headerBlock = document.createElement('div');
        headerBlock.id = 'header-block';

        // append an photo upload h1
        const header = document.createElement('h1');
        header.id = 'title'
        header.textContent = 'Photo Upload';
        headerBlock.appendChild(header);

        container.appendChild(headerBlock)

        // label for restaurant input
        const label = document.createElement('label');
        label.setAttribute('for', 'restaurant');
        label.textContent = 'Restaurant that image is from:';
        container.appendChild(label);

        // restaurant text input field
        const textInput = document.createElement('input');
        textInput.type = 'text';
        textInput.id = 'restaurant';
        container.appendChild(textInput);

        // hidden file input
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.id = 'fileInput';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';
        container.appendChild(fileInput);

        // instruction text
        const instructionParagraph = document.createElement('h4');
        instructionParagraph.textContent = 'Upload your photo by clicking the icon below!';
        container.appendChild(instructionParagraph);

        // upload icon
        const uploadIcon = document.createElement('img');
        uploadIcon.className = 'upload-icon';
        uploadIcon.id = 'upload-icon';
        uploadIcon.src = './components/photo_uploads/images/icons8-upload-90.png';
        uploadIcon.alt = 'upload icon';
        uploadIcon.style.cursor = 'pointer';
        uploadIcon.style.width = '90px';
        uploadIcon.style.height = '90px';

        //event listener
        uploadIcon.addEventListener('click', () => {
            console.log("icon clicked");
            fileInput.click();
        });

        let selectedFile = null;

        fileInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            const restaurantName = textInput.value.trim(); // Get text input value

            if (!restaurantName) {
                alert('Please enter the restaurant name before uploading an image.');
                return;
            }

            if (file) {
                const reader = new FileReader();
                selectedFile = file;
                reader.onload = (e) => {
                    imagePreview.src = e.target.result; // set img source
                    imagePreview.style.display = 'block'; // make img visible
    
                    imagePreviewText.style.display = 'block'; // make img preview text visible
                    imagePreviewContainer.style.display = 'block';

                    //save file to index db
                    if (this.db) {
                        const transaction = this.db.transaction('images', 'readwrite');
                        const store = transaction.objectStore('images');

                        const data = {
                            id: Date.now(),
                            image: e.target.result,
                            restaurant: restaurantName // Add the text input value
                        };

                        const addRequest = store.add(data);

                        addRequest.onsuccess = () => {
                            console.log('Image successfully saved to IndexedDB');
                        };

                        addRequest.onerror = (err) => {
                            console.error('Error saving image to IndexedDB:', err);
                        };
                    } else {
                        console.error('Database is not initialized');
                    }
                    
                };
                
                reader.readAsDataURL(file);
            } 
        });
        container.appendChild(uploadIcon);

        // image preview container
        const imagePreviewContainer = document.createElement('div');
        imagePreviewContainer.id = 'imagePreviewContainer';
        imagePreviewContainer.class = 'imagePreviewContainer'
        imagePreviewContainer.style.marginTop = '20px';
        imagePreviewContainer.style.marginBottom = '20px';
        imagePreviewContainer.style.display = 'none';

        // preview text
        const imagePreviewText = document.createElement('h3');
        imagePreviewText.id = 'imagePreviewText';
        imagePreviewText.style.display = 'none';
        imagePreviewText.textContent = 'Image Preview:';
        imagePreviewContainer.appendChild(imagePreviewText);

        // preview image element
        const imagePreview = document.createElement('img');
        imagePreview.id = 'imagePreview';
        imagePreview.alt = 'Image Preview';
        imagePreview.style.display = 'none';
        imagePreview.style.maxWidth = '300px';
        imagePreview.style.maxHeight = '300px';
        imagePreviewContainer.appendChild(imagePreview);

        // image preview container
        container.appendChild(imagePreviewContainer);

        // function to check if restaurant image already exists
        const checkRestaurantImage = async (restaurantName) => {
            try {
                const response = await fetch(`http://localhost:3000/image/${encodeURIComponent(restaurantName)}`);
        
                if (response.ok) {
                    // if restaurant image exists, load it in image preview
                    console.log('Restaurant image exists!');
                    const imageBlob = await response.blob();
                    const file = new File([imageBlob], `${restaurantName}.jpg`, { type: imageBlob.type });

                    // update and change the file input field
                    const dataTransfer = new DataTransfer();
                    dataTransfer.items.add(file);

                    fileInput.files = dataTransfer.files;

                    // trigger file input change event
                    fileInput.dispatchEvent(new Event('change'));

                    return true;
                } else {
                    return false;
                }
            } catch (error) {
                console.error('Error checking restaurant image:', error);
            }
        };

        // input listener for restaurant name text 
        textInput.addEventListener('input', async function () {
            const inputValue = this.value.trim();
            if (inputValue) {
                const exists = await checkRestaurantImage(inputValue.toLowerCase());
                console.log(exists ? 'Image found!' : 'Image not found!');
                // if restaurant image does not exist, make sure to clear image preview
                if (!exists){
                    if (imagePreview) {
                        imagePreview.src = '';
                        imagePreview.style.display = 'none';
                        imagePreviewContainer.style.display = 'block';
                    }
                    
                    if (imagePreviewText) {
                        imagePreviewText.style.display = 'none';
                        imagePreviewContainer.style.display = 'none';
                    }
                }
                
            }
        });        

        //icon container for clear, submit, and back
        const iconContainer = document.createElement('div');
        iconContainer.style.display = 'flex'; 
        iconContainer.style.gap = '10px'; //space between images

        // clear icon
        const clearIcon = document.createElement('img');
        clearIcon.className = 'clear-icon';
        clearIcon.id = 'clear-icon';
        clearIcon.src = './components/photo_uploads/images/cancel.png';
        clearIcon.alt = 'clear icon';
        clearIcon.style.cursor = 'pointer';
        clearIcon.style.width = '50px';
        clearIcon.style.height = '50px';

        //event listener
        clearIcon.addEventListener('click', () => {
            this.clearAllImages();
        });

        // submit icon
        const submitIcon = document.createElement('img');
        submitIcon.className = 'submit-icon';
        submitIcon.id = 'submit-icon';
        submitIcon.src = './components/photo_uploads/images/checked.png';
        submitIcon.alt = 'submit icon';
        submitIcon.style.cursor = 'pointer';
        submitIcon.style.width = '50px';
        submitIcon.style.height = '50px';

        // submit icon event listener
        submitIcon.addEventListener('click', async () => {
            console.log("submit icon clicked");
            if (imagePreview.style.display === 'none'){
                alert("Please upload an image and enter a restaurant before submitting.");
                return;
            }

            if (!selectedFile) {
                alert("No image selected. Please upload an image.");
                return;
            }
            const restaurantName = textInput.value.trim();
            if (!restaurantName) {
                alert("Please enter a restaurant name.");
                return;
            }

            const formData = new FormData();
            formData.append("image", selectedFile);
            formData.append("restaurant_name", restaurantName.toLowerCase());

            // send POST request to upload photo to sqlite
            try {
                const response = await fetch("http://localhost:3000/upload", {
                    method: "POST",
                    body: formData,
                });

                if (response.ok) {
                    const result = await response.json();
                    console.log("Upload successful:", result);
                } else {
                    console.error("Upload failed:", response.statusText);
                }
            } catch (error) {
                console.error("Error during upload:", error);
            }

            alert("Successfully saved your image!");
            this.clearAllImages();
            // return to rating page
            window.location.href = "./rating.html";
        });

        // back icon
        const backIcon = document.createElement('img');
        backIcon.className = 'back-icon';
        backIcon.id = 'back-icon';
        backIcon.src = './components/photo_uploads/images/previous.png';
        backIcon.alt = 'back icon';
        backIcon.style.cursor = 'pointer';
        backIcon.style.width = '50px';
        backIcon.style.height = '50px';

        //event listener
        backIcon.addEventListener('click', () => {
            console.log("back icon clicked");
            window.location.href = "./rating.html";
        });

        iconContainer.appendChild(clearIcon);
        iconContainer.appendChild(submitIcon);
        iconContainer.appendChild(backIcon);

        container.appendChild(iconContainer);


        // // add main container
        // document.body.appendChild(container);

        full_container.appendChild(container);

        return full_container;
    }

    
}

