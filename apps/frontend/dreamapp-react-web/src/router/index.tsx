import { Navigate, useRoutes } from 'react-router-dom';
import HomeView from '@/pages/Home';
import Journal from '@/pages/Journal';
// import FileSys from '@/pages/FileSys';
// import Film from '@/pages/Film';
// import ThreeJs from '@/pages/ThreeJs';
import Login from '@/pages/Home/login.tsx';
import ErrorPage from '@/pages/ErrorPage';
// import Draft from '@/pages/ThreeJs/components/draft';
// import BuildGltf from '@/pages/ThreeJs/components/build_gltf.tsx';
import { lazy } from 'react';
const FileSys = lazy(() => import('@/pages/FileSys'));
const Film = lazy(() => import('@/pages/Film'));
const ThreeJs = lazy(() => import('@/pages/ThreeJs'));
const Draft = lazy(() => import('@/pages/ThreeJs/components/draft'));
const BuildGltf = lazy(
  () => import('@/pages/ThreeJs/components/build_gltf.tsx'),
);

const routes = [
  {
    path: '/',
    element: <HomeView />,
    children: [
      { index: true, element: <Navigate to="/journal" replace /> },
      { path: 'journal', element: <Journal /> },
      { path: 'file_sys', element: <FileSys /> },
      { path: 'film', element: <Film /> },
      { path: 'three_js', element: <ThreeJs /> },
      { path: 'three_js_draft', element: <Draft /> },
      { path: 'three_js_build_gltf', element: <BuildGltf /> },
    ],
  },
  { path: 'login', element: <Login /> },
  { path: '*', element: <ErrorPage /> },
];
export default function RouterView() {
  return useRoutes(routes);
}
