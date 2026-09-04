// ============================================================
// FRONTEND src/components/blog/CommentList.jsx
// ============================================================

import React from 'react';

const CommentList = ({ comments }) => {
  if (!comments || comments.length === 0) {
    return (
      <p className="text-text-secondary text-sm">No comments yet. Be the first to comment!</p>
    );
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment._id} className="p-4 bg-background-secondary rounded-lg border border-border">
          <div className="flex items-center justify-between">
            <span className="font-medium">{comment.name}</span>
            <span className="text-xs text-text-secondary">{formatDate(comment.createdAt)}</span>
          </div>
          <p className="mt-2 text-sm leading-relaxed">{comment.content}</p>
        </div>
      ))}
    </div>
  );
};

export default CommentList;