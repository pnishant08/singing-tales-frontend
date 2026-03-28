import { useAuth } from "../../context/useAuth";

export default function ProfilePage() {
  const { user, logout } = useAuth();

  return (
    <div>
      <h2>{user?.name}</h2>
      <p>{user?.email}</p>

      <button onClick={logout}>Logout</button>
    </div>
  );
}