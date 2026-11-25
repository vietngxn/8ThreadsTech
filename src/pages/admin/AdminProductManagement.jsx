import { useEffect, useMemo, useRef, useState } from 'react';
import {
  IconAdjustments, IconChevronDown, IconChevronLeft, IconChevronRight,
  IconDownload, IconEye, IconEyeOff,
  IconPackage, IconPackageOff, IconPackages, IconPencil, IconPlus,
  IconSearch, IconTrash, IconX, IconTag, IconLoader2,
  IconPhoto, IconUpload,
} from '@tabler/icons-react';
import AdminSidebar from '../../components/admin/AdminSidebar.jsx';
import { productService } from '../../services/productService.js';
import { categoryService } from '../../services/categoryService.js';
import api from '../../services/api.js';
import './AdminProductManagement.css';

const formatPrice = (price) => `${Number(price).toLocaleString('vi-VN')} ₫`;
const stockState = (stock) => stock === 0 ? 'out' : stock < 10 ? 'low' : 'available';

const LAYOUTS = ['60%', '65%', '75%', '80%', '87%', '98%', '100%'];
const CONNECTIONS = ['3 chế độ kết nối', 'Không dây Bluetooth', 'Có dây USB-C'];
const SWITCH_TYPES = ['Linear', 'Tactile', 'Magnetic'];
const BRAND = ['8ThreadsTech'];

