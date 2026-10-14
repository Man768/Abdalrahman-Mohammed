export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export type TopicCategory =
  | 'Vie quotidienne & Expériences'
  | 'Famille & Relations humaines'
  | 'Éducation & Vie étudiante'
  | 'Travail & Vie professionnelle'
  | 'Voyages & Culture'
  | 'Sciences & Technologies'
  | 'Environnement & Société'
  | 'Livres, Cinéma & Actualités'
  | 'Opinions, Arguments & Débats';

export interface UsefulExpression {
  phrase: string;
  context: string;
  arabicMeaning?: string; // Sens en arabe facultatif pour clarté bilingue
  example: string;
}

export interface Topic {
  id: string;
  level: CEFRLevel;
  subLevel?: string;
  title: string;
  description: string;
  category: TopicCategory;
  speakingObjective: string; // Objectif oral court
  targetGrammar: string;
  initialQuestion: string;
  followUpQuestions: string[];
  keyExpressions: UsefulExpression[];
  suggestedVocab: string[];
  tipsForLevel: string;
}

export const TOPICS: Topic[] = [
  // ==========================================
  // NIVEAU B1 (Zone principale - B1.1 & B1.2)
  // ==========================================
  {
    id: 'b1-souvenir-voyage',
    level: 'B1',
    subLevel: 'B1.2',
    title: 'Raconter un voyage mémorable ou un imprévu',
    description: 'Partagez une anecdote de voyage, un contretemps amusant ou une découverte culturelle inattendue.',
    category: 'Voyages & Culture',
    speakingObjective: 'Articuler un récit au passé en alternant description du cadre et actions soudaines.',
    targetGrammar: 'Alternance Passé composé (actions ponctuelles) et Imparfait (contexte/description)',
    initialQuestion: 'Bonjour ! Racontez-moi un voyage ou un week-end qui vous a particulièrement marqué. Où étiez-vous et quelle était l\'atmosphère ?',
    followUpQuestions: [
      'Y a-t-il eu un moment inattendu, une surprise ou un petit imprévu pendant ce séjour ? Comment avez-vous réagi ?',
      'Qu\'est-ce qui vous a le plus frappé concernant les coutumes locales ou les personnes que vous avez rencontrées ?',
      'Si vous pouviez revivre ce voyage aujourd\'hui, changeriez-vous quelque chose à votre itinéraire ou à vos choix ?',
      'Pour vous, qu\'est-ce qui fait la réussite d\'un voyage : la planification rigoureuse ou l\'aventure spontanée ?'
    ],
    keyExpressions: [
      { phrase: 'Ça m\'a frappé', context: 'Pour exprimer l\'étonnement', arabicMeaning: 'لفت انتباهي أو أدهشني', example: 'Ce qui m\'a frappé, c\'est la gentillesse des gens.' },
      { phrase: 'Contre toute attente', context: 'Pour introduire un dénouement inattendu', arabicMeaning: 'على عكس كل التوقعات', example: 'Contre toute attente, le train est arrivé à l\'heure.' },
      { phrase: 'Ça en valait la peine', context: 'Pour souligner un effort payant', arabicMeaning: 'الأمر استحق العناء', example: 'La randonnée était difficile mais la vue en valait la peine.' },
      { phrase: 'Au bout du compte', context: 'Pour résumer une expérience', arabicMeaning: 'في نهاية المطاف', example: 'Au bout du compte, ce contretemps est devenu notre meilleur souvenir.' }
    ],
    suggestedVocab: ['dépaysant', 'un contretemps', 'pittoresque', 'une péripétie', 'hors des sentiers battus'],
    tipsForLevel: 'Plantez le décor à l\'imparfait (Il faisait beau, j\'avais envie de...) puis racontez les faits au passé composé (soudain, j\'ai décidé de...).'
  },
  {
    id: 'b1-travail-equilibre',
    level: 'B1',
    subLevel: 'B1.2',
    title: 'Équilibre entre vie professionnelle et vie personnelle',
    description: 'Exprimez votre vision du rythme de travail moderne, du télétravail et de la déconnexion.',
    category: 'Travail & Vie professionnelle',
    speakingObjective: 'Formuler des souhaits et des conseils nuancés sur le bien-être au travail.',
    targetGrammar: 'Conditionnel présent (souhaits, conseils) & connecteurs d\'opposition (alors que, pourtant)',
    initialQuestion: 'Comment parvenez-vous à concilier vos obligations professionnelles et vos loisirs au quotidien ?',
    followUpQuestions: [
      'Pensez-vous que le télétravail améliore la qualité de vie ou qu\'il efface la frontière entre maison et travail ?',
      'Si vous pouviez réorganiser entièrement votre semaine idéale de travail, que changeriez-vous ?',
      'Avez-vous du mal à vous déconnecter des écrans et des notifications le soir ou le week-end ? Pourquoi ?',
      'Quelle mesure une entreprise devrait-elle adopter en priorité pour le bien-être de ses salariés ?'
    ],
    keyExpressions: [
      { phrase: 'Prendre du recul', context: 'S\'éloigner du stress pour réfléchir posément', arabicMeaning: 'التروي وأخذ مسافة للتفكير', example: 'Le week-end me permet de prendre du recul.' },
      { phrase: 'Il vaudrait mieux', context: 'Conseil nuancé au conditionnel', arabicMeaning: 'من الأفضل أو يستحسن', example: 'Il vaudrait mieux fixer des limites claires.' },
      { phrase: 'Trouver un juste milieu', context: 'Chercher l\'équilibre', arabicMeaning: 'إيجاد توازن أو حل وسط', example: 'L\'essentiel est de trouver un juste milieu entre carrière et famille.' },
      { phrase: 'Avoir du mal à', context: 'Évoquer une difficulté', arabicMeaning: 'يجد صعوبة في', example: 'J\'ai souvent du mal à couper mes notifications.' }
    ],
    suggestedVocab: ['la déconnexion', 'la charge mentale', 'un aménagement', 's\'épanouir', 'prioriser'],
    tipsForLevel: 'Utilisez le conditionnel pour formuler des souhaits : "J\'aimerais pouvoir...", "Ce serait idéal si...".'
  },
  {
    id: 'b1-consommation-ecologique',
    level: 'B1',
    subLevel: 'B1.2',
    title: 'Changer ses habitudes de consommation et écologie',
    description: 'Parlez de vos gestes écologiques réels, de la seconde main et des dilemmes d\'achat.',
    category: 'Environnement & Société',
    speakingObjective: 'Exprimer des choix personnels et des dilemmes éthiques avec des pronoms relatifs.',
    targetGrammar: 'Pronoms relatifs simples et composés (ce qui, ce que, dont) et verbes d\'opinion',
    initialQuestion: 'Quels changements concrets avez-vous adoptés ces dernières années pour consommer de façon plus responsable ?',
    followUpQuestions: [
      'Quelle est l\'habitude écologique qui vous paraît la plus difficile à tenir sur la durée ?',
      'Acheter des objets d\'occasion ou réparer au lieu de jeter : est-ce une pratique courante pour vous ?',
      'Selon vous, la responsabilité principale repose-t-elle sur les citoyens ou sur les gouvernements et grandes industries ?',
      'Quel conseil donneriez-vous à un ami qui veut réduire ses déchets sans se compliquer la vie ?'
    ],
    keyExpressions: [
      { phrase: 'Faire d\'une pierre deux coups', context: 'Obtenir deux résultats positifs en une action', arabicMeaning: 'ضرب عصفورين بحجر واحد', example: 'Acheter d\'occasion permet de faire d\'une pierre deux coups : économies et écologie.' },
      { phrase: 'Ce dont j\'ai conscience', context: 'Pronom "dont" avec avoir conscience', arabicMeaning: 'ما أدركه أو أعيه تماماً', example: 'Ce dont j\'ai conscience, c\'est que chaque geste compte.' },
      { phrase: 'À petite échelle', context: 'Au niveau individuel', arabicMeaning: 'على نطاق فردي أو صغير', example: 'Même à petite échelle, on peut changer les choses.' },
      { phrase: 'Mettre la main à la pâte', context: 'Participer activement à une tâche', arabicMeaning: 'المشاركة الفعالة والمساعدة', example: 'Tout le monde doit mettre la main à la pâte.' }
    ],
    suggestedVocab: ['le suremballage', 'le gaspillage', 'la seconde main', 'l\'empreinte carbone', 'la sobriété'],
    tipsForLevel: 'Pratiquez l\'usage du pronom "dont" : "ce dont je parle", "les gestes dont nous sommes fiers".'
  },
  {
    id: 'b1-amitie-relations',
    level: 'B1',
    subLevel: 'B1.1',
    title: 'La véritable amitié et l\'évolution des relations',
    description: 'Discutez de ce qui caractérise un véritable ami et de la façon dont les liens évoluent avec le temps.',
    category: 'Famille & Relations humaines',
    speakingObjective: 'Exprimer des sentiments et des exigences interpersonnelles au subjonctif.',
    targetGrammar: 'Subjonctif présent après les sentiments et obligations (il faut que, j\'aimerais que)',
    initialQuestion: 'Selon vous, quelles sont les qualités indispensables que doit posséder un véritable ami ?',
    followUpQuestions: [
      'Est-il plus difficile de nouer de véritables amitiés à l\'âge adulte que durant l\'enfance ou les études ? Pourquoi ?',
      'Que faites-vous quand vous n\'êtes pas d\'accord avec un ami proche sur un sujet sensible ?',
      'Pensez-vous que les réseaux sociaux renforcent ou affaiblissent les liens amicaux réels ?',
      'Quel est le souvenir le plus fort que vous ayez partagé avec un ami ?'
    ],
    keyExpressions: [
      { phrase: 'Pouvoir compter sur', context: 'Faire confiance', arabicMeaning: 'الاعتماد على شخص والوثوق به', example: 'C\'est quelqu\'un sur qui je peux toujours compter.' },
      { phrase: 'Être sur la même longueur d\'onde', context: 'Se comprendre spontanément', arabicMeaning: 'على نفس الموجة أو متوافقان في التفكير', example: 'Dès notre première rencontre, nous étions sur la même longueur d\'onde.' },
      { phrase: 'Garder contact', context: 'Maintenir la relation', arabicMeaning: 'البقاء على اتصال', example: 'Même à distance, nous faisons l\'effort de garder contact.' },
      { phrase: 'Pour que l\'amitié dure', context: 'Subjonctif de but', arabicMeaning: 'لكي تدوم الصداقة', example: 'Pour que l\'amitié dure, il faut qu\'on soit sincère.' }
    ],
    suggestedVocab: ['la loyauté', 'la complicité', 'la bienveillance', 's\'éloigner', 'se confier'],
    tipsForLevel: 'Pensez au subjonctif après "il faut que...", "il est essentiel qu\'un ami soit présent".'
  },
  {
    id: 'b1-education-apprentissage',
    level: 'B1',
    subLevel: 'B1.2',
    title: 'Apprendre une langue adulte et méthodes d\'étude',
    description: 'Partagez vos techniques d\'apprentissage, vos motivations et les blocages que vous surmontez.',
    category: 'Éducation & Vie étudiante',
    speakingObjective: 'Expliquer une méthode d\'apprentissage et comparer des techniques avec le comparatif.',
    targetGrammar: 'Comparatifs (plus efficace que, autant de) et expression de la cause (puisque, étant donné que)',
    initialQuestion: 'Quelle méthode trouvez-vous la plus efficace pour mémoriser de nouveaux mots et oser parler en français ?',
    followUpQuestions: [
      'Avez-vous déjà ressenti la peur de faire des fautes à l\'oral ? Comment la surmontez-vous ?',
      'Préférez-vous apprendre de manière structurée avec des cours ou en immersion spontanée ?',
      'Si vous pouviez donner un conseil à quelqu\'un qui débute l\'apprentissage d\'une langue étrangère, lequel serait-ce ?',
      'Dans quelle mesure la régularité quotidienne l\'emporte-t-elle sur les sessions intensives espacées ?'
    ],
    keyExpressions: [
      { phrase: 'Se jeter à l\'eau', context: 'Oser se lancer malgré la timidité', arabicMeaning: 'الجرأة على البدء وكسر حاجز الخوف', example: 'Pour parler français, il faut oser se jeter à l\'eau.' },
      { phrase: 'Au fur et à mesure', context: 'Progression graduelle', arabicMeaning: 'تدريجياً أو شيئاً فشيئاً', example: 'La confiance vient au fur et à mesure des conversations.' },
      { phrase: 'Avoir un déclic', context: 'Comprendre subitement ou se débloquer', arabicMeaning: 'حدوث ومضة أو انطلاقة ذهنية', example: 'J\'ai eu un déclic quand j\'ai arrêté d\'avoir peur des erreurs.' },
      { phrase: 'Faire des progrès notables', context: 'S\'améliorer visiblement', arabicMeaning: 'إحراز تقدم ملحوظ', example: 'Avec 15 minutes par jour, on fait des progrès notables.' }
    ],
    suggestedVocab: ['l\'assiduité', 'l\'immersion', 'la prononciation', 'se débloquer', 'la persévérance'],
    tipsForLevel: 'Utilisez "puisque" pour introduire une cause connue : "Puisque je veux progresser, je parle tous les jours".'
  },
  {
    id: 'b1-technologie-quotidien',
    level: 'B1',
    subLevel: 'B1.2',
    title: 'Les smartphones et notre rapport au temps',
    description: 'Analysez l\'impact des notifications constantes et de la connectivité sur votre attention.',
    category: 'Sciences & Technologies',
    speakingObjective: 'Décrire des habitudes quotidiennes et argumenter sur les limites de la technologie.',
    targetGrammar: 'Gérondif (en faisant, en regardant) pour exprimer la simultanéité ou le moyen',
    initialQuestion: 'Combien d\'heures estimez-vous passer sur votre téléphone par jour, et comment jugez-vous cette habitude ?',
    followUpQuestions: [
      'Quelles applications vous font perdre le plus de temps sans vous apporter de réelle satisfaction ?',
      'Avez-vous déjà tenté une journée de déconnexion totale ? Qu\'avez-vous ressenti ?',
      'En quoi les technologies numériques ont-elles simplifié votre quotidien par rapport à la génération précédente ?',
      'Pensez-vous qu\'il faudrait interdire les smartphones dans tous les collèges et lycées ?'
    ],
    keyExpressions: [
      { phrase: 'Perdre le fil', context: 'Perdre sa concentration', arabicMeaning: 'فقدان التركيز أو حبل الأفكار', example: 'Avec toutes ces notifications, on finit par perdre le fil.' },
      { phrase: 'En faisant défiler', context: 'Gérondif pour scroller', arabicMeaning: 'أثناء التمرير على الشاشة', example: 'En faisant défiler les vidéos, on ne voit pas le temps passer.' },
      { phrase: 'Prendre conscience de', context: 'Réaliser lucidement', arabicMeaning: 'إدراك أمر ما بوعي', example: 'Il faut prendre conscience du temps accordé aux écrans.' },
      { phrase: 'Couper les ponts', context: 'Se déconnecter franchement', arabicMeaning: 'قطع الصلة تماماً لفترة', example: 'Le soir, je coupe les ponts avec mes e-mails professionnels.' }
    ],
    suggestedVocab: ['l\'omniprésence', 'la vigilance', 'un divertissement', 'saturé', 'instantané'],
    tipsForLevel: 'Formez le gérondif avec "en" + participe présent : "En lisant les actualités, j\'ai appris que...".'
  },
  {
    id: 'b1-cinema-recit',
    level: 'B1',
    subLevel: 'B1.1',
    title: 'Un film ou une série qui vous a passionné',
    description: 'Racontez l\'intrigue générale d\'un film sans trop en dévoiler et défendez votre appréciation.',
    category: 'Livres, Cinéma & Actualités',
    speakingObjective: 'Résumer une œuvre artistique et défendre une recommandation personnelle.',
    targetGrammar: 'Pronoms compléments directs et indirects (le, la, lui, leur) et adjectifs d\'émotion',
    initialQuestion: 'Quel film ou série avez-vous regardé récemment et qui vous a laissé un souvenir marquant ? De quoi s\'agit-il ?',
    followUpQuestions: [
      'Qu\'avez-vous pensé du jeu des acteurs ou de l\'ambiance visuelle ?',
      'Y a-t-il eu un retournement de situation ou une scène en particulier qui vous a ému ?',
      'À quel type de personne recommanderiez-vous absolument de le visionner ?',
      'Préférez-vous regarder les films en version originale sous-titrée ou doublés en français ? Pourquoi ?'
    ],
    keyExpressions: [
      { phrase: 'Avoir le souffle coupé', context: 'Être saisi par l\'émotion ou le suspense', arabicMeaning: 'انحباس الأنفاس من الإثارة أو التأثر', example: 'La fin de l\'épisode m\'a laissé le souffle coupé.' },
      { phrase: 'Ça vaut le détour', context: 'Mérite d\'être vu ou vécu', arabicMeaning: 'يستحق المشاهدة أو الاهتمام', example: 'Ce film documentaire vaut vraiment le détour.' },
      { phrase: 'Être captivé par', context: 'Être fasciné', arabicMeaning: 'الانجذاب والافتتان بالقصة', example: 'J\'ai été captivé par l\'histoire dès les premières minutes.' },
      { phrase: 'Ne pas voir le temps passer', context: 'Activité prenante', arabicMeaning: 'مرور الوقت بسرعة دون أن نشعر', example: 'L\'intrigue est si bonne qu\'on ne voit pas le temps passer.' }
    ],
    suggestedVocab: ['l\'intrigue', 'le dénouement', 'un rebondissement', 'poignant', 'inattendu'],
    tipsForLevel: 'Utilisez les pronoms : "Je le recommande", "Je lui ai trouvé beaucoup de charme".'
  },
  {
    id: 'b1-debat-transports',
    level: 'B1',
    subLevel: 'B1.2',
    title: 'Transports en commun gratuits ou voiture individuelle ?',
    description: 'Prenez position sur la gratuité des bus et métros face à l\'usage de la voiture en ville.',
    category: 'Opinions, Arguments & Débats',
    speakingObjective: 'Argumenter pour ou contre une mesure publique avec des connecteurs logiques.',
    targetGrammar: 'Connecteurs logiques d\'argumentation (D\'abord, De plus, Par conséquent, Pourtant)',
    initialQuestion: 'Pensez-vous que rendre tous les transports en commun totalement gratuits dans les villes soit une bonne solution écologique et sociale ?',
    followUpQuestions: [
      'Quels problèmes de financement ou d\'organisation cela poserait-il selon vous ?',
      'Pourrait-on envisager de bannir totalement les voitures des centres-villes historiques ?',
      'Comment vous déplacez-vous personnellement au quotidien, et quel mode de transport préférez-vous ?',
      'Quel compromis serait le plus juste pour les habitants des zones rurales qui n\'ont pas de métro ?'
    ],
    keyExpressions: [
      { phrase: 'D\'un côté... de l\'autre...', context: 'Exposer deux facettes', arabicMeaning: 'من جهة... ومن جهة أخرى', example: 'D\'un côté c\'est économique, de l\'autre cela coûte cher à la commune.' },
      { phrase: 'Peser le pour et le contre', context: 'Évaluer une décision', arabicMeaning: 'موازنة الإيجابيات والسلبيات', example: 'Avant d\'interdire la voiture, il faut bien peser le pour et le contre.' },
      { phrase: 'Aller dans le bon sens', context: 'Être une évolution positive', arabicMeaning: 'يسير في الاتجاه الصحيح', example: 'Investir dans le train va incontestablement dans le bon sens.' },
      { phrase: 'Être tributaire de', context: 'Dépendre obligatoirement de', arabicMeaning: 'يكون معتمداً أو رهناً لـ', example: 'À la campagne, on reste souvent tributaire de sa voiture.' }
    ],
    suggestedVocab: ['la fluidité', 'l\'engorgement', 'une alternative viable', 'les riverains', 'subventionner'],
    tipsForLevel: 'Structurez votre prise de parole : "Tout d\'abord...", "Ensuite...", "C\'est pourquoi je pense que...".'
  },

  // ==========================================
  // NIVEAU B2 (Argumentation avancée & nuance)
  // ==========================================
  {
    id: 'b2-intelligence-artificielle',
    level: 'B2',
    subLevel: 'B2.1',
    title: 'L\'IA : opportunité ou menace pour l\'esprit critique ?',
    description: 'Débattez de l\'impact des technologies génératives sur le travail intellectuel, l\'éducation et la créativité.',
    category: 'Sciences & Technologies',
    speakingObjective: 'Nuancer des prises de position contradictoires en utilisant des subordonnées concessives.',
    targetGrammar: 'Subjonctif après verbes de doute et tournures concessives (bien que, à moins que)',
    initialQuestion: 'À votre avis, l\'intelligence artificielle risque-t-elle d\'appauvrir notre créativité humaine ou au contraire d\'élargir nos horizons ?',
    followUpQuestions: [
      'Dans votre domaine professionnel ou personnel, observez-vous déjà des transformations dues à ces outils ?',
      'Bien que ces technologies soient puissantes, quelles limites fondamentales ne pourront-elles jamais dépasser ?',
      'Devrait-on imposer des règles strictes pour encadrer l\'usage de l\'IA à l\'école et à l\'université ?',
      'Si une machine crée une œuvre d\'art émouvante, peut-on la considérer comme une véritable œuvre artistique ?'
    ],
    keyExpressions: [
      { phrase: 'Une arme à double tranchant', context: 'Outil avec des avantages et des dangers', arabicMeaning: 'سلاح ذو حدين', example: 'L\'IA générative est indéniablement une arme à double tranchant.' },
      { phrase: 'Remettre en question', context: 'Douter de manière constructive', arabicMeaning: 'إعادة النظر أو التشكيك البنّاء', example: 'Ces innovations nous obligent à remettre en question nos méthodes.' },
      { phrase: 'Il va sans dire que', context: 'Souligner une évidence', arabicMeaning: 'غني عن البيان أو من نافلة القول', example: 'Il va sans dire que l\'esprit critique reste indispensable.' },
      { phrase: 'Prendre le pas sur', context: 'Dominer ou supplanter', arabicMeaning: 'يطغى على أو يسبق', example: 'La vitesse de calcul ne doit pas prendre le pas sur la réflexion.' }
    ],
    suggestedVocab: ['l\'éthique', 'l\'automatisation', 'le discernement', 'l\'obsolescence', 'la nuance'],
    tipsForLevel: 'Pratiquez les concessions : "Bien que ce soit pratique (+ subjonctif), il ne faut pas sous-estimer...".'
  },
  {
    id: 'b2-tourisme-de-masse',
    level: 'B2',
    subLevel: 'B2.2',
    title: 'Le surtourisme et la préservation du patrimoine',
    description: 'Analysez les tensions entre liberté de voyager, économie locale et protection des écosystèmes.',
    category: 'Environnement & Société',
    speakingObjective: 'Défendre un compromis politique et environnemental avec la voix passive.',
    targetGrammar: 'La voix passive et les tournures pronominales de sens passif (se détériorer, être préservé)',
    initialQuestion: 'Certaines destinations emblématiques imposent désormais des quotas de visiteurs. Approuvez-vous cette régulation du tourisme ?',
    followUpQuestions: [
      'Comment concilier le droit légitime de chacun à découvrir le monde avec la survie des quartiers historiques ?',
      'Avez-vous déjà visité un lieu où vous avez eu le sentiment désagréable d\'être un touriste de trop ?',
      'Pensez-vous qu\'augmenter les taxes de séjour soit une solution juste ou une discrimination financière ?',
      'Qu\'est-ce qui caractérise selon vous un voyageur réellement respectueux de la population locale ?'
    ],
    keyExpressions: [
      { phrase: 'Être victime de son succès', context: 'Souffrir d\'une popularité excessive', arabicMeaning: 'ضحية نجاحه أو شهرته الزائدة', example: 'Cette petite crique est devenue victime de son succès.' },
      { phrase: 'Avoir un impact néfaste', context: 'Provoquer des conséquences négatives', arabicMeaning: 'له أثر ضار أو سلبي', example: 'Le flux continu d\'autocars a un impact néfaste sur la quiétude des riverains.' },
      { phrase: 'Tirer la sonnette d\'alarme', context: 'Avertir d\'un danger imminent', arabicMeaning: 'دق ناقوس الخطر', example: 'Les résidents ont tiré la sonnette d\'alarme face à la hausse des loyers.' },
      { phrase: 'Faire la part des choses', context: 'Distinguer les aspects positifs et négatifs', arabicMeaning: 'التمييز بين الأمور بموضوعية', example: 'Il faut faire la part des choses entre apport économique et pollution.' }
    ],
    suggestedVocab: ['l\'engorgement', 'la dégradation', 'l\'authenticité', 'la régulation', 'l\'exaspération'],
    tipsForLevel: 'Développez deux arguments complémentaires avec des nuances : "Non seulement..., mais encore...".'
  },
  {
    id: 'b2-negocier-reunion',
    level: 'B2',
    subLevel: 'B2.1',
    title: 'Exprimer un désaccord poli en milieu professionnel',
    description: 'Simulez une prise de parole lors d\'une réunion de projet où vous devez contester un choix stratégique.',
    category: 'Travail & Vie professionnelle',
    speakingObjective: 'Négocier et exprimer des objections diplomatiques avec le conditionnel passé.',
    targetGrammar: 'Conditionnel passé (hypothèses sur le passé) & formules d\'adoucissement diplomatique',
    initialQuestion: 'Imaginez que votre collègue propose de réduire de moitié le délai d\'un projet crucial. Prenez la parole pour exprimer vos réserves avec diplomatie.',
    followUpQuestions: [
      'Quels arguments techniques ou organisationnels mettez-vous en avant pour convaincre votre équipe ?',
      'Si votre supérieur hiérarchique maintient cette décision coûte que coûte, quelle alternative proposez-vous ?',
      'Quelle est la différence entre être intransigeant sur la qualité et faire preuve de mauvaise volonté ?',
      'Comment gérez-vous d\'ordinaire les tensions interpersonnelles lors d\'un projet sous haute pression ?'
    ],
    keyExpressions: [
      { phrase: 'Je partage votre enthousiasme, toutefois...', context: 'Nuancer poliment avant d\'objecter', arabicMeaning: 'أشاطركم الحماس ولكن بتحفظ', example: 'Je partage votre enthousiasme, toutefois ce calendrier me semble prématuré.' },
      { phrase: 'Il me semble délicat de', context: 'Formulation diplomatique d\'une difficulté', arabicMeaning: 'يبدو لي من الصعب أو الحرج أن', example: 'Il me semble délicat de rogner sur les phases de test.' },
      { phrase: 'Ne perdons pas de vue que', context: 'Rappeler un point fondamental', arabicMeaning: 'دعونا لا نغفل عن حقيقة أن', example: 'Ne perdons pas de vue que la satisfaction client reste notre priorité.' },
      { phrase: 'À défaut de pouvoir..., nous pourrions...', context: 'Proposer un compromis constructif', arabicMeaning: 'إذا تعذر كذا، فيمكننا كذا بدلاً منه', example: 'À défaut de tout livrer en mai, nous pourrions prioriser le module central.' }
    ],
    suggestedVocab: ['un compromis', 'les exigences', 'la faisabilité', 'tenir les délais', 'une concession'],
    tipsForLevel: 'L\'art de la diplomatie en français réside dans l\'adoucissement : "Si vous me permettez...", "J\'aurais tendance à penser...".'
  },

  // ==========================================
  // NIVEAU A1 (Découverte & Présentations)
  // ==========================================
  {
    id: 'a1-presentation-personnelle',
    level: 'A1',
    title: 'Se présenter et parler de sa routine quotidienne',
    description: 'Échangez sur votre prénom, votre ville, vos goûts simples et votre journée habituelle.',
    category: 'Vie quotidienne & Expériences',
    speakingObjective: 'Présenter son identité et ses activités quotidiennes au présent.',
    targetGrammar: 'Présent de l\'indicatif & verbes réguliers en -er',
    initialQuestion: 'Bonjour ! Comment vous appelez-vous, d\'où venez-vous et que faites-vous dans la vie ?',
    followUpQuestions: [
      'À quelle heure commence votre journée le matin en général ? Que prenez-vous au petit-déjeuner ?',
      'Qu\'aimez-vous faire pendant votre temps libre le samedi et le dimanche ?',
      'Parlez-moi de votre ville : est-elle calme ou animée ? Qu\'y trouve-t-on d\'intéressant ?'
    ],
    keyExpressions: [
      { phrase: 'Je m\'appelle...', context: 'Dire son nom', arabicMeaning: 'اسمي...', example: 'Je m\'appelle Marc et j\'habite à Lyon.' },
      { phrase: 'J\'ai l\'habitude de...', context: 'Parler de sa routine', arabicMeaning: 'أنا معتاد على...', example: 'J\'ai l\'habitude de me lever tôt le matin.' },
      { phrase: 'J\'aime beaucoup...', context: 'Exprimer ses goûts', arabicMeaning: 'أحب كثيراً...', example: 'J\'aime beaucoup écouter de la musique.' }
    ],
    suggestedVocab: ['le matin', 'travailler', 'habiter', 'les loisirs', 'agréable'],
    tipsForLevel: 'Faites des phrases courtes et claires : Sujet + Verbe + Complément. Respirez et articulez bien.'
  },
  {
    id: 'a1-commander-au-cafe',
    level: 'A1',
    title: 'Commander au café ou dans un bistrot',
    description: 'Simulez une interaction courtoise avec un serveur dans un café parisien.',
    category: 'Vie quotidienne & Expériences',
    speakingObjective: 'Commander une boisson et un plat avec des formules de politesse de base.',
    targetGrammar: 'Conditionnel de politesse (je voudrais, j\'aimerais) & formules d\'accueil',
    initialQuestion: 'Bonjour ! Bienvenue au bistrot. Vous avez choisi ou vous désirez un café pour commencer ?',
    followUpQuestions: [
      'Très bien. Désirez-vous également manger quelque chose ? Nous avons le plat du jour et des sandwichs frais.',
      'Avez-vous des allergies alimentaires ou une préférence particulière ?',
      'Et pour terminer, prendrez-vous un dessert ou l\'addition directement ?'
    ],
    keyExpressions: [
      { phrase: 'Je voudrais...', context: 'Commander avec politesse', arabicMeaning: 'أود أو أرغب في...', example: 'Je voudrais un café allongé s\'il vous plaît.' },
      { phrase: 'L\'addition, s\'il vous plaît', context: 'Demander à payer', arabicMeaning: 'الحساب من فضلك', example: 'L\'addition s\'il vous plaît, je règle par carte.' },
      { phrase: 'C\'est délicieux', context: 'Complimenter', arabicMeaning: 'هذا لذيذ جداً', example: 'Merci beaucoup, c\'est délicieux !' }
    ],
    suggestedVocab: ['le menu', 'l\'addition', 'une carafe d\'eau', 'le plat du jour', 's\'il vous plaît'],
    tipsForLevel: 'Pensez à toujours associer "s\'il vous plaît" et "merci" à chaque commande.'
  },

  // ==========================================
  // NIVEAU A2 (Échanges simples & passés)
  // ==========================================
  {
    id: 'a2-week-end-dernier',
    level: 'A2',
    title: 'Raconter son dernier week-end et ses loisirs',
    description: 'Parlez de vos activités récentes, du temps qu\'il faisait et de vos rencontres.',
    category: 'Vie quotidienne & Expériences',
    speakingObjective: 'Raconter des actions passées et exprimer des impressions simples.',
    targetGrammar: 'Passé composé avec les auxiliaires être et avoir',
    initialQuestion: 'Bonjour ! Qu\'avez-vous fait le week-end dernier ? Êtes-vous resté chez vous ou sorti ?',
    followUpQuestions: [
      'Avec qui avez-vous passé ce moment ? De quoi avez-vous discuté ?',
      'Quel temps faisait-il dehors ? Cela a-t-il influencé votre programme ?',
      'Qu\'avez-vous prévu pour le week-end prochain en comparaison ?'
    ],
    keyExpressions: [
      { phrase: 'Je suis allé(e)...', context: 'Auxiliaire être au passé', arabicMeaning: 'ذهبت إلى...', example: 'Samedi après-midi, je suis allé au parc.' },
      { phrase: 'Il a fait beau temps', context: 'Météo passée', arabicMeaning: 'كان الطقس جميلاً', example: 'Il a fait beau temps toute la journée.' },
      { phrase: 'On s\'est bien amusés', context: 'Verbe pronominal au passé', arabicMeaning: 'استمتعنا كثيراً بوقتنا', example: 'Nous avons vu des amis et on s\'est bien amusés.' }
    ],
    suggestedVocab: ['se promener', 'rencontrer', 'se reposer', 'un spectacle', 'agréable'],
    tipsForLevel: 'Accordez le participe passé avec l\'auxiliaire être : "je suis parti(e)".'
  },

  // ==========================================
  // NIVEAU C1 (Spontanéité & complexité)
  // ==========================================
  {
    id: 'c1-technologie-societe',
    level: 'C1',
    title: 'L\'emprise du numérique sur le débat démocratique',
    description: 'Examinez la polarisation des opinions, les algorithmes de recommandation et la vérité.',
    category: 'Opinions, Arguments & Débats',
    speakingObjective: 'Développer une argumentation complexe avec des figures rhétoriques et de l\'ironie subtile.',
    targetGrammar: 'Structures complexes d\'inversion, tournures de réserve et doubles pronoms',
    initialQuestion: 'Dans quelle mesure les réseaux sociaux ont-ils métamorphosé la nature même de la confrontation des idées dans nos sociétés ?',
    followUpQuestions: [
      'Pensez-vous que les bulles de filtres algorithmiques constituent une entrave réelle à l\'esprit de conciliation citoyenne ?',
      'Quelle frontière éthique tracer entre modération des propos haineux et censure corporative ?',
      'Comment redonner au temps long de la réflexion ses lettres de noblesse face à l\'instantanéité médiatique ?'
    ],
    keyExpressions: [
      { phrase: 'Prendre toute la mesure de', context: 'Comprendre l\'ampleur d\'un phénomène', arabicMeaning: 'إدراك أبعاد الظاهرة بالكامل', example: 'Nous peinons encore à prendre toute la mesure de cette mutation technologique.' },
      { phrase: 'Être le reflet de', context: 'Démontrer un symptôme sous-jacent', arabicMeaning: 'يكون انعكاساً لـ', example: 'Ces tensions ne sont que le reflet d\'une société fracturée.' },
      { phrase: 'Force est de constater que', context: 'Constat incontournable', arabicMeaning: 'لا يسعنا إلا الإقرار بأن', example: 'Force est de constater que l\'attention du public s\'effrite.' }
    ],
    suggestedVocab: ['l\'aporie', 'l\'instantanéité', 'l\'infobésité', 'subversif', 'le clivage'],
    tipsForLevel: 'Déployez un rythme oratoire varié avec des nuances soutenues et des connecteurs littéraires.'
  },

  // ==========================================
  // NIVEAU C2 (Maîtrise & subtilités stylistiques)
  // ==========================================
  {
    id: 'c2-langue-pensee',
    level: 'C2',
    title: 'La langue façonne-t-elle notre perception du monde ?',
    description: 'Débattez de l\'hypothèse Sapir-Whorf, de l\'intraduisible et de la poésie comme résistance à l\'uniformisation.',
    category: 'Livres, Cinéma & Actualités',
    speakingObjective: 'Maniement virtuose des registres de langue, métaphores et nuances philosophiques.',
    targetGrammar: 'Registres contrastés, aphorismes et nuances stylistiques poussées',
    initialQuestion: 'Pensez-vous que notre langue maternelle détermine les contours précis de nos pensées, ou n\'en est-elle qu\'un réceptacle neutre ?',
    followUpQuestions: [
      'Avez-vous déjà ressenti dans une autre langue une émotion ou un concept dont le français n\'offre aucun équivalent exact ?',
      'La standardisation d\'une langue globale véhiculaire menace-t-elle la pluralité des imaginaires poétiques ?',
      'Dans quelle mesure apprendre une nouvelle langue équivaut-il à s\'inventer une nouvelle personnalité ?'
    ],
    keyExpressions: [
      { phrase: 'Au détour d\'une phrase', context: 'De façon impromptue et fine', arabicMeaning: 'في ثنايا الحديث أو بشكل عفوي عميق', example: 'C\'est au détour d\'une phrase que se révèle toute la finesse d\'une pensée.' },
      { phrase: 'Porter en soi le germe de', context: 'Contenir l\'origine profonde', arabicMeaning: 'يحمل في طياته بذور...', example: 'Chaque idiome porte en soi le germe d\'une vision singulière du réel.' },
      { phrase: 'Tant s\'en faut', context: 'Loin de là', arabicMeaning: 'أبعد ما يكون عن ذلك أو هيهات', example: 'Ces deux concepts ne sont pas synonymes, tant s\'en faut.' }
    ],
    suggestedVocab: ['l\'indicible', 'l\'herméneutique', 'la truculence', 'l\'antinomie', 'consubstantiel'],
    tipsForLevel: 'Explorez la polysémie, le second degré et la musicalité du verbe français.'
  }
];

