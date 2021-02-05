describe("components/menu-bottom/MenuBottom", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("all buttons are rendered and box select is selected", () => {
    cy.get('[data-test="menu-bottom--tooltip"]').should("have.length", 3);

    cy.get('[data-test="menu-bottom-tool--select-box-move"]').should(
      "have.class",
      "is-primary"
    );

    cy.get('[data-test="menu-bottom--tooltip"] .is-light').should(
      "have.length",
      2
    );
  });

  it("clicking on add/remove single dot disables box", () => {
    cy.get('[data-test="menu-bottom-tool--add-rm"]')
      .should("not.have.class", "is-primary")
      .click()
      .should("have.class", "is-primary");

    cy.get('[data-test="menu-bottom--tooltip"] .is-light').should(
      "have.length",
      2
    );

    // eslint-disable-next-line cypress/require-data-selectors
    cy.get("#svg-pan-zoom-controls").should("be.visible");
  });

  it("clicking from and to pan/zoom enables pan/zoom", () => {
    cy.get('[data-test="menu-bottom-tool--add-rm"]').click();

    cy.get('[data-test="menu-bottom-tool--select-box-move"]')
      .should("not.have.class", "is-primary")
      .click()
      .should("have.class", "is-primary");

    // eslint-disable-next-line cypress/require-data-selectors
    cy.get("#svg-pan-zoom-controls").should("be.visible");
  });

  // #66 - Skipping due to flakey test
  it.skip("control key enables pan/zoom", () => {
    // Starting tool is add/remove single dot
    cy.get('[data-test="menu-bottom-tool--add-rm"]')
      .click()
      .should("have.class", "is-primary");

    // eslint-disable-next-line cypress/require-data-selectors
    cy.get("#svg-pan-zoom-controls").should("be.visible");

    // Try panning (taken from ToolPanZoom.spec.js)
    cy.get('[data-test="grapher-field--rect"]').then((field) => {
      const oldX = field.get(0).getBoundingClientRect().x;
      cy.mousedownGrapher(24, 2, { metaKey: true });
      cy.mousemoveGrapher(8, 2, { metaKey: true });
      cy.mouseupGrapher(8, 2, { metaKey: true });

      cy.get('[data-test="grapher-field--rect"]')
        .then((field) => {
          cy.wrap(field.get(0).getBoundingClientRect().x);
        })
        .should("lessThan", oldX);
    });

    cy.get('[data-test="menu-bottom-tool--add-rm"]').should(
      "have.class",
      "is-primary"
    );

    // eslint-disable-next-line cypress/require-data-selectors
    cy.get("#svg-pan-zoom-controls").should("be.visible");
  });
});
