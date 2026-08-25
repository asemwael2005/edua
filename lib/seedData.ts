import {
  Student,
  Session,
  Quiz,
  Assignment,
  CurriculumMilestone,
  SessionFeedback,
  GradeLog,
  AssignmentSubmission,
  QuizSubmission,
  RecordedVideo,
} from '@/types/edupulse';

export const initialVideos: RecordedVideo[] = [
  {
    id: 'vid_1',
    title: 'تسجيل المحاضرة 5: التفاضل الضمني والمعدلات الزمنية',
    subject: 'الرياضيات التطبيقية',
    grade: 'الصف الثالث الثانوي',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=600',
    duration: '01:45:00',
    description: 'تسجيل مسجل بالكامل لشرح درس المعدلات الزمنية مع حل 15 مسألة امتحان من الأعوام السابقة.',
    createdAt: '2026-08-25',
    viewsCount: 142,
  },
  {
    id: 'vid_2',
    title: 'تسجيل المحاضرة 4: الفيزياء الحديثة والظاهرة الكهرودوئية',
    subject: 'الفيزياء',
    grade: 'الصف الثالث الثانوي',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=600',
    duration: '02:10:00',
    description: 'شرح معادلة أينشتاين الكهروضوئية وتطبيقات ثابت بلانك.',
    createdAt: '2026-08-23',
    viewsCount: 98,
  }
];

export const initialStudents: Student[] = [
  {
    id: 'std_1',
    name: 'أحمد محمود العباسي (Ahmed Mahmoud)',
    email: 'ahmed.mahmoud@edupulse.edu',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    parentPhone: '+20 101 234 5678',
    studentPhone: '+20 111 234 5678',
    grade: 'الصف الثالث الثانوي (Grade 12)',
    attendanceRate: 96,
    totalPoints: 485,
    joinedDate: '2025-09-01',
  },
  {
    id: 'std_2',
    name: 'سارة علي حسن (Sara Ali)',
    email: 'sara.ali@edupulse.edu',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
    parentPhone: '+20 102 345 6789',
    studentPhone: '+20 112 345 6789',
    grade: 'الصف الثالث الثانوي (Grade 12)',
    attendanceRate: 100,
    totalPoints: 520,
    joinedDate: '2025-09-01',
  },
  {
    id: 'std_3',
    name: 'خالد حسن إبراهيم (Khaled Hassan)',
    email: 'khaled.hassan@edupulse.edu',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    parentPhone: '+20 103 456 7890',
    studentPhone: '+20 113 456 7890',
    grade: 'الصف الثاني الثانوي (Grade 11)',
    attendanceRate: 88,
    totalPoints: 410,
    joinedDate: '2025-09-15',
  },
  {
    id: 'std_4',
    name: 'عمر فاروق الشافعي (Omar Farouk)',
    email: 'omar.farouk@edupulse.edu',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    parentPhone: '+20 104 567 8901',
    studentPhone: '+20 114 567 8901',
    grade: 'الصف الثالث الثانوي (Grade 12)',
    attendanceRate: 75,
    totalPoints: 340,
    banDetails: {
      active: false,
      type: 'temp',
      startDate: new Date(Date.now() - 86400000).toISOString(),
      endDate: new Date(Date.now() + 86400000 * 2).toISOString(),
      reason: 'تأخر متكرر وعدم تسليم الواجب لأسبوعين متتاليين (Repeated absence)',
      appliedBy: 'د. محمد الكردي',
    },
    joinedDate: '2025-10-01',
  },
  {
    id: 'std_5',
    name: 'ليلى يوسف القاضي (Layla Youssef)',
    email: 'layla.youssef@edupulse.edu',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250',
    parentPhone: '+20 105 678 9012',
    studentPhone: '+20 115 678 9012',
    grade: 'الصف الأول الثانوي (Grade 10)',
    attendanceRate: 92,
    totalPoints: 460,
    joinedDate: '2025-09-10',
  },
  {
    id: 'std_6',
    name: 'نور الدين مصطفى (Nour El-Din)',
    email: 'nour.mustafa@edupulse.edu',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250',
    parentPhone: '+20 106 789 0123',
    studentPhone: '+20 116 789 0123',
    grade: 'الصف الثالث الثانوي (Grade 12)',
    attendanceRate: 60,
    totalPoints: 290,
    banDetails: {
      active: true,
      type: 'temp',
      startDate: new Date(Date.now() - 3600000 * 5).toISOString(),
      endDate: new Date(Date.now() + 3600000 * 43).toISOString(), // ~1.8 days remaining
      reason: 'مخالفة قواعد الانضباط بالقاعة الإلكترونية والتأخر في التكليفات',
      appliedBy: 'إدارة المتابعة',
    },
    joinedDate: '2025-10-12',
  },
];

