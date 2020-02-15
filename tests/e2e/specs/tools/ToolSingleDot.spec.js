describe('tools/ToolSingleDot', () => {
  beforeEach(() => {
    cy.visit('/')
      .get('[data-test="menu-bottom-tool--add-rm"]')
      .click();
  });

  it('clicking adds, then removes a dot', () => {
    cy.get('[data-test="grapher--dot"]')
      .should('not.exist');

    cy.clickGrapher(12, 8);

    cy.get('[data-test="grapher--dot"]')
      .should('have.length', 1)
      .should('have.attr', 'cx', '12')
      .should('have.attr', 'cy', '8');

    cy.clickGrapher(12, 8);

    cy.get('[data-test="grapher--dot"]')
      .should('not.exist');
  });

  it('After panning and zooming, adding a dot is still accurate', () => {
    cy.get('[data-test="menu-bottom-tool--pan-zoom')
      .click();

    cy.get('#svg-pan-zoom-zoom-out')
      .click()
      .click();

    cy.mousedownGrapher(8, 2);
    cy.mousemoveGrapher(24, 2);
    cy.mouseupGrapher(24, 2);

    cy.get('[data-test="menu-bottom-tool--add-rm"]')
      .click();

    cy.clickGrapher(12, 8);

    cy.get('[data-test="grapher--dot"]')
      .should('have.length', 1)
      .should('have.attr', 'cx', '12')
      .should('have.attr', 'cy', '8');
  });

  it('clicking multiple dots', () => {
    cy.get('[data-test="grapher--dot"]')
      .should('not.exist');

    cy.clickGrapher(2, 0);
    cy.clickGrapher(2, 2);
    cy.clickGrapher(2, 4);
    cy.clickGrapher(2, 6);
    cy.clickGrapher(2, 8);

    cy.get('[data-test="grapher--dot"]')
      .should('have.length', 5)
      .each((dot, index) => {
        cy.wrap(dot)
          .should('have.attr', 'cx', '2')
          .should('have.attr', 'cy', `${index * 2}`);
      });

    cy.clickGrapher(2, 0);
    cy.clickGrapher(2, 8);

    cy.get('[data-test="grapher--dot"]')
      .should('have.length', 3)
      .each((dot, index) => {
        cy.wrap(dot)
          .should('have.attr', 'cx', '2')
          .should('have.attr', 'cy', `${(index + 1) * 2}`);
      });
  });

  it('mousemove sets tool dots', () => {
    cy.get('[data-test="grapher--tool-dot"]')
      .should('not.exist');

    cy.mousemoveGrapher(4, 6);

    cy.get('[data-test="grapher--tool-dot"]')
      .should('have.length', 1)
      .should('have.attr', 'cx', '4')
      .should('have.attr', 'cy', '6');

    cy.mousemoveGrapher(6, 8);

    cy.get('[data-test="grapher--tool-dot"]')
      .should('have.length', 1)
      .should('have.attr', 'cx', '6')
      .should('have.attr', 'cy', '8');
  });
});
