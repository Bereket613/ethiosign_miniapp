const MEDIA_BASE = import.meta.env ? import.meta.env.BASE_URL || "/" : "/";

const DEMO_NOTICE =
  "Demo content. Replace with the authorized course material provided by the client.";

export { MEDIA_BASE };

function mediaPath(publicPath) {
  return `${MEDIA_BASE}${publicPath.replace(/^\//, "")}`;
}

function demoTranscript(title) {
  return `This is a demo transcript for "${title}". ${DEMO_NOTICE} The full transcript will appear here once the lesson video is added.`;
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const SECTION_IDS = ["overview", "facilitator", "peer", "self-paced"];

function lesson(moduleNumber, sectionId, index, title, options = {}) {
  const number = String(index).padStart(2, "0");
  const slug = options.slug || slugify(title);
  return {
    id: `m${moduleNumber}-${sectionId}-${number}`,
    title,
    description: options.description || "Demo lesson. Replace with the authorized course content.",
    duration: options.duration || "2:00",
    originalVideo: mediaPath(`/videos/modules/module-${moduleNumber}/${sectionId}/${slug}.mp4`),
    signVideo: mediaPath(`/videos/signs/module-${moduleNumber}/${slug}.mp4`),
    captions: mediaPath(`/captions/module-${moduleNumber}/${slug}.vtt`),
    transcript: options.transcript || demoTranscript(title),
    completed: false,
    demo: true,
  };
}

function makeSections(moduleNumber, titles, lessonsBySection) {
  return SECTION_IDS.map((id, i) => ({
    id,
    title: titles[i],
    lessons: lessonsBySection[id],
  }));
}

const m1Lessons = {
  overview: [
    lesson(1, "overview", 1, "Teacher and Student Wellbeing", {
      slug: "wellbeing",
      duration: "0:06",
      description:
        "Why wellbeing matters for teachers and students, and simple ways to protect it.",
      transcript:
        "Teacher wellbeing is an important component of effective teaching. " +
        "Teachers working in crisis-affected settings face unique challenges. " +
        "Supporting teachers improves learning outcomes for every student. " +
        "In this lesson, we explore practical ways to care for teacher and student wellbeing.",
    }),
    lesson(1, "overview", 2, "Creating Safe and Supportive Classrooms", {
      slug: "safe-classrooms",
      description: "How to build a classroom where every learner feels safe.",
    }),
    lesson(1, "overview", 3, "Predictable Routines in Uncertain Times", {
      slug: "predictable-routines",
      description: "Using steady routines to bring calm and structure to learning.",
    }),
  ],
  facilitator: [
    lesson(1, "facilitator", 1, "Orientation to Facilitated Sessions", {
      slug: "facilitation-orientation",
      description: "What to expect from your facilitated training sessions.",
    }),
    lesson(1, "facilitator", 2, "Group Discussion and Reflection", {
      slug: "group-reflection",
      description: "Sharing experiences and reflecting together with your trainer.",
    }),
  ],
  peer: [
    lesson(1, "peer", 1, "Peer Learning Circles", {
      slug: "peer-circles",
      description: "Learning together with fellow teachers in small groups.",
    }),
    lesson(1, "peer", 2, "Giving and Receiving Feedback", {
      slug: "peer-feedback",
      description: "How to exchange helpful feedback with your peers.",
    }),
  ],
  "self-paced": [
    lesson(1, "self-paced", 1, "Study Skills for Self-Paced Learning", {
      slug: "study-skills",
      description: "Practical study habits for learning on your own schedule.",
    }),
    lesson(1, "self-paced", 2, "Checking Your Understanding", {
      slug: "self-check",
      description: "Simple ways to review what you have learned.",
    }),
  ],
};

function demoLessons(moduleNumber, sectionId, titles) {
  return titles.map((title, i) =>
    lesson(moduleNumber, sectionId, i + 1, title, {
      slug: `${sectionId}-${slugify(title)}`,
    })
  );
}

function demoSectionLessons(moduleNumber) {
  return {
    overview: demoLessons(moduleNumber, "overview", ["Course Introduction", "Key Concepts"]),
    facilitator: demoLessons(moduleNumber, "facilitator", ["Facilitator Session 1", "Facilitator Session 2"]),
    peer: demoLessons(moduleNumber, "peer", ["Peer Activity 1", "Peer Activity 2"]),
    "self-paced": demoLessons(moduleNumber, "self-paced", ["Self-Paced Lesson 1", "Self-Paced Lesson 2"]),
  };
}

export const modules = [
  {
    id: 1,
    number: 1,
    title: "Classroom Management in Crisis-Affected Settings",
    description:
      "Mastering the Classroom in Crisis: A Guide to Trauma-Informed Teaching and Management.",
    progress: 0,
    sections: makeSections(1, ["Course Overview", "Facilitator Led Training", "Peer to Peer", "Self Paced Learning"], m1Lessons),
  },
  {
    id: 2,
    number: 2,
    title: "Inclusive Quality Education Practices in Conflict-Affected Areas",
    description: "Inclusive quality education practices for every learner.",
    progress: 0,
    sections: makeSections(
      2,
      ["Course Overview", "Facilitators Led Training", "Peer to Peer Learning", "Self Learning"],
      demoSectionLessons(2)
    ),
  },
  {
    id: 3,
    number: 3,
    title: "Adaptive and Learner-Centered Teaching Methodologies",
    description: "Adaptive, learner-centered teaching for diverse classrooms.",
    progress: 0,
    sections: makeSections(
      3,
      ["Course Overview", "Facilitator Led Training", "Peer to Peer", "Self Learning"],
      demoSectionLessons(3)
    ),
  },
  {
    id: 4,
    number: 4,
    title: "Digital Literacy",
    description: "Foundational digital skills for teachers and learners.",
    progress: 0,
    sections: makeSections(
      4,
      ["Course Overview", "Facilitator Led Training", "Peer to Peer", "Self Learning"],
      demoSectionLessons(4)
    ),
  },
  {
    id: 5,
    number: 5,
    title: "Career Employability Skills",
    description: "Practical skills for employment and career growth.",
    progress: 0,
    sections: makeSections(
      5,
      ["Course Overview", "Facilitator Led Training", "Peer to Peer", "Self Learning"],
      demoSectionLessons(5)
    ),
  },
  {
    id: 6,
    number: 6,
    title: "Educational Technology Course",
    description: "Using educational technology to support teaching and learning.",
    progress: 0,
    sections: makeSections(
      6,
      ["Course Overview", "Facilitator Led Training", "Peer to Peer", "Self Learning"],
      demoSectionLessons(6)
    ),
  },
];

export function getModule(moduleId) {
  return modules.find((m) => String(m.id) === String(moduleId)) || null;
}

export function moduleLessons(module) {
  return module.sections.flatMap((s) => s.lessons);
}

export function findLesson(lessonId) {
  for (const module of modules) {
    for (const section of module.sections) {
      for (const lessonItem of section.lessons) {
        if (lessonItem.id === lessonId) {
          return { module, section, lesson: lessonItem };
        }
      }
    }
  }
  return null;
}

export const totalLessonCount = modules.reduce(
  (sum, m) => sum + moduleLessons(m).length,
  0
);
