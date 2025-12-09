import { Link, NavLink } from "react-router-dom";
import { User } from "../types/models";

interface Props {
  user: User;
  onLogout: () => void;
  children: React.ReactNode;
}

// Базовый layout приложения: шапка + контейнер для страниц.
export default function Layout({ user, onLogout, children }: Props) {
  return (
    <div className="app">
      <header className="app__header">
        <div className="app__brand">
          <Link to="/" className="brand__title">
            Worktime Platform
          </Link>
          <span className="brand__subtitle">учёт задач и времени</span>
        </div>
        <nav className="nav">
          <NavLink to="/" end>
            Дашборд
          </NavLink>
          <NavLink to="/time">Учёт времени</NavLink>
        </nav>
        <div className="user-box">
          <div className="user-box__name">{user.full_name}</div>
          <div className="user-box__role">{user.role}</div>
          <button className="ghost" onClick={onLogout}>
            Выйти
          </button>
        </div>
      </header>
      <main className="app__content">{children}</main>
    </div>
  );
}
