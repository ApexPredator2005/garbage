import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  Bookmark,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  X,
  Check,
  Download,
  Filter,
  BarChart3,
  ExternalLink,
  QrCode,
  Tag,
  Building,
  RotateCw,
  Calendar,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface BookItem {
  id: string;
  accessionNo: string;
  title: string;
  author: string;
  isbn: string;
  publisher: string;
  edition: string;
  ddcCode: string; // Dewey Decimal Classification (e.g. 005.133 for Python)
  department: string;
  rackLocation: string; // e.g. "Rack CS-04, Shelf 2"
  totalCopies: number;
  availableCopies: number;
  format: 'HARDCOVER' | 'PAPERBACK' | 'E_BOOK' | 'JOURNAL';
}

interface CirculationRecord {
  id: string;
  accessionNo: string;
  bookTitle: string;
  borrowerName: string;
  borrowerType: 'STUDENT' | 'FACULTY';
  borrowerId: string; // Roll number or employee code
  borrowDate: string;
  dueDate: string;
  renewCount: number;
  fineAccrued: number; // in ₹ (e.g. ₹5/day overdue)
  status: 'ISSUED' | 'OVERDUE' | 'RETURNED';
}

interface DigitalResource {
  id: string;
  name: string;
  category: 'JOURNALS' | 'STANDARDS' | 'CONFERENCE_PROCEEDINGS' | 'E_BOOKS';
  provider: string;
  accessUrl: string;
  indexedCount: string;
  ssoStatus: 'CONNECTED' | 'RENEWAL_DUE';
}

const INITIAL_BOOKS: BookItem[] = [
  {
    id: 'bk-1',
    accessionNo: 'ACC-CSE-2024-001',
    title: 'Introduction to Algorithms (CLRS)',
    author: 'Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest',
    isbn: '978-0262033848',
    publisher: 'MIT Press',
    edition: '4th Edition (2022)',
    ddcCode: '005.1',
    department: 'Computer Science',
    rackLocation: 'Rack CS-01, Shelf 3',
    totalCopies: 12,
    availableCopies: 4,
    format: 'HARDCOVER',
  },
  {
    id: 'bk-2',
    accessionNo: 'ACC-CSE-2023-088',
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    isbn: '978-1449373320',
    publisher: "O'Reilly Media",
    edition: '1st Edition (2017)',
    ddcCode: '005.74',
    department: 'Computer Science',
    rackLocation: 'Rack CS-04, Shelf 2',
    totalCopies: 8,
    availableCopies: 2,
    format: 'PAPERBACK',
  },
  {
    id: 'bk-3',
    accessionNo: 'ACC-ECE-2022-045',
    title: 'Digital Signal Processing: Principles, Algorithms & Applications',
    author: 'John G. Proakis, Dimitris G. Manolakis',
    isbn: '978-0131873742',
    publisher: 'Pearson Education',
    edition: '5th Edition (2021)',
    ddcCode: '621.3822',
    department: 'Electronics & Comm',
    rackLocation: 'Rack EC-02, Shelf 1',
    totalCopies: 10,
    availableCopies: 5,
    format: 'HARDCOVER',
  },
  {
    id: 'bk-4',
    accessionNo: 'ACC-MEC-2021-019',
    title: 'Fluid Mechanics: Fundamentals and Applications',
    author: 'Yunus A. Çengel, John M. Cimbala',
    isbn: '978-1259696534',
    publisher: 'McGraw-Hill Education',
    edition: '4th Edition (2018)',
    ddcCode: '620.106',
    department: 'Mechanical Engg',
    rackLocation: 'Rack ME-05, Shelf 4',
    totalCopies: 6,
    availableCopies: 3,
    format: 'PAPERBACK',
  },
  {
    id: 'bk-5',
    accessionNo: 'ACC-AI-2025-012',
    title: 'Deep Learning',
    author: 'Ian Goodfellow, Yoshua Bengio, Aaron Courville',
    isbn: '978-0262035613',
    publisher: 'MIT Press',
    edition: '1st Edition (2016)',
    ddcCode: '006.3',
    department: 'Computer Science',
    rackLocation: 'Rack CS-02, Shelf 1',
    totalCopies: 5,
    availableCopies: 1,
    format: 'HARDCOVER',
  },
];

