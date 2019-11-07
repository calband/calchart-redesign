import { shallowMount } from '@vue/test-utils';
import App from '@/App.vue';
import MenuTop from '@/components/menu-top/MenuTop.vue';
import MenuLeft from '@/components/menu-left/MenuLeft.vue';
import Grapher from '@/components/grapher/Grapher.vue';
import MenuRight from '@/components/menu-right/MenuRight.vue';
import MenuBottom from '@/components/menu-bottom/MenuBottom.vue';

describe('App.vue', () => {
  it('Renders the menus and grapher', () => {
    const app = shallowMount(App);
    expect(app.contains(MenuTop)).toBeTruthy();
    expect(app.contains(MenuLeft)).toBeTruthy();
    expect(app.contains(Grapher)).toBeTruthy();
    expect(app.contains(MenuRight)).toBeTruthy();
    expect(app.contains(MenuBottom)).toBeTruthy();
  });
});
