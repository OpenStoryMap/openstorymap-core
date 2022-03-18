<script lang="ts">
  import Paper, { Title, Subtitle, Content } from '@smui/paper';
  import type { ControlProperty } from '../../config';

  export let idLayer: string;
  export let nameLayer: string;
  export let controlProperty: ControlProperty = undefined;
</script>

<Paper>
    <Title>{controlProperty.title || nameLayer}</Title>
        <Subtitle>{controlProperty.subtitle}</Subtitle>
    <Content>
        <slot />
    </Content>
</Paper>

<style>
</style>
