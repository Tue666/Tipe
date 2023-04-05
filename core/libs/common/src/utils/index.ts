export const sleep = async (ms: number) =>
  ms ? new Promise<void>((resolve) => setTimeout(resolve, ms)) : undefined;
