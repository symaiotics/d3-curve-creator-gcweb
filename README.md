# @Symaiotics D3 Curve Creator
This library brings together a featured interface for creating a variety of bounded curve diagrams using the powerful D3.js library.

## Getting Started

Install this into your Vue 3 project.
`npm i @symaiotics/d3-curve-creator-gcweb`

And then register the component within your page or component in Vue.
It is important to bring in the style.css for this component as well.

```
<script setup>

//Import the D3 library in the parent component and pass it to the child
//By default, the child component does not call d3, but loads it as a prop
import * as d3 from 'd3';

//Import the component and the style sheet used by that component to get its custom styling
import D3CC from '@symaiotics/d3-curve-creator-gcweb'
import '@symaiotics/d3-curve-creator-gcweb/dist/style.css';

//Handle the curveUpdated event
function doSomethingWithCurve(curveArray) {}

</script>

<template>
  <D3CC :d3 = "d3" 
        @curveUpdated = "doSomethingWithCurve"
        title="Main Title" 
        description = "Description Title" />
</template>
```

## Emits
Data is emitted from this component back to the parent using the 'curveUpdated' event.

## D3.js
This library uses the latest version of D3 and implements a variety of add, delete, link, pin and export tools to make graph creation fast and easy.

## Styling
This library uses the Canada.ca GCWeb Theme (a customized instance of Bootstrap 3)
https://wet-boew.github.io/GCWeb/index-en.html

