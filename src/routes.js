import  React from 'react';
import HomeContainer from './pages/HomePage/HomeContainer';
import DetailContainer from './pages/DetailPage/DetailContainer';
import ErrorPage from './error';

const routes = [
  {
    path: "/",
    Component() {
      return (<HomeContainer />)
    },
    errorElement: <ErrorPage />
  },
  {
    path: "/comments/:commentId/:commentTag",
    element: <DetailContainer />
  },
  {
    path: "*",
    element: <div>Page Not Available</div>
  },
];

export default routes;
