# 📦 E-commerce Project Overview

**Repo:** https://github.com/nguyennan12/E-commerce  
**Cập nhật:** 29/04/2026  
**Mục tiêu:** Tăng tốc phát triển frontend các tính năng chính, tối ưu cho teamwork với AI code assistant.

---

## 1. Trạng thái hiện tại

- **Backend:** Hoàn thiện 80% (tạo/xem/sửa/Xóa sản phẩm, kho, API chuẩn REST đã sẵn sàng).
- **Frontend:**
  - Đã có UI quản lý sản phẩm, kho với các component/module chính (hiển thị, filter, tạo & sửa sản phẩm, nhập/xuất kho, thống kê tồn kho).
  - **Trang Home** (consumer) đã hoàn thành: banner slider, danh mục, 3 layout list sản phẩm, filter bar.
  - Các phần còn lại (giỏ hàng, đơn hàng, customer, phân quyền, analytics) ĐANG LÀM hoặc CHƯA LÀM.

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

- **Product Management (admin):** Danh sách, filter, tạo, cập nhật, xóa sản phẩm — `src/features/Product`
- **Inventory Management (admin):** Xem tồn kho, lịch sử, nhập xuất kho — `src/features/Inventory`
- **Discount Management (admin):** Tạo/quản lý mã giảm giá — `src/features/Discount`
- **Live Session (admin):** Quản lý phiên livestream — `src/features/LiveSession`
- **Home Page (consumer):** Banner slider, danh mục nổi bật, Flash Sale scroll, Best Seller, New Arrivals grid — `src/features/Home`
  - Components: `BannerHomePage`, `CategorySection`, `ProductScrollSection` (Flash Sale + countdown), `ProductBestSellerSection`, `ProductGridSection`, `HomeProductCard` (portrait/landscape), `HomeSearchBar` (filter bar)
  - Hook: `useHomeProducts` — `getAllProductsAPI` mặc định, `queryProductAPI` khi filter theo danh mục
  - SPU model field: `total_sold` — hiển thị "lượt mua" bên cạnh giá

---

## 4. Mong muốn AI hỗ trợ phát triển tiếp

### A. **Ngữ cảnh mong muốn**:
- **Tổ chức code:** Mỗi feature là 1 module con trong `src/features`.
- **Tối ưu tái sử dụng:** Tách component hợp lý, dùng hook/back-end API service đã có.
- **UI/UX:** Giữ phong cách đồng bộ với style chung (xem Mục 9), responsive, đẹp gọn, chuyên nghiệp.
- **Kết hợp Redux/React-query:** Ưu tiên react-query nếu cần đồng bộ dữ liệu realtime với server.

### B. **Các phần còn lại cần AI hỗ trợ**:
- Trang **giỏ hàng (Cart)**: list sản phẩm đã chọn, sửa số lượng, xóa.
- Trang **đơn hàng (Orders)**: list, chi tiết, trạng thái thanh toán/vận chuyển.
- Trang **customer/profile**: info khách hàng, lịch sử mua hàng.
- **Đăng nhập/đăng ký**: sử dụng API Auth Backend.
- **Dashboard** cho admin: tổng quan chỉ số, số sản phẩm, doanh thu.
- **Analytics đơn giản**: dùng recharts.
- Trang **chi tiết sản phẩm**: ảnh, mô tả, biến thể, thêm giỏ hàng.

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

## 6. Tiến độ (tính tới 29/04/2026)

- Backend: 80% (API core đã xong)
- Frontend:
  - ✅ Quản lý sản phẩm (shop)
  - ✅ Quản lý kho (shop)
  - ✅ Quản lý mã giảm giá (shop)
  - ✅ Quản lý phiên live (shop)
  - ✅ **Trang Home (consumer)** — banner, danh mục, 3 layout list sản phẩm
  - ⬜ **Cart / Order / Customer / Auth / Dashboard / Product Detail**

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
