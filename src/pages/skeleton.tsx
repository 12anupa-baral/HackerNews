import React from "react";
import { Skeleton } from "@mui/material";

interface SkeletonLoaderProps {
  count: number;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ count }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton
          key={index}
          height={50}
          animation="wave"
          style={{ marginBottom: 10 }}
        />
      ))}
    </>
  );
};

export default SkeletonLoader;
