<script lang="ts">
  import Control from './Control.svelte';
  import type { ControlProperty, LayerProperty } from '../../config';

  const controlProperty = {
    id: '_placeholder',
    name: 'Add Layers For Custom Controls',
    subtitle: ''
  }

  const layerProperty = {
    name: 'Add Layers For Custom Controls',
    url: '',
    type: ''
  }
</script>

<Control controlProperty={controlProperty} layerProperty={layerProperty} >
    <span slot="values"> </span>
    <span slot="control">
        <div>
            <p>
                Custom controls will be available when selecting custom layers with controls.
                Not all layers will have custom controls.
            </p>

            <p>
            Go to Add Layers and choose some layers to add to the map.
            </p>

            <p>
            Layers will also be added with stories. Check the stories tab out for more details.
            </p>
        </div>
    </span>
</Control>
