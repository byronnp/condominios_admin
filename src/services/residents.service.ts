import type { CreateResidentPayload } from '../interfaces/residents/resident-form.interface';
import { apiPost } from './api.service';

export function createAdminResident(payload: CreateResidentPayload) {
  return apiPost<unknown, CreateResidentPayload>('admin/residents', payload);
}
