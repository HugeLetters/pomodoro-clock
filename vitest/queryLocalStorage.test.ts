import queryLocalStorage, { localStorageKey } from "../src/queryLocalStorage";
import { vi } from "vitest";
import pomodoroList from "../fixtures/pomodoroList";

describe("local storage queries", () => {
  beforeEach(ctx => {
    ctx.localStorageParsedfixture = pomodoroList;

    vi.stubGlobal("localStorage", {
      storage: { [localStorageKey]: JSON.stringify(ctx.localStorageParsedfixture) },
      getItem: function (key) {
        return this.storage[key] ?? null;
      },
      setItem: function (key, item) {
        this.storage[key] = item;
      },
      removeItem: function (key) {
        delete this.storage[key];
      },
      clear: function () {
        this.storage = {};
      },
    } satisfies {
      storage: Record<string, string | undefined>;
      getItem: (key: string) => string | null;
      setItem: (key: string, item: string) => void;
      removeItem: (key: string) => void;
      clear: () => void;
    });
  });

  it.concurrent("Correct data passes as is", ({ expect, localStorageParsedfixture }) => {
    expect(queryLocalStorage()).to.be.deep.equal(localStorageParsedfixture);
  });

  it.concurrent(
    "Type coercion on some data fields passes",
    ({ expect, localStorageParsedfixture }) => {
      Object.assign(localStorageParsedfixture[1], { name: 5, session: "5" });
      localStorage.setItem(localStorageKey, JSON.stringify(localStorageParsedfixture));
      Object.assign(localStorageParsedfixture[1], { name: "5", session: 5 });
      expect(queryLocalStorage()).to.be.deep.equal(localStorageParsedfixture);
    }
  );

  it.concurrent("When localStorage is empty it returns empty array", ({ expect }) => {
    localStorage.clear();
    expect(queryLocalStorage()).to.be.deep.equal([]);
  });

  it.concurrent(
    "If localStorage is not the correct shape it returns empty array",
    ({ expect, localStorageParsedfixture }) => {
      localStorage.setItem(localStorageKey, JSON.stringify("hehe"));
      expect(queryLocalStorage()).to.be.deep.equal([]);

      localStorage.setItem(localStorageKey, JSON.stringify(34534534));
      expect(queryLocalStorage()).to.be.deep.equal([]);

      localStorage.setItem(localStorageKey, JSON.stringify(localStorageParsedfixture[0]));
      expect(queryLocalStorage()).to.be.deep.equal([]);
    }
  );

  it.concurrent(
    "If localStorage is an array then incorrect elements get stripped",
    ({ expect, localStorageParsedfixture }) => {
      const result = [localStorageParsedfixture[0], localStorageParsedfixture[2]];
      Object.assign(localStorageParsedfixture[1], { session: 5.5 });
      localStorage.setItem(localStorageKey, JSON.stringify(localStorageParsedfixture));
      expect(queryLocalStorage()).to.be.deep.equal(result);

      Object.assign(localStorageParsedfixture, { 1: "lol" });
      localStorage.setItem(localStorageKey, JSON.stringify(localStorageParsedfixture));
      expect(queryLocalStorage()).to.be.deep.equal(result);
    }
  );
});
