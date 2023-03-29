import type { ShadowComponent, WebComponent } from "./webComponent.js";

function addGlobalStyle(webComponent: ShadowComponent) {
  const style = document.getElementById("global-style");
  if (!style) throw new Error("Global style was not specified");
  webComponent.shadowRoot?.appendChild(style.cloneNode(true));
}

function addCustomStyle(webComponent: ShadowComponent | WebComponent, href: string) {
  const style = document.createElement("link");
  style.setAttribute("href", href);
  style.setAttribute("rel", "stylesheet");
  webComponent.shadowRoot?.appendChild(style);
}
