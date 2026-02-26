import { useAuth } from './contexts/AuthContext';
import { Layout } from './components/layout/Layout';
import { Login } from './components/Login';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Načítavam...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return <Layout />;
}

export default App;
