export type Language = 'ja' | 'en' | 'zh' | 'fr' | 'es';

export interface Translations {
  siteTitle: string;
  mlitLicense: string;
  mlitBadge?: string;
  heroTitle: string;
  heroSubtitle: string;
  
  navInstantQuote: string;
  navFleet: string;
  navRoutes: string;
  navWhyUs: string;
  navAdmin: string;
  navLanguage: string;
  navDestinations: string;

  calcTitle: string;
  calcSub: string;
  pickupLabel: string;
  destLabel: string;
  transferTypeLabel: string;
  oneWay: string;
  roundTrip: string;
  paxLabel: string;
  suitcasesLabel: string;
  skiBagsLabel: string;

  recommendedVehicle: string;
  estTollsIncluded: string;
  totalEstimatedQuote: string;
  whatsAppCTA: string;
  directBookCTA: string;

  fleetSectionTitle: string;
  fleetSectionSub: string;
  granaceTitle: string;
  granaceDesc: string;
  hiaceTitle: string;
  hiaceDesc: string;
  alphardTitle: string;
  alphardDesc: string;

  routesSectionTitle: string;
  routesSectionSub: string;
  routeOrigin: string;
  routeDest: string;
  routeGranace: string;
  routeHiace: string;

  whySectionTitle: string;
  greenPlateTitle: string;
  greenPlateDesc: string;
  meetGreetTitle: string;
  meetGreetDesc: string;
  conciergeTitle: string;
  conciergeDesc: string;

  footerCompany: string;
  footerRights: string;

  // Common UI words across languages
  selectDate: string;
  chooseVehicle: string;
  checkAvailability: string;
  instantConfirmation: string;
  bookNow: string;
  allDestinations: string;
  capacityExceeded: string;
  addSecondVehicle: string;
  lowestPriceGuarantee: string;
  freeCancellation: string;
  doorToDoorChauffeur: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  ja: {
    siteTitle: '株式会社SKリモ | ハイヤー・プライベートチャーター',
    mlitLicense: '国土交通省許可 一般乗用旅客自動車運送事業（関自旅第1234号）',
    mlitBadge: '国土交通省許可 緑ナンバー正規運行',
    heroTitle: '羽田・成田空港・都内発\n長野スキーリゾート ハイヤー送迎',
    heroSubtitle: '新幹線の乗合や荷物制限から解放される、完全予約制ドアtoドア専属ハイヤー。全車4WD・スタッドレスタイヤ完備。',

    navInstantQuote: '定額お見積り',
    navFleet: '運行車両',
    navRoutes: '定額料金一覧',
    navWhyUs: 'サービスの特徴',
    navAdmin: '価格管理コンソール',
    navLanguage: '言語切替',
    navDestinations: '日帰り観光ツアー',

    calcTitle: 'スキー送迎 リアルタイム定額計算',
    calcSub: 'ご乗車人数とお荷物に合わせて最適車両と料金を表示いたします。',
    pickupLabel: 'ご出発地',
    destLabel: 'ご目的地（スキーリゾート）',
    transferTypeLabel: '運行区分',
    oneWay: '片道運行',
    roundTrip: '往復運行 (5%割引)',
    paxLabel: 'ご乗車人数',
    suitcasesLabel: 'スーツケース',
    skiBagsLabel: 'スキー・スノボバッグ',

    recommendedVehicle: '推奨車両',
    estTollsIncluded: '高速道路利用料・燃料代・乗務員手当込み',
    totalEstimatedQuote: '概算定額料金（税込）',
    whatsAppCTA: 'WhatsAppで空車確認・お見積り確定',
    directBookCTA: 'Webオンライン予約へ進む',

    fleetSectionTitle: 'アルファード・グランエース・ハイエース 運行車両ラインナップ',
    fleetSectionSub: '実車の写真を掲載しております。全車4WD駆動・ブリヂストン製スタッドレスタイヤ標準装備。',
    granaceTitle: 'トヨタ グランエース エグゼクティブ',
    granaceDesc: '本革エグゼクティブリクライニングシート装備。VIPのお客様に最適な最上級ミニバン。',
    hiaceTitle: 'トヨタ ハイエース グランドキャビン',
    hiaceDesc: 'ハイルーフ＆ロングボディ。大人数でのご移動や長尺スキーケースも余裕をもって積載。',
    alphardTitle: 'トヨタ アルファード エグゼクティブラウンジ',
    alphardDesc: '静粛性と最高峰の乗り心地を兼ね備えた VIP専属チャーター車両。',

    routesSectionTitle: '主要ルート別 定額料金表',
    routesSectionSub: '明朗会計の完全定額料金。渋滞等による追加メーター料金の発生はございません。',
    routeOrigin: '出発地',
    routeDest: '目的地',
    routeGranace: 'グランエース定額',
    routeHiace: 'ハイエース定額',

    whySectionTitle: 'SK LIMOの安心品質',
    greenPlateTitle: '緑ナンバー正規許認可',
    greenPlateDesc: '国土交通省の認可を受けた事業用緑ナンバー車両のみで運行。無制限の旅客賠償保険に加入しております。',
    meetGreetTitle: '空港ネームボードお出迎え',
    meetGreetDesc: '到着ロビーにて専任乗務員がお名前入りのボードでお迎えし、お荷物の搬入までフルサポートいたします。',
    conciergeTitle: '24時間バイリンガル対応',
    conciergeDesc: '日本語・英語対応の配車デスクがフライトの遅延状況をリアルタイムで監視し、迅速に対応いたします。',

    footerCompany: '株式会社SKリモ (SK Limo Co., Ltd.)',
    footerRights: 'All Rights Reserved.',

    selectDate: '予定日を選択',
    chooseVehicle: '車両クラスを選択',
    checkAvailability: '空車確認＆オンライン予約',
    instantConfirmation: '即時予約確定可能',
    bookNow: '今すぐ予約・決済',
    allDestinations: '観光地一覧に戻る',
    capacityExceeded: '定員を超えています。もう1台追加しますか？',
    addSecondVehicle: '+ サポート車両をもう1台追加',
    lowestPriceGuarantee: '最安値保証・高速代＆ガソリン代込み',
    freeCancellation: '24時間前までキャンセル無料',
    doorToDoorChauffeur: 'ホテル送迎・専属プロドライバー',
  },

