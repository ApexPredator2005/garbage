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
  FileText,
  DollarSign,
  MapPin,
  Maximize2,
  Copy,
  Sparkles,
  CreditCard,
  Printer,
  BookMarked,
  Eye,
  Compass,
  ScanLine,
} from 'lucide-react';

export interface BookItem {
  id: string;
  accessionNo: string;
  title: string;
  author: string;
  isbn: string;
  publisher: string;
  edition: string;
  ddcCode: string; // Dewey Decimal Classification
  department: string;
  rackLocation: string; // e.g. "Rack CS-01, Shelf 3"
  stackWing: 'WING_A' | 'WING_B' | 'WING_C' | 'REFERENCE';
  totalCopies: number;
  availableCopies: number;
  format: 'HARDCOVER' | 'PAPERBACK' | 'E_BOOK' | 'JOURNAL';
  hasDigitalPdf?: boolean;
  eBookExcerpt?: string;
  pages?: number;
}

export interface CirculationRecord {
  id: string;
  accessionNo: string;
  bookTitle: string;
  borrowerName: string;
  borrowerType: 'STUDENT' | 'FACULTY';
  borrowerId: string; // Roll number or employee code
  borrowDate: string;
  dueDate: string;
  renewCount: number;
  fineAccrued: number; // in ₹ (₹5/day overdue)
  status: 'ISSUED' | 'OVERDUE' | 'RETURNED';
  rfidTag?: string;
}

export interface BookHold {
  id: string;
  accessionNo: string;
  bookTitle: string;
  borrowerName: string;
  borrowerId: string;
  borrowerType: 'STUDENT' | 'FACULTY';
  placedDate: string;
  queuePosition: number;
  holdExpiresAt?: string;
  status: 'WAITING_FOR_RETURN' | 'READY_ON_HOLD_SHELF' | 'PICKED_UP' | 'CANCELLED';
}

export interface FineRecord {
  id: string;
  receiptNo?: string;
  borrowerName: string;
  borrowerId: string;
  borrowerType: 'STUDENT' | 'FACULTY';
  bookTitle: string;
  accessionNo: string;
  overdueDays: number;
  amount: number;
  status: 'PENDING' | 'COLLECTED' | 'WAIVED_BY_DEAN';
  paidDate?: string;
  paymentMode?: 'UPI' | 'CASH' | 'BURSAR_PORTAL';
  waivedBy?: string;
  waiverReason?: string;
}

export interface DigitalResource {
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
    stackWing: 'WING_A',
    totalCopies: 12,
    availableCopies: 0, // 0 copies to demonstrate hold queue
    format: 'HARDCOVER',
    hasDigitalPdf: true,
    pages: 1312,
    eBookExcerpt:
      'Chapter 1: The Role of Algorithms in Computing. An algorithm is any well-defined computational procedure that takes some value, or set of values, as input and produces some value, or set of values, as output. An algorithm is thus a sequence of computational steps that transform the input into the output. Algorithms are at the heart of computing technology.',
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
    stackWing: 'WING_A',
    totalCopies: 8,
    availableCopies: 2,
    format: 'PAPERBACK',
    hasDigitalPdf: true,
    pages: 616,
    eBookExcerpt:
      'Part I: Foundations of Data Systems. Chapter 1: Reliable, Scalable, and Maintainable Applications. Today, many applications are data-intensive, as opposed to compute-intensive. Raw CPU power is rarely a limiting factor for these applications; bigger problems are usually the amount of data, the complexity of data, and the speed at which it is changing.',
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
    stackWing: 'WING_B',
    totalCopies: 10,
    availableCopies: 5,
    format: 'HARDCOVER',
    hasDigitalPdf: false,
    pages: 1088,
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
    stackWing: 'WING_B',
    totalCopies: 6,
    availableCopies: 3,
    format: 'PAPERBACK',
    hasDigitalPdf: true,
    pages: 1024,
    eBookExcerpt:
      'Chapter 1: Introduction and Basic Concepts. Fluid mechanics is defined as the science that deals with the behavior of fluids at rest (fluid statics) or in motion (fluid dynamics), and the interaction of fluids with solids or other fluids at the boundaries.',
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
    stackWing: 'WING_A',
    totalCopies: 5,
    availableCopies: 1,
    format: 'HARDCOVER',
    hasDigitalPdf: true,
    pages: 800,
    eBookExcerpt:
      'Chapter 6: Deep Feedforward Networks. Deep feedforward networks, also called feedforward neural networks, or multilayer perceptrons (MLPs), are the quintessential deep learning models. The goal of a feedforward network is to approximate some function f*.',
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
    fineAccrued: 15, // 3 days overdue @ ₹5/day
    status: 'OVERDUE',
    rfidTag: 'RFID-9812-CLRS',
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
    rfidTag: 'RFID-4411-DDIA',
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
    rfidTag: 'RFID-7712-DSP',
  },
];

const INITIAL_HOLDS: BookHold[] = [
  {
    id: 'hold-1',
    accessionNo: 'ACC-CSE-2024-001',
    bookTitle: 'Introduction to Algorithms (CLRS)',
    borrowerName: 'Vikram Seth',
    borrowerId: '26CS14',
    borrowerType: 'STUDENT',
    placedDate: '2026-10-25',
    queuePosition: 1,
    status: 'READY_ON_HOLD_SHELF',
    holdExpiresAt: '2026-10-31 17:00',
  },
  {
    id: 'hold-2',
    accessionNo: 'ACC-CSE-2024-001',
    bookTitle: 'Introduction to Algorithms (CLRS)',
    borrowerName: 'Sneha Roy',
    borrowerId: '26CS22',
    borrowerType: 'STUDENT',
    placedDate: '2026-10-27',
    queuePosition: 2,
    status: 'WAITING_FOR_RETURN',
  },
];

