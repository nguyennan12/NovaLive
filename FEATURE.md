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

## Consumer — Live Feed (Consumer Watch)

### Live Feed Page ✅ (05/05/2026)
- Path: `src/features/LiveSession/`
- Route: `/live` (trong ConsumerLayout) — vertical swipe feed TikTok-style

**Socket (socket.io-client ^4.8.3):**
- Singleton: `src/common/utils/socket.js` — `getSocket()`, `connectSocket(userId)`
- Backend URL: `VITE_SOCKET_URL` (default `http://localhost:3031`)
- Events client→server: `join-live(liveCode)`, `leave-live(liveCode)`, `send-like(liveCode)`, `send-comment({liveCode, userName, userId, avatar, message})`
- Events server→client: `UPDATE_VIEWERS`, `UPDATE_LIKES`, `NEW_COMMENT`, `COMMENT_ERROR`, `PRODUCT_PINNED`

**Hook (`src/features/LiveSession/hooks/useLiveSocket.js`):**
- Nhận: `{ liveCode, userId, userName, avatar, liveProducts, initialViewers, initialLikes }`
- Tự động join/leave socket room khi `liveCode` đổi — không leak listener
- `normalizePinned()` enrich socket PRODUCT_PINNED event với full `skus` data từ `liveProducts`
- Optimistic like: `setLikes(prev+1)` trước khi emit
- Comment buffer giới hạn 100 item (slice)
- Returns: `{ viewers, likes, comments, pinnedProduct, sendLike, sendComment, commentError }`

**Components (`src/features/LiveSession/components/LiveFeedPage/`):**
- `LiveFeed.jsx` — swipe container, mount `LivePlayer` + `LiveOverlay` với cùng `key={live._id}`
- `LiveOverlay.jsx` — pointer-events:none container, orchestrate toàn bộ overlay UI + gọi `useLiveSocket`
- `LiveHeaderInfo.jsx` — top: shop avatar, tên, live badge, tiêu đề phiên; gradient fade from top
- `LiveStats.jsx` — right side `top:60%`: viewer count (eye icon) + like button (heart icon + optimistic count)
- `LiveComments.jsx` — bottom left: comment list auto-scroll + input bar (Enter/button gửi); anti-overlap với stats: `right:54px`
- `PinnedProductCard.jsx` — `bottom:196, left:10`: glassmorphism card hiện sản phẩm đang ghim; click mở sheet


**Luồng add-to-cart từ live:**
- `useCartMutations().addToCartAsync({ skuId, quantity: 1 })`
- "Mua ngay": addToCart → `dispatch(setSelectedIds([skuId]))` → `navigate('/order')`
- Nút disabled khi không có `skuId` (socket event không có skuId → fallback từ `liveProducts` bằng `productId`)

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
- Tính `finalCheckout`, `totalFeeShip`, `totalDiscount` từ response backend

**Discount flow (`src/features/Discount/`):**
- `useDiscounts(filters)` — query discount theo `{ scope, shopId, search, status }` (query pattern chuẩn)
- `ShopDiscountPopup.jsx` — Dialog chọn discount của 1 shop; gọi `checkAvailable` trước khi apply
- `GlobalDiscountSection.jsx` — Collapse panel chọn voucher toàn sàn (product + freeship); gọi `checkAvailable` trước khi apply
- `DiscountCardMini.jsx` — card voucher ticket style; prop `loading` hiện spinner khi đang check
- `useApplyDiscounts.js` — wrapper Redux: get/set `appliedShopDiscounts`, `appliedProductVoucher`, `appliedFreeshipVoucher`

**Redux (`src/common/store/`):**
- `cartSlice`: `selectedIds: string[]`; actions: `toggleSelect`, `setSelectedIds`, `deselectAll`
- `discountSlice`: `appliedShopDiscounts: {}`, `appliedProductVoucher`, `appliedFreeshipVoucher`; guard `if (!state.appliedshopDiscounts) state.appliedshopDiscounts = {}` chống crash redux-persist

