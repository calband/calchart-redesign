describe("components/menu-right/MenuRight", () => {
  beforeEach(() => {
    cy.visit("/");

    // Add a second stuntsheet so that continuities has a stuntsheet to go to
    cy.get('[data-test="menu-left--add-ss"]').click();

    // Select first stuntsheet
    cy.get('[data-test="menu-left--ss"]').first().click();
  });

  it("can edit dot types and continuities", () => {
    // Check that 1 dot type exists and it has a continuity in place
    cy.get('[data-test="menu-right--dot-type"]').should("have.length", 1);

    cy.get('[data-test="cont-in-place--march-type"]')
      .should("have.length", 1)
      .should("have.value", "HS");

    cy.get('[data-test="cont-in-place--duration"]')
      .should("have.length", 1)
      .should("have.value", "0")
      .clear()
      .type("8");

    cy.get('[data-test="cont-in-place--direction"]')
      .should("have.length", 1)
      .should("have.value", "90");

    cy.get('[data-test="cont-in-place--delete"]').should("not.exist");

    // Add a new eight to five dynamic continuity for the first dot type
    cy.get('[data-test="menu-right--add-continuity"]').click();

    cy.get('[data-test="menu-right--add-etf-dynamic"]').click();

    // Check on the fields for the eight to five continuity
    cy.get('[data-test="cont-etf-dynamic--etf-type"]')
      .should("have.length", 1)
      .should("have.value", "EW/NS");

    cy.get('[data-test="cont-etf-dynamic--march-type"]')
      .should("have.length", 1)
      .should("have.value", "HS");

    cy.get('[data-test="cont-etf-dynamic--delete"]').should("exist");

    // Delete the first continuity
    cy.get('[data-test="cont-in-place--delete"]').click();

    cy.get('[data-test="menu-right--dot-type"]').should("have.length", 1);

    cy.get('[data-test="cont-in-place--march-type"]').should("not.exist");

    // Create a new dot type
    cy.get('[data-se="menu-right--add-dot-type"]').click();

    cy.get('[data-test="menu-right--add-continuity"]').should("have.length", 2);

    cy.get('[data-test="menu-right--dot-type"]').should("have.length", 2);

    cy.get('[data-test="cont-in-place--march-type"]').should("exist");
  });
});