export const initialSessions: Session[] = [
  {
    id: 'sess_1',
    title: 'المحاضرة 5: التفاضل والتكامل والتطبيقات الفيزيائية (Calculus & Physics Apps)',
    subject: 'الرياضيات التطبيقية (Mathematics)',
    grade: 'الصف الثالث الثانوي (Grade 12)',
    date: '2026-08-25',
    time: '17:00 - 19:30',
    room: 'القاعة الرئيسية A1',
    description: 'شرح مفصل لمفهوم المعدلات الزمنية المرتبطة مع تطبيقات عملية وحل 15 مسألة من امتحانات الأعوام السابقة.',
    slides: [
      {
        id: 'sld_1',
        slideNumber: 1,
        title: 'مقدمة المحاضرة والأهداف التعلمية',
        content: 'أهلاً بكم في المحاضرة الخامسة من كورس الرياضيات المتقدمة. سنتناول اليوم المعدلات الزمنية المرتبطة والنهايات.',
        bulletPoints: [
          'مراجعة سريعة لقواعد الاشتقاق الضمني',
          'خطوات حل مسائل المعدلات الزمنية',
          'التطبيقات الهندسية: التمدد والانكماش',
          'حل تمارين متقدمة من امتحانات الوزارة'
        ],
        notes: 'يرجى فتح كتاب التمارين صفحة 45'
      },
      {
        id: 'sld_2',
        slideNumber: 2,
        title: 'قانون الاشتقاق بالنسبة للزمن t',
        content: 'عند اشتقاق علاقة تحتوي متغيرة بالنسبة للزمن t، نطبق قاعدة السلسلة (Chain Rule).',
        codeOrDiagram: 'd/dt [ f(x, y) ] = (∂f/∂x)*(dx/dt) + (∂f/∂y)*(dy/dt)',
        bulletPoints: [
          'تحديد المتغيرات الدائمة والمؤقتة',
          'التعويض بالقيم المعطاة فقط بعد الاشتقاق',
          'مراعاة إشارات المعدل: (+) للزيادة و (-) للنقصان'
        ]
      },
      {
        id: 'sld_3',
        slideNumber: 3,
        title: 'مسألة تطبيقية: تسرب السوائل في الخزان المخروطي',
        content: 'خزان مياه على شكل مخروط دائري قائم رأسه إلى أسفل، ارتفاعه 12 متر ونصف قطر قاعدته 4 أمتار. يتسرب منه الماء بمعدل 2 م³/دقيقة.',
        bulletPoints: [
          'العلاقة بين نصف القطر r والارتفاع h: r = h / 3',
          'حجم المخروط V = (1/3) * π * r² * h',
          'بالتعويض: V = (1/27) * π * h³',
          'الاشتقاق: dV/dt = (1/9) * π * h² * (dh/dt)'
        ]
      },
      {
        id: 'sld_4',
        slideNumber: 4,
        title: 'حل المسألة والملاحظات التكتيكية',
        content: 'المطلوب حساب dh/dt عندما يكون عمق الماء 6 أمتار.',
        codeOrDiagram: '-2 = (1/9) * π * (6)² * (dh/dt)  =>  -2 = 4π * (dh/dt)  =>  dh/dt = -1 / (2π) m/min',
        bulletPoints: [
          'السرعة بالسالب لأن منسوب الماء ينخفض',
          'الانتباه لوحدات القياس (متر/دقيقة vs سم/ثانية)'
        ]
      },
      {
        id: 'sld_5',
        slideNumber: 5,
        title: 'تطبيقات الأشكال الهندسة والظل',
        content: 'رجل طوله 1.8 متر يسير مبتعداً عن عمود كهرباء ارتفاعه 5.4 متر بسرعة 1.2 م/ث.',
        bulletPoints: [
          'تشابه المثلثات لحساب طول الظل y بالنسبة لموقع الرجل x',
          'y / (x + y) = 1.8 / 5.4 = 1/3',
          '3y = x + y  =>  2y = x',
          'معدل تغير طول الظل dy/dt = 0.5 * dx/dt = 0.6 m/s'
        ]
      },
      {
        id: 'sld_6',
        slideNumber: 6,
        title: 'الملخص والواجب المنزلي',
        content: 'تم بحمد الله شرح الدرس. الواجب المطلوب تسليمه قبل المحاضرة القادمة:',
        bulletPoints: [
          'حل المسائل من 1 إلى 8 بالصفحة 52',
          'تسليم الواجب على منصة إديو بلس في قسم الواجبات',
          'الاختبار القصير سيبدأ غداً الساعة 6 مساءً'
        ]
      }
    ],
    attendance: {
      std_1: 'present',
      std_2: 'present',
      std_3: 'present',
      std_4: 'late',
      std_5: 'present',
      std_6: 'absent',
    },
    studentProgress: {
      std_1: 6,
      std_2: 6,
      std_3: 4,
      std_4: 2,
      std_5: 5,
      std_6: 1,
    }
  },
  {
    id: 'sess_2',
    title: 'المحاضرة 4: الفيزياء الحديثة والظاهرة الكهرودوئية (Modern Physics)',
    subject: 'الفيزياء (Physics)',
    grade: 'الصف الثالث الثانوي (Grade 12)',
    date: '2026-08-22',
    time: '15:00 - 17:30',
    room: 'المختبر الفيزيائي B2',
    description: 'دراسة معادلة أينشتاين للظاهرة الكهرودوئية ودالة الشغل وتردد الحرج.',
    slides: [
      {
        id: 'sld_201',
        slideNumber: 1,
        title: 'ظاهرة كومتون والتأثير الكهروضوئي',
        content: 'مقدمة في طبيعة الفوتونات وتردد الحرج E_k = h*ν - E_w.',
        bulletPoints: ['دالة الشغل للمعدن', 'طاقة الحركة للإلكترونات المنبعثة']
      },
      {
        id: 'sld_202',
        slideNumber: 2,
        title: 'معادلة أينشتاين الكهروضوئية',
        content: 'E = h * f  وحساب طاقة الفوتون الساقط.',
        bulletPoints: ['ثابت بلانك h = 6.625 x 10^-34 J.s', 'طبيعة الفوتون الجسيمية']
      }
    ],
    attendance: {
      std_1: 'present',
      std_2: 'present',
      std_3: 'late',
      std_4: 'excused',
      std_5: 'present',
      std_6: 'absent',
    },
    studentProgress: {
      std_1: 2,
      std_2: 2,
      std_3: 2,
      std_4: 1,
      std_5: 2,
      std_6: 0,
    }
  }
];

