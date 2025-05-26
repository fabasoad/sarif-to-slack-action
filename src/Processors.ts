export function processColor(color?: string): string | undefined {
  switch (color) {
    case 'success':
      return '#008000';
    case 'failure':
      return '#ff0000';
    case 'cancelled':
      return '#0047AB';
    case 'skipped':
      return '#808080';
    default:
      return color
  }
}
