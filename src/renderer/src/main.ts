import 'ant-design-vue/dist/antd.css'
import './assets/main.less'

import { createApp } from 'vue'
import App from './App.vue'
import Antd from 'ant-design-vue'
import './utils/extension.js'

createApp(App).use(Antd).mount('#app')