export const initialQuizzes: Quiz[] = [
  {
    id: 'quiz_1',
    title: 'الاختبار الإلكتروني الشامل 3: التفاضل والمعدلات الزمنية',
    subject: 'الرياضيات (Mathematics)',
    grade: 'الصف الثالث الثانوي',
    durationMinutes: 20,
    scheduledStart: new Date(Date.now() - 3600000 * 24).toISOString(),
    scheduledEnd: new Date(Date.now() + 3600000 * 48).toISOString(),
    isOpen: true,
    questions: [
      {
        id: 'q1',
        text: 'إذا كان معدل تغير نصف قطر كورة يزداد بمعدل 0.5 سم/ث، فإن معدل تغير حجم الكورة عندما يكون نصف القطر 4 سم يساوي:',
        type: 'mcq',
        options: ['32π سم³/ث', '16π سم³/ث', '64π سم³/ث', '8π سم³/ث'],
        correctAnswer: 0, // 32π
        explanation: 'V = (4/3)π r³  =>  dV/dt = 4π r² (dr/dt) = 4 * π * (16) * 0.5 = 32π سم³/ث.',
        points: 5
      },
      {
        id: 'q2',
        text: 'اشتقاق الدالة الضمنية x² + y² = 25 بالنسبة للزمن عند النقطة (3, 4) إذا كان dx/dt = 2 يكون dy/dt مساوياً لـ -1.5',
        type: 'true_false',
        options: ['صح (True)', 'خطأ (False)'],
        correctAnswer: true,
        explanation: '2x(dx/dt) + 2y(dy/dt) = 0  =>  2(3)(2) + 2(4)(dy/dt) = 0  =>  12 + 8(dy/dt) = 0  =>  dy/dt = -12/8 = -1.5.',
        points: 5
      },
      {
        id: 'q3',
        text: 'في المثلث قائم الزاوية، إذا كان طول الضلع الأول يزداد بمعدل 3 سم/ث والضلع الثاني ينقص بمعدل 4 سم/ث فإن مساحة المثلث تكون دائمًا ثابته.',
        type: 'true_false',
        options: ['صح (True)', 'خطأ (False)'],
        correctAnswer: false,
        explanation: 'معدل تغير المساحة يعتمد على أطوال الأضلاع في تلك اللحظة: dA/dt = 0.5 * (x dy/dt + y dx/dt) ولا يكون صفراً دائماً.',
        points: 5
      },
      {
        id: 'q4',
        text: 'إذا كانت ص = جا(3 س)، فإن د٢ص/د س٢ تساوي:',
        type: 'mcq',
        options: ['-9 جا(3 س)', '9 جتا(3 س)', '-3 جا(3 س)', '-9 جتا(3 س)'],
        correctAnswer: 0,
        explanation: 'دص/دس = 3 جتا(3س)، المشتقة الثانية د٢ص/دس٢ = -9 جا(3س).',
        points: 5
      }
    ]
  },
  {
    id: 'quiz_2',
    title: 'اختبار الفيزياء الحديثة والكمية (Quantum & Modern Physics)',
    subject: 'الفيزياء',
    grade: 'الصف الثالث الثانوي',
    durationMinutes: 15,
    scheduledStart: new Date(Date.now() - 3600000 * 48).toISOString(),
    scheduledEnd: new Date(Date.now() - 3600000 * 2).toISOString(),
    isOpen: false,
    questions: [
      {
        id: 'q201',
        text: 'طاقة الفوتون تتناسب طردياً مع طوله الموجي.',
        type: 'true_false',
        options: ['صح (True)', 'خطأ (False)'],
        correctAnswer: false,
        explanation: 'طاقة الفوتون E = hc / λ تتناسب عكسياً مع الطول الموجي λ وطردياً مع التردد ν.',
        points: 10
      }
    ]
  },
  {
    id: 'quiz_g10_1',
    title: 'اختبار الجبر والمعادلات - الصف الأول الثانوي (Grade 10)',
    subject: 'الرياضيات',
    grade: 'الصف الأول الثانوي (Grade 10)',
    durationMinutes: 15,
    scheduledStart: new Date(Date.now() - 3600000 * 24).toISOString(),
    scheduledEnd: new Date(Date.now() + 3600000 * 72).toISOString(),
    isOpen: true,
    questions: [
      {
        id: 'q_g10_1',
        text: 'إذا كان مميز المعادلة التربيعية س² - 6س + ك = 0 يقع في حقيقيين متساويين، فإن قيمة ك تساوي:',
        type: 'mcq',
        options: ['9', '6', '36', '-9'],
        correctAnswer: 0,
        explanation: 'المميز ب² - 4أ جـ = 0  =>  (-6)² - 4(1)(ك) = 0  =>  36 - 4ك = 0  =>  ك = 9.',
        points: 5
      },
      {
        id: 'q_g10_2',
        text: 'مجموع قياسات الزوايا الداخلية للشكل الخماسي المنتظم تساوي 540 درجة.',
        type: 'true_false',
        options: ['صح (True)', 'خطأ (False)'],
        correctAnswer: true,
        explanation: 'قانون مجموع الزوايا (ن - 2) × 180 = (5 - 2) × 180 = 3 × 180 = 540 درجة.',
        points: 5
      },
      {
        id: 'q_g10_3',
        text: 'إذا كانت جا(س) = 0.5 حيث س زاوية حادة، فإن قياس س بالدرجات يساوي:',
        type: 'mcq',
        options: ['30°', '45°', '60°', '90°'],
        correctAnswer: 0,
        explanation: 'جا(30°) = 0.5، وبالتالي الزاوية الحادة س = 30 درجة.',
        points: 5
      }
    ]
  },
  {
    id: 'quiz_g11_1',
    title: 'اختبار حساب المثلثات والجبر - الصف الثاني الثانوي (Grade 11)',
    subject: 'الرياضيات',
    grade: 'الصف الثاني الثانوي (Grade 11)',
    durationMinutes: 15,
    scheduledStart: new Date(Date.now() - 3600000 * 24).toISOString(),
    scheduledEnd: new Date(Date.now() + 3600000 * 72).toISOString(),
    isOpen: true,
    questions: [
      {
        id: 'q_g11_1',
        text: 'في أي مثلث أ ب جـ، أ / جا أ = ب / جا ب = 2 نق (حيث نق نصف قطر الدائرة المارة برؤوسه).',
        type: 'true_false',
        options: ['صح (True)', 'خطأ (False)'],
        correctAnswer: true,
        explanation: 'هذا هو قانون الجيب الأساسي لنسب أضلاع المثلث إلى جيب الزوايا المقابلة.',
        points: 10
      }
    ]
  }
];

