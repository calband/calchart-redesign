describe('tools/ToolPanZoom', () => {
  beforeEach(() => {
    cy.visit('/')
      .get('[data-test="menu-bottom--tool-button"] .mdi-hand-right')
      .click();
  });

});
