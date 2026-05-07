-- Seed data: idempotent (only inserts if empty)
-- Merchants (1 brand : 1 대표 매장, 데모용 더미)
MERGE INTO merchants (brand_name, store_name, representative_name, business_reg_no, address, phone) KEY(brand_name) VALUES
  ('스타벅스',     '스타벅스 강남R점',         '송호섭',   '220-81-62517', '서울특별시 강남구 강남대로 390',           '1522-3232'),
  ('메가커피',     '메가커피 역삼점',          '김대영',   '110-86-18342', '서울특별시 강남구 역삼로 123',             '02-562-9000'),
  ('컴포즈커피',   '컴포즈커피 선릉점',        '양재석',   '617-86-13245', '서울특별시 강남구 테헤란로 142',           '051-507-3334'),
  ('CU',           'CU 강남대로점',            '이건준',   '110-81-25530', '서울특별시 강남구 테헤란로 152',           '1577-7770'),
  ('GS25',         'GS25 역삼GS타워점',        '오진석',   '104-81-46985', '서울특별시 강남구 논현로 508',             '1577-0001'),
  ('세븐일레븐',   '세븐일레븐 선릉점',        '김경규',   '105-81-25118', '서울특별시 강남구 봉은사로 302',           '02-3459-9000'),
  ('이마트24',     '이마트24 강남점',          '김성영',   '107-86-43773', '서울특별시 강남구 역삼로 165',             '1644-8866'),
  ('BHC',          'BHC 강남역점',             '박현종',   '120-86-55670', '서울특별시 강남구 강남대로 396',           '1588-8504'),
  ('교촌치킨',     '교촌치킨 강남직영점',      '소진세',   '210-81-29942', '서울특별시 강남구 강남대로 358',           '1577-1577'),
  ('롯데리아',     '롯데리아 강남R점',         '차우철',   '215-81-37755', '서울특별시 강남구 강남대로 422',           '1600-9999'),
  ('맥도날드',     '맥도날드 강남R점',         '김기원',   '120-81-28933', '서울특별시 강남구 강남대로 426',           '1600-5252'),
  ('버거킹',       '버거킹 강남역점',          '문영주',   '120-86-12521', '서울특별시 강남구 강남대로 354',           '1577-3633'),
  ('배달의민족',   '우아한형제들',             '이국환',   '120-87-15278', '서울특별시 송파구 위례성대로 2',           '1600-0987'),
  ('쿠팡이츠',     '쿠팡이츠서비스',           '강한승',   '120-88-00767', '서울특별시 송파구 송파대로 570',           '1577-7011'),
  ('요기요',       '위대한상상',               '서성원',   '101-86-50637', '서울특별시 서초구 강남대로 343',           '1661-5400'),
  ('무신사',       '무신사 홍대점',            '한문일',   '214-88-04734', '서울특별시 마포구 양화로 156',             '1644-1252'),
  ('ABC마트',      'ABC마트 강남R점',          '김영남',   '113-81-49123', '서울특별시 강남구 강남대로 414',           '1577-7950'),
  ('11번가',       '11번가',                   '하형일',   '101-86-87501', '서울특별시 중구 한강대로 416',             '1599-0110'),
  ('올리브영',     '올리브영 강남본점',        '구창근',   '119-81-21515', '서울특별시 강남구 강남대로 390',           '02-6005-2299'),
  ('아리따움',     '아리따움 강남점',          '김승환',   '120-81-44818', '서울특별시 강남구 강남대로 396',           '02-558-7223'),
  ('시코르',       '시코르 강남역점',          '문영표',   '110-81-32831', '서울특별시 강남구 강남대로 426',           '02-2050-9100'),
  ('닥터자르트',   '닥터자르트 강남플래그십',  '김진우',   '215-87-13821', '서울특별시 강남구 강남대로 396',           '02-540-5340'),
  ('CGV',          'CGV 강남',                 '허민회',   '104-81-45690', '서울특별시 강남구 강남대로 438',           '1544-1122'),
  ('롯데시네마',   '롯데시네마 월드타워',      '박원석',   '215-81-39137', '서울특별시 송파구 올림픽로 300',           '1544-8855'),
  ('메가박스',     '메가박스 코엑스',          '김진선',   '101-81-40979', '서울특별시 강남구 봉은사로 524',           '1544-0070'),
  ('GS칼텍스',     'GS칼텍스 강남주유소',      '허세홍',   '104-81-04754', '서울특별시 강남구 영동대로 318',           '02-553-2299'),
  ('SK에너지',     'SK에너지 역삼점',          '오종훈',   '101-81-87481', '서울특별시 강남구 테헤란로 141',           '1599-3636'),
  ('메디힐',       '메디힐 명동점',            '박명관',   '214-87-19542', '서울특별시 중구 명동길 14',                '02-779-0070');

