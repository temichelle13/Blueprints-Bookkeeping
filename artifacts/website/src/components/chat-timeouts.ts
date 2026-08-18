export class ChatTimeoutError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ChatTimeoutError";
  }
}

export const isAbortError = (error: unknown) =>
  error instanceof DOMException && error.name === "AbortError";

export const isTimeoutOrAbortError = (error: unknown) =>
  error instanceof ChatTimeoutError || isAbortError(error);

export async function fetchWithTimeout(
  input: RequestInfo | URL,
  init: RequestInit,
  timeoutMs: number,
) {
  const controller = new AbortController();
  const timeout = globalThis.setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } catch (error) {
    if (isAbortError(error)) {
      throw new ChatTimeoutError("Chat request timed out");
    }
    throw error;
  } finally {
    globalThis.clearTimeout(timeout);
  }
}

export async function readStreamChunkWithTimeout(
  reader: ReadableStreamDefaultReader<Uint8Array>,
  timeoutMs: number,
) {
  let timedOut = false;
  const timeout = globalThis.setTimeout(() => {
    timedOut = true;
    void reader.cancel();
  }, timeoutMs);

  try {
    const chunk = await reader.read();
    if (timedOut) {
      throw new ChatTimeoutError("Chat stream stalled");
    }
    return chunk;
  } catch (error) {
    if (timedOut || isAbortError(error)) {
      throw new ChatTimeoutError("Chat stream stalled");
    }
    throw error;
  } finally {
    globalThis.clearTimeout(timeout);
  }
}