const INITIAL_CIRCULATION: CirculationRecord[] = [
  {
    id: 'cir-1',
    accessionNo: 'ACC-CSE-2024-001',
    bookTitle: 'Introduction to Algorithms (CLRS)',
    borrowerName: 'Aarav Sharma',
    borrowerType: 'STUDENT',
    borrowerId: '26CS01',
    borrowDate: '2026-10-14',
    dueDate: '2026-10-28',
    renewCount: 0,
    fineAccrued: 10, // 2 days overdue @ ₹5/day
    status: 'OVERDUE',
  },
  {
    id: 'cir-2',
    accessionNo: 'ACC-CSE-2023-088',
    bookTitle: 'Designing Data-Intensive Applications',
    borrowerName: 'Diya Patel',
    borrowerType: 'STUDENT',
    borrowerId: '26CS02',
    borrowDate: '2026-10-20',
    dueDate: '2026-11-03',
    renewCount: 1,
    fineAccrued: 0,
    status: 'ISSUED',
  },
  {
    id: 'cir-3',
    accessionNo: 'ACC-ECE-2022-045',
    bookTitle: 'Digital Signal Processing',
    borrowerName: 'Prof. Sunita Rao',
    borrowerType: 'FACULTY',
    borrowerId: 'EMP-CSE-012',
    borrowDate: '2026-10-01',
    dueDate: '2026-11-30', // Faculty 60-day loan
    renewCount: 0,
    fineAccrued: 0,
    status: 'ISSUED',
  },
];

const DIGITAL_RESOURCES: DigitalResource[] = [
  {
    id: 'dig-1',
    name: 'IEEE Xplore Digital Library',
    category: 'JOURNALS',
    provider: 'IEEE Electronic Library (IEL)',
    accessUrl: 'https://ieeexplore.ieee.org',
    indexedCount: '5.4 Million Articles',
    ssoStatus: 'CONNECTED',
  },
  {
    id: 'dig-2',
    name: 'ScienceDirect & Scopus',
    category: 'JOURNALS',
    provider: 'Elsevier B.V.',
    accessUrl: 'https://sciencedirect.com',
    indexedCount: '19 Million Full-Text Papers',
    ssoStatus: 'CONNECTED',
  },
  {
    id: 'dig-3',
    name: 'ACM Digital Library',
    category: 'CONFERENCE_PROCEEDINGS',
    provider: 'Association for Computing Machinery',
    accessUrl: 'https://dl.acm.org',
    indexedCount: '3.1 Million Computing Pubs',
    ssoStatus: 'CONNECTED',
  },
  {
    id: 'dig-4',
    name: 'National Digital Library of India (NDLI)',
    category: 'E_BOOKS',
    provider: 'Ministry of Education & IIT Kharagpur',
    accessUrl: 'https://ndl.iitkgp.ac.in',
    indexedCount: '90 Million Digital Assets',
    ssoStatus: 'CONNECTED',
  },
];

