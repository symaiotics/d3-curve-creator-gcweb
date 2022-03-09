import { createApp } from 'vue'
import App from './App.vue'
import "./styles/css/theme.scss"

// import * as d3 from 'd3';
// const d3 = await import("d3");

const app = createApp(App)
// app.use(d3)
app.mount('#app')
// app.use(d3);