import { createApp } from 'vue';
import App from './App.vue';
import VuePannellum from 'vue-pannellum';
import { debounce } from 'lodash.debounce';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';





const app = createApp(App);

app.use(VuePannellum)
app.mount('#app')
