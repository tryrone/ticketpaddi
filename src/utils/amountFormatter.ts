export const amountFormatter = ({
  amount,
  currency = "NGN",
}: {
  amount: number;
  currency?: string;
}) => {
  return new Intl.NumberFormat("en-US", {
    currency: currency,
    style: "currency",
  }).format(amount);
};

export const amountFormatterWithoutCurrency = ({
  amount,
}: {
  amount: number;
}) => {
  return new Intl.NumberFormat("en-US", {
    style: "decimal",
  }).format(amount);
};
