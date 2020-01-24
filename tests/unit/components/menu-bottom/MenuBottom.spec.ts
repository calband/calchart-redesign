import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import svgPanZoom from 'svg-pan-zoom';
import Buefy from 'buefy';
import { generateStore, CalChartState } from '@/store';
import Vuex, { Store } from 'vuex';
import MenuBottom from '@/components/menu-bottom/MenuBottom.vue';
import ToolSingleDot from '@/tools/ToolSingleDot';
import ToolPanZoom from '@/tools/ToolPanZoom';

jest.mock('svg-pan-zoom', () => {
  return {
    __esModule: true,
    default: jest.fn(() => ({
      disablePan: jest.fn(),
      disableZoom: jest.fn(),
      disableControlIcons: jest.fn(),
      enablePan: jest.fn(),
      enableZoom: jest.fn(),
      enableControlIcons: jest.fn(),
    })),
  };
});

jest.mock('@/tools/ToolSingleDot');
jest.mock('@/tools/ToolPanZoom');

const setupHelper = () => {
  // Mock inverse matrix calculations
  const inverseMock = jest.fn().mockReturnValue({});
  const getScreenCTMMock = jest.fn().mockReturnValue({
    inverse: inverseMock,
  });
  const getElementsByClassNameMock = jest.fn().mockReturnValue([{
    getScreenCTM: getScreenCTMMock,
  }]);
  Object.defineProperty(document, 'getElementsByClassName', {
    configurable: true,
    value: getElementsByClassNameMock,
  });

  // Mock out store and mount
  const localVue = createLocalVue();
  localVue.use(Vuex);
  localVue.use(Buefy);
  const grapherSvgPanZoom = svgPanZoom('');
  const store = generateStore({
    grapherSvgPanZoom,
  });
  const menu = mount(MenuBottom, {
    store,
    localVue,
  });

  return {
    inverseMock,
    getScreenCTMMock,
    getElementsByClassNameMock,
    grapherSvgPanZoom,
    store,
    menu,
  };
};

