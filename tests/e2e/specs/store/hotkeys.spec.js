describe("App.vue", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("increment/decrement", () => {
    cy.get('[data-test="menu-left--beat"]').should("include.text", "Hup! / 16");
    // eslint-disable-next-line cypress/require-data-selectors
    cy.get("body").type("{rightarrow}");
    cy.get('[data-test="menu-left--beat"]').should("include.text", "1 / 16");
    // eslint-disable-next-line cypress/require-data-selectors
    cy.get("body").type("{leftarrow}");
    cy.get('[data-test="menu-left--beat"]').should("include.text", "Hup! / 16");
  });
});
