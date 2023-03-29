import { WebComponent } from "./webComponent.js";

class TestDiv extends WebComponent {
  constructor() {
    const template = document.getElementById("one") as HTMLTemplateElement;
    super(template);
  }
}

customElements.define("test-div", TestDiv);