  en: {
    siteTitle: 'SK Limo Co., Ltd. | Executive Private Charters Japan',
    mlitBadge: 'Official Licensed MLIT Green-Plate Operator',
    mlitLicense: 'Ministry of Land, Infrastructure, Transport and Tourism Authorized Operator',
    heroTitle: 'Private Door-to-Door Ski Charters:\nTokyo & Airports to Nagano Resorts',
    heroSubtitle: 'Direct, hassle-free luxury chauffeurs from Haneda, Narita, and Tokyo to Hakuba, Nozawa, and Shiga Kogen. 4WD & studless snow tires standard.',

    navInstantQuote: 'Instant Quote',
    navFleet: 'Our Fleet',
    navRoutes: 'Fixed Rates',
    navWhyUs: 'Why SK Limo',
    navAdmin: 'Pricing Admin',
    navLanguage: 'Language',
    navDestinations: 'Day Trips & Tours',

    calcTitle: 'Instant Ski Transfer Quote Engine',
    calcSub: 'Select your route and party size for real-time all-inclusive rate calculation.',
    pickupLabel: 'Pickup Location',
    destLabel: 'Resort Destination',
    transferTypeLabel: 'Transfer Type',
    oneWay: 'One Way',
    roundTrip: 'Round Trip (5% Off)',
    paxLabel: 'Passengers',
    suitcasesLabel: 'Suitcases',
    skiBagsLabel: 'Ski/Board Bags',

    recommendedVehicle: 'RECOMMENDED VEHICLE',
    estTollsIncluded: 'Highway Tolls, Fuel & Driver Fees Included',
    totalEstimatedQuote: 'Total Estimated Fixed Rate',
    whatsAppCTA: 'Lock In Quote via WhatsApp',
    directBookCTA: 'Book Online Direct',

    fleetSectionTitle: 'Alphard, Granace & HiAce Executive Fleet',
    fleetSectionSub: 'Authentic photos of our commercial green-plate fleet. Equipped with 4WD and studless snow tires.',
    granaceTitle: 'Toyota Granace Executive Lounge',
    granaceDesc: 'Ultra-luxury 6-seater with VIP leather captain seats and whisper-quiet ride.',
    hiaceTitle: 'Toyota HiAce Grand Cabin',
    hiaceDesc: 'High-roof extended length 10-seater van designed for large groups and heavy ski gear.',
    alphardTitle: 'Toyota Alphard Executive Lounge',
    alphardDesc: 'Premium Japanese luxury MPV for couples and small families.',

    routesSectionTitle: 'Fixed-Rate Transfer Matrix',
    routesSectionSub: 'Guaranteed fixed fares with zero unexpected meter spikes or toll charges.',
    routeOrigin: 'Origin',
    routeDest: 'Destination',
    routeGranace: 'Granace Rate',
    routeHiace: 'HiAce Rate',

    whySectionTitle: 'The SK Limo Standard of Excellence',
    greenPlateTitle: 'MLIT Licensed Green-Plate Operator',
    greenPlateDesc: 'Fully authorized commercial transport with unlimited passenger liability insurance.',
    meetGreetTitle: 'Airport Arrival Lobby Meet & Greet',
    meetGreetDesc: 'Uniformed chauffeur welcomes you at the arrival gate with a personalized sign and handles all baggage.',
    conciergeTitle: '24/7 Bilingual Concierge',
    conciergeDesc: 'Real-time flight delay tracking and instant WhatsApp support in English & Japanese.',

    footerCompany: 'SK Limo Co., Ltd. (株式会社SKリモ)',
    footerRights: 'All Rights Reserved.',

    selectDate: 'Select Date',
    chooseVehicle: 'Choose Vehicle Class',
    checkAvailability: 'Check Availability & Book',
    instantConfirmation: 'Instant Confirmation Available',
    bookNow: 'Book Now & Pay Securely',
    allDestinations: 'All Destinations',
    capacityExceeded: 'Capacity exceeded. Do you wish to book another vehicle?',
    addSecondVehicle: '+ Add 2nd Support Vehicle',
    lowestPriceGuarantee: 'Lowest Price Guarantee • Tolls & Gas Included',
    freeCancellation: 'Free cancellation up to 24 hours before',
    doorToDoorChauffeur: 'Door-to-door VIP executive chauffeur',
  },

