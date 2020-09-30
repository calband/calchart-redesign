import { createLocalVue, mount, Wrapper } from '@vue/test-utils'
import svgPanZoom from 'svg-pan-zoom'
import Buefy from 'buefy'
import { generateStore, CalChartState } from '@/store'
import Vuex, { Store } from 'vuex'
import MenuBottom from '@/components/menu-bottom/MenuBottom.vue'
import ToolSingleDot from '@/tools/ToolSingleDot'
import ToolPanZoom from '@/tools/ToolPanZoom'
import BaseTool from '@/tools/BaseTool'

jest.mock('svg-pan-zoom', () => {
  return {
    __esModule: true,
    default: jest.fn(() => ({
      disablePan: jest.fn(),
      disableZoom: jest.fn(),
      disableControlIcons: jest.fn(),
      enablePan: jest.fn(),
      enableZoom: jest.fn(),
      enableControlIcons: jest.fn()
    }))
  }
})

jest.mock('@/tools/ToolSingleDot')
jest.mock('@/tools/ToolPanZoom')

const setupHelper = () => {
  // Mock inverse matrix calculations
  const inverseMock = jest.fn().mockReturnValue({})
  const getScreenCTMMock = jest.fn().mockReturnValue({
    inverse: inverseMock
  })
  const getElementsByClassNameMock = jest.fn().mockReturnValue([{
    getScreenCTM: getScreenCTMMock
  }])
  Object.defineProperty(document, 'getElementsByClassName', {
    configurable: true,
    value: getElementsByClassNameMock
  })

  // Mock out store and mount
  const localVue = createLocalVue()
  localVue.use(Vuex)
  localVue.use(Buefy)
  const grapherSvgPanZoom = svgPanZoom('')
  const store = generateStore({
    grapherSvgPanZoom
  })
  const menu = mount(MenuBottom, {
    store,
    localVue
  })

  return {
    inverseMock,
    getScreenCTMMock,
    getElementsByClassNameMock,
    grapherSvgPanZoom,
    store,
    menu
  }
}

