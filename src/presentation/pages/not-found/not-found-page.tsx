import duckNotFound404 from '../../../assets/img/duckNotFound404.svg';
import './style/not-found.css';

const NotFoundPage: React.FC = () => {
  return (
    <>
    <div className="not-found-container">
      <img src={duckNotFound404} alt="duckNotFound404" />
      <h1>Page Not Found</h1>
      <p>
        The page you are looking for was not found, or some other error <br />
        occurred. Please return to the <a href="/">home screen</a>,  or contact the administrator.
      </p>
    </div>
    </>
  );
};

export default NotFoundPage;
