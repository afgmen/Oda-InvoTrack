export const REQUEST_STATUSES = [
  "request_created",
  "waiting_invoice",
  "invoice_uploaded",
  "need_follow_up_overdue",
  "asked_assigned_employee",
  "need_qr_owner_identification",
  "resolved",
  "rejected",
  "cancelled",
] as const;

export type RequestStatus = (typeof REQUEST_STATUSES)[number];

export const TERMINAL_REQUEST_STATUSES = [
  "resolved",
  "rejected",
  "cancelled",
] as const satisfies readonly RequestStatus[];

export function isTerminalRequestStatus(status: RequestStatus): boolean {
  return TERMINAL_REQUEST_STATUSES.includes(
    status as (typeof TERMINAL_REQUEST_STATUSES)[number],
  );
}

export function canUploadInvoice(status: RequestStatus): boolean {
  return !isTerminalRequestStatus(status);
}

export function canTransitionRequestStatus(
  from: RequestStatus,
  to: RequestStatus,
): boolean {
  if (isTerminalRequestStatus(from)) return false;
  if (to === "cancelled") return true;

  const allowed: Record<RequestStatus, readonly RequestStatus[]> = {
    request_created: ["waiting_invoice"],
    waiting_invoice: ["invoice_uploaded", "need_follow_up_overdue"],
    invoice_uploaded: ["resolved", "rejected"],
    need_follow_up_overdue: [
      "asked_assigned_employee",
      "need_qr_owner_identification",
    ],
    asked_assigned_employee: ["asked_assigned_employee", "invoice_uploaded"],
    need_qr_owner_identification: [
      "asked_assigned_employee",
      "invoice_uploaded",
    ],
    resolved: [],
    rejected: [],
    cancelled: [],
  };

  return allowed[from].includes(to);
}
