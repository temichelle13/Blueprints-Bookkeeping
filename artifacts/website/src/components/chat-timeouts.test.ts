import assert from "node:assert/strict";
import test from "node:test";
import {
  ChatTimeoutError,
  fetchWithTimeout,
  isTimeoutOrAbortError,
  readStreamChunkWithTimeout,
} from "./chat-timeouts";

test("fetchWithTimeout aborts stalled chat requests with a timeout error", async () => {
  const originalFetch = globalThis.fetch;

  globalThis.fetch = ((_input: RequestInfo | URL, init?: RequestInit) => {
    return new Promise<Response>((_resolve, reject) => {
      init?.signal?.addEventListener("abort", () => {
        reject(new DOMException("The operation was aborted.", "AbortError"));
      });
    });
  }) as typeof fetch;

  try {
    await assert.rejects(
      () => fetchWithTimeout("/api/openai/conversations", { method: "POST" }, 1),
      ChatTimeoutError,
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("readStreamChunkWithTimeout cancels stalled streams and reports timeout", async () => {
  let cancelled = false;
  const stream = new ReadableStream<Uint8Array>({
    cancel() {
      cancelled = true;
    },
  });
  const reader = stream.getReader();

  await assert.rejects(
    () => readStreamChunkWithTimeout(reader, 1),
    ChatTimeoutError,
  );
  assert.equal(cancelled, true);
});

test("isTimeoutOrAbortError identifies timeout and abort failures", () => {
  assert.equal(isTimeoutOrAbortError(new ChatTimeoutError("timeout")), true);
  assert.equal(
    isTimeoutOrAbortError(new DOMException("aborted", "AbortError")),
    true,
  );
  assert.equal(isTimeoutOrAbortError(new Error("validation")), false);
});
