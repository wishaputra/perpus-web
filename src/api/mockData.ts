import { JenisBuku, PenulisBuku, PenerbitBuku, Buku, Anggota, Peminjaman, Denda } from '../types';

export const mockJenisBuku: JenisBuku[] = [
  { id: "01H23Y8E2R7W5V1Z2M3K4P5Q6A", jenis_buku: "History", deskripsi: "Ini adalah jenis buku history berisikan sejarah masa lampau", updated_at: "2026-06-03T11:00:00Z" },
  { id: "01H23Y8E2R7W5V1Z2M3K4P5Q6B", jenis_buku: "Cerpen", deskripsi: "Ini adalah jenis buku Cerita Pendek (Cerpen)", updated_at: "2026-06-03T11:00:00Z" },
  { id: "01H23Y8E2R7W5V1Z2M3K4P5Q6C", jenis_buku: "Kepercayaan", deskripsi: "Ini adalah jenis buku filsafat, spiritual, dan Kepercayaan", updated_at: "2026-06-03T11:00:00Z" },
  { id: "01H23Y8E2R7W5V1Z2M3K4P5Q6D", jenis_buku: "Politik", deskripsi: "Ini adalah jenis buku teori, esai, dan sejarah Politik", updated_at: "2026-06-03T11:00:00Z" },
  { id: "01H23Y8E2R7W5V1Z2M3K4P5Q6E", jenis_buku: "Ujian", deskripsi: "Ini adalah jenis buku persiapan Ujian dan soal akademik", updated_at: "2026-06-03T11:00:00Z" }
];

export const mockPenulisBuku: PenulisBuku[] = [
  { id: "01H23Y8E2R7W5V1Z2M3K4P5Q7A", penulis_buku: "Penulis 1", alamat: "Kota Jakarta", email_penulis: "test1@test.com", deskripsi: "Spesialis buku sejarah kuno" },
  { id: "01H23Y8E2R7W5V1Z2M3K4P5Q7B", penulis_buku: "Penulis 2", alamat: "Kota Bandung", email_penulis: "test2@test.com", deskripsi: "Novelis romansa dan cerpen populer" },
  { id: "01H23Y8E2R7W5V1Z2M3K4P5Q7C", penulis_buku: "Penulis 3", alamat: "Kota Surabaya", email_penulis: "test3@test.com", deskripsi: "Filsuf kontemporer dan budayawan" },
  { id: "01H23Y8E2R7W5V1Z2M3K4P5Q7D", penulis_buku: "Penulis 4", alamat: "Kota Yogyakarta", email_penulis: "test4@test.com", deskripsi: "Pengamat politik dan geopolitik global" },
  { id: "01H23Y8E2R7W5V1Z2M3K4P5Q7E", penulis_buku: "Penulis 5", alamat: "Kota Medan", email_penulis: "test5@test.com", deskripsi: "Akademisi senior dan penulis buku ajar" }
];

export const mockPenerbitBuku: PenerbitBuku[] = [
  { id: "01H23Y8E2R7W5V1Z2M3K4P5Q8A", penerbit_buku: "Penerbit 1", alamat_penerbit: "Kota Depok", telp_penerbit: "021-778899", email_penerbit: "publisher1@test.com", deskripsi_penerbit: "Fokus pada penerbitan buku literatur sejarah" },
  { id: "01H23Y8E2R7W5V1Z2M3K4P5Q8B", penerbit_buku: "Penerbit 2", alamat_penerbit: "Kota Tangerang", telp_penerbit: "021-889900", email_penerbit: "publisher2@test.com", deskripsi_penerbit: "Fokus pada penerbitan cerpen dan karya sastra muda" },
  { id: "01H23Y8E2R7W5V1Z2M3K4P5Q8C", penerbit_buku: "Penerbit 3", alamat_penerbit: "Kota Semarang", telp_penerbit: "024-334455", email_penerbit: "publisher3@test.com", deskripsi_penerbit: "Fokus pada penerbitan buku pemikiran dan filsafat" },
  { id: "01H23Y8E2R7W5V1Z2M3K4P5Q8D", penerbit_buku: "Penerbit 4", alamat_penerbit: "Kota Surakarta", telp_penerbit: "0271-556677", email_penerbit: "publisher4@test.com", deskripsi_penerbit: "Fokus pada penerbitan buku kajian politik dan ekonomi" },
  { id: "01H23Y8E2R7W5V1Z2M3K4P5Q8E", penerbit_buku: "Penerbit 5", alamat_penerbit: "Kota Palembang", telp_penerbit: "0711-223344", email_penerbit: "publisher5@test.com", deskripsi_penerbit: "Fokus pada penerbitan modul ujian dan soal pelajaran" }
];

