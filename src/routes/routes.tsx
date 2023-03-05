import { Routes, Route } from 'react-router-dom';
import CategoriesIndex from '../ui/pages/categories';


const Main = () => {
  return (         
      <Routes>
      <Route path='/categories' element={<CategoriesIndex/>} />
    </Routes>
  );
}
export default Main;