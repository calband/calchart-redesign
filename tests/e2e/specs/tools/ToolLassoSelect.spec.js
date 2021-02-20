describe("tools/ToolLassoSelect", () => {
  it("make sure selection works", () => {
    cy.visit("/").get('[data-test="menu-bottom-tool--add-rm"]').click();
    cy.mousedownGrapher(12, 8).mouseupGrapher(12, 8);
    // should not have selection
    cy.get('[data-test="grapher-dots--dot"]').should("have.length", 1);
    cy.get('[data-test="grapher-dots--dot"][data-test-selected="true"]').should(
      "have.length",
      0
    );
    cy.get('[data-test="menu-bottom-tool--select-lasso-move"]').click();
    // do just a line, shouldn't find anything
    cy.get('[data-test="grapher-field--rect"]').then(() => {
      cy.mousedownGrapher(24, 2);
      cy.mousemoveGrapher(10, 10);
      cy.mouseupGrapher(24, 2);

      cy.get('[data-test="grapher-tool--selection-lasso"]').then((polyline) => {
        cy.wrap(polyline).should("have.attr", "points");
      });
    });
    // do a triangle, should find something
    cy.get('[data-test="grapher-dots--dot"][data-test-selected="true"]').should(
      "have.length",
      0
    );
    cy.get('[data-test="grapher-field--rect"]').then(() => {
      cy.mousedownGrapher(24, 2);
      cy.mousemoveGrapher(10, 10);
      cy.mousemoveGrapher(0, -3);
      cy.mouseupGrapher(24, 2);

      cy.get('[data-test="grapher-tool--selection-lasso"]').then((polyline) => {
        cy.wrap(polyline).should("have.attr", "points");
      });
    });
    // should have selection
    cy.get('[data-test="grapher-dots--dot"][data-test-selected="true"]').should(
      "have.length",
      1
    );
  });
});
