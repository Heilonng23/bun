import { describe, expect, test } from "bun:test";
import { tempDir } from "harness";
import { join } from "path";

// https://github.com/oven-sh/bun/issues/32686
describe.each(["./src/worker.ts", "../src/worker.ts", "/abs/path", "/$bunfs/root/worker", ".", "/"])(
  "define value %j is auto-quoted",
  value => {
    test("inlines as a string literal", async () => {
      using dir = tempDir("bun-build-define-32686", {
        "entry.ts": `declare const X: string; console.log(X);`,
      });
      const result = await Bun.build({
        entrypoints: [join(String(dir), "entry.ts")],
        define: { X: value },
      });
      expect(result.success).toBe(true);
      const out = await result.outputs[0].text();
      expect(out).toContain(JSON.stringify(value));
    });
  },
);
