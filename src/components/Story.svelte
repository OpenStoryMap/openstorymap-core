<script lang="ts">
    import { onMount } from 'svelte';
    import Accordion from '@smui-extra/accordion';
    import StoryPanel from './StoryPanel.svelte';
    import config, { MapState } from '../config';
    import initImagePopup from '../popup';

    onMount(async () => {
        initImageZoom();
    });

    function initImageZoom() {
        const storyImages = document.querySelectorAll('#story-container img');
        if (storyImages) {
            for (const storyImage of Array.from(storyImages)) {
                storyImage.addEventListener('click', (event: Event) => {
                    initImagePopup(event);
                });
            }
        }
    }

</script>

<div id="story-container" class="accordion-container">
    <Accordion>
        {#each config.stories as story}
            <StoryPanel story={story} />
        {/each}
    </Accordion>
</div>
