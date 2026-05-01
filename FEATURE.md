# 📋 Feature Inventory — E-commerce Frontend

Chi tiết các module/feature đã hoàn thành. Cập nhật file này sau mỗi lần ship feature mới.

---

## Admin

### Product Management
- Danh sách, filter, tạo, cập nhật, xóa sản phẩm
- Path: `src/features/Product`

### Inventory Management
- Xem tồn kho, lịch sử, nhập xuất kho
- Path: `src/features/Inventory`

### Discount Management
- Tạo/quản lý mã giảm giá
- Path: `src/features/Discount`

### Live Session Management
- Quản lý phiên livestream
- Path: `src/features/LiveSession`

---

## Consumer

### Home Page
- Path: `src/features/Home`
- Banner slider, danh mục nổi bật, Flash Sale (countdown), Best Seller, New Arrivals grid
- Components: `BannerHomePage`, `CategorySection`, `ProductScrollSection`, `ProductBestSellerSection`, `ProductGridSection`, `HomeProductCard` (portrait/landscape), `HomeFilterBar`
- Hook: `useHomeProducts` — `getAllProductsAPI` mặc định, `queryProductAPI` khi filter theo danh mục
- `HomeProductCard` click → `navigate(/product/${product.spu_code})`

### Product Detail Page
- Path: `src/features/Product/pages/ProductDetailPage.jsx`
- Route: `/product/:productId` (public), `productId` = `spu_code`
- Hook: `useProductDetail(productId)` — `src/features/Product/hooks/useProductDetail.js` (React Query, staleTime 2min)
- Layout 2 cột (md=5 | md=7) + 3 full-width rows bên dưới:
  - **LEFT**: `ProductImageGallery` (main image + 4 thumbnails) + `ProductAttributesTable` (bên dưới ảnh)
  - **RIGHT**: Info card (tên, rating, sold, category chips) → SKU image cards (`ProductVariantSelector`) → Price/stock + [Giỏ hàng] [Mua ngay]
  - **FULL**: `ShopInfoCard` (nằm ngang — mock data, TODO: real API `/shop/:shopId`)
  - **FULL**: `DescriptionBlock` (collapsible, paragraph split, gradient fade, Xem thêm/Thu gọn)
  - **FULL**: `ProductSkuTable` (bảng tất cả SKUs)
- Components trong `src/features/Product/components/ProductDetailPage/`:
  - `ProductImageGallery.jsx` — main image (contain) + 4 thumbnail slots
  - `ProductVariantSelector.jsx` — SKU image cards Shopee-style; cũng export `SkuPriceLine`
  - `ProductAttributesTable.jsx` — MUI Table, alternating rows
  - `ProductSkuTable.jsx` — bảng SKU, highlight selected row
  - `ShopInfoCard.jsx` — horizontal card, mock data
- SKU selection: state `selectedSkuId` (null) → `selectedSku` qua find chain (explicit → `sku_default` → first)
- Category chips: resolve ID → tên qua `useSelector(selectCategories)`, fallback `id.slice(-6)`
- Style: `WaterDropBackground` re-defined locally, `glassSx` constant, responsive (xs: 1 cột)
- Nút **Giỏ hàng**: dùng `useAddToCart` → gọi `POST /cart { skuId, quantity }` → invalidate `['cart']` query

### Cart Page ✅ (01/05/2026)
- Path: `src/features/Cart/`
- Route: `/cart` (trong `ConsumerLayout`)
- **Kiến trúc**: Server là source of truth — TanStack Query `['cart']` fetch từ `GET /cart`; Redux lưu UI state (`selectedIds`) và discount state (`appliedShopDiscounts`, `appliedProductVoucher`, `appliedFreeshipVoucher`).

**Backend API (tất cả require authentication):**
| Method | Endpoint | Body | Mô tả |
|---|---|---|---|
| GET | `/cart` | — | Trả về `[{ shopId, shopName, items: [{ skuId, productId, quantity, price, name, image, attributes }] }]` |
| POST | `/cart` | `{ skuId, quantity }` | Thêm item, kiểm tra stock |
| PATCH | `/cart` | `{ skuId, quantity, old_quantity }` | Cập nhật số lượng, kiểm tra stock khi tăng |
| DELETE | `/cart` | `{ skuIds: string[] }` | Xóa 1 hoặc nhiều items |
| GET | `/order/checkout` | body payload | Tính toán checkout realtime — trả `checkoutOrder`, `amoutGlobalDiscountProduct`, `amoutGlobalDiscountShipping`, `appliedDiscountCodes` |
| GET | `/discount/available/:code` | — | Kiểm tra voucher hợp lệ — `true` hoặc throw |