export const mockBuku: Buku[] = [
  {
    id_buku: "01H23Y8E2R7W5V1Z2M3K4P5Q9A",
    isbn: "978-602-03-3160-7",
    id_kategori_buku: mockJenisBuku[0].id,
    kategori_buku: mockJenisBuku[0],
    judul_buku: "Ini buku ke 1: Sejarah Nusantara Tempo Doeloe",
    id_penulis_buku: mockPenulisBuku[0].id,
    penulis_buku: mockPenulisBuku[0],
    id_penerbit_buku: mockPenerbitBuku[0].id,
    penerbit_buku: mockPenerbitBuku[0],
    tahun_terbit: "2020",
    stok_buku: 10,
    rak_buku: "A01",
    deskripsi_buku: "Buku ini membahas secara mendalam sejarah perjalanan kepulauan Indonesia mulai dari kerajaan Hindu-Buddha hingga kemerdekaan.",
    kondisi_buku: "Baik"
  },
  {
    id_buku: "01H23Y8E2R7W5V1Z2M3K4P5Q9B",
    isbn: "978-602-03-3160-8",
    id_kategori_buku: mockJenisBuku[1].id,
    kategori_buku: mockJenisBuku[1],
    judul_buku: "Ini buku ke 2: Senja di Batas Kota",
    id_penulis_buku: mockPenulisBuku[1].id,
    penulis_buku: mockPenulisBuku[1],
    id_penerbit_buku: mockPenerbitBuku[1].id,
    penerbit_buku: mockPenerbitBuku[1],
    tahun_terbit: "2020",
    stok_buku: 7,
    rak_buku: "A02",
    deskripsi_buku: "Kumpulan cerita pendek yang menyajikan romansa sehari-hari di kota urban yang penuh lika-liku.",
    kondisi_buku: "Baik"
  },
  {
    id_buku: "01H23Y8E2R7W5V1Z2M3K4P5Q9C",
    isbn: "978-602-03-3160-9",
    id_kategori_buku: mockJenisBuku[2].id,
    kategori_buku: mockJenisBuku[2],
    judul_buku: "Ini buku ke 3: Kebijaksanaan Timur dan Barat",
    id_penulis_buku: mockPenulisBuku[2].id,
    penulis_buku: mockPenulisBuku[2],
    id_penerbit_buku: mockPenerbitBuku[2].id,
    penerbit_buku: mockPenerbitBuku[2],
    tahun_terbit: "2020",
    stok_buku: 12,
    rak_buku: "A03",
    deskripsi_buku: "Sebuah telaah filosofis perbandingan antara pemikiran spiritual Timur dengan filsafat rasionalitas Barat.",
    kondisi_buku: "Baik"
  },
  {
    id_buku: "01H23Y8E2R7W5V1Z2M3K4P5Q9D",
    isbn: "978-602-03-3161-0",
    id_kategori_buku: mockJenisBuku[3].id,
    kategori_buku: mockJenisBuku[3],
    judul_buku: "Ini buku ke 4: Teori Kekuasaan Modern",
    id_penulis_buku: mockPenulisBuku[3].id,
    penulis_buku: mockPenulisBuku[3],
    id_penerbit_buku: mockPenerbitBuku[3].id,
    penerbit_buku: mockPenerbitBuku[3],
    tahun_terbit: "2020",
    stok_buku: 5,
    rak_buku: "A04",
    deskripsi_buku: "Membahas dinamika politik internasional, pergeseran kutub kekuasaan, dan model tata kelola negara modern.",
    kondisi_buku: "Rusak Ringan"
  },
  {
    id_buku: "01H23Y8E2R7W5V1Z2M3K4P5Q9E",
    isbn: "978-602-03-3161-1",
    id_kategori_buku: mockJenisBuku[4].id,
    kategori_buku: mockJenisBuku[4],
    judul_buku: "Ini buku ke 5: Kupas Tuntas UTBK Mandiri",
    id_penulis_buku: mockPenulisBuku[4].id,
    penulis_buku: mockPenulisBuku[4],
    id_penerbit_buku: mockPenerbitBuku[4].id,
    penerbit_buku: mockPenerbitBuku[4],
    tahun_terbit: "2020",
    stok_buku: 15,
    rak_buku: "A05",
    deskripsi_buku: "Kumpulan soal latihan terlengkap beserta kunci pembahasan untuk melatih kesiapan ujian masuk perguruan tinggi.",
    kondisi_buku: "Baik"
  }
];

