import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { getServices, addService, updateService, deleteService } from '../utils/storage';
import { toast } from 'sonner';
import type { Service } from '../types';

export function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'Avulso' as Service['category'],
  });

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = () => {
    const loadedServices = getServices();
    setServices(loadedServices);
  };

  const openDialog = (service?: Service) => {
    if (service) {
      setEditingService(service);
      setFormData({
        name: service.name,
        price: service.price.toString(),
        category: service.category,
      });
    } else {
      setEditingService(null);
      setFormData({ name: '', price: '', category: 'Avulso' });
    }
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingService(null);
    setFormData({ name: '', price: '', category: 'Avulso' });
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast.error('Digite o nome do serviço');
      return;
    }

    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
      toast.error('Digite um preço válido');
      return;
    }

    if (editingService) {
      // Update
      updateService(editingService.id, {
        name: formData.name.trim(),
        price,
        category: formData.category,
      });
      toast.success('Serviço atualizado');
    } else {
      // Create
      const newService: Service = {
        id: 'srv_' + Date.now(),
        name: formData.name.trim(),
        price,
        category: formData.category,
        createdAt: new Date().toISOString(),
      };
      addService(newService);
      toast.success('Serviço criado');
    }

    loadServices();
    closeDialog();
  };

  const handleDelete = (service: Service) => {
    if (confirm(`Deseja realmente excluir "${service.name}"?`)) {
      deleteService(service.id);
      loadServices();
      toast.success('Serviço excluído');
    }
  };

  const categoryColors = {
    Avulso: 'bg-blue-100 text-blue-700',
    Recorrência: 'bg-green-100 text-green-700',
    Extra: 'bg-purple-100 text-purple-700',
    Produto: 'bg-orange-100 text-orange-700',
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <h1 className="text-2xl text-gray-900">Serviços</h1>
          <p className="text-sm text-gray-500">{services.length} cadastrados</p>
        </div>
        <Button
          className="h-11 bg-blue-600 hover:bg-blue-700"
          onClick={() => openDialog()}
        >
          <Plus className="w-5 h-5 mr-1" />
          Novo
        </Button>
      </div>

      {/* Services List */}
      <div className="space-y-3 pb-4">
        {services.map((service) => (
          <Card key={service.id} className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h3 className="text-base text-gray-900">{service.name}</h3>
                <p className="text-xl text-blue-600 mt-1">
                  R$ {service.price.toFixed(2)}
                </p>
              </div>
              <Badge className={categoryColors[service.category]} variant="secondary">
                {service.category}
              </Badge>
            </div>

            <div className="flex gap-2 mt-3">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => openDialog(service)}
              >
                <Pencil className="w-4 h-4 mr-1" />
                Editar
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 hover:bg-red-50"
                onClick={() => handleDelete(service)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}

        {services.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>Nenhum serviço cadastrado ainda.</p>
            <p className="text-sm mt-1">Clique em "Novo" para começar.</p>
          </div>
        )}
      </div>

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingService ? 'Editar Serviço' : 'Novo Serviço'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="name">Nome do serviço</Label>
              <Input
                id="name"
                placeholder="Ex: Corte simples"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="mt-1 h-11"
              />
            </div>

            <div>
              <Label htmlFor="price">Preço (R$)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                className="mt-1 h-11"
              />
            </div>

            <div>
              <Label htmlFor="category">Categoria</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    category: value as Service['category'],
                  })
                }
              >
                <SelectTrigger className="mt-1 h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Avulso">Avulso</SelectItem>
                  <SelectItem value="Recorrência">Recorrência</SelectItem>
                  <SelectItem value="Extra">Extra</SelectItem>
                  <SelectItem value="Produto">Produto</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                className="flex-1 h-11"
                onClick={closeDialog}
              >
                Cancelar
              </Button>
              <Button
                className="flex-1 h-11 bg-blue-600 hover:bg-blue-700"
                onClick={handleSave}
              >
                {editingService ? 'Salvar' : 'Criar'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
