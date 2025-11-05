// Add unique icons to sidebar group headings
const DEFAULT_COLLAPSED = ['Supported Networks', 'Advanced', 'Troubleshoot', 'Guides', 'Examples', 'Hosted Service', 'Tutorials', 'HyperFuel', 'Projects', 'Articles'];

const ICON_MAP = {
  'Introduction': '›',
  'Guides': '≡',
  'Examples': '◦',
  'Hosting': '↑',
  'Hosted Service': '↑',
  'Tutorials': '⌘',
  'Advanced': '⚙',
  'Troubleshoot': '⚠',
  'Supported Networks': '◉',
  'Other': '···',
  'Getting Started': '›',
  'Core Features': '■',
  'HyperFuel': '▸',
  'Projects': '□',
  'Articles': '≡'
};


(function() {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addSidebarIcons);
  } else {
    addSidebarIcons();
  }

  function addSidebarIcons() {
    // Find all sidebar group titles
    const groupTitles = document.querySelectorAll('.sidebar-group-header h5#sidebar-title');
    
    groupTitles.forEach(title => {
      const text = title.textContent.trim();
      const icon = ICON_MAP[text];
      
      if (icon && !title.dataset.iconAdded) {
        // Create icon span
        const iconSpan = document.createElement('span');
        iconSpan.textContent = icon + ' ';
        iconSpan.style.marginRight = '6px';
        iconSpan.style.fontSize = '13px';
        iconSpan.style.opacity = '1';
        iconSpan.style.fontWeight = '800';
        iconSpan.style.display = 'inline-block';
        iconSpan.style.width = '16px';
        
        // Insert icon before text
        title.insertBefore(iconSpan, title.firstChild);
        title.dataset.iconAdded = 'true';
      }
    });
  }

  // Re-run when navigation changes (for SPAs)
  const observer = new MutationObserver(() => {
    addSidebarIcons();
    setupCollapsibleGroups();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Setup collapsible groups functionality
  function setupCollapsibleGroups() {
    const groupHeaders = document.querySelectorAll('.sidebar-group-header');
    
    groupHeaders.forEach(header => {
      // Skip if already set up
      if (header.dataset.collapsibleSetup === 'true') {
        return;
      }
      
      const title = header.querySelector('h5#sidebar-title');
      if (!title) return;
      
      // Get group name - get text from non-span nodes (excluding icon)
      let groupName = '';
      const textNodes = Array.from(title.childNodes).filter(node => {
        if (node.nodeType === Node.TEXT_NODE) return true;
        if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'SPAN') return true;
        return false;
      });
      
      if (textNodes.length > 0) {
        groupName = textNodes.map(n => n.textContent).join('').trim();
      } else {
        // Fallback: use textContent and remove icon characters
        groupName = title.textContent.trim();
        groupName = groupName.replace(/^[›≡◦↑⌘⚙⚠◉···□]\s*/, '').trim();
      }
      
      // Ensure we have a clean group name
      groupName = groupName.replace(/^[›≡◦↑⌘⚙⚠◉···□]\s*/, '').trim();
      
      const isDefaultCollapsed = DEFAULT_COLLAPSED.includes(groupName);
      
      // Find the parent group container - walk up to find the direct child div of #navigation-items
      // This is much more reliable than looking for CSS classes like mt-6 or lg:mt-8
      const navigationItems = document.getElementById('navigation-items');
      let groupContainer = null;
      
      if (navigationItems) {
        // Walk up from the header to find which direct child div of #navigation-items contains it
        let current = header;
        while (current && current !== navigationItems) {
          // Check if current element is a direct child of #navigation-items
          if (current.parentElement === navigationItems) {
            groupContainer = current;
            break;
          }
          current = current.parentElement;
        }
      }
      
      // Fallback: if we couldn't find it via #navigation-items, use closest div that contains #sidebar-group
      if (!groupContainer) {
        let current = header.parentElement;
        let depth = 0;
        while (current && current !== document.body && depth < 10) {
          if (current.querySelector('#sidebar-group')) {
            groupContainer = current;
            break;
          }
          current = current.parentElement;
          depth++;
        }
      }
      
      // Final fallback: use the parent element
      if (!groupContainer || groupContainer === document.body) {
        groupContainer = header.parentElement;
      }
      
      // Set initial state: collapsed for Supported Networks, expanded for others
      if (isDefaultCollapsed) {
        groupContainer.classList.add('collapsed');
        header.classList.add('collapsed');
      } else {
        // Ensure it starts expanded
        groupContainer.classList.remove('collapsed');
        header.classList.remove('collapsed');
      }
      
      // Add click handler
      header.addEventListener('click', function(e) {
        // Don't toggle if clicking on a link
        if (e.target.closest('a')) {
          return;
        }
        
        e.preventDefault();
        e.stopPropagation();
        
        // Toggle collapsed state
        const isCollapsed = groupContainer.classList.contains('collapsed');
        
        if (isCollapsed) {
          groupContainer.classList.remove('collapsed');
          header.classList.remove('collapsed');
        } else {
          groupContainer.classList.add('collapsed');
          header.classList.add('collapsed');
        }
      });
      
      header.dataset.collapsibleSetup = 'true';
    });
  }

  // Initial setup - run after icons are added
  setTimeout(() => {
    setupCollapsibleGroups();
  }, 100);
  
  // Also run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupCollapsibleGroups);
  } else {
    setupCollapsibleGroups();
  }
})();