const INITIAL_FINES: FineRecord[] = [
  {
    id: 'fine-1',
    borrowerName: 'Aarav Sharma',
    borrowerId: '26CS01',
    borrowerType: 'STUDENT',
    bookTitle: 'Introduction to Algorithms (CLRS)',
    accessionNo: 'ACC-CSE-2024-001',
    overdueDays: 3,
    amount: 15,
    status: 'PENDING',
  },
  {
    id: 'fine-2',
    receiptNo: 'LIB-REC-2026-089',
    borrowerName: 'Karthik Raja',
    borrowerId: '26EC09',
    borrowerType: 'STUDENT',
    bookTitle: 'Microelectronic Circuits (Sedra & Smith)',
    accessionNo: 'ACC-ECE-2023-014',
    overdueDays: 4,
    amount: 20,
    status: 'COLLECTED',
    paidDate: '2026-10-28',
    paymentMode: 'UPI',
  },
  {
    id: 'fine-3',
    receiptNo: 'LIB-WVR-2026-012',
    borrowerName: 'Ananya Deshmukh',
    borrowerId: '26ME03',
    borrowerType: 'STUDENT',
    bookTitle: 'Thermodynamics: An Engineering Approach',
    accessionNo: 'ACC-MEC-2022-005',
    overdueDays: 8,
    amount: 40,
    status: 'WAIVED_BY_DEAN',
    paidDate: '2026-10-27',
    waivedBy: 'Dr. K. S. Sharma (Principal / Dean)',
    waiverReason: 'Approved institutional medical leave (Hospitalization Certificate submitted).',
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
  const [subTab, setSubTab] = useState<'opac' | 'circulation' | 'holds' | 'fines' | 'digital' | 'footfall'>('opac');
  const [books, setBooks] = useState<BookItem[]>(INITIAL_BOOKS);
  const [circulation, setCirculation] = useState<CirculationRecord[]>(INITIAL_CIRCULATION);
  const [holds, setHolds] = useState<BookHold[]>(INITIAL_HOLDS);
  const [fines, setFines] = useState<FineRecord[]>(INITIAL_FINES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');

  // Modals
  const [isNewBookModalOpen, setIsNewBookModalOpen] = useState(false);
  const [isScannerModalOpen, setIsScannerModalOpen] = useState(false);
  const [activeBookForMap, setActiveBookForMap] = useState<BookItem | null>(null);
  const [activeBookForReader, setActiveBookForReader] = useState<BookItem | null>(null);
  const [activeFineForPay, setActiveFineForPay] = useState<FineRecord | null>(null);
  const [activeFineForWaiver, setActiveFineForWaiver] = useState<FineRecord | null>(null);
  const [waiverReasonInput, setWaiverReasonInput] = useState('');

  // New Book State
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newIsbn, setNewIsbn] = useState('');
  const [newPublisher, setNewPublisher] = useState('');
  const [newDdc, setNewDdc] = useState('005.1');
  const [newDept, setNewDept] = useState('Computer Science');
  const [newRack, setNewRack] = useState('Rack CS-05, Shelf 1');
  const [newWing, setNewWing] = useState<'WING_A' | 'WING_B' | 'WING_C' | 'REFERENCE'>('WING_A');
  const [newCopies, setNewCopies] = useState<number>(5);

  // Scanner Simulator State
  const [scannedAccession, setScannedAccession] = useState('ACC-CSE-2023-088');
  const [scannedBorrowerId, setScannedBorrowerId] = useState('26CS03');
  const [scannerFeedback, setScannerFeedback] = useState<string | null>(null);

  // Return Book Action
  const handleReturnBook = (recordId: string, accessionNo: string) => {
    setCirculation((prev) =>
      prev.map((c) => (c.id === recordId ? { ...c, status: 'RETURNED' } : c))
    );
    setBooks((prev) =>
      prev.map((b) => (b.accessionNo === accessionNo ? { ...b, availableCopies: b.availableCopies + 1 } : b))
    );
    // Check if there is an active hold for this book
    setHolds((prev) =>
      prev.map((h) => {
        if (h.accessionNo === accessionNo && h.status === 'WAITING_FOR_RETURN') {
          return {
            ...h,
            status: 'READY_ON_HOLD_SHELF',
            holdExpiresAt: new Date(Date.now() + 48 * 3600 * 1000).toISOString().replace('T', ' ').slice(0, 16),
          };
        }
        return h;
      })
    );
    alert('Book returned successfully. RFID inventory incremented and next hold notified!');
  };

  // Renew Book Action
  const handleRenewBook = (recordId: string) => {
    setCirculation((prev) =>
      prev.map((c) => {
        if (c.id !== recordId) return c;
        const currentDue = new Date(c.dueDate);
        currentDue.setDate(currentDue.getDate() + 14);
        return {
          ...c,
          dueDate: currentDue.toISOString().split('T')[0],
          renewCount: c.renewCount + 1,
          status: 'ISSUED',
        };
      })
    );
    alert('Book loan period renewed for 14 additional calendar days.');
  };

  // Quick RFID Checkout Execution
  const handleRfidCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    const targetBook = books.find((b) => b.accessionNo === scannedAccession);
    if (!targetBook) {
      setScannerFeedback('Error: Accession number not recognized in OPAC repository.');
      return;
    }
    if (targetBook.availableCopies <= 0) {
      setScannerFeedback(`Cannot issue: Zero available copies of "${targetBook.title}". Place a hold instead.`);
      return;
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);

    const newRecord: CirculationRecord = {
      id: `cir-${Date.now().toString(36)}`,
      accessionNo: targetBook.accessionNo,
      bookTitle: targetBook.title,
      borrowerName: scannedBorrowerId.startsWith('EMP') ? 'Faculty Member' : 'Student Scholar',
      borrowerType: scannedBorrowerId.startsWith('EMP') ? 'FACULTY' : 'STUDENT',
      borrowerId: scannedBorrowerId,
      borrowDate: new Date().toISOString().split('T')[0],
      dueDate: dueDate.toISOString().split('T')[0],
      renewCount: 0,
      fineAccrued: 0,
      status: 'ISSUED',
      rfidTag: `RFID-${Math.floor(1000 + Math.random() * 9000)}-${targetBook.accessionNo.slice(-4)}`,
    };

    setCirculation([newRecord, ...circulation]);
    setBooks(books.map((b) => (b.id === targetBook.id ? { ...b, availableCopies: b.availableCopies - 1 } : b)));
    setScannerFeedback(`Success! "${targetBook.title}" checked out to ${scannedBorrowerId}. Due on ${dueDate.toISOString().split('T')[0]}.`);
    setTimeout(() => {
      setIsScannerModalOpen(false);
      setScannerFeedback(null);
    }, 1800);
  };

  // Place Reservation Hold
  const handlePlaceHold = (book: BookItem) => {
    const studentId = prompt('Enter Student Roll Number or Faculty Employee ID to place hold:', '26CS33');
    if (!studentId) return;

    const newHold: BookHold = {
      id: `hold-${Date.now().toString(36)}`,
      accessionNo: book.accessionNo,
      bookTitle: book.title,
      borrowerName: studentId.startsWith('EMP') ? 'Prof. Faculty User' : 'Student Candidate',
      borrowerId: studentId,
      borrowerType: studentId.startsWith('EMP') ? 'FACULTY' : 'STUDENT',
      placedDate: new Date().toISOString().split('T')[0],
      queuePosition: holds.filter((h) => h.accessionNo === book.accessionNo && h.status === 'WAITING_FOR_RETURN').length + 1,
      status: 'WAITING_FOR_RETURN',
    };

    setHolds([...holds, newHold]);
    alert(`Hold request recorded for "${book.title}". Queue position #${newHold.queuePosition}. Student will be notified when copy is returned.`);
  };

  // Collect Fine Action
  const handleCollectFine = (mode: 'UPI' | 'CASH' | 'BURSAR_PORTAL') => {
    if (!activeFineForPay) return;
    const receipt = `LIB-REC-2026-${Math.floor(100 + Math.random() * 900)}`;
    setFines((prev) =>
      prev.map((f) =>
        f.id === activeFineForPay.id
          ? {
              ...f,
              status: 'COLLECTED',
              receiptNo: receipt,
              paidDate: new Date().toISOString().split('T')[0],
              paymentMode: mode,
            }
          : f
      )
    );
    // Clear circulation fine
    setCirculation((prev) =>
      prev.map((c) =>
        c.accessionNo === activeFineForPay.accessionNo && c.borrowerId === activeFineForPay.borrowerId
          ? { ...c, fineAccrued: 0 }
          : c
      )
    );
    alert(`Fine ₹${activeFineForPay.amount} settled via ${mode}. Official Receipt ${receipt} generated.`);
    setActiveFineForPay(null);
  };

  // Apply Dean's Waiver
  const handleApplyWaiver = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeFineForWaiver) return;
    const wvr = `LIB-WVR-2026-${Math.floor(100 + Math.random() * 900)}`;
    setFines((prev) =>
      prev.map((f) =>
        f.id === activeFineForWaiver.id
          ? {
              ...f,
              status: 'WAIVED_BY_DEAN',
              receiptNo: wvr,
              paidDate: new Date().toISOString().split('T')[0],
              waivedBy: 'Dr. K. S. Sharma (Principal / Dean)',
              waiverReason: waiverReasonInput || 'Statutory dean waiver for institutional duty.',
            }
          : f
      )
    );
    setCirculation((prev) =>
      prev.map((c) =>
        c.accessionNo === activeFineForWaiver.accessionNo && c.borrowerId === activeFineForWaiver.borrowerId
          ? { ...c, fineAccrued: 0 }
          : c
      )
    );
    alert(`Dean waiver recorded. Receipt ${wvr}. Balance cleared.`);
    setActiveFineForWaiver(null);
    setWaiverReasonInput('');
  };

  // Fast ISBN Preset Lookup
  const handleQuickIsbnFill = (type: 'CLEAN_CODE' | 'OS_CONCEPTS' | 'NETWORKS') => {
    if (type === 'CLEAN_CODE') {
      setNewTitle('Clean Code: A Handbook of Agile Software Craftsmanship');
      setNewAuthor('Robert C. Martin (Uncle Bob)');
      setNewIsbn('978-0132350884');
      setNewPublisher('Prentice Hall');
      setNewDdc('005.1');
      setNewDept('Computer Science');
      setNewRack('Rack CS-03, Shelf 2');
      setNewWing('WING_A');
    } else if (type === 'OS_CONCEPTS') {
      setNewTitle('Operating System Concepts (Silberschatz Dinosaur Book)');
      setNewAuthor('Abraham Silberschatz, Peter B. Galvin, Greg Gagne');
      setNewIsbn('978-1119800361');
      setNewPublisher('John Wiley & Sons');
      setNewDdc('005.43');
      setNewDept('Computer Science');
      setNewRack('Rack CS-02, Shelf 4');
      setNewWing('WING_A');
    } else {
      setNewTitle('Computer Networks: A Systems Approach');
      setNewAuthor('Larry L. Peterson, Bruce S. Davie');
      setNewIsbn('978-0123850591');
      setNewPublisher('Morgan Kaufmann');
      setNewDdc('004.6');
      setNewDept('Electronics & Comm');
      setNewRack('Rack EC-01, Shelf 3');
      setNewWing('WING_B');
    }
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
      stackWing: newWing,
      totalCopies: Number(newCopies),
      availableCopies: Number(newCopies),
      format: 'HARDCOVER',
      hasDigitalPdf: true,
      pages: 450,
      eBookExcerpt: `Sample excerpt for ${newTitle}. Standard institutional syllabus and reference materials available for student digital check-out.`,
    };

    setBooks([created, ...books]);
    setIsNewBookModalOpen(false);
    setNewTitle('');
    setNewAuthor('');
    setNewIsbn('');
  };

  // Filtered books
  const filteredBooks = useMemo(() => {
    return books.filter((b) => {
      const matchSearch =
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.accessionNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.ddcCode.includes(searchQuery);
      const matchDept = selectedDept === 'ALL' || b.department === selectedDept;
      return matchSearch && matchDept;
    });
  }, [books, searchQuery, selectedDept]);

  // Aggregate Stats
  const stats = useMemo(() => {
    const totalTitles = books.length;
    const totalVolumes = books.reduce((acc, b) => acc + b.totalCopies, 0);
    const totalIssued = circulation.filter((c) => c.status !== 'RETURNED').length;
    const overdueCount = circulation.filter((c) => c.status === 'OVERDUE').length;
    const pendingFines = fines.filter((f) => f.status === 'PENDING').reduce((acc, f) => acc + f.amount, 0);
    const activeHolds = holds.filter((h) => h.status === 'WAITING_FOR_RETURN' || h.status === 'READY_ON_HOLD_SHELF').length;
    return { totalTitles, totalVolumes, totalIssued, overdueCount, pendingFines, activeHolds };
  }, [books, circulation, fines, holds]);

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
              Koha &amp; MARC-21 Integrated
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-200">
              RFID Automated Turnstiles
            </span>
          </div>
          <h1 className="text-xl font-bold text-[#242424]">Library Management System &amp; OPAC Catalog</h1>
          <p className="text-xs text-[#6E6862]">
            Dewey Decimal classification repository, RFID circulation desk, fine recovery ledger, hold queues, and IEEE/ScienceDirect digital repository.
          </p>
        </div>

        {/* Global Action Desk */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setIsScannerModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FAF7F2] hover:bg-[#F4ECE2] text-[#682038] border border-[#E5DFD7] text-xs font-bold shadow-2xs transition-all cursor-pointer"
          >
            <ScanLine className="w-3.5 h-3.5 text-[#8B5E3C]" />
            <span>Fast RFID Scanner</span>
          </button>
          <button
            type="button"
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
          type="button"
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
          type="button"
          onClick={() => setSubTab('circulation')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            subTab === 'circulation'
              ? 'bg-[#682038] text-white shadow-sm'
              : 'text-[#6E6862] hover:bg-white hover:text-[#242424]'
          }`}
        >
          <RotateCw className="w-4 h-4 text-[#FB923C]" />
          <span>Circulation Desk ({stats.totalIssued} Active Loans)</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('holds')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            subTab === 'holds'
              ? 'bg-[#682038] text-white shadow-sm'
              : 'text-[#6E6862] hover:bg-white hover:text-[#242424]'
          }`}
        >
          <Bookmark className="w-4 h-4 text-[#FB923C]" />
          <span>Holds &amp; Reservations ({stats.activeHolds})</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('fines')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            subTab === 'fines'
              ? 'bg-[#682038] text-white shadow-sm'
              : 'text-[#6E6862] hover:bg-white hover:text-[#242424]'
          }`}
        >
          <DollarSign className="w-4 h-4 text-[#FB923C]" />
          <span>Fines &amp; Dean's Waivers (₹{stats.pendingFines} Due)</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('digital')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            subTab === 'digital'
              ? 'bg-[#682038] text-white shadow-sm'
              : 'text-[#6E6862] hover:bg-white hover:text-[#242424]'
          }`}
        >
          <ExternalLink className="w-4 h-4 text-[#FB923C]" />
          <span>Digital Library &amp; E-Reader</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('footfall')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            subTab === 'footfall'
              ? 'bg-[#682038] text-white shadow-sm'
              : 'text-[#6E6862] hover:bg-white hover:text-[#242424]'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-[#FB923C]" />
          <span>Turnstile Telemetry &amp; Footfall</span>
        </button>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <div className="bg-white rounded-xl border border-[#E5DFD7] p-3.5">
          <div className="text-[11px] font-semibold text-[#6E6862]">Cataloged Titles</div>
          <div className="text-xl font-bold text-[#682038]">{stats.totalTitles}</div>
          <div className="text-[10px] text-[#8B5E3C]">Unique Dewey entries</div>
        </div>
        <div className="bg-white rounded-xl border border-[#E5DFD7] p-3.5">
          <div className="text-[11px] font-semibold text-[#6E6862]">Total Physical Copies</div>
          <div className="text-xl font-bold text-[#242424]">{stats.totalVolumes}</div>
          <div className="text-[10px] text-emerald-700">Available: {books.reduce((a, b) => a + b.availableCopies, 0)}</div>
        </div>
        <div className="bg-white rounded-xl border border-[#E5DFD7] p-3.5">
          <div className="text-[11px] font-semibold text-[#6E6862]">Active Circulation</div>
          <div className="text-xl font-bold text-amber-700">{stats.totalIssued}</div>
          <div className="text-[10px] text-[#6E6862]">Currently on loan</div>
        </div>
        <div className="bg-white rounded-xl border border-[#E5DFD7] p-3.5">
          <div className="text-[11px] font-semibold text-[#6E6862]">Overdue Books</div>
          <div className="text-xl font-bold text-rose-700">{stats.overdueCount}</div>
          <div className="text-[10px] text-rose-600">₹5/day penalty active</div>
        </div>
        <div className="bg-white rounded-xl border border-[#E5DFD7] p-3.5">
          <div className="text-[11px] font-semibold text-[#6E6862]">Hold Waitlist</div>
          <div className="text-xl font-bold text-blue-700">{stats.activeHolds}</div>
          <div className="text-[10px] text-blue-600">Pending patron pickup</div>
        </div>
        <div className="bg-white rounded-xl border border-[#E5DFD7] p-3.5">
          <div className="text-[11px] font-semibold text-[#6E6862]">Outstanding Fines</div>
          <div className="text-xl font-bold text-[#682038]">₹{stats.pendingFines}</div>
          <div className="text-[10px] text-emerald-700">₹{fines.filter((f) => f.status === 'COLLECTED').reduce((a, b) => a + b.amount, 0)} collected</div>
        </div>
      </div>

      {/* TAB 1: OPAC SEARCH & CATALOG */}
      {subTab === 'opac' && (
        <div className="space-y-4">
          {/* Search & Department Filters */}
          <div className="bg-white rounded-2xl border border-[#E5DFD7] p-4 flex flex-col md:flex-row gap-3 items-center justify-between shadow-2xs">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-[#8B5E3C] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Title, Author, DDC Code (e.g. 005.1), or Accession Number..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#FAF7F2] border border-[#E5DFD7] text-xs text-[#242424] focus:outline-none focus:border-[#682038]"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <Filter className="w-3.5 h-3.5 text-[#8B5E3C]" />
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#E5DFD7] text-xs font-semibold text-[#242424] focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Departments</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Electronics & Comm">Electronics &amp; Comm</option>
                <option value="Mechanical Engg">Mechanical Engg</option>
              </select>
            </div>
          </div>

          {/* Book Catalog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBooks.map((book) => (
              <div
                key={book.id}
                className="bg-white rounded-2xl border border-[#E5DFD7] p-5 shadow-xs flex flex-col justify-between hover:border-[#682038]/50 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-[#FAF7F2] text-[#8B5E3C] border border-[#E5DFD7]">
                      {book.accessionNo}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        book.availableCopies > 0
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {book.availableCopies > 0
                        ? `${book.availableCopies}/${book.totalCopies} Available`
                        : 'Checked Out (Hold Available)'}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-[#242424] leading-snug line-clamp-2">
                      {book.title}
                    </h3>
                    <p className="text-xs text-[#6E6862] line-clamp-1 mt-0.5">by {book.author}</p>
                  </div>

                  <div className="bg-[#FAF7F2] rounded-xl p-2.5 text-[11px] space-y-1 border border-[#EFE9E1]">
                    <div className="flex justify-between">
                      <span className="text-[#6E6862]">DDC Classification:</span>
                      <span className="font-mono font-bold text-[#682038]">{book.ddcCode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6E6862]">Physical Location:</span>
                      <span className="font-semibold text-[#242424]">{book.rackLocation}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6E6862]">ISBN:</span>
                      <span className="font-mono text-[#6E6862]">{book.isbn}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#EFE9E1] flex items-center justify-between gap-2 mt-4">
                  <div className="flex items-center gap-1.5">
                    {/* Locate on Shelf 2D Map Button */}
                    <button
                      type="button"
                      onClick={() => setActiveBookForMap(book)}
                      className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg bg-[#FAF7F2] hover:bg-[#F4ECE2] text-[11px] font-semibold text-[#8B5E3C] border border-[#E5DFD7] transition-colors"
                      title="View 2D Shelf & Stack Blueprint"
                    >
                      <MapPin className="w-3 h-3 text-[#682038]" />
                      <span>Locate</span>
                    </button>

                    {/* In-Browser Digital E-Reader */}
                    {book.hasDigitalPdf && (
                      <button
                        type="button"
                        onClick={() => setActiveBookForReader(book)}
                        className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-[11px] font-semibold text-blue-800 border border-blue-200 transition-colors"
                        title="Read Institutional Digital Copy"
                      >
                        <Eye className="w-3 h-3 text-blue-700" />
                        <span>E-Reader</span>
                      </button>
                    )}
                  </div>

                  <div>
                    {book.availableCopies > 0 ? (
                      <button
                        type="button"
                        onClick={() => {
                          setScannedAccession(book.accessionNo);
                          setIsScannerModalOpen(true);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#682038] hover:bg-[#54192D] text-white text-xs font-bold transition-all shadow-2xs"
                      >
                        Issue Book
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handlePlaceHold(book)}
                        className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-2xs"
                      >
                        Place Hold
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: CIRCULATION DESK */}
      {subTab === 'circulation' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-[#E5DFD7] overflow-hidden shadow-xs">
            <div className="px-6 py-4 border-b border-[#E5DFD7] flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-[#242424]">Active Circulation Ledger &amp; RFID Loans</h3>
                <p className="text-xs text-[#6E6862]">Automatic ₹5/day overdue penalty calculated at midnight turnstile batch.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsScannerModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#682038] text-white text-xs font-bold"
              >
                <ScanLine className="w-3.5 h-3.5" />
                <span>Fast Issue via RFID</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF7F2] text-[#6E6862] font-semibold border-b border-[#E5DFD7]">
                  <tr>
                    <th className="p-3.5">Accession &amp; RFID</th>
                    <th className="p-3.5">Book Title</th>
                    <th className="p-3.5">Borrower Details</th>
                    <th className="p-3.5">Issue Date</th>
                    <th className="p-3.5">Due Date</th>
                    <th className="p-3.5">Status &amp; Fine</th>
                    <th className="p-3.5 text-right">Circulation Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFE9E1]">
                  {circulation.map((item) => (
                    <tr key={item.id} className="hover:bg-[#FAF7F2]/50 transition-colors">
                      <td className="p-3.5">
                        <div className="font-mono font-bold text-[#682038]">{item.accessionNo}</div>
                        <div className="font-mono text-[10px] text-[#8B5E3C]">{item.rfidTag || 'NO-TAG'}</div>
                      </td>
                      <td className="p-3.5 font-bold text-[#242424] max-w-xs truncate">{item.bookTitle}</td>
                      <td className="p-3.5">
                        <div className="font-semibold text-[#242424]">{item.borrowerName}</div>
                        <div className="text-[10px] text-[#6E6862] font-mono">
                          {item.borrowerId} • {item.borrowerType}
                        </div>
                      </td>
                      <td className="p-3.5 font-mono text-[#6E6862]">{item.borrowDate}</td>
                      <td className="p-3.5 font-mono">
                        <span className={item.status === 'OVERDUE' ? 'text-rose-700 font-bold' : 'text-[#242424]'}>
                          {item.dueDate}
                        </span>
                      </td>
                      <td className="p-3.5">
                        {item.status === 'OVERDUE' && (
                          <div className="space-y-0.5">
                            <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                              OVERDUE
                            </span>
                            <div className="text-[11px] font-bold text-rose-700">₹{item.fineAccrued} Fine Accrued</div>
                          </div>
                        )}
                        {item.status === 'ISSUED' && (
                          <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                            ON LOAN
                          </span>
                        )}
                        {item.status === 'RETURNED' && (
                          <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            RETURNED
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-right space-x-2">
                        {item.status !== 'RETURNED' && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleRenewBook(item.id)}
                              className="px-2.5 py-1 rounded bg-[#FAF7F2] hover:bg-[#F4ECE2] text-[#8B5E3C] border border-[#E5DFD7] text-[11px] font-bold transition-colors cursor-pointer"
                            >
                              Renew (+14d)
                            </button>
                            <button
                              type="button"
                              onClick={() => handleReturnBook(item.id, item.accessionNo)}
                              className="px-2.5 py-1 rounded bg-[#682038] hover:bg-[#54192D] text-white text-[11px] font-bold transition-colors cursor-pointer"
                            >
                              Check In (Return)
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: HOLDS & RESERVATIONS */}
      {subTab === 'holds' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-[#E5DFD7] p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-sm text-[#242424]">Book Reservation &amp; Hold Shelf Queue</h3>
                <p className="text-xs text-[#6E6862]">
                  When titles are returned, system reserves copy for 48 hours on the patron hold shelf.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF7F2] text-[#6E6862] font-semibold border-b border-[#E5DFD7]">
                  <tr>
                    <th className="p-3.5">Queue Priority</th>
                    <th className="p-3.5">Reserved Title</th>
                    <th className="p-3.5">Borrower</th>
                    <th className="p-3.5">Placed On</th>
                    <th className="p-3.5">Hold Shelf Window</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFE9E1]">
                  {holds.map((h) => (
                    <tr key={h.id} className="hover:bg-[#FAF7F2]/50">
                      <td className="p-3.5 font-bold font-mono text-[#682038]">#{h.queuePosition}</td>
                      <td className="p-3.5">
                        <div className="font-bold text-[#242424]">{h.bookTitle}</div>
                        <div className="font-mono text-[10px] text-[#6E6862]">{h.accessionNo}</div>
                      </td>
                      <td className="p-3.5">
                        <div className="font-semibold text-[#242424]">{h.borrowerName}</div>
                        <div className="font-mono text-[10px] text-[#6E6862]">{h.borrowerId}</div>
                      </td>
                      <td className="p-3.5 font-mono text-[#6E6862]">{h.placedDate}</td>
                      <td className="p-3.5 font-mono">
                        {h.holdExpiresAt ? (
                          <span className="text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            Expires: {h.holdExpiresAt}
                          </span>
                        ) : (
                          <span className="text-[#8B5E3C]">Awaiting Return</span>
                        )}
                      </td>
                      <td className="p-3.5">
                        {h.status === 'READY_ON_HOLD_SHELF' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            READY FOR PICKUP
                          </span>
                        )}
                        {h.status === 'WAITING_FOR_RETURN' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            IN QUEUE
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-right">
                        {h.status === 'READY_ON_HOLD_SHELF' && (
                          <button
                            type="button"
                            onClick={() => {
                              alert(`Checked out to ${h.borrowerName} from hold shelf!`);
                              setHolds(holds.map((it) => (it.id === h.id ? { ...it, status: 'PICKED_UP' } : it)));
                            }}
                            className="px-2.5 py-1 rounded bg-[#682038] text-white text-[11px] font-bold hover:bg-[#54192D]"
                          >
                            Complete Checkout
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: FINES & DEAN'S WAIVERS */}
      {subTab === 'fines' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-[#E5DFD7] p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-sm text-[#242424]">Overdue Fine Recovery &amp; Dean's Statutory Waivers</h3>
                <p className="text-xs text-[#6E6862]">
                  Statutory fine assessment: ₹5.00/day. Library holds lock examination admit cards until settled.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF7F2] text-[#6E6862] font-semibold border-b border-[#E5DFD7]">
                  <tr>
                    <th className="p-3.5">Receipt / Reference</th>
                    <th className="p-3.5">Patron Details</th>
                    <th className="p-3.5">Overdue Title</th>
                    <th className="p-3.5">Days Late</th>
                    <th className="p-3.5">Fine Amount</th>
                    <th className="p-3.5">Settlement Status</th>
                    <th className="p-3.5 text-right">Settlement Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFE9E1]">
                  {fines.map((f) => (
                    <tr key={f.id} className="hover:bg-[#FAF7F2]/50">
                      <td className="p-3.5 font-mono font-bold text-[#682038]">
                        {f.receiptNo || 'PENDING-REC'}
                      </td>
                      <td className="p-3.5">
                        <div className="font-bold text-[#242424]">{f.borrowerName}</div>
                        <div className="font-mono text-[10px] text-[#6E6862]">{f.borrowerId} • {f.borrowerType}</div>
                      </td>
                      <td className="p-3.5">
                        <div className="font-medium text-[#242424]">{f.bookTitle}</div>
                        <div className="font-mono text-[10px] text-[#6E6862]">{f.accessionNo}</div>
                      </td>
                      <td className="p-3.5 font-mono text-[#8B5E3C]">{f.overdueDays} Days</td>
                      <td className="p-3.5 font-mono font-bold text-[#682038]">₹{f.amount}</td>
                      <td className="p-3.5">
                        {f.status === 'PENDING' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                            UNPAID DUE
                          </span>
                        )}
                        {f.status === 'COLLECTED' && (
                          <div className="space-y-0.5">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              PAID ({f.paymentMode})
                            </span>
                            <div className="text-[10px] text-[#6E6862] font-mono">{f.paidDate}</div>
                          </div>
                        )}
                        {f.status === 'WAIVED_BY_DEAN' && (
                          <div className="space-y-0.5">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
                              WAIVED BY DEAN
                            </span>
                            <div className="text-[10px] text-[#6E6862] max-w-xs truncate" title={f.waiverReason}>
                              {f.waiverReason}
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="p-3.5 text-right space-x-2">
                        {f.status === 'PENDING' && (
                          <>
                            <button
                              type="button"
                              onClick={() => setActiveFineForPay(f)}
                              className="px-2.5 py-1 rounded bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold transition-colors cursor-pointer"
                            >
                              Collect Fine
                            </button>
                            <button
                              type="button"
                              onClick={() => setActiveFineForWaiver(f)}
                              className="px-2.5 py-1 rounded bg-[#FAF7F2] hover:bg-[#F4ECE2] text-[#8B5E3C] border border-[#E5DFD7] text-[11px] font-bold transition-colors cursor-pointer"
                            >
                              Dean Waiver
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: DIGITAL RESOURCES & E-READER */}
      {subTab === 'digital' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DIGITAL_RESOURCES.map((res) => (
              <div
                key={res.id}
                className="bg-white rounded-2xl border border-[#E5DFD7] p-5 shadow-xs flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                      {res.category}
                    </span>
                    <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      SSO Token Active
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-[#242424]">{res.name}</h3>
                    <p className="text-xs text-[#6E6862]">Provider: {res.provider}</p>
                  </div>

                  <div className="bg-[#FAF7F2] rounded-xl p-3 text-xs space-y-1 border border-[#EFE9E1]">
                    <div className="flex justify-between">
                      <span className="text-[#6E6862]">Institutional Holdings:</span>
                      <span className="font-bold text-[#682038]">{res.indexedCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6E6862]">Campus IP Authentication:</span>
                      <span className="font-mono text-emerald-800">10.14.0.0/16 Range OK</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#EFE9E1] flex items-center justify-between mt-4">
                  <a
                    href={res.accessUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#682038] hover:bg-[#54192D] text-white text-xs font-bold transition-colors"
                  >
                    <span>Launch Subscribed Gateway</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: TURNSTILE TELEMETRY & FOOTFALL */}
      {subTab === 'footfall' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#E5DFD7] p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-[#242424]">Live Reading Room Occupancy &amp; Turnstile Logs</h3>
                <p className="text-xs text-[#6E6862]">
                  Optical infrared turnstiles at Library Gate A &amp; Gate B stream real-time entry and exit timestamps.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-200">
                  Capacity: 148 / 250 Seats Occupied (59.2%)
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E5DFD7]">
                <div className="text-xs text-[#6E6862]">Ground Floor Silent Reading Hall</div>
                <div className="text-2xl font-bold text-[#682038] mt-1">74 / 100</div>
                <div className="w-full bg-[#E5DFD7] rounded-full h-2 mt-2">
                  <div className="bg-[#682038] h-2 rounded-full" style={{ width: '74%' }} />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E5DFD7]">
                <div className="text-xs text-[#6E6862]">First Floor Digital E-Learning Lab</div>
                <div className="text-2xl font-bold text-blue-800 mt-1">42 / 60</div>
                <div className="w-full bg-[#E5DFD7] rounded-full h-2 mt-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '70%' }} />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E5DFD7]">
                <div className="text-xs text-[#6E6862]">Second Floor Journal &amp; Thesis Archive</div>
                <div className="text-2xl font-bold text-[#8B5E3C] mt-1">32 / 90</div>
                <div className="w-full bg-[#E5DFD7] rounded-full h-2 mt-2">
                  <div className="bg-[#8B5E3C] h-2 rounded-full" style={{ width: '35%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: FAST RFID & BARCODE SCANNER SIMULATOR */}
      {isScannerModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-[#E5DFD7] space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5DFD7] pb-3">
              <div className="flex items-center gap-2">
                <ScanLine className="w-5 h-5 text-[#682038]" />
                <h3 className="font-bold text-base text-[#242424]">Fast RFID Circulation Scanner</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsScannerModalOpen(false)}
                className="p-1 rounded-lg hover:bg-[#FAF7F2] text-[#6E6862]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRfidCheckout} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#242424] mb-1">Book Accession Number</label>
                <select
                  value={scannedAccession}
                  onChange={(e) => setScannedAccession(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5DFD7] font-mono text-xs"
                >
                  {books.map((b) => (
                    <option key={b.id} value={b.accessionNo}>
                      {b.accessionNo} — {b.title} (Available: {b.availableCopies})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#242424] mb-1">Patron Smartcard (Roll / Emp ID)</label>
                <input
                  type="text"
                  value={scannedBorrowerId}
                  onChange={(e) => setScannedBorrowerId(e.target.value)}
                  placeholder="e.g. 26CS03 or EMP-CSE-012"
                  className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5DFD7] font-mono text-xs"
                  required
                />
              </div>

              {scannerFeedback && (
                <div
                  className={`p-3 rounded-xl text-xs font-semibold ${
                    scannerFeedback.startsWith('Error') || scannerFeedback.startsWith('Cannot')
                      ? 'bg-rose-50 text-rose-800 border border-rose-200'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  {scannerFeedback}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsScannerModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#FAF7F2] text-[#6E6862] font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#682038] hover:bg-[#54192D] text-white font-bold"
                >
                  Simulate RFID Scan &amp; Issue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: 2D SHELF & RACK BLUEPRINT LOCATOR */}
      {activeBookForMap && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-[#E5DFD7] space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5DFD7] pb-3">
              <div>
                <span className="font-mono text-[10px] font-bold text-[#8B5E3C] bg-[#FAF7F2] px-2 py-0.5 rounded border border-[#E5DFD7]">
                  {activeBookForMap.accessionNo}
                </span>
                <h3 className="font-bold text-base text-[#242424] mt-1">{activeBookForMap.title}</h3>
                <p className="text-xs text-[#6E6862]">{activeBookForMap.rackLocation} • {activeBookForMap.stackWing}</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveBookForMap(null)}
                className="p-1.5 rounded-lg hover:bg-[#FAF7F2] text-[#6E6862]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Interactive 2D Floor Schematic */}
            <div className="bg-[#FAF7F2] rounded-2xl p-4 border border-[#E5DFD7] space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#682038]">CENTRAL LIBRARY FLOOR 1 — STACK ROOM LAYOUT</span>
                <span className="text-[11px] text-[#6E6862]">North Entry: Main Gate</span>
              </div>

              {/* Racks Layout Grid */}
              <div className="grid grid-cols-4 gap-3 bg-white p-4 rounded-xl border border-[#DDD5C7]">
                {/* WING A */}
                <div
                  className={`p-3 rounded-lg border text-center transition-all ${
                    activeBookForMap.stackWing === 'WING_A'
                      ? 'border-[#682038] bg-[#F4ECEE] shadow-sm ring-2 ring-[#682038]'
                      : 'border-[#E5DFD7] bg-[#FAF7F2]'
                  }`}
                >
                  <div className="font-bold text-xs text-[#242424]">Wing A (CS &amp; IT)</div>
                  <div className="text-[10px] text-[#6E6862] mt-1">DDC 000 - 099</div>
                  {activeBookForMap.stackWing === 'WING_A' && (
                    <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-[#682038] animate-bounce">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{activeBookForMap.rackLocation}</span>
                    </div>
                  )}
                </div>

                {/* WING B */}
                <div
                  className={`p-3 rounded-lg border text-center transition-all ${
                    activeBookForMap.stackWing === 'WING_B'
                      ? 'border-[#682038] bg-[#F4ECEE] shadow-sm ring-2 ring-[#682038]'
                      : 'border-[#E5DFD7] bg-[#FAF7F2]'
                  }`}
                >
                  <div className="font-bold text-xs text-[#242424]">Wing B (Engg &amp; Tech)</div>
                  <div className="text-[10px] text-[#6E6862] mt-1">DDC 600 - 699</div>
                  {activeBookForMap.stackWing === 'WING_B' && (
                    <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-[#682038] animate-bounce">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{activeBookForMap.rackLocation}</span>
                    </div>
                  )}
                </div>

                {/* WING C */}
                <div className="p-3 rounded-lg border border-[#E5DFD7] bg-[#FAF7F2] text-center">
                  <div className="font-bold text-xs text-[#242424]">Wing C (Sciences)</div>
                  <div className="text-[10px] text-[#6E6862] mt-1">DDC 500 - 599</div>
                </div>

                {/* REFERENCE ROOM */}
                <div className="p-3 rounded-lg border border-[#E5DFD7] bg-[#FAF7F2] text-center">
                  <div className="font-bold text-xs text-[#242424]">Reference Stack</div>
                  <div className="text-[10px] text-[#6E6862] mt-1">Encyclopedias &amp; Dissertations</div>
                </div>
              </div>

              <div className="text-[11px] text-[#6E6862] flex items-center justify-between pt-1">
                <span>Walking Directions: Enter Gate A &rarr; Proceed straight past Circulation Desk &rarr; Enter {activeBookForMap.stackWing} &rarr; Locate {activeBookForMap.rackLocation}.</span>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setActiveBookForMap(null)}
                className="px-4 py-2 rounded-xl bg-[#682038] text-white text-xs font-bold"
              >
                Close Shelf Map
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: IN-APP DIGITAL E-READER */}
      {activeBookForReader && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-[#FAF7F2] rounded-3xl max-w-3xl w-full h-[80vh] flex flex-col shadow-2xl border border-[#E5DFD7] overflow-hidden">
            {/* Top Toolbar */}
            <div className="bg-white px-6 py-4 border-b border-[#E5DFD7] flex items-center justify-between shrink-0">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-900 font-mono">
                  ACET DIGITAL REPOSITORY • {activeBookForReader.pages || 600} PAGES
                </span>
                <h3 className="font-bold text-base text-[#242424] mt-1">{activeBookForReader.title}</h3>
                <p className="text-xs text-[#6E6862]">by {activeBookForReader.author}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `${activeBookForReader.author}. (${activeBookForReader.edition}). ${activeBookForReader.title}. ${activeBookForReader.publisher}.`
                    );
                    alert('APA 7th citation copied to clipboard!');
                  }}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#FAF7F2] hover:bg-[#F4ECE2] text-xs font-semibold text-[#8B5E3C] border border-[#E5DFD7]"
                  title="Copy APA Citation"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Citation</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveBookForReader(null)}
                  className="p-1.5 rounded-lg hover:bg-[#FAF7F2] text-[#6E6862]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Simulated Reader Content */}
            <div className="flex-1 overflow-y-auto p-8 font-serif leading-relaxed text-[#242424] bg-white relative">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 select-none">
                <span className="text-5xl font-black rotate-[-30deg] uppercase font-sans">
                  Academy College of Engg • Authorized Patron Copy
                </span>
              </div>

              <div className="max-w-2xl mx-auto space-y-6 relative z-10">
                <div className="text-center border-b border-[#EFE9E1] pb-6">
                  <h1 className="text-2xl font-bold font-sans text-[#682038] mb-2">{activeBookForReader.title}</h1>
                  <p className="text-sm text-[#6E6862] font-sans">
                    {activeBookForReader.author} • {activeBookForReader.publisher} ({activeBookForReader.edition})
                  </p>
                </div>

                <div className="text-base text-[#333333] space-y-4">
                  <p>{activeBookForReader.eBookExcerpt || 'Full text licensed under institutional campus subscription.'}</p>
                  <p>
                    Algorithms and computational processes form the cornerstone of modern engineering. All material herein is copyrighted by the respective publisher and made accessible exclusively for bona fide enrolled students and active faculty of the Academy College of Engineering &amp; Technology.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Reader Footer */}
            <div className="bg-white px-6 py-3 border-t border-[#E5DFD7] flex items-center justify-between text-xs text-[#6E6862]">
              <span>Viewing Chapter 1 (Pages 1–45)</span>
              <button
                type="button"
                onClick={() => setActiveBookForReader(null)}
                className="px-4 py-1.5 rounded-lg bg-[#682038] text-white font-bold"
              >
                Close Reader
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: FINE PAYMENT SETTLEMENT */}
      {activeFineForPay && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-[#E5DFD7] space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-[#E5DFD7] pb-3">
              <h3 className="font-bold text-base text-[#242424]">Collect Library Fine</h3>
              <button
                type="button"
                onClick={() => setActiveFineForPay(null)}
                className="p-1 rounded-lg hover:bg-[#FAF7F2] text-[#6E6862]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-[#FAF7F2] p-3 rounded-xl space-y-1.5 border border-[#EFE9E1]">
              <div className="flex justify-between font-semibold">
                <span>Patron:</span>
                <span className="text-[#242424]">{activeFineForPay.borrowerName}</span>
              </div>
              <div className="flex justify-between font-mono">
                <span>Roll/ID:</span>
                <span>{activeFineForPay.borrowerId}</span>
              </div>
              <div className="flex justify-between font-mono text-[#682038] font-bold text-sm pt-1 border-t border-[#E5DFD7]">
                <span>Total Overdue Penalty:</span>
                <span>₹{activeFineForPay.amount}.00</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block font-semibold text-[#242424]">Select Payment Mode</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleCollectFine('UPI')}
                  className="p-2.5 rounded-xl border border-[#E5DFD7] bg-[#FAF7F2] hover:bg-[#682038] hover:text-white font-bold text-center transition-colors cursor-pointer"
                >
                  UPI / QR
                </button>
                <button
                  type="button"
                  onClick={() => handleCollectFine('CASH')}
                  className="p-2.5 rounded-xl border border-[#E5DFD7] bg-[#FAF7F2] hover:bg-[#682038] hover:text-white font-bold text-center transition-colors cursor-pointer"
                >
                  Cash Desk
                </button>
                <button
                  type="button"
                  onClick={() => handleCollectFine('BURSAR_PORTAL')}
                  className="p-2.5 rounded-xl border border-[#E5DFD7] bg-[#FAF7F2] hover:bg-[#682038] hover:text-white font-bold text-center transition-colors cursor-pointer"
                >
                  Bursar Fee Dues
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: DEAN'S STATUTORY WAIVER */}
      {activeFineForWaiver && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-[#E5DFD7] space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-[#E5DFD7] pb-3">
              <h3 className="font-bold text-base text-[#242424]">Dean's Statutory Fine Waiver</h3>
              <button
                type="button"
                onClick={() => setActiveFineForWaiver(null)}
                className="p-1 rounded-lg hover:bg-[#FAF7F2] text-[#6E6862]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleApplyWaiver} className="space-y-3">
              <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-amber-900 space-y-1">
                <div className="font-bold">Waiving Fine: ₹{activeFineForWaiver.amount}.00 for {activeFineForWaiver.borrowerName}</div>
                <div className="text-[11px]">Requires formal justification for state regulatory and CAG audit compliance.</div>
              </div>

              <div>
                <label className="block font-semibold text-[#242424] mb-1">Reason for Waiver</label>
                <textarea
                  value={waiverReasonInput}
                  onChange={(e) => setWaiverReasonInput(e.target.value)}
                  placeholder="e.g. Approved medical leave with hospitalization slip, or Inter-collegiate sports representation..."
                  className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5DFD7] text-xs h-20"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveFineForWaiver(null)}
                  className="px-4 py-2 rounded-xl bg-[#FAF7F2] text-[#6E6862] font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#682038] text-white font-bold"
                >
                  Sign &amp; Approve Waiver
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 6: CATALOG NEW TITLE MODAL WITH QUICK PRESETS */}
      {isNewBookModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#E5DFD7] space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5DFD7] pb-3">
              <h3 className="font-bold text-base text-[#242424]">Catalog New Title in OPAC Repository</h3>
              <button
                type="button"
                onClick={() => setIsNewBookModalOpen(false)}
                className="p-1 rounded-lg hover:bg-[#FAF7F2] text-[#6E6862]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Presets */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-[#8B5E3C] uppercase tracking-wider">Fast Sample Catalog Presets:</span>
              <div className="flex gap-2 flex-wrap text-xs">
                <button
                  type="button"
                  onClick={() => handleQuickIsbnFill('CLEAN_CODE')}
                  className="px-2.5 py-1 rounded-lg bg-[#FAF7F2] hover:bg-[#F4ECE2] border border-[#E5DFD7] font-semibold text-[#682038]"
                >
                  Clean Code
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickIsbnFill('OS_CONCEPTS')}
                  className="px-2.5 py-1 rounded-lg bg-[#FAF7F2] hover:bg-[#F4ECE2] border border-[#E5DFD7] font-semibold text-[#682038]"
                >
                  OS Concepts
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickIsbnFill('NETWORKS')}
                  className="px-2.5 py-1 rounded-lg bg-[#FAF7F2] hover:bg-[#F4ECE2] border border-[#E5DFD7] font-semibold text-[#682038]"
                >
                  Computer Networks
                </button>
              </div>
            </div>

            <form onSubmit={handleCatalogBook} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#242424] mb-1">Book Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Modern Operating Systems"
                  className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5DFD7]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#242424] mb-1">Author(s)</label>
                  <input
                    type="text"
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    placeholder="e.g. Andrew S. Tanenbaum"
                    className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5DFD7]"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#242424] mb-1">ISBN-13</label>
                  <input
                    type="text"
                    value={newIsbn}
                    onChange={(e) => setNewIsbn(e.target.value)}
                    placeholder="978-0133591620"
                    className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5DFD7] font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#242424] mb-1">DDC Classification</label>
                  <input
                    type="text"
                    value={newDdc}
                    onChange={(e) => setNewDdc(e.target.value)}
                    placeholder="e.g. 005.43"
                    className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5DFD7] font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#242424] mb-1">Copies to Stock</label>
                  <input
                    type="number"
                    value={newCopies}
                    onChange={(e) => setNewCopies(Number(e.target.value))}
                    min={1}
                    max={50}
                    className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5DFD7]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#242424] mb-1">Department</label>
                  <select
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5DFD7]"
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Electronics & Comm">Electronics &amp; Comm</option>
                    <option value="Mechanical Engg">Mechanical Engg</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#242424] mb-1">Stack Wing</label>
                  <select
                    value={newWing}
                    onChange={(e) => setNewWing(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5DFD7]"
                  >
                    <option value="WING_A">Wing A (CS &amp; IT)</option>
                    <option value="WING_B">Wing B (Engineering)</option>
                    <option value="WING_C">Wing C (Sciences)</option>
                    <option value="REFERENCE">Reference Stack</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#EFE9E1]">
                <button
                  type="button"
                  onClick={() => setIsNewBookModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#FAF7F2] text-[#6E6862] font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#682038] hover:bg-[#54192D] text-white font-bold"
                >
                  Accession &amp; Stock Title
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
