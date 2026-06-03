export interface JenisBuku {
  id: string;
  jenis_buku: string;
  deskripsi: string;
  updated_at?: string;
}

export interface PenulisBuku {
  id: string;
  penulis_buku: string;
  alamat: string;
  email_penulis: string;
  deskripsi: string;
  updated_at?: string;
}

export interface PenerbitBuku {
  id: string;
  penerbit_buku: string;
  alamat_penerbit: string;
  telp_penerbit: string;
  email_penerbit: string;
  deskripsi_penerbit: string;
  updated_at?: string;
}

export interface Buku {
  id_buku: string;
  isbn: string;
  id_kategori_buku: string;
  kategori_buku?: JenisBuku;
  judul_buku: string;
  id_penulis_buku: string;
  penulis_buku?: PenulisBuku;
  id_penerbit_buku: string;
  penerbit_buku?: PenerbitBuku;
  tahun_terbit: string;
  stok_buku: number;
  rak_buku: string;
  deskripsi_buku: string;
  gambar_buku?: string;
  kondisi_buku?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Anggota {
  id_anggota: string;
  username: string;
  nama: string;
  jenis_kelamin: string;
  telp: string;
  alamat: string;
  email: string;
  deskripsi: string;
  created_at?: string;
  updated_at?: string;
}

export interface DetailPinjam {
  id: string;
  id_buku: string;
  buku?: Buku;
  id_peminjaman: string;
  kondisi_buku: string;
  created_at?: string;
  updated_at?: string;
}

export interface Peminjaman {
  id: string;
  id_anggota: string;
  anggota?: Anggota;
  tgl_pinjam: string;
  tgl_kembali: string; // TglHrsKembali
  jaminan: string;
  details?: DetailPinjam[];
  created_at?: string;
  updated_at?: string;
}

export interface Denda {
  id: string;
  jumlah_denda: number;
  tgl_pinjam: string;
  tgl_hrskembali: string;
  tgl_kembali: string; // actual return date
  id_peminjaman: string;
  peminjaman?: Peminjaman;
  id_anggota: string;
  anggota?: Anggota;
  created_at?: string;
  updated_at?: string;
}

export interface User {
  username: string;
  token: string;
  refresh_token?: string;
}

export interface APIResponse<T> {
  error: boolean;
  msg: string;
  data: T;
}
