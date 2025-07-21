import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import Hint from "./hint";
import CodeView from "./code-view";
import { Button } from "./ui/button";
import { CopyIcon, CopyCheckIcon } from "lucide-react";

import { useState, useMemo, Fragment, useCallback } from "react";
import { FileCollection } from "@/lib/types";
import { convertFilesToTreeItems } from "@/lib/utils";
import TreeView from "./tree-view";

// Get Language From Extension
function getLanguageFromExtension(filename: string): string {
  const extension = filename.split(".").pop()?.toLocaleLowerCase();

  return extension || "text";
}

// File Breadcrumb
interface FileBreadcrumbProps {
  filePath: string;
}

function FileBreadcrumb({ filePath }: FileBreadcrumbProps) {
  const pathSegments = filePath.split("/");
  const maxSegments = 3;

  const renderBreadcrumbItems = () => {
    if (pathSegments.length <= maxSegments) {
      return pathSegments.map((segment, idx) => {
        const isLast = idx === pathSegments.length - 1;

        return (
          <Fragment key={idx}>
            <BreadcrumbItem>
              {isLast ? (
                <BreadcrumbPage className="text-sm font-medium">
                  {segment}
                </BreadcrumbPage>
              ) : (
                <span className="text-muted-foreground  ">{segment}</span>
              )}
            </BreadcrumbItem>
            {!isLast && <BreadcrumbSeparator />}
          </Fragment>
        );
      });
    } else {
      const firstSegments = pathSegments[0];
      const lastSegments = pathSegments[pathSegments.length - 1];

      return (
        <>
          <BreadcrumbItem>
            <span className="text-muted-foreground">{firstSegments}</span>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbEllipsis />
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-medium">
                {lastSegments}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbItem>
        </>
      );
    }
  };

  return (
    <Breadcrumb>
      <BreadcrumbList>{renderBreadcrumbItems()}</BreadcrumbList>
    </Breadcrumb>
  );
}

// File Explorer
interface FileExplorerProps {
  files: FileCollection;
}

export default function FileExplorer({ files }: FileExplorerProps) {
  const [copied, setCopied] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(() => {
    const fileKeys = Object.keys(files);
    return fileKeys.length > 0 ? fileKeys[0] : null;
  });

  const fileTree = useMemo(() => {
    return convertFilesToTreeItems(files);
  }, [files]);

  const handleFileSelect = useCallback(
    (filePath: string) => {
      if (files[filePath]) {
        setSelectedFile(filePath);
      }
    },
    [files]
  );

  const handleCopy = useCallback(() => {
    if (!selectedFile) return;
    const fileContent = files[selectedFile];
    navigator.clipboard.writeText(fileContent);
    setCopied(true);
  }, [selectedFile, files]);

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel
        defaultSize={20}
        minSize={15}
        maxSize={30}
        className="bg-sidebar"
      >
        <TreeView
          data={fileTree}
          value={selectedFile}
          onSelect={handleFileSelect}
        />
      </ResizablePanel>
      <ResizableHandle className="hover:bg-primary transition-colors" />
      <ResizablePanel defaultSize={80} minSize={70} maxSize={85} className="">
        {selectedFile && files[selectedFile] ? (
          <div className="h-full w-full flex flex-col">
            <div className="border-b bg-sidebar px-4 py-2 flex justify-between items-center gap-x-2">
              <FileBreadcrumb filePath={selectedFile} />
              <Hint text="copy to clipboard" side="bottom">
                <Button
                  variant="outline"
                  size="icon"
                  className="ml-auto"
                  disabled={copied}
                  onClick={handleCopy}
                >
                  {copied ? <CopyCheckIcon /> : <CopyIcon />}
                </Button>
              </Hint>
            </div>
            <div className="flex-1 overflow-y-auto">
              <CodeView
                code={files[selectedFile]}
                language={getLanguageFromExtension(selectedFile)}
              />
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            <p>select a file to view</p>
          </div>
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
