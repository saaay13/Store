import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BookOpen, LogIn, AlertCircle } from 'lucide-react';
import { Button, Card, ThemeToggle } from '../components/atoms';
import { FormField } from '../components/molecules';
import { useAuth } from '../features/auth';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    nombre_usuario: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const success = await login(formData);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Credenciales incorrectas');
      }
    } catch (err) {
      setError('Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 relative">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4">
        <ThemeToggle size="md" />
      </div>

      <Card className="w-full max-w-md p-8 bg-card border border-border shadow-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center space-x-2 mb-4 hover:opacity-80 transition-opacity">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <BookOpen size={24} className="text-primary-foreground" />
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-2">Bienvenido</h1>
          <p className="text-muted-foreground">Inicia sesión en tu cuenta</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <FormField
            label="Nombre de Usuario"
            name="nombre_usuario"
            fieldType="input"
            inputType="text"
            required
            placeholder="Ingresa tu nombre de usuario"
            value={formData.nombre_usuario}
            onChange={handleChange}
          />

          <FormField
            label="Contraseña"
            name="password"
            fieldType="input"
            inputType="password"
            required
            placeholder="Ingresa tu contraseña"
            value={formData.password}
            onChange={handleChange}
          />

          {error && (
            <div className="bg-error/10 border border-error rounded-md p-3 flex items-start space-x-2">
              <AlertCircle size={18} className="text-error mt-0.5 flex-shrink-0" />
              <p className="text-sm text-error">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={loading}
          >
            <LogIn size={18} className="mr-2" />
            {loading ? 'Iniciando...' : 'Iniciar Sesión'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            ¿No tienes cuenta?{' '}
            <button
              className="text-primary hover:underline font-medium"
              onClick={() => navigate('/register')}
            >
              Regístrate aquí
            </button>
          </p>
        </div>

        {/* Demo hint */}
        <div className="mt-6 pt-6 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            Modo demo: Usa cualquier usuario y contraseña
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Login;
