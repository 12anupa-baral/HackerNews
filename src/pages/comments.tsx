import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, Typography } from "@mui/material";
import CommentItem from "./commentItem";
import "../pages/styles/comments.css";

interface Comment {
  id: number;
  text: string;
  kids?: number[];
}

interface StoryDetails {
  title: string;
  by: string;
  descendants: number;
}

function decodeHtmlEntities(text: string | undefined): string {
  return text
    ? text.replace(/&#(\d+);/g, (_match, dec) => String.fromCharCode(dec))
    : "";
}

const Comments: React.FC = () => {
  const { storyId } = useParams<{ storyId: string }>();
  const id = Number(storyId);

  const [storyDetails, setStoryDetails] = useState<StoryDetails | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchStoryDetails = async () => {
      try {
        const response = await fetch(
          `https://hacker-news.firebaseio.com/v0/item/${id}.json`
        );
        const story = await response.json();

        // Decode HTML entities for the story title
        const decodedTitle = decodeHtmlEntities(story.title);

        setStoryDetails({ ...story, title: decodedTitle });
      } catch (error) {
        console.error("Error fetching story details:", error);
      }
    };

    const fetchComments = async () => {
      try {
        if (isNaN(id)) {
          console.error("Invalid story ID:", storyId);
          return;
        }

        const response = await fetch(
          `https://hacker-news.firebaseio.com/v0/item/${id}.json`
        );
        const story = await response.json();

        console.log("API Response for Story ID:", id, story);

        if (story !== null && story.kids) {
          const commentsData: Comment[] = await Promise.all(
            story.kids.map(async (commentId: number) => {
              try {
                const commentResponse = await fetch(
                  `https://hacker-news.firebaseio.com/v0/item/${commentId}.json`
                );
                const commentData: Comment = await commentResponse.json();

                // Decode HTML entities for comment text
                commentData.text = decodeHtmlEntities(commentData.text);

                return commentData;
              } catch (error) {
                console.error("Error fetching child comment:", error);
                return { id: commentId, text: "Error fetching comment" };
              }
            })
          );

          setComments(commentsData);
        } else {
          console.log("No kids found in the story response:", story);
          setComments([]);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStoryDetails();
    fetchComments();
  }, [id, storyId]);

  return (
    <div>
      {storyDetails && (
        <Card variant="outlined" style={{ margin: "10px", padding: "10px" }}>
          <CardContent>
            <Typography variant="h5">{storyDetails.title}</Typography>
            <Typography variant="subtitle1">
              by {storyDetails.by} | {storyDetails.descendants} comments
            </Typography>
          </CardContent>
        </Card>
      )}
      {loading ? (
        <p>Loading comments...</p>
      ) : comments.length === 0 ? (
        <p>No comments available for this story.</p>
      ) : (
        <ul>
          {comments.map((comment) => (
            <li key={comment.id}>
              <CommentItem comment={comment} comments={comments} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Comments;
