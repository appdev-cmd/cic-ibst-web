import { useState, useMemo, useEffect } from 'react';
import {
  Search,
  BookOpen,
  Users,
  MapPin,
  Activity,
  Phone,
  Mail,
  FileText,
  ChevronRight,
  ChevronDown,
  ArrowLeft,
  Building,
  Calendar,
  Layers,
  Award,
  ShieldCheck,
  Info,
  Wrench,
  Sun,
  Moon,
  Leaf,
  Settings,
  Check,
  ZoomIn,
  ZoomOut,
  Globe,
  Eye,
  Volume2
} from 'lucide-react';
import { useTheme, PRIMARY_COLORS } from './context/ThemeContext';
import { cn } from './lib/utils';
import { Chatbot } from './components/Chatbot';
// --- MOCK DATA FOR ALL SITEMAP SECTIONS ---

const LEADERS = [
  { 
    name: 'Nguyễn Hồng Hải', 
    role: 'Viện trưởng', 
    phone: '024 37544196', 
    email: 'hainh@ibst.vn', 
    room: 'Phòng 402 - Nhà điều hành',
    initials: 'HH',
    avatarBg: 'from-blue-600 to-indigo-600'
  },
  { 
    name: 'Đinh Quốc Dân', 
    role: 'Phó Viện trưởng', 
    phone: '024 37544197', 
    email: 'dandq@ibst.vn', 
    room: 'Phòng 403 - Nhà điều hành',
    initials: 'QD',
    avatarBg: 'from-teal-600 to-emerald-600'
  },
  { 
    name: 'Nguyễn Thanh Bình', 
    role: 'Phó Viện trưởng', 
    phone: '024 37544198', 
    email: 'binhnt@ibst.vn', 
    room: 'Phòng 404 - Nhà điều hành',
    initials: 'TB',
    avatarBg: 'from-amber-600 to-orange-600'
  },
  { 
    name: 'Cao Duy Khôi', 
    role: 'Phó Viện trưởng', 
    phone: '024 37544199', 
    email: 'khoicd@ibst.vn', 
    room: 'Phòng 405 - Nhà điều hành',
    initials: 'DK',
    avatarBg: 'from-purple-600 to-violet-600'
  },
];

const UNITS = [
  { code: 'P.QLKH', name: 'Phòng Quản lý Khoa học & Tiêu chuẩn', type: 'Nghiệp vụ', head: 'TS. Vũ Thành Trung' },
  { code: 'P.KHTC', name: 'Phòng Kế hoạch Tài chính', type: 'Nghiệp vụ', head: 'ThS. Nguyễn Thị Mai' },
  { code: 'P.TCHC', name: 'Phòng Tổ chức Hành chính', type: 'Nghiệp vụ', head: 'ThS. Lê Hoàng Nam' },
  { code: 'PVMN', name: 'Phân viện KHCN Xây dựng miền Nam', type: 'Phân viện trực thuộc', head: 'PGS. TS. Lê Văn Huy', loc: 'TP. Hồ Chí Minh' },
  { code: 'PVMT', name: 'Phân viện KHCN Xây dựng miền Trung', type: 'Phân viện trực thuộc', head: 'TS. Nguyễn Quốc Đạt', loc: 'Đà Nẵng' },
  { code: 'IBST-COTEC', name: 'Trung tâm Tư vấn Thiết kế và Xây dựng', type: 'Chuyên môn', head: 'ThS. Đỗ Duy Hải' },
  { code: 'IBST-LIMS', name: 'Văn phòng Công nhận Chất lượng Phòng thí nghiệm', type: 'Chuyên môn', head: 'TS. Hoàng Minh Đức' },
  { code: 'TT.ĐB', name: 'Trung tâm Địa kỹ thuật và Trắc địa công trình', type: 'Chuyên môn', head: 'TS. Phạm Anh Tuấn' },
  { code: 'TT.BT', name: 'Trung tâm Bê tông & Vật liệu xây dựng', type: 'Chuyên môn', head: 'PGS. TS. Hoàng Minh Giang' },
  { code: 'TT.KC', name: 'Trung tâm Kết cấu công trình xây dựng', type: 'Chuyên môn', head: 'TS. Bùi Danh Nam' },
];

const LABS = [
  { 
    code: 'LAS-XD 01', 
    name: 'Phòng thí nghiệm Trọng điểm Quốc gia về Đường bộ & Địa kỹ thuật', 
    type: 'Cấp Quốc gia', 
    capacity: 'Trang bị hệ thống thí nghiệm nén ba trục tĩnh và động, siêu âm khuyết tật cọc khoan nhồi đường kính lớn, đo lường sức chịu tải đất nền và neo đất sâu.',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=600&auto=format&fit=crop'
  },
  { 
    code: 'LAS-XD 18', 
    name: 'Phòng thí nghiệm Chịu lửa và Phòng cháy chữa cháy', 
    type: 'Cấp Bộ', 
    capacity: 'Sở hữu lò thử lửa buồng đứng 3m x 3m và lò ngang đạt chuẩn ISO 834. Xác định chính xác giới hạn chịu lửa EI 120, RE 180 của tường ngăn, dầm sàn, cửa chống cháy.',
    image: 'https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?q=80&w=600&auto=format&fit=crop'
  },
  { 
    code: 'LAS-XD 09', 
    name: 'Phòng thí nghiệm Khí động học & Hầm gió mô phỏng', 
    type: 'Cấp Quốc gia', 
    capacity: 'Trang bị hầm gió động lực học giả lập bão cấp 17 phục vụ đo ứng lực gió lên bề mặt kính nhà siêu cao tầng, phân tích dao động khí động học kết cấu nhịp lớn.',
    image: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?q=80&w=600&auto=format&fit=crop'
  },
  { 
    code: 'LAS-XD 38', 
    name: 'Phòng thí nghiệm Bê tông & Hóa phẩm xây dựng', 
    type: 'Cấp Viện', 
    capacity: 'Phân tích thiết kế cấp phối bê tông siêu tính năng UHPC (cường độ >150 MPa), bê tông tự lèn thân thiện môi trường, đo độ ăn mòn xâm thực Clorua và cacbonat hóa.',
    image: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?q=80&w=600&auto=format&fit=crop'
  },
  { 
    code: 'LAS-XD 25', 
    name: 'Phòng thí nghiệm Kết cấu công trình & Thử nghiệm động lực học', 
    type: 'Cấp Viện', 
    capacity: 'Hệ thống kích thủy lực đa điểm tải trọng đến 1000 tấn. Đo ứng suất mỏi cấu kiện thép, thử nghiệm tĩnh học và mô phỏng dao động động đất kết cấu bê tông.',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=600&auto=format&fit=crop'
  }
];

const NEWS_ARTICLES = [
  {
    id: 'n1',
    category: 'tin-hoat-dong',
    title: 'Hội thảo Quốc tế về Xu hướng Biên soạn Quy chuẩn Phòng cháy chữa cháy cho Nhà và Công trình',
    date: '2026-07-15',
    summary: 'IBST chủ trì hội thảo thảo luận các nội dung soát xét QCVN 06 mới nhằm phù hợp thực tiễn phát triển đô thị Việt Nam và tiệm cận tiêu chuẩn quốc tế ISO, NFPA.',
    content: 'Ngày 15/07/2026, Viện Khoa học công nghệ xây dựng (IBST) đã phối hợp với các chuyên gia cứu hỏa quốc tế tổ chức Hội thảo kỹ thuật lớn bàn về phương hướng sửa đổi Quy chuẩn kỹ thuật quốc gia về An toàn cháy cho nhà và công trình (QCVN 06:2026/BXD). Tại hội thảo, PGS. TS. Trần Việt Hùng đã trình bày báo cáo về các giải pháp kỹ thuật an toàn phòng cháy chủ động và thụ động, các phương pháp tính toán giới hạn chịu lửa cấu kiện phù hợp với năng lực thử nghiệm lò đứng, lò ngang tại trạm thử nghiệm chịu lửa quốc gia Hòa Lạc.',
    author: 'Phòng Quản lý Khoa học',
    image: 'https://ibst.vn/upload/images/news/small_1783400049toancanh.jpg',
    readTime: '4 phút đọc',
    views: '1.5k'
  },
  {
    id: 'n2',
    category: 'du-an-trong-diem',
    title: 'Nghiệm thu gói thầu Kiểm định độc lập chất lượng thi công Nhà ga hành khách - Cảng hàng không Quốc tế Long Thành',
    date: '2026-06-28',
    summary: 'Đoàn công tác của Hội đồng kiểm tra nhà nước và Lãnh đạo IBST đã tiến hành đánh giá chất lượng thi công bê tông khối lớn móng và kết cấu thép mái vòm dự án Long Thành.',
    content: 'Là đơn vị tư vấn kiểm định đầu ngành phục vụ Hội đồng Kiểm tra Nhà nước về công tác nghiệm thu công trình xây dựng, IBST đã thiết lập văn phòng hiện trường và huy động hệ thống thiết bị siêu âm bê tông khuyết tật, đo ứng suất cốt thép nhập khẩu từ Đức để kiểm tra chất lượng kết cấu nhà ga Long Thành. Báo cáo độc lập của Viện được hội đồng đánh giá cao, đảm bảo chất lượng công trình an toàn tuyệt đối trước khi bước sang giai đoạn hoàn thiện nội thất.',
    author: 'Trung tâm Địa kỹ thuật',
    image: 'https://ibst.vn/upload/images/news/small_1783072918130-10.jpg',
    readTime: '6 phút đọc',
    views: '2.8k'
  },
  {
    id: 'n3',
    category: 'quy-chuan-tieu-chuan',
    title: 'Biên soạn Tiêu chuẩn Quốc gia TCVN về Thiết kế Địa kỹ thuật - Móng cọc theo định hướng mới Eurocode 7',
    date: '2026-05-18',
    summary: 'IBST hoàn thiện dự thảo soát xét tiêu chuẩn thiết kế móng cọc, áp dụng phương pháp thiết kế theo trạng thái giới hạn (Limit State Design) đồng bộ hóa với hệ thống tiêu chuẩn Eurocode.',
    content: 'Nhiệm vụ biên soạn tiêu chuẩn do Bộ Xây dựng giao Viện KHCN Xây dựng chủ trì thực hiện nhằm thay thế các tiêu chuẩn cũ vốn tính toán dựa trên hệ số an toàn đơn nhất (global safety factor). Tiêu chuẩn mới đưa vào các hệ số an toàn riêng (partial factors) cho tải trọng và sức chịu tải của đất nền, giúp tính toán móng cọc tối ưu kinh tế mà vẫn đảm bảo độ tin cậy kết cấu theo thông lệ quốc tế.',
    author: 'Phòng Quản lý Khoa học',
    image: 'https://ibst.vn/upload/images/news/real_1762845306Bia.jpg',
    readTime: '5 phút đọc',
    views: '920'
  },
  {
    id: 'n4',
    category: 'tin-lien-quan',
    title: 'Hợp tác nghiên cứu với Viện Khoa học Xây dựng Hàn Quốc (KICT) về công nghệ bê tông Carbon thấp',
    date: '2026-04-12',
    summary: 'Biên bản ghi nhớ hợp tác song phương tập trung vào việc nghiên cứu ứng dụng xỉ lò cao và tro bay hoạt tính cao để giảm thiểu 40% lượng phát thải CO2 trong sản xuất bê tông thương phẩm.',
    content: 'Lễ ký kết diễn ra trực tuyến giữa Viện trưởng IBST Nguyễn Hồng Hải và đại diện KICT. Chương trình hợp tác kéo dài 3 năm bao gồm thử nghiệm phòng thí nghiệm song song và chuyển giao thiết bị phân tích hoạt tính phụ gia khoáng siêu mịn.',
    author: 'Hợp tác quốc tế',
    image: 'https://ibst.vn/upload/images/news/small_1714107164TiepHanQuoc(1).jpg',
    readTime: '3 phút đọc',
    views: '1.1k'
  },
  {
    id: 'n5',
    category: 'tin-hoat-dong',
    title: 'Bàn giao hệ thống quan trắc lún chuyển vị ga ngầm Metro số 1 Bến Thành - Suối Tiên (TP. HCM)',
    date: '2026-03-05',
    summary: 'IBST phối hợp với nhà thầu Nhật Bản bàn giao đưa vào vận hành hệ thống cảm biến quan trắc lún chuyển vị sâu cho các phân đoạn ngầm dự án Metro số 1.',
    content: 'Được lắp đặt tại các khu vực nhạy cảm xung quanh Nhà hát Thành phố và khu vực Ba Son, hệ thống cảm biến tự động chuyển dữ liệu đo đạc thời gian thực về trung tâm điều hành, đảm bảo an toàn tuyệt đối cho các công trình cổ lân cận trong suốt quá trình vận hành chạy thử tàu.',
    author: 'Trung tâm Địa kỹ thuật',
    image: 'https://ibst.vn/upload/images/news/real_1706150303ThunghiemW.jpg',
    readTime: '4 phút đọc',
    views: '1.9k'
  },
  {
    id: 'n6',
    category: 'tin-hoat-dong',
    title: 'Đoàn cán bộ Viện Khoa học công nghệ xây dựng dâng hương tại khu di tích Ngã ba Đồng Lộc và khu di tích Vũng Chùa',
    date: '2026-07-17',
    summary: 'Nhân kỷ niệm 79 năm Ngày Thương binh - Liệt sỹ, đoàn đại biểu IBST do đồng chí Nguyễn Hồng Hải làm Trưởng đoàn đã đến dâng hương tri ân anh hùng liệt sỹ.',
    content: 'Tại khu di tích lịch sử quốc gia đặc biệt Ngã ba Đồng Lộc (Hà Tĩnh) và khu mộ Đại tướng Võ Nguyên Giáp tại Vũng Chùa - Đảo Yến (Quảng Bình), đoàn cán bộ, đảng viên Viện Khoa học công nghệ xây dựng đã dâng hoa, dâng hương, bày tỏ lòng kính trọng sâu sắc và tri ân vô hạn đối với sự hy sinh to lớn của các anh hùng liệt sỹ vì sự nghiệp giải phóng dân tộc.',
    author: 'Đảng ủy Viện',
    image: 'https://ibst.vn/upload/images/news/real_17844801213a.jpg',
    readTime: '3 phút đọc',
    views: '2.1k'
  },
  {
    id: 'n7',
    category: 'tin-hoat-dong',
    title: 'Thử nghiệm khả năng chịu nhiệt độ cao cho quạt hút khói trong hệ thống hút xả khói khi có cháy',
    date: '2026-07-16',
    summary: 'Hệ thống quạt hút sự cố công nghiệp được thử nghiệm trực tiếp tại lò đốt nhiệt độ cao của Phòng thí nghiệm Chịu lửa IBST đạt tiêu chuẩn BS EN 12101-3.',
    content: 'Thử nghiệm được tiến hành liên tục trong 120 phút dưới nhiệt độ buồng đốt lên đến 400 độ C. Quạt hút sự cố lắp đặt cho dự án đường hầm và tầng hầm đã duy trì công suất và vận hành ổn định, đáp ứng hoàn toàn các tiêu chuẩn kỹ thuật an toàn chống cháy khắt khe hiện hành.',
    author: 'Phòng thí nghiệm LAS-XD 18',
    image: 'https://ibst.vn/upload/images/news/small_17842855792.jpg',
    readTime: '5 phút đọc',
    views: '1.4k'
  },
  {
    id: 'n8',
    category: 'tin-hoat-dong',
    title: 'Hội thảo chuyên đề BIM trong kỷ nguyên AI: Từ quy định đến thực tiễn chuyển đổi số ngành Xây dựng',
    date: '2026-07-16',
    summary: 'IBST phối hợp với các đối tác công nghệ tổ chức diễn đàn thảo luận ứng dụng Trí tuệ nhân tạo (AI) tối ưu quy trình thiết kế, quản lý vòng đời công trình qua mô hình thông tin công trình (BIM).',
    content: 'Hội thảo thu hút hơn 200 chuyên gia, kỹ sư trong và ngoài nước tham dự. Các chuyên gia của Viện đã trình bày báo cáo về giải pháp ứng dụng học máy phân tích dữ liệu cảm biến quan trắc sức khỏe công trình kết hợp mô hình BIM 7D phục vụ bảo trì chủ động.',
    author: 'Văn phòng Chuyển đổi số',
    image: 'https://ibst.vn/upload/images/news/small_1784285355ky.jpg',
    readTime: '4 phút đọc',
    views: '1.7k'
  },
  {
    id: 'n9',
    category: 'tin-lien-quan',
    title: 'Tọa đàm xây dựng kế hoạch giảm phát thải khí nhà kính ngành Xây dựng',
    date: '2026-07-10',
    summary: 'IBST đóng vai trò tư vấn kỹ thuật chính thảo luận lộ trình chuyển đổi công nghệ sản xuất vật liệu xây dựng xanh, giảm cường độ phát thải carbon.',
    content: 'Tọa đàm tập trung vào định hướng phát triển xi măng thân thiện môi trường, các giải pháp thu hồi carbon trong sản xuất bê tông thương phẩm và xây dựng cơ chế định giá tín chỉ carbon ngành vật liệu xây dựng phù hợp với cam kết Net Zero của Chính phủ.',
    author: 'Trung tâm Bê tông & Vật liệu',
    image: 'https://ibst.vn/upload/images/news/small_1716563239Daibieuthamdu.jpg',
    readTime: '4 phút đọc',
    views: '1.2k'
  },
  {
    id: 'n10',
    category: 'tin-lien-quan',
    title: 'Hợp tác quốc tế nâng cao năng lực thử nghiệm cơ lý vật liệu xây dựng và kiểm định kết cấu',
    date: '2026-07-08',
    summary: 'Ký kết hợp tác chiến lược giữa IBST và các đối tác kiểm định hàng đầu châu Âu về đào tạo nhân lực và chuẩn hóa các phép thử chuyên sâu phòng thí nghiệm.',
    content: 'Chương trình tập trung vào chuyển giao công nghệ kiểm tra không phá hủy tiên tiếp (NDT), thử nghiệm siêu âm khuyết tật mối hàn thép công nghiệp và mô phỏng số phá hủy kết cấu bê tông cốt thép chịu tải trọng cực hạn.',
    author: 'Hợp tác quốc tế',
    image: 'https://ibst.vn/upload/images/news/small_1725527385Hoptacquocte1.jpg',
    readTime: '3 phút đọc',
    views: '1.5k'
  },
  {
    id: 'n11',
    category: 'tin-hoat-dong',
    title: 'Khen thưởng các cá nhân, tập thể có thành tích xuất sắc trong công tác nghiên cứu khoa học năm 2025',
    date: '2026-02-15',
    summary: 'Lễ trao thưởng vinh danh các nhà khoa học, nhóm tác giả có công trình công bố quốc tế uy tín và bằng độc quyền sáng chế hữu ích trong năm qua.',
    content: 'Được sự ủy quyền của Bộ trưởng Bộ Xây dựng, Viện trưởng Viện KHCN Xây dựng đã trao tặng bằng khen cho 3 tập thể và 12 cá nhân có thành tích xuất sắc. Đây là sự động viên to lớn thúc đẩy phong trào nghiên cứu ứng dụng thực tiễn trong toàn Viện.',
    author: 'Thi đua Khen thưởng',
    image: 'https://ibst.vn/upload/images/news/small_1784006066KN.jpg',
    readTime: '3 phút đọc',
    views: '1.1k'
  },
  {
    id: 'n12',
    category: 'tin-hoat-dong',
    title: 'Hội nghị tổng kết công tác Đảng và thực hiện nhiệm vụ chính trị của Đảng bộ Viện KHCN Xây dựng',
    date: '2026-01-20',
    summary: 'Đảng bộ Viện tổ chức đánh giá toàn diện kết quả lãnh đạo thực hiện nhiệm vụ chuyên môn, công tác xây dựng Đảng năm 2025 và định hướng năm 2026.',
    content: 'Hội nghị đã nghe báo cáo kiểm điểm của Ban chấp hành Đảng bộ Viện, xác định nhiệm vụ trọng tâm là tiếp tục nâng cao vai trò hạt nhân chính trị, đẩy mạnh chuyển đổi số trong quản lý điều hành và nâng cao chất lượng phục vụ quản lý nhà nước ngành Xây dựng.',
    author: 'Văn phòng Đảng ủy',
    image: 'https://ibst.vn/upload/images/news/small_1695895900chupanhluuniem.jpg',
    readTime: '4 phút đọc',
    views: '1.3k'
  }
];

const RESEARCH_PROJECTS = [
  {
    id: 'p1',
    code: 'TC24-20',
    title: 'Bê tông - Phương pháp lựa chọn thành phần cấp phối theo định hướng mới',
    leader: 'ThS. Nguyễn Văn Danh',
    funding: 450,
    year: '2022',
    status: 'Đã nghiệm thu',
    type: 'Đề tài cấp Viện',
    summary: 'Nghiên cứu xây dựng quy trình thực hành thiết kế cấp phối bê tông dựa trên hiệu suất sử dụng chất kết dính và tính công tác thực tế, thay thế cho phương pháp chọn cấp phối truyền thống.',
    details: 'Đề tài tập trung giải quyết bài toán tối ưu lượng xi măng sử dụng nhằm giảm phát nhiệt khi thi công bê tông khối lớn, đồng thời nâng cao độ bền của bê tông trong môi trường khí hậu nhiệt đới ẩm Việt Nam. Kết quả đã ứng dụng thực tế tại 3 trạm trộn bê tông lớn ở Hà Nội.'
  },
  {
    id: 'p2',
    code: 'TC 19-21',
    title: 'Nghiên cứu soát xét tiêu chuẩn quốc gia TCVN 9311-1:2012 Thử nghiệm chịu lửa – các bộ phận công trình xây dựng',
    leader: 'TS. Lê Minh Long',
    funding: 780,
    year: '2022',
    status: 'Đã nghiệm thu',
    type: 'Đề tài cấp Bộ',
    summary: 'Soát xét và cập nhật phương pháp đo đạc nhiệt độ, kiểm soát áp suất lò thử nghiệm chịu lửa cấu kiện theo tiêu chuẩn quốc tế ISO 834-1.',
    details: 'Đề tài cung cấp cơ sở khoa học để sửa đổi quy trình kiểm tra các cấu kiện ngăn cháy (cửa, vách, cột) tại Việt Nam, phục vụ công tác cấp chứng nhận phòng cháy chữa cháy của các cơ quan quản lý. Tiêu chuẩn mới khắc phục được các sai lệch nhiệt độ trong quá trình thử lửa thực tế.'
  },
  {
    id: 'p3',
    code: 'RD 26-21',
    title: 'Nghiên cứu biên soạn tài liệu kỹ thuật phổ biến và hướng dẫn phòng chống thiên tai, lũ lụt cho nhà ở vùng ngập lũ',
    leader: 'TS. Nguyễn Hồng Hải',
    funding: 920,
    year: '2022',
    status: 'Đã nghiệm thu',
    type: 'Nhiệm vụ cấp Nhà nước',
    summary: 'Khảo sát và đề xuất các mô hình kết cấu nhà ở kiên cố chống bão, nhà phao tự nổi thích ứng với lũ quét vùng miền Trung và ngập lụt đồng bằng sông Cửu Long.',
    details: 'Tài liệu hướng dẫn đã được in ấn 5,000 bản và chuyển giao cho Sở Xây dựng các tỉnh Quảng Bình, Hà Tĩnh, Quảng Nam ứng dụng hỗ trợ người dân xây nhà an toàn tránh lũ.'
  },
  {
    id: 'p4',
    code: 'RD 120-20',
    title: 'Nghiên cứu cơ sở khoa học xây dựng tiêu chuẩn Thiết kế địa kỹ thuật – Thiết kế móng cọc theo định hướng mới Eurocode',
    leader: 'PGS. TS. Trần Việt Hùng',
    funding: 1200,
    year: '2023',
    status: 'Đã nghiệm thu',
    type: 'Đề tài cấp Bộ',
    summary: 'Nghiên cứu chuyển đổi triết lý thiết kế móng cọc sang Eurocode 7, xác lập hệ số an toàn riêng (partial safety factors) phù hợp với địa chất các đô thị lớn tại Việt Nam.',
    details: 'Đóng vai trò quan trọng trong việc thống nhất tiêu chuẩn tính toán kết cấu Việt Nam với hệ thống tiêu chuẩn Châu Âu. Đề tài đã phân tích dữ liệu thí nghiệm nén tĩnh hơn 200 cọc khoan nhồi trên toàn quốc để tối ưu hóa hệ số kháng đất nền.'
  },
  {
    id: 'p5',
    code: 'RD 45-23',
    title: 'Nghiên cứu ứng dụng sợi polyme gia cường (FRP) trong sửa chữa, gia cường cầu đường bộ bê tông cốt thép bị xuống cấp',
    leader: 'TS. Bùi Danh Nam',
    funding: 650,
    year: '2024',
    status: 'Đang thực hiện',
    type: 'Đề tài cấp Bộ',
    summary: 'Đánh giá khả năng chịu uốn và cắt của dầm bê tông cốt thép gia cường bằng tấm sợi carbon (CFRP) dưới tác động của tải trọng lặp động lực học.',
    details: 'Đề tài đang triển khai thử nghiệm mỏi tại phòng thí nghiệm trọng điểm. Dự kiến đưa ra hướng dẫn thi công dán tấm FRP đạt hiệu quả tối ưu cho các đơn vị duy tu giao thông.'
  }
];

