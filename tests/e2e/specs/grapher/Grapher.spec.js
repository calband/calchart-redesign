describe("components/grapher/Grapher", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("renders 1 correctly", () => {
    cy.get('[data-test="grapher-field--yard-line"]').should("have.length", 21);

    cy.get('[data-test="grapher-field--hash-mark"]').should("have.length", 42);

    cy.get('[data-test="grapher-field--rect"]').should("be.visible");

    cy.get('[data-test="grapher-field--grid-vertical"]').should(
      "have.length",
      26
    );

    cy.get('[data-test="grapher-field--grid-horizontal"]').should(
      "have.length",
      20
    );

    cy.get('[data-test="grapher-field--yard-number"]').should(
      "have.length",
      18
    );
  });
});
