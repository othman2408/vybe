import Prism from "prismjs";
import { useEffect } from "react";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-css";
import "prismjs/components/prism-scss";
import "prismjs/components/prism-json";
import "prismjs/components/prism-bash";

import "./code-theme.css";

interface CodeViewProps {
  code: string;
  language: string;
}

export default function CodeView({ code, language }: CodeViewProps) {
  useEffect(() => {
    Prism.highlightAll();
  }, [code]);

  return (
    <pre className="p-2 bg-transparent border-none rounded-none m-0 text-sm">
      <code className={`language-${language}`}>{code}</code>
    </pre>
  );
}
