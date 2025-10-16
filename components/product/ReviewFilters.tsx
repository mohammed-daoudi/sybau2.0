import { Star } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface ReviewFiltersProps {
  filters: {
    rating?: number;
    verified: boolean;
    sort: string;
  };
  onChange: (filters: {
    rating?: number;
    verified: boolean;
    sort: string;
  }) => void;
}

export default function ReviewFilters({ filters, onChange }: ReviewFiltersProps) {
  return (
    <div className="flex flex-wrap gap-6 items-end">
      <div className="space-y-2">
        <Label>Filter by Rating</Label>
        <div className="flex gap-1">
          {[...Array(5)].map((_, index) => {
            const value = 5 - index;
            return (
              <button
                key={value}
                type="button"
                className={`p-1 hover:scale-110 transition-transform ${
                  filters.rating === value ? 'scale-110' : ''
                }`}
                onClick={() =>
                  onChange({
                    ...filters,
                    rating: filters.rating === value ? undefined : value,
                  })
                }
              >
                <Star
                  className={
                    filters.rating === value || value <= (filters.rating || 5)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }
                  size={20}
                />
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Sort by</Label>
        <Select
          value={filters.sort}
          onValueChange={(value) => onChange({ ...filters, sort: value })}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="-createdAt">Most Recent</SelectItem>
            <SelectItem value="-helpfulCount">Most Helpful</SelectItem>
            <SelectItem value="-rating">Highest Rating</SelectItem>
            <SelectItem value="rating">Lowest Rating</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Switch
          id="verified"
          checked={filters.verified}
          onCheckedChange={(checked) => onChange({ ...filters, verified: checked })}
        />
        <Label htmlFor="verified">Verified Purchases Only</Label>
      </div>
    </div>
  );
}