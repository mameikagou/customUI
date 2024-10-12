import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/main.scss';
import { NextUIProvider } from '@nextui-org/react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Root from "./routes/root";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
  },
]);
createRoot(document.getElementById('root')!).render(
  <NextUIProvider>
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
  </NextUIProvider>
)