-- Categories
MERGE INTO categories (id, name, slug, icon_emoji, sort_order) KEY(id) VALUES
  (1, '편의점',  'cvs',     '🏪', 1),
  (2, '카페',    'cafe',    '☕', 2),
  (3, '외식',    'dining',  '🍽️', 3),
  (4, '배달',    'delivery','🛵', 4),
  (5, '쇼핑',    'shopping','🛍️', 5),
  (6, '뷰티',    'beauty',  '💄', 6),
  (7, '영화',    'movie',   '🎬', 7),
  (8, '주유',    'fuel',    '⛽', 8);

-- Deals (35 items) — discount rate 2% ~ 7%
MERGE INTO deals (id, title, brand_name, description, category_id, original_price, discounted_price, image_url, stock_quantity, sold_count, valid_from, valid_until, status) KEY(id) VALUES
  (1,  '아메리카노 Tall',     '스타벅스',   '스타벅스 아메리카노 톨 사이즈 한정 할인',                     2, 4500,  4280, 'https://placehold.co/600x400/006241/ffffff?text=STARBUCKS&font=montserrat',  500, 312, DATEADD('DAY', -1, CURRENT_TIMESTAMP), DATEADD('DAY', 6, CURRENT_TIMESTAMP), 'ACTIVE'),
  (2,  '카페라떼 Tall',       '스타벅스',   '부드러운 라떼 한정',                                          2, 5000,  4750, 'https://placehold.co/600x400/006241/ffffff?text=STARBUCKS&font=montserrat',  300, 220, DATEADD('DAY', -1, CURRENT_TIMESTAMP), DATEADD('DAY', 6, CURRENT_TIMESTAMP), 'ACTIVE'),
  (3,  '아이스 아메리카노',   '메가커피',   '메가커피 ICE 아메리카노',                                     2, 2000,  1940, 'https://placehold.co/600x400/FFD700/000000?text=MEGA+COFFEE&font=montserrat',  800,  90, DATEADD('DAY', -1, CURRENT_TIMESTAMP), DATEADD('DAY', 9, CURRENT_TIMESTAMP), 'ACTIVE'),
  (4,  '카푸치노',             '컴포즈커피', '풍성한 거품 카푸치노',                                        2, 3500,  3360, 'https://placehold.co/600x400/5B3A29/ffffff?text=COMPOSE&font=montserrat',  400,  60, DATEADD('DAY', -1, CURRENT_TIMESTAMP), DATEADD('DAY', 9, CURRENT_TIMESTAMP), 'ACTIVE'),
  (5,  '도시락 모듬세트',       'CU',         '신선한 모듬 도시락 세트',                                   1, 5500,  5220, 'https://placehold.co/600x400/5B2A8C/ffffff?text=CU&font=montserrat',  600, 510, DATEADD('DAY', -2, CURRENT_TIMESTAMP), DATEADD('DAY', 1, CURRENT_TIMESTAMP), 'ACTIVE'),
  (6,  '삼각김밥 2+1',          'GS25',       '삼각김밥 2+1 행사',                                          1, 3000,  2910, 'https://placehold.co/600x400/00529C/ffffff?text=GS25&font=montserrat', 1200, 700, DATEADD('DAY', -1, CURRENT_TIMESTAMP), DATEADD('DAY', 5, CURRENT_TIMESTAMP), 'ACTIVE'),
  (7,  '하이볼 칵테일',         '세븐일레븐', '편의점 하이볼 한정 출시',                                    1, 4900,  4610, 'https://placehold.co/600x400/FF6900/ffffff?text=7-ELEVEN&font=montserrat',  300, 260, DATEADD('DAY', -1, CURRENT_TIMESTAMP), DATEADD('HOUR', 12, CURRENT_TIMESTAMP), 'ACTIVE'),
  (8,  '도넛 6개입',            '이마트24',   '바삭달콤 도넛 박스',                                          1, 6900,  6560, 'https://placehold.co/600x400/FFD800/000000?text=emart24&font=montserrat',  500,  80, DATEADD('DAY', -1, CURRENT_TIMESTAMP), DATEADD('DAY', 4, CURRENT_TIMESTAMP), 'ACTIVE'),
  (9,  '치즈볼 6개',            'BHC',        'BHC 치즈볼 단품',                                            3, 4900,  4700, 'https://placehold.co/600x400/E60012/ffffff?text=BHC&font=montserrat',  300, 100, DATEADD('DAY', -1, CURRENT_TIMESTAMP), DATEADD('DAY', 3, CURRENT_TIMESTAMP), 'ACTIVE'),
  (10, '뿌링클 콤보',           'BHC',        '치킨 + 콜라 1.25L',                                          3, 24000, 22320, 'https://placehold.co/600x400/E60012/ffffff?text=BHC&font=montserrat',  150,  90, DATEADD('DAY', -1, CURRENT_TIMESTAMP), DATEADD('DAY', 4, CURRENT_TIMESTAMP), 'ACTIVE'),
  (11, '핫크리스피 한마리',      '교촌치킨',   '교촌 시그니처',                                              3, 23000, 21390, 'https://placehold.co/600x400/DA291C/ffffff?text=KyoChon&font=montserrat',  120,  40, DATEADD('DAY', -1, CURRENT_TIMESTAMP), DATEADD('DAY', 5, CURRENT_TIMESTAMP), 'ACTIVE'),
  (12, '불고기 버거 세트',       '롯데리아',   '버거+감자+콜라',                                              3, 7900,  7510, 'https://placehold.co/600x400/ED1C24/ffffff?text=LOTTERIA&font=montserrat',  500, 220, DATEADD('DAY', -1, CURRENT_TIMESTAMP), DATEADD('DAY', 7, CURRENT_TIMESTAMP), 'ACTIVE'),
  (13, '빅맥 세트',              '맥도날드',   '빅맥+감자+콜라',                                              3, 8500,  7990, 'https://placehold.co/600x400/FFC72C/000000?text=McDonalds&font=montserrat',  600, 410, DATEADD('DAY', -1, CURRENT_TIMESTAMP), DATEADD('DAY', 7, CURRENT_TIMESTAMP), 'ACTIVE'),
  (14, '와퍼 세트',              '버거킹',     '와퍼+감자+콜라',                                              3, 9500,  8930, 'https://placehold.co/600x400/FF8732/ffffff?text=Burger+King&font=montserrat',  500, 250, DATEADD('DAY', -1, CURRENT_TIMESTAMP), DATEADD('DAY', 7, CURRENT_TIMESTAMP), 'ACTIVE'),
  (15, '배달비 90원 할인 쿠폰',  '배달의민족', '5,000원 이상 주문 시',                                        4, 3000,  2910, 'https://placehold.co/600x400/2AC1BC/ffffff?text=BAEMIN&font=montserrat', 2000, 1700, DATEADD('DAY', -1, CURRENT_TIMESTAMP), DATEADD('DAY', 14, CURRENT_TIMESTAMP), 'ACTIVE'),
  (16, '90원 할인 쿠폰',         '쿠팡이츠',   '15,000원 이상 주문 시',                                       4, 3000,  2910, 'https://placehold.co/600x400/FF5252/ffffff?text=Coupang+Eats&font=montserrat', 1000,  650, DATEADD('DAY', -1, CURRENT_TIMESTAMP), DATEADD('DAY', 14, CURRENT_TIMESTAMP), 'ACTIVE'),
  (17, '50원 할인 쿠폰',         '요기요',     '12,000원 이상 주문 시',                                       4, 2500,  2450, 'https://placehold.co/600x400/FA0050/ffffff?text=YOGIYO&font=montserrat',  800,  300, DATEADD('DAY', -1, CURRENT_TIMESTAMP), DATEADD('DAY', 14, CURRENT_TIMESTAMP), 'ACTIVE'),
  (18, '의류 할인 쿠폰 (5%)',    '무신사',     '20,000원 이상 결제 시',                                       5, 6000,  5700, 'https://placehold.co/600x400/000000/ffffff?text=MUSINSA&font=montserrat',  500,  120, DATEADD('DAY', -1, CURRENT_TIMESTAMP), DATEADD('DAY', 9, CURRENT_TIMESTAMP), 'ACTIVE'),
  (19, '신발 4% 즉시할인',       'ABC마트',    '5만원 이상 매장 결제 시',                                     5, 5000,  4800, 'https://placehold.co/600x400/002D62/ffffff?text=ABC-MART&font=montserrat',  300,   90, DATEADD('DAY', -1, CURRENT_TIMESTAMP), DATEADD('DAY', 9, CURRENT_TIMESTAMP), 'ACTIVE'),
  (20, '200원 즉시할인',         '11번가',     '3만원 이상 결제 시',                                          5, 5000,  4800, 'https://placehold.co/600x400/F43142/ffffff?text=11STREET&font=montserrat',  600,  300, DATEADD('DAY', -1, CURRENT_TIMESTAMP), DATEADD('DAY', 14, CURRENT_TIMESTAMP), 'ACTIVE'),
  (21, '립밤 6% 할인',           '올리브영',   '인기 립케어 한정 할인',                                       6, 9900,  9310, 'https://placehold.co/600x400/00C73C/ffffff?text=OLIVE+YOUNG&font=montserrat',  400,  170, DATEADD('DAY', -1, CURRENT_TIMESTAMP), DATEADD('DAY', 5, CURRENT_TIMESTAMP), 'ACTIVE'),
  (22, '쿠션 파운데이션',         '아리따움',   '신상 쿠션 한정 할인',                                         6, 28000, 26040, 'https://placehold.co/600x400/C2185B/ffffff?text=ARITAUM&font=montserrat',  200,   75, DATEADD('DAY', -1, CURRENT_TIMESTAMP), DATEADD('DAY', 6, CURRENT_TIMESTAMP), 'ACTIVE'),
  (23, '향수 50ml',               '시코르',     '베스트셀러 향수',                                             6, 89000, 82770, 'https://placehold.co/600x400/000000/ffffff?text=CHICOR&font=montserrat',  100,   30, DATEADD('DAY', -1, CURRENT_TIMESTAMP), DATEADD('DAY', 7, CURRENT_TIMESTAMP), 'ACTIVE'),
  (24, '클렌징 폼',               '닥터자르트', '클렌징 폼 단품',                                              6, 18000, 16920, 'https://placehold.co/600x400/000000/ffffff?text=Dr.Jart%2B&font=montserrat',  300,  140, DATEADD('DAY', -1, CURRENT_TIMESTAMP), DATEADD('DAY', 9, CURRENT_TIMESTAMP), 'ACTIVE'),
  (25, '주중 영화관람권',         'CGV',        '월~목 1매',                                                   7, 14000, 13020, 'https://placehold.co/600x400/ED1C24/ffffff?text=CGV&font=montserrat',  500,  300, DATEADD('DAY', -1, CURRENT_TIMESTAMP), DATEADD('DAY', 30, CURRENT_TIMESTAMP), 'ACTIVE'),
  (26, '롯데시네마 1매',          '롯데시네마', '일반관 2D 1매',                                                7, 14000, 13020, 'https://placehold.co/600x400/ED1C24/ffffff?text=LOTTE+Cinema&font=montserrat',  500,  280, DATEADD('DAY', -1, CURRENT_TIMESTAMP), DATEADD('DAY', 30, CURRENT_TIMESTAMP), 'ACTIVE'),
  (27, '메가박스 1매',            '메가박스',   '평일 1매',                                                     7, 14000, 13020, 'https://placehold.co/600x400/6F2DA8/ffffff?text=MEGABOX&font=montserrat',  300,  150, DATEADD('DAY', -1, CURRENT_TIMESTAMP), DATEADD('DAY', 30, CURRENT_TIMESTAMP), 'ACTIVE'),
  (28, '팝콘 + 콜라 세트',        'CGV',        '팝콘L + 콜라R',                                                7, 12000, 11280, 'https://placehold.co/600x400/ED1C24/ffffff?text=CGV&font=montserrat',  600,  320, DATEADD('DAY', -1, CURRENT_TIMESTAMP), DATEADD('DAY', 30, CURRENT_TIMESTAMP), 'ACTIVE'),
  (29, '리터당 80원 할인',         'GS칼텍스',   '리터당 80원 할인 쿠폰',                                       8, 5000,  4800, 'https://placehold.co/600x400/FFA500/ffffff?text=GS+Caltex&font=montserrat', 1000,  500, DATEADD('DAY', -1, CURRENT_TIMESTAMP), DATEADD('DAY', 14, CURRENT_TIMESTAMP), 'ACTIVE'),
  (30, '리터당 100원 할인',        'SK에너지',   '리터당 100원 할인',                                            8, 5000,  4750, 'https://placehold.co/600x400/EA002C/ffffff?text=SK+Energy&font=montserrat', 1000,  600, DATEADD('DAY', -1, CURRENT_TIMESTAMP), DATEADD('DAY', 14, CURRENT_TIMESTAMP), 'ACTIVE'),
  (31, '24시간 한정 핫딜',         '스타벅스',   '24시간만 풀리는 한정 딜',                                      2, 6000,  5580, 'https://placehold.co/600x400/006241/ffffff?text=STARBUCKS&font=montserrat',  100,   95, DATEADD('DAY', -1, CURRENT_TIMESTAMP), DATEADD('HOUR', 6, CURRENT_TIMESTAMP), 'ACTIVE'),
  (32, '주말 특가 버거',           '맥도날드',   '주말 한정 단품',                                                3, 6500,  6110, 'https://placehold.co/600x400/FFC72C/000000?text=McDonalds&font=montserrat',  200,  180, DATEADD('DAY', -1, CURRENT_TIMESTAMP), DATEADD('HOUR', 18, CURRENT_TIMESTAMP), 'ACTIVE'),
  (33, '첫구매 할인 쿠폰',          '쿠팡이츠',   '신규 사용자 한정',                                              4, 5000,  4850, 'https://placehold.co/600x400/FF5252/ffffff?text=Coupang+Eats&font=montserrat',  500,  400, DATEADD('DAY', -1, CURRENT_TIMESTAMP), DATEADD('DAY', 30, CURRENT_TIMESTAMP), 'ACTIVE'),
  (34, '마스크팩 10매',             '메디힐',     '마스크팩 박스',                                                 6, 18000, 16920, 'https://placehold.co/600x400/FF1493/ffffff?text=MEDIHEAL&font=montserrat',  500,  350, DATEADD('DAY', -1, CURRENT_TIMESTAMP), DATEADD('DAY', 9, CURRENT_TIMESTAMP), 'ACTIVE'),
  (35, '커피쿠폰 5매',              '메가커피',   '아메리카노 5매 묶음',                                           2, 7500,  7130, 'https://placehold.co/600x400/FFD700/000000?text=MEGA+COFFEE&font=montserrat',  300,  120, DATEADD('DAY', -1, CURRENT_TIMESTAMP), DATEADD('DAY', 14, CURRENT_TIMESTAMP), 'ACTIVE');

-- Event 추가할인 (제휴사 이벤트 진행 중인 딜)
UPDATE deals SET event_discount_rate = 3 WHERE id IN (1, 2, 31);  -- 스타벅스 시리즈
UPDATE deals SET event_discount_rate = 2 WHERE id = 5;            -- CU 도시락
UPDATE deals SET event_discount_rate = 5 WHERE id = 15;           -- 배달의민족
UPDATE deals SET event_discount_rate = 2 WHERE id = 18;           -- 무신사
UPDATE deals SET event_discount_rate = 4 WHERE id = 25;           -- CGV 주중
UPDATE deals SET event_discount_rate = 3 WHERE id = 32;           -- 맥도날드 주말
UPDATE deals SET event_discount_rate = NULL WHERE id NOT IN (1, 2, 5, 15, 18, 25, 31, 32);
