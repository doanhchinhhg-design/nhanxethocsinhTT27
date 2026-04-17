import { Level } from './types';

export const QUICK_COMMENTS: Record<string, Record<Level, string[]>> = {
  'Chung': {
    'Tốt': [
      'Tiếp thu nhanh, chủ động thực hiện các nhiệm vụ học tập.',
      'Hoàn thành xuất sắc các nội dung học tập, có ý thức tự học cao.',
      'Nắm vững kiến thức môn học, vận dụng linh hoạt vào thực tiễn.',
      'Sáng tạo trong học tập, tích cực tham gia xây dựng bài.',
      'Kỹ năng thực hành tốt, giải quyết vấn đề nhanh nhẹn.'
    ],
    'Đạt': [
      'Hoàn thành các yêu cầu cần đạt của môn học.',
      'Nắm được kiến thức cơ bản, biết vận dụng vào bài tập.',
      'Có ý thức học tập, hoàn thành các nhiệm vụ được giao.',
      'Biết cách xử lí các tình huống học tập đơn giản.',
      'Thực hiện đúng quy trình các hoạt động giáo dục.'
    ],
    'Chưa hoàn thành': [
      'Cần tăng cường rèn luyện để đạt yêu cầu môn học.',
      'Tiếp thu bài còn chậm, cần chú ý hơn trong giờ học.',
      'Cần sự hỗ trợ của giáo viên để hoàn thành bài tập.',
      'Cần tập trung hơn và tích cực tham gia xây dựng bài.'
    ]
  },
  'Toán': {
    'Tốt': [
      'Tính toán thành thạo, giải quyết tốt các vấn đề toán học.',
      'Nắm vững bảng nhân chia, thực hiện phép tính chính xác.',
      'Có tư duy logic tốt, giải toán có lời văn mạch lạc.',
      'Biết vận dụng kiến thức toán học vào thực tế cuộc sống.'
    ],
    'Đạt': [
      'Thực hiện được các phép tính cơ bản đúng quy trình.',
      'Nắm được các đơn vị đo lường đã học.',
      'Biết giải các bài toán đơn giản theo mẫu.',
      'Hoàn thành đầy đủ các bài tập trong sách giáo khoa.'
    ],
    'Chưa hoàn thành': [
      'Kỹ năng tính toán còn chậm, hay nhầm lẫn.',
      'Chưa nắm vững các bảng tính, cần rèn luyện thêm.',
      'Cần chú ý hơn khi đọc và phân tích đề bài.'
    ]
  },
  'Tiếng Việt': {
    'Tốt': [
      'Đọc diễn cảm, hiểu sâu sắc nội dung bài đọc.',
      'Viết đúng quy trình, trình bày sạch đẹp và khoa học.',
      'Vốn từ phong phú, viết câu đúng ngữ pháp, sinh động.',
      'Kể chuyện mạch lạc, biết sử dụng từ ngữ gợi tả.'
    ],
    'Đạt': [
      'Đọc to, rõ ràng, trả lời đúng các câu hỏi cơ bản.',
      'Chữ viết rõ ràng, đúng độ cao và khoảng cách.',
      'Biết cách đặt câu và sử dụng dấu câu cơ bản.',
      'Hoàn thành các bài viết theo yêu cầu của giáo viên.'
    ],
    'Chưa hoàn thành': [
      'Tốc độ đọc còn chậm, hay phát âm sai.',
      'Chữ viết chưa đúng mẫu, trình bày chưa cẩn thận.',
      'Cần rèn luyện thêm về kỹ năng viết đoạn văn.'
    ]
  },
  'Tiếng Anh': {
    'Tốt': [
      'Phát âm chuẩn, giao tiếp tự tin bằng tiếng Anh.',
      'Nắm vững từ vựng và các cấu trúc câu đã học.',
      'Kỹ năng nghe và phản xạ ngôn ngữ rất tốt.',
      'Hăng hái phát biểu, tích cực tham gia trò chơi ngôn ngữ.'
    ],
    'Đạt': [
      'Thuộc từ vựng cơ bản, hiểu các câu lệnh đơn giản.',
      'Biết giới thiệu bản thân và gia đình bằng tiếng Anh.',
      'Hoàn thành các bài tập trong sách giáo khoa.',
      'Nghe và nhắc lại được các từ, câu đơn giản.'
    ],
    'Chưa hoàn thành': [
      'Vốn từ vựng còn hạn chế, phát âm chưa chính xác.',
      'Chưa tự tin khi nói, cần luyện tập giao tiếp nhiều hơn.',
      'Cần chú ý lắng nghe và nhắc lại theo giáo viên.'
    ]
  },
  'Đạo đức': {
    'Tốt': [
      'Thực hiện tốt các chuẩn mực hành vi đạo đức.',
      'Biết quan tâm, giúp đỡ bạn bè và mọi người xung quanh.',
      'Tự giác thực hiện các quy định của trường, lớp.'
    ],
    'Đạt': [
      'Nắm được các bài học về đạo đức và lối sống.',
      'Biết phân biệt hành vi đúng, sai trong cuộc sống.',
      'Có ý thức rèn luyện các thói quen tốt.'
    ],
    'Chưa hoàn thành': [
      'Cần chú ý hơn trong việc thực hiện nội quy lớp học.',
      'Chưa tự giác tham gia các hoạt động tập thể.',
      'Cần rèn luyện thêm kỹ năng giao tiếp ứng xử.'
    ]
  },
  'Tự nhiên và Xã hội': {
    'Tốt': [
      'Ham học hỏi, có hiểu biết phong phú về thế giới xung quanh.',
      'Biết cách quan sát và mô tả các hiện tượng tự nhiên.',
      'Có ý thức bảo vệ môi trường và chăm sóc sức khỏe.'
    ],
    'Đạt': [
      'Nắm được các kiến thức cơ bản về tự nhiên và xã hội.',
      'Biết cách giữ gìn vệ sinh cá nhân và môi trường.',
      'Hoàn thành các nhiệm vụ tìm hiểu thực tế.'
    ],
    'Chưa hoàn thành': [
      'Chưa tập trung quan sát, tiếp thu kiến thức còn chậm.',
      'Cần chú ý hơn khi tham gia các hoạt động trải nghiệm.',
      'Cần rèn luyện kỹ năng trình bày ý kiến cá nhân.'
    ]
  },
  'Khoa học': {
    'Tốt': [
      'Nắm vững các kiến thức khoa học, biết giải thích hiện tượng.',
      'Tích cực tham gia thí nghiệm, quan sát tỉ mỉ.',
      'Có tư duy khoa học, ham tìm tòi khám phá.'
    ],
    'Đạt': [
      'Hiểu được các khái niệm khoa học cơ bản.',
      'Biết vận dụng kiến thức vào việc bảo vệ sức khỏe.',
      'Hoàn thành các bài tập thực hành theo yêu cầu.'
    ],
    'Chưa hoàn thành': [
      'Chưa nắm vững các quy trình thí nghiệm cơ bản.',
      'Tiếp thu kiến thức khoa học còn hạn chế.',
      'Cần chú ý hơn trong các giờ học lý thuyết.'
    ]
  },
  'Lịch sử và Địa lý': {
    'Tốt': [
      'Nắm vững các sự kiện lịch sử, đặc điểm địa lý.',
      'Biết sử dụng bản đồ, lược đồ một cách thành thạo.',
      'Có niềm tự hào về truyền thống lịch sử dân tộc.'
    ],
    'Đạt': [
      'Ghi nhớ được các mốc thời gian và địa danh cơ bản.',
      'Biết cách đọc bản đồ và xác định các vị trí địa lý.',
      'Hoàn thành các bài tập tìm hiểu về lịch sử, địa lý.'
    ],
    'Chưa hoàn thành': [
      'Chưa nhớ được các sự kiện lịch sử quan trọng.',
      'Kỹ năng sử dụng bản đồ còn lúng túng.',
      'Cần rèn luyện thêm khả năng ghi nhớ kiến thức.'
    ]
  },
  'Tin học': {
    'Tốt': [
      'Sử dụng máy tính thành thạo, thao tác nhanh nhẹn.',
      'Nắm vững các phần mềm học tập, có tư duy lập trình tốt.',
      'Biết cách tìm kiếm thông tin trên internet an toàn.'
    ],
    'Đạt': [
      'Thực hiện được các thao tác cơ bản trên máy tính.',
      'Biết sử dụng các phần mềm vẽ, soạn thảo đơn giản.',
      'Có ý thức bảo quản đồ dùng trong phòng máy.'
    ],
    'Chưa hoàn thành': [
      'Thao tác chuột và bàn phím còn chậm, lúng túng.',
      'Chưa nắm vững các bước sử dụng phần mềm.',
      'Cần tập trung hơn khi nghe giáo viên hướng dẫn.'
    ]
  },
  'Công nghệ': {
    'Tốt': [
      'Khéo léo trong thực hành, sản phẩm có tính thẩm mĩ.',
      'Nắm vững quy trình làm các sản phẩm thủ công.',
      'Có ý tưởng sáng tạo trong việc tái chế vật liệu.'
    ],
    'Đạt': [
      'Sản phẩm hoàn thành đúng thời gian, đúng yêu cầu.',
      'Biết cách sử dụng các dụng cụ học tập an toàn.',
      'Nắm được các bước cơ bản để tạo ra sản phẩm.'
    ],
    'Chưa hoàn thành': [
      'Kỹ năng thực hành còn yếu, sản phẩm chưa hoàn thiện.',
      'Chưa nắm vững quy trình làm sản phẩm.',
      'Cần rèn luyện thêm tính kiên trì và cẩn thận.'
    ]
  },
  'Giáo dục Thể chất': {
    'Tốt': [
      'Thực hiện các động tác đúng, đẹp và đều.',
      'Tích cực tham gia các trò chơi vận động, nhanh nhẹn.',
      'Có tinh thần đồng đội tốt, hăng hái luyện tập.'
    ],
    'Đạt': [
      'Thực hiện được các bài tập thể dục cơ bản.',
      'Nắm được luật chơi của các trò chơi vận động.',
      'Có ý thức rèn luyện thân thể hàng ngày.'
    ],
    'Chưa hoàn thành': [
      'Động tác thực hiện chưa đúng, còn nhút nhát.',
      'Thể lực còn hạn chế, cần tích cực luyện tập thêm.',
      'Cần chú ý lắng nghe khẩu lệnh của giáo viên.'
    ]
  },
  'Âm nhạc': {
    'Tốt': [
      'Hát đúng giai điệu, biểu diễn tự tin và sáng tạo.',
      'Cảm thụ âm nhạc tốt, biết kết hợp vận động minh họa.',
      'Sử dụng thành thạo các nhạc cụ gõ đệm.'
    ],
    'Đạt': [
      'Thuộc lời ca, hát đúng cao độ và trường độ.',
      'Biết gõ đệm theo nhịp và phách của bài hát.',
      'Tích cực tham gia các hoạt động âm nhạc trong lớp.'
    ],
    'Chưa hoàn thành': [
      'Hát chưa đúng giai điệu, còn nhút nhát khi biểu diễn.',
      'Chưa biết cách gõ đệm theo nhạc, cần luyện tập thêm.',
      'Cần tập trung hơn khi học các nốt nhạc cơ bản.'
    ]
  },
  'Mĩ thuật': {
    'Tốt': [
      'Tạo sản phẩm thẩm mĩ đẹp, có ý tưởng độc đáo.',
      'Phối hợp màu sắc hài hòa, nét vẽ tự tin, sinh động.',
      'Biết cách sử dụng đa dạng các vật liệu tạo hình.'
    ],
    'Đạt': [
      'Sản phẩm hoàn thành đúng yêu cầu, màu sắc rõ ràng.',
      'Biết cách bố cục hình vẽ cân đối trên trang giấy.',
      'Có ý thức chuẩn bị đầy đủ đồ dùng học tập.'
    ],
    'Chưa hoàn thành': [
      'Nét vẽ còn yếu, chưa biết cách phối hợp màu sắc.',
      'Sản phẩm hoàn thành chậm, chưa đúng yêu cầu.',
      'Cần rèn luyện thêm kỹ năng quan sát và tạo hình.'
    ]
  },
  'Hoạt động trải nghiệm': {
    'Tốt': [
      'Tích cực, sáng tạo trong các hoạt động tập thể.',
      'Có kỹ năng làm việc nhóm tốt, biết lắng nghe bạn.',
      'Tự tin trình bày ý kiến và cảm xúc của bản thân.'
    ],
    'Đạt': [
      'Tham gia đầy đủ các hoạt động của lớp, trường.',
      'Thực hiện tốt các nhiệm vụ được phân công.',
      'Biết cách hợp tác với bạn bè trong các hoạt động.'
    ],
    'Chưa hoàn thành': [
      'Còn nhút nhát, chưa tích cực tham gia hoạt động.',
      'Kỹ năng làm việc nhóm còn hạn chế.',
      'Cần chủ động hơn trong việc thực hiện nhiệm vụ.'
    ]
  }
};