export const LibraryWorkspace: React.FC = () => {
  const [subTab, setSubTab] = useState<'opac' | 'circulation' | 'digital' | 'footfall'>('opac');
  const [books, setBooks] = useState<BookItem[]>(INITIAL_BOOKS);
  const [circulation, setCirculation] = useState<CirculationRecord[]>(INITIAL_CIRCULATION);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');

  // New Book Modal
  const [isNewBookModalOpen, setIsNewBookModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newIsbn, setNewIsbn] = useState('');
  const [newPublisher, setNewPublisher] = useState('');
  const [newDdc, setNewDdc] = useState('005.1');
  const [newDept, setNewDept] = useState('Computer Science');
  const [newRack, setNewRack] = useState('Rack CS-05, Shelf 1');
  const [newCopies, setNewCopies] = useState<number>(5);

  // Return Book Action
  const handleReturnBook = (recordId: string, accessionNo: string) => {
    setCirculation((prev) =>
      prev.map((c) => (c.id === recordId ? { ...c, status: 'RETURNED', fineAccrued: 0 } : c))
    );
    setBooks((prev) =>
      prev.map((b) => (b.accessionNo === accessionNo ? { ...b, availableCopies: b.availableCopies + 1 } : b))
    );
    alert('Book returned cleanly. Fine settled and library inventory copy count updated.');
  };

  // Renew Book Action
  const handleRenewBook = (recordId: string) => {
    setCirculation((prev) =>
      prev.map((c) => {
        if (c.id !== recordId) return c;
        const currentDue = new Date(c.dueDate);
        currentDue.setDate(currentDue.getDate() + 14); // 14 more days
        return {
          ...c,
          dueDate: currentDue.toISOString().split('T')[0],
          renewCount: c.renewCount + 1,
          status: 'ISSUED',
          fineAccrued: 0,
        };
      })
    );
    alert('Book loan period renewed for 14 additional calendar days.');
  };

  const handleCatalogBook = (e: React.FormEvent) => {
    e.preventDefault();
    const created: BookItem = {
      id: `bk-${Date.now().toString(36)}`,
      accessionNo: `ACC-${newDept.slice(0, 3).toUpperCase()}-2026-${String(books.length + 1).padStart(3, '0')}`,
      title: newTitle,
      author: newAuthor,
      isbn: newIsbn || '978-0123456789',
      publisher: newPublisher || 'University Academic Press',
      edition: '1st Edition (2026)',
      ddcCode: newDdc,
      department: newDept,
      rackLocation: newRack,
      totalCopies: Number(newCopies),
      availableCopies: Number(newCopies),
      format: 'HARDCOVER',
    };

    setBooks([created, ...books]);
    setIsNewBookModalOpen(false);
    setNewTitle('');
    setNewAuthor('');
    setNewIsbn('');
  };

  // Aggregate Stats
  const stats = useMemo(() => {
    const totalTitles = books.length;
    const totalVolumes = books.reduce((acc, b) => acc + b.totalCopies, 0);
    const totalIssued = circulation.filter((c) => c.status !== 'RETURNED').length;
    const overdueCount = circulation.filter((c) => c.status === 'OVERDUE').length;
    return { totalTitles, totalVolumes, totalIssued, overdueCount };
  }, [books, circulation]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Workspace Header */}
      <div className="bg-white rounded-2xl border border-[#E5DFD7] p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FAF7F2] text-[#8B5E3C] border border-[#E5DFD7]">
              Central Library &amp; Information Resource Center
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-900 border border-blue-200">
              Koha &amp; MARC-21 Interoperable
            </span>
          </div>
          <h1 className="text-xl font-bold text-[#242424]">Library Management System &amp; OPAC Catalog</h1>
          <p className="text-xs text-[#6E6862]">
            Dewey Decimal classification repository, RFID circulation desk, IEEE/ScienceDirect e-resources, and reading room footfall analytics.
          </p>
        </div>

        {/* Global Action Desk */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsNewBookModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#682038] hover:bg-[#54192D] text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Catalog New Title</span>
          </button>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E5DFD7] pb-2 overflow-x-auto">
        <button
          onClick={() => setSubTab('opac')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            subTab === 'opac'
              ? 'bg-[#682038] text-white shadow-sm'
              : 'text-[#6E6862] hover:bg-white hover:text-[#242424]'
          }`}
        >
          <BookOpen className="w-4 h-4 text-[#FB923C]" />
          <span>OPAC Search &amp; Catalog ({books.length} Titles)</span>
        </button>

        <button
          onClick={() => setSubTab('circulation')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            subTab === 'circulation'
              ? 'bg-[#682038] text-white shadow-sm'
              : 'text-[#6E6862] hover:bg-white hover:text-[#242424]'
          }`}
        >
          <RotateCw className="w-4 h-4 text-[#FB923C]" />
          <span>Circulation Desk &amp; Overdue Fines ({circulation.length})</span>
        </button>

        <button
          onClick={() => setSubTab('digital')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            subTab === 'digital'
              ? 'bg-[#682038] text-white shadow-sm'
              : 'text-[#6E6862] hover:bg-white hover:text-[#242424]'
          }`}
        >
          <ExternalLink className="w-4 h-4 text-[#FB923C]" />
          <span>IEEE &amp; Digital Repositories ({DIGITAL_RESOURCES.length})</span>
        </button>

        <button
          onClick={() => setSubTab('footfall')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            subTab === 'footfall'
              ? 'bg-[#682038] text-white shadow-sm'
              : 'text-[#6E6862] hover:bg-white hover:text-[#242424]'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-[#FB923C]" />
          <span>Turnstile Entry Footfall &amp; Reading Room</span>
        </button>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#E5DFD7] shadow-sm space-y-1">
          <span className="text-xs font-medium text-[#6E6862]">Cataloged Volumes</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-[#242424]">{stats.totalVolumes}</span>
            <span className="text-xs text-[#8B5E3C] font-semibold">{stats.totalTitles} Titles</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E5DFD7] shadow-sm space-y-1">
          <span className="text-xs font-medium text-[#6E6862]">Active Books on Loan</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-blue-700">{stats.totalIssued}</span>
            <span className="text-xs text-emerald-600 font-semibold">
              {stats.totalVolumes - stats.totalIssued} In Stacks
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E5DFD7] shadow-sm space-y-1">
          <span className="text-xs font-medium text-[#6E6862]">Overdue Return Notices</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-rose-600">{stats.overdueCount}</span>
            <span className="text-[10px] text-rose-800 font-bold bg-rose-100 px-1.5 py-0.5 rounded">
              ₹5/Day Fine Active
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E5DFD7] shadow-sm space-y-1">
          <span className="text-xs font-medium text-[#6E6862]">Daily Reading Room Footfall</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-[#682038]">412</span>
            <span className="text-xs text-[#6E6862]">Peak: 2:00 - 4:00 PM</span>
          </div>
        </div>
      </div>

      {/* SUB-TAB 1: OPAC SEARCH & CATALOG */}
      {subTab === 'opac' && (
        <div className="space-y-4">
          {/* Search Controls */}
          <div className="bg-white rounded-2xl border border-[#E5DFD7] p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-[#8B5E3C]" />
              <h3 className="text-xs font-bold text-[#242424] uppercase tracking-wider">
                OPAC Online Catalog Search
              </h3>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#6E6862]" />
                <input
                  type="text"
                  placeholder="Search title, author, ISBN, or DDC..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-lg text-xs border border-[#E5DFD7] bg-white focus:outline-none focus:ring-1 focus:ring-[#682038] w-64"
                />
              </div>

              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="py-1.5 px-3 rounded-lg text-xs border border-[#E5DFD7] bg-white text-[#242424] focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Disciplines</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Electronics & Comm">Electronics &amp; Comm</option>
                <option value="Mechanical Engg">Mechanical Engg</option>
              </select>
            </div>
          </div>

          {/* Book Catalog Table */}
          <div className="bg-white rounded-2xl border border-[#E5DFD7] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF7F2] text-[#6E6862] border-b border-[#E5DFD7]">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Accession / DDC</th>
                    <th className="py-3 px-4 font-semibold">Title &amp; Author</th>
                    <th className="py-3 px-4 font-semibold">Publisher &amp; Edition</th>
                    <th className="py-3 px-4 font-semibold">Physical Location</th>
                    <th className="py-3 px-4 font-semibold text-center">Availability</th>
                    <th className="py-3 px-4 font-semibold text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5DFD7]">
                  {books
                    .filter((b) => {
                      const matchSearch =
                        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        b.accessionNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        b.ddcCode.includes(searchQuery);
                      const matchDept = selectedDept === 'ALL' || b.department === selectedDept;
                      return matchSearch && matchDept;
                    })
                    .map((bk) => (
                      <tr key={bk.id} className="hover:bg-[#FAF7F2]/40 transition-colors">
                        <td className="py-3.5 px-4 font-mono">
                          <span className="font-bold text-[#682038] block">{bk.accessionNo}</span>
                          <span className="text-[10px] text-[#8B5E3C]">DDC: {bk.ddcCode}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-[#242424] text-sm">{bk.title}</div>
                          <div className="text-[11px] text-[#6E6862]">By: {bk.author}</div>
                          <div className="text-[10px] text-[#A39B8F] font-mono">ISBN: {bk.isbn}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="text-[#242424] font-medium">{bk.publisher}</div>
                          <div className="text-[11px] text-[#6E6862]">{bk.edition}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-1 rounded-lg bg-[#FAF7F2] text-[#8B5E3C] border border-[#E5DFD7] font-semibold text-[11px] inline-block">
                            📍 {bk.rackLocation}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                              bk.availableCopies > 0
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : 'bg-rose-100 text-rose-800 border border-rose-200'
                            }`}
                          >
                            {bk.availableCopies} of {bk.totalCopies} Available
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={() => alert(`Hold placed for: ${bk.title} at ${bk.rackLocation}`)}
                            disabled={bk.availableCopies === 0}
                            className="px-3 py-1.5 rounded-xl bg-[#682038] hover:bg-[#54192D] text-white text-xs font-bold disabled:opacity-40 shadow-2xs cursor-pointer"
                          >
                            Reserve / Hold
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: CIRCULATION DESK */}
      {subTab === 'circulation' && (
        <div className="bg-white rounded-2xl border border-[#E5DFD7] shadow-sm overflow-hidden">
          <div className="p-4 border-b border-[#E5DFD7] bg-[#FAF7F2]/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RotateCw className="w-4 h-4 text-[#8B5E3C]" />
              <h3 className="text-xs font-bold text-[#242424] uppercase tracking-wider">
                Active Circulation Roster &amp; Overdue Ledger
              </h3>
            </div>
            <span className="text-xs text-[#6E6862]">Statutory Late Fee: ₹5.00 / Overdue Day</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF7F2] text-[#6E6862] border-b border-[#E5DFD7]">
                <tr>
                  <th className="py-3 px-4 font-semibold">Book Particulars</th>
                  <th className="py-3 px-4 font-semibold">Borrower (Student / Faculty)</th>
                  <th className="py-3 px-4 font-semibold">Issued Date</th>
                  <th className="py-3 px-4 font-semibold">Due Date</th>
                  <th className="py-3 px-4 font-semibold">Accrued Fine</th>
                  <th className="py-3 px-4 font-semibold">Loan Status</th>
                  <th className="py-3 px-4 font-semibold text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5DFD7]">
                {circulation.map((c) => (
                  <tr key={c.id} className="hover:bg-[#FAF7F2]/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#242424]">{c.bookTitle}</div>
                      <div className="text-[10px] font-mono text-[#682038]">{c.accessionNo}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#242424]">{c.borrowerName}</div>
                      <div className="text-[10px] font-mono text-[#6E6862]">
                        {c.borrowerId} ({c.borrowerType})
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-[#6E6862]">{c.borrowDate}</td>
                    <td className="py-3.5 px-4 font-semibold text-[#242424]">{c.dueDate}</td>
                    <td className="py-3.5 px-4 font-mono font-bold">
                      {c.fineAccrued > 0 ? (
                        <span className="text-rose-600">₹{c.fineAccrued} (Overdue)</span>
                      ) : (
                        <span className="text-emerald-600">₹0 (Clear)</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          c.status === 'OVERDUE'
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : c.status === 'ISSUED'
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : 'bg-neutral-100 text-neutral-700'
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {c.status !== 'RETURNED' ? (
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => handleRenewBook(c.id)}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold text-[#682038] bg-[#FAF7F2] hover:bg-[#F4ECE2] border border-[#E5DFD7] cursor-pointer"
                            title="Renew for 14 days"
                          >
                            Renew
                          </button>
                          <button
                            onClick={() => handleReturnBook(c.id, c.accessionNo)}
                            className="px-3 py-1 rounded-lg text-xs font-bold bg-[#682038] hover:bg-[#54192D] text-white cursor-pointer shadow-2xs"
                          >
                            Return Book
                          </button>
                        </div>
                      ) : (
                        <span className="text-emerald-700 font-bold inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Cleared</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: DIGITAL REPOSITORY & IEEE SUBSCRIPTIONS */}
      {subTab === 'digital' && (
        <div className="space-y-4">
          <div className="bg-[#FAF7F2] border border-[#E5DFD7] rounded-2xl p-5 flex items-start gap-3">
            <ExternalLink className="w-5 h-5 text-[#8B5E3C] shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs text-[#242424]">
              <h3 className="font-bold text-sm">Institutional Consortium &amp; Digital Journal Access:</h3>
              <p className="text-[#6E6862]">
                Subscribed academic publishers authenticate campus users via IP-range recognition and Shibboleth/SAML Single Sign-On (SSO). Research scholars and students can download IEEE, Elsevier, and ACM full papers directly.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DIGITAL_RESOURCES.map((res) => (
              <div
                key={res.id}
                className="bg-white rounded-2xl border border-[#E5DFD7] p-5 shadow-sm space-y-3 hover:border-[#682038]/50 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-base text-[#242424]">{res.name}</h4>
                    <span className="text-xs text-[#6E6862]">{res.provider}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    SSO Active
                  </span>
                </div>

                <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E5DFD7] flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-[#6E6862] block">Indexing Breadth:</span>
                    <span className="font-mono font-bold text-[#682038]">{res.indexedCount}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white text-[#242424] border border-[#E5DFD7]">
                    {res.category}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#E5DFD7]">
                  <span className="text-[11px] text-[#6E6862]">Campus IP Authenticated</span>
                  <a
                    href={res.accessUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 rounded-xl bg-[#682038] hover:bg-[#54192D] text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-2xs"
                  >
                    <span>Launch Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 4: FOOTFALL & READING ROOM */}
      {subTab === 'footfall' && (
        <div className="space-y-4">
          <div className="bg-[#FAF7F2] border border-[#E5DFD7] rounded-2xl p-5 flex items-start gap-3">
            <BarChart3 className="w-5 h-5 text-[#8B5E3C] shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs text-[#242424]">
              <h3 className="font-bold text-sm">Turnstile Entry Telemetry &amp; Capacity Utilization:</h3>
              <p className="text-[#6E6862]">
                Real-time RFID turnstiles track hourly student footfall in the Central Reading Hall. Data satisfies NAAC Metric 4.2.4 (Per-day usage of library by teachers and students).
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-white p-5 rounded-2xl border border-[#E5DFD7] shadow-sm space-y-2">
              <span className="text-[#6E6862] font-semibold block">Ground Floor (Reference Stacks):</span>
              <div className="text-2xl font-bold font-mono text-[#242424]">142 / 200 Seats</div>
              <div className="w-full h-2 rounded-full bg-neutral-100 overflow-hidden">
                <div className="h-full bg-[#682038] w-[71%]" />
              </div>
              <span className="text-[11px] text-emerald-700 font-semibold block">71% Occupancy (Normal)</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E5DFD7] shadow-sm space-y-2">
              <span className="text-[#6E6862] font-semibold block">First Floor (Quiet Study Room):</span>
              <div className="text-2xl font-bold font-mono text-[#242424]">188 / 200 Seats</div>
              <div className="w-full h-2 rounded-full bg-neutral-100 overflow-hidden">
                <div className="h-full bg-amber-500 w-[94%]" />
              </div>
              <span className="text-[11px] text-amber-800 font-semibold block">94% Occupancy (Near Full)</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E5DFD7] shadow-sm space-y-2">
              <span className="text-[#6E6862] font-semibold block">Digital Media Center (Computers):</span>
              <div className="text-2xl font-bold font-mono text-[#242424]">82 / 100 Terminals</div>
              <div className="w-full h-2 rounded-full bg-neutral-100 overflow-hidden">
                <div className="h-full bg-blue-600 w-[82%]" />
              </div>
              <span className="text-[11px] text-blue-800 font-semibold block">82% Terminals Active</span>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CATALOG NEW TITLE */}
      {isNewBookModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#E5DFD7] space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5DFD7]">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#682038]" />
                <h3 className="font-bold text-base text-[#242424]">Catalog New Acquisition Title</h3>
              </div>
              <button onClick={() => setIsNewBookModalOpen(false)} className="p-1 text-[#6E6862] hover:bg-[#F4ECE2] rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCatalogBook} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-[#242424]">Book Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Operating System Concepts"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E5DFD7] focus:ring-1 focus:ring-[#682038]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-[#242424]">Author(s) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Silberschatz, Galvin"
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5DFD7]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-[#242424]">ISBN Number</label>
                  <input
                    type="text"
                    placeholder="978-1118063330"
                    value={newIsbn}
                    onChange={(e) => setNewIsbn(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5DFD7] font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-[#242424]">Dewey Code (DDC)</label>
                  <input
                    type="text"
                    value={newDdc}
                    onChange={(e) => setNewDdc(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5DFD7] font-mono font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-[#242424]">Department</label>
                  <select
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5DFD7]"
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Electronics & Comm">Electronics &amp; Comm</option>
                    <option value="Mechanical Engg">Mechanical Engg</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-[#242424]">Total Copies</label>
                  <input
                    type="number"
                    min="1"
                    value={newCopies}
                    onChange={(e) => setNewCopies(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5DFD7] font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#242424]">Physical Rack Location</label>
                <input
                  type="text"
                  value={newRack}
                  onChange={(e) => setNewRack(e.target.value)}
                  placeholder="e.g. Rack CS-05, Shelf 1"
                  className="w-full px-3 py-2 rounded-xl border border-[#E5DFD7]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E5DFD7]">
                <button
                  type="button"
                  onClick={() => setIsNewBookModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-[#6E6862] hover:bg-[#FAF7F2] border border-[#E5DFD7]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#682038] hover:bg-[#54192D] text-white font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Check className="w-4 h-4" />
                  <span>Catalog &amp; Add Accession Tag</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
