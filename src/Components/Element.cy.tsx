import { useAtomValue } from "jotai";
import PomodoroListElement from "./Element";
import pomodoroListFixture from "../../fixtures/pomodoroList";
import { pomodoroListAtom } from "../atom.jotai";

describe("<PomodoroListElement />", () => {
  beforeEach(() => {
    function Wrapper() {
      const pomodoroList = useAtomValue(pomodoroListAtom);

      return pomodoroList.length ? (
        <PomodoroListElement
          pomodoro={pomodoroList[1]}
          deleteMe={() => null}
          selectMe={() => null}
        />
      ) : (
        <></>
      );
    }
    cy.mount(<Wrapper />);
  });

  describe("Correct input can be saved/disacrded", () => {
    beforeEach(() => {
      cy.inputSession(37);
    });

    it("press enter - new name gets saved", () => {
      cy.get("@input").trigger("keydown", { key: "Enter" });
      cy.get("@inputValue").then(value => {
        cy.get("span").contains(value.toString());
        cy.wrap(value).as("output");
      });
      cy.checkSessionInput();
    });

    it("blur - new name gets discarded", () => {
      cy.get("@input").blur();
      cy.get("span").contains(pomodoroListFixture[1].session);
      cy.wrap(pomodoroListFixture[1].session).as("output");
      cy.checkSessionInput();
    });
  });

  describe("Incorrect input gets discarded regardless", () => {
    beforeEach(() => {
      cy.inputSession("dfgfsfgdf");
    });

    it("press enter - value gets discarded", () => {
      cy.get("@input").trigger("keydown", { key: "Enter" });
      cy.get("span").contains(pomodoroListFixture[1].session);
      cy.wrap(pomodoroListFixture[1].session).as("output");
      cy.checkSessionInput();
    });

    it("blur - value gets discarded", () => {
      cy.get("@input").blur();
      cy.get("span").contains(pomodoroListFixture[1].session);
      cy.wrap(pomodoroListFixture[1].session).as("output");
      cy.checkSessionInput();
    });
  });
});
