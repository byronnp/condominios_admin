import type { Tone } from '../shared/tone.interface';

export interface CondominiumMetric {
  label: string;
  value: string;
  detail: string;
  icon: string;
  tone: Tone;
}
