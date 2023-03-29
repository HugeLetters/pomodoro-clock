export class WebComponent extends HTMLElement {
  constructor(template: HTMLTemplateElement) {
    super();
    this.appendChild(template.content.cloneNode(true));
  }
}

export class ShadowComponent extends HTMLElement {
  constructor(template: HTMLTemplateElement) {
    super();
    this.attachShadow({ mode: "open" });
    if (!this.shadowRoot) throw new Error("No shadow row exists on element");
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}
