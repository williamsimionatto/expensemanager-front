import { Route, Routes } from 'react-router-dom'
import makeCategoriesListPage from '../main/factories/pages/categories-list-factory';

const Router: React.FC = () => {
  return (
      <Routes>
        <Route path='/categories' element={makeCategoriesListPage()}
        />
      </Routes>
  );
}
export default Router;