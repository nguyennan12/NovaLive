# API.md – Hệ Thống E-commerce Router Map

**Chú ý:**  
- Tất cả endpoint đều nằm dưới: `/v1/api/`  
- Các endpoint yêu cầu authentication (Bearer Token) sẽ ghi rõ **[Auth]**
- Các param/tham số động sẽ dùng cú pháp `:id`  
- Một số endpoint có dùng validate middlewares hoặc RBAC (ghi chú thêm)

---

## 1. **Access/Auth**

| Method | Endpoint                    | Mô tả                        | Auth |
|--------|-----------------------------|------------------------------|------|
| POST   | /v1/api/access/signup       | Đăng ký tài khoản            | -    |
| POST   | /v1/api/access/verify       | Xác thực tài khoản (OTP/mail)| -    |
| POST   | /v1/api/access/sendmail     | Gửi mail xác thực            | -    |
| POST   | /v1/api/access/login        | Đăng nhập                    | -    |
| POST   | /v1/api/access/logout       | Đăng xuất                    | ✔️   |
| POST   | /v1/api/access/refreshtoken | Làm mới access token         | ✔️   |

---

## 2. **User Address**

| Method | Endpoint                     | Mô tả                        | Auth |
|--------|------------------------------|------------------------------|------|
| POST   | /v1/api/address/             | Thêm địa chỉ mới             | ✔️   |
| GET    | /v1/api/address/             | Lấy tất cả địa chỉ người dùng| ✔️   |
| GET    | /v1/api/address/addressId    | Lấy chi tiết 1 địa chỉ       | ✔️   |

---

## 3. **Shop**

| Method | Endpoint                     | Mô tả                                | Auth   | Ghi chú          |
|--------|------------------------------|--------------------------------------|--------|------------------|
| POST   | /v1/api/shop/register        | Đăng ký shop mới                     | ✔️     |                  |
| GET    | /v1/api/shop                 | Lấy shop theo user hiện tại          | ✔️     |                  |
| PATCH  | /v1/api/shop/:shopId         | Cập nhật thông tin shop               | ✔️     | RBAC(updateOwn)  |
| GET    | /v1/api/shop/:shopId         | Lấy chi tiết shop                    | ✔️     |                  |
| DELETE | /v1/api/shop/:shopId         | Xóa shop                             | ✔️     | RBAC(deleteOwn)  |

---

## 4. **RBAC (Quyền hạn)**

| Method | Endpoint                          | Mô tả                   | Auth |
|--------|-----------------------------------|-------------------------|------|
| POST   | /v1/api/rbac/resource/            | Tạo resource mới        | ✔️   |
| GET    | /v1/api/rbac/resource/            | Lấy danh sách resource  | ✔️   |
| POST   | /v1/api/rbac/role/                | Tạo role mới            | ✔️   |
| GET    | /v1/api/rbac/role/                | Lấy danh sách role      | ✔️   |
| PATCH  | /v1/api/rbac/role/:userId         | Đổi role cho user       | ✔️   |
| PUT    | /v1/api/rbac/role/grants          | Gán quyền cho role      | ✔️   |

---

## 5. **Sản phẩm (Product)**

| Method | Endpoint                               | Mô tả                                 | Auth |
|--------|----------------------------------------|---------------------------------------|------|
| GET    | /v1/api/product/search                 | Tìm kiếm sản phẩm                     | -    |
| GET    | /v1/api/product/variation              | Lấy thông tin 1 SKU                   | -    |
| GET    | /v1/api/product/variations/:spuId      | Lấy tất cả SKU theo SPU               | -    |
| GET    | /v1/api/product/skus                   | Query list SKU                        | -    |
| GET    | /v1/api/product/                       | Lấy tất cả sản phẩm                   | -    |
| GET    | /v1/api/product/:productId             | Lấy chi tiết sản phẩm                 | -    |
| GET    | /v1/api/product/stats                  | Thống kê sản phẩm của shop            | ✔️   |
| GET    | /v1/api/product/me/public              | Lấy sản phẩm đã publish của shop      | ✔️   |
| GET    | /v1/api/product/me/draft               | Lấy sản phẩm draft của shop           | ✔️   |
| POST   | /v1/api/product/                       | Tạo sản phẩm mới                      | ✔️   |
| PATCH  | /v1/api/product/:productId             | Cập nhật sản phẩm                     | ✔️   |
| PATCH  | /v1/api/product/:productId/sku/:skuId  | Sửa 1 SKU cụ thể                      | ✔️   |
| PATCH  | /v1/api/product/:productId/publish     | Publish sản phẩm                      | ✔️   |
| PATCH  | /v1/api/product/:productId/unpublish   | Unpublish sản phẩm                    | ✔️   |
| DELETE | /v1/api/product/:productId             | Xóa sản phẩm                          | ✔️   |

