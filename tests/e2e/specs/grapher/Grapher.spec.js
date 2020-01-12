describe('components/grapher/Grapher', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('renders correctly', () => {
    cy.get('[data-test="grapher--yard-line"]')
      .should('have.length', 21);

    cy.get('[data-test="grapher--hash-mark"]')
      .should('have.length', 42);

    cy.get('.grapher--field-rect')
      .should('be.visible');

    cy.get('[data-test="grapher--grid-vertical"]')
      .should('have.length', 26);

    cy.get('[data-test="grapher--grid-horizontal"]')
      .should('have.length', 20);

    cy.get('[data-test="grapher--yard-number"]')
      .should('have.length', 18);
  });
});
