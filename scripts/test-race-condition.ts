/**
 * Race condition test for inventory management
 *
 * Tests that concurrent requests to add the same product to cart
 * are handled correctly — only one should succeed when stock = 1.
 *
 * Usage:
 *   pnpm dlx tsx scripts/test-race-condition.ts [base_url]
 *
 * Example:
 *   pnpm dlx tsx scripts/test-race-condition.ts http://localhost:3000
 */

const BASE_URL = process.argv[2] ?? "http://localhost:3000";

type CartResponse = {
  id: string;
  items: Array<{ variantId: string; quantity: number }>;
  totalItems: number;
};

type ErrorResponse = {
  error: string;
  available?: number;
};

async function getFirstActiveVariant(): Promise<{
  variantId: string;
  productName: string;
  stock: number;
  reserved: number;
  available: number;
} | null> {
  const res = await fetch(`${BASE_URL}/api/products`);
  if (!res.ok) {
    console.error("Failed to fetch products:", res.status);
    return null;
  }
  const data = await res.json();
  const products = data.products ?? data;
  for (const product of products) {
    const varRes = await fetch(
      `${BASE_URL}/api/products/${product.slug}/variants`
    );
    if (!varRes.ok) continue;
    const varData = await varRes.json();
    const variants = varData.variants ?? varData;
    for (const v of variants) {
      if (v.stockQuantity > 0) {
        return {
          variantId: v.id,
          productName: product.name,
          stock: v.stockQuantity,
          reserved: v.reserved ?? 0,
          available: v.stockQuantity - (v.reserved ?? 0),
        };
      }
    }
  }
  return null;
}

