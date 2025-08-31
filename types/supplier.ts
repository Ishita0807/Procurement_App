// types/supplier.ts
export type Supplier = {
  supplier_id: string; // required
  name: string;        // required
  country?: string;
  sector?: string;
  revenue_usd_m?: number;
  scope1_tco2e?: number;
  scope2_tco2e?: number;
  scope3_tco2e?: number;
  esg_total?: number;
  esg_e?: number;
  esg_s?: number;
  esg_g?: number;
  is_iso14001?: boolean;
  is_bcorp?: boolean;
  is_fairtrade?: boolean;
  has_decarb_target?: boolean;
  s1_intensity?: number;
  s2_intensity?: number;
  s3_intensity?: number;
  esg_total_norm?: number;
  s1_norm_cost?: number;
  s2_norm_cost?: number;
  s3_norm_cost?: number;
  certs_norm?: number;
  policy_norm?: number;
  score?: number;
  rank?: number;
}
