<script lang="ts">
    import { onDestroy } from 'svelte';
    import { mapStore } from '../stores.js';

    let map = undefined;

    const unsubscribe = mapStore.subscribe(m => {
        map = m;
        console.log(map);
    });

    onDestroy(unsubscribe);
</script>

<div>
    <h1>Hello!</h1>
</div>

<style>
	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}
</style>
