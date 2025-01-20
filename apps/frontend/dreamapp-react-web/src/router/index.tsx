import { useRoutes } from 'react-router-dom';
import HomeView from '../pages/Home';
const routes = [
  {
    path: '/',
    element: <HomeView />,
  },
];
export default function RouterView() {
  return useRoutes(routes);
}
