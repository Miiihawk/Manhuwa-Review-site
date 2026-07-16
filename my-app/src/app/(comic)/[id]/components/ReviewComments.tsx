"use client";

import { useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import { User, Pencil, Trash2, CornerDownRight, Send } from "lucide-react";
import ReportButton from "./ReportButton";

type CommentUser = { id: number; username: string; profilePic: string | null };

type CommentNode = {
  id: number;
  content: string;
  userId: number;
  createdAt: string;
  user: CommentUser;
  replies?: CommentNode[];
};

export default function ReviewComments({
  reviewId,
  currentUserId,
}: {
  reviewId: number;
  currentUserId: number | null;
}) {
  const [comments, setComments] = useState<CommentNode[]>([]);
  const [open, setOpen] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/comments?reviewId=${reviewId}`);
      if (!res.ok) return;
      setComments(await res.json());
    } catch (error) {
      console.error("Failed to load comments:", error);
    }
  }, [reviewId]);

  useEffect(() => {
    if (open) load();
  }, [open, load]);

  const commentCount = comments.reduce(
    (n, c) => n + 1 + (c.replies?.length ?? 0),
    0,
  );

  async function postComment(content: string, parentId?: number) {
    setBusy(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, reviewId, parentId }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Could not post comment. Are you logged in?");
        return false;
      }
      await load();
      return true;
    } catch (error) {
      console.error("Post comment failed:", error);
      alert("Could not post comment — check your connection.");
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function editComment(id: number, content: string) {
    try {
      const res = await fetch(`/api/comments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Could not edit comment.");
        return false;
      }
      await load();
      return true;
    } catch (error) {
      console.error("Edit comment failed:", error);
      alert("Could not edit comment — check your connection.");
      return false;
    }
  }

  async function deleteComment(id: number) {
    if (!confirm("Delete this comment?")) return;
    try {
      const res = await fetch(`/api/comments/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Could not delete comment.");
        return;
      }
      await load();
    } catch (error) {
      console.error("Delete comment failed:", error);
      alert("Could not delete comment — check your connection.");
    }
  }

  async function handleAdd() {
    if (!newComment.trim()) return;
    const ok = await postComment(newComment.trim());
    if (ok) setNewComment("");
  }

  return (
    <div className="mt-1 border-t border-white/5 pt-3">
      <button
        onClick={() => setOpen((v) => !v)}
        className="text-[11px] font-bold text-white/40 hover:text-pink-400 transition-colors"
      >
        {open ? "Hide" : "Show"} comments
        {commentCount > 0 ? ` (${commentCount})` : ""}
      </button>

      {open && (
        <div className="mt-3 space-y-3">
          {comments.map((c) => (
            <CommentItem
              key={c.id}
              comment={c}
              currentUserId={currentUserId}
              onReply={postComment}
              onEdit={editComment}
              onDelete={deleteComment}
              busy={busy}
            />
          ))}

          {currentUserId !== null ? (
            <div className="flex items-center gap-2">
              <input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAdd();
                }}
                placeholder="Add a comment…"
                className="flex-1 h-9 rounded-lg bg-black/40 border border-white/10 px-3 text-xs text-white/90 outline-none focus:border-[#ff018f]/50"
              />
              <button
                onClick={handleAdd}
                disabled={busy || !newComment.trim()}
                className="h-9 px-3 rounded-lg bg-[#ff018f] hover:bg-[#ff018f]/90 text-white text-xs font-bold flex items-center gap-1 disabled:opacity-40 transition"
              >
                <Send className="h-3 w-3" /> Post
              </button>
            </div>
          ) : (
            <p className="text-[11px] text-white/30">
              Log in to join the discussion.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function CommentItem({
  comment,
  currentUserId,
  onReply,
  onEdit,
  onDelete,
  busy,
}: {
  comment: CommentNode;
  currentUserId: number | null;
  onReply: (content: string, parentId?: number) => Promise<boolean>;
  onEdit: (id: number, content: string) => Promise<boolean>;
  onDelete: (id: number) => void;
  busy: boolean;
}) {
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState("");

  async function submitReply() {
    if (!replyText.trim()) return;
    const ok = await onReply(replyText.trim(), comment.id);
    if (ok) {
      setReplyText("");
      setReplying(false);
    }
  }

  return (
    <div className="rounded-lg bg-white/[0.02] border border-white/5 p-3">
      <CommentBody
        comment={comment}
        currentUserId={currentUserId}
        onEdit={onEdit}
        onDelete={onDelete}
        footer={
          currentUserId !== null ? (
            <button
              onClick={() => setReplying((v) => !v)}
              className="mt-1.5 ml-8 inline-flex items-center gap-1 text-[10px] font-bold text-white/40 hover:text-pink-400 transition-colors"
            >
              <CornerDownRight className="h-3 w-3" /> Reply
            </button>
          ) : null
        }
      />

      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-2 ml-5 space-y-2 border-l border-white/10 pl-3">
          {comment.replies.map((r) => (
            <CommentBody
              key={r.id}
              comment={r}
              currentUserId={currentUserId}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}

      {replying && (
        <div className="mt-2 ml-8 flex items-center gap-2">
          <input
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submitReply();
            }}
            placeholder="Write a reply…"
            className="flex-1 h-8 rounded-lg bg-black/40 border border-white/10 px-3 text-xs text-white/90 outline-none focus:border-[#ff018f]/50"
          />
          <button
            onClick={submitReply}
            disabled={busy || !replyText.trim()}
            className="h-8 px-3 rounded-lg bg-[#ff018f] text-white text-[11px] font-bold disabled:opacity-40"
          >
            Reply
          </button>
        </div>
      )}
    </div>
  );
}

function CommentBody({
  comment,
  currentUserId,
  onEdit,
  onDelete,
  footer,
}: {
  comment: CommentNode;
  currentUserId: number | null;
  onEdit: (id: number, content: string) => Promise<boolean>;
  onDelete: (id: number) => void;
  footer?: ReactNode;
}) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(comment.content);
  const mine = currentUserId !== null && comment.userId === currentUserId;

  async function save() {
    if (!text.trim()) return;
    const ok = await onEdit(comment.id, text.trim());
    if (ok) setEditing(false);
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="h-6 w-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
            {comment.user.profilePic ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={comment.user.profilePic}
                alt={comment.user.username}
                className="h-full w-full object-cover"
              />
            ) : (
              <User className="h-3 w-3 text-white/60" />
            )}
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-black text-white/90">
              {comment.user.username}
            </span>
            <span className="ml-2 text-[10px] text-white/30">
              {new Date(comment.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {mine && !editing && (
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => {
                setText(comment.content);
                setEditing(true);
              }}
              title="Edit"
              className="p-1 rounded bg-white/5 text-white/50 hover:text-white hover:bg-white/10 transition"
            >
              <Pencil className="h-3 w-3" />
            </button>
            <button
              onClick={() => onDelete(comment.id)}
              title="Delete"
              className="p-1 rounded bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        )}

        {!mine && currentUserId !== null && !editing && (
          <div className="shrink-0">
            <ReportButton target={{ commentId: comment.id }} />
          </div>
        )}
      </div>

      {editing ? (
        <div className="mt-2 flex items-center gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") save();
            }}
            className="flex-1 h-8 rounded-lg bg-black/40 border border-white/10 px-3 text-xs text-white/90 outline-none focus:border-[#ff018f]/50"
          />
          <button
            onClick={save}
            className="h-8 px-3 rounded-lg bg-[#ff018f] text-white text-[11px] font-bold"
          >
            Save
          </button>
          <button
            onClick={() => setEditing(false)}
            className="h-8 px-3 rounded-lg bg-white/5 text-white/60 text-[11px] font-bold"
          >
            Cancel
          </button>
        </div>
      ) : (
        <p className="mt-1.5 text-xs text-white/70 leading-relaxed whitespace-pre-wrap pl-8">
          {comment.content}
        </p>
      )}

      {footer}
    </div>
  );
}