export const LEVEL_INFO: Record<CEFRLevel, { label: string; name: string; description: string; targetAudience: string }> = {
  A1: {
    label: 'A1 - Découverte',
    name: 'Débutant',
    description: 'Comprendre et utiliser des expressions familières et quotidiennes.',
    targetAudience: 'Pour commencer à parler sans crainte avec des structures simples.'
  },
  A2: {
    label: 'A2 - Survie',
    name: 'Élémentaire',
    description: 'Communiquer lors de tâches simples et routinières de la vie courante.',
    targetAudience: 'Pour raconter son quotidien et voyager facilement.'
  },
  B1: {
    label: 'B1 - Seuil (Votre niveau cible B1.2)',
    name: 'Intermédiaire autonome',
    description: 'S\'exprimer de manière cohérente sur des sujets familiers, d\'intérêt personnel et donner ses raisons.',
    targetAudience: 'Votre zone de progression prioritaire (B1.2) : fluidité spontanée et expressions authentiques.'
  },
  B2: {
    label: 'B2 - Avancé',
    name: 'Utilisateur indépendant',
    description: 'Comprendre des sujets complexes et s\'exprimer avec spontanéité et clarté sur des thèmes variés.',
    targetAudience: 'Pour argumenter avec nuance, défendre son opinion et négocier en milieu professionnel.'
  },
  C1: {
    label: 'C1 - Autonome',
    name: 'Expérimenté',
    description: 'S\'exprimer spontanément et couramment sans trop chercher ses mots sur des sujets complexes.',
    targetAudience: 'Pour les débats intellectuels, les concepts abstraits et la nuance stylistique.'
  },
  C2: {
    label: 'C2 - Maîtrise',
    name: 'Bilingue / Maîtrise',
    description: 'Comprendre sans effort et s\'exprimer spontanément avec une très grande précision.',
    targetAudience: 'Pour la virtuosité linguistique et les subtilités idiomatiques les plus pointues.'
  }
};
