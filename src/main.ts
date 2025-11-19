import { createApp } from 'vue'
import App from './App.vue'
import '../src/assets/styles/variables.css'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import colorWheel from './directives/colorWheel'
import sidebarResizer from './directives/sidebarResizer'
import fontSizeEditor from './directives/fontSizeEditor';
import wcagAdapter from './directives/wcagAdapter'
import { createGtag } from "vue-gtag";

const app = createApp(App)

const gtag = createGtag({
  tagId:  "G-5F1ZH0FHK5"
})

app.use(gtag)

app.config.performance = true

app.component('font-awesome-icon', FontAwesomeIcon)

app.directive('colorWheel', colorWheel)
app.directive('fontSizeEditor', fontSizeEditor)
app.directive('sidebarResizer', sidebarResizer)
app.directive('wcagAdapter', wcagAdapter)
app.mount('#app')