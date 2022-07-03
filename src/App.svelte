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
      <div id="mobile-icon" class="mobile-icon" onclick="toggleMobileMenu()">
        <div class="middle-line">
        </div>
      </div>
      <ul id="navbar-list" class="navbar-list">
        <li class="active">
          <a href="/">Heat Story NYC</a>
        </li>
        <li>
          <div class="dropdown">
            <div class="label">
              <a href="project.html">Project</a>
              <i class="fa fa-caret-down"></i>
            </div>
            <div class="dropdown-content">
              <a href="project.html">Project Intro</a>
              <a href="project.html#what-is-uhi" onclick="turnOffMobileMenu()">What is UHI?</a>
              <a href="project.html#methods" onclick="turnOffMobileMenu()">Methods</a>
              <a href="project.html#next-steps" onclick="turnOffMobileMenu()">Next Steps</a>
            </div>
          </div>
        </li>
        <li>
          <div class="dropdown">
            <div class="label">
              <a href="team.html">Team</a>
              <i class="fa fa-caret-down"></i>
            </div>
            <div class="dropdown-content">
              <a href="team.html">Columbia University</a>
              <a href="team.html#sbu" onclick="turnOffMobileMenu()">South Bronx Unite</a>
              <a href="team.html#webdev" onclick="turnOffMobileMenu()">Web Developers</a>
            </div>
          </div>
        </li>
        <li>
          <div class="dropdown">
            <div class="label">
              <a class="unequal" href="unequal.html">Unequal Impacts<br>of Heat</a>
              <i class="fa fa-caret-down"></i>
            </div>
            <div class="dropdown-content">
              <a href="unequal.html#redlining">Redlining</a>
              <a href="unequal.html#health-disparities" onclick="turnOffMobileMenu()">Health Disparities</a>
              <a href="unequal.html#greenspace" onclick="turnOffMobileMenu()">Greenspace Access</a>
            </div>
          </div>
        </li>
        <li>
          <a href="resources.html">Resources</a>
        </li>
        <li>
          <a href="submit.html">Submit Your Story</a>
        </li>
        <li>
          <a href="media.html">Media Coverage</a>
        </li>
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
