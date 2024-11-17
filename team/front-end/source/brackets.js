//import { NavBarComponent } from './components/NavBarComponent/navbar.js';
import { RankingBracketSystem } from './components/ranking_bracket_system/ranking_bracket_system.js';


document.addEventListener('DOMContentLoaded', () => {
    // Create an instance of the RankingBracketSystem
    const rankingSystem = new RankingBracketSystem();

    // Append the rendered component to an existing element in your HTML
    // Make sure there is an element with an ID of "app" or replace it with an appropriate container ID
    const appContainer = document.getElementById('app');
    
    if (appContainer) {
        appContainer.appendChild(rankingSystem.render());
    } else {
        console.error('No container found with ID "app". Ensure your HTML has an element with this ID.');
    }
});