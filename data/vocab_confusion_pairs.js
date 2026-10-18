/**
 * practice/data/vocab_confusion_pairs.js
 * Comprehensive CEFR English Vocabulary Confusion Pairs & Groups Dataset Registry (A0–C2).
 */

(function() {
    'use strict';

    const VOCAB_CONFUSION_PAIRS = {
        a1: [
            // Movement
            { id: "come-vs-go", label: "come vs go", group: "Movement", level: "a1", termA: "come", termB: "go" },
            { id: "bring-vs-take", label: "bring vs take", group: "Movement", level: "a1", termA: "bring", termB: "take" },
            { id: "arrive-vs-leave", label: "arrive vs leave", group: "Movement", level: "a1", termA: "arrive", termB: "leave" },
            { id: "enter-vs-exit", label: "enter vs exit", group: "Movement", level: "a1", termA: "enter", termB: "exit" },
            { id: "sit-vs-stand", label: "sit vs stand", group: "Movement", level: "a1", termA: "sit", termB: "stand" },
            { id: "walk-vs-run", label: "walk vs run", group: "Movement", level: "a1", termA: "walk", termB: "run" },
            { id: "jump-vs-hop", label: "jump vs hop", group: "Movement", level: "a1", termA: "jump", termB: "hop" },
            { id: "stop-vs-start", label: "stop vs start", group: "Movement", level: "a1", termA: "stop", termB: "start" },
            { id: "begin-vs-finish", label: "begin vs finish", group: "Movement", level: "a1", termA: "begin", termB: "finish" },
            { id: "open-vs-close", label: "open vs close", group: "Movement", level: "a1", termA: "open", termB: "close" },
            { id: "turn-on-vs-turn-off", label: "turn on vs turn off", group: "Movement", level: "a1", termA: "turn on", termB: "turn off" },

            // Communication
            { id: "say-vs-tell", label: "say vs tell", group: "Communication", level: "a1", termA: "say", termB: "tell" },
            { id: "speak-vs-talk", label: "speak vs talk", group: "Communication", level: "a1", termA: "speak", termB: "talk" },
            { id: "ask-vs-answer", label: "ask vs answer", group: "Communication", level: "a1", termA: "ask", termB: "answer" },
            { id: "hear-vs-listen", label: "hear vs listen", group: "Communication", level: "a1", termA: "hear", termB: "listen" },
            { id: "look-vs-see-vs-watch", label: "look vs see vs watch", group: "Communication", level: "a1", termA: "look", termB: "see" },
            { id: "read-vs-study", label: "read vs study", group: "Communication", level: "a1", termA: "read", termB: "study" },
            { id: "learn-vs-teach", label: "learn vs teach", group: "Communication", level: "a1", termA: "learn", termB: "teach" },

            // Possession & Exchange
            { id: "have-vs-have-got", label: "have vs have got", group: "Possession & Exchange", level: "a1", termA: "have", termB: "have got" },
            { id: "buy-vs-pay", label: "buy vs pay", group: "Possession & Exchange", level: "a1", termA: "buy", termB: "pay" },
            { id: "sell-vs-buy", label: "sell vs buy", group: "Possession & Exchange", level: "a1", termA: "sell", termB: "buy" },
            { id: "borrow-vs-lend", label: "borrow vs lend", group: "Possession & Exchange", level: "a1", termA: "borrow", termB: "lend" },
            { id: "give-vs-take", label: "give vs take", group: "Possession & Exchange", level: "a1", termA: "give", termB: "take" },
            { id: "get-vs-receive", label: "get vs receive", group: "Possession & Exchange", level: "a1", termA: "get", termB: "receive" },

            // Everyday Objects
            { id: "house-vs-home", label: "house vs home", group: "Everyday Objects", level: "a1", termA: "house", termB: "home" },
            { id: "room-vs-place", label: "room vs place", group: "Everyday Objects", level: "a1", termA: "room", termB: "place" },
            { id: "job-vs-work", label: "job vs work", group: "Everyday Objects", level: "a1", termA: "job", termB: "work" },
            { id: "clothes-vs-clothing", label: "clothes vs clothing", group: "Everyday Objects", level: "a1", termA: "clothes", termB: "clothing" },
            { id: "wear-vs-put-on", label: "wear vs put on", group: "Everyday Objects", level: "a1", termA: "wear", termB: "put on" },
            { id: "dress-vs-wear", label: "dress vs wear", group: "Everyday Objects", level: "a1", termA: "dress", termB: "wear" },

            // Phrasal Verbs A1-A2
            { id: "get-up-vs-stand-up", label: "get up vs stand up", group: "Phrasal Verbs", level: "a1", termA: "get up", termB: "stand up" },
            { id: "wake-up-vs-get-up", label: "wake up vs get up", group: "Phrasal Verbs", level: "a1", termA: "wake up", termB: "get up" },
            { id: "sit-down-vs-lie-down", label: "sit down vs lie down", group: "Phrasal Verbs", level: "a1", termA: "sit down", termB: "lie down" },
            { id: "put-on-vs-take-off", label: "put on vs take off", group: "Phrasal Verbs", level: "a1", termA: "put on", termB: "take off" },
            { id: "pick-up-vs-put-down", label: "pick up vs put down", group: "Phrasal Verbs", level: "a1", termA: "pick up", termB: "put down" }
        ],

        a2: [
            // People & Relationships
            { id: "person-vs-people", label: "person vs people", group: "People & Relationships", level: "a2", termA: "person", termB: "people" },
            { id: "man-vs-men", label: "man vs men", group: "People & Relationships", level: "a2", termA: "man", termB: "men" },
            { id: "woman-vs-women", label: "woman vs women", group: "People & Relationships", level: "a2", termA: "woman", termB: "women" },
            { id: "child-vs-children", label: "child vs children", group: "People & Relationships", level: "a2", termA: "child", termB: "children" },
            { id: "family-vs-relatives", label: "family vs relatives", group: "People & Relationships", level: "a2", termA: "family", termB: "relatives" },
            { id: "friend-vs-colleague", label: "friend vs colleague", group: "People & Relationships", level: "a2", termA: "friend", termB: "colleague" },
            { id: "stranger-vs-foreigner", label: "stranger vs foreigner", group: "People & Relationships", level: "a2", termA: "stranger", termB: "foreigner" },
            { id: "customer-vs-client", label: "customer vs client", group: "People & Relationships", level: "a2", termA: "customer", termB: "client" },
            { id: "visitor-vs-guest", label: "visitor vs guest", group: "People & Relationships", level: "a2", termA: "visitor", termB: "guest" },

            // Time
            { id: "time-vs-hour", label: "time vs hour", group: "Time", level: "a2", termA: "time", termB: "hour" },
            { id: "day-vs-date", label: "day vs date", group: "Time", level: "a2", termA: "day", termB: "date" },
            { id: "week-vs-weekend", label: "week vs weekend", group: "Time", level: "a2", termA: "week", termB: "weekend" },
            { id: "month-vs-season", label: "month vs season", group: "Time", level: "a2", termA: "month", termB: "season" },
            { id: "ago-vs-before", label: "ago vs before", group: "Time", level: "a2", termA: "ago", termB: "before" },
            { id: "later-vs-lately", label: "later vs lately", group: "Time", level: "a2", termA: "later", termB: "lately" },
            { id: "soon-vs-early", label: "soon vs early", group: "Time", level: "a2", termA: "soon", termB: "early" },
            { id: "last-vs-previous", label: "last vs previous", group: "Time", level: "a2", termA: "last", termB: "previous" },
            { id: "next-vs-following", label: "next vs following", group: "Time", level: "a2", termA: "next", termB: "following" },

            // Places
            { id: "place-vs-location", label: "place vs location", group: "Places", level: "a2", termA: "place", termB: "location" },
            { id: "city-vs-town", label: "city vs town", group: "Places", level: "a2", termA: "city", termB: "town" },
            { id: "country-vs-countryside", label: "country vs countryside", group: "Places", level: "a2", termA: "country", termB: "countryside" },
            { id: "street-vs-road", label: "street vs road", group: "Places", level: "a2", termA: "street", termB: "road" },
            { id: "way-vs-direction", label: "way vs direction", group: "Places", level: "a2", termA: "way", termB: "direction" },
            { id: "map-vs-plan", label: "map vs plan", group: "Places", level: "a2", termA: "map", termB: "plan" },
            { id: "journey-vs-trip", label: "journey vs trip", group: "Places", level: "a2", termA: "journey", termB: "trip" },

            // Food & Shopping
            { id: "food-vs-meal", label: "food vs meal", group: "Food & Shopping", level: "a2", termA: "food", termB: "meal" },
            { id: "dish-vs-plate", label: "dish vs plate", group: "Food & Shopping", level: "a2", termA: "dish", termB: "plate" },
            { id: "recipe-vs-menu", label: "recipe vs menu", group: "Food & Shopping", level: "a2", termA: "recipe", termB: "menu" },
            { id: "cook-vs-cooker", label: "cook vs cooker", group: "Food & Shopping", level: "a2", termA: "cook", termB: "cooker" },
            { id: "kitchen-vs-restaurant", label: "kitchen vs restaurant", group: "Food & Shopping", level: "a2", termA: "kitchen", termB: "restaurant" },
            { id: "taste-vs-flavour", label: "taste vs flavour", group: "Food & Shopping", level: "a2", termA: "taste", termB: "flavour" },
            { id: "price-vs-cost", label: "price vs cost", group: "Food & Shopping", level: "a2", termA: "price", termB: "cost" },

            // Common Verbs
            { id: "make-vs-do", label: "make vs do", group: "Common Verbs", level: "a2", termA: "make", termB: "do" },
            { id: "have-vs-take", label: "have vs take", group: "Common Verbs", level: "a2", termA: "have", termB: "take" },
            { id: "get-vs-become", label: "get vs become", group: "Common Verbs", level: "a2", termA: "get", termB: "become" },
            { id: "put-vs-place", label: "put vs place", group: "Common Verbs", level: "a2", termA: "put", termB: "place" },
            { id: "keep-vs-save", label: "keep vs save", group: "Common Verbs", level: "a2", termA: "keep", termB: "save" },
            { id: "find-vs-look-for", label: "find vs look for", group: "Common Verbs", level: "a2", termA: "find", termB: "look for" },
            { id: "miss-vs-lose", label: "miss vs lose", group: "Common Verbs", level: "a2", termA: "miss", termB: "lose" },
            { id: "win-vs-beat", label: "win vs beat", group: "Common Verbs", level: "a2", termA: "win", termB: "beat" },
            { id: "try-vs-test", label: "try vs test", group: "Common Verbs", level: "a2", termA: "try", termB: "test" },
            { id: "check-vs-control", label: "check vs control", group: "Common Verbs", level: "a2", termA: "check", termB: "control" }
        ],

        b1: [
            // Movement & Position
            { id: "rise-vs-raise", label: "rise vs raise", group: "Movement & Position", level: "b1", termA: "rise", termB: "raise" },
            { id: "lie-vs-lay", label: "lie vs lay", group: "Movement & Position", level: "b1", termA: "lie", termB: "lay" },
            { id: "sit-vs-set", label: "sit vs set", group: "Movement & Position", level: "b1", termA: "sit", termB: "set" },
            { id: "fall-vs-drop", label: "fall vs drop", group: "Movement & Position", level: "b1", termA: "fall", termB: "drop" },
            { id: "lift-vs-pick-up", label: "lift vs pick up", group: "Movement & Position", level: "b1", termA: "lift", termB: "pick up" },
            { id: "carry-vs-wear", label: "carry vs wear", group: "Movement & Position", level: "b1", termA: "carry", termB: "wear" },
            { id: "reach-vs-arrive", label: "reach vs arrive", group: "Movement & Position", level: "b1", termA: "reach", termB: "arrive" },

            // Thinking & Knowledge
            { id: "know-vs-know-about", label: "know vs know about", group: "Thinking & Knowledge", level: "b1", termA: "know", termB: "know about" },
            { id: "think-vs-believe", label: "think vs believe", group: "Thinking & Knowledge", level: "b1", termA: "think", termB: "believe" },
            { id: "remember-vs-remind", label: "remember vs remind", group: "Thinking & Knowledge", level: "b1", termA: "remember", termB: "remind" },
            { id: "discover-vs-invent", label: "discover vs invent", group: "Thinking & Knowledge", level: "b1", termA: "discover", termB: "invent" },
            { id: "notice-vs-realize", label: "notice vs realize", group: "Thinking & Knowledge", level: "b1", termA: "notice", termB: "realize" },
            { id: "understand-vs-realize", label: "understand vs realize", group: "Thinking & Knowledge", level: "b1", termA: "understand", termB: "realize" },
            { id: "guess-vs-suppose", label: "guess vs suppose", group: "Thinking & Knowledge", level: "b1", termA: "guess", termB: "suppose" },
            { id: "expect-vs-wait", label: "expect vs wait", group: "Thinking & Knowledge", level: "b1", termA: "expect", termB: "wait" },

            // Communication
            { id: "discuss-vs-talk-about", label: "discuss vs talk about", group: "Communication", level: "b1", termA: "discuss", termB: "talk about" },
            { id: "explain-vs-describe", label: "explain vs describe", group: "Communication", level: "b1", termA: "explain", termB: "describe" },
            { id: "say-vs-mention", label: "say vs mention", group: "Communication", level: "b1", termA: "say", termB: "mention" },
            { id: "answer-vs-reply", label: "answer vs reply", group: "Communication", level: "b1", termA: "answer", termB: "reply" },
            { id: "suggest-vs-recommend", label: "suggest vs recommend", group: "Communication", level: "b1", termA: "suggest", termB: "recommend" },
            { id: "advise-vs-advice", label: "advise vs advice", group: "Communication", level: "b1", termA: "advise", termB: "advice" },
            { id: "convince-vs-persuade", label: "convince vs persuade", group: "Communication", level: "b1", termA: "convince", termB: "persuade" },

            // Work & Education
            { id: "job-vs-work-vs-career", label: "job vs work vs career", group: "Work & Education", level: "b1", termA: "job", termB: "career" },
            { id: "profession-vs-occupation", label: "profession vs occupation", group: "Work & Education", level: "b1", termA: "profession", termB: "occupation" },
            { id: "practice-vs-train", label: "practice vs train", group: "Work & Education", level: "b1", termA: "practice", termB: "train" },
            { id: "lesson-vs-class", label: "lesson vs class", group: "Work & Education", level: "b1", termA: "lesson", termB: "class" },
            { id: "teacher-vs-tutor", label: "teacher vs tutor", group: "Work & Education", level: "b1", termA: "teacher", termB: "tutor" },
            { id: "colleague-vs-classmate", label: "colleague vs classmate", group: "Work & Education", level: "b1", termA: "colleague", termB: "classmate" },

            // Phrasal Verbs B1
            { id: "find-out-vs-find", label: "find out vs find", group: "Phrasal Verbs", level: "b1", termA: "find out", termB: "find" },
            { id: "look-for-vs-look-after", label: "look for vs look after", group: "Phrasal Verbs", level: "b1", termA: "look for", termB: "look after" },
            { id: "look-at-vs-look-into", label: "look at vs look into", group: "Phrasal Verbs", level: "b1", termA: "look at", termB: "look into" },
            { id: "give-up-vs-give-away", label: "give up vs give away", group: "Phrasal Verbs", level: "b1", termA: "give up", termB: "give away" },
            { id: "take-off-vs-take-up", label: "take off vs take up", group: "Phrasal Verbs", level: "b1", termA: "take off", termB: "take up" },
            { id: "turn-up-vs-turn-on", label: "turn up vs turn on", group: "Phrasal Verbs", level: "b1", termA: "turn up", termB: "turn on" }
        ],

        b2: [
            // Feelings & Personality
            { id: "fun-vs-funny", label: "fun vs funny", group: "Feelings & Personality", level: "b2", termA: "fun", termB: "funny" },
            { id: "interested-vs-interesting", label: "interested vs interesting", group: "Feelings & Personality", level: "b2", termA: "interested", termB: "interesting" },
            { id: "bored-vs-boring", label: "bored vs boring", group: "Feelings & Personality", level: "b2", termA: "bored", termB: "boring" },
            { id: "excited-vs-exciting", label: "excited vs exciting", group: "Feelings & Personality", level: "b2", termA: "excited", termB: "exciting" },
            { id: "surprised-vs-surprising", label: "surprised vs surprising", group: "Feelings & Personality", level: "b2", termA: "surprised", termB: "surprising" },
            { id: "worried-vs-worrying", label: "worried vs worrying", group: "Feelings & Personality", level: "b2", termA: "worried", termB: "worrying" },
            { id: "afraid-vs-frightened", label: "afraid vs frightened", group: "Feelings & Personality", level: "b2", termA: "afraid", termB: "frightened" },
            { id: "alone-vs-lonely", label: "alone vs lonely", group: "Feelings & Personality", level: "b2", termA: "alone", termB: "lonely" },
            { id: "nervous-vs-stressed", label: "nervous vs stressed", group: "Feelings & Personality", level: "b2", termA: "nervous", termB: "stressed" },
            { id: "confident-vs-arrogant", label: "confident vs arrogant", group: "Feelings & Personality", level: "b2", termA: "confident", termB: "arrogant" },

            // Adjective Confusions
            { id: "good-vs-well", label: "good vs well", group: "Adjectives & Adverbs", level: "b2", termA: "good", termB: "well" },
            { id: "bad-vs-badly", label: "bad vs badly", group: "Adjectives & Adverbs", level: "b2", termA: "bad", termB: "badly" },
            { id: "hard-vs-hardly", label: "hard vs hardly", group: "Adjectives & Adverbs", level: "b2", termA: "hard", termB: "hardly" },
            { id: "near-vs-nearly", label: "near vs nearly", group: "Adjectives & Adverbs", level: "b2", termA: "near", termB: "nearly" },
            { id: "high-vs-highly", label: "high vs highly", group: "Adjectives & Adverbs", level: "b2", termA: "high", termB: "highly" },
            { id: "close-vs-closely", label: "close vs closely", group: "Adjectives & Adverbs", level: "b2", termA: "close", termB: "closely" },
            { id: "deep-vs-deeply", label: "deep vs deeply", group: "Adjectives & Adverbs", level: "b2", termA: "deep", termB: "deeply" },
            { id: "free-vs-available", label: "free vs available", group: "Adjectives & Adverbs", level: "b2", termA: "free", termB: "available" },
            { id: "famous-vs-popular", label: "famous vs popular", group: "Adjectives & Adverbs", level: "b2", termA: "famous", termB: "popular" },

            // Quantity & Degree
            { id: "few-vs-a-few", label: "few vs a few", group: "Quantity & Degree", level: "b2", termA: "few", termB: "a few" },
            { id: "little-vs-a-little", label: "little vs a little", group: "Quantity & Degree", level: "b2", termA: "little", termB: "a little" },
            { id: "less-vs-fewer", label: "less vs fewer", group: "Quantity & Degree", level: "b2", termA: "less", termB: "fewer" },
            { id: "amount-vs-number", label: "amount vs number", group: "Quantity & Degree", level: "b2", termA: "amount", termB: "number" },
            { id: "plenty-vs-enough", label: "plenty vs enough", group: "Quantity & Degree", level: "b2", termA: "plenty", termB: "enough" },
            { id: "whole-vs-all", label: "whole vs all", group: "Quantity & Degree", level: "b2", termA: "whole", termB: "all" },
            { id: "every-vs-each", label: "every vs each", group: "Quantity & Degree", level: "b2", termA: "every", termB: "each" },

            // Change & Development
            { id: "change-vs-become", label: "change vs become", group: "Change & Development", level: "b2", termA: "change", termB: "become" },
            { id: "improve-vs-develop", label: "improve vs develop", group: "Change & Development", level: "b2", termA: "improve", termB: "develop" },
            { id: "increase-vs-rise", label: "increase vs rise", group: "Change & Development", level: "b2", termA: "increase", termB: "rise" },
            { id: "decrease-vs-reduce", label: "decrease vs reduce", group: "Change & Development", level: "b2", termA: "decrease", termB: "reduce" },
            { id: "grow-vs-raise", label: "grow vs raise", group: "Change & Development", level: "b2", termA: "grow", termB: "raise" },
            { id: "create-vs-produce", label: "create vs produce", group: "Change & Development", level: "b2", termA: "create", termB: "produce" },
            { id: "cause-vs-create", label: "cause vs create", group: "Change & Development", level: "b2", termA: "cause", termB: "create" },

            // Travel & Transport
            { id: "travel-vs-trip-vs-journey-vs-voyage", label: "travel vs trip vs journey vs voyage", group: "Travel & Transport", level: "b2", termA: "travel", termB: "journey" },
            { id: "tour-vs-trip", label: "tour vs trip", group: "Travel & Transport", level: "b2", termA: "tour", termB: "trip" },
            { id: "flight-vs-journey", label: "flight vs journey", group: "Travel & Transport", level: "b2", termA: "flight", termB: "journey" },
            { id: "luggage-vs-baggage", label: "luggage vs baggage", group: "Travel & Transport", level: "b2", termA: "luggage", termB: "baggage" },
            { id: "suitcase-vs-bag", label: "suitcase vs bag", group: "Travel & Transport", level: "b2", termA: "suitcase", termB: "bag" },
            { id: "ticket-vs-passport", label: "ticket vs passport", group: "Travel & Transport", level: "b2", termA: "ticket", termB: "passport" },
            { id: "station-vs-stop", label: "station vs stop", group: "Travel & Transport", level: "b2", termA: "station", termB: "stop" },
            { id: "road-vs-route", label: "road vs route", group: "Travel & Transport", level: "b2", termA: "road", termB: "route" },

            // Academic & Business Vocabulary
            { id: "cause-vs-reason", label: "cause vs reason", group: "Academic Vocabulary", level: "b2", termA: "cause", termB: "reason" },
            { id: "result-vs-consequence", label: "result vs consequence", group: "Academic Vocabulary", level: "b2", termA: "result", termB: "consequence" },
            { id: "because-vs-since", label: "because vs since", group: "Academic Vocabulary", level: "b2", termA: "because", termB: "since" },
            { id: "lead-to-vs-result-in", label: "lead to vs result in", group: "Academic Vocabulary", level: "b2", termA: "lead to", termB: "result in" },
            { id: "influence-vs-impact", label: "influence vs impact", group: "Academic Vocabulary", level: "b2", termA: "influence", termB: "impact" },
            { id: "information-vs-news", label: "information vs news", group: "Academic Vocabulary", level: "b2", termA: "information", termB: "news" },
            { id: "fact-vs-opinion", label: "fact vs opinion", group: "Academic Vocabulary", level: "b2", termA: "fact", termB: "opinion" },
            { id: "theory-vs-idea", label: "theory vs idea", group: "Academic Vocabulary", level: "b2", termA: "theory", termB: "idea" },
            { id: "research-vs-study", label: "research vs study", group: "Academic Vocabulary", level: "b2", termA: "research", termB: "study" },
            { id: "evidence-vs-proof", label: "evidence vs proof", group: "Academic Vocabulary", level: "b2", termA: "evidence", termB: "proof" },
            { id: "example-vs-instance", label: "example vs instance", group: "Academic Vocabulary", level: "b2", termA: "example", termB: "instance" },
            { id: "method-vs-way", label: "method vs way", group: "Academic Vocabulary", level: "b2", termA: "method", termB: "way" },
            { id: "company-vs-corporation", label: "company vs corporation", group: "Business Vocabulary", level: "b2", termA: "company", termB: "corporation" },
            { id: "business-vs-company", label: "business vs company", group: "Business Vocabulary", level: "b2", termA: "business", termB: "company" },
            { id: "customer-vs-consumer", label: "customer vs consumer", group: "Business Vocabulary", level: "b2", termA: "customer", termB: "consumer" },
            { id: "employer-vs-employee", label: "employer vs employee", group: "Business Vocabulary", level: "b2", termA: "employer", termB: "employee" },
            { id: "salary-vs-wage", label: "salary vs wage", group: "Business Vocabulary", level: "b2", termA: "salary", termB: "wage" },
            { id: "income-vs-revenue", label: "income vs revenue", group: "Business Vocabulary", level: "b2", termA: "income", termB: "revenue" },

            // Social Vocabulary
            { id: "society-vs-community", label: "society vs community", group: "Social Vocabulary", level: "b2", termA: "society", termB: "community" },
            { id: "culture-vs-tradition", label: "culture vs tradition", group: "Social Vocabulary", level: "b2", termA: "culture", termB: "tradition" },
            { id: "habit-vs-routine", label: "habit vs routine", group: "Social Vocabulary", level: "b2", termA: "habit", termB: "routine" },
            { id: "custom-vs-habit", label: "custom vs habit", group: "Social Vocabulary", level: "b2", termA: "custom", termB: "habit" },
            { id: "relationship-vs-connection", label: "relationship vs connection", group: "Social Vocabulary", level: "b2", termA: "relationship", termB: "connection" },

            // Phrasal Verbs B2-C2
            { id: "bring-up-vs-bring-about", label: "bring up vs bring about", group: "Phrasal Verbs", level: "b2", termA: "bring up", termB: "bring about" },
            { id: "carry-out-vs-carry-on", label: "carry out vs carry on", group: "Phrasal Verbs", level: "b2", termA: "carry out", termB: "carry on" },
            { id: "come-up-with-vs-come-across", label: "come up with vs come across", group: "Phrasal Verbs", level: "b2", termA: "come up with", termB: "come across" },
            { id: "put-off-vs-put-up-with", label: "put off vs put up with", group: "Phrasal Verbs", level: "b2", termA: "put off", termB: "put up with" },
            { id: "break-down-vs-break-up", label: "break down vs break up", group: "Phrasal Verbs", level: "b2", termA: "break down", termB: "break up" },
            { id: "run-into-vs-run-out-of", label: "run into vs run out of", group: "Phrasal Verbs", level: "b2", termA: "run into", termB: "run out of" },
            { id: "set-up-vs-set-out", label: "set up vs set out", group: "Phrasal Verbs", level: "b2", termA: "set up", termB: "set out" },
            { id: "take-over-vs-take-on", label: "take over vs take on", group: "Phrasal Verbs", level: "b2", termA: "take over", termB: "take on" },

            // Word Families
            { id: "advice-vs-advise", label: "advice vs advise", group: "Word Families", level: "b2", termA: "advice", termB: "advise" },
            { id: "practice-vs-practise", label: "practice vs practise", group: "Word Families", level: "b2", termA: "practice", termB: "practise" },
            { id: "breath-vs-breathe", label: "breath vs breathe", group: "Word Families", level: "b2", termA: "breath", termB: "breathe" },
            { id: "lose-vs-loose", label: "lose vs loose", group: "Word Families", level: "b2", termA: "lose", termB: "loose" },
            { id: "choose-vs-chose", label: "choose vs chose", group: "Word Families", level: "b2", termA: "choose", termB: "chose" },
            { id: "than-vs-then", label: "than vs then", group: "Word Families", level: "b2", termA: "than", termB: "then" },
            { id: "accept-vs-except", label: "accept vs except", group: "Word Families", level: "b2", termA: "accept", termB: "except" },
            { id: "quiet-vs-quite", label: "quiet vs quite", group: "Word Families", level: "b2", termA: "quiet", termB: "quite" },
            { id: "desert-vs-dessert", label: "desert vs dessert", group: "Word Families", level: "b2", termA: "desert", termB: "dessert" },
            { id: "personal-vs-personnel", label: "personal vs personnel", group: "Word Families", level: "b2", termA: "personal", termB: "personnel" },
            { id: "later-vs-latter", label: "later vs latter", group: "Word Families", level: "b2", termA: "later", termB: "latter" },
            { id: "beside-vs-besides", label: "beside vs besides", group: "Word Families", level: "b2", termA: "beside", termB: "besides" },
            { id: "complement-vs-compliment", label: "complement vs compliment", group: "Word Families", level: "b2", termA: "complement", termB: "compliment" }
        ],

        c1: [
            // Precision Vocabulary
            { id: "big-vs-large-vs-great", label: "big vs large vs great", group: "Precision Vocabulary", level: "c1", termA: "large", termB: "great" },
            { id: "small-vs-little-vs-tiny", label: "small vs little vs tiny", group: "Precision Vocabulary", level: "c1", termA: "little", termB: "tiny" },
            { id: "old-vs-ancient-vs-elderly", label: "old vs ancient vs elderly", group: "Precision Vocabulary", level: "c1", termA: "ancient", termB: "elderly" },
            { id: "new-vs-modern-vs-recent", label: "new vs modern vs recent", group: "Precision Vocabulary", level: "c1", termA: "modern", termB: "recent" },
            { id: "important-vs-significant-vs-essential", label: "important vs significant vs essential", group: "Precision Vocabulary", level: "c1", termA: "significant", termB: "essential" },
            { id: "possible-vs-probable-vs-likely", label: "possible vs probable vs likely", group: "Precision Vocabulary", level: "c1", termA: "probable", termB: "likely" },
            { id: "common-vs-usual-vs-typical", label: "common vs usual vs typical", group: "Precision Vocabulary", level: "c1", termA: "usual", termB: "typical" },
            { id: "strange-vs-unusual-vs-rare", label: "strange vs unusual vs rare", group: "Precision Vocabulary", level: "c1", termA: "unusual", termB: "rare" },

            // Advanced Emotions
            { id: "angry-vs-annoyed-vs-irritated-vs-furious", label: "angry vs annoyed vs irritated vs furious", group: "Advanced Emotions", level: "c1", termA: "irritated", termB: "furious" },
            { id: "afraid-vs-scared-vs-terrified", label: "afraid vs scared vs terrified", group: "Advanced Emotions", level: "c1", termA: "scared", termB: "terrified" },
            { id: "happy-vs-pleased-vs-delighted", label: "happy vs pleased vs delighted", group: "Advanced Emotions", level: "c1", termA: "pleased", termB: "delighted" },
            { id: "sad-vs-upset-vs-depressed", label: "sad vs upset vs depressed", group: "Advanced Emotions", level: "c1", termA: "upset", termB: "depressed" },
            { id: "surprised-vs-shocked-vs-amazed", label: "surprised vs shocked vs amazed", group: "Advanced Emotions", level: "c1", termA: "shocked", termB: "amazed" },
            { id: "tired-vs-exhausted-vs-bored", label: "tired vs exhausted vs bored", group: "Advanced Emotions", level: "c1", termA: "exhausted", termB: "bored" },

            // Advanced Actions
            { id: "start-vs-begin-vs-commence", label: "start vs begin vs commence", group: "Advanced Actions", level: "c1", termA: "begin", termB: "commence" },
            { id: "stop-vs-quit-vs-cease", label: "stop vs quit vs cease", group: "Advanced Actions", level: "c1", termA: "quit", termB: "cease" },
            { id: "help-vs-assist", label: "help vs assist", group: "Advanced Actions", level: "c1", termA: "help", termB: "assist" },
            { id: "use-vs-utilize", label: "use vs utilize", group: "Advanced Actions", level: "c1", termA: "use", termB: "utilize" },
            { id: "buy-vs-purchase", label: "buy vs purchase", group: "Advanced Actions", level: "c1", termA: "buy", termB: "purchase" },
            { id: "get-vs-obtain-vs-acquire", label: "get vs obtain vs acquire", group: "Advanced Actions", level: "c1", termA: "obtain", termB: "acquire" },
            { id: "give-vs-provide-vs-offer", label: "give vs provide vs offer", group: "Advanced Actions", level: "c1", termA: "provide", termB: "offer" },
            { id: "show-vs-demonstrate", label: "show vs demonstrate", group: "Advanced Actions", level: "c1", termA: "show", termB: "demonstrate" },

            // Formal vs Informal
            { id: "ask-vs-inquire", label: "ask vs inquire", group: "Formal vs Informal", level: "c1", termA: "ask", termB: "inquire" },
            { id: "tell-vs-inform", label: "tell vs inform", group: "Formal vs Informal", level: "c1", termA: "tell", termB: "inform" },
            { id: "say-vs-state", label: "say vs state", group: "Formal vs Informal", level: "c1", termA: "say", termB: "state" },
            { id: "end-vs-terminate", label: "end vs terminate", group: "Formal vs Informal", level: "c1", termA: "end", termB: "terminate" }
        ],

        c2: [
            // False Friends & Close Words
            { id: "affect-vs-effect", label: "affect vs effect", group: "False Friends & Close Words", level: "c2", termA: "affect", termB: "effect" },
            { id: "effective-vs-efficient", label: "effective vs efficient", group: "False Friends & Close Words", level: "c2", termA: "effective", termB: "efficient" },
            { id: "efficacy-vs-efficiency", label: "efficacy vs efficiency", group: "False Friends & Close Words", level: "c2", termA: "efficacy", termB: "efficiency" },

            // Create / Discover
            { id: "invent-vs-discover", label: "invent vs discover", group: "Create / Discover", level: "c2", termA: "invent", termB: "discover" },
            { id: "innovation-vs-invention", label: "innovation vs invention", group: "Create / Discover", level: "c2", termA: "innovation", termB: "invention" },

            // Meaning & Interpretation
            { id: "imply-vs-infer", label: "imply vs infer", group: "Meaning & Interpretation", level: "c2", termA: "imply", termB: "infer" },
            { id: "literal-vs-figurative", label: "literal vs figurative", group: "Meaning & Interpretation", level: "c2", termA: "literal", termB: "figurative" },
            { id: "explain-vs-interpret", label: "explain vs interpret", group: "Meaning & Interpretation", level: "c2", termA: "explain", termB: "interpret" },
            { id: "understand-vs-comprehend", label: "understand vs comprehend", group: "Meaning & Interpretation", level: "c2", termA: "understand", termB: "comprehend" },

            // Advanced Adjectives
            { id: "historic-vs-historical", label: "historic vs historical", group: "Advanced Adjective Differences", level: "c2", termA: "historic", termB: "historical" },
            { id: "economic-vs-economical", label: "economic vs economical", group: "Advanced Adjective Differences", level: "c2", termA: "economic", termB: "economical" },
            { id: "classic-vs-classical", label: "classic vs classical", group: "Advanced Adjective Differences", level: "c2", termA: "classic", termB: "classical" },
            { id: "electric-vs-electrical", label: "electric vs electrical", group: "Advanced Adjective Differences", level: "c2", termA: "electric", termB: "electrical" },
            { id: "sensible-vs-sensitive", label: "sensible vs sensitive", group: "Advanced Adjective Differences", level: "c2", termA: "sensible", termB: "sensitive" },
            { id: "imaginary-vs-imaginative", label: "imaginary vs imaginative", group: "Advanced Adjective Differences", level: "c2", termA: "imaginary", termB: "imaginative" },
            { id: "continuous-vs-continual", label: "continuous vs continual", group: "Advanced Adjective Differences", level: "c2", termA: "continuous", termB: "continual" },
            { id: "comprehensive-vs-comprehensible", label: "comprehensive vs comprehensible", group: "Advanced Adjective Differences", level: "c2", termA: "comprehensive", termB: "comprehensible" },
            { id: "respectful-vs-respectable", label: "respectful vs respectable", group: "Advanced Adjective Differences", level: "c2", termA: "respectful", termB: "respectable" },
            { id: "considerable-vs-considerate", label: "considerable vs considerate", group: "Advanced Adjective Differences", level: "c2", termA: "considerable", termB: "considerate" },

            // Advanced Verbs
            { id: "assure-vs-ensure-vs-insure", label: "assure vs ensure vs insure", group: "Advanced Verb Differences", level: "c2", termA: "ensure", termB: "assure" },
            { id: "rise-vs-raise-vs-arise", label: "rise vs raise vs arise", group: "Advanced Verb Differences", level: "c2", termA: "rise", termB: "raise" },
            { id: "deny-vs-refuse", label: "deny vs refuse", group: "Advanced Verb Differences", level: "c2", termA: "deny", termB: "refuse" },
            { id: "avoid-vs-prevent", label: "avoid vs prevent", group: "Advanced Verb Differences", level: "c2", termA: "avoid", termB: "prevent" },
            { id: "hope-vs-expect", label: "hope vs expect", group: "Advanced Verb Differences", level: "c2", termA: "hope", termB: "expect" },
            { id: "win-vs-earn", label: "win vs earn", group: "Advanced Verb Differences", level: "c2", termA: "win", termB: "earn" },
            { id: "steal-vs-rob", label: "steal vs rob", group: "Advanced Verb Differences", level: "c2", termA: "steal", termB: "rob" },

            // Advanced Society & Culture
            { id: "tradition-vs-custom", label: "tradition vs custom", group: "Advanced Society & Culture", level: "c2", termA: "tradition", termB: "custom" },
            { id: "culture-vs-civilization", label: "culture vs civilization", group: "Advanced Society & Culture", level: "c2", termA: "culture", termB: "civilization" },
            { id: "race-vs-ethnicity", label: "race vs ethnicity", group: "Advanced Society & Culture", level: "c2", termA: "race", termB: "ethnicity" },
            { id: "nation-vs-state", label: "nation vs state", group: "Advanced Society & Culture", level: "c2", termA: "nation", termB: "state" },
            { id: "politics-vs-policy", label: "politics vs policy", group: "Advanced Society & Culture", level: "c2", termA: "politics", termB: "policy" },
            { id: "government-vs-administration", label: "government vs administration", group: "Advanced Society & Culture", level: "c2", termA: "government", termB: "administration" },
            { id: "law-vs-rule", label: "law vs rule", group: "Advanced Society & Culture", level: "c2", termA: "law", termB: "rule" },
            { id: "freedom-vs-liberty", label: "freedom vs liberty", group: "Advanced Society & Culture", level: "c2", termA: "freedom", termB: "liberty" },

            // Advanced Academic Confusions
            { id: "analyze-vs-examine", label: "analyze vs examine", group: "Advanced Academic Confusions", level: "c2", termA: "analyze", termB: "examine" },
            { id: "evaluate-vs-assess", label: "evaluate vs assess", group: "Advanced Academic Confusions", level: "c2", termA: "evaluate", termB: "assess" },
            { id: "criticize-vs-critique", label: "criticize vs critique", group: "Advanced Academic Confusions", level: "c2", termA: "criticize", termB: "critique" },
            { id: "discuss-vs-debate", label: "discuss vs debate", group: "Advanced Academic Confusions", level: "c2", termA: "discuss", termB: "debate" },
            { id: "claim-vs-argue", label: "claim vs argue", group: "Advanced Academic Confusions", level: "c2", termA: "claim", termB: "argue" },
            { id: "prove-vs-demonstrate", label: "prove vs demonstrate", group: "Advanced Academic Confusions", level: "c2", termA: "prove", termB: "demonstrate" },
            { id: "summarize-vs-conclude", label: "summarize vs conclude", group: "Advanced Academic Confusions", level: "c2", termA: "summarize", termB: "conclude" },
            { id: "assume-vs-presume", label: "assume vs presume", group: "Advanced Academic Confusions", level: "c2", termA: "assume", termB: "presume" },
            { id: "estimate-vs-predict", label: "estimate vs predict", group: "Advanced Academic Confusions", level: "c2", termA: "estimate", termB: "predict" },

            // Advanced Connectors & Logic
            { id: "however-vs-nevertheless", label: "however vs nevertheless", group: "Advanced Connectors & Logic", level: "c2", termA: "however", termB: "nevertheless" },
            { id: "especially-vs-specially", label: "especially vs specially", group: "Advanced Connectors & Logic", level: "c2", termA: "especially", termB: "specially" },
            { id: "eventually-vs-finally", label: "eventually vs finally", group: "Advanced Connectors & Logic", level: "c2", termA: "eventually", termB: "finally" },
            { id: "actually-vs-currently", label: "actually vs currently", group: "Advanced Connectors & Logic", level: "c2", termA: "actually", termB: "currently" },
            { id: "eventually-vs-possibly", label: "eventually vs possibly", group: "Advanced Connectors & Logic", level: "c2", termA: "eventually", termB: "possibly" },
            { id: "maybe-vs-perhaps", label: "maybe vs perhaps", group: "Advanced Connectors & Logic", level: "c2", termA: "maybe", termB: "perhaps" },
            { id: "already-vs-yet", label: "already vs yet", group: "Advanced Connectors & Logic", level: "c2", termA: "already", termB: "yet" },
            { id: "still-vs-anymore", label: "still vs anymore", group: "Advanced Connectors & Logic", level: "c2", termA: "still", termB: "anymore" }
        ]
    };

    if (typeof window !== 'undefined') {
        window.COSY_VOCAB_CONFUSION_PAIRS = VOCAB_CONFUSION_PAIRS;
    }
    if (typeof module !== 'undefined') {
        module.exports = VOCAB_CONFUSION_PAIRS;
    }
})();
