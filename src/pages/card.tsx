import React from "react";

interface CardProps {
  title: string;
  url: string;
}

const Card: React.FC<CardProps> = ({ title, url }) => {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "10px",
        margin: "10px",
        borderRadius: "5px",
      }}
    >
      <h3>{title}</h3>
      <p>
        <a href={url} target="_blank" rel="noopener noreferrer">
          Read More
        </a>
      </p>
    </div>
  );
};

export default Card;
