import dva from 'dva'
import './index.css'
import 'antd/dist/antd.css'
import router from './router'

// 1. Initialize
const app = dva()

// 2. Plugins
// app.use({});

// 3. Model
app.model(require('./pages/homePage/model').default)
app.model(require('./pages/codeDetail/model').default)

// 4. Router
const menuList = []
app.router(router(menuList))

// 5. Start
app.start('#root')
