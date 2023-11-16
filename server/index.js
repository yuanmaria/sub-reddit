import path from 'path';
import fs from 'fs';

import React from 'react';
import { renderToString } from 'react-dom/server';
import express from "express";
import { StaticRouter, createStaticHandler, createStaticRouter } from "react-router-dom/server";
import App from "../src/App";
import routes from '../src/routes';
import createFetchRequest from './request';
import { Provider } from 'react-redux';
import store from '../src/store';

const PORT = process.env.PORT || 3000;

let app = express();
let handler = createStaticHandler(routes);

app.get("/", async (req, res) => {
  let fetchRequest = createFetchRequest(req);
  let context = await handler.query(fetchRequest);
  if (
    context instanceof Response &&
    [301, 302, 303, 307, 308].includes(context.status)
  ) {
    return res.redirect(
      context.status,
      context.headers.get("Location")
    );
  }

  let router = createStaticRouter(
    handler.dataRoutes,
    context
  );
  let html = renderToString(
    <StaticRouter
      location={req.url}
      router={router}
      context={context}>
      <Provider store={store}>
        <App />
      </Provider>
    </StaticRouter>
  );
  const indexFile = path.resolve('./build/index.html');
  fs.readFile(indexFile, 'utf8', (err, data) => {
    if (err) {
      console.error('Something went wrong:', err);
      return res.status(500).send('Oops, better luck next time!');
    }

    return res.send(
      data.replace('<div id="root"></div>', `<div id="root">${html}</div>`)
    );
  });
});

app.use(express.static(path.resolve(__dirname, "..", "build"), { index: false }));

app.get("*", async (req, res) => {
  let fetchRequest = createFetchRequest(req);
  let context = await handler.query(fetchRequest);
  if (
    context instanceof Response &&
    [301, 302, 303, 307, 308].includes(context.status)
  ) {
    return res.redirect(
      context.status,
      context.headers.get("Location")
    );
  }

  let html = renderToString(
    <StaticRouter
      location={req.url}>
      <Provider store={store}>
        <App />
      </Provider>
    </StaticRouter>
  );
  const indexFile = path.resolve('./build/index.html');
  fs.readFile(indexFile, 'utf8', (err, data) => {
    if (err) {
      console.error('Something went wrong:', err);
      return res.status(500).send('Oops, better luck next time!');
    }

    return res.send(
      data.replace('<div id="root"></div>', `<div id="root">${html}</div>`)
    );
  });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
