import { SentenceItem, SpeedPreset } from '../types';

export const SPEED_PRESETS: SpeedPreset[] = [
  {
    id: 'super-slow',
    rate: 0.5,
    label: '0.5x 거북이 속도',
    badge: '🐢 아주 천천히',
    icon: 'Turtle',
    description: '알파벳 소리와 발음 하나하나를 또박또박 확인할 때 좋아요.',
    recommendedFor: '처음 듣는 긴 단어나 어려운 발음 연습',
  },
  {
    id: 'slow',
    rate: 0.75,
    label: '0.75x 고슴도치 속도',
    badge: '🦔 조금 천천히',
    icon: 'Hedgehog',
    description: '선생님 소리를 듣고 한 단어씩 따라 말하기(Shadowing)에 가장 좋아요!',
    recommendedFor: '초등 3~4학년 추천 & 따라 읽기 연습',
  },
  {
    id: 'normal',
    rate: 1.0,
    label: '1.0x 표준 속도',
    badge: '🚶 원어민 표준',
    icon: 'User',
    description: '실제 원어민 친구들이 자연스럽게 대화하는 보통 속도예요.',
    recommendedFor: '자연스러운 영어 리듬과 억양 익히기',
  },
  {
    id: 'fast',
    rate: 1.25,
    label: '1.25x 토끼 속도',
    badge: '🐇 조금 빠르게',
    icon: 'Rabbit',
    description: '익숙해진 문장을 귀 기울여 듣고 빠르게 이해하는 훈련을 해요.',
    recommendedFor: '듣기 실력 UP & 자신감 키우기',
  },
  {
    id: 'super-fast',
    rate: 1.5,
    label: '1.5x 로켓 속도',
    badge: '🚀 도전! 빠른 속도',
    icon: 'Rocket',
    description: '영어 마스터를 위한 초고속 듣기 챌린지!',
    recommendedFor: '재미있는 빠른 말 듣기 게임',
  },
];

