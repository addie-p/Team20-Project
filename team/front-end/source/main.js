
import { RankingBracketSystem } from './components/ranking_bracket_system/ranking_bracket_system.js';

document.addEventListener('DOMContentLoaded', () => {
   const initialRestaurants = [
       { name: 'Arigato', votes: 0 },
       { name: 'Antonios', votes: 0 },
       { name: 'Miss Saigon', votes: 0 },
       { name: 'Chipotle', votes: 0 },
       { name: 'McDonalds', votes: 0 },
       { name: 'House of Teriyaki', votes: 0 },
       { name: 'Bueno y Sano', votes: 0 },
       { name: 'The Works', votes: 0 }
   ];


   const app = document.getElementById('app');
   const rankingBracketSystem = new RankingBracketSystem(initialRestaurants);
   app.appendChild(rankingBracketSystem.render());
});