  zh: {
    siteTitle: 'SK Limo 株式会社 | 日本顶级包车与豪华专车接送',
    mlitBadge: '日本国土交通省官方认证 绿牌营运资质',
    mlitLicense: '日本国土交通省许可 一般乘用旅客汽车运送事业（关自旅第1234号）',
    heroTitle: '东京及机场出发\n长野滑雪胜地 豪华包车专车接送',
    heroSubtitle: '摆脱新干线拥挤换乘与行李重量限制，提供从羽田、成田机场及东京市区前往白马、野泽、志贺高原的全天候点对点专车服务。全系配备四驱及顶级雪地胎。',

    navInstantQuote: '即时报价',
    navFleet: '车队阵容',
    navRoutes: '一口价价目表',
    navWhyUs: '服务特色',
    navAdmin: '价格管理',
    navLanguage: '语言选择',
    navDestinations: '东京周边一日游',

    calcTitle: '滑雪接送 实时智能报价计算器',
    calcSub: '根据您的出行人数与行李数量，实时计算最优车型与一口价全包价格。',
    pickupLabel: '出发地',
    destLabel: '目的地（滑雪胜地）',
    transferTypeLabel: '行程类型',
    oneWay: '单程接送',
    roundTrip: '往返接送 (享95折特惠)',
    paxLabel: '乘客人数',
    suitcasesLabel: '托运行李箱',
    skiBagsLabel: '雪板/滑雪包',

    recommendedVehicle: '推荐车型',
    estTollsIncluded: '已包含高速公路通行费、燃油费及司机服务费',
    totalEstimatedQuote: '预估全包固定总价（含税）',
    whatsAppCTA: '通过 WhatsApp 确认空车及行程',
    directBookCTA: '立即在线安全预订',

    fleetSectionTitle: '丰田埃尔法・格兰亚・海狮 豪华商务车队',
    fleetSectionSub: '展示真实商业绿牌车辆实拍。全系标配 4WD 全时四驱及普利司通高性能防滑雪地胎。',
    granaceTitle: '丰田 Granace 豪华商务旗舰 (6座)',
    granaceDesc: '配备独立真皮头等舱航空座椅与极致静音车厢，高端商务与VIP家庭出行的奢华之选。',
    hiaceTitle: '丰田 HiAce Grand Cabin (10座)',
    hiaceDesc: '高顶加长轴距客车，可轻松容纳多人团队出行及多套超长雪具装备。',
    alphardTitle: '丰田埃尔法 Alphard 行政酒廊版',
    alphardDesc: '日本殿堂级豪华MPV，带来无与伦比的平稳舒适乘车体验。',

    routesSectionTitle: '主要热门路线 一口价明细表',
    routesSectionSub: '公开透明的一口价全包计费，绝无堵车跳表或隐形追加收费。',
    routeOrigin: '出发地',
    routeDest: '目的地',
    routeGranace: 'Granace 一口价',
    routeHiace: 'HiAce 一口价',

    whySectionTitle: '选择 SK LIMO 的尊贵品质',
    greenPlateTitle: '日本国家正规商业绿牌认证',
    greenPlateDesc: '持有国土交通省正式营业执照，每辆车均配备无限额乘客旅客责任意外险。',
    meetGreetTitle: '机场接机大厅 举牌专属迎接',
    meetGreetDesc: '专业司机身着制服在到达口举牌等候，协助搬运所有大件行李直达专属座驾。',
    conciergeTitle: '24小时双语管家式服务',
    conciergeDesc: '支持中文、英文、日文沟通，实时追踪航班动态，航班延误无需担忧。',

    footerCompany: '株式会社SKリモ (SK Limo Co., Ltd.)',
    footerRights: '版权所有 All Rights Reserved.',

    selectDate: '选择出行日期',
    chooseVehicle: '选择车辆等级 (3款车型)',
    checkAvailability: '查询空车并预订',
    instantConfirmation: '支持即时确认预订',
    bookNow: '立即预订并安全支付',
    allDestinations: '查看所有目的地',
    capacityExceeded: '乘客人数超出单车座位上限，是否需要追加第二辆专车？',
    addSecondVehicle: '+ 追加第二辆随行保障专车',
    lowestPriceGuarantee: '全网最优价格保证 • 含高速费及燃油费',
    freeCancellation: '出发前24小时内可免费取消',
    doorToDoorChauffeur: '酒店门到门接送 • 专属专业司机',
  },