describe('components/menu-bottom/MenuBottom', () => {
  describe('tool buttons', () => {
    let inverseMock: jest.Mock
    let getScreenCTMMock: jest.Mock
    let getElementsByClassNameMock: jest.Mock
    let grapherSvgPanZoom: SvgPanZoom.Instance
    let store: Store<CalChartState>
    let menu: Wrapper<Vue>

    beforeAll(() => {
      jest.clearAllMocks();
      ({
        inverseMock,
        getScreenCTMMock,
        getElementsByClassNameMock,
        grapherSvgPanZoom,
        store,
        menu
      } = setupHelper())
    })

    it('renders the correct amount of tools', () => {
      expect(menu.findAll('[data-test="menu-bottom--tooltip"]'))
        .toHaveLength(2)
    })

    it('on mount, selects the pan and zoom tool', () => {
      const toolSelected = store.state.toolSelected as BaseTool
      expect(toolSelected).not.toBeUndefined()
      expect(ToolPanZoom).toHaveBeenCalled()
      expect(toolSelected.constructor).toBe(ToolPanZoom)
      const panZoomBtn = menu
        .find('[data-test="menu-bottom-tool--pan-zoom"]')
      expect(panZoomBtn.exists()).toBeTruthy()
      expect(panZoomBtn.props('type')).toBe('is-primary')
    })

    it('add/remove single dot has type is-light when it is unselected', () => {
      const addRmBtn = menu.find('[data-test="menu-bottom-tool--add-rm"]')
      expect(addRmBtn.props('type')).toBe('is-light')
    })

    it('clicking add/remove single dot disables panning/zooming and ' +
    'calculates inverse matrix', async () => {
      expect(ToolSingleDot).not.toHaveBeenCalled()
      expect(grapherSvgPanZoom.disablePan).not.toHaveBeenCalled()
      expect(grapherSvgPanZoom.disableZoom).not.toHaveBeenCalled()
      expect(grapherSvgPanZoom.disableControlIcons).not.toHaveBeenCalled()
      expect(inverseMock).not.toHaveBeenCalled()
      expect(getScreenCTMMock).not.toHaveBeenCalled()
      expect(getElementsByClassNameMock).not.toHaveBeenCalled()

      const addRmBtn = menu.find('[data-test="menu-bottom-tool--add-rm"]')
      addRmBtn.trigger('click')
      await menu.vm.$nextTick()

      expect(ToolSingleDot).toHaveBeenCalled()
      const toolSelected = store.state.toolSelected as BaseTool
      expect(toolSelected).not.toBeUndefined()
      expect(toolSelected.constructor).toBe(ToolSingleDot)
      expect(addRmBtn.props('type')).toBe('is-primary')
      expect(grapherSvgPanZoom.disablePan).toHaveBeenCalled()
      expect(grapherSvgPanZoom.disableZoom).toHaveBeenCalled()
      expect(grapherSvgPanZoom.disableControlIcons).toHaveBeenCalled()
      expect(inverseMock).toHaveBeenCalled()
      expect(getScreenCTMMock).toHaveBeenCalled()
      expect(getElementsByClassNameMock).toHaveBeenCalled()
    })

    it('pan and zoom is no longer selected', () => {
      const panZoomBtn = menu
        .find('[data-test="menu-bottom-tool--pan-zoom"]')
      expect(panZoomBtn.props('type')).toBe('is-light')
    })

    it('clicking pan and zoom enables panning/zooming', async () => {
      expect(grapherSvgPanZoom.enablePan).not.toHaveBeenCalled()
      expect(grapherSvgPanZoom.enableZoom).not.toHaveBeenCalled()
      expect(grapherSvgPanZoom.enableControlIcons).not.toHaveBeenCalled()

      const panZoomBtn = menu
        .find('[data-test="menu-bottom-tool--pan-zoom"]')
      panZoomBtn.trigger('click')
      await menu.vm.$nextTick()

      const toolSelected = store.state.toolSelected as BaseTool
      expect(toolSelected).not.toBeUndefined()
      expect(toolSelected.constructor).toBe(ToolPanZoom)
      expect(panZoomBtn.props('type')).toBe('is-primary')
      expect(grapherSvgPanZoom.enablePan).toHaveBeenCalled()
      expect(grapherSvgPanZoom.enableZoom).toHaveBeenCalled()
      expect(grapherSvgPanZoom.enableControlIcons).toHaveBeenCalled()
    })
  })

  describe('onKeyDown', () => {
    let store: Store<CalChartState>
    let menu: Wrapper<Vue>

    beforeEach(() => {
      ({ store, menu } = setupHelper())

      store.commit('setToolSelected', new ToolSingleDot())
    })

    it('If ctrl key, enable pan/zoom and store old tool', () => {
      expect(menu.vm.$data.temporaryTool).toBeNull()

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Control' }))

      expect(menu.vm.$data.temporaryTool instanceof ToolSingleDot).toBe(true)
      expect(store.state.toolSelected instanceof ToolPanZoom).toBe(true)
    })

    it('If meta key, enable pan/zoom and store old tool', () => {
      expect(menu.vm.$data.temporaryTool).toBeNull()

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Meta' }))

      expect(menu.vm.$data.temporaryTool instanceof ToolSingleDot).toBe(true)
      expect(store.state.toolSelected instanceof ToolPanZoom).toBe(true)
    })

    it('If repeat event, do not do anything', () => {
      document.dispatchEvent(new KeyboardEvent('keydown', {
        key: 'Control',
        repeat: true
      }))

      expect(menu.vm.$data.temporaryTool).toBeNull()
      expect(store.state.toolSelected instanceof ToolSingleDot).toBe(true)
    })

    it('If not ctrl key, do not do anything', () => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'KeyA' }))

      expect(menu.vm.$data.temporaryTool).toBeNull()
      expect(store.state.toolSelected instanceof ToolSingleDot).toBe(true)
    })
  })

  describe('onKeyUp', () => {
    let store: Store<CalChartState>
    let menu: Wrapper<Vue>

    beforeEach(() => {
      jest.clearAllMocks();
      ({ store, menu } = setupHelper())

      menu.vm.$data.temporaryTool = new ToolSingleDot()
    })

    it('If ctrl key, enable pan/zoom and store old tool', () => {
      expect(menu.vm.$data.temporaryTool).not.toBeNull()
      const toolSelected = store.state.toolSelected as BaseTool
      expect(toolSelected).not.toBeUndefined()
      expect(toolSelected.constructor).not.toBe(ToolSingleDot)

      document.dispatchEvent(new KeyboardEvent('keyup', { key: 'Control' }))

      expect(menu.vm.$data.temporaryTool).toBeNull()
      const nextToolSelected = store.state.toolSelected as BaseTool
      expect(nextToolSelected.constructor).toBe(ToolSingleDot)
    })

    it('If meta key, enable pan/zoom and store old tool', async () => {
      expect(menu.vm.$data.temporaryTool).not.toBeNull()
      const toolSelected = store.state.toolSelected as BaseTool
      expect(toolSelected).not.toBeUndefined()
      expect(toolSelected.constructor).not.toBe(ToolSingleDot)

      document.dispatchEvent(new KeyboardEvent('keyup', { key: 'Meta' }))

      expect(menu.vm.$data.temporaryTool).toBeNull()
      const nextToolSelected = store.state.toolSelected as BaseTool
      expect(nextToolSelected.constructor).toBe(ToolSingleDot)
    })

    it('If not ctrl key, do not do anything', () => {
      document.dispatchEvent(new KeyboardEvent('keyup', { key: 'KeyA' }))

      expect(menu.vm.$data.temporaryTool).not.toBeNull()
      const toolSelected = store.state.toolSelected as BaseTool
      expect(toolSelected).not.toBeUndefined()
      expect(toolSelected.constructor).not.toBe(ToolSingleDot)
    })
  })
})
