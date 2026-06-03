import React, { useState, useEffect } from 'react';
import { Search, BookOpen, User, BookMarked, Sun, Moon, Info, Tag, Landmark, AlertCircle } from 'lucide-react';
import { apiService } from '../api/service';
import { Buku, JenisBuku } from '../types';
import { Modal } from '../components/Modal';

interface PublicPortalProps {
  onNavigateToLogin: () => void;
  isLightTheme: boolean;
  onToggleTheme: () => void;
}

export const PublicPortal: React.FC<PublicPortalProps> = ({
  onNavigateToLogin,
  isLightTheme,
  onToggleTheme
}) => {
  const [books, setBooks] = useState<Buku[]>([]);
  const [categories, setCategories] = useState<JenisBuku[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBook, setSelectedBook] = useState<Buku | null>(null);

  useEffect(() => {
    const loadPortalData = async () => {
      setLoading(true);
      try {
        const bookRes = await apiService.getAllBuku();
        const catRes = await apiService.getAllJenisBuku();
        if (!bookRes.error) setBooks(bookRes.data);
        if (!catRes.error) setCategories(catRes.data);
      } catch (err) {
        console.error('Gagal mengambil data portal:', err);
      } finally {
        setLoading(false);
      }
    };
    loadPortalData();
  }, []);

  // Filter books based on search query and category dropdown
  const filteredBooks = books.filter(b => {
    const matchesSearch = b.judul_buku.toLowerCase().includes(search.toLowerCase()) || 
                          b.isbn.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || b.id_kategori_buku === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Generates unique pastel solid colors for book covers based on their ID
  const getBookBackground = (id: string) => {
    const colors = [
      'var(--color-info-bg)',
      'var(--color-success-bg)',
      'var(--color-warning-bg)',
      'rgba(255, 255, 255, 0.05)',
      'var(--color-danger-bg)'
    ];
    const charCodeSum = id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return colors[charCodeSum % colors.length];
  };

  const getBookBorderColor = (id: string) => {
    const colors = [
      'var(--color-info-border)',
      'var(--color-success-border)',
      'var(--color-warning-border)',
      'var(--border-card)',
      'var(--color-danger-border)'
    ];
    const charCodeSum = id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return colors[charCodeSum % colors.length];
  };

  const getBookTextColor = (id: string) => {
    const colors = [
      'var(--color-info-text)',
      'var(--color-success-text)',
      'var(--color-warning-text)',
      'var(--text-primary)',
      'var(--color-danger-text)'
    ];
    const charCodeSum = id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return colors[charCodeSum % colors.length];
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navbar */}
      <header className="glass-panel" style={{
        position: 'sticky',
        top: 0,
        borderRadius: '0 0 6px 6px',
        padding: '16px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 100,
        backgroundColor: 'var(--bg-app)',
        borderWidth: '0 0 2px 0',
        borderColor: 'var(--border-card)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ 
            background: 'var(--text-primary)', 
            padding: '8px', 
            borderRadius: '6px', 
            color: 'var(--bg-app)',
            border: '2px solid var(--text-primary)',
            display: 'flex',
            alignItems: 'center'
          }}>
            <BookMarked size={22} />
          </div>
          <span style={{ fontSize: '1.4rem', fontFamily: 'var(--font-title)', fontWeight: 900, letterSpacing: '-0.04em', color: 'var(--text-primary)' }}>
            E-Pustaka
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button 
            className="btn btn-secondary btn-icon"
            onClick={onToggleTheme}
            title={isLightTheme ? "Aktifkan Mode Gelap" : "Aktifkan Mode Terang"}
            style={{ borderRadius: '50%', width: '40px', height: '40px', padding: 0 }}
          >
            {isLightTheme ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          
          <button 
            className="btn btn-primary"
            onClick={onNavigateToLogin}
            style={{ padding: '8px 18px' }}
          >
            <User size={16} />
            Librarian Login
          </button>
        </div>
      </header>

      {/* Main Catalog View */}
      <main className="main-content" style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '40px 24px' }}>
        
        {/* Welcome Section */}
        <section style={{ textAlign: 'center', marginBottom: '40px' }} className="animate-slide-up">
          <h1 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-title)', fontWeight: 900, letterSpacing: '-0.04em', marginBottom: '8px' }}>
            Temukan Koleksi Pustaka Kami
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto 24px auto' }}>
            Cari buku, referensi ilmiah, jurnal, dan novel terbaik. Sistem pencatatan modern terintegrasi dengan database perpustakaan.
          </p>

          {/* Search Controls Card */}
          <div className="glass-panel" style={{ 
            padding: '16px', 
            maxWidth: '750px', 
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            gap: '12px',
            alignItems: 'center',
            borderRadius: '6px',
            border: '2px solid var(--border-card)'
          }}>
            {/* Search Input */}
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input
                type="text"
                placeholder="Cari judul buku atau nomor ISBN..."
                className="form-input"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingLeft: '48px', border: '2px solid var(--border-card)', background: 'var(--bg-app)' }}
              />
            </div>
            
            {/* Genre Select Dropdown */}
            <div style={{ minWidth: '150px' }}>
              <select
                className="form-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{ border: '2px solid var(--border-card)', background: 'var(--bg-app)' }}
              >
                <option value="all">Semua Kategori</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.jenis_buku}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Books Shelf */}
        <section>
          {loading ? (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', 
              gap: '24px' 
            }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="glass-panel" style={{ height: '380px', padding: '16px' }}>
                  <div style={{ height: '200px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '12px', marginBottom: '16px' }} />
                  <div style={{ height: '16px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '4px', width: '80%', marginBottom: '12px' }} />
                  <div style={{ height: '12px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '4px', width: '50%', marginBottom: '8px' }} />
                  <div style={{ height: '12px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '4px', width: '40%' }} />
                </div>
              ))}
            </div>
          ) : filteredBooks.length === 0 ? (
            <div className="glass-panel animate-scale" style={{ textAlign: 'center', padding: '60px 24px' }}>
              <AlertCircle size={48} style={{ color: 'var(--color-warning)', marginBottom: '16px' }} />
              <h3 style={{ fontSize: '1.25rem', marginBottom: '6px' }}>Buku Tidak Ditemukan</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Coba gunakan kata kunci pencarian atau kategori filter lainnya.</p>
            </div>
          ) : (
            <div 
              style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', 
                gap: '24px' 
              }}
              className="animate-fade"
            >
              {filteredBooks.map((book) => (
                <div 
                  key={book.id_buku} 
                  className="glass-panel glass-panel-hover"
                  style={{ 
                    padding: '16px', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    cursor: 'pointer',
                    borderRadius: '6px',
                    position: 'relative'
                  }}
                  onClick={() => setSelectedBook(book)}
                >
                  {/* Book Cover */}
                  <div style={{
                    height: '200px',
                    borderRadius: '6px',
                    background: getBookBackground(book.id_buku),
                    border: `2px solid ${getBookBorderColor(book.id_buku)}`,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '16px',
                    color: getBookTextColor(book.id_buku),
                    marginBottom: '16px',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', zIndex: 2 }}>
                      <span style={{ 
                        fontSize: '0.7rem', 
                        textTransform: 'uppercase', 
                        letterSpacing: '0.05em', 
                        padding: '3px 8px', 
                        background: 'var(--bg-app)', 
                        border: '1px solid var(--border-card)', 
                        borderRadius: '4px', 
                        color: 'var(--text-primary)',
                        fontWeight: 700 
                      }}>
                        {book.kategori_buku?.jenis_buku || 'Buku'}
                      </span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>{book.tahun_terbit}</span>
                    </div>

                    <div style={{ zIndex: 2 }}>
                      <BookOpen size={24} style={{ marginBottom: '6px', color: getBookTextColor(book.id_buku) }} />
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {book.judul_buku}
                      </h4>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>ISBN: {book.isbn}</span>
                    <h5 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {book.judul_buku}
                    </h5>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '10px', borderTop: '2px solid var(--border-card)' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        Rak: <strong style={{ color: 'var(--text-primary)' }}>{book.rak_buku}</strong>
                      </span>
                      <span className={`badge ${book.stok_buku > 0 ? 'badge-success' : 'badge-danger'}`}>
                        {book.stok_buku > 0 ? `${book.stok_buku} Tersedia` : 'Habis'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Book Detail Modal */}
      <Modal
        isOpen={selectedBook !== null}
        onClose={() => setSelectedBook(null)}
        title="Detail Buku & Status Ketersediaan"
        maxWidth="650px"
      >
        {selectedBook && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Split Top section */}
            <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '20px' }}>
              <div style={{
                height: '210px',
                borderRadius: '6px',
                background: getBookBackground(selectedBook.id_buku),
                border: `2px solid ${getBookBorderColor(selectedBook.id_buku)}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: getBookTextColor(selectedBook.id_buku)
              }}>
                <BookOpen size={48} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <span className="badge badge-info" style={{ marginBottom: '8px' }}>
                    {selectedBook.kategori_buku?.jenis_buku || 'Umum'}
                  </span>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.3, marginBottom: '6px' }}>
                    {selectedBook.judul_buku}
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                    Oleh: <strong>{selectedBook.penulis_buku?.penulis_buku || 'Penulis Tidak Diketahui'}</strong>
                  </p>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ padding: '8px 12px', background: 'var(--bg-card)', border: '2px solid var(--border-card)', borderRadius: '6px', fontSize: '0.75rem' }}>
                    <span style={{ color: 'var(--text-muted)', display: 'block' }}>ISBN</span>
                    <strong>{selectedBook.isbn}</strong>
                  </div>
                  <div style={{ padding: '8px 12px', background: 'var(--bg-card)', border: '2px solid var(--border-card)', borderRadius: '6px', fontSize: '0.75rem' }}>
                    <span style={{ color: 'var(--text-muted)', display: 'block' }}>Kondisi</span>
                    <strong>{selectedBook.kondisi_buku || 'Baik'}</strong>
                  </div>
                  <div style={{ padding: '8px 12px', background: 'var(--bg-card)', border: '2px solid var(--border-card)', borderRadius: '6px', fontSize: '0.75rem' }}>
                    <span style={{ color: 'var(--text-muted)', display: 'block' }}>Lokasi Rak</span>
                    <strong style={{ color: 'var(--text-primary)' }}>{selectedBook.rak_buku}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Info size={16} /> Deskripsi Buku
              </h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, padding: '12px 16px', background: 'var(--bg-card)', borderRadius: '6px', border: '2px solid var(--border-card)' }}>
                {selectedBook.deskripsi_buku || 'Tidak ada deskripsi untuk buku ini.'}
              </p>
            </div>

            {/* Publication Info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <Landmark size={16} style={{ marginTop: '2px', color: 'var(--color-primary)' }} />
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block' }}>Penerbit</span>
                  <strong>{selectedBook.penerbit_buku?.penerbit_buku || 'Penerbit Utama'} ({selectedBook.tahun_terbit})</strong>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <Tag size={16} style={{ marginTop: '2px', color: 'var(--color-primary)' }} />
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block' }}>Kategori Buku</span>
                  <strong>{selectedBook.kategori_buku?.jenis_buku || 'Umum'}</strong>
                </div>
              </div>
            </div>

            {/* Status Footer */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: '16px',
              borderTop: '2px solid var(--border-card)',
              marginTop: '8px'
            }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Status Ketersediaan</span>
                <strong style={{ fontSize: '1rem', color: selectedBook.stok_buku > 0 ? 'var(--color-success-text)' : 'var(--color-danger-text)' }}>
                  {selectedBook.stok_buku > 0 ? `${selectedBook.stok_buku} Buku Dapat Dipinjam` : 'Buku Sedang Kosong'}
                </strong>
              </div>
              <button 
                className="btn btn-secondary"
                onClick={() => setSelectedBook(null)}
                style={{ padding: '8px 20px' }}
              >
                Tutup
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Footer */}
      <footer style={{ 
        marginTop: 'auto', 
        padding: '24px', 
        textAlign: 'center', 
        borderTop: '2px solid var(--border-card)',
        fontSize: '0.8rem',
        color: 'var(--text-muted)'
      }}>
        © 2026 E-Pustaka. Sistem Manajemen Perpustakaan Terintegrasi.
      </footer>
    </div>
  );
};
