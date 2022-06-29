<script lang="ts">
    import LayoutGrid, {Cell} from '@smui/layout-grid';
    import Tab, { Label } from '@smui/tab';
    import TabBar from '@smui/tab-bar';

    import MapMain from './components/MapMain.svelte';
    import NavBar from './components/NavBar.svelte';
    import Story from './components/Story.svelte'
    import Controls from './components/Controls.svelte';

    let active = 'Story';

    /*
        This is the JS from all the other pages
    */
    function toggleMobileMenu() {
      document.getElementById('mobile-icon').classList.toggle('active');
      document.getElementById('navbar-list').classList.toggle('mobile');
    }
</script>

<link rel="stylesheet" href="/svelte-material-ui/bare.css" />

  <nav>
    <div class="inner">
        <div id="mobile-icon" class="mobile-icon" on:click={toggleMobileMenu}>
        <div class="middle-line">
        </div>
    </div> <ul id="navbar-list" class="navbar-list">
    <li class="active">
        <a href="/">Heat Story NYC</a> </li>
    <li>
        <div class="dropdown">
            <div class="label">
                Project
                <i class="fa fa-caret-down"></i>
            </div>
            <div class="dropdown-content">
                <a href="intro.html">Project Intro</a>
                <a href="what-is-uhei.html">What Is UHEI?</a>
                <a href="intro.html">Project Intro</a>
                <a href="intro.html">Project Intro</a>
            </div>
        </div>
    </li>
    <li>
        <a href="resources.html">Resources</a>
    </li>
    <li>
        <a href="team.html">Team</a> </li>
    <li>
        <a href="media.html">Media Coverage</a> </li>
    </ul>
    </div>
  </nav>

<main>

    <LayoutGrid>
        <Cell span={4}>
            <TabBar tabs={['Story', 'Controls']} let:tab bind:active>
                <!-- Note: the `tab` and `active` properties are required! -->
                <Tab {tab}>
                  <Label>{tab}</Label>
                </Tab>
              </TabBar>

            <div>
                {#if active === 'Story'}
                    <Story />
                {:else if active === 'Controls'}
                    <Controls />
                {/if}
            </div>
        </Cell>
        <Cell span={8}>
            <MapMain />
        </Cell>
    </LayoutGrid>
</main>

<style>
	main {
		text-align: center;
		max-width: 100%;
		margin: 0 auto;
        height: 90vh;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}

</style>
