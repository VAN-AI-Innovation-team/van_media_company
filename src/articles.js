export const ARTICLES_PER_PAGE = 3

// VAN NEWS 자체 발행 구조를 확인하기 위한 시연용 기사 데이터입니다.
// 운영 단계에서는 같은 필드 구조를 유지한 채 CMS/API의 승인된 기사 데이터로 교체합니다.
// 내부 검토 화면에서는 각 참고 원문의 언론사와 기자명을 함께 표시합니다.
export const articles = [
  {
    id: 1,
    category: '금융·증시',
    title: 'AI 기대와 금리 인상이 엇갈린 하루…코스피 상승폭 축소',
    summary:
      '엔비디아 실적이 국내 반도체주와 코스피를 끌어올렸지만, 한국은행의 기준금리 인상 발표 뒤 상승 폭은 줄었다.',
    highlights: [
      '엔비디아의 호실적이 국내 반도체주와 코스피 상승을 이끌었다.',
      '한국은행의 기준금리 인상 발표 뒤 지수의 상승 폭은 축소됐다.',
    ],
    body: [
      '코스피는 엔비디아의 실적 발표 이후 국내 반도체 종목에 매수세가 유입되면서 상승 출발했다. 인공지능 산업에 대한 투자 기대가 이어지며 국내 증시에도 긍정적인 분위기가 형성됐다.',
      '삼성전자와 SK하이닉스 등 주요 반도체 종목이 강세를 보이면서 지수는 장중 7,000선에 가까워졌다. 다만 상승 폭을 끝까지 유지하지는 못했고 코스피는 6,912.37로 거래를 마쳤다.',
      '시장 분위기가 달라진 계기는 한국은행의 기준금리 발표였다. 기준금리가 2.75%에서 3.00%로 인상되면서 투자자들이 금리 부담을 다시 반영했고, 장 초반의 상승 폭도 점차 줄어들었다.',
      '수급에서는 외국인과 기관이 순매수에 나선 반면 개인 투자자는 매도 우위를 보였다. 같은 날에도 투자 주체별 판단이 엇갈리면서 지수의 움직임도 제한됐다.',
      '이번 흐름은 글로벌 인공지능 투자 기대와 국내 통화정책 변화가 증시에 서로 다른 방향으로 작용할 수 있음을 보여준다. 앞으로도 반도체 종목의 흐름과 금리 변화가 시장에 어떤 영향을 주는지 함께 살펴볼 필요가 있다.',
    ],
    translations: {
      en: {
        category: 'Finance & Markets',
        title: 'AI optimism and rate hike pull the KOSPI in opposite directions',
        summary:
          'Strong Nvidia results lifted Korean chip shares and the KOSPI, but gains narrowed after the Bank of Korea announced a rate increase.',
        highlights: [
          'Nvidia\'s strong earnings supported gains in Korean chip stocks and the broader market.',
          'The index gave back part of its rise after the Bank of Korea announced a rate increase.',
        ],
        image: {
          alt: 'A market board showing the KOSPI and KOSDAQ at a Hana Bank dealing room',
          caption: 'A market board at Hana Bank headquarters in central Seoul shows the KOSPI and KOSDAQ on August 27.',
          credit: 'Internal review only · Photo: Seo Dae-yeon / Yonhap News Agency',
        },
        body: [
          'The KOSPI opened higher after Nvidia\'s earnings encouraged buying in major Korean semiconductor shares. Continued expectations for investment in artificial intelligence also supported the broader market.',
          'Samsung Electronics, SK Hynix and other leading chip stocks moved higher, helping the index approach the 7,000 level during the session. The market later gave back part of that rise and closed at 6,912.37.',
          'The direction began to change after the Bank of Korea announced its policy decision. A rate increase from 2.75 percent to 3.00 percent brought financing conditions back into focus and reduced the market\'s early gains.',
          'Foreign and institutional investors recorded net purchases, while retail investors sold more than they bought. The different positions taken by investor groups contributed to a more limited move by the index.',
          'The session illustrates how optimism surrounding global AI investment and changes in domestic monetary policy can affect the same market in opposing ways. Semiconductor performance and interest-rate conditions remain important factors to monitor.',
        ],
      },
    },
    publishedAt: '2026-08-27',
    publishedLabel: '2026.08.27',
    author: {
      id: 'kim-yoo-hyang',
      name: '연합뉴스 · 김유향 기자',
      nameEn: 'Yonhap News Agency · Kim Yoo-hyang',
    },
    image: {
      src: '/images/internal-review/01-kospi.jpg',
      alt: '서울 중구 하나은행 본점 딜링룸 현황판에 표시된 코스피와 코스닥 종가',
      caption: '27일 서울 중구 하나은행 본점 딜링룸 현황판에 코스피와 코스닥 지수가 표시돼 있다.',
      credit: '내부 검토용 · 사진: 서대연 기자 / 연합뉴스',
      width: 1200,
      height: 799,
      objectPosition: '50% 50%',
      internalReviewOnly: true,
      sourceUrl: 'https://www.yna.co.kr/view/AKR20260827142951008',
    },
    accent: '#6f96b7',
    visual: 'data',
  },
  {
    id: 2,
    category: '경제·거시경제',
    title: '반도체·소비 회복 반영…성장률 전망 3.3%로 상향',
    summary:
      '한국은행이 반도체 수출과 정보기술 설비투자 호조, 소비 회복을 반영해 올해 성장률 전망을 높였다.',
    highlights: [
      '한국은행이 올해 성장률 전망을 2.6%에서 3.3%로 상향했다.',
      '반도체 수출과 정보기술 설비투자, 소비 회복이 전망 조정의 배경으로 제시됐다.',
    ],
    body: [
      '한국은행은 올해 경제성장률 전망치를 기존 2.6%에서 3.3%로 높였다. 이번 조정은 이전 전망보다 국내 경제의 회복 속도를 긍정적으로 평가했다는 의미다.',
      '전망 상향의 주요 배경으로는 반도체 수출의 강한 흐름이 제시됐다. 반도체 수요가 이어지면서 수출이 전체 성장에 기여할 수 있다는 판단이 반영됐다.',
      '정보기술 분야의 설비투자도 성장 전망을 높인 요인이다. 관련 투자가 이어질 경우 생산과 산업 활동에도 긍정적인 영향을 줄 수 있다.',
      '소비 회복 역시 이번 전망에 포함됐다. 수출과 내수가 함께 개선되면 경제성장을 지지하는 기반이 이전보다 넓어질 수 있다.',
      '다만 실제 성장 흐름은 앞으로의 수출 추세와 가계 소비, 물가, 금리 여건에 따라 달라질 수 있다. 전망치뿐 아니라 각 지표의 움직임을 지속해서 확인할 필요가 있다.',
    ],
    translations: {
      en: {
        category: 'Economy & Macroeconomics',
        title: 'Growth forecast raised to 3.3% on chip exports and consumption recovery',
        summary:
          'The Bank of Korea raised its annual growth forecast, citing strong semiconductor exports, IT investment and a recovery in consumption.',
        highlights: [
          'The central bank lifted its annual growth forecast from 2.6% to 3.3%.',
          'Semiconductor exports, IT investment and improving consumption were cited as key drivers.',
        ],
        image: {
          alt: 'A semiconductor manufacturing line inside a cleanroom',
          caption: 'A semiconductor production line.',
          credit: 'Internal review only · Photo provided by Samsung Electronics / The Hankyoreh',
        },
        body: [
          'The Bank of Korea raised its annual economic-growth forecast from 2.6 percent to 3.3 percent. The revision indicates a more positive assessment of the recovery than in the previous outlook.',
          'Strong semiconductor exports were identified as a major reason for the change. Continued demand for chips is expected to allow exports to support overall economic growth.',
          'Capital investment in information technology also contributed to the revised projection. Sustained investment in the sector could support production and broader industrial activity.',
          'A recovery in consumer spending was included in the outlook as well. Improvement in both external demand and domestic activity would give growth a broader foundation.',
          'Actual conditions may still vary with export momentum, household spending, inflation and interest rates. These indicators will need to be monitored alongside the headline forecast.',
        ],
      },
    },
    publishedAt: '2026-08-27',
    publishedLabel: '2026.08.27',
    author: {
      id: 'kim-young-bae',
      name: '한겨레 · 김영배 기자',
      nameEn: 'The Hankyoreh · Kim Young-bae',
    },
    image: {
      src: '/images/internal-review/02-growth.webp',
      alt: '클린룸 내부의 반도체 생산 라인',
      caption: '반도체 생산 라인.',
      credit: '내부 검토용 · 사진: 삼성전자 제공 / 한겨레 원문',
      width: 970,
      height: 646,
      objectPosition: '50% 50%',
      internalReviewOnly: true,
      sourceUrl: 'https://www.hani.co.kr/arti/economy/economy_general/1274867.html',
    },
    accent: '#668f91',
    visual: 'climate',
  },
  {
    id: 3,
    category: '의료·과학',
    title: '혈액 기반 대장암 선별 연구, 접근성과 검증 과제 함께 제시',
    summary:
      '국내 연구진이 혈액 속 세포유리DNA를 AI로 분석하는 대장암 선별 방법을 시험해 높은 진단 정확도를 확인했다.',
    highlights: [
      '혈액 속 세포유리DNA를 AI로 분석하는 대장암 선별 방법이 시험됐다.',
      '내시경이나 대변 채취의 부담을 보완할 가능성과 진단 정확도가 핵심이다.',
    ],
    body: [
      '국내 연구진이 혈액 속 세포유리 DNA를 인공지능으로 분석해 대장암 가능성을 선별하는 방법을 시험했다. 연구에서는 혈액에서 확인되는 DNA의 특징을 분석 대상으로 활용했다.',
      '인공지능은 분석 과정에서 나타나는 패턴을 구분하고 대장암과 관련된 신호를 찾는 데 사용됐다. 연구진은 시험 결과에서 높은 수준의 진단 정확도를 확인했다.',
      '혈액을 이용하는 방식은 대장내시경이나 대변 채취에 부담을 느끼는 사람에게 새로운 검사 선택지가 될 가능성이 있다. 검사 접근성을 높이는 보완 수단으로 활용될 수 있다는 점도 주목된다.',
      '다만 이번 결과만으로 기존 검사를 곧바로 대체할 수 있다고 판단하기는 어렵다. 실제 의료 현장에서 적용할 수 있는 범위와 조건을 정하려면 추가적인 임상 검증이 필요하다.',
      '검사 결과를 해석하고 다음 검사나 치료 여부를 정하는 과정에는 의료진의 판단도 필요하다. 향후 연구에서는 정확도와 활용 가능성을 함께 확인하는 과정이 중요하다.',
    ],
    translations: {
      en: {
        category: 'Health & Science',
        title: 'Blood-based colorectal cancer screening study highlights access and validation',
        summary:
          'Korean researchers tested an AI method that analyzes cell-free DNA in blood and reported high accuracy in colorectal cancer screening.',
        highlights: [
          'The screening method uses AI to analyze cell-free DNA found in blood.',
          'It could complement procedures that require colonoscopy or stool collection.',
        ],
        image: {
          alt: 'A diagram showing the progression from a normal colon to advanced colorectal cancer',
          caption: 'Stages in the development and progression of colorectal cancer.',
          credit: 'Internal review only · Source: Korean Society of Gastrointestinal Endoscopy / Kyunghyang Shinmun',
        },
        body: [
          'Korean researchers tested a method that uses artificial intelligence to analyze cell-free DNA in blood and screen for signs associated with colorectal cancer. The approach examines characteristics found in DNA circulating in the blood.',
          'AI was used to distinguish patterns in the analysis and identify signals related to colorectal cancer. The researchers reported a high level of diagnostic accuracy in the test.',
          'A blood-based approach could offer another option for people who find colonoscopy or stool collection burdensome. It may also serve as a complementary method that makes screening more approachable.',
          'The result alone does not mean that existing tests can be replaced immediately. Additional clinical validation is needed to determine the conditions and settings in which the method could be used.',
          'Medical judgment will also remain necessary when interpreting a result and deciding whether further testing or treatment is appropriate. Future research will need to examine both accuracy and practical use.',
        ],
      },
    },
    publishedAt: '2026-08-27',
    publishedLabel: '2026.08.27',
    author: {
      id: 'kim-tae-hoon',
      name: '경향신문 · 김태훈 기자',
      nameEn: 'Kyunghyang Shinmun · Kim Tae-hoon',
    },
    image: {
      src: '/images/internal-review/03-blood-screening.png',
      alt: '정상 대장에서 용종과 대장암으로 진행되는 단계를 보여주는 자료 이미지',
      caption: '대장암의 단계적 생성 및 진행 과정.',
      credit: '내부 검토용 · 자료: 대한위대장내시경학회 / 경향신문 원문',
      width: 725,
      height: 126,
      objectPosition: '50% 50%',
      cardFit: 'contain',
      internalReviewOnly: true,
      sourceUrl: 'https://www.khan.co.kr/article/202608271046001',
    },
    accent: '#526f8c',
    visual: 'culture',
  },
  {
    id: 4,
    category: '사회·보건정책',
    title: '지역 중심 의료체계 논의…재정 배분 기준이 핵심',
    summary:
      '의료혁신위원회가 동네 의료기관과 보건소의 역할을 재편하고 지역별 건강 수요에 따른 재정 배분 방안을 제안했다.',
    highlights: [
      '지역 의료기관과 보건소의 역할을 새롭게 구성하는 방안이 논의됐다.',
      '지역별 건강 필요도에 맞춘 재정 배분이 주요 제안으로 제시됐다.',
    ],
    body: [
      '의료혁신위원회는 지역 주민이 일상에서 먼저 만나는 동네 의료기관과 보건소의 역할을 새롭게 구성하는 방안을 논의했다. 지역 의료 체계 안에서 각 기관이 맡을 기능을 보다 분명하게 정하는 것이 핵심이다.',
      '동네 의료기관과 보건소는 주민과 가까운 곳에서 의료와 건강 서비스를 제공한다. 위원회는 두 기관의 역할이 효과적으로 연결될 수 있는 운영 방향을 검토했다.',
      '재정은 모든 지역에 같은 기준으로 배분하기보다 지역별 인구와 건강 수요를 고려해 지원하는 방안이 제안됐다. 필요한 곳에 지원을 집중하자는 취지가 반영된 내용이다.',
      '이러한 구조가 실제로 작동하려면 각 기관의 책임과 협력 범위를 구체적으로 정해야 한다. 재정 배분 기준도 지역에서 적용할 수 있을 만큼 명확하게 마련될 필요가 있다.',
      '제안의 효과는 후속 정책과 지역별 실행 방식에 따라 달라질 수 있다. 현장의 여건을 반영하면서 제도를 지속적으로 조정하는 과정이 중요하다.',
    ],
    translations: {
      en: {
        category: 'Society & Health Policy',
        title: 'Regional healthcare reform debate centers on funding standards',
        summary:
          'The committee proposed redefining the roles of local clinics and public health centers while allocating funding according to regional health needs.',
        highlights: [
          'The proposal reorganizes the roles of local medical providers and public health centers.',
          'Funding based on each region\'s health needs is a central recommendation.',
        ],
        image: {
          alt: 'A doctor consulting with a patient in a clinic',
          caption: 'A representative image of a primary-care consultation.',
          credit: 'Internal review only · Photo: Getty Images Bank / The Hankyoreh',
        },
        body: [
          'The Medical Innovation Committee discussed a new structure for the roles of neighborhood healthcare providers and public health centers. A central goal is to define more clearly what each organization should do within a regional health system.',
          'Local providers and public health centers deliver medical and health services close to residents. The committee examined how their responsibilities could be connected more effectively.',
          'The proposal also calls for funding to reflect each region\'s population and health needs instead of applying a single standard everywhere. Its purpose is to direct greater support to areas with greater needs.',
          'For the structure to work in practice, the responsibilities of each organization and the scope of cooperation will need to be specified. Funding criteria must also be clear enough for regional implementation.',
          'The impact of the proposal will depend on follow-up policy decisions and how individual regions operate the model. Continued adjustment based on local conditions will be important.',
        ],
      },
    },
    publishedAt: '2026-08-27',
    publishedLabel: '2026.08.27',
    author: {
      id: 'heo-yoon-hee',
      name: '한겨레 · 허윤희 기자',
      nameEn: 'The Hankyoreh · Heo Yoon-hee',
    },
    image: {
      src: '/images/internal-review/04-primary-care.webp',
      alt: '의료기관에서 의사가 환자와 상담하는 모습',
      caption: '지역·일차의료 진료를 표현한 자료 이미지.',
      credit: '내부 검토용 · 사진: 게티이미지뱅크 / 한겨레 원문',
      width: 970,
      height: 646,
      objectPosition: '50% 50%',
      internalReviewOnly: true,
      sourceUrl: 'https://www.hani.co.kr/arti/society/health/1274899.html',
    },
    accent: '#6b98ac',
    visual: 'education',
  },
  {
    id: 5,
    category: 'AI·산업',
    title: '주행거리 너머 소프트웨어 경쟁…AI가 바꾸는 미래 모빌리티',
    summary:
      '미래 모빌리티 전시회를 통해 전기차 경쟁이 주행거리에서 소프트웨어와 자율 판단 능력 중심으로 이동하는 흐름을 살펴본다.',
    highlights: [
      '전기차와 로보택시의 경쟁 기준이 소프트웨어와 AI 역량으로 이동하고 있다.',
      '주행거리뿐 아니라 차량의 자율 판단 능력이 미래 모빌리티의 차별점으로 다뤄졌다.',
    ],
    body: [
      '미래 모빌리티 전시에서는 전기차와 로보택시가 단순한 이동 수단을 넘어 소프트웨어 중심의 기기로 변화하는 흐름이 나타났다. 차량의 성능을 평가하는 기준도 함께 넓어지고 있다.',
      '배터리 성능과 주행거리는 여전히 전기차 경쟁에서 중요한 요소다. 그러나 하드웨어 성능만으로 차량의 차별성을 설명하기는 어려워지고 있다.',
      '차량이 주변 도로 상황을 인식하고 스스로 판단하는 인공지능 역량이 새로운 경쟁 요소로 떠오르고 있다. 이러한 변화는 전기차뿐 아니라 로보택시의 발전 방향에도 영향을 준다.',
      '인공지능이 제대로 작동하려면 차량에서 생성되는 데이터와 소프트웨어가 안정적으로 연결돼야 한다. 실제 도로 환경에서 판단 기능을 안전하게 운영하는 능력도 중요하다.',
      '앞으로의 모빌리티 경쟁은 주행거리와 함께 소프트웨어 완성도와 자율 판단 능력을 중심으로 전개될 가능성이 있다. 기술을 실제 환경에서 얼마나 신뢰할 수 있게 구현하는지가 차별점이 될 수 있다.',
    ],
    translations: {
      en: {
        category: 'AI & Industry',
        title: 'Beyond driving range: AI reshapes the future of mobility',
        summary:
          'A future-mobility exhibition shows how competition in electric vehicles is shifting from driving range to software and autonomous decision-making.',
        highlights: [
          'Software and AI capability are becoming key competitive factors for EVs and robotaxis.',
          'Autonomous decision-making is emerging alongside driving range as a major differentiator.',
        ],
        image: {
          alt: 'A personal aircraft displayed at the 2026 Future Mobility Week exhibition',
          caption: 'Visitors view an advanced personal aircraft at 2026 Future Mobility Week at COEX in Seoul.',
          credit: 'Internal review only · Photo: Do Jun-seok / Seoul Shinmun',
        },
        body: [
          'A future-mobility exhibition showed electric vehicles and robotaxis evolving beyond transportation devices into software-centered machines. The standards used to evaluate vehicle performance are expanding as well.',
          'Battery performance and driving range remain important in electric-vehicle competition. Hardware specifications alone, however, are becoming less sufficient to explain how one vehicle differs from another.',
          'AI systems that can understand road conditions and make autonomous decisions are emerging as another competitive factor. This shift is shaping the development of both electric vehicles and robotaxis.',
          'Reliable operation requires vehicle data and software to remain closely connected. The ability to run decision-making systems safely in real-world road environments is equally important.',
          'Future mobility competition is likely to focus on software quality and autonomous decision-making alongside driving range. A key distinction will be how reliably companies can apply these capabilities outside an exhibition setting.',
        ],
      },
    },
    publishedAt: '2026-08-26',
    publishedLabel: '2026.08.26',
    author: {
      id: 'heo-baek-yoon',
      name: '서울신문 · 허백윤 기자',
      nameEn: 'Seoul Shinmun · Heo Baek-yoon',
    },
    image: {
      src: '/images/internal-review/05-mobility.jpg',
      alt: '2026 퓨처 모빌리티 위크 전시장에 전시된 첨단 개인용 항공기',
      caption: '서울 코엑스에서 열린 2026 퓨처 모빌리티 위크에서 관람객들이 첨단 개인용 항공기를 살펴보고 있다.',
      credit: '내부 검토용 · 사진: 도준석 전문기자 / 서울신문',
      width: 1200,
      height: 779,
      objectPosition: '50% 50%',
      internalReviewOnly: true,
      sourceUrl: 'https://www.seoul.co.kr/news/economy/car/2026/08/26/20260826032004',
    },
    accent: '#6f8497',
    visual: 'interview',
  },
  {
    id: 6,
    category: 'AI·정책',
    title: '사람 중심 AI 원칙 마련…현장 적용 기준이 다음 과제',
    summary:
      '정부가 인간 존엄과 공공선, 지속가능성을 중심으로 AI 개발자와 서비스 제공자, 이용자가 함께 따를 원칙을 마련했다.',
    highlights: [
      'AI 윤리원칙은 인간 존엄과 공공선, 지속가능성을 핵심 가치로 제시한다.',
      '개발자와 서비스 제공자뿐 아니라 이용자도 원칙의 적용 대상으로 다뤄진다.',
    ],
    body: [
      '정부가 마련한 대한민국 인공지능 윤리원칙은 인공지능의 개발과 이용 과정에서 지켜야 할 공통 가치를 제시한다. 기술의 성능뿐 아니라 기술이 사람과 사회에 미치는 영향도 함께 고려하는 내용이다.',
      '원칙은 인간 존엄과 공공선, 지속가능성을 핵심 가치로 삼는다. 인공지능이 사람을 중심에 두고 사회 전체에 도움이 되는 방향으로 활용돼야 한다는 취지를 담고 있다.',
      '적용 대상은 인공지능을 만드는 개발자와 서비스를 제공하는 사업자에 한정되지 않는다. 인공지능 서비스를 실제로 이용하는 사람도 원칙을 함께 실천해야 할 주체로 포함된다.',
      '이는 인공지능의 기획과 개발, 제공, 이용에 이르는 과정에서 책임을 나누는 구조다. 어느 한쪽만의 노력으로는 윤리적인 활용 환경을 만들기 어렵다는 관점이 반영됐다.',
      '윤리원칙이 현장에서 작동하려면 구체적인 적용 지침과 교육, 책임 기준으로 이어져야 한다. 앞으로는 각 주체가 원칙을 실제 업무와 이용 과정에 적용할 수 있는 방법을 마련하는 일이 중요하다.',
    ],
    translations: {
      en: {
        category: 'AI & Policy',
        title: 'Human-centered AI principles set the stage for practical guidelines',
        summary:
          'The government introduced shared AI principles for developers, service providers and users, centered on human dignity, the public good and sustainability.',
        highlights: [
          'The principles identify human dignity, the public good and sustainability as core values.',
          'They apply not only to developers and providers but also to people who use AI services.',
        ],
        image: {
          alt: 'Deputy Prime Minister Bae Kyung-hoon speaking into a microphone',
          caption: 'Deputy Prime Minister Bae Kyung-hoon.',
          credit: 'Internal review only · Photo provided by the Ministry of Science and ICT and Yonhap / SBS News',
        },
        body: [
          'Korea\'s AI ethics principles present shared values for the development and use of artificial intelligence. The framework considers not only technical performance but also the effects of technology on people and society.',
          'Human dignity, the public good and sustainability are identified as its central values. The principles call for AI to remain human-centered and to be used in ways that benefit society.',
          'The framework is not limited to developers who build AI or service providers that make it available. People who use AI services are also included among those expected to follow the principles.',
          'Responsibility is therefore shared across planning, development, delivery and use. This structure reflects the view that an ethical environment cannot be created by only one participant in the technology lifecycle.',
          'For the principles to influence real behavior, they will need to lead to practical guidance, education and clear accountability standards. The next task is to help each participant apply them in everyday development and use.',
        ],
      },
    },
    publishedAt: '2026-08-24',
    publishedLabel: '2026.08.24',
    author: {
      id: 'lee-tae-kwon',
      name: 'SBS 뉴스 · 이태권 기자',
      nameEn: 'SBS News · Lee Tae-kwon',
    },
    image: {
      src: '/images/internal-review/06-ai-ethics.jpg',
      alt: '마이크를 들고 발언하는 배경훈 부총리',
      caption: '배경훈 부총리.',
      credit: '내부 검토용 · 사진: 과학기술정보통신부 제공·연합뉴스 / SBS 원문',
      width: 1280,
      height: 720,
      objectPosition: '45% 42%',
      internalReviewOnly: true,
      sourceUrl: 'https://news.sbs.co.kr/news/endPage.do?news_id=N1008719288',
    },
    accent: '#6487ad',
    visual: 'garden',
  },
]

export function localizeArticle(article, language = 'ko') {
  if (!article || language !== 'en') return article

  const translation = article.translations?.en
  const translatedInlineImages = new Map(
    (translation?.inlineImages ?? []).map((image) => [image.id, image]),
  )

  return {
    ...article,
    ...translation,
    author: {
      ...article.author,
      name: article.author.nameEn ?? article.author.name,
    },
    image: article.image
      ? {
          ...article.image,
          ...translation?.image,
        }
      : undefined,
    inlineImages: article.inlineImages?.map((image) => ({
      ...image,
      ...translatedInlineImages.get(image.id),
    })),
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
