import { Route, Routes } from 'react-router-dom'
import makeAddCategoryPage from '../main/factories/pages/add-category-factory';
import makeCategoriesListPage from '../main/factories/pages/categories-list-factory';
import makeEditCategoryPage from '../main/factories/pages/edit-category-factory';
import makePeriodsListPage from '../main/factories/pages/periods-list-factory';
import AddPeriodForm from '../presentation/pages/add-period/add-period';

const Router: React.FC = () => {
  return (
    <Routes>
      <Route path='/categories' element={makeCategoriesListPage()}/>
      <Route path='/categories/add' element={makeAddCategoryPage()} />
      <Route 
        path='/categories/:categoryId' 
        element={makeEditCategoryPage()}
      />

      <Route path="/periods" element={makePeriodsListPage()}></Route>
      <Route path='/periods/add' element={<AddPeriodForm />}></Route>
    </Routes>
  );
}
export default Router;