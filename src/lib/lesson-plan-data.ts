
export interface LessonPlan {
    title: string;
    grade: string;
    subject: string;
    academic_year: string;
    terms: Term[];
    general_strategies: string[];
}

export interface Term {
    term_name: string;
    months: Month[];
}

export interface Month {
    month: string;
    chapters: Chapter[];
}

export interface Chapter {
    name: string;
    topics: string[];
    learning_objectives: string[];
    key_concepts: string[];
    activities: string[];
    assessments: string[];
}

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
                        {
                            name: "Chapter 1: Food: Where Does It Come From?",
                            topics: [],
                            learning_objectives: [
                                "Identify sources of food.",
                                "Understand food habits of animals (herbivores, carnivores, omnivores).",
                                "Classify food ingredients.",
                            ],
                            key_concepts: [
                                "Food variety, plant parts as food, animal products.",
                                "Food chains (basic).",
                            ],
                            activities: [
                                "Discussing diverse food items.",
                                "Chart making of food sources.",
                                "Observation of animal eating habits (videos/pictures).",
                            ],
                            assessments: ["Short answer questions.", "Class discussion."],
                        },
                        {
                            name: "Chapter 2: Components of Food",
                            topics: [],
                            learning_objectives: [
                                "Identify various components of food (carbohydrates, proteins, fats, vitamins, minerals, roughage, water).",
                                "Understand their importance.",
                            ],
                            key_concepts: ["Balanced diet, deficiency diseases.", "Food tests (starch, protein, fat)."],
                            activities: [
                                "Simple food tests in class (if possible).",
                                "Preparing a balanced diet chart.",
                                "Group presentation on deficiency diseases.",
                            ],
                            assessments: [
                                "Practical demonstration evaluation.",
                                "Concept map on food components.",
                            ],
                        },
                    ],
                },
                {
                    month: "August",
                    chapters: [
                        {
                            name: "Chapter 3: Fibre to Fabric",
                            topics: [],
                            learning_objectives: [
                                "Differentiate between natural and synthetic fibres.",
                                "Understand the process of making yarn from fibre and fabric from yarn.",
                            ],
                            key_concepts: ["Cotton, jute, wool, silk.", "Spinning, weaving, knitting."],
                            activities: [
                                "Hands-on activity of separating cotton fibres.",
                                "Visiting a local weaver (if feasible).",
                                "Making a small knitted/woven sample.",
                            ],
                            assessments: [
                                "Identification of different fabrics.",
                                "Flow chart of fibre to fabric process.",
                            ],
                        },
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
                        {
                            name: "Chapter 7: Getting to Know Plants",
                            topics: [],
                            learning_objectives: [
                                "Identify different parts of a plant (root, stem, leaf, flower).",
                                "Understand their functions.",
                                "Classify plants (herbs, shrubs, trees).",
                            ],
                            key_concepts: ["Photosynthesis (basic idea), pollination (basic idea).", "Venation, taproot/fibrous root."],
                            activities: [
                                "Plant dissection (observing parts).",
                                "Sketching different plant types.",
                                "Nature walk to observe local flora.",
                            ],
                            assessments: [
                                "Labeled diagram of a plant.",
                                "Identification of plant parts.",
                            ],
                        },
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
