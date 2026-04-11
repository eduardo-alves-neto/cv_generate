import { useQuery } from '@tanstack/react-query'
import { fetchHealth } from '../lib/axios'

export function useHealth() {
  const query = useQuery({
    queryKey: ['health'],
    queryFn: fetchHealth,
    refetchInterval: 30_000,
    retry: 1,
  })

  return {
    isHealthy: query.isSuccess,
    isLoading: query.isLoading,
  }
}
