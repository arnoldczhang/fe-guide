import { createApp } from 'vue';
import './style.less';
import router from './router';
import App from './App.vue';
import { registryComponents } from './install-component';

const app = createApp(App);
app.use(router);
registryComponents(app);
app.mount('#app');