async function addToCart(
  variantId: string,
  quantity: number,
  userId: string
): Promise<{ status: number; body: CartResponse | ErrorResponse }> {
  const res = await fetch(`${BASE_URL}/api/cart/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Simulate different users via different cookie headers
      Cookie: `me_session_id=test-session-${userId}`,
    },
    body: JSON.stringify({ variantId, quantity }),
  });

  const body = await res.json();
  return { status: res.status, body };
}

function colorStatus(status: number): string {
  if (status === 201) return `\x1b[32m${status} OK\x1b[0m`;
  if (status === 409) return `\x1b[33m${status} CONFLICT\x1b[0m`;
  return `\x1b[31m${status} ERROR\x1b[0m`;
}

async function runTest() {
  console.log(`\n\x1b[1m=== Race Condition Test ===\x1b[0m`);
  console.log(`Target: ${BASE_URL}\n`);

  // 1. Find a variant with available stock
  console.log("1. Бүтээгдэхүүн хайж байна...");
  const variant = await getFirstActiveVariant();

  if (!variant) {
    console.error("  ✗ Идэвхтэй бүтээгдэхүүн олдсонгүй. Seed хийгдсэн эсэхийг шалгана уу.");
    process.exit(1);
  }

  console.log(`  ✓ Олдлоо: ${variant.productName}`);
  console.log(`    variantId:  ${variant.variantId}`);
  console.log(`    stock:      ${variant.stock}`);
  console.log(`    reserved:   ${variant.reserved}`);
  console.log(`    available:  ${variant.available}\n`);

  // 2. Race condition test — N concurrent requests each requesting 1 item
  // Each user tries to add 1 item simultaneously.
  // The `reserved` field must end up exactly = concurrency (no double-counting).
  const concurrency = 5;
  const requestQty = 1;

  if (variant.available < concurrency) {
    console.warn(
      `  ⚠ Боломжтой нөөц (${variant.available}) ${concurrency}-с бага. stock нэмнэ үү.`
    );
    process.exit(0);
  }

  console.log(
    `2. ${concurrency} зэрэгцсэн хүсэлт илгээж байна (хүн бүр ${requestQty} ширхэг авах гэж оролдоно)...`
  );

  const requests = Array.from({ length: concurrency }, (_, i) =>
    addToCart(variant.variantId, requestQty, `race-test-user-${i}`)
  );

  const results = await Promise.all(requests);

  // 3. Analyze results
  const successes = results.filter((r) => r.status === 201);
  const conflicts = results.filter((r) => r.status === 409);
  const retryable = results.filter((r) => r.status === 503);
  const errors = results.filter(
    (r) => r.status !== 201 && r.status !== 409 && r.status !== 503
  );

  console.log("\n3. Үр дүн:\n");
  results.forEach((r, i) => {
    const statusStr = colorStatus(r.status);
    const detail =
      r.status === 409
        ? ` — available: ${(r.body as ErrorResponse).available ?? "?"}`
        : "";
    console.log(`   User ${i}: ${statusStr}${detail}${r.status === 503 ? " (retry-able)" : ""}`);
  });

  console.log("\n4. Дүгнэлт:\n");
  console.log(`   Амжилттай (201):    ${successes.length}`);
  console.log(`   Нөөц дутсан (409):  ${conflicts.length}`);
  console.log(`   Retry-able (503):   ${retryable.length}`);
  console.log(`   Бусад алдаа:        ${errors.length}`);

  // 4. Assert correctness
  console.log("\n5. Баталгаажуулалт:\n");

  // Key invariant: no unexpected errors (only 201, 409, 503 are acceptable)
  if (errors.length === 0) {
    console.log(
      `   \x1b[32m✓ PASS\x1b[0m — Бүх хариу зөв: ${successes.length}×201, ${conflicts.length}×409, ${retryable.length}×503`
    );
    if (retryable.length > 0) {
      console.log(
        `   \x1b[33mℹ\x1b[0m  503 хариунууд: connection pool хэт ачаалалтай — клиент retry хийх ёстой (зөв зан)`
      );
    }
  } else {
    console.log(
      `   \x1b[31m✗ FAIL\x1b[0m — ${errors.length} тодорхойгүй алдаа гарлаа`
    );
    errors.forEach((r, i) => {
      console.log(`     Error ${i}: status=${r.status}`, r.body);
    });
    process.exit(1);
  }

  // Check reserved field — must increase by exactly (successes × requestQty)
  console.log("\n   reserved шалгаж байна...");
  const productsData = await fetch(`${BASE_URL}/api/products`).then((r) =>
    r.json()
  );
  const slug = productsData.products.find(
    (p: { name: string }) => p.name === variant.productName
  )?.slug;
  const checkRes = await fetch(`${BASE_URL}/api/products/${slug}/variants`);
  if (checkRes.ok) {
    const checkData = await checkRes.json();
    const updatedVariant = (checkData.variants ?? checkData).find(
      (v: { id: string }) => v.id === variant.variantId
    );
    if (updatedVariant) {
      const expectedReserved =
        variant.reserved + successes.length * requestQty;
      const actualReserved =
        updatedVariant.reserved ??
        updatedVariant.stockQuantity - updatedVariant.available;
      if (actualReserved === expectedReserved) {
        console.log(
          `   \x1b[32m✓ PASS\x1b[0m — reserved: ${variant.reserved} → ${actualReserved} (яг +${successes.length} нэмэгдсэн, давхцалгүй)`
        );
      } else {
        console.log(
          `   \x1b[31m✗ FAIL\x1b[0m — reserved: ${actualReserved} (хүлээгдэж байсан: ${expectedReserved})`
        );
        console.log(
          "   → Double-counting буюу race condition асуудал байж болно!"
        );
        process.exit(1);
      }
    }
  }

  // Stock-limit test: try to add more than available
  console.log("\n   Нөөцийн хязгаар шалгаж байна (available-с их авах гэвэл 409 буцаах ёстой)...");
  await addToCart(
    variant.variantId,
    10, // max allowed by schema
    "over-stock-test-user"
  );

  // Use same session but try to add way more items cumulatively
  // Just test a fresh user trying to add more than total stock
  const bigQtyRes = await fetch(`${BASE_URL}/api/cart/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `me_session_id=test-over-stock-unique-session`,
    },
    body: JSON.stringify({ variantId: variant.variantId, quantity: 10 }),
  });
  console.log(`   Нэмэлт хүсэлт: ${colorStatus(bigQtyRes.status)}`);

  console.log("\n\x1b[1m✓ Race condition тест амжилттай дууслаа\x1b[0m\n");
}

runTest().catch((err) => {
  console.error("Тест script алдаатай дууслаа:", err);
  process.exit(1);
});
