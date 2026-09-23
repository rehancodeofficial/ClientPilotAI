import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import L from 'leaflet';
import {
  MapPin, Radar, Filter, RefreshCw, Layers, Compass, Building2,
  CheckCircle2, ArrowUpRight, Target, Sparkles
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Badge, Button, Select, Slider } from '@/components/ui';
import { getOpportunityZones, getAllLeads } from '@/lib/apiClient';
import type { OpportunityZone, Lead, BusinessCategory } from '@/types';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/useAppStore';

function makeZoneMarker(zone: OpportunityZone): L.DivIcon {
  const color = zone.avgOpportunityScore >= 85 ? '#10b981' : zone.avgOpportunityScore >= 75 ? '#3b82f6' : '#f59e0b';
  return L.divIcon({
    className: '',
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    html: `
      <div style="
        width:44px; height:44px; border-radius:50%;
        background:${color}; border:3px solid white;
        box-shadow: 0 4px 14px rgba(0,0,0,0.35);
        display:flex; flex-direction:column; align-items:center; justify-content:center;
        color:white; font-family:sans-serif; cursor:pointer;
      ">
        <span style="font-size:12px; font-weight:800; line-height:1;">${zone.totalOpportunities}</span>
        <span style="font-size:8px; opacity:0.85; font-weight:600;">opps</span>
      </div>
    `,
  });
}

