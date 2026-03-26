import { useState, useEffect } from 'react';
import { Plus, Minus, Check } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { getServices, addAttendance } from '../utils/storage';
import { toast } from 'sonner';
import type { Service, AttendanceItem } from '../types';

export function Register() {
  const [services, setServices] = useState<Service[]>([]);
  const [cart, setCart] = useState<Map<string, AttendanceItem>>(new Map());
  const [clientName, setClientName] = useState('');

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = () => {
    const loadedServices = getServices();
    setServices(loadedServices);
  };

  const addToCart = (service: Service) => {
    const newCart = new Map(cart);
    const existing = newCart.get(service.id);

    if (existing) {
      existing.quantity += 1;
    } else {
      newCart.set(service.id, {
        serviceId: service.id,
        serviceName: service.name,
        price: service.price,
        quantity: 1,
        category: service.category,
      });
    }

    setCart(newCart);
    toast.success(`${service.name} adicionado`);
  };

  const removeFromCart = (serviceId: string) => {
    const newCart = new Map(cart);
    const item = newCart.get(serviceId);

    if (item && item.quantity > 1) {
      item.quantity -= 1;
    } else {
      newCart.delete(serviceId);
    }

    setCart(newCart);
  };

  const getTotal = () => {
    let total = 0;
    cart.forEach((item) => {
      total += item.price * item.quantity;
    });
    return total;
  };

  const handleFinish = () => {
    if (cart.size === 0) {
      toast.error('Adicione ao menos um serviço');
      return;
    }

    const attendance = {
      id: 'att_' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      items: Array.from(cart.values()),
      total: getTotal(),
      clientName: clientName || undefined,
      createdAt: new Date().toISOString(),
    };

    addAttendance(attendance);
    
    // Clear form
    setCart(new Map());
    setClientName('');
    
    toast.success('Atendimento registrado! 🎉', {
      description: `Total: R$ ${attendance.total.toFixed(2)}`,
    });
  };

  const categoryColors = {
    Avulso: 'bg-blue-100 text-blue-700',
    Recorrência: 'bg-green-100 text-green-700',
    Extra: 'bg-purple-100 text-purple-700',
    Produto: 'bg-orange-100 text-orange-700',
  };

  const cartTotal = getTotal();
  const cartCount = Array.from(cart.values()).reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b p-4">
        <h1 className="text-xl text-gray-900">Registrar Atendimento</h1>
        <Input
          placeholder="Nome do cliente (opcional)"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          className="mt-3 h-11"
        />
      </div>

      {/* Services Grid */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {services.map((service) => {
          const inCart = cart.get(service.id);
          const quantity = inCart?.quantity || 0;

          return (
            <Card
              key={service.id}
              className={`p-4 transition-all ${
                quantity > 0 ? 'ring-2 ring-blue-500 bg-blue-50' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="text-base text-gray-900">{service.name}</h3>
                  <p className="text-lg text-blue-600 mt-1">
                    R$ {service.price.toFixed(2)}
                  </p>
                </div>
                <Badge className={categoryColors[service.category]} variant="secondary">
                  {service.category}
                </Badge>
              </div>

              <div className="flex items-center gap-2 mt-3">
                {quantity > 0 ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 w-9 p-0"
                      onClick={() => removeFromCart(service.id)}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <div className="flex-1 text-center py-1.5 bg-white border rounded-md">
                      <span className="text-base">{quantity}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 w-9 p-0"
                      onClick={() => addToCart(service)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </>
                ) : (
                  <Button
                    className="w-full h-9 bg-blue-600 hover:bg-blue-700"
                    onClick={() => addToCart(service)}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Adicionar
                  </Button>
                )}
              </div>
            </Card>
          );
        })}

        {services.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>Nenhum serviço cadastrado.</p>
            <p className="text-sm mt-1">
              Acesse a aba "Serviços" para criar.
            </p>
          </div>
        )}
      </div>

      {/* Cart Footer */}
      {cartCount > 0 && (
        <div className="bg-white border-t p-4 space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">{cartCount} item(s)</p>
              <p className="text-2xl text-gray-900">
                R$ {cartTotal.toFixed(2)}
              </p>
            </div>
            <Button
              size="lg"
              className="h-12 px-8 bg-green-600 hover:bg-green-700"
              onClick={handleFinish}
            >
              <Check className="w-5 h-5 mr-2" />
              Finalizar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
