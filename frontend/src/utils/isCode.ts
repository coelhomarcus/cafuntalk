export default function isCode(text: string): null | string[] {
  const match = text.match(/^```(\w+)?\n([\s\S]*?)```$/);

  if (match) {
    const lang = checkLang(match);
    console.log(lang, match[2]);
    return [lang, match[2]];
  }

  return null;
}

function checkLang(match: string[]): string {
  const langMap: Record<string, string> = {
    js: "javascript",
    javascript: "javascript",
    jsx: "javascript",
    c: "c",
    csharp: "csharp",
    "c#": "csharp",
    cpp: "cpp",
    "c++": "cpp",
    python: "python",
    py: "python",
    typescript: "typescript",
    ts: "typescript",
    tsx: "typescript",
    java: "java",
    swift: "swift",
    sql: "sql",
    go: "go",
    golang: "go",
  };

  return langMap[match[1]] || "none";
}
