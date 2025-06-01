export type OrderLine = {
  item: string;
  units: string;
  quantity: number;
  price: number;
  amount: number;
};

export type Address = {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

export type OrderHistoryEntry = {
  action: string;
  timestamp: string;
  user?: string;
  event: string; // e.g., "created", "updated", "shipped", etc.
};

export type Order = {
  orderNumber: string;
  customer: string;
  transactionDate: string;
  status: string;
  fromLocation: string;
  toLocation: string;
  pendingApprovalReasonCode: string[];
  supportRep?: string;
  incoterm?: string;
  freightTerms?: string;
  totalShipUnitCount?: number;
  totalQuantity?: number;
  discountRate?: number;
  billingAddress?: Address;
  shippingAddress?: Address;
  earlyPickupDate?: string;
  latePickupDate?: string;
  lines: OrderLine[];
  history?: OrderHistoryEntry[];
};
