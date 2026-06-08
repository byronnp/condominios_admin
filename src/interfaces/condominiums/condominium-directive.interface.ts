export type CondominiumDirectiveMemberType = 'resident' | 'external';
export type CondominiumDirectiveStatus = 'vigente' | 'histórica' | 'pendiente';

export interface CondominiumDirectiveMember {
  id: number;
  residentId?: number | null;
  fullName: string;
  memberType: CondominiumDirectiveMemberType;
  role: string;
  document: string;
  email: string;
  phone: string;
  periodStart: string;
  periodEnd: string;
  status: CondominiumDirectiveStatus;
  notes: string;
}

export interface CondominiumDirectiveSummary {
  currentPresident: string;
  currentSecretary: string;
  currentTreasurer: string;
  currentVocal: string;
  externalMembers: number;
  residentMembers: number;
}

export interface CondominiumDirectivePeriod {
  id: number;
  title: string;
  periodStart: string;
  periodEnd: string;
  status: CondominiumDirectiveStatus;
  notes: string;
  members: CondominiumDirectiveMember[];
}

export interface CondominiumDirectiveForm {
  memberType: CondominiumDirectiveMemberType;
  role: string;
  residentId: number | null;
  fullName: string;
  document: string;
  email: string;
  phone: string;
  company: string;
  periodStart: string;
  periodEnd: string;
  status: CondominiumDirectiveStatus;
  notes: string;
}

export interface CondominiumDirectivePeriodForm {
  title: string;
  periodStart: string;
  periodEnd: string;
  status: CondominiumDirectiveStatus;
  notes: string;
}
