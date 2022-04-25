import React from "react";
import { Link, useNavigate } from "react-router-dom";

export const NotFoundPage = () => {
  return (
    <>
      <h1 className="title">404</h1>
      <Link to={`/`}>Go back to main page</Link>
    </>
  );
};
