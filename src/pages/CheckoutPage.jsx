import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import CartFooter from "../components/cart/CartFooter";
import CheckoutIntro from "../components/checkout/CheckoutIntro";
import CheckoutForm from "../components/checkout/CheckoutForm";
import CheckoutSummary from "../components/checkout/CheckoutSummary";
import { useCart } from "../hooks/useCart";
import { authService } from "../services/authService";
import { userService } from "../services/userService";
import { orderService, getOrderErrorMessage } from "../services/orderService";
import { paymentService } from "../services/paymentService";

const EMPTY_FORM = {
  customerName: "",
  customerPhone: "",
  customerEmail: "",
  province: "",
  district: "",
  ward: "",
  addressLine: "",
  customerNote: "",
};

export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, cartCount, loading: cartLoading, refreshCart } = useCart();

  const [form, setForm] = useState(EMPTY_FORM);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");

  const [shippingMethods, setShippingMethods] = useState([]);
  const [shippingLoaded, setShippingLoaded] = useState(false);
  const [shipping, setShipping] = useState("");

  // Hiện chỉ hỗ trợ COD. VNPAY và MOMO hiển thị nhưng bị khóa.
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [payment, setPayment] = useState("COD");
  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponMessage, setCouponMessage] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Chưa đăng nhập thì chuyển sang trang đăng nhập
  useEffect(() => {
    if (!authService.getToken()) {
      navigate("/dang-nhap", { replace: true, state: { from: "/thanh-toan" } });
    }
  }, [navigate]);

  // Mua ngay: 1 sản phẩm mang từ trang chi tiết, KHÔNG nằm trong giỏ
  const buyNow = location.state?.buyNow || null;

  // Các dòng giỏ được chọn từ trang giỏ hàng. Vào thẳng /thanh-toan thì lấy cả giỏ.
  const selectedCartItemIds = useMemo(() => {
    const ids = location.state?.cartItemIds;
    return Array.isArray(ids) ? ids : null;
  }, [location.state]);

  const items = useMemo(() => {
    if (buyNow) return [{ ...buyNow, cartItemId: `buy-now-${buyNow.productVariantId}` }];
    if (selectedCartItemIds === null) return cartItems;
    return cartItems.filter((item) =>
      selectedCartItemIds.includes(item.cartItemId)
    );
  }, [buyNow, cartItems, selectedCartItemIds]);

  // Phương thức vận chuyển lấy từ BE
  useEffect(() => {
    let active = true;

    orderService
      .getShippingMethods()
      .then((methods) => {
        if (!active) return;
        setShippingMethods(methods);
        setShipping((current) => current || methods[0]?.code || "");
      })
      .catch(() => {
        if (active) setErrorMessage("Không tải được phương thức vận chuyển.");
      })
      .finally(() => {
        if (active) setShippingLoaded(true);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    paymentService.getMethods()
      .then((methods) => { if (active) setPaymentMethods(methods); })
      .catch(() => {
        // BE lỗi thì vẫn cho đặt COD
        if (active) setPaymentMethods([{ code: "COD", name: "Thanh toán khi nhận hàng (COD)",
          description: "Thanh toán cho đơn vị vận chuyển khi nhận sản phẩm.", enabled: true, online: false }]);
      });
    return () => { active = false; };
  }, []);

  // Điền sẵn từ sổ địa chỉ (ưu tiên địa chỉ mặc định) và thông tin tài khoản
  useEffect(() => {
    if (!authService.getToken()) return undefined;
    let active = true;

    const user = authService.getCurrentUser();

    setForm((current) => ({
      ...current,
      customerName: current.customerName || user?.fullName || user?.name || "",
      customerEmail: current.customerEmail || user?.email || "",
    }));

    userService
      .getMyAddresses()
      .then((list) => {
        if (!active) return;
        setAddresses(list);

        const preferred = list.find((a) => a.isDefault) || list[0];
        if (preferred) applyAddress(preferred, user);
      })
      .catch(() => {
        // Không có sổ địa chỉ thì khách tự nhập
      });

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function applyAddress(address, user = authService.getCurrentUser()) {
    setSelectedAddressId(String(address.id));
    setForm((current) => ({
      ...current,
      customerName: address.receiverName || current.customerName,
      customerPhone: address.receiverPhone || current.customerPhone,
      customerEmail: current.customerEmail || user?.email || "",
      province: address.province || "",
      district: address.district || "",
      ward: address.ward || "",
      addressLine: address.addressLine || "",
    }));
  }

  const handleSelectAddress = (id) => {
    if (!id) {
      setSelectedAddressId("");
      return;
    }
    const address = addresses.find((a) => String(a.id) === String(id));
    if (address) applyAddress(address);
  };

  const handleFieldChange = (name, value) => {
    setForm((current) => ({ ...current, [name]: value }));
    // Sửa tay thì không còn trùng với địa chỉ đã chọn
    if (["province", "district", "ward", "addressLine"].includes(name)) {
      setSelectedAddressId("");
    }
  };

  const subtotal = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
        0
      ),
    [items]
  );

  const selectedShipping = shippingMethods.find((m) => m.code === shipping);
  const shippingFee = Number(selectedShipping?.baseCost || 0);
  // Số tiền giảm chỉ để hiển thị. BE tự tính lại khi đặt hàng.
  const discount = Math.min(Number(appliedCoupon?.discountAmount || 0), subtotal);
  const total = subtotal - discount + shippingFee;

  const applyCoupon = async (codeArg) => {
    const code = (typeof codeArg === "string" ? codeArg : coupon).trim();
    if (!code || couponLoading) return;

    setCouponLoading(true);
    setCouponMessage("");
    try {
      const result = await orderService.previewCoupon(code, subtotal);
      setAppliedCoupon(result);
    } catch (error) {
      setAppliedCoupon(null);
      setCouponMessage(getOrderErrorMessage(error));
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponMessage("");
  };

  // Tạm tính đổi (giỏ tải lại) thì số tiền giảm cũ không còn đúng: bỏ mã, để khách áp lại
  useEffect(() => {
    setAppliedCoupon(null);
  }, [subtotal]);

  // Mã đã áp ở trang giỏ hàng: tự áp lại khi tạm tính đã có (phải đặt SAU effect bỏ mã ở trên)
  const carriedCoupon = location.state?.couponCode;
  const carriedAppliedRef = useRef(false);
  useEffect(() => {
    if (!carriedCoupon || carriedAppliedRef.current || subtotal <= 0) return;
    carriedAppliedRef.current = true;
    setCoupon(carriedCoupon);
    applyCoupon(carriedCoupon);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [carriedCoupon, subtotal]);

  const submitOrder = async (event) => {
    event.preventDefault();
    if (submitting || items.length === 0 || !shipping) return;

    setSubmitting(true);
    setErrorMessage("");

    try {
      const order = await orderService.createOrder({
        // Mua ngay gửi biến thể + số lượng, còn lại gửi các dòng giỏ đã chọn
        ...(buyNow
          ? { buyNow: { productVariantId: buyNow.productVariantId, quantity: buyNow.quantity } }
          : { cartItemIds: items.map((item) => item.cartItemId) }),
        shippingMethodCode: shipping,
        paymentMethod: payment,
        customerName: form.customerName.trim(),
        customerEmail: form.customerEmail.trim(),
        customerPhone: form.customerPhone.trim(),
        province: form.province.trim(),
        district: form.district.trim(),
        ward: form.ward.trim(),
        addressLine: form.addressLine.trim(),
        customerNote: form.customerNote.trim() || null,
        couponCode: appliedCoupon?.code || null,
      });

      // BE đã xóa các dòng giỏ đã mua, tải lại để số lượng trên Navbar đúng
      await refreshCart();
      if (payment === "COD") {
        navigate("/don-hang", { replace: true, state: { justOrdered: order.orderCode } });
        return;
      }

      // Đơn online: đơn ĐÃ tạo, lấy link rồi rời sang cổng
    try {
        await paymentService.redirectToGateway(order.orderCode);
    } catch (payError) {
        navigate("/don-hang", {
          replace: true,
          state: { paymentError: getOrderErrorMessage(payError) },
        });
      }
    } catch (error) {
      setErrorMessage(getOrderErrorMessage(error));

      // 409: hết hàng / sản phẩm không còn trong giỏ, tải lại giỏ để hiển thị đúng
      if (error?.response?.status === 409) {
        refreshCart();
      }

      setSubmitting(false);
    }
  };

  const isEmpty = !buyNow && !cartLoading && items.length === 0;

  return (
    <div className="checkout-page" data-node-id="3:58">
      <Navbar quantity={cartCount} />

      <main>
        <CheckoutIntro />

        {isEmpty ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <p style={{ marginBottom: 16 }}>
              Không có sản phẩm nào để thanh toán.
            </p>
            <a className="checkout-submit" href="/gio-hang">
              QUAY VỀ GIỎ HÀNG
            </a>
          </div>
        ) : (
          <form
            id="checkout-form"
            className="checkout-content"
            onSubmit={submitOrder}
          >
            <CheckoutForm
              form={form}
              onFieldChange={handleFieldChange}
              addresses={addresses}
              selectedAddressId={selectedAddressId}
              onSelectAddress={handleSelectAddress}
              shippingMethods={shippingMethods}
              shippingLoaded={shippingLoaded}
              shipping={shipping}
              onShippingChange={setShipping}
              payment={payment}
              paymentMethods={paymentMethods}
              onPaymentChange={setPayment}
            />

            <CheckoutSummary
              items={items}
              subtotal={subtotal}
              shippingFee={shippingFee}
              total={total}
              coupon={coupon}
              appliedCoupon={appliedCoupon}
              couponMessage={couponMessage}
              couponLoading={couponLoading}
              discount={discount}
              onApplyCoupon={applyCoupon}
              onRemoveCoupon={removeCoupon}
              payment={payment}
              submitting={submitting}
              canSubmit={items.length > 0 && Boolean(shipping)}
              errorMessage={errorMessage}
              onCouponChange={setCoupon}
            />
          </form>
        )}
      </main>

      <CartFooter />
    </div>
  );
}