**Util (`src/common/utils/builder.js`):** `buildShopOrderIds(selectedItems, appliedShopDiscounts)` — build payload chuẩn cho checkout API.

**Service:** `cartService.js`, `discountService.js` (có `checkAvailable`), `orderService.js` (có `checkoutAPI`)

**Add to cart từ HomeProductCard:**
- Click icon giỏ → `useAddToCart({ product, selectedSku: null })` → navigate tới `/product/:spu_code`
- Tại ProductDetailPage user chọn SKU → click "Giỏ hàng" → gọi API

**BottomActionBar badge:** dùng `useCartCount()` — tái dùng cache `['cart']`, không thêm request.

### Address Module ✅ (02/05/2026)
- Path: `src/features/Address/hooks/`
- `useAddress(user)` — 2 queries: `['address_user', addressId]` lấy địa chỉ mặc định; `['all_address_user', userId]` lấy toàn bộ địa chỉ user (`user?._id` là key)
- `useAddressMutations(userId)` — `createAddress` mutation → gọi `createAddressAPI(payload)` → `refetchQueries(['all_address_user'])` + toast
- `useShipping.js` — 3 hooks từ GHN master-data API (`staleTime: Infinity` do dữ liệu tĩnh):
  - `useProvinces()` — `GET /master-data/province`
  - `useDistricts(provinceId)` — `GET /master-data/district?province_id=<id>`, enabled khi có provinceId
  - `useWards(districtId)` — `GET /master-data/ward?district_id=<id>`, enabled khi có districtId
- `shippingService.js` (`src/common/apis/services/`) — axios instance GHN với `Token` header; base URL = `VITE_GHN_API_URL` (bỏ `/v2` khi gọi master-data)

### Order Page (Consumer) ✅ (02/05/2026)
- Path: `src/features/Order/`
- Route: `/order` (trong `ConsumerLayout`) — navigate tới từ:
  - CartSummary nút "Thanh toán" → `navigate('/order')`
  - ProductDetailPage nút "Mua ngay" → `addToCartAsync` + `dispatch(setSelectedIds([skuId]))` + `navigate('/order')`

**Layout:** `Grid columns={10}` — Trái `size={7}` (sản phẩm / địa chỉ / vận chuyển / voucher) | Phải `size={3}` sticky (thanh toán / tóm tắt / nút đặt hàng). Mobile: sticky bottom bar qua React Portal.

**Components (`src/features/Order/components/`):**
- `OrderProductList.jsx` — header section + map qua `CartShopGroup` (tái dùng từ Cart, gồm cả `ShopDiscountPopup`)
- `OrderProductItem.jsx` — ảnh, tên, SKU chip, tên shop, giá, số lượng, thành tiền
- `OrderAddressSection.jsx` — hiển thị địa chỉ mặc định (`useAddress(user)`), nút "Chọn địa chỉ khác / Thêm địa chỉ" → mở `AddressModal`; truyền `allAddressUser` và `userId` vào modal
- `AddressModal.jsx` — Dialog 2 phần:
  - **Danh sách địa chỉ đã lưu** (`addresses` prop từ `allAddressUser`) — card có hover effect + icon; click chọn ngay → `onSelect(addr)` + close
  - **Collapsible form tạo địa chỉ mới** — toggle button "Thêm địa chỉ mới / Thu gọn"; auto-expand khi chưa có địa chỉ; RHF Controller + MUI Autocomplete cascading: Tỉnh (GHN ProvinceID) → Quận (DistrictID) → Phường (WardCode); submit → `createAddress(payload)` mutation → `onSelect(created)` + close
  - Reset state (province/district/ward + form) khi close hoặc toggle
