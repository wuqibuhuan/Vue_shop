import Vue from 'vue'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import {
  Form,
  FormItem
} from 'element-ui'
import {
  Input
} from 'element-ui'
import {
  Button
} from 'element-ui'
import {
  Container
} from 'element-ui'
import {
  Header
} from 'element-ui'
import {
  Aside
} from 'element-ui'
import {
  Main
} from 'element-ui'
import {
  Message
} from 'element-ui'
import {
  Menu,
  Submenu,
  MenuItemGroup,
  MenuItem,
  Dialog,
  MessageBox
} from 'element-ui'

Vue.use(Element)
Vue.use(FormItem)
Vue.use(Form)
Vue.use(Input)
Vue.use(Button)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Dialog)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm