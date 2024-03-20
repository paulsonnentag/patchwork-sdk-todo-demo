import { next as A } from "@automerge/automerge";
import { AutomergeUrl } from "@automerge/automerge-repo";

export type DocHandle<T> = {
  change(fn: (doc: T) => void): void;

  heads: A.Heads;
  latestHeads: A.Heads;

  withDeletedValues<T>(value: T): T;

  hasBeenAdded<T>(value: T, key?: string): boolean;

  hasBeenDeleted<T>(value: T, key?: string): boolean;

  hasChanged<T>(value: T, key?: string): boolean;
};

export const useHandle = <T>(
  url: AutomergeUrl,
  options: { supportsDiffs?: boolean } = {}
): DocHandle<T> => {
  return null as any as DocHandle<T>;
};

export const useDocument = <T>(handle: DocHandle<T>): T => {
  return null as T;
};
