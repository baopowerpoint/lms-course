"use client";

export const Features = () => {
  const features = [
    {
      icon: "🔢",
      title: "Toán học tương tác",
      description: "Bài tập tương tác giúp học sinh hiểu sâu hơn về các khái niệm toán học."
    },
    {
      icon: "🎮",
      title: "Học như chơi game",
      description: "Phương pháp gamification giúp việc học trở nên thú vị và tạo động lực rèn luyện hàng ngày."
    },
    {
      icon: "📊",
      title: "Phân tích tiến độ",
      description: "Theo dõi tiến độ học tập với báo cáo chi tiết và biểu đồ trực quan."
    },
    {
      icon: "🏆",
      title: "Hệ thống thành tích",
      description: "Nhận huy hiệu và phần thưởng khi hoàn thành bài học và đạt được mục tiêu."
    },
    {
      icon: "👨‍👩‍👧‍👦",
      title: "Học cùng bạn bè",
      description: "Kết nối với bạn bè, tham gia bảng xếp hạng và học tập cùng nhau."
    },
    {
      icon: "🧠",
      title: "Cá nhân hoá",
      description: "Lộ trình học tập được cá nhân hoá dựa trên tiến độ và điểm mạnh, điểm yếu của bạn."
    }
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Tính năng nổi bật</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Havamath cung cấp các tính năng học tập tiên tiến giúp học sinh tiếp thu toán học một cách vui vẻ và hiệu quả
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:border-primary hover:shadow-xl transition-all"
            >
              <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">{feature.icon}</span>
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
