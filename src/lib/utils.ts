import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ---------- types ----------
export type TreeItem = string | [string, ...TreeItem[]];

// ---------- helpers ----------
/**
 * Build a *real* tree (objects that point to each other) from the flat list.
 * Each node is either:
 *   { type: 'file', name: string }
 *   { type: 'dir',  name: string, children: Node[] }
 */
interface FileNode {
  type: "file";
  name: string;
}
interface DirNode {
  type: "dir";
  name: string;
  children: Node[];
}
type Node = FileNode | DirNode;

function buildTree(files: Record<string, string>): DirNode {
  const root: DirNode = { type: "dir", name: "", children: [] };

  for (const [path] of Object.entries(files).sort()) {
    const parts = path.split("/");
    let cursor = root;

    for (let i = 0; i < parts.length; i++) {
      const name = parts[i];
      const isLast = i === parts.length - 1;

      let child = cursor.children.find((c) => c.name === name);
      if (!child) {
        child = isLast
          ? { type: "file", name }
          : { type: "dir", name, children: [] };
        cursor.children.push(child);
      }

      if (child.type === "dir") cursor = child;
    }
  }
  return root;
}

/**
 * Turn the tree into the compact nested-array format the TreeView expects.
 */
function toTreeItems(node: Node): TreeItem {
  if (node.type === "file") return node.name;

  const kids = node.children.map(toTreeItems);
  return kids.length === 1 && typeof kids[0] === "string"
    ? [node.name, kids[0]] // collapse single-file folders
    : [node.name, ...kids];
}

// ---------- public API ----------
export function convertFilesToTreeItems(
  files: Record<string, string>
): TreeItem[] {
  const tree = buildTree(files);
  return tree.children.map(toTreeItems);
}
