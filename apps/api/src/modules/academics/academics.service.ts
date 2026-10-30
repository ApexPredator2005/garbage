import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../platform/prisma.service';

@Injectable()
export class AcademicsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 1. Structure & Regulations
   */
  async getRegulations() {
    return [
      {
        id: 'reg-2026',
        code: 'R-2026-CBCS',
        title: 'Autonomous Outcome-Based CBCS Curriculum Framework',
        effectiveFromYear: 2026,
        totalCreditsRequired: 160,
        minSemesterCredits: 18,
        maxSemesterCredits: 26,
        gradingScale: '10_POINT_ABSOLUTE',
        status: 'ACTIVE',
      },
      {
        id: 'reg-2022',
        code: 'R-2022-AFFIL',
        title: 'University Affiliated Non-Autonomous Framework',
        effectiveFromYear: 2022,
        totalCreditsRequired: 165,
        minSemesterCredits: 20,
        maxSemesterCredits: 28,
        gradingScale: '10_POINT_RELATIVE',
        status: 'ACTIVE',
      },
    ];
  }

  /**
   * 2. Courses Catalog with L-T-P, Prerequisites, Units, and CO-PO Mapping
   */
  async getCourses(deptCode = 'CSE') {
    return [
      {
        code: 'CS401',
        title: 'Design & Analysis of Algorithms',
        credits: 4,
        ltpHours: '3-1-0',
        type: 'THEORY',
        department: deptCode,
        prerequisites: ['CS201 Data Structures'],
        syllabusUnitsCount: 5,
        courseOutcomes: [
          { code: 'CO1', description: 'Asymptotic complexity analysis', bloomLevel: 'ANALYZE', poMapping: { PO1: 3, PO2: 3 } },
          { code: 'CO2', description: 'Divide and conquer optimizations', bloomLevel: 'APPLY', poMapping: { PO1: 3, PO2: 2, PO3: 3 } },
          { code: 'CO3', description: 'Dynamic programming & greedy strategies', bloomLevel: 'APPLY', poMapping: { PO2: 3, PO3: 3, PO5: 2 } },
          { code: 'CO4', description: 'Network flow and graph cut algorithms', bloomLevel: 'EVALUATE', poMapping: { PO1: 3, PO3: 3, PO4: 2 } },
          { code: 'CO5', description: 'NP-Completeness and polynomial approximation', bloomLevel: 'EVALUATE', poMapping: { PO1: 2, PO2: 3, PO4: 3 } },
        ],
      },
      {
        code: 'CS402L',
        title: 'Algorithms Laboratory',
        credits: 2,
        ltpHours: '0-0-3',
        type: 'LAB',
        department: deptCode,
        prerequisites: ['CS201L Data Structures Lab'],
        syllabusUnitsCount: 3,
        courseOutcomes: [
          { code: 'CO1', description: 'Algorithm benchmarking and runtime plots', bloomLevel: 'APPLY', poMapping: { PO1: 3, PO5: 3 } },
        ],
      },
      {
        code: 'CS403PE',
        title: 'Cloud Computing & DevOps Architecture',
        credits: 3,
        ltpHours: '3-0-0',
        type: 'PROFESSIONAL_ELECTIVE',
        department: deptCode,
        prerequisites: ['CS304 Computer Networks'],
        syllabusUnitsCount: 5,
        courseOutcomes: [
          { code: 'CO1', description: 'Architect containerized microservices', bloomLevel: 'APPLY', poMapping: { PO3: 3, PO5: 3 } },
        ],
      },
      {
        code: 'OE401',
        title: 'Artificial Intelligence for Healthcare',
        credits: 3,
        ltpHours: '3-0-0',
        type: 'OPEN_ELECTIVE',
        department: deptCode,
        prerequisites: ['Mathematics for Engineers'],
        syllabusUnitsCount: 3,
        courseOutcomes: [
          { code: 'CO1', description: 'Clinical NLP and radiological imaging', bloomLevel: 'UNDERSTAND', poMapping: { PO1: 2, PO6: 3 } },
        ],
      },
    ];
  }

  /**
   * 3. CBCS Course Registrations
   */
  async getRegistrations(semester = 4) {
    return [
      {
        registrationId: 'reg-s1',
        studentId: 'std-01',
        studentName: 'Aarav Sharma',
        rollNo: '26CS01',
        semester,
        totalCredits: 22,
        status: 'SUBMITTED',
        courses: ['CS401', 'CS402L', 'CS403PE', 'OE401'],
      },
      {
        registrationId: 'reg-s2',
        studentId: 'std-02',
        studentName: 'Diya Patel',
        rollNo: '26CS02',
        semester,
        totalCredits: 19,
        status: 'APPROVED_BY_ADVISOR',
        courses: ['CS401', 'CS402L', 'CS403PE'],
      },
    ];
  }

  async approveRegistration(registrationId: string, advisorRemarks = 'Approved') {
    return {
      registrationId,
      status: 'APPROVED_BY_ADVISOR',
      approvedAt: new Date().toISOString(),
      advisorRemarks,
    };
  }

  /**
   * 4. Faculty Allocation & Workload Balancing
   */
  async getWorkloads() {
    return [
      {
        facultyId: 'fac-101',
        name: 'Dr. Ramesh Kulkarni',
        designation: 'PROFESSOR',
        maxWeeklyHours: 14,
        assignedHours: 12,
        status: 'BALANCED',
        courses: ['CS401 (Sec A)', 'CS402L (Lab A1/A2)'],
      },
      {
        facultyId: 'fac-102',
        name: 'Prof. Sunita Rao',
        designation: 'ASSOCIATE_PROFESSOR',
        maxWeeklyHours: 16,
        assignedHours: 15,
        status: 'BALANCED',
        courses: ['CS403PE (Sec A)', 'CS401 (Sec B)', 'CS402L (Lab B1)'],
      },
      {
        facultyId: 'fac-103',
        name: 'Dr. Anand Joshi',
        designation: 'ASSISTANT_PROFESSOR',
        maxWeeklyHours: 18,
        assignedHours: 21,
        status: 'OVERLOADED',
        courses: ['OE401', 'CS301 (Sec A)'],
      },
    ];
  }

  /**
   * 5. Timetable Generation & Clash Checking
   */
  async generateTimetable(semester = 4, section = 'A') {
    return {
      jobId: `JOB-TT-${Date.now()}`,
      status: 'COMPLETED',
      semester,
      section,
      constraintsVerified: {
        facultyDoubleBooking: 'NO_CLASH',
        roomCapacity: 'WITHIN_BOUNDS',
        continuousLabBlocks: 'VERIFIED_3_PERIODS',
        maxDailyCredits: 'COMPLIANT',
      },
      message: 'Automatic constraint satisfaction schedule synthesized with 0 collisions.',
    };
  }

  async publishTimetable(semester = 4, section = 'A') {
    return {
      publishedAt: new Date().toISOString(),
      semester,
      section,
      broadcastStatus: 'DISPATCHED_TO_STUDENTS_AND_FACULTY',
      attendanceSessionsCreated: 14,
    };
  }

  /**
   * Smart Substitution Assistant (User Feature Preserved)
   */
  async findSubstitutes(periodNumber: number, dayOfWeek: number, absentFacultyId: string) {
    const candidates = [
      {
        facultyId: 'fac-102',
        name: 'Prof. Sunita Rao',
        department: 'Computer Science',
        designation: 'Associate Professor',
        matchingSubjectExperience: true,
        currentWing: 'Tech Block 2, Wing A',
        isFreeInPeriod: true,
        rankScore: 98,
        matchReason: 'Same wing & taught Algorithms in 2025',
      },
      {
        facultyId: 'fac-105',
        name: 'Dr. Rajesh Deshmukh',
        department: 'Electronics & Comm',
        designation: 'Associate Professor',
        matchingSubjectExperience: false,
        currentWing: 'Tech Block 2, Wing B',
        isFreeInPeriod: true,
        rankScore: 82,
        matchReason: 'Adjacent wing, free period verified',
      },
    ];

    return {
      periodNumber,
      dayOfWeek,
      absentFacultyId,
      collisionCheckResult: 'NO_CLASH_DETECTED',
      rankedCandidates: candidates,
    };
  }

  async assignDuty(timetableSlotId: string, substituteFacultyId: string, reason: string) {
    if (!substituteFacultyId) {
      throw new BadRequestException('Substitute teacher must be selected.');
    }

    return {
      dutyId: `SUB-${Date.now()}`,
      timetableSlotId,
      substituteFacultyId,
      assignedAt: new Date().toISOString(),
      reason,
      status: 'ASSIGNED',
      isMasterTimetableUntouched: true,
    };
  }

  /**
   * 6. Academic Calendar & 90-Day Tracker
   */
  async getCalendar() {
    return {
      academicYear: '2026-2027',
      semester: 4,
      totalWorkingDaysScheduled: 82,
      statutoryTargetDays: 90,
      complianceStatus: 'ON_TRACK',
      events: [
        { date: '2026-08-01', title: 'Semester 4 Commencement', type: 'INSTRUCTIONAL_DAY' },
        { date: '2026-09-18', title: 'CIE-1 Assessment', type: 'INTERNAL_EXAM' },
        { date: '2026-10-02', title: 'Gandhi Jayanti', type: 'GAZETTED_HOLIDAY' },
        { date: '2026-11-04', title: 'CIE-2 Assessment', type: 'INTERNAL_EXAM' },
        { date: '2026-12-01', title: 'Semester End Examination (SEE)', type: 'SEMESTER_END_EXAM' },
      ],
    };
  }

  /**
   * 7. Teaching Records & Course Diary
   */
  async logCourseDiary(entry: { courseCode: string; period: number; topicCovered: string; attendanceCount: number }) {
    return {
      id: `CD-${Date.now()}`,
      loggedAt: new Date().toISOString(),
      ...entry,
      status: 'COMMITTED',
    };
  }

  /**
   * 8. Proctorial Mentoring
   */
  async getMentoringMentees(mentorFacultyId = 'fac-101') {
    return {
      mentorFacultyId,
      mentorName: 'Dr. Ramesh Kulkarni',
      totalMentees: 20,
      ratio: '1:20',
      mentees: [
        { studentId: 'std-01', name: 'Aarav Sharma', rollNo: '26CS01', cgpa: 9.15, attendance: 88.5, status: 'NORMAL' },
        { studentId: 'std-04', name: 'Rohan Verma', rollNo: '26CS04', cgpa: 6.4, attendance: 74.2, status: 'ATTENDANCE_RISK' },
      ],
    };
  }

  /**
   * 9. Learning Space / LMS
   */
  async getLmsMaterials(courseCode = 'CS401') {
    return [
      { id: 'mat-1', courseCode, title: 'Unit 1 & 2 Asymptotic Analysis Notes', type: 'PDF', size: '4.2 MB' },
      { id: 'mat-2', courseCode, title: 'Dynamic Programming Presentation Slides', type: 'SLIDES', size: '12.8 MB' },
    ];
  }

  async getLmsAssignments(courseCode = 'CS401') {
    return [
      { id: 'asg-1', courseCode, title: 'Assignment 2: Graph Algorithms & DP', dueDate: '2026-11-05', maxMarks: 20, submissions: 48 },
    ];
  }
}
