import { FormEvent, useState } from "react";
import { User } from "../types/models";

interface Props {
  onLogin: (user: User) => void;
}

// Страница псевдо-логина: имитируем вход без реальной авторизации backend.
// Это нужно для демонстрации потоков в приложении (guarded routes, отображение пользователя).
export default function LoginPage({ onLogin }: Props) {
  const [email, setEmail] = useState("demo.user@example.com");
  const [name, setName] = useState("Demo User");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onLogin({ id: 1, email, full_name: name, role: "employee" });
  };

  return (
    <div className="centered">
      <div className="card" style={{ maxWidth: 420 }}>
        <h2>Вход</h2>
        <p className="muted">Демо-авторизация: данные не проверяются на сервере.</p>
        <form onSubmit={handleSubmit} className="form-grid">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Электронная почта"
          />
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Полное имя"
          />
          <button type="submit">Продолжить</button>
        </form>
      </div>
    </div>
  );
}
