describe("components/menu-top/FileModal", () => {
  beforeEach(() => {
    cy.visit("/");

    cy.get('[data-test="menu-top--edit"]').click();

    cy.get('[data-test="menu-top--edit-show-details"]').click();

    cy.get('[data-test="menu-top--file-modal"]').should("be.visible");
  });

  it("renders with the defaults", () => {
    cy.get('[data-test="file-modal--front-hash-offset-y"]').should(
      "have.value",
      "32"
    );

    cy.get('[data-test="file-modal--back-hash-offset-y"]').should(
      "have.value",
      "52"
    );

    cy.get('[data-test="file-modal--middle-of-field"]').should(
      "have.value",
      "50"
    );
  });

  it('closes upon clicking "close"', () => {
    cy.get('[data-test="file-modal--close"]').click();

    cy.get('[data-test="file-modal"]').should("not.be.visible");
  });

  it("show title changes correctly", () => {
    cy.get('[data-test="file-modal--show-title"]')
      .should("have.value", "Example Show")
      .clear()
      .type("Ariana Grande Show");

    cy.get('[data-test="file-modal--close"]').click();

    cy.get('[data-test="menu-top--file"]').click();

    cy.get('[data-test="menu-left--title"]').contains("Ariana Grande Show");
  });

  it("field changes shape upon adjusting hashes and middle of field", () => {
    cy.get('[data-test="file-modal--front-hash-offset-y"]').clear().type("8");

    cy.get('[data-test="file-modal--back-hash-offset-y"]').clear().type("16");

    cy.get('[data-test="file-modal--middle-of-field"]').clear();

    cy.get('[data-test="file-modal--close"]').click();

    cy.get('[data-test="grapher-field--yard-line"]').should("have.length", 1);

    cy.get('[data-test="grapher-field--hash-mark"]').should("have.length", 2);

    cy.get('[data-test="grapher-field--grid-vertical"]').should(
      "have.length",
      6
    );

    cy.get('[data-test="grapher-field--grid-horizontal"]').should(
      "have.length",
      5
    );

    cy.get('[data-test="grapher-field--yard-number"]').should("not.exist");
  });
});
