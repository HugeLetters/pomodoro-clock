import { localStorageKey } from "../../src/queryLocalStorage";
import pomodoroListFixture from "../../fixtures/pomodoroList";
import { pomodoroToastAlertID } from "../../src/Components/Clock";
import dayjs from "dayjs";

describe("Behavior of pomodoro clock timer", () => {
  const activePomodoro = pomodoroListFixture.find(({ selected }) => selected);
  if (!activePomodoro) throw new Error("Fixture doesn't contain active pomodoro");
  const session = activePomodoro.session * 60000;
  const pause = activePomodoro.pause * 60000;

  beforeEach(() => {
    cy.clock().as("clock");
    localStorage.setItem(localStorageKey, JSON.stringify(pomodoroListFixture));
    cy.visit("/");
    cy.get("button").contains("▶️").as("playButton").click();
    cy.get("svg text").as("pomodoroState");
    cy.get("button").contains("⏸️").as("pauseButton").prev().as("timerValue");
    cy.contains("POMODORO LIST")
      .find("span")
      .contains(activePomodoro.name)
      .parent()
      .parent()
      .as("activePomodoro");
    cy.get("@activePomodoro").find("span").contains("SESSION").next().next().as("editSession");
    cy.get("@activePomodoro").find("span").contains("PAUSE").next().next().as("editPause");
    cy.tick(1000);
  });

  it("Toast alert is displayed", () => {
    cy.tick(session + 1000);
    cy.get<Cypress.Clock>("@clock").invoke("restore");
    cy.get(`div#${pomodoroToastAlertID}`).should("be.visible").contains("Session over");
  });
  it("Pause and session state changes as expected while playing", () => {
    cy.tick(session + 1000);
    cy.get("@pomodoroState").should("contain", "Pause");
    cy.tick(pause + 1000);
    cy.get("@pomodoroState").should("contain", "Session");
    cy.tick(session + 1000);
    cy.get("@pomodoroState").should("contain", "Pause");
    cy.tick(pause + 1000);
    cy.get("@pomodoroState").should("contain", "Session");
  });
  it("Pause and session state stays the same while paused", () => {
    cy.tick(session + 1000);
    cy.get("@pauseButton").click();
    cy.get("@pomodoroState").should("contain", "Pause");
    cy.tick(pause + 1000);
    cy.get("@pomodoroState").should("contain", "Pause");
    cy.tick(session + 1000);
    cy.get("@playButton").click();
    cy.get("@pomodoroState").should("contain", "Pause");
    cy.tick(pause + 1000);
    cy.get("@pomodoroState").should("contain", "Session");
  });

  const value = 23;
  describe("Changing values while in session", () => {
    it("Changing session", () => {
      cy.get("@editSession").click();
      cy.tick(100);
      cy.focused().clear().type(value.toString()).trigger("keydown", { key: "Enter" });
      cy.get("@timerValue").contains(dayjs(value * 60000).format("mm:ss"));
      cy.get("@pomodoroState").should("contain", "Session");
    });
    it("Changing pause", () => {
      cy.get("@editPause").click();
      cy.tick(100);
      cy.focused().clear().type(value.toString()).trigger("keydown", { key: "Enter" });
      cy.get("@timerValue").contains(dayjs(session - 1000).format("mm:ss"));
      cy.get("@pomodoroState").should("contain", "Session");
    });
    it("Changing session from high value to low value last minute", () => {
      cy.get("@editSession").click();
      cy.tick(100);
      cy.focused().clear().type(value.toString()).trigger("keydown", { key: "Enter" });
      cy.tick(61000);
      cy.get("@editSession").click();
      cy.tick(100);
      cy.focused().clear().type("1").trigger("keydown", { key: "Enter" });
      cy.get("@timerValue").contains(dayjs(60000).format("mm:ss"));
      cy.get("@pomodoroState").should("contain", "Session");
    });
  });
  describe("Changing values while in pause", () => {
    beforeEach(() => {
      cy.tick(session + 1000);
    });
    it("Changing session", () => {
      cy.get("@editSession").click();
      cy.tick(100);
      cy.focused().clear().type(value.toString()).trigger("keydown", { key: "Enter" });
      cy.get("@timerValue").contains(dayjs(pause).format("mm:ss"));
      cy.get("@pomodoroState").should("contain", "Pause");
    });
    it("Changing pause", () => {
      cy.get("@editPause").click();
      cy.tick(100);
      cy.focused().clear().type(value.toString()).trigger("keydown", { key: "Enter" });
      cy.get("@timerValue").contains(dayjs(value * 60000).format("mm:ss"));
      cy.get("@pomodoroState").should("contain", "Pause");
    });
    it("Changing pause from high value to low value last minute", () => {
      cy.get("@editPause").click();
      cy.tick(100);
      cy.focused().clear().type(value.toString()).trigger("keydown", { key: "Enter" });
      cy.tick(61000);
      cy.get("@editPause").click();
      cy.tick(100);
      cy.focused().clear().type("1").trigger("keydown", { key: "Enter" });
      cy.get("@timerValue").contains(dayjs(60000).format("mm:ss"));
      cy.get("@pomodoroState").should("contain", "Pause");
    });
  });
});
