/**
 * practice/types/vocabulary/vocabulary.js
 * Vocabulary data provider and task generator for practice sessions.
 */

(function() {
    'use strict';

    const LEVEL_MAP = {
        'starter': 'a1',
        'elementary': 'a2',
        'intermediate': 'b1',
        'upper_intermediate': 'b2',
        'advanced': 'c1',
        'proficiency': 'c2'
    };

    function toShortLevelCode(lvl) {
        if (!lvl) return 'a1';
        const l = String(lvl).toLowerCase();
        return LEVEL_MAP[l] || (['a1', 'a2', 'b1', 'b2', 'c1', 'c2'].includes(l) ? l : 'a1');
    }

    /* ══════════════════════════════════════
       QUESTION DATA (Static Fallbacks)
    ══════════════════════════════════════ */
    const QUESTIONS = {
        EN: {
            Vocabulary: [
                { type:'mc', q:'"sibling" = ?', opts:['A brother or sister','A parent','A cousin','A friend'], ans:0, level:'starter', theme:'Family' },
                { type:'mc', q:'"ancient" ≠ ?', opts:['Modern','Old','Historic','Antique'], ans:0, level:'elementary', theme:'Arts & Culture' },
                { type:'mc', q:'"resilient" = ?', opts:['Able to recover quickly from difficult conditions','Easily broken','Slightly confused','Extremely loud'], ans:0, level:'intermediate', theme:'Daily Life' },
                { type:'mc', q:'"meticulous" ≈ ?', opts:['Thorough and attentive to detail','Careless','Hasty','Vague'], ans:0, level:'upper_intermediate', theme:'Daily Life' },
                { type:'tf', q:'"ubiquitous" = "extremely rare"', ans:false, level:'advanced', theme:'Daily Life' },
            ],
            Grammar: [
                // Prepositions of Place
                { type:'mc', q:'The book is ___ the table.', opts:['on','in','at','to'], ans:0, level:'starter', theme:'prepositions_place', ruleHint:'Use "on" for flat surfaces.' },
                { type:'mc', q:'She is waiting ___ the bus stop.', opts:['at','on','in','into'], ans:0, level:'starter', theme:'prepositions_place', ruleHint:'Use "at" for specific locations and points.' },
                { type:'mc', q:'There is a cat ___ the car.', opts:['under','on top','at','into'], ans:0, level:'starter', theme:'prepositions_place', ruleHint:'Use "under" when something is directly beneath something else.' },
                { type:'mc', q:'The cafe is ___ the bank and the pharmacy.', opts:['between','among','inside','at'], ans:0, level:'elementary', theme:'prepositions_place', ruleHint:'Use "between" when referring to two distinct items.' },

                // Prepositions of Time
                { type:'mc', q:'Our meeting starts ___ 9:00 AM.', opts:['at','in','on','for'], ans:0, level:'starter', theme:'prepositions_time', ruleHint:'Use "at" for precise clock times.' },
                { type:'mc', q:'She was born ___ July.', opts:['in','on','at','for'], ans:0, level:'starter', theme:'prepositions_time', ruleHint:'Use "in" for months, years, seasons, and long periods.' },
                { type:'mc', q:'We always go hiking ___ Saturdays.', opts:['on','in','at','during'], ans:0, level:'starter', theme:'prepositions_time', ruleHint:'Use "on" for days of the week and dates.' },
                { type:'mc', q:'I have lived here ___ three years.', opts:['for','since','during','in'], ans:0, level:'intermediate', theme:'prepositions_time', ruleHint:'Use "for" to indicate a duration of time.' },

                // Adjective Contrast Pairs (-ed vs -ing)
                { type:'mc', q:'The football match was really ___!', opts:['exciting','excited','excite','excitement'], ans:0, level:'elementary', theme:'contrast_pairs', ruleHint:'-ing adjectives describe the characteristic of a thing or event.' },
                { type:'mc', q:'I was so ___ after hearing the great news!', opts:['excited','exciting','excite','excitement'], ans:0, level:'elementary', theme:'contrast_pairs', ruleHint:'-ed adjectives describe human feelings and emotional states.' },
                { type:'mc', q:'This book is so ___; I cannot finish reading it.', opts:['boring','bored','bores','boredom'], ans:0, level:'elementary', theme:'contrast_pairs', ruleHint:'-ing adjectives describe what causes the feeling.' },
                { type:'mc', q:'The audience felt ___ during the long presentation.', opts:['bored','boring','bores','boredom'], ans:0, level:'elementary', theme:'contrast_pairs', ruleHint:'-ed adjectives express how people feel.' },
                { type:'mc', q:'Are you ___ in modern history and art?', opts:['interested','interesting','interest','interests'], ans:0, level:'elementary', theme:'contrast_pairs', ruleHint:'Use "interested in" for personal interest.' },
                { type:'mc', q:'She told us an ___ story about her travels.', opts:['interesting','interested','interest','interests'], ans:0, level:'elementary', theme:'contrast_pairs', ruleHint:'Use "interesting" to describe a noun.' },

                // Nouns, Articles & Plurals
                { type:'mc', q:'I bought ___ apple and a banana.', opts:['an','a','the','some'], ans:0, level:'starter', theme:'articles_gender', ruleHint:'Use "an" before words starting with a vowel sound.' },
                { type:'mc', q:'We need ___ bread and cheese.', opts:['some','a','an','many'], ans:0, level:'starter', theme:'articles_gender', ruleHint:'Use "some" with uncountable nouns.' },
                { type:'mc', q:'How ___ milk do we have in the fridge?', opts:['much','many','few','a few'], ans:0, level:'starter', theme:'articles_gender', ruleHint:'Use "how much" with uncountable nouns like milk.', practice_links:['manuals/en/grammar/a1/topics/countables-uncountables.html'] },
                { type:'mc', q:'How ___ apples did you buy at the market?', opts:['many','much','little','a little'], ans:0, level:'starter', theme:'articles_gender', ruleHint:'Use "how many" with countable plural nouns like apples.', practice_links:['manuals/en/grammar/a1/topics/countables-uncountables.html'] },
                { type:'mc', q:'One child, two ___ .', opts:['children','childs','childes','childrens'], ans:0, level:'starter', theme:'cases_declensions', ruleHint:'Irregular plural: child ➔ children.' },

                // Sentence Syntax & Connectors
                { type:'mc', q:'We stayed home ___ the heavy rain.', opts:['because of','because','although','despite of'], ans:0, level:'intermediate', theme:'syntax_word_order', ruleHint:'Use "because of" before a noun phrase.' },
                { type:'mc', q:'___ it was raining, we went for a walk in the park.', opts:['Although','Despite','In spite of','Because of'], ans:0, level:'intermediate', theme:'syntax_word_order', ruleHint:'Use "Although" followed by a full subject + verb clause.' },
                { type:'mc', q:'She studied hard ___ pass the examination.', opts:['in order to','so that','because','despite'], ans:0, level:'intermediate', theme:'syntax_word_order', ruleHint:'Use "in order to" followed by an infinitive verb.' },

                // Interactive Scramble, Cloze & Typing Exercises
                { type:'sc', q:'🧩 Reorder the sentence:', ans:'She does not like coffee in the morning.', level:'starter', theme:'syntax_word_order', item:{ word:'Sentence Order' }, practice_links:['manuals/en/grammar/a1/topics/word-order.html'] },
                { type:'cloze', q:'Fill in the blank: She is interested [ ___ ] modern art.', sentence:'She is interested [ ___ ] modern art.', opts:['in','at','on','for'], ans:0, level:'elementary', theme:'prepositions_place', ruleHint:'Use "in" with the adjective interested.', practice_links:['manuals/en/grammar/a1/topics/prepositions-place.html'] },
                { type:'type', q:'"Past simple of verb: go" = ?', ans:'went', level:'starter', theme:'tenses_aspect', ruleHint:'Irregular verb: go ➔ went.', item:{ word:'went' }, practice_links:['manuals/en/grammar/a1/topics/past-simple-irregular.html'] },

                // Tenses & Conditionals
                { type:'mc', q:'✓ ?', opts:['She doesn\'t like coffee.','She don\'t like coffee.','She not like coffee.','She isn\'t like coffee.'], ans:0, level:'starter', theme:'tenses_aspect', ruleHint:'Present simple third person singular uses "doesn\'t".' },
                { type:'mc', q:'I ___ Paris twice in my life.', opts:['have visited','visited','was visiting','had visit'], ans:0, level:'intermediate', theme:'tenses_aspect', ruleHint:'Use Present Perfect for life experience without a specified past time.' },
                { type:'mc', q:'Yesterday at 8 PM, I ___ dinner when you called.', opts:['was cooking','cooked','have cooked','had cook'], ans:0, level:'intermediate', theme:'tenses_aspect', ruleHint:'Past Continuous describes an ongoing action interrupted by a Past Simple event.' },
                { type:'tf', q:'"I have been living here for 3 years" = present perfect continuous', ans:true, level:'intermediate', theme:'tenses_aspect' },
                { type:'mc', q:'✓ ?', opts:['If I had known, I would have called you.','If I knew, I would call you yesterday.','If I have known, I called you.','If I had knew, I will call you.'], ans:0, level:'upper_intermediate', theme:'conditionals_moods', ruleHint:'Third conditional formula: If + Past Perfect, Subject + would have + Past Participle.' },
                { type:'mc', q:'If I ___ more time, I would learn another language.', opts:['had','have','would have','had had'], ans:0, level:'intermediate', theme:'conditionals_moods', ruleHint:'Second conditional uses Past Simple in the "if" clause for unreal present situations.' }
            ]
        },
        FR: {
            Vocabulary: [
                { type:'mc', q:'"frère" = ?', opts:['Le fils des mêmes parents','Un parent éloigné','Un ami d’enfance','Une sœur'], ans:0, level:'starter', theme:'Family' },
                { type:'mc', q:'"ancien" ≠ ?', opts:['Moderne','Vieux','Historique','Antique'], ans:0, level:'elementary', theme:'Arts & Culture' },
                { type:'mc', q:'"bienveillant" = ?', opts:['Attentif et soucieux du bien d’autrui','Égoïste','Indifférent','Sévère'], ans:0, level:'intermediate', theme:'Daily Life' },
                { type:'tf', q:'"rapide" = "très lent"', ans:false, level:'starter', theme:'Daily Life' }
            ],
            Grammar: [
                // Prépositions de lieu & temps
                { type:'mc', q:'Le livre est ___ la table.', opts:['sur','dans','à','sous'], ans:0, level:'starter', theme:'prepositions_place', ruleHint:'Utilisez "sur" pour une surface.' },
                { type:'mc', q:'Elle habite ___ Paris.', opts:['à','dans','en','au'], ans:0, level:'starter', theme:'prepositions_place', ruleHint:'Utilisez "à" devant le nom d\'une ville.' },
                { type:'mc', q:'Le train arrive ___ 15h00.', opts:['à','en','dans','sur'], ans:0, level:'starter', theme:'prepositions_time', ruleHint:'Utilisez "à" pour indiquer l\'heure exacte.' },
                { type:'mc', q:'Nous partons en vacances ___ juillet.', opts:['en','à','dans','au'], ans:0, level:'starter', theme:'prepositions_time', ruleHint:'Utilisez "en" devant les mois et saisons.' },

                // Adjectifs & Paires de contraste
                { type:'mc', q:'Ce film est vraiment ___ !', opts:['intéressant','intéressé','intéresser','intérêt'], ans:0, level:'elementary', theme:'contrast_pairs', ruleHint:'Utilisez l\'adjectif qualificatif pour décrire une chose.' },
                { type:'mc', q:'Il est très ___ par la peinture moderne.', opts:['intéressé','intéressant','intéresser','intérêt'], ans:0, level:'elementary', theme:'contrast_pairs', ruleHint:'Utilisez "intéressé par" pour exprimer un sentiment personnel.' },

                // Articles & Partitifs
                { type:'mc', q:'Je voudrais ___ pain et du fromage.', opts:['du','de la','des','le'], ans:0, level:'starter', theme:'articles_gender', ruleHint:'Utilisez l\'article partitif "du" devant un nom masculin singulier.' },
                { type:'mc', q:'Il mange ___ eau fraîche.', opts:['de l\'','du','de la','des'], ans:0, level:'starter', theme:'articles_gender', ruleHint:'Devant une voyelle ou un h muet, utilisez "de l\'".' },

                // Syntaxe & Connecteurs
                { type:'mc', q:'Il est venu ___ la pluie battait son plein.', opts:['bien que','malgré','à cause de','pour'], ans:0, level:'intermediate', theme:'syntax_word_order', ruleHint:'"Bien que" est suivi du subjonctif.' },
                { type:'mc', q:'Nous sommes sortis ___ la pluie.', opts:['malgré','bien que','parce que','afin que'], ans:0, level:'intermediate', theme:'syntax_word_order', ruleHint:'"Malgré" est suivi directement d\'un groupe nominal.' },

                // Exercices interactifs : Scramble, Cloze & Saisie
                { type:'sc', q:'🧩 Réordonnez la phrase :', ans:'Elle n’aime pas le café le matin.', level:'starter', theme:'syntax_word_order', item:{ word:'Ordre des mots' }, practice_links:['grammaire-francaise/topics/negation.html'] },
                { type:'cloze', q:'Complétez : Le livre est [ ___ ] la table.', sentence:'Le livre est [ ___ ] la table.', opts:['sur','dans','à','sous'], ans:0, level:'starter', theme:'prepositions_place', ruleHint:'"Sur" indique la position sur une surface.', practice_links:['grammaire-francaise/topics/prepositions.html'] },
                { type:'type', q:'"Passé composé du verbe : être (il)" = ?', ans:'a été', level:'starter', theme:'tenses_aspect', ruleHint:'Passé composé avec l\'auxiliaire avoir : il a été.', item:{ word:'a été' }, practice_links:['grammaire-francaise/topics/passe-compose.html'] },

                // Temps & Subjonctif
                { type:'mc', q:'✓ ?', opts:['Elle n’aime pas le café.','Elle ne aime pas le café.','Elle pas aime le café.','Elle aime pas le café.'], ans:0, level:'starter', theme:'tenses_aspect', ruleHint:'La négation entoure le verbe : ne + verbe + pas (avec élision n\').' },
                { type:'mc', q:'Pendant que je lisais, le téléphone ___ .', opts:['a sonné','sonnait','a sonner','sonne'], ans:0, level:'intermediate', theme:'tenses_aspect', ruleHint:'L\'imparfait décrit une action en cours, interrompue par le passé composé.' },
                { type:'mc', q:'✓ ?', opts:['Il faut que tu fasses attention.','Il faut que tu fais attention.','Il faut que tu faire attention.','Il faut tu fais attention.'], ans:0, level:'intermediate', theme:'conditionals_moods', ruleHint:'L\'expression "il faut que" nécessite le subjonctif présent.' },
                { type:'mc', q:'Si j\'avais su, je ___ plus tôt.', opts:['serais venu','venais','viendrai','suis venu'], ans:0, level:'upper_intermediate', theme:'conditionals_moods', ruleHint:'Si + plus-que-parfait est suivi du conditionnel passé.' }
            ]
        },
        IT: {
            Vocabulary: [
                { type:'mc', q:'"fratello" = ?', opts:['Il figlio dei propri genitori','Un genitore','Un cugino','Un amico'], ans:0, level:'starter', theme:'Family' },
                { type:'mc', q:'"antico" ≠ ?', opts:['Moderno','Vecchio','Storico','Antico'], ans:0, level:'elementary', theme:'Arts & Culture' },
                { type:'mc', q:'"accogliente" = ?', opts:['Caldo, ospitale e confortevole','Freddo','Lontano','Pericoloso'], ans:0, level:'intermediate', theme:'Daily Life' },
                { type:'tf', q:'"veloce" = "molto lento"', ans:false, level:'starter', theme:'Daily Life' }
            ],
            Grammar: [
                // Preposizioni di luogo e tempo
                { type:'mc', q:'Il libro è ___ tavolo.', opts:['sul','in','a','per'], ans:0, level:'starter', theme:'prepositions_place', ruleHint:'Utilizza la preposizione articolata "sul" (su + il).' },
                { type:'mc', q:'Abiti ___ Roma o a Milano?', opts:['a','in','da','su'], ans:0, level:'starter', theme:'prepositions_place', ruleHint:'Usa "a" davanti ai nomi di città.' },
                { type:'mc', q:'La lezione inizia ___ 9:00.', opts:['alle','in','a','da'], ans:0, level:'starter', theme:'prepositions_time', ruleHint:'Usa "alle" per indicare l\'ora.' },

                // Coppie di contrasto
                { type:'mc', q:'Questo libro è molto ___!', opts:['interessante','interessato','interessare','interesse'], ans:0, level:'elementary', theme:'contrast_pairs', ruleHint:'Descrittivo per un oggetto o storia.' },
                { type:'mc', q:'Sono molto ___ alla tua proposta.', opts:['interessato','interessante','interessare','interesse'], ans:0, level:'elementary', theme:'contrast_pairs', ruleHint:'Esprime uno stato d\'animo personale.' },

                // Articoli & Genere
                { type:'mc', q:'___ studente è molto intelligente.', opts:['Lo','Il','La','L\''], ans:0, level:'starter', theme:'articles_gender', ruleHint:'Usa "lo" davanti a nomi maschili che iniziano con s + consonante.' },
                { type:'mc', q:'Vorrei ___ acqua minerale.', opts:['dell\'','del','dello','della'], ans:0, level:'starter', theme:'articles_gender', ruleHint:'Usa "dell\'" per i partitivi femminili che iniziano con vocale.' },

                // Sintassi & Connettori
                { type:'mc', q:'Siamo usciti ___ la pioggia.', opts:['nonostante','perché','affinché','poiché'], ans:0, level:'intermediate', theme:'syntax_word_order', ruleHint:'"Nonostante" è seguito da un sostantivo.' },

                // Tempi & Congiuntivo
                { type:'mc', q:'✓ ?', opts:['A lei non piace il caffè.','Lei non piace il caffè.','Lei no piace il caffè.','A lei non piacciono il caffè.'], ans:0, level:'starter', theme:'tenses_aspect', ruleHint:'Il verbo piacere concorda con l\'oggetto (il caffè).' },
                { type:'mc', q:'Mentre studiavo, Marco ___ a casa.', opts:['è arrivato','arrivava','arriva','era arrivato'], ans:0, level:'intermediate', theme:'tenses_aspect', ruleHint:'L\'imperfetto indica l\'azione continuata, il passato prossimo l\'evento puntuale.' },
                { type:'mc', q:'✓ ?', opts:['Penso che sia una buona idea.','Penso che è una buona idea.','Penso che sara una buona idea.','Penso che fose una buona idea.'], ans:0, level:'intermediate', theme:'conditionals_moods', ruleHint:'I verbi di opinione (pensare) richiedono il congiuntivo.' }
            ]
        },
        RU: {
            Vocabulary: [
                { type:'mc', q:'"брат" = ?', opts:['Сын тех же родителей','Родитель','Двоюродный брат','Друг'], ans:0, level:'starter', theme:'Family' },
                { type:'mc', q:'"древний" ≠ ?', opts:['Современный','Старый','Исторический','Античный'], ans:0, level:'elementary', theme:'Arts & Culture' },
                { type:'mc', q:'"вдохновляющий" = ?', opts:['Побуждающий к творчеству или действию','Скучный','Утомительный','Непонятный'], ans:0, level:'intermediate', theme:'Daily Life' },
                { type:'tf', q:'"быстрый" = "очень медленный"', ans:false, level:'starter', theme:'Daily Life' }
            ],
            Grammar: [
                // Предлоги места и времени (Падежи)
                { type:'mc', q:'Книга лежит ___ столе.', opts:['на','в','к','за'], ans:0, level:'starter', theme:'prepositions_place', ruleHint:'Предложный падеж: на столе (на поверхности).' },
                { type:'mc', q:'Мы идем ___ театр.', opts:['в','на','к','за'], ans:0, level:'starter', theme:'prepositions_place', ruleHint:'Винительный падеж направления: в театр.' },
                { type:'mc', q:'Урок начинается ___ 9 часов.', opts:['в','на','к','за'], ans:0, level:'starter', theme:'prepositions_time', ruleHint:'Указывает точное время: в 9 часов.' },

                // Контрастные пары
                { type:'mc', q:'Фильм был очень ___!', opts:['интересный','заинтересованный','интерес','интересно'], ans:0, level:'elementary', theme:'contrast_pairs', ruleHint:'Прилагательное описывает качество предмета.' },
                { type:'mc', q:'Я очень ___ в успехе проекта.', opts:['заинтересован','интересный','интерес','интересно'], ans:0, level:'elementary', theme:'contrast_pairs', ruleHint:'Краткое причастие описывает состояние человека.' },

                // Падежи & Род
                { type:'mc', q:'Я даю книгу ___ (друг).', opts:['другу','друга','другом','друге'], ans:0, level:'elementary', theme:'cases_declensions', ruleHint:'Дательный падеж адресата: другу (-у).' },
                { type:'mc', q:'Мы говорим о ___ (Москва).', opts:['Москве','Москву','Москвой','Москвы'], ans:0, level:'elementary', theme:'cases_declensions', ruleHint:'Предложный падеж объекта речи после предлога "о": о Москве (-е).' },

                // Синтаксис & Союзы
                { type:'mc', q:'Мы пошли на прогулку, ___ шел дождь.', opts:['хотя','несмотря на','из-за','чтобы'], ans:0, level:'intermediate', theme:'syntax_word_order', ruleHint:'Союз "хотя" связывает придаточное уступительное предложение.' },
                { type:'mc', q:'Мы остались дома ___ дождя.', opts:['из-за','потому что','хотя','для'], ans:0, level:'intermediate', theme:'syntax_word_order', ruleHint:'Предлог "из-за" используется с существительным в родительном падеже.' },

                // Время & Сослагательное наклонение
                { type:'mc', q:'✓ ?', opts:['Она не любит кофе.','Она нет любит кофе.','Она не любить кофе.','Она кофе не любит.'], ans:0, level:'starter', theme:'tenses_aspect', ruleHint:'Отрицание "не" ставится перед глаголом.' },
                { type:'mc', q:'Вчера я весь вечер ___ книгу.', opts:['читал','прочитал','прочитаю','буду читать'], ans:0, level:'elementary', theme:'tenses_aspect', ruleHint:'НСВ (читал) обозначает длительный процесс (весь вечер).' },
                { type:'mc', q:'Я ___ эту статью за один час.', opts:['прочитал','читал','дочитал','прочитаю'], ans:0, level:'elementary', theme:'tenses_aspect', ruleHint:'СВ (прочитал) обозначает завершенный результат за определенное время.' },
                { type:'mc', q:'✓ ?', opts:['Если бы я знал, я бы пришел.','Если я знал, я пришел бы.','Если бы я знаю, я приду.','Если я бы знал, пришел.'], ans:0, level:'intermediate', theme:'conditionals_moods', ruleHint:'Сослагательное наклонение использует частицу "бы" с глаголом прошедшего времени.' }
            ]
        },
        EL: {
            Vocabulary: [
                { type:'mc', q:'"αδελφός" = ?', opts:['Ο γιος των ίδιων γονέων','Ένας γονέας','Ένας ξάδελφος','Ένας φίλος'], ans:0, level:'starter', theme:'Family' },
                { type:'mc', q:'"αρχαίος" ≠ ?', opts:['Σύγχρονος','Παλιός','Ιστορικός','Αντίκα'], ans:0, level:'elementary', theme:'Arts & Culture' },
                { type:'mc', q:'"φιλόξενος" = ?', opts:['Ζεστός και φιλόφρων με τους καλεσμένους','Απρόσιτος','Επιθετικός','Αδιάφορος'], ans:0, level:'intermediate', theme:'Daily Life' },
                { type:'tf', q:'"γρήγορος" = "πολύ αργός"', ans:false, level:'starter', theme:'Daily Life' }
            ],
            Grammar: [
                // Προθέσεις τόπου & χρόνου
                { type:'mc', q:'Το βιβλίο είναι ___ τραπέζι.', opts:['στο','από','για','με'], ans:0, level:'starter', theme:'prepositions_place', ruleHint:'Σύνθετη πρόθεση: σε + το = στο.' },
                { type:'mc', q:'Μένω ___ Αθήνα.', opts:['στην','από','για','με'], ans:0, level:'starter', theme:'prepositions_place', ruleHint:'Σύνθετη πρόθεση: σε + την = στην.' },
                { type:'mc', q:'Το μάθημα αρχίζει ___ 9:00.', opts:['στις','από','για','με'], ans:0, level:'starter', theme:'prepositions_time', ruleHint:'Χρησιμοποιήστε "στις" για τις ώρες.' },

                // Αντιθετικά ζεύγη
                { type:'mc', q:'Αυτό το βιβλίο είναι πολύ ___!', opts:['ενδιαφέρον','ενδιαφερόμενος','ενδιαφέρονται','ενδιαφέροντος'], ans:0, level:'elementary', theme:'contrast_pairs', ruleHint:'Περιγραφή ιδιότητας ενός πράγματος.' },

                // Άρθρα & Πτώσεις
                { type:'mc', q:'Βλέπω ___ φίλο μου.', opts:['τον','ο','του','το'], ans:0, level:'starter', theme:'cases_declensions', ruleHint:'Αιτιατική πτώση αρσενικού: τον φίλο.' },

                // Σύνταξη & Σύνδεσμοι
                { type:'mc', q:'Βγήκαμε έξω ___ έβρεχε.', opts:['αν και','εξαιτίας','για να','επειδή'], ans:0, level:'intermediate', theme:'syntax_word_order', ruleHint:'"Αν και" εισάγει εναντιωματική πρόταση.' },

                // Χρόνοι & Υποθετικοί λόγοι
                { type:'mc', q:'✓ ?', opts:['Δεν της αρέσει ο καφές.','Δεν αρέσει ο καφές αυτής.','Δεν την αρέσει ο καφές.','Δεν της αρέσουν ο καφές.'], ans:0, level:'starter', theme:'tenses_aspect' },
                { type:'mc', q:'✓ ?', opts:['Αν είχα χρόνο, θα ερχόμουν.','Αν έχω χρόνο, θα ερχόμουν.','Αν είχα χρόνο, θα έρθω.','Αν είχα χρόνο, ερχόμουν.'], ans:0, level:'intermediate', theme:'conditionals_moods', ruleHint:'Υποθετικός λόγος 2ου είδους: Αν + παρατατικός, θα + παρατατικός.' }
            ]
        }
    };

    function getQuestions(lang, catInput, level, theme, subTheme) {
        const langKey = (lang || 'EN').toUpperCase();
        const cat = (catInput === 'vocab' || catInput === 'vocabulary' || catInput === 'Vocabulary') ? 'Vocabulary'
                  : (catInput === 'grammar' || catInput === 'Grammar') ? 'Grammar'
                  : catInput || 'Vocabulary';
        let pool = (QUESTIONS[langKey] && QUESTIONS[langKey][cat]) ? [...QUESTIONS[langKey][cat]] : [];

        if (cat === 'Vocabulary' || cat === 'vocab' || cat === 'vocabulary') {
            const normLvl = (level === 'starter' || level === 'a1') ? 'a1' :
                            (level === 'elementary' || level === 'a2') ? 'a2' :
                            (level === 'intermediate' || level === 'b1') ? 'b1' :
                            (level === 'upper_intermediate' || level === 'b2') ? 'b2' :
                            (level === 'advanced' || level === 'c1') ? 'c1' :
                            (level === 'proficiency' || level === 'c2') ? 'c2' : 'all';

            let modularItems = [];

            if (window.COSY_VOCAB_DATA) {
                const dataKey = `${normLvl}_${theme}`;
                if (window.COSY_VOCAB_DATA[dataKey] && window.COSY_VOCAB_DATA[dataKey].sentences) {
                    modularItems = window.COSY_VOCAB_DATA[dataKey].sentences;
                } else if (theme === 'all') {
                    Object.keys(window.COSY_VOCAB_DATA).forEach(k => {
                        if (normLvl === 'all' || k.startsWith(`${normLvl}_`)) {
                            modularItems.push(...(window.COSY_VOCAB_DATA[k].sentences || []));
                        }
                    });
                }
            }

            if (modularItems.length > 0) {
                const formattedItems = modularItems.map(item => ({
                    form: item.type || 'cloze',
                    type: item.type || 'cloze',
                    q: item.q,
                    sentence: item.sentence || item.q,
                    wrongSentence: item.wrongSentence,
                    correctSentence: item.correctSentence,
                    errorExplanation: item.errorExplanation,
                    opts: item.opts,
                    ans: item.ans,
                    level: item.level || normLvl,
                    theme: item.id ? item.id.split('-r-')[0].split('-w-')[0] : theme,
                    ruleHint: item.ruleHint || item.errorExplanation,
                    practice_links: item.practice_links,
                    item: {
                        word: item.id || item.label || theme,
                        ruleHint: item.ruleHint || item.errorExplanation,
                        practice_links: item.practice_links
                    }
                }));

                pool = [...formattedItems, ...pool];
            }
        }

        if (cat === 'Grammar' || cat === 'grammar') {
            const normLvl = (level === 'starter' || level === 'a1') ? 'a1' :
                            (level === 'elementary' || level === 'a2') ? 'a2' :
                            (level === 'intermediate' || level === 'b1') ? 'b1' :
                            (level === 'upper_intermediate' || level === 'b2') ? 'b2' :
                            (level === 'advanced' || level === 'c1') ? 'c1' :
                            (level === 'proficiency' || level === 'c2') ? 'c2' : 'all';

            let modularItems = [];

            // 1. Check window.COSY_GRAMMAR_DATA (standalone 150-sentence topic files)
            if (window.COSY_GRAMMAR_DATA) {
                const dataKey = `${normLvl}_${theme}`;
                if (window.COSY_GRAMMAR_DATA[dataKey] && window.COSY_GRAMMAR_DATA[dataKey].sentences) {
                    modularItems = window.COSY_GRAMMAR_DATA[dataKey].sentences;
                } else {
                    // Collect all available topic sentences for the level
                    Object.keys(window.COSY_GRAMMAR_DATA).forEach(k => {
                        if (k.startsWith(`${normLvl}_`)) {
                            modularItems.push(...(window.COSY_GRAMMAR_DATA[k].sentences || []));
                        }
                    });
                }
            }

            // 2. Fallback to language-specific COSY_GRAMMAR_CONFUSION_PAIRS
            const isFrench = (langKey === 'FR' || (lang || '').toLowerCase() === 'fr');
            const pairsData = isFrench ? window.COSY_FRENCH_GRAMMAR_CONFUSION_PAIRS : window.COSY_GRAMMAR_CONFUSION_PAIRS;

            if (modularItems.length === 0 && pairsData) {
                if (normLvl !== 'all' && pairsData[normLvl]) {
                    modularItems = [...pairsData[normLvl]];
                } else {
                    Object.values(pairsData).forEach(arr => {
                        modularItems.push(...arr);
                    });
                }
            }

            const formattedItems = modularItems.map(item => ({
                form: item.type || 'cloze',
                type: item.type || 'cloze',
                q: item.q,
                sentence: item.sentence || item.q,
                wrongSentence: item.wrongSentence,
                correctSentence: item.correctSentence,
                errorExplanation: item.errorExplanation,
                opts: item.opts,
                ans: item.ans,
                level: item.level || normLvl,
                theme: item.id ? item.id.split('-r-')[0].split('-w-')[0] : theme,
                ruleHint: item.ruleHint || item.errorExplanation,
                practice_links: item.practice_links,
                item: {
                    word: item.id || item.label || theme,
                    ruleHint: item.ruleHint || item.errorExplanation,
                    practice_links: item.practice_links
                }
            }));

            pool = [...formattedItems, ...pool];
        }

        if (!pool || !pool.length) return [];

        const norm = v => (v || '').toLowerCase().replace(/-/g, '_');
        const normHyphen = v => (v || '').toLowerCase().replace(/_/g, '-');
        const normalizedLevel = level !== 'all' ? norm(level) : 'all';

        return pool.filter(q => {
            const qLevel = norm(q.level || 'starter');
            const levelMatch = normalizedLevel === 'all' || qLevel === normalizedLevel || qLevel === LEVEL_MAP[normalizedLevel];
            const qThemeNorm = norm(q.theme);
            const qThemeHyphen = normHyphen(q.theme);
            const targetThemeNorm = norm(theme);
            const targetThemeHyphen = normHyphen(theme);

            const themeMatch = theme === 'all' || qThemeNorm === targetThemeNorm || qThemeHyphen === targetThemeHyphen;
            return levelMatch && themeMatch;
        });
    }

    /* ══════════════════════════════════════
       DATA LOADING
    ══════════════════════════════════════ */
    async function ensureDataLoaded(lang, level, cat, theme) {
        const targetLang = (lang || 'en').toLowerCase();
        if (window.COSY && window.COSY.loadLanguageData) {
            await window.COSY.loadLanguageData(targetLang, level);
        } else {
            console.error("Centralized loader COSY.loadLanguageData not found.");
        }

        // Dynamically load standalone topic datasets if requested
        if (theme && theme !== 'all') {
            const normLvl = (level === 'starter' || level === 'a1') ? 'a1' :
                            (level === 'elementary' || level === 'a2') ? 'a2' :
                            (level === 'intermediate' || level === 'b1') ? 'b1' :
                            (level === 'upper_intermediate' || level === 'b2') ? 'b2' :
                            (level === 'advanced' || level === 'c1') ? 'c1' :
                            (level === 'proficiency' || level === 'c2') ? 'c2' : 'a1';

            if (cat === 'Vocabulary' || cat === 'vocab' || cat === 'vocabulary') {
                const scriptId = `cosy-vocab-script-${normLvl}-${theme}`;
                if (typeof document !== 'undefined' && !document.getElementById(scriptId)) {
                    await new Promise((resolve) => {
                        const script = document.createElement('script');
                        script.id = scriptId;
                        script.src = `data/vocabulary/${normLvl}/${theme}.js`;
                        script.onload = resolve;
                        script.onerror = resolve;
                        document.head.appendChild(script);
                    });
                }
            }

            if (cat === 'Grammar' || cat === 'grammar') {
                const scriptId = `cosy-grammar-script-${normLvl}-${theme}`;
                if (typeof document !== 'undefined' && !document.getElementById(scriptId)) {
                    await new Promise((resolve) => {
                        const script = document.createElement('script');
                        script.id = scriptId;
                        script.src = `data/grammar/${normLvl}/${theme}.js`;
                        script.onload = resolve;
                        script.onerror = resolve;
                        document.head.appendChild(script);
                    });
                }
            }
        }

        // Load standalone app morphological datasets via adapter bridge
        if (window.COSY && window.COSY.loadAppData) {
            await Promise.all([
                window.COSY.loadAppData(targetLang, 'verbs'),
                window.COSY.loadAppData(targetLang, 'nouns')
            ]);
        }

        // Load JSON morphology datasets
        if (window.COSY && window.COSY.loadMorphologyData) {
            await window.COSY.loadMorphologyData(targetLang);
        }

        // Load reference phonology datasets (sounds, stress, intonation)
        if (window.COSY && window.COSY.loadPhonologyData) {
            await window.COSY.loadPhonologyData(targetLang);
        } else if (window.loadPhonologyData) {
            await window.loadPhonologyData(targetLang);
        }

        // Also load curriculum for pronunciation if needed
        if (window.COSY && window.COSY.loadCurriculum) {
            const lvl = (level || 'starter').toLowerCase();
            const lvlCode = LEVEL_MAP[lvl] || lvl;
            if (lvlCode !== 'all') {
                await window.COSY.loadCurriculum(targetLang, lvlCode);
            } else {
                for (let lc of Object.values(LEVEL_MAP)) {
                    await window.COSY.loadCurriculum(targetLang, lc);
                }
            }
        }
    }

    function buildMCQuestion(item, pool) {
        let matchType = 'definition';

        const hasSynonyms = Array.isArray(item.synonyms) && item.synonyms.length > 0;
        const hasAntonyms = (Array.isArray(item.antonyms) && item.antonyms.length > 0) || !!item.opposite;

        const choices = ['definition'];
        if (hasSynonyms) choices.push('synonym');
        if (hasAntonyms) choices.push('antonym');

        matchType = choices[Math.floor(Math.random() * choices.length)];

        let targetText = '';
        let qText = '';

        const itemWord = item.word || item.topic || item.phrase || '...';

        if (matchType === 'synonym') {
            targetText = item.synonyms[0];
            qText = `"${itemWord}" ≈ ?`;
        } else if (matchType === 'antonym') {
            targetText = item.antonyms?.[0] || item.opposite;
            qText = `"${itemWord}" ≠ ?`;
        } else {
            targetText = item.definitions?.[0]?.text || item.definition || item.subtext || itemWord || '...';
            qText = `"${itemWord}" = ?`;
        }

        // Pull distractors
        let distractors = [];
        if (matchType === 'definition') {
            distractors = pool
                .filter(p => (p.id ? p.id !== item.id : p !== item))
                .map(p => p.definitions?.[0]?.text || p.definition || p.subtext)
                .filter(Boolean)
                .sort(() => Math.random() - 0.5);
        } else {
            distractors = pool
                .filter(p => (p.id ? p.id !== item.id : p !== item))
                .map(p => p.word || p.topic || p.phrase)
                .filter(Boolean)
                .sort(() => Math.random() - 0.5);
        }

        distractors = [...new Set(distractors)].filter(d => d && d.toLowerCase() !== targetText.toLowerCase());
        distractors = distractors.slice(0, 2);

        const fallbackDefs = ['Alternative meaning or option', 'Related expression or concept'];
        const fallbackWords = ['Option B', 'Option C'];
        let fbIdx = 0;
        while (distractors.length < 2) {
            const fallback = pool
                .filter(p => p && (p.id ? p.id !== item.id : p !== item))
                .sort(() => Math.random() - 0.5)[0];
            const fallbackVal = matchType === 'definition'
                ? (fallback?.definitions?.[0]?.text || fallback?.definition || fallback?.subtext)
                : (fallback?.word || fallback?.topic || fallback?.phrase);
            if (fallbackVal && fallbackVal.toLowerCase() !== targetText.toLowerCase() && !distractors.includes(fallbackVal)) {
                distractors.push(fallbackVal);
            } else {
                const list = matchType === 'definition' ? fallbackDefs : fallbackWords;
                distractors.push(list[fbIdx % list.length]);
                fbIdx++;
            }
        }

        const allOpts = [targetText, ...distractors].sort(() => Math.random() - 0.5);
        const ans = allOpts.indexOf(targetText);

        const mappedLevel = LEVEL_MAP[item.level] || item.level || 'a1';

        return {
            type: 'mc',
            form: 'mc',
            q: qText,
            item,
            ans,
            opts: allOpts,
            level: mappedLevel,
            theme: item.theme,
            sub_theme: item.sub_theme || null,
            practice_links: item.practice_links,
            ruleHint: item.usage_hint || item.collocation || (item.preposition ? `Preposition: ${itemWord} ${item.preposition}` : null)
        };
    }

    /* ══════════════════════════════════════
       TASK GENERATION
    ══════════════════════════════════════ */
    function beginSession(lang, catInput, level, theme, isChallenge, customQs, subTheme) {
        const cat = catInput || 'Vocabulary';
        console.log('[COSY Practice] beginSession', { lang, cat, level, theme, subTheme });

        if (customQs) {
            window.cosyPracticeEngine.startSession(lang, cat, level, theme, isChallenge, customQs);
            return;
        }

        let pool = [];
        const l = lang.toLowerCase();

        const norm = v => (v || '').toLowerCase().replace(/-/g, '_');
        const normalizedLevel = level !== 'all' ? norm(level) : 'all';

        if (cat === 'Vocabulary' || cat === 'Grammar' || cat === 'vocab' || cat === 'grammar' || cat === 'vocabulary') {
            const uiCat = (cat === 'vocab' || cat === 'Vocabulary' || cat === 'vocabulary') ? 'Vocabulary' : 'Grammar';
            const isStrict = uiCat === 'Vocabulary';

            pool = window.gameUtils.getVocabPool(l, level, theme, subTheme || 'all', { excludeExtra: true });

            // Apply category filtering to ensures consistent results between getVocabPool and fallback
            if (pool.length > 0) {
                pool = window.gameUtils.filterVocabulary(pool, { lang: l, level, theme, subTheme, category: uiCat, strict: isStrict });
            }

            console.log('[COSY Practice] getVocabPool result count:', pool.length);

            // Fallback to aggregated window.*Data if pool is empty
            if (pool.length === 0) {
                const keys = ['vocabularyData', 'verbsData', 'adjectivesData', 'locationsData', 'peopleData', 'nationalitiesData', 'grammarData', 'grammarElements'];
                let aggregatedPool = [];
                keys.forEach(key => {
                    if (window[key] && window[key][l]) aggregatedPool = aggregatedPool.concat(window[key][l]);
                });

                if (aggregatedPool.length > 0) {
                    pool = window.gameUtils.filterVocabulary(aggregatedPool, { lang: l, level, theme, subTheme, category: uiCat, strict: isStrict });
                    console.log('[COSY Practice] fallback filterVocabulary count:', pool.length);

                    // SECOND FALLBACK: If still empty, try to get ALL vocab for this language regardless of form filter
                    if (pool.length === 0) {
                        pool = aggregatedPool.filter(item => {
                            const itemLevel = norm(item.level || 'starter');
                            return (normalizedLevel === 'all' || itemLevel === normalizedLevel);
                        });
                        console.log('[COSY Practice] second fallback count:', pool.length);
                    }
                }
            }

            if (window.phrasesData && window.phrasesData[l]) {
                const phrases = [];
                Object.values(window.phrasesData[l]).flat().forEach(p => {
                    phrases.push({ word: p.phrase, level: 'starter', definitions: [{ text: p.definition }], examples: [{ text: p.example }], theme: 'phrases_idioms' });
                });
                pool.push(...window.gameUtils.filterVocabulary(phrases, { lang, level, theme, subTheme, category: uiCat, strict: isStrict }));
            }

            // Append dynamic morphology dataset items for Grammar practice
            if (uiCat === 'Grammar' && window.morphologyData && window.morphologyData[l]) {
                const morphItems = window.morphologyData[l].map(m => ({
                    id: m.id,
                    word: m.label || m.id,
                    definition: m.definition || m.group_label || 'Grammar & Morphology',
                    definitions: [{ text: m.definition || m.group_label || 'Grammar & Morphology' }],
                    level: (m.level || 'starter').toLowerCase(),
                    theme: m.group || 'Grammar',
                    practice_links: m.practice_links,
                    usage_hint: m.definition ? `Concept: ${m.definition}` : null
                }));
                const filteredMorph = morphItems.filter(m => {
                    const mLevel = norm(m.level);
                    const levelOk = normalizedLevel === 'all' || mLevel === normalizedLevel || mLevel.includes(normalizedLevel);
                    const themeOk = !theme || theme === 'all' || (window.gameUtils && window.gameUtils.isThemeMatch ? window.gameUtils.isThemeMatch(m.theme, theme, m) : true);
                    return levelOk && themeOk;
                });
                pool.push(...filteredMorph);
            }
        } else if (cat === 'Speaking' || cat === 'speaking') {
            const s = window.speakingData?.[l] || {};
            const speakingData = [
                ...(s.talkThatTalk || []),
                ...(s.debates || []),
                ...(s.opinions || []),
                ...(s.fluency || []),
                ...(s.quotes || [])
            ];
            const processedSpeaking = speakingData.map(d => {
                const item = { ...d };
                if (item.t && !item.topic) item.topic = item.t;
                if (item.q && !item.topic) item.topic = item.q;
                return {
                    ...item,
                    language: item.language || l,
                    level: item.level || normalizedLevel,
                    form: 'speaking'
                };
            });

            pool = window.gameUtils.filterVocabulary(processedSpeaking, { lang: l, level, theme, subTheme, category: 'Speaking' });
        } else if (cat === 'Pronunciation' || cat === 'pronunciation' || cat === 'Pronunciation 🔊') {
            const codes = (level === 'all') ? Object.values(LEVEL_MAP) : [toShortLevelCode(level)];

            const tempPool = [];

            // 1. Source from Curriculum Data
            codes.forEach(lvlCode => {
                const currKey = `${l}_${lvlCode}`;
                const currData = window.curriculumData?.[currKey] || [];
                currData.forEach(unit => {
                    (unit.lessons || []).forEach(lesson => {
                        if (lesson.pronunciation) {
                            lesson.pronunciation.forEach(p => {
                                tempPool.push(...(p.examples || []).map(ex => ({
                                    ...ex,
                                    theme: p.point,
                                    type: 'ls',
                                    language: l,
                                    level: lvlCode,
                                    form: 'pronunciation'
                                })));
                                // Fix for entries without examples or alphabet but with point
                                if (!p.examples && !p.alphabet && p.point) {
                                    tempPool.push({
                                        word: p.point,
                                        theme: p.point,
                                        type: 'ls',
                                        language: l,
                                        level: lvlCode,
                                        form: 'pronunciation'
                                    });
                                }
                                tempPool.push(...(p.alphabet || []).map(a => ({
                                    word: a.l,
                                    ipa: a.ipa,
                                    theme: p.point,
                                    type: 'ls',
                                    language: l,
                                    level: lvlCode,
                                    form: 'pronunciation'
                                })));
                            });
                        }
                    });
                });
            });

            // 2. Source from Reference Phonology Datasets (sounds, stress, intonation)
            const phonData = window.phonologyData?.[l] || {};
            ['sounds', 'stress', 'intonation'].forEach(pCat => {
                const groups = phonData[pCat] || [];
                groups.forEach(group => {
                    const grpLevel = (group.level || 'A1').toLowerCase();
                    const groupMappedLevel = toShortLevelCode(grpLevel);

                    // Helper to clean raw text and extract clean target word and IPA
                    const parsePhonologyExample = (ex) => {
                        let rawTitle = '';
                        let rawIpa = null;
                        if (typeof ex === 'string') {
                            rawTitle = ex;
                        } else if (ex && typeof ex === 'object') {
                            rawTitle = ex.t || ex.word || ex.text || group.label || '';
                            rawIpa = ex.m || ex.ipa || null;
                        }

                        if (!rawTitle) return null;

                        let targetStr = rawTitle;
                        if (targetStr.includes(' ➔ ')) {
                            const parts = targetStr.split(' ➔ ');
                            targetStr = parts[parts.length - 1].trim();
                        } else if (targetStr.includes(' vs ')) {
                            const parts = targetStr.split(' vs ');
                            targetStr = parts[0].trim();
                        }

                        // Extract embedded IPA like /kɪt/ if present
                        let extractedIpa = rawIpa;
                        const ipaMatch = targetStr.match(/\/[^/]+\//);
                        if (ipaMatch && !extractedIpa) {
                            extractedIpa = ipaMatch[0];
                        }

                        // Strip embedded IPA or bracketed annotations from word
                        let cleanWord = targetStr.replace(/\/[^/]+\//g, '').replace(/\([^)]+\)/g, '').trim();
                        if (!cleanWord) cleanWord = rawTitle;

                        return { word: cleanWord, ipa: extractedIpa };
                    };

                    // Extract examples from reference phonology group
                    if (Array.isArray(group.examples)) {
                        group.examples.forEach(ex => {
                            const parsed = parsePhonologyExample(ex);
                            if (parsed && parsed.word) {
                                tempPool.push({
                                    word: parsed.word,
                                    ipa: parsed.ipa,
                                    theme: group.label || group.id,
                                    type: 'ls',
                                    language: l,
                                    level: groupMappedLevel,
                                    form: 'pronunciation'
                                });
                            }
                        });
                    }

                    // Fallback to group label/definition if no examples
                    if ((!group.examples || group.examples.length === 0) && group.label) {
                        tempPool.push({
                            word: group.label,
                            ipa: group.definition || null,
                            theme: group.label,
                            type: 'ls',
                            language: l,
                            level: groupMappedLevel,
                            form: 'pronunciation'
                        });
                    }
                });
            });

            pool = window.gameUtils.filterVocabulary(tempPool, { lang: l, level, theme, subTheme, category: 'Pronunciation' });
        }

        let qs = [];
        const isVocab = (cat === 'Vocabulary' || cat === 'vocab' || cat === 'vocabulary');
        if (pool.length > 0) {
            const samplePool = [...pool].sort(() => Math.random() - 0.5).slice(0, 10);
            qs = samplePool.map(item => {
                if (isVocab) {
                    return buildMCQuestion(item, pool);
                } else if (cat === 'Grammar' || cat === 'grammar') {
                    let types = ['mc', 'tf', 'type', 'sc', 'ls', 'mp', 'cloze', 'dictation'];
                    let type = types[Math.floor(Math.random() * types.length)];
                    if (type === 'dictation') {
                        const examplesArr = (item.examples && item.examples.length > 0) ? item.examples : (item.definitions?.[0]?.examples || []);
                        const hasEx = examplesArr.length > 0 && examplesArr[0]?.text;
                        if (!hasEx) type = 'ls';
                    }

                    const hasExamples = Array.isArray(item.examples)
                        && item.examples.length > 0
                        && item.examples[0]?.text;
                    if (!hasExamples && (type === 'sc' || type === 'cloze')) type = 'mc';

                    if (type === 'type' && !item.word) type = 'mc';

                    let qText = '', ans = null, opts = null;
                    const definition = item.definitions?.[0]?.text || item.definition || item.subtext || item.word || "...";

                    if (type === 'mp') {
                        const otherItems = pool
                            .filter(p => p.id !== item.id && p.word && (p.definitions?.[0]?.text || p.definition || p.subtext))
                            .sort(() => Math.random() - 0.5);

                        const selectedPairs = [item, ...otherItems.slice(0, 3)];
                        const cleanFallbacks = [
                            { word: 'learn', definitions: [{ text: 'To acquire knowledge or skill' }], emoji: '📚', transcription: '[lɜːn]' },
                            { word: 'speak', definitions: [{ text: 'To utter words or express thoughts' }], emoji: '🗣️', transcription: '[spiːk]' },
                            { word: 'read', definitions: [{ text: 'To look at and comprehend written text' }], emoji: '📖', transcription: '[riːd]' }
                        ];
                        let cleanFbIdx = 0;
                        while (selectedPairs.length < 4) {
                            selectedPairs.push(cleanFallbacks[cleanFbIdx % cleanFallbacks.length]);
                            cleanFbIdx++;
                        }

                        let possibleModes = ['definition'];
                        const hasEmojis = selectedPairs.filter(p => p.emoji).length >= 3;
                        if (hasEmojis) possibleModes.push('emoji');

                        const hasTranscriptions = selectedPairs.filter(p => p.transcription).length >= 3;
                        if (hasTranscriptions) possibleModes.push('transcription');

                        const hasAntonyms = selectedPairs.filter(p => p.opposite || (p.antonyms && p.antonyms.length > 0)).length >= 2;
                        if (hasAntonyms) possibleModes.push('antonym');

                        const selectedMode = possibleModes[Math.floor(Math.random() * possibleModes.length)];

                        const pairs = selectedPairs.map((p, idx) => {
                            let matchValue = '';
                            if (selectedMode === 'emoji') {
                                matchValue = p.emoji || '💡';
                            } else if (selectedMode === 'transcription') {
                                matchValue = p.transcription || `[${p.word}]`;
                            } else if (selectedMode === 'antonym') {
                                matchValue = p.opposite || p.antonyms?.[0] || `≠ ${p.word}`;
                            } else {
                                matchValue = p.definitions?.[0]?.text || p.definition || p.subtext || p.word;
                            }

                            return {
                                id: idx,
                                word: p.word,
                                definition: matchValue
                            };
                        });

                        if (selectedMode === 'emoji') {
                            qText = "🧩 Match the words with their images";
                        } else if (selectedMode === 'transcription') {
                            qText = "🧩 Match the words with their pronunciation symbols";
                        } else if (selectedMode === 'antonym') {
                            qText = "🧩 Match the words with their opposites (antonyms)";
                        } else {
                            qText = "🧩 Match the words with their definitions";
                        }

                        ans = pairs;
                    } else if (type === 'mc') {
                        const mcQ = buildMCQuestion(item, pool);
                        qText = mcQ.q;
                        ans = mcQ.ans;
                        opts = mcQ.opts;
                    } else if (type === 'ls') {
                        const otherWords = pool
                            .filter(p => p.id !== item.id && p.word)
                            .sort(() => Math.random() - 0.5)
                            .map(p => p.word);
                        let distractors = [...new Set(otherWords)].filter(w => w && w.toLowerCase() !== (item.word || '').toLowerCase()).slice(0, 2);
                        const wordFallbacks = ['listen', 'speak', 'understand'];
                        let wIdx = 0;
                        while (distractors.length < 2) {
                            const fbWord = wordFallbacks[wIdx % wordFallbacks.length];
                            if (!distractors.includes(fbWord) && fbWord.toLowerCase() !== (item.word || '').toLowerCase()) {
                                distractors.push(fbWord);
                            }
                            wIdx++;
                        }
                        qText = '🔊 ?';
                        opts = [item.word, ...distractors].sort(() => Math.random() - 0.5);
                        ans = opts.indexOf(item.word);
                    } else if (type === 'tf') {
                        const isTrue = Math.random() > 0.5;
                        let displayDef = definition;
                        if (!isTrue) {
                            const otherItems = pool.filter(p => p.id !== item.id && (p.definitions?.[0]?.text || p.definition));
                            if (otherItems.length > 0) {
                                const randomOther = otherItems[Math.floor(Math.random() * otherItems.length)];
                                displayDef = randomOther.definitions?.[0]?.text || randomOther.definition;
                            } else {
                                displayDef = "opposite or unrelated concept";
                            }
                        }
                        qText = `"${item.word}" = "${displayDef}"`;
                        ans = isTrue;
                    } else if (type === 'sc') {
                        const examplesArr = (item.examples && item.examples.length > 0) ? item.examples : (item.definitions?.[0]?.examples || []);
                        const ex = examplesArr[Math.floor(Math.random() * examplesArr.length)];
                        if (!ex?.text) {
                            type = 'type';
                        } else {
                            qText = `🧩 (${item.word})`;
                            ans = ex.text;
                        }
                    } else if (type === 'cloze') {
                        const examplesArr = (item.examples && item.examples.length > 0) ? item.examples : (item.definitions?.[0]?.examples || []);
                        const ex = examplesArr[Math.floor(Math.random() * examplesArr.length)];
                        if (!ex?.text || !item.word) {
                            type = 'mc';
                            const mcQ = buildMCQuestion(item, pool);
                            qText = mcQ.q;
                            ans = mcQ.ans;
                            opts = mcQ.opts;
                        } else {
                            const regex = new RegExp(item.word, 'gi');
                            const sentenceWithBlank = ex.text.replace(regex, '[ ___ ]');
                            qText = `Fill in the blank: ${sentenceWithBlank}`;

                            const distractors = pool
                                .filter(p => p.id !== item.id && p.word)
                                .sort(() => Math.random() - 0.5)
                                .map(p => p.word)
                                .filter(w => w && w.toLowerCase() !== (item.word || '').toLowerCase())
                                .slice(0, 2);
                            const clozeFallbacks = ['also', 'then', 'so', 'well'];
                            let cIdx = 0;
                            while (distractors.length < 2) {
                                const fbWord = clozeFallbacks[cIdx % clozeFallbacks.length];
                                if (!distractors.includes(fbWord) && fbWord.toLowerCase() !== (item.word || '').toLowerCase()) {
                                    distractors.push(fbWord);
                                }
                                cIdx++;
                            }

                            opts = [item.word, ...distractors].sort(() => Math.random() - 0.5);
                            ans = opts.indexOf(item.word);
                        }
                    }

                    if (type === 'type') {
                        qText = `"${definition}" = ?`;
                        ans = item.word;
                    }

                    if (!qText) {
                        qText = `Practice: ${item.word}`;
                    }

                    let morphologicalHint = null;
                    if (window.COSY && window.COSY.getVerbParadigm) {
                        const verbParadigm = window.COSY.getVerbParadigm(l, item.word);
                        if (verbParadigm) {
                            if (verbParadigm.usage_hint) {
                                morphologicalHint = `Usage: ${verbParadigm.usage_hint}`;
                            } else if (verbParadigm.group) {
                                morphologicalHint = `Group: ${verbParadigm.group}`;
                            }
                        }
                    }
                    if (!morphologicalHint && window.COSY && window.COSY.getNounDeclension) {
                        const nounDecl = window.COSY.getNounDeclension(l, item.word);
                        if (nounDecl && nounDecl.gender) {
                            morphologicalHint = `Gender: ${nounDecl.gender}`;
                        }
                    }

                    return {
                        form: type,
                        q: qText,
                        item: item,
                        ans: ans,
                        opts,
                        level: LEVEL_MAP[item.level] || item.level || 'a1',
                        theme: item.theme,
                        sub_theme: item.sub_theme || null,
                        practice_links: item.practice_links,
                        ruleHint: item.usage_hint || item.collocation || (item.preposition ? `Collocation / Preposition: ${item.word} ${item.preposition}` : morphologicalHint)
                    };
                } else if (cat === 'Speaking' || cat === 'speaking') {
                    return { form: 'conv', q: item.topic || item.text || item.q, level: LEVEL_MAP[item.level] || item.level || 'a1', theme: item.theme };
                } else if (cat === 'Pronunciation' || cat === 'pronunciation' || cat === 'Pronunciation 🔊') {
                    const correctVal = item.ipa || item.word;

                    let poolDistractors = pool
                        .filter(p => p !== item && (p.ipa || p.word))
                        .map(p => p.ipa || p.word);

                    let cleanDistractors = [...new Set(poolDistractors)].filter(d => d && d.toLowerCase() !== correctVal.toLowerCase()).sort(() => Math.random() - 0.5);

                    const fallbackIpa = ['/aɪ/', '/iː/', '/uː/', '/eɪ/', '/əʊ/', '/ɒ/', '/æ/', '/θ/', '/ð/', '/ʃ/'];
                    for (const fb of fallbackIpa) {
                        if (cleanDistractors.length >= 2) break;
                        if (fb.toLowerCase() !== correctVal.toLowerCase() && !cleanDistractors.includes(fb)) {
                            cleanDistractors.push(fb);
                        }
                    }

                    const distractors = cleanDistractors.slice(0, 2);
                    const opts = [correctVal, ...distractors].sort(() => Math.random() - 0.5);
                    const ans = opts.indexOf(correctVal);

                    return {
                        form: 'ls',
                        q: `🔊 Pronounce: ${item.word}`,
                        item: item,
                        ans: ans,
                        opts: opts,
                        level: toShortLevelCode(item.level),
                        theme: item.theme
                    };
                }
                return item;
            });
        } else {
            qs = getQuestions(lang.toUpperCase(), cat, level, theme, subTheme);
        }

        if (!qs.length) {
            console.warn('[COSY filter] empty result', { lang, level, theme, subTheme, category: cat });
            const errorMsg = document.getElementById('setup-error-msg');
            if (errorMsg) {
                errorMsg.style.display = 'flex';
                errorMsg.removeAttribute('hidden');
                errorMsg.classList.remove('error-banner-hidden');
                errorMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                const msg = "No exercises found for this combination. Try All Levels or a different theme.";
                if (window.COSY && window.COSY.showToast) {
                    window.COSY.showToast(msg, true);
                } else {
                    alert(msg);
                }
            }
            return;
        }

        const errorMsg = document.getElementById('setup-error-msg');
        if (errorMsg) {
            errorMsg.style.display = 'none';
            errorMsg.setAttribute('hidden', '');
            errorMsg.classList.add('error-banner-hidden');
        }

        qs = [...qs].sort(() => Math.random() - .5).slice(0, 10);

        window.cosyPracticeEngine.startSession(lang, cat, level, theme, isChallenge, qs);
    }

    // Export functions to global scope
    window.ensureDataLoaded = ensureDataLoaded;
    window.beginSession = beginSession;
    window.getQuestions = getQuestions;
})();
