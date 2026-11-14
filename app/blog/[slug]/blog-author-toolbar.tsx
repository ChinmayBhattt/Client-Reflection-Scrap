"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Edit2, Trash2, Plus, Sparkles, ArrowLeft } from "lucide-react";
import type { BlogPost } from "@/lib/types/database";
import { Button } from "@/components/ui/button";
import { BlogEditorModal } from "@/components/blog/blog-editor-modal";
import { deleteBlogPost } from "@/app/admin/blog/actions";
import { createClient } from "@/lib/supabase/client";
import { isAuthorizedBlogAuthor } from "@/lib/auth-config";

interface BlogAuthorToolbarProps {
  post: BlogPost;
  userEmail?: string;
  initialCanEdit?: boolean;
}

export function BlogAuthorToolbar({
  post,
  userEmail,
  initialCanEdit = false,
}: BlogAuthorToolbarProps) {
  const router = useRouter();
  const [editorOpen, setEditorOpen] = React.useState(false);
  const [canEdit, setCanEdit] = React.useState<boolean>(initialCanEdit);
  const [activeEmail, setActiveEmail] = React.useState<string | undefined>(userEmail);

  React.useEffect(() => {
    if (initialCanEdit) {
      setCanEdit(true);
      return;
    }
    const supabase = createClient();
    if (!supabase) return;

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) {
        setActiveEmail(user.email);
        if (isAuthorizedBlogAuthor(user.email)) {
          setCanEdit(true);
        }
      }
    });
  }, [initialCanEdit]);

  if (!canEdit) return null;

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this article?")) return;

    try {
      const res = await deleteBlogPost(post.id);
      if (res.success) {
        toast.success("Blog post deleted successfully.");
        router.push("/blog");
      } else {
        toast.error(res.error || "Failed to delete post");
      }
    } catch {
      toast.error("Error deleting post");
    }
  };

  return (
    <>
      <div className="p-3 sm:p-4 rounded-2xl bg-brand-green-light/40 border border-brand-green/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-brand-green text-white flex items-center justify-center shrink-0">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          <div>
            <span className="text-xs font-bold text-brand-dark block">
              Author Controls Active
            </span>
            <span className="text-[11px] text-brand-muted block">
              Signed in as {activeEmail || userEmail || "Owner"} • You have editing rights for this post.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Button
            type="button"
            size="sm"
            onClick={() => setEditorOpen(true)}
            className="bg-brand-blue hover:bg-brand-blue/90 text-white font-bold text-xs h-8 px-3 gap-1.5 shadow-sm rounded-xl cursor-pointer"
          >
            <Edit2 className="h-3 w-3" />
            <span>Edit Article</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleDelete}
            className="text-xs h-8 px-2.5 rounded-xl border-red-200 text-red-600 hover:bg-red-50 cursor-pointer"
            title="Delete this article"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <BlogEditorModal
        isOpen={editorOpen}
        onClose={() => setEditorOpen(false)}
        post={post}
        onSaved={(newSlug) => {
          if (newSlug !== post.slug) {
            router.push(`/blog/${newSlug}`);
          } else {
            router.refresh();
          }
        }}
      />
    </>
  );
}