- `OrderShippingInfo.jsx` — logo GHN, phí ship realtime (từ `useCheckout` gọi backend, backend tính qua GHN fee API), freeship chip, bảng chính sách vận chuyển
- `OrderVoucherSection.jsx` — tái dùng `GlobalDiscountSection` + `useApplyDiscounts` (state giữ nguyên từ Cart)
- `OrderSummary.jsx` — tạm tính, giảm shop, voucher, phí ship, tiết kiệm, tổng thanh toán
- `OrderPaymentMethod.jsx` — 3 radio card (COD / VNPay / MoMo) với React Hook Form `Controller`; logo từ `LOGO` constant

**Page (`src/features/Order/pages/OrderPage.jsx`):**
- `useCart()` → `selectedItems`, `cartId`
- `useApplyDiscounts()` → discount state (Redux, đã set từ Cart)
- `useCheckout(payload)` → tính tổng realtime kèm phí ship GHN (gọi `POST /order/checkout`)
- `useMutation(OrderByUserAPI)` → submit đặt hàng thành công
- Mobile sticky bar dùng `createPortal(…, document.body)` — tránh bị Footer đè

### COD OTP Dialog ✅ (03/05/2026)
- Component: `src/features/Order/components/CodOtpDialog.jsx`
- Hiển thị sau khi đặt hàng COD thành công — dialog 6 ô nhập OTP gửi về email
- Hook: `useOtpTimer(RESEND_COOLDOWN, open)` — countdown 60s, reset khi dialog đóng
- Hook: `useOrderMutation({ onSuccessConfirm })` — `confirmMutation` gọi `POST /order/confirm-otp`, `resendMutation` gọi `POST /order/resend-otp`
- UX: auto-focus ô đầu, paste cả chuỗi 6 số, ArrowLeft/Right/Backspace navigate, nút Gửi lại sau cooldown

### VNPay Redirect ✅ (03/05/2026)
- Sau khi `orderByUser` trả về `paymentUrl`, `OrderPage` redirect tới `window.location.href = response.paymentUrl`
- VNPay IPN callback (backend) xác thực HMAC hash, nếu hợp lệ: confirm stock → `incrementProductSold`; nếu sai/timeout: nhả kho (`releaseStock`)
- TODO còn lại: trang `/vnpay-return` để hiển thị kết quả sau khi VNPay redirect về

### Checkout & Order Flow (Backend) ✅ (03/05/2026)
- `checkoutReview` — tính tiền, áp discount shop + global, trả `appliedDiscountCodes`
- `orderByUser` — giữ kho (`reserveStock`), tạo order, mark discount đã dùng (`markDiscountsAsUsed`), gửi email OTP (COD) / tạo VNPay URL (VNPay)
- `order.model.js` — field `order_appliedDiscountCodes: [String]`, `order_payment: { method, paymentStatus }`
- `payment.service.js` — VNPay IPN: xác thực hash, confirm/nhả kho, increment sold; COD: gửi OTP email, confirm OTP → mark paid
- **Stock lifecycle:** `reserveStock` lúc đặt → `confirmStock` khi thanh toán thành công → `releaseStock` khi hủy/VNPay timeout
- **RBAC:** grant phân quyền đã thêm vào toàn bộ router (order, product, discount, inventory, livestream, auth)
- **Bugs đã fix:** `order_payment` type, discount codes không pass vào checkout, OtpModel import thiếu, `incrementProductSold` sai params, `changeStatusOrder` ghi đè paymentStatus thành chuỗi rỗng, `hanldeCodPayment` không await

### Integration Tests (Backend) ✅ (03/05/2026)
- Path: `apps/backend/tests/integration/`
- Runner: Jest + `mongodb-memory-server` — không cần DB thật, chạy độc lập
- `full.flow.test.js` — end-to-end: đăng ký → đăng nhập → thêm giỏ → checkout → đặt hàng COD → xác nhận OTP
- `order.payment.vnpay.test.js` — VNPay IPN callback: hash hợp lệ → confirm stock; hash sai → nhả kho
- `livestream.flow.test.js` — tạo phiên live → start → stop → kiểm tra trạng thái
- `auth.test.js` — đăng ký, đăng nhập, refresh token, verify email
- `rbac.test.js` — phân quyền: shop owner vs consumer vs admin trên từng route
- CI: chạy qua `yarn workspace livestream-ecommerce test:cov` trong GitHub Actions

