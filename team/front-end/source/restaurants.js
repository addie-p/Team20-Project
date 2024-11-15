import { NavBarComponent } from './components/NavBarComponent/navbar.js';

const app = document.getElementById('app');

const navBar = new NavBarComponent();
app.appendChild(navBar.render());