const MAP_PROJECTS = [
  {
    id: 'hn',
    x: 40,
    y: 30,
    nameVi: 'Tòa nhà Quốc hội Việt Nam (Hà Nội)',
    nameEn: 'National Assembly House (Hanoi)',
    roleVi: 'Kiểm định độc lập nền móng đường cất hạ cánh, quan trắc độ lún dài hạn và thiết kế kháng chấn kết cấu siêu cường lực.',
    roleEn: 'Independent inspection, long-term settlement monitoring, and seismic analysis of high-strength structural elements.',
    specsVi: 'Quy mô: 60.000m² sàn, Kết cấu thép khẩu độ lớn vượt nhịp.',
    specsEn: 'Scale: 60,000m² floor area, Large span structural steel.'
  },
  {
    id: 'sl',
    x: 25,
    y: 25,
    nameVi: 'Thủy điện Sơn La (Sơn La)',
    nameEn: 'Son La Hydropower Plant (Son La)',
    roleVi: 'Chủ trì khảo sát địa chất công trình, thí nghiệm không phá hủy (NDT) bê tông đầm lăn RCC đập dâng và tính toán nhiệt động.',
    roleEn: 'Lead geotechnical survey, RCC non-destructive testing (NDT), and cement thermal analysis for the gravity dam.',
    specsVi: 'Quy mô: Đập cao 128m, Thể tích bê tông đầm lăn RCC lớn nhất Đông Nam Á.',
    specsEn: 'Scale: 128m high dam, Largest RCC volume in SE Asia.'
  },
  {
    id: 'qn',
    x: 50,
    y: 28,
    nameVi: 'Cầu Bãi Cháy (Quảng Ninh)',
    nameEn: 'Bai Chay Bridge (Quang Ninh)',
    roleVi: 'Kiểm định chất lượng định kỳ dầm bê tông dự ứng lực hộp nhịp lớn, đo đạc lực căng bó cáp dây văng chịu mỏi.',
    roleEn: 'Periodic health monitoring of large concrete box girder, tension testing of stay cables under fatigue loads.',
    specsVi: 'Quy mô: Cầu dây văng bê tông nhịp chính 435m một mặt phẳng cáp.',
    specsEn: 'Scale: Cable-stayed bridge, 435m main span with single plane cables.'
  },
  {
    id: 'dn',
    x: 65,
    y: 85,
    nameVi: 'Dự án ven biển & Văn phòng PVMT (Đà Nẵng)',
    nameEn: 'Coastal Projects & PVMT (Da Nang)',
    roleVi: 'Đánh giá mức độ ăn mòn xâm thực muối biển công trình ven vịnh Đà Nẵng, kiểm định kết cấu móng giàn khoan.',
    roleEn: 'Saltwater intrusion corrosion monitoring of coastal structures and offshore oil rig structures.',
    specsVi: 'Quy mô: Hệ thống phòng Lab đạt chuẩn phục vụ vùng kinh tế Miền Trung.',
    specsEn: 'Scale: Dedicated testing facility serving the Central Economic Zone.'
  },
  {
    id: 'kh',
    x: 85,
    y: 145,
    nameVi: 'Hệ thống Cáp treo biển Vinpearl (Nha Trang)',
    nameEn: 'Vinpearl Sea Crossing Cable Car (Nha Trang)',
    roleVi: 'Kiểm tra khuyết tật mối hàn ống thép trụ đỡ chìm dưới đáy biển sâu, siêu âm mỏi cáp tải lực cabin.',
    roleEn: 'Ultrasonic weld inspection of underwater steel pylons, fatigue testing of main passenger cabin cables.',
    specsVi: 'Quy mô: Chiều dài 3.320m vượt biển, 9 trụ cabin chịu bão cấp 15.',
    specsEn: 'Scale: 3,320m sea crossing, 9 pylons designed for category 15 typhoon.'
  },
  {
    id: 'lt',
    x: 65,
    y: 182,
    nameVi: 'Siêu sân bay Long Thành (Đồng Nai)',
    nameEn: 'Long Thanh International Airport (Dong Nai)',
    roleVi: 'Kiểm định độc lập gia cố nền móng đường cất hạ cánh chất lượng cao, giám sát vật liệu bê tông mác siêu cao nhà ga.',
    roleEn: 'Independent runway base inspection, high-performance concrete material validation for terminal foundations.',
    specsVi: 'Quy mô: Sân bay cấp 4F quốc tế, Nhà ga 373.000m² mái vòm thép.',
    specsEn: 'Scale: International Class 4F Airport, 373,000m² steel dome terminal.'
  },
  {
    id: 'hcm',
    x: 61,
    y: 186,
    nameVi: 'Tuyến Metro Số 1 Bến Thành - Suối Tiên (TP. HCM)',
    nameEn: 'Metro Line 1 Ben Thanh - Suoi Tien (HCMC)',
    roleVi: 'Quan trắc lún chuyển vị hầm đào ngầm TBM, thí nghiệm uốn tải trọng động dầm bê tông cầu cạn đúc sẵn.',
    roleEn: 'TBM tunnel boring settlement monitoring, dynamic load testing of precast concrete viaduct girders.',
    specsVi: 'Quy mô: 19.7 km chiều dài, 3 ga ngầm trung tâm địa chất yếu.',
    specsEn: 'Scale: 19.7 km length, 3 underground stations in weak soil.'
  },
  {
    id: 'hs',
    x: 98,
    y: 100,
    nameVi: 'Hệ thống Hải đăng Quần đảo Hoàng Sa',
    nameEn: 'Hoang Sa Archipelago Lighthouses',
    roleVi: 'Thử nghiệm bảo vệ ăn mòn điện hóa catốt, giám sát lớp sơn phủ Epoxy chống muối biển xâm thực công trình ngọn hải đăng.',
    roleEn: 'Cathodic protection testing, anti-corrosive Epoxy coating monitoring for remote sovereign lighthouse structures.',
    specsVi: 'Quy mô: Các công trình cột mốc chủ quyền thiêng liêng quốc gia.',
    specsEn: 'Scale: Sovereign national maritime milestone structures.'
  },
  {
    id: 'ts',
    x: 105,
    y: 188,
    nameVi: 'Hệ thống Hải đăng Quần đảo Trường Sa',
    nameEn: 'Truong Sa Archipelago Lighthouses',
    roleVi: 'Đánh giá độ bền mỏi và xâm thực ăn mòn mặn kết cấu công trình biển đảo tiền tiêu phục vụ công ích.',
    roleEn: 'Long-term durability and salt erosion monitoring of sovereign military and public island outposts.',
    specsVi: 'Quy mô: 9 ngọn hải đăng chốt giữ vùng đặc quyền kinh tế.',
    specsEn: 'Scale: 9 lighthouses marking the national Exclusive Economic Zone.'
  }
];

const JOURNAL_ISSUES = [
  {
    volume: 'Số 1 - 2026',
    date: 'Tháng 02/2026',
    issn: 'ISSN 1859-1566',
    image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=200&auto=format&fit=crop',
    articles: [
      { title: 'Nghiên cứu ứng dụng bê tông siêu tính năng (UHPC) sử dụng cát nghiền địa phương trong kết cấu nhịp cầu nhỏ', authors: 'PGS. TS. Trần Công Minh, ThS. Nguyễn Hoàng Nam' },
      { title: 'Đánh giá ứng xử chịu lửa của cột bê tông cốt thép bọc tấm thạch cao theo tiêu chuẩn ISO 834', authors: 'TS. Lê Minh Tuấn, KS. Phạm Văn Đức' },
      { title: 'Xác định hệ số an toàn riêng của móng cọc khoan nhồi trong địa chất Hà Nội theo hướng Eurocode 7', authors: 'GS. TS. Nguyễn Văn Hùng, ThS. Trần Thị Lan' }
    ]
  },
  {
    volume: 'Số 4 - 2025',
    date: 'Tháng 11/2025',
    issn: 'ISSN 1859-1566',
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=200&auto=format&fit=crop',
    articles: [
      { title: 'Mô phỏng động lực học tải trọng gió tác dụng lên nhà siêu cao tầng bằng phương pháp CFD và hầm gió khí động học', authors: 'TS. Nguyễn Anh Khoa, KS. Lê Quốc Anh' },
      { title: 'Nghiên cứu sự ăn mòn cốt thép trong bê tông vùng ngập nước biển Quần đảo Trường Sa', authors: 'PGS. TS. Vũ Minh Đức, ThS. Hoàng Văn Đạt' },
      { title: 'Ứng dụng sợi carbon dán cường độ cao (CFRP) xử lý nứt dầm cầu cầu đường bộ', authors: 'TS. Bùi Danh Nam, KS. Đỗ Văn Sơn' }
    ]
  },
  {
    volume: 'Số 3 - 2025',
    date: 'Tháng 08/2025',
    issn: 'ISSN 1859-1566',
    image: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?q=80&w=200&auto=format&fit=crop',
    articles: [
      { title: 'Nghiên cứu thực nghiệm cường độ kháng nén bê tông geopolymer thân thiện môi trường sử dụng tro bay nhiệt điện', authors: 'PGS. TS. Trần Công Minh, KS. Nguyễn Đức Toàn' },
      { title: 'Phân tích ứng suất chuyển vị của hố móng sâu trong điều kiện đất yếu Hải Phòng', authors: 'ThS. Nguyễn Văn Hải, GS. TS. Nguyễn Văn Hùng' },
      { title: 'Phương pháp thử nghiệm độ thấm ion clo của bê tông theo ASTM C1202', authors: 'ThS. Phạm Thị Nga, KS. Vũ Văn Bình' }
    ]
  }
];

const LAB_EQUIPMENTS = [
  {
    id: 'fire-furnace',
    nameVi: 'Lò thử nghiệm chịu lửa buồng đứng & buồng ngang',
    nameEn: 'Vertical & Horizontal Fire Resistance Furnaces',
    code: 'ISO 834 / EN 1363-1',
    descVi: 'Hệ thống lò thử nghiệm quy mô lớn được thiết kế để xác định giới hạn chịu lửa của các bộ phận kết cấu ngăn che đứng (tường, vách, cửa chống cháy) và kết cấu nằm ngang (sàn, trần).',
    descEn: 'Large-scale furnace systems designed to evaluate fire resistance limits of vertical partition elements and horizontal floor structures.',
    specs: [
      { label: 'Kích thước buồng đốt', value: '3.0m x 3.0m (Đứng) & 3.0m x 4.0m (Ngang)' },
      { label: 'Nhiệt độ tối đa', value: '1250 °C (Đạt chuẩn hỏa hoạn tiêu chuẩn ISO)' },
      { label: 'Hệ thống gia tải đứng', value: 'Kích gia tải 200 tấn mô phỏng tải trọng thực tế' },
      { label: 'Thời gian thử tối đa', value: '240 phút (EI 240 / RE 240)' }
    ],
    standards: ['TCVN 9311:2012', 'ISO 834-1', 'EN 1363-1', 'ASTM E119'],
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=600&auto=format&fit=crop',
    usageVi: 'Xác định cấp chịu lửa của cấu kiện phục vụ công tác nghiệm thu PCCC quốc gia.',
    usageEn: 'Determine structural fire ratings for mandatory national fire protection codes.'
  },
  {
    id: 'wind-tunnel',
    nameVi: 'Hầm gió khí động học (Wind Tunnel Simulator)',
    nameEn: 'Boundary Layer Wind Tunnel Facility',
    code: 'WT-09 IBST',
    descVi: 'Hầm gió hở phục vụ khảo sát khí động học kết cấu nhà cao tầng, cầu dây văng lớn và công trình đặc biệt chịu tải trọng gió bão.',
    descEn: 'Open circuit wind tunnel facility designed for aerodynamic pressure testing of skyscrapers, bridges, and high-wind structures.',
    specs: [
      { label: 'Tốc độ gió tối đa', value: 'Vmax = 60 m/s (Tương đương bão cấp 17)' },
      { label: 'Kích thước buồng thử', value: 'Mặt cắt 1.8m x 1.5m, dài 12m' },
      { label: 'Hệ thống đo lực', value: 'Cân khí động học 6 thành phần độ nhạy cao' },
      { label: 'Mô phỏng biên', value: 'Mô phỏng lớp biên khí quyển đô thị và biển tự động' }
    ],
    standards: ['TCVN 2737:2023', 'ASCE 7-16', 'AS/NZS 1170.2'],
    image: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?q=80&w=600&auto=format&fit=crop',
    usageVi: 'Tối ưu hóa hình dáng khí động học và tính toán tải trọng gió động cho nhà siêu cao tầng.',
    usageEn: 'Optimize aerodynamic profiles and evaluate dynamic wind responses for tall structures.'
  },
  {
    id: 'hydraulic-test',
    nameVi: 'Hệ thống kích thủy lực gia tải mỏi thép đa điểm',
    nameEn: '1000-Ton Dynamic Hydraulic Fatigue Test Rig',
    code: '1000 Ton Dynamic Rig',
    descVi: 'Thiết bị gia tải động lực học quy mô lớn phục vụ thí nghiệm mỏi cáp neo, dầm bê tông dự ứng lực, gối cầu và cấu kiện thép chịu lực lặp.',
    descEn: 'Dynamic loading system for assessing fatigue durability of stay cable anchors, prestressed concrete, and bridge bearings.',
    specs: [
      { label: 'Tải trọng tối đa', value: '1000 Tấn (10,000 kN)' },
      { label: 'Tần số gia tải động', value: '0.1 Hz đến 20 Hz' },
      { label: 'Hành trình kích', value: '± 150 mm' },
      { label: 'Số điểm gia tải đồng thời', value: 'Lên đến 4 điểm điều khiển Servo đồng bộ' }
    ],
    standards: ['AASHTO M251', 'TCVN 9114', 'BS EN 1337'],
    image: 'https://images.unsplash.com/photo-1535813547-99c456a41d4a?q=80&w=600&auto=format&fit=crop',
    usageVi: 'Đánh giá tuổi thọ mỏi của bó cáp dây văng, gối cao su bản thép chịu lực cho các cầu vượt biển.',
    usageEn: 'Assess fatigue life cycles of stay cables and elastomeric bearings for sea bridges.'
  },
  {
    id: 'uhpc-casting',
    nameVi: 'Trạm trộn và thử nghiệm bê tông siêu tính năng (UHPC)',
    nameEn: 'Ultra-High Performance Concrete (UHPC) Testing Hub',
    code: 'UHPC-VILAS 01',
    descVi: 'Hệ thống thiết bị đặc chủng phục vụ chế tạo, bảo dưỡng nhiệt ẩm và thử nghiệm các tính năng cơ lý hóa của bê tông sợi siêu cao.',
    descEn: 'Dedicated setup for casting, thermal-moisture curing, and testing high-durability ultra-high strength fiber-reinforced concrete.',
    specs: [
      { label: 'Cường độ nén 28 ngày', value: '> 150 MPa (Bê tông thường chỉ 30-40 MPa)' },
      { label: 'Cường độ kéo uốn', value: '> 25 MPa' },
      { label: 'Trộn chân không', value: 'Máy trộn cưỡng bức cao tốc ngăn bọt khí' },
      { label: 'Bảo dưỡng đặc biệt', value: 'Bể hấp nhiệt ẩm kiểm soát lập trình tự động' }
    ],
    standards: ['ASTM C1856', 'NF P18-710', 'TCVN 13911'],
    image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=600&auto=format&fit=crop',
    usageVi: 'Chế tạo dầm bê tông siêu nhẹ cường độ cao, bản mặt cầu gia cường mỏng nhẹ chống thấm nứt.',
    usageEn: 'Fabricate ultra-lightweight structural members and water-resistant overlay systems.'
  }
];

const SCHOLAR_EXPERTS = [
  {
    id: 'exp1',
    name: 'GS. TS. Nguyễn Văn Hùng',
    title: 'Chuyên gia cao cấp Kết cấu & Động lực học công trình',
    role: 'Chủ tịch Hội đồng Khoa học IBST',
    avatar: 'NVH',
    bg: 'from-blue-500 to-indigo-600',
    research: ['Thiết kế kháng chấn nhà cao tầng', 'Động lực học cầu dây văng lớn', 'Eurocode 7 & Móng cọc'],
    achievements: ['Chủ trì thẩm định kháng chấn Tòa nhà Quốc hội', 'Giải thưởng Nhân tài Đất Việt ngành Khoa học', 'Hơn 120 bài báo SCI/Scopus'],
    email: 'hung.nv@ibst.vn'
  },
  {
    id: 'exp2',
    name: 'PGS. TS. Trần Công Minh',
    title: 'Chuyên gia Vật liệu xây dựng & Công nghệ Bê tông đặc biệt',
    role: 'Phó Viện trưởng phụ trách Vật liệu',
    avatar: 'TCM',
    bg: 'from-teal-500 to-emerald-600',
    research: ['Bê tông siêu tính năng UHPC', 'Bê tông tro bay thân thiện môi trường', 'Ăn mòn xâm thực kết cấu biển'],
    achievements: ['Chủ biên Bộ tiêu chuẩn quốc gia TCVN về UHPC', 'Bằng sáng chế Bê tông Geopolymer biển đảo', 'Huy chương vàng Sáng tạo Khoa học'],
    email: 'minh.tc@ibst.vn'
  },
  {
    id: 'exp3',
    name: 'TS. Lê Minh Tuấn',
    title: 'Chuyên gia Kỹ thuật Phòng cháy & An toàn cháy nổ công trình',
    role: 'Giám đốc Phòng LAS-XD 18',
    avatar: 'LMT',
    bg: 'from-amber-500 to-red-600',
    research: ['Giới hạn chịu lửa kết cấu xây dựng', 'Mô phỏng lan truyền khói lửa FDS', 'Soạn thảo quy chuẩn QCVN 06'],
    achievements: ['Thành viên chủ chốt Ban soạn thảo QCVN 06/BXD', 'Tư vấn giải pháp PCCC sân bay Long Thành', 'Chứng chỉ chuyên gia PCCC của NFPA'],
    email: 'tuan.lm@ibst.vn'
  }
];

