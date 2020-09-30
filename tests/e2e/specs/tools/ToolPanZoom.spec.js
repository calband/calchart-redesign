describe("tools/ToolPanZoom", () => {
  beforeEach(() => {
    cy.visit("/").get('[data-test="menu-bottom-tool--pan-zoom"]').click();
  });

  it("zoom in using the control icons", () => {
    cy.get('[data-test="grapher--field-rect"]').then((field) => {
      const oldWidth = field.get(0).getBoundingClientRect().width;

      // eslint-disable-next-line cypress/require-data-selectors
      cy.get("#svg-pan-zoom-zoom-in").click().click();

      cy.get('[data-test="grapher--field-rect"]')
        .then((field) => {
          cy.wrap(field.get(0).getBoundingClientRect().width);
        })
        .should("greaterThan", oldWidth);
    });
  });

  it("shift grapher to the left by panning", () => {
    cy.get('[data-test="grapher--field-rect"]').then((field) => {
      const oldX = field.get(0).getBoundingClientRect().x;
      cy.mousedownGrapher(24, 2);
      cy.mousemoveGrapher(8, 2);
      cy.mouseupGrapher(8, 2);

      cy.get('[data-test="grapher--field-rect"]')
        .then((field) => {
          cy.wrap(field.get(0).getBoundingClientRect().x);
        })
        .should("lessThan", oldX);
    });
  });
});
