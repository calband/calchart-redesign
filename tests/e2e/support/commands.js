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
  return cy.get('[data-test="grapher--wrapper"]')
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
 * Generate the commands:
 *  - clickGrapher
 *  - mousemoveGrapher
 *  - mousedownGrapher
 *  - mouseupGrapher
 */
const grapherCommands = [
  'click',
  'mousemove',
  'mousedown',
  'mouseup',
];

grapherCommands.forEach(command => {
  Cypress.Commands.add(`${command}Grapher`, (x, y) => {
    return grapherMouseCommand(command, x, y);
  });
});
