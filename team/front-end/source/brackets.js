//import { NavBarComponent } from './components/NavBarComponent/navbar.js';
import { RankingBracketSystem } from './components/ranking_bracket_system/ranking_bracket_system.js';


document.addEventListener('DOMContentLoaded', () => {
    // instance of  RankingBracketSystem
    const rankingSystem = new RankingBracketSystem();
    const appContainer = document.getElementById('app');
    
    if (appContainer) {
        appContainer.appendChild(rankingSystem.render());
    } else {
        console.error('No container found with ID "app"');
    }
});