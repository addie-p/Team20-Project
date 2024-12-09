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

        // Logo Section
        const logo = document.createElement('div');
        logo.classList.add('logo');
        const logoText = document.createElement('h2');
        logoText.textContent = 'Plateful';
        logo.appendChild(logoText);

        // Navigation Links
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

        const logoutItem = document.createElement('li');
        const logoutLink = document.createElement('a');
        logoutLink.id = "logout-link";
        logoutLink.href = "#"; 
        logoutLink.textContent = "Logout";
        logoutLink.addEventListener("click", this.handleLogout);
        logoutItem.appendChild(logoutLink);
        navLinks.appendChild(logoutItem);

        this.#container.appendChild(logo);
        this.#container.appendChild(navLinks);

        return this.#container;
    }

    async handleLogout(event) {
        event.preventDefault();  
        try {
            const response = await fetch("http://localhost:3000/auth/logout", {
                method: "GET",
                credentials: "include",
            });

            if (response.ok) {
                alert("Logged out successfully!");
                window.location.href = "login.html";  
            } else {
                alert("Failed to log out.");
            }
        } catch (error) {
            console.error("Error during logout:", error);
            alert("An error occurred during logout.");
        }
    }
}
