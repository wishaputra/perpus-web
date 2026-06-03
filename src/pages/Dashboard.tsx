import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, BookMarked, Tags, Users, Landmark, 
  HandHelping, LandmarkIcon, LogOut, Plus, Edit2, Trash2, 
  Layers, HelpCircle, Sun, Moon
} from 'lucide-react';
import { apiService, getApiMode } from '../api/service';
import { 
  Buku, JenisBuku, PenulisBuku, PenerbitBuku, 
  Anggota, Peminjaman, Denda 
} from '../types';
import { Card } from '../components/Card';
import { Modal } from '../components/Modal';
import { Table } from '../components/Table';
import { Input, Select, Textarea } from '../components/FormFields';

const formatDate = (dateStr?: string) => {
  if (!dateStr) return '-';
  try {
    if (dateStr.includes('T')) {
      return dateStr.split('T')[0];
    }
    return dateStr;
  } catch {
    return '-';
  }
};

const formatLocalDate = (dateStr?: string) => {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '-';
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
};

interface DashboardProps {
  username: string;
  onLogout: () => void;
  isLightTheme: boolean;
  onToggleTheme: () => void;
  // Trigger system notification
  showNotification: (type: 'success' | 'error' | 'info', message: string) => void;
}

type TabType = 'overview' | 'kategori' | 'penulis' | 'penerbit' | 'buku' | 'peminjaman' | 'denda';

