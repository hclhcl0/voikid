# -*- coding: utf-8 -*-
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Definitions for Units 11 to 20 of SGK Tieng Anh 4 Tap 2 (Global Success / Ket noi tri thuc)

categories = [
    {
        "id": "lop4_u11_home",
        "gradeId": "lop4",
        "name_vi": "Unit 11: Ngôi Nhà & Đường Phố",
        "name_en": "Unit 11: My Home",
        "emoji": "🏡",
        "color": "from-amber-400 to-emerald-500",
        "gradient": "bg-gradient-to-br from-amber-100 to-emerald-100",
        "words": [
            {
                "id": "l4_road",
                "en": "road",
                "vi": "con đường, đường phố",
                "emoji": "🛣️",
                "phonetic": "/rəʊd/",
                "example_en": "The road in front of my house is wide.",
                "example_vi": "Con đường trước nhà em rất rộng rãi."
            },
            {
                "id": "l4_street",
                "en": "street",
                "vi": "phố, đường phố",
                "emoji": "🏙️",
                "phonetic": "/striːt/",
                "example_en": "I live in Nguyen Hue Street.",
                "example_vi": "Em sống ở đường phố Nguyễn Huệ."
            },
            {
                "id": "l4_live",
                "en": "live",
                "vi": "sống, sinh sống",
                "emoji": "🏠",
                "phonetic": "/lɪv/",
                "example_en": "Where do you live? - I live in Ha Noi.",
                "example_vi": "Bạn sống ở đâu? - Tớ sống ở Hà Nội."
            },
            {
                "id": "l4_busy",
                "en": "busy",
                "vi": "bận rộn, nhộn nhịp",
                "emoji": "🚗",
                "phonetic": "/ˈbɪzi/",
                "example_en": "The street is very busy with many cars.",
                "example_vi": "Đường phố rất nhộn nhịp đông đúc xe cộ."
            },
            {
                "id": "l4_noisy",
                "en": "noisy",
                "vi": "ồn ào, náo nhiệt",
                "emoji": "📢",
                "phonetic": "/ˈnɔɪzi/",
                "example_en": "The city is quite noisy during the day.",
                "example_vi": "Thành phố khá ồn ào vào ban ngày."
            },
            {
                "id": "l4_quiet",
                "en": "quiet",
                "vi": "yên tĩnh, thanh bình",
                "emoji": "🤫",
                "phonetic": "/ˈkwaɪət/",
                "example_en": "My village is very quiet and peaceful.",
                "example_vi": "Làng quê của em rất yên tĩnh và thanh bình."
            },
            {
                "id": "l4_big_street",
                "en": "big",
                "vi": "to, lớn (kích thước)",
                "emoji": "🏢",
                "phonetic": "/bɪɡ/",
                "example_en": "There is a big building on our street.",
                "example_vi": "Có một tòa nhà to lớn trên phố của chúng em."
            },
            {
                "id": "l4_in_prep",
                "en": "in",
                "vi": "ở, trong (đi cùng tên đường / phố)",
                "emoji": "📍",
                "phonetic": "/ɪn/",
                "example_en": "My grandparents live in Oxford Street.",
                "example_vi": "Ông bà em sống ở phố Oxford."
            }
        ]
    },
    {
        "id": "lop4_u12_jobs",
        "gradeId": "lop4",
        "name_vi": "Unit 12: Nghề Nghiệp & Nơi Làm Việc",
        "name_en": "Unit 12: Jobs",
        "emoji": "👨‍⚕️",
        "color": "from-blue-400 to-cyan-500",
        "gradient": "bg-gradient-to-br from-blue-100 to-cyan-100",
        "words": [
            {
                "id": "l4_actor",
                "en": "actor",
                "vi": "diễn viên (nam)",
                "emoji": "🎭",
                "phonetic": "/ˈæktə/",
                "example_en": "My uncle is a famous actor.",
                "example_vi": "Chú của em là một nam diễn viên nổi tiếng."
            },
            {
                "id": "l4_farmer",
                "en": "farmer",
                "vi": "bác nông dân",
                "emoji": "👨‍🌾",
                "phonetic": "/ˈfɑːmə/",
                "example_en": "The farmer works hard on the farm.",
                "example_vi": "Bác nông dân làm việc chăm chỉ trên nông trại."
            },
            {
                "id": "l4_nurse",
                "en": "nurse",
                "vi": "y tá, điều dưỡng viên",
                "emoji": "👩‍⚕️",
                "phonetic": "/nɜːs/",
                "example_en": "The kind nurse takes care of sick people.",
                "example_vi": "Cô y tá hiền từ chăm sóc những người ốm."
            },
            {
                "id": "l4_office_worker",
                "en": "office worker",
                "vi": "nhân viên văn phòng",
                "emoji": "💼",
                "phonetic": "/ˈɒfɪs wɜːkə/",
                "example_en": "My mother is an office worker.",
                "example_vi": "Mẹ em là một nhân viên văn phòng."
            },
            {
                "id": "l4_policeman",
                "en": "policeman",
                "vi": "chú cảnh sát (nam)",
                "emoji": "👮‍♂️",
                "phonetic": "/pə'liːsmən/",
                "example_en": "The policeman keeps our streets safe.",
                "example_vi": "Chú cảnh sát giữ an toàn cho đường phố."
            },
            {
                "id": "l4_factory",
                "en": "factory",
                "vi": "nhà máy",
                "emoji": "🏭",
                "phonetic": "/ˈfæktri/",
                "example_en": "Workers produce clothes in the factory.",
                "example_vi": "Các công nhân may quần áo trong nhà máy."
            },
            {
                "id": "l4_farm",
                "en": "farm",
                "vi": "nông trại, trang trại",
                "emoji": "🚜",
                "phonetic": "/fɑːm/",
                "example_en": "There are cows and chickens on the farm.",
                "example_vi": "Có những chú bò và chú gà trên nông trại."
            },
            {
                "id": "l4_hospital",
                "en": "hospital",
                "vi": "bệnh viện",
                "emoji": "🏥",
                "phonetic": "/ˈhɒspɪtl/",
                "example_en": "Doctors and nurses work at the hospital.",
                "example_vi": "Bác sĩ và y tá làm việc tại bệnh viện."
            },
            {
                "id": "l4_nursing_home",
                "en": "nursing home",
                "vi": "viện điều dưỡng",
                "emoji": "🩺",
                "phonetic": "/ˈnɜːsɪŋ həʊm/",
                "example_en": "Nurses care for the elderly in the nursing home.",
                "example_vi": "Các y tá chăm sóc người cao tuổi trong viện điều dưỡng."
            },
            {
                "id": "l4_email",
                "en": "email",
                "vi": "gửi thư điện tử",
                "emoji": "📧",
                "phonetic": "/ˈiːmeɪl/",
                "example_en": "Office workers often email their colleagues.",
                "example_vi": "Nhân viên văn phòng thường gửi email cho đồng nghiệp."
            }
        ]
    },
    {
        "id": "lop4_u13_appearance",
        "gradeId": "lop4",
        "name_vi": "Unit 13: Ngoại Hình & Khuôn Mặt",
        "name_en": "Unit 13: Appearance",
        "emoji": "✨",
        "color": "from-purple-400 to-pink-500",
        "gradient": "bg-gradient-to-br from-purple-100 to-pink-100",
        "words": [
            {
                "id": "l4_tall",
                "en": "tall",
                "vi": "cao ráo",
                "emoji": "🦒",
                "phonetic": "/tɔːl/",
                "example_en": "My brother is very tall.",
                "example_vi": "Anh trai của em rất cao."
            },
            {
                "id": "l4_short",
                "en": "short",
                "vi": "thấp, ngắn",
                "emoji": "🧒",
                "phonetic": "/ʃɔːt/",
                "example_en": "The little boy is short and cute.",
                "example_vi": "Cậu bé nhỏ nhắn trông thấp và đáng yêu."
            },
            {
                "id": "l4_slim",
                "en": "slim",
                "vi": "mảnh mai, thon gọn",
                "emoji": "🏃‍♀️",
                "phonetic": "/slɪm/",
                "example_en": "My sister is slim because she dances every day.",
                "example_vi": "Chị gái em mảnh mai vì chị tập múa mỗi ngày."
            },
            {
                "id": "l4_face",
                "en": "face",
                "vi": "khuôn mặt",
                "emoji": "😊",
                "phonetic": "/feɪs/",
                "example_en": "She has a smiling round face.",
                "example_vi": "Cô bé có khuôn mặt tròn hay mỉm cười."
            },
            {
                "id": "l4_eye",
                "en": "eye",
                "vi": "đôi mắt, mắt",
                "emoji": "👀",
                "phonetic": "/aɪ/",
                "example_en": "The baby has big bright eyes.",
                "example_vi": "Em bé có đôi mắt to sáng ngời."
            },
            {
                "id": "l4_hair",
                "en": "hair",
                "vi": "mái tóc",
                "emoji": "💇",
                "phonetic": "/heə/",
                "example_en": "My mother has soft black hair.",
                "example_vi": "Mẹ em có mái tóc đen mềm mại."
            },
            {
                "id": "l4_long",
                "en": "long",
                "vi": "dài",
                "emoji": "📏",
                "phonetic": "/lɒŋ/",
                "example_en": "She has long hair and wears a red bow.",
                "example_vi": "Cô ấy có mái tóc dài và cài nơ đỏ."
            },
            {
                "id": "l4_round",
                "en": "round",
                "vi": "tròn trịa",
                "emoji": "⚪",
                "phonetic": "/raʊnd/",
                "example_en": "The full moon is round like a ball.",
                "example_vi": "Mặt trăng tròn như một quả bóng."
            },
            {
                "id": "l4_like_look",
                "en": "like",
                "vi": "giống như, trông như",
                "emoji": "👥",
                "phonetic": "/laɪk/",
                "example_en": "What does he look like? - He is tall and slim.",
                "example_vi": "Cậu ấy trông như thế nào? - Cậu ấy cao và thon thả."
            }
        ]
    },
    {
        "id": "lop4_u14_daily",
        "gradeId": "lop4",
        "name_vi": "Unit 14: Hoạt Động & Việc Nhà",
        "name_en": "Unit 14: Daily Activities",
        "emoji": "🧹",
        "color": "from-orange-400 to-amber-500",
        "gradient": "bg-gradient-to-br from-orange-100 to-amber-100",
        "words": [
            {
                "id": "l4_morning",
                "en": "morning",
                "vi": "buổi sáng",
                "emoji": "🌅",
                "phonetic": "/ˈmɔːnɪŋ/",
                "example_en": "I brush my teeth in the morning.",
                "example_vi": "Em đánh răng vào buổi sáng."
            },
            {
                "id": "l4_noon",
                "en": "noon",
                "vi": "buổi trưa",
                "emoji": "☀️",
                "phonetic": "/nuːn/",
                "example_en": "We eat delicious lunch at noon.",
                "example_vi": "Chúng em ăn bữa trưa ngon miệng vào buổi trưa."
            },
            {
                "id": "l4_afternoon",
                "en": "afternoon",
                "vi": "buổi chiều",
                "emoji": "🌤️",
                "phonetic": "/ˌɑːftəˈnuːn/",
                "example_en": "I play football with friends in the afternoon.",
                "example_vi": "Em đá bóng cùng các bạn vào buổi chiều."
            },
            {
                "id": "l4_evening",
                "en": "evening",
                "vi": "buổi tối",
                "emoji": "🌙",
                "phonetic": "/ˈiːvnɪŋ/",
                "example_en": "My family reads books in the evening.",
                "example_vi": "Gia đình em đọc sách vào buổi tối."
            },
            {
                "id": "l4_clean_the_floor",
                "en": "clean the floor",
                "vi": "lau sàn nhà",
                "emoji": "🧹",
                "phonetic": "/kliːn ðə flɔː/",
                "example_en": "I help my dad clean the floor on Sundays.",
                "example_vi": "Em giúp bố lau sàn nhà vào ngày Chủ nhật."
            },
            {
                "id": "l4_help_with_cooking",
                "en": "help with the cooking",
                "vi": "giúp đỡ việc nấu ăn",
                "emoji": "🍳",
                "phonetic": "/help wɪð ðə ˈkʊkɪŋ/",
                "example_en": "Children can help with the cooking safely.",
                "example_vi": "Trẻ em có thể giúp việc nấu ăn một cách an toàn."
            },
            {
                "id": "l4_cooking",
                "en": "cooking",
                "vi": "việc nấu nướng",
                "emoji": "🍲",
                "phonetic": "/ˈkʊkɪŋ/",
                "example_en": "Mum loves cooking tasty soups for us.",
                "example_vi": "Mẹ rất thích nấu những món súp thơm ngon cho chúng em."
            },
            {
                "id": "l4_wash_clothes",
                "en": "wash the clothes",
                "vi": "giặt quần áo",
                "emoji": "🧺",
                "phonetic": "/wɒʃ ðə ˈkləʊðz/",
                "example_en": "I help my mum wash the clothes.",
                "example_vi": "Em giúp mẹ giặt quần áo sạch sẽ."
            },
            {
                "id": "l4_wash_dishes",
                "en": "wash the dishes",
                "vi": "rửa bát đĩa",
                "emoji": "🧽",
                "phonetic": "/wɒʃ ðə ˈdɪʃɪz/",
                "example_en": "After dinner, we wash the dishes together.",
                "example_vi": "Sau bữa tối, chúng em cùng nhau rửa bát đĩa."
            },
            {
                "id": "l4_do_housework",
                "en": "do housework",
                "vi": "làm việc nhà",
                "emoji": "🏠",
                "phonetic": "/duː ˈhaʊswɜːk/",
                "example_en": "We do housework to keep our home neat.",
                "example_vi": "Chúng em làm việc nhà để giữ nhà cửa ngăn nắp."
            }
        ]
    },
    {
        "id": "lop4_u15_weekends",
        "gradeId": "lop4",
        "name_vi": "Unit 15: Cuối Tuần Của Gia Đình",
        "name_en": "Unit 15: My Family's Weekends",
        "emoji": "🎬",
        "color": "from-rose-400 to-pink-500",
        "gradient": "bg-gradient-to-br from-rose-100 to-pink-100",
        "words": [
            {
                "id": "l4_cinema",
                "en": "cinema",
                "vi": "rạp chiếu phim",
                "emoji": "🎬",
                "phonetic": "/ˈsɪnəmə/",
                "example_en": "We watch cartoons at the cinema.",
                "example_vi": "Chúng em xem phim hoạt hình ở rạp chiếu phim."
            },
            {
                "id": "l4_film",
                "en": "film",
                "vi": "bộ phim",
                "emoji": "🎞️",
                "phonetic": "/fɪlm/",
                "example_en": "That animated film is so exciting!",
                "example_vi": "Bộ phim hoạt hình đó thật là thú vị!"
            },
            {
                "id": "l4_watch",
                "en": "watch",
                "vi": "xem, theo dõi",
                "emoji": "📺",
                "phonetic": "/wɒtʃ/",
                "example_en": "We watch films together on Saturday.",
                "example_vi": "Gia đình em cùng xem phim vào thứ Bảy."
            },
            {
                "id": "l4_television",
                "en": "television",
                "vi": "ti vi, truyền hình",
                "emoji": "📺",
                "phonetic": "/ˈtelɪvɪʒn/",
                "example_en": "We turn off the television after 9 p.m.",
                "example_vi": "Chúng em tắt ti vi sau 9 giờ tối."
            },
            {
                "id": "l4_sports_centre",
                "en": "sports centre",
                "vi": "trung tâm thể thao",
                "emoji": "🏟️",
                "phonetic": "/ˈspɔːts sentə/",
                "example_en": "I practice karate at the sports centre.",
                "example_vi": "Em tập karate ở trung tâm thể thao."
            },
            {
                "id": "l4_swimming_pool",
                "en": "swimming pool",
                "vi": "hồ bơi, bể bơi",
                "emoji": "🏊",
                "phonetic": "/ˈswɪmɪŋ puːl/",
                "example_en": "Water in the swimming pool is cool and blue.",
                "example_vi": "Nước trong bể bơi mát lành và xanh ngắt."
            },
            {
                "id": "l4_centre",
                "en": "centre",
                "vi": "trung tâm",
                "emoji": "🎯",
                "phonetic": "/ˈsentə/",
                "example_en": "The community centre has a big library.",
                "example_vi": "Trung tâm cộng đồng có một thư viện lớn."
            },
            {
                "id": "l4_do_yoga",
                "en": "do yoga",
                "vi": "tập yoga",
                "emoji": "🧘",
                "phonetic": "/duː ˈjəʊɡə/",
                "example_en": "Mum does yoga in the morning for good health.",
                "example_vi": "Mẹ tập yoga vào buổi sáng để có sức khỏe tốt."
            },
            {
                "id": "l4_play_tennis",
                "en": "play tennis",
                "vi": "chơi quần vợt (tennis)",
                "emoji": "🎾",
                "phonetic": "/pleɪ 'tenɪs/",
                "example_en": "Dad and uncle play tennis on weekends.",
                "example_vi": "Bố và chú chơi quần vợt vào dịp cuối tuần."
            },
            {
                "id": "l4_meal",
                "en": "meal",
                "vi": "bữa ăn gia đình",
                "emoji": "🍽️",
                "phonetic": "/miːl/",
                "example_en": "We enjoy a happy family meal together.",
                "example_vi": "Chúng em quây quần bên bữa ăn gia đình ấm cúng."
            }
        ]
    },
    {
        "id": "lop4_u16_weather",
        "gradeId": "lop4",
        "name_vi": "Unit 16: Thời Tiết & Dạo Phố",
        "name_en": "Unit 16: Weather",
        "emoji": "⛅",
        "color": "from-sky-400 to-blue-500",
        "gradient": "bg-gradient-to-br from-sky-100 to-blue-100",
        "words": [
            {
                "id": "l4_weather",
                "en": "weather",
                "vi": "thời tiết",
                "emoji": "🌤️",
                "phonetic": "/ˈweðə/",
                "example_en": "What is the weather like today? - It is sunny.",
                "example_vi": "Thời tiết hôm nay thế nào? - Trời nắng đẹp."
            },
            {
                "id": "l4_sunny",
                "en": "sunny",
                "vi": "có nắng, trời nắng",
                "emoji": "☀️",
                "phonetic": "/ˈsʌni/",
                "example_en": "It is warm and sunny today.",
                "example_vi": "Hôm nay trời ấm áp và đầy nắng."
            },
            {
                "id": "l4_cloudy",
                "en": "cloudy",
                "vi": "có mây, nhiều mây",
                "emoji": "☁️",
                "phonetic": "/ˈklaʊdi/",
                "example_en": "The sky is cloudy this afternoon.",
                "example_vi": "Bầu trời chiều nay có nhiều mây."
            },
            {
                "id": "l4_rainy",
                "en": "rainy",
                "vi": "có mưa, trời mưa",
                "emoji": "🌧️",
                "phonetic": "/ˈreɪni/",
                "example_en": "Take an umbrella on a rainy day.",
                "example_vi": "Hãy mang ô vào một ngày trời mưa nhé."
            },
            {
                "id": "l4_windy",
                "en": "windy",
                "vi": "có gió, gió to",
                "emoji": "💨",
                "phonetic": "/ˈwɪndi/",
                "example_en": "It is windy, perfect for flying a kite.",
                "example_vi": "Trời có gió lộng, rất thích hợp để thả diều."
            },
            {
                "id": "l4_bakery",
                "en": "bakery",
                "vi": "tiệm bánh mì",
                "emoji": "🥖",
                "phonetic": "/ˈbeɪkəri/",
                "example_en": "The bakery smells of fresh hot bread.",
                "example_vi": "Tiệm bánh mì thơm phức mùi bánh nóng hổi."
            },
            {
                "id": "l4_bookshop",
                "en": "bookshop",
                "vi": "hiệu sách",
                "emoji": "📚",
                "phonetic": "/ˈbʊkʃɒp/",
                "example_en": "I buy comic books at the bookshop.",
                "example_vi": "Em mua truyện tranh ở hiệu sách."
            },
            {
                "id": "l4_food_stall",
                "en": "food stall",
                "vi": "quầy hàng thực phẩm",
                "emoji": "🥟",
                "phonetic": "/fuːd stɔːl/",
                "example_en": "We bought hot noodles at the food stall.",
                "example_vi": "Chúng em mua mì nóng ở quầy ẩm thực."
            },
            {
                "id": "l4_water_park",
                "en": "water park",
                "vi": "công viên nước",
                "emoji": "🌊",
                "phonetic": "/ˈwɔːtə pɑːk/",
                "example_en": "Children love water slides at the water park.",
                "example_vi": "Trẻ em thích trượt máng nước ở công viên nước."
            }
        ]
    },
    {
        "id": "lop4_u17_city",
        "gradeId": "lop4",
        "name_vi": "Unit 17: Thành Phố & Chỉ Đường",
        "name_en": "Unit 17: In The City",
        "emoji": "🚦",
        "color": "from-teal-400 to-emerald-500",
        "gradient": "bg-gradient-to-br from-teal-100 to-emerald-100",
        "words": [
            {
                "id": "l4_get_to",
                "en": "get to",
                "vi": "đến (địa điểm nào đó)",
                "emoji": "🗺️",
                "phonetic": "/ɡet tə/",
                "example_en": "How can I get to the zoo?",
                "example_vi": "Làm thế nào để tôi đến được sở thú?"
            },
            {
                "id": "l4_go_straight",
                "en": "go straight",
                "vi": "đi thẳng",
                "emoji": "⬆️",
                "phonetic": "/ɡəʊ streɪt/",
                "example_en": "Go straight ahead for two hundred metres.",
                "example_vi": "Hãy đi thẳng về phía trước khoảng 200 mét."
            },
            {
                "id": "l4_turn",
                "en": "turn",
                "vi": "rẽ, quẹo",
                "emoji": "🔄",
                "phonetic": "/tɜːn/",
                "example_en": "Turn at the traffic light.",
                "example_vi": "Hãy rẽ ở cột đèn giao thông."
            },
            {
                "id": "l4_turn_left",
                "en": "turn left",
                "vi": "rẽ trái",
                "emoji": "⬅️",
                "phonetic": "/tɜːn 'left/",
                "example_en": "Turn left at the bakery.",
                "example_vi": "Rẽ sang bên trái ở chỗ tiệm bánh mì."
            },
            {
                "id": "l4_turn_right",
                "en": "turn right",
                "vi": "rẽ phải",
                "emoji": "➡️",
                "phonetic": "/tɜːn 'raɪt/",
                "example_en": "Turn right at the bookstore.",
                "example_vi": "Rẽ sang bên phải ở chỗ hiệu sách."
            },
            {
                "id": "l4_turn_round",
                "en": "turn round",
                "vi": "quay lại, quay đầu",
                "emoji": "↩️",
                "phonetic": "/tɜːn 'raʊnd/",
                "example_en": "Turn round, you missed the corner!",
                "example_vi": "Hãy quay đầu lại, bạn vừa đi quá góc đường rồi!"
            },
            {
                "id": "l4_left",
                "en": "left",
                "vi": "bên trái",
                "emoji": "👈",
                "phonetic": "/left/",
                "example_en": "The museum is on your left.",
                "example_vi": "Bảo tàng nằm ở phía bên trái của bạn."
            },
            {
                "id": "l4_right",
                "en": "right",
                "vi": "bên phải",
                "emoji": "👉",
                "phonetic": "/raɪt/",
                "example_en": "The post office is on the right.",
                "example_vi": "Bưu điện nằm ở phía bên phải."
            },
            {
                "id": "l4_stop",
                "en": "stop",
                "vi": "dừng lại",
                "emoji": "🛑",
                "phonetic": "/stɒp/",
                "example_en": "Stop when the traffic light turns red.",
                "example_vi": "Hãy dừng lại khi đèn giao thông chuyển sang màu đỏ."
            },
            {
                "id": "l4_road_sign",
                "en": "road sign",
                "vi": "biển chỉ đường",
                "emoji": "🚸",
                "phonetic": "/ˈrəʊd saɪn/",
                "example_en": "Look at the road sign for directions.",
                "example_vi": "Hãy nhìn biển báo để biết hướng đi."
            }
        ]
    },
    {
        "id": "lop4_u18_shopping",
        "gradeId": "lop4",
        "name_vi": "Unit 18: Mua Sắm & Giá Cả",
        "name_en": "Unit 18: At The Shopping Centre",
        "emoji": "🛍️",
        "color": "from-fuchsia-400 to-purple-500",
        "gradient": "bg-gradient-to-br from-fuchsia-100 to-purple-100",
        "words": [
            {
                "id": "l4_shopping_centre",
                "en": "shopping centre",
                "vi": "trung tâm mua sắm",
                "emoji": "🏬",
                "phonetic": "/ˈʃɒpɪŋ sentə/",
                "example_en": "There are many stores in the shopping centre.",
                "example_vi": "Có rất nhiều cửa hàng trong trung tâm thương mại."
            },
            {
                "id": "l4_supermarket",
                "en": "supermarket",
                "vi": "siêu thị",
                "emoji": "🛒",
                "phonetic": "/ˈsuːpəmɑːkɪt/",
                "example_en": "We buy fresh fruits at the supermarket.",
                "example_vi": "Chúng em mua hoa quả tươi ở siêu thị."
            },
            {
                "id": "l4_gift_shop",
                "en": "gift shop",
                "vi": "cửa hàng quà tặng",
                "emoji": "🎁",
                "phonetic": "/ˈɡɪft ʃɒp/",
                "example_en": "I bought a lovely card at the gift shop.",
                "example_vi": "Em mua một tấm thiệp xinh xắn ở tiệm quà lưu niệm."
            },
            {
                "id": "l4_skirt",
                "en": "skirt",
                "vi": "chân váy, chiếc váy",
                "emoji": "👗",
                "phonetic": "/skɜːt/",
                "example_en": "She wears a blue pleated skirt.",
                "example_vi": "Cô bé mặc một chiếc chân váy màu xanh dương."
            },
            {
                "id": "l4_t_shirt",
                "en": "T-shirt",
                "vi": "áo phông, áo thun",
                "emoji": "👕",
                "phonetic": "/ˈtiː ʃɜːt/",
                "example_en": "I wear a comfortable white T-shirt.",
                "example_vi": "Em mặc một chiếc áo phông trắng thoáng mát."
            },
            {
                "id": "l4_dong",
                "en": "dong",
                "vi": "đồng (tiền tệ Việt Nam)",
                "emoji": "💵",
                "phonetic": "/dɒŋ/",
                "example_en": "The pen costs five thousand dong.",
                "example_vi": "Chiếc bút bi có giá 5.000 đồng."
            },
            {
                "id": "l4_thousand",
                "en": "thousand",
                "vi": "nghìn, một ngàn",
                "emoji": "🔢",
                "phonetic": "/ˈθaʊznd/",
                "example_en": "Ten thousand dong for an ice cream.",
                "example_vi": "Mười nghìn đồng một chiếc kem."
            },
            {
                "id": "l4_near",
                "en": "near",
                "vi": "ở gần",
                "emoji": "📍",
                "phonetic": "/nɪə/",
                "example_en": "The gift shop is near the entrance.",
                "example_vi": "Cửa hàng quà tặng nằm ở gần lối vào."
            },
            {
                "id": "l4_behind",
                "en": "behind",
                "vi": "ở đằng sau",
                "emoji": "🔙",
                "phonetic": "/bɪˈhaɪnd/",
                "example_en": "The bakery is behind the supermarket.",
                "example_vi": "Tiệm bánh mì nằm ở đằng sau siêu thị."
            },
            {
                "id": "l4_between",
                "en": "between",
                "vi": "ở giữa (hai nơi)",
                "emoji": "↔️",
                "phonetic": "/bɪˈtwiːn/",
                "example_en": "The bookshop is between the bakery and cinema.",
                "example_vi": "Hiệu sách nằm ở giữa tiệm bánh và rạp chiếu phim."
            },
            {
                "id": "l4_opposite",
                "en": "opposite",
                "vi": "ở đối diện",
                "emoji": "🔄",
                "phonetic": "/ˈɒpəzɪt/",
                "example_en": "The toy shop is opposite the gift shop.",
                "example_vi": "Cửa hàng đồ chơi nằm đối diện cửa hàng quà tặng."
            }
        ]
    },
    {
        "id": "lop4_u19_animals",
        "gradeId": "lop4",
        "name_vi": "Unit 19: Thế Giới Động Vật",
        "name_en": "Unit 19: The Animal World",
        "emoji": "🦁",
        "color": "from-amber-400 to-yellow-500",
        "gradient": "bg-gradient-to-br from-amber-100 to-yellow-100",
        "words": [
            {
                "id": "l4_lion",
                "en": "lion",
                "vi": "con sư tử",
                "emoji": "🦁",
                "phonetic": "/ˈlaɪən/",
                "example_en": "The brave lion is the king of the jungle.",
                "example_vi": "Chú sư tử dũng cảm là chúa tể rừng xanh."
            },
            {
                "id": "l4_giraffe",
                "en": "giraffe",
                "vi": "hươu cao cổ",
                "emoji": "🦒",
                "phonetic": "/dʒɪˈrɑːf/",
                "example_en": "The tall giraffe eats green leaves from trees.",
                "example_vi": "Chú hươu cao cổ ăn lá xanh trên ngọn cây."
            },
            {
                "id": "l4_hippo",
                "en": "hippo",
                "vi": "hà mã",
                "emoji": "🦛",
                "phonetic": "/ˈhɪpəʊ/",
                "example_en": "The big hippo likes swimming in the river.",
                "example_vi": "Chú hà mã to lớn thích bơi lội dưới sông."
            },
            {
                "id": "l4_crocodile",
                "en": "crocodile",
                "vi": "con cá sấu",
                "emoji": "🐊",
                "phonetic": "/ˈkrɒkədaɪl/",
                "example_en": "The green crocodile has very sharp teeth.",
                "example_vi": "Chú cá sấu xanh có hàm răng rất sắc nhọn."
            },
            {
                "id": "l4_roar",
                "en": "roar",
                "vi": "tiếng gầm, gầm rống",
                "emoji": "🔊",
                "phonetic": "/rɔː/",
                "example_en": "Lions roar loudly in the zoo.",
                "example_vi": "Những chú sư tử gầm vang thật to trong sở thú."
            },
            {
                "id": "l4_loudly",
                "en": "loudly",
                "vi": "ầm ĩ, vang to",
                "emoji": "📢",
                "phonetic": "/ˈlaʊdli/",
                "example_en": "The monkeys chatter loudly in the trees.",
                "example_vi": "Lũ khỉ kêu chí chóe thật to trên các tán cây."
            },
            {
                "id": "l4_quickly",
                "en": "quickly",
                "vi": "nhanh nhẹn, mau chóng",
                "emoji": "⚡",
                "phonetic": "/ˈkwɪkli/",
                "example_en": "Cheetahs run very quickly across the field.",
                "example_vi": "Báo đốm chạy rất nhanh băng qua cánh đồng."
            },
            {
                "id": "l4_merrily",
                "en": "merrily",
                "vi": "vui tươi, ríu rít",
                "emoji": "🎵",
                "phonetic": "/ˈmerəli/",
                "example_en": "Birds sing merrily in the sunny garden.",
                "example_vi": "Những chú chim hót líu lo vui vẻ trong vườn đầy nắng."
            },
            {
                "id": "l4_beautifully",
                "en": "beautifully",
                "vi": "tuyệt đẹp, duyên dáng",
                "emoji": "🦚",
                "phonetic": "/ˈbjuːtɪfli/",
                "example_en": "The peacock dances beautifully.",
                "example_vi": "Chú công xoè đuôi múa thật là đẹp đẽ."
            },
            {
                "id": "l4_burrow",
                "en": "burrow",
                "vi": "hang đất (thỏ, cầy)",
                "emoji": "🕳️",
                "phonetic": "/ˈbʌrəʊ/",
                "example_en": "Rabbits dig a burrow underground.",
                "example_vi": "Những chú thỏ đào hang sâu dưới lòng đất."
            },
            {
                "id": "l4_den",
                "en": "den",
                "vi": "hang ổ (sư tử)",
                "emoji": "⛰️",
                "phonetic": "/den/",
                "example_en": "The lion family rests in their cool den.",
                "example_vi": "Gia đình sư tử nghỉ ngơi trong hang ổ mát mẻ."
            },
            {
                "id": "l4_web",
                "en": "web",
                "vi": "mạng nhện",
                "emoji": "🕸️",
                "phonetic": "/web/",
                "example_en": "The spider spins a silky web.",
                "example_vi": "Chú nhện giăng một mạng tơ óng ánh."
            }
        ]
    },
    {
        "id": "lop4_u20_summer_camp",
        "gradeId": "lop4",
        "name_vi": "Unit 20: Trại Hè & Lửa Trại",
        "name_en": "Unit 20: At Summer Camp",
        "emoji": "⛺",
        "color": "from-red-400 to-orange-500",
        "gradient": "bg-gradient-to-br from-red-100 to-orange-100",
        "words": [
            {
                "id": "l4_tent",
                "en": "tent",
                "vi": "lều cắm trại",
                "emoji": "⛺",
                "phonetic": "/tent/",
                "example_en": "We sleep in a cozy tent at camp.",
                "example_vi": "Chúng em ngủ trong căn lều ấm áp ở khu cắm trại."
            },
            {
                "id": "l4_put_up_tent",
                "en": "put up a tent",
                "vi": "dựng lều, cắm trại",
                "emoji": "🎪",
                "phonetic": "/pʊt ʌp ə 'tent/",
                "example_en": "We work together to put up a tent.",
                "example_vi": "Chúng em cùng nhau chung sức dựng lều trại."
            },
            {
                "id": "l4_build_campfire",
                "en": "build a campfire",
                "vi": "đốt lửa trại",
                "emoji": "🔥",
                "phonetic": "/bɪld ə ˈkæmpfaɪə/",
                "example_en": "The scouts build a campfire at night.",
                "example_vi": "Các bạn hướng đạo sinh đốt lửa trại vào ban đêm."
            },
            {
                "id": "l4_dance_around_campfire",
                "en": "dance around the campfire",
                "vi": "nhảy múa quanh lửa trại",
                "emoji": "💃",
                "phonetic": "/dɑːns əˈraʊnd ðə ˈkæmpfaɪə/",
                "example_en": "We dance around the campfire happily.",
                "example_vi": "Chúng em hào hứng nhảy múa quanh đốm lửa trại."
            },
            {
                "id": "l4_around",
                "en": "around",
                "vi": "xung quanh",
                "emoji": "🔄",
                "phonetic": "/əˈraʊnd/",
                "example_en": "Children sit around the warm fire.",
                "example_vi": "Các bạn nhỏ ngồi xung quanh ngọn lửa ấm áp."
            },
            {
                "id": "l4_play_card_games",
                "en": "play card games",
                "vi": "chơi trò chơi thẻ bài",
                "emoji": "🃏",
                "phonetic": "/pleɪ 'kɑːd ɡeɪmz/",
                "example_en": "We play card games inside the tent.",
                "example_vi": "Chúng em chơi trò chơi đánh bài vui vẻ trong lều."
            },
            {
                "id": "l4_play_tug_of_war",
                "en": "play tug of war",
                "vi": "chơi kéo co",
                "emoji": "🪢",
                "phonetic": "/pleɪ ˌtʌɡ əv 'wɔː/",
                "example_en": "Our team wins when we play tug of war!",
                "example_vi": "Đội của chúng em đã chiến thắng khi chơi kéo co!"
            },
            {
                "id": "l4_sing_songs",
                "en": "sing songs",
                "vi": "hát các bài hát",
                "emoji": "🎤",
                "phonetic": "/sɪŋ sɒŋz/",
                "example_en": "We sing songs together under the stars.",
                "example_vi": "Chúng em cùng hát những bài hát dưới bầu trời đầy sao."
            },
            {
                "id": "l4_tell_story",
                "en": "tell a story",
                "vi": "kể một câu chuyện",
                "emoji": "📖",
                "phonetic": "/tel ə 'stɔːri/",
                "example_en": "Our teacher tells a story about forest animals.",
                "example_vi": "Thầy giáo kể một câu chuyện thú vị về các loài thú rừng."
            },
            {
                "id": "l4_take_photo",
                "en": "take a photo",
                "vi": "chụp một bức ảnh",
                "emoji": "📸",
                "phonetic": "/teɪk ə 'fəʊtəʊ/",
                "example_en": "Smile and say cheese while I take a photo!",
                "example_vi": "Cười lên nào để tớ chụp một bức ảnh kỷ niệm nhé!"
            },
            {
                "id": "l4_photo",
                "en": "photo",
                "vi": "bức ảnh chụp",
                "emoji": "🖼️",
                "phonetic": "/ˈfəʊtəʊ/",
                "example_en": "This summer camp photo is so lovely.",
                "example_vi": "Bức ảnh chụp đợt trại hè này thật là đáng yêu."
            }
        ]
    }
]

total_words = sum(len(c["words"]) for c in categories)
print(f"Total categories built for Tap 2: {len(categories)}")
print(f"Total words across all 10 units of Tap 2: {total_words}")

# Save JSON
with open('scratch/lop4_tap2_final_categories.json', 'w', encoding='utf-8') as f:
    json.dump(categories, f, ensure_ascii=False, indent=2)

print("Saved to scratch/lop4_tap2_final_categories.json")
