describe("components/menu-left/MenuLeft", () => {
  it("Creating and editing two stuntsheets", () => {
    cy.visit("/");

    // Edit the first stuntsheet to have title "Sunset" and 2 beats
    cy.get('[data-test="menu-left--ss-modal"]').should("not.be.visible");

    cy.get('[data-test="menu-left--ss"]')
      .eq(0)
      .find(".stuntsheet-edit")
      .should("be.visible")
      .click();

    cy.get('[data-test="menu-left--ss-modal"]').should("be.visible");

    cy.get('[data-test="ss-modal--title"]')
      .should("have.value", "Stuntsheet 1")
      .clear()
      .type("Sunset");

    cy.get('[data-test="ss-modal--beats"]')
      .should("have.value", "16")
      .clear()
      .type("2");

    cy.get('[data-test="ss-modal--close"]').click();

    // Check that the stuntsheet title and beats have been updated
    cy.get('[data-test="menu-left--ss"]')
      .should("have.length", 1)
      .eq(0)
      .should("have.class", "is-active")
      .should("contain", "Sunset");

    cy.get('[data-test="menu-left--beat"]').should("include.text", "Hup! / 2");

    // Add a stuntsheet dot (4, 4) to the first stuntsheet
    cy.get('[data-test="grapher-dots--dot"]').should("not.exist");

    cy.get('[data-test="menu-bottom-tool--add-rm"]')
      .click()
      .mousedownGrapher(4, 4)
      .mouseupGrapher(4, 4);

    cy.get('[data-test="grapher-dots--dot"]')
      .should("have.length", 1)
      .should("have.attr", "transform", "translate(4, 4)");

    // Add new stuntsheet
    cy.get('[data-test="menu-left--add-ss"]').click();

    cy.get('[data-test="menu-left--ss"]')
      .should("have.length", 2)
      .eq(1)
      .should("have.class", "is-active");

    // Edit the second stuntsheet to have title "Script YOLO" and 4 beats
    cy.get('[data-test="menu-left--ss"]')
      .eq(1)
      .find(".stuntsheet-edit")
      .should("be.visible")
      .click();

    cy.get('[data-test="menu-left--ss-modal"]').should("be.visible");

    cy.get('[data-test="ss-modal--title"]')
      .should("have.value", "Stuntsheet 2")
      .clear()
      .type("Script YOLO");

    cy.get('[data-test="ss-modal--beats"]')
      .should("have.value", "16")
      .clear()
      .type("4");

    cy.get('[data-test="ss-modal--close"]').click();

    // Check that the stuntsheet title and beats have been updated
    cy.get('[data-test="menu-left--ss"]')
      .should("have.length", 2)
      .eq(1)
      .should("have.class", "is-active")
      .should("contain", "Script YOLO");

    cy.get('[data-test="menu-left--beat"]').should("include.text", "Hup! / 4");

    // Add a stuntsheet dot (8, 8) to the first stuntsheet
    cy.get('[data-test="grapher-dots--dot"]').should("not.exist");

    cy.get('[data-test="menu-bottom-tool--add-rm"]')
      .click()
      .mousedownGrapher(8, 8)
      .mouseupGrapher(8, 8);

    cy.get('[data-test="grapher-dots--dot"]')
      .should("have.length", 1)
      .should("have.attr", "transform", "translate(8, 8)");

    // Decrement the beat to go to the first stuntsheet at beat 1 / 2
    cy.get('[data-test="menu-left--decrement-beat"]').click();

    cy.get('[data-test="menu-left--ss"]')
      .eq(0)
      .should("have.class", "is-active");

    cy.get('[data-test="menu-left--beat"]').should("include.text", "1 / 2");

    cy.get('[data-test="grapher-dots--dot"]')
      .should("have.length", 1)
      .should("have.attr", "transform", "translate(4, 4)");

    // Increment the beat to go the second stuntsheet at beat Hup! / 4
    cy.get('[data-test="menu-left--increment-beat"]').click();

    cy.get('[data-test="menu-left--ss"]')
      .eq(1)
      .should("have.class", "is-active");

    cy.get('[data-test="menu-left--beat"]').should("include.text", "Hup! / 4");

    cy.get('[data-test="grapher-dots--dot"]')
      .should("have.length", 1)
      .should("have.attr", "transform", "translate(8, 8)");
  });
});
