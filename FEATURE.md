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

### Cart Page ✅ (30/04/2026)
- Path: `src/features/Cart/`
- Route: `/cart` (trong `ConsumerLayout`)
- **Kiến trúc**: Server là source of truth — TanStack Query `['cart']` fetch từ `GET /cart`; Redux chỉ lưu UI state (`selectedIds`, `appliedVoucher`)

**Backend API (tất cả require authentication):**
| Method | Endpoint | Body | Mô tả |
|---|---|---|---|
| GET | `/cart` | — | Trả về `[{ shopId, shopName, items: [{ skuId, productId, quantity, price, name, image, attributes }] }]` |
| POST | `/cart` | `{ skuId, quantity }` | Thêm item, kiểm tra stock |
| PATCH | `/cart` | `{ skuId, quantity, old_quantity }` | Cập nhật số lượng, kiểm tra stock khi tăng |
| DELETE | `/cart` | `{ skuIds: string[] }` | Xóa 1 hoặc nhiều items |

**Layout:** `Grid columns={10}` — Khối trái `size={7}` + Khối phải `size={3}`, responsive xs=full.

**Components (`src/features/Cart/components/`):**
- `CartList.jsx` — header "Chọn tất cả / Xóa đã chọn", render `CartShopGroup[]`, empty state
- `CartShopGroup.jsx` — shop header (checkbox group, tên shop), list `CartItem[]`, khu vực "Khuyến mãi từ shop"
- `CartItem.jsx` — checkbox, ảnh, tên sản phẩm, variation chip (từ `item.attributes`), giá, `QuantityStepper`, nút xóa
- `CartSummary.jsx` — sticky right panel: số lượng đã chọn, tạm tính, giảm giá, tổng, nút Checkout; Collapse voucher input

**Hooks (`src/features/Cart/hooks/`):**
- `useCart.js` — tổng hợp: `useQuery(['cart'])` + spread từ `useCartCalc` + `useCartMutations`; export thêm `useCartCount` cho badge
- `useCartCalc.js` — tính `allItems` (flatten), `selectedItems`, `subtotal`, `voucherDiscount`, `total`, `isAllSelected`
- `useCartMutations.js` — `useMutation` cho add/update/remove; sau success invalidate `['cart']`, sync `selectedIds`
- `useAddToCard.js` — hook dùng chung: có SKU → gọi API; không có SKU (từ HomeProductCard) → `navigate('/product/:spu_code')`

**Redux (`src/common/redux/cart/cartSlice.js`):**
- State: `selectedIds: string[]`, `appliedVoucher`
- Actions: `toggleSelect`, `setSelectedIds` (bulk), `deselectAll`, `setVoucher`, `clearVoucher`
- Persist: có trong `whitelist` của redux-persist

**Service (`src/common/apis/services/cartService.js`):** `getCartAPI`, `addToCartAPI`, `updateCartItemAPI`, `removeFromCartAPI`

**Add to cart từ HomeProductCard:**
- Click icon giỏ → `useAddToCart({ product, selectedSku: null })` → không có `skuId` → navigate tới `/product/:spu_code`
- Tại ProductDetailPage user chọn SKU → click "Giỏ hàng" → `useAddToCart({ product, selectedSku })` → gọi API

**BottomActionBar badge:** dùng `useCartCount()` — tái dùng cache `['cart']` đã có, không gây thêm request.

**TODO còn lại:**
- Nút "Chọn mã" shop discount (chờ backend endpoint filter discount theo shopId)
- Voucher input thật (`validateVoucherAPI` — chờ backend endpoint global discount)
- Nút "Mua ngay" / checkout flow

---

## Chưa làm

- Orders (đơn hàng)
- Customer / Profile
- Auth (đăng nhập/đăng ký)
- Admin Dashboard & Analytics