export const initialAssignments: Assignment[] = [
  {
    id: 'asg_1',
    title: 'واجب تطبيق المعدلات الزمنية والتفاضل الضمني',
    subject: 'الرياضيات',
    grade: 'الصف الثالث الثانوي',
    description: 'قم بحل المسائل من صفحة 50 إلى 54 من الكتاب المدرسي وكتابة الخطوات التفصيلية ورسم الأشكال الهندسي.',
    deadline: new Date(Date.now() + 86400000 * 3).toISOString(),
    maxScore: 20,
    createdAt: '2026-08-23',
  },
  {
    id: 'asg_2',
    title: 'تقرير التجارب الكهروضوئية وحساب ثابت بلانك',
    subject: 'الفيزياء',
    grade: 'الصف الثالث الثانوي',
    description: 'كتابة ملخص تجربة التأثير الكهروضوئي ورسم العلاقة البيانية بين طاقة الحركة وتردد الضوء الساقط.',
    deadline: new Date(Date.now() + 86400000 * 5).toISOString(),
    maxScore: 15,
    createdAt: '2026-08-24',
  }
];

export const initialAssignmentSubmissions: AssignmentSubmission[] = [
  {
    id: 'asgn_sub_1',
    assignmentId: 'asg_1',
    studentId: 'std_2',
    submittedAt: '2026-08-24T12:30:00Z',
    content: 'تم حل كامل تمارين الكتاب المدرسي ورسم الأشكال بصيغة PDF. الرابط: https://drive.google.com/file/d/sara-hw-calculus.pdf',
    status: 'graded',
    score: 20,
    teacherFeedback: 'حل ممتاز ودقيق جداً! خطوات واضحة والتزام بالوحدات. أحسنتِ يا سارة.',
    gradedAt: '2026-08-24T14:00:00Z'
  },
  {
    id: 'asgn_sub_2',
    assignmentId: 'asg_1',
    studentId: 'std_1',
    submittedAt: '2026-08-24T15:10:00Z',
    content: 'حل تمارين المعدلات الزمنية الضمنية. الإجابات مرفقة بالكامل.',
    status: 'graded',
    score: 18,
    teacherFeedback: 'ممتاز يا أحمد، ولكن انتبه لإشارة تناقص الحجم في السؤال الرابع.',
    gradedAt: '2026-08-24T16:20:00Z'
  },
  {
    id: 'asgn_sub_3',
    assignmentId: 'asg_1',
    studentId: 'std_3',
    submittedAt: '2026-08-24T18:00:00Z',
    content: 'قمت بحل المسائل من 1 إلى 6 ورسم مخروط التسرب.',
    status: 'submitted'
  }
];

