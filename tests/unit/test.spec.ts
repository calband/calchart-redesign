import { shallowMount } from '@vue/test-utils';
import App from '@/App.vue';
import Grapher from '@/components/grapher/Grapher.vue';

describe('Update these tests!', () => {
  it('Renders the Grapher', () => {
    const app = shallowMount(App);
    expect(app.contains(Grapher)).toBeTruthy();
  });
});