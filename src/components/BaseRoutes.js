import React, { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import AppContext from "../context/AppContext";
import HomePage from "./HomePage";
import IndexPage from "./IndexPage";
import AboutPage from "./AboutPage";
import ProjectPageTemp from "./ProjectPageTemp";

export const BaseRoutes = () => {
  const { state } = useContext(AppContext);
  const { projectRoutes } = state;

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/projectindex" element={<IndexPage />} />
      <Route path="/info" element={<AboutPage />} />
      {projectRoutes &&
        projectRoutes.map((route) => (
          <Route
            key={route.routeName}
            path={`/project/${route.routeName}`}
            element={<ProjectPageTemp viewMode={"slide"} data={route.data} />}
          />
        ))}
    </Routes>
  );
};

export default BaseRoutes;
