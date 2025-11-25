import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BookOpen, UserPlus, AlertCircle } from 'lucide-react';
import { Button, Card, Input, ThemeToggle } from '../components/atoms';
import { useAuth } from '../features/auth';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    nombre_usuario: '',
    nombre: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre_usuario.trim()) {
      newErrors.nombre_usuario = 'El nombre de usuario es obligatorio';
    }
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre completo es obligatorio';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }
    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const success = await register({
        nombre_usuario: formData.nombre_usuario,
        nombre: formData.nombre,
        email: formData.email,
        password: formData.password
      });

      if (success) {
        navigate('/dashboard');
      } else {
        setErrors({ general: 'Error al crear la cuenta' });
      }
    } catch (error) {
      setErrors({ general: 'Error al crear la cuenta' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12 relative">
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Crear Cuenta</h1>
          <p className="text-muted-foreground">Únete a Store y comienza a gestionar tu tienda</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="nombre_usuario" className="block text-sm font-medium text-foreground mb-2">
              Nombre de Usuario *
            </label>
            <Input
              id="nombre_usuario"
              name="nombre_usuario"
              type="text"
              required
              placeholder="Tu nombre de usuario"
              value={formData.nombre_usuario}
              onChange={handleChange}
              variant={errors.nombre_usuario ? 'error' : 'default'}
            />
            {errors.nombre_usuario && (
              <p className="mt-1 text-sm text-error flex items-center space-x-1">
                <AlertCircle size={14} />
                <span>{errors.nombre_usuario}</span>
              </p>
            )}
          </div>

          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-foreground mb-2">
              Nombre Completo *
            </label>
            <Input
              id="nombre"
              name="nombre"
              type="text"
              required
              placeholder="Tu nombre completo"
              value={formData.nombre}
              onChange={handleChange}
              variant={errors.nombre ? 'error' : 'default'}
            />
            {errors.nombre && (
              <p className="mt-1 text-sm text-error flex items-center space-x-1">
                <AlertCircle size={14} />
                <span>{errors.nombre}</span>
              </p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
              Correo Electrónico *
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              placeholder="tu@email.com"
              value={formData.email}
              onChange={handleChange}
              variant={errors.email ? 'error' : 'default'}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-error flex items-center space-x-1">
                <AlertCircle size={14} />
                <span>{errors.email}</span>
              </p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
              Contraseña *
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              placeholder="Mínimo 6 caracteres"
              value={formData.password}
              onChange={handleChange}
              variant={errors.password ? 'error' : 'default'}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-error flex items-center space-x-1">
                <AlertCircle size={14} />
                <span>{errors.password}</span>
              </p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2">
              Confirmar Contraseña *
            </label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              placeholder="Repite tu contraseña"
              value={formData.confirmPassword}
              onChange={handleChange}
              variant={errors.confirmPassword ? 'error' : 'default'}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-error flex items-center space-x-1">
                <AlertCircle size={14} />
                <span>{errors.confirmPassword}</span>
              </p>
            )}
          </div>

          {errors.general && (
            <div className="bg-error/10 border border-error rounded-md p-3 flex items-start space-x-2">
              <AlertCircle size={18} className="text-error mt-0.5 flex-shrink-0" />
              <p className="text-sm text-error">{errors.general}</p>
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={loading}
          >
            <UserPlus size={18} className="mr-2" />
            {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            ¿Ya tienes cuenta?{' '}
            <button
              className="text-primary hover:underline font-medium"
              onClick={() => navigate('/login')}
            >
              Inicia sesión
            </button>
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            Al crear una cuenta, aceptas nuestros términos de servicio y política de privacidad.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Register;