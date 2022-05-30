<script lang="ts">
    import Accordion from '@smui-extra/accordion';
    import StoryPanel from './StoryPanel.svelte';
    import config, { MapState } from '../config';

</script>

<div id="story-container" class="accordion-container">
    <Accordion>
        {#each config.stories as story}
            <StoryPanel story={story} />
        {/each}
    </Accordion>
</div>
