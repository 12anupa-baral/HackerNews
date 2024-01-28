// Story.tsx
import React, { useState, useEffect } from "react";
import { Card, CardContent, Button } from "@mui/material";
import SkeletonLoader from "./skeleton";
import { Link } from "react-router-dom";
import "../pages/styles/story.css";
import DarkModeToggle from "./theme";

interface StoryProps {}

interface Story {
  id: number;
  title: string;
  url: string;
  author: string; // Add the author property
  descendants: number;
}

const Story: React.FC<StoryProps> = () => {
  const [topStories, setTopStories] = useState<Story[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const storiesPerPage: number = 10;
  const [selectedStoryId, setSelectedStoryId] = useState<number | null>(null);

  useEffect(() => {
    const fetchTopStories = async () => {
      try {
        const response = await fetch(
          "https://hacker-news.firebaseio.com/v0/topstories.json"
        );
        const topStoriesIds: number[] = await response.json();

        const startIndex: number = (currentPage - 1) * storiesPerPage;
        const endIndex: number = startIndex + storiesPerPage;

        const topStoriesData: Story[] = await Promise.all(
          topStoriesIds.slice(startIndex, endIndex).map(async (storyId) => {
            const storyResponse = await fetch(
              `https://hacker-news.firebaseio.com/v0/item/${storyId}.json`
            );
            const storyData: Story = await storyResponse.json();
            // Fetch the author information separately
            const authorResponse = await fetch(
              `https://hacker-news.firebaseio.com/v0/user/${storyData.by}.json`
            );
            const authorData = await authorResponse.json();
            storyData.author = authorData.id; // Assuming 'id' is the author's username
            return storyData;
          })
        );

        setTopStories(topStoriesData);
      } catch (error) {
        console.error("Error fetching top stories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopStories();
  }, [currentPage]);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleCommentsClick = (storyId: number) => {
    setSelectedStoryId(storyId);
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Hacker News Top Stories</h1>
        <DarkModeToggle />
      </div>

      <div className="paginationContainer" style={{ marginTop: "20px" }}>
        <Button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          variant="contained"
        >
          Previous Page
        </Button>
        <span style={{ margin: "0 10px" }}>Page {currentPage}</span>
        <Button onClick={handleNextPage} variant="contained">
          Next Page
        </Button>
      </div>
      {loading ? (
        <SkeletonLoader count={storiesPerPage} />
      ) : (
        <>
          {topStories.map((story) => (
            <Card className="card" key={story.id} style={{ margin: "10px" }}>
              <CardContent>
                <h5 className="title">{story.title}</h5>
                <p>
                  by {story.author}|{story.descendants} comments
                </p>
                <div className="buttonContainer">
                  <Button
                    className="btn"
                    variant="contained"
                    color="primary"
                    href={story.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Read More
                  </Button>
                  <Link to={`/comments/${story.id}`}>
                    <Button
                      className="btn"
                      variant="outlined"
                      onClick={() => handleCommentsClick(story.id)}
                    >
                      Comments
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </>
      )}
    </div>
  );
};

export default Story;
