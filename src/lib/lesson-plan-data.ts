

export interface Overview {
    chapter: string;
    class: string;
    subject: string;
    timeAllotment: string;
    learningGoals: string;
}

export interface Section {
    title: string;
    time: string;
    points: string[];
    activities: string[];
}

export interface WrapUpHomework {
    recap: string;
    homework: string;
}

export interface LessonBreakdown {
    periodName: string;
    periodTime: string;
    sections: Section[];
    wrapUpHomework: WrapUpHomework | null;
}

export interface DifferentiationSupport {
    strugglingLearners: string[];
    advancedLearners: string[];
}

export interface Chapter {
    chapterTitle: string;
    overview: Overview;
    lessonBreakdown: LessonBreakdown[];
    differentiationSupport: DifferentiationSupport;
    possibleExtensionsProjectIdeas: string[];
    // For the old structure, keeping it for compatibility for now.
    name?: string;
    topics?: string[];
    learning_objectives?: string[];
    key_concepts?: string[];
    activities?: string[];
    assessments?: string[];
}

export interface Month {
    month: string;
    chapters: Chapter[];
}

export interface Term {
    term_name: string;
    months: Month[];
}

export interface LessonPlan {
    title: string;
    grade: string;
    subject: string;
    academic_year: string;
    terms: Term[];
    general_strategies: string[];
}


export const dummyChapter: Chapter = {
  chapterTitle: "Food: Where Does It Come From?",
  overview: {
    chapter: "Food: Where Does It Come From?",
    class: "6th",
    subject: "Science",
    timeAllotment: "3-4 Periods (approx. 1.5 - 2 hours)",
    learningGoals: "Students will be able to identify diverse food sources, categorize animals based on their eating habits, and understand the role of different plant parts as food."
  },
  lessonBreakdown: [
    {
      periodName: "Period 1: Food Variety and Ingredients",
      periodTime: "Approx. 40-45 min",
      sections: [
        {
          title: "Introduction",
          time: "10 min",
          points: [
            "Start with a brainstorming session: 'What did you eat for breakfast/lunch today?'",
            "Lead into the idea that we eat many different kinds of food.",
            "Ask, 'Do all your friends eat the same food?'"
          ],
          activities: [
            "Divide students into small groups. Ask them to discuss and list 5-7 food items they ate yesterday. Have a few groups share."
          ]
        },
        {
          title: "Food Variety",
          time: "15 min",
          points: [
            "Discuss the diversity of food across different regions/cultures (e.g., idli in South India, roti-sabzi in North India, pasta in Italy)."
          ],
          activities: [
            "Show pictures if available.",
            "'Guess the Dish' game – describe ingredients of a dish and have students guess."
          ]
        },
        {
          title: "Food Ingredients",
          time: "15 min",
          points: [
            "Choose 2-3 common dishes (e.g., Chapati/Roti, Dal/Curry, Rice).",
            "Ask students: 'What is Chapati made of?' (Flour, water). 'What about Dal?' (Pulses, water, salt, oil/ghee, spices).",
            "Introduce the term 'ingredients.'"
          ],
          activities: [
            "Hand out a worksheet with a few simple dishes and ask students to list their ingredients."
          ]
        }
      ],
      wrapUpHomework: {
        recap: "Food variety, concept of ingredients.",
        homework: "Ask students to observe their dinner tonight and list 3 dishes with their ingredients."
      }
    },
    {
      periodName: "Period 2: Food Sources - Plants",
      periodTime: "Approx. 40-45 min",
      sections: [
        {
          title: "Recap",
          time: "5 min",
          points: [
            "Quick review of last class: What are ingredients? Name ingredients of two dishes."
          ],
          activities: []
        },
        {
          title: "Sources of Food",
          time: "20 min",
          points: [
            "Pose the question: 'Where do these ingredients come from?'",
            "Introduce two main sources: plants and animals.",
            "Focus on Plant Sources: Discuss different plant parts as food (Roots, Stems, Leaves, Fruits, Flowers, Seeds)."
          ],
          activities: [
            "Show pictures of plants and their parts. Ask students to identify which part we eat. Or, display some real samples (e.g., a potato, a spinach leaf) and ask which part it is."
          ]
        }
      ],
      wrapUpHomework: {
        recap: "Plant parts as food sources.",
        homework: "Draw and label a plant, indicating the parts we eat. List 5 foods that come from plants."
      }
    }
  ],
  differentiationSupport: {
    strugglingLearners: [
      "Provide visual aids (pictures, flashcards) consistently.",
      "Use simpler language and repeat key terms.",
      "Pair them with stronger students for group activities.",
      "Offer sentence starters for written tasks."
    ],
    advancedLearners: [
      "Encourage them to research unusual food sources (e.g., specific mushrooms, edible insects).",
      "Challenge them to create a 'food chain' diagram.",
      "Ask them to explain the concept of 'food security' in simple terms."
    ]
  },
  possibleExtensionsProjectIdeas: [
    "'My Food Journal': Students maintain a journal for a week, noting what they eat and identifying the source of each ingredient.",
    "'Food Source Collage': Students create a collage categorizing food items into plant and animal sources using magazine cutouts or drawings.",
    "'Animal Diet Chart': A large chart showing various animals and their corresponding diet type with pictures.",
    "'Edible Plant Parts Display': Students bring a small sample or drawing of different edible plant parts and explain them."
  ]
};


export const dummyLessonPlan: LessonPlan = {
    title: "Yearly Lesson Planner: Class 6th Science",
    grade: "6th",
    subject: "Science",
    academic_year: "2025-2026",
    terms: [
        {
            term_name: "Term 1: Foundations & Living World",
            months: [
                {
                    month: "July",
                    chapters: [
                        {...dummyChapter, name: "Chapter 1: Food: Where Does It Come From?", chapterTitle: "Food: Where Does It Come From?"},
                        {...dummyChapter, name: "Chapter 2: Components of Food", chapterTitle: "Components of Food", overview: {...dummyChapter.overview, chapter: "Components of Food"}},
                    ],
                },
                {
                    month: "August",
                    chapters: [
                       {...dummyChapter, name: "Chapter 3: Fibre to Fabric", chapterTitle: "Fibre to Fabric", overview: {...dummyChapter.overview, chapter: "Fibre to Fabric"}},
                    ],
                },
            ],
        },
        {
            term_name: "Term 2: Motion, Light & Electricity",
            months: [
                {
                    month: "October",
                    chapters: [
                        {...dummyChapter, name: "Chapter 7: Getting to Know Plants", chapterTitle: "Getting to Know Plants", overview: {...dummyChapter.overview, chapter: "Getting to Know Plants"}},
                    ],
                },
            ],
        },
    ],
    general_strategies: [
        "Hands-on Activities & Experiments: Integrate as many practical activities as possible.",
        "Group Work & Discussions: Encourage collaborative learning and critical thinking.",
        "Real-life Connections: Relate concepts to students' daily experiences.",
        "Visual Aids: Use diagrams, charts, videos, and models.",
        "Field Trips: If possible, arrange visits to a science center, botanical garden, or local industry.",
        "Differentiated Instruction: Cater to diverse learning styles and needs.",
        "Formative Assessment: Regularly check understanding through quizzes, observations, and discussions.",
        "Summative Assessment: Conduct unit tests and end-of-term examinations.",
        "Review and Reinforce: Regularly revisit previously taught concepts.",
    ]
};
