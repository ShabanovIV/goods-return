import s from './App.module.scss';
import { AppRouter } from './router/AppRouter';

const App = () => {
  return (
    <div className={s.root} data-testid="app-root">
      <AppRouter />
    </div>
  );
};

export default App;
