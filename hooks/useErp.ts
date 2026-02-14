
import { useState, useCallback, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { ModuleType } from '../types';

export const useErp = (module: ModuleType) => {
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    // Fixed: Always use the generic get() method which handles module mapping internally
    const result = await apiService.get(module.toLowerCase());

    if (result.success) {
      setData(result.data);
    } else {
      setError(result.error || "Failed to retrieve records from Cloud Node.");
      setData([]);
    }
    setLoading(false);
  }, [module]);

  useEffect(() => {
    if (module !== ModuleType.DASHBOARD) {
      refresh();
    }
  }, [module, refresh]);

  return { data, loading, error, refresh };
};
