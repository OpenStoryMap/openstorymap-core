<script lang="ts">
    import LayoutGrid, {Cell} from '@smui/layout-grid';
    import MapMain from './components/MapMain.svelte';
    import NavBar from './components/NavBar.svelte';
    import Panel from './components/Panel.svelte'
</script>

<link rel="stylesheet" href="/svelte-material-ui/bare.css" />

<main>
    <NavBar />
    <LayoutGrid>
        <Cell span={3}>
            <Panel />
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

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
