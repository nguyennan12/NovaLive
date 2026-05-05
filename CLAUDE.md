# 📦 E-commerce Project Overview

**Repo:** https://github.com/nguyennan12/E-commerce  
**Cập nhật:** 03/05/2026 (Payment flow hoàn chỉnh — COD xác nhận OTP, VNPay redirect + IPN callback, nhả kho khi hủy/timeout; unit test full flow + vnpay + livestream + auth + rbac; CI GitHub Actions)  
**Mục tiêu:** Tăng tốc phát triển frontend các tính năng chính, tối ưu cho teamwork với AI code assistant.

---

## 1. Trạng thái hiện tại

- **Backend:** Hoàn thiện 92% — Payment flow hoàn chỉnh: COD xác nhận OTP qua email, VNPay IPN callback xác thực hash + xác nhận/hủy kho, nhả kho tự động khi hủy đơn hoặc VNPay timeout. Grant phân quyền đã thêm vào toàn bộ router. Integration tests đầy đủ (full flow, vnpay, livestream, auth, rbac).
- **Frontend:**
  - Đã có UI quản lý sản phẩm, kho với các component/module chính (hiển thị, filter, tạo & sửa sản phẩm, nhập/xuất kho, thống kê tồn kho).
  - **Trang Home** (consumer) đã hoàn thành: banner slider, danh mục, 3 layout list sản phẩm, filter bar.
  - **Trang Cart** (consumer) đã hoàn thành: layout 7/3, list theo shop, checkbox chọn/xóa, tăng/giảm số lượng, CartSummary tính tiền realtime, chọn discount shop + global với API check availability, tính tổng có tích hợp discount.
  - **Trang Order** (consumer) đã hoàn thành toàn bộ: review sản phẩm theo shop, quản lý địa chỉ giao hàng (modal + GHN cascading dropdown), phí ship GHN API realtime, voucher, tóm tắt đơn, PTTT, mobile sticky bar qua React Portal, COD xác nhận OTP (`CodOtpDialog`), VNPay redirect tới `paymentUrl`.
  - Các phần còn lại (order list/detail, customer/profile, auth UI, dashboard, analytics) CHƯA LÀM.

---

## 2. Công nghệ frontend & lưu ý kỹ thuật

- **Framework:** React 19 (function component + hooks)
- **State/data:** Redux Toolkit, redux-persist để lưu global state, **@tanstack/react-query** cho data fetching, caching, đồng bộ hóa trạng thái server/client.
- **UI:** Material UI (MUI) v9.0+
- **Styled component:** `@emotion/styled` — dùng khi cần CSS pseudo-element (`::before`, `::after`) hoặc keyframe animation phức tạp, MUI `sx` không đủ.
- **Form:** react-hook-form
- **Thông báo:** react-toastify
- **Routing:** react-router-dom v7+
- **Chart:** recharts
- **API:** các hàm gọi API nằm trong `src/common/apis/services/*`
- **Code style:** Đã chuẩn hóa ESLint + prettier
- **Đã tích hợp sẵn Redux store, QueryClientProvider, ThemeProvider trong main.jsx**

---

## 3. Các module/frontend đã hoàn thành

Chi tiết từng feature (components, hooks, layout, TODO) xem tại **[FEATURE.md](./FEATURE.md)**.

---

## 4. Mong muốn AI hỗ trợ phát triển tiếp

### A. **Ngữ cảnh mong muốn**:
- **Tổ chức code:** Mỗi feature là 1 module con trong `src/features`.
- **Tối ưu tái sử dụng:** Tách component hợp lý, dùng hook/back-end API service đã có.
- **UI/UX:** Giữ phong cách đồng bộ với style chung (xem Mục 9), responsive, đẹp gọn, chuyên nghiệp.
- **Kết hợp Redux/React-query:** Ưu tiên react-query nếu cần đồng bộ dữ liệu realtime với server.

### C. **Query Architecture Pattern (đã chuẩn hóa)**

Pattern áp dụng nhất quán cho product, discount, order — **khi tạo feature mới phải theo pattern này**:

1. **Util** (`src/common/utils/`): hàm build query params — `toQueryString(params)`, không logic business.
2. **API service** (`src/common/apis/services/`): nhận params đã build, chỉ gọi HTTP.
3. **Hook** (`src/features/<Feature>/hooks/`): nhận `filters` object từ component, xử lý query key + `useQuery`/`useMutation`. Không để component gọi API trực tiếp.
4. **Component**: chỉ truyền `filters` vào hook. Không biết về query key hay API endpoint.

```
Component  →  useDiscounts(filters)  →  discountService  →  API
               (hook xử lý)            (build URL)
```

- Shop quản lý riêng: filter `{ shopId }` → query theo shop; bỏ `shopId` → query global/all.
- `useDiscounts`, `useCheckout`, `useProducts` đều theo pattern này.

### B. **Các phần còn lại cần AI hỗ trợ**:
- ~~Trang **giỏ hàng (Cart)**~~ ✅ HOÀN THÀNH (xem FEATURE.md)
- ~~Trang **Order (đặt hàng)**~~ ✅ HOÀN THÀNH — kể cả COD OTP + VNPay redirect (xem FEATURE.md)
- ~~Trang **chi tiết sản phẩm**~~ ✅ HOÀN THÀNH (xem FEATURE.md)
- Trang **đơn hàng của tôi (Order List/Detail)**: list đơn, chi tiết, trạng thái thanh toán/vận chuyển, VNPay return page.
- Trang **customer/profile**: info khách hàng, lịch sử mua hàng, quản lý địa chỉ.
- **Đăng nhập/đăng ký**: sử dụng API Auth Backend (đã có `loginUserAPI` trong Redux).
- **Dashboard** cho admin: tổng quan chỉ số, số sản phẩm, doanh thu.
- **Analytics đơn giản**: dùng recharts.