export const Dashboard: React.FC<DashboardProps> = ({
  username,
  onLogout,
  isLightTheme,
  onToggleTheme,
  showNotification
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [apiMode, setApiMode] = useState<'mock' | 'real'>(getApiMode());

  // Database lists
  const [books, setBooks] = useState<Buku[]>([]);
  const [categories, setCategories] = useState<JenisBuku[]>([]);
  const [authors, setAuthors] = useState<PenulisBuku[]>([]);
  const [publishers, setPublishers] = useState<PenerbitBuku[]>([]);
  const [members, setMembers] = useState<Anggota[]>([]);
  const [borrowings, setBorrowings] = useState<Peminjaman[]>([]);
  const [fines, setFines] = useState<Denda[]>([]);
  
  const [loading, setLoading] = useState(true);

  // Form State / Modals
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit' | 'delete'>('add');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // CRUD Object state
  const [categoryForm, setCategoryForm] = useState({ jenis_buku: '', deskripsi: '' });
  const [authorForm, setAuthorForm] = useState({ penulis_buku: '', alamat: '', email_penulis: '', deskripsi: '' });
  const [publisherForm, setPublisherForm] = useState({ penerbit_buku: '', alamat_penerbit: '', telp_penerbit: '', email_penerbit: '', deskripsi_penerbit: '' });
  const [bookForm, setBookForm] = useState({
    isbn: '', judul_buku: '', id_kategori_buku: '', id_penulis_buku: '', id_penerbit_buku: '',
    tahun_terbit: '', stok_buku: 5, rak_buku: '', deskripsi_buku: '', kondisi_buku: 'Baik'
  });
  
  // Peminjaman Form
  const [borrowForm, setBorrowForm] = useState({
    id_anggota: '', tgl_pinjam: new Date().toISOString().split('T')[0],
    tgl_hrs_kembali: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    jaminan: ''
  });
  // Borrowing books multi-select tracker
  const [selectedBooksForBorrow, setSelectedBooksForBorrow] = useState<{ id_buku: string; kondisi_buku: string }[]>([]);
  const [tempBookSelection, setTempBookSelection] = useState({ id_buku: '', kondisi_buku: 'Baik' });

  // Denda Form
  const [fineForm, setFineForm] = useState({
    id_peminjaman: '', jumlah_denda: 5000,
    tgl_pinjam: '', tgl_hrs_kembali: '',
    tgl_kembali: new Date().toISOString().split('T')[0], id_anggota: ''
  });

  // Load active database context
  const loadDatabase = async () => {
    setLoading(true);
    // Sync api mode state
    setApiMode(getApiMode());
    try {
      const [bookRes, catRes, authorRes, pubRes, memberRes, borrowRes, fineRes] = await Promise.all([
        apiService.getAllBuku(),
        apiService.getAllJenisBuku(),
        apiService.getAllPenulisBuku(),
        apiService.getAllPenerbitBuku(),
        apiService.getAllAnggota(),
        apiService.getAllPeminjaman(),
        apiService.getAllDenda()
      ]);

      if (!bookRes.error) setBooks(bookRes.data || []);
      if (!catRes.error) setCategories(catRes.data || []);
      if (!authorRes.error) setAuthors(authorRes.data || []);
      if (!pubRes.error) setPublishers(pubRes.data || []);
      if (!memberRes.error) setMembers(memberRes.data || []);
      if (!borrowRes.error) setBorrowings(borrowRes.data || []);
      if (!fineRes.error) setFines(fineRes.data || []);
    } catch (err: any) {
      showNotification('error', `Gagal menghubungkan ke database: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDatabase();
    
    // Listen for mock toggle changes or auth expired events
    const handleRefresh = () => loadDatabase();
    window.addEventListener('api-mode-changed', handleRefresh);
    return () => {
      window.removeEventListener('api-mode-changed', handleRefresh);
    };
  }, [activeTab]);

  // Form Reset Helper
  const openAddModal = () => {
    setModalType('add');
    setSelectedId(null);
    
    // Reset forms
    setCategoryForm({ jenis_buku: '', deskripsi: '' });
    setAuthorForm({ penulis_buku: '', alamat: '', email_penulis: '', deskripsi: '' });
    setPublisherForm({ penerbit_buku: '', alamat_penerbit: '', telp_penerbit: '', email_penerbit: '', deskripsi_penerbit: '' });
    
    if (categories.length > 0 && authors.length > 0 && publishers.length > 0) {
      setBookForm({
        isbn: '', judul_buku: '', 
        id_kategori_buku: categories[0].id, 
        id_penulis_buku: authors[0].id, 
        id_penerbit_buku: publishers[0].id,
        tahun_terbit: '2024', stok_buku: 5, rak_buku: 'B01', deskripsi_buku: '', kondisi_buku: 'Baik'
      });
    }

    if (members.length > 0) {
      setBorrowForm({
        id_anggota: members[0].id_anggota,
        tgl_pinjam: new Date().toISOString().split('T')[0],
        tgl_hrs_kembali: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        jaminan: 'KTP'
      });
      setSelectedBooksForBorrow([]);
      if (books.length > 0) {
        setTempBookSelection({ id_buku: books[0].id_buku, kondisi_buku: 'Baik' });
      }
    }

    if (borrowings.length > 0) {
      const activeB = borrowings[0];
      setFineForm({
        id_peminjaman: activeB.id,
        jumlah_denda: 5000,
        tgl_pinjam: formatDate(activeB.tgl_pinjam),
        tgl_hrs_kembali: formatDate(activeB.tgl_kembali),
        tgl_kembali: new Date().toISOString().split('T')[0],
        id_anggota: activeB.id_anggota
      });
    }

    setModalOpen(true);
  };

  const handleEditClick = (id: string, item: any) => {
    setModalType('edit');
    setSelectedId(id);
    
    if (activeTab === 'kategori') {
      setCategoryForm({ jenis_buku: item.jenis_buku, deskripsi: item.deskripsi });
    } else if (activeTab === 'penulis') {
      setAuthorForm({ 
        penulis_buku: item.penulis_buku, 
        alamat: item.alamat, 
        email_penulis: item.email_penulis, 
        deskripsi: item.deskripsi 
      });
    } else if (activeTab === 'penerbit') {
      setPublisherForm({
        penerbit_buku: item.penerbit_buku,
        alamat_penerbit: item.alamat_penerbit,
        telp_penerbit: item.telp_penerbit,
        email_penerbit: item.email_penerbit,
        deskripsi_penerbit: item.deskripsi_penerbit
      });
    } else if (activeTab === 'peminjaman') {
      setBorrowForm({
        id_anggota: item.id_anggota,
        tgl_pinjam: formatDate(item.tgl_pinjam),
        tgl_hrs_kembali: formatDate(item.tgl_kembali),
        jaminan: item.jaminan
      });
    } else if (activeTab === 'denda') {
      setFineForm({
        id_peminjaman: item.id_peminjaman,
        jumlah_denda: item.jumlah_denda,
        tgl_pinjam: formatDate(item.tgl_pinjam),
        tgl_hrs_kembali: formatDate(item.tgl_hrskembali),
        tgl_kembali: formatDate(item.tgl_kembali),
        id_anggota: item.id_anggota
      });
    }
    setModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setModalType('delete');
    setSelectedId(id);
    setModalOpen(true);
  };

  // CRUD Submission Core Handler
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (modalType === 'delete') {
        if (!selectedId) return;
        
        let res;
        if (activeTab === 'kategori') res = await apiService.deleteJenisBuku(selectedId);
        else if (activeTab === 'penulis') res = await apiService.deletePenulisBuku(selectedId);
        else if (activeTab === 'penerbit') res = await apiService.deletePenerbitBuku(selectedId);
        else if (activeTab === 'peminjaman') res = await apiService.deletePeminjaman(selectedId);
        else if (activeTab === 'denda') res = await apiService.deleteDenda(selectedId);

        if (res && !res.error) {
          showNotification('success', 'Data berhasil dihapus');
        } else {
          throw new Error(res?.msg || 'Gagal menghapus data');
        }
      } else {
        // Add or Edit
        let res;
        if (activeTab === 'kategori') {
          if (modalType === 'add') {
            res = await apiService.createJenisBuku(categoryForm.jenis_buku, categoryForm.deskripsi);
          } else if (selectedId) {
            res = await apiService.updateJenisBuku(selectedId, categoryForm.jenis_buku, categoryForm.deskripsi);
          }
        } 
        
        else if (activeTab === 'penulis') {
          if (modalType === 'add') {
            res = await apiService.createPenulisBuku(authorForm.penulis_buku, authorForm.alamat, authorForm.email_penulis, authorForm.deskripsi);
          } else if (selectedId) {
            res = await apiService.updatePenulisBuku(selectedId, authorForm.penulis_buku, authorForm.alamat, authorForm.email_penulis, authorForm.deskripsi);
          }
        } 
        
        else if (activeTab === 'penerbit') {
          if (modalType === 'add') {
            res = await apiService.createPenerbitBuku(publisherForm.penerbit_buku, publisherForm.alamat_penerbit, publisherForm.telp_penerbit, publisherForm.email_penerbit, publisherForm.deskripsi_penerbit);
          } else if (selectedId) {
            res = await apiService.updatePenerbitBuku(selectedId, publisherForm.penerbit_buku, publisherForm.alamat_penerbit, publisherForm.telp_penerbit, publisherForm.email_penerbit, publisherForm.deskripsi_penerbit);
          }
        }

        else if (activeTab === 'buku') {
          // Local add book mock implementation
          if (apiMode === 'mock') {
            await apiService.createBuku(bookForm);
            showNotification('success', 'Buku baru ditambahkan ke database lokal');
            setModalOpen(false);
            loadDatabase();
            return;
          }
        }

        else if (activeTab === 'peminjaman') {
          if (modalType === 'add') {
            res = await apiService.createPeminjaman(
              borrowForm.id_anggota, borrowForm.tgl_pinjam, 
              borrowForm.tgl_hrs_kembali, borrowForm.jaminan, 
              selectedBooksForBorrow
            );
          } else if (selectedId) {
            res = await apiService.updatePeminjaman(
              selectedId, borrowForm.id_anggota, 
              borrowForm.tgl_pinjam, borrowForm.tgl_hrs_kembali, 
              borrowForm.jaminan
            );
          }
        }

        else if (activeTab === 'denda') {
          if (modalType === 'add') {
            res = await apiService.createDenda(
              Number(fineForm.jumlah_denda), fineForm.tgl_pinjam, 
              fineForm.tgl_hrs_kembali, fineForm.tgl_kembali, 
              fineForm.id_peminjaman, fineForm.id_anggota
            );
          } else if (selectedId) {
            res = await apiService.updateDenda(
              selectedId, Number(fineForm.jumlah_denda), 
              fineForm.tgl_pinjam, fineForm.tgl_hrs_kembali, 
              fineForm.tgl_kembali, fineForm.id_peminjaman, 
              fineForm.id_anggota
            );
          }
        }

        if (res && !res.error) {
          showNotification('success', `Berhasil ${modalType === 'add' ? 'menambahkan' : 'memperbarui'} data`);
        } else {
          throw new Error(res?.msg || 'Gagal memproses data');
        }
      }

      setModalOpen(false);
      loadDatabase();
    } catch (err: any) {
      showNotification('error', err.message);
    }
  };

  // Helper when selecting a borrowing in Denda form to auto-fill member and dates
  const handleBorrowSelectionInFine = (peminjamanId: string) => {
    const borrow = borrowings.find(b => b.id === peminjamanId);
    if (borrow) {
      setFineForm(prev => ({
        ...prev,
        id_peminjaman: peminjamanId,
        id_anggota: borrow.id_anggota,
        tgl_pinjam: formatDate(borrow.tgl_pinjam),
        tgl_hrs_kembali: formatDate(borrow.tgl_kembali)
      }));
    }
  };

  // Add book to the active borrowing buffer in form
  const addTempBookToBorrowList = () => {
    if (!tempBookSelection.id_buku) return;
    
    // Check if already added
    if (selectedBooksForBorrow.some(b => b.id_buku === tempBookSelection.id_buku)) {
      showNotification('info', 'Buku ini sudah masuk ke daftar peminjaman');
      return;
    }

    setSelectedBooksForBorrow(prev => [...prev, { ...tempBookSelection }]);
  };

  const removeBookFromBorrowList = (bookId: string) => {
    setSelectedBooksForBorrow(prev => prev.filter(b => b.id_buku !== bookId));
  };

  return (
    <div className="app-container">
      {/* Sidebar navigation */}
      <aside className="sidebar">
        <div style={{ padding: '24px 20px', borderBottom: '2px solid var(--border-card)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Layers style={{ color: 'var(--text-primary)' }} size={20} />
            <span style={{ fontSize: '1.2rem', fontFamily: 'var(--font-title)', fontWeight: 900, letterSpacing: '-0.04em' }}>
              E-Pustaka
            </span>
          </div>
          <div style={{
            background: 'var(--bg-card)',
            borderRadius: '6px',
            padding: '10px 12px',
            fontSize: '0.8rem',
            border: '2px solid var(--border-card)'
          }}>
            <span style={{ color: 'var(--text-muted)', display: 'block' }}>Petugas Aktif</span>
            <strong style={{ color: 'var(--text-primary)' }}>{username}</strong>
          </div>
        </div>

        {/* Tab links */}
        <nav style={{ padding: '20px 10px', display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
          {[
            { id: 'overview', label: 'Ringkasan', icon: LayoutDashboard },
            { id: 'kategori', label: 'Jenis / Kategori', icon: Tags },
            { id: 'penulis', label: 'Penulis Buku', icon: Users },
            { id: 'penerbit', label: 'Penerbit Buku', icon: Landmark },
            { id: 'buku', label: 'Master Buku', icon: BookMarked },
            { id: 'peminjaman', label: 'Peminjaman', icon: HandHelping },
            { id: 'denda', label: 'Denda Keterlambatan', icon: LandmarkIcon },
          ].map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as TabType)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '6px',
                  border: '2px solid',
                  borderColor: active ? 'var(--border-card-hover)' : 'transparent',
                  background: active ? 'var(--bg-card)' : 'transparent',
                  color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '0.9rem',
                  fontWeight: active ? 900 : 600,
                  transition: 'border-color var(--transition-fast), background var(--transition-fast), color var(--transition-fast)'
                }}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer Controls */}
        <div style={{ padding: '20px', borderTop: '2px solid var(--border-card)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
            <button 
              className="btn btn-secondary btn-icon"
              onClick={onToggleTheme}
              style={{ width: '100%' }}
            >
              {isLightTheme ? <Moon size={16} /> : <Sun size={16} />}
              <span>{isLightTheme ? "Gelap" : "Terang"}</span>
            </button>
          </div>
          
          <button 
            className="btn btn-danger"
            onClick={onLogout}
            style={{ width: '100%', padding: '10px' }}
          >
            <LogOut size={16} />
            Keluar Sesi
          </button>
        </div>
      </aside>

      {/* Main Panel Content */}
      <main className="main-content">
        {/* Header toolbar */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '32px',
          paddingBottom: '16px',
          borderBottom: '2px solid var(--border-card)'
        }}>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Dashboard Perpustakaan
            </span>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>
              {activeTab === 'overview' && 'Ringkasan Statistik'}
              {activeTab === 'kategori' && 'Kelola Kategori / Jenis Buku'}
              {activeTab === 'penulis' && 'Kelola Database Penulis'}
              {activeTab === 'penerbit' && 'Kelola Database Penerbit'}
              {activeTab === 'buku' && 'Daftar Master Buku'}
              {activeTab === 'peminjaman' && 'Transaksi Peminjaman Buku'}
              {activeTab === 'denda' && 'Pencatatan Denda Keterlambatan'}
            </h1>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>

            
            {/* Context Add Button for CRUD Tabs */}
            {activeTab !== 'overview' && (activeTab !== 'buku' || apiMode === 'mock') && (
              <button 
                className="btn btn-primary"
                onClick={openAddModal}
                style={{ padding: '8px 16px' }}
              >
                <Plus size={16} />
                Tambah Baru
              </button>
            )}
          </div>
        </div>

        {/* Content Router based on Active Tab */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
            <div className="spinner" style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--text-primary)', borderRadius: '50%' }} />
          </div>
        ) : (
          <>
            {/* ================= OVERVIEW TAB ================= */}
            {activeTab === 'overview' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }} className="animate-slide-up">
                {/* Stats Counters Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
                  <Card animateHover>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>Koleksi Buku</span>
                        <h2 style={{ fontSize: '2.2rem', fontWeight: 900, marginTop: '4px' }}>{books.length}</h2>
                      </div>
                      <div style={{ padding: '12px', background: 'var(--color-info-bg)', color: 'var(--color-info-text)', border: '2px solid var(--color-info-border)', borderRadius: '6px' }}>
                        <BookMarked size={24} />
                      </div>
                    </div>
                  </Card>
                  
                  <Card animateHover>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>Kategori Buku</span>
                        <h2 style={{ fontSize: '2.2rem', fontWeight: 900, marginTop: '4px' }}>{categories.length}</h2>
                      </div>
                      <div style={{ padding: '12px', background: 'var(--color-warning-bg)', color: 'var(--color-warning-text)', border: '2px solid var(--color-warning-border)', borderRadius: '6px' }}>
                        <Tags size={24} />
                      </div>
                    </div>
                  </Card>

                  <Card animateHover>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>Transaksi Peminjaman</span>
                        <h2 style={{ fontSize: '2.2rem', fontWeight: 900, marginTop: '4px' }}>{borrowings.length}</h2>
                      </div>
                      <div style={{ padding: '12px', background: 'var(--color-success-bg)', color: 'var(--color-success-text)', border: '2px solid var(--color-success-border)', borderRadius: '6px' }}>
                        <HandHelping size={24} />
                      </div>
                    </div>
                  </Card>

                  <Card animateHover>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>Total Denda Tercatat</span>
                        <h2 style={{ fontSize: '2.2rem', fontWeight: 900, marginTop: '4px' }}>
                          Rp {fines.reduce((sum, f) => sum + f.jumlah_denda, 0).toLocaleString('id-ID')}
                        </h2>
                      </div>
                      <div style={{ padding: '12px', background: 'var(--color-danger-bg)', color: 'var(--color-danger-text)', border: '2px solid var(--color-danger-border)', borderRadius: '6px' }}>
                        <LandmarkIcon size={24} />
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Sub Lists Overview */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: '24px' }}>
                  <Card title="Peminjaman Buku Terbaru">
                    <Table
                      data={borrowings}
                      columns={[
                        { header: 'ID', render: (item) => <code style={{ fontSize: '0.75rem' }}>{(item.id || '').substring(0, 8)}</code> },
                        { header: 'Peminjam', render: (item) => item.anggota?.nama || item.id_anggota },
                        { header: 'Jaminan', render: (item) => item.jaminan },
                        { 
                          header: 'Tgl Kembali', 
                          render: (item) => formatLocalDate(item.tgl_kembali) 
                        }
                      ]}
                      itemsPerPage={3}
                    />
                  </Card>
                  
                  <Card title="Daftar Denda Keterlambatan">
                    <Table
                      data={fines}
                      columns={[
                        { header: 'Peminjam', render: (item) => item.anggota?.nama || item.id_anggota },
                        { 
                          header: 'Jumlah Denda', 
                          render: (item) => <span style={{ color: 'var(--color-danger)', fontWeight: 600 }}>Rp {item.jumlah_denda.toLocaleString('id-ID')}</span> 
                        },
                        { 
                          header: 'Tgl Dikembalikan', 
                          render: (item) => formatLocalDate(item.tgl_kembali) 
                        }
                      ]}
                      itemsPerPage={3}
                    />
                  </Card>
                </div>
              </div>
            )}

            {/* ================= KATEGORI TAB ================= */}
            {activeTab === 'kategori' && (
              <Card>
                <Table
                  data={categories}
                  onSearchFilter={(item, query) => 
                    item.jenis_buku.toLowerCase().includes(query.toLowerCase()) || 
                    item.deskripsi.toLowerCase().includes(query.toLowerCase())
                  }
                  columns={[
                    { header: 'ID Kategori', render: (item) => <code style={{ fontSize: '0.8rem' }}>{item.id}</code> },
                    { header: 'Nama Kategori', render: (item) => <strong>{item.jenis_buku}</strong> },
                    { header: 'Deskripsi Kategori', render: (item) => item.deskripsi },
                    {
                      header: 'Aksi',
                      render: (item) => (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button 
                            className="btn btn-secondary btn-icon"
                            onClick={() => handleEditClick(item.id, item)}
                          >
                            <Edit2 size={14} />
                          </button>
                          <button 
                            className="btn btn-danger btn-icon"
                            onClick={() => handleDeleteClick(item.id)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )
                    }
                  ]}
                />
              </Card>
            )}

            {/* ================= PENULIS TAB ================= */}
            {activeTab === 'penulis' && (
              <Card>
                <Table
                  data={authors}
                  onSearchFilter={(item, query) => 
                    item.penulis_buku.toLowerCase().includes(query.toLowerCase()) || 
                    item.email_penulis.toLowerCase().includes(query.toLowerCase())
                  }
                  columns={[
                    { header: 'Nama Penulis', render: (item) => <strong>{item.penulis_buku}</strong> },
                    { header: 'Email', render: (item) => item.email_penulis },
                    { header: 'Alamat', render: (item) => item.alamat },
                    { header: 'Biografi/Deskripsi', render: (item) => item.deskripsi },
                    {
                      header: 'Aksi',
                      render: (item) => (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button 
                            className="btn btn-secondary btn-icon"
                            onClick={() => handleEditClick(item.id, item)}
                          >
                            <Edit2 size={14} />
                          </button>
                          <button 
                            className="btn btn-danger btn-icon"
                            onClick={() => handleDeleteClick(item.id)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )
                    }
                  ]}
                />
              </Card>
            )}

            {/* ================= PENERBIT TAB ================= */}
            {activeTab === 'penerbit' && (
              <Card>
                <Table
                  data={publishers}
                  onSearchFilter={(item, query) => 
                    item.penerbit_buku.toLowerCase().includes(query.toLowerCase()) || 
                    item.email_penerbit.toLowerCase().includes(query.toLowerCase())
                  }
                  columns={[
                    { header: 'Nama Penerbit', render: (item) => <strong>{item.penerbit_buku}</strong> },
                    { header: 'Email Penerbit', render: (item) => item.email_penerbit },
                    { header: 'No Telepon', render: (item) => item.telp_penerbit },
                    { header: 'Alamat', render: (item) => item.alamat_penerbit },
                    { header: 'Keterangan', render: (item) => item.deskripsi_penerbit },
                    {
                      header: 'Aksi',
                      render: (item) => (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button 
                            className="btn btn-secondary btn-icon"
                            onClick={() => handleEditClick(item.id, item)}
                          >
                            <Edit2 size={14} />
                          </button>
                          <button 
                            className="btn btn-danger btn-icon"
                            onClick={() => handleDeleteClick(item.id)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )
                    }
                  ]}
                />
              </Card>
            )}

            {/* ================= MASTER BUKU TAB ================= */}
            {activeTab === 'buku' && (
              <Card>
                {apiMode !== 'mock' && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '12px 16px',
                    background: 'rgba(56, 189, 248, 0.08)',
                    border: '1px solid rgba(56, 189, 248, 0.25)',
                    borderRadius: '10px',
                    marginBottom: '20px',
                    fontSize: '0.85rem',
                    color: 'var(--text-secondary)'
                  }}>
                    <HelpCircle size={16} style={{ color: 'var(--color-info)' }} />
                    <span>Dalam mode API Live, CRUD Buku dinonaktifkan mengikuti desain database Go backend (Books are read-only).</span>
                  </div>
                )}
                <Table
                  data={books}
                  onSearchFilter={(item, query) => 
                    item.judul_buku.toLowerCase().includes(query.toLowerCase()) || 
                    item.isbn.toLowerCase().includes(query.toLowerCase())
                  }
                  columns={[
                    { header: 'Cover', render: (item) => (
                      <div style={{
                        width: '38px',
                        height: '50px',
                        borderRadius: '4px',
                        background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--bg-card-hover) 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '0.65rem'
                      }}>
                        {(item.judul_buku || '').substring(0, 2).toUpperCase()}
                      </div>
                    ) },
                    { header: 'Judul Buku', render: (item) => (
                      <div>
                        <strong>{item.judul_buku}</strong>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>ISBN: {item.isbn}</span>
                      </div>
                    ) },
                    { header: 'Kategori / Genre', render: (item) => item.kategori_buku?.jenis_buku || 'Umum' },
                    { header: 'Penulis', render: (item) => item.penulis_buku?.penulis_buku || 'Umum' },
                    { header: 'Penerbit (Tahun)', render: (item) => `${item.penerbit_buku?.penerbit_buku || 'Umum'} (${item.tahun_terbit})` },
                    { header: 'Rak', render: (item) => <code style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{item.rak_buku}</code> },
                    { header: 'Stok', render: (item) => (
                      <span className={`badge ${item.stok_buku > 0 ? 'badge-success' : 'badge-danger'}`}>
                        {item.stok_buku} Pcs
                      </span>
                    ) }
                  ]}
                />
              </Card>
            )}

            {/* ================= PEMINJAMAN TAB ================= */}
            {activeTab === 'peminjaman' && (
              <Card>
                <Table
                  data={borrowings}
                  onSearchFilter={(item, query) => 
                    (item.anggota?.nama || item.id_anggota).toLowerCase().includes(query.toLowerCase()) || 
                    item.jaminan.toLowerCase().includes(query.toLowerCase())
                  }
                  columns={[
                    { header: 'ID Pinjam', render: (item) => <code style={{ fontSize: '0.8rem' }}>{item.id}</code> },
                    { header: 'Nama Peminjam', render: (item) => <strong>{item.anggota?.nama || item.id_anggota}</strong> },
                    { header: 'Jaminan', render: (item) => item.jaminan },
                    { header: 'Buku Dipinjam', render: (item) => (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {item.details && item.details.length > 0 ? (
                          item.details.map((det, idx) => (
                            <span key={idx} style={{ fontSize: '0.85rem' }}>
                              📚 {det.buku?.judul_buku || 'Buku Terhapus'} ({det.kondisi_buku})
                            </span>
                          ))
                        ) : (
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Tidak ada rincian buku</span>
                        )}
                      </div>
                    ) },
                    { 
                      header: 'Rentang Tanggal', 
                      render: (item) => (
                        <div style={{ fontSize: '0.85rem' }}>
                          <div>Pinjam: <strong style={{ color: 'var(--color-success)' }}>{formatDate(item.tgl_pinjam)}</strong></div>
                          <div>Kembali: <strong style={{ color: 'var(--color-warning)' }}>{formatDate(item.tgl_kembali)}</strong></div>
                        </div>
                      ) 
                    },
                    {
                      header: 'Aksi',
                      render: (item) => (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button 
                            className="btn btn-secondary btn-icon"
                            onClick={() => handleEditClick(item.id, item)}
                          >
                            <Edit2 size={14} />
                          </button>
                          <button 
                            className="btn btn-danger btn-icon"
                            onClick={() => handleDeleteClick(item.id)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )
                    }
                  ]}
                />
              </Card>
            )}

            {/* ================= DENDA TAB ================= */}
            {activeTab === 'denda' && (
              <Card>
                <Table
                  data={fines}
                  onSearchFilter={(item, query) => 
                    (item.anggota?.nama || item.id_anggota).toLowerCase().includes(query.toLowerCase())
                  }
                  columns={[
                    { header: 'Peminjam', render: (item) => <strong>{item.anggota?.nama || item.id_anggota}</strong> },
                    { 
                      header: 'Jumlah Denda', 
                      render: (item) => <strong style={{ color: 'var(--color-danger)' }}>Rp {item.jumlah_denda.toLocaleString('id-ID')}</strong> 
                    },
                    { 
                      header: 'Jadwal Peminjaman', 
                      render: (item) => (
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          <div>Pinjam: {formatDate(item.tgl_pinjam)}</div>
                          <div>Harus Kembali: {formatDate(item.tgl_hrskembali)}</div>
                        </div>
                      ) 
                    },
                    { 
                      header: 'Tanggal Pengembalian', 
                      render: (item) => <span style={{ color: 'var(--color-success)' }}>{formatDate(item.tgl_kembali)}</span> 
                    },
                    {
                      header: 'Aksi',
                      render: (item) => (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button 
                            className="btn btn-secondary btn-icon"
                            onClick={() => handleEditClick(item.id, item)}
                          >
                            <Edit2 size={14} />
                          </button>
                          <button 
                            className="btn btn-danger btn-icon"
                            onClick={() => handleDeleteClick(item.id)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )
                    }
                  ]}
                />
              </Card>
            )}
          </>
        )}
      </main>

      {/* CRUD Core Modal Popup */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={
          modalType === 'delete' ? 'Konfirmasi Hapus Data' :
          modalType === 'add' ? `Tambah ${activeTab.toUpperCase()}` : `Edit ${activeTab.toUpperCase()}`
        }
        maxWidth={activeTab === 'peminjaman' && modalType === 'add' ? '700px' : '550px'}
      >
        <form onSubmit={handleFormSubmit}>
          {modalType === 'delete' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
                Apakah Anda yakin ingin menghapus data dengan ID <strong>{selectedId}</strong>? Tindakan ini bersifat permanen dan tidak dapat dibatalkan.
              </p>
              <div style={{ display: 'flex', justifySelf: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>
                  Batal
                </button>
                <button type="submit" className="btn btn-danger">
                  Hapus Permanen
                </button>
              </div>
            </div>
          ) : (
            // Form layouts
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              
              {/* === KATEGORI FORM === */}
              {activeTab === 'kategori' && (
                <>
                  <Input
                    label="Nama Kategori"
                    type="text"
                    required
                    value={categoryForm.jenis_buku}
                    onChange={(e) => setCategoryForm({ ...categoryForm, jenis_buku: e.target.value })}
                  />
                  <Textarea
                    label="Deskripsi Kategori"
                    required
                    value={categoryForm.deskripsi}
                    onChange={(e) => setCategoryForm({ ...categoryForm, deskripsi: e.target.value })}
                  />
                </>
              )}

              {/* === PENULIS FORM === */}
              {activeTab === 'penulis' && (
                <>
                  <Input
                    label="Nama Penulis"
                    type="text"
                    required
                    value={authorForm.penulis_buku}
                    onChange={(e) => setAuthorForm({ ...authorForm, penulis_buku: e.target.value })}
                  />
                  <Input
                    label="Email Penulis"
                    type="email"
                    required
                    value={authorForm.email_penulis}
                    onChange={(e) => setAuthorForm({ ...authorForm, email_penulis: e.target.value })}
                  />
                  <Input
                    label="Alamat Kota"
                    type="text"
                    required
                    value={authorForm.alamat}
                    onChange={(e) => setAuthorForm({ ...authorForm, alamat: e.target.value })}
                  />
                  <Textarea
                    label="Deskripsi Biografi"
                    required
                    value={authorForm.deskripsi}
                    onChange={(e) => setAuthorForm({ ...authorForm, deskripsi: e.target.value })}
                  />
                </>
              )}

              {/* === PENERBIT FORM === */}
              {activeTab === 'penerbit' && (
                <>
                  <Input
                    label="Nama Penerbit"
                    type="text"
                    required
                    value={publisherForm.penerbit_buku}
                    onChange={(e) => setPublisherForm({ ...publisherForm, penerbit_buku: e.target.value })}
                  />
                  <Input
                    label="Email Penerbit"
                    type="email"
                    required
                    value={publisherForm.email_penerbit}
                    onChange={(e) => setPublisherForm({ ...publisherForm, email_penerbit: e.target.value })}
                  />
                  <Input
                    label="No Telp"
                    type="text"
                    required
                    value={publisherForm.telp_penerbit}
                    onChange={(e) => setPublisherForm({ ...publisherForm, telp_penerbit: e.target.value })}
                  />
                  <Input
                    label="Alamat Kantor"
                    type="text"
                    required
                    value={publisherForm.alamat_penerbit}
                    onChange={(e) => setPublisherForm({ ...publisherForm, alamat_penerbit: e.target.value })}
                  />
                  <Textarea
                    label="Deskripsi"
                    required
                    value={publisherForm.deskripsi_penerbit}
                    onChange={(e) => setPublisherForm({ ...publisherForm, deskripsi_penerbit: e.target.value })}
                  />
                </>
              )}

              {/* === BUKU FORM === */}
              {activeTab === 'buku' && (
                <>
                  <Input
                    label="ISBN Buku"
                    type="text"
                    required
                    value={bookForm.isbn}
                    onChange={(e) => setBookForm({ ...bookForm, isbn: e.target.value })}
                  />
                  <Input
                    label="Judul Buku"
                    type="text"
                    required
                    value={bookForm.judul_buku}
                    onChange={(e) => setBookForm({ ...bookForm, judul_buku: e.target.value })}
                  />
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <Select
                      label="Kategori Buku"
                      options={categories.map(c => ({ value: c.id, label: c.jenis_buku }))}
                      value={bookForm.id_kategori_buku}
                      onChange={(e) => setBookForm({ ...bookForm, id_kategori_buku: e.target.value })}
                    />
                    <Select
                      label="Penulis"
                      options={authors.map(a => ({ value: a.id, label: a.penulis_buku }))}
                      value={bookForm.id_penulis_buku}
                      onChange={(e) => setBookForm({ ...bookForm, id_penulis_buku: e.target.value })}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <Select
                      label="Penerbit"
                      options={publishers.map(p => ({ value: p.id, label: p.penerbit_buku }))}
                      value={bookForm.id_penerbit_buku}
                      onChange={(e) => setBookForm({ ...bookForm, id_penerbit_buku: e.target.value })}
                    />
                    <Input
                      label="Tahun Terbit"
                      type="text"
                      required
                      value={bookForm.tahun_terbit}
                      onChange={(e) => setBookForm({ ...bookForm, tahun_terbit: e.target.value })}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <Input
                      label="Stok Buku"
                      type="number"
                      required
                      value={bookForm.stok_buku}
                      onChange={(e) => setBookForm({ ...bookForm, stok_buku: Number(e.target.value) })}
                    />
                    <Input
                      label="Kode Lokasi Rak"
                      type="text"
                      required
                      value={bookForm.rak_buku}
                      onChange={(e) => setBookForm({ ...bookForm, rak_buku: e.target.value })}
                    />
                  </div>

                  <Textarea
                    label="Sinopsis Buku"
                    required
                    value={bookForm.deskripsi_buku}
                    onChange={(e) => setBookForm({ ...bookForm, deskripsi_buku: e.target.value })}
                  />
                </>
              )}

              {/* === PEMINJAMAN FORM === */}
              {activeTab === 'peminjaman' && (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    {apiMode === 'mock' ? (
                      <Select
                        label="Pilih Anggota"
                        options={members.map(m => ({ value: m.id_anggota, label: m.nama }))}
                        value={borrowForm.id_anggota}
                        onChange={(e) => setBorrowForm({ ...borrowForm, id_anggota: e.target.value })}
                      />
                    ) : (
                      <Input
                        label="ID Anggota"
                        type="text"
                        required
                        placeholder="Ketik ID Anggota"
                        value={borrowForm.id_anggota}
                        onChange={(e) => setBorrowForm({ ...borrowForm, id_anggota: e.target.value })}
                      />
                    )}
                    <Input
                      label="Jaminan Peminjaman"
                      type="text"
                      required
                      value={borrowForm.jaminan}
                      onChange={(e) => setBorrowForm({ ...borrowForm, jaminan: e.target.value })}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <Input
                      label="Tanggal Pinjam"
                      type="date"
                      required
                      value={borrowForm.tgl_pinjam}
                      onChange={(e) => setBorrowForm({ ...borrowForm, tgl_pinjam: e.target.value })}
                    />
                    <Input
                      label="Tanggal Harus Kembali"
                      type="date"
                      required
                      value={borrowForm.tgl_hrs_kembali}
                      onChange={(e) => setBorrowForm({ ...borrowForm, tgl_hrs_kembali: e.target.value })}
                    />
                  </div>

                  {/* Multi-Book select block only in Add Mode */}
                  {modalType === 'add' && (
                    <div style={{ 
                      marginTop: '12px',
                      padding: '16px',
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid var(--border-card)',
                      borderRadius: '12px'
                    }}>
                      <h4 style={{ fontSize: '0.9rem', marginBottom: '8px', color: 'var(--text-secondary)' }}>
                        Buku yang dipinjam (Dapat memilih lebih dari satu)
                      </h4>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '10px', alignItems: 'flex-end', marginBottom: '12px' }}>
                        <Select
                          label="Pilih Buku"
                          options={books.map(b => ({ value: b.id_buku, label: b.judul_buku }))}
                          value={tempBookSelection.id_buku}
                          onChange={(e) => setTempBookSelection({ ...tempBookSelection, id_buku: e.target.value })}
                        />
                        <Select
                          label="Kondisi"
                          options={[
                            { value: 'Baik', label: 'Baik' },
                            { value: 'Rusak Ringan', label: 'Rusak Ringan' },
                            { value: 'Rusak Berat', label: 'Rusak Berat' }
                          ]}
                          value={tempBookSelection.kondisi_buku}
                          onChange={(e) => setTempBookSelection({ ...tempBookSelection, kondisi_buku: e.target.value })}
                        />
                        <button 
                          type="button" 
                          className="btn btn-secondary" 
                          onClick={addTempBookToBorrowList}
                          style={{ height: '44px' }}
                        >
                          Tambah
                        </button>
                      </div>

                      {/* Display added books list */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {selectedBooksForBorrow.length === 0 ? (
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Belum ada buku ditambahkan ke list peminjaman.</span>
                        ) : (
                          selectedBooksForBorrow.map((item, index) => {
                            const foundBook = books.find(b => b.id_buku === item.id_buku);
                            return (
                              <div key={index} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '6px 12px',
                                background: 'rgba(139, 92, 246, 0.05)',
                                borderRadius: '8px',
                                border: '1px solid rgba(139, 92, 246, 0.1)',
                                fontSize: '0.85rem'
                              }}>
                                <span>📚 {foundBook?.judul_buku} ({item.kondisi_buku})</span>
                                <button
                                  type="button"
                                  onClick={() => removeBookFromBorrowList(item.id_buku)}
                                  style={{
                                    border: 'none',
                                    background: 'transparent',
                                    color: 'var(--color-danger)',
                                    cursor: 'pointer',
                                    fontSize: '0.8rem',
                                    fontWeight: 'bold'
                                  }}
                                >
                                  Hapus
                                </button>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* === DENDA FORM === */}
              {activeTab === 'denda' && (
                <>
                  {modalType === 'add' ? (
                    <Select
                      label="Transaksi Peminjaman Asal"
                      options={borrowings.map(b => ({ 
                        value: b.id, 
                        label: `Pinjam #${b.id.substring(0, 8)} oleh ${b.anggota?.nama || b.id_anggota}` 
                      }))}
                      value={fineForm.id_peminjaman}
                      onChange={(e) => handleBorrowSelectionInFine(e.target.value)}
                    />
                  ) : (
                    <Input
                      label="ID Peminjaman"
                      type="text"
                      disabled
                      value={fineForm.id_peminjaman}
                    />
                  )}

                  <Input
                    label="Jumlah Denda (Rupiah)"
                    type="number"
                    required
                    value={fineForm.jumlah_denda}
                    onChange={(e) => setFineForm({ ...fineForm, jumlah_denda: Number(e.target.value) })}
                  />

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <Input
                      label="Tanggal Pinjam"
                      type="date"
                      disabled
                      value={fineForm.tgl_pinjam}
                    />
                    <Input
                      label="Tanggal Harus Kembali"
                      type="date"
                      disabled
                      value={fineForm.tgl_hrs_kembali}
                    />
                  </div>

                  <Input
                    label="Tanggal Pengembalian Riil"
                    type="date"
                    required
                    value={fineForm.tgl_kembali}
                    onChange={(e) => setFineForm({ ...fineForm, tgl_kembali: e.target.value })}
                  />
                </>
              )}

              {/* Footer */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  {modalType === 'add' ? 'Simpan Data' : 'Perbarui Data'}
                </button>
              </div>
            </div>
          )}
        </form>
      </Modal>
    </div>
  );
};
