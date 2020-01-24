describe('components/menu-bottom/MenuBottom', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('all buttons are rendered and pan/zoom is selected', () => {
    cy.get('[data-test="menu-bottom--tool-button"]')
      .should('have.length', 2);

    cy.get('[data-test="menu-bottom--tool-button"].is-primary')
      .should('have.length', 1)
      .find('.mdi-hand-right')
      .should('exist');

    cy.get('[data-test="menu-bottom--tool-button"].is-light')
      .should('have.length', 1);
  });

  it('clicking on add/remove single dot disables pan/zoom', () => {
    cy.get('[data-test="menu-bottom--tool-button"] .mdi-plus-minus')
      .click();

    cy.get('[data-test="menu-bottom--tool-button"].is-primary')
      .should('have.length', 1)
      .find('.mdi-plus-minus')
      .should('exist');

    cy.get('[data-test="menu-bottom--tool-button"].is-light')
      .should('have.length', 1);

    cy.get('#svg-pan-zoom-controls')
      .should('not.be.visible');
  });

  it('clicking from and to pan/zoom enables pan/zoom', () => {
    cy.get('[data-test="menu-bottom--tool-button"] .mdi-plus-minus')
      .click();

    cy.get('[data-test="menu-bottom--tool-button"] .mdi-hand-right')
      .click();

    cy.get('[data-test="menu-bottom--tool-button"].is-primary')
      .should('have.length', 1)
      .find('.mdi-hand-right')
      .should('exist');

    cy.get('#svg-pan-zoom-controls')
      .should('be.visible');
  });

  it('control key enables pan/zoom', () => {
    // Starting tool is add/remove single dot
    cy.get('[data-test="menu-bottom--tool-button"] .mdi-plus-minus')
      .click();

    cy.get('[data-test="menu-bottom--tool-button"].is-primary')
      .should('have.length', 1)
      .find('.mdi-plus-minus')
      .should('exist');

    cy.get('#svg-pan-zoom-controls')
      .should('not.be.visible');

    // Upon keydown, the selected tool is pan/zoom
    cy.document()
      .trigger('keydown', { key: 'Control' });

    cy.get('[data-test="menu-bottom--tool-button"].is-primary')
      .should('have.length', 1)
      .find('.mdi-hand-right')
      .should('exist');

    cy.get('#svg-pan-zoom-controls')
      .should('be.visible');

    // Upon keyup, the selected tool returns to add/remove single dot
    cy.document()
      .trigger('keyup', { key: 'Control' });

    cy.get('[data-test="menu-bottom--tool-button"].is-primary')
      .should('have.length', 1)
      .find('.mdi-plus-minus')
      .should('exist');

    cy.get('#svg-pan-zoom-controls')
      .should('not.be.visible');
  });
});
