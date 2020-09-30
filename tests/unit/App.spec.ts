import { shallowMount } from '@vue/test-utils'
import App from '@/App.vue'
import MenuTop from '@/components/menu-top/MenuTop.vue'
import MenuLeft from '@/components/menu-left/MenuLeft.vue'
import Grapher from '@/components/grapher/Grapher.vue'
import MenuRight from '@/components/menu-right/MenuRight.vue'
import MenuBottom from '@/components/menu-bottom/MenuBottom.vue'

describe('App.vue', () => {
  it('Renders the menus and grapher', () => {
    const app = shallowMount(App)
    expect(app.findComponent(MenuTop).exists()).toBeTruthy()
    expect(app.findComponent(MenuLeft).exists()).toBeTruthy()
    expect(app.findComponent(Grapher).exists()).toBeTruthy()
    expect(app.findComponent(MenuRight).exists()).toBeTruthy()
    expect(app.findComponent(MenuBottom).exists()).toBeTruthy()
  })
})