---

### Order History Page (Consumer) ✅ (05/05/2026)
- Path: `src/features/Order/`
- Route: `/orders` (trong `ConsumerLayout`) — có sẵn trong BottomActionBar mục "Đơn hàng"

**Backend bổ sung:**
- `getAllOrderByUser` — thêm `.populate({ path: 'order_products.productId', select: '...spu_shopId', populate: 'shop_name' })` để hiện ảnh/tên/shop trong list
- `cancelOrder` — endpoint `PATCH /order/:orderId/cancel` (user tự hủy đơn `pending`): validate owner + status, `releaseStock`, cập nhật status + cancelledAt
- `changeStatusOrder` — bổ sung tự động set `deliveredAt` / `cancelledAt` khi đổi status
- `getOrderDetail` — sửa lookup từ `order_trackingNumber` → `_id`

**Frontend API (`orderService.js`):**
- `getMyOrdersAPI(params)` — GET /order/my-orders
- `getOrderDetailAPI(orderId)` — GET /order/my-orders/:orderId (orderId = MongoDB `_id`)
- `cancelOrderAPI(orderId)` — PATCH /order/:orderId/cancel

**Constants (`src/features/Order/constants/orderStatus.js`):**
- `STATUS_CONFIG` — label, màu, icon cho 6 trạng thái (pending/processing/confirmed/shipped/delivered/cancelled)
- `ORDER_TABS` — 6 tab với `statuses[]` để filter client-side
- `canCancelOrder`, `isDeliveredWithinReturnWindow` — helper logic cho nút action

**Hooks (`src/features/Order/hooks/`):**
- `useInfiniteOrders()` — `queryKey: ['my_orders']`, fetch tất cả (limit 100), staleTime 30s
- `useOrderDetail(orderId)` — `queryKey: ['order-detail', orderId]`, enabled khi có orderId
- `useOrderHistoryMutations()` — `cancelMutation`: gọi `cancelOrderAPI`, invalidate `['my-orders']`

**Components (`src/features/Order/components/`):**
- `OrderHistoryCard.jsx` — card với header shop, preview ảnh/tên sản phẩm đầu, total, nút action theo trạng thái; export `OrderHistoryCardSkeleton`
- `CancelOrderDialog.jsx` — confirm dialog hủy đơn
- `OrderStatusTimeline.jsx` — timeline 5 bước (pending→delivered), xử lý riêng nhánh cancelled
- `OrderDetailDrawer.jsx` — Dialog (`maxWidth="sm"`, fullScreen mobile): status banner, tracking code, timeline, sản phẩm theo shop, price summary, địa chỉ giao, thông tin thanh toán; `useOrderDetail` được gọi lazy khi mở

**Page (`src/features/Order/pages/OrderHistoryPage.jsx`):**
- Tabs 6 trạng thái với badge đếm số đơn — filter client-side từ `useMyOrders()`
- Empty state khi không có đơn nào ở tab hiện tại
- Skeleton loading khi đang fetch
- Nút action theo trạng thái: "Hủy đơn" (pending), "Trả hàng"/"Đánh giá" (delivered trong 10 ngày), "Mua lại" (delivered quá hạn)

## Chưa làm

- **Customer / Profile** — thông tin cá nhân, quản lý địa chỉ (tái dùng `AddressModal`), lịch sử mua hàng
- **Auth UI** — đăng nhập / đăng ký (API backend + Redux `loginUserAPI` đã có)
- **Admin Dashboard & Analytics** — recharts doanh thu, tồn kho, đơn hàng
