import json
import re

# Load extracted words
words = json.load(open('d:/engl/vocakids/scratch/extracted_sgk4_words.json', encoding='utf-8'))

# Dictionary of word details with emoji and examples
data = {
    # Unit 1: Countries & Capitals
    "Viet Nam": {
        "emoji": "🇻🇳",
        "example_en": "I live in Viet Nam.",
        "example_vi": "Tôi sống ở Việt Nam."
    },
    "America": {
        "emoji": "🇺🇸",
        "example_en": "She is from America.",
        "example_vi": "Cô ấy đến từ nước Mỹ."
    },
    "Australia": {
        "emoji": "🇦🇺",
        "example_en": "Kangaroos live in Australia.",
        "example_vi": "Chuột túi sống ở nước Úc."
    },
    "Britain": {
        "emoji": "🇬🇧",
        "example_en": "David is from Britain.",
        "example_vi": "David đến từ nước Anh."
    },
    "Japan": {
        "emoji": "🇯🇵",
        "example_en": "Akiko is from Japan.",
        "example_vi": "Akiko đến từ Nhật Bản."
    },
    "Malaysia": {
        "emoji": "🇲🇾",
        "example_en": "Hakim is from Malaysia.",
        "example_vi": "Hakim đến từ Ma-lai-xi-a."
    },
    "Singapore": {
        "emoji": "🇸🇬",
        "example_en": "Singapore is a very green country.",
        "example_vi": "Xinh-ga-po là một đất nước rất xanh."
    },
    "Thailand": {
        "emoji": "🇹🇭",
        "example_en": "Thailand is famous for beautiful beaches.",
        "example_vi": "Thái Lan nổi tiếng với những bãi biển đẹp."
    },
    "Bangkok": {
        "emoji": "🏙️",
        "example_en": "Bangkok is the capital of Thailand.",
        "example_vi": "Băng Cốc là thủ đô của Thái Lan."
    },
    "London": {
        "emoji": "🎡",
        "example_en": "Big Ben is located in London.",
        "example_vi": "Tháp đồng hồ Big Ben nằm ở Luân Đôn."
    },
    "Sydney": {
        "emoji": "🏛️",
        "example_en": "The Opera House is in Sydney.",
        "example_vi": "Nhà hát Opera nằm ở Xít-ni."
    },
    "Tokyo": {
        "emoji": "🗼",
        "example_en": "Tokyo is the capital of Japan.",
        "example_vi": "Tô-ki-ô là thủ đô của nước Nhật."
    },

    # Unit 2: Time & Routines
    "o'clock": {
        "emoji": "⏰",
        "example_en": "It is seven o'clock in the morning.",
        "example_vi": "Bây giờ là đúng 7 giờ sáng."
    },
    "thirty": {
        "emoji": "🔢",
        "example_en": "It is six thirty.",
        "example_vi": "Bây giờ là 6 giờ 30 phút."
    },
    "forty-five": {
        "emoji": "🕒",
        "example_en": "It is seven forty-five.",
        "example_vi": "Bây giờ là 7 giờ 45 phút."
    },
    "get up": {
        "emoji": "🌅",
        "example_en": "I get up early at six o'clock.",
        "example_vi": "Tôi thức dậy sớm lúc 6 giờ."
    },
    "have (breakfast)": {
        "en": "Have breakfast",
        "emoji": "🍳",
        "example_en": "I have breakfast with bread and milk.",
        "example_vi": "Tôi ăn sáng với bánh mì và sữa."
    },
    "go (to school)": {
        "en": "Go to school",
        "emoji": "🎒",
        "example_en": "We go to school by bicycle.",
        "example_vi": "Chúng tôi đi học bằng xe đạp."
    },
    "go (to bed)": {
        "en": "Go to bed",
        "emoji": "🛏️",
        "example_en": "I go to bed at nine thirty.",
        "example_vi": "Tôi đi ngủ lúc 9 giờ 30 phút."
    },
    "wash": {
        "emoji": "🧼",
        "example_en": "I wash my face every morning.",
        "example_vi": "Tôi rửa mặt vào mỗi buổi sáng."
    },
    "today": {
        "emoji": "☀️",
        "example_en": "What day is it today?",
        "example_vi": "Hôm nay là thứ mấy?"
    },

    # Unit 3: My week
    "Monday": {
        "emoji": "📅",
        "example_en": "We start school on Monday.",
        "example_vi": "Chúng tôi bắt đầu đi học vào thứ Hai."
    },
    "Tuesday": {
        "emoji": "📅",
        "example_en": "I have English class on Tuesday.",
        "example_vi": "Tôi có tiết tiếng Anh vào thứ Ba."
    },
    "Wednesday": {
        "emoji": "📅",
        "example_en": "We have science on Wednesday.",
        "example_vi": "Chúng tôi học khoa học vào thứ Tư."
    },
    "Thursday": {
        "emoji": "📅",
        "example_en": "I have music on Thursday.",
        "example_vi": "Tôi học âm nhạc vào thứ Năm."
    },
    "Friday": {
        "emoji": "🎉",
        "example_en": "Friday is the last school day of the week.",
        "example_vi": "Thứ Sáu là ngày đi học cuối tuần."
    },
    "Saturday": {
        "emoji": "⚽",
        "example_en": "I play sports on Saturday.",
        "example_vi": "Tôi chơi thể thao vào thứ Bảy."
    },
    "Sunday": {
        "emoji": "🏖️",
        "example_en": "We visit grandparents on Sunday.",
        "example_vi": "Chúng tôi thăm ông bà vào Chủ nhật."
    },
    "yesterday": {
        "emoji": "⏮️",
        "example_en": "Where were you yesterday?",
        "example_vi": "Hôm qua bạn đã ở đâu?"
    },
    "weekday": {
        "emoji": "📆",
        "example_en": "I go to school on weekdays.",
        "example_vi": "Tôi đi học vào các ngày trong tuần."
    },
    "weekend": {
        "emoji": "🎈",
        "example_en": "Have a great weekend!",
        "example_vi": "Chúc bạn một kỳ nghỉ cuối tuần vui vẻ!"
    },
    "housework": {
        "emoji": "🧹",
        "example_en": "I help my parents with the housework.",
        "example_vi": "Tôi giúp bố mẹ làm việc nhà."
    },

    # Unit 4: Birthday & Months
    "birthday": {
        "emoji": "🎂",
        "example_en": "Happy birthday to you!",
        "example_vi": "Chúc mừng sinh nhật bạn!"
    },
    "party": {
        "emoji": "🥳",
        "example_en": "We are having a birthday party.",
        "example_vi": "Chúng tôi đang tổ chức tiệc sinh nhật."
    },
    "January": {
        "emoji": "❄️",
        "example_en": "My birthday is in January.",
        "example_vi": "Sinh nhật của tôi vào tháng Một."
    },
    "February": {
        "emoji": "🌸",
        "example_en": "Tet holiday is often in February.",
        "example_vi": "Tết Nguyên Đán thường rơi vào tháng Hai."
    },
    "March": {
        "emoji": "🌱",
        "example_en": "Spring begins in March.",
        "example_vi": "Mùa xuân bắt đầu vào tháng Ba."
    },
    "April": {
        "emoji": "🌧️",
        "example_en": "April has thirty days.",
        "example_vi": "Tháng Tư có 30 ngày."
    },
    "May": {
        "emoji": "🌺",
        "example_en": "May is warm and sunny.",
        "example_vi": "Tháng Năm ấm áp và có nắng."
    },
    "August": {
        "emoji": "🏖️",
        "example_en": "We go on holiday in August.",
        "example_vi": "Chúng tôi đi nghỉ vào tháng Tám."
    },
    "September": {
        "emoji": "🔔",
        "example_en": "The new school year starts in September.",
        "example_vi": "Năm học mới bắt đầu vào tháng Chín."
    },
    "October": {
        "emoji": "🎃",
        "example_en": "Halloween is in October.",
        "example_vi": "Lễ hội Halloween vào tháng Mười."
    },
    "November": {
        "emoji": "🍂",
        "example_en": "Teacher's Day is in November.",
        "example_vi": "Ngày Nhà giáo Việt Nam vào tháng Mười Một."
    },
    "December": {
        "emoji": "🎄",
        "example_en": "Christmas is in December.",
        "example_vi": "Giáng sinh vào tháng Mười Hai."
    },
    "story": {
        "emoji": "📖",
        "example_en": "My grandma tells me a bedtime story.",
        "example_vi": "Bà kể cho tôi nghe câu chuyện trước khi ngủ."
    },

    # Unit 5: Things we can do
    "can": {
        "emoji": "💪",
        "example_en": "I can ride a bike.",
        "example_vi": "Tôi có thể đạp xe."
    },
    "jump": {
        "emoji": "🦘",
        "example_en": "Can you jump high?",
        "example_vi": "Bạn có thể nhảy cao không?"
    },
    "ride (a bike)": {
        "en": "Ride a bike",
        "emoji": "🚲",
        "example_en": "I ride a bike to the park.",
        "example_vi": "Tôi đạp xe đến công viên."
    },
    "ride (a horse)": {
        "en": "Ride a horse",
        "emoji": "🐎",
        "example_en": "He can ride a horse very well.",
        "example_vi": "Cậu ấy có thể cưỡi ngựa rất giỏi."
    },
    "roller skate": {
        "emoji": "🛼",
        "example_en": "She loves to roller skate after school.",
        "example_vi": "Cô ấy thích trượt pa-tanh sau giờ học."
    },
    "play the guitar": {
        "emoji": "🎸",
        "example_en": "He can play the guitar nicely.",
        "example_vi": "Cậu ấy có thể chơi đàn ghi-ta rất hay."
    },
    "play the piano": {
        "emoji": "🎹",
        "example_en": "I practice playing the piano every day.",
        "example_vi": "Tôi luyện tập đánh đàn piano mỗi ngày."
    },
    "painter": {
        "emoji": "🎨",
        "example_en": "He is a famous painter.",
        "example_vi": "Ông ấy là một họa sĩ nổi tiếng."
    },
    "activity": {
        "emoji": "🎯",
        "example_en": "Reading is my favourite activity.",
        "example_vi": "Đọc sách là hoạt động yêu thích của tôi."
    },

    # Unit 6: School Facilities
    "building": {
        "emoji": "🏢",
        "example_en": "Our school has a big new building.",
        "example_vi": "Trường chúng tôi có một tòa nhà mới to lớn."
    },
    "computer room": {
        "emoji": "💻",
        "example_en": "We study IT in the computer room.",
        "example_vi": "Chúng tôi học tin học trong phòng máy tính."
    },
    "garden": {
        "emoji": "🌻",
        "example_en": "There are pretty flowers in the garden.",
        "example_vi": "Có nhiều hoa đẹp trong vườn."
    },
    "school garden": {
        "emoji": "🌳",
        "example_en": "We water the plants in the school garden.",
        "example_vi": "Chúng tôi tưới cây trong vườn trường."
    },
    "stay at home": {
        "emoji": "🏠",
        "example_en": "I stay at home on rainy days.",
        "example_vi": "Tôi ở nhà vào những ngày mưa."
    },

    # Unit 7 & 8: School Subjects
    "art": {
        "emoji": "🎨",
        "example_en": "We draw and paint in art class.",
        "example_vi": "Chúng tôi vẽ và tô màu trong giờ mĩ thuật."
    },
    "English": {
        "emoji": "🇬🇧",
        "example_en": "I love learning English songs.",
        "example_vi": "Tôi thích học những bài hát tiếng Anh."
    },
    "history and geography": {
        "emoji": "🗺️",
        "example_en": "We learn about mountains in history and geography.",
        "example_vi": "Chúng tôi tìm hiểu về núi non trong môn lịch sử và địa lí."
    },
    "IT (information technology)": {
        "en": "IT",
        "emoji": "🖥️",
        "example_en": "We use computers in IT class.",
        "example_vi": "Chúng tôi dùng máy tính trong giờ tin học."
    },
    "maths": {
        "emoji": "📐",
        "example_en": "I am good at maths.",
        "example_vi": "Tôi học giỏi môn toán."
    },
    "music": {
        "emoji": "🎵",
        "example_en": "We sing happy songs in music class.",
        "example_vi": "Chúng tôi hát những bài ca vui tươi trong giờ âm nhạc."
    },
    "PE (physical education)": {
        "en": "PE",
        "emoji": "🏃",
        "example_en": "We run and exercise in PE class.",
        "example_vi": "Chúng tôi chạy và tập thể dục trong giờ thể dục."
    },
    "science": {
        "emoji": "🔬",
        "example_en": "Science helps us understand nature.",
        "example_vi": "Môn khoa học giúp chúng ta hiểu về tự nhiên."
    },
    "Vietnamese": {
        "emoji": "🇻🇳",
        "example_en": "We read poetry in Vietnamese class.",
        "example_vi": "Chúng tôi đọc thơ trong giờ học tiếng Việt."
    },
    "subject": {
        "emoji": "📚",
        "example_en": "What is your favourite subject?",
        "example_vi": "Môn học yêu thích của bạn là gì?"
    },
    "study": {
        "emoji": "📖",
        "example_en": "I study hard every day.",
        "example_vi": "Tôi học tập chăm chỉ mỗi ngày."
    },
    "why": {
        "emoji": "❓",
        "example_en": "Why do you like English?",
        "example_vi": "Tại sao bạn thích tiếng Anh?"
    },
    "because": {
        "emoji": "💡",
        "example_en": "Because I want to talk to friends around the world.",
        "example_vi": "Bởi vì tôi muốn trò chuyện với bạn bè trên khắp thế giới."
    },

    # Unit 9: Sports Day & Outdoors
    "sports day": {
        "emoji": "🏅",
        "example_en": "When is your sports day?",
        "example_vi": "Khi nào là ngày hội thể thao của trường bạn?"
    },
    "outdoor": {
        "emoji": "🏕️",
        "example_en": "We enjoy outdoor games in the sun.",
        "example_vi": "Chúng tôi thích các trò chơi ngoài trời dưới ánh nắng."
    },
    "when": {
        "emoji": "🕒",
        "example_en": "When is the party?",
        "example_vi": "Khi nào buổi tiệc bắt đầu?"
    },
    "hat": {
        "emoji": "👒",
        "example_en": "Wear a hat when playing outdoors.",
        "example_vi": "Hãy đội mũ khi chơi ngoài trời nhé."
    },
    "last": {
        "emoji": "⏮️",
        "example_en": "I saw him last week.",
        "example_vi": "Tôi đã gặp cậu ấy vào tuần trước."
    },

    # Unit 10: Camp & Landscapes & Treats
    "campsite": {
        "emoji": "🏕️",
        "example_en": "Our campsite is near a beautiful lake.",
        "example_vi": "Địa điểm cắm trại của chúng tôi ở gần một hồ nước đẹp."
    },
    "beach": {
        "emoji": "🏖️",
        "example_en": "Children love playing on the beach.",
        "example_vi": "Trẻ em rất thích chơi trên bãi biển."
    },
    "mountains": {
        "emoji": "⛰️",
        "example_en": "The mountains are tall and misty.",
        "example_vi": "Những dãy núi cao và phủ sương mù."
    },
    "in the mountains": {
        "emoji": "🏔️",
        "example_en": "We went hiking in the mountains.",
        "example_vi": "Chúng tôi đã đi leo núi ở vùng núi."
    },
    "city": {
        "emoji": "🏙️",
        "example_en": "The city has tall buildings and busy streets.",
        "example_vi": "Thành phố có nhiều tòa nhà cao tầng và đường xá nhộn nhịp."
    },
    "town": {
        "emoji": "🏘️",
        "example_en": "My grandparents live in a small town.",
        "example_vi": "Ông bà tôi sống ở một thị trấn nhỏ."
    },
    "village": {
        "emoji": "🏡",
        "example_en": "The village is quiet and peaceful.",
        "example_vi": "Ngôi làng rất yên tĩnh và thanh bình."
    },
    "countryside": {
        "emoji": "🌾",
        "example_en": "I love fresh air in the countryside.",
        "example_vi": "Tôi yêu không khí trong lành ở miền quê."
    },
    "chips": {
        "emoji": "🍟",
        "example_en": "We eat crispy potato chips.",
        "example_vi": "Chúng tôi ăn khoai tây chiên giòn rụm."
    },
    "grape": {
        "emoji": "🍇",
        "example_en": "Sweet purple grapes are yummy.",
        "example_vi": "Những quả nho tím ngọt lịm thật ngon."
    },
    "jam": {
        "emoji": "🍓",
        "example_en": "I spread strawberry jam on bread.",
        "example_vi": "Tôi phết mứt dâu tây lên bánh mì."
    },
    "lemonade": {
        "emoji": "🍋",
        "example_en": "A glass of cold lemonade is refreshing.",
        "example_vi": "Một ly nước chanh mát lạnh thật sảng khoái."
    }
}