**Layout:** `Grid columns={10}` — Khối trái `size={7}` + Khối phải `size={3}`, responsive xs=full.

**Components (`src/features/Cart/components/`):**
- `CartList.jsx` — header "Chọn tất cả / Xóa đã chọn", render `CartShopGroup[]`, empty state
- `CartShopGroup.jsx` — shop header (checkbox group, tên shop), list `CartItem[]`, nút mở `ShopDiscountPopup`
- `CartItem.jsx` — checkbox, ảnh, tên sản phẩm, variation chip, giá, `QuantityStepper`, nút xóa
- `CartSummary.jsx` — sticky right panel: số lượng đã chọn, tạm tính, giảm shop, giảm voucher, phí ship, tổng, nút Checkout; `GlobalDiscountSection` bên dưới

**Hooks (`src/features/Cart/hooks/`):**
- `useCart.js` — tổng hợp: `useQuery(['cart'])` + spread từ `useCartCalc` + `useCartMutations`; export `useCartCount` cho badge
- `useCartCalc.js` — tính `allItems` (flatten), `selectedItems`, `subtotal`, `isAllSelected`
- `useCartMutations.js` — `useMutation` cho add/update/remove; sau success invalidate `['cart']`, sync `selectedIds`
- `useAddToCart.js` — hook dùng chung: có SKU → gọi API; không có SKU → `navigate('/product/:spu_code')`

**Checkout Summary (`src/features/Order/hooks/useCheckout.js`):**
- `queryKey: ['checkout', payload]` — tự refetch khi payload đổi (chọn/bỏ item, đổi discount)
- `enabled: !!payload?.cartId` — chỉ gọi API khi có item được chọn
- `staleTime: 0` — luôn fresh
- Tính `totalPrice`, `totalFeeShip`, `totalDiscount` từ response backend

**Discount flow (`src/features/Discount/`):**
- `useDiscounts(filters)` — query discount theo `{ scope, shopId, search, status }` (query pattern chuẩn)
- `ShopDiscountPopup.jsx` — Dialog chọn discount của 1 shop; gọi `checkAvailable` trước khi apply
- `GlobalDiscountSection.jsx` — Collapse panel chọn voucher toàn sàn (product + freeship); gọi `checkAvailable` trước khi apply
- `DiscountCardMini.jsx` — card voucher ticket style; prop `loading` hiện spinner khi đang check
- `useApplyDiscounts.js` — wrapper Redux: get/set `appliedShopDiscounts`, `appliedProductVoucher`, `appliedFreeshipVoucher`

**Redux (`src/common/redux/`):**
- `cartSlice`: `selectedIds: string[]`; actions: `toggleSelect`, `setSelectedIds`, `deselectAll`
- `discountSlice`: `appliedShopDiscounts: {}`, `appliedProductVoucher`, `appliedFreeshipVoucher`; guard `if (!state.appliedshopDiscounts) state.appliedshopDiscounts = {}` chống crash redux-persist

**Util (`src/common/utils/builder.js`):** `buildShopOrderIds(selectedItems, appliedShopDiscounts)` — build payload chuẩn cho checkout API.

**Service:** `cartService.js`, `discountService.js` (có `checkAvailable`), `orderService.js` (có `checkoutAPI`)

**Add to cart từ HomeProductCard:**
- Click icon giỏ → `useAddToCart({ product, selectedSku: null })` → navigate tới `/product/:spu_code`
- Tại ProductDetailPage user chọn SKU → click "Giỏ hàng" → gọi API

**BottomActionBar badge:** dùng `useCartCount()` — tái dùng cache `['cart']`, không thêm request.

### Checkout & Order Flow (Backend) ✅ (01/05/2026)
- `checkoutReview` — tính tiền, áp discount shop + global, trả `appliedDiscountCodes`
- `orderByUser` — giữ kho (reserveStock), tạo order, mark discount đã dùng (`markDiscountsAsUsed`), gửi email COD / đẩy MQ cho non-COD
- `order.model.js` — field `order_appliedDiscountCodes: [String]`, `order_payment: { method, paymentStatus }`
- `payment.service.js` — VNPay IPN: xác thực hash, confirm/cancel stock, increment sold; COD: gửi email xác nhận
- **Bugs đã fix:** `order_payment` type, discount codes không pass vào checkout, OtpModel import thiếu, `incrementProductSold` sai params, `changeStatusOrder` ghi đè paymentStatus thành chuỗi rỗng, `hanldeCodPayment` không await

---

## Chưa làm

- Orders (đơn hàng) — UI list đơn, chi tiết đơn, trạng thái
- Customer / Profile — thông tin cá nhân, địa chỉ, lịch sử mua
- Auth — đăng nhập / đăng ký (API backend đã có)
- Admin Dashboard & Analytics (recharts)
