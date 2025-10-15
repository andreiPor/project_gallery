document.addEventListener('DOMContentLoaded', () => {
    // --- P0: DOM Elements & Constants ---
    const contentArea = document.getElementById('p0-content-area');
    const navLinksContainer = document.querySelector('.p0-nav-links');
    const hamburgerBtn = document.querySelector('.p0-hamburger-menu');
    
    // Component map for AJAX loading
    const componentMap = {
        'home': 'components/overview.html',
        'profile-card': 'components/profile_card.html',
        'cosmic-explorer': 'components/cosmic_explorer.html',
        'travel-guide': 'components/travel_guide.html',
        'passenger-counter': 'components/passenger_counter.html',
    };

    // --- P0: Hamburger Menu Logic ---
    hamburgerBtn.addEventListener('click', () => {
        navLinksContainer.classList.toggle('open');
    });
    
    // --- P0: SPA Navigation (AJAX/Fetch) Logic ---
    async function loadComponent(projectKey) {
        navLinksContainer.classList.remove('open');
        
        // Update active link state
        document.querySelectorAll('.p0-nav-links a').forEach(a => a.classList.remove('active'));
        const activeLink = document.querySelector(`a[data-project="${projectKey}"]`);
        if (activeLink) activeLink.classList.add('active');

        contentArea.innerHTML = '<div class="p0-loading">Loading ' + projectKey + '...</div>';

        try {
            const response = await fetch(componentMap[projectKey]);
            if (!response.ok) throw new Error('Network response was not ok');
            
            const html = await response.text();
            contentArea.innerHTML = html;

            // Initialize specific JS logic if necessary
            if (projectKey === 'passenger-counter') {
                window.initializeP4Counter();
            }
        } catch (error) {
            console.error('Error loading component:', error);
            contentArea.innerHTML = '<div class="p0-loading" style="color: red;">Failed to load project: ' + projectKey + '</div>';
        }
    }

    // Event listener for navigation links
    document.querySelector('.p0-main-header').addEventListener('click', (event) => {
        const target = event.target.closest('a[data-project]');
        if (target) {
            event.preventDefault();
            loadComponent(target.getAttribute('data-project'));
        }
    });

    // --- P2: Cosmic Explorer Logic ---
    window.showExplorer = function() {
      const mainContainer = document.getElementById('p2-main-container'); 
      const exploreSection = document.getElementById('p2-explore-section'); 
      const fadeTextElements = exploreSection ? exploreSection.querySelectorAll('.p2-fade-text') : null;

      if (mainContainer && exploreSection && fadeTextElements && fadeTextElements.length > 0) {
          
          // 1. Hide main stars text
          mainContainer.classList.add('hide-stars');

          // 2. Show overlay
          exploreSection.classList.add('show');
          
          // 3. Fade in welcome text
          setTimeout(() => { fadeTextElements.forEach(el => el.classList.add('visible')); }, 100); 

          // 4. Reverse animation after 5 seconds
          setTimeout(() => {
              // Fade out welcome text
              fadeTextElements.forEach(el => el.classList.remove('visible'));
              
              // Hide overlay
              exploreSection.classList.remove('show');
              
              // Show main stars text (delayed)
              setTimeout(() => {
                 mainContainer.classList.remove('hide-stars');
              }, 500); 

          }, 5000); 
      }
    }

    // --- P4: Passenger Counter Logic ---
    let counter = 0; 
    
    window.p4_increment = function() {
        const counterEl = document.getElementById("p4-counter-element");
        if (counterEl) {
            counter += 1;
            counterEl.innerText = "🚶‍♂️" + counter;
        }
    }

    window.p4_saveData = function() {
        if (counter > 0) {
            alert(`Saved ${counter} people to the database! Counter reset.`);
            counter = 0; 
            
            const counterEl = document.getElementById("p4-counter-element");
            if (counterEl) {
                 counterEl.innerText = "🚶‍♂️0";
            }
        } else {
            alert("Counter is zero. Nothing to save.");
        }
    }
    
    window.initializeP4Counter = function() {
        // Reset counter state on component load
        counter = 0; 
        const counterEl = document.getElementById("p4-counter-element");
        if (counterEl) {
             counterEl.innerText = "🚶‍♂️0";
        }
    }

    // Initial page load
    loadComponent('home');
});