import Stats from '../../lib/Stats.js/stats.module.js';
import global from '../global.js';

// Ajoute le module de stats
const stats = new Stats();
stats.showPanel(0);
//global.parent.appendChild(stats.dom);

export default stats;