export const initialCurriculum: CurriculumMilestone[] = [
  {
    id: 'cur_1',
    title: 'الوحدة الأولى: الاشتقاق وتطبيقاته (Differentiation & Applications)',
    subject: 'الرياضيات',
    grade: 'الصف الثالث الثانوي',
    status: 'completed',
    progressPercent: 100,
    estimatedWeeks: '3 أسابيع',
    topics: ['اشتقاق الدوال المثلثية', 'الاشتقاق الضمني والبارامتري', 'المشتقات العليا للدالة']
  },
  {
    id: 'cur_2',
    title: 'الوحدة الثانية: المعدلات الزمنية وسلوك الدالة (Time Rates & Function Behavior)',
    subject: 'الرياضيات',
    grade: 'الصف الثالث الثانوي',
    status: 'in_progress',
    progressPercent: 65,
    estimatedWeeks: '4 أسابيع',
    topics: ['المعدلات الزمنية المرتبطة', 'فترات التزايد والتناقص', 'النقاط الحرجة والنهايات العظمى والصغرى', 'رسم المنحنيات']
  },
  {
    id: 'cur_3',
    title: 'الوحدة الثالثة: التكامل وتطبيقات المساحات والحجوم (Integration & Volumes)',
    subject: 'الرياضيات',
    grade: 'الصف الثالث الثانوي',
    status: 'upcoming',
    progressPercent: 0,
    estimatedWeeks: '5 أسابيع',
    topics: ['التكامل المحدد وغير المحدد', 'تكامل الدوال الأسية واللوغاريتمية', 'حساب المساحات وحجوم الأجسام الدورانية']
  }
];

