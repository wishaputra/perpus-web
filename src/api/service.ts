import { apiClient } from './client';
import { 
  mockJenisBuku, mockPenulisBuku, mockPenerbitBuku, 
  mockBuku, mockAnggota, mockPeminjaman, mockDenda 
} from './mockData';
import { 
  JenisBuku, PenulisBuku, PenerbitBuku, Buku, 
  Anggota, Peminjaman, Denda, User, APIResponse 
} from '../types';

// Helper to check if mock mode is active
export const getApiMode = (): 'mock' | 'real' => {
  const mode = localStorage.getItem('epustaka_api_mode');
  return (mode === 'real') ? 'real' : 'mock';
};

export const setApiMode = (mode: 'mock' | 'real') => {
  localStorage.setItem('epustaka_api_mode', mode);
};

// Initialize mock database in sessionStorage to maintain state across pages
const initMockDB = () => {
  if (!sessionStorage.getItem('db_jenis_buku')) {
    sessionStorage.setItem('db_jenis_buku', JSON.stringify(mockJenisBuku));
    sessionStorage.setItem('db_penulis_buku', JSON.stringify(mockPenulisBuku));
    sessionStorage.setItem('db_penerbit_buku', JSON.stringify(mockPenerbitBuku));
    sessionStorage.setItem('db_buku', JSON.stringify(mockBuku));
    sessionStorage.setItem('db_anggota', JSON.stringify(mockAnggota));
    sessionStorage.setItem('db_peminjaman', JSON.stringify(mockPeminjaman));
    sessionStorage.setItem('db_denda', JSON.stringify(mockDenda));
  }
};

initMockDB();

// Mock DB Getters & Setters
const getMockData = <T>(key: string): T[] => {
  initMockDB();
  return JSON.parse(sessionStorage.getItem(key) || '[]');
};

const saveMockData = <T>(key: string, data: T[]) => {
  sessionStorage.setItem(key, JSON.stringify(data));
};

// Helper for generating ULIDs for Mock entities
const generateId = () => Math.random().toString(36).substring(2, 15).toUpperCase();

