## Feature Description
The photo uploads feature allows users to upload and save photos to a restaurant that they've visited and ready to rate. To upload or submit any images, the user must first input the restaurant they are saving the image to. Clicking on the upload icon will open the user's file library for them to choose photo files (this file input only accepts images). There are also submit, clear, and back buttons that will confirm the image saved, clear the images in indexDB and reset the interface, and go back to the rating system page, respectively.

## Sequence Diagram
``` mermaid
flowchart TD
    A[rating system page] -->|redirect| B{photo upload page}
    B -->|component| D[restaurant name field]
    B -->|component| E[upload icon]
    B -->|component| F[submit icon]
    B -->|component| G[clear icon]
    B -->|component| H[back icon]
    B -->|component| I[image preview]
    E -->|access and opens| I[user files]
    I -->|choose image| J[image preview]
    I -->|add image to| K[indexDB]
    H --> A
    G --> |clears|K
    G --> |clears|H
    F --> |clears|H
```
