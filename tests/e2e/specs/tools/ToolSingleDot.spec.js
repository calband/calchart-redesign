describe('tools/ToolSingleDot', () => {
  beforeEach(() => {
    cy.visit('/')
      .get('[data-test="menu-bottom--tool-button"] .mdi-plus-minus')
      .click();
  });

});
