describe("continuity/interactions", () => {
  beforeEach(() => {
    cy.visit("/").get('[data-test="menu-bottom-tools-tool--add-rm"]').click();
  });

  it("add dot, set cont, should move", () => {
    cy.mousedownGrapher(12, 8).mouseupGrapher(12, 8);

    cy.get('[data-test="grapher-dots--dot"]')
      .should("have.length", 1)
      .should("have.attr", "transform", "translate(12, 8)");

    // Add a new eight to five static continuity for the first dot type
    cy.get('[data-test="menu-right--add-continuity"]').click();
    cy.get('[data-test="menu-right--add-etf-static"]').click();

    // Clicking forward should move 1
    cy.get('[data-test="menu-left--increment-beat"]').click();
    cy.get('[data-test="grapher-dots--dot"]')
      .should("have.length", 1)
      .should("have.attr", "transform", "translate(12, 9)");

    // Clicking backward should move back 1
    cy.get('[data-test="menu-left--decrement-beat"]').click();
    cy.get('[data-test="grapher-dots--dot"]')
      .should("have.length", 1)
      .should("have.attr", "transform", "translate(12, 8)");
  });

  it("set cont, add dot, should move", () => {
    // Add a new eight to five static continuity for the first dot type
    cy.get('[data-test="menu-right--add-continuity"]').click();
    cy.get('[data-test="menu-right--add-etf-static"]').click();

    cy.mousedownGrapher(12, 8).mouseupGrapher(12, 8);

    cy.get('[data-test="grapher-dots--dot"]')
      .should("have.length", 1)
      .should("have.attr", "transform", "translate(12, 8)");

    // Clicking forward should move 1
    cy.get('[data-test="menu-left--increment-beat"]').click();
    cy.get('[data-test="grapher-dots--dot"]')
      .should("have.length", 1)
      .should("have.attr", "transform", "translate(12, 9)");

    // Clicking backward should move back 1
    cy.get('[data-test="menu-left--decrement-beat"]').click();
    cy.get('[data-test="grapher-dots--dot"]')
      .should("have.length", 1)
      .should("have.attr", "transform", "translate(12, 8)");
  });
});
