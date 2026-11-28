/**
 * Kiểm tra URL ảnh HTTP/HTTPS hợp lệ (loại bỏ đường dẫn tương đối cũ và placeholder REPLACE_ME).
 */
export function isValidHttpImage(url) {
  return (
    typeof url === "string" &&
    /^https?:\/\//i.test(url) &&
    !url.includes("REPLACE_ME")
  );
}

/**
 * Chọn URL ảnh tốt nhất từ mảng images của API chi tiết.
 */
export function pickBestImageUrl(images) {
  if (!Array.isArray(images) || images.length === 0) return "";
  return (
    images.find((img) => img.isPrimary && isValidHttpImage(img.imageUrl))
      ?.imageUrl ||
    images.find((img) => isValidHttpImage(img.imageUrl))?.imageUrl ||
    images.find((img) => img.isPrimary)?.imageUrl ||
    images[0]?.imageUrl ||
    ""
  );
}

/**
 * Bổ sung ảnh hợp lệ từ API chi tiết cho các item bị thiếu hoặc đang dùng ảnh cũ/không hợp lệ.
 */
export async function hydrateMissingProductImages(
  items,
  { imageField = "primaryImageUrl", fetchDetail }
) {
  if (!Array.isArray(items) || items.length === 0) return items;

  const missingItems = items.filter(
    (item) => item?.id != null && !isValidHttpImage(item[imageField])
  );
  if (missingItems.length === 0) return items;

  const detailResults = await Promise.allSettled(
    missingItems.map((item) => fetchDetail(item.id))
  );

  const imageById = new Map();
  detailResults.forEach((res, idx) => {
    if (res.status !== "fulfilled") return;
    const images = res.value?.data?.data?.images;
    const best = pickBestImageUrl(images);
    if (best) {
      imageById.set(missingItems[idx].id, best);
    }
  });

  if (imageById.size === 0) return items;

  return items.map((item) =>
    !isValidHttpImage(item[imageField]) && imageById.has(item.id)
      ? { ...item, [imageField]: imageById.get(item.id) }
      : item
  );
}