# Grouping units
unit_mapping = [
    {
        "id": "lop4_u1_friends",
        "gradeId": "lop4",
        "name_vi": "Unit 1: Bạn Bè & Quốc Gia",
        "name_en": "Unit 1: My Friends",
        "emoji": "🌍",
        "color": "from-cyan-400 to-blue-500",
        "gradient": "bg-gradient-to-br from-cyan-100 to-blue-100",
        "words_key": ["Viet Nam", "America", "Australia", "Britain", "Japan", "Malaysia", "Singapore", "Thailand", "Bangkok", "London", "Sydney", "Tokyo"]
    },
    {
        "id": "lop4_u2_time",
        "gradeId": "lop4",
        "name_vi": "Unit 2: Thời Gian & Thói Quen",
        "name_en": "Unit 2: Time & Daily Routines",
        "emoji": "⏰",
        "color": "from-amber-400 to-orange-500",
        "gradient": "bg-gradient-to-br from-amber-100 to-orange-100",
        "words_key": ["o'clock", "thirty", "forty-five", "get up", "have (breakfast)", "go (to school)", "go (to bed)", "wash", "today"]
    },
    {
        "id": "lop4_u3_week",
        "gradeId": "lop4",
        "name_vi": "Unit 3: Các Ngày Trong Tuần",
        "name_en": "Unit 3: My Week",
        "emoji": "📅",
        "color": "from-emerald-400 to-teal-500",
        "gradient": "bg-gradient-to-br from-emerald-100 to-teal-100",
        "words_key": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday", "yesterday", "weekday", "weekend", "housework"]
    },
    {
        "id": "lop4_u4_birthday",
        "gradeId": "lop4",
        "name_vi": "Unit 4: Sinh Nhật & 12 Tháng",
        "name_en": "Unit 4: My Birthday",
        "emoji": "🎂",
        "color": "from-pink-400 to-rose-500",
        "gradient": "bg-gradient-to-br from-pink-100 to-rose-100",
        "words_key": ["birthday", "party", "January", "February", "March", "April", "May", "August", "September", "October", "November", "December", "story"]
    },
    {
        "id": "lop4_u5_skills",
        "gradeId": "lop4",
        "name_vi": "Unit 5: Kỹ Năng & Hoạt Động",
        "name_en": "Unit 5: Things We Can Do",
        "emoji": "🤸",
        "color": "from-violet-400 to-purple-500",
        "gradient": "bg-gradient-to-br from-violet-100 to-purple-100",
        "words_key": ["can", "jump", "ride (a bike)", "ride (a horse)", "roller skate", "play the guitar", "play the piano", "painter", "activity"]
    },
    {
        "id": "lop4_u6_school",
        "gradeId": "lop4",
        "name_vi": "Unit 6: Trường Học Của Em",
        "name_en": "Unit 6: Our School",
        "emoji": "🏫",
        "color": "from-blue-400 to-indigo-500",
        "gradient": "bg-gradient-to-br from-blue-100 to-indigo-100",
        "words_key": ["building", "computer room", "garden", "school garden", "stay at home"]
    },
    {
        "id": "lop4_u7_8_subjects",
        "gradeId": "lop4",
        "name_vi": "Unit 7-8: Các Môn Học",
        "name_en": "Unit 7-8: School Subjects",
        "emoji": "📚",
        "color": "from-lime-400 to-green-500",
        "gradient": "bg-gradient-to-br from-lime-100 to-green-100",
        "words_key": ["art", "English", "history and geography", "IT (information technology)", "maths", "music", "PE (physical education)", "science", "Vietnamese", "subject", "study", "why", "because"]
    },
    {
        "id": "lop4_u9_sports",
        "gradeId": "lop4",
        "name_vi": "Unit 9: Hội Thao Trường Em",
        "name_en": "Unit 9: Our Sports Day",
        "emoji": "🏆",
        "color": "from-yellow-400 to-amber-500",
        "gradient": "bg-gradient-to-br from-yellow-100 to-amber-100",
        "words_key": ["sports day", "outdoor", "when", "hat", "last"]
    },
    {
        "id": "lop4_u10_camp",
        "gradeId": "lop4",
        "name_vi": "Unit 10: Trại Hè & Quê Hương",
        "name_en": "Unit 10: Our Summer Camp",
        "emoji": "🏕️",
        "color": "from-orange-400 to-red-500",
        "gradient": "bg-gradient-to-br from-orange-100 to-red-100",
        "words_key": ["campsite", "beach", "mountains", "in the mountains", "city", "town", "village", "countryside", "chips", "grape", "jam", "lemonade"]
    }
]

