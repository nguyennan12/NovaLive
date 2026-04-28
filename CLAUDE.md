# 📦 E-commerce Project Overview

**Repo:** https://github.com/nguyennan12/E-commerce  
**Cập nhật:** 27/04/2026  
**Mục tiêu:** Tăng tốc phát triển frontend các tính năng chính, tối ưu cho teamwork với AI code assistant.

---

## 1. Trạng thái hiện tại

- **Backend:** Hoàn thiện 80% (tạo/xem/sửa/Xóa sản phẩm, kho, API chuẩn REST đã sẵn sàng).
- **Frontend:**  
  - Đã có UI quản lý sản phẩm, kho với các component/module chính (hiển thị, filter, tạo & sửa sản phẩm, nhập/xuất kho, thống kê tồn kho).
  - Các phần còn lại (giỏ hàng, đơn hàng, customer, giao diện chung user, phân quyền, analytics) ĐANG LÀM hoặc CHƯA LÀM.

---

## 2. Công nghệ frontend & lưu ý kỹ thuật

- **Framework:** React 19 (function component + hooks)
- **State/data:** Redux Toolkit, redux-persist để lưu global state, **@tanstack/react-query** cho data fetching, caching, đồng bộ hóa trạng thái server/client.
- **UI:** Material UI (MUI) v9.0+
- **Form:** react-hook-form
- **Thông báo:** react-toastify
- **Routing:** react-router-dom v7+
- **Chart:** recharts
- **API:** các hàm gọi API nằm trong `src/common/apis/services/*`
- **Code style:** Đã chuẩn hóa ESLint + prettier
- **Đã tích hợp sẵn Redux store, QueryClientProvider, ThemeProvider trong main.jsx**

---

## 3. Các module/frontend đã hoàn thành

- **Product Management:** Danh sách, filter, tạo, cập nhật, xóa sản phẩm.
- **Inventory Management:** Xem tồn kho, lịch sử, nhập xuất kho.
- Đã dùng react-query ở ProductPage, InventoryPage, ProductFormPage, các components thống kê/chart,…

---

## 4. Mong muốn AI hỗ trợ phát triển tiếp

### A. **Ngữ cảnh mong muốn**:
- **Tổ chức code:** Mỗi feature là 1 module con trong `src/features`.
- **Tối ưu tái sử dụng:** Tách component hợp lý, dùng hook/back-end API service đã có.
- **UI/UX:** Giữ phong cách đồng bộ MUI, responsive, đẹp gọn, chuyên nghiệp.
- **Kết hợp Redux/React-query:** Ưu tiên react-query nếu cần đồng bộ dữ liệu realtime với server.

### B. **Các phần còn lại cần AI hỗ trợ**:
- Trang **giỏ hàng (Cart)**: list sản phẩm đã chọn, sửa số lượng, xóa.
- Trang **đơn hàng (Orders)**: list, chi tiết, trạng thái thanh toán/vận chuyển.
- Trang **customer/profile**: info khách hàng, lịch sử mua hàng.
- **Đăng nhập/đăng ký**: sử dụng API Auth Backend.
- **Dashboard** cho admin: tổng quan chỉ số, số sản phẩm, doanh thu.
- **Analytics đơn giản**: dùng recharts.
- Bất cứ UI/flow frontend nào phù hợp với e-commerce thông thường nhưng chưa có trong src/features.

Ví dụ prompt gửi cho Claude:
> "Viết module CartPage cho phần giỏ hàng, đáp ứng các tiêu chí phía trên, sử dụng react-query lấy data từ API /api/cart."

---

### 5. Guideline assistant & workflow teamwork với AI

1. **Luôn đọc file này (claude.md) để nắm toàn bộ context dự án trước khi sinh code.**
2. Khi sinh code:
   - Tuân thủ organization structure, code style, slot các file vào đúng thư mục, dùng lại các utils/hooks cũ nếu có.
   - Ưu tiên làm từng bước nhỏ (component → page → kết nối API).
   - Nếu thiếu API/backend, báo lại để tôi bổ sung.
3. Khi hoàn thành mỗi phần, update lại claude.md trạng thái/tính năng mới để lần sau AI/Claude support sát thực tế hơn.
4. Nếu có câu hỏi về API/luồng data/backend, hỏi trực tiếp.

---

## 6. Tiến độ (tính tới 27/04/2026)

- Backend: 80% (API core đã xong)
- Frontend: Đã xong Quản lý sản phẩm, Quản lý kho.
- **Đang cần làm:** Cart/Order/Customer/Auth/Dashboard.

---

## 7. Do (Những việc phải làm)

- Luôn tuân thủ code style và cấu trúc thư mục đã có.
- Tái sử dụng các component, hooks, utils chung nếu đã có; tránh viết lại.
- Dùng TanStack React Query để fetch/caching/update data từ API nếu dành cho data có thể thay đổi.
- Đảm bảo UI responsive (hoạt động trên mobile, tablet).
- Sử dụng Material UI cho toàn bộ component giao diện, tuân thủ theme đã định nghĩa.
- Comment rõ các đoạn logic phức tạp.
- Test kỹ các trường hợp đầu vào với React Hook Form.
- Khi tạo non-trivial component, chia nhỏ thành file độc lập trong module feature.

## 8. Don’t (Những việc không được làm)

- Không fetch API trực tiếp trong component nếu đã có service/API layer ở `src/common/apis/services`.
- Không sử dụng thư viện UI khác ngoài Material UI nếu không thực sự cần thiết.
- Không hard-code string/user role/data; luôn dùng constant hoặc lấy qua API/backend.
- Không viết logic giữ state/thông tin user ở ngoài Redux hoặc React Query store (trừ các local UI state nhỏ).
- Không customize style inline trừ khi thực sự cần thiết – ưu tiên sx, theme, styled component của MUI.
- Không bỏ qua kiểm tra lỗi/hiển thị thông báo khi call API (sử dụng react-toastify/hook error handler).
- Không copy code mà không hiểu rõ luồng xử lý.

*File này dành cho AI code assistant (Claude, Copilot, hoặc Assistant khác) và các dev muốn nắm/hỗ trợ phát triển frontend dự án này. Nếu bạn là AI, hãy tuân thủ guideline này để đảm bảo teamwork hiệu quả!*
