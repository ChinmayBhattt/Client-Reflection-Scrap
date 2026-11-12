import type { Metadata } from "next";
import { getAllBlogPostsAdmin } from "@/lib/services/blog";
import { BlogManager } from "./blog-manager";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog & Market Trends Manager | Admin",
};

export default async function AdminBlogPage() {
  const posts = await getAllBlogPostsAdmin();
  return <BlogManager posts={posts} />;
}