describe('components/menu-bottom/MenuBottom', () => {
  describe('tool buttons', () => {
    let inverseMock: jest.Mock;
    let getScreenCTMMock: jest.Mock;
    let getElementsByClassNameMock: jest.Mock;
    let grapherSvgPanZoom: SvgPanZoom.Instance;
    let store: Store<CalChartState>;
    let menu: Wrapper<Vue>;

    beforeAll(() => {
      jest.clearAllMocks();
      ({
        inverseMock,
        getScreenCTMMock,
        getElementsByClassNameMock,
        grapherSvgPanZoom,
        store,
        menu,
      } = setupHelper());
    });

    it('renders the correct amount of tools', () => {
      expect(menu.contains('[data-test="menu-bottom--tool-button"]'))
        .toBeTruthy();
      expect(menu.findAll('[data-test="menu-bottom--tool-button"]'))
        .toHaveLength(2);
    });

    it('on mount, selects the pan and zoom tool', () => {
      expect(store.state.toolSelected).not.toBeUndefined();
      if (store.state.toolSelected === undefined) {
        throw 'toolSelected is undefined';
      }
      expect(ToolPanZoom).toHaveBeenCalled();
      expect(store.state.toolSelected.constructor === ToolPanZoom).toBeTruthy();
      const firstToolBtn = menu
        .findAll('[data-test="menu-bottom--tool-button"]')
        .at(0);
      expect(firstToolBtn.props('type')).toBe('is-primary');
    });

    it('unselected tools have type is-light', () => {
      const toolBtns = menu.findAll('[data-test="menu-bottom--tool-button"]');
      const lightToolBtns = toolBtns.filter((btn: Wrapper<Vue>) => {
        return btn.props('type') === 'is-light';
      });
      expect(lightToolBtns).toHaveLength(1);
    });

    it('clicking add/remove single dot disables panning/zooming and '
    + 'calculates inverse matrix', () => {
      expect(ToolSingleDot).not.toHaveBeenCalled();
      expect(grapherSvgPanZoom.disablePan).not.toHaveBeenCalled();
      expect(grapherSvgPanZoom.disableZoom).not.toHaveBeenCalled();
      expect(grapherSvgPanZoom.disableControlIcons).not.toHaveBeenCalled();
      expect(inverseMock).not.toHaveBeenCalled();
      expect(getScreenCTMMock).not.toHaveBeenCalled();
      expect(getElementsByClassNameMock).not.toHaveBeenCalled();

      const secondToolBtn = menu
        .findAll('[data-test="menu-bottom--tool-button"]')
        .at(1);
      secondToolBtn.trigger('click');

      expect(ToolSingleDot).toHaveBeenCalled();
      expect(store.state.toolSelected).not.toBeUndefined();
      if (store.state.toolSelected === undefined) {
        throw 'toolSelected is undefined';
      }
      expect(store.state.toolSelected.constructor === ToolSingleDot)
        .toBeTruthy();
      expect(secondToolBtn.props('type')).toBe('is-primary');
      expect(grapherSvgPanZoom.disablePan).toHaveBeenCalled();
      expect(grapherSvgPanZoom.disableZoom).toHaveBeenCalled();
      expect(grapherSvgPanZoom.disableControlIcons).toHaveBeenCalled();
      expect(inverseMock).toHaveBeenCalled();
      expect(getScreenCTMMock).toHaveBeenCalled();
      expect(getElementsByClassNameMock).toHaveBeenCalled();
    });

    it('pan and zoom is no longer selected', () => {
      const firstToolBtn = menu
        .findAll('[data-test="menu-bottom--tool-button"]')
        .at(0);
      expect(firstToolBtn.props('type')).toBe('is-light');
    });

    it('clicking pan and zoom enables panning/zooming', () => {
      expect(grapherSvgPanZoom.enablePan).not.toHaveBeenCalled();
      expect(grapherSvgPanZoom.enableZoom).not.toHaveBeenCalled();
      expect(grapherSvgPanZoom.enableControlIcons).not.toHaveBeenCalled();

      const firstToolBtn = menu
        .findAll('[data-test="menu-bottom--tool-button"]')
        .at(0);
      firstToolBtn.trigger('click');

      expect(store.state.toolSelected).not.toBeUndefined();
      if (store.state.toolSelected === undefined) {
        throw 'toolSelected is undefined';
      }
      expect(store.state.toolSelected.constructor === ToolPanZoom)
        .toBeTruthy();
      expect(firstToolBtn.props('type')).toBe('is-primary');
      expect(grapherSvgPanZoom.enablePan).toHaveBeenCalled();
      expect(grapherSvgPanZoom.enableZoom).toHaveBeenCalled();
      expect(grapherSvgPanZoom.enableControlIcons).toHaveBeenCalled();
    });
  });

  describe('onKeyDown', () => {
    let store: Store<CalChartState>;
    let menu: Wrapper<Vue>;
    let setToolMock: jest.Mock;

    beforeEach(() => {
      jest.clearAllMocks();
      ({ store, menu } = setupHelper());

      store.commit('setToolSelected', new ToolSingleDot(store));

      setToolMock = jest.fn();
      menu.setMethods({ setTool: setToolMock });
    });

    it('If ctrl key, enable pan/zoom and store old tool', () => {
      expect(menu.vm.$data.temporaryTool).toBeNull();
      expect(setToolMock).not.toHaveBeenCalled();

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Control' }));

      expect(menu.vm.$data.temporaryTool).not.toBeNull();
      expect(setToolMock).toHaveBeenCalledWith(0);
    });

    it('If meta key, enable pan/zoom and store old tool', () => {
      expect(menu.vm.$data.temporaryTool).toBeNull();
      expect(setToolMock).not.toHaveBeenCalled();

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Meta' }));

      expect(menu.vm.$data.temporaryTool).not.toBeNull();
      expect(setToolMock).toHaveBeenCalledWith(0);
    });

    it('If repeat event, do not do anything', () => {
      document.dispatchEvent(new KeyboardEvent('keydown', {
        key: 'Control',
        repeat: true,
      }));

      expect(menu.vm.$data.temporaryTool).toBeNull();
      expect(setToolMock).not.toHaveBeenCalled();
    });

    it('If not ctrl key, do not do anything', () => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'KeyA' }));

      expect(menu.vm.$data.temporaryTool).toBeNull();
      expect(setToolMock).not.toHaveBeenCalled();
    });
  });

  describe('onKeyUp', () => {
    let store: Store<CalChartState>;
    let menu: Wrapper<Vue>;

    beforeEach(() => {
      jest.clearAllMocks();
      ({ store, menu } = setupHelper());

      menu.vm.$data.temporaryTool = new ToolSingleDot(store);
    });

    it('If ctrl key, enable pan/zoom and store old tool', () => {
      expect(menu.vm.$data.temporaryTool).not.toBeNull();
      if (store.state.toolSelected === undefined) {
        throw 'toolSelected is undefined';
      }
      expect(store.state.toolSelected.constructor === ToolSingleDot)
        .toBeFalsy();

      document.dispatchEvent(new KeyboardEvent('keyup', { key: 'Control' }));

      expect(menu.vm.$data.temporaryTool).toBeNull();
      expect(store.state.toolSelected.constructor === ToolSingleDot)
        .toBeTruthy();
    });

    it('If meta key, enable pan/zoom and store old tool', () => {
      expect(menu.vm.$data.temporaryTool).not.toBeNull();
      if (store.state.toolSelected === undefined) {
        throw 'toolSelected is undefined';
      }
      expect(store.state.toolSelected.constructor === ToolSingleDot)
        .toBeFalsy();

      document.dispatchEvent(new KeyboardEvent('keyup', { key: 'Meta' }));

      expect(menu.vm.$data.temporaryTool).toBeNull();
      expect(store.state.toolSelected.constructor === ToolSingleDot)
        .toBeTruthy();
    });

    it('If not ctrl key, do not do anything', () => {
      document.dispatchEvent(new KeyboardEvent('keyup', { key: 'KeyA' }));

      expect(menu.vm.$data.temporaryTool).not.toBeNull();
      if (store.state.toolSelected === undefined) {
        throw 'toolSelected is undefined';
      }
      expect(store.state.toolSelected.constructor === ToolSingleDot)
        .toBeFalsy();
    });
  });
});
