// ***********************************************************
// This example support/component.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import "./commands";
import "./index.css";
// Alternatively you can use CommonJS syntax:
// require('./commands')

import { mount } from "cypress/react18";
import { useSetAtom } from "jotai";
import { useEffect } from "react";
import { localStorageKey, queryLocalStorage } from "../../src/queryLocalStorage";
import { pomodoroListAtom } from "../../src/atom.jotai";
import pomodoroListFixture from "../../fixtures/pomodoroList";

// Augment the Cypress namespace to include type definitions for
// your custom command.
// Alternatively, can be defined in cypress/support/component.d.ts
// with a <reference path="./component" /> at the top of your spec.

Cypress.Commands.add("mount", component => {
  localStorage.setItem(localStorageKey, JSON.stringify(pomodoroListFixture));
  function Wrapper({ children }: { children: React.ReactNode }) {
    const dispatchPomodoroList = useSetAtom(pomodoroListAtom);
    useEffect(() => {
      dispatchPomodoroList({ type: "SET", payload: queryLocalStorage() });
    }, [dispatchPomodoroList]);

    return <>{children}</>;
  }

  return mount(<Wrapper>{component}</Wrapper>);
});
Cypress.Commands.add("inputSession", value => {
  cy.get("span").contains("SESSION").next().next().as("button").click();
  cy.wrap(value)
    .as("inputValue")
    .then(value => {
      cy.focused().clear().type(value.toString()).as("input");
    });
});
Cypress.Commands.add("checkSessionInput", () => {
  cy.get("@button").click();
  cy.get("@output").then(value => {
    cy.focused().invoke("val").should("equal", value.toString());
  });
});
// Example use:
// cy.mount(<MyComponent />)
