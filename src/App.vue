<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import ComponentTemplate from './components/ComponentTemplate.vue';
import * as d3 from 'd3';

function doSomethingWithCurve(curveArray) {}

</script>

<template>
  <ComponentTemplate :d3 = "d3" @curveUpdated = "doSomethingWithCurve"/>
</template>
