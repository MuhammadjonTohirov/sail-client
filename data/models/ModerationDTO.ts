export interface ReportReasonDTO {
  code: string;
  title: string;
  description?: string;
  children?: ReportReasonDTO[];
}

export interface ReportPayloadDTO {
  listing: number;
  reason_code: string;
  notes?: string;
}
