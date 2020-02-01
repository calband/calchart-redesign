// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add(
//   "drag",
//   { prevSubject: 'element'},
//   (subject, options) => { ... }
// )
//
//
// -- This is a dual command --
// Cypress.Commands.add(
//   "dismiss",
//   { prevSubject: 'optional'},
//   (subject, options) => { ... }
// )
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

// leaving this in as clues on how to get file uploading working in the future
// see issue [#50 Figure out how to do LoadShow in e2e testing].
// Cypress.Commands.add('upload_file', (fileName, fileType, selector) => {
//     cy.get(selector).then(subject => {
//         cy.fixture(fileName, 'hex').then((fileHex) => {
//             const fileBytes = hexStringToByte(fileHex);
//             const testFile = new File([fileBytes], fileName, {
//                 type: fileType
//             });
//             const dataTransfer = new DataTransfer()
//             const el = subject[0]
//             dataTransfer.items.add(testFile)
//             el.files = dataTransfer.files
//         })
//     })
// })

// // UTILS
// function hexStringToByte(str) {
//     if (!str) {
//         return new Uint8Array();
//     }
//     var a = [];
//     for (var i = 0, len = str.length; i < len; i += 2) {
//         a.push(parseInt(str.substr(i, 2), 16));
//     }
//     return new Uint8Array(a);
// }

/**
 * Helper command for mouse events on the grapher
 */
const grapherMouseCommand = (eventName, x, y) => {
  return cy.get('.grapher--wrapper')
    .then((wrapper) => {
      const matrix = wrapper.get(0).getCTM();

      return cy.get('[data-test="grapher--svg"]')
        .then((svg) => {
          const point = svg.get(0).createSVGPoint();
          point.x = x;
          point.y = y;

          const convertedPoint = point.matrixTransform(matrix);

          cy.get('[data-test="grapher--svg"]')
            .trigger(eventName, convertedPoint.x, convertedPoint.y);
        });
    });
};

/**
 * Converts the field X/Y into the click X/Y coordinates
 */
Cypress.Commands.add('clickGrapher', (x, y) => {
  return grapherMouseCommand('click', x, y);
});

/**
 * Converts the field X/Y into the mousemove X/Y coordinates
 */
Cypress.Commands.add('mousemoveGrapher', (x, y) => {
  return grapherMouseCommand('mousemove', x, y);
});

/**
 * Converts the field X/Y into the mousedown X/Y coordinates
 */
Cypress.Commands.add('mousedownGrapher', (x, y) => {
  return grapherMouseCommand('mousedown', x, y);
});

/**
 * Converts the field X/Y into the mousedown X/Y coordinates
 */
Cypress.Commands.add('mouseupGrapher', (x, y) => {
  return grapherMouseCommand('mouseup', x, y);
});