export const mockAnggota: Anggota[] = [
  {
    id_anggota: "01H23Y8E2R7W5V1Z2M3K4P6A1B",
    username: "budi.santoso",
    nama: "Budi Santoso",
    jenis_kelamin: "Laki-laki",
    telp: "081234567890",
    alamat: "Jl. Merdeka No. 10, Jakarta Pusat",
    email: "budi.santoso@email.com",
    deskripsi: "Anggota perpustakaan aktif sejak 2024"
  },
  {
    id_anggota: "01H23Y8E2R7W5V1Z2M3K4P6A2B",
    username: "siti.rahayu",
    nama: "Siti Rahayu",
    jenis_kelamin: "Perempuan",
    telp: "082345678901",
    alamat: "Jl. Sudirman No. 25, Bandung",
    email: "siti.rahayu@email.com",
    deskripsi: "Mahasiswi aktif pengguna koleksi novel"
  },
  {
    id_anggota: "01H23Y8E2R7W5V1Z2M3K4P6A3B",
    username: "andi.wijaya",
    nama: "Andi Wijaya",
    jenis_kelamin: "Laki-laki",
    telp: "083456789012",
    alamat: "Jl. Diponegoro No. 5, Surabaya",
    email: "andi.wijaya@email.com",
    deskripsi: "Anggota antusias sejarah dan filsafat"
  },
  {
    id_anggota: "01H23Y8E2R7W5V1Z2M3K4P6A4B",
    username: "dewi.kartika",
    nama: "Dewi Kartika",
    jenis_kelamin: "Perempuan",
    telp: "084567890123",
    alamat: "Jl. Gajah Mada No. 8, Yogyakarta",
    email: "dewi.kartika@email.com",
    deskripsi: "Pendidik sekolah menengah"
  },
  {
    id_anggota: "01H23Y8E2R7W5V1Z2M3K4P6A5B",
    username: "reza.pratama",
    nama: "Reza Pratama",
    jenis_kelamin: "Laki-laki",
    telp: "085678901234",
    alamat: "Jl. Ahmad Yani No. 3, Medan",
    email: "reza.pratama@email.com",
    deskripsi: "Pecinta buku politik dan sosial"
  }
];

export const mockPeminjaman: Peminjaman[] = [
  {
    id: "01H23Y8E2R7W5V1Z2M3K4P7A1X",
    id_anggota: mockAnggota[0].id_anggota,
    anggota: mockAnggota[0],
    tgl_pinjam: "2026-05-20T09:00:00Z",
    tgl_kembali: "2026-05-27T17:00:00Z",
    jaminan: "KTP Asli Budi Santoso",
    details: [
      {
        id: "01H23Y8E2R7W5V1Z2M3K4P7D1D",
        id_buku: mockBuku[0].id_buku,
        buku: mockBuku[0],
        id_peminjaman: "01H23Y8E2R7W5V1Z2M3K4P7A1X",
        kondisi_buku: "Baik"
      }
    ]
  },
  {
    id: "01H23Y8E2R7W5V1Z2M3K4P7A2Y",
    id_anggota: mockAnggota[1].id_anggota,
    anggota: mockAnggota[1],
    tgl_pinjam: "2026-05-25T10:30:00Z",
    tgl_kembali: "2026-06-01T17:00:00Z",
    jaminan: "Kartu Mahasiswa Siti",
    details: [
      {
        id: "01H23Y8E2R7W5V1Z2M3K4P7D2D",
        id_buku: mockBuku[1].id_buku,
        buku: mockBuku[1],
        id_peminjaman: "01H23Y8E2R7W5V1Z2M3K4P7A2Y",
        kondisi_buku: "Baik"
      }
    ]
  }
];

export const mockDenda: Denda[] = [
  {
    id: "01H23Y8E2R7W5V1Z2M3K4P8A1F",
    jumlah_denda: 10000,
    tgl_pinjam: "2026-05-10T08:00:00Z",
    tgl_hrskembali: "2026-05-17T17:00:00Z",
    tgl_kembali: "2026-05-19T10:00:00Z", // Late by 2 days, e.g. Rp 5.000 / day
    id_peminjaman: mockPeminjaman[0].id,
    peminjaman: mockPeminjaman[0],
    id_anggota: mockAnggota[0].id_anggota,
    anggota: mockAnggota[0]
  }
];