---

## 6. **Attribute (Thuộc tính sản phẩm)**

| Method | Endpoint                       | Mô tả                           | Auth |
|--------|-------------------------------|---------------------------------|------|
| POST   | /v1/api/attribute             | Tạo attribute                   | ✔️   |
| POST   | /v1/api/attribute/bulk        | Tạo nhiều attribute             | ✔️   |

---

## 7. **Category (Danh mục)**

| Method | Endpoint                                   | Mô tả                          | Auth |
|--------|--------------------------------------------|-------------------------------|------|
| POST   | /v1/api/category                           | Tạo category                  | ✔️   |
| GET    | /v1/api/category                           | Lấy toàn bộ category          | ✔️   |
| POST   | /v1/api/category/bulk                      | Thêm nhiều category           | ✔️   |
| POST   | /v1/api/category/:categoryId/attribute     | Thêm attribute cho category   | ✔️   |
| POST   | /v1/api/category/:categoryId/attribute/bulk| Thêm nhiều attribute cho cate | ✔️   |
| GET    | /v1/api/category/attribute                 | Lấy attribute theo category   | ✔️   |

---

## 8. **Discount (Mã giảm giá/Discount code)**

| Method | Endpoint                                         | Mô tả                                            | Auth |
|--------|--------------------------------------------------|--------------------------------------------------|------|
| GET    | /v1/api/discount/                                | Lấy toàn bộ discount                             | -    |
| GET    | /v1/api/discount/query                           | Truy vấn discount nâng cao                        | -    |
| GET    | /v1/api/discount/shop/:shopId                    | Lấy discount của shop                             | -    |
| GET    | /v1/api/discount/products/:discountCode          | Lấy list sản phẩm theo mã giảm giá                | -    |
| GET    | /v1/api/discount/amount                          | Lấy discount số tiền khả dụng của user            | ✔️   |
| POST   | /v1/api/discount/                                | Tạo discount mới                                  | ✔️   |
| POST   | /v1/api/discount/:discountCode                   | Hủy discount code                                 | ✔️   |
| PATCH  | /v1/api/discount/:discountCode                   | Cập nhật discount code                            | ✔️   |
| POST   | /v1/api/discount/available/:discountCode         | Kiểm tra discount code có sử dụng được không      | ✔️   |
| DELETE | /v1/api/discount/:discountCode                   | Xóa discount code                                 | ✔️   |

---

## 9. **Inventory (Tồn kho)**

| Method | Endpoint                               | Mô tả                                 | Auth |
|--------|----------------------------------------|---------------------------------------|------|
| POST   | /v1/api/inventory/                     | Thêm tồn kho cho shop                 | ✔️   |
| GET    | /v1/api/inventory/history              | Xem lịch sử nhập/xuất kho             | ✔️   |
| GET    | /v1/api/inventory/chart                | Lấy dữ liệu chart tồn kho shop        | ✔️   |

---

## 10. **Inventory History (Lịch sử kho)**

| Method | Endpoint                   | Mô tả                     | Auth |
|--------|----------------------------|---------------------------|------|
| GET    | /v1/api/inventoryHistory/shop | Lịch sử kho của shop     | ✔️   |

---

## 11. **Cart**

| Method | Endpoint                | Mô tả                              | Auth |
|--------|-------------------------|------------------------------------|------|
| POST   | /v1/api/cart            | Thêm sản phẩm vào cart             | ✔️   |
| PATCH  | /v1/api/cart            | Cập nhật số lượng sản phẩm trong cart | ✔️   |
| DELETE | /v1/api/cart            | Xóa sản phẩm khỏi cart             | ✔️   |
| GET    | /v1/api/cart            | Lấy giỏ hàng người dùng            | ✔️   |