/* ═══════════════════════════════════════════════
   HELPER: ImageUploadZone
   Hỗ trợ cả URL nhập tay lẫn upload file
═══════════════════════════════════════════════ */
function ImageUploadZone({ images = [], onChange, label = 'Ảnh sản phẩm', maxCount = 6, hint }) {
  const fileRef = useRef(null);
  const [urlInput, setUrlInput] = useState('');
  const [dragging, setDragging] = useState(false);

  /* Upload file → chuyển thành object URL tạm thời (hoặc gọi API upload thực) */
  const handleFiles = (files) => {
    const list = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (!list.length) return;
    // Tạo object URL preview; trong production sẽ thay bằng FormData upload lên server
    const urls = list.map((f) => URL.createObjectURL(f));
    const next = [...images, ...urls].slice(0, maxCount);
    onChange(next);
  };

  const addUrl = () => {
    const url = urlInput.trim();
    if (!url) return;
    if (images.includes(url)) { setUrlInput(''); return; }
    onChange([...images, url].slice(0, maxCount));
    setUrlInput('');
  };

  const removeImage = (idx) => onChange(images.filter((_, i) => i !== idx));

  const moveLeft = (idx) => {
    if (idx === 0) return;
    const next = [...images];
    [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
    onChange(next);
  };

  const moveRight = (idx) => {
    if (idx === images.length - 1) return;
    const next = [...images];
    [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
    onChange(next);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div className="pm-image-zone">
      <div className="pm-image-zone-header">
        <span className="pm-image-zone-label"><IconPhoto size={13} /> {<span style={{ display: 'flex' }}>
          Ảnh sản phẩm  <span className="pm-req">*</span>
        </span>}</span>
        {hint && <small className="pm-image-zone-hint">{hint}</small>}
      </div>

      {/* Thumbnails */}
      {images.length > 0 && (
        <div className="pm-image-thumbs">
          {images.map((src, i) => (
            <div key={i} className={`pm-thumb ${i === 0 ? 'pm-thumb-primary' : ''}`}>
              <img src={src} alt={`Ảnh ${i + 1}`} />
              {i === 0 && <span className="pm-thumb-primary-badge">Chính</span>}
              <div className="pm-thumb-actions">
                <button type="button" title="Dịch trái" disabled={i === 0} onClick={() => moveLeft(i)}><IconChevronLeft size={11} /></button>
                <button type="button" title="Dịch phải" disabled={i === images.length - 1} onClick={() => moveRight(i)}><IconChevronDown size={11} style={{ transform: 'rotate(-90deg)' }} /></button>
                <button type="button" title="Xóa ảnh" className="pm-thumb-del" onClick={() => removeImage(i)}><IconX size={11} /></button>
              </div>
            </div>
          ))}

          {/* Slot thêm ảnh */}
          {images.length < maxCount && (
            <button
              type="button"
              className="pm-thumb pm-thumb-add"
              onClick={() => fileRef.current?.click()}
              title="Thêm ảnh"
            >
              <IconPlus size={18} />
              <small>Thêm</small>
            </button>
          )}
        </div>
      )}

      {/* Drop zone (chỉ hiện khi chưa có ảnh nào) */}
      {images.length === 0 && (
        <div
          className={`pm-dropzone ${dragging ? 'dragging' : ''}`}
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
        >
          <IconUpload size={22} />
          <span>Kéo thả ảnh vào đây</span>
          <small>hoặc bấm để chọn file (PNG, JPG, WebP)</small>
        </div>
      )}

      {/* Input URL */}
      <div className="pm-url-row">
        <input
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addUrl())}
          placeholder="Hoặc dán URL ảnh rồi nhấn Thêm..."
          disabled={images.length >= maxCount}
        />
        <button
          type="button"
          className="pm-button secondary pm-btn-sm"
          onClick={addUrl}
          disabled={!urlInput.trim() || images.length >= maxCount}
        >
          Thêm
        </button>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        className="pm-file-input"
        onChange={(e) => { handleFiles(e.target.files); e.target.value = ''; }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════
   VARIANT ITEM trong modal
═══════════════════════════════════════════════ */
function VariantItem({ variant, index, onChange, onRemove }) {
  const update = (key) => (e) =>
    onChange(index, { ...variant, [key]: e.target.value });

  const updateImages = (imgs) =>
    onChange(index, { ...variant, images: imgs });

  const isFirst = index === 0;

  return (
    <div className="pm-variant-item">
      <div className="pm-variant-row">
        <label>
          <span style={{ display: 'flex' }}>
            Màu sắc <span className="pm-req">*</span>
          </span>
          <input value={variant.name || ''} onChange={update('name')} placeholder="Vd: Bạc ánh trăng" />
        </label>
        <label>
          <span style={{ display: 'flex' }}>
            Mã màu (HEX) <span className="pm-req">*</span>
          </span>

          <div className="pm-color-pick">
            <input type="color" value={variant.hex || '#c8c9ca'} onChange={update('hex')} />
            <input value={variant.hex || '#c8c9ca'} onChange={update('hex')} placeholder="#c8c9ca" />
          </div>
        </label>
        <label>
          <span style={{ display: 'flex' }}>
            Chi tiết Switch <span className="pm-req">*</span>
          </span>
          <input value={variant.switchName || ''} onChange={update('switchName')} placeholder="Vd: Linear Red Switch" />
        </label>
      </div>
      <div className="pm-variant-row">
        <label>
          <span style={{ display: 'flex' }}>
            Giá bán (đ) <span className="pm-req">*</span>
          </span>
          <input type="number" min="0" value={variant.price || ''} onChange={update('price')} placeholder="2490000" />
        </label>
        <label>
          Giá gốc / giá cũ (₫)
          <input type="number" min="0" value={variant.compareAtPrice || ''} onChange={update('compareAtPrice')} placeholder="Để trống nếu không có" />
        </label>
        <label>
          <span style={{ display: 'flex' }}>
            Tồn kho <span className="pm-req">*</span>
          </span>
          <input type="number" min="0" value={variant.stock ?? 0} onChange={update('stock')} placeholder="0" />
        </label>
      </div>

      {/* Ảnh riêng của variant */}
      <ImageUploadZone
        images={variant.images || []}
        onChange={updateImages}
        label={`Ảnh sản phẩm`}
        maxCount={4}
      />

      <button type="button" className="pm-variant-remove" onClick={() => onRemove(index)} aria-label="Xóa phiên bản">
        <IconX size={13} /> Xóa phiên bản này
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   DIALOG THÊM / SỬA SẢN PHẨM
═══════════════════════════════════════════════ */
function ProductDialog({ product, categories, onClose, onSave }) {
  const isEdit = !!product?.numericId;

  const [form, setForm] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    badge: product?.badge || 'MỚI RA MẮT',
    categoryId: product?.categoryId || '',
    layout: product?.layout || '',
    connectionType: product?.connection || '',
    switchType: product?.switch || '',
    shortDescription: product?.specs || '',
    description: product?.description || '',
    published: product?.status !== 'DRAFT',
    heroTitleMain: 'Thread',
    heroTitleAccent: product?.heroNumber || '',
    statValue: product?.statValue || '1.000 Hz',
    statLabel: product?.statLabel || 'KHÔNG DÂY · KHÔNG ĐỘ TRỄ',
  });

  const [variants, setVariants] = useState(
    product?.rawVariants?.length
      ? product.rawVariants.map((v) => ({
        id: v.id,
        name: v.attributes?.color || v.color || v.name || '',
        hex: v.attributes?.colorHex || v.colorHex || '#c8c9ca',
        switchName: v.attributes?.switch || v.switchName || '',
        price: v.price || '',
        compareAtPrice: v.compareAtPrice || '',
        stock: v.stock ?? 0,
        images: v.images || [],
      }))
      : [{ name: '', hex: '#c8c9ca', switchName: '', price: '', compareAtPrice: '', stock: 0, images: [] }]
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const updateForm = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const updateVariant = (index, updated) =>
    setVariants((vs) => vs.map((v, i) => (i === index ? updated : v)));

  const addVariant = () =>
    setVariants((vs) => [...vs, { name: '', hex: '#c8c9ca', switchName: '', price: '', compareAtPrice: '', stock: 0, images: [] }]);

  const removeVariant = (index) =>
    setVariants((vs) => vs.filter((_, i) => i !== index));

  /* Auto-generate slug từ tên */
  const handleNameBlur = () => {
    if (!form.slug && form.name) {
      const auto = form.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      setForm((f) => ({ ...f, slug: auto }));
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (variants.length === 0) { setError('Cần ít nhất một phiên bản màu sắc.'); return; }
    if (variants.some((v) => !v.name || !v.price)) {
      setError('Mỗi phiên bản cần có tên màu và giá bán.');
      return;
    }

    setSaving(true);
    try {
      const primaryImageUrl = variants[0]?.images?.[0] || undefined;
      if (primaryImageUrl === undefined) { setError('Mỗi phiên bản cần phải có ảnh đại diện'); return; }

      const payload = {
        name: form.name,
        slug: form.slug || undefined,
        badge: form.badge,
        categoryId: form.categoryId ? Number(form.categoryId) : undefined,
        layout: form.layout,
        connectionType: form.connectionType,
        switchType: form.switchType,
        shortDescription: form.shortDescription,
        description: form.description,
        status: form.published ? 'ACTIVE' : 'DRAFT',
        primaryImageUrl,
        hero: {
          titleMain: form.heroTitleMain,
          titleAccent: form.heroTitleAccent,
          statValue: form.statValue,
          statLabel: form.statLabel,
          slides: variants.map((v) => v.images?.[0]).filter(Boolean),
        },
        variants: variants.map((v) => ({
          id: v.id || undefined,
          color: v.name,
          colorHex: v.hex,
          switchName: v.switchName,
          price: Number(v.price),
          compareAtPrice: v.compareAtPrice ? Number(v.compareAtPrice) : null,
          stock: Number(v.stock ?? 0),
          images: v.images || [],
        })),
      };

      if (isEdit) {
        await api.put(`/api/products/${product.numericId}`, payload);
      } else {
        await api.post('/api/products', payload);
      }

      onSave(isEdit ? 'Đã cập nhật sản phẩm.' : 'Đã thêm sản phẩm mới.');
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra, vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="pm-modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <form className="pm-dialog pm-dialog-wide" onSubmit={submit} aria-labelledby="pm-dialog-title">

        {/* Header */}
        <div className="pm-dialog-heading">
          <h2 id="pm-dialog-title">{isEdit ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</h2>
          <button type="button" className="pm-icon-button" onClick={onClose} aria-label="Đóng">
            <IconX size={18} />
          </button>
        </div>

        <div className="pm-dialog-body">
          {/* ── Cột trái: thông tin cơ bản + ảnh hero ── */}
          <div className="pm-dialog-col">
            <fieldset className="pm-fieldset">
              <legend>Thông tin cơ bản</legend>

              <label>
                <span style={{ display: 'flex' }}>
                  Tên sản phẩm <span className="pm-req">*</span>
                </span>
                <input
                  required autoFocus
                  value={form.name}
                  onChange={updateForm('name')}
                  onBlur={handleNameBlur}
                  placeholder="Ví dụ: THREAD 75"
                />
              </label>

              <label>
                Đường dẫn (slug)
                <input
                  value={form.slug}
                  onChange={updateForm('slug')}
                  placeholder="thread-75 (tự tạo nếu để trống)"
                />
              </label>

              <div className="pm-form-grid">
                <label>
                  <span style={{ display: 'flex' }}>
                    Brand <span className="pm-req">*</span>
                  </span>
                  <select value={form.badge} onChange={updateForm('badge')}>
                    {BRAND.map((b) => <option key={b}>{b}</option>)}
                  </select>
                </label>
                <label>
                  <span style={{ display: 'flex' }}>
                    Danh mục <span className="pm-req">*</span>
                  </span>
                  <select value={form.categoryId} onChange={updateForm('categoryId')}>
                    <option value="">— Chọn danh mục —</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="pm-form-grid pm-form-grid-3">
                <label>
                  <span style={{ display: 'flex' }}>
                    Layout <span className="pm-req">*</span>
                  </span>
                  <select value={form.layout} onChange={updateForm('layout')}>
                    <option value="">— Chọn —</option>
                    {LAYOUTS.map((l) => <option key={l}>{l}</option>)}
                  </select>
                </label>
                <label>
                  <span style={{ display: 'flex' }}>
                    Kết nối <span className="pm-req">*</span>
                  </span>
                  <select value={form.connectionType} onChange={updateForm('connectionType')}>
                    <option value="">— Chọn —</option>
                    {CONNECTIONS.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </label>
                <label>
                  <span style={{ display: 'flex' }}>
                    Loại Switch <span className="pm-req">*</span>
                  </span>
                  <select value={form.switchType} onChange={updateForm('switchType')}>
                    <option value="">— Chọn —</option>
                    {SWITCH_TYPES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </label>
              </div>
              <label>
                <span style={{ display: 'flex' }}>
                  Mô tả chi tiết <span className="pm-req">*</span>
                </span>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={updateForm('description')}
                  placeholder="Mô tả đầy đủ hiển thị trên trang chi tiết sản phẩm..."
                />
              </label>
            </fieldset>

          </div>

          {/* ── Cột phải: variants (màu + ảnh riêng) ── */}
          <div className="pm-dialog-col">
            <fieldset className="pm-fieldset pm-fieldset-variants">
              <legend>Phiên bản</legend>

              <div className="pm-variants-list">
                {variants.map((v, i) => (
                  <VariantItem
                    key={i}
                    variant={v}
                    index={i}
                    onChange={updateVariant}
                    onRemove={removeVariant}
                  />
                ))}
              </div>

              <button type="button" className="pm-button secondary pm-add-variant" onClick={addVariant}>
                <IconPlus size={12} /> Thêm phiên bản màu
              </button>
            </fieldset>

            {/* Preview swatch */}
            {variants.some((v) => v.hex) && (
              <div className="pm-swatch-preview">
                <span className="pm-swatch-preview-label">Xem trước màu sắc:</span>
                <div className="pm-swatch-dots">
                  {variants.map((v, i) => (
                    <span
                      key={i}
                      className="pm-swatch-dot pm-swatch-dot-lg"
                      style={{ background: v.hex || '#ccc' }}
                      title={v.name || `Màu ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {error && <p className="pm-dialog-error">{error}</p>}

        <div className="pm-dialog-actions">
          <button type="button" className="pm-button secondary" onClick={onClose} disabled={saving}>Hủy</button>
          <button className="pm-button primary" type="submit" disabled={saving}>
            {saving
              ? <><IconLoader2 size={15} className="pm-spin" /> Đang lưu...</>
              : isEdit ? 'Lưu thay đổi' : 'Thêm sản phẩm'}
          </button>
        </div>
      </form>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   TRANG CHÍNH
═══════════════════════════════════════════════ */
export default function AdminProductManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');
  const [sort, setSort] = useState('newest');
  const [tab, setTab] = useState('all');
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const [selectedIds, setSelectedIds] = useState([]);
  const [dialogProduct, setDialogProduct] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [notice, setNotice] = useState('');

  /* ── Tải dữ liệu ── */
  const fetchProducts = async () => {
    setLoading(true);
    const result = await productService.getProducts({ pageSize: 200 });
    setProducts(result.products);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
    categoryService.getParentCategories().then(setCategories).catch(() => { });
  }, []);

  /* ── Lọc & sắp xếp ── */
  const totalStock = (p) =>
    p.rawVariants?.reduce((s, v) => s + (Number(v.stock) || 0), 0) ??
    (p.inStock ? 10 : 0);

  const loadData = () => {
    setLoading(true);
    Promise.all([
      productService.getProducts({ pageSize: 100 }),
      categoryService.getAllCategories(),
    ])
      .then(([prodRes, catList]) => {
        if (prodRes?.products && prodRes.products.length > 0) {
          const mapped = prodRes.products.map((p) => {
            const firstVariant = p.rawVariants?.[0] || {};
            return {
              id: p.numericId || p.id,
              name: p.name,
              variant: p.variant || (p.colors?.[0]?.switchDesc || ''),
              sku: firstVariant.sku || `TH-${p.numericId || p.id}`,
              category: p.categoryName || 'Bàn phím cơ',
              categoryId: p.categoryId,
              price: p.price || 0,
              stock: p.inStock ? 35 : 0,
              image: p.image || thread75,
              published: p.status !== 'INACTIVE',
              slug: p.slug,
            };
          });
          setProducts(mapped);
        }
        if (Array.isArray(catList) && catList.length > 0) {
          setCategories(catList);
        }
      })
      .catch((err) => console.warn('Lỗi tải dữ liệu sản phẩm / danh mục:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredProducts = useMemo(() => {
    const q = query.trim().toLocaleLowerCase('vi');
    return products
      .filter((p) => {
        const text = `${p.name} ${p.slug} ${p.variant} ${p.specs}`.toLocaleLowerCase('vi');
        const matchQ = text.includes(q);
        const matchCat = category === 'all' || p.categoryName === category;
        const matchStatus =
          status === 'all' ||
          (status === 'published' ? p.status === 'ACTIVE' : p.status !== 'ACTIVE');
        const stock = stockState(totalStock(p));
        const matchTab = tab === 'all' || stock === tab;
        return matchQ && matchCat && matchStatus && matchTab;
      })
      .sort((a, b) => {
        if (sort === 'price-asc') return a.price - b.price;
        if (sort === 'price-desc') return b.price - a.price;
        return (b.numericId || 0) - (a.numericId || 0);
      });
  }, [products, query, category, status, sort, tab]);

  const pageCount = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const visibleProducts = filteredProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  /* ── Checkbox ── */
  const allVisibleSelected =
    visibleProducts.length > 0 && visibleProducts.every((p) => selectedIds.includes(p.numericId));
  const toggleAllVisible = () => {
    setSelectedIds((cur) =>
      allVisibleSelected
        ? cur.filter((id) => !visibleProducts.some((p) => p.numericId === id))
        : [...new Set([...cur, ...visibleProducts.map((p) => p.numericId)])]
    );
  };
  const toggleSelect = (id) =>
    setSelectedIds((cur) => (cur.includes(id) ? cur.filter((i) => i !== id) : [...cur, id]));

  /* ── Xóa ── */
  const deleteProduct = async (p) => {
    if (!window.confirm(`Bạn có chắc muốn xóa sản phẩm "${p.name}" không?`)) return;
    try {
      await api.delete(`/api/products/${p.numericId}`);
      setProducts((cur) => cur.filter((item) => item.numericId !== p.numericId));
      setSelectedIds((cur) => cur.filter((id) => id !== p.numericId));
      setNotice(`Đã xóa sản phẩm "${p.name}".`);
    } catch (err) {
      setNotice(`Lỗi: ${err.message}`);
    }
  };

  /* ── Toggle publish ── */
  const togglePublish = async (p) => {
    const newStatus = p.status === 'ACTIVE' ? 'DRAFT' : 'ACTIVE';
    try {
      await api.patch(`/api/products/${p.numericId}/status`, { status: newStatus });
      setProducts((cur) =>
        cur.map((item) =>
          item.numericId === p.numericId ? { ...item, status: newStatus } : item
        )
      );
      setNotice(
        newStatus === 'ACTIVE'
          ? `Đã hiển thị sản phẩm "${p.name}".`
          : `Đã chuyển "${p.name}" về bản nháp.`
      );
    } catch (err) {
      setNotice(`Lỗi: ${err.message}`);
    }
  };

  /* ── Stats ── */
  const stats = [
    { label: 'Tổng sản phẩm', value: products.length, note: 'Tất cả danh mục', Icon: IconPackage },
    { label: 'Đang hiển thị', value: products.filter((p) => p.status === 'ACTIVE').length, note: 'Đã xuất bản trên cửa hàng', Icon: IconEye },
    { label: 'Sắp hết hàng', value: products.filter((p) => stockState(totalStock(p)) === 'low').length, note: 'Tồn kho từ 1 đến 9', Icon: IconPackages, alert: true },
    { label: 'Hết hàng', value: products.filter((p) => stockState(totalStock(p)) === 'out').length, note: 'Cần bổ sung tồn kho', Icon: IconPackageOff, alert: true },
  ];

  const counts = {
    all: products.length,
    available: products.filter((p) => stockState(totalStock(p)) === 'available').length,
    low: products.filter((p) => stockState(totalStock(p)) === 'low').length,
    out: products.filter((p) => stockState(totalStock(p)) === 'out').length,
  };

  /* ── Lưu (sau khi dialog gọi API) ── */
  const handleSave = (msg) => {
    setDialogOpen(false);
    setNotice(msg);
    fetchProducts();
  };

  /* ── Export CSV ── */
  const exportCsv = () => {
    const target = selectedIds.length
      ? products.filter((p) => selectedIds.includes(p.numericId))
      : filteredProducts;
    const rows = [
      ['Tên sản phẩm', 'Slug', 'Danh mục', 'Layout', 'Kết nối', 'Switch', 'Màu sắc', 'Giá thấp nhất', 'Ảnh chính', 'Trạng thái'],
      ...target.map((p) => [
        p.name, p.slug, p.categoryName || '', p.layout || '', p.connection || '', p.switch || '',
        p.colors?.map((c) => c.name).join(' | ') || '',
        p.price,
        p.image || '',
        p.status === 'ACTIVE' ? 'Đang hiển thị' : 'Bản nháp',
      ]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replaceAll('"', '""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob(['\ufeff', csv], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url; a.download = '8threadtech-san-pham.csv'; a.click();
    URL.revokeObjectURL(url);
    setNotice(`Đã xuất ${target.length} sản phẩm.`);
  };

  /* ── Render ── */
  return (
    <div className="pm-dashboard">
      <AdminSidebar />
      <main className="pm-main">
        <header className="pm-topbar">
          <span>8ThreadTech</span>
          <span className="pm-slash">/</span>
          <strong>Sản phẩm</strong>
        </header>

        <div className="pm-content">
          {/* Title row */}
          <div className="pm-title-row">
            <h1>Quản lý sản phẩm</h1>
            <div className="pm-actions">
              <button className="pm-button secondary" onClick={exportCsv}>
                <IconDownload size={16} />Xuất file
              </button>
              <button
                className="pm-button primary"
                onClick={() => { setDialogProduct(null); setDialogOpen(true); }}
              >
                <IconPlus size={17} />Thêm sản phẩm
              </button>
            </div>
          </div>

          {/* Stats */}
          <section className="pm-stats" aria-label="Tổng quan sản phẩm">
            {stats.map(({ label, value, note, Icon, alert }) => (
              <article className="pm-stat" key={label}>
                <div className="pm-stat-label">
                  <span>{label}</span>
                  <Icon size={17} stroke={1.5} />
                </div>
                <strong>{loading ? '—' : value}</strong>
                <small className={alert ? 'alert' : ''}>{note}</small>
              </article>
            ))}
          </section>

          {/* Table panel */}
          <section className="pm-table-panel" aria-label="Danh sách sản phẩm">
            {/* Tabs */}
            <div className="pm-tabs" role="tablist">
              {[
                ['all', 'Tất cả'],
                ['available', 'Còn hàng'],
                ['low', 'Sắp hết'],
                ['out', 'Hết hàng'],
              ].map(([key, label]) => (
                <button
                  key={key} role="tab"
                  aria-selected={tab === key}
                  className={tab === key ? 'selected' : ''}
                  onClick={() => { setTab(key); setPage(1); }}
                >
                  {label}<span>{counts[key]}</span>
                </button>
              ))}
              <span className="pm-column-label"><IconAdjustments size={14} /> Tùy chỉnh cột</span>
            </div>

            {/* Filters */}
            <div className="pm-filters">
              <label className="pm-search">
                <IconSearch size={16} />
                <input
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                  placeholder="Tìm theo tên, slug, mô tả..."
                  aria-label="Tìm sản phẩm"
                />
              </label>
              <label>
                <span className="sr-only">Danh mục</span>
                <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }}>
                  <option value="all">Tất cả danh mục</option>
                  {categories.map((c) => <option key={c.id}>{c.name}</option>)}
                </select>
                <IconChevronDown size={14} />
              </label>
              <label>
                <span className="sr-only">Trạng thái</span>
                <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
                  <option value="all">Tất cả trạng thái</option>
                  <option value="published">Đang hiển thị</option>
                  <option value="draft">Bản nháp</option>
                </select>
                <IconChevronDown size={14} />
              </label>
              <label>
                <span className="sr-only">Sắp xếp</span>
                <select value={sort} onChange={(e) => setSort(e.target.value)}>
                  <option value="newest">Mới nhất</option>
                  <option value="price-asc">Giá: Thấp → Cao</option>
                  <option value="price-desc">Giá: Cao → Thấp</option>
                </select>
                <IconChevronDown size={14} />
              </label>
            </div>

            {/* Table */}
            <div className="pm-table-scroll">
              {loading ? (
                <div className="pm-loading"><IconLoader2 size={28} className="pm-spin" /> Đang tải sản phẩm...</div>
              ) : (
                <table className="pm-table">
                  <thead>
                    <tr>
                      <th className="pm-check-cell">
                        <input
                          type="checkbox"
                          checked={allVisibleSelected}
                          onChange={toggleAllVisible}
                          aria-label="Chọn tất cả"
                        />
                      </th>
                      <th>Sản phẩm</th>
                      <th>Màu / Variants</th>
                      <th>Danh mục</th>
                      <th>Layout</th>
                      <th className="align-right">Giá từ</th>
                      <th>Kết nối</th>
                      <th>Trạng thái</th>
                      <th className="align-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleProducts.map((p) => {
                      const stock = stockState(totalStock(p));
                      const isPublished = p.status === 'ACTIVE';
                      return (
                        <tr key={p.numericId}>
                          <td className="pm-check-cell">
                            <input
                              type="checkbox"
                              checked={selectedIds.includes(p.numericId)}
                              onChange={() => toggleSelect(p.numericId)}
                              aria-label={`Chọn ${p.name}`}
                            />
                          </td>

                          {/* Sản phẩm: ảnh + tên + slug + badge */}
                          <td>
                            <div className="pm-product-cell">
                              <span className="pm-product-image">
                                {(p.image || p.colors?.[0]?.image)
                                  ? <img src={p.image || p.colors[0].image} alt={p.name} />
                                  : <IconPackage size={22} stroke={1.2} />}
                              </span>
                              <span className="pm-product-copy">
                                <strong>{p.name}</strong>
                                <small className="pm-slug">{p.slug}</small>
                                {p.badge && (
                                  <span className="pm-badge-chip">
                                    <IconTag size={9} />{p.badge}
                                  </span>
                                )}
                              </span>
                            </div>
                          </td>

                          {/* Màu / variants */}
                          <td>
                            <div className="pm-variants-cell">
                              <div className="pm-swatch-dots">
                                {(p.colors || []).slice(0, 5).map((c, i) => (
                                  <span
                                    key={i}
                                    className="pm-swatch-dot"
                                    style={{ background: c.color }}
                                    title={c.name}
                                  />
                                ))}
                                {p.colors?.length > 5 && (
                                  <span className="pm-swatch-more">+{p.colors.length - 5}</span>
                                )}
                              </div>
                              <small>{p.colors?.length || 0} phiên bản · {p.images?.length || 0} ảnh hero</small>
                            </div>
                          </td>

                          <td className="pm-muted">{p.categoryName || '—'}</td>
                          <td className="pm-muted">{p.layout || '—'}</td>

                          <td className="align-right pm-price">
                            {formatPrice(p.price)}
                            {p.oldPrice && <small className="pm-old-price">{p.oldPrice}</small>}
                          </td>

                          <td>
                            <span className="pm-connection-chip">{p.connection || '—'}</span>
                          </td>

                          <td>
                            <div className="pm-status-cell">
                              <span className={`pm-published ${isPublished ? '' : 'draft'}`}>
                                <i />{isPublished ? 'Đang hiển thị' : 'Bản nháp'}
                              </span>
                              <span className={`pm-stock-badge ${stock}`}>
                                {stock === 'out' ? 'Hết hàng' : stock === 'low' ? 'Sắp hết' : 'Còn hàng'}
                              </span>
                            </div>
                          </td>

                          <td>
                            <div className="pm-row-actions">
                              <button
                                className="pm-icon-button"
                                title="Chỉnh sửa"
                                onClick={() => { setDialogProduct(p); setDialogOpen(true); }}
                              >
                                <IconPencil size={15} />
                              </button>
                              <button
                                className="pm-icon-button"
                                title={isPublished ? 'Ẩn khỏi cửa hàng' : 'Hiển thị lên cửa hàng'}
                                onClick={() => togglePublish(p)}
                              >
                                {isPublished ? <IconEyeOff size={15} /> : <IconEye size={15} />}
                              </button>
                              <button
                                className="pm-icon-button pm-icon-delete"
                                title="Xóa sản phẩm"
                                onClick={() => deleteProduct(p)}
                              >
                                <IconTrash size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {!visibleProducts.length && (
                      <tr>
                        <td colSpan="9" className="pm-empty">
                          Không tìm thấy sản phẩm phù hợp với bộ lọc.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>

            {/* Pagination */}
            <div className="pm-pagination">
              <span>
                {filteredProducts.length
                  ? `${(currentPage - 1) * pageSize + 1}–${Math.min(currentPage * pageSize, filteredProducts.length)} / ${filteredProducts.length} sản phẩm`
                  : '0 sản phẩm'}
              </span>
              <div>
                <small>{pageSize} / trang</small>
                <button aria-label="Trang trước" disabled={currentPage <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                  <IconChevronLeft size={15} />
                </button>
                <button className="current" aria-current="page">{currentPage}</button>
                <button className="pm-next" disabled={currentPage >= pageCount} onClick={() => setPage((p) => Math.min(pageCount, p + 1))}>
                  Trang sau <IconChevronRight size={14} />
                </button>
              </div>
            </div>
          </section>

          <p className="pm-updated">Dữ liệu trực tiếp từ API · Cập nhật mỗi lần tải trang</p>
        </div>
      </main>

      {dialogOpen && (
        <ProductDialog
          product={dialogProduct}
          categories={categories}
          onClose={() => setDialogOpen(false)}
          onSave={handleSave}
        />
      )}

      {notice && (
        <div className="pm-toast" role="status">
          {notice}
          <button onClick={() => setNotice('')} aria-label="Đóng thông báo">
            <IconX size={15} />
          </button>
        </div>
      )}
    </div>
  );
}
