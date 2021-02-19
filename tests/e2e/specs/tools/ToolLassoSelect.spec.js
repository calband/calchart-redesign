describe("tools/ToolLassoSelect", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("make sure selection works", () => {
    // Create 2 dots at 12, 8 and 12, 6
    cy.get('[data-test="menu-bottom-tool--add-rm"]').click();
    cy.mousedownGrapher(12, 8).mouseupGrapher(12, 8);
    cy.mousedownGrapher(12, 6).mouseupGrapher(12, 6);
    cy.get('[data-test="grapher-dots--dot"]').should("have.length", 2);

    // No dot should be selected
    cy.get('[data-test="grapher-dots--dot"][data-test-selected="true"]').should(
      "have.length",
      0
    );
    cy.get('[data-test="selected-dot--selection"]').should(
      "include.text",
      "No dots selected!"
    );

    // Draw a line that does not intersect with the dots
    cy.get('[data-test="menu-bottom-tool--select-lasso-move"]').click();
    cy.mousedownGrapher(24, 2).mousemoveGrapher(10, 10).mouseupGrapher(24, 2);
    cy.get('[data-test="grapher-tool--selection-lasso"]').should(
      "have.attr",
      "points"
    );
    cy.get('[data-test="grapher-dots--dot"][data-test-selected="true"]').should(
      "have.length",
      0
    );
    cy.get('[data-test="selected-dot--selection"]').should(
      "include.text",
      "No dots selected!"
    );

    // Select dot at 12, 8
    cy.mousedownGrapher(12, 8).mouseupGrapher(12, 8);
    cy.get('[data-test="grapher-dots--dot"][data-test-selected="true"]').should(
      "have.length",
      1
    );
    cy.get('[data-test="selected-dot--selection"]').should(
      "include.text",
      "Selected Dot: [0]"
    );

    // Draw a triangle surrounding the dots
    cy.mousedownGrapher(24, 2)
      .mousemoveGrapher(10, 10)
      .mousemoveGrapher(0, -3)
      .mouseupGrapher(24, 2);
    cy.get('[data-test="grapher-tool--selection-lasso"]').should(
      "have.attr",
      "points"
    );
    cy.get('[data-test="grapher-dots--dot"][data-test-selected="true"]').should(
      "have.length",
      2
    );
    cy.get('[data-test="selected-dot--selection"]').should(
      "include.text",
      "Multiple Selected Dots"
    );
  });
});
