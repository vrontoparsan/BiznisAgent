import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { formatDate } from '@/lib/utils';
import { Plus } from 'lucide-react';

export function Complaints() {
  const { token } = useAuth();
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      api.getComplaints(token)
        .then(setComplaints)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [token]);

  const statusVariants: Record<string, any> = {
    prijata: 'warning',
    v_rieseni: 'default',
    vyriesena: 'success',
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Reklamácie</h1>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nová reklamácia
        </Button>
      </div>

      {loading ? (
        <p className="text-center py-12 text-muted-foreground">Načítavam...</p>
      ) : complaints.length === 0 ? (
        <p className="text-center py-12 text-muted-foreground">Žiadne reklamácie</p>
      ) : (
        <div className="space-y-3">
          {complaints.map((complaint) => (
            <Card key={complaint.id}>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{complaint.customerName}</p>
                      <p className="text-sm text-muted-foreground">{complaint.category}</p>
                    </div>
                    <Badge variant={statusVariants[complaint.status] || 'default'}>
                      {complaint.status}
                    </Badge>
                  </div>
                  <p className="text-sm">{complaint.description}</p>
                  <div className="flex justify-between items-center text-xs text-muted-foreground pt-2 border-t">
                    <span>Vytvorené: {formatDate(complaint.createdAt)}</span>
                    {complaint.slaDeadline && (
                      <span>SLA: {formatDate(complaint.slaDeadline)}</span>
                    )}
                  </div>
                  {complaint.resolution && (
                    <div className="pt-2 border-t">
                      <p className="text-xs text-muted-foreground mb-1">Riešenie:</p>
                      <p className="text-sm">{complaint.resolution}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
