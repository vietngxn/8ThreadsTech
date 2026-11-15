
export const CATEGORY_MAP = {
  "Tất cả bàn phím": null,
  "Bàn phím cơ": 1,
  "Bàn phím gaming": 2,
  "Bàn phím low-profile": 3,
};

export const FILTER_GROUPS = [
  {
    key: "price",
    options: [
      "Dưới 1.500.000 đ",
      "1.500.000 – 2.500.000 đ",
      "Trên 2.500.000 đ",
    ],
  },
  {
    key: "layout",
    options: [
      "60% / 65% — Nhỏ gọn",
      "75% — Cân bằng",
      "80% / TKL — Linh hoạt",
      "98% / 100% — Đầy đủ",
    ],
  },
  {
    key: "connection",
    options: [
      "3 chế độ kết nối",
      "Không dây Bluetooth",
      "Có dây USB-C",
    ],
  },
  {
    key: "switch",
    options: [
      "Linear — Êm & mượt",
      "Tactile — Phản hồi rõ",
      "Magnetic — Từ tính",
    ],
  },
];

export function convertFiltersToParams(filters) {
  const params = {};

  const price = filters.find((f) =>
    FILTER_GROUPS[0].options.includes(f)
  );

  if (price === "Dưới 1.500.000 đ") {
    params.maxPrice = 1500000;
  }

  if (price === "1.500.000 – 2.500.000 đ") {
    params.minPrice = 1500000;
    params.maxPrice = 2500000;
  }

  if (price === "Trên 2.500.000 đ") {
    params.minPrice = 2500000;
  }

  const layout = filters.find((f) =>
    FILTER_GROUPS[1].options.includes(f)
  );

  if (layout?.startsWith("60%")) params.layout = "60%";
  if (layout?.startsWith("75%")) params.layout = "75%";
  if (layout?.startsWith("80%")) params.layout = "80%";
  if (layout?.startsWith("98%")) params.layout = "98%";

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
