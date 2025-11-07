import { createApp } from 'vue'
import App from './App.vue'
import '../src/assets/variables.css'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import colorWheel from './directives/colorWheel'
import sidebarResizer from './directives/sidebarResizer'
import wcagAdapter from './directives/wcagAdapter'
import { createGtag } from "vue-gtag";

library.add(fas, far, fab)

const app = createApp(App)

const gtag = createGtag({
  tagId:  "G-5F1ZH0FHK5"
})

app.use(gtag)

app.config.performance = true

app.component('font-awesome-icon', FontAwesomeIcon)

app.directive('colorWheel', colorWheel)
app.directive('sidebarResizer', sidebarResizer)
app.directive('wcagAdapter', wcagAdapter)
app.mount('#app')