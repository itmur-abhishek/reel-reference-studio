import { describe, expect, it } from "vitest";
import { FLAVORS, direction, wrap } from "./flavors";

describe("flavours", () => {
  it("keeps all five client flavours in order", () => {
    expect(FLAVORS.map((f) => f.name)).toEqual(["Blueberry", "Lime & Mint", "Mango", "Green Apple", "Orange"]);
  });
  it("wraps past the last flavour back to the first", () => {
    expect(wrap(5)).toBe(0);
    expect(wrap(-1)).toBe(4);
  });
  it("animates the short way round", () => {
    expect(direction(4, 0)).toBe(1);
    expect(direction(0, 4)).toBe(-1);
  });
});