// Offline elementary dictionary for instant lookup of common elementary words
export const OFFLINE_ELEMENTARY_DICT: Record<string, { syllables: string; phonetic: string; koreanMeaning: string; tip: string }> = {
  apple: { syllables: 'ap·ple', phonetic: '/ˈæp.əl/', koreanMeaning: '사과', tip: '첫 소리 /æ/는 입을 사과 베어 물듯 크게 벌려요.' },
  banana: { syllables: 'ba·nan·a', phonetic: '/bəˈnæn.ə/', koreanMeaning: '바나나', tip: '가운데 nan에 힘을 주어 읽어요: 바-내-너!' },
  elephant: { syllables: 'el·e·phant', phonetic: '/ˈel.ə.fənt/', koreanMeaning: '코끼리', tip: 'ph는 f 소리예요! 윗니로 아랫입술을 살짝 닿게 해요.' },
  school: { syllables: 'school', phonetic: '/skuːl/', koreanMeaning: '학교', tip: 'ch는 /k/ 소리가 나요. 끝의 l은 혀끝을 윗잇몸에 붙여요.' },
  friend: { syllables: 'friend', phonetic: '/frend/', koreanMeaning: '친구', tip: 'ie가 짧은 /e/ 소리가 나요. 프렌-드!' },
  beautiful: { syllables: 'beau·ti·ful', phonetic: '/ˈbjuː.tɪ.fəl/', koreanMeaning: '아름다운, 예쁜', tip: '3음절로 뷰-티-풀! 끝을 부드럽게 내려요.' },
  morning: { syllables: 'morn·ing', phonetic: '/ˈmɔːr.nɪŋ/', koreanMeaning: '아침', tip: 'or 소리를 낼 때 입술을 둥글게 모으고 혀를 살짝 굴려요.' },
  teacher: { syllables: 'teach·er', phonetic: '/ˈtiː.tʃər/', koreanMeaning: '선생님', tip: 'ea는 길게 /iː/ 소리를 내어 \'티-처\'로 발음해요.' },
  family: { syllables: 'fam·i·ly', phonetic: '/ˈfæm.əl.i/', koreanMeaning: '가족', tip: 'f 발음할 때 윗니로 아랫입술을 살짝 물어 바람을 뿜어요.' },
  happy: { syllables: 'hap·py', phonetic: '/ˈhæp.i/', koreanMeaning: '행복한, 기쁜', tip: 'p가 두 개 있지만 한 번만 팡 터뜨려요: 해피!' },
  sunny: { syllables: 'sun·ny', phonetic: '/ˈsʌn.i/', koreanMeaning: '화창한, 맑은', tip: 'u는 /ʌ/ 턱을 툭 떨어뜨리며 써-니!' },
  together: { syllables: 'to·geth·er', phonetic: '/təˈɡeð.ər/', koreanMeaning: '함께, 같이', tip: 'th는 혀를 이 사이에 살짝 내밀어 부드럽게 울려요.' },
  wonderful: { syllables: 'won·der·ful', phonetic: '/ˈwʌn.dər.fəl/', koreanMeaning: '놀라운, 멋진', tip: '원-더-풀! w 발음은 입술을 모았다가 펼쳐요.' },
  tomorrow: { syllables: 'to·mor·row', phonetic: '/təˈmɑːr.oʊ/', koreanMeaning: '내일', tip: 'mor에 강세가 있어요: 투-마-로우!' },
  butterfly: { syllables: 'but·ter·fly', phonetic: '/ˈbʌt.ər.flaɪ/', koreanMeaning: '나비', tip: '버-터-플라이! fly에서 f와 l을 매끄럽게 연결해요.' },
  dinosaur: { syllables: 'di·no·saur', phonetic: '/ˈdaɪ.nə.sɔːr/', koreanMeaning: '공룡', tip: '다이-너-소어! 아이들이 좋아하는 공룡 단어예요.' },
  rainbow: { syllables: 'rain·bow', phonetic: '/ˈreɪn.boʊ/', koreanMeaning: '무지개', tip: 'ai는 /eɪ/, ow는 /oʊ/! 레인-보우!' },
  library: { syllables: 'li·brar·y', phonetic: '/ˈlaɪ.brer.i/', koreanMeaning: '도서관', tip: 'r 발음이 두 번 나와요. 혀가 입천장에 닿지 않게 주의해요.' },
};

