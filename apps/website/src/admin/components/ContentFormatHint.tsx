export function ContentFormatHint() {
  return (
    <p className="admin-hint">
      Body uses markdown: <code>##</code> section headings, <code>###</code> subsections,
      blank lines between paragraphs, <code>[anchor](https://…)</code> links, and fenced code
      blocks (<code>```bash</code>, <code>```text</code>, etc.) for commands and file trees.
      Do not use <code>*</code> or <code>**</code> for emphasis — only links render inline.
      Write in plain, everyday language (see{" "}
      <code>.cursor/skills/write-article/frameworks/_voice.md</code>). For{" "}
      <strong>diagrams</strong>, include one <code>```mermaid</code> fence. The reader
      preview below matches the public site.
    </p>
  );
}
