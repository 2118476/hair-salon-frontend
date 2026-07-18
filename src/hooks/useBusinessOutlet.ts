import { useOutletContext } from 'react-router-dom';

export interface BusinessOutletContext {
  businessId: string;
  role: string;
}

export function useBusinessOutlet(): BusinessOutletContext {
  return useOutletContext<BusinessOutletContext>();
}

export const gbp = (pence: number) => `£${(pence / 100).toFixed(2)}`;
