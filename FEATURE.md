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
- **Chưa wired**: SKU tier index multi-dimension selection, Cart/Buy Now click handlers

---

## Chưa làm

- Cart (giỏ hàng)
- Orders (đơn hàng)
- Customer / Profile
- Auth (đăng nhập/đăng ký)
- Admin Dashboard & Analytics
