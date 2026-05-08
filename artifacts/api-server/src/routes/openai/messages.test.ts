import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Contract-style test for the POST /openai/conversations/:id/messages endpoint.
 *
 * The previous version of this file only compared hard-coded constants, which
 * meant the tests still passed even if the real validation was removed.
 *
 * These assertions inspect the actual route implementation in index.ts and
 * verify that:
 * - the messages route exists
 * - it checks that the conversation exists before inserting a message
 * - it returns HTTP 404 when the conversation does not exist
 */

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const routeFilePath = path.join(currentDir, "index.ts");
const routeSource = fs.readFileSync(routeFilePath, "utf8");

function getPostConversationMessagesRouteSource() {
  const routeStartPattern =
    /(?:^|\n)\s*(?:\w+\.)?post\(\s*["'`](?:\/openai)?\/conversations\/:id\/messages["'`]/m;
  const routeStartMatch = routeSource.match(routeStartPattern);

  assert.ok(
    routeStartMatch,
    "Expected POST /openai/conversations/:id/messages route to be defined in index.ts"
  );

  const routeStartIndex = routeStartMatch.index ?? 0;
  const remainingSource = routeSource.slice(routeStartIndex + 1);
  const nextRoutePattern =
    /(?:^|\n)\s*(?:\w+\.)?(?:get|post|put|patch|delete)\(\s*["'`]/m;
  const nextRouteMatch = remainingSource.match(nextRoutePattern);

  const routeEndIndex = nextRouteMatch?.index
    ? routeStartIndex + 1 + nextRouteMatch.index
    : routeSource.length;

  return routeSource.slice(routeStartIndex, routeEndIndex);
}

function firstMatchIndex(source: string, patterns: RegExp[]) {
  const indexes = patterns
    .map((pattern) => source.search(pattern))
    .filter((index) => index >= 0);

  return indexes.length > 0 ? Math.min(...indexes) : -1;
}

test("POST /openai/conversations/:id/messages validates the conversation before inserting", () => {
  const routeImplementation = getPostConversationMessagesRouteSource();

  const conversationLookupIndex = firstMatchIndex(routeImplementation, [
    /\bselect\b[\s\S]{0,200}\bfrom\b[\s\S]{0,100}\bconversations\b/i,
    /\bfrom\s*\(\s*["'`]conversations["'`]\s*\)/i,
    /\bconversation[s]?\b[\s\S]{0,120}\bwhere\b[\s\S]{0,80}\bid\b/i,
  ]);
  const insertMessageIndex = firstMatchIndex(routeImplementation, [
    /\binsert\s+into\s+messages\b/i,
    /\binto\s*\(\s*["'`]messages["'`]\s*\)/i,
    /\bmessages\b[\s\S]{0,120}\bvalues\b/i,
  ]);

  assert.ok(
    conversationLookupIndex >= 0,
    "Expected the route to query for the conversation before creating a message"
  );
  assert.ok(
    insertMessageIndex >= 0,
    "Expected the route to insert a message after validation"
  );
  assert.ok(
    conversationLookupIndex < insertMessageIndex,
    "Conversation existence must be checked before attempting to insert the message"
  );
});

test("POST /openai/conversations/:id/messages returns 404 for a non-existent conversation", () => {
  const routeImplementation = getPostConversationMessagesRouteSource();

  const missingConversationBranchIndex = firstMatchIndex(routeImplementation, [
    /Conversation not found/i,
    /\bstatus\s*\(\s*404\s*\)/i,
    /\b404\b[\s\S]{0,120}\berror\b/i,
  ]);
  const insertMessageIndex = firstMatchIndex(routeImplementation, [
    /\binsert\s+into\s+messages\b/i,
    /\binto\s*\(\s*["'`]messages["'`]\s*\)/i,
    /\bmessages\b[\s\S]{0,120}\bvalues\b/i,
  ]);

  assert.ok(
    /\b404\b/.test(routeImplementation),
    "Expected the route to explicitly return HTTP 404 when the conversation does not exist"
  );
  assert.ok(
    missingConversationBranchIndex >= 0,
    "Expected a missing-conversation branch in the route implementation"
  );
  assert.ok(
    insertMessageIndex === -1 || missingConversationBranchIndex < insertMessageIndex,
    "The 404 missing-conversation response must be handled before message insertion"
  );
});
