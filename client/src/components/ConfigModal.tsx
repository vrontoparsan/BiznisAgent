import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from './ui/dialog';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Switch } from './ui/switch';
import { Select } from './ui/select';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface ConfigField {
  id: string;
  label: string;
  type: 'checkbox' | 'toggle' | 'select' | 'input' | 'number';
  options?: string[];
  defaultValue?: any;
  required?: boolean;
}

interface ConfigSection {
  title?: string;
  fields: ConfigField[];
}

interface ConfigModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  sections: ConfigSection[];
  storageKey: string;
  onSave?: (config: any) => void;
}

export function ConfigModal({ open, onOpenChange, title, sections, storageKey, onSave }: ConfigModalProps) {
  const [config, setConfig] = useState<Record<string, any>>({});

  useEffect(() => {
    // Load config from localStorage
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setConfig(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse config:', e);
      }
    } else {
      // Initialize with defaults
      const defaults: Record<string, any> = {};
      sections.forEach(section => {
        section.fields.forEach(field => {
          if (field.defaultValue !== undefined) {
            defaults[field.id] = field.defaultValue;
          } else if (field.type === 'checkbox' || field.type === 'toggle') {
            defaults[field.id] = true;
          }
        });
      });
      setConfig(defaults);
    }
  }, [storageKey, sections]);

  const handleSave = () => {
    localStorage.setItem(storageKey, JSON.stringify(config));
    onSave?.(config);
    onOpenChange(false);
  };

  const handleChange = (id: string, value: any) => {
    setConfig(prev => ({ ...prev, [id]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogClose onClose={() => onOpenChange(false)} />
        </DialogHeader>

        <div className="p-6 space-y-6">
          {sections.map((section, idx) => (
            <div key={idx} className="space-y-4">
              {section.title && (
                <h3 className="font-medium text-sm text-muted-foreground">{section.title}</h3>
              )}
              <div className="space-y-3">
                {section.fields.map(field => (
                  <div key={field.id} className="flex items-center justify-between">
                    {field.type === 'checkbox' && (
                      <Checkbox
                        id={field.id}
                        checked={config[field.id] ?? true}
                        onChange={(e) => handleChange(field.id, (e.target as HTMLInputElement).checked)}
                        label={field.label + (field.required ? ' (povinné)' : '')}
                      />
                    )}
                    {field.type === 'toggle' && (
                      <Switch
                        id={field.id}
                        checked={config[field.id] ?? true}
                        onChange={(e) => handleChange(field.id, (e.target as HTMLInputElement).checked)}
                        label={field.label}
                      />
                    )}
                    {field.type === 'select' && (
                      <div className="flex-1 flex items-center justify-between gap-4">
                        <Label htmlFor={field.id}>{field.label}</Label>
                        <Select
                          id={field.id}
                          value={config[field.id] ?? field.defaultValue ?? ''}
                          onChange={(e) => handleChange(field.id, e.target.value)}
                          className="max-w-xs"
                        >
                          {field.options?.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </Select>
                      </div>
                    )}
                    {(field.type === 'input' || field.type === 'number') && (
                      <div className="flex-1 flex items-center justify-between gap-4">
                        <Label htmlFor={field.id}>{field.label}</Label>
                        <Input
                          id={field.id}
                          type={field.type === 'number' ? 'number' : 'text'}
                          value={config[field.id] ?? field.defaultValue ?? ''}
                          onChange={(e) => handleChange(field.id, field.type === 'number' ? Number(e.target.value) : e.target.value)}
                          className="max-w-xs"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="px-6 pb-6 flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Zrušiť
          </Button>
          <Button onClick={handleSave}>
            Uložiť nastavenia
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
