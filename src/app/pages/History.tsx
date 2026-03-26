import { useState, useEffect } from 'react';
import { Calendar, TrendingUp, ChevronRight } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { getAttendances } from '../utils/storage';
import type { Attendance, DailySummary } from '../types';

export function History() {
  const [summaries, setSummaries] = useState<DailySummary[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedAttendances, setSelectedAttendances] = useState<Attendance[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const attendances = getAttendances();
    
    // Group by date
    const grouped = new Map<string, Attendance[]>();
    attendances.forEach((att) => {
      const existing = grouped.get(att.date) || [];
      existing.push(att);
      grouped.set(att.date, existing);
    });

    // Create summaries
    const summaryList: DailySummary[] = [];
    grouped.forEach((atts, date) => {
      const total = atts.reduce((sum, att) => sum + att.total, 0);
      const count = atts.length;
      const byCategory = {
        Avulso: 0,
        Recorrência: 0,
        Extra: 0,
        Produto: 0,
      };

      atts.forEach((att) => {
        att.items.forEach((item) => {
          byCategory[item.category] += item.price * item.quantity;
        });
      });

      summaryList.push({
        date,
        total,
        attendanceCount: count,
        avgTicket: total / count,
        byCategory,
      });
    });

    // Sort by date (most recent first)
    summaryList.sort((a, b) => b.date.localeCompare(a.date));
    setSummaries(summaryList);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatDateLong = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const isToday = (dateStr: string) => {
    const today = new Date().toISOString().split('T')[0];
    return dateStr === today;
  };

  const handleDateClick = (dateStr: string) => {
    const attendances = getAttendances().filter((att) => att.date === dateStr);
    setSelectedAttendances(attendances);
    setSelectedDate(dateStr);
  };

  const handleBack = () => {
    setSelectedDate(null);
    setSelectedAttendances([]);
  };

  const categoryColors = {
    Avulso: 'bg-blue-100 text-blue-700',
    Recorrência: 'bg-green-100 text-green-700',
    Extra: 'bg-purple-100 text-purple-700',
    Produto: 'bg-orange-100 text-orange-700',
  };

  if (selectedDate) {
    return (
      <div className="p-4 space-y-4">
        {/* Back Header */}
        <div className="pt-2">
          <button
            onClick={handleBack}
            className="text-blue-600 text-sm mb-2 flex items-center"
          >
            ← Voltar
          </button>
          <h1 className="text-2xl text-gray-900 capitalize">
            {formatDateLong(selectedDate)}
          </h1>
          <p className="text-sm text-gray-500">
            {selectedAttendances.length} atendimento(s)
          </p>
        </div>

        {/* Attendances Detail */}
        <div className="space-y-3 pb-4">
          {selectedAttendances.map((att) => (
            <Card key={att.id} className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  {att.clientName && (
                    <p className="text-sm text-gray-600 mb-1">{att.clientName}</p>
                  )}
                  <p className="text-xs text-gray-500">
                    {new Date(att.createdAt).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <p className="text-xl text-blue-600">
                  R$ {att.total.toFixed(2)}
                </p>
              </div>

              <div className="space-y-2">
                {att.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-gray-700">
                        {item.quantity}x {item.serviceName}
                      </span>
                      <Badge
                        className={categoryColors[item.category]}
                        variant="secondary"
                      >
                        {item.category}
                      </Badge>
                    </div>
                    <span className="text-gray-600">
                      R$ {(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="pt-2">
        <h1 className="text-2xl text-gray-900">Histórico</h1>
        <p className="text-sm text-gray-500">Últimos 30 dias</p>
      </div>

      {/* Summary Cards */}
      <div className="space-y-3 pb-4">
        {summaries.map((summary) => (
          <Card
            key={summary.date}
            className="p-4 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleDateClick(summary.date)}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <p className="text-sm text-gray-700 capitalize">
                    {formatDate(summary.date)}
                  </p>
                  {isToday(summary.date) && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                      Hoje
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {summary.attendanceCount} atendimento(s)
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>

            <div className="flex items-end justify-between">
              <div>
                <p className="text-2xl text-gray-900">
                  R$ {summary.total.toFixed(2)}
                </p>
                <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  Ticket médio: R$ {summary.avgTicket.toFixed(2)}
                </div>
              </div>
            </div>

            {/* Category breakdown */}
            <div className="flex gap-2 mt-3 flex-wrap">
              {Object.entries(summary.byCategory).map(([cat, value]) => {
                if (value === 0) return null;
                return (
                  <Badge
                    key={cat}
                    className={categoryColors[cat as keyof typeof categoryColors]}
                    variant="secondary"
                  >
                    {cat}: R$ {value.toFixed(0)}
                  </Badge>
                );
              })}
            </div>
          </Card>
        ))}

        {summaries.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Nenhum atendimento registrado ainda.</p>
            <p className="text-sm mt-1">
              Comece registrando na aba "Registrar".
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
