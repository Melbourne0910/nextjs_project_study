"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Pencil, Trash2, X } from "lucide-react";

import { inputClasses } from "@/lib/styles";

function toUtcDate(createdAt) {
  return new Date(`${createdAt.replace(" ", "T")}Z`);
}

export default function MessageItem({ message, session, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(message.text);
  const isAuthor = session?.user?.id === message.user_id;
  const createdAt = toUtcDate(message.created_at);

  return (
    <li className="relative rounded border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
      <div
        className={`flex flex-wrap items-center justify-between gap-2 ${
          isAuthor && !isEditing ? "pr-20" : ""
        }`}
      >
        <strong>{message.username || "Anonymous"}</strong>
        <time
          dateTime={createdAt.toISOString()}
          className="text-xs text-gray-500 dark:text-gray-400"
        >
          {formatDistanceToNow(createdAt, { addSuffix: true })}
          {message.edited_at ? " · edited" : ""}
        </time>
      </div>

      {isEditing ? (
        <div className="mt-3 flex items-center gap-2">
          <input
            type="text"
            value={editText}
            onChange={(event) => setEditText(event.target.value)}
            className={inputClasses}
            aria-label="Edit message"
          />
          <button
            type="button"
            onClick={() => {
              setEditText(message.text);
              setIsEditing(false);
            }}
            title="Cancel editing"
            aria-label="Cancel editing"
            className="inline-flex size-10 shrink-0 items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X aria-hidden="true" size={18} />
          </button>
        </div>
      ) : (
        <p className="mt-2 break-words">{message.text}</p>
      )}

      {isAuthor && !isEditing && (
        <div className="absolute right-2 top-2 flex gap-1">
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            title="Edit message"
            aria-label="Edit message"
            className="inline-flex size-8 items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Pencil aria-hidden="true" size={16} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(message.id)}
            title="Delete message"
            aria-label="Delete message"
            className="inline-flex size-8 items-center justify-center rounded text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
          >
            <Trash2 aria-hidden="true" size={16} />
          </button>
        </div>
      )}
    </li>
  );
}
