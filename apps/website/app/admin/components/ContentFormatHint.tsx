export function ContentFormatHint() {
  return (
    <p className="admin-hint">
      Body uses <code>C:</code> headings, <code>P1:</code> paragraphs, and
      outbound links as <code>[anchor](https://…)</code>. For{" "}
      <strong>diagrams</strong>: one global topic, <strong>one</strong>{" "}
      <code>```mermaid</code> block (prefer <code>stateDiagram-v2</code>,{" "}
      <code>direction TB</code>) — not Lüdecker/repo documentation. Save as
      draft first, then publish when ready.
    </p>
  );
}
