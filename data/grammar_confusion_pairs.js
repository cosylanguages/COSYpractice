/**
 * practice/data/grammar_confusion_pairs.js
 * Comprehensive CEFR English Grammar Confusion Pairs & Topics Dataset (A0–C2).
 * Formatted for interactive practice engines: Fill-in-gaps, Word order,
 * Multiple choice, True/False, Match pairs, Type, Dictation, Speak.
 */

(function() {
    'use strict';

    const GRAMMAR_CONFUSION_PAIRS = {
        a1: [
            // Verb To Be & Basic Structures
            { id: "to-be", label: "Verb To Be", group: "Be & Have", level: "a1",
              q: "She ___ a talented doctor.", opts: ["is", "are", "am", "be"], ans: 0,
              type: "mc", ruleHint: "Use 'is' with third-person singular subjects (he, she, it).", practice_links: ["https://cosylanguages.github.io/COSYmanuals/manuals/en/grammar/a1/topics/to-be.html"] },
            { id: "to-be", label: "Verb To Be", group: "Be & Have", level: "a1",
              q: "They ___ excited about the upcoming holiday.", opts: ["are", "is", "am", "be"], ans: 0,
              type: "mc", ruleHint: "Use 'are' with plural subjects (they, we, you).", practice_links: ["https://cosylanguages.github.io/COSYmanuals/manuals/en/grammar/a1/topics/to-be.html"] },
            { id: "past-simple-irregular", label: "Past Simple Irregular", group: "Past Simple", level: "a1",
              q: "Yesterday, I ___ a new jacket at the store.", opts: ["bought", "buyed", "buy", "was buying"], ans: 0,
              type: "mc", ruleHint: "Irregular past tense: buy ➔ bought.", practice_links: ["https://cosylanguages.github.io/COSYmanuals/manuals/en/grammar/a1/topics/past-simple-irregular.html"] },

            // Articles
            { id: "a-vs-an", label: "a vs an", group: "Articles", level: "a1",
              q: "I bought ___ apple and a banana.", opts: ["an", "a", "the", "no article"], ans: 0,
              type: "cloze", sentence: "I bought [ ___ ] apple and a banana.",
              ruleHint: "Use 'an' before words starting with a vowel sound.", practice_links: ["https://cosylanguages.github.io/COSYmanuals/manuals/en/grammar/a1/topics/articles.html"] },
            { id: "a-vs-an", label: "a vs an", group: "Articles", level: "a1",
              q: "She has ___ university degree.", opts: ["a", "an", "the", "no article"], ans: 0,
              type: "mc", ruleHint: "'University' starts with a consonant /j/ sound, so we use 'a'.", practice_links: ["https://cosylanguages.github.io/COSYmanuals/manuals/en/grammar/a1/topics/articles.html"] },
            { id: "a-an-vs-the", label: "a/an vs the", group: "Articles", level: "a1",
              q: "I saw ___ dog. ___ dog was barking loudly.", opts: ["a / The", "the / A", "an / The", "a / A"], ans: 0,
              type: "mc", ruleHint: "Use 'a/an' when introducing a noun for the first time, and 'the' when referring to it specifically again.", practice_links: ["https://cosylanguages.github.io/COSYmanuals/manuals/en/grammar/a1/topics/articles.html"] },
            { id: "this-vs-that", label: "this vs that", group: "Demonstratives", level: "a1",
              q: "___ book in my hand is very interesting.", opts: ["This", "That", "These", "Those"], ans: 0,
              type: "mc", ruleHint: "Use 'this' for singular things close to the speaker.", practice_links: ["https://cosylanguages.github.io/COSYmanuals/manuals/en/grammar/a1/topics/demonstratives.html"] },
            { id: "these-vs-those", label: "these vs those", group: "Demonstratives", level: "a1",
              q: "Look at ___ birds far away in the sky!", opts: ["those", "these", "this", "that"], ans: 0,
              type: "mc", ruleHint: "Use 'those' for plural things far from the speaker.", practice_links: ["https://cosylanguages.github.io/COSYmanuals/manuals/en/grammar/a1/topics/demonstratives.html"] },

            // Pronouns
            { id: "i-vs-me", label: "I vs me", group: "Pronouns", level: "a1",
              q: "Sarah and ___ went to the supermarket.", opts: ["I", "me", "my", "mine"], ans: 0,
              type: "mc", ruleHint: "Use subject pronoun 'I' when performing the action of the verb.", practice_links: ["https://cosylanguages.github.io/COSYmanuals/manuals/en/grammar/a1/topics/pronouns.html"] },
            { id: "i-vs-me", label: "I vs me", group: "Pronouns", level: "a1",
              q: "Can you help ___ with this heavy bag?", opts: ["me", "I", "my", "mine"], ans: 0,
              type: "mc", ruleHint: "Use object pronoun 'me' when receiving the action.", practice_links: ["https://cosylanguages.github.io/COSYmanuals/manuals/en/grammar/a1/topics/pronouns.html"] },
            { id: "my-vs-mine", label: "my vs mine", group: "Possessives", level: "a1",
              q: "This jacket is ___.", opts: ["mine", "my", "me", "I"], ans: 0,
              type: "mc", ruleHint: "'Mine' is a possessive pronoun used without a following noun.", practice_links: ["https://cosylanguages.github.io/COSYmanuals/manuals/en/grammar/a1/topics/possessive-s.html"] },
            { id: "its-vs-its-possessive", label: "its vs it's", group: "Possessives", level: "a1",
              q: "The cat licked ___ paw.", opts: ["its", "it's", "its'", "it"], ans: 0,
              type: "mc", ruleHint: "'Its' is possessive (no apostrophe), while 'it's' means 'it is' or 'it has'.", practice_links: ["https://cosylanguages.github.io/COSYmanuals/manuals/en/grammar/a1/topics/possessive-s.html"] },

            // Be & Have
            { id: "there-is-vs-it-is", label: "there is vs it is", group: "Be & Have", level: "a1",
              q: "___ a new coffee shop on the corner.", opts: ["There is", "It is", "There are", "They are"], ans: 0,
              type: "mc", ruleHint: "Use 'There is' to state the existence of something for the first time.", practice_links: ["https://cosylanguages.github.io/COSYmanuals/manuals/en/grammar/a1/topics/there-is-are.html"] },
            { id: "have-got-vs-have", label: "have got vs have", group: "Be & Have", level: "a1",
              q: "I ___ got two brothers.", opts: ["have", "has", "am", "do"], ans: 0,
              type: "mc", ruleHint: "'Have got' is informal British English for possession (I have got = I have).", practice_links: ["https://cosylanguages.github.io/COSYmanuals/manuals/en/grammar/a1/topics/have-got.html"] },

            // Quantifiers
            { id: "some-vs-any", label: "some vs any", group: "Quantifiers", level: "a1",
              q: "Do you have ___ questions?", opts: ["any", "some", "much", "little"], ans: 0,
              type: "cloze", sentence: "Do you have [ ___ ] questions?",
              ruleHint: "Use 'any' in general questions and negative sentences.", practice_links: ["https://cosylanguages.github.io/COSYmanuals/manuals/en/grammar/a1/topics/some-vs-any.html"] },
            { id: "some-vs-any", label: "some vs any", group: "Quantifiers", level: "a1",
              q: "I have ___ milk in the fridge.", opts: ["some", "any", "many", "few"], ans: 0,
              type: "mc", ruleHint: "Use 'some' in positive affirmative statements.", practice_links: ["https://cosylanguages.github.io/COSYmanuals/manuals/en/grammar/a1/topics/some-vs-any.html"] },
            { id: "much-vs-many", label: "much vs many", group: "Quantifiers", level: "a1",
              q: "How ___ apples did you buy?", opts: ["many", "much", "little", "few"], ans: 0,
              type: "mc", ruleHint: "Use 'many' with countable plural nouns (apples).", practice_links: ["https://cosylanguages.github.io/COSYmanuals/manuals/en/grammar/a1/topics/much-many.html"] },
            { id: "much-vs-many", label: "much vs many", group: "Quantifiers", level: "a1",
              q: "How ___ water do you drink daily?", opts: ["much", "many", "few", "a few"], ans: 0,
              type: "mc", ruleHint: "Use 'much' with uncountable nouns (water).", practice_links: ["https://cosylanguages.github.io/COSYmanuals/manuals/en/grammar/a1/topics/much-many.html"] },

            // Time & Verbs
            { id: "in-vs-on-vs-at-time", label: "in vs on vs at", group: "Time Prepositions", level: "a1",
              q: "Our lesson is ___ Monday morning ___ 9:00 AM.", opts: ["on / at", "in / at", "at / on", "on / in"], ans: 0,
              type: "mc", ruleHint: "Use 'on' for days of the week, and 'at' for exact clock times.", practice_links: ["https://cosylanguages.github.io/COSYmanuals/manuals/en/grammar/a1/topics/prepositions-time.html"] },
            { id: "make-vs-do", label: "make vs do", group: "Basic Verbs", level: "a1",
              q: "Please ___ your homework before dinner.", opts: ["do", "make", "create", "take"], ans: 0,
              type: "mc", ruleHint: "Use 'do' for tasks, duties, and general activities (do homework).", practice_links: ["https://cosylanguages.github.io/COSYmanuals/manuals/en/grammar/a1/topics/present-simple.html"] },
            { id: "say-vs-tell", label: "say vs tell", group: "Basic Verbs", level: "a1",
              q: "She ___ me that she was tired.", opts: ["told", "said", "spoke", "talked"], ans: 0,
              type: "mc", ruleHint: "Use 'tell' when mentioning the personal object directly (tell someone).", practice_links: ["https://cosylanguages.github.io/COSYmanuals/manuals/en/grammar/a1/topics/past-simple-regular.html"] }
        ],

        a2: [
            // Second Conditional
            { id: "second-conditional", label: "second conditional", group: "Conditionals", level: "a2",
              q: "If I ___ more time, I would travel the world.", opts: ["had", "have", "would have", "will have"], ans: 0,
              type: "mc", ruleHint: "Second conditional formula: If + Past Simple, Subject + would + verb.", practice_links: ["https://cosylanguages.github.io/COSYmanuals/manuals/en/grammar/a2/topics/second-conditional.html"] },

            // Tenses & Aspect
            { id: "present-simple-vs-continuous", label: "Present Simple vs Continuous", group: "Tenses", level: "a2",
              q: "She usually ___ tea, but today she ___ coffee.", opts: ["drinks / is drinking", "is drinking / drinks", "drink / drink", "drinks / drink"], ans: 0,
              type: "mc", ruleHint: "Present Simple expresses habits; Present Continuous expresses temporary current actions.", practice_links: ["https://cosylanguages.github.io/COSYmanuals/manuals/en/grammar/a2/topics/present-simple-vs-present-continuous.html"] },
            { id: "past-simple-vs-present-perfect", label: "Past Simple vs Present Perfect", group: "Tenses", level: "a2",
              q: "I ___ to Rome in 2021, but my sister ___ there three times.", opts: ["went / has been", "have been / went", "went / went", "have gone / has been"], ans: 0,
              type: "mc", ruleHint: "Past Simple is used for finished past time (in 2021); Present Perfect is used for life experience without specific time.", practice_links: ["https://cosylanguages.github.io/COSYmanuals/manuals/en/grammar/a2/topics/present-perfect-vs-past-simple.html"] },
            { id: "will-vs-going-to", label: "will vs going to", group: "Tenses", level: "a2",
              q: "Look at those dark clouds! It ___ rain.", opts: ["is going to", "will", "shall", "would"], ans: 0,
              type: "mc", ruleHint: "Use 'going to' for predictions based on present visible evidence.", practice_links: ["https://cosylanguages.github.io/COSYmanuals/manuals/en/grammar/a2/topics/will-vs-going-to.html"] },

            // Modals
            { id: "must-vs-have-to", label: "must vs have to", group: "Modals", level: "a2",
              q: "You ___ wear a seatbelt in the car; it's the law.", opts: ["have to", "might", "can", "should"], ans: 0,
              type: "mc", ruleHint: "'Have to' expresses external rule or legal requirement.", practice_links: ["https://cosylanguages.github.io/COSYmanuals/manuals/en/grammar/a2/topics/have-to-must-mustnt.html"] },
            { id: "dont-have-to-vs-mustnt", label: "don't have to vs mustn't", group: "Modals", level: "a2",
              q: "You ___ touch that wire! It's dangerous.", opts: ["mustn't", "don't have to", "needn't", "should"], ans: 0,
              type: "mc", ruleHint: "'Mustn't' means prohibition (do not do it), while 'don't have to' means lack of necessity.", practice_links: ["https://cosylanguages.github.io/COSYmanuals/manuals/en/grammar/a2/topics/have-to-must-mustnt.html"] },

            // Comparisons & Quantifiers
            { id: "enough-vs-too", label: "enough vs too", group: "Comparisons", level: "a2",
              q: "This soup is ___ hot to drink right now.", opts: ["too", "enough", "very much", "so much"], ans: 0,
              type: "mc", ruleHint: "'Too' comes before adjectives to express excess beyond desired limit.", practice_links: ["https://cosylanguages.github.io/COSYmanuals/manuals/en/grammar/a2/topics/too-and-enough.html"] },
            { id: "another-vs-other", label: "another vs other", group: "Determiners", level: "a2",
              q: "Would you like ___ cup of tea?", opts: ["another", "other", "others", "the others"], ans: 0,
              type: "mc", ruleHint: "Use 'another' + singular countable noun (one additional).", practice_links: ["https://cosylanguages.github.io/COSYmanuals/manuals/en/grammar/a2/topics/indefinite-pronouns.html"] },

            // Infinitives & Gerunds
            { id: "stop-doing-vs-stop-to-do", label: "stop doing vs stop to do", group: "Verb Patterns", level: "a2",
              q: "He stopped ___ when the doctor advised him to protect his health.", opts: ["smoking", "to smoke", "smoke", "to smoking"], ans: 0,
              type: "mc", ruleHint: "'Stop doing' = quit an action permanently or temporarily. 'Stop to do' = pause in order to do something else.", practice_links: ["https://cosylanguages.github.io/COSYmanuals/manuals/en/grammar/a2/topics/infinitives-and-gerunds.html"] }
        ],

        b1: [
            // Question Tags
            { id: "question-tags", label: "question tags", group: "Question Forms", level: "b1",
              q: "She lives in London, ___ she?", opts: ["doesn't", "isn't", "don't", "hasn't"], ans: 0,
              type: "mc", ruleHint: "Positive sentence in Present Simple takes a negative auxiliary tag (doesn't).", practice_links: ["https://cosylanguages.github.io/COSYmanuals/manuals/en/grammar/b1/topics/question-tags.html"] },

            // Perfect Tenses & Conditionals
            { id: "present-perfect-vs-continuous", label: "Present Perfect vs Continuous", group: "Perfect Tenses", level: "b1",
              q: "I ___ for two hours and my legs are exhausted.", opts: ["have been running", "have run", "ran", "had run"], ans: 0,
              type: "mc", ruleHint: "Present Perfect Continuous emphasizes continuous duration and physical side effects.", practice_links: ["https://cosylanguages.github.io/COSYmanuals/manuals/en/grammar/b1/topics/present-perfect-simple-vs-continuous.html"] },
            { id: "first-vs-second-conditional", label: "First vs Second Conditional", group: "Conditionals", level: "b1",
              q: "If I win the lottery tomorrow, I ___ a house. If I won the lottery right now, I ___ around the world.", opts: ["will buy / would travel", "would buy / will travel", "bought / traveled", "will buy / will travel"], ans: 0,
              type: "mc", ruleHint: "First conditional = real potential future (if + present, will). Second conditional = unreal/hypothetical (if + past, would).", practice_links: ["https://cosylanguages.github.io/COSYmanuals/manuals/en/grammar/b1/topics/second-conditional.html"] },
            { id: "unless-vs-if-not", label: "unless vs if not", group: "Conditionals", level: "b1",
              q: "We won't go on a picnic ___ the rain stops.", opts: ["unless", "if", "provided", "as long as"], ans: 0,
              type: "mc", ruleHint: "'Unless' means 'except if' / 'if ... not'.", practice_links: ["https://cosylanguages.github.io/COSYmanuals/manuals/en/grammar/b1/topics/mixed-conditionals.html"] },

            // Relative Clauses & Verb Patterns
            { id: "who-vs-whom", label: "who vs whom", group: "Relative Clauses", level: "b1",
              q: "The candidate to ___ you spoke yesterday has been hired.", opts: ["whom", "who", "which", "whose"], ans: 0,
              type: "mc", ruleHint: "Use 'whom' as the object of a preposition in formal relative clauses.", practice_links: ["https://cosylanguages.github.io/COSYmanuals/manuals/en/grammar/b1/topics/defining-vs-non-defining-relative-clauses.html"] },
            { id: "remember-doing-vs-remember-to-do", label: "remember doing vs to do", group: "Verb Patterns", level: "b1",
              q: "Please remember ___ the door when you leave.", opts: ["to lock", "locking", "locked", "lock"], ans: 0,
              type: "mc", ruleHint: "'Remember to do' = remember a task before doing it. 'Remember doing' = recall a past memory.", practice_links: ["https://cosylanguages.github.io/COSYmanuals/manuals/en/grammar/b1/topics/verb-preposition.html"] }
        ],

        b2: [
            // Cleft Sentences and Emphasis
            { id: "cleft-sentences-and-emphasis", label: "cleft sentences & emphasis", group: "Emphasis", level: "b2",
              q: "It was John ___ organized the charity event.", opts: ["who", "which", "what", "whom"], ans: 0,
              type: "mc", ruleHint: "It-cleft formula: It + be + emphasized element + who/that...", practice_links: ["https://cosylanguages.github.io/COSYmanuals/manuals/en/grammar/b2/topics/cleft-sentences-and-emphasis.html"] },

            // Advanced Quantifiers & Linking
            { id: "less-vs-fewer", label: "less vs fewer", group: "Quantifiers", level: "b2",
              q: "There are ___ applicants this year than last year.", opts: ["fewer", "less", "little", "least"], ans: 0,
              type: "mc", ruleHint: "Use 'fewer' with plural countable nouns (applicants); use 'less' with uncountable nouns.", practice_links: ["https://cosylanguages.github.io/COSYmanuals/manuals/en/grammar/b2/topics/order-of-adjectives.html"] },
            { id: "despite-vs-although", label: "despite vs although", group: "Linking", level: "b2",
              q: "___ the bad weather, the flight landed on time.", opts: ["Despite", "Although", "Even though", "In spite"], ans: 0,
              type: "mc", ruleHint: "'Despite' is followed by a noun or noun phrase; 'although' is followed by a subject + verb clause.", practice_links: ["https://cosylanguages.github.io/COSYmanuals/manuals/en/grammar/b2/topics/clauses-of-contrast-purpose-reason-and-result.html"] },
            { id: "inversion-after-negative-adverbials", label: "inversion after negatives", group: "Emphasis", level: "b2",
              q: "Seldom ___ such an inspiring performance.", opts: ["have I witnessed", "I have witnessed", "did I witnessed", "I witnessed"], ans: 0,
              type: "mc", ruleHint: "Negative adverbials at the beginning of a sentence require auxiliary inversion (Seldom + auxiliary + subject + verb).", practice_links: ["https://cosylanguages.github.io/COSYmanuals/manuals/en/grammar/b2/topics/inversion-after-negative-adverbials.html"] }
        ],

        c1: [
            // Complex Tenses & Inversion
            { id: "no-sooner-than-inversion", label: "no sooner...than", group: "Inversion", level: "c1",
              q: "No sooner ___ the building than the explosion occurred.", opts: ["had they left", "they had left", "did they leave", "were they leaving"], ans: 0,
              type: "mc", ruleHint: "'No sooner' requires past perfect inversion followed by 'than'.", practice_links: ["https://cosylanguages.github.io/COSYmanuals/manuals/en/grammar/c1/topics/inversion.html"] },
            { id: "cleft-sentences", label: "cleft sentences", group: "Emphasis", level: "c1",
              q: "What surprised us most ___ his complete lack of remorse.", opts: ["was", "were", "is", "been"], ans: 0,
              type: "mc", ruleHint: "Wh-cleft sentences isolate a key element for rhetorical emphasis (What... + was + noun phrase).", practice_links: ["https://cosylanguages.github.io/COSYmanuals/manuals/en/grammar/c1/topics/cleft-sentences.html"] },
            { id: "whether-vs-if", label: "whether vs if", group: "Formal Structures", level: "c1",
              q: "We need to discuss ___ or not we should accept the proposal.", opts: ["whether", "if", "unless", "provided"], ans: 0,
              type: "mc", ruleHint: "Use 'whether' directly before 'or not' or after prepositions in formal register.", practice_links: ["https://cosylanguages.github.io/COSYmanuals/manuals/en/grammar/c1/topics/formal-structures.html"] }
        ],

        c2: [
            // Nuance & Near-Synonyms
            { id: "historic-vs-historical", label: "historic vs historical", group: "Nuance", level: "c2",
              q: "The treaty signing was a ___ event that changed world politics.", opts: ["historic", "historical", "historian", "historically"], ans: 0,
              type: "mc", ruleHint: "'Historic' = famous or influential in history. 'Historical' = relating to the study/period of history.", practice_links: ["https://cosylanguages.github.io/COSYmanuals/manuals/en/grammar/c2/topics/nuance.html"] },
            { id: "affect-vs-effect", label: "affect vs effect", group: "Near-Synonyms", level: "c2",
              q: "The new policy will significantly ___ public healthcare, and its full ___ will be evaluated next year.", opts: ["affect / effect", "effect / affect", "affect / affect", "effect / effect"], ans: 0,
              type: "mc", ruleHint: "'Affect' is usually a verb (to influence); 'effect' is usually a noun (the result).", practice_links: ["https://cosylanguages.github.io/COSYmanuals/manuals/en/grammar/c2/topics/near-synonyms.html"] },
            { id: "assure-vs-ensure-vs-insure", label: "assure vs ensure vs insure", group: "Near-Synonyms", level: "c2",
              q: "Please ___ that all doors are locked, and I ___ you that the building is secure.", opts: ["ensure / assure", "assure / ensure", "insure / ensure", "ensure / insure"], ans: 0,
              type: "mc", ruleHint: "'Ensure' = make certain something happens. 'Assure' = remove doubt from a person's mind.", practice_links: ["https://cosylanguages.github.io/COSYmanuals/manuals/en/grammar/c2/topics/near-synonyms.html"] }
        ]
    };

    if (typeof window !== 'undefined') {
        window.COSY_GRAMMAR_CONFUSION_PAIRS = GRAMMAR_CONFUSION_PAIRS;
    }
    if (typeof module !== 'undefined') {
        module.exports = GRAMMAR_CONFUSION_PAIRS;
    }
})();
