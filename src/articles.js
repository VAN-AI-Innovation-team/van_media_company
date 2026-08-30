export const ARTICLES_PER_PAGE = 3

// 공개된 실제 기사 원문의 메타데이터만 사용합니다.
// 기사 요약은 원문을 복제하지 않고 이 프로토타입을 위해 새로 작성했습니다.
export const articles = [
  {
    id: 1,
    category: '금융·증시',
    title: '코스피, 엔비디아 호실적에 1%대 상승…금리인상에 상승폭 축소(종합)',
    summary:
      '엔비디아 실적이 국내 반도체주와 코스피를 끌어올렸지만, 한국은행의 기준금리 인상 발표 뒤 상승 폭은 줄었다.',
    highlights: [
      '엔비디아의 호실적이 국내 반도체주와 코스피 상승을 이끌었다.',
      '한국은행의 기준금리 인상 발표 뒤 지수의 상승 폭은 축소됐다.',
    ],
    translations: {
      en: {
        category: 'Finance & Markets',
        title: 'KOSPI gains more than 1% on Nvidia earnings before rate hike trims the rise',
        summary:
          'Strong Nvidia results lifted Korean chip shares and the KOSPI, but gains narrowed after the Bank of Korea announced a rate increase.',
        highlights: [
          'Nvidia\'s strong earnings supported gains in Korean chip stocks and the broader market.',
          'The index gave back part of its rise after the Bank of Korea announced a rate increase.',
        ],
      },
    },
    publishedAt: '2026-08-27',
    publishedLabel: '2026.08.27',
    source: {
      name: '연합뉴스',
      nameEn: 'Yonhap News Agency',
      url: 'https://www.yna.co.kr/view/AKR20260827142951008',
    },
    accent: '#1463ff',
    visual: 'data',
  },
  {
    id: 2,
    category: '경제·거시경제',
    title: '[속보] 한은, 올해 성장률 전망 2.6%→3.3% 상향',
    summary:
      '한국은행이 반도체 수출과 정보기술 설비투자 호조, 소비 회복을 반영해 올해 성장률 전망을 높였다.',
    highlights: [
      '한국은행이 올해 성장률 전망을 2.6%에서 3.3%로 상향했다.',
      '반도체 수출과 정보기술 설비투자, 소비 회복이 전망 조정의 배경으로 제시됐다.',
    ],
    translations: {
      en: {
        category: 'Economy & Macroeconomics',
        title: 'Bank of Korea raises 2026 growth forecast from 2.6% to 3.3%',
        summary:
          'The Bank of Korea raised its annual growth forecast, citing strong semiconductor exports, IT investment and a recovery in consumption.',
        highlights: [
          'The central bank lifted its annual growth forecast from 2.6% to 3.3%.',
          'Semiconductor exports, IT investment and improving consumption were cited as key drivers.',
        ],
      },
    },
    publishedAt: '2026-08-27',
    publishedLabel: '2026.08.27',
    source: {
      name: '한겨레',
      nameEn: 'The Hankyoreh',
      url: 'https://www.hani.co.kr/arti/economy/economy_general/1274867.html',
    },
    accent: '#0b9a93',
    visual: 'climate',
  },
  {
    id: 3,
    category: '의료·과학',
    title: '힘든 내시경·불편한 대변 채취, 안해도 된다?···“대장암 진단, 피만 뽑아도 정확도 높아”',
    summary:
      '국내 연구진이 혈액 속 세포유리DNA를 AI로 분석하는 대장암 선별 방법을 시험해 높은 진단 정확도를 확인했다.',
    highlights: [
      '혈액 속 세포유리DNA를 AI로 분석하는 대장암 선별 방법이 시험됐다.',
      '내시경이나 대변 채취의 부담을 보완할 가능성과 진단 정확도가 핵심이다.',
    ],
    translations: {
      en: {
        category: 'Health & Science',
        title: 'Blood test shows high accuracy for colorectal cancer screening',
        summary:
          'Korean researchers tested an AI method that analyzes cell-free DNA in blood and reported high accuracy in colorectal cancer screening.',
        highlights: [
          'The screening method uses AI to analyze cell-free DNA found in blood.',
          'It could complement procedures that require colonoscopy or stool collection.',
        ],
      },
    },
    publishedAt: '2026-08-27',
    publishedLabel: '2026.08.27',
    source: {
      name: '경향신문',
      nameEn: 'Kyunghyang Shinmun',
      url: 'https://www.khan.co.kr/article/202608271046001',
    },
    accent: '#173a5c',
    visual: 'culture',
  },
  {
    id: 4,
    category: '사회·보건정책',
    title: '의료혁신위, ‘지역·일차의료 혁신’ 추진…“건강 필요도 따라 재정 배분해야”',
    summary:
      '의료혁신위원회가 동네 의료기관과 보건소의 역할을 재편하고 지역별 건강 수요에 따른 재정 배분 방안을 제안했다.',
    highlights: [
      '지역 의료기관과 보건소의 역할을 새롭게 구성하는 방안이 논의됐다.',
      '지역별 건강 필요도에 맞춘 재정 배분이 주요 제안으로 제시됐다.',
    ],
    translations: {
      en: {
        category: 'Society & Health Policy',
        title: 'Medical Innovation Committee proposes regional and primary care reform',
        summary:
          'The committee proposed redefining the roles of local clinics and public health centers while allocating funding according to regional health needs.',
        highlights: [
          'The proposal reorganizes the roles of local medical providers and public health centers.',
          'Funding based on each region\'s health needs is a central recommendation.',
        ],
      },
    },
    publishedAt: '2026-08-27',
    publishedLabel: '2026.08.27',
    source: {
      name: '한겨레',
      nameEn: 'The Hankyoreh',
      url: 'https://www.hani.co.kr/arti/society/health/1274899.html',
    },
    accent: '#328cb7',
    visual: 'education',
  },
  {
    id: 5,
    category: 'AI·산업',
    title: 'AI 두뇌로 달리는 전기차·로보택시… 진화하는 미래 모빌리티',
    summary:
      '미래 모빌리티 전시회를 통해 전기차 경쟁이 주행거리에서 소프트웨어와 자율 판단 능력 중심으로 이동하는 흐름을 살펴본다.',
    highlights: [
      '전기차와 로보택시의 경쟁 기준이 소프트웨어와 AI 역량으로 이동하고 있다.',
      '주행거리뿐 아니라 차량의 자율 판단 능력이 미래 모빌리티의 차별점으로 다뤄졌다.',
    ],
    translations: {
      en: {
        category: 'AI & Industry',
        title: 'EVs and robotaxis powered by AI point to the future of mobility',
        summary:
          'A future-mobility exhibition shows how competition in electric vehicles is shifting from driving range to software and autonomous decision-making.',
        highlights: [
          'Software and AI capability are becoming key competitive factors for EVs and robotaxis.',
          'Autonomous decision-making is emerging alongside driving range as a major differentiator.',
        ],
      },
    },
    publishedAt: '2026-08-26',
    publishedLabel: '2026.08.26',
    source: {
      name: '서울신문',
      nameEn: 'Seoul Shinmun',
      url: 'https://www.seoul.co.kr/news/economy/car/2026/08/26/20260826032004',
    },
    accent: '#55748e',
    visual: 'interview',
  },
  {
    id: 6,
    category: 'AI·정책',
    title: "AI도 '인간 중심'으로…과기부, '대한민국 AI 윤리원칙' 제정",
    summary:
      '정부가 인간 존엄과 공공선, 지속가능성을 중심으로 AI 개발자와 서비스 제공자, 이용자가 함께 따를 원칙을 마련했다.',
    highlights: [
      'AI 윤리원칙은 인간 존엄과 공공선, 지속가능성을 핵심 가치로 제시한다.',
      '개발자와 서비스 제공자뿐 아니라 이용자도 원칙의 적용 대상으로 다뤄진다.',
    ],
    translations: {
      en: {
        category: 'AI & Policy',
        title: 'Korea establishes human-centered principles for AI ethics',
        summary:
          'The government introduced shared AI principles for developers, service providers and users, centered on human dignity, the public good and sustainability.',
        highlights: [
          'The principles identify human dignity, the public good and sustainability as core values.',
          'They apply not only to developers and providers but also to people who use AI services.',
        ],
      },
    },
    publishedAt: '2026-08-24',
    publishedLabel: '2026.08.24',
    source: {
      name: 'SBS 뉴스',
      nameEn: 'SBS News',
      url: 'https://news.sbs.co.kr/news/endPage.do?news_id=N1008719288',
    },
    accent: '#0846c9',
    visual: 'garden',
  },
]

