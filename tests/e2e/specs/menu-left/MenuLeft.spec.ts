import Show from '@/models/Show';
import StuntSheet from '@/models/StuntSheet';
import StuntSheetDot from '@/models/StuntSheetDot';

describe('components/menu-left/MenuLeft', () => {
  /**
   * Helper function that checks the following:
   * - The first and second SS are correctly active
   * - Whether or not there is a dot on the grapher
   * - The beat controls text
   */
  const checkSSAndBeat = (
    activeSS: number,
    beat: number,
    maxBeats: number,
  ): void => {
    cy.get('[data-test="menu-left--ss"]')
      .eq(0)
      .should(`${activeSS === 0 ? '' : 'not.'}have.class`, 'is-active');

    cy.get('[data-test="menu-left--ss"]')
      .eq(1)
      .should(`${activeSS === 1 ? '' : 'not.'}have.class`, 'is-active');

    if (activeSS === 2) {
      cy.get('[data-test="menu-left--ss"]')
        .eq(2)
        .should('have.class', 'is-active');
    }

    cy.get('[data-test="grapher--dot"]')
      .should(`${activeSS === 0 ? '' : 'not.'}exist`);

    cy.get('[data-test="menu-left--beat"]')
      .should('include.text', `${beat} / ${maxBeats}`);
  };

  /**
   * Set up each test with two stuntsheets:
   * - title: "a", and has 1 dot
   * - title: "b", and has no dots
   */
  beforeEach(() => {
    cy.visit('/');

    const stuntSheets = [
      new StuntSheet({
        title: 'a',
        beats: 2,
        stuntSheetDots: [new StuntSheetDot({ x: 2, y: 2 })],
      }),
      new StuntSheet({ title: 'b', beats: 4 }),
    ];

    const show = new Show({ stuntSheets });

    cy.getStore().then((store) => {
      store.commit('setShow', show);
    });

    // Wait for the show to load
    cy.get('[data-test="menu-left--ss"]')
      .should('have.length', 2);
  });

  it('clicking the edit stuntsheet button opens modal', () => {
    cy.get('[data-test="menu-left--ss"]')
      .eq(1)
      .find('.stuntsheet-edit')
      .should('not.be.visible');

    cy.get('[data-test="menu-left--ss-modal"]')
      .should('not.be.visible');

    cy.get('[data-test="menu-left--ss"]')
      .eq(0)
      .find('.stuntsheet-edit')
      .should('be.visible')
      .click();

    cy.get('[data-test="menu-left--ss-modal"]')
      .should('be.visible');

    cy.get('[data-test="ss-modal--title"]')
      .should('have.value', 'a');
  });

  it('incrementing/decrementing beat updates the selected stunt sheet', () => {
    // Increment beats to go from stuntsheet a to b
    checkSSAndBeat(0, 1, 2);

    cy.get('[data-test="menu-left--increment-beat"]')
      .click();

    checkSSAndBeat(0, 2, 2);

    cy.get('[data-test="menu-left--increment-beat"]')
      .click();

    checkSSAndBeat(1, 1, 4);

    // Decrement beat to go from stuntsheet b to a
    cy.get('[data-test="menu-left--decrement-beat"]')
      .click();

    checkSSAndBeat(0, 2, 2);
  });

  it('clicking a stuntsheet selects it', () => {
    cy.get('[data-test="menu-left--increment-beat"]')
      .click();

    checkSSAndBeat(0, 2, 2);

    cy.get('[data-test="menu-left--ss"]')
      .last()
      .click();

    checkSSAndBeat(1, 1, 4);
  });

  it('clicking add stuntsheet selects the new stuntsheet', () => {
    checkSSAndBeat(0, 1, 2);

    cy.get('[data-test="menu-left--add-ss"]')
      .click();

    cy.get('[data-test="menu-left--ss"]')
      .should('have.length', 3);

    checkSSAndBeat(2, 1, 16);
  });
});
