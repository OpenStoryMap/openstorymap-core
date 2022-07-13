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
    <span class="header">
    {#if controlProperty.tooltip != null}
    <Wrapper rich>
        <span role="button" tabindex="0">
            <Title>{controlProperty.title || layerProperty.name}</Title>
                <Subtitle>
                    {controlProperty.subtitle ?? ''}
                    <slot name="values"/>
                </Subtitle>
            <span class="w3-badge hand">click for info</span>
        </span>

        <Tooltip persistent style="z-index: 10000" xPos="center">
            <TooltipTitle style="color: black"> {controlProperty.title || layerProperty.name} Info </TooltipTitle>
            <TooltipContent style="color: black"> {controlProperty.tooltip} </TooltipContent>
        </Tooltip>
    </Wrapper>
    {:else}
        <Title>{controlProperty.title || layerProperty.name}</Title>
        <Subtitle>{controlProperty.subtitle ?? ''}</Subtitle>
        <slot name="values"/>
    {/if}
    </span>
    <Content>
        <slot name="control"/>
    </Content>
</Paper>


<style>
    header {
		padding: 0 0 0.2em 0;
		margin: 0 0 1em 0;
		border-bottom: 1px solid #ff3e00
	}
</style>
