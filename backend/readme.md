# Simple Online Shop Backend API

## Daftar Endpoint

### User
| Method | Path           | Keterangan |
|--------|----------------|------------|
| POST   | /api/register  | Registrasi user baru |
| POST   | /api/login     | Login user, mendapatkan JWT token |
| GET    | /api/users     | Ambil semua user (hanya admin/merchant, butuh JWT) |

### Produk
| Method | Path                   | Keterangan |
|--------|------------------------|------------|
| GET    | /api/products          | Ambil semua produk (public) |
| GET    | /api/products/:id      | Ambil detail produk by id (public) |
| POST   | /api/products          | Tambah produk (merchant only, butuh JWT, upload gambar) |
| PUT    | /api/products/:id      | Update produk (merchant only, butuh JWT) |
| DELETE | /api/products/:id      | Hapus produk (merchant only, butuh JWT) |

### Cart (Keranjang)
| Method | Path                   | Keterangan |
|--------|------------------------|------------|
| GET    | /api/cart              | Lihat isi keranjang user (butuh JWT role user) |
| POST   | /api/cart              | Tambah produk ke keranjang (butuh JWT role user) |
| PUT    | /api/cart/:id          | Update jumlah item di keranjang (butuh JWT role user) |
| DELETE | /api/cart/:id          | Hapus item dari keranjang (butuh JWT role user) |
| POST   | /api/cart/checkout     | Checkout keranjang (butuh JWT role user) |

## Autentikasi & Proteksi Route
- Gunakan JWT token pada header `Authorization: Bearer <token>` untuk akses endpoint yang diproteksi.
- Role user: `user`, `merchant`, `admin`.
- Contoh penggunaan middleware proteksi: endpoint `/api/users` hanya bisa diakses admin/merchant, endpoint `/api/cart` hanya untuk user login.

## Upload Gambar Produk
- Endpoint POST `/api/products` mendukung upload gambar (max 5 file, field: `images`).
- File akan disimpan di folder `/uploads`.

## Error Handling
- Semua error akan mengembalikan response JSON dengan field `message` dan `error` jika ada.

## Menjalankan Server
1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy file `.env.example` ke `.env` dan isi konfigurasi database serta secret JWT.
3. Jalankan migrasi dan seeder jika perlu:
   ```bash
   npx sequelize-cli db:migrate
   npx sequelize-cli db:seed:all
   ```
4. Start server:
   ```bash
   npm run dev
   ```

Server akan berjalan di http://localhost:3000 (atau port sesuai `.env`).

---

Untuk detail struktur folder, validasi model, dan contoh request, silakan cek dokumentasi di masing-masing file controller/model.