import { SaveSystem } from './core/save-system'
import { sim } from './core/sim'
import { init, refreshAll } from './ui/main'

const app = document.getElementById('app')!
init(app)

const loaded = SaveSystem.loadGame()
if (loaded) {
  refreshAll()
  sim.restoreCombatState()
} else {
  sim.startCombat()
  refreshAll()
}

// Auto-save on tab close / navigate away
window.addEventListener('beforeunload', () => SaveSystem.saveGame())