// Unified API Service
export const apiService = {
  // === AUTHENTICATION ===
  login: async (username: string, password: string): Promise<APIResponse<User>> => {
    if (getApiMode() === 'mock') {
      // Simulate network latency
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if ((username === 'admin' || username === 'afrizal') && password === 'admin') {
        const data = {
          username,
          token: 'mock-jwt-token-xyz-123',
          refresh_token: 'mock-refresh-token-xyz-123'
        };
        return { error: false, msg: 'Login successful', data };
      } else {
        throw new Error('Username atau password salah!');
      }
    } else {
      const response = await apiClient.post('/login', { username, password });
      return response.data;
    }
  },

  // === BUKU (BOOKS) ===
  getAllBuku: async (): Promise<APIResponse<Buku[]>> => {
    if (getApiMode() === 'mock') {
      const books = getMockData<Buku>('db_buku');
      const categories = getMockData<JenisBuku>('db_jenis_buku');
      const authors = getMockData<PenulisBuku>('db_penulis_buku');
      const publishers = getMockData<PenerbitBuku>('db_penerbit_buku');
      
      // Hydrate relationships
      const hydrated = books.map(b => ({
        ...b,
        kategori_buku: categories.find(c => c.id === b.id_kategori_buku),
        penulis_buku: authors.find(a => a.id === b.id_penulis_buku),
        penerbit_buku: publishers.find(p => p.id === b.id_penerbit_buku)
      }));
      
      return { error: false, msg: 'Success get all buku', data: hydrated };
    } else {
      const response = await apiClient.get('/buku');
      return {
        ...response.data,
        data: response.data.data || []
      };
    }
  },

  getBukuByID: async (id: string): Promise<APIResponse<Buku>> => {
    if (getApiMode() === 'mock') {
      const books = getMockData<Buku>('db_buku');
      const book = books.find(b => b.id_buku === id);
      if (!book) throw new Error('Buku tidak ditemukan');
      
      const categories = getMockData<JenisBuku>('db_jenis_buku');
      const authors = getMockData<PenulisBuku>('db_penulis_buku');
      const publishers = getMockData<PenerbitBuku>('db_penerbit_buku');
      
      const hydrated: Buku = {
        ...book,
        kategori_buku: categories.find(c => c.id === book.id_kategori_buku),
        penulis_buku: authors.find(a => a.id === book.id_penulis_buku),
        penerbit_buku: publishers.find(p => p.id === book.id_penerbit_buku)
      };
      
      return { error: false, msg: 'Success get buku by ID', data: hydrated };
    } else {
      const response = await apiClient.get(`/buku/${id}`);
      return response.data;
    }
  },

  // Extension for CRUD books locally in mock database
  createBuku: async (bookData: Omit<Buku, 'id_buku'>): Promise<Buku> => {
    const books = getMockData<Buku>('db_buku');
    const newBook: Buku = {
      ...bookData,
      id_buku: generateId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    books.push(newBook);
    saveMockData('db_buku', books);
    return newBook;
  },

  // === JENIS BUKU (CATEGORIES) ===
  getAllJenisBuku: async (query?: string): Promise<APIResponse<JenisBuku[]>> => {
    if (getApiMode() === 'mock') {
      let data = getMockData<JenisBuku>('db_jenis_buku');
      if (query) {
        data = data.filter(item => 
          item.jenis_buku.toLowerCase().includes(query.toLowerCase()) ||
          item.deskripsi.toLowerCase().includes(query.toLowerCase())
        );
      }
      return { error: false, msg: 'Success get data jenis buku', data };
    } else {
      const url = query ? `/admin/buku/jenbuk?q=${encodeURIComponent(query)}` : '/admin/buku/jenbuk';
      const response = await apiClient.get(url);
      return {
        ...response.data,
        data: response.data.data || []
      };
    }
  },

  createJenisBuku: async (jenis_buku: string, deskripsi: string): Promise<APIResponse<JenisBuku>> => {
    if (getApiMode() === 'mock') {
      const list = getMockData<JenisBuku>('db_jenis_buku');
      const newCat: JenisBuku = {
        id: generateId(),
        jenis_buku,
        deskripsi,
        updated_at: new Date().toISOString()
      };
      list.push(newCat);
      saveMockData('db_jenis_buku', list);
      return { error: false, msg: 'Success added jenis buku', data: newCat };
    } else {
      const response = await apiClient.post('/admin/buku/jenbuk/create', { jenis_buku, deskripsi });
      return response.data;
    }
  },

  updateJenisBuku: async (id: string, jenis_buku: string, deskripsi: string): Promise<APIResponse<JenisBuku>> => {
    if (getApiMode() === 'mock') {
      const list = getMockData<JenisBuku>('db_jenis_buku');
      const index = list.findIndex(item => item.id === id);
      if (index === -1) throw new Error('Kategori tidak ditemukan');
      
      list[index] = { ...list[index], jenis_buku, deskripsi, updated_at: new Date().toISOString() };
      saveMockData('db_jenis_buku', list);
      return { error: false, msg: 'Success update jenis buku', data: list[index] };
    } else {
      const response = await apiClient.put('/admin/buku/jenbuk/update', { id, jenis_buku, deskripsi });
      return response.data;
    }
  },

  deleteJenisBuku: async (id: string): Promise<APIResponse<null>> => {
    if (getApiMode() === 'mock') {
      let list = getMockData<JenisBuku>('db_jenis_buku');
      list = list.filter(item => item.id !== id);
      saveMockData('db_jenis_buku', list);
      return { error: false, msg: 'Success delete jenis buku', data: null };
    } else {
      // Backend parses JSON body containing 'id'
      const response = await apiClient.delete('/admin/buku/jenbuk/delete', { data: { id } });
      return response.data;
    }
  },

  // === PENULIS BUKU (AUTHORS) ===
  getAllPenulisBuku: async (query?: string): Promise<APIResponse<PenulisBuku[]>> => {
    if (getApiMode() === 'mock') {
      let data = getMockData<PenulisBuku>('db_penulis_buku');
      if (query) {
        data = data.filter(item => 
          item.penulis_buku.toLowerCase().includes(query.toLowerCase()) ||
          item.alamat.toLowerCase().includes(query.toLowerCase())
        );
      }
      return { error: false, msg: 'Success get data penulis buku', data };
    } else {
      const url = query ? `/admin/buku/author?q=${encodeURIComponent(query)}` : '/admin/buku/author';
      const response = await apiClient.get(url);
      return {
        ...response.data,
        data: response.data.data || []
      };
    }
  },

  createPenulisBuku: async (penulis_buku: string, alamat: string, email_penulis: string, deskripsi: string): Promise<APIResponse<PenulisBuku>> => {
    if (getApiMode() === 'mock') {
      const list = getMockData<PenulisBuku>('db_penulis_buku');
      const newItem: PenulisBuku = {
        id: generateId(),
        penulis_buku,
        alamat,
        email_penulis,
        deskripsi,
        updated_at: new Date().toISOString()
      };
      list.push(newItem);
      saveMockData('db_penulis_buku', list);
      return { error: false, msg: 'Success added penulis buku', data: newItem };
    } else {
      const response = await apiClient.post('/admin/buku/author/create', { penulis_buku, alamat, email_penulis, deskripsi });
      return response.data;
    }
  },

  updatePenulisBuku: async (id: string, penulis_buku: string, alamat: string, email_penulis: string, deskripsi: string): Promise<APIResponse<PenulisBuku>> => {
    if (getApiMode() === 'mock') {
      const list = getMockData<PenulisBuku>('db_penulis_buku');
      const index = list.findIndex(item => item.id === id);
      if (index === -1) throw new Error('Penulis tidak ditemukan');
      
      list[index] = { ...list[index], penulis_buku, alamat, email_penulis, deskripsi, updated_at: new Date().toISOString() };
      saveMockData('db_penulis_buku', list);
      return { error: false, msg: 'Success update penulis buku', data: list[index] };
    } else {
      const response = await apiClient.put('/admin/buku/author/update', { id, penulis_buku, alamat, email_penulis, deskripsi });
      return response.data;
    }
  },

  deletePenulisBuku: async (id: string): Promise<APIResponse<null>> => {
    if (getApiMode() === 'mock') {
      let list = getMockData<PenulisBuku>('db_penulis_buku');
      list = list.filter(item => item.id !== id);
      saveMockData('db_penulis_buku', list);
      return { error: false, msg: 'Success delete penulis buku', data: null };
    } else {
      const response = await apiClient.delete('/admin/buku/author/delete', { data: { id } });
      return response.data;
    }
  },

  // === PENERBIT BUKU (PUBLISHERS) ===
  getAllPenerbitBuku: async (query?: string): Promise<APIResponse<PenerbitBuku[]>> => {
    if (getApiMode() === 'mock') {
      let data = getMockData<PenerbitBuku>('db_penerbit_buku');
      if (query) {
        data = data.filter(item => 
          item.penerbit_buku.toLowerCase().includes(query.toLowerCase()) ||
          item.alamat_penerbit.toLowerCase().includes(query.toLowerCase())
        );
      }
      return { error: false, msg: 'Success get data penerbit buku', data };
    } else {
      const url = query ? `/admin/buku/penbuk?q=${encodeURIComponent(query)}` : '/admin/buku/penbuk';
      const response = await apiClient.get(url);
      return {
        ...response.data,
        data: response.data.data || []
      };
    }
  },

  createPenerbitBuku: async (penerbit_buku: string, alamat_penerbit: string, telp_penerbit: string, email_penerbit: string, deskripsi_penerbit: string): Promise<APIResponse<PenerbitBuku>> => {
    if (getApiMode() === 'mock') {
      const list = getMockData<PenerbitBuku>('db_penerbit_buku');
      const newItem: PenerbitBuku = {
        id: generateId(),
        penerbit_buku,
        alamat_penerbit,
        telp_penerbit,
        email_penerbit,
        deskripsi_penerbit,
        updated_at: new Date().toISOString()
      };
      list.push(newItem);
      saveMockData('db_penerbit_buku', list);
      return { error: false, msg: 'Success added penerbit buku', data: newItem };
    } else {
      const response = await apiClient.post('/admin/buku/penbuk/create', { penerbit_buku, alamat_penerbit, telp_penerbit, email_penerbit, deskripsi_penerbit });
      return response.data;
    }
  },

  updatePenerbitBuku: async (id: string, penerbit_buku: string, alamat_penerbit: string, telp_penerbit: string, email_penerbit: string, deskripsi_penerbit: string): Promise<APIResponse<PenerbitBuku>> => {
    if (getApiMode() === 'mock') {
      const list = getMockData<PenerbitBuku>('db_penerbit_buku');
      const index = list.findIndex(item => item.id === id);
      if (index === -1) throw new Error('Penerbit tidak ditemukan');
      
      list[index] = { ...list[index], penerbit_buku, alamat_penerbit, telp_penerbit, email_penerbit, deskripsi_penerbit, updated_at: new Date().toISOString() };
      saveMockData('db_penerbit_buku', list);
      return { error: false, msg: 'Success update penerbit buku', data: list[index] };
    } else {
      const response = await apiClient.put('/admin/buku/penbuk/update', { id, penerbit_buku, alamat_penerbit, telp_penerbit, email_penerbit, deskripsi_penerbit });
      return response.data;
    }
  },

  deletePenerbitBuku: async (id: string): Promise<APIResponse<null>> => {
    if (getApiMode() === 'mock') {
      let list = getMockData<PenerbitBuku>('db_penerbit_buku');
      list = list.filter(item => item.id !== id);
      saveMockData('db_penerbit_buku', list);
      return { error: false, msg: 'Success delete penerbit buku', data: null };
    } else {
      const response = await apiClient.delete('/admin/buku/penbuk/delete', { data: { id } });
      return response.data;
    }
  },

  // === ANGGOTA (MEMBERS) ===
  // Since real backend has no public Anggota routes, we read/write them purely in mock mode 
  // or return seeded list in real mode as backup
  getAllAnggota: async (): Promise<APIResponse<Anggota[]>> => {
    const list = getMockData<Anggota>('db_anggota');
    return { error: false, msg: 'Success get all anggota', data: list };
  },

  // === PEMINJAMAN (BORROWINGS) ===
  getAllPeminjaman: async (): Promise<APIResponse<Peminjaman[]>> => {
    if (getApiMode() === 'mock') {
      const pList = getMockData<Peminjaman>('db_peminjaman');
      const aList = getMockData<Anggota>('db_anggota');
      const bList = getMockData<Buku>('db_buku');
      
      // Hydrate relationships
      const hydrated = pList.map(p => {
        const details = p.details?.map(d => ({
          ...d,
          buku: bList.find(b => b.id_buku === d.id_buku)
        })) || [];
        
        return {
          ...p,
          anggota: aList.find(a => a.id_anggota === p.id_anggota),
          details
        };
      });
      
      return { error: false, msg: 'Success get all peminjaman', data: hydrated };
    } else {
      const response = await apiClient.get('/admin/peminjaman');
      const mapped = (response.data.data || []).map((p: any) => ({
        id: p.id,
        id_anggota: p.id_anggota,
        tgl_pinjam: p.tgl_pinjam,
        tgl_kembali: p.tgl_hrs_kembali || p.tgl_kembali,
        jaminan: p.jaminan,
        details: [],
        created_at: p.created_at,
        updated_at: p.updated_at
      }));
      return { ...response.data, data: mapped };
    }
  },

  getDetailPeminjaman: async (id: string): Promise<APIResponse<Peminjaman>> => {
    if (getApiMode() === 'mock') {
      const pList = getMockData<Peminjaman>('db_peminjaman');
      const p = pList.find(item => item.id === id);
      if (!p) throw new Error('Peminjaman tidak ditemukan');
      
      const aList = getMockData<Anggota>('db_anggota');
      const bList = getMockData<Buku>('db_buku');
      
      const details = p.details?.map(d => ({
        ...d,
        buku: bList.find(b => b.id_buku === d.id_buku)
      })) || [];
      
      const hydrated: Peminjaman = {
        ...p,
        anggota: aList.find(a => a.id_anggota === p.id_anggota),
        details
      };
      
      return { error: false, msg: 'Success get detail peminjaman', data: hydrated };
    } else {
      const response = await apiClient.get(`/admin/peminjaman/detail/${id}`);
      const p = response.data.data;
      if (!p) throw new Error('Data detail peminjaman kosong dari server');
      
      const mapped: Peminjaman = {
        id: p.id,
        id_anggota: p.anggota?.id_anggota || p.id_anggota || '',
        anggota: p.anggota ? {
          id_anggota: p.anggota.id_anggota,
          username: '',
          nama: p.anggota.nama,
          jenis_kelamin: '',
          telp: '',
          alamat: '',
          email: '',
          deskripsi: ''
        } : undefined,
        tgl_pinjam: p.tgl_pinjam,
        tgl_kembali: p.tgl_hrs_kembali || p.tgl_kembali,
        jaminan: p.jaminan,
        details: (p.details || []).map((d: any) => ({
          id: d.id_detailpinjam,
          id_buku: d.id_buku,
          id_peminjaman: p.id,
          kondisi_buku: d.kondisi || 'Baik',
          created_at: p.created_at,
          updated_at: p.updated_at
        })),
        created_at: p.created_at,
        updated_at: p.updated_at
      };
      return { ...response.data, data: mapped };
    }
  },

  createPeminjaman: async (id_anggota: string, tgl_pinjam: string, tgl_hrs_kembali: string, jaminan: string, booksSelected: { id_buku: string; kondisi_buku: string }[]): Promise<APIResponse<null>> => {
    if (getApiMode() === 'mock') {
      const list = getMockData<Peminjaman>('db_peminjaman');
      const newId = generateId();
      
      // In Mock Mode, we correctly populate details table relationships!
      const details = booksSelected.map(b => ({
        id: generateId(),
        id_buku: b.id_buku,
        id_peminjaman: newId,
        kondisi_buku: b.kondisi_buku,
        created_at: new Date().toISOString()
      }));

      const newPeminjaman: Peminjaman = {
        id: newId,
        id_anggota,
        tgl_pinjam,
        tgl_kembali: tgl_hrs_kembali, // in payload mapping
        jaminan,
        details,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      list.push(newPeminjaman);
      saveMockData('db_peminjaman', list);
      return { error: false, msg: 'Peminjaman created successfully', data: null };
    } else {
      // Real API payload doesn't accept details list directly (limitation)
      const response = await apiClient.post('/admin/peminjaman/create', { 
        id_anggota, 
        tgl_pinjam: new Date(tgl_pinjam).toISOString(), 
        tgl_hrs_kembali: new Date(tgl_hrs_kembali).toISOString(), 
        jaminan 
      });
      return response.data;
    }
  },

  updatePeminjaman: async (id_peminjaman: string, id_anggota: string, tgl_pinjam: string, tgl_hrs_kembali: string, jaminan: string): Promise<APIResponse<null>> => {
    if (getApiMode() === 'mock') {
      const list = getMockData<Peminjaman>('db_peminjaman');
      const idx = list.findIndex(p => p.id === id_peminjaman);
      if (idx === -1) throw new Error('Transaksi peminjaman tidak ditemukan');
      
      list[idx] = { 
        ...list[idx], 
        id_anggota, 
        tgl_pinjam, 
        tgl_kembali: tgl_hrs_kembali, 
        jaminan, 
        updated_at: new Date().toISOString() 
      };
      saveMockData('db_peminjaman', list);
      return { error: false, msg: 'Peminjaman updated successfully', data: null };
    } else {
      const response = await apiClient.put('/admin/peminjaman/update', { 
        id_peminjaman, 
        id_anggota, 
        tgl_pinjam: new Date(tgl_pinjam).toISOString(), 
        tgl_hrs_kembali: new Date(tgl_hrs_kembali).toISOString(), 
        jaminan 
      });
      return response.data;
    }
  },

  deletePeminjaman: async (id_peminjaman: string): Promise<APIResponse<null>> => {
    if (getApiMode() === 'mock') {
      let list = getMockData<Peminjaman>('db_peminjaman');
      list = list.filter(p => p.id !== id_peminjaman);
      saveMockData('db_peminjaman', list);
      return { error: false, msg: 'Peminjaman deleted successfully', data: null };
    } else {
      const response = await apiClient.delete('/admin/peminjaman/delete', { data: { id_peminjaman } });
      return response.data;
    }
  },

  // === DENDA (FINES) ===
  getAllDenda: async (): Promise<APIResponse<Denda[]>> => {
    if (getApiMode() === 'mock') {
      const dList = getMockData<Denda>('db_denda');
      const aList = getMockData<Anggota>('db_anggota');
      const pList = getMockData<Peminjaman>('db_peminjaman');
      
      const hydrated = dList.map(d => ({
        ...d,
        anggota: aList.find(a => a.id_anggota === d.id_anggota),
        peminjaman: pList.find(p => p.id === d.id_peminjaman)
      }));
      
      return { error: false, msg: 'Success get all denda', data: hydrated };
    } else {
      const response = await apiClient.get('/admin/denda');
      const mapped = (response.data.data || []).map((d: any) => ({
        id: d.id_denda,
        jumlah_denda: d.jumlah_denda,
        tgl_pinjam: d.tgl_pinjam,
        tgl_hrskembali: d.tgl_hrs_kembali || d.tgl_hrskembali,
        tgl_kembali: d.tgl_kembali,
        id_peminjaman: d.id_peminjaman,
        id_anggota: d.id_anggota,
        created_at: d.created_at,
        updated_at: d.updated_at
      }));
      return { ...response.data, data: mapped };
    }
  },

  createDenda: async (jumlah_denda: number, tgl_pinjam: string, tgl_hrs_kembali: string, tgl_kembali: string, id_peminjaman: string, id_anggota: string): Promise<APIResponse<Denda>> => {
    if (getApiMode() === 'mock') {
      const list = getMockData<Denda>('db_denda');
      const newDenda: Denda = {
        id: generateId(),
        jumlah_denda,
        tgl_pinjam,
        tgl_hrskembali: tgl_hrs_kembali,
        tgl_kembali,
        id_peminjaman,
        id_anggota,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      list.push(newDenda);
      saveMockData('db_denda', list);
      return { error: false, msg: 'Denda created successfully', data: newDenda };
    } else {
      const response = await apiClient.post('/admin/denda/create', { 
        jumlah_denda, 
        tgl_pinjam: new Date(tgl_pinjam).toISOString(), 
        tgl_hrs_kembali: new Date(tgl_hrs_kembali).toISOString(), 
        tgl_kembali: new Date(tgl_kembali).toISOString(), 
        id_peminjaman, 
        id_anggota 
      });
      return response.data;
    }
  },

  updateDenda: async (id: string, jumlah_denda: number, tgl_pinjam: string, tgl_hrs_kembali: string, tgl_kembali: string, id_peminjaman: string, id_anggota: string): Promise<APIResponse<Denda>> => {
    if (getApiMode() === 'mock') {
      const list = getMockData<Denda>('db_denda');
      const idx = list.findIndex(d => d.id === id);
      if (idx === -1) throw new Error('Denda tidak ditemukan');
      
      list[idx] = { 
        ...list[idx], 
        jumlah_denda, 
        tgl_pinjam, 
        tgl_hrskembali: tgl_hrs_kembali, 
        tgl_kembali, 
        id_peminjaman, 
        id_anggota, 
        updated_at: new Date().toISOString() 
      };
      saveMockData('db_denda', list);
      return { error: false, msg: 'Denda updated successfully', data: list[idx] };
    } else {
      const response = await apiClient.put('/admin/denda/update', { 
        id, 
        jumlah_denda, 
        tgl_pinjam: new Date(tgl_pinjam).toISOString(), 
        tgl_hrs_kembali: new Date(tgl_hrs_kembali).toISOString(), 
        tgl_kembali: new Date(tgl_kembali).toISOString(), 
        id_peminjaman, 
        id_anggota 
      });
      return response.data;
    }
  },

  deleteDenda: async (id_denda: string): Promise<APIResponse<null>> => {
    if (getApiMode() === 'mock') {
      let list = getMockData<Denda>('db_denda');
      list = list.filter(d => d.id !== id_denda);
      saveMockData('db_denda', list);
      return { error: false, msg: 'Denda deleted successfully', data: null };
    } else {
      const response = await apiClient.delete('/admin/denda/delete', { data: { id_denda } });
      return response.data;
    }
  }
};
