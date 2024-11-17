#  Log for Helen Liu

## October 21

### helen-liu.md
- created helen-liu.md to keep records of logs
- link: https://github.com/addie-p/Team20-Project/commit/b6ece3ae71822da7ed40c70e5207d1a820f71592
### data.md
- updated data.md to detail types of data and their descriptions, attributes, and sources, as well as data relationships and data sources for the project
- link: https://github.com/addie-p/Team20-Project/commit/5c76558a8011d4bd01e950a72adcc50cf04be27b
### quality control
- reviewed problem.md and features.md to make sure they are up to quality standard
- link: https://github.com/addie-p/Team20-Project/commit/47d35da43a5a74b652dce103f3e0e9e9b176edd6
### updated helen-liu.md
- updated helen-liu.md with progress and links
- link: https://github.com/addie-p/Team20-Project/commit/7c7f28722fa19025745962b7c642d7e88f9e4c7a
### quality control ui-diagrams.md and users.md
- proofread and reformatted ui-diagrams.md and users.md with minor fixes for uniformity and accuracy
- link: https://github.com/addie-p/Team20-Project/commit/bdd7673fb68a0f22c977954457310be919083468

## Friday, November 1

- directory and js, html, css files for photo upload feature page
- link: https://github.com/addie-p/Team20-Project/commit/10c1a91a6893d21b9c9763a74052832cb57b82a0

## Sunday, November 10

### committed files for photo upload feature
- add image files for upload and create basic layout of title, restaurant input, and text input for restaurant name
- link: https://github.com/addie-p/Team20-Project/commit/768ae90caf7aa796d11521afe43ae8999e8e3761

### make upload icon access file library for photos 
- add event listener for upload icon to make it click and add styling for pointer to be cursor
- add file reader so pressing icon will open user's files and accept only images
- link: https://github.com/addie-p/Team20-Project/commit/26eb1103bdce6d090b0ca0470cb6509373d3d2f8

## Thursday, November 14

### change architcture for photo upload feature
- remove html file and add render function in photo_upload.js to make compatibly with main architecture
- use render function in main.js
- remove stale directory with old photo_upload folder
- link: https://github.com/addie-p/Team20-Project/commit/0108da4129ebe8f200e75f993cc852a859b77002

## Friday, November 15

### save photo file + restaurant in indexDB
- make sure that the photo file can be saved within indexDB with the restaurant name
- link: https://github.com/addie-p/Team20-Project/commit/c63d4b042adb1c8e2c7785086ae36bf5d76298f9

### make photo file + restaurant persistent/load on refresh
- if a photo file in indexDB exists, make sure to load it on refresh so data is persistent
- make sure image preview container displays accordingly
- link: https://github.com/addie-p/Team20-Project/commit/1930d5b2826ba07986cec5c14cb98f71f9fbb29e

### add back, clear, and submit buttons to photo upload page
- add icons for the 3 buttons next to each other with a container and import its image files
- link: https://github.com/addie-p/Team20-Project/commit/5a08a227f9df0ae8eff8daaaa839696794302b74

### make clear button clear indexDB
- create clear from indexDB function and have clicking clear button as event listener to call the clear function
- adjust image preview container display accordingly
- link: https://github.com/addie-p/Team20-Project/commit/04483635a941b45d6e61d488f66e840854d45326

### add function to submit and make back button go back to rating system page
- add functionality for submit to send alert to user confirming saving file in indexDB or require restaurant or image input
- link: https://github.com/addie-p/Team20-Project/commit/4b91a07aca1bad51ad1f5a6691a215848b78393a
- have clicking back button to redirect back to rating system page after branch with saved restaurants dashboard, rating system page, and photo upload page
- link: https://github.com/addie-p/Team20-Project/commit/aab502158fde8ba9a07d1fbfd64d39e52f4e1857

## Saturday, November 16

### create and add m3 syntax
- make m3 directory for helen-liu and add feature sequence diagram for photo uploads with description of feature and mermaid flow chart syntax
- link: https://github.com/addie-p/Team20-Project/commit/6a7b171d2888e25299ea98224a070a9f9a317d1d

### update helen-liu.md
- add progress to helen-liu.md report
- link: https://github.com/addie-p/Team20-Project/commit/571bb1213fa2b3a92430fc68c84928379c7c9504

### update data.md
- go over data structures used in front end and update data.md as per directions of m3
- link: https://github.com/addie-p/Team20-Project/commit/7be715ae43b69dacb33e3a17a8abf8417b8dc87a

## Sunday, November 17

### add navbar to photo upload page
- render navbar in photo upload page with a fuller container for user accessibility
- link: https://github.com/addie-p/Team20-Project/commit/4cfee929caccb401cde49cb685f8e91801d15579

### add navbar to rating system page
- render navbar in rating system page with a fuller container and modify css for the navbar to be width of full page while everything else on the page remains the same
- link: https://github.com/addie-p/Team20-Project/commit/33f61032002d15f0e275a431464b14371b74f270

### add navbar to ranking bracket page
- render navbar in rating system page with a fuller container and modify css for the navbar to be width of full page while everything else on the page remains the same
- link: https://github.com/addie-p/Team20-Project/commit/13f86144946d7347ea9086491a6b31b8f77712c0