# Find word in extracted list
def find_extracted(key):
    for w in words:
        if w['en'].strip().lower() == key.strip().lower():
            return w
    return None

categories_output = []
covered_count = 0

for u in unit_mapping:
    cat_obj = {
        "id": u["id"],
        "gradeId": u["gradeId"],
        "name_vi": u["name_vi"],
        "name_en": u["name_en"],
        "emoji": u["emoji"],
        "color": u["color"],
        "gradient": u["gradient"],
        "words": []
    }
    for wkey in u["words_key"]:
        ext = find_extracted(wkey)
        item = data.get(wkey, {})
        en = item.get("en", ext.get("en") if ext else wkey)
        vi = ext.get("vi") if ext else ""
        phonetic = ext.get("phonetic") if ext else ""
        emoji = item.get("emoji", "📝")
        example_en = item.get("example_en", f"This is {en.lower()}.")
        example_vi = item.get("example_vi", f"Đây là {en.lower()}.")
        
        # Clean id
        cid = "l4_" + re.sub(r'[^a-z0-9]+', '_', en.lower()).strip('_')
        
        cat_obj["words"].append({
            "id": cid,
            "en": en,
            "vi": vi,
            "phonetic": phonetic,
            "emoji": emoji,
            "example_en": example_en,
            "example_vi": example_vi
        })
        covered_count += 1
    categories_output.append(cat_obj)

print(f"Total words organized: {covered_count} / {len(words)}")

# Save to scratch
with open('d:/engl/vocakids/scratch/lop4_final_categories.json', 'w', encoding='utf-8') as fp:
    json.dump(categories_output, fp, ensure_ascii=False, indent=2)

print("Saved d:/engl/vocakids/scratch/lop4_final_categories.json")
