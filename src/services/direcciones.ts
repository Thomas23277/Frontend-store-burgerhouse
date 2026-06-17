import apiClient from './apiClient';
import type { Direccion, DireccionCreate, DireccionUpdate } from '../types';

export const getDirecciones = () =>
  apiClient.get<Direccion[]>('/direcciones').then((r) => r.data);

export const getDireccion = (id: number) =>
  apiClient.get<Direccion>(`/direcciones/${id}`).then((r) => r.data);

export const createDireccion = (data: DireccionCreate) =>
  apiClient.post<Direccion>('/direcciones', data).then((r) => r.data);

export const updateDireccion = (id: number, data: DireccionUpdate) =>
  apiClient.put<Direccion>(`/direcciones/${id}`, data).then((r) => r.data);

export const setDireccionPrincipal = (id: number) =>
  apiClient.patch<Direccion>(`/direcciones/${id}/principal`).then((r) => r.data);

export const deleteDireccion = (id: number) =>
  apiClient.delete<{ message: string }>(`/direcciones/${id}`).then((r) => r.data);