export function OpportunityZonesPage() {
  const [zones, setZones] = useState<OpportunityZone[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedZone, setSelectedZone] = useState<OpportunityZone | null>(null);
  const [minScore, setMinScore] = useState<number>(70);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);

  const isDemoMode = useAppStore((s) => s.isDemoMode);
  const setSelectedLeadId = useAppStore((s) => s.setSelectedLeadId);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapRef.current || leafletMap.current) return;

    const map = L.map(mapRef.current).setView([24.8607, 67.0011], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(map);

    markersRef.current = L.layerGroup().addTo(map);
    leafletMap.current = map;

    return () => {
      map.remove();
      leafletMap.current = null;
    };
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [fetchedZones, fetchedLeads] = await Promise.all([
        getOpportunityZones(),
        getAllLeads(),
      ]);
      setZones(fetchedZones);
      setLeads(fetchedLeads);
      if (fetchedZones.length > 0 && !selectedZone) {
        setSelectedZone(fetchedZones[0]);
      }
    } catch (err) {
      console.error('Failed to load opportunity zones:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [isDemoMode]);

  // Update Map Markers when zones or selectedZone or leads change
  useEffect(() => {
    if (!leafletMap.current || !markersRef.current) return;
    markersRef.current.clearLayers();

    // 1. Zone Cluster Markers
    zones.forEach((z) => {
      const isSelected = selectedZone?.zoneName === z.zoneName;
      const marker = L.marker([z.centerLat, z.centerLng], {
        icon: makeZoneMarker(z),
      });

      marker.bindPopup(`
        <div style="font-family:sans-serif; padding:6px; min-width:140px;">
          <h4 style="font-weight:700; margin:0 0 4px; font-size:13px; color:#0f172a;">${z.zoneName}</h4>
          <p style="margin:0 0 2px; font-size:11px; color:#475569;">Opportunities: <strong>${z.totalOpportunities}</strong></p>
          <p style="margin:0 0 2px; font-size:11px; color:#475569;">Avg Score: <strong>${z.avgOpportunityScore}/100</strong></p>
          <p style="margin:0; font-size:11px; color:#475569;">Dominant: <strong style="text-transform:capitalize;">${z.topCategory.replace('_', ' ')}</strong></p>
        </div>
      `);

      marker.on('click', () => {
        setSelectedZone(z);
        leafletMap.current?.setView([z.centerLat, z.centerLng], 14, { animate: true });
      });

      markersRef.current?.addLayer(marker);
    });

    // 2. Individual Business Markers when a zone is selected
    if (selectedZone && leads.length > 0) {
      const zoneLeads = leads.filter((l) => {
        const addr = (l.address || '').toLowerCase();
        const city = (l.city || '').toLowerCase();
        const zoneStr = selectedZone.zoneName.toLowerCase();
        return zoneStr.includes(city) || (addr && zoneStr.includes(addr.slice(0, 5)));
      }).slice(0, 10);

      zoneLeads.forEach((l) => {
        const lat = l.latitude || selectedZone.centerLat;
        const lng = l.longitude || selectedZone.centerLng;
        const bizMarker = L.circleMarker([lat, lng], {
          radius: 7,
          fillColor: l.score >= 80 ? '#10b981' : '#3b82f6',
          color: '#ffffff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.9,
        });

        bizMarker.bindTooltip(`
          <div style="font-family:sans-serif; font-size:11px; font-weight:600;">
            ${l.name} (${l.score}/100)
          </div>
        `);

        bizMarker.on('click', () => {
          setSelectedLeadId(l.id);
        });

        markersRef.current?.addLayer(bizMarker);
      });
    }

    if (zones.length > 0 && selectedZone) {
      leafletMap.current.setView([selectedZone.centerLat, selectedZone.centerLng], 13);
    }
  }, [zones, selectedZone, leads]);

  const filteredZones = zones.filter((z) => {
    if (z.avgOpportunityScore < minScore) return false;
    if (categoryFilter !== 'all' && z.topCategory !== categoryFilter) return false;
    return true;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-xl clay-raised text-(--primary)">
              <Radar className="h-5 w-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-(--text-primary)">
              Geographic Opportunity Zones
            </h1>
            {isDemoMode && (
              <Badge variant="warning" className="text-xs px-2 py-0.5">DEMO DATA</Badge>
            )}
          </div>
          <p className="text-sm text-(--text-secondary)">
            Geospatial clusters of concentrated software agency service opportunities based on high opportunity density and digital gaps.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={loadData}
          disabled={isLoading}
          className="gap-2 shrink-0"
        >
          <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
          Reload Zones
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="clay-raised p-4 flex flex-wrap items-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-(--text-muted)" />
          <span className="font-semibold text-(--text-secondary)">Filters:</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-(--text-secondary)">Min Opportunity Score:</span>
          <span className="font-bold text-(--primary)">{minScore}</span>
          <input
            type="range"
            min={50}
            max={90}
            step={5}
            value={minScore}
            onChange={(e) => setMinScore(Number(e.target.value))}
            className="w-24 accent-(--primary) cursor-pointer"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-(--text-secondary)">Dominant Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-(--surface) border border-(--border) rounded-lg px-2.5 py-1 text-(--text-primary) focus:outline-none"
          >
            <option value="all">All Categories</option>
            <option value="clinic">Clinics & Medical</option>
            <option value="restaurant">Restaurants & Food</option>
            <option value="salon">Salons & Spas</option>
            <option value="retail">Retail Stores</option>
            <option value="real_estate">Real Estate</option>
          </select>
        </div>

        <span className="ml-auto text-(--text-muted)">
          Showing <strong>{filteredZones.length}</strong> active opportunity zone(s)
        </span>
      </div>

      {/* Main Content Grid: Map + Zone List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Container */}
        <div className="lg:col-span-2 clay-raised p-2 overflow-hidden rounded-2xl h-[520px] relative">
          <div ref={mapRef} className="w-full h-full rounded-xl z-10" />
          <div className="absolute bottom-4 left-4 z-20 bg-(--surface)/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-(--border) text-[11px] flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Score &ge; 85</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span>Score 75–84</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>Score &lt; 75</span>
            </div>
          </div>
        </div>

        {/* Zone Cards List */}
        <div className="space-y-3 overflow-y-auto max-h-[520px] pr-1">
          {filteredZones.map((z) => {
            const isSelected = selectedZone?.zoneName === z.zoneName;
            return (
              <motion.div
                key={z.zoneName}
                onClick={() => {
                  setSelectedZone(z);
                  leafletMap.current?.setView([z.centerLat, z.centerLng], 14, { animate: true });
                }}
                className={cn(
                  "p-4 rounded-2xl cursor-pointer transition-all border",
                  isSelected
                    ? "clay-inset bg-(--primary-soft) border-(--primary)"
                    : "clay-raised border-transparent hover:border-(--border)"
                )}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <MapPin className={cn("h-4 w-4 shrink-0", isSelected ? "text-(--primary)" : "text-(--text-muted)")} />
                    <h3 className="font-bold text-sm text-(--text-primary)">
                      {z.zoneName}
                    </h3>
                  </div>
                  <Badge variant={z.avgOpportunityScore >= 85 ? "success" : "default"} className="text-xs">
                    {z.avgOpportunityScore}/100
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-(--text-secondary) mt-2 pt-2 border-t border-(--border)">
                  <div>
                    <span className="text-(--text-muted) block text-[10px] uppercase">Concentration</span>
                    <strong>{z.totalOpportunities} opportunities</strong>
                  </div>
                  <div>
                    <span className="text-(--text-muted) block text-[10px] uppercase">Top Category</span>
                    <strong className="capitalize">{z.topCategory.replace('_', ' ')}</strong>
                  </div>
                  <div>
                    <span className="text-(--text-muted) block text-[10px] uppercase">Avg Maturity</span>
                    <strong>Level {z.avgMaturityLevel}</strong>
                  </div>
                  <div>
                    <span className="text-(--text-muted) block text-[10px] uppercase">High Priority</span>
                    <strong className="text-emerald-600 dark:text-emerald-400">{z.highPriorityCount} prime targets</strong>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
