describe("tools/ToolSingleDot", () => {
  beforeEach(() => {
    cy.visit("/").get('[data-test="menu-bottom-tool--add-rm"]').click();
  });

  it("clicking adds, then removes a dot", () => {
    cy.get('[data-test="grapher-dots--dot"]').should("not.exist");

    cy.mousedownGrapher(12, 8).mouseupGrapher(12, 8);

    cy.get('[data-test="grapher-dots--dot"]')
      .should("have.length", 1)
      .should("have.attr", "cx", "12")
      .should("have.attr", "cy", "8");

    cy.get('[data-test="grapher-dots--dottext"]')
      .should("have.length", 1)
      .should("have.attr", "x", "12")
      .should("have.attr", "y", "7");
    cy.get('[data-test="grapher-dots--dottext"]').contains("0");

    cy.mousedownGrapher(12, 8).mouseupGrapher(12, 8);

    cy.get('[data-test="grapher-dots--dot"]').should("not.exist");
  });

  it("After panning and zooming, adding a dot is still accurate", () => {
    cy.get('[data-test="menu-bottom-tool--select-box-move').click();

    // eslint-disable-next-line cypress/require-data-selectors
    cy.get("#svg-pan-zoom-zoom-out").click().click();

    cy.mousedownGrapher(8, 2);
    cy.mousemoveGrapher(24, 2);
    cy.mouseupGrapher(24, 2);

    cy.get('[data-test="menu-bottom-tool--add-rm"]').click();

    cy.mousedownGrapher(12, 8).mouseupGrapher(12, 8);

    cy.get('[data-test="grapher-dots--dot"]')
      .should("have.length", 1)
      .should("have.attr", "cx", "12")
      .should("have.attr", "cy", "8");
    cy.get('[data-test="grapher-dots--dottext"]')
      .should("have.length", 1)
      .should("have.attr", "x", "12")
      .should("have.attr", "y", "7");
  });

  it("clicking multiple dots", () => {
    cy.get('[data-test="grapher-dots--dot"]').should("not.exist");

    cy.mousedownGrapher(2, 0).mouseupGrapher(2, 0);
    cy.mousedownGrapher(2, 2).mouseupGrapher(2, 2);
    cy.mousedownGrapher(2, 4).mouseupGrapher(2, 4);
    cy.mousedownGrapher(2, 6).mouseupGrapher(2, 6);
    cy.mousedownGrapher(2, 8).mouseupGrapher(2, 8);

    cy.get('[data-test="grapher-dots--dot"]')
      .should("have.length", 5)
      .each((dot, index) => {
        cy.wrap(dot)
          .should("have.attr", "cx", "2")
          .should("have.attr", "cy", `${index * 2}`);
      });

    cy.mousedownGrapher(2, 0).mouseupGrapher(2, 0);
    cy.mousedownGrapher(2, 8).mouseupGrapher(2, 8);

    cy.get('[data-test="grapher-dots--dot"]')
      .should("have.length", 3)
      .each((dot, index) => {
        cy.wrap(dot)
          .should("have.attr", "cx", "2")
          .should("have.attr", "cy", `${(index + 1) * 2}`);
      });
  });

  it("mousemove sets tool dots", () => {
    cy.get('[data-test="grapher-tool--dot"]').should("not.exist");

    cy.mousemoveGrapher(4, 6);

    cy.get('[data-test="grapher-tool--dot"]')
      .should("have.length", 1)
      .should("have.attr", "cx", "4")
      .should("have.attr", "cy", "6");

    cy.mousemoveGrapher(6, 8);

    cy.get('[data-test="grapher-tool--dot"]')
      .should("have.length", 1)
      .should("have.attr", "cx", "6")
      .should("have.attr", "cy", "8");
  });
});
