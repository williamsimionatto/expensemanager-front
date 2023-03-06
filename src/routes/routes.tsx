import { Routes, Route } from 'react-router-dom';
import CategoryList from '../ui/pages/categories';


const Main = () => {
  return (         
      <Routes>
      <Route path='/categories' element={<CategoryList/>} />
    </Routes>
  );
}
export default Main;