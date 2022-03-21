<script lang="ts">
  import Paper, { Title, Subtitle, Content } from '@smui/paper';
  import type { ControlProperty, LayerProperty } from '../../config';

  export let layerProperty: LayerProperty;
  export let controlProperty: ControlProperty = undefined;
</script>

<Paper>
    <Title>{controlProperty.title || layerProperty.name}</Title>
        <Subtitle>{controlProperty.subtitle}</Subtitle>
    <Content>
        <slot />
    </Content>
</Paper>

<style>
</style>
