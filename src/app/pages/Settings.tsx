import { useState, useEffect } from 'react';
import { Target, LogOut, Download, User } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { getGoals, setGoals, getUser, clearUser, getAttendances } from '../utils/storage';
import { toast } from 'sonner';
import type { Goals } from '../types';

export function Settings() {
  const navigate = useNavigate();
  const [goals, setGoalsState] = useState<Goals>({ daily: 0, monthly: 0 });
  const [dailyInput, setDailyInput] = useState('');
  const [monthlyInput, setMonthlyInput] = useState('');
  const user = getUser();

  useEffect(() => {
    const loadedGoals = getGoals();
    setGoalsState(loadedGoals);
    setDailyInput(loadedGoals.daily.toString());
    setMonthlyInput(loadedGoals.monthly.toString());
  }, []);

  const handleSaveGoals = () => {
    const daily = parseFloat(dailyInput);
    const monthly = parseFloat(monthlyInput);

    if (isNaN(daily) || daily < 0) {
      toast.error('Meta diária inválida');
      return;
    }

    if (isNaN(monthly) || monthly < 0) {
      toast.error('Meta mensal inválida');
      return;
    }

    const newGoals = { daily, monthly };
    setGoals(newGoals);
    setGoalsState(newGoals);
    toast.success('Metas atualizadas!');
  };

  const handleLogout = () => {
    if (confirm('Deseja realmente sair?')) {
      clearUser();
      navigate('/login');
    }
  };

  const handleExportCSV = () => {
    const attendances = getAttendances();
    
    if (attendances.length === 0) {
      toast.error('Nenhum dado para exportar');
      return;
    }

    // Create CSV content
    const headers = ['Data', 'Cliente', 'Serviço', 'Categoria', 'Quantidade', 'Valor', 'Total Atendimento'];
    const rows = attendances.flatMap((att) =>
      att.items.map((item, idx) => [
        att.date,
        att.clientName || '-',
        item.serviceName,
        item.category,
        item.quantity,
        item.price.toFixed(2),
        idx === 0 ? att.total.toFixed(2) : '',
      ])
    );

    const csv = [
      headers.join(','),
      ...rows.map((row) => row.join(',')),
    ].join('\n');

    // Download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `barberflow_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast.success('CSV exportado!');
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="pt-2">
        <h1 className="text-2xl text-gray-900">Configurações</h1>
        <p className="text-sm text-gray-500">Gerencie suas preferências</p>
      </div>

      {/* User Info */}
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-base text-gray-900">{user?.name || 'Usuário'}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>
      </Card>

      {/* Goals Settings */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg text-gray-900">Metas de Faturamento</h2>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="daily-goal">Meta Diária (R$)</Label>
            <Input
              id="daily-goal"
              type="number"
              step="0.01"
              value={dailyInput}
              onChange={(e) => setDailyInput(e.target.value)}
              className="mt-1 h-11"
              placeholder="0.00"
            />
          </div>

          <div>
            <Label htmlFor="monthly-goal">Meta Mensal (R$)</Label>
            <Input
              id="monthly-goal"
              type="number"
              step="0.01"
              value={monthlyInput}
              onChange={(e) => setMonthlyInput(e.target.value)}
              className="mt-1 h-11"
              placeholder="0.00"
            />
          </div>

          <Button
            className="w-full h-11 bg-blue-600 hover:bg-blue-700"
            onClick={handleSaveGoals}
          >
            Salvar Metas
          </Button>
        </div>
      </Card>

      {/* Export Data */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Download className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg text-gray-900">Exportar Dados</h2>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Baixe seus atendimentos em formato CSV para backup ou análise.
        </p>
        <Button
          variant="outline"
          className="w-full h-11"
          onClick={handleExportCSV}
        >
          <Download className="w-4 h-4 mr-2" />
          Exportar CSV
        </Button>
      </Card>

      {/* Logout */}
      <Card className="p-4">
        <Button
          variant="outline"
          className="w-full h-11 text-red-600 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sair da Conta
        </Button>
      </Card>

      {/* App Info */}
      <div className="text-center text-sm text-gray-500 pb-4">
        <p>BarberFlow v1.0.0 MVP</p>
        <p className="text-xs mt-1">
          Dados armazenados localmente no dispositivo
        </p>
      </div>
    </div>
  );
}
