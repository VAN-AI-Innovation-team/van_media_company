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
    body: [
      '코스피는 엔비디아의 분기 실적 호조로 삼성전자와 SK하이닉스 등 반도체주가 강세를 보이면서 상승 출발했다. 장중에는 7,000선에 가까워졌지만 마감 지수는 6,912.37이었다.',
      '한국은행이 기준금리를 2.75%에서 3.00%로 올리자 투자 심리가 신중해지며 장 초반의 상승 폭이 줄었다. 외국인과 기관은 순매수했고 개인은 매도 우위를 보였다.',
      '이번 흐름은 글로벌 AI 투자 기대와 국내 통화정책 변화가 같은 날 증시에 서로 다른 방향으로 작용한 사례로 볼 수 있다.',
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
        body: [
          'The KOSPI opened higher as Nvidia\'s quarterly results lifted major Korean chipmakers including Samsung Electronics and SK Hynix. The index approached 7,000 intraday before closing at 6,912.37.',
          'Early gains narrowed after the Bank of Korea raised its policy rate from 2.75% to 3.00%. Foreign and institutional investors were net buyers, while retail investors sold more than they bought.',
          'The session shows how optimism surrounding global AI investment and a domestic monetary-policy shift can pull the market in different directions on the same day.',
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
    accent: '#6f96b7',
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
    body: [
      '한국은행은 올해 경제성장률 전망치를 기존 2.6%에서 3.3%로 높였다. 이전 전망보다 경기 회복 속도를 더 긍정적으로 본 것이다.',
      '전망 조정의 배경에는 반도체 수출 호조와 정보기술 분야 설비투자, 소비 회복이 있다. 수출과 내수가 함께 성장에 기여할 수 있다는 판단이 반영됐다.',
      '성장률 전망은 이후 수출 흐름과 소비 회복세, 물가와 금리 여건에 따라 달라질 수 있어 관련 지표를 함께 살펴볼 필요가 있다.',
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
        body: [
          'The Bank of Korea raised its annual economic-growth forecast from 2.6% to 3.3%, signaling a more positive view of the pace of recovery than in its previous outlook.',
          'The revision reflects strong semiconductor exports, capital investment in information technology and a recovery in consumer spending. Both external demand and domestic activity are expected to support growth.',
          'The outlook can still change with export momentum, household spending, inflation and interest-rate conditions, so those indicators remain important to watch.',
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
    accent: '#668f91',
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
    body: [
      '국내 연구진은 혈액에 존재하는 세포유리DNA의 특징을 인공지능으로 분석해 대장암 가능성을 가려내는 방법을 시험했다.',
      '채혈만으로 선별 검사를 할 수 있다면 내시경이나 대변 채취에 부담을 느끼는 사람의 검사 접근성을 높이는 데 도움이 될 수 있다.',
      '다만 이 결과만으로 기존 검사를 곧바로 대체한다고 단정하기보다, 추가 임상 검증과 의료진의 판단을 거쳐 활용 범위를 정하는 과정이 필요하다.',
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
        body: [
          'Korean researchers tested a method that uses artificial intelligence to analyze patterns in cell-free DNA found in blood and screen for signs associated with colorectal cancer.',
          'A blood-based screening option could make testing more approachable for people who find colonoscopy or stool collection burdensome.',
          'The result should not be treated as an immediate replacement for existing tests. Further clinical validation and medical judgment are needed to define how the method could be used.',
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
    accent: '#526f8c',
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
    body: [
      '의료혁신위원회는 지역 주민이 일상에서 가장 먼저 만나는 동네 의료기관과 보건소의 역할을 다시 구성하는 방안을 논의했다.',
      '지역마다 다른 인구와 건강 수요를 고려해 재정을 배분하자는 제안도 핵심 의제로 제시됐다. 동일한 기준보다 실제 필요에 맞춘 지원을 강화하자는 취지다.',
      '제안이 현장에서 효과를 내려면 역할 분담과 재정 기준, 지역별 실행 방법을 구체화하는 후속 설계가 중요하다.',
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
        body: [
          'The Medical Innovation Committee discussed redefining the roles of neighborhood healthcare providers and public health centers, which are often the first point of contact for residents.',
          'A central proposal is to allocate funding according to each region\'s population and health needs instead of relying on a uniform standard.',
          'The practical impact will depend on follow-up decisions about responsibilities, funding criteria and how each region puts the model into operation.',
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
    accent: '#6b98ac',
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
    body: [
      '미래 모빌리티 전시 현장에서는 전기차와 로보택시가 단순한 이동 수단을 넘어 소프트웨어 중심의 기기로 진화하는 흐름이 나타났다.',
      '과거에는 배터리 성능과 주행거리가 주요 비교 기준이었다면, 이제는 차량이 주변 상황을 인식하고 판단하는 AI 역량이 중요한 경쟁 요소로 떠오르고 있다.',
      '앞으로의 차별점은 AI와 차량 데이터를 얼마나 안정적으로 연결하고, 실제 도로 환경에서 안전하게 운영하느냐에 달려 있다.',
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
        body: [
          'At a future-mobility exhibition, electric vehicles and robotaxis were presented as software-centered machines rather than simple forms of transportation.',
          'Battery performance and driving range remain important, but the ability to understand road conditions and make decisions through AI is becoming a defining competitive factor.',
          'Future differentiation will depend on how reliably companies connect AI with vehicle data and operate those systems safely in real-world environments.',
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
    accent: '#6f8497',
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
    body: [
      '정부가 마련한 대한민국 AI 윤리원칙은 인공지능의 개발과 활용 과정에서 인간 존엄, 공공선, 지속가능성을 중심 가치로 제시한다.',
      '원칙의 대상에는 개발자와 서비스 제공자뿐 아니라 AI 서비스를 실제로 사용하는 이용자도 포함된다. 기술을 만드는 쪽과 쓰는 쪽이 함께 책임을 나누는 구조다.',
      '이 원칙이 현장에서 작동하려면 앞으로 구체적인 적용 지침과 교육, 책임 기준으로 이어지는 과정이 필요하다.',
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
        body: [
          'Korea\'s AI ethics principles identify human dignity, the public good and sustainability as central values for the development and use of artificial intelligence.',
          'The framework applies not only to developers and service providers but also to the people who use AI services, sharing responsibility across the technology lifecycle.',
          'For the principles to shape real-world behavior, they will need to be followed by practical guidance, education and clear accountability standards.',
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
    accent: '#6487ad',
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

export function getAllArticles(language = 'ko') {
  return articles.map((article) => localizeArticle(article, language))
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