export const initialFeedback: SessionFeedback[] = [
  {
    id: 'fb_1',
    sessionId: 'sess_1',
    sessionTitle: 'المحاضرة 5: التفاضل والتكامل والتطبيقات الفيزيائية',
    studentId: 'std_2',
    studentName: 'سارة علي حسن',
    rating: 5,
    tags: ['شرح ممتاز', 'سلايدات واضحة', 'حل مسائل امتحانات'],
    comment: 'محاضرة رائعة جداً والسلايدات التفاعلية سهلت فهم مسألة خزان المياه المخروطي كثيراً!',
    submittedAt: '2026-08-24T19:40:00Z'
  },
  {
    id: 'fb_2',
    sessionId: 'sess_1',
    sessionTitle: 'المحاضرة 5: التفاضل والتكامل والتطبيقات الفيزيائية',
    studentId: 'std_1',
    studentName: 'أحمد محمود العباسي',
    rating: 5,
    tags: ['تفاعل عالي', 'أمثلة عملية'],
    comment: 'ملاحظات القوانين بالسلايد رقم 3 كانت في غاية الأهمية. شكراً جزيلاً يا دكتور.',
    submittedAt: '2026-08-24T20:00:00Z'
  },
  {
    id: 'fb_3',
    sessionId: 'sess_2',
    sessionTitle: 'المحاضرة 4: الفيزياء الحديثة والظاهرة الكهرودوئية',
    studentId: 'std_5',
    studentName: 'ليلى يوسف القاضي',
    rating: 4,
    tags: ['محتوى قوي'],
    comment: 'الشرح كان ممتازاً ونحتاج لزيادة عدد مسائل دوال الشغل الكهروضوئية في المرة القادمة.',
    submittedAt: '2026-08-23T18:15:00Z'
  }
];

export const initialGradeLogs: GradeLog[] = [
  {
    id: 'glog_1',
    studentId: 'std_2',
    studentName: 'سارة علي حسن',
    amount: 10,
    type: 'bonus',
    reason: 'درجة كاملة في الاختبار الإلكتروني والتفوق في حل المسألة التحدي',
    adminName: 'د. محمد الكردي',
    date: '2026-08-24T14:00:00Z'
  },
  {
    id: 'glog_2',
    studentId: 'std_1',
    studentName: 'أحمد محمود العباسي',
    amount: 5,
    type: 'bonus',
    reason: 'التفاعل المتميز بالقاعة والمشاركة في الإجابة السريعة',
    adminName: 'م. أحمد الشريف',
    date: '2026-08-24T17:30:00Z'
  },
  {
    id: 'glog_3',
    studentId: 'std_4',
    studentName: 'عمر فاروق الشافعي',
    amount: -5,
    type: 'deduction',
    reason: 'خصم بسبب عدم تسليم الواجب في الوقت المحدد',
    adminName: 'إدارة المتابعة',
    date: '2026-08-20T10:00:00Z'
  }
];

export const initialQuizSubmissions: QuizSubmission[] = [
  {
    id: 'qsub_1',
    quizId: 'quiz_1',
    studentId: 'std_2',
    submittedAt: '2026-08-24T13:00:00Z',
    answers: [
      { questionId: 'q1', selectedAnswer: 0, isCorrect: true, pointsEarned: 5 },
      { questionId: 'q2', selectedAnswer: true, isCorrect: true, pointsEarned: 5 },
      { questionId: 'q3', selectedAnswer: false, isCorrect: true, pointsEarned: 5 },
      { questionId: 'q4', selectedAnswer: 0, isCorrect: true, pointsEarned: 5 }
    ],
    totalScore: 20,
    maxScore: 20,
    percentage: 100,
    timeSpentSeconds: 740
  },
  {
    id: 'qsub_2',
    quizId: 'quiz_1',
    studentId: 'std_1',
    submittedAt: '2026-08-24T14:20:00Z',
    answers: [
      { questionId: 'q1', selectedAnswer: 0, isCorrect: true, pointsEarned: 5 },
      { questionId: 'q2', selectedAnswer: true, isCorrect: true, pointsEarned: 5 },
      { questionId: 'q3', selectedAnswer: true, isCorrect: false, pointsEarned: 0 },
      { questionId: 'q4', selectedAnswer: 0, isCorrect: true, pointsEarned: 5 }
    ],
    totalScore: 15,
    maxScore: 20,
    percentage: 75,
    timeSpentSeconds: 980
  }
];
