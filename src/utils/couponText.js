const money = (v) => `${Number(v || 0).toLocaleString("vi-VN")} ₫`;

/** "Giảm 10%, tối đa 200.000 ₫ · đơn từ 500.000 ₫" */
export function describeCoupon(c) {
  if (!c) return "";
  const main =
    c.discountType === "PERCENTAGE"
      ? `Giảm ${Number(c.discountValue)}%` +
        (Number(c.maxDiscountAmount) > 0 ? `, tối đa ${money(c.maxDiscountAmount)}` : "")
      : `Giảm ${money(c.discountValue)}`;
  const min = Number(c.minOrderValue) > 0 ? ` · đơn từ ${money(c.minOrderValue)}` : "";
  return main + min;
}