<script>
    import { onMount } from "svelte";
  
    // Show mobile icon and display menu
    let showMobileMenu = false;
  
    // List of navigation items
    const navItems = [
      { label: "2021 NYC HeatWatch Results", href: "/" },
      { label: "About", href: "about.html" },
      { label: "Resources", href: "resources.html" },
      { label: "Media Coverage", href: "media.html" },
    ];
  
    // Mobile menu click event handler
    const handleMobileIconClick = () => (showMobileMenu = !showMobileMenu);
  
    // Media match query handler
    const mediaQueryHandler = e => {
      // Reset mobile state
      if (!e.matches) {
        showMobileMenu = false;
      }
    };
  
    // Attach media query listener on mount hook
    onMount(() => {
      const mediaListener = window.matchMedia("(max-width: 767px)");
  
      mediaListener.addListener(mediaQueryHandler);
    });
  </script>
  
  <nav>
    <div class="inner">
      <div on:click={handleMobileIconClick} class={`mobile-icon${showMobileMenu ? ' active' : ''}`}>
        <div class="middle-line"></div>
      </div>
      <ul class={`navbar-list${showMobileMenu ? ' mobile' : ''}`}>
        {#each navItems as item}
          <li>
            <a href={item.href}>{item.label}</a>
          </li>
        {/each}
      </ul>
    </div>
  </nav>