---

## 5. Guideline assistant & workflow teamwork với AI

1. **Luôn đọc file này (CLAUDE.md) để nắm toàn bộ context dự án trước khi sinh code.**
2. Khi sinh code:
   - Tuân thủ organization structure, code style, slot các file vào đúng thư mục, dùng lại các utils/hooks cũ nếu có.
   - Ưu tiên làm từng bước nhỏ (component → page → kết nối API).
   - Nếu thiếu API/backend, báo lại để tôi bổ sung.
3. Khi hoàn thành mỗi phần, update lại CLAUDE.md trạng thái/tính năng mới để lần sau AI/Claude support sát thực tế hơn.
4. Nếu có câu hỏi về API/luồng data/backend, hỏi trực tiếp.

---

## 6. Tiến độ (tính tới 03/05/2026)

- Backend: 92% (payment flow hoàn chỉnh — COD OTP, VNPay IPN, nhả kho, phân quyền RBAC full router, integration tests)
- CI/CD: ✅ GitHub Actions — lint (BE+FE), integration tests, Vite build, Docker production build
- Frontend:
  - ✅ Quản lý sản phẩm (shop)
  - ✅ Quản lý kho (shop)
  - ✅ Quản lý mã giảm giá (shop)
  - ✅ Quản lý phiên live (shop)
  - ✅ **Trang Home (consumer)** — banner, danh mục, 3 layout list sản phẩm
  - ✅ **Trang Product Detail (consumer)** — ảnh, SKU cards, giá, attributes, shop card, description
  - ✅ **Trang Cart (consumer)** — layout 7/3, danh sách theo shop, checkbox, stepper, summary, discount shop + global, checkout summary realtime
  - ✅ **Trang Order (consumer)** — layout 7/3, địa chỉ GHN dropdown, phí ship realtime, voucher, PTTT, mobile sticky Portal, COD xác nhận OTP, VNPay redirect, đặt hàng hoàn chỉnh
  - ✅ **Order List / Order Detail** — tabs 6 trạng thái, card đơn hàng với ảnh/tên/giá, hủy đơn pending, detail dialog: timeline, breakdown giá, địa chỉ, thanh toán; route `/orders`
  - ⬜ **Customer / Profile** — thông tin cá nhân, địa chỉ, lịch sử
  - ⬜ **Auth UI** — đăng nhập / đăng ký (API backend đã có)
  - ⬜ **Admin Dashboard & Analytics**

---

## 7. Do (Những việc phải làm)

- Luôn tuân thủ code style và cấu trúc thư mục đã có.
- Tái sử dụng các component, hooks, utils chung nếu đã có; tránh viết lại.
- Dùng TanStack React Query để fetch/caching/update data từ API nếu dành cho data có thể thay đổi.
- Đảm bảo UI responsive (hoạt động trên mobile, tablet).
- Sử dụng Material UI cho toàn bộ component giao diện, tuân thủ theme đã định nghĩa.
- Khi cần pseudo-element hoặc animation phức tạp, dùng `@emotion/styled` (đã có trong dự án).
- Comment rõ các đoạn logic phức tạp.
- Test kỹ các trường hợp đầu vào với React Hook Form.
- Khi tạo non-trivial component, chia nhỏ thành file độc lập trong module feature.

## 8. Don't (Những việc không được làm)

- Không fetch API trực tiếp trong component nếu đã có service/API layer ở `src/common/apis/services`.
- Không sử dụng thư viện UI khác ngoài Material UI nếu không thực sự cần thiết.
- Không hard-code string/user role/data; luôn dùng constant hoặc lấy qua API/backend.
- Không viết logic giữ state/thông tin user ở ngoài Redux hoặc React Query store (trừ các local UI state nhỏ).
- Không customize style inline trừ khi thực sự cần thiết – ưu tiên `sx`, theme, `@emotion/styled` của MUI.
- Không bỏ qua kiểm tra lỗi/hiển thị thông báo khi call API (sử dụng react-toastify/hook error handler).
- Không copy code mà không hiểu rõ luồng xử lý.

---

## 9. Style Guide

Chi tiết đầy đủ trong **[STYLE.md](./STYLE.md)** — đọc trước khi tạo component UI mới.

Tóm tắt nhanh:
- Nền trang: `WaterDropBackground` (`@emotion/styled`) — gradient + ảnh nền overlay qua `::before`
- Section nổi bật: glassmorphism — `background: rgba(255,255,255,0.1)`, `backdropFilter: blur(10px)`, `borderRadius: 3`, `p: 2`
- Card consumer: `HomeProductCard` (portrait/landscape) — không admin actions, hiển thị `total_sold`
- Card admin: `ProductCard` (dashboard) — có edit/delete, có stock badge
- Category: gradient blue/cyan, 2 hàng trên desktop (`repeat(10,1fr)` md+)
- Grid responsive chuẩn: 2→3→4→5 cols theo xs/sm/md/lg

---

*File này dành cho AI code assistant (Claude, Copilot, hoặc Assistant khác) và các dev muốn nắm/hỗ trợ phát triển frontend dự án này. Nếu bạn là AI, hãy tuân thủ guideline này để đảm bảo teamwork hiệu quả!*
