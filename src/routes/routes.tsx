import { Route, Routes } from 'react-router-dom'
import { makeRemoteLoadCategories } from '../main/factories/usecases';
import CategoryList from '../presentation/pages/categories/categories-list';

const Router: React.FC = () => {
  return (
      <Routes>
        <Route path='/categories' element={
            <CategoryList
              loadCategories={makeRemoteLoadCategories()}
            />
          }
        />
      </Routes>
  );
}
export default Router;