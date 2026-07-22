export function toSectionId(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function h2(title: string) {
  return { id: toSectionId(title), title };
}

export function placeholderSections(h2s: { id: string; title: string }[]) {
  return Object.fromEntries(
    h2s.map(({ id }) => [id, { body: '[Your content here]' }]),
  );
}
