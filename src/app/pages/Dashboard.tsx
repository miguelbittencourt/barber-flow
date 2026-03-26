import { useEffect, useState } from 'react';
import { TrendingUp, DollarSign, Target, CheckCircle2 } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { getGoals, getTodayAttendances } from '../utils/storage';
import type { Goals } from '../types';

export function Dashboard() {
  const [goals, setGoals] = useState<Goals>({ daily: 0, monthly: 0 });
  const [todayTotal, setTodayTotal] = useState(0);
  const [todayCount, setTodayCount] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const loadedGoals = getGoals();
    setGoals(loadedGoals);

    const attendances = getTodayAttendances();
    const total = attendances.reduce((sum, att) => sum + att.total, 0);
    setTodayTotal(total);
    setTodayCount(attendances.length);
  };

  // Refresh data when window gains focus
  useEffect(() => {
    const handleFocus = () => loadData();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const dailyProgress = goals.daily > 0 ? (todayTotal / goals.daily) * 100 : 0;
  const remaining = Math.max(0, goals.daily - todayTotal);
  const avgTicket = todayCount > 0 ? todayTotal / todayCount : 0;

  const today = new Date();
  const formattedDate = today.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="pt-2">
        <h1 className="text-2xl text-gray-900">Olá, Barbeiro! 👋</h1>
        <p className="text-sm text-gray-500 capitalize">{formattedDate}</p>
      </div>

      {/* Meta Diária Card */}
      <Card className="p-6 bg-gradient-to-br from-blue-600 to-blue-700 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-blue-100 text-sm mb-1">Faturamento Hoje</p>
            <h2 className="text-3xl">
              R$ {todayTotal.toFixed(2)}
            </h2>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {goals.daily > 0 && (
          <>
            <div className="mb-2">
              <div className="flex justify-between text-sm mb-1">
                <span>Meta: R$ {goals.daily.toFixed(2)}</span>
                <span>{dailyProgress.toFixed(0)}%</span>
              </div>
              <Progress value={dailyProgress} className="h-2 bg-blue-800" />
            </div>

            {dailyProgress >= 100 ? (
              <div className="flex items-center text-green-300 text-sm mt-3">
                <CheckCircle2 className="w-4 h-4 mr-1" />
                Meta batida! 🎉
              </div>
            ) : (
              <p className="text-blue-100 text-sm mt-3">
                Faltam R$ {remaining.toFixed(2)} para bater a meta
              </p>
            )}
          </>
        )}
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <Target className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl text-gray-900">{todayCount}</p>
          <p className="text-sm text-gray-500">Atendimentos</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl text-gray-900">
            R$ {avgTicket.toFixed(0)}
          </p>
          <p className="text-sm text-gray-500">Ticket Médio</p>
        </Card>
      </div>

      {/* Quick Tips */}
      <Card className="p-4 bg-amber-50 border-amber-200">
        <h3 className="text-sm text-amber-900 mb-2">💡 Dica do dia</h3>
        <p className="text-sm text-amber-700">
          {dailyProgress < 50
            ? 'Você está começando bem! Continue registrando seus atendimentos.'
            : dailyProgress < 100
            ? 'Ótimo ritmo! Você está perto de bater a meta diária.'
            : 'Meta batida! Que tal oferecer produtos para aumentar ainda mais o faturamento?'}
        </p>
      </Card>

      {/* Month Progress */}
      {goals.monthly > 0 && (
        <Card className="p-4">
          <h3 className="text-sm text-gray-700 mb-3 flex items-center">
            <Target className="w-4 h-4 mr-2" />
            Meta Mensal
          </h3>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-xl text-gray-900">
                R$ {todayTotal.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500">
                de R$ {goals.monthly.toFixed(2)}
              </p>
            </div>
            <p className="text-sm text-gray-600">
              {((todayTotal / goals.monthly) * 100).toFixed(1)}%
            </p>
          </div>
          <Progress
            value={(todayTotal / goals.monthly) * 100}
            className="h-1.5 mt-3"
          />
        </Card>
      )}
    </div>
  );
}
