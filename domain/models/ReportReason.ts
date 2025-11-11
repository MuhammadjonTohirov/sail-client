export interface ReportReason {
  readonly code: string;
  readonly title: string;
  readonly description?: string;
  readonly children?: ReportReason[];
}
