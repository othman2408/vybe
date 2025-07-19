export interface AgentState {
  summary: string;
  files: { [page: string]: string };
}

export type FileCollection = {
  [path: string]: string;
};

export type TreeItem = string | [string, ...TreeItem[]];
