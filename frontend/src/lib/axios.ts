import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001/api'

export const apiClient = axios.create({
  baseURL,
  timeout: 200_000,
})

export async function convertCV(formData: FormData): Promise<Blob> {
  const response = await apiClient.post<Blob>('/convert', formData, {
    responseType: 'blob',
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}

export async function fetchHealth(): Promise<{ status: string }> {
  const response = await apiClient.get<{ status: string }>('/health')
  return response.data
}
