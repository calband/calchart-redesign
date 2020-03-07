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

/// <reference types="cypress" />

// Disable no-unused-vars because it is used in the return type of getStore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Store } from 'vuex';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { CalChartState } from '@/store';

// Must be declared global to be detected by typescript (allows import/export)
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable<Subject> {
      /**
       * Custom command to trigger the 'click' event on the grapher at the
       * specified coordinates
       */
      clickGrapher(x: number, y: number): Chainable<Element>;

      /**
       * Custom command to trigger the 'mousemove' event on the grapher at the
       * specified coordinates
       */
      mousemoveGrapher(x: number, y: number): Chainable<Element>;

      /**
       * Custom command to trigger the 'mousedown' event on the grapher at the
       * specified coordinates
       */
      mousedownGrapher(x: number, y: number): Chainable<Element>;

      /**
       * Custom command to trigger the 'mouseup' event on the grapher at the
       * specified coordinates
       */
      mouseupGrapher(x: number, y: number): Chainable<Element>;

      /**
       * Gets the vuex store from window.app
       */
      getStore(): Chainable<Store<CalChartState>>;
    }
  }
}

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
const grapherMouseCommand = (
  eventName: string,
  x: number,
  y: number,
): Cypress.Chainable => {
  return cy.get('[data-test="grapher--wrapper"]')
    .then((wrapper) => {
      const matrix = ((wrapper.get(0) as unknown) as SVGGElement).getCTM();
      if (!matrix) {
        return;
      }

      return cy.get('[data-test="grapher--svg"]')
        .then((svg) => {
          const point = ((svg.get(0) as unknown) as SVGSVGElement)
            .createSVGPoint();
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
  Cypress.Commands.add(`${command}Grapher`, (x: number, y: number) => {
    return grapherMouseCommand(command, x, y);
  });
});

/**
 * Gets the vuex store from window.app
 */
Cypress.Commands.add('getStore', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (cy.window() as any).its('app.$store');
});
