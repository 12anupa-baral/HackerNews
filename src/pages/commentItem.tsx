// CommentItem.tsx
import React, { useState, useEffect } from "react";
import { Button, Card, CardContent, Typography } from "@mui/material";

interface Comment {
  id: number;
  text: string;
  kids?: number[];
}

interface CommentItemProps {
  comment?: Comment;
  comments: Comment[];
}

const decodeHtmlEntities = (text: string) => {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/<\/?p>/g, "")
    .replace(/&#x2F;/g, "/");
};

const CommentItem: React.FC<CommentItemProps> = ({ comment, comments }) => {
  const [showKids, setShowKids] = useState<boolean>(false);
  const [childComments, setChildComments] = useState<Comment[]>([]);

  useEffect(() => {
    // Decode HTML entities for the comment text
    comment &&
      comment.text &&
      (comment.text = decodeHtmlEntities(comment.text));

    // Decode HTML entities for child comments
    const decodedChildComments = comments.map((childComment) => {
      childComment.text = decodeHtmlEntities(childComment.text);
      return childComment;
    });

    setChildComments(decodedChildComments);
  }, [comment, comments]);

  const toggleShowKids = async () => {
    setShowKids((prevShowKids) => !prevShowKids);

    if (!showKids) {
      // Fetch child comments when 'View Comments' is clicked
      const childCommentsData: Comment[] = await Promise.all(
        comment?.kids?.map(async (kidId: number) => {
          try {
            const kidResponse = await fetch(
              `https://hacker-news.firebaseio.com/v0/item/${kidId}.json`
            );
            const kidData: Comment = await kidResponse.json();

            // Decode HTML entities for child comment text
            kidData.text = decodeHtmlEntities(kidData.text);

            return kidData;
          } catch (error) {
            console.error("Error fetching child comment:", error);
            return { id: kidId, text: "Error fetching comment" };
          }
        }) || []
      );

      setChildComments(childCommentsData);
    }
  };

  if (!comment) {
    return null; // or display a message for missing comment
  }

  return (
    <Card variant="outlined" style={{ margin: "10px", padding: "10px" }}>
      <CardContent>
        <Typography variant="body1">{comment.text}</Typography>
        {comment.kids && comment.kids.length > 0 && (
          <Button
            variant="outlined"
            onClick={toggleShowKids}
            style={{ marginTop: "10px" }}
          >
            {showKids ? "Hide Comments" : "View Comments"}
          </Button>
        )}
        {showKids &&
          childComments.map((kidComment) => (
            <div
              key={kidComment.id}
              style={{ marginLeft: "20px", marginTop: "10px" }}
            >
              <CommentItem comment={kidComment} comments={childComments} />
            </div>
          ))}
      </CardContent>
    </Card>
  );
};

export default CommentItem;
