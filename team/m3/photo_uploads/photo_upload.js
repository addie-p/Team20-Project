// Function to render the necessary HTML structure
function render() {
    // Create a container for the content
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'center'; // Center items horizontally
    container.style.justifyContent = 'center'; // Center items vertically
    container.style.textAlign = 'center'; // Center-align text within the container

    // Create and append an <h1> element
    const header = document.createElement('h1');
    header.textContent = 'Photo Upload';
    container.appendChild(header);

       // Create and append the label for restaurant input
    const label = document.createElement('label');
    label.setAttribute('for', 'restaurant');
    label.textContent = 'Restaurant that image is from:';
    container.appendChild(label);

        // Create and append the text input
    const textInput = document.createElement('input');
    textInput.type = 'text';
    textInput.id = 'restaurant';
    container.appendChild(textInput);

    // Create and append a hidden file input
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.id = 'fileInput';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    container.appendChild(fileInput);

    // Create and append a paragraph for instructions
    const instructionParagraph = document.createElement('p');
    instructionParagraph.textContent = 'Upload your photo by clicking the icon below!';
    container.appendChild(instructionParagraph);

    // Create the image preview container
    const imagePreviewContainer = document.createElement('div');
    imagePreviewContainer.id = 'imagePreviewContainer';
    imagePreviewContainer.style.marginTop = '20px';
    imagePreviewContainer.style.marginBottom = '20px';

    // Create and append the preview text
    const imagePreviewText = document.createElement('p');
    imagePreviewText.id = 'imagePreviewText';
    imagePreviewText.style.display = 'none';
    imagePreviewText.textContent = 'Image Preview:';
    imagePreviewContainer.appendChild(imagePreviewText);

    // Create and append the preview image element
    const imagePreview = document.createElement('img');
    imagePreview.id = 'imagePreview';
    imagePreview.alt = 'Image Preview';
    imagePreview.style.display = 'none';
    imagePreview.style.maxWidth = '300px';
    imagePreview.style.maxHeight = '300px';
    imagePreviewContainer.appendChild(imagePreview);

    // Append the preview container to the main container
    container.appendChild(imagePreviewContainer);

    // Create and append the upload icon
    const uploadIcon = document.createElement('img');
    uploadIcon.className = 'upload-icon';
    uploadIcon.id = 'upload-icon';
    uploadIcon.src = './images/icons8-upload-90.png';
    uploadIcon.alt = 'upload icon';
    uploadIcon.style.cursor = 'pointer';
    uploadIcon.style.width = '90px';
    uploadIcon.style.height = '90px';
    container.appendChild(uploadIcon);

    // Append the main container to the body
    document.body.appendChild(container);
}

// Call the render function to create the HTML structure
render();

document.addEventListener('DOMContentLoaded', () => {
    // get the image and file input elements
    const uploadIcon = document.getElementById('upload-icon');
    const fileInput = document.getElementById('fileInput');
    const imagePreview = document.getElementById('imagePreview');
    const imagePreviewText = document.getElementById('imagePreviewText');

    // add an event listener to the image for clicks
    uploadIcon.addEventListener('click', () => {
        console.log("icon clicked");
        fileInput.click();
    });

    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                imagePreview.src = e.target.result; // set img source
                imagePreview.style.display = 'block'; // make img visible

                imagePreviewText.style.display = 'block'; // make img preview text visible

                //reduce size of upload icon
                uploadIcon.style.width = '50px';
                uploadIcon.style.height = '50px'; 
            };
            reader.readAsDataURL(file);
        }
    });
    
});

