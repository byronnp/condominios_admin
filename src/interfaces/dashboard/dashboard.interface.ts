import type { Tone } from '../shared/tone.interface';

export interface DashboardView {
  copy: { eyebrow: string; title: string; description: string };
  primaryAction: { label: string; icon: string; to?: string };
  metrics: { label: string; value: string; detail: string; icon: string; tone: Tone }[];
  mainPanel: {
    title: string;
    subtitle: string;
    items: { title: string; caption: string; status: string; icon: string; color: string }[];
  };
  sidePanel: { title: string; subtitle: string; actions: { label: string; icon: string }[] };
}
