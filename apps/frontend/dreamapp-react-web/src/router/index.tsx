import { useRoutes } from 'react-router-dom';
import HomeView from '@/pages/Home';
import Journal from '@/pages/Journal';
import FileSys from '@/pages/FileSys';
import Film from '@/pages/Film';
import ThreeJs from '@/pages/ThreeJs';
const routes = [
  {
    path: '/',
    element: <HomeView />,
    children: [
      { path: 'journal', element: <Journal /> },
      { path: 'file_sys', element: <FileSys /> },
      { path: 'film', element: <Film /> },
      { path: 'three_js', element: <ThreeJs /> },
    ],
  },
];
export default function RouterView() {
  return useRoutes(routes);
}
