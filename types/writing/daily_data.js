/**
 * practice/types/writing/daily_data.js
 * Daily Schedule mapping and Daily Bank dataset for COSY Daily Challenge.
 */

(function() {
    'use strict';

    window.DAILY_SCHEDULE = {
        0: 'speaking',   // Sunday
        1: 'writing',    // Monday
        2: 'grammar',    // Tuesday
        3: 'speaking',   // Wednesday
        4: 'writing',    // Thursday
        5: 'vocabulary', // Friday
        6: 'speaking'    // Saturday
    };

    window.DAILY_BANK = {
        speaking: [
            {
                id: 'SPK-01',
                title: 'Speaking Fluency Challenge',
                subtitle: 'Practice spontaneous expression and narrative coherence.',
                levels: {
                    a: {
                        prompt: 'Describe what you do every morning from waking up until breakfast.',
                        tip: 'Use simple present tense verbs like wake up, drink, eat, brush.',
                        micro: {
                            title: 'Morning Vocabulary',
                            instruction: 'Name 5 morning actions in English.',
                            example: 'wake up, brush teeth, make coffee, take shower, read news'
                        }
                    },
                    b: {
                        prompt: 'Explain your ideal weekend trip to a nearby city or natural landmark.',
                        tip: 'Include sequence markers (firstly, subsequently, eventually) and descriptive adjectives.',
                        micro: {
                            title: 'Connector Drill',
                            instruction: 'Form 3 sentences using "as soon as", "meanwhile", and "provided that".',
                            example: 'As soon as we arrive, we will check into the hotel.'
                        }
                    },
                    c: {
                        prompt: 'Discuss how remote work and digital communication have reshaped modern urban lifestyles.',
                        tip: 'Incorporate complex conditional structures and formal discourse markers.',
                        micro: {
                            title: 'Advanced Idioms',
                            instruction: 'Incorporate an idiom expressing productivity or adaptation into your argument.',
                            example: 'Hit the ground running'
                        }
                    }
                }
            },
            {
                id: 'SPK-02',
                title: 'Hobbies & Passion Project',
                subtitle: 'Articulate your personal interests and creative pursuits.',
                levels: {
                    a: {
                        prompt: 'Talk about your favorite sport or creative activity.',
                        tip: 'Focus on expressing likes and dislikes using simple reasons.',
                        micro: {
                            title: 'Hobbies List',
                            instruction: 'List 4 hobbies with matching verbs.',
                            example: 'play football, cook dinner, paint pictures, listen to music'
                        }
                    },
                    b: {
                        prompt: 'Describe a skill you learned recently and why it was challenging.',
                        tip: 'Use past simple and past continuous tenses appropriately.',
                        micro: {
                            title: 'Obstacle Vocab',
                            instruction: 'Write 3 sentences describing a difficulty you overcame.',
                            example: 'I struggled with pronunciation at first, but practice helped.'
                        }
                    },
                    c: {
                        prompt: 'Debate the importance of artistic education versus STEM disciplines in modern curricula.',
                        tip: 'Balance persuasive arguments with cohesive counter-points.',
                        micro: {
                            title: 'Rhetorical Devices',
                            instruction: 'Use a contrast connector like "notwithstanding" or "whereas".',
                            example: 'STEM skills drive technology, whereas arts foster empathy.'
                        }
                    }
                }
            }
        ],
        writing: [
            {
                id: 'WRT-01',
                title: 'Opinion & Argumentative Essay',
                subtitle: 'Craft concise, structured written responses.',
                levels: {
                    a: {
                        prompt: 'Write 3-4 sentences about your favorite season of the year and why you like it.',
                        tip: 'Use simple adjectives for weather and feelings.',
                        micro: {
                            title: 'Weather Adjectives',
                            instruction: 'Write 4 weather adjectives with positive connotations.',
                            example: 'sunny, mild, breezy, crisp'
                        }
                    },
                    b: {
                        prompt: 'Write a paragraph arguing whether social media does more harm than good for teenagers.',
                        tip: 'Structure your paragraph with a topic sentence, supporting points, and a concluding remark.',
                        micro: {
                            title: 'Linking Phrases',
                            instruction: 'Use "on the one hand" and "conversely" in your paragraph.',
                            example: 'On the one hand, it connects friends; conversely, it reduces focus.'
                        }
                    },
                    c: {
                        prompt: 'Write a persuasive memo recommending eco-friendly policies for a corporate office.',
                        tip: 'Adopt an assertive yet professional register with actionable bullet points.',
                        micro: {
                            title: 'Formal Directives',
                            instruction: 'Use modal verbs like "ought to" and "imperative".',
                            example: 'Management ought to incentivize public transit commuting.'
                        }
                    }
                }
            }
        ],
        grammar: [
            {
                id: 'GRM-01',
                title: 'Tenses & Prepositions Focus',
                subtitle: 'Master structural accuracy across past, present, and future forms.',
                levels: {
                    a: {
                        prompt: 'Fill in the blanks and practice prepositions of place: in, on, at, under.',
                        tip: 'Remember: "on" for surfaces, "in" for enclosed spaces, "at" for specific locations.',
                        micro: {
                            title: 'Preposition Sprint',
                            instruction: 'Complete: She sits ___ the desk ___ the 2nd floor.',
                            example: 'at / on'
                        }
                    },
                    b: {
                        prompt: 'Contrast Present Perfect and Past Simple in a short 5-sentence paragraph.',
                        tip: 'Use Past Simple for specific finished times and Present Perfect for ongoing life experience.',
                        micro: {
                            title: 'Time Expression Check',
                            instruction: 'Identify whether "for 3 years" or "yesterday" takes Present Perfect.',
                            example: 'for 3 years ➔ Present Perfect; yesterday ➔ Past Simple'
                        }
                    },
                    c: {
                        prompt: 'Construct 3 Third Conditional sentences reflecting on historical events.',
                        tip: 'Formula: If + had + past participle, would have + past participle.',
                        micro: {
                            title: 'Inverted Conditionals',
                            instruction: 'Rewrite "If I had known" using formal inversion.',
                            example: 'Had I known, I would have intervened.'
                        }
                    }
                }
            }
        ],
        vocabulary: [
            {
                id: 'VOC-01',
                title: 'Nuance & Precision Expansion',
                subtitle: 'Upgrade basic words with precise, high-level alternatives.',
                levels: {
                    a: {
                        prompt: 'Replace basic words like "good", "bad", "big", "small" with more vivid A1/A2 synonyms.',
                        tip: 'Try words like "wonderful", "terrible", "huge", "tiny".',
                        micro: {
                            title: 'Synonym Swap',
                            instruction: 'Find a better word for "very cold".',
                            example: 'freezing'
                        }
                    },
                    b: {
                        prompt: 'Use 5 professional vocabulary items related to meetings, deadlines, and project goals.',
                        tip: 'Focus on collocations like "meet a deadline" and "reach a consensus".',
                        micro: {
                            title: 'Collocation Pair',
                            instruction: 'Match verb with noun: (conduct, achieve, set) ➔ (goals, meeting, milestone).',
                            example: 'conduct meeting, achieve goals, set milestone'
                        }
                    },
                    c: {
                        prompt: 'Incorporate C1/C2 academic vocabulary (e.g., "ubiquitous", "pragmatic", "ephemeral") into a paragraph.',
                        tip: 'Ensure context matches formal written style.',
                        micro: {
                            title: 'Sophisticated Register',
                            instruction: 'Define "ephemeral" in your own words.',
                            example: 'lasting for a very short time'
                        }
                    }
                }
            }
        ]
    };
})();
