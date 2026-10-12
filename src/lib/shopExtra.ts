/** Extra everyday products for the Little Market. One product per line: English | Vietnamese | exact emoji (optional) | grammar. */
export type ShopProduct = readonly [en: string, vi: string, emoji: string, grammar: 'auto' | 'a' | 'an' | 'some' | 'pair'];
export type ShopProductGroup = { id: string; name: string; emoji: string; items: ShopProduct[] };

function products(rows: string): ShopProduct[] {
  return rows.trim().split('\n').map(line => {
    const [en, vi, emoji = '', grammar = 'auto'] = line.split('|').map(value => value.trim());
    return [en, vi, emoji, grammar as ShopProduct[3]];
  });
}

export const extraShopGroups: ShopProductGroup[] = [
  { id: 'vegetables', name: 'Rau củ & gia vị tươi', emoji: '🥬', items: products(`
carrot|cà rốt|🥕
potato|khoai tây|🥔
sweet potato|khoai lang|🍠
tomato|cà chua|🍅
cucumber|dưa leo|🥒
pumpkin|bí đỏ|🎃
cabbage|bắp cải|🥬
cauliflower|súp lơ trắng|
broccoli|bông cải xanh|🥦
eggplant|cà tím|🍆
okra|đậu bắp|
spinach|rau bina|🥬|some
water spinach|rau muống|🥬|some
lettuce|rau xà lách|🥬|some
mustard greens|cải xanh|🥬|some
bok choy|cải thìa|🥬|some
celery|cần tây|🥬|some
spring onion|hành lá|🧅
onion|củ hành tây|🧅
garlic|củ tỏi|🧄
ginger|củ gừng|🫚
chili pepper|quả ớt|🌶️
bell pepper|ớt chuông|🫑
mushroom|nấm|🍄
corn|bắp ngô|🌽
bean sprouts|giá đỗ||some
green beans|đậu cô ve||some
long beans|đậu đũa||some
bitter melon|mướp đắng|
bottle gourd|quả bầu|
chayote|su su|
radish|củ cải|🥬
taro|khoai môn|
lotus root|ngó sen|
basil|rau húng quế|🌿|some
cilantro|rau mùi|🌿|some
lemongrass|sả|🌿|some
`) },
  { id: 'protein', name: 'Thịt, cá & đậu', emoji: '🐟', items: products(`
pork|thịt heo|🥩|some
beef|thịt bò|🥩|some
chicken meat|thịt gà|🍗|some
duck meat|thịt vịt|🍗|some
fresh fish|cá tươi|🐟|some
shrimp|tôm|🦐|some
crab|con cua|🦀
squid|mực|🦑|some
clam|con nghêu|🦪
oyster|con hàu|🦪
mussel|con vẹm|🦪
snail|con ốc|🐌
eel|con lươn|
catfish|cá trê|🐟
salmon|cá hồi|🐟|some
tuna|cá ngừ|🐟|some
mackerel|cá thu|🐟|some
sardine|cá mòi|🐟
anchovy|cá cơm|🐟
dried fish|cá khô|🐟|some
fish ball|viên cá|
meatball|viên thịt|
sausage|xúc xích|🌭
ham|giăm bông|🥓|some
bacon|thịt ba chỉ xông khói|🥓|some
pork rib|sườn heo|🥩
chicken wing|cánh gà|🍗
chicken thigh|đùi gà|🍗
pork belly|thịt ba chỉ|🥩|some
beef steak|bít tết bò|🥩
tofu|đậu phụ|⬜|some
quail egg|trứng cút|🥚
duck egg|trứng vịt|🥚
salted egg|trứng muối|🥚
dried shrimp|tôm khô|🦐|some
fish cake|chả cá|
crab stick|thanh cua|
`) },
  { id: 'pantry', name: 'Gạo, bột & nước chấm', emoji: '🍚', items: products(`
rice noodles|bánh phở||some
rice vermicelli|bún tươi||some
instant noodles|mì ăn liền|🍜|some
dried noodles|mì khô|🍜|some
sticky rice grains|gạo nếp|🍚|some
rice flour|bột gạo||some
wheat flour|bột mì||some
tapioca starch|bột năng||some
cornstarch|bột bắp||some
sugar|đường||some
salt|muối|🧂|some
black pepper|tiêu đen||some
cooking oil|dầu ăn||some
sesame oil|dầu mè||some
fish sauce|nước mắm||some
soy sauce|nước tương||some
oyster sauce|dầu hào||some
chili sauce|tương ớt|🌶️|some
tomato sauce|sốt cà chua|🍅|some
vinegar|giấm||some
coconut milk|nước cốt dừa|🥥|some
condensed milk|sữa đặc|🥛|some
butter|bơ sữa|🧈|some
honey|mật ong|🍯|some
fruit jam|mứt trái cây|🫙|some
peanut butter|bơ đậu phộng|🥜|some
roasted peanuts|đậu phộng rang|🥜|some
sesame seeds|hạt mè||some
mung beans|đậu xanh||some
black beans|đậu đen||some
red beans|đậu đỏ||some
dried mushrooms|nấm khô|🍄|some
dried seaweed|rong biển khô||some
rice paper|bánh tráng||some
spring roll wrappers|vỏ bánh đa nem||some
bread crumbs|vụn bánh mì|🍞|some
baking powder|bột nở||some
`) },
  { id: 'vietnamese_meals', name: 'Món ăn Việt', emoji: '🍲', items: products(`
bowl of beef pho|tô phở bò|🍜
bowl of chicken pho|tô phở gà|🍜
bowl of bun bo Hue|tô bún bò Huế|🍜
plate of bun cha|suất bún chả|🍜
banh mi sandwich|ổ bánh mì kẹp|🥖
banh xeo pancake|bánh xèo|🥞
plate of broken rice|đĩa cơm tấm|🍚
plate of fried rice|đĩa cơm chiên|🍚
plate of chicken rice|đĩa cơm gà|🍚
sticky rice parcel|gói xôi|🍚
banh chung|bánh chưng|🍙
banh tet|bánh tét|🍙
plate of steamed rice rolls|đĩa bánh cuốn|
fresh spring roll|gỏi cuốn|
fried spring roll|nem rán|
rice pancake|bánh khọt|🥞
bowl of crab noodle soup|tô bún riêu cua|🍜
bowl of fish noodle soup|tô bún cá|🍜
bowl of hu tieu|tô hủ tiếu|🍜
bowl of mi Quang|tô mì Quảng|🍜
bowl of cao lau|tô cao lầu|🍜
bowl of banh canh|tô bánh canh|🍜
plate of grilled pork noodles|đĩa bún thịt nướng|🍜
plate of stir-fried noodles|đĩa mì xào|🍜
bowl of congee|tô cháo|🥣
chicken congee|cháo gà|🥣|some
beef stew|bò kho|🍲|some
braised pork|thịt kho|🍲|some
caramelized fish|cá kho|🍲|some
sour fish soup|canh chua cá|🍲|some
vegetable soup|canh rau|🍲|some
omelette|trứng chiên|🍳|an
steamed egg|trứng hấp|🍳
grilled corn|bắp nướng|🌽|some
boiled sweet potato|khoai lang luộc|🍠|some
grilled rice paper|bánh tráng nướng|
banana fritter|bánh chuối chiên|🍌
`) },
  { id: 'drinks_sweets', name: 'Đồ uống & món ngọt', emoji: '🧋', items: products(`
iced coffee|cà phê đá|☕|some
hot coffee|cà phê nóng|☕|some
milk tea|trà sữa|🧋|some
lemon tea|trà chanh|🍋|some
green tea|trà xanh|🍵|some
lotus tea|trà sen|🍵|some
orange juice|nước cam|🍊|some
sugarcane juice|nước mía|🥤|some
coconut water|nước dừa|🥥|some
bottled water|nước đóng chai|💧|some
soda|nước ngọt có ga|🥤|some
yogurt|sữa chua|🥛|some
soy milk|sữa đậu nành|🥛|some
almond milk|sữa hạnh nhân|🥛|some
hot chocolate|sô cô la nóng|☕|some
lemonade|nước chanh|🍋|some
passion fruit juice|nước chanh dây|🥤|some
guava juice|nước ổi|🥤|some
watermelon juice|nước ép dưa hấu|🍉|some
mango smoothie|sinh tố xoài|🥭|some
avocado smoothie|sinh tố bơ|🥑|some
strawberry smoothie|sinh tố dâu|🍓|some
fruit tea|trà trái cây|🫖|some
herbal tea|trà thảo mộc|🍵|some
iced tea|trà đá|🧊|some
black coffee|cà phê đen|☕|some
egg coffee|cà phê trứng|☕|some
flan|bánh flan|🍮|some
che dessert|chè ngọt|🍧|some
black bean dessert|chè đậu đen|🍧|some
sweet corn pudding|chè bắp|🍮|some
fruit jelly|thạch trái cây|🍮|some
grass jelly|sương sáo|🍮|some
sticky rice cake|bánh nếp|🍡
sesame ball|bánh rán mè|🍡
rice cracker|bánh gạo giòn|🍘
banana cake|bánh chuối|🍌
`) },
  { id: 'cookware', name: 'Đồ dùng nhà bếp', emoji: '🍳', items: products(`
rice cooker|nồi cơm điện|🍚
electric kettle|ấm đun siêu tốc|🫖|an
tea kettle|ấm đun nước|🫖
frying pan|chảo rán|🍳
saucepan|nồi nhỏ|
stockpot|nồi lớn|
pressure cooker|nồi áp suất|
steamer|nồi hấp|
wok|chảo sâu lòng|
spatula|xẻng lật đồ ăn|
ladle|muôi múc canh|🥄
pair of chopsticks|đôi đũa|🥢
spoon|cái thìa|🥄
fork|cái nĩa|🍴
kitchen knife|dao bếp|🔪
dinner plate|đĩa ăn|🍽️
rice bowl|bát ăn cơm|🥣
teacup|chén trà|🍵
coffee mug|cốc uống cà phê|☕
drinking glass|ly uống nước|🥛
serving tray|khay đựng thức ăn|
cutting board|thớt|
colander|rổ lọc|
strainer|cái rây|
grater|bàn nạo|
can opener|đồ mở hộp|
bottle opener|đồ mở chai|
pair of kitchen tongs|kẹp gắp thức ăn|
whisk|phới đánh trứng|
rolling pin|cây cán bột|
food container|hộp đựng thức ăn|
lunch box|hộp cơm|🍱
thermos|bình giữ nhiệt|
water bottle|bình nước|🍼
dish rack|giá úp bát|
dish towel|khăn lau bát|
apron|tạp dề|👨‍🍳|an
`) },
  { id: 'home', name: 'Đồ dùng trong nhà', emoji: '🏠', items: products(`
sofa|ghế sofa|🛋️
armchair|ghế bành|🪑|an
wooden chair|ghế gỗ|🪑
coffee table|bàn trà|
dining table|bàn ăn|
work desk|bàn làm việc|🖥️
bed|giường ngủ|🛏️
mattress|nệm|
pillow|gối nằm|🛏️
blanket|chăn|🛏️
bedsheet|ga trải giường|
curtain|rèm cửa|
wardrobe|tủ quần áo|
bookshelf|kệ sách|📚
kitchen cabinet|tủ bếp|
wall shelf|kệ treo tường|
drawer|ngăn kéo|
stool|ghế đẩu|🪑
bench|ghế dài|🪑
mirror|gương soi|🪞
wall clock|đồng hồ treo tường|🕒
floor lamp|đèn đứng|💡
desk lamp|đèn bàn|💡
electric fan|quạt điện|🪭|an
air conditioner|máy điều hòa|❄️|an
television|ti vi|📺
refrigerator|tủ lạnh|🧊
washing machine|máy giặt|
vacuum cleaner|máy hút bụi|
clothes iron|bàn là|♨️
clothes hanger|móc áo|
laundry basket|giỏ đựng đồ giặt|🧺
doormat|thảm chùi chân|
floor rug|thảm trải sàn|
flower vase|lọ hoa|🏺
plant pot|chậu cây|🪴
trash can|thùng rác|🗑️
`) },
  { id: 'cleaning', name: 'Giặt giũ & dọn dẹp', emoji: '🧹', items: products(`
broom|chổi quét nhà|🧹
mop|cây lau nhà|🧹
dustpan|hót rác|
bucket|xô nước|🪣
sponge|miếng bọt biển|🧽
scrub brush|bàn chải cọ rửa|🪥
dish soap|nước rửa chén||some
laundry detergent|nước giặt||some
fabric softener|nước xả vải||some
bleach|thuốc tẩy||some
floor cleaner|nước lau sàn||some
glass cleaner|nước lau kính||some
liquid hand soap|nước rửa tay||some
hand sanitizer|gel sát khuẩn tay||some
disinfectant|chất khử trùng||some
toilet cleaner|nước tẩy bồn cầu||some
trash bag|túi rác|🗑️
paper towel|khăn giấy cuộn|
tissue box|hộp khăn giấy|
wet wipe|khăn giấy ướt|
cleaning cloth|giẻ lau|
microfiber cloth|khăn lau sợi nhỏ|
pair of rubber gloves|đôi găng tay cao su|🧤
cleaning brush|bàn chải vệ sinh|
lint roller|cây lăn bụi|
clothesline|dây phơi đồ|
clothespin|kẹp phơi đồ|
drying rack|giàn phơi đồ|
laundry bag|túi đựng đồ giặt|
detergent powder|bột giặt||some
stain remover|chất tẩy vết bẩn||some
air freshener|chai xịt thơm phòng|
shoe brush|bàn chải đánh giày|
shoe polish|xi đánh giày||some
drain cleaner|chất thông cống||some
bar of soap|bánh xà phòng|🧼
toilet brush|cọ bồn cầu|
`) },
  { id: 'personal_care', name: 'Chăm sóc cá nhân', emoji: '🪥', items: products(`
toothbrush|bàn chải đánh răng|🪥
toothpaste|kem đánh răng||some
dental floss|chỉ nha khoa||some
mouthwash|nước súc miệng||some
shampoo|dầu gội||some
hair conditioner|dầu xả||some
body wash|sữa tắm||some
face wash|sữa rửa mặt||some
facial cleanser|gel làm sạch mặt||some
sunscreen|kem chống nắng||some
moisturizer|kem dưỡng ẩm||some
body lotion|sữa dưỡng thể||some
hairbrush|lược chải tóc|
comb|cái lược|
hair dryer|máy sấy tóc|
razor|dao cạo râu|🪒
shaving cream|kem cạo râu||some
nail clipper|bấm móng tay|💅
cotton swab|tăm bông|
cotton pad|bông tẩy trang|
bath towel|khăn tắm|
face towel|khăn mặt|
shower cap|mũ tắm|
shower head|vòi sen|🚿
bath mat|thảm nhà tắm|
toilet paper|giấy vệ sinh|🧻|some
sanitary pad|băng vệ sinh|
bandage|băng cá nhân|🩹
thermometer|nhiệt kế|🌡️
hand cream|kem dưỡng tay||some
lip balm|son dưỡng môi||some
perfume|nước hoa||some
deodorant|lăn khử mùi||some
talcum powder|phấn rôm||some
hair tie|dây buộc tóc|
hair clip|kẹp tóc|
face mask|khẩu trang|😷
`) },
  { id: 'school_tech', name: 'Học tập & công nghệ', emoji: '📱', items: products(`
eraser|cục tẩy|
marker|bút lông|
highlighter|bút đánh dấu|
glue stick|thỏi keo dán|
sticky note|giấy ghi chú|
folder|bìa hồ sơ|📁
binder|bìa còng|📒
paper clip|kẹp giấy|📎
stapler|dập ghim|
staple|chiếc ghim bấm|
adhesive tape|băng dính|
compass|compa học sinh|📐
protractor|thước đo góc|📐
watercolor set|bộ màu nước|🎨
paintbrush|cọ vẽ|🖌️
sketchbook|sổ vẽ|📓
whiteboard|bảng trắng|
chalk|viên phấn|
name tag|thẻ tên|🏷️
pencil case|hộp bút|
school uniform|đồng phục học sinh|👕
laptop|máy tính xách tay|💻
tablet|máy tính bảng|📱
smartphone|điện thoại thông minh|📱
keyboard|bàn phím|⌨️
computer mouse|chuột máy tính|🖱️
phone charger|sạc điện thoại|🔌
power bank|pin dự phòng|🔋
headphones|tai nghe chụp tai|🎧|some
earphones|tai nghe nhét tai|🎧|some
printer|máy in|🖨️
USB drive|ổ USB|💾|a
camera|máy ảnh|📷
flashlight|đèn pin|🔦
battery|viên pin|🔋
webcam|máy quay web|📷
phone case|ốp điện thoại|📱
`) },
  { id: 'fashion', name: 'Trang phục & phụ kiện', emoji: '👕', items: products(`
jeans|quần jean|👖|some
trousers|quần dài|👖|some
shorts|quần đùi|🩳|some
skirt|chân váy|👗
blouse|áo kiểu nữ|👚
sweater|áo len|🧥
cardigan|áo khoác len|🧥
jacket|áo khoác ngắn|🧥
raincoat|áo mưa|🧥
pajamas|đồ ngủ|👕|some
underwear|đồ lót|🩲|some
swimsuit|đồ bơi|👙
pair of sandals|đôi dép quai hậu|👡
pair of slippers|đôi dép đi trong nhà|🩴
pair of flip-flops|đôi dép xỏ ngón|🩴
pair of sneakers|đôi giày thể thao|👟
pair of socks|đôi tất|🧦
belt|thắt lưng|
wallet|ví tiền|👛
handbag|túi xách|👜
tote bag|túi vải|👜
conical hat|nón lá|👒
bicycle helmet|mũ bảo hiểm xe đạp|⛑️
sunglasses|kính râm|🕶️|some
wristwatch|đồng hồ đeo tay|⌚
bracelet|vòng tay|📿
necklace|dây chuyền|📿
pair of earrings|đôi bông tai|💎
ring|nhẫn|💍
hairband|băng đô tóc|
necktie|cà vạt|👔
bow tie|nơ cổ áo|🎀
ao dai|áo dài Việt Nam|👗|an
traditional robe|áo choàng truyền thống|
pair of rain boots|đôi ủng đi mưa|🥾
pair of mittens|đôi găng tay len|🧤
anklet|vòng chân|📿|an
`) },
  { id: 'festival_outdoor', name: 'Ngày hội & ngoài trời', emoji: '🏮', items: products(`
mooncake|bánh trung thu|🥮
lantern|đèn lồng|🏮
red envelope|bao lì xì|🧧
incense stick|que nhang|🕯️|an
candle|nến|🕯️
flower bouquet|bó hoa|💐
lucky bamboo|cây phát tài|🎋
greeting card|thiệp chúc mừng|💌
wrapping paper|giấy gói quà|🎁|some
gift bag|túi quà|🛍️
birthday candle|nến sinh nhật|🕯️
balloon|bóng bay|🎈
party hat|mũ tiệc|🥳
toy blocks|bộ xếp hình|🧱|some
board game|trò chơi bàn cờ|🎲
skipping rope|dây nhảy|
bicycle|xe đạp|🚲
scooter|xe trượt chân|🛴
badminton racket|vợt cầu lông|🏸
shuttlecock|quả cầu lông|🏸
swimming goggles|kính bơi|🥽|some
water gun|súng nước|🔫
sand toy|đồ chơi cát|🪣
pet food|thức ăn thú cưng|🐾|some
dog leash|dây dắt chó|🐕
cat litter|cát vệ sinh cho mèo|🐈|some
bird cage|lồng chim|🐦
fish tank|bể cá|🐠
vegetable seeds|hạt giống rau|🌱|some
flower seeds|hạt giống hoa|🌸|some
garden hose|ống tưới vườn|
watering can|bình tưới cây|🚿
garden shovel|xẻng làm vườn|
garden rake|cào làm vườn|
insect spray|chai xịt côn trùng|
mosquito net|màn chống muỗi|🦟
picnic mat|thảm dã ngoại|🧺
`) },
];
