import Serializable from '@/models/util/Serializable'
import Show from '@/models/Show'
import ContInPlace from '@/models/continuity/ContInPlace'
import ContETFDynamic from '@/models/continuity/ContETFDynamic'
import StuntSheet from '@/models/StuntSheet'
import Field from '@/models/Field'
import { CONT_IDS } from '@/models/continuity/BaseCont'
import StuntSheetDot from '@/models/StuntSheetDot'

const DEFAULT_TITLE = 'I am smol'

class SerializableChild extends Serializable<SerializableChild> {
  title: string = DEFAULT_TITLE;

  constructor (json: Partial<SerializableChild> = {}) {
    super()
    this.fromJson(json)
  }

  getTitle (): string {
    return this.title
  }
}

class SerializableParent extends Serializable<SerializableParent> {
  children: SerializableChild[] = [new SerializableChild()];

  constructor (json: Partial<SerializableParent> = {}) {
    super()
    /**
     * The children must be reinitialized in order to use it's class methods.
     * To see, try commenting out this if statement.
     */
    if (json.children !== undefined) {
      json.children = json.children.map((child: SerializableChild) => {
        return new SerializableChild(child)
      })
    }
    this.fromJson(json)
  }
}

describe('models/util/Serializable', () => {
  describe('ExampleChildSerializable', () => {
    it('uses defaults when json is undefined', () => {
      const child = new SerializableChild()
      expect(child.title).toBe(DEFAULT_TITLE)
      expect(child.getTitle()).toBe(DEFAULT_TITLE)
    })

    it('uses default if field is not provided', () => {
      const child = new SerializableChild({})
      expect(child.title).toBe(DEFAULT_TITLE)
      expect(child.getTitle()).toBe(DEFAULT_TITLE)
    })

    it('uses field if provided', () => {
      const title = 'roar'
      const child = new SerializableChild({ title })
      expect(child.title).toBe(title)
      expect(child.getTitle()).toBe(title)
    })
  })

  describe('ExampleParentSerializable', () => {
    it('uses defaults when json is undefined', () => {
      const parent = new SerializableParent()
      expect(parent.children).toHaveLength(1)
      expect(parent.children[0] instanceof SerializableChild).toBeTruthy()
      expect(parent.children[0].getTitle()).toBe(DEFAULT_TITLE)
    })

    it('uses default if field is not provided', () => {
      const parent = new SerializableParent({})
      expect(parent.children).toHaveLength(1)
      expect(parent.children[0] instanceof SerializableChild).toBeTruthy()
      expect(parent.children[0].getTitle()).toBe(DEFAULT_TITLE)
    })

    it('uses field if provided', () => {
      const children = [
        new SerializableChild({ title: 'one' }),
        new SerializableChild({ title: 'two' })
      ]
      const parent = new SerializableParent({ children })
      expect(parent.children).toHaveLength(2)
      expect(parent.children[0] instanceof SerializableChild).toBeTruthy()
      expect(parent.children[0].getTitle instanceof Function).toBeTruthy()
      expect(parent.children[0].getTitle()).toBe('one')
      expect(parent.children[1] instanceof SerializableChild).toBeTruthy()
      expect(parent.children[1].getTitle instanceof Function).toBeTruthy()
      expect(parent.children[1].getTitle()).toBe('two')
    })

    it('reinitializes children from JSON', () => {
      const children = JSON.parse(JSON.stringify([
        new SerializableChild({ title: 'one' }),
        new SerializableChild({ title: 'two' })
      ]))
      const parent = new SerializableParent({ children })
      expect(parent.children).toHaveLength(2)
      expect(parent.children[0] instanceof SerializableChild).toBeTruthy()
      expect(parent.children[0].getTitle instanceof Function).toBeTruthy()
      expect(parent.children[0].getTitle()).toBe('one')
      expect(parent.children[1] instanceof SerializableChild).toBeTruthy()
      expect(parent.children[1].getTitle instanceof Function).toBeTruthy()
      expect(parent.children[1].getTitle()).toBe('two')
    })
  })

  describe('Show JSON', () => {
    let parsedShow: Show

    beforeAll(() => {
      const stuntSheet1 = new StuntSheet({
        stuntSheetDots: [
          new StuntSheetDot({ x: 10 })
        ],
        dotTypes: [
          [
            new ContInPlace({ humanReadableText: 'one' }),
            new ContETFDynamic({ humanReadableText: 'two' })
          ]
        ]
      })
      const stuntSheet2 = new StuntSheet({
        stuntSheetDots: [
          new StuntSheetDot({ x: 20 })
        ],
        dotTypes: [
          [
            new ContETFDynamic({ humanReadableText: 'three' }),
            new ContInPlace({ humanReadableText: 'four' })
          ]
        ]
      })
      const field = new Field({
        middleOfField: 25
      })
      const show = new Show({
        field,
        stuntSheets: [stuntSheet1, stuntSheet2]
      })
      parsedShow = new Show(JSON.parse(JSON.stringify(show)))
    })

    it('field is correctly initialized', () => {
      expect(parsedShow.field instanceof Field).toBeTruthy()
      expect(parsedShow.field.middleOfField).toBe(25)
    })

    it('stuntSheets is correctly initialized', () => {
      expect(parsedShow.stuntSheets).toHaveLength(2)
      expect(parsedShow.stuntSheets[0] instanceof StuntSheet).toBeTruthy()
      expect(parsedShow.stuntSheets[1] instanceof StuntSheet).toBeTruthy()
    })

    it('first stuntsheet is correctly initialized', () => {
      const stuntSheet1 = parsedShow.stuntSheets[0]
      expect(stuntSheet1.stuntSheetDots).toHaveLength(1)
      expect(stuntSheet1.stuntSheetDots[0] instanceof StuntSheetDot)
        .toBeTruthy()
      expect(stuntSheet1.stuntSheetDots[0].x).toBe(10)
      expect(stuntSheet1.dotTypes).toHaveLength(1)
      const dotType = stuntSheet1.dotTypes[0]
      expect(dotType).toHaveLength(2)
      expect(dotType[0] instanceof ContInPlace).toBeTruthy()
      expect(dotType[0].continuityId).toBe(CONT_IDS.IN_PLACE)
      expect(dotType[0].getHumanReadableText instanceof Function).toBeTruthy()
      expect(dotType[0].getHumanReadableText()).toBe('one')
      expect(dotType[1] instanceof ContETFDynamic).toBeTruthy()
      expect(dotType[1].continuityId).toBe(CONT_IDS.ETF_DYNAMIC)
      expect(dotType[1].getHumanReadableText instanceof Function).toBeTruthy()
      expect(dotType[1].getHumanReadableText()).toBe('two')
    })

    it('second stuntsheet is correctly initialized', () => {
      const stuntSheet2 = parsedShow.stuntSheets[1]
      expect(stuntSheet2.stuntSheetDots).toHaveLength(1)
      expect(stuntSheet2.stuntSheetDots[0] instanceof StuntSheetDot)
        .toBeTruthy()
      expect(stuntSheet2.stuntSheetDots[0].x).toBe(20)
      expect(stuntSheet2.dotTypes).toHaveLength(1)
      const dotType = stuntSheet2.dotTypes[0]
      expect(dotType).toHaveLength(2)
      expect(dotType[0] instanceof ContETFDynamic).toBeTruthy()
      expect(dotType[0].continuityId).toBe(CONT_IDS.ETF_DYNAMIC)
      expect(dotType[0].getHumanReadableText instanceof Function).toBeTruthy()
      expect(dotType[0].getHumanReadableText()).toBe('three')
      expect(dotType[1] instanceof ContInPlace).toBeTruthy()
      expect(dotType[1].continuityId).toBe(CONT_IDS.IN_PLACE)
      expect(dotType[1].getHumanReadableText instanceof Function).toBeTruthy()
      expect(dotType[1].getHumanReadableText()).toBe('four')
    })
  })
})
