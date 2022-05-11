<script lang="ts">
    import TopAppBar, { Row, Section, Title } from '@smui/top-app-bar';
    import Dialog, { Title as DialogTitle, Content, Actions } from '@smui/dialog';
    import Button, { Label } from '@smui/button';

    let open = false;

</script>

<TopAppBar
      variant="static"
      color="secondary"
>
    <Row>
    <Section>
        <Title>OpenStoryMap</Title>
    </Section>
    <Section>
        <Button on:click={() => (open = true)}>About</Button>
    </Section>
    <Section align="end" toolbar>
        <img src="images/logo.png" style="width: 64px; height: 64px" at="A logo" />
    </Section>
    </Row>
</TopAppBar>

<Dialog
  bind:open
  style="z-index: 10000"
  aria-labelledby="large-scroll-title"
  aria-describedby="large-scroll-content"
  surface$style="width: 850px; max-width: calc(100vw - 32px);"
>
    <DialogTitle id="large-scroll-title">About The Project</DialogTitle>
    <Content id="simple-content">
<span style="text-align: left">
<b>Project Intro</b><br />
<p>
“Addressing the Urban Heat Island Effect through an Equity Lens: A Community Science Project'' is a campaign that focuses on the intersections of extreme heat, health, and social inequities. The goal of this project is to make heat and its disproportionate impacts visible through mapping how impacts of extreme heat are compounded by various axes of inequities, including systemic racism, poverty, health disparities, and more.<br />
</p>
<br />
<p>
The project was part of a multi-year nationwide campaign, part of the NIHHIS (National Integrated Heat Health Information System) jointly developed by NOAA (National Oceanic and Atmospheric Administration) and the CDC (Centers for Disease Control and Prevention), and partnered with CAPA Strategies. New York and New Jersey were part of the 2021 campaign, which included 12 cities. <br />
</p>
<br />
<i>How does this differ from existing data?</i><br />
<ul>
    <li>This is much more granular, so more conducive to designing targeted local mitigation efforts</li>
    <li>Previous models have been based on satellite data, which record the temperature of the ground itself, rather than radiant heat</li>
    <li>But the mapping campaign generates air temperatures close to the ground, which is the heat people actually feel</li>
    <li>High-res outputs (1m, 10m) – so a much finer spatial resolution as most public satellite products related to land surface temperature and air temperature are at scales that ranging from 30 meters to 1 kilometer</li>
    <li>Collected in real time across several different locations; both temp and humidity is collected as well as geographic location</li>
    <li>Most air temp data is collected in one stationary location</li>
</ul>
<br />
<i>Why is an equity-oriented approach to heat so important?</i><br />
<p>
As anthropogenic climate change worsens, extreme heat is a recurring issue that is increasing in frequency and intensity. Extreme heat can negatively impact people’s health, ranging from triggering temporary acute conditions to exacerbating existing illnesses and causing death. In the United States, more people each year from heat than from all other weather-related disasters combined, demonstrating the significant morbidity and mortality burden extreme heat carries.<br />
</p>
<br />
Below demonstrates how images will look.
<img src="images/heatmap-graph.jpg" height="500" width="500">
<br />
<i>Why urban heat specifically? What is the urban heat island effect?</i><br />
<p>
The urban heat island effect is a phenomenon in which cities maintain higher temperatures than their rural surroundings. These higher temperatures are due to reasons including:
</p>
<ul>
    <li>Higher absorption and trapping of heat by building materials like asphalt, concrete, brick, dark roofs, and pavement</li>
    <li>Tall buildings densely packed together</li>
    <li>High traffic</li>
    <li>Carbon-emitting infrastructure</li>
    <li>High total energy usage</li>
</ul>
<p>
This effect does not only occur in the day but also at night – when our bodies need to cool down to recuperate from a hot day, the difference can be even starker: with urban centers ranging as much as 22 degrees warmer than rural areas nearby!
</p>
<br />
<p>
Global temperatures and urban populations continue to rise, which makes this an ever-urgent problem. A study involving 13,000 urban areas found that city dwellers’ exposure to life-threatening heat and humidity has increased threefold since the 1980s.
</p>
<br />
</span>
      </Content>
  <Actions>
    <Button on:click={() => (open = false)}>
      <Label>Close</Label>
    </Button>
  </Actions>
</Dialog>

