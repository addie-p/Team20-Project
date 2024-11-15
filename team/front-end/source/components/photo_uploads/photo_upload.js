export class PhotoUploadsFeature {

    constructor() {
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
        }.bind(this);

        request.onerror = function(event) {
            console.error('Database failed to open', event.target.error);
        };
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

    render() {
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.alignItems = 'center'; // center horizontal
        container.style.justifyContent = 'center'; // center vertical
        container.style.textAlign = 'center'; // center align text in container

        // append an photo upload h1
        const header = document.createElement('h1');
        header.textContent = 'Photo Upload';
        container.appendChild(header);

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
        const instructionParagraph = document.createElement('p');
        instructionParagraph.textContent = 'Upload your photo by clicking the icon below!';
        container.appendChild(instructionParagraph);

        // image preview container
        const imagePreviewContainer = document.createElement('div');
        imagePreviewContainer.id = 'imagePreviewContainer';
        imagePreviewContainer.style.marginTop = '20px';
        imagePreviewContainer.style.marginBottom = '20px';

        // preview text
        const imagePreviewText = document.createElement('p');
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

        fileInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    imagePreview.src = e.target.result; // set img source
                    imagePreview.style.display = 'block'; // make img visible
    
                    imagePreviewText.style.display = 'block'; // make img preview text visible
    
                    //reduce size of upload icon
                    uploadIcon.style.width = '50px';
                    uploadIcon.style.height = '50px'; 

                    //save file to index db
                    if (this.db) {
                        const transaction = this.db.transaction('images', 'readwrite');
                        const store = transaction.objectStore('images');

                        const addRequest = store.add({ id: Date.now(), image: e.target.result });

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


        // // add main container
        // document.body.appendChild(container);

        return container;
    }

    
}

