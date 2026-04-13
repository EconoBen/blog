export function CodeDivider({ label }: { label?: string }) {
  return (
    <div className="code-divider" aria-hidden="true">
      <span>{label ? `// ${label}` : '// ──'}</span>
    </div>
  );
}
