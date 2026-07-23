import { getManagedBlogPosts } from "../lib/content-overrides.server";

function escapeXml(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&apos;");
}

export async function GET() {
  const blogPosts = await getManagedBlogPosts();
  const items = blogPosts.map((post) => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>https://vinprint.vn/blog/${post.slug}</link>
      <guid isPermaLink="true">https://vinprint.vn/blog/${post.slug}</guid>
      <description>${escapeXml(post.description)}</description>
      <pubDate>${new Date(`${post.publishedAt}T00:00:00+07:00`).toUTCString()}</pubDate>
    </item>`).join("");
  const xml = `<?xml version="1.0" encoding="UTF-8" ?><rss version="2.0"><channel><title>Cẩm nang tem nhãn VinPrint</title><link>https://vinprint.vn/blog</link><description>Kiến thức thực tế về tem nhãn, vật liệu và kỹ thuật in.</description>${items}</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8", "Cache-Control": "no-store" } });
}

