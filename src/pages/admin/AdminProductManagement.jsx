import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  IconAdjustments, IconChevronDown, IconChevronLeft, IconChevronRight,
  IconDownload, IconEye, IconEyeOff,
  IconPackage, IconPackageOff, IconPackages, IconPencil, IconPlus,
  IconSearch, IconTrash, IconX, IconLoader2,
  IconPhoto, IconUpload,
} from '@tabler/icons-react';
import AdminSidebar from '../../components/admin/AdminSidebar.jsx';
import { adminProductService } from '../../services/adminProductService.js';
import './AdminProductManagement.css';

const formatPrice = (price) => `${Number(price || 0).toLocaleString('vi-VN')} ₫`;

const LAYOUTS = ['60%', '65%', '75%', '80%', '87%', '98%', '100%', 'Full-size', 'TKL'];
const CONNECTIONS = ['3 chế độ kết nối', 'Không dây Bluetooth', 'Có dây USB-C', 'USB-C'];
const SWITCH_TYPES = ['Linear', 'Tactile', 'Magnetic'];

const STOCK_LABEL = {
  IN_STOCK: { cls: 'available', text: 'Còn hàng' },
  LOW_STOCK: { cls: 'low', text: 'Sắp hết' },
  OUT_OF_STOCK: { cls: 'out', text: 'Hết hàng' },
};

