<script lang="ts">
	export let name: string;
    import LayoutGrid, {Cell} from '@smui/layout-grid';
    import MapMain from './components/MapMain.svelte';
    import NavBar from './components/NavBar.svelte';
</script>

<link rel="stylesheet" href="/svelte-material-ui/bare.css" />

<main>
    <NavBar />
    <LayoutGrid>
        <Cell span={3}>
            <h1>Hello {name}!</h1>
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
