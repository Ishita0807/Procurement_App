import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

export default function RankingsFilters({ filters, setFilters, suppliers }: { filters: any; setFilters: (filters: any) => void; suppliers: any[] }) {
  const sectors = [...new Set(suppliers.map(s => s.sector))].filter(Boolean);
  const countries = [...new Set(suppliers.map(s => s.country))].filter(Boolean);

  const certificationOptions = [
    { key: "iso14001", label: "ISO 14001" },
    { key: "bcorp", label: "B-Corp" }, 
    { key: "fairtrade", label: "Fair Trade" },
    { key: "decarb_target", label: "Climate Target" }
  ];

  const updateFilter = (key: string, value: string) => {
    setFilters((prev: any) => ({ ...prev, [key]: value }));
  };

  const toggleCertification = (cert: string, checked: string | boolean) => {
    setFilters((prev: { certifications: any[]; }) => ({
      ...prev,
      certifications: checked 
        ? [...prev.certifications, cert]
        : prev.certifications.filter(c => c !== cert)
    }));
  };

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="space-y-2">
        <Label htmlFor="sector-filter">Sector</Label>
        <Select value={filters.sector} onValueChange={(value) => updateFilter('sector', value)}>
          <SelectTrigger>
            <SelectValue placeholder="All sectors" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sectors</SelectItem>
            {sectors.map(sector => (
              <SelectItem key={sector} value={sector}>{sector}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="country-filter">Country</Label>
        <Select value={filters.country} onValueChange={(value) => updateFilter('country', value)}>
          <SelectTrigger>
            <SelectValue placeholder="All countries" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Countries</SelectItem>
            {countries.map(country => (
              <SelectItem key={country} value={country}>{country}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Score Range</Label>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={filters.minScore}
            onChange={(e) => updateFilter('minScore', e.target.value)}
            min="0"
            max="100"
          />
          <Input
            type="number"
            placeholder="Max"
            value={filters.maxScore}
            onChange={(e) => updateFilter('maxScore', e.target.value)}
            min="0"
            max="100"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Certifications</Label>
        <div className="space-y-2">
          {certificationOptions.map(option => (
            <div key={option.key} className="flex items-center space-x-2">
              <Checkbox
                id={option.key}
                checked={filters.certifications.includes(option.key)}
                onCheckedChange={(checked) => toggleCertification(option.key, checked)}
              />
              <Label htmlFor={option.key} className="text-sm">
                {option.label}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}