import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { CourseModel, ICourse, ProgressModel } from '../models/Course';
import { UserModel } from '../models/User';
import { memoryStore, StoredProgress } from '../config/inMemoryStore';
import { isConnectedToMongo } from '../config/db';
import { JS_ASSIGNMENT_50, JS_EXAM_HARDEST_20, getQuestionsForCourse } from '../data/courseQuestions';

export const INITIAL_COURSES: Partial<ICourse>[] = [
  {
    slug: 'programming-kinyarwanda',
    category: 'programming',
    titleKinya: 'Kwiga Porogaramu na JavaScript mu Kinyarwanda',
    titleEn: 'Programming & JavaScript Fundamentals in Kinyarwanda',
    description: 'Inzira yoroshye yo kwinjira mu mwuga wo kwandika porogaramu ukoresheje ururimi rw\'Ikinyarwanda n\'ingero zifatika.',
    level: 'beginner',
    enrollmentKey: 'KINYA-JS-2026',
    modules: [
      {
        id: 'mod_js_1',
        titleKinya: 'Intangiriro ya JavaScript & Variables',
        titleEn: 'Introduction to JavaScript & Variables',
        summary: 'Sobanukirwa icyo JavaScript ikora n\'uko ubika amakuru muri mudasobwa.',
        content: `### 1. JavaScript ni iki?
JavaScript ni ururimi rw'ikoranabuhanga rwatumye imbuga za interineti zigira ubuzima (interactivity). Mu gihe HTML itanga imiterere, na CSS igatanga ubwiza, JavaScript ituma urubuga rushobora gukora ibintu iyo umuntu akanze button cyangwa yanditse ubutumwa.

### 2. Variables (Ahantu ho kubika amakuru)
Muri JavaScript dukoresha cyane:
- \`const\`: Iyo agaciro k'ikintu katazahinduka (urugero: izina ry'igihugu cyangwa umubare wa PI).
- \`let\`: Iyo agaciro gashobora guhinduka nyuma (urugero: imyaka y'umuntu cyangwa amanota).

\`\`\`javascript
const igihugu = "u Rwanda";
let amanota = 85;

console.log("Igihugu ni: " + igihugu);
\`\`\``,
        quiz: [
          {
            question: 'Ni irihe jambo rikoreshwa mu kubika ikintu kitazahinduka muri JavaScript?',
            options: ['let', 'const', 'var', 'change'],
            correctIndex: 1,
            explanation: 'Ijambo "const" rikomoka kuri "constant", rikoreshwa ku bintu bidahinduka.',
          },
          {
            question: 'JavaScript ikora iki ku rubuga rwa interineti?',
            options: [
              'Gusa gutera amabara gusa',
              'Gutuma urubuga rwumva ibikorwa by\'umukoresha (interactivity)',
              'Kubika amafoto muri hard drive gusa',
              'Guhagarika internet',
            ],
            correctIndex: 1,
            explanation: 'JavaScript ituma urubuga rugira imikoranire (interactive behavior).',
          },
        ],
      },
      {
        id: 'mod_js_2',
        titleKinya: 'Imikorere ya Functions & Logic',
        titleEn: 'Functions, Conditions & Logic',
        summary: 'Uko ukora amabwiriza asubirwamo n\'uburyo bwo gufata ibyemezo muri code.',
        content: `### Functions muri JavaScript
Function ni nk'imashini yakira ibintu ikaguha umusaruro. 

\`\`\`javascript
function suhuzaho(izina) {
  return "Muraho neza, " + izina + "!";
}

let ubutumwa = suhuzaho("Bobo");
console.log(ubutumwa); // Muraho neza, Bobo!
\`\`\`

Ibi bigufasha kudakora amakosa yo kwandika amagambo amwe inshuro nyinshi.`,
        quiz: [
          {
            question: 'Function muri programming imara iki?',
            options: [
              'Kuzimya mudasobwa',
              'Gukusanya amabwiriza asubirwamo ahantu hamwe',
              'Kugura interineti',
              'Gufuta amadosiye yose',
            ],
            correctIndex: 1,
            explanation: 'Functions zituma code yawe itongera gusubirwamo mu buryo butari ngombwa (reusability).',
          },
        ],
      },
    ],
    assignmentQuestions: JS_ASSIGNMENT_50,
    examQuestions: JS_EXAM_HARDEST_20,
  },
  {
    slug: 'english-fluency',
    category: 'language',
    titleKinya: 'Icyongereza Cy\'akazi n\'Ikoranabuhanga',
    titleEn: 'Professional English for Technology & Careers',
    description: 'Wige uburyo bwo kwandika emails z\'akazi, kwitabira interviews, no kuganira n\'abakiriya b\'amahanga mu Cyongereza.',
    level: 'intermediate',
    enrollmentKey: 'KINYA-ENG-2026',
    modules: [
      {
        id: 'mod_en_1',
        titleKinya: 'Kwandika Professional Emails',
        titleEn: 'Writing Effective Business Emails',
        summary: 'Uburyo bwo gutangira, gusoza, no gusobanura igitekerezo cyawe mu buryo bw\'icyubahiro.',
        content: `### Writing Professional Emails
When communicating professionally:
- **Greeting:** "Dear [Name]", "Good morning [Name]", or "Hello team,"
- **Opening line:** "I hope this email finds you well."
- **Clear Purpose:** "I am writing to share the update regarding KinyaAI..."
- **Call to Action:** "Please review the attached notes and let me know your feedback by Friday."
- **Sign-off:** "Best regards," or "Kind regards,"`,
        quiz: [
          {
            question: 'Which of the following is the most professional email greeting?',
            options: ['Yo what up', 'Dear Mr. Mugabo,', 'Hey guys listen here', 'Wait a minute'],
            correctIndex: 1,
            explanation: '"Dear Mr. [Name]," or "Good morning" is formal and courteous in corporate communication.',
          },
        ],
      },
    ],
    assignmentQuestions: JS_ASSIGNMENT_50,
    examQuestions: JS_EXAM_HARDEST_20,
  },
  {
    slug: 'cybersecurity-basics',
    category: 'stem',
    titleKinya: 'Umutekano w\'Ikoranabuhanga (Cybersecurity)',
    titleEn: 'Cybersecurity Fundamentals & Digital Safety',
    description: 'Uko urinda imbuga zawe, amagambo y\'ibanga, n\'amakuru y\'ibanga ku bitero byo kuri murandasi.',
    level: 'beginner',
    enrollmentKey: 'KINYA-CYBER-2026',
    modules: [
      {
        id: 'mod_sec_1',
        titleKinya: 'Kurinda Amagambo y\'Ibanga (Passwords & 2FA)',
        titleEn: 'Strong Passwords & Two-Factor Authentication',
        summary: 'Ibyangombwa mu gukora password ikomeye n\'uko Two-Factor Authentication ikora.',
        content: `### Umutekano w'Amagambo y'Ibanga
Password nziza igomba kugira nibura inyuguti 12 zivanze (inyuguti nkuru, ntoya, imibare n'ibimenyetso). 
Wirinde gukoresha:
- Itariki y'amavuko
- Nimero ya telefone
- Ijambo "password" cyangwa "123456"

**Two-Factor Authentication (2FA):** 
Nubwo umuntu yamenya password yawe, adafite telefone yawe yakira code y'umutekano ntiyabasha kwinjira mu konti yawe.`,
        quiz: [
          {
            question: 'Ni iki gituma password irushaho gukomera?',
            options: [
              'Kuba ari izina ryawe',
              'Kuba igizwe n\'imibare gusa 1 kugeza kuri 6',
              'Kuba ifite inyuguti zivanze, imibare n\'ibimenyetso kandi irambuye',
              'Kuba ari izina ry\'umujyi wawe',
            ],
            correctIndex: 2,
            explanation: 'Guhuza inyuguti nkuru, nto, imibare n\'ibimenyetso bituma abajura b\'ikoranabuhanga batayigereranya vuba.',
          },
        ],
      },
    ],
    assignmentQuestions: JS_ASSIGNMENT_50,
    examQuestions: JS_EXAM_HARDEST_20,
  },
];

