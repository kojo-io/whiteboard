export type SelectedComponent = {
  id: string;
  tag: string; // e.g., 'button'
  classes: string[]; // applied Tailwind classes
  content?: string; // e.g., "Click Me"
};