export default function App() {
  const { theme, setTheme, primaryColor, setPrimaryColor, zoom, setZoom } = useTheme();

  const [activeTab, setActiveTab] = useState<'home' | 'intro' | 'news' | 'state-gov' | 'research' | 'training' | 'testing' | 'consulting' | 'faq'>('home');
  const [activeSubTab, setActiveSubTab] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<any | null>(null);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [lang, setLang] = useState<'vi' | 'en'>('vi');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedStandard, setSelectedStandard] = useState('qcvn06');

  // States for 5 new interactive features
  const [selectedMapProject, setSelectedMapProject] = useState<any | null>(null);
  const [activeJournalIndex, setActiveJournalIndex] = useState(0);
  const [journalModalOpen, setJournalModalOpen] = useState(false);
  const [selectedJournal, setSelectedJournal] = useState<any | null>(null);
  const [activeEquipmentId, setActiveEquipmentId] = useState('fire-furnace');
  const [consultingExpert, setConsultingExpert] = useState<any | null>(null);
  const [expertMessageSent, setExpertMessageSent] = useState(false);
  const [expertEmail, setExpertEmail] = useState('');
  const [expertQuestion, setExpertQuestion] = useState('');
  const [mapMode, setMapMode] = useState<'project' | 'google'>('project');
  const [selectedOffice, setSelectedOffice] = useState<'hanoi' | 'danang' | 'hcm'>('hanoi');

  // States for dynamic slider on Home page
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = useMemo(() => [
    { url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=800&auto=format&fit=crop', captionVi: 'Kiểm định độc lập ga hành khách sân bay Long Thành', captionEn: 'Independent inspection of Long Thanh airport passenger terminal' },
    { url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop', captionVi: 'Hội thảo quốc tế soát xét quy chuẩn xây dựng QCVN 06', captionEn: 'International conference on QCVN 06 building code revision' },
    { url: 'https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?q=80&w=800&auto=format&fit=crop', captionVi: 'Trạm thử nghiệm giới hạn chịu lửa cấu kiện xây dựng', captionEn: 'Fire resistance limit testing station for building components' },
    { url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop', captionVi: 'Hợp tác nghiên cứu công nghệ bê tông carbon thấp với KICT', captionEn: 'Cooperation in low-carbon concrete research with KICT Korea' }
  ], []);

  useEffect(() => {
    if (activeTab !== 'home') return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [activeTab, slides.length]);

  const handleTabChange = (tab: any, subTabDefault = 'all') => {
    setActiveTab(tab);
    setActiveSubTab(subTabDefault);
    setSelectedArticle(null);
    setSelectedProject(null);
  };

  const handleViewArticle = (art: any) => {
    const isStateGov = art.category === 'du-an-trong-diem' || art.category === 'quy-chuan-tieu-chuan';
    setActiveTab(isStateGov ? 'state-gov' : 'news');
    setActiveSubTab(art.category);
    setSelectedArticle(art);
    setSelectedProject(null);
  };

  // --- FILTER LOGIC FOR PROJECTS & NEWS ---

  const filteredProjects = useMemo(() => {
    return RESEARCH_PROJECTS.filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.leader.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = activeSubTab === 'all' || p.type.toLowerCase().includes(activeSubTab.toLowerCase());
      const matchesYear = selectedYear === 'all' || p.year === selectedYear;

      return matchesSearch && matchesType && matchesYear;
    });
  }, [activeSubTab, searchQuery, selectedYear]);

  const filteredNews = useMemo(() => {
    return NEWS_ARTICLES.filter((art) => {
      const matchesSearch =
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.summary.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCat = activeSubTab === 'all' || art.category === activeSubTab;

      return matchesSearch && matchesCat;
    });
  }, [activeSubTab, searchQuery]);
  return (
    <div className="min-h-screen bg-page bg-engineering-grid text-ink transition-all relative font-sans">
      {/* ─── GOV TOP BRANDING LINE ─── */}
      <div className="w-full bg-gradient-to-r from-primary-700 via-primary-600 to-indigo-800 text-[10px] text-white/90 py-1.5 px-6 font-bold tracking-wider uppercase flex justify-between items-center border-b border-white/10">
        <div>{lang === 'vi' ? 'CỔNG THÔNG TIN ĐIỆN TỬ BỘ XÂY DỰNG VÀ CÁC VIỆN NGHIÊN CỨU' : 'PORTAL OF MINISTRY OF CONSTRUCTION & RESEARCH INSTITUTES'}</div>
        <div className="hidden sm:flex items-center gap-3">
          <span>QCVN 06:2026</span>
          <span className="w-1 h-1 bg-white/40 rounded-full"></span>
          <span>TCVN 9311</span>
        </div>
      </div>

      {/* ─── WEB PORTAL HEADER ─── */}
      <div className="border-b border-border bg-surface/90 backdrop-blur-md px-6 py-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all">
        <div className="flex items-center gap-3 shrink-0">
          <div className="h-12 w-12 bg-white rounded-xl shadow-md border border-border flex items-center justify-center p-1.5 overflow-hidden transition-all hover:scale-105 shrink-0">
            <img src="https://ibst.vn/templates/e4cms/images/icon/logo5.png" alt="Logo IBST" className="object-contain w-full h-full" />
          </div>
          <div className="text-left shrink-0">
            <h1 className="text-xs sm:text-sm md:text-base font-extrabold tracking-tight text-primary-600 uppercase leading-none">
              {lang === 'vi' ? 'Viện Khoa học Công nghệ Xây dựng' : 'Institute for Building Science and Technology'}
            </h1>
            <p className="text-[8px] sm:text-[9.5px] font-extrabold text-ink-muted tracking-widest uppercase mt-1 flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-success shrink-0"></span>
              {lang === 'vi' ? 'Đơn vị Sự nghiệp Hạng I — Bộ Xây Dựng' : 'National Class-I Science Institution — MOC'}
            </p>
          </div>
        </div>

        {/* Ticker chạy tin tức nổi bật để lấp đầy khoảng trắng và tạo sinh động */}
        <div className="hidden lg:flex flex-1 mx-4 lg:mx-8 bg-muted border border-border-subtle rounded-xl px-3 py-1.5 items-center gap-2.5 overflow-hidden h-10 relative animate-marquee-hover-pause shadow-inner">
          <div className="flex items-center gap-1.5 text-[8.5px] font-black text-white bg-red-600 rounded-lg px-2 py-1 animate-pulse shrink-0 tracking-wider">
            <Volume2 size={10} />
            {lang === 'vi' ? 'TIN NỔI BẬT' : 'NEWSFLASH'}
          </div>
          <div className="flex-1 overflow-hidden relative w-full h-full flex items-center">
            <div className="animate-marquee text-[11px] font-black text-ink-secondary tracking-wide flex flex-row flex-nowrap items-center whitespace-nowrap">
              {/* Loop 1 */}
              <div className="flex gap-12 shrink-0 pr-12">
                {NEWS_ARTICLES.map((art) => (
                  <button 
                    key={`m1-${art.id}`}
                    onClick={() => handleViewArticle(art)}
                    className="hover:text-primary-500 hover:underline transition-colors flex items-center gap-1.5 cursor-pointer text-left focus:outline-none shrink-0 whitespace-nowrap"
                  >
                    <span className="text-red-500 font-extrabold shrink-0">★</span>
                    <span className="shrink-0">{art.title}</span>
                  </button>
                ))}
              </div>
              {/* Loop 2 to ensure seamless infinite looping */}
              <div className="flex gap-12 shrink-0 pr-12">
                {NEWS_ARTICLES.map((art) => (
                  <button 
                    key={`m2-${art.id}`}
                    onClick={() => handleViewArticle(art)}
                    className="hover:text-primary-500 hover:underline transition-colors flex items-center gap-1.5 cursor-pointer text-left focus:outline-none shrink-0 whitespace-nowrap"
                  >
                    <span className="text-red-500 font-extrabold shrink-0">★</span>
                    <span className="shrink-0">{art.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-4 text-ink-secondary hidden lg:flex font-semibold">
            <div className="flex items-center gap-1.5 hover:text-primary-500 transition-colors">
              <Phone size={13} className="text-primary-500" />
              <span>024 37544196</span>
            </div>
            <div className="flex items-center gap-1.5 hover:text-primary-500 transition-colors">
              <Mail size={13} className="text-primary-500" />
              <span>vkhcnxd@ibst.vn</span>
            </div>
          </div>

          {/* Ngôn ngữ & Cài đặt */}
          <div className="flex items-center gap-2 relative">
            <div className="flex items-center gap-1 bg-muted p-1 rounded-lg border border-border">
              <button
                onClick={() => setLang('vi')}
                title="Tiếng Việt"
                className={cn(
                  "p-1 rounded-md transition-all cursor-pointer flex items-center justify-center",
                  lang === 'vi' ? "bg-surface shadow-sm ring-1 ring-border" : "opacity-60 hover:opacity-100"
                )}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" className="w-5 h-3.5 rounded-sm">
                  <rect fill="#da251d" width="900" height="600"/>
                  <polygon fill="#ffcd00" points="450,120 521,338 335,203 565,203 379,338"/>
                </svg>
              </button>
              <button
                onClick={() => setLang('en')}
                title="English"
                className={cn(
                  "p-1 rounded-md transition-all cursor-pointer flex items-center justify-center",
                  lang === 'en' ? "bg-surface shadow-sm ring-1 ring-border" : "opacity-60 hover:opacity-100"
                )}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" className="w-5 h-3.5 rounded-sm">
                  <clipPath id="t"><path d="M30,15 h30 v15 z v-15 h-30 z h-30 v-15 z v15 h30 z"/></clipPath>
                  <path d="M0,0 v30 h60 v-30 z" fill="#012169"/>
                  <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
                  <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#t)" stroke="#C8102E" strokeWidth="4"/>
                  <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/>
                  <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6"/>
                </svg>
              </button>
            </div>

            {/* Cài đặt hiển thị */}
            <button
              onClick={() => setSettingsOpen(!settingsOpen)}
              title="Cài đặt hiển thị"
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer border",
                settingsOpen 
                  ? "bg-primary-500 text-white border-primary-500 shadow-md" 
                  : "bg-surface text-ink-secondary border-border hover:bg-muted hover:text-ink"
              )}
            >
              <Settings size={16} className={cn("transition-transform duration-300", settingsOpen && "rotate-45")} />
            </button>

            {settingsOpen && (
              <div className="absolute right-0 top-11 w-64 p-4 bg-surface border border-border rounded-xl shadow-dropdown text-left space-y-4 animate-fade-in z-50">
                <div className="pb-2 border-b border-border-subtle flex justify-between items-center">
                  <span className="text-xs font-black text-ink">Cài đặt giao diện</span>
                  <span className="text-3xs text-primary-500 font-bold">Public Web</span>
                </div>

                {/* Theme Select */}
                <div className="space-y-1.5">
                  <span className="text-2xs font-semibold text-ink-secondary">Giao diện nền</span>
                  <div className="flex gap-1 bg-muted p-0.5 rounded-lg">
                    <button
                      onClick={() => setTheme('light')}
                      className={cn(
                        "flex-1 py-1 text-3xs font-bold rounded-md flex items-center justify-center gap-1 cursor-pointer transition-all",
                        theme === 'light' ? "bg-surface text-primary shadow-sm" : "text-ink-muted hover:text-ink"
                      )}
                    >
                      <Sun size={11} /> Sáng
                    </button>
                    <button
                      onClick={() => setTheme('nature')}
                      className={cn(
                        "flex-1 py-1 text-3xs font-bold rounded-md flex items-center justify-center gap-1 cursor-pointer transition-all",
                        theme === 'nature' ? "bg-surface text-primary shadow-sm" : "text-ink-muted hover:text-ink"
                      )}
                    >
                      <Leaf size={11} /> Bảo vệ
                    </button>
                    <button
                      onClick={() => setTheme('dark')}
                      className={cn(
                        "flex-1 py-1 text-3xs font-bold rounded-md flex items-center justify-center gap-1 cursor-pointer transition-all",
                        theme === 'dark' ? "bg-surface text-primary shadow-sm" : "text-ink-muted hover:text-ink"
                      )}
                    >
                      <Moon size={11} /> Tối
                    </button>
                  </div>
                </div>

                {/* Primary Colors */}
                <div className="space-y-1.5">
                  <span className="text-2xs font-semibold text-ink-secondary">Màu sắc chủ đạo</span>
                  <div className="grid grid-cols-5 gap-1.5 bg-muted p-1.5 rounded-lg justify-items-center">
                    {PRIMARY_COLORS.map(({ id, name, hex }) => {
                      const active = primaryColor === id;
                      return (
                        <button
                          key={id}
                          onClick={() => setPrimaryColor(id)}
                          title={name}
                          className={cn(
                            "w-5 h-5 rounded-full flex items-center justify-center transition-transform hover:scale-110 cursor-pointer",
                            active && "ring-1 ring-offset-1 ring-offset-surface"
                          )}
                          style={{ background: hex }}
                        >
                          {active && <Check size={10} className="text-white" strokeWidth={3} />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Zoom Control */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-2xs font-semibold text-ink-secondary">
                    <span>Tỷ lệ hiển thị</span>
                    <span className="font-bold text-primary-500">{zoom}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setZoom(Math.max(100, zoom - 10))}
                      disabled={zoom <= 100}
                      className="w-6 h-6 flex items-center justify-center rounded-lg border border-border bg-subtle hover:bg-muted text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <ZoomOut size={10} />
                    </button>
                    <input
                      type="range"
                      min="100"
                      max="200"
                      step="10"
                      value={zoom}
                      onChange={(e) => setZoom(Number(e.target.value))}
                      className="flex-1 h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-[var(--color-primary)] focus:outline-none"
                      style={{
                        background: `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${zoom - 100}%, var(--bg-muted) ${zoom - 100}%, var(--bg-muted) 100%)`
                      }}
                    />
                    <button
                      onClick={() => setZoom(Math.min(200, zoom + 10))}
                      disabled={zoom >= 200}
                      className="w-6 h-6 flex items-center justify-center rounded-lg border border-border bg-subtle hover:bg-muted text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <ZoomIn size={10} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── WEB PORTAL NAVIGATION (SITEMAP MEGA MENU) ─── */}
      <div className="sticky top-0 z-30 border-b border-border bg-surface/90 backdrop-blur-md shadow-card">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <div className="flex space-x-1.5 lg:overflow-visible overflow-x-auto scrollbar-none py-1.5 min-w-0 flex-1">
              <button
                onClick={() => handleTabChange('home')}
                className={cn(
                  "px-4 py-2 rounded-xl text-2xs font-extrabold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5",
                  activeTab === 'home'
                    ? "bg-primary-500 text-white shadow-sm"
                    : "text-ink-secondary hover:bg-muted hover:text-ink"
                )}
              >
                {lang === 'vi' ? 'Trang chủ' : 'Home'}
              </button>

              {/* Giới thiệu */}
              <div className="relative group">
                <button
                  onClick={() => handleTabChange('intro', 'all')}
                  className={cn(
                    "px-4 py-2 rounded-xl text-2xs font-extrabold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer",
                    activeTab === 'intro'
                      ? "bg-primary-500 text-white shadow-sm"
                      : "text-ink-secondary hover:bg-muted hover:text-ink"
                  )}
                >
                  {lang === 'vi' ? 'Giới thiệu' : 'Introduction'}
                  <ChevronDown size={12} className="opacity-70 group-hover:rotate-180 transition-transform duration-200" />
                </button>
                <div className="absolute left-0 mt-1 w-56 bg-surface border border-border shadow-dropdown rounded-xl py-2 hidden group-hover:block z-40 animate-fade-in">
                  <button onClick={() => handleTabChange('intro', 'nhiem-vu')} className="w-full text-left px-4 py-2 text-2xs font-bold text-ink hover:bg-muted hover:text-primary-500 transition-colors flex items-center justify-between">
                    <span>{lang === 'vi' ? 'Chức năng nhiệm vụ' : 'Functions & Tasks'}</span>
                    <ChevronRight size={10} />
                  </button>
                  <button onClick={() => handleTabChange('intro', 'co-cau')} className="w-full text-left px-4 py-2 text-2xs font-bold text-ink hover:bg-muted hover:text-primary-500 transition-colors flex items-center justify-between">
                    <span>{lang === 'vi' ? 'Cơ cấu tổ chức' : 'Organizational Structure'}</span>
                    <ChevronRight size={10} />
                  </button>
                  <button onClick={() => handleTabChange('intro', 'phong-lab')} className="w-full text-left px-4 py-2 text-2xs font-bold text-ink hover:bg-muted hover:text-primary-500 transition-colors flex items-center justify-between">
                    <span>{lang === 'vi' ? 'Hệ thống phòng thí nghiệm' : 'Laboratories System'}</span>
                    <ChevronRight size={10} />
                  </button>
                </div>
              </div>

              {/* Tin tức */}
              <div className="relative group">
                <button
                  onClick={() => handleTabChange('news', 'all')}
                  className={cn(
                    "px-4 py-2 rounded-xl text-2xs font-extrabold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer",
                    activeTab === 'news'
                      ? "bg-primary-500 text-white shadow-sm"
                      : "text-ink-secondary hover:bg-muted hover:text-ink"
                  )}
                >
                  {lang === 'vi' ? 'Tin tức' : 'News'}
                  <ChevronDown size={12} className="opacity-70 group-hover:rotate-180 transition-transform duration-200" />
                </button>
                <div className="absolute left-0 mt-1 w-52 bg-surface border border-border shadow-dropdown rounded-xl py-2 hidden group-hover:block z-40 animate-fade-in">
                  <button onClick={() => handleTabChange('news', 'tin-hoat-dong')} className="w-full text-left px-4 py-2 text-2xs font-bold text-ink hover:bg-muted hover:text-primary-500 transition-colors flex items-center justify-between">
                    <span>Tin hoạt động Viện</span>
                    <ChevronRight size={10} />
                  </button>
                  <button onClick={() => handleTabChange('news', 'tin-lien-quan')} className="w-full text-left px-4 py-2 text-2xs font-bold text-ink hover:bg-muted hover:text-primary-500 transition-colors flex items-center justify-between">
                    <span>Tin tức liên quan</span>
                    <ChevronRight size={10} />
                  </button>
                </div>
              </div>

              {/* Phục vụ QLNN */}
              <div className="relative group">
                <button
                  onClick={() => handleTabChange('state-gov', 'all')}
                  className={cn(
                    "px-4 py-2 rounded-xl text-2xs font-extrabold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer",
                    activeTab === 'state-gov'
                      ? "bg-primary-500 text-white shadow-sm"
                      : "text-ink-secondary hover:bg-muted hover:text-ink"
                  )}
                >
                  {lang === 'vi' ? 'Phục vụ QLNN' : 'State Mgmt'}
                  <ChevronDown size={12} className="opacity-70 group-hover:rotate-180 transition-transform duration-200" />
                </button>
                <div className="absolute left-0 mt-1 w-64 bg-surface border border-border shadow-dropdown rounded-xl py-2 hidden group-hover:block z-40 animate-fade-in">
                  <button onClick={() => handleTabChange('state-gov', 'du-an-trong-diem')} className="w-full text-left px-4 py-2 text-2xs font-bold text-ink hover:bg-muted hover:text-primary-500 transition-colors flex items-center justify-between">
                    <span>Dự án trọng điểm quốc gia</span>
                    <ChevronRight size={10} />
                  </button>
                  <button onClick={() => handleTabChange('state-gov', 'quy-chuan-tieu-chuan')} className="w-full text-left px-4 py-2 text-2xs font-bold text-ink hover:bg-muted hover:text-primary-500 transition-colors flex items-center justify-between">
                    <span>Biên soạn Quy chuẩn, Tiêu chuẩn</span>
                    <ChevronRight size={10} />
                  </button>
                </div>
              </div>

              {/* KH & CN (Đề tài - Dự án) */}
              <button
                onClick={() => handleTabChange('research', 'all')}
                className={cn(
                  "px-4 py-2 rounded-xl text-2xs font-extrabold whitespace-nowrap transition-all cursor-pointer",
                  activeTab === 'research'
                    ? "bg-primary-500 text-white shadow-sm"
                    : "text-ink-secondary hover:bg-muted hover:text-ink"
                )}
              >
                {lang === 'vi' ? 'KH & CN' : 'R&D Projects'}
              </button>

              {/* Đào tạo */}
              <div className="relative group">
                <button
                  onClick={() => handleTabChange('training', 'all')}
                  className={cn(
                    "px-4 py-2 rounded-xl text-2xs font-extrabold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer",
                    activeTab === 'training'
                      ? "bg-primary-500 text-white shadow-sm"
                      : "text-ink-secondary hover:bg-muted hover:text-ink"
                  )}
                >
                  {lang === 'vi' ? 'Đào tạo' : 'Training'}
                  <ChevronDown size={12} className="opacity-70 group-hover:rotate-180 transition-transform duration-200" />
                </button>
                <div className="absolute left-0 mt-1 w-60 bg-surface border border-border shadow-dropdown rounded-xl py-2 hidden group-hover:block z-40 animate-fade-in">
                  <button onClick={() => handleTabChange('training', 'dao-tao-ts')} className="w-full text-left px-4 py-2 text-2xs font-bold text-ink hover:bg-muted hover:text-primary-500 transition-colors flex items-center justify-between">
                    <span>Đào tạo Tiến sĩ</span>
                    <ChevronRight size={10} />
                  </button>
                  <button onClick={() => handleTabChange('training', 'dao-tao-chuyen-de')} className="w-full text-left px-4 py-2 text-2xs font-bold text-ink hover:bg-muted hover:text-primary-500 transition-colors flex items-center justify-between">
                    <span>Đào tạo, tập huấn chuyên đề</span>
                    <ChevronRight size={10} />
                  </button>
                  <button onClick={() => handleTabChange('training', 'hoi-nghi-kh')} className="w-full text-left px-4 py-2 text-2xs font-bold text-ink hover:bg-muted hover:text-primary-500 transition-colors flex items-center justify-between">
                    <span>Hội nghị khoa học</span>
                    <ChevronRight size={10} />
                  </button>
                </div>
              </div>

              {/* Thí nghiệm / Chứng nhận */}
              <div className="relative group">
                <button
                  onClick={() => handleTabChange('testing', 'all')}
                  className={cn(
                    "px-4 py-2 rounded-xl text-2xs font-extrabold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer",
                    activeTab === 'testing'
                      ? "bg-primary-500 text-white shadow-sm"
                      : "text-ink-secondary hover:bg-muted hover:text-ink"
                  )}
                >
                  {lang === 'vi' ? 'Thí nghiệm & Chứng nhận' : 'Testing & Cert'}
                  <ChevronDown size={12} className="opacity-70 group-hover:rotate-180 transition-transform duration-200" />
                </button>
                <div className="absolute left-0 mt-1 w-64 bg-surface border border-border shadow-dropdown rounded-xl py-2 hidden group-hover:block z-40 animate-fade-in">
                  <button onClick={() => handleTabChange('testing', 'thi-nghiem')} className="w-full text-left px-4 py-2 text-2xs font-bold text-ink hover:bg-muted hover:text-primary-500 transition-colors flex items-center justify-between">
                    <span>Thí nghiệm chuyên ngành</span>
                    <ChevronRight size={10} />
                  </button>
                  <button onClick={() => handleTabChange('testing', 'chung-nhan')} className="w-full text-left px-4 py-2 text-2xs font-bold text-ink hover:bg-muted hover:text-primary-500 transition-colors flex items-center justify-between">
                    <span>Chứng nhận hợp chuẩn, hợp quy</span>
                    <ChevronRight size={10} />
                  </button>
                  <button onClick={() => handleTabChange('testing', 'kiem-dinh')} className="w-full text-left px-4 py-2 text-2xs font-bold text-ink hover:bg-muted hover:text-primary-500 transition-colors flex items-center justify-between">
                    <span>Kiểm định chất lượng công trình</span>
                    <ChevronRight size={10} />
                  </button>
                </div>
              </div>

              {/* Tư vấn & Thi công */}
              <div className="relative group">
                <button
                  onClick={() => handleTabChange('consulting', 'all')}
                  className={cn(
                    "px-4 py-2 rounded-xl text-2xs font-extrabold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer",
                    activeTab === 'consulting'
                      ? "bg-primary-500 text-white shadow-sm"
                      : "text-ink-secondary hover:bg-muted hover:text-ink"
                  )}
                >
                  {lang === 'vi' ? 'Tư vấn & Dịch vụ' : 'Consulting & Const'}
                  <ChevronDown size={12} className="opacity-70 group-hover:rotate-180 transition-transform duration-200" />
                </button>
                <div className="absolute left-0 mt-1 w-60 bg-surface border border-border shadow-dropdown rounded-xl py-2 hidden group-hover:block z-40 animate-fade-in">
                  <button onClick={() => handleTabChange('consulting', 'tu-van')} className="w-full text-left px-4 py-2 text-2xs font-bold text-ink hover:bg-muted hover:text-primary-500 transition-colors flex items-center justify-between">
                    <span>Khảo sát, Thiết kế & Giám sát</span>
                    <ChevronRight size={10} />
                  </button>
                  <button onClick={() => handleTabChange('consulting', 'thi-cong')} className="w-full text-left px-4 py-2 text-2xs font-bold text-ink hover:bg-muted hover:text-primary-500 transition-colors flex items-center justify-between">
                    <span>Thi công xây dựng & Tu bổ di tích</span>
                    <ChevronRight size={10} />
                  </button>
                  <button onClick={() => handleTabChange('consulting', 'san-pham')} className="w-full text-left px-4 py-2 text-2xs font-bold text-ink hover:bg-muted hover:text-primary-500 transition-colors flex items-center justify-between">
                    <span>Vật liệu & Hóa phẩm xây dựng</span>
                    <ChevronRight size={10} />
                  </button>
                </div>
              </div>

              {/* Hỏi - Đáp */}
              <button
                onClick={() => handleTabChange('faq', 'all')}
                className={cn(
                  "px-4 py-2 rounded-xl text-2xs font-extrabold whitespace-nowrap transition-all cursor-pointer",
                  activeTab === 'faq'
                    ? "bg-primary-500 text-white shadow-sm"
                    : "text-ink-secondary hover:bg-muted hover:text-ink"
                )}
              >
                {lang === 'vi' ? 'Hỏi - Đáp' : 'Q&A'}
              </button>
            </div>

            {/* Quick Search */}
            <div className="relative hidden sm:block w-64">
              <input
                type="text"
                placeholder={lang === 'vi' ? 'Tìm kiếm nhanh...' : 'Search...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-1.5 pl-8 pr-3 text-2xs rounded-xl border border-border bg-muted/60 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-semibold"
              />
              <Search className="absolute left-3 top-2.5 text-ink-muted" size={12} />
            </div>
          </div>
        </div>
      </div>

      {/* ─── WEB PORTAL BODY CONTENT ─── */}
      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* 1. PORTAL HOME PAGE */}
        {activeTab === 'home' && (
          <div className="space-y-6">
            {/* Redesigned Hero Section (Split-screen & Auto image slider/showcase) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch animate-fade-in-up">
              {/* Left Column: Mission, Announcements and CTAs */}
              <div className="lg:col-span-7 flex flex-col justify-between p-6 md:p-8 bg-gradient-to-br from-primary-900 via-primary-800 to-indigo-950 text-white rounded-2xl border border-primary-800 shadow-card text-left relative overflow-hidden">
                {/* Background decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary-500/10 rounded-full blur-2xl pointer-events-none"></div>

                <div className="space-y-5 relative z-10">
                  {/* Announcement Ticker */}
                  <div className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wide uppercase backdrop-blur-sm transition-colors border border-white/5 cursor-pointer max-w-full">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
                    <span className="text-red-300 whitespace-nowrap">{lang === 'vi' ? 'THÔNG BÁO MỚI:' : 'NEWSFLASH:'}</span>
                    <span className="truncate max-w-[200px] sm:max-w-xs md:max-w-md">{NEWS_ARTICLES[0].title}</span>
                  </div>

                  <h2 className="text-xl sm:text-2xl md:text-3xl font-black leading-tight tracking-tight">
                    {lang === 'vi' ? 'Tiên Phong Khoa Học Xây Dựng & Kiểm Định Công Trình Hàng Đầu' : 'Pioneering Construction Science & Engineering Inspection'}
                  </h2>
                  
                  <p className="text-2xs sm:text-xs text-white/80 leading-relaxed font-medium max-w-xl">
                    {lang === 'vi'
                      ? 'Đơn vị sự nghiệp Khoa học Công nghệ Hạng I thuộc Bộ Xây dựng. Thực hiện nghiên cứu nền tảng, soát xét quy chuẩn Việt Nam và kiểm định độc lập chất lượng các công trình trọng điểm Quốc gia như Cảng hàng không Long Thành, Nhà Quốc hội, Thủy điện Sơn La.'
                      : 'The leading Class-I national science and technology research institution under the Ministry of Construction. Responsible for building codes, standard drafting, and independent safety audits for strategic national projects.'}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-6 relative z-10">
                  <button onClick={() => handleTabChange('intro', 'all')} className="flex items-center justify-center gap-1.5 bg-white hover:bg-white/95 text-primary-900 px-5 py-3 rounded-xl text-2xs font-black shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer">
                    <ShieldCheck size={14} className="text-primary-600" />
                    {lang === 'vi' ? 'Hồ sơ năng lực Viện' : 'Explore Capabilities'}
                  </button>
                  <button onClick={() => handleTabChange('research')} className="flex items-center justify-center gap-1.5 border border-white/20 hover:bg-white/10 hover:border-white/40 text-white px-5 py-3 rounded-xl text-2xs font-bold backdrop-blur-sm transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer">
                    <BookOpen size={14} />
                    {lang === 'vi' ? 'Cơ sở dữ liệu đề tài' : 'R&D Databases'}
                  </button>
                </div>
              </div>

              {/* Right Column: Dynamic Photo Showcase Slider */}
              <div className="lg:col-span-5 relative rounded-2xl overflow-hidden border border-border shadow-card h-[320px] lg:h-auto flex flex-col justify-end">
                {/* Slides image wrap */}
                <div className="absolute inset-0 bg-muted overflow-hidden">
                  {slides.map((slide, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "absolute inset-0 transition-opacity duration-1000 ease-in-out",
                        currentSlide === idx ? "opacity-100 z-10" : "opacity-0 z-0"
                      )}
                    >
                      <img src={slide.url} alt={slide.captionVi} className="object-cover w-full h-full transform scale-105 transition-transform duration-500 hover:scale-100" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                    </div>
                  ))}
                </div>

                {/* Slides navigation dots */}
                <div className="absolute top-4 right-4 z-20 flex gap-1.5 bg-black/35 backdrop-blur-sm px-2.5 py-1.5 rounded-full border border-white/10">
                  {slides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className={cn(
                        "w-2 h-2 rounded-full transition-all cursor-pointer",
                        currentSlide === idx ? "bg-white w-4" : "bg-white/40"
                      )}
                      title={`Slide ${idx + 1}`}
                    />
                  ))}
                </div>

                {/* Active slide text overlay */}
                <div className="p-5 text-left relative z-20 text-white space-y-1">
                  <span className="inline-block px-2 py-0.5 rounded text-[8px] font-extrabold bg-primary-500 uppercase tracking-widest text-white shadow-sm">
                    {lang === 'vi' ? 'Hoạt động tiêu biểu' : 'Highlight'}
                  </span>
                  <h4 className="font-bold text-xs sm:text-sm text-white drop-shadow-md">
                    {lang === 'vi' ? slides[currentSlide].captionVi : slides[currentSlide].captionEn}
                  </h4>
                </div>
              </div>
            </div>

            {/* Quick KPI stats with custom glassmorphism containers & soft gradient backgrounds */}
            <div className="bg-muted/30 dark:bg-muted/10 p-3 rounded-[28px] border border-border-subtle backdrop-blur-sm shadow-inner">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {[
                  {
                    value: '21',
                    labelVi: 'Đơn vị trực thuộc',
                    labelEn: 'Departments',
                    icon: <Layers size={22} />,
                    bg: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/10',
                    grad: 'from-teal-500 to-emerald-600',
                    cardBg: 'from-teal-500/[0.03] to-teal-500/[0.08] dark:from-teal-950/20 dark:to-teal-950/30 border-teal-500/15 hover:border-teal-500/40'
                  },
                  {
                    value: '15+',
                    labelVi: 'Phòng thí nghiệm',
                    labelEn: 'Labs (LAS-XD)',
                    icon: <Wrench size={22} />,
                    bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/10',
                    grad: 'from-emerald-500 to-teal-600',
                    cardBg: 'from-emerald-500/[0.03] to-emerald-500/[0.08] dark:from-emerald-950/20 dark:to-emerald-950/30 border-emerald-500/15 hover:border-emerald-500/40'
                  },
                  {
                    value: '120+',
                    labelVi: 'Đề tài đã nghiệm thu',
                    labelEn: 'Approved Topics',
                    icon: <BookOpen size={22} />,
                    bg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/10',
                    grad: 'from-indigo-500 to-blue-600',
                    cardBg: 'from-indigo-500/[0.03] to-indigo-500/[0.08] dark:from-indigo-950/20 dark:to-indigo-950/30 border-indigo-500/15 hover:border-indigo-500/40'
                  },
                  {
                    value: '15',
                    labelVi: 'Dự án trọng điểm QG',
                    labelEn: 'National Projects',
                    icon: <Award size={22} />,
                    bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/10',
                    grad: 'from-rose-500 to-pink-600',
                    cardBg: 'from-rose-500/[0.03] to-rose-500/[0.08] dark:from-rose-950/20 dark:to-rose-950/30 border-rose-500/15 hover:border-rose-500/40'
                  }
                ].map((stat, idx) => (
                  <div 
                    key={idx} 
                    className={cn(
                      "group card p-5 flex items-center gap-4 hover:shadow-card-hover border hover:-translate-y-1 transition-all duration-300 bg-gradient-to-br shadow-sm cursor-default",
                      stat.cardBg
                    )}
                  >
                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-500 group-hover:scale-110 shadow-inner border", stat.bg)}>
                      {stat.icon}
                    </div>
                    <div className="text-left min-w-0">
                      <p className={cn("text-lg sm:text-xl font-black leading-none bg-gradient-to-r bg-clip-text text-transparent", stat.grad)}>
                        {stat.value}
                      </p>
                      <p className="text-[9px] text-ink-muted uppercase font-black tracking-wider leading-tight mt-1 group-hover:text-primary-500 transition-colors">
                        {lang === 'vi' ? stat.labelVi : stat.labelEn}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Lĩnh vực chuyên môn trọng tâm */}
            <div className="space-y-4 text-left">
              <div className="border-b border-border pb-3 flex justify-between items-end">
                <div>
                  <h3 className="text-sm font-black text-ink uppercase tracking-wider flex items-center gap-2">
                    <Layers size={14} className="text-primary-500" />
                    {lang === 'vi' ? 'Lĩnh vực hoạt động chuyên môn' : 'Core Competencies & Services'}
                  </h3>
                  <p className="text-3xs text-ink-muted font-bold uppercase mt-1">
                    {lang === 'vi' ? 'Năng lực cốt lõi phục vụ ngành xây dựng Việt Nam' : 'Key capabilities serving the Vietnam construction industry'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    titleVi: 'Nghiên cứu & Soạn thảo Quy chuẩn',
                    titleEn: 'Research & Code Drafting',
                    descVi: 'Biên soạn hệ thống Tiêu chuẩn quốc gia TCVN, Quy chuẩn xây dựng QCVN phục vụ quản lý Nhà nước của Bộ Xây dựng.',
                    descEn: 'Drafting national standards TCVN and building codes QCVN for the state management of the Ministry of Construction.',
                    image: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=400&auto=format&fit=crop',
                    icon: BookOpen,
                    tab: 'state-gov',
                    subTab: 'quy-chuan-tieu-chuan'
                  },
                  {
                    titleVi: 'Thử nghiệm & Kiểm chuẩn chất lượng',
                    titleEn: 'Testing & Calibration services',
                    descVi: 'Hệ thống phòng thí nghiệm LAS-XD đạt chuẩn VILAS/ISO 17025 về chịu lửa, cơ lý bê tông, địa kỹ thuật.',
                    descEn: 'LAS-XD laboratory systems certified with VILAS/ISO 17025 for fire-safety, concrete mechanics, and geotechnics.',
                    image: 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?q=80&w=400&auto=format&fit=crop',
                    icon: ShieldCheck,
                    tab: 'intro',
                    subTab: 'phong-lab'
                  },
                  {
                    titleVi: 'Kiểm định & Giám định kỹ thuật',
                    titleEn: 'Technical Audit & Quality Control',
                    descVi: 'Giám định độc lập chất lượng thi công bê tông, thép mái, quan trắc lún nghiêng công trình trọng điểm.',
                    descEn: 'Independent inspection of structural concrete, steel roof frames, and displacement monitoring for key projects.',
                    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=400&auto=format&fit=crop',
                    icon: Wrench,
                    tab: 'state-gov',
                    subTab: 'du-an-trong-diem'
                  },
                  {
                    titleVi: 'Đào tạo Tiến sĩ & Hợp tác quốc tế',
                    titleEn: 'Doctoral Training & Global R&D',
                    descVi: 'Cơ sở đào tạo Tiến sĩ kỹ thuật đầu ngành, hợp tác nghiên cứu song phương JICA (Nhật Bản), KICT (Hàn Quốc).',
                    descEn: 'Preeminent training base for PhD candidates, bilateral research with JICA (Japan) and KICT (Korea).',
                    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=400&auto=format&fit=crop',
                    icon: Users,
                    tab: 'intro',
                    subTab: 'co-cau'
                  }
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div 
                      key={idx} 
                      onClick={() => handleTabChange(item.tab, item.subTab)}
                      className="group relative rounded-2xl overflow-hidden border border-border bg-surface shadow-card hover:shadow-card-hover transition-all duration-300 cursor-pointer h-48 flex flex-col justify-end text-left"
                    >
                      <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: `url(${item.image})` }}></div>
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/70 to-slate-900/10 group-hover:from-slate-950 transition-colors"></div>
                      
                      <div className="relative z-10 p-4 space-y-1.5 text-white">
                        <div className="w-8 h-8 rounded-lg bg-primary-500/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-primary-400 group-hover:bg-primary-500 group-hover:text-white transition-all duration-300">
                          <Icon size={16} />
                        </div>
                        <h4 className="font-extrabold text-2xs md:text-xs text-white group-hover:text-primary-400 transition-colors">
                          {lang === 'vi' ? item.titleVi : item.titleEn}
                        </h4>
                        <p className="text-[10px] text-white/70 line-clamp-2 leading-relaxed font-semibold">
                          {lang === 'vi' ? item.descVi : item.descEn}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tin nổi bật trang chủ */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <h3 className="text-sm font-black text-ink uppercase tracking-wider flex items-center gap-2">
                  <Activity size={14} className="text-primary-500" />
                  {lang === 'vi' ? 'Tin hoạt động & Nghiệm thu mới' : 'Latest Activities & Approvals'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[NEWS_ARTICLES[5], NEWS_ARTICLES[6], NEWS_ARTICLES[7], NEWS_ARTICLES[0]].map((art) => (
                    <div 
                      key={art.id} 
                      onClick={() => handleViewArticle(art)} 
                      className="group card overflow-hidden hover:shadow-card-hover hover:border-primary-300 transition-all duration-300 cursor-pointer flex flex-col justify-between text-left animate-fade-in"
                    >
                      <div>
                        <div className="h-40 overflow-hidden relative">
                          <img src={art.image} alt={art.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                          <div className="absolute top-3 left-3">
                            <span className="inline-block px-2.5 py-1 rounded-lg text-[9px] font-extrabold uppercase bg-primary-600/90 text-white backdrop-blur-sm border border-white/10 shadow-sm">
                              {art.category === 'tin-hoat-dong' ? 'Tin hoạt động' : 'Dự án trọng điểm'}
                            </span>
                          </div>
                        </div>
                        <div className="p-4 space-y-2">
                          <h4 className="font-bold text-ink text-xs line-clamp-2 group-hover:text-primary-500 transition-colors leading-snug">
                            {art.title}
                          </h4>
                          <p className="text-2xs text-ink-secondary line-clamp-2 leading-relaxed font-semibold">
                            {art.summary}
                          </p>
                        </div>
                      </div>
                      <div className="px-4 pb-4 pt-2 flex items-center justify-between text-[10px] text-ink-muted border-t border-border-subtle font-semibold">
                        <span className="truncate max-w-[100px]">{art.author}</span>
                        <span className="flex items-center gap-1.5"><Calendar size={11} /> {art.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cột Bên Phải: Tin tức mới & Tin tức nổi bật như bên web cũ */}
              <div className="space-y-6 text-left">
                
                {/* WIDGET 1: TIN TỨC MỚI */}
                <div className="space-y-2.5">
                  <h3 className="text-2xs sm:text-xs font-black text-ink uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-border-subtle">
                    <Activity size={12} className="text-primary-500" />
                    {lang === 'vi' ? 'Tin tức mới' : 'Latest News'}
                  </h3>
                  <div className="space-y-2">
                    {[NEWS_ARTICLES[4], NEWS_ARTICLES[2], NEWS_ARTICLES[3], NEWS_ARTICLES[10], NEWS_ARTICLES[11]].map((art) => (
                      <div 
                        key={art.id} 
                        onClick={() => handleViewArticle(art)}
                        className="group flex gap-2.5 items-start cursor-pointer hover:bg-muted/40 p-1.5 rounded-xl transition-all duration-300"
                      >
                        <div className="w-12 h-9 rounded-lg overflow-hidden shrink-0 bg-muted border border-border-subtle">
                          <img src={art.image} alt={art.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-extrabold text-[10px] text-ink group-hover:text-primary-500 transition-colors leading-tight line-clamp-2">
                            {art.title}
                          </h4>
                          <span className="text-[8px] text-ink-muted font-bold block mt-0.5">{art.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* WIDGET 2: TIN TỨC NỔI BẬT */}
                <div className="space-y-2.5">
                  <h3 className="text-2xs sm:text-xs font-black text-ink uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-border-subtle">
                    <Award size={12} className="text-primary-500" />
                    {lang === 'vi' ? 'Tin tức nổi bật' : 'Featured News'}
                  </h3>
                  <div className="space-y-2">
                    {[NEWS_ARTICLES[1], NEWS_ARTICLES[8], NEWS_ARTICLES[9], NEWS_ARTICLES[0], NEWS_ARTICLES[2]].map((art) => (
                      <div 
                        key={art.id} 
                        onClick={() => handleViewArticle(art)}
                        className="group flex gap-2.5 items-start cursor-pointer hover:bg-muted/40 p-1.5 rounded-xl transition-all duration-300"
                      >
                        <div className="w-12 h-9 rounded-lg overflow-hidden shrink-0 bg-muted border border-border-subtle">
                          <img src={art.image} alt={art.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-extrabold text-[10px] text-ink group-hover:text-primary-500 transition-colors leading-tight line-clamp-2">
                            {art.title}
                          </h4>
                          <span className="text-[8px] text-ink-muted font-bold block mt-0.5">{art.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ─── HOẠT ĐỘNG KHOA HỌC & ĐÀO TẠO CHUYÊN SÂU (ADVANCED R&D SECTION) ─── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch border-t border-border-subtle pt-6">
              {/* Cột Trái: Bộ Tra Cứu Quy Chuẩn & Tiêu Chuẩn Quốc Gia */}
              <div className="lg:col-span-5 flex flex-col justify-between p-6 bg-surface hover:shadow-card-hover border border-border rounded-2xl transition-all duration-300 text-left relative overflow-hidden group">
                <div className="space-y-5">
                  <div className="space-y-1">
                    <h3 className="text-xs sm:text-sm font-black text-ink tracking-wide flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-primary-500/10 flex items-center justify-center text-primary-500 shrink-0">
                        <FileText size={13} />
                      </div>
                      {lang === 'vi' ? 'Tra cứu nhanh Quy chuẩn - Tiêu chuẩn' : 'Standards & Codes Lookup'}
                    </h3>
                    <p className="text-[10px] text-ink-muted font-bold uppercase tracking-wider pl-8">
                      {lang === 'vi' ? 'Hệ thống quy chuẩn xây dựng do IBST chủ trì biên soạn' : 'Key regulations drafted and maintained by IBST'}
                    </p>
                  </div>

                  {/* Danh sách các Quy chuẩn / Tiêu chuẩn để chọn nhanh (Segmented Control style) */}
                  <div className="bg-muted/50 p-1 rounded-xl border border-border-subtle grid grid-cols-3 gap-1">
                    {[
                      { id: 'qcvn06', label: 'QCVN 06:2026' },
                      { id: 'qcvn16', label: 'QCVN 16:2023' },
                      { id: 'tcvn9311', label: 'TCVN 9311' }
                    ].map((std) => (
                      <button
                        key={std.id}
                        onClick={() => setSelectedStandard(std.id)}
                        className={cn(
                          "py-2 text-[10px] font-extrabold rounded-lg text-center transition-all cursor-pointer",
                          selectedStandard === std.id
                            ? "bg-primary-500 text-white shadow-sm"
                            : "text-ink-secondary hover:text-ink hover:bg-surface/50"
                        )}
                      >
                        {std.label}
                      </button>
                    ))}
                  </div>

                  {/* Thẻ hiển thị chi tiết Quy chuẩn được chọn (High-tech Datasheet layout) */}
                  <div className="relative pl-5 py-4 pr-4 bg-gradient-to-br from-surface to-primary-500/[0.02] border border-primary-500/15 rounded-xl space-y-3 shadow-inner overflow-hidden before:absolute before:left-0 before:top-4 before:bottom-4 before:w-1 before:bg-primary-500 before:rounded-r-lg">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary-500/[0.02] rounded-full blur-xl pointer-events-none"></div>
                    
                    {selectedStandard === 'qcvn06' && (
                      <div className="space-y-3 text-left animate-fade-in">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="text-[9px] font-black text-primary-500 uppercase tracking-widest">Quy chuẩn phòng cháy</span>
                          <span className="px-2 py-0.5 rounded-md text-[8px] font-extrabold uppercase bg-amber-500/10 text-amber-600 border border-amber-500/10 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                            {lang === 'vi' ? 'Đang soát xét 2026' : 'Under Revision'}
                          </span>
                        </div>
                        <h4 className="font-extrabold text-[12px] text-ink leading-snug">QCVN 06:2026/BXD - Quy chuẩn quốc gia về An toàn cháy cho nhà và công trình</h4>
                        <p className="text-2xs text-ink-secondary leading-relaxed font-semibold">Quy định các yêu cầu bắt buộc về an toàn cháy đối với nhà và công trình xây dựng khi thiết kế, xây dựng mới hoặc cải tạo tại Việt Nam.</p>
                        
                        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border-subtle">
                          <div className="p-2.5 bg-muted/30 border border-border-subtle rounded-xl space-y-1">
                            <span className="text-[9px] text-ink-muted uppercase font-black tracking-wider block">Cơ quan phê duyệt</span>
                            <span className="text-[10px] text-ink font-bold block">{lang === 'vi' ? 'Bộ Xây dựng' : 'MOC Vietnam'}</span>
                          </div>
                          <div className="p-2.5 bg-muted/30 border border-border-subtle rounded-xl space-y-1">
                            <span className="text-[9px] text-ink-muted uppercase font-black tracking-wider block">Đối chiếu quốc tế</span>
                            <span className="text-[10px] text-ink font-bold block">ISO 834, NFPA 101</span>
                          </div>
                        </div>

                        {/* Stepper Tiến độ biên soạn */}
                        <div className="pt-3 border-t border-border-subtle space-y-2">
                          <span className="text-[9px] text-ink-muted uppercase font-black tracking-wider block">{lang === 'vi' ? 'Tiến trình soát xét & Ban hành' : 'Drafting & Issuing Progress'}</span>
                          <div className="flex items-center justify-between relative mt-1 px-2">
                            <div className="absolute left-4 right-4 top-[8px] h-0.5 bg-muted z-0">
                              <div className="h-full bg-primary-500 transition-all duration-500" style={{ width: '66%' }}></div>
                            </div>
                            {[
                              { labelVi: 'Dự thảo', labelEn: 'Draft', status: 'done' },
                              { labelVi: 'Ý kiến', labelEn: 'Feedback', status: 'done' },
                              { labelVi: 'Thẩm định', labelEn: 'Appraisal', status: 'active' },
                              { labelVi: 'Ban hành', labelEn: 'Enacted', status: 'pending' }
                            ].map((step, idx) => (
                              <div key={idx} className="flex flex-col items-center relative z-10">
                                <div className={cn(
                                  "w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-black border transition-all",
                                  step.status === 'done' && "bg-primary-500 text-white border-primary-500",
                                  step.status === 'active' && "bg-surface text-primary-500 border-primary-500 ring-2 ring-primary-500/20 animate-pulse",
                                  step.status === 'pending' && "bg-surface text-ink-muted border-border"
                                )}>
                                  {step.status === 'done' ? '✓' : idx + 1}
                                </div>
                                <span className={cn(
                                  "text-[8px] font-bold mt-1 scale-90 sm:scale-100",
                                  step.status === 'pending' ? "text-ink-muted" : "text-ink-secondary"
                                )}>
                                  {lang === 'vi' ? step.labelVi : step.labelEn}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedStandard === 'qcvn16' && (
                      <div className="space-y-3 text-left animate-fade-in">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="text-[9px] font-black text-primary-500 uppercase tracking-widest">Quy chuẩn vật liệu</span>
                          <span className="px-2 py-0.5 rounded-md text-[8px] font-extrabold uppercase bg-success-500/10 text-success-600 border border-success-500/10 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-success-500"></span>
                            {lang === 'vi' ? 'Đang có hiệu lực' : 'Active'}
                          </span>
                        </div>
                        <h4 className="font-extrabold text-[12px] text-ink leading-snug">QCVN 16:2023/BXD - Quy chuẩn quốc gia về Sản phẩm, hàng hóa vật liệu xây dựng</h4>
                        <p className="text-2xs text-ink-secondary leading-relaxed font-semibold">Quy định các giới hạn đặc tính kỹ thuật và yêu cầu quản lý chất lượng các nhóm sản phẩm xi măng, phụ gia, kính xây dựng, vật liệu lợp...</p>
                        
                        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border-subtle">
                          <div className="p-2.5 bg-muted/30 border border-border-subtle rounded-xl space-y-1">
                            <span className="text-[9px] text-ink-muted uppercase font-black tracking-wider block">Cơ quan phê duyệt</span>
                            <span className="text-[10px] text-ink font-bold block">{lang === 'vi' ? 'Bộ Xây dựng' : 'MOC Vietnam'}</span>
                          </div>
                          <div className="p-2.5 bg-muted/30 border border-border-subtle rounded-xl space-y-1">
                            <span className="text-[9px] text-ink-muted uppercase font-black tracking-wider block">Đối chiếu quốc tế</span>
                            <span className="text-[10px] text-ink font-bold block">EN, ASTM</span>
                          </div>
                        </div>

                        {/* Stepper Tiến độ biên soạn */}
                        <div className="pt-3 border-t border-border-subtle space-y-2">
                          <span className="text-[9px] text-ink-muted uppercase font-black tracking-wider block">{lang === 'vi' ? 'Tiến trình soát xét & Ban hành' : 'Drafting & Issuing Progress'}</span>
                          <div className="flex items-center justify-between relative mt-1 px-2">
                            <div className="absolute left-4 right-4 top-[8px] h-0.5 bg-muted z-0">
                              <div className="h-full bg-primary-500 transition-all duration-500" style={{ width: '100%' }}></div>
                            </div>
                            {[
                              { labelVi: 'Dự thảo', labelEn: 'Draft', status: 'done' },
                              { labelVi: 'Ý kiến', labelEn: 'Feedback', status: 'done' },
                              { labelVi: 'Thẩm định', labelEn: 'Appraisal', status: 'done' },
                              { labelVi: 'Ban hành', labelEn: 'Enacted', status: 'done' }
                            ].map((step, idx) => (
                              <div key={idx} className="flex flex-col items-center relative z-10">
                                <div className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-black border bg-primary-500 text-white border-primary-500 shadow-sm">
                                  ✓
                                </div>
                                <span className="text-[8px] font-bold mt-1 text-primary-500 scale-90 sm:scale-100">
                                  {lang === 'vi' ? step.labelVi : step.labelEn}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedStandard === 'tcvn9311' && (
                      <div className="space-y-3 text-left animate-fade-in">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="text-[9px] font-black text-primary-500 uppercase tracking-widest">Tiêu chuẩn thử hỏa hoạn</span>
                          <span className="px-2 py-0.5 rounded-md text-[8px] font-extrabold uppercase bg-success-500/10 text-success-600 border border-success-500/10 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-success-500"></span>
                            {lang === 'vi' ? 'Đang có hiệu lực' : 'Active'}
                          </span>
                        </div>
                        <h4 className="font-extrabold text-[12px] text-ink leading-snug">TCVN 9311-1:2012 - Thử nghiệm chịu lửa cho các bộ phận kết cấu công trình xây dựng</h4>
                        <p className="text-2xs text-ink-secondary leading-relaxed font-semibold">Quy định quy trình xác định giới hạn chịu lửa của cấu kiện dầm, cột, sàn, tường ngăn khi tiếp xúc với lửa trong các điều kiện lò thử tiêu chuẩn.</p>
                        
                        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border-subtle">
                          <div className="p-2.5 bg-muted/30 border border-border-subtle rounded-xl space-y-1">
                            <span className="text-[9px] text-ink-muted uppercase font-black tracking-wider block">Cơ quan biên soạn</span>
                            <span className="text-[10px] text-ink font-bold block">{lang === 'vi' ? 'IBST Việt Nam' : 'IBST Vietnam'}</span>
                          </div>
                          <div className="p-2.5 bg-muted/30 border border-border-subtle rounded-xl space-y-1">
                            <span className="text-[9px] text-ink-muted uppercase font-black tracking-wider block">Đối chiếu quốc tế</span>
                            <span className="text-[10px] text-ink font-bold block">ISO 834-1:1999</span>
                          </div>
                        </div>

                        {/* Stepper Tiến độ biên soạn */}
                        <div className="pt-3 border-t border-border-subtle space-y-2">
                          <span className="text-[9px] text-ink-muted uppercase font-black tracking-wider block">{lang === 'vi' ? 'Tiến trình soát xét & Ban hành' : 'Drafting & Issuing Progress'}</span>
                          <div className="flex items-center justify-between relative mt-1 px-2">
                            <div className="absolute left-4 right-4 top-[8px] h-0.5 bg-muted z-0">
                              <div className="h-full bg-primary-500 transition-all duration-500" style={{ width: '100%' }}></div>
                            </div>
                            {[
                              { labelVi: 'Dự thảo', labelEn: 'Draft', status: 'done' },
                              { labelVi: 'Ý kiến', labelEn: 'Feedback', status: 'done' },
                              { labelVi: 'Thẩm định', labelEn: 'Appraisal', status: 'done' },
                              { labelVi: 'Ban hành', labelEn: 'Enacted', status: 'done' }
                            ].map((step, idx) => (
                              <div key={idx} className="flex flex-col items-center relative z-10">
                                <div className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-black border bg-primary-500 text-white border-primary-500 shadow-sm">
                                  ✓
                                </div>
                                <span className="text-[8px] font-bold mt-1 text-primary-500 scale-90 sm:scale-100">
                                  {lang === 'vi' ? step.labelVi : step.labelEn}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-border-subtle flex justify-between items-center text-3xs font-bold text-ink-muted">
                  <span>Ban biên tập Quy chuẩn & Tiêu chuẩn IBST</span>
                  <a href="#state-gov" onClick={(e) => { e.preventDefault(); handleTabChange('state-gov', 'quy-chuan-tieu-chuan'); }} className="hover:text-primary-500 hover:underline flex items-center gap-1 transition-colors">
                    {lang === 'vi' ? 'Xem tất cả' : 'View all'} <ChevronRight size={10} className="transition-transform group-hover:translate-x-0.5" />
                  </a>
                </div>
              </div>

              {/* Cột Phải: Biểu Đồ Thống Kê CSS Động + Bảng chỉ số phụ */}
              <div className="lg:col-span-7 flex flex-col justify-between p-6 bg-surface hover:shadow-card-hover border border-border rounded-2xl transition-all duration-300 text-left relative overflow-hidden group">
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2 border-b border-border-subtle">
                    <div className="space-y-1">
                      <h3 className="text-xs sm:text-sm font-black text-ink tracking-wide flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-primary-500/10 flex items-center justify-center text-primary-500 shrink-0">
                          <Activity size={13} />
                        </div>
                        {lang === 'vi' ? 'Hoạt động Khoa học & Ban hành Tiêu chuẩn' : 'R&D Outputs & Standard Publications'}
                      </h3>
                      <p className="text-[10px] text-ink-muted font-bold uppercase tracking-wider pl-8">
                        {lang === 'vi' ? 'Số liệu tổng hợp kết quả nghiên cứu khoa học qua các năm' : 'Summary of scientific research outputs over the years'}
                      </p>
                    </div>

                    {/* Chú giải (Legend) */}
                    <div className="flex items-center gap-4 text-3xs font-bold text-ink-muted pl-8 sm:pl-0">
                      <div className="flex items-center gap-1.5 font-bold">
                        <span className="w-2.5 h-2.5 rounded-sm bg-gradient-to-r from-primary-500 to-indigo-600"></span>
                        <span>Đề tài R&D</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-bold">
                        <span className="w-2.5 h-2.5 rounded-sm bg-gradient-to-r from-emerald-500 to-teal-500"></span>
                        <span>Tiêu chuẩn</span>
                      </div>
                    </div>
                  </div>

                  {/* Vùng vẽ biểu đồ (Chart Body) - Tăng chiều cao để chiếm không gian cân đối */}
                  <div className="h-48 flex items-end gap-5 md:gap-7 border-b border-border-subtle pb-2 relative z-10 pt-4">
                    {/* Đường lưới phụ (Grid lines) */}
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-3xs font-bold text-ink-muted/20 z-0">
                      <div className="border-b border-border-subtle w-full pb-1 flex justify-between"><span>40</span><span></span></div>
                      <div className="border-b border-border-subtle w-full pb-1 flex justify-between"><span>30</span><span></span></div>
                      <div className="border-b border-border-subtle w-full pb-1 flex justify-between"><span>20</span><span></span></div>
                      <div className="border-b border-border-subtle w-full pb-1 flex justify-between"><span>10</span><span></span></div>
                    </div>

                    {/* Các cột dữ liệu */}
                    {[
                      { year: '2020', research: 24, standards: 6 },
                      { year: '2021', research: 28, standards: 8 },
                      { year: '2022', research: 32, standards: 7 },
                      { year: '2023', research: 35, standards: 10 },
                      { year: '2024', research: 38, standards: 12 },
                      { year: '2025', research: 42, standards: 15 }
                    ].map((data, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end relative z-10">
                        <div className="w-full flex items-end justify-center gap-1 md:gap-2 h-full">
                          {/* Đề tài R&D (Cột màu Xanh) */}
                          <div 
                            className="w-3 sm:w-4 rounded-t bg-gradient-to-t from-primary-500 to-indigo-600 hover:from-primary-600 hover:to-indigo-700 transition-all duration-300 relative group/bar cursor-pointer shadow-sm shadow-primary-500/10 hover:shadow-primary-500/30"
                            style={{ height: `${(data.research / 45) * 100}%` }}
                          >
                            {/* Tooltip */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2.5 py-1 bg-slate-900 dark:bg-slate-800 text-white rounded-lg text-[8px] font-extrabold whitespace-nowrap opacity-0 pointer-events-none group-hover/bar:opacity-100 transition-opacity duration-200 shadow-md z-30">
                              {data.research} {lang === 'vi' ? 'Đề tài R&D' : 'R&D Topics'}
                            </div>
                          </div>

                          {/* Quy chuẩn (Cột màu Xanh lá) */}
                          <div 
                            className="w-3 sm:w-4 rounded-t bg-gradient-to-t from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 relative group/bar cursor-pointer shadow-sm shadow-emerald-500/10 hover:shadow-emerald-500/30"
                            style={{ height: `${(data.standards / 45) * 100}%` }}
                          >
                            {/* Tooltip */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2.5 py-1 bg-slate-900 dark:bg-slate-800 text-white rounded-lg text-[8px] font-extrabold whitespace-nowrap opacity-0 pointer-events-none group-hover/bar:opacity-100 transition-opacity duration-200 shadow-md z-30">
                              {data.standards} {lang === 'vi' ? 'Tiêu chuẩn' : 'Standards'}
                            </div>
                          </div>
                        </div>
                        {/* Nhãn năm */}
                        <span className="text-[10px] font-extrabold text-ink-muted tracking-wider">{data.year}</span>
                      </div>
                    ))}
                  </div>

                  {/* Bảng chỉ số phụ bên dưới biểu đồ để tận dụng không gian trống hoàn hảo */}
                  <div className="grid grid-cols-3 gap-3 pt-3 mt-1">
                    {[
                      { label: lang === 'vi' ? 'Đề tài cấp Nhà nước' : 'State Projects', value: '12' },
                      { label: lang === 'vi' ? 'Đề tài cấp Bộ' : 'Ministry Projects', value: '86' },
                      { label: lang === 'vi' ? 'Giải thưởng KHCN' : 'Science Awards', value: '05' }
                    ].map((metric, idx) => (
                      <div key={idx} className="p-2.5 bg-muted/20 border border-border-subtle rounded-xl text-center shadow-inner">
                        <span className="text-[14px] font-black text-primary-500 block leading-tight">{metric.value}</span>
                        <span className="text-[8px] text-ink-muted uppercase font-black tracking-wider block mt-0.5">{metric.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Thành tựu khoa học nổi bật để lấp đầy khoảng trắng */}
                  <div className="p-3 bg-muted/30 border border-border rounded-xl space-y-1.5 text-3xs font-semibold text-ink-secondary leading-relaxed mt-2.5">
                    <span className="text-[8px] text-ink-muted uppercase font-black tracking-wider block">{lang === 'vi' ? 'Thành tựu & Đề tài nổi bật mới nhất:' : 'Latest Achievements & Key Research:'}</span>
                    <ul className="list-disc pl-3.5 space-y-1">
                      <li>
                        {lang === 'vi' 
                          ? 'Nghiên cứu ứng dụng thành công bê tông siêu tính năng (UHPC) chế tạo cấu kiện đúc sẵn lắp ghép cho vùng biển đảo.'
                          : 'Successfully applied Ultra-High-Performance Concrete (UHPC) for precast marine structures.'}
                      </li>
                      <li>
                        {lang === 'vi' 
                          ? 'Hoàn thành soát xét kỹ thuật quy chuẩn Việt Nam về an toàn cháy cho nhà và công trình (QCVN 06:2026/BXD).'
                          : 'Completed technical revision of the Vietnam national code on building fire safety (QCVN 06:2026/BXD).'}
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-border-subtle flex justify-between items-center text-3xs font-bold text-ink-muted">
                  <span>Nguồn: Phòng Quản lý Khoa học & Đào tạo IBST</span>
                  <span className="text-[10px] text-success-500 font-extrabold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-success-500 animate-ping"></span>
                    {lang === 'vi' ? 'Đã cập nhật Q1/2026' : 'Updated Q1/2026'}
                  </span>
                </div>
              </div>
            </div>

            {/* ─── BẢN ĐỒ DỰ ÁN QUỐC GIA & KỆ TẠP CHÍ KHOA HỌC (MAP & JOURNAL SHELF) ─── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch border-t border-border-subtle pt-6 mt-6">
              
              {/* Cột 1: Bản đồ tương tác SVG & Google Map (col-span-7) */}
              <div className="lg:col-span-7 card p-5 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex justify-between items-center border-b border-border pb-3">
                    <h3 className="text-sm font-black text-ink flex items-center gap-2">
                      <MapPin className="text-primary-500" size={16} />
                      {lang === 'vi' ? 'Bản đồ Dự án & Trụ sở IBST' : 'Key Projects & Offices Map'}
                    </h3>
                    
                    {/* Toggle Map Mode */}
                    <div className="flex bg-muted p-0.5 rounded-lg border border-border-subtle gap-1">
                      <button
                        onClick={() => setMapMode('project')}
                        className={cn(
                          "px-3 py-1.5 text-3xs font-extrabold rounded-md cursor-pointer transition-all flex items-center gap-1",
                          mapMode === 'project' ? "bg-surface text-primary-500 shadow-sm" : "text-ink-muted hover:text-ink"
                        )}
                      >
                        <Globe size={10} />
                        {lang === 'vi' ? 'DỰ ÁN TIÊU BIỂU' : 'KEY PROJECTS'}
                      </button>
                      <button
                        onClick={() => setMapMode('google')}
                        className={cn(
                          "px-3 py-1.5 text-3xs font-extrabold rounded-md cursor-pointer transition-all flex items-center gap-1 relative overflow-visible",
                          mapMode === 'google' ? "bg-surface text-primary-500 shadow-sm" : "text-ink-muted hover:text-ink"
                        )}
                      >
                        <MapPin size={10} />
                        {lang === 'vi' ? 'BẢN ĐỒ VỊ TRÍ' : 'GOOGLE MAP'}
                        <span className="absolute -top-1 -right-1 flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                        </span>
                      </button>
                    </div>
                  </div>
                  
                  {mapMode === 'project' ? (
                    <p className="text-3xs text-ink-muted leading-relaxed font-semibold mt-2 animate-fade-in">
                      {lang === 'vi' 
                        ? 'Nhấp chọn các điểm ghim (markers) trên bản đồ để xem chi tiết vai trò khoa học kỹ thuật và năng lực thực chiến của IBST tại các công trình trọng điểm đất nước.'
                        : 'Click pulsing markers on the map to explore IBST\'s technical engineering roles in national key projects.'}
                    </p>
                  ) : (
                    <p className="text-3xs text-ink-muted leading-relaxed font-semibold mt-2 animate-fade-in">
                      {lang === 'vi' 
                        ? 'Nhấp chọn các chi nhánh hoặc văn phòng phân viện để hiển thị vị trí định vị vệ tinh GPS thời gian thực trên bản đồ Google Maps.'
                        : 'Select any regional branch office to display its real-time GPS coordinates and route on Google Maps.'}
                    </p>
                  )}
                </div>

                {mapMode === 'project' ? (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch h-[280px] animate-fade-in">
                    {/* Left: General Google Map of Vietnam / Project Map */}
                    <div className="md:col-span-7 bg-muted border border-border rounded-xl overflow-hidden relative shadow-inner h-full min-h-[180px] md:min-h-0">
                      <iframe 
                        src={selectedMapProject 
                          ? `https://maps.google.com/maps?q=${encodeURIComponent(selectedMapProject.nameVi.split('(')[0])}&t=&z=13&ie=UTF8&iwloc=&output=embed`
                          : "https://maps.google.com/maps?q=B%E1%BA%A3n%20%C4%91%E1%BB%93%20Vi%E1%BB%87t%20Nam&t=&z=5&ie=UTF8&iwloc=&output=embed"
                        }
                        className="w-full h-full border-0 absolute inset-0"
                        allowFullScreen
                        loading="lazy"
                      ></iframe>
                    </div>

                    {/* Right: Vertical List of Projects with Inline Accordion Detail */}
                    <div className="md:col-span-5 flex flex-col h-[280px] overflow-y-auto pr-1 space-y-2 text-left">
                      <span className="text-[8px] text-ink-muted uppercase font-black tracking-wider block mb-1">
                        {lang === 'vi' ? 'Danh sách dự án trọng điểm:' : 'Key Projects List:'}
                      </span>
                      {MAP_PROJECTS.map((proj) => {
                        const active = selectedMapProject?.id === proj.id;
                        return (
                          <div 
                            key={proj.id}
                            className={cn(
                              "border rounded-xl p-2.5 transition-all duration-200 cursor-pointer text-left flex flex-col",
                              active 
                                ? "bg-primary/5 border-primary-500/35 shadow-sm" 
                                : "bg-muted/30 border-border hover:bg-muted"
                            )}
                            onClick={() => setSelectedMapProject(active ? null : proj)}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <span className={cn(
                                "text-[10px] font-extrabold leading-tight",
                                active ? "text-primary-500 font-black" : "text-ink"
                              )}>
                                {lang === 'vi' ? proj.nameVi : proj.nameEn}
                              </span>
                              <span className={cn(
                                "w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0",
                                active ? "bg-primary-500 animate-ping" : "bg-ink-muted/45"
                              )} />
                            </div>
                            
                            {active && (
                              <div className="mt-2 pt-2 border-t border-border-subtle text-[8.5px] space-y-1.5 animate-fade-in">
                                <div className="space-y-0.5">
                                  <span className="font-black text-ink-muted uppercase text-[7px] block">{lang === 'vi' ? 'Vai trò của IBST' : 'IBST\'s Role'}</span>
                                  <p className="text-ink-secondary leading-normal font-semibold">
                                    {lang === 'vi' ? proj.roleVi : proj.roleEn}
                                  </p>
                                </div>
                                <div className="space-y-0.5">
                                  <span className="font-black text-ink-muted uppercase text-[7px] block">{lang === 'vi' ? 'Thông số kỹ thuật' : 'Technical Specs'}</span>
                                  <p className="text-ink-secondary leading-normal font-medium">
                                    {lang === 'vi' ? proj.specsVi : proj.specsEn}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch h-[280px] animate-fade-in text-left">
                    {/* Left: Google Map for Regional Offices */}
                    <div className="md:col-span-7 bg-muted border border-border rounded-xl overflow-hidden relative shadow-inner h-full min-h-[180px] md:min-h-0">
                      {selectedOffice === 'hanoi' && (
                        <iframe 
                          src="https://maps.google.com/maps?q=Vi%E1%BB%87n%20Khoa%20h%E1%BB%8Dc%20C%C3%B4ng%20ngh%E1%BB%87%20X%C3%A2y%20d%E1%BB%B1ng%2081%20Tr%E1%BA%A7n%20Cung&t=&z=15&ie=UTF8&iwloc=&output=embed"
                          className="w-full h-full border-0 absolute inset-0"
                          allowFullScreen
                          loading="lazy"
                        ></iframe>
                      )}
                      {selectedOffice === 'danang' && (
                        <iframe 
                          src="https://maps.google.com/maps?q=Ph%C3%A2n%20vi%E1%BB%87n%20Mi%E1%BB%81n%20Trung%20IBST%20183%20Ph%E1%BA%A1m%20V%C4%83n%20%C4%90%E1%BB%93ng&t=&z=15&ie=UTF8&iwloc=&output=embed"
                          className="w-full h-full border-0 absolute inset-0"
                          allowFullScreen
                          loading="lazy"
                        ></iframe>
                      )}
                      {selectedOffice === 'hcm' && (
                        <iframe 
                          src="https://maps.google.com/maps?q=Ph%C3%A2n%20vi%E1%BB%87n%20Mi%E1%BB%81n%20Nam%20IBST%2020%2F5B%20Qu%E1%BB%91c%20l%E1%BB%99%2013&t=&z=15&ie=UTF8&iwloc=&output=embed"
                          className="w-full h-full border-0 absolute inset-0"
                          allowFullScreen
                          loading="lazy"
                        ></iframe>
                      )}
                    </div>

                    {/* Right: Regional Office Selection List */}
                    <div className="md:col-span-5 flex flex-col justify-between py-0.5 space-y-2 h-full">
                      <div className="space-y-1.5">
                        <button
                          onClick={() => setSelectedOffice('hanoi')}
                          className={cn(
                            "w-full text-left p-2 rounded-xl border transition-all cursor-pointer flex flex-col space-y-0.5",
                            selectedOffice === 'hanoi' 
                              ? "bg-primary/5 border-primary-500/25 text-primary-500 shadow-sm" 
                              : "bg-muted/30 border-border hover:bg-muted text-ink-secondary"
                          )}
                        >
                          <span className="text-[10px] font-black">{lang === 'vi' ? 'Trụ sở chính Hà Nội' : 'Hanoi Headquarters'}</span>
                          <span className="text-[8px] text-ink-muted leading-tight font-medium">81 Trần Cung, Cầu Giấy, HN</span>
                        </button>
                        <button
                          onClick={() => setSelectedOffice('danang')}
                          className={cn(
                            "w-full text-left p-2 rounded-xl border transition-all cursor-pointer flex flex-col space-y-0.5",
                            selectedOffice === 'danang' 
                              ? "bg-primary/5 border-primary-500/25 text-primary-500 shadow-sm" 
                              : "bg-muted/30 border-border hover:bg-muted text-ink-secondary"
                          )}
                        >
                          <span className="text-[10px] font-black">{lang === 'vi' ? 'Phân viện Miền Trung' : 'Central Vietnam Branch'}</span>
                          <span className="text-[8px] text-ink-muted leading-tight font-medium">183 Phạm Văn Đồng, Vỹ Dạ, Huế</span>
                        </button>
                        <button
                          onClick={() => setSelectedOffice('hcm')}
                          className={cn(
                            "w-full text-left p-2 rounded-xl border transition-all cursor-pointer flex flex-col space-y-0.5",
                            selectedOffice === 'hcm' 
                              ? "bg-primary/5 border-primary-500/25 text-primary-500 shadow-sm" 
                              : "bg-muted/30 border-border hover:bg-muted text-ink-secondary"
                          )}
                        >
                          <span className="text-[10px] font-black">{lang === 'vi' ? 'Phân viện Miền Nam' : 'Southern Vietnam Branch'}</span>
                          <span className="text-[8px] text-ink-muted leading-tight font-medium">20/5B QL 13, Thủ Đức, TP.HCM</span>
                        </button>
                      </div>

                      <div className="p-2 bg-muted/40 border border-border rounded-xl text-[8px] font-semibold text-ink-muted leading-normal">
                        {lang === 'vi' 
                          ? 'Bản đồ trực tiếp tích hợp tính năng định hướng, đo khoảng cách đường bộ và hiển thị mật độ giao thông.'
                          : 'Live integrated maps featuring directions, distance measurements, and traffic densities.'}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Cột 2: Kệ Tạp chí Khoa học & Ấn phẩm điện tử (col-span-5) */}
              <div className="lg:col-span-5 card p-5 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-sm font-black text-ink border-b border-border pb-3 flex items-center gap-2">
                    <BookOpen className="text-primary-500" size={16} />
                    {lang === 'vi' ? 'Tạp chí KHCN Xây dựng' : 'Journal of Building Science & Tech'}
                  </h3>
                  <p className="text-3xs text-ink-muted leading-relaxed font-semibold">
                    {lang === 'vi'
                      ? 'Ấn phẩm định kỳ chính thống công bố các kết quả nghiên cứu khoa học, vật liệu mới và quy chuẩn kỹ thuật xây dựng hàng đầu Việt Nam.'
                      : 'Official periodic publication publishing leading scientific research papers, new building materials, and codes.'}
                  </p>
                </div>

                {/* Nội dung Carousel Tạp chí - Ảnh to hơn w-32 h-44 & Danh sách mục lục bài báo */}
                <div className="p-4 bg-muted border border-border rounded-xl flex items-center gap-5 relative overflow-hidden min-h-[200px] flex-1">
                  <div className="w-32 h-44 flex-shrink-0 bg-primary-600 rounded-xl shadow-md overflow-hidden relative group self-center">
                    <img 
                      src={JOURNAL_ISSUES[activeJournalIndex].image} 
                      alt="Journal Cover" 
                      className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-950/20 via-transparent to-primary-950/80 flex flex-col justify-end p-2">
                      <span className="text-[7px] text-white/90 font-black block text-center leading-none">{JOURNAL_ISSUES[activeJournalIndex].issn}</span>
                    </div>
                  </div>

                  <div className="flex-1 space-y-2.5 text-left min-w-0 flex flex-col justify-between py-1">
                    <div>
                      <div className="flex justify-between items-center border-b border-border-subtle pb-1">
                        <span className="px-1.5 py-0.5 rounded text-[8px] font-black uppercase bg-primary-500/10 text-primary-500 border border-primary-500/10">
                          {JOURNAL_ISSUES[activeJournalIndex].volume}
                        </span>
                        <span className="text-[8px] text-ink-muted font-bold">{JOURNAL_ISSUES[activeJournalIndex].date}</span>
                      </div>
                      
                      {/* Danh sách bài viết */}
                      <div className="mt-2 space-y-2">
                        <span className="text-[8px] text-ink-muted uppercase font-black tracking-wider block">{lang === 'vi' ? 'Các nghiên cứu nổi bật:' : 'Featured Papers:'}</span>
                        <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                          {JOURNAL_ISSUES[activeJournalIndex].articles.map((art, idx) => (
                            <div key={idx} className="text-3xs space-y-0.5 font-semibold">
                              <p className="text-ink font-bold leading-tight line-clamp-2 hover:text-primary-500 transition-colors">
                                {idx + 1}. {art.title}
                              </p>
                              <p className="text-[8px] text-ink-muted italic leading-none pl-3">
                                {art.authors}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Các nút bấm điều hướng Carousel */}
                <div className="flex justify-between items-center">
                  <div className="flex gap-1">
                    {JOURNAL_ISSUES.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveJournalIndex(idx)}
                        className={cn(
                          "w-2 h-2 rounded-full transition-all cursor-pointer",
                          activeJournalIndex === idx ? "bg-primary-500 w-4" : "bg-border hover:bg-ink-muted"
                        )}
                      />
                    ))}
                  </div>

                  <button 
                    onClick={() => {
                      setSelectedJournal(JOURNAL_ISSUES[activeJournalIndex]);
                      setJournalModalOpen(true);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[9px] font-extrabold bg-primary-500 text-white hover:bg-primary-600 shadow-sm cursor-pointer transition-colors"
                  >
                    <Eye size={10} />
                    {lang === 'vi' ? 'Xem mục lục chi tiết' : 'View Table of Contents'}
                  </button>
                </div>
              </div>
            </div>
            
            {/* ─── ĐỐI TÁC - KHÁCH HÀNG (FULL-WIDTH H-MARQUEE) ─── */}
            <div className="card p-5 mt-6 space-y-4 text-left border border-border-subtle hover:shadow-card-hover transition-all duration-300">
              <h3 className="text-2xs sm:text-xs font-black text-ink uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-border-subtle">
                <Users className="text-primary-500" size={12} />
                {lang === 'vi' ? 'Đối tác - Khách hàng' : 'Partners & Clients'}
              </h3>
              
              <div className="animate-partner-marquee-hover-pause overflow-hidden relative w-full bg-muted/20 border border-border-subtle rounded-2xl py-4 flex items-center">
                <div className="flex gap-4 animate-partner-marquee pr-4">
                  {[
                    { name: 'Sông Đà 4', color: 'text-primary-600', icon: (
                      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor"><polygon points="12,2 2,20 22,20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" /><polygon points="12,6 5,18 19,18" fill="currentColor" opacity="0.15" /><path d="M10,12 L14,12 M12,10 L12,14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                    )},
                    { name: 'CONINCO', color: 'text-red-600', icon: (
                      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" strokeWidth="2.5" /><path d="M15 9a4 4 0 1 0 0 6" strokeWidth="2.5" strokeLinecap="round" /></svg>
                    )},
                    { name: 'VINACONEX', color: 'text-blue-600', icon: (
                      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor"><path d="M2,4 L10,20 L14,20 L22,4 L18,4 L12,16 L6,4 Z" /></svg>
                    )},
                    { name: 'DELTA Corp', color: 'text-cyan-600', icon: (
                      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12,3 3,21 21,21" strokeWidth="2.5" strokeLinejoin="round" /><polygon points="12,9 7,18 17,18" fill="currentColor" strokeWidth="1" opacity="0.3" /></svg>
                    )},
                    { name: 'COTECCONS', color: 'text-emerald-600', icon: (
                      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18,6 A8,8 0 1,0 18,18" strokeLinecap="round" /><circle cx="12" cy="12" r="3" fill="currentColor" /></svg>
                    )},
                    { name: 'GELEXIMCO', color: 'text-amber-600', icon: (
                      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18,8 A7,7 0 1,0 18,16 M12,12 L18,12" strokeLinecap="round" /></svg>
                    )},
                    { name: 'HÒA BÌNH', color: 'text-green-600', icon: (
                      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor"><path d="M12,2 L15,9 L22,9 L17,14 L19,21 L12,17 L5,21 L7,14 L2,9 L9,9 Z" /></svg>
                    )}
                  ].map((p, idx) => (
                    <div key={`p1-${idx}`} className="flex items-center gap-3 px-4 py-2 bg-surface border border-border rounded-xl shadow-sm whitespace-nowrap min-w-[150px] justify-center transition-all duration-300 hover:border-primary-500/35 hover:shadow-md">
                      <span className={p.color}>{p.icon}</span>
                      <span className="text-[10px] font-black text-ink">{p.name}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-4 animate-partner-marquee pr-4" aria-hidden="true">
                  {[
                    { name: 'Sông Đà 4', color: 'text-primary-600', icon: (
                      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor"><polygon points="12,2 2,20 22,20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" /><polygon points="12,6 5,18 19,18" fill="currentColor" opacity="0.15" /><path d="M10,12 L14,12 M12,10 L12,14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                    )},
                    { name: 'CONINCO', color: 'text-red-600', icon: (
                      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" strokeWidth="2.5" /><path d="M15 9a4 4 0 1 0 0 6" strokeWidth="2.5" strokeLinecap="round" /></svg>
                    )},
                    { name: 'VINACONEX', color: 'text-blue-600', icon: (
                      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor"><path d="M2,4 L10,20 L14,20 L22,4 L18,4 L12,16 L6,4 Z" /></svg>
                    )},
                    { name: 'DELTA Corp', color: 'text-cyan-600', icon: (
                      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12,3 3,21 21,21" strokeWidth="2.5" strokeLinejoin="round" /><polygon points="12,9 7,18 17,18" fill="currentColor" strokeWidth="1" opacity="0.3" /></svg>
                    )},
                    { name: 'COTECCONS', color: 'text-emerald-600', icon: (
                      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18,6 A8,8 0 1,0 18,18" strokeLinecap="round" /><circle cx="12" cy="12" r="3" fill="currentColor" /></svg>
                    )},
                    { name: 'GELEXIMCO', color: 'text-amber-600', icon: (
                      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18,8 A7,7 0 1,0 18,16 M12,12 L18,12" strokeLinecap="round" /></svg>
                    )},
                    { name: 'HÒA BÌNH', color: 'text-green-600', icon: (
                      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor"><path d="M12,2 L15,9 L22,9 L17,14 L19,21 L12,17 L5,21 L7,14 L2,9 L9,9 Z" /></svg>
                    )}
                  ].map((p, idx) => (
                    <div key={`p2-${idx}`} className="flex items-center gap-3 px-4 py-2 bg-surface border border-border rounded-xl shadow-sm whitespace-nowrap min-w-[150px] justify-center transition-all duration-300 hover:border-primary-500/35 hover:shadow-md">
                      <span className={p.color}>{p.icon}</span>
                      <span className="text-[10px] font-black text-ink">{p.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. GIỚI THIỆU TAB */}
        {activeTab === 'intro' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 text-left">
            {/* Sidebar danh mục giới thiệu */}
            <div className="lg:col-span-1 space-y-2">
              <div className="card p-3 space-y-1 bg-surface/50">
                <p className="text-3xs font-black text-ink-muted uppercase tracking-wider mb-2 px-2">Danh mục giới thiệu</p>
                <button
                  onClick={() => setActiveSubTab('all')}
                  className={cn("w-full text-left px-3 py-2 text-2xs font-bold rounded-lg transition-colors cursor-pointer", activeSubTab === 'all' ? "bg-primary text-white" : "hover:bg-muted text-ink-secondary")}
                >
                  Tất cả thông tin
                </button>
                <button
                  onClick={() => setActiveSubTab('nhiem-vu')}
                  className={cn("w-full text-left px-3 py-2 text-2xs font-bold rounded-lg transition-colors cursor-pointer", activeSubTab === 'nhiem-vu' ? "bg-primary text-white" : "hover:bg-muted text-ink-secondary")}
                >
                  Chức năng nhiệm vụ
                </button>
                <button
                  onClick={() => setActiveSubTab('co-cau')}
                  className={cn("w-full text-left px-3 py-2 text-2xs font-bold rounded-lg transition-colors cursor-pointer", activeSubTab === 'co-cau' ? "bg-primary text-white" : "hover:bg-muted text-ink-secondary")}
                >
                  Cơ cấu tổ chức & Lãnh đạo
                </button>
                <button
                  onClick={() => setActiveSubTab('phong-lab')}
                  className={cn("w-full text-left px-3 py-2 text-2xs font-bold rounded-lg transition-colors cursor-pointer", activeSubTab === 'phong-lab' ? "bg-primary text-white" : "hover:bg-muted text-ink-secondary")}
                >
                  Hệ thống phòng thí nghiệm
                </button>
              </div>
            </div>

            {/* Content Giới thiệu */}
            <div className="lg:col-span-3 space-y-6">

              {/* Chức năng nhiệm vụ */}
              {(activeSubTab === 'all' || activeSubTab === 'nhiem-vu') && (
                <div className="card p-6 space-y-4 animate-fade-in-up">
                  <h3 className="text-md font-black text-ink border-b border-border pb-3 flex items-center gap-2">
                    <ShieldCheck className="text-primary-500" size={16} />
                    Chức năng & Nhiệm vụ chính của IBST
                  </h3>
                  <div className="text-xs leading-relaxed text-ink-secondary space-y-3 font-medium">
                    <p>
                      Viện Khoa học Công nghệ Xây dựng (IBST) là đơn vị sự nghiệp trực thuộc Bộ Xây dựng, thực hiện chức năng nghiên cứu khoa học, phục vụ quản lý nhà nước, đào tạo tiến sĩ và cung cấp dịch vụ KHCN trong ngành xây dựng.
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li><strong>Nghiên cứu khoa học:</strong> Nghiên cứu phát triển công nghệ mới, vật liệu xây dựng tiên tiến, bê tông UHPC, kết cấu thép đặc biệt chống bão, động đất.</li>
                      <li><strong>Phục vụ quản lý nhà nước:</strong> Biên soạn hệ thống Quy chuẩn xây dựng Việt Nam (QCVN) và Tiêu chuẩn quốc gia (TCVN); thẩm tra độc lập chất lượng công trình phục vụ nghiệm thu nhà nước.</li>
                      <li><strong>Chứng nhận và Kiểm định:</strong> Chứng nhận sự phù hợp chất lượng hàng hóa, vật liệu xây dựng; thử nghiệm và kiểm định kết cấu, kiểm tra nứt, nghiêng công trình.</li>
                      <li><strong>Đào tạo nguồn nhân lực:</strong> Cơ sở đào tạo Tiến sĩ đầu ngành được Bộ Giáo dục cấp phép với hàng trăm nghiên cứu sinh đã tốt nghiệp.</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Sơ đồ & Lãnh đạo viện */}
              {(activeSubTab === 'all' || activeSubTab === 'co-cau') && (
                <div className="space-y-6">
                  {/* Lãnh đạo viện */}
                  <div className="card p-6 space-y-4 animate-fade-in-up">
                    <h3 className="text-md font-black text-ink border-b border-border pb-3 flex items-center gap-2">
                      <Users className="text-primary-500" size={16} />
                      Ban Giám Đốc Viện (Nhiệm kỳ 2025 - 2030)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {LEADERS.map((ldr, idx) => (
                        <div key={idx} className="flex items-start gap-4 p-4 bg-surface border border-border rounded-2xl hover:shadow-card-hover transition-all duration-300">
                          <div className={cn(
                            "w-12 h-12 rounded-2xl bg-gradient-to-tr flex items-center justify-center text-white text-xs font-black shadow-md shrink-0 uppercase tracking-wider",
                            ldr.avatarBg
                          )}>
                            {ldr.initials}
                          </div>
                          <div className="space-y-1 flex-1 min-w-0">
                            <h4 className="font-bold text-ink text-[13px] truncate">{ldr.name}</h4>
                            <p className="text-[10px] font-extrabold text-primary-500 uppercase tracking-wide leading-tight">{ldr.role}</p>
                            <div className="text-3xs text-ink-muted space-y-1 font-semibold pt-2 border-t border-border-subtle mt-2">
                              <p className="flex items-center gap-2"><Phone size={12} className="text-primary-500" /> {ldr.phone}</p>
                              <p className="flex items-center gap-2 truncate"><Mail size={12} className="text-primary-500" /> {ldr.email}</p>
                              <p className="flex items-center gap-2"><Building size={12} className="text-primary-500" /> {ldr.room}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sơ đồ cơ cấu tổ chức */}
                  <div className="card p-6 space-y-4 animate-fade-in-up">
                    <h3 className="text-md font-black text-ink border-b border-border pb-3 flex items-center gap-2">
                      <Layers className="text-primary-500" size={16} />
                      Sơ đồ Tổ chức hành chính & Phòng ban
                    </h3>
                    <div className="p-4 bg-muted border border-border rounded-xl space-y-4 text-center">
                      <div className="inline-block px-4 py-2 bg-primary text-white text-xs font-black rounded-lg shadow-sm">
                        Ban Giám Đốc Viện
                      </div>
                      <div className="w-0.5 h-6 bg-border mx-auto"></div>
                      <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
                        <div className="px-3 py-2 bg-surface border border-border rounded-lg text-2xs font-bold">Hội đồng Khoa học</div>
                        <div className="px-3 py-2 bg-surface border border-border rounded-lg text-2xs font-bold">Hội đồng Tiêu chuẩn</div>
                      </div>
                      <div className="w-0.5 h-6 bg-border mx-auto"></div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="p-3 bg-surface border border-border rounded-xl text-left">
                          <h5 className="font-bold text-ink-secondary text-2xs mb-2 pb-1 border-b border-border-subtle uppercase">Đơn vị nghiệp vụ</h5>
                          <ul className="text-3xs space-y-1 font-semibold text-ink-muted list-disc pl-4">
                            <li>Phòng QLKH & Tiêu chuẩn</li>
                            <li>Phòng Kế hoạch Tài chính</li>
                            <li>Phòng Tổ chức Hành chính</li>
                            <li>Văn phòng Đảng - Đoàn thể</li>
                          </ul>
                        </div>
                        <div className="p-3 bg-surface border border-border rounded-xl text-left">
                          <h5 className="font-bold text-ink-secondary text-2xs mb-2 pb-1 border-b border-border-subtle uppercase">Trung tâm Chuyên môn</h5>
                          <ul className="text-3xs space-y-1 font-semibold text-ink-muted list-disc pl-4">
                            <li>Trung tâm Bê tông & Vật liệu</li>
                            <li>Trung tâm Địa kỹ thuật & Trắc địa</li>
                            <li>Trung tâm Kết cấu công trình</li>
                            <li>Văn phòng Thử nghiệm LIMS</li>
                          </ul>
                        </div>
                        <div className="p-3 bg-surface border border-border rounded-xl text-left">
                          <h5 className="font-bold text-ink-secondary text-2xs mb-2 pb-1 border-b border-border-subtle uppercase">Chi nhánh</h5>
                          <ul className="text-3xs space-y-1 font-semibold text-ink-muted list-disc pl-4">
                            <li>Phân viện miền Nam (PVMN)</li>
                            <li>Phân viện miền Trung (PVMT)</li>
                            <li>Văn phòng Đại diện Hải Phòng</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-border-subtle text-left">
                      <h4 className="font-bold text-ink text-2xs mb-3 uppercase tracking-wider">Danh sách các Đơn vị chuyên môn tiêu biểu:</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {UNITS.map((unit, idx) => (
                          <div key={idx} className="p-3 bg-muted border border-border rounded-xl flex justify-between items-center text-3xs font-semibold">
                            <div>
                              <p className="text-ink font-bold">{unit.name}</p>
                              <p className="text-ink-muted mt-0.5 font-semibold">Trưởng đơn vị: {unit.head}</p>
                            </div>
                            <span className="px-2 py-0.5 bg-surface border border-border rounded text-ink-muted uppercase">
                              {unit.code}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Danh bạ chuyên gia & Nhà khoa học đầu ngành */}
                    <div className="mt-8 pt-6 border-t border-border-subtle text-left space-y-4">
                      <div>
                        <h4 className="text-sm font-black text-ink flex items-center gap-2">
                          <Users className="text-primary-500" size={16} />
                          {lang === 'vi' ? 'Hội đồng chuyên gia & Nhà khoa học Đầu ngành' : 'Board of Leading Scholars & Expert Consultants'}
                        </h4>
                        <p className="text-3xs text-ink-muted leading-relaxed font-semibold mt-1">
                          {lang === 'vi'
                            ? 'Đội ngũ Giáo sư, Phó Giáo sư, Tiến sĩ chuyên ngành có uy tín học thuật lớn, trực tiếp chủ trì các đề tài trọng điểm quốc gia và tư vấn kỹ thuật.'
                            : 'Distinguished Professors, Associate Professors, and PhDs leading key national research projects and technical advisory boards.'}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {SCHOLAR_EXPERTS.map((exp) => (
                          <div key={exp.id} className="card p-4 bg-muted/40 border border-border hover:border-primary-400 transition-all duration-300 flex flex-col justify-between space-y-4">
                            <div className="space-y-3">
                              {/* Avatar & Info header */}
                              <div className="flex items-center gap-3">
                                <div className={cn(
                                  "w-10 h-10 rounded-full flex items-center justify-center text-xs font-black text-white bg-gradient-to-br shadow-sm",
                                  exp.bg
                                )}>
                                  {exp.avatar}
                                </div>
                                <div className="text-left min-w-0">
                                  <h5 className="font-extrabold text-xs text-ink leading-tight truncate">{exp.name}</h5>
                                  <p className="text-[9px] text-primary-500 font-bold leading-tight mt-0.5 truncate">{exp.role}</p>
                                </div>
                              </div>

                              {/* Research areas */}
                              <div className="space-y-1">
                                <span className="text-[8px] text-ink-muted uppercase font-black tracking-wider block">{lang === 'vi' ? 'Lĩnh vực thế mạnh' : 'Research Strengths'}</span>
                                <div className="flex flex-wrap gap-1">
                                  {exp.research.map((res, i) => (
                                    <span key={i} className="px-1.5 py-0.5 rounded bg-surface border border-border text-[8px] font-bold text-ink-secondary">
                                      {res}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              {/* Key Achievements */}
                              <div className="space-y-1">
                                <span className="text-[8px] text-ink-muted uppercase font-black tracking-wider block">{lang === 'vi' ? 'Thành tựu tiêu biểu' : 'Key Achievements'}</span>
                                <ul className="text-3xs text-ink-secondary list-disc pl-3.5 space-y-0.5 font-semibold">
                                  {exp.achievements.map((ach, i) => (
                                    <li key={i}>{ach}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>

                            {/* Contact button */}
                            <button
                              onClick={() => {
                                setConsultingExpert(exp);
                                setExpertMessageSent(false);
                                setExpertEmail('');
                                setExpertQuestion('');
                              }}
                              className="w-full py-2 bg-muted hover:bg-primary-500 text-ink-secondary hover:text-white rounded-lg text-3xs font-extrabold border border-border hover:border-primary-500 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                            >
                              <Mail size={10} />
                              {lang === 'vi' ? 'Gửi câu hỏi tư vấn' : 'Consult Expert'}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Hệ thống phòng thí nghiệm */}
              {(activeSubTab === 'all' || activeSubTab === 'phong-lab') && (
                <div className="card p-6 space-y-4 animate-fade-in-up">
                  <h3 className="text-md font-black text-ink border-b border-border pb-3 flex items-center gap-2">
                    <Wrench className="text-primary-500" size={16} />
                    Hệ thống Phòng thí nghiệm LAS-XD đạt chuẩn VILAS
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {LABS.map((lab, idx) => (
                      <div 
                        key={idx} 
                        className="group card overflow-hidden hover:shadow-card-hover hover:border-primary-300 transition-all duration-300 flex flex-col justify-between"
                      >
                        <div>
                          <div className="h-40 overflow-hidden relative">
                            <img src={lab.image} alt={lab.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                            
                            <div className="absolute top-3 left-3">
                              <span className="inline-block px-2.5 py-1 rounded-lg text-[9px] font-extrabold uppercase bg-red-600 text-white shadow-md border border-red-500/20">
                                {lab.code}
                              </span>
                            </div>
                            <div className="absolute top-3 right-3">
                              <span className="inline-block px-2.5 py-1 rounded-lg text-[9px] font-extrabold uppercase bg-white/95 text-primary-950 shadow-md backdrop-blur-sm">
                                {lab.type}
                              </span>
                            </div>
                            <div className="absolute bottom-3 left-3 right-3 text-left">
                              <h4 className="font-bold text-white text-xs drop-shadow-sm leading-snug">{lab.name}</h4>
                            </div>
                          </div>
                          <div className="p-4 text-left">
                            <p className="text-2xs text-ink-secondary leading-relaxed font-semibold">{lab.capacity}</p>
                          </div>
                        </div>
                        
                        <div className="p-4 pt-0 text-left">
                          <button className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-muted group-hover:bg-primary-500 text-ink-secondary group-hover:text-white rounded-xl text-[10px] font-extrabold transition-all border border-border group-hover:border-primary-500 cursor-pointer shadow-sm">
                            <Wrench size={12} />
                            {lang === 'vi' ? 'Yêu cầu thử nghiệm / Kiểm định' : 'Request laboratory testing'}
                            <ChevronRight size={12} className="opacity-70 group-hover:translate-x-0.5 transition-transform" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Showcase Thiết bị & Công nghệ Đo lường Chuyên sâu */}
                  <div className="mt-8 pt-6 border-t border-border-subtle text-left space-y-4">
                    <div>
                      <h4 className="text-sm font-black text-ink flex items-center gap-2">
                        <Activity className="text-primary-500" size={16} />
                        {lang === 'vi' ? 'Showcase Thiết bị & Công nghệ Đo lường Chuyên sâu' : 'Advanced Testing Instruments Showcase'}
                      </h4>
                      <p className="text-3xs text-ink-muted leading-relaxed font-semibold mt-1">
                        {lang === 'vi'
                          ? 'Tổng hợp các hệ thống thiết bị đặc chủng, quy mô lớn hàng đầu quốc gia được vận hành bởi các chuyên gia IBST phục vụ nghiên cứu và đánh giá chất lượng.'
                          : 'A compilation of state-of-the-art, large-scale testing equipment operated by IBST specialists for research and quality validation.'}
                      </p>
                    </div>

                    {/* Tabs chọn thiết bị */}
                    <div className="flex flex-wrap gap-1.5 p-1 bg-muted rounded-xl">
                      {LAB_EQUIPMENTS.map((eq) => {
                        const active = activeEquipmentId === eq.id;
                        return (
                          <button
                            key={eq.id}
                            onClick={() => setActiveEquipmentId(eq.id)}
                            className={cn(
                              "px-3 py-1.5 text-3xs font-extrabold rounded-lg transition-all cursor-pointer",
                              active 
                                ? "bg-primary text-white shadow-sm"
                                : "text-ink-secondary hover:bg-surface hover:text-ink"
                            )}
                          >
                            {lang === 'vi' ? eq.nameVi : eq.nameEn}
                          </button>
                        );
                      })}
                    </div>

                    {/* Chi tiết thiết bị */}
                    {(() => {
                      const eq = LAB_EQUIPMENTS.find(e => e.id === activeEquipmentId) || LAB_EQUIPMENTS[0];
                      return (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 p-4 bg-muted/40 border border-border-subtle rounded-xl items-stretch animate-fade-in">
                          {/* Left: Image / Technical visual */}
                          <div className="lg:col-span-4 h-48 rounded-xl overflow-hidden relative shadow-inner border border-border">
                            <img src={eq.image} alt={eq.nameVi} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                            <div className="absolute bottom-3 left-3">
                              <span className="px-2 py-0.5 rounded bg-primary-600 text-white font-black text-3xs">{eq.code}</span>
                            </div>
                          </div>

                          {/* Right: Technical Datasheet */}
                          <div className="lg:col-span-8 flex flex-col justify-between space-y-3">
                            <div className="space-y-1">
                              <h5 className="font-extrabold text-xs text-ink leading-snug">
                                {lang === 'vi' ? eq.nameVi : eq.nameEn}
                              </h5>
                              <p className="text-3xs text-ink-secondary leading-relaxed font-semibold">
                                {lang === 'vi' ? eq.descVi : eq.descEn}
                              </p>
                            </div>

                            {/* Grid specifications */}
                            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border-subtle">
                              {eq.specs.map((spec, i) => (
                                <div key={i} className="p-2 bg-surface border border-border rounded-lg text-3xs space-y-0.5 font-semibold">
                                  <span className="text-ink-muted uppercase font-black text-[8px] block leading-none">{spec.label}</span>
                                  <span className="text-ink-secondary block leading-snug">{spec.value}</span>
                                </div>
                              ))}
                            </div>

                            {/* Standards and usage */}
                            <div className="pt-2 border-t border-border-subtle flex flex-wrap justify-between items-center gap-2 text-3xs">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-black text-ink-muted uppercase block leading-none">{lang === 'vi' ? 'Tiêu chuẩn:' : 'Standards:'}</span>
                                {eq.standards.map((std, i) => (
                                  <span key={i} className="px-1.5 py-0.5 rounded bg-primary-500/5 text-primary-500 font-extrabold border border-primary-500/10">
                                    {std}
                                  </span>
                                ))}
                              </div>
                              <div className="text-[9px] text-primary-500 font-extrabold italic">
                                {lang === 'vi' ? eq.usageVi : eq.usageEn}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* 3. TIN TỨC TAB */}
        {activeTab === 'news' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 text-left">
            {/* Sidebar danh mục tin tức */}
            <div className="lg:col-span-1 space-y-2">
              <div className="card p-3 space-y-1 bg-surface/50">
                <p className="text-3xs font-black text-ink-muted uppercase tracking-wider mb-2 px-2">Phân loại tin tức</p>
                <button
                  onClick={() => { setActiveSubTab('all'); setSelectedArticle(null); }}
                  className={cn("w-full text-left px-3 py-2 text-2xs font-bold rounded-lg transition-colors cursor-pointer", activeSubTab === 'all' ? "bg-primary text-white" : "hover:bg-muted text-ink-secondary")}
                >
                  Tất cả tin tức
                </button>
                <button
                  onClick={() => { setActiveSubTab('tin-hoat-dong'); setSelectedArticle(null); }}
                  className={cn("w-full text-left px-3 py-2 text-2xs font-bold rounded-lg transition-colors cursor-pointer", activeSubTab === 'tin-hoat-dong' ? "bg-primary text-white" : "hover:bg-muted text-ink-secondary")}
                >
                  Tin hoạt động Viện
                </button>
                <button
                  onClick={() => { setActiveSubTab('tin-lien-quan'); setSelectedArticle(null); }}
                  className={cn("w-full text-left px-3 py-2 text-2xs font-bold rounded-lg transition-colors cursor-pointer", activeSubTab === 'tin-lien-quan' ? "bg-primary text-white" : "hover:bg-muted text-ink-secondary")}
                >
                  Tin tức liên quan
                </button>
              </div>
            </div>

            {/* Nội dung chính tin tức */}
            <div className="lg:col-span-3">
              {selectedArticle ? (
                /* Chi tiết bài báo */
                <div className="card p-6 md:p-8 space-y-6 animate-fade-in text-left">
                  <button onClick={() => setSelectedArticle(null)} className="flex items-center gap-1.5 text-2xs font-extrabold text-primary-500 hover:text-primary transition-colors cursor-pointer mb-2">
                    <ArrowLeft size={12} />
                    {lang === 'vi' ? 'Quay lại danh sách tin' : 'Back to list'}
                  </button>

                  <div className="h-64 md:h-80 w-full overflow-hidden rounded-2xl border border-border shadow-inner relative">
                    <img src={selectedArticle.image} alt={selectedArticle.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent p-5 pt-12 text-white">
                      <span className="inline-block px-2.5 py-1 rounded-lg text-[9px] font-extrabold uppercase bg-primary-500 tracking-wider mb-2">
                        {selectedArticle.category === 'tin-hoat-dong' ? 'Tin hoạt động Viện' : 'Tin tức liên quan'}
                      </span>
                      <h2 className="text-sm md:text-lg lg:text-xl font-black leading-snug drop-shadow-sm">{selectedArticle.title}</h2>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] text-ink-muted pb-4 border-b border-border-subtle font-semibold">
                    <span className="flex items-center gap-1.5">Đăng bởi: <strong className="text-ink-secondary">{selectedArticle.author}</strong></span>
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1.5"><Calendar size={12} /> {selectedArticle.date}</span>
                      <span>•</span>
                      <span>{selectedArticle.readTime}</span>
                      <span>•</span>
                      <span>{selectedArticle.views} lượt xem</span>
                    </div>
                  </div>

                  <div className="text-xs sm:text-[13px] leading-relaxed text-ink-secondary space-y-5 font-semibold">
                    <p className="font-extrabold text-ink italic bg-muted p-4 rounded-xl border-l-4 border-primary shadow-sm leading-relaxed">
                      {selectedArticle.summary}
                    </p>
                    <p className="text-justify">{selectedArticle.content}</p>
                    <p className="text-justify">Để hiện thực hóa các mục tiêu phát triển bền vững và giảm lượng phát thải carbon trong xây dựng đô thị, Viện Khoa học công nghệ xây dựng sẽ tiếp tục đẩy mạnh các dự án hợp tác quốc tế, nghiên cứu các giải pháp khoa học thực hành hiệu quả cao phục vụ cho các doanh nghiệp và chủ đầu tư trên toàn lãnh thổ Việt Nam.</p>
                  </div>
                </div>
              ) : (
                /* Danh sách bài viết */
                <div className="space-y-4 animate-fade-in-up">
                  {filteredNews.length === 0 ? (
                    <div className="card p-8 text-center text-ink-muted text-2xs font-semibold">
                      Không tìm thấy bài viết nào phù hợp.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {filteredNews.map((art) => (
                        <div 
                          key={art.id} 
                          onClick={() => setSelectedArticle(art)} 
                          className="group card overflow-hidden hover:shadow-card-hover hover:border-primary-300 transition-all duration-300 cursor-pointer flex flex-col justify-between text-left"
                        >
                          <div>
                            <div className="h-44 overflow-hidden relative">
                              <img src={art.image} alt={art.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                              <div className="absolute top-3 left-3">
                                <span className="inline-block px-2.5 py-1 rounded-lg text-[9px] font-extrabold uppercase bg-primary-600/90 text-white backdrop-blur-sm border border-white/10 shadow-sm">
                                  {art.category === 'tin-hoat-dong' ? 'Tin hoạt động' : 'Tin liên quan'}
                                </span>
                              </div>
                            </div>
                            <div className="p-4 space-y-2">
                              <h3 className="font-bold text-ink text-2xs md:text-xs line-clamp-2 group-hover:text-primary-500 transition-colors leading-snug">
                                {art.title}
                              </h3>
                              <p className="text-3xs text-ink-secondary line-clamp-3 leading-relaxed font-semibold">
                                {art.summary}
                              </p>
                            </div>
                          </div>
                          <div className="px-4 pb-4 pt-2 flex items-center justify-between text-[10px] text-ink-muted border-t border-border-subtle font-semibold">
                            <span className="truncate max-w-[100px]">{art.author}</span>
                            <div className="flex items-center gap-2">
                              <span className="flex items-center gap-1"><Calendar size={11} /> {art.date}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 4. PHỤC VỤ QLNN TAB */}
        {activeTab === 'state-gov' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 text-left">
            {/* Sidebar phục vụ QLNN */}
            <div className="lg:col-span-1 space-y-2">
              <div className="card p-3 space-y-1 bg-surface/50">
                <p className="text-3xs font-black text-ink-muted uppercase tracking-wider mb-2 px-2">Hoạt động QLNN</p>
                <button
                  onClick={() => { setActiveSubTab('all'); setSelectedArticle(null); }}
                  className={cn("w-full text-left px-3 py-2 text-2xs font-bold rounded-lg transition-colors cursor-pointer", activeSubTab === 'all' ? "bg-primary text-white" : "hover:bg-muted text-ink-secondary")}
                >
                  Tất cả nhiệm vụ
                </button>
                <button
                  onClick={() => { setActiveSubTab('du-an-trong-diem'); setSelectedArticle(null); }}
                  className={cn("w-full text-left px-3 py-2 text-2xs font-bold rounded-lg transition-colors cursor-pointer", activeSubTab === 'du-an-trong-diem' ? "bg-primary text-white" : "hover:bg-muted text-ink-secondary")}
                >
                  Dự án trọng điểm QG
                </button>
                <button
                  onClick={() => { setActiveSubTab('quy-chuan-tieu-chuan'); setSelectedArticle(null); }}
                  className={cn("w-full text-left px-3 py-2 text-2xs font-bold rounded-lg transition-colors cursor-pointer", activeSubTab === 'quy-chuan-tieu-chuan' ? "bg-primary text-white" : "hover:bg-muted text-ink-secondary")}
                >
                  Quy chuẩn & Tiêu chuẩn
                </button>
              </div>
            </div>

            {/* Nội dung QLNN */}
            <div className="lg:col-span-3">
              {selectedArticle ? (
                /* Chi tiết dự án/tiêu chuẩn biên soạn */
                <div className="card p-6 md:p-8 space-y-6 animate-fade-in text-left">
                  <button onClick={() => setSelectedArticle(null)} className="flex items-center gap-1.5 text-2xs font-extrabold text-primary-500 hover:text-primary transition-colors cursor-pointer mb-2">
                    <ArrowLeft size={12} />
                    {lang === 'vi' ? 'Quay lại danh sách nhiệm vụ' : 'Back to list'}
                  </button>

                  <div className="h-64 md:h-80 w-full overflow-hidden rounded-2xl border border-border shadow-inner relative">
                    <img src={selectedArticle.image} alt={selectedArticle.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent p-5 pt-12 text-white">
                      <span className="inline-block px-2.5 py-1 rounded-lg text-[9px] font-extrabold uppercase bg-primary-500 tracking-wider mb-2">
                        {selectedArticle.category === 'du-an-trong-diem' ? 'Nhiệm vụ phục vụ QLNN' : 'Biên soạn Quy chuẩn - Tiêu chuẩn'}
                      </span>
                      <h2 className="text-sm md:text-lg lg:text-xl font-black leading-snug drop-shadow-sm">{selectedArticle.title}</h2>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] text-ink-muted pb-4 border-b border-border-subtle font-semibold">
                    <span>Cơ quan chủ trì: <strong className="text-ink-secondary">{selectedArticle.author}</strong></span>
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1.5"><Calendar size={12} /> Cập nhật: {selectedArticle.date}</span>
                    </div>
                  </div>

                  <div className="text-xs sm:text-[13px] leading-relaxed text-ink-secondary space-y-5 font-semibold">
                    <p className="font-extrabold text-ink italic bg-muted p-4 rounded-xl border-l-4 border-primary shadow-sm">
                      {selectedArticle.summary}
                    </p>
                    <p className="text-justify">{selectedArticle.content}</p>
                    
                    <div className="p-5 bg-muted border border-border rounded-2xl space-y-3 shadow-sm">
                      <h4 className="font-bold text-ink text-2xs sm:text-xs flex items-center gap-2">
                        <Info size={14} className="text-primary-500" /> 
                        {lang === 'vi' ? 'Mục tiêu & Kết quả dự kiến đạt được:' : 'Expected Outcomes & Objectives:'}
                      </h4>
                      <ul className="list-disc pl-5 space-y-2 text-3xs sm:text-2xs text-ink-muted leading-relaxed font-semibold">
                        <li>Hoàn thiện dự thảo Quy chuẩn/Tiêu chuẩn gửi Hội đồng khoa học của Bộ Xây dựng nghiệm thu.</li>
                        <li>Xây dựng tài liệu hướng dẫn chuyển giao kỹ thuật thực hành cho các kỹ sư kết cấu, nhà thầu xây dựng toàn quốc.</li>
                        <li>Ứng dụng thực tế tại các dự án giao thông, hạ tầng đô thị trọng điểm để kiểm nghiệm độ tin cậy.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                /* Danh sách nhiệm vụ QLNN */
                <div className="space-y-4 animate-fade-in-up">
                  {filteredNews.length === 0 ? (
                    <div className="card p-8 text-center text-ink-muted text-2xs font-semibold">
                      Không tìm thấy thông tin nào phù hợp.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredNews.map((art) => (
                        <div 
                          key={art.id} 
                          onClick={() => setSelectedArticle(art)} 
                          className="group card p-4 hover:shadow-card-hover hover:border-primary-300 border border-border flex flex-col sm:flex-row items-stretch gap-4 cursor-pointer transition-all duration-300"
                        >
                          <div className="w-full sm:w-40 h-28 rounded-lg overflow-hidden shrink-0 bg-muted relative">
                            <img src={art.image} alt={art.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                          </div>
                          
                          <div className="space-y-1.5 flex-1 flex flex-col justify-between text-left">
                            <div className="space-y-1">
                              <span className="inline-block px-2 py-0.5 rounded text-[9px] font-extrabold uppercase bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">
                                {art.category === 'du-an-trong-diem' ? 'Dự án trọng điểm quốc gia' : 'Quy chuẩn - Tiêu chuẩn quốc gia'}
                              </span>
                              <h3 className="font-bold text-ink text-2xs sm:text-xs group-hover:text-primary-500 transition-colors leading-snug">
                                {art.title}
                              </h3>
                              <p className="text-3xs text-ink-secondary line-clamp-2 leading-relaxed font-semibold">
                                {art.summary}
                              </p>
                            </div>
                            <div className="flex items-center gap-4 text-[10px] text-ink-muted font-semibold pt-1 border-t border-border-subtle">
                              <span>Biên soạn: {art.author}</span>
                              <span className="flex items-center gap-1"><Calendar size={11} /> {art.date}</span>
                            </div>
                          </div>
                          <div className="hidden sm:flex items-center justify-center shrink-0 text-ink-muted group-hover:text-primary transition-colors px-1">
                            <ChevronRight size={18} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 5. KH & CN (ĐỀ TÀI - DỰ ÁN CHÍNH) TAB */}
        {activeTab === 'research' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 text-left">
            {/* Sidebar bộ lọc cho Đề tài nghiên cứu */}
            <div className="lg:col-span-1 space-y-4">
              <div className="card p-3 space-y-1 bg-surface/50">
                <p className="text-3xs font-black text-ink-muted uppercase tracking-wider mb-2 px-2">Cấp Đề tài</p>
                <button
                  onClick={() => { setActiveSubTab('all'); setSelectedProject(null); }}
                  className={cn("w-full text-left px-3 py-2 text-2xs font-bold rounded-lg transition-colors cursor-pointer", activeSubTab === 'all' ? "bg-primary text-white" : "hover:bg-muted text-ink-secondary")}
                >
                  Tất cả đề tài
                </button>
                <button
                  onClick={() => { setActiveSubTab('nhà nước'); setSelectedProject(null); }}
                  className={cn("w-full text-left px-3 py-2 text-2xs font-bold rounded-lg transition-colors cursor-pointer", activeSubTab === 'nhà nước' ? "bg-primary text-white" : "hover:bg-muted text-ink-secondary")}
                >
                  Cấp Nhà nước
                </button>
                <button
                  onClick={() => { setActiveSubTab('bộ'); setSelectedProject(null); }}
                  className={cn("w-full text-left px-3 py-2 text-2xs font-bold rounded-lg transition-colors cursor-pointer", activeSubTab === 'bộ' ? "bg-primary text-white" : "hover:bg-muted text-ink-secondary")}
                >
                  Cấp Bộ Xây dựng
                </button>
                <button
                  onClick={() => { setActiveSubTab('viện'); setSelectedProject(null); }}
                  className={cn("w-full text-left px-3 py-2 text-2xs font-bold rounded-lg transition-colors cursor-pointer", activeSubTab === 'viện' ? "bg-primary text-white" : "hover:bg-muted text-ink-secondary")}
                >
                  Cấp Cơ sở / Viện
                </button>
              </div>

              {/* Lọc theo năm nghiệm thu */}
              <div className="card p-4 space-y-2.5">
                <p className="text-3xs font-black text-ink-muted uppercase tracking-wider px-0.5">Năm nghiệm thu</p>
                <select
                  value={selectedYear}
                  onChange={(e) => { setSelectedYear(e.target.value); setSelectedProject(null); }}
                  className="w-full p-2 text-2xs rounded-lg border border-border bg-surface font-semibold focus:outline-none"
                >
                  <option value="all">Tất cả các năm</option>
                  <option value="2024">Năm 2024</option>
                  <option value="2023">Năm 2023</option>
                  <option value="2022">Năm 2022</option>
                </select>
              </div>
            </div>

            {/* Nội dung danh sách hoặc chi tiết đề tài */}
            <div className="lg:col-span-3">
              {selectedProject ? (
                /* Chi tiết đề tài nghiên cứu */
                <div className="card p-6 space-y-5 animate-fade-in">
                  <button onClick={() => setSelectedProject(null)} className="flex items-center gap-1.5 text-2xs font-bold text-primary-500 hover:text-primary transition-colors cursor-pointer mb-2">
                    <ArrowLeft size={12} />
                    Quay lại danh sách đề tài
                  </button>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 text-3xs font-bold bg-primary/10 text-primary-500 rounded">
                        Mã số: {selectedProject.code}
                      </span>
                      <span className="px-2 py-0.5 text-3xs font-bold bg-success/10 text-success-500 rounded">
                        {selectedProject.status}
                      </span>
                    </div>
                    <h2 className="text-md md:text-lg font-black text-ink leading-snug mt-2">{selectedProject.title}</h2>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted border border-border rounded-xl text-3xs font-semibold">
                    <div>
                      <p className="text-ink-muted">Chủ nhiệm đề tài</p>
                      <p className="font-bold text-ink mt-0.5">{selectedProject.leader}</p>
                    </div>
                    <div>
                      <p className="text-ink-muted">Cấp đề tài</p>
                      <p className="font-bold text-ink mt-0.5">{selectedProject.type}</p>
                    </div>
                    <div>
                      <p className="text-ink-muted">Năm nghiệm thu</p>
                      <p className="font-bold text-ink mt-0.5">{selectedProject.year}</p>
                    </div>
                    <div>
                      <p className="text-ink-muted">Kinh phí cấp</p>
                      <p className="font-bold text-success-500 mt-0.5">{selectedProject.funding} triệu VNĐ</p>
                    </div>
                  </div>

                  <div className="space-y-4 text-xs font-medium text-ink-secondary leading-relaxed">
                    <div>
                      <h4 className="font-bold text-ink text-2xs mb-1.5">Tóm tắt đề tài / dự án:</h4>
                      <p className="italic bg-muted p-3 border-l-4 border-primary rounded-r-lg">{selectedProject.summary}</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-ink text-2xs mb-1.5">Mục tiêu & Phương pháp nghiên cứu:</h4>
                      <p>{selectedProject.details}</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-ink text-2xs mb-1.5">Ứng dụng thực tiễn của đề tài:</h4>
                      <p>Sản phẩm nghiên cứu của đề tài đã trực tiếp giải quyết các vấn đề vướng mắc thực tế trong thi công, cung cấp công cụ hướng dẫn thiết kế chuẩn xác phục vụ các công ty thiết kế kỹ thuật địa lý, nhà máy sản xuất vật liệu và chủ đầu tư các đại dự án trên toàn quốc.</p>
                    </div>
                  </div>
                </div>
              ) : (
                /* Danh sách đề tài nghiên cứu */
                <div className="space-y-4 animate-fade-in-up">
                  {/* S&T Stats Dashboard - Pure CSS/Tailwind */}
                  <div className="card p-4 space-y-3 bg-surface border border-border shadow-sm text-left">
                    <div className="flex justify-between items-center border-b border-border-subtle pb-2">
                      <h4 className="font-bold text-ink text-2xs uppercase tracking-wider flex items-center gap-1.5">
                        <Activity size={12} className="text-primary-500" />
                        {lang === 'vi' ? 'Thống kê Kinh phí Đề tài tiêu biểu' : 'R&D Budget Statistics (Featured)'}
                      </h4>
                      <span className="text-[10px] text-primary-500 font-extrabold uppercase">{lang === 'vi' ? 'Tổng: 4.0 Tỷ VNĐ' : 'Total: 4.0B VND'}</span>
                    </div>
                    
                    <div className="space-y-2.5">
                      {[
                        { code: 'RD 120-20', title: 'Thiết kế móng cọc Eurocode 7', funding: 1200, pct: 100 },
                        { code: 'RD 26-21', title: 'Nhà tránh lũ miền Trung', funding: 920, pct: 76 },
                        { code: 'TC 19-21', title: 'Soát xét chịu lửa TCVN 9311', funding: 780, pct: 65 },
                        { code: 'RD 45-23', title: 'Sợi FRP gia cường cầu', funding: 650, pct: 54 },
                        { code: 'TC24-20', title: 'Cấp phối bê tông mới', funding: 450, pct: 37 }
                      ].map((item, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between items-center text-[10px] font-semibold text-ink-secondary">
                            <span className="truncate max-w-[180px] sm:max-w-md"><strong className="text-primary-600 font-bold">{item.code}</strong>: {item.title}</span>
                            <span className="font-extrabold text-success-600">{item.funding}tr VNĐ</span>
                          </div>
                          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden relative border border-border-subtle">
                            <div 
                              className="h-full bg-gradient-to-r from-primary-500 to-indigo-600 rounded-full transition-all duration-1000" 
                              style={{ width: `${item.pct}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Ô tìm kiếm cho màn hình di động */}
                  <div className="relative sm:hidden w-full">
                    <input
                      type="text"
                      placeholder="Tìm mã số, tên đề tài, chủ nhiệm..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full py-2 pl-8 pr-3 text-2xs rounded-lg border border-border bg-surface focus:outline-none focus:ring-1 focus:ring-primary font-semibold"
                    />
                    <Search className="absolute left-2.5 top-2.5 text-ink-muted" size={12} />
                  </div>

                  {filteredProjects.length === 0 ? (
                    <div className="card p-8 text-center text-ink-muted text-2xs font-semibold">
                      Không tìm thấy đề tài nghiên cứu nào phù hợp bộ lọc.
                    </div>
                  ) : (
                    <div className="space-y-3.5">
                      {filteredProjects.map((p) => (
                        <div key={p.id} onClick={() => setSelectedProject(p)} className="card p-5 hover:shadow-card-hover hover:border-primary border border-border flex justify-between items-start gap-4 cursor-pointer transition-all">
                          <div className="space-y-2 flex-1 text-left">
                            <div className="flex flex-wrap items-center gap-2 text-3xs font-bold">
                              <span className="px-2 py-0.5 bg-primary/10 text-primary-500 rounded">Mã số: {p.code}</span>
                              <span className="px-2 py-0.5 bg-muted text-ink-secondary border border-border rounded">{p.type}</span>
                              <span className="px-1.5 py-0.5 bg-success/10 text-success-500 rounded">{p.status}</span>
                            </div>
                            <h3 className="font-bold text-ink text-[13px] hover:text-primary transition-colors">{p.title}</h3>
                            <p className="text-2xs text-ink-secondary font-medium line-clamp-2">{p.summary}</p>
                            <div className="flex flex-wrap gap-4 text-3xs text-ink-muted pt-1 font-semibold">
                              <span>Chủ nhiệm: <strong className="text-ink-secondary">{p.leader}</strong></span>
                              <span>Năm nghiệm thu: {p.year}</span>
                              <span>Kinh phí: <strong className="text-success-500">{p.funding}tr VNĐ</strong></span>
                            </div>
                          </div>
                          <ChevronRight className="text-ink-muted mt-5 shrink-0" size={16} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 6. ĐÀO TẠO TAB */}
        {activeTab === 'training' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 text-left animate-fade-in">
            {/* Sidebar bộ lọc cho Đào tạo */}
            <div className="lg:col-span-1 space-y-4">
              <div className="card p-3 space-y-1 bg-surface/50">
                <p className="text-3xs font-black text-ink-muted uppercase tracking-wider mb-2 px-2">Hệ thống đào tạo</p>
                <button
                  onClick={() => setActiveSubTab('all')}
                  className={cn("w-full text-left px-3 py-2 text-2xs font-bold rounded-lg transition-colors cursor-pointer", activeSubTab === 'all' ? "bg-primary text-white" : "hover:bg-muted text-ink-secondary")}
                >
                  Tất cả thông tin
                </button>
                <button
                  onClick={() => setActiveSubTab('dao-tao-ts')}
                  className={cn("w-full text-left px-3 py-2 text-2xs font-bold rounded-lg transition-colors cursor-pointer", activeSubTab === 'dao-tao-ts' ? "bg-primary text-white" : "hover:bg-muted text-ink-secondary")}
                >
                  Đào tạo Tiến sĩ
                </button>
                <button
                  onClick={() => setActiveSubTab('dao-tao-chuyen-de')}
                  className={cn("w-full text-left px-3 py-2 text-2xs font-bold rounded-lg transition-colors cursor-pointer", activeSubTab === 'dao-tao-chuyen-de' ? "bg-primary text-white" : "hover:bg-muted text-ink-secondary")}
                >
                  Đào tạo, tập huấn chuyên đề
                </button>
                <button
                  onClick={() => setActiveSubTab('hoi-nghi-kh')}
                  className={cn("w-full text-left px-3 py-2 text-2xs font-bold rounded-lg transition-colors cursor-pointer", activeSubTab === 'hoi-nghi-kh' ? "bg-primary text-white" : "hover:bg-muted text-ink-secondary")}
                >
                  Hội nghị khoa học
                </button>
              </div>
            </div>

            {/* Nội dung Đào tạo */}
            <div className="lg:col-span-3 space-y-6">
              {(activeSubTab === 'all' || activeSubTab === 'dao-tao-ts') && (
                <div className="card p-6 space-y-4 animate-fade-in-up">
                  <h3 className="text-md font-black text-ink border-b border-border pb-3 flex items-center gap-2">
                    <Award className="text-primary-500" size={16} />
                    Đào tạo Tiến sĩ (PhD Program)
                  </h3>
                  <p className="text-2xs text-ink-secondary font-semibold leading-relaxed">
                    Viện Khoa học Công nghệ Xây dựng (IBST) là cơ sở đào tạo Tiến sĩ đầu ngành được Bộ Giáo dục và Đào tạo cấp phép hoạt động, tập trung vào nghiên cứu ứng dụng thực tế.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                    {[
                      { title: 'Kỹ thuật Xây dựng Công trình', code: '9580201', desc: 'Nghiên cứu kết cấu bê tông cốt thép, kết cấu thép đặc biệt, động đất và gió bão.' },
                      { title: 'Kỹ thuật Địa kỹ thuật', code: '9580205', desc: 'Nghiên cứu nền móng, ổn định mái dốc, cơ học đất đá, tương tác kết cấu - đất nền.' },
                      { title: 'Vật liệu Xây dựng', code: '9520301', desc: 'Nghiên cứu bê tông cường độ siêu cao UHPC, bê tông thân thiện môi trường, vật liệu polyme.' }
                    ].map((major, idx) => (
                      <div key={idx} className="p-4 bg-muted border border-border rounded-xl space-y-2 text-left">
                        <span className="inline-block px-2 py-0.5 text-[9px] font-extrabold bg-primary/10 text-primary-600 rounded">Mã ngành: {major.code}</span>
                        <h4 className="font-bold text-ink text-2xs leading-snug">{major.title}</h4>
                        <p className="text-3xs text-ink-muted leading-relaxed font-semibold">{major.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(activeSubTab === 'all' || activeSubTab === 'dao-tao-chuyen-de') && (
                <div className="card p-6 space-y-4 animate-fade-in-up">
                  <h3 className="text-md font-black text-ink border-b border-border pb-3 flex items-center gap-2">
                    <BookOpen className="text-primary-500" size={16} />
                    Đào tạo, Tập huấn chuyên đề ngắn hạn
                  </h3>
                  <div className="space-y-3">
                    {[
                      { title: 'Bồi dưỡng thí nghiệm viên chuyên ngành xây dựng (LAS-XD)', duration: '12 ngày', status: 'Đang mở đăng ký' },
                      { title: 'Hướng dẫn thiết kế kết cấu bê tông cốt thép theo tiêu chuẩn mới Eurocode 2', duration: '3 ngày', status: 'Dự kiến tháng 8/2026' },
                      { title: 'Tập huấn kỹ năng kiểm định chất lượng, đánh giá độ an toàn kết cấu chịu lực công trình', duration: '5 ngày', status: 'Thường xuyên' }
                    ].map((course, idx) => (
                      <div key={idx} className="p-4 bg-muted border border-border rounded-xl flex justify-between items-center gap-4">
                        <div className="text-left space-y-1">
                          <h4 className="font-bold text-ink text-2xs leading-snug">{course.title}</h4>
                          <p className="text-3xs text-ink-muted font-semibold">Thời lượng khóa học: {course.duration}</p>
                        </div>
                        <span className="px-2.5 py-1 text-3xs font-extrabold bg-primary text-white rounded-lg whitespace-nowrap cursor-pointer">
                          {course.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(activeSubTab === 'all' || activeSubTab === 'hoi-nghi-kh') && (
                <div className="card p-6 space-y-4 animate-fade-in-up">
                  <h3 className="text-md font-black text-ink border-b border-border pb-3 flex items-center gap-2">
                    <Users className="text-primary-500" size={16} />
                    Hội nghị Khoa học
                  </h3>
                  <div className="p-4 bg-primary-500/5 border border-primary-500/20 rounded-2xl flex items-start gap-4 text-left">
                    <div className="p-3 bg-primary-500 text-white rounded-xl"><Activity size={24} /></div>
                    <div className="text-left space-y-1.5 flex-1">
                      <span className="inline-block px-2 py-0.5 text-[9px] font-extrabold bg-primary-500 text-white rounded uppercase tracking-wider">Hội nghị tiêu biểu sắp diễn ra</span>
                      <h4 className="font-bold text-ink text-2xs md:text-xs">Hội nghị Khoa học Cán bộ trẻ lần thứ XVII - IBST 2026</h4>
                      <p className="text-3xs text-ink-secondary leading-relaxed font-semibold">Hội nghị khoa học thường niên thu hút hơn 100 bài báo khoa học của các nghiên cứu sinh, cán bộ nghiên cứu trẻ tại các viện thiết kế, trường đại học toàn quốc.</p>
                      <div className="pt-2 flex gap-4 text-3xs text-ink-muted font-bold">
                        <span>Thời gian: Tháng 10/2026</span>
                        <span>Địa điểm: Trụ sở chính IBST, Hà Nội</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 7. THÍ NGHIỆM & CHỨNG NHẬN TAB */}
        {activeTab === 'testing' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 text-left animate-fade-in">
            {/* Sidebar Thí nghiệm & Chứng nhận */}
            <div className="lg:col-span-1 space-y-4">
              <div className="card p-3 space-y-1 bg-surface/50">
                <p className="text-3xs font-black text-ink-muted uppercase tracking-wider mb-2 px-2">Hoạt động dịch vụ</p>
                <button
                  onClick={() => setActiveSubTab('all')}
                  className={cn("w-full text-left px-3 py-2 text-2xs font-bold rounded-lg transition-colors cursor-pointer", activeSubTab === 'all' ? "bg-primary text-white" : "hover:bg-muted text-ink-secondary")}
                >
                  Tất cả dịch vụ
                </button>
                <button
                  onClick={() => setActiveSubTab('thi-nghiem')}
                  className={cn("w-full text-left px-3 py-2 text-2xs font-bold rounded-lg transition-colors cursor-pointer", activeSubTab === 'thi-nghiem' ? "bg-primary text-white" : "hover:bg-muted text-ink-secondary")}
                >
                  Thí nghiệm chuyên ngành
                </button>
                <button
                  onClick={() => setActiveSubTab('chung-nhan')}
                  className={cn("w-full text-left px-3 py-2 text-2xs font-bold rounded-lg transition-colors cursor-pointer", activeSubTab === 'chung-nhan' ? "bg-primary text-white" : "hover:bg-muted text-ink-secondary")}
                >
                  Chứng nhận hợp chuẩn, hợp quy
                </button>
                <button
                  onClick={() => setActiveSubTab('kiem-dinh')}
                  className={cn("w-full text-left px-3 py-2 text-2xs font-bold rounded-lg transition-colors cursor-pointer", activeSubTab === 'kiem-dinh' ? "bg-primary text-white" : "hover:bg-muted text-ink-secondary")}
                >
                  Kiểm định công trình
                </button>
              </div>
            </div>

            {/* Nội dung Thí nghiệm & Chứng nhận */}
            <div className="lg:col-span-3 space-y-6">
              {(activeSubTab === 'all' || activeSubTab === 'thi-nghiem') && (
                <div className="card p-6 space-y-4 animate-fade-in-up">
                  <h3 className="text-md font-black text-ink border-b border-border pb-3 flex items-center gap-2">
                    <Wrench className="text-primary-500" size={16} />
                    Thí nghiệm vật liệu & kết cấu công trình
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { title: 'Thử nghiệm giới hạn chịu lửa cấu kiện', desc: 'Thử nghiệm khả năng chịu lửa của cửa chống cháy, vách ngăn, cột dầm bảo vệ theo tiêu chuẩn ISO 834, TCVN 9311.' },
                      { title: 'Thí nghiệm cơ lý đất nền & móng', desc: 'Nén tĩnh cọc khoan nhồi trọng tải lớn (đến 4000 tấn), thí nghiệm nén hầm lò, khảo sát địa chất phức tạp.' },
                      { title: 'Thử nghiệm gió kết cấu nhà cao tầng', desc: 'Mô phỏng hầm gió tại phòng Lab khí động học phục vụ thiết kế tải trọng gió động cho các cao ốc trên 50 tầng.' },
                      { title: 'Thử nghiệm không phá hủy (NDT)', desc: 'Siêu âm khuyết tật bê tông, quét radar cốt thép trong kết cấu móng bệ máy phát điện, kiểm tra ăn mòn cáp dự ứng lực.' }
                    ].map((item, idx) => (
                      <div key={idx} className="p-4 bg-muted border border-border rounded-xl space-y-1.5 text-left">
                        <h4 className="font-bold text-ink text-2xs leading-snug">{item.title}</h4>
                        <p className="text-3xs text-ink-muted leading-relaxed font-semibold">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(activeSubTab === 'all' || activeSubTab === 'chung-nhan') && (
                <div className="card p-6 space-y-4 animate-fade-in-up">
                  <h3 className="text-md font-black text-ink border-b border-border pb-3 flex items-center gap-2">
                    <ShieldCheck className="text-primary-500" size={16} />
                    Chứng nhận hợp chuẩn, hợp quy sản phẩm xây dựng
                  </h3>
                  <p className="text-2xs text-ink-secondary font-semibold leading-relaxed">
                    Tổ chức Chứng nhận thuộc IBST được Tổng cục Tiêu chuẩn Đo lường Chất lượng và Bộ Xây dựng cấp chứng chỉ chỉ định thực hiện chứng nhận sự phù hợp chất lượng:
                  </p>
                  <div className="p-4 bg-muted border border-border rounded-xl space-y-2 text-left">
                    <h4 className="font-bold text-ink text-2xs flex items-center gap-1.5"><Info size={12} className="text-primary-500" /> Chứng nhận hợp quy theo QCVN 16:2023/BXD:</h4>
                    <ul className="list-disc pl-5 text-3xs text-ink-muted font-bold space-y-1">
                      <li>Xi măng, phụ gia cho xi măng và bê tông.</li>
                      <li>Kính xây dựng, tấm thạch cao, tấm sóng sợi amiăng.</li>
                      <li>Sơn, vật liệu chống thấm, ống nhựa PVC/HDPE.</li>
                      <li>Cốt liệu xây dựng (cát, đá dăm, cát nhân tạo).</li>
                    </ul>
                  </div>
                </div>
              )}

              {(activeSubTab === 'all' || activeSubTab === 'kiem-dinh') && (
                <div className="card p-6 space-y-4 animate-fade-in-up">
                  <h3 className="text-md font-black text-ink border-b border-border pb-3 flex items-center gap-2">
                    <Activity className="text-primary-500" size={16} />
                    Kiểm định & Giám định chất lượng xây dựng
                  </h3>
                  <div className="space-y-3">
                    {[
                      { project: 'Cảng hàng không Quốc tế Long Thành', task: 'Kiểm định độc lập nền móng và chất lượng thi công kết cấu bê tông cốt thép hạng mục nhà ga hành khách.' },
                      { project: 'Nhà Quốc Hội Việt Nam', task: 'Thực hiện giám định thử tải dầm sàn khẩu độ lớn, đo đạc biến dạng động của hệ mái thép giàn không gian.' },
                      { project: 'Nhà máy Thủy điện Sơn La', task: 'Đo trắc địa quan trắc biến dạng đập bê tông đầm lăn (RCC), phân tích động đất kích thích khu vực lòng hồ.' }
                    ].map((item, idx) => (
                      <div key={idx} className="p-4 bg-muted border border-border rounded-xl text-left space-y-1">
                        <span className="inline-block px-2 py-0.5 text-[9px] font-extrabold bg-primary/10 text-primary-600 rounded">Dự án: {item.project}</span>
                        <p className="text-3xs text-ink-secondary leading-relaxed font-semibold">{item.task}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 8. TƯ VẤN & THI CÔNG TAB */}
        {activeTab === 'consulting' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 text-left animate-fade-in">
            {/* Sidebar Tư vấn & Thi công */}
            <div className="lg:col-span-1 space-y-4">
              <div className="card p-3 space-y-1 bg-surface/50">
                <p className="text-3xs font-black text-ink-muted uppercase tracking-wider mb-2 px-2">Hoạt động kỹ thuật</p>
                <button
                  onClick={() => setActiveSubTab('all')}
                  className={cn("w-full text-left px-3 py-2 text-2xs font-bold rounded-lg transition-colors cursor-pointer", activeSubTab === 'all' ? "bg-primary text-white" : "hover:bg-muted text-ink-secondary")}
                >
                  Tất cả lĩnh vực
                </button>
                <button
                  onClick={() => setActiveSubTab('tu-van')}
                  className={cn("w-full text-left px-3 py-2 text-2xs font-bold rounded-lg transition-colors cursor-pointer", activeSubTab === 'tu-van' ? "bg-primary text-white" : "hover:bg-muted text-ink-secondary")}
                >
                  Khảo sát, Thiết kế & Giám sát
                </button>
                <button
                  onClick={() => setActiveSubTab('thi-cong')}
                  className={cn("w-full text-left px-3 py-2 text-2xs font-bold rounded-lg transition-colors cursor-pointer", activeSubTab === 'thi-cong' ? "bg-primary text-white" : "hover:bg-muted text-ink-secondary")}
                >
                  Thi công & Tu bổ di tích
                </button>
                <button
                  onClick={() => setActiveSubTab('san-pham')}
                  className={cn("w-full text-left px-3 py-2 text-2xs font-bold rounded-lg transition-colors cursor-pointer", activeSubTab === 'san-pham' ? "bg-primary text-white" : "hover:bg-muted text-ink-secondary")}
                >
                  Vật liệu & Hóa phẩm đặc chủng
                </button>
              </div>
            </div>

            {/* Nội dung Tư vấn & Thi công */}
            <div className="lg:col-span-3 space-y-6">
              {(activeSubTab === 'all' || activeSubTab === 'tu-van') && (
                <div className="card p-6 space-y-4 animate-fade-in-up">
                  <h3 className="text-md font-black text-ink border-b border-border pb-3 flex items-center gap-2">
                    <Wrench className="text-primary-500" size={16} />
                    Khảo sát xây dựng, Thiết kế & Thẩm tra kết cấu
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { title: 'Khảo sát địa chất công trình đặc biệt', desc: 'Khoan khảo sát sâu trên 100m, thí nghiệm xuyên tiêu chuẩn SPT, cắt cánh hiện trường phục vụ nhà siêu cao tầng.' },
                      { title: 'Thiết kế & Thẩm tra biện pháp thi công', desc: 'Thẩm tra thiết kế tường vây hố móng sâu (sâu đến 5 tầng hầm), tính toán ổn định hệ dầm chống văng (Shoring).' },
                      { title: 'Giám sát thi công xây dựng', desc: 'Giám sát độc lập phần móng cọc, kết cấu phần thân siêu cao tầng và hệ thống cơ điện công trình (MEP).' },
                      { title: 'Quan trắc môi trường & Khảo sát sạt lở', desc: 'Quan trắc lún nghiêng tự động thời gian thực bằng robot toàn đạc Leica, cảnh báo sạt lở đập dốc đứng.' }
                    ].map((item, idx) => (
                      <div key={idx} className="p-4 bg-muted border border-border rounded-xl space-y-1.5 text-left">
                        <h4 className="font-bold text-ink text-2xs leading-snug">{item.title}</h4>
                        <p className="text-3xs text-ink-muted leading-relaxed font-semibold">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(activeSubTab === 'all' || activeSubTab === 'thi-cong') && (
                <div className="card p-6 space-y-4 animate-fade-in-up">
                  <h3 className="text-md font-black text-ink border-b border-border pb-3 flex items-center gap-2">
                    <Building size={16} className="text-primary-500" />
                    Thi công xây dựng chuyên dụng & Tu bổ di tích
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-muted border border-border rounded-xl space-y-2 text-left">
                      <h4 className="font-bold text-ink text-2xs">Thi công xây lập đặc biệt</h4>
                      <p className="text-3xs text-ink-muted leading-relaxed font-semibold">Thi công gia cố nền móng bằng cọc xi măng đất (Jet Grouting), gia cường kết cấu cũ bằng tấm sợi carbon (FRP), bơm keo epoxy xử lý nứt bê tông đập thủy điện.</p>
                    </div>
                    <div className="p-4 bg-muted border border-border rounded-xl space-y-2 text-left">
                      <h4 className="font-bold text-ink text-2xs">Tu bổ tôn tạo di tích lịch sử</h4>
                      <p className="text-3xs text-ink-muted leading-relaxed font-semibold">Tôn tạo phục hồi kết cấu gỗ cổ, phục chế hoa văn đất nung sơn mài cổ truyền, gia cố nền móng đền đài không xâm hại cấu trúc nguyên bản di tích quốc gia đặc biệt.</p>
                    </div>
                  </div>
                </div>
              )}

              {(activeSubTab === 'all' || activeSubTab === 'san-pham') && (
                <div className="card p-6 space-y-4 animate-fade-in-up">
                  <h3 className="text-md font-black text-ink border-b border-border pb-3 flex items-center gap-2">
                    <Layers className="text-primary-500" size={16} />
                    Vật liệu & Hóa phẩm xây dựng đặc chủng (IBST Products)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { name: 'Bê tông siêu tính năng UHPC', spec: 'Cường độ nén > 120 MPa', usage: 'Chuyên dụng cho bản mặt cầu mỏng, kết cấu chịu tải cực lớn.' },
                      { name: 'Vữa tự chảy không co ngót', spec: 'Mác vữa M60 - M80', usage: 'Bơm chèn chân cột thép nhà công nghiệp, khe nối dầm đúc sẵn.' },
                      { name: 'Keo cấy thép & Chống thấm', spec: 'Epoxy 2 thành phần', usage: 'Neo cấy cốt thép chờ gia hạn dầm sàn, chống thấm nghịch hầm sâu.' }
                    ].map((prod, idx) => (
                      <div key={idx} className="p-4 bg-muted border border-border rounded-xl text-left space-y-2">
                        <h4 className="font-bold text-ink text-2xs">{prod.name}</h4>
                        <div className="text-[9px] text-primary-500 font-extrabold bg-primary/10 px-1.5 py-0.5 rounded inline-block">{prod.spec}</div>
                        <p className="text-3xs text-ink-muted leading-relaxed font-semibold">{prod.usage}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 9. HỎI ĐÁP TAB */}
        {activeTab === 'faq' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left animate-fade-in">
            {/* Form gửi câu hỏi */}
            <div className="lg:col-span-1 space-y-4">
              <div className="card p-5 space-y-4 bg-surface/80">
                <h3 className="text-2xs font-black text-ink uppercase tracking-wider border-b border-border-subtle pb-2">Gửi câu hỏi cho Viện</h3>
                <div className="space-y-3 text-3xs font-semibold">
                  <div className="space-y-1">
                    <label className="text-ink-secondary">Họ và tên *</label>
                    <input type="text" placeholder="Nguyễn Văn A" className="w-full p-2.5 rounded-lg border border-border bg-surface focus:outline-none focus:ring-1 focus:ring-primary" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-ink-secondary">Email liên hệ *</label>
                    <input type="email" placeholder="email@vi-du.com" className="w-full p-2.5 rounded-lg border border-border bg-surface focus:outline-none focus:ring-1 focus:ring-primary" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-ink-secondary">Nội dung câu hỏi *</label>
                    <textarea rows={4} placeholder="Xin hỏi về điều kiện áp dụng kết cấu thép phòng cháy theo QCVN 06..." className="w-full p-2.5 rounded-lg border border-border bg-surface focus:outline-none focus:ring-1 focus:ring-primary resize-none"></textarea>
                  </div>
                  <button onClick={() => alert('Gửi câu hỏi thành công! Ban biên tập IBST sẽ phản hồi qua email của bạn.')} className="w-full py-2.5 bg-primary text-white rounded-xl font-bold hover:bg-primary-600 transition-colors shadow-sm cursor-pointer text-2xs">
                    Gửi câu hỏi
                  </button>
                </div>
              </div>
            </div>

            {/* Danh sách Hỏi Đáp tiêu biểu */}
            <div className="lg:col-span-2 space-y-4">
              <div className="card p-6 space-y-4">
                <h3 className="text-md font-black text-ink border-b border-border pb-3 flex items-center gap-2">
                  <Info className="text-primary-500" size={16} />
                  Giải đáp thắc mắc Quy chuẩn, Tiêu chuẩn & Kỹ thuật xây dựng
                </h3>
                <div className="space-y-4">
                  {[
                    { q: 'Yêu cầu kiểm tra giới hạn chịu lửa của cửa cuốn ngăn cháy trong QCVN 06 như thế nào?', a: 'Theo QCVN 06, các cửa cuốn chống cháy phải được thử nghiệm xác định giới hạn chịu lửa (EI hoặc E) tại phòng thử nghiệm được Bộ Xây dựng chỉ định (như phòng Lab chịu lửa của IBST tại Hòa Lạc). Thời gian thử nghiệm kéo dài liên tục dưới ngọn lửa tiêu chuẩn theo ISO 834.' },
                    { q: 'Cường độ nén của bê tông tính năng siêu cao UHPC đạt chuẩn quy định hiện hành ở Việt Nam là bao nhiêu?', a: 'Hiện nay, theo các tiêu chuẩn cơ sở mới nhất biên soạn bởi IBST, bê tông siêu tính năng UHPC cần đạt cường độ nén tối thiểu là 120 MPa trở lên ở 28 ngày tuổi, đồng thời yêu cầu bổ sung cốt sợi thép cường độ cao phân tán để chống nứt và tăng khả năng chịu uốn.' },
                    { q: 'Khi nào cần tiến hành đo trắc địa quan trắc độ nghiêng và độ lún cho nhà chung cư cao tầng?', a: 'Theo quy định, tất cả các công trình chung cư cao tầng (từ 9 tầng trở lên hoặc móng sâu trên hố móng đào sâu >5m) bắt buộc phải quan trắc độ lún trong suốt quá trình xây dựng cho đến khi công trình đạt độ lún ổn định ổn định (dưới 1mm/năm). Việc quan trắc phải do đơn vị có năng lực chuyên môn thực hiện.' }
                  ].map((faqItem, idx) => (
                    <div key={idx} className="p-4 bg-muted border border-border rounded-xl space-y-2 text-left">
                      <h4 className="font-bold text-ink text-2xs flex items-start gap-1.5">
                        <span className="px-1.5 py-0.5 bg-red-600 text-white rounded text-[9px] font-black uppercase shrink-0">Hỏi</span>
                        <span>{faqItem.q}</span>
                      </h4>
                      <p className="text-3xs text-ink-secondary leading-relaxed font-semibold pl-8 border-l border-border-subtle relative">
                        <span className="absolute -left-1 top-0 px-1 py-0.5 bg-primary-600 text-white rounded text-[8px] font-black uppercase">Đáp</span>
                        {faqItem.a}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ─── FOOTER ─── */}
      <footer className="bg-surface border-t border-border mt-16 pt-12 pb-8 text-left text-[11px] font-semibold text-ink-muted">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 bg-white rounded-lg p-1 border border-border flex items-center justify-center overflow-hidden">
                <img src="https://ibst.vn/templates/e4cms/images/icon/logo5.png" alt="Logo IBST" className="object-contain w-full h-full" />
              </div>
              <div>
                <h4 className="font-black text-ink uppercase text-[10px] tracking-wide leading-tight">VIỆN KHCN XÂY DỰNG</h4>
                <p className="text-[9px] text-ink-muted uppercase tracking-wider">BỘ XÂY DỰNG</p>
              </div>
            </div>
            <p className="text-3xs text-ink-muted leading-relaxed font-medium">
              Đơn vị Khoa học Công nghệ đầu ngành trong lĩnh vực xây dựng tại Việt Nam, phục vụ công tác QLNN của Bộ Xây dựng và cung cấp giải pháp kỹ thuật chất lượng cao.
            </p>
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-muted border border-border text-[9px] font-extrabold rounded text-ink-secondary">VILAS 011</span>
              <span className="px-2 py-1 bg-muted border border-border text-[9px] font-extrabold rounded text-ink-secondary">ISO 17025</span>
              <span className="px-2 py-1 bg-muted border border-border text-[9px] font-extrabold rounded text-ink-secondary">LAS-XD</span>
            </div>
          </div>

          {/* Col 2: Addresses */}
          <div className="space-y-4 lg:col-span-2">
            <h4 className="font-black text-ink uppercase text-[10px] tracking-wider border-b border-border-subtle pb-1">{lang === 'vi' ? 'Địa chỉ liên hệ' : 'Contact Addresses'}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-3xs font-medium leading-normal text-ink-muted">
              <div className="space-y-2">
                <p className="font-extrabold text-ink-secondary">{lang === 'vi' ? 'Trụ sở chính (Hà Nội):' : 'Main Headquarters (Hanoi):'}</p>
                <p className="flex items-start gap-1.5"><MapPin size={12} className="text-primary-500 shrink-0 mt-0.5" /> <span>Số 81 phố Trần Cung, phường Nghĩa Đô, quận Cầu Giấy, Hà Nội</span></p>
                <p className="flex items-center gap-1.5"><Phone size={12} className="text-primary-500 shrink-0" /> <span>024 37544196</span></p>
              </div>
              <div className="space-y-2">
                <p className="font-extrabold text-ink-secondary">{lang === 'vi' ? 'Phân viện Miền Nam (PVMN):' : 'Southern Branch (HCMC):'}</p>
                <p className="flex items-start gap-1.5"><MapPin size={12} className="text-primary-500 shrink-0 mt-0.5" /> <span>Số 20/5B Quốc lộ 13, phường Hiệp Bình Phước, TP. Thủ Đức, TP. Hồ Chí Minh</span></p>
              </div>
              <div className="space-y-2">
                <p className="font-extrabold text-ink-secondary">{lang === 'vi' ? 'Phân viện Miền Trung (PVMT):' : 'Central Branch (Hue/Da Nang):'}</p>
                <p className="flex items-start gap-1.5"><MapPin size={12} className="text-primary-500 shrink-0 mt-0.5" /> <span>Số 183 Đường Phạm Văn Đồng, phường Vỹ Dạ, TP. Huế, tỉnh Thừa Thiên Huế</span></p>
              </div>
            </div>
          </div>

          {/* Col 3: Fast access */}
          <div className="space-y-4 text-left">
            <h4 className="font-black text-ink uppercase text-[10px] tracking-wider border-b border-border-subtle pb-1">{lang === 'vi' ? 'Liên kết nhanh' : 'Quick Links'}</h4>
            <ul className="grid grid-cols-2 gap-2 text-3xs font-bold text-ink-secondary">
              <li><button onClick={() => handleTabChange('home')} className="hover:text-primary-500 transition-colors cursor-pointer">Trang chủ</button></li>
              <li><button onClick={() => handleTabChange('intro', 'nhiem-vu')} className="hover:text-primary-500 transition-colors cursor-pointer">Nhiệm vụ</button></li>
              <li><button onClick={() => handleTabChange('intro', 'co-cau')} className="hover:text-primary-500 transition-colors cursor-pointer">Tổ chức</button></li>
              <li><button onClick={() => handleTabChange('intro', 'phong-lab')} className="hover:text-primary-500 transition-colors cursor-pointer">Phòng Lab</button></li>
              <li><button onClick={() => handleTabChange('news')} className="hover:text-primary-500 transition-colors cursor-pointer">Tin tức</button></li>
              <li><button onClick={() => handleTabChange('state-gov')} className="hover:text-primary-500 transition-colors cursor-pointer">QLNN</button></li>
              <li><button onClick={() => handleTabChange('research')} className="hover:text-primary-500 transition-colors cursor-pointer">Nghiên cứu</button></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 mt-10 pt-4 border-t border-border-subtle text-center text-3xs font-semibold leading-relaxed text-ink-muted">
          © 2026 Viện Khoa học Công nghệ Xây dựng (IBST). Bảo lưu mọi quyền. Độc lập - Chuyên nghiệp - Tin cậy.<br/>
          Cổng thông tin được hỗ trợ kỹ thuật bởi CIC - MOC.
        </div>
      </footer>

      {/* ─── FLOATING DISPLAY SETTINGS WIDGET ─── */}
      <div className="fixed top-28 right-4 z-50">
        <button
          onClick={() => setSettingsOpen(!settingsOpen)}
          title="Cài đặt hiển thị"
          className="w-10 h-10 rounded-full bg-primary-500 text-white flex items-center justify-center shadow-lg hover:bg-primary-600 active:scale-95 transition-all cursor-pointer"
        >
          <Settings size={20} className={cn("transition-transform duration-300", settingsOpen && "rotate-45")} />
        </button>

        {settingsOpen && (
          <div className="absolute right-0 top-12 w-64 p-4 bg-surface border border-border rounded-xl shadow-dropdown text-left space-y-4 animate-fade-in">
            <div className="pb-2 border-b border-border-subtle flex justify-between items-center">
              <span className="text-xs font-black text-ink">Cài đặt giao diện</span>
              <span className="text-3xs text-primary-500 font-bold">Public Web</span>
            </div>

            {/* Theme Select */}
            <div className="space-y-1.5">
              <span className="text-2xs font-semibold text-ink-secondary">Giao diện nền</span>
              <div className="flex gap-1 bg-muted p-0.5 rounded-lg">
                <button
                  onClick={() => setTheme('light')}
                  className={cn(
                    "flex-1 py-1 text-3xs font-bold rounded-md flex items-center justify-center gap-1 cursor-pointer transition-all",
                    theme === 'light' ? "bg-surface text-primary shadow-sm" : "text-ink-muted hover:text-ink"
                  )}
                >
                  <Sun size={11} /> Sáng
                </button>
                <button
                  onClick={() => setTheme('nature')}
                  className={cn(
                    "flex-1 py-1 text-3xs font-bold rounded-md flex items-center justify-center gap-1 cursor-pointer transition-all",
                    theme === 'nature' ? "bg-surface text-primary shadow-sm" : "text-ink-muted hover:text-ink"
                  )}
                >
                  <Leaf size={11} /> Bảo vệ
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={cn(
                    "flex-1 py-1 text-3xs font-bold rounded-md flex items-center justify-center gap-1 cursor-pointer transition-all",
                    theme === 'dark' ? "bg-surface text-primary shadow-sm" : "text-ink-muted hover:text-ink"
                  )}
                >
                  <Moon size={11} /> Tối
                </button>
              </div>
            </div>

            {/* Primary Colors */}
            <div className="space-y-1.5">
              <span className="text-2xs font-semibold text-ink-secondary">Màu sắc chủ đạo</span>
              <div className="grid grid-cols-5 gap-1.5 bg-muted p-1.5 rounded-lg justify-items-center">
                {PRIMARY_COLORS.map(({ id, name, hex }) => {
                  const active = primaryColor === id;
                  return (
                    <button
                      key={id}
                      onClick={() => setPrimaryColor(id)}
                      title={name}
                      className={cn(
                        "w-5 h-5 rounded-full flex items-center justify-center transition-transform hover:scale-110 cursor-pointer",
                        active && "ring-1 ring-offset-1 ring-offset-surface"
                      )}
                      style={{ background: hex }}
                    >
                      {active && <Check size={10} className="text-white" strokeWidth={3} />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Zoom Control */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-2xs font-semibold text-ink-secondary">
                <span>Tỷ lệ hiển thị</span>
                <span className="font-bold text-primary-500">{zoom}%</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setZoom(Math.max(100, zoom - 10))}
                  disabled={zoom <= 100}
                  className="w-6 h-6 flex items-center justify-center rounded-lg border border-border bg-subtle hover:bg-muted text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ZoomOut size={10} />
                </button>
                <input
                  type="range"
                  min="100"
                  max="200"
                  step="10"
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="flex-1 h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-[var(--color-primary)] focus:outline-none"
                  style={{
                    background: `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${zoom - 100}%, var(--bg-muted) ${zoom - 100}%, var(--bg-muted) 100%)`
                  }}
                />
                <button
                  onClick={() => setZoom(Math.min(200, zoom + 10))}
                  disabled={zoom >= 200}
                  className="w-6 h-6 flex items-center justify-center rounded-lg border border-border bg-subtle hover:bg-muted text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ZoomIn size={10} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ─── MODAL: MỤC LỤC CHI TIẾT TẠP CHÍ ─── */}
      {journalModalOpen && selectedJournal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-surface border border-border shadow-dropdown rounded-2xl max-w-lg w-full p-6 text-left space-y-4">
            <div className="flex justify-between items-start border-b border-border-subtle pb-3">
              <div className="space-y-1">
                <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase bg-primary-500/10 text-primary-500 border border-primary-500/10">
                  {selectedJournal.volume}
                </span>
                <h3 className="font-extrabold text-sm text-ink mt-1">
                  {lang === 'vi' ? 'Mục lục Tạp chí Khoa học Công nghệ Xây dựng' : 'Scientific Journal Table of Contents'}
                </h3>
              </div>
              <button 
                onClick={() => setJournalModalOpen(false)}
                className="text-ink-muted hover:text-ink text-xs font-bold px-2 py-1 rounded bg-muted cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {selectedJournal.articles.map((art: any, i: number) => (
                <div key={i} className="p-3 bg-muted/40 border border-border rounded-xl space-y-1 text-2xs font-semibold">
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-primary-500/10 text-primary-500 flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5">{i+1}</span>
                    <div className="space-y-1 min-w-0">
                      <p className="text-ink font-bold leading-snug">{art.title}</p>
                      <p className="text-[9px] text-ink-muted italic">{lang === 'vi' ? 'Tác giả: ' : 'Authors: '}{art.authors}</p>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-border-subtle flex justify-end">
                    <a 
                      href="#" 
                      onClick={(e) => { e.preventDefault(); alert(lang === 'vi' ? 'Bắt đầu tải file tóm tắt PDF...' : 'Downloading PDF Abstract...'); }}
                      className="px-2.5 py-1 rounded bg-primary-500 text-white font-extrabold text-[8px] hover:bg-primary-600 shadow-sm transition-colors"
                    >
                      {lang === 'vi' ? 'Tải tóm tắt (Abstract.pdf)' : 'Download Abstract'}
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-border-subtle flex justify-between items-center text-[10px] font-semibold text-ink-muted">
              <span>{selectedJournal.issn} • IBST Publishing</span>
              <span>{selectedJournal.date}</span>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL: TƯ VẤN CHUYÊN GIA ─── */}
      {consultingExpert && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-surface border border-border shadow-dropdown rounded-2xl max-w-md w-full p-6 text-left space-y-4">
            <div className="flex justify-between items-start border-b border-border-subtle pb-3">
              <div className="space-y-1">
                <span className="text-[9px] text-primary-500 font-black uppercase tracking-wider block">Gửi câu hỏi tới chuyên gia</span>
                <h3 className="font-extrabold text-sm text-ink mt-0.5">
                  {consultingExpert.name}
                </h3>
              </div>
              <button 
                onClick={() => setConsultingExpert(null)}
                className="text-ink-muted hover:text-ink text-xs font-bold px-2 py-1 rounded bg-muted cursor-pointer"
              >
                ✕
              </button>
            </div>

            {expertMessageSent ? (
              <div className="p-6 bg-success/5 border border-success/10 rounded-xl text-center space-y-3 animate-fade-in">
                <span className="w-12 h-12 rounded-full bg-success-500/10 text-success-500 flex items-center justify-center text-xl font-bold mx-auto">✓</span>
                <h4 className="font-bold text-xs text-ink">{lang === 'vi' ? 'Gửi câu hỏi thành công!' : 'Question Submitted Successfully!'}</h4>
                <p className="text-3xs text-ink-secondary leading-relaxed font-semibold">
                  {lang === 'vi'
                    ? 'Hệ thống đã chuyển tiếp câu hỏi đến email của chuyên gia. Câu trả lời sẽ gửi về email của bạn trong thời gian sớm nhất.'
                    : 'Your question has been forwarded to the expert. An answer will be sent back to your email shortly.'}
                </p>
                <button
                  onClick={() => setConsultingExpert(null)}
                  className="px-4 py-1.5 bg-primary-500 text-white rounded-lg text-3xs font-extrabold shadow-sm hover:bg-primary-600 transition-colors"
                >
                  {lang === 'vi' ? 'Đóng cửa sổ' : 'Close'}
                </button>
              </div>
            ) : (
              <form 
                onSubmit={(e) => { 
                  e.preventDefault(); 
                  if (expertEmail.trim() && expertQuestion.trim()) {
                    setExpertMessageSent(true); 
                  } else {
                    alert(lang === 'vi' ? 'Vui lòng nhập đầy đủ thông tin!' : 'Please fill in all fields!');
                  }
                }}
                className="space-y-3"
              >
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-ink-muted uppercase block">{lang === 'vi' ? 'Email của bạn' : 'Your Email'}</label>
                  <input 
                    type="email" 
                    required
                    value={expertEmail}
                    onChange={(e) => setExpertEmail(e.target.value)}
                    placeholder="example@domain.com"
                    className="w-full p-2.5 text-2xs rounded-lg border border-border bg-muted/30 font-semibold focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-ink-muted uppercase block">{lang === 'vi' ? 'Nội dung câu hỏi tư vấn' : 'Consultation Question'}</label>
                  <textarea 
                    rows={4}
                    required
                    value={expertQuestion}
                    onChange={(e) => setExpertQuestion(e.target.value)}
                    placeholder={lang === 'vi' ? 'Nhập câu hỏi của bạn về tiêu chuẩn, giải pháp kết cấu hoặc vật liệu...' : 'Enter your technical query...'}
                    className="w-full p-2.5 text-2xs rounded-lg border border-border bg-muted/30 font-semibold focus:outline-none focus:border-primary resize-none"
                  />
                </div>
                <div className="pt-2 flex justify-end gap-2">
                  <button 
                    type="button"
                    onClick={() => setConsultingExpert(null)}
                    className="px-4 py-2 rounded-lg bg-muted text-ink-secondary font-extrabold text-3xs hover:bg-border transition-colors cursor-pointer"
                  >
                    {lang === 'vi' ? 'Hủy' : 'Cancel'}
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-primary-500 text-white font-extrabold text-3xs hover:bg-primary-600 transition-colors shadow-sm cursor-pointer"
                  >
                    {lang === 'vi' ? 'Gửi chuyên gia' : 'Submit to Expert'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
      
      <Chatbot />
    </div>
  );
}
