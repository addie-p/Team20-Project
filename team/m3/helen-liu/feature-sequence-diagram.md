## Feature Description
The photo uploads feature allows users to upload and save photos to a restaurant that they've visited and ready to rate. To upload or submit any images, the user must first input the restaurant they are saving the image to. Clicking on the upload icon will open the user's file library for them to choose photo files (this file input only accepts images). There are also submit, clear, and back buttons that will confirm the image saved, clear the images in indexDB and reset the interface, and go back to the rating system page, respectively.

## Sequence Diagram
``` mermaid
photo upload sequence;
    rating system page's upload icon --> photo upload page;
    photo upload page --> restaurant name field;
    restaurant name field --> indexDB;
    photo upload page --> upload icon;
    photo upload page --> clear icon;
    photo upload page --> submit icon;
    photo upload page --> back icon;
    upload icon --> file access to user directory;
    image from user directory --> image preview;
    image from user directory --> indexDB;
    back icon --> rating system page;
    clear icon --> indexDB;
    submit icon --> image preview;
```