function toSlug(str = '') {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function getApiErrorMessage(err) {
  const data = err?.response?.data;
  if (data?.data && typeof data.data === 'object') {
    const details = Object.values(data.data).filter(Boolean);
    if (details.length > 0) return details.join(' · ');
  }
  return data?.message || err?.message || 'Có lỗi xảy ra, vui lòng thử lại.';
}

/* ═══════════════════════════════════════════════
   HELPER: ImageUploadZone
   Quản lý danh sách URL ảnh (và preview kéo thả)
═══════════════════════════════════════════════ */
function ImageUploadZone({ images = [], onChange, maxCount = 6, hint }) {
  const fileRef = useRef(null);
  const [urlInput, setUrlInput] = useState('');
  const [dragging, setDragging] = useState(false);

  const handleFiles = (files) => {
    const list = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (!list.length) return;
    const urls = list.map((f) => URL.createObjectURL(f));
    onChange([...images, ...urls].slice(0, maxCount));
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
        <span className="pm-image-zone-label">
          <IconPhoto size={13} />
          <span style={{ display: 'flex' }}>Ảnh phiên bản</span>
        </span>
        {hint && <small className="pm-image-zone-hint">{hint}</small>}
      </div>

      {images.length > 0 && (
        <div className="pm-image-thumbs">
          {images.map((src, i) => (
            <div key={`${src}-${i}`} className={`pm-thumb ${i === 0 ? 'pm-thumb-primary' : ''}`}>
              <img src={src} alt={`Ảnh ${i + 1}`} />
              {i === 0 && <span className="pm-thumb-primary-badge">Chính</span>}
              <div className="pm-thumb-actions">
                <button type="button" title="Dịch trái" disabled={i === 0} onClick={() => moveLeft(i)}><IconChevronLeft size={11} /></button>
                <button type="button" title="Dịch phải" disabled={i === images.length - 1} onClick={() => moveRight(i)}><IconChevronDown size={11} style={{ transform: 'rotate(-90deg)' }} /></button>
                <button type="button" title="Xóa ảnh" className="pm-thumb-del" onClick={() => removeImage(i)}><IconX size={11} /></button>
              </div>
            </div>
          ))}

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

      {images.length === 0 && (
        <div
          className={`pm-dropzone ${dragging ? 'dragging' : ''}`}
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
        >
          <IconUpload size={22} />
          <span>Kéo thả ảnh hoặc dán URL bên dưới</span>
          <small>Cần URL công khai (https://...) khi gửi lên backend</small>
        </div>
      )}

      <div className="pm-url-row">
        <input
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addUrl())}
          placeholder="Dán URL ảnh (https://...) rồi nhấn Thêm..."
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
function VariantItem({ variant, index, onChange, onRemove, canRemove }) {
  const update = (key) => (e) =>
    onChange(index, { ...variant, [key]: e.target.value });

  const updateImages = (imgs) =>
    onChange(index, { ...variant, images: imgs });

  return (
    <div className="pm-variant-item">
      <div className="pm-variant-row">
        <label>
          <span style={{ display: 'flex' }}>
            SKU <span className="pm-req">*</span>
          </span>
          <input
            value={variant.sku || ''}
            onChange={update('sku')}
            placeholder="VD: THREAD-75-BLACK"
          />
        </label>
        <label>
          Tên phiên bản
          <input
            value={variant.name || ''}
            onChange={update('name')}
            placeholder="VD: Đen / Linear Red"
          />
        </label>
        <label>
          Trạng thái
          <select value={variant.status || 'ACTIVE'} onChange={update('status')}>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
        </label>
      </div>

      <div className="pm-variant-row">
        <label>
          <span style={{ display: 'flex' }}>
            Màu sắc <span className="pm-req">*</span>
          </span>
          <input value={variant.color || ''} onChange={update('color')} placeholder="Vd: Đen" />
        </label>
        <label>
          <span style={{ display: 'flex' }}>
            Mã màu (HEX) <span className="pm-req">*</span>
          </span>
          <div className="pm-color-pick">
            <input type="color" value={variant.colorHex || '#1c1c1c'} onChange={update('colorHex')} />
            <input value={variant.colorHex || '#1c1c1c'} onChange={update('colorHex')} placeholder="#1c1c1c" />
          </div>
        </label>
        <label>
          Chi tiết Switch
          <input value={variant.switchName || ''} onChange={update('switchName')} placeholder="Vd: Linear Red" />
        </label>
      </div>

      <div className="pm-variant-row">
        <label>
          <span style={{ display: 'flex' }}>
            Giá bán (₫) <span className="pm-req">*</span>
          </span>
          <input type="number" min="0" value={variant.price ?? ''} onChange={update('price')} placeholder="175000" />
        </label>
        <label>
          Giá gốc (₫)
          <input type="number" min="0" value={variant.compareAtPrice ?? ''} onChange={update('compareAtPrice')} placeholder="Để trống nếu không có" />
        </label>
        <label>
          <span style={{ display: 'flex' }}>
            Tồn kho <span className="pm-req">*</span>
          </span>
          <input type="number" min="0" value={variant.stockQuantity ?? 0} onChange={update('stockQuantity')} placeholder="0" />
        </label>
      </div>

      <ImageUploadZone
        images={variant.images || []}
        onChange={updateImages}
        maxCount={6}
      />

      {canRemove && (
        <button type="button" className="pm-variant-remove" onClick={() => onRemove(index)} aria-label="Xóa phiên bản">
          <IconX size={13} /> Xóa phiên bản này
        </button>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   DIALOG THÊM / SỬA SẢN PHẨM
═══════════════════════════════════════════════ */
function mapDetailToVariants(detail) {
  const rawVariants = Array.isArray(detail?.variants) ? detail.variants : [];
  const allImages = Array.isArray(detail?.images) ? detail.images : [];

  if (!rawVariants.length) {
    return [{
      id: undefined,
      sku: '',
      name: '',
      color: '',
      colorHex: '#1c1c1c',
      switchName: '',
      price: '',
      compareAtPrice: '',
      stockQuantity: 0,
      status: 'ACTIVE',
      images: allImages.map((img) => img.imageUrl || img.url).filter(Boolean),
    }];
  }

  return rawVariants.map((v, idx) => {
    const attrs = v.attributes || {};
    const vImages = allImages
      .filter((img) => img.variantId === v.id || (idx === 0 && !img.variantId))
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
      .map((img) => img.imageUrl || img.url)
      .filter(Boolean);

    const fallbackVImgs = Array.isArray(v.images) ? v.images : [];

    return {
      id: v.id,
      sku: v.sku || '',
      name: v.name || '',
      color: attrs.color || v.color || '',
      colorHex: attrs.colorHex || v.colorHex || '#1c1c1c',
      switchName: attrs.switch || v.switchName || '',
      price: v.price ?? '',
      compareAtPrice: v.compareAtPrice ?? '',
      stockQuantity: v.stockQuantity ?? v.stock ?? 0,
      status: v.status || 'ACTIVE',
      images: vImages.length ? vImages : fallbackVImgs,
    };
  });
}

function ProductDialog({ product, categories, brands, onClose, onSave }) {
  const isEdit = Boolean(product?.id);
  const specs = product?.specifications || {};

  const [form, setForm] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    categoryId: product?.categoryId ? String(product.categoryId) : '',
    brandId: product?.brandId ? String(product.brandId) : (brands[0]?.id ? String(brands[0].id) : ''),
    layout: specs.layout || product?.layout || '',
    connection: specs.connection || specs.connectionType || product?.connection || '',
    switchType: specs.switchType || product?.switch || '',
    shortDescription: product?.shortDescription || '',
    description: product?.description || '',
    status: product?.status || 'ACTIVE',
  });

  const [variants, setVariants] = useState(() => mapDetailToVariants(product));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const updateForm = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const updateVariant = (index, updated) =>
    setVariants((vs) => vs.map((v, i) => (i === index ? updated : v)));

  const addVariant = () =>
    setVariants((vs) => [
      ...vs,
      {
        id: undefined,
        sku: '',
        name: '',
        color: '',
        colorHex: '#1c1c1c',
        switchName: '',
        price: '',
        compareAtPrice: '',
        stockQuantity: 0,
        status: 'ACTIVE',
        images: [],
      },
    ]);

  const removeVariant = (index) =>
    setVariants((vs) => vs.filter((_, i) => i !== index));

  const handleNameBlur = () => {
    if (!form.slug && form.name) {
      setForm((f) => ({ ...f, slug: toSlug(f.name) }));
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name.trim()) {
      setError('Vui lòng nhập tên sản phẩm.');
      return;
    }
    if (!form.slug.trim()) {
      setError('Vui lòng nhập slug sản phẩm.');
      return;
    }
    if (!form.categoryId) {
      setError('Vui lòng chọn danh mục sản phẩm.');
      return;
    }
    if (variants.length === 0) {
      setError('Cần ít nhất một phiên bản sản phẩm.');
      return;
    }
    if (variants.some((v) => !v.sku.trim() || !v.color.trim() || v.price === '' || Number(v.price) < 0)) {
      setError('Mỗi phiên bản cần có SKU, màu sắc và giá bán hợp lệ.');
      return;
    }

    const skuSet = new Set();
    for (const v of variants) {
      const s = v.sku.trim().toUpperCase();
      if (skuSet.has(s)) {
        setError(`Mã SKU "${v.sku}" bị trùng giữa các phiên bản.`);
        return;
      }
      skuSet.add(s);
    }

    const allUrls = variants.flatMap((v) => v.images || []);
    if (allUrls.some((u) => u.startsWith('blob:'))) {
      setError('Ảnh vừa chọn từ máy tính cần được tải lên dịch vụ lưu trữ và dán URL công khai (https://...) trước khi lưu.');
      return;
    }

    setSaving(true);
    try {
      const builtVariants = variants.map((v) => {
        const displayName =
          v.name?.trim() ||
          [v.color?.trim(), v.switchName?.trim()].filter(Boolean).join(' / ');
        return {
          ...(v.id ? { id: v.id } : {}),
          sku: v.sku.trim(),
          name: displayName,
          attributes: {
            color: v.color.trim(),
            colorHex: v.colorHex || '#1c1c1c',
            ...(v.switchName?.trim() ? { switch: v.switchName.trim() } : {}),
          },
          price: Number(v.price),
          compareAtPrice: v.compareAtPrice !== '' && v.compareAtPrice != null
            ? Number(v.compareAtPrice)
            : null,
          stockQuantity: Number(v.stockQuantity ?? 0),
          status: v.status || 'ACTIVE',
        };
      });

      const builtImages = [];
      let order = 0;
      variants.forEach((v) => {
        (v.images || []).forEach((url) => {
          const cleanUrl = url.trim();
          if (!cleanUrl) return;
          builtImages.push({
            imageUrl: cleanUrl,
            isPrimary: order === 0,
            sortOrder: order,
            ...(v.id ? { variantId: v.id } : { variantSku: v.sku.trim() }),
          });
          order += 1;
        });
      });

      const specifications = {};
      if (form.layout) specifications.layout = form.layout;
      if (form.connection) specifications.connection = form.connection;
      if (form.switchType) specifications.switchType = form.switchType;

      const payload = {
        categoryId: Number(form.categoryId),
        ...(form.brandId ? { brandId: Number(form.brandId) } : {}),
        name: form.name.trim(),
        slug: form.slug.trim(),
        shortDescription: form.shortDescription.trim(),
        description: form.description.trim(),
        specifications,
        status: form.status,
        variants: builtVariants,
        ...(builtImages.length > 0 ? { images: builtImages } : {}),
      };

      if (isEdit) {
        await adminProductService.updateProduct(product.id, payload);
      } else {
        await adminProductService.createProduct(payload);
      }

      onSave(isEdit ? 'Đã cập nhật sản phẩm.' : 'Đã thêm sản phẩm mới.');
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="pm-modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget && !saving) onClose(); }}>
      <form className="pm-dialog pm-dialog-wide" onSubmit={submit} aria-labelledby="pm-dialog-title">
        <div className="pm-dialog-heading">
          <h2 id="pm-dialog-title">{isEdit ? `Chỉnh sửa: ${product.name}` : 'Thêm sản phẩm mới'}</h2>
          <button type="button" className="pm-icon-button" onClick={onClose} disabled={saving} aria-label="Đóng">
            <IconX size={18} />
          </button>
        </div>

        <div className="pm-dialog-body">
          {/* ── Cột trái: thông tin cơ bản ── */}
          <div className="pm-dialog-col">
            <fieldset className="pm-fieldset">
              <legend>Thông tin cơ bản</legend>

              <label>
                <span style={{ display: 'flex' }}>
                  Tên sản phẩm <span className="pm-req">*</span>
                </span>
                <input
                  required
                  autoFocus
                  value={form.name}
                  onChange={updateForm('name')}
                  onBlur={handleNameBlur}
                  placeholder="Ví dụ: THREAD Magnetic Switch"
                />
              </label>

              <label>
                <span style={{ display: 'flex' }}>
                  Đường dẫn (slug) <span className="pm-req">*</span>
                </span>
                <input
                  required
                  value={form.slug}
                  onChange={updateForm('slug')}
                  placeholder="thread-magnetic-switch"
                />
              </label>

              <div className="pm-form-grid">
                <label>
                  Thương hiệu
                  <select value={form.brandId} onChange={updateForm('brandId')}>
                    <option value="">— Chọn thương hiệu —</option>
                    {brands.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </label>
                <label>
                  <span style={{ display: 'flex' }}>
                    Danh mục <span className="pm-req">*</span>
                  </span>
                  <select value={form.categoryId} onChange={updateForm('categoryId')} required>
                    <option value="">— Chọn danh mục —</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="pm-form-grid pm-form-grid-3">
                <label>
                  Layout
                  <select value={form.layout} onChange={updateForm('layout')}>
                    <option value="">— Chọn —</option>
                    {LAYOUTS.map((l) => <option key={l} value={l}>{l}</option>)}
                  </select>
                </label>
                <label>
                  Kết nối
                  <select value={form.connection} onChange={updateForm('connection')}>
                    <option value="">— Chọn —</option>
                    {CONNECTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </label>
                <label>
                  Loại Switch
                  <select value={form.switchType} onChange={updateForm('switchType')}>
                    <option value="">— Chọn —</option>
                    {SWITCH_TYPES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </label>
              </div>

              <div className="pm-form-grid">
                <label>
                  Mô tả ngắn
                  <input
                    value={form.shortDescription}
                    onChange={updateForm('shortDescription')}
                    placeholder="Switch bàn phím magnetic"
                  />
                </label>
                <label>
                  Trạng thái hiển thị
                  <select value={form.status} onChange={updateForm('status')}>
                    <option value="ACTIVE">Đang hiển thị (ACTIVE)</option>
                    <option value="INACTIVE">Ngừng bán (INACTIVE)</option>
                  </select>
                </label>
              </div>

              <label>
                Mô tả chi tiết
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={updateForm('description')}
                  placeholder="Mô tả đầy đủ hiển thị trên trang chi tiết sản phẩm..."
                />
              </label>
            </fieldset>
          </div>

          {/* ── Cột phải: variants ── */}
          <div className="pm-dialog-col">
            <fieldset className="pm-fieldset pm-fieldset-variants">
              <legend>Phiên bản ({variants.length})</legend>

              <div className="pm-variants-list">
                {variants.map((v, i) => (
                  <VariantItem
                    key={v.id || `new-${i}`}
                    variant={v}
                    index={i}
                    onChange={updateVariant}
                    onRemove={removeVariant}
                    canRemove={variants.length > 1}
                  />
                ))}
              </div>

              <button type="button" className="pm-button secondary pm-add-variant" onClick={addVariant}>
                <IconPlus size={12} /> Thêm phiên bản
              </button>
            </fieldset>

            {variants.some((v) => v.colorHex) && (
              <div className="pm-swatch-preview">
                <span className="pm-swatch-preview-label">Xem trước màu sắc:</span>
                <div className="pm-swatch-dots">
                  {variants.map((v, i) => (
                    <span
                      key={i}
                      className="pm-swatch-dot pm-swatch-dot-lg"
                      style={{ background: v.colorHex || '#ccc' }}
                      title={v.color || `Màu ${i + 1}`}
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
  const [summary, setSummary] = useState({
    allProducts: 0,
    activeProducts: 0,
    inactiveProducts: 0,
    inStockProducts: 0,
    lowStockProducts: 0,
    outOfStockProducts: 0,
  });
  const [pageInfo, setPageInfo] = useState({
    pageNumber: 0,
    pageSize: 8,
    totalElements: 0,
    totalPages: 1,
    last: true,
  });

  const [loading, setLoading] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [categoryId, setCategoryId] = useState('all');
  const [status, setStatus] = useState('all');
  const [sort, setSort] = useState('newest');
  const [tab, setTab] = useState('all');
  const [page, setPage] = useState(0);
  const pageSize = 8;

  const [selectedIds, setSelectedIds] = useState([]);
  const [dialogProduct, setDialogProduct] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [notice, setNotice] = useState('');

  // Debounce tìm kiếm 350ms
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedQuery(query.trim());
      setPage(0);
    }, 350);
    return () => clearTimeout(t);
  }, [query]);

  // Nạp options danh mục & thương hiệu
  useEffect(() => {
    adminProductService
      .getOptions()
      .then(({ categories: cats, brands: brs }) => {
        setCategories(cats);
        setBrands(brs);
      })
      .catch((err) => {
        console.warn('Không thể tải tùy chọn danh mục/thương hiệu:', err.message);
      });
  }, []);

  const sortParams = useMemo(() => {
    if (sort === 'oldest') return { sortBy: 'createdAt', sortDirection: 'asc' };
    if (sort === 'name-asc') return { sortBy: 'name', sortDirection: 'asc' };
    if (sort === 'id-desc') return { sortBy: 'id', sortDirection: 'desc' };
    return { sortBy: 'createdAt', sortDirection: 'desc' };
  }, [sort]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminProductService.getProducts({
        page,
        size: pageSize,
        sortBy: sortParams.sortBy,
        sortDirection: sortParams.sortDirection,
        search: debouncedQuery || undefined,
        categoryId: categoryId !== 'all' ? Number(categoryId) : undefined,
        status: status !== 'all' ? status : undefined,
        stockStatus: tab !== 'all' ? tab : undefined,
      });

      setProducts(Array.isArray(res.products?.content) ? res.products.content : []);
      setPageInfo({
        pageNumber: res.products?.pageNumber ?? page,
        pageSize: res.products?.pageSize ?? pageSize,
        totalElements: res.products?.totalElements ?? 0,
        totalPages: Math.max(1, res.products?.totalPages ?? 1),
        last: Boolean(res.products?.last),
      });
      setSummary(res.summary);
    } catch (err) {
      setNotice(`Lỗi tải sản phẩm: ${getApiErrorMessage(err)}`);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, sortParams, debouncedQuery, categoryId, status, tab]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  /* ── Mở modal sửa (lấy chi tiết từ GET /api/admin/products/{id}) ── */
  const openEditModal = async (p) => {
    setLoadingDetail(true);
    try {
      const detail = await adminProductService.getProductDetail(p.id);
      setDialogProduct(detail);
      setDialogOpen(true);
    } catch (err) {
      setNotice(`Không thể tải chi tiết sản phẩm: ${getApiErrorMessage(err)}`);
    } finally {
      setLoadingDetail(false);
    }
  };

  /* ── Checkbox ── */
  const allVisibleSelected =
    products.length > 0 && products.every((p) => selectedIds.includes(p.id));
  const toggleAllVisible = () => {
    setSelectedIds((cur) =>
      allVisibleSelected
        ? cur.filter((id) => !products.some((p) => p.id === id))
        : [...new Set([...cur, ...products.map((p) => p.id)])]
    );
  };
  const toggleSelect = (id) =>
    setSelectedIds((cur) => (cur.includes(id) ? cur.filter((i) => i !== id) : [...cur, id]));

  /* ── Xóa ── */
  const deleteProduct = async (p) => {
    if (!window.confirm(`Bạn có chắc muốn xóa sản phẩm "${p.name}" không?`)) return;
    try {
      await adminProductService.deleteProduct(p.id);
      setSelectedIds((cur) => cur.filter((id) => id !== p.id));
      setNotice(`Đã xóa sản phẩm "${p.name}".`);
      fetchProducts();
    } catch (err) {
      setNotice(`Không thể xóa: ${getApiErrorMessage(err)}`);
    }
  };

  /* ── Toggle ACTIVE / INACTIVE qua PUT /api/admin/products/{id} ── */
  const toggleStatus = async (p) => {
    const newStatus = p.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await adminProductService.updateProduct(p.id, {
        categoryId: p.categoryId,
        ...(p.brandId ? { brandId: p.brandId } : {}),
        name: p.name,
        slug: p.slug,
        status: newStatus,
      });
      setNotice(
        newStatus === 'ACTIVE'
          ? `Đã hiển thị sản phẩm "${p.name}".`
          : `Đã chuyển "${p.name}" sang ngừng bán.`
      );
      fetchProducts();
    } catch (err) {
      setNotice(`Lỗi cập nhật trạng thái: ${getApiErrorMessage(err)}`);
    }
  };

  /* ── Stats từ backend summary ── */
  const stats = [
    { label: 'Tổng sản phẩm', value: summary.allProducts ?? 0, note: 'Tất cả danh mục', Icon: IconPackage },
    { label: 'Đang hiển thị', value: summary.activeProducts ?? 0, note: `${summary.inactiveProducts ?? 0} ngừng bán`, Icon: IconEye },
    { label: 'Sắp hết hàng', value: summary.lowStockProducts ?? 0, note: 'Tồn kho ACTIVE từ 1 đến 5', Icon: IconPackages, alert: true },
    { label: 'Hết hàng', value: summary.outOfStockProducts ?? 0, note: 'Cần bổ sung tồn kho', Icon: IconPackageOff, alert: true },
  ];

  const handleSave = (msg) => {
    setDialogOpen(false);
    setNotice(msg);
    fetchProducts();
  };

  const exportCsv = () => {
    const target = selectedIds.length
      ? products.filter((p) => selectedIds.includes(p.id))
      : products;
    const rows = [
      ['ID', 'Tên sản phẩm', 'Slug', 'Danh mục', 'Thương hiệu', 'Số phiên bản', 'Giá từ', 'Tồn kho', 'Trạng thái', 'Tình trạng kho'],
      ...target.map((p) => [
        p.id,
        p.name,
        p.slug,
        p.categoryName || '',
        p.brandName || '',
        p.variantCount ?? 0,
        p.minPrice ?? 0,
        p.stockQuantity ?? 0,
        p.status,
        p.stockStatus,
      ]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replaceAll('"', '""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob(['\ufeff', csv], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url; a.download = '8threadtech-san-pham.csv'; a.click();
    URL.revokeObjectURL(url);
    setNotice(`Đã xuất ${target.length} sản phẩm.`);
  };

  const startItem = pageInfo.totalElements === 0 ? 0 : pageInfo.pageNumber * pageInfo.pageSize + 1;
  const endItem = Math.min((pageInfo.pageNumber + 1) * pageInfo.pageSize, pageInfo.totalElements);

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

          <section className="pm-stats" aria-label="Tổng quan sản phẩm">
            {stats.map(({ label, value, note, Icon, alert }) => (
              <article className="pm-stat" key={label}>
                <div className="pm-stat-label">
                  <span>{label}</span>
                  <Icon size={17} stroke={1.5} />
                </div>
                <strong>{loading && !summary.allProducts ? '—' : value}</strong>
                <small className={alert ? 'alert' : ''}>{note}</small>
              </article>
            ))}
          </section>

          <section className="pm-table-panel" aria-label="Danh sách sản phẩm">
            <div className="pm-tabs" role="tablist">
              {[
                ['all', 'Tất cả', summary.allProducts ?? 0],
                ['IN_STOCK', 'Còn hàng', summary.inStockProducts ?? 0],
                ['LOW_STOCK', 'Sắp hết', summary.lowStockProducts ?? 0],
                ['OUT_OF_STOCK', 'Hết hàng', summary.outOfStockProducts ?? 0],
              ].map(([key, label, count]) => (
                <button
                  key={key}
                  role="tab"
                  aria-selected={tab === key}
                  className={tab === key ? 'selected' : ''}
                  onClick={() => { setTab(key); setPage(0); }}
                >
                  {label}<span>{count}</span>
                </button>
              ))}
              <span className="pm-column-label"><IconAdjustments size={14} /> Quản trị kho</span>
            </div>

            <div className="pm-filters">
              <label className="pm-search">
                <IconSearch size={16} />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Tìm theo tên sản phẩm..."
                  aria-label="Tìm sản phẩm"
                />
              </label>
              <label>
                <span className="sr-only">Danh mục</span>
                <select value={categoryId} onChange={(e) => { setCategoryId(e.target.value); setPage(0); }}>
                  <option value="all">Tất cả danh mục</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <IconChevronDown size={14} />
              </label>
              <label>
                <span className="sr-only">Trạng thái</span>
                <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(0); }}>
                  <option value="all">Tất cả trạng thái</option>
                  <option value="ACTIVE">Đang hiển thị</option>
                  <option value="INACTIVE">Ngừng bán</option>
                </select>
                <IconChevronDown size={14} />
              </label>
              <label>
                <span className="sr-only">Sắp xếp</span>
                <select value={sort} onChange={(e) => { setSort(e.target.value); setPage(0); }}>
                  <option value="newest">Mới nhất</option>
                  <option value="oldest">Cũ nhất</option>
                  <option value="name-asc">Tên: A → Z</option>
                  <option value="id-desc">ID giảm dần</option>
                </select>
                <IconChevronDown size={14} />
              </label>
            </div>

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
                      <th>Phiên bản &amp; Ảnh</th>
                      <th>Danh mục</th>
                      <th>Thương hiệu</th>
                      <th className="align-right">Giá từ</th>
                      <th className="align-right">Tồn kho</th>
                      <th>Trạng thái</th>
                      <th className="align-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => {
                      const stockInfo = STOCK_LABEL[p.stockStatus] || STOCK_LABEL.IN_STOCK;
                      const isPublished = p.status === 'ACTIVE';
                      return (
                        <tr key={p.id}>
                          <td className="pm-check-cell">
                            <input
                              type="checkbox"
                              checked={selectedIds.includes(p.id)}
                              onChange={() => toggleSelect(p.id)}
                              aria-label={`Chọn ${p.name}`}
                            />
                          </td>

                          <td>
                            <div className="pm-product-cell">
                              <span className="pm-product-image">
                                {p.imageUrl
                                  ? <img src={p.imageUrl} alt={p.name} />
                                  : <IconPackage size={22} stroke={1.2} />}
                              </span>
                              <span className="pm-product-copy">
                                <strong>{p.name}</strong>
                                <small className="pm-slug">{p.slug}</small>
                              </span>
                            </div>
                          </td>

                          <td>
                            <div className="pm-variants-cell">
                              <small>{p.variantCount ?? 0} phiên bản · {p.imageCount ?? 0} ảnh</small>
                            </div>
                          </td>

                          <td className="pm-muted">{p.categoryName || '—'}</td>
                          <td className="pm-muted">{p.brandName || '—'}</td>

                          <td className="align-right pm-price">
                            {formatPrice(p.minPrice)}
                            {p.minCompareAtPrice != null && p.minCompareAtPrice > (p.minPrice || 0) && (
                              <small className="pm-old-price">{formatPrice(p.minCompareAtPrice)}</small>
                            )}
                          </td>

                          <td className="align-right pm-muted">
                            {p.stockQuantity ?? 0}
                          </td>

                          <td>
                            <div className="pm-status-cell">
                              <span className={`pm-published ${isPublished ? '' : 'draft'}`}>
                                <i />{isPublished ? 'Đang hiển thị' : 'Ngừng bán'}
                              </span>
                              <span className={`pm-stock-badge ${stockInfo.cls}`}>
                                {stockInfo.text}
                              </span>
                            </div>
                          </td>

                          <td>
                            <div className="pm-row-actions">
                              <button
                                className="pm-icon-button"
                                title="Chỉnh sửa"
                                disabled={loadingDetail}
                                onClick={() => openEditModal(p)}
                              >
                                <IconPencil size={15} />
                              </button>
                              <button
                                className="pm-icon-button"
                                title={isPublished ? 'Ngừng bán' : 'Hiển thị lên cửa hàng'}
                                onClick={() => toggleStatus(p)}
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
                    {!products.length && (
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

            <div className="pm-pagination">
              <span>
                {pageInfo.totalElements
                  ? `${startItem}–${endItem} / ${pageInfo.totalElements} sản phẩm`
                  : '0 sản phẩm'}
              </span>
              <div>
                <small>{pageInfo.pageSize} / trang</small>
                <button
                  aria-label="Trang trước"
                  disabled={page <= 0}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                >
                  <IconChevronLeft size={15} />
                </button>
                <button className="current" aria-current="page">
                  {pageInfo.pageNumber + 1} / {pageInfo.totalPages}
                </button>
                <button
                  className="pm-next"
                  disabled={pageInfo.last || page + 1 >= pageInfo.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Trang sau <IconChevronRight size={14} />
                </button>
              </div>
            </div>
          </section>

          <p className="pm-updated">Dữ liệu trực tiếp từ /api/admin/products</p>
        </div>
      </main>

      {dialogOpen && (
        <ProductDialog
          product={dialogProduct}
          categories={categories}
          brands={brands}
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