export function localizeArticle(article, language = 'ko') {
  if (!article || language !== 'en') return article

  const translation = article.translations?.en

  return {
    ...article,
    ...translation,
    source: {
      ...article.source,
      name: article.source.nameEn ?? article.source.name,
    },
  }
}

export function getArticlePage({
  page = 1,
  limit = ARTICLES_PER_PAGE,
  language = 'ko',
} = {}) {
  const totalItems = articles.length
  const totalPages = Math.max(1, Math.ceil(totalItems / limit))
  const safePage = Math.min(Math.max(page, 1), totalPages)
  const startIndex = (safePage - 1) * limit

  return {
    items: articles
      .slice(startIndex, startIndex + limit)
      .map((article) => localizeArticle(article, language)),
    page: safePage,
    limit,
    totalItems,
    totalPages,
  }
}

export function getArticleById(articleId, language = 'ko') {
  const article = articles.find((item) => String(item.id) === String(articleId))
  return localizeArticle(article, language)
}

export function getRelatedArticles(articleId, limit = 3, language = 'ko') {
  const currentArticle = articles.find(
    (article) => String(article.id) === String(articleId),
  )
  if (!currentArticle) return []

  const currentTopics = new Set(currentArticle.category.split('·'))

  return articles
    .filter((article) => article.id !== currentArticle.id)
    .map((article) => ({
      article,
      relevance: article.category
        .split('·')
        .filter((topic) => currentTopics.has(topic)).length,
    }))
    .sort((left, right) => right.relevance - left.relevance || right.article.id - left.article.id)
    .slice(0, limit)
    .map(({ article }) => localizeArticle(article, language))
}
