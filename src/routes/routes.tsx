import { Route, Routes } from 'react-router-dom'
import makeCategoriesListPage from '../main/factories/pages/categories-list-factory';
import AddCategoryForm from '../presentation/pages/add-category/add-category';

const Router: React.FC = () => {
  return (
      <Routes>
        <Route path='/categories' element={makeCategoriesListPage()}/>
        <Route path='/categories/add' element={<AddCategoryForm />} />
      </Routes>
  );
}
export default Router;