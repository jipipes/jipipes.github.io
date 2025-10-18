const ATTR_DISPLAY = 'sidebar-display';
const $sidebar = document.getElementById('sidebar');
const $trigger = document.getElementById('sidebar-trigger');
const $mask = document.getElementById('mask');

class SidebarUtil {
  static #isExpanded = false;

  static toggle() {
    this.#isExpanded = !this.#isExpanded;
    document.body.toggleAttribute(ATTR_DISPLAY, this.#isExpanded);
    $sidebar.classList.toggle('z-2', this.#isExpanded);
    $mask.classList.toggle('d-none', !this.#isExpanded);
  }
}

export function initSidebar() {
  if ($trigger) {
    // Click event
    $trigger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      SidebarUtil.toggle();
    });
    
    // Touch event for mobile
    $trigger.addEventListener('touchstart', (e) => {
      e.preventDefault();
      e.stopPropagation();
      SidebarUtil.toggle();
    });
  }
  
  if ($mask) {
    // Click event
    $mask.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      SidebarUtil.toggle();
    });
    
    // Touch event for mobile
    $mask.addEventListener('touchstart', (e) => {
      e.preventDefault();
      e.stopPropagation();
      SidebarUtil.toggle();
    });
  }
}
