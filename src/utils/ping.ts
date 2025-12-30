
// src/utils/ping.ts
type MinimalPhoenixState = { data?: { setup?: Record<string, unknown> } };

export const ping = (_state?: MinimalPhoenixState): 'pong' => {
  // eventueel validation of logging; nu gewoon health check:
  return 'pong';
};

export default ping;