  fr: {
    siteTitle: 'SK Limo Co., Ltd. | Chauffeur Privé VIP & Transferts Japon',
    mlitBadge: 'Opérateur Agréé Officiel Plaque Verte MLIT',
    mlitLicense: 'Autorisé par le Ministère du Territoire, des Infrastructures et des Transports',
    heroTitle: 'Transferts Privés Stations de Ski:\nTokyo & Aéroports vers Nagano',
    heroSubtitle: 'Voyagez sans contrainte de Tokyo, Haneda et Narita vers Hakuba, Nozawa et Shiga Kogen. Flotte 4x4 haut de gamme équipée de pneus neige.',

    navInstantQuote: 'Devis Immédiat',
    navFleet: 'Notre Flotte',
    navRoutes: 'Tarifs Fixes',
    navWhyUs: 'Pourquoi SK Limo',
    navAdmin: 'Gestion',
    navLanguage: 'Langue',
    navDestinations: 'Excursions & Visites',

    calcTitle: 'Calculateur de Tarif de Transfert en Temps Réel',
    calcSub: 'Sélectionnez votre itinéraire et le nombre de passagers pour un tarif fixe tout compris.',
    pickupLabel: 'Lieu de prise en charge',
    destLabel: 'Destination (Station de ski)',
    transferTypeLabel: 'Type de trajet',
    oneWay: 'Aller simple',
    roundTrip: 'Aller-retour (-5% de réduction)',
    paxLabel: 'Passagers',
    suitcasesLabel: 'Valises',
    skiBagsLabel: 'Housses de ski / Snowboard',

    recommendedVehicle: 'VÉHICULE RECOMMANDÉ',
    estTollsIncluded: 'Péages d’autoroute, carburant et chauffeur inclus',
    totalEstimatedQuote: 'Tarif Fixe Tout Compris Estimé',
    whatsAppCTA: 'Confirmer la réservation via WhatsApp',
    directBookCTA: 'Réserver directement en ligne',

    fleetSectionTitle: 'Flotte VIP: Toyota Alphard, Granace & HiAce',
    fleetSectionSub: 'Véhicules commerciaux certifiés plaque verte, équipés de 4 roues motrices et pneus neige.',
    granaceTitle: 'Toyota Granace Executive Lounge',
    granaceDesc: 'Van de grand luxe 6 places avec sièges capitaines inclinables en cuir pour VIP.',
    hiaceTitle: 'Toyota HiAce Grand Cabin',
    hiaceDesc: 'Grand van 10 places haute capacité parfait pour les familles et équipements de ski volumineux.',
    alphardTitle: 'Toyota Alphard Executive Lounge',
    alphardDesc: 'Le monospace de prestige japonais par excellence pour couples et petits groupes.',

    routesSectionTitle: 'Grille des Tarifs Fixes par Destination',
    routesSectionSub: 'Tarifs forfaitaires garantis sans surcoût d’embouteillage ou de compteur.',
    routeOrigin: 'Départ',
    routeDest: 'Arrivée',
    routeGranace: 'Tarif Granace',
    routeHiace: 'Tarif HiAce',

    whySectionTitle: 'L’Excellence du Service SK LIMO',
    greenPlateTitle: 'Licence Commerciale Plaque Verte',
    greenPlateDesc: 'Conforme aux réglementations japonaises avec assurance responsabilité passagers illimitée.',
    meetGreetTitle: 'Accueil Personnalisé à l’Aéroport',
    meetGreetDesc: 'Chauffeur en costume vous accueillant à la sortie des bagages avec panneau nominatif.',
    conciergeTitle: 'Conciergerie Dédiée 24/7',
    conciergeDesc: 'Suivi des vols en temps réel et assistance rapide en anglais, français et japonais.',

    footerCompany: 'SK Limo Co., Ltd. (株式会社SKリモ)',
    footerRights: 'Tous droits réservés.',

    selectDate: 'Choisir la date',
    chooseVehicle: 'Choisir la catégorie de véhicule',
    checkAvailability: 'Vérifier la disponibilité & Réserver',
    instantConfirmation: 'Confirmation immédiate disponible',
    bookNow: 'Réserver & Payer en toute sécurité',
    allDestinations: 'Toutes les destinations',
    capacityExceeded: 'Capacité maximale atteinte. Souhaitez-vous réserver un second véhicule ?',
    addSecondVehicle: '+ Ajouter un 2e véhicule de soutien',
    lowestPriceGuarantee: 'Meilleur prix garanti • Péages et essence inclus',
    freeCancellation: 'Annulation gratuite jusqu’à 24h avant',
    doorToDoorChauffeur: 'Chauffeur privé VIP de porte à porte',
  },

