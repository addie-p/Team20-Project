export class NavBarComponent {
    #container = null;

    constructor() {
        this.loadCSS();
    }

    loadCSS() {
        const styleSheet = document.createElement("link");
        styleSheet.rel = "stylesheet";
        styleSheet.href = "components/NavBarComponent/navbar.css";
        document.head.appendChild(styleSheet);
    }

    render() {
        this.#container = document.createElement('nav');
        this.#container.classList.add('navbar');

        const logo = document.createElement('div');
        logo.classList.add('logo');
        const logoText = document.createElement('h2');
        logoText.textContent = 'Plateful';
        logo.appendChild(logoText);

        const navLinks = document.createElement('ul');
        navLinks.classList.add('nav-links');

        const links = [
            { text: 'Home', url: './index.html' },
            { text: 'Your Restaurants', url: './dashboard.html' },
            { text: 'Brackets', url: './brackets.html' }
        ];
        
        links.forEach(linkInfo => {
            const listItem = document.createElement('li');
            const link = document.createElement('a');
        
            link.href = linkInfo.url;
            link.textContent = linkInfo.text;
        
            listItem.appendChild(link);
            navLinks.appendChild(listItem);
        });

        this.#container.appendChild(logo);
        this.#container.appendChild(navLinks);

        return this.#container;
    }
}