import type { mount } from "cypress/react18";

declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
      inputSession: (value: number | string) => void;
      checkSessionInput: () => void;
    }
  }
}