  es: {
    siteTitle: 'SK Limo Co., Ltd. | Chófer Privado de Lujo y Traslados en Japón',
    mlitBadge: 'Operador Oficial Autorizado con Placa Verde MLIT',
    mlitLicense: 'Licencia del Ministerio de Territorio, Infraestructura, Transporte y Turismo',
    heroTitle: 'Traslados Privados a Estaciones de Esquí:\nTokio y Aeropuertos hacia Nagano',
    heroSubtitle: 'Servicio exclusivo de chófer puerta a puerta desde Haneda, Narita y Tokio hacia Hakuba, Nozawa y Shiga Kogen. Vehículos 4WD con neumáticos de nieve.',

    navInstantQuote: 'Cotización Inmediata',
    navFleet: 'Nuestra Flota',
    navRoutes: 'Tarifas Fijas',
    navWhyUs: 'Por qué SK Limo',
    navAdmin: 'Administración',
    navLanguage: 'Idioma',
    navDestinations: 'Excursiones y Tours',

    calcTitle: 'Calculadora de Tarifas de Traslado en Tiempo Real',
    calcSub: 'Seleccione su ruta y número de pasajeros para calcular la tarifa fija con todo incluido.',
    pickupLabel: 'Lugar de recogida',
    destLabel: 'Destino (Estación de esquí)',
    transferTypeLabel: 'Tipo de traslado',
    oneWay: 'Solo ida',
    roundTrip: 'Ida y vuelta (5% de descuento)',
    paxLabel: 'Pasajeros',
    suitcasesLabel: 'Maletas',
    skiBagsLabel: 'Bolsas de esquí/snowboard',

    recommendedVehicle: 'VEHÍCULO RECOMENDADO',
    estTollsIncluded: 'Peajes de autopista, combustible y chófer incluidos',
    totalEstimatedQuote: 'Tarifa Fija Total Estimada',
    whatsAppCTA: 'Confirmar reserva por WhatsApp',
    directBookCTA: 'Reservar en línea directamente',

    fleetSectionTitle: 'Flota Ejecutiva: Toyota Alphard, Granace y HiAce',
    fleetSectionSub: 'Vehículos comerciales con placa verde oficial, tracción 4x4 y neumáticos de nieve.',
    granaceTitle: 'Toyota Granace Executive Lounge',
    granaceDesc: 'Van de ultra lujo para 6 personas con asientos de cuero reclinables tipo capitán.',
    hiaceTitle: 'Toyota HiAce Grand Cabin',
    hiaceDesc: 'Minibús de 10 plazas con techo alto, ideal para grupos grandes y equipaje de esquí.',
    alphardTitle: 'Toyota Alphard Executive Lounge',
    alphardDesc: 'El monovolumen prémium japonés para parejas y familias pequeñas.',

    routesSectionTitle: 'Tabla de Tarifas Fijas por Ruta',
    routesSectionSub: 'Precios cerrados garantizados sin sorpresas de taxímetro ni cargos extras por atascos.',
    routeOrigin: 'Origen',
    routeDest: 'Destino',
    routeGranace: 'Tarifa Granace',
    routeHiace: 'Tarifa HiAce',

    whySectionTitle: 'La Garantía de Excelencia de SK LIMO',
    greenPlateTitle: 'Licencia Comercial Placa Verde',
    greenPlateDesc: 'Transporte legalmente autorizado con seguro ilimitado de responsabilidad para pasajeros.',
    meetGreetTitle: 'Bienvenida Personalizada en el Aeropuerto',
    meetGreetDesc: 'Chófer uniformado esperándole en la puerta de llegadas con cartel a su nombre.',
    conciergeTitle: 'Atención 24/7 Multilingüe',
    conciergeDesc: 'Seguimiento de vuelos en tiempo real y asistencia rápida por WhatsApp.',

    footerCompany: 'SK Limo Co., Ltd. (株式会社SKリモ)',
    footerRights: 'Todos los derechos reservados.',

    selectDate: 'Seleccionar fecha',
    chooseVehicle: 'Elegir categoría de vehículo',
    checkAvailability: 'Comprobar disponibilidad y Reservar',
    instantConfirmation: 'Confirmación inmediata disponible',
    bookNow: 'Reservar ahora y Pagar de forma segura',
    allDestinations: 'Ver todos los destinos',
    capacityExceeded: 'Capacidad máxima excedida. ¿Desea reservar otro vehículo adicional?',
    addSecondVehicle: '+ Añadir 2º vehículo de apoyo',
    lowestPriceGuarantee: 'Mejor precio garantizado • Peajes y gasolina incluidos',
    freeCancellation: 'Cancelación gratuita hasta 24 horas antes',
    doorToDoorChauffeur: 'Chófer ejecutivo privado puerta a puerta',
  },
};
