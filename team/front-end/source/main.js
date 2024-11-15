import { PhotoUploadsFeature } from './components/photo_uploads/photo_upload.js';

const app = document.getElementById('app');

const photo_upload = new PhotoUploadsFeature();
app.appendChild(photo_upload.render());