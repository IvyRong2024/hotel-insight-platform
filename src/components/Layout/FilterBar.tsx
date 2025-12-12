import { useState } from 'react';
import { ChevronDown, Filter, User } from 'lucide-react';
import { filterOptions } from '../../data/mockData';
import clsx from 'clsx';

interface FilterBarProps {
  showRegionFilter?: boolean;
  showHotelTypeFilter?: boolean;
  showTimeFilter?: boolean;
  showRoleSelector?: boolean;
  showBrandFilter?: boolean;
}

export function FilterBar({
  showRegionFilter = true,
  showHotelTypeFilter = true,
  showTimeFilter = true,
  showRoleSelector = true,
  showBrandFilter = false,
}: FilterBarProps) {
  const [region, setRegion] = useState('全国');
  const [province, setProvince] = useState('');
  const [hotelType, setHotelType] = useState('全部');
  const [timeRange, setTimeRange] = useState('近30天');
  const [role, setRole] = useState('brand_ops');
  const [brand, setBrand] = useState('全部品牌');

  const provinces = region !== '全国' ? filterOptions.provinces[region as keyof typeof filterOptions.provinces] || [] : [];

  return (
    <div className="h-12 bg-white/80 backdrop-blur-xl border-b border-slate-200 px-5 flex items-center justify-between sticky top-0 z-40">
      {/* Left: Filters */}
      <div className="flex items-center gap-2">
        <Filter size={14} className="text-slate-400" />

        {showRegionFilter && (
          <>
            <SelectField
              value={region}
              onChange={(v) => {
                setRegion(v);
                setProvince('');
              }}
              options={filterOptions.regions}
              className="w-20"
            />

            {provinces.length > 0 && (
              <SelectField
                value={province || '全省'}
                onChange={setProvince}
                options={['全省', ...provinces]}
                className="w-20"
              />
            )}
          </>
        )}

        {showBrandFilter && (
          <SelectField
            value={brand}
            onChange={setBrand}
            options={filterOptions.brands}
            className="w-24"
          />
        )}

        {showHotelTypeFilter && (
          <SelectField
            value={hotelType}
            onChange={setHotelType}
            options={filterOptions.hotelTypes}
            className="w-20"
          />
        )}

        {showTimeFilter && (
          <SelectField
            value={timeRange}
            onChange={setTimeRange}
            options={filterOptions.timeRanges}
            className="w-24"
          />
        )}
      </div>

      {/* Right: Role Selector */}
      {showRoleSelector && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">视角</span>
          <div className="relative">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="appearance-none bg-slate-50 border border-slate-200 rounded-lg pl-7 pr-7 py-1 text-xs text-slate-600 focus:outline-none focus:border-ihg-navy cursor-pointer"
            >
              {filterOptions.roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
            <User size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
            <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400" />
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
        className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-lg px-2.5 pr-7 py-1 text-xs text-slate-600 focus:outline-none focus:border-ihg-navy cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
    </div>
  );
}
