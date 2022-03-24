<script lang="ts">
    import LayoutGrid, {Cell} from '@smui/layout-grid';
    import Tab, { Label } from '@smui/tab';
    import TabBar from '@smui/tab-bar';

    import MapMain from './components/MapMain.svelte';
    import NavBar from './components/NavBar.svelte';
    import Story from './components/Story.svelte'
    import Controls from './components/Controls.svelte';

    let active = 'Story';
</script>

<link rel="stylesheet" href="/svelte-material-ui/bare.css" />

<main>
    <NavBar />
    <LayoutGrid>
        <Cell span={3}>
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
        <Cell span={9}>
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