---

## 12. **Order**

| Method | Endpoint                       | Mô tả                                 | Auth |
|--------|-------------------------------|---------------------------------------|------|
| POST   | /v1/api/order/checkout        | Review checkout đơn trước khi đặt mua | ✔️   |
| POST   | /v1/api/order                 | Đặt đơn hàng (checkout)               | ✔️   |
| PATCH  | /v1/api/order/:orderId/status | Admin cập nhật trạng thái đơn         | ✔️   |
| GET    | /v1/api/order/my-orders       | Lấy toàn bộ đơn của user hiện tại     | ✔️   |
| GET    | /v1/api/order/my-orders/:orderId | Lấy chi tiết đơn theo orderId      | ✔️   |

---

## 13. **Payment**

| Method | Endpoint                       | Mô tả                                             | Auth |
|--------|-------------------------------|---------------------------------------------------|------|
| GET    | /v1/api/payment/vnpay_return  | Webhook trả về từ VNPAY sau khi thanh toán        | -    |
| GET    | /v1/api/payment/vnpay_ipn     | Webhook IPN từ VNPAY                              | -    |
| POST   | /v1/api/payment/create_url    | Tạo URL thanh toán VNPay                          | ✔️   |
| POST   | /v1/api/payment/cod           | Xác nhận thanh toán COD                           | ✔️   |

---

## 14. **Livestream**

| Method | Endpoint                                 | Mô tả                                             | Auth |
|--------|------------------------------------------|---------------------------------------------------|------|
| POST   | /v1/api/livestream/                      | Tạo session livestream mới                        | ✔️   |
| GET    | /v1/api/livestream/active                | Session stream đang live                          | ✔️   |
| PATCH  | /v1/api/livestream/:liveId               | Update session livestream                         | ✔️   |
| POST   | /v1/api/livestream/:liveId/start         | Bắt đầu live                                      | ✔️   |
| POST   | /v1/api/livestream/:liveId/join          | Join vào live                                     | ✔️   |
| POST   | /v1/api/livestream/:liveId/end           | Kết thúc stream                                   | ✔️   |
| PATCH  | /v1/api/livestream/:liveId/pin           | Pin sản phẩm ở livestream                         | ✔️   |
| PATCH  | /v1/api/livestream/:liveId/unpin         | Bỏ pin product                                    | ✔️   |
| POST   | /v1/api/livestream/:liveId/product       | Thêm sản phẩm vào livestream                      | ✔️   |
| PATCH  | /v1/api/livestream/:liveId/cancel        | Huỷ livestream                                    | ✔️   |
| GET    | /v1/api/livestream/history               | Lịch sử stream của shop                           | ✔️   |
| GET    | /v1/api/livestream/upcomming             | Stream sắp diễn ra                                | ✔️   |
| GET    | /v1/api/livestream/stats                 | Thống kê stream                                   | ✔️   |
| GET    | /v1/api/livestream/chart                 | Chart doanh thu livestream                        | ✔️   |

---

## 15. **Upload**

| Method | Endpoint                                  | Mô tả                            | Auth |
|--------|-------------------------------------------|----------------------------------|------|
| POST   | /v1/api/upload/product/thumb              | Upload ảnh sản phẩm (single)     | ✔️   |
| POST   | /v1/api/upload/multi-product/thumb        | Upload nhiều ảnh sản phẩm        | ✔️   |
| POST   | /v1/api/upload/user/avatar                | Upload avatar user               | ✔️   |

---

*Ghi chú*:  
- **[Auth]**: Cần header Authorization Bearer Token từ đăng nhập.
- Đối với các endpoint PATCH/DELETE với `:id` sẽ dựa vào quyền hạn user (RBAC) khi gọi.
- Middleware validate/check RBAC đóng vai trò bảo vệ tài nguyên hệ thống.

---

> Cập nhật tài liệu khi có route/thay đổi mới.  
> Khuyến nghị dùng tài liệu gốc này làm chuẩn cho backend/frontend/test-team, khi viết swagger chú thích dữ liệu input/output cụ thể từng API.
