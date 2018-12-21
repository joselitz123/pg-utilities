import React from 'react';

import Home from './components/Home/home';
import About from './components/About/index';
import Extractor from './components/Extractor/index';

const routes = [
  {
    path: "/",
    exact: true,
    component: ()=><Home />,
  },
  {
    path: "/about",
    component: ()=><About />,
  },
  {
    path: "/extractor",
    exact: true,
    component: ()=><Extractor />,
  },
 
]

module.exports = routes;