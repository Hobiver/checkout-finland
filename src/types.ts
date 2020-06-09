export type CheckoutComission = {
  merchant: string;
  amount: number;
};

export type CheckoutCallbackUrls = {
  success: string;
  cancel: string;
};

export type CheckoutPaymentMethodGroup =
  | "bank"
  | "credit"
  | "creditcard"
  | "mobile";

export type CheckoutPaymentItem = {
  unitPrice: number;
  units: number;
  vatPercentage: number;
  productCode: string;
  deliveryDate: string;
  description?: string;
  category?: string;
  orderId?: string;
  stamp?: string;
  reference?: string;
  merchant?: string;
  commission?: CheckoutComission;
};

export type CheckoutAddress = {
  streetAddress: string;
  postalCode: string;
  city: string;
  county?: string;
  country: string;
};

export type CheckoutPayment = {
  stamp: string;
  reference: string;
  amount: number;
  currency: "EUR";
  language: "FI" | "SV" | "EN";
  orderId?: string;
  items: CheckoutPaymentItem[];
  customer: {
    email: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    vatId?: string;
  };
  deliveryAddress?: CheckoutAddress;
  invoicingAddress?: CheckoutAddress;
  redirectUrls: CheckoutCallbackUrls;
  callbackUrls?: CheckoutCallbackUrls;
  callbackDelay?: number;
  groups?: CheckoutPaymentMethodGroup[];
};

export type CheckoutPaymentProvider = {
  url: string;
  icon: string;
  svg: string;
  group: CheckoutPaymentMethodGroup;
  name: string;
  id: string;
  parameters: { name: string; value: string }[];
};

export type CheckoutRefundItem = {
  amount: number;
  stamp: string;
  refundStamp?: string;
  refundReference?: string;
  commission?: CheckoutComission;
};

export type CheckoutRefund = {
  amount: number;
  email?: string;
  refundStamp?: string;
  refundReference?: string;
  items: CheckoutRefundItem[];
  callbackUrls: CheckoutCallbackUrls;
};
