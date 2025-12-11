import { useState } from 'react';
import { ChevronDown, Filter, User } from 'lucide-react';
import { filterOptions } from '../../data/mockData';
import clsx from 'clsx';

interface FilterBarProps {
  showRegionFilter?: boolean;
  showHotelTypeFilter?: boolean;
  showTimeFilter?: boolean;
  showRoleSelector?: boolean;
}

export function FilterBar({
  showRegionFilter = true,
  showHotelTypeFilter = true,
  showTimeFilter = true,
  showRoleSelector = true,
}: FilterBarProps) {
  const [region, setRegion] = useState('全国');
  const [province, setProvince] = useState('');
  const [hotelType, setHotelType] = useState('全部');
  const [timeRange, setTimeRange] = useState('近30天');
  const [role, setRole] = useState('brand_ops');

  const currentRole = filterOptions.roles.find((r) => r.id === role);
  const provinces = region !== '全国' ? filterOptions.provinces[region as keyof typeof filterOptions.provinces] || [] : [];

  return (
    <div className="h-14 bg-dark-card/50 backdrop-blur-xl border-b border-dark-border px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Left: Filters */}
      <div className="flex items-center gap-3">
        <Filter size={16} className="text-zinc-500" />

        {showRegionFilter && (
          <>
            <SelectField
              value={region}
              onChange={(v) => {
                setRegion(v);
                setProvince('');
              }}
              options={filterOptions.regions}
              className="w-24"
            />

            {provinces.length > 0 && (
              <SelectField
                value={province || '全省'}
                onChange={setProvince}
                options={['全省', ...provinces]}
                className="w-24"
              />
            )}
          </>
        )}

        {showHotelTypeFilter && (
          <SelectField
            value={hotelType}
            onChange={setHotelType}
            options={filterOptions.hotelTypes}
            className="w-24"
          />
        )}

        {showTimeFilter && (
          <SelectField
            value={timeRange}
            onChange={setTimeRange}
            options={filterOptions.timeRanges}
            className="w-28"
          />
        )}
      </div>

      {/* Right: Role Selector */}
      {showRoleSelector && (
        <div className="flex items-center gap-3">
          <span className="text-xs text-zinc-500">模拟视角</span>
          <div className="relative">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="appearance-none bg-dark-bg border border-dark-border rounded-lg pl-8 pr-8 py-1.5 text-sm text-zinc-300 focus:outline-none focus:border-brand-blue/50 cursor-pointer"
            >
              {filterOptions.roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.level})
                </option>
              ))}
            </select>
            <User size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500" />
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          </div>
        </div>
      )}
    </div>
  );
}

interface SelectFieldProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  className?: string;
}

function SelectField({ value, onChange, options, className }: SelectFieldProps) {
  return (
    <div className={clsx('relative', className)}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none bg-dark-bg border border-dark-border rounded-lg px-3 pr-8 py-1.5 text-sm text-zinc-300 focus:outline-none focus:border-brand-blue/50 cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
    </div>
  );
}

