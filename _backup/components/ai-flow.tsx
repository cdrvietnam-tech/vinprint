"use client";

/**
 * AiFlow — sơ đồ quy trình thiết kế tem bằng AI + Designer.
 * Flow: Khách gửi → Tem hiện tại → AI phân tích → AI đề xuất → Mockup → Duyệt → In.
 * Thuần trình bày (không phụ thuộc thư viện ngoài), tự xuống hàng trên mobile.
 */

type Step = {
  n: string;
  title: string;
  desc: string;
  tone: "ink" | "violet" | "coral" | "lime";
};

const STEPS: Step[] = [
  { n: "01", title: "Khách gửi", desc: "Gửi tem hiện tại hoặc ý tưởng qua Zalo / website.", tone: "ink" },
  { n: "02", title: "Tem hiện tại", desc: "VinPrint tiếp nhận mẫu, logo và yêu cầu ngành hàng.", tone: "ink" },
  { n: "03", title: "AI phân tích", desc: "AI đọc bố cục, màu, phân cấp chữ và điểm cần cải thiện.", tone: "violet" },
  { n: "04", title: "AI đề xuất", desc: "Sinh nhiều phương án tem đẹp, chuyên nghiệp theo ngành.", tone: "violet" },
  { n: "05", title: "Mockup", desc: "Ghép tem lên sản phẩm thật để xem trước khi in.", tone: "coral" },
  { n: "06", title: "Duyệt", desc: "Designer tinh chỉnh, bạn duyệt mẫu cuối cùng.", tone: "coral" },
  { n: "07", title: "In", desc: "In máy hiện đại, kiểm tra chất lượng và giao toàn quốc.", tone: "lime" },
];

export default function AiFlow() {
  return (
    <div className="aiflow" role="list" aria-label="Quy trình thiết kế tem bằng AI">
      {STEPS.map((step, i) => (
        <div className="aiflow__item" role="listitem" key={step.n}>
          <div className={`aiflow__card aiflow__card--${step.tone}`}>
            <span className="aiflow__n">{step.n}</span>
            <b className="aiflow__title">{step.title}</b>
            <small className="aiflow__desc">{step.desc}</small>
          </div>
          {i < STEPS.length - 1 && (
            <span className="aiflow__arrow" aria-hidden="true">→</span>
          )}
        </div>
      ))}
    </div>
  );
}