// Helper: Ensure initial courses have enrollment keys and question banks
const ensureCoursesSeed = async () => {
  if (isConnectedToMongo) {
    for (const init of INITIAL_COURSES) {
      const existing = await CourseModel.findOne({ slug: init.slug });
      if (!existing) {
        await CourseModel.create(init);
      } else {
        // Upgrade existing course with enrollment key and question banks if missing
        if (!existing.enrollmentKey || !existing.assignmentQuestions?.length || !existing.examQuestions?.length) {
          existing.enrollmentKey = init.enrollmentKey || 'KINYA2026';
          existing.assignmentQuestions = init.assignmentQuestions || JS_ASSIGNMENT_50;
          existing.examQuestions = init.examQuestions || JS_EXAM_HARDEST_20;
          await existing.save();
        }
      }
    }
  }
};

export const getCourses = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await ensureCoursesSeed();
    const isAdmin = req.user?.role === 'admin';
    const userId = req.user?.id;

    let coursesList: any[] = [];
    if (isConnectedToMongo) {
      coursesList = await CourseModel.find();
    } else {
      coursesList = INITIAL_COURSES;
    }

    // Attach student enrollment status if user logged in
    let userProgressMap: Record<string, any> = {};
    if (userId) {
      if (isConnectedToMongo) {
        const progs = await ProgressModel.find({ userId });
        progs.forEach((p) => {
          userProgressMap[p.courseSlug] = p;
        });
      } else {
        const progs = memoryStore.progress.filter((p) => p.userId === userId);
        progs.forEach((p) => {
          userProgressMap[p.courseSlug] = p;
        });
      }
    }

    const sanitizedCourses = coursesList.map((c: any) => {
      const prog = userProgressMap[c.slug];
      const isEnrolled = !!prog?.enrolled;

      return {
        _id: c._id,
        slug: c.slug,
        category: c.category,
        titleKinya: c.titleKinya,
        titleEn: c.titleEn,
        description: c.description,
        level: c.level,
        enrollmentKey: isAdmin ? c.enrollmentKey : undefined, // only admin sees key directly in listing
        hasEnrollmentKey: !!c.enrollmentKey,
        isEnrolled,
        totalModules: c.modules?.length || 0,
        assignmentQuestionsCount: c.assignmentQuestions?.length || 50,
        examQuestionsCount: c.examQuestions?.length || 20,
        modules: c.modules,
        assignmentQuestions: isEnrolled || isAdmin ? c.assignmentQuestions : [],
        examQuestions: isEnrolled || isAdmin ? c.examQuestions : [],
      };
    });

    res.json({ success: true, courses: sanitizedCourses });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getCourseBySlug = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    const isAdmin = req.user?.role === 'admin';
    const userId = req.user?.id;

    let course: any = null;
    if (isConnectedToMongo) {
      course = await CourseModel.findOne({ slug });
      if (!course) {
        const initial = INITIAL_COURSES.find((c) => c.slug === slug);
        if (initial) {
          course = await CourseModel.create(initial);
        }
      }
    } else {
      course = INITIAL_COURSES.find((c) => c.slug === slug);
    }

    if (!course) {
      res.status(404).json({ success: false, message: 'Course not found' });
      return;
    }

    let isEnrolled = false;
    let progressData = null;
    if (userId) {
      if (isConnectedToMongo) {
        progressData = await ProgressModel.findOne({ userId, courseSlug: slug });
      } else {
        progressData = memoryStore.progress.find((p) => p.userId === userId && p.courseSlug === slug);
      }
      isEnrolled = !!progressData?.enrolled;
    }

    res.json({
      success: true,
      course: {
        ...course.toObject ? course.toObject() : course,
        enrollmentKey: isAdmin ? course.enrollmentKey : undefined,
        hasEnrollmentKey: !!course.enrollmentKey,
        isEnrolled,
        progress: progressData,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Student Course Enrollment via Key
 */
export const enrollCourse = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id || 'demo_user';
    const { courseSlug, enrollmentKey } = req.body;

    if (!courseSlug || !enrollmentKey) {
      res.status(400).json({
        success: false,
        message: 'Course slug n\'Enrollment Key birakenewe byose.',
      });
      return;
    }

    let course: any = null;
    if (isConnectedToMongo) {
      course = await CourseModel.findOne({ courseSlug });
      if (!course) {
        course = await CourseModel.findOne({ slug: courseSlug });
      }
    } else {
      course = INITIAL_COURSES.find((c) => c.slug === courseSlug);
    }

    if (!course) {
      res.status(404).json({ success: false, message: 'Isomo ntiryabonetse.' });
      return;
    }

    // Validate enrollment key
    const actualKey = (course.enrollmentKey || 'KINYA2026').trim().toLowerCase();
    const providedKey = enrollmentKey.trim().toLowerCase();

    if (actualKey !== providedKey) {
      res.status(400).json({
        success: false,
        message: 'Enrollment Key ntabwo ihuye n\'iyi somo. Reba neza cyangwa ubaze umwarimu/admin.',
      });
      return;
    }

    // Record enrollment in progress
    if (isConnectedToMongo) {
      let progress: any = await ProgressModel.findOne({ userId, courseSlug });
      if (!progress) {
        progress = new ProgressModel({
          userId,
          courseSlug,
          enrolled: true,
          enrolledAt: new Date(),
          completedModules: [],
          quizScores: {},
        });
      } else {
        progress.enrolled = true;
        progress.enrolledAt = progress.enrolledAt || new Date();
      }
      await progress.save();
    } else {
      let progress = memoryStore.progress.find((p) => p.userId === userId && p.courseSlug === courseSlug);
      if (!progress) {
        progress = {
          _id: `prog_${Date.now()}`,
          userId,
          courseSlug,
          enrolled: true,
          enrolledAt: new Date(),
          completedModules: [],
          quizScores: {},
          updatedAt: new Date(),
        };
        memoryStore.progress.push(progress);
      } else {
        progress.enrolled = true;
        progress.enrolledAt = progress.enrolledAt || new Date();
        progress.updatedAt = new Date();
      }
    }

    res.json({
      success: true,
      message: 'Wiyandikishije neza mu isomo! Ubu ushobora gutangira kwiga no gukora ibizamini.',
      enrolled: true,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Submit 50-Question Assignment
 */
export const submitAssignment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id || 'demo_user';
    const { courseSlug, answers } = req.body;

    if (!courseSlug || !answers) {
      res.status(400).json({ success: false, message: 'Amakuru y\'umukoro ntiyuzuye.' });
      return;
    }

    let course: any = null;
    if (isConnectedToMongo) {
      course = await CourseModel.findOne({ slug: courseSlug });
    } else {
      course = INITIAL_COURSES.find((c) => c.slug === courseSlug);
    }

    const assignmentQuestions = course?.assignmentQuestions?.length
      ? course.assignmentQuestions
      : JS_ASSIGNMENT_50;

    let correctCount = 0;
    const review: any[] = [];

    assignmentQuestions.forEach((q: any, idx: number) => {
      const studentAnswer = answers[idx];
      const isCorrect = studentAnswer === q.correctIndex;
      if (isCorrect) correctCount++;

      review.push({
        index: idx + 1,
        question: q.question,
        options: q.options,
        studentAnswer,
        correctIndex: q.correctIndex,
        isCorrect,
        explanation: q.explanation,
      });
    });

    const totalQuestions = assignmentQuestions.length;
    const score = Math.round((correctCount / totalQuestions) * 100);

    // Save to Progress
    if (isConnectedToMongo) {
      let progress: any = await ProgressModel.findOne({ userId, courseSlug });
      if (!progress) {
        progress = new ProgressModel({
          userId,
          courseSlug,
          enrolled: true,
          assignmentScore: score,
          assignmentSubmitted: true,
        });
      } else {
        progress.assignmentScore = score;
        progress.assignmentSubmitted = true;
      }
      await progress.save();
    } else {
      let progress = memoryStore.progress.find((p) => p.userId === userId && p.courseSlug === courseSlug);
      if (!progress) {
        progress = {
          _id: `prog_${Date.now()}`,
          userId,
          courseSlug,
          enrolled: true,
          completedModules: [],
          quizScores: {},
          assignmentScore: score,
          assignmentSubmitted: true,
          updatedAt: new Date(),
        };
        memoryStore.progress.push(progress);
      } else {
        progress.assignmentScore = score;
        progress.assignmentSubmitted = true;
        progress.updatedAt = new Date();
      }
    }

    res.json({
      success: true,
      score,
      correctCount,
      totalQuestions,
      review,
      message: `Umukoro urangiye! Wagize amanota ${score}% (${correctCount}/${totalQuestions}).`,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Submit 20 Hardest Questions Final Certification Exam
 * Strict Rule:
 *  - Score <= 74: Fair / Fail => NO certificate is issued
 *  - Score >= 75: Honors / Pass => Official Certificate generated with student's real name
 */
export const submitExam = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id || 'demo_user';
    const { courseSlug, studentRealName, answers } = req.body;

    if (!courseSlug || !answers) {
      res.status(400).json({ success: false, message: 'Amakuru y\'ikizamini ntiyuzuye.' });
      return;
    }

    let course: any = null;
    if (isConnectedToMongo) {
      course = await CourseModel.findOne({ slug: courseSlug });
    } else {
      course = INITIAL_COURSES.find((c) => c.slug === courseSlug);
    }

    const examQuestions = course?.examQuestions?.length ? course.examQuestions : JS_EXAM_HARDEST_20;

    let correctCount = 0;
    const review: any[] = [];

    examQuestions.forEach((q: any, idx: number) => {
      const studentAnswer = answers[idx];
      const isCorrect = studentAnswer === q.correctIndex;
      if (isCorrect) correctCount++;

      review.push({
        index: idx + 1,
        question: q.question,
        options: q.options,
        studentAnswer,
        correctIndex: q.correctIndex,
        isCorrect,
        explanation: q.explanation,
      });
    });

    const totalQuestions = examQuestions.length; // 20 questions
    const score = Math.round((correctCount / totalQuestions) * 100);

    // Evaluate certificate threshold (>= 75%)
    const passed = score >= 75;
    const certificateId = passed
      ? `KY-CERT-2026-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
      : undefined;

    // Get real name of customer
    let verifiedName = studentRealName?.trim();
    if (!verifiedName && req.user?.id) {
      if (isConnectedToMongo) {
        const u = await UserModel.findById(userId);
        verifiedName = u?.name || 'KinyaAI Scholar';
      } else {
        const u = memoryStore.users.find((x) => x._id === userId);
        verifiedName = u?.name || 'KinyaAI Scholar';
      }
    }
    if (!verifiedName) verifiedName = 'KinyaAI Scholar';

    // Update progress in database
    if (isConnectedToMongo) {
      let progress: any = await ProgressModel.findOne({ userId, courseSlug });
      if (!progress) {
        progress = new ProgressModel({
          userId,
          courseSlug,
          enrolled: true,
          examScore: score,
          examSubmitted: true,
          certificateIssued: passed,
          certificateId: passed ? certificateId : undefined,
          studentRealName: passed ? verifiedName : undefined,
          certificateIssuedAt: passed ? new Date() : undefined,
        });
      } else {
        progress.examScore = score;
        progress.examSubmitted = true;
        progress.certificateIssued = passed;
        if (passed) {
          progress.certificateId = certificateId;
          progress.studentRealName = verifiedName;
          progress.certificateIssuedAt = new Date();
        }
      }
      await progress.save();
    } else {
      let progress = memoryStore.progress.find((p) => p.userId === userId && p.courseSlug === courseSlug);
      if (!progress) {
        progress = {
          _id: `prog_${Date.now()}`,
          userId,
          courseSlug,
          enrolled: true,
          completedModules: [],
          quizScores: {},
          examScore: score,
          examSubmitted: true,
          certificateIssued: passed,
          certificateId: passed ? certificateId : undefined,
          studentRealName: passed ? verifiedName : undefined,
          certificateIssuedAt: passed ? new Date() : undefined,
          updatedAt: new Date(),
        };
        memoryStore.progress.push(progress);
      } else {
        progress.examScore = score;
        progress.examSubmitted = true;
        progress.certificateIssued = passed;
        if (passed) {
          progress.certificateId = certificateId;
          progress.studentRealName = verifiedName;
          progress.certificateIssuedAt = new Date();
        }
        progress.updatedAt = new Date();
      }
    }

    if (passed) {
      res.json({
        success: true,
        score,
        passed: true,
        certificateIssued: true,
        certificateId,
        studentRealName: verifiedName,
        correctCount,
        totalQuestions,
        review,
        message: `🎉 URAKOZE CYANE! Watsinze ikizamini n'amanota ${score}% (${correctCount}/20). Impamyabumenyi (Certificate) yawe iriteguye!`,
        certificate: {
          certificateId,
          studentRealName: verifiedName,
          courseSlug: course?.slug || courseSlug,
          courseTitle: course?.titleKinya || 'Kwiga Porogaramu',
          courseTitleEn: course?.titleEn || 'Programming Fundamentals',
          score,
          grade: score >= 90 ? 'High Distinction' : score >= 80 ? 'Distinction' : 'Merit',
          issuedAt: new Date(),
        },
      });
    } else {
      res.json({
        success: true,
        score,
        passed: false,
        certificateIssued: false,
        correctCount,
        totalQuestions,
        review,
        message: `Ntabwo watsinze (Fair). Wagize amanota ${score}% (${correctCount}/20). Nta mpamyabumenyi itangwa ku manota ari munsi ya 75%. Subiramo isomo no kwimenyereza wongere ukore ikizamini!`,
      });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Verify or Retrieve Certificate by Certificate ID
 */
export const getCertificateById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { certificateId } = req.params;

    let progress: any = null;
    if (isConnectedToMongo) {
      progress = await ProgressModel.findOne({ certificateId, certificateIssued: true });
    } else {
      progress = memoryStore.progress.find((p) => p.certificateId === certificateId && p.certificateIssued);
    }

    if (!progress) {
      res.status(404).json({
        success: false,
        message: 'Nta mpamyabumenyi (Certificate) ifite iyi nimero yabonetse muri system ya KinyaAI.',
      });
      return;
    }

    let course: any = null;
    if (isConnectedToMongo) {
      course = await CourseModel.findOne({ slug: progress.courseSlug });
    } else {
      course = INITIAL_COURSES.find((c) => c.slug === progress.courseSlug);
    }

    res.json({
      success: true,
      certificate: {
        certificateId: progress.certificateId,
        studentRealName: progress.studentRealName || 'KinyaAI Scholar',
        courseSlug: progress.courseSlug,
        courseTitle: course?.titleKinya || 'Porogaramu ya KinyaAI',
        courseTitleEn: course?.titleEn || 'KinyaAI Course of Excellence',
        score: progress.examScore,
        grade: progress.examScore >= 90 ? 'High Distinction' : progress.examScore >= 80 ? 'Distinction' : 'Merit',
        issuedAt: progress.certificateIssuedAt || progress.updatedAt,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Admin: Create New Subject with Custom Enrollment Key & Questions
 */
export const adminCreateCourse = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      titleKinya,
      titleEn,
      description,
      category = 'programming',
      level = 'beginner',
      enrollmentKey = 'KINYA2026',
      modules = [],
      assignmentQuestions = [],
      examQuestions = [],
    } = req.body;

    if (!titleKinya || !titleEn || !description || !enrollmentKey) {
      res.status(400).json({
        success: false,
        message: 'Title Kinya, Title En, Description, n\'Enrollment Key birakenewe.',
      });
      return;
    }

    const slug = titleEn
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');

    const newCourseData: Partial<ICourse> = {
      slug,
      titleKinya,
      titleEn,
      description,
      category,
      level,
      enrollmentKey: enrollmentKey.trim().toUpperCase(),
      modules: modules.length
        ? modules
        : [
            {
              id: `mod_${Date.now()}`,
              titleKinya: 'Intangiriro y\'Isomo',
              titleEn: 'Course Introduction',
              summary: 'Inshamake y\'isomo rishya.',
              content: `### Murakaza neza kuri ${titleKinya}!\nIri somo ryashyizweho n'ubuyobozi bwa KinyaAI kugira ngo wigire ku rwego rwo hejuru.`,
              quiz: [
                {
                  question: 'Iri somo ryitwa gute?',
                  options: [titleKinya, 'Irindi somo', 'Ntabwo nzi', 'Oya'],
                  correctIndex: 0,
                  explanation: 'Iki nicyo gisobanuro nyacyo.',
                },
              ],
            },
          ],
      assignmentQuestions: assignmentQuestions.length ? assignmentQuestions : JS_ASSIGNMENT_50,
      examQuestions: examQuestions.length ? examQuestions : JS_EXAM_HARDEST_20,
    };

    if (isConnectedToMongo) {
      const created = await CourseModel.create(newCourseData);
      res.json({ success: true, course: created, message: 'Isomo rishya ryakozwe neza!' });
      return;
    }

    INITIAL_COURSES.push(newCourseData as any);
    res.json({ success: true, course: newCourseData, message: 'Isomo rishya ryakozwe neza!' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Normal Module Quiz Submission
 */
export const submitQuiz = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id || 'demo_user';
    const { courseSlug, moduleId, score } = req.body;

    if (isConnectedToMongo) {
      let progress: any = await ProgressModel.findOne({ userId, courseSlug });
      if (!progress) {
        progress = new ProgressModel({
          userId,
          courseSlug,
          enrolled: true,
          completedModules: [moduleId],
          quizScores: { [moduleId]: score },
        });
      } else {
        if (!progress.completedModules.includes(moduleId)) {
          progress.completedModules.push(moduleId);
        }
        if (progress.quizScores && typeof progress.quizScores.set === 'function') {
          progress.quizScores.set(moduleId, score);
        } else {
          progress.set(`quizScores.${moduleId}`, score);
        }
      }
      await progress.save();

      if (req.user?.id) {
        await UserModel.findByIdAndUpdate(userId, {
          $inc: { 'usageCount.lessons': 1 },
        });
      }

      res.json({ success: true, progress });
      return;
    }

    // In-memory fallback
    let progress = memoryStore.progress.find((p) => p.userId === userId && p.courseSlug === courseSlug);
    if (!progress) {
      progress = {
        _id: `prog_${Date.now()}`,
        userId,
        courseSlug,
        enrolled: true,
        completedModules: [moduleId],
        quizScores: { [moduleId]: score },
        updatedAt: new Date(),
      };
      memoryStore.progress.push(progress);
    } else {
      if (!progress.completedModules.includes(moduleId)) {
        progress.completedModules.push(moduleId);
      }
      progress.quizScores[moduleId] = score;
      progress.updatedAt = new Date();
    }

    const u = memoryStore.users.find((x) => x._id === userId);
    if (u) {
      u.usageCount.lessons += 1;
    }

    res.json({ success: true, progress });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getUserProgress = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id || 'demo_user';

    if (isConnectedToMongo) {
      const allProgress = await ProgressModel.find({ userId });
      res.json({ success: true, progress: allProgress });
      return;
    }

    const allProgress = memoryStore.progress.filter((p) => p.userId === userId);
    res.json({ success: true, progress: allProgress });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Master Certificate of All Subjects
 * Evaluates whether student has completed/passed all available courses
 */
export const getMasterCertificate = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id || 'demo_user';

    // 1. Get all courses
    let allCourses: any[] = [];
    if (isConnectedToMongo) {
      allCourses = await CourseModel.find();
    } else {
      allCourses = INITIAL_COURSES;
    }

    if (!allCourses || allCourses.length === 0) {
      res.status(404).json({ success: false, message: 'Nta masomo yabonetse muri system.' });
      return;
    }

    // 2. Get user progress
    let userProgressList: any[] = [];
    if (isConnectedToMongo) {
      userProgressList = await ProgressModel.find({ userId });
    } else {
      userProgressList = memoryStore.progress.filter((p) => p.userId === userId);
    }

    // 3. Match each course with user progress
    const passedSubjects: any[] = [];
    const pendingSubjects: any[] = [];

    let totalScore = 0;
    allCourses.forEach((c) => {
      const prog = userProgressList.find((p) => p.courseSlug === c.slug);
      const isPassed = prog && prog.examSubmitted && (prog.examScore || 0) >= 75;
      if (isPassed) {
        passedSubjects.push({
          slug: c.slug,
          titleKinya: c.titleKinya,
          titleEn: c.titleEn,
          category: c.category,
          score: prog.examScore,
          certificateId: prog.certificateId,
          completedAt: prog.certificateIssuedAt || prog.updatedAt,
        });
        totalScore += prog.examScore;
      } else {
        pendingSubjects.push({
          slug: c.slug,
          titleKinya: c.titleKinya,
          titleEn: c.titleEn,
          category: c.category,
        });
      }
    });

    const totalCount = allCourses.length;
    const completedCount = passedSubjects.length;
    const isEligible = completedCount === totalCount;
    const averageScore = completedCount > 0 ? Math.round(totalScore / completedCount) : 0;

    // Get verified real name
    let studentRealName = req.user?.name;
    if (isConnectedToMongo && userId) {
      const u = await UserModel.findById(userId);
      if (u?.name) studentRealName = u.name;
    } else if (userId) {
      const u = memoryStore.users.find((x) => x._id === userId);
      if (u?.name) studentRealName = u.name;
    }
    if (!studentRealName) studentRealName = 'Bobo Tuyishime';

    const grade = averageScore >= 90 ? 'Summa Cum Laude (High Distinction)' : averageScore >= 80 ? 'Magna Cum Laude (Distinction)' : 'Cum Laude (Merit)';

    const masterCertificateId = `KY-MASTER-2026-${userId.toString().slice(-4).toUpperCase()}`;

    res.json({
      success: true,
      eligible: isEligible,
      totalCount,
      completedCount,
      pendingCount: pendingSubjects.length,
      averageScore,
      grade,
      studentRealName,
      passedSubjects,
      pendingSubjects,
      masterCertificate: isEligible
        ? {
            certificateId: masterCertificateId,
            studentRealName,
            subjects: passedSubjects,
            totalSubjects: totalCount,
            averageScore,
            grade,
            issuedAt: new Date().toISOString(),
          }
        : null,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Fast Unlock / Claim Master Certificate (Enables 1-click test / auto-complete all courses)
 */
export const claimMasterCertificate = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id || 'demo_user';
    const { studentRealName = 'Bobo Tuyishime' } = req.body;

    let allCourses: any[] = [];
    if (isConnectedToMongo) {
      allCourses = await CourseModel.find();
    } else {
      allCourses = INITIAL_COURSES;
    }

    const passedSubjects: any[] = [];
    let totalScore = 0;

    for (let i = 0; i < allCourses.length; i++) {
      const c = allCourses[i];
      const examScore = 95 - (i * 2); // e.g. 95%, 93%, 91%
      const certId = `KY-CERT-2026-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      totalScore += examScore;

      if (isConnectedToMongo) {
        let prog = await ProgressModel.findOne({ userId, courseSlug: c.slug });
        if (!prog) {
          prog = new ProgressModel({
            userId,
            courseSlug: c.slug,
            enrolled: true,
            assignmentSubmitted: true,
            assignmentScore: 100,
            examSubmitted: true,
            examScore,
            certificateIssued: true,
            certificateId: certId,
            studentRealName,
            certificateIssuedAt: new Date(),
          });
        } else {
          prog.enrolled = true;
          prog.assignmentSubmitted = true;
          prog.examSubmitted = true;
          prog.examScore = examScore;
          prog.certificateIssued = true;
          prog.certificateId = certId;
          prog.studentRealName = studentRealName;
          prog.certificateIssuedAt = new Date();
        }
        await prog.save();
      } else {
        let prog = memoryStore.progress.find((p) => p.userId === userId && p.courseSlug === c.slug);
        if (!prog) {
          prog = {
            _id: `prog_${Date.now()}_${i}`,
            userId,
            courseSlug: c.slug,
            enrolled: true,
            completedModules: [],
            quizScores: {},
            assignmentSubmitted: true,
            assignmentScore: 100,
            examSubmitted: true,
            examScore,
            certificateIssued: true,
            certificateId: certId,
            studentRealName,
            certificateIssuedAt: new Date(),
            updatedAt: new Date(),
          };
          memoryStore.progress.push(prog);
        } else {
          prog.enrolled = true;
          prog.assignmentSubmitted = true;
          prog.examSubmitted = true;
          prog.examScore = examScore;
          prog.certificateIssued = true;
          prog.certificateId = certId;
          prog.studentRealName = studentRealName;
          prog.certificateIssuedAt = new Date();
          prog.updatedAt = new Date();
        }
      }

      passedSubjects.push({
        slug: c.slug,
        titleKinya: c.titleKinya,
        titleEn: c.titleEn,
        category: c.category,
        score: examScore,
        certificateId: certId,
        completedAt: new Date().toISOString(),
      });
    }

    const averageScore = Math.round(totalScore / allCourses.length);
    const grade = averageScore >= 90 ? 'Summa Cum Laude (High Distinction)' : 'Magna Cum Laude (Distinction)';
    const masterCertificateId = `KY-MASTER-2026-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    res.json({
      success: true,
      message: 'Amasomo yose yatsinzwe neza! Impamyabumenyi y\'Ikirenga (Master Certificate of All Subjects) iriteguye!',
      masterCertificate: {
        certificateId: masterCertificateId,
        studentRealName,
        subjects: passedSubjects,
        totalSubjects: allCourses.length,
        averageScore,
        grade,
        issuedAt: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
