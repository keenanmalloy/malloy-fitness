import React from "react";
import { useMuscleGroupQuery } from "./useMuscleGroupQuery";

export const MuscleGroups = () => {
  const { data, isError, isLoading } = useMuscleGroupQuery();

  if (isLoading) {
    return <p>loading...</p>;
  }

  if (isError) {
    return <p style={{ color: "red" }}>fetching error...</p>;
  }

  if (!data.muscleGroups) {
    return <p>none available...</p>;
  }

  return (
    <div>
      <h2>MuscleGroups</h2>
      <pre>{JSON.stringify(data, 2, 2)}</pre>
    </div>
  );
};
