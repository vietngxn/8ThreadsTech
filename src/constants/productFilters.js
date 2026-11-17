
export const CATEGORY_MAP = {
  "Tất cả bàn phím": null,
  "Bàn phím cơ": 1,
  "Bàn phím gaming": 2,
  "Bàn phím low-profile": 3,
};

export const FILTER_GROUPS = [
  {
    key: "price",
    param: "gia",
    title: "KHOẢNG GIÁ",
    options: [
      "Dưới 1.500.000 đ",
      "1.500.000 – 2.500.000 đ",
      "Trên 2.500.000 đ",
    ],
    codes: ["duoi-1500000", "1500000-2500000", "tren-2500000"],
  },
  {
    key: "layout",
    param: "layout",
    title: "LAYOUT",
    options: [
      "60% / 65% — Nhỏ gọn",
      "75% — Cân bằng",
      "80% / TKL — Linh hoạt",
      "98% / 100% — Đầy đủ",
    ],
    codes: ["60-65", "75", "80-tkl", "98-100"],
  },
  {
    key: "connection",
    param: "ket-noi",
    title: "KẾT NỐI",
    options: [
      "3 chế độ kết nối",
      "Không dây Bluetooth",
      "Có dây USB-C",
    ],
    codes: ["3-che-do", "bluetooth", "co-day"],
  },
  {
    key: "switch",
    param: "switch",
    title: "LOẠI SWITCH",
    options: [
      "Linear — Êm & mượt",
      "Tactile — Phản hồi rõ",
      "Magnetic — Từ tính",
    ],
    codes: ["linear", "tactile", "magnetic"], 
  },
];

export function convertFiltersToParams(filters) {
  const params = {};

  const price = filters.find((f) =>
    FILTER_GROUPS[0].options.includes(f)
  );

  if (price === "Dưới 1.500.000 đ") {
    params.maxPrice = 1499999;
  }

  if (price === "1.500.000 – 2.500.000 đ") {
    params.minPrice = 1500000;
    params.maxPrice = 2500000;
  }

  if (price === "Trên 2.500.000 đ") {
    params.minPrice = 2500001;
  }

  const layout = filters.find((f) =>
    FILTER_GROUPS[1].options.includes(f)
  );

  if (layout?.startsWith("60%")) params.layout = "60%,65%";
  if (layout?.startsWith("75%")) params.layout = "75%";
  if (layout?.startsWith("80%")) params.layout = "80%,TKL";
  if (layout?.startsWith("98%")) params.layout = "98%,100%";

  const connection = filters.find((f) =>
    FILTER_GROUPS[2].options.includes(f)
  );

  if (connection) {
    params.connectionType = connection;
  }

  const switchFilter = filters.find((f) =>
    FILTER_GROUPS[3].options.includes(f)
  );

  if (switchFilter) {
    params.switchType = switchFilter.split(" — ")[0];
  }

  return params;
}

// Sắp xếp "featured" là mặc định nên không xuất hiện trên URL
export const SORT_CODES = {
  "price-asc": "gia-tang",
  "price-desc": "gia-giam",
};

/** URL -> danh sách nhãn bộ lọc đang chọn (mã lạ trên URL bị bỏ qua) */
export function filtersFromSearchParams(searchParams) {
  return FILTER_GROUPS.flatMap((group) => {
    const index = group.codes.indexOf(searchParams.get(group.param));
    return index >= 0 ? [group.options[index]] : [];
  });
}

/** Nhãn bộ lọc -> { param, code } để ghi lên URL */
export function filterToSearchParam(label) {
  for (const group of FILTER_GROUPS) {
    const index = group.options.indexOf(label);
    if (index >= 0) return { param: group.param, code: group.codes[index] };
  }
  return null;
}

/** URL -> giá trị sắp xếp của giao diện */
export function sortFromSearchParams(searchParams) {
  const code = searchParams.get("sap-xep");
  return Object.keys(SORT_CODES).find((key) => SORT_CODES[key] === code) || "featured";
}
