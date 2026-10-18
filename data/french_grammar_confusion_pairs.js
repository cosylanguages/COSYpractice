/**
 * practice/data/french_grammar_confusion_pairs.js
 * Comprehensive CEFR French Grammar Confusion Pairs Dataset (A1–C2).
 * Formatted for interactive practice engines: Fill-in-gaps, Word order,
 * Multiple choice, True/False, Match pairs, Type, Dictation, Speak.
 */

(function() {
    'use strict';

    const FRENCH_GRAMMAR_CONFUSION_PAIRS = {
        a1: [
            // Articles
            { id: "un-vs-le", label: "un vs le", group: "Articles", level: "a1",
              q: "J'ai acheté ___ livre à la librairie. ___ livre est très intéressant.", opts: ["un / Le", "le / Un", "du / Le", "un / Un"], ans: 0,
              type: "mc", ruleHint: "Utilisez 'un' pour introduire un objet indéfini, et 'le' pour un objet précis/déjà mentionné." },
            { id: "de-vs-des", label: "de vs des", group: "Articles", level: "a1",
              q: "Elle mange ___ pommes fraîches tous les matins.", opts: ["des", "de", "du", "la"], ans: 0,
              type: "mc", ruleHint: "Utilisez 'des' pour plusieurs objets comptables indéfinis." },
            { id: "ce-vs-cet", label: "ce vs cet", group: "Démonstratifs", level: "a1",
              q: "___ arbre est magnifique en automne.", opts: ["Cet", "Ce", "Cette", "Ces"], ans: 0,
              type: "mc", ruleHint: "Utilisez 'cet' devant un nom masculin commençant par une voyelle ou un 'h' muet." },
            { id: "ce-vs-cette", label: "ce vs cette", group: "Démonstratifs", level: "a1",
              q: "___ maison est très ancienne et charmante.", opts: ["Cette", "Ce", "Cet", "Ces"], ans: 0,
              type: "mc", ruleHint: "Utilisez 'cette' devant un nom féminin singulier." },

            // Verbes de base
            { id: "etre-vs-avoir", label: "être vs avoir", group: "Verbes de base", level: "a1",
              q: "J'___ 25 ans et je ___ étudiant.", opts: ["ai / suis", "suis / ai", "ai / ai", "suis / suis"], ans: 0,
              type: "mc", ruleHint: "Exprimez l'âge avec 'avoir' (j'ai 25 ans) et la profession avec 'être' (je suis étudiant)." },
            { id: "il-est-vs-cest", label: "il est vs c'est", group: "Présentation", level: "a1",
              q: "___ médecin. ___ un excellent médecin.", opts: ["Il est / C'est", "C'est / Il est", "Il est / Il est", "C'est / C'est"], ans: 0,
              type: "mc", ruleHint: "Utilisez 'il est + profession sans article', mais 'c'est + un/une + nom'." },
            { id: "savoir-vs-connaître", label: "savoir vs connaître", group: "Verbes de base", level: "a1",
              q: "Je ___ nager, mais je ne ___ pas ce professeur.", opts: ["sais / connais", "connais / sais", "sais / sais", "connais / connais"], ans: 0,
              type: "mc", ruleHint: "'Savoir' s'utilise avec un verbe à l'infinitif (compétence), 'connaître' avec un nom (personne/lieu)." },
            { id: "aller-vs-venir", label: "aller vs venir", group: "Verbes de mouvement", level: "a1",
              q: "Je ___ au cinéma ce soir. Tu veux ___ avec moi ?", opts: ["vais / venir", "viens / aller", "vais / aller", "viens / venir"], ans: 0,
              type: "mc", ruleHint: "'Aller' indique un déplacement vers un lieu, 'venir' vers le locuteur." },
            { id: "faire-vs-jouer", label: "faire vs jouer", group: "Activités", level: "a1",
              q: "Le week-end, il ___ du piano et ___ au football.", opts: ["joue / joue", "fait / fait", "joue / fait", "fait / joue"], ans: 0,
              type: "mc", ruleHint: "On utilise 'jouer de' pour les instruments et 'jouer à' pour les sports d'équipe/jeux." },

            // Pronoms
            { id: "tu-vs-vous", label: "tu vs vous", group: "Pronoms", level: "a1",
              q: "Bonjour Monsieur, comment allez-___ ?", opts: ["vous", "tu", "toi", "il"], ans: 0,
              type: "mc", ruleHint: "Utilisez 'vous' pour le vouvoiement de politesse ou le pluriel." }
        ],

        a2: [
            // Articles & Quantités
            { id: "du-vs-de", label: "du vs de", group: "Articles partitifs", level: "a2",
              q: "Je bois ___ café, mais je ne bois pas ___ thé.", opts: ["du / de", "de / du", "du / du", "de / de"], ans: 0,
              type: "mc", ruleHint: "L'article partitif 'du' devient 'de' après une négation (ne...pas de)." },
            { id: "beaucoup-de", label: "beaucoup de", group: "Quantités", level: "a2",
              q: "Il y a beaucoup ___ travail ce matin.", opts: ["de", "du", "des", "d'un"], ans: 0,
              type: "mc", ruleHint: "Après un adverbe de quantité (beaucoup, peu, trop), utilisez simplement 'de' ou 'd''." },

            // Pronoms
            { id: "y-vs-en", label: "y vs en", group: "Pronoms adverbiaux", level: "a2",
              q: "Tu vas à Paris ? Oui, j'___ vais. Tu veux des pommes ? Oui, j'___ veux trois.", opts: ["y / en", "en / y", "y / y", "en / en"], ans: 0,
              type: "mc", ruleHint: "'Y' remplace un lieu ou une préposition 'à', tandis que 'en' remplace une quantité ou 'de'." },
            { id: "lui-vs-leur", label: "lui vs leur", group: "Pronoms COI", level: "a2",
              q: "Je parle à Marie -> Je ___ parle. Je téléphone à mes parents -> Je ___ téléphone.", opts: ["lui / leur", "leur / lui", "la / les", "lui / les"], ans: 0,
              type: "mc", ruleHint: "'Lui' est le pronom COI singulier (à lui/elle), 'leur' est le pronom COI pluriel (à eux/elles)." },

            // Temps du passé
            { id: "passe-compose-vs-imparfait", label: "passé composé vs imparfait", group: "Temps du passé", level: "a2",
              q: "Hier, pendant que je ___ (dormir), le téléphone ___ (sonner).", opts: ["dormais / a sonné", "suis dormi / sonnait", "dormais / sonnait", "ai dormi / a sonné"], ans: 0,
              type: "mc", ruleHint: "L'imparfait décrit une action continue en arrière-plan, interrompue par un événement ponctuel au passé composé." },

            // Adverbes & Adjectifs
            { id: "bon-vs-bien", label: "bon vs bien", group: "Adjectifs & Adverbes", level: "a2",
              q: "Ce gâteau est très ___ ! Elle chante vraiment ___ .", opts: ["bon / bien", "bien / bon", "bon / bon", "bien / bien"], ans: 0,
              type: "mc", ruleHint: "'Bon' est un adjectif qui qualifie un nom; 'bien' est un adverbe qui modifie un verbe." },
            { id: "meilleur-vs-mieux", label: "meilleur vs mieux", group: "Comparatifs", level: "a2",
              q: "Mon nouveau téléphone est ___ que l'ancien. Je me sens ___ aujourd'hui.", opts: ["meilleur / mieux", "mieux / meilleur", "meilleur / meilleur", "mieux / mieux"], ans: 0,
              type: "mc", ruleHint: "'Meilleur' est le comparatif de l'adjectif 'bon', 'mieux' est le comparatif de l'adverbe 'bien'." },

            // Prépositions
            { id: "a-vs-en-pays", label: "à vs en (pays)", group: "Prépositions de lieu", level: "a2",
              q: "Elle habite ___ France et il habite ___ Japon.", opts: ["en / au", "à / au", "en / en", "au / en"], ans: 0,
              type: "mc", ruleHint: "Utilisez 'en' devant les pays féminins (France) et 'au' devant les pays masculins (Japon)." },
            { id: "a-vs-chez", label: "à vs chez", group: "Prépositions de lieu", level: "a2",
              q: "Je vais ___ boulangerie, puis je passe ___ le médecin.", opts: ["à la / chez", "chez / à la", "à la / à", "chez / chez"], ans: 0,
              type: "mc", ruleHint: "Utilisez 'à / à la' pour un lieu physique, et 'chez' pour une personne ou un professionnel." }
        ],

        b1: [
            // Pronoms relatifs
            { id: "qui-vs-que", label: "qui vs que", group: "Pronoms relatifs", level: "b1",
              q: "Le livre ___ est sur la table est intéressant. Le livre ___ j'ai lu est intéressant.", opts: ["qui / que", "que / qui", "qui / dont", "dont / que"], ans: 0,
              type: "mc", ruleHint: "'Qui' est sujet du verbe suivant, 'que' (qu') est complément d'objet direct." },
            { id: "dont-vs-que", label: "dont vs que", group: "Pronoms relatifs", level: "b1",
              q: "C'est le film ___ je te parlais hier.", opts: ["dont", "que", "qui", "où"], ans: 0,
              type: "mc", ruleHint: "Utilisez 'dont' pour remplacer un complément introduit par la préposition 'de' (parler de quelque chose)." },

            // Expressions temporelles
            { id: "depuis-vs-pendant", label: "depuis vs pendant", group: "Temps", level: "b1",
              q: "J'habite à Lyon ___ trois ans (et j'y suis encore). J'ai étudié ___ trois ans.", opts: ["depuis / pendant", "pendant / depuis", "depuis / depuis", "pendant / pendant"], ans: 0,
              type: "mc", ruleHint: "'Depuis' exprime une action commencée dans le passé qui continue. 'Pendant' exprime une durée délimitée et terminée." },
            { id: "il-y-a-vs-depuis", label: "il y a vs depuis", group: "Temps", level: "b1",
              q: "Il est arrivé ___ deux heures. Il attend ___ deux heures.", opts: ["il y a / depuis", "depuis / il y a", "pendant / depuis", "il y a / pendant"], ans: 0,
              type: "mc", ruleHint: "'Il y a' indique un moment ponctuel dans le passé (time ago). 'Depuis' indique une durée continue." },

            // Nuances verbales
            { id: "penser-a-vs-penser-de", label: "penser à vs penser de", group: "Verbes à préposition", level: "b1",
              q: "À quoi penses-tu ? (réflexion). Que penses-tu ___ ce film ? (opinion)", opts: ["de", "à", "pour", "sur"], ans: 0,
              type: "mc", ruleHint: "'Penser à' signifie avoir à l'esprit; 'penser de' s'utilise pour solliciter une opinion." },
            { id: "apporter-vs-emporter", label: "apporter vs emporter", group: "Verbes de mouvement", level: "b1",
              q: "Peux-tu ___ ce gâteau à la fête ? N'oublie pas d'___ ton parapluie en partant.", opts: ["apporter / emporter", "emporter / apporter", "amener / emmener", "emporter / emmener"], ans: 0,
              type: "mc", ruleHint: "'Apporter' s'utilise pour un objet qu'on transporte vers un lieu; 'emporter' pour un objet qu'on prend avec soi en partant." },
            { id: "grâce-a-vs-a-cause-de", label: "grâce à vs à cause de", group: "Cause", level: "b1",
              q: "J'ai réussi ___ ton aide. Le train a du retard ___ la neige.", opts: ["grâce à / à cause de", "à cause de / grâce à", "grâce à / grâce à", "à cause de / à cause de"], ans: 0,
              type: "mc", ruleHint: "'Grâce à' s'utilise pour une cause positive ou bénéfique; 'à cause de' pour une cause négative ou neutre." }
        ],

        b2: [
            // Subjonctif
            { id: "subjonctif-vs-indicatif", label: "subjonctif vs indicatif", group: "Modes", level: "b2",
              q: "Je pense qu'il ___ (venir). Je ne pense pas qu'il ___ (venir).", opts: ["vient / vienne", "vienne / vient", "vienne / vienne", "vient / vient"], ans: 0,
              type: "mc", ruleHint: "L'opinion affirmative nécessite l'indicatif (certitude), l'opinion négative ou douteuse nécessite le subjonctif." },
            { id: "bien-que-vs-meme-si", label: "bien que vs même si", group: "Concession", level: "b2",
              q: "___ il fasse froid, nous sortons. ___ il fait froid, nous sortons.", opts: ["Bien qu' / Même si", "Même si / Bien qu'", "Quoique / Bien qu'", "Même si / Quoique"], ans: 0,
              type: "mc", ruleHint: "'Bien que' est suivi du subjonctif, alors que 'même si' est suivi de l'indicatif." },
            { id: "tandis-que-vs-alors-que", label: "tandis que vs alors que", group: "Connecteurs", level: "b2",
              q: "Il étudie la médecine, ___ sa sœur préfère l'art.", opts: ["tandis que", "parce que", "puisque", "afin que"], ans: 0,
              type: "mc", ruleHint: "'Tandis que' marque une opposition simultanée ou un contraste entre deux faits." },

            // Accord du participe passé
            { id: "accord-participe-passe-avoir", label: "accord participe passé", group: "Accords", level: "b2",
              q: "Les lettres que j'ai ___ (écrire) sont sur le bureau.", opts: ["écrites", "écrit", "écrite", "écrits"], ans: 0,
              type: "mc", ruleHint: "Le participe passé employé avec 'avoir' s'accorde avec le complément d'objet direct (COD) s'il est placé avant le verbe." }
        ],

        c1: [
            // Subjonctif & Nuances
            { id: "avant-que-vs-apres-que", label: "avant que vs après que", group: "Conjonctions", level: "c1",
              q: "Partons avant qu'il ne ___ (être) trop tard. Nous sommes partis après qu'il ___ (avoir) fini.", opts: ["soit / a", "est / ait", "soit / ait", "est / a"], ans: 0,
              type: "mc", ruleHint: "'Avant que' demande le subjonctif, tandis que 'après que' demande traditionnellement l'indicatif." },
            { id: "faute-de-vs-au-lieu-de", label: "faute de vs au lieu de", group: "Prépositions avancées", level: "c1",
              q: "___ moyens financiers, le projet a été abandonné.", opts: ["Faute de", "Au lieu de", "Grâce à", "Afin de"], ans: 0,
              type: "mc", ruleHint: "'Faute de' signifie 'par manque de' et est suivi d'un nom ou infinitif sans article." }
        ],

        c2: [
            // Stylistique & Nuances littéraires
            { id: "ce-qui-vs-ce-que", label: "ce qui vs ce que", group: "Pronoms complexes", level: "c2",
              q: "___ m'étonne, c'est son calme. ___ je ne comprends pas, c'est sa réaction.", opts: ["Ce qui / Ce que", "Ce que / Ce qui", "Ce dont / Ce qui", "Ce qui / Ce dont"], ans: 0,
              type: "mc", ruleHint: "'Ce qui' est le sujet de la proposition subordonnée, 'ce que' en est le complément d'objet direct." },
            { id: "ne-expletif", label: "ne explétif", group: "Négation littéraire", level: "c2",
              q: "Je crains qu'il ne ___ trop tard pour intervenir.", opts: ["soit", "est", "serait", "sera"], ans: 0,
              type: "mc", ruleHint: "Le 'ne' explétif s'emploie dans un style soutenu après les verbes de crainte, sans valeur négative." }
        ]
    };

    if (typeof window !== 'undefined') {
        window.COSY_FRENCH_GRAMMAR_CONFUSION_PAIRS = FRENCH_GRAMMAR_CONFUSION_PAIRS;
    }
    if (typeof module !== 'undefined') {
        module.exports = FRENCH_GRAMMAR_CONFUSION_PAIRS;
    }
})();
