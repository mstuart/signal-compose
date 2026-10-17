import test from "ava";
import { timeoutSignal } from "./index.js";

test("timeoutSignal rejects invalid and overflowing durations", (t) => {
  const parent = new AbortController();
  for (const duration of [
    Number.NaN,
    Number.POSITIVE_INFINITY,
    -1,
    "10",
    2 ** 31,
  ]) {
    t.throws(() => timeoutSignal(parent.signal, duration), {
      instanceOf: RangeError,
    });
  }
  const signal = timeoutSignal(parent.signal, 2_147_483_647);
  t.false(signal.aborted);
  parent.abort();
});

test("timeoutSignal validates durations even for an aborted parent", (t) => {
  t.throws(() => timeoutSignal(AbortSignal.abort(), Number.POSITIVE_INFINITY), {
    instanceOf: RangeError,
  });
});
