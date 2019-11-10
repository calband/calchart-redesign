describe('components/menu-top/MenuTop', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('all dropdowns exist but are hidden', () => {
    cy.get('[data-test="menu-top--file"]')
      .find('[data-test="menu-top--file-edit"]')
      .should('not.be.visible');
    cy.get('[data-test="menu-top--view"]')
      .find('[data-test="menu-top--view-grid"]')
      .should('not.be.visible');
  });

  describe('file dropdown', () => {
    beforeEach(() => {
      cy.get('[data-test="menu-top--file"]')
        .click();
    });

    it('dropdown is visible upon clicking', () => {
      cy.get('[data-test="menu-top--file-edit"]')
        .should('be.visible');
    });

    it('clicking "Edit Show Details" opens show modal', () => {
      cy.get('[data-test="file-modal"]')
        .should('not.be.visible');

      cy.get('[data-test="menu-top--file-edit"]')
        .click();

      cy.get('[data-test="file-modal"]')
        .should('be.visible');
    });
  });

  describe('view dropdown', () => {
    beforeEach(() => {
      cy.get('[data-test="menu-top--view"]')
        .click();
    });

    it('dropdown is visible upon clicking', () => {
      cy.get('[data-test="menu-top--view-grid"]')
        .should('be.visible');
    });

    it('can toggle four step grid', () => {
      cy.get('[data-test="grapher--grid-vertical"]')
        .should('be.visible');

      cy.get('[data-test="grapher--grid-horizontal"]')
        .should('be.visible');

      cy.get('[data-test="menu-top--view-grid"]')
        .click();

      cy.get('[data-test="grapher--grid-vertical"]')
        .should('not.exist');

      cy.get('[data-test="grapher--grid-horizontal"]')
        .should('not.exist');
    });
  });
});
