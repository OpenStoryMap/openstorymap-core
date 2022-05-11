<script lang="ts">
  import Paper, { Title, Subtitle, Content } from '@smui/paper';
  import Badge from '@smui-extra/badge';
  import type { ControlProperty, LayerProperty } from '../../config';

  import Tooltip, {
    Wrapper,
    Content as TooltipContent,
    Title as TooltipTitle,
    Link,
    RichActions,
  } from '@smui/tooltip';

  export let layerProperty: LayerProperty;
  export let controlProperty: ControlProperty;
</script>

<Paper>
    {#if controlProperty.tooltip != null}
    <Wrapper rich>
        <span role="button" tabindex="0">
            <Title>{controlProperty.title || layerProperty.name}</Title>
            <Subtitle>{controlProperty.subtitle ?? ''}</Subtitle>
            <span class="w3-badge">click for info</span>
        </span>

        <Tooltip persistent style="z-index: 10000" xPos="center">
            <TooltipTitle style="color: black"> {controlProperty.title || layerProperty.name} Info </TooltipTitle>
            <TooltipContent style="color: black"> {controlProperty.tooltip} </TooltipContent>
        </Tooltip>
    </Wrapper>
    {:else}
        <Title>{controlProperty.title || layerProperty.name}</Title>
        <Subtitle>{controlProperty.subtitle ?? ''}</Subtitle>
    {/if}
    <Content>
        <slot />
    </Content>
</Paper>

<style>
</style>
