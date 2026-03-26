import { useState } from 'react';
import { useNavigate } from 'react-router';
import { LogIn } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { setUser, setAuthToken, initializeMockData } from '../utils/storage';

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate login
    setTimeout(() => {
      const user = {
        name: 'Barbeiro',
        email: email || 'demo@barberflow.com',
        pin,
      };
      
      setUser(user);
      setAuthToken('mock-token-' + Date.now());
      
      // Initialize mock data on first login
      initializeMockData();
      
      setLoading(false);
      navigate('/');
    }, 500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 p-6">
      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4">
            <LogIn className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-3xl text-white mb-2">BarberFlow</h1>
          <p className="text-blue-100">Controle seus atendimentos</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-gray-700">
                E-mail
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 h-12"
              />
            </div>

            <div>
              <Label htmlFor="pin" className="text-gray-700">
                PIN (opcional)
              </Label>
              <Input
                id="pin"
                type="password"
                placeholder="****"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                maxLength={4}
                className="mt-1 h-12"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            Modo demonstração - use qualquer email
          </p>
        </div>
      </div>
    </div>
  );
}
