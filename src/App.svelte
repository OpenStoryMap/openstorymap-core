<script lang="ts">
    import LayoutGrid, {Cell} from '@smui/layout-grid';
    import MapMain from './components/MapMain.svelte';
    import NavBar from './components/NavBar.svelte';
    import Story from './components/Story.svelte'
</script>

<link rel="stylesheet" href="/svelte-material-ui/bare.css" />

<main>
    <NavBar />
    <LayoutGrid>
        <Cell span={3}>
            <Story />
        </Cell>
        <Cell span={9}>
            <MapMain />
        </Cell>
    </LayoutGrid>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
        height: 90vh;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
