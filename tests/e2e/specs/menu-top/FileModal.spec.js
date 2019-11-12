describe('components/menu-top/FileModal', () => {
  beforeEach(() => {
    cy.visit('/');

    cy.get('[data-test="menu-top--file"]')
      .click();

    cy.get('[data-test="menu-top--file-edit"]')
      .click();

    cy.get('[data-test="file-modal"]')
      .should('be.visible');
  });

  it('renders with the defaults', () => {
    cy.get('[data-test="file-modal--frontHashOffsetY"]')
      .should('have.value', '32');

    cy.get('[data-test="file-modal--backHashOffsetY"]')
      .should('have.value', '52');

    cy.get('[data-test="file-modal--middleOfField"]')
      .should('have.value', '50');
  });

  it('closes upon clicking "close"', () => {
    cy.get('[data-test="file-modal--close"]')
      .click();

    cy.get('[data-test="file-modal"]')
      .should('not.be.visible');
  });

  it('field changes shape upon adjusting hashes and middle of field', () => {
    cy.get('[data-test="file-modal--frontHashOffsetY"]')
      .clear()
      .type('8');

    cy.get('[data-test="file-modal--backHashOffsetY"]')
      .clear()
      .type('16');

    cy.get('[data-test="file-modal--middleOfField"]')
      .clear();

    cy.get('[data-test="file-modal--close"]')
      .click();

    cy.get('[data-test="grapher--yard-line"]')
      .should('have.length', 1);

    cy.get('[data-test="grapher--hash-mark"]')
      .should('have.length', 2);

    cy.get('[data-test="grapher--grid-vertical"]')
      .should('have.length', 6);

    cy.get('[data-test="grapher--grid-horizontal"]')
      .should('have.length', 5);

    cy.get('[data-test="grapher--yard-number"]')
      .should('not.exist');
  });
});