export const CURRICULUM_SENTENCES: SentenceItem[] = [
  // 초등 3~4학년 기초
  {
    id: 'g34-1',
    english: 'Hello, what is your name?',
    korean: '안녕, 너의 이름은 무엇이니?',
    category: '인사와 소개',
    gradeLevel: 'grade3-4',
    keyWords: ['hello', 'what', 'name'],
    phonicsFocus: '기초 인사 의문문'
  },
  {
    id: 'g34-2',
    english: 'I like red apples and sweet bananas.',
    korean: '나는 빨간 사과와 달콤한 바나나를 좋아해요.',
    category: '음식과 과일',
    gradeLevel: 'grade3-4',
    keyWords: ['apples', 'bananas', 'sweet'],
    phonicsFocus: 'short a & 복수형 -s'
  },
  {
    id: 'g34-3',
    english: 'Look at the cute puppy playing with a ball.',
    korean: '공을 가지고 노는 귀여운 강아지를 보세요.',
    category: '동물과 자연',
    gradeLevel: 'grade3-4',
    keyWords: ['cute', 'puppy', 'playing', 'ball'],
    phonicsFocus: 'oo & all 소리'
  },
  {
    id: 'g34-4',
    english: 'This is my mom. She is a wonderful teacher.',
    korean: '이분은 우리 어머니예요. 훌륭한 선생님이시죠.',
    category: '가족과 친구',
    gradeLevel: 'grade3-4',
    keyWords: ['mom', 'wonderful', 'teacher'],
    phonicsFocus: 'th & ea 발음'
  },
  {
    id: 'g34-5',
    english: 'Today is sunny and warm outside.',
    korean: '오늘은 밖이 화창하고 따뜻해요.',
    category: '날씨와 계절',
    gradeLevel: 'grade3-4',
    keyWords: ['today', 'sunny', 'warm', 'outside'],
    phonicsFocus: 'ay & ar 발음'
  },
  {
    id: 'g34-6',
    english: 'Can you jump high like a green frog?',
    korean: '초록 개구리처럼 높이 뛸 수 있나요?',
    category: '동작과 놀이',
    gradeLevel: 'grade3-4',
    keyWords: ['jump', 'high', 'green', 'frog'],
    phonicsFocus: 'igh & ee 발음'
  },

  // 초등 5~6학년 실력
  {
    id: 'g56-1',
    english: 'What are you going to do this weekend?',
    korean: '이번 주말에 무엇을 할 예정인가요?',
    category: '계획과 일정',
    gradeLevel: 'grade5-6',
    keyWords: ['going to', 'weekend', 'future'],
    phonicsFocus: 'be going to 미래 표현'
  },
  {
    id: 'g56-2',
    english: 'Excuse me, where is the science classroom?',
    korean: '실례합니다, 과학실이 어디에 있나요?',
    category: '학교와 길찾기',
    gradeLevel: 'grade5-6',
    keyWords: ['excuse', 'science', 'classroom'],
    phonicsFocus: 'sci- & wh- 의문사'
  },
  {
    id: 'g56-3',
    english: 'I visited the national museum with my family yesterday.',
    korean: '나는 어제 가족과 함께 국립박물관에 방문했어요.',
    category: '과거 경험',
    gradeLevel: 'grade5-6',
    keyWords: ['visited', 'museum', 'yesterday'],
    phonicsFocus: '규칙 과거형 -ed 발음(/t/, /d/, /ɪd/)'
  },
  {
    id: 'g56-4',
    english: 'We should protect our planet by planting more green trees.',
    korean: '우리는 더 많은 푸른 나무를 심어서 지구를 보호해야 해요.',
    category: '환경과 사회',
    gradeLevel: 'grade5-6',
    keyWords: ['protect', 'planet', 'planting'],
    phonicsFocus: 'pl- & tr- 자음군 발음'
  },
  {
    id: 'g56-5',
    english: 'My favorite hobby is reading adventure books and drawing.',
    korean: '내가 가장 좋아하는 취미는 모험 책 읽기와 그림 그리기예요.',
    category: '취미와 관심사',
    gradeLevel: 'grade5-6',
    keyWords: ['favorite', 'adventure', 'reading', 'drawing'],
    phonicsFocus: 'dr- & aw 발음'
  },

  // 파닉스 & 라임 놀이 (Phonics & Rhyme Fun)
  {
    id: 'ph-1',
    english: 'A fat cat sat on a red mat with a black hat.',
    korean: '뚱뚱한 고양이가 검은 모자를 쓰고 빨간 매트 위에 앉았어요.',
    category: 'Short A 라임 (-at)',
    gradeLevel: 'phonics',
    keyWords: ['fat', 'cat', 'sat', 'mat', 'hat'],
    phonicsFocus: '-at family (cat, fat, hat, mat, sat)'
  },
  {
    id: 'ph-2',
    english: 'Ten red pens are on the wet bed in the tent.',
    korean: '텐트 안의 젖은 침대 위에 빨간 펜 열 자루가 있어요.',
    category: 'Short E 라임 (-en, -et, -ed)',
    gradeLevel: 'phonics',
    keyWords: ['ten', 'red', 'pens', 'wet', 'bed'],
    phonicsFocus: '-en & -ed & -et family'
  },
  {
    id: 'ph-3',
    english: 'Six big pigs did a quick wig dance in the ship.',
    korean: '여섯 마리의 큰 돼지들이 배 안에서 가발을 쓰고 춤을 췄어요.',
    category: 'Short I 라임 (-ig, -ip, -ix)',
    gradeLevel: 'phonics',
    keyWords: ['six', 'big', 'pigs', 'quick', 'ship'],
    phonicsFocus: '-ig & -ip & sh sound'
  },
  {
    id: 'ph-4',
    english: 'A fox with spotted socks rocks upon a wooden box.',
    korean: '물방울무늬 양말을 신은 여우가 나무 상자 위에서 몸을 흔들어요.',
    category: 'Short O 라임 (-ox, -ock)',
    gradeLevel: 'phonics',
    keyWords: ['fox', 'socks', 'rocks', 'box'],
    phonicsFocus: '-ox & -ock family'
  },
  {
    id: 'ph-5',
    english: 'A funny bug runs in the hot sun with a yellow cup.',
    korean: '재미있는 벌레가 노란 컵을 들고 뜨거운 햇볕 아래를 달려요.',
    category: 'Short U 라임 (-un, -ug, -up)',
    gradeLevel: 'phonics',
    keyWords: ['funny', 'bug', 'runs', 'sun', 'cup'],
    phonicsFocus: '-un & -ug & -up family'
  },
  {
    id: 'ph-6',
    english: 'She sells sea shells by the sunny sea shore.',
    korean: '그녀는 화창한 바닷가에서 조개껍질을 팔아요. (잰말놀이)',
    category: 'S와 Sh 발음 구분 챌린지',
    gradeLevel: 'phonics',
    keyWords: ['sells', 'sea', 'shells', 'shore'],
    phonicsFocus: '/s/ vs /ʃ/ 잰말놀이'
  },

  // 초등 교실 & 일상 영어
  {
    id: 'daily-1',
    english: 'Please open your book to page twenty-five.',
    korean: '교과서 25쪽을 펼쳐주세요.',
    category: '교실 영어',
    gradeLevel: 'daily',
    keyWords: ['open', 'book', 'page', 'twenty-five'],
    phonicsFocus: '정중한 명령문'
  },
  {
    id: 'daily-2',
    english: 'May I drink some cold water, please?',
    korean: '시원한 물 좀 마셔도 될까요?',
    category: '교실 영어',
    gradeLevel: 'daily',
    keyWords: ['drink', 'water', 'please'],
    phonicsFocus: 'May I ~ 허락 구하기'
  },
  {
    id: 'daily-3',
    english: 'Great job, everyone! Let us clap our hands together.',
    korean: '모두 참 잘했어요! 다 함께 박수를 쳐볼까요.',
    category: '칭찬과 격려',
    gradeLevel: 'daily',
    keyWords: ['great', 'job', 'clap', 'hands'],
    phonicsFocus: 'cl- & gr- 이중자음'
  },

  // 짧은 영어 동화 (Short Stories)
  {
    id: 'story-1',
    english: 'Once upon a time, a slow turtle and a fast rabbit had a big race.',
    korean: '옛날 옛적에, 느림보 거북이와 빠른 토끼가 큰 달리기 경주를 했어요.',
    category: '토끼와 거북이',
    gradeLevel: 'story',
    keyWords: ['turtle', 'rabbit', 'race', 'slow', 'fast'],
    phonicsFocus: '이야기 시작 표현'
  },
  {
    id: 'story-2',
    english: 'The rabbit fell asleep under a tree, but the turtle never stopped walking.',
    korean: '토끼는 나무 아래에서 잠이 들었지만, 거북이는 걷는 것을 결코 멈추지 않았어요.',
    category: '토끼와 거북이',
    gradeLevel: 'story',
    keyWords: ['asleep', 'tree', 'stopped', 'walking'],
    phonicsFocus: 'asleep, stopped 과거형'
  },
  {
    id: 'story-3',
    english: 'Finally, the patient turtle crossed the finish line and won the race!',
    korean: '마침내, 끈기 있는 거북이가 결승선을 통과하여 경주에서 승리했어요!',
    category: '토끼와 거북이',
    gradeLevel: 'story',
    keyWords: ['finally', 'patient', 'crossed', 'won'],
    phonicsFocus: '결말과 교훈'
  }
];
