import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import L from 'leaflet'
import {
  Radar, CheckCircle2, Loader2, MapPin, Phone, Globe, Clock,
  Filter, ArrowUpDown, Search, Wand2, Map as MapIcon, List, X,
  Utensils, ShoppingBag, Scissors, Activity, Wrench, Pill, Coffee, Monitor, Star, Home, Store,
  SlidersHorizontal, ChevronDown, Sparkles, Building2, Layers, AlertCircle, ArrowRight, Eye, RefreshCw,
  Crosshair, Compass, Laptop, Briefcase, Dumbbell, ShieldCheck, RotateCcw
} from 'lucide-react'
import {
  Button, Badge, Card, Input, Label,
} from '@/components/ui'
import { discoverLeads } from '@/lib/apiClient'
import { useAppStore } from '@/store/useAppStore'
import type { BusinessCategory, Lead, ProgressStep } from '@/types'
import { cn, getCategoryLabel } from '@/lib/utils'

// Fix Leaflet default marker icons (broken in Vite builds)
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

// Custom colored circle markers for discovered businesses on the rectangular map
function makeLeadIcon(score: number): L.DivIcon {
  const color = score >= 80 ? '#4AC329' : score >= 50 ? '#f59e0b' : '#676864'
  return L.divIcon({
    className: '',
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -18],
    html: `<div style="
      width:34px;height:34px;border-radius:10px;
      background:${color};border:2.5px solid #FFFFFF;
      box-shadow:0 4px 14px rgba(0,0,0,0.35);
      display:flex;align-items:center;justify-content:center;
      font-size:11px;font-weight:900;color:white;font-family:sans-serif;
      transform:rotate(-45deg);
    "><span style="transform:rotate(45deg)">${score}</span></div>`,
  })
}

const searchCenterIcon = L.divIcon({
  className: '',
  iconSize: [26, 26],
  iconAnchor: [13, 13],
  html: `<div style="
    width:26px;height:26px;border-radius:50%;
    background:#101010;border:3px solid #4AC329;
    box-shadow:0 0 0 4px rgba(74,195,41,0.25), 0 4px 12px rgba(0,0,0,0.4);
    display:flex;align-items:center;justify-content:center;
  "><div style="width:8px;height:8px;border-radius:50%;background:#4AC329"></div></div>`,
})

// ── Geographic Presets (Countries & Cities) ───────────────────
interface CityPreset {
  name: string
  center: [number, number]
  label: string
}

interface CountryPreset {
  code: string
  name: string
  flag: string
  cities: CityPreset[]
}

const COUNTRY_PRESETS: CountryPreset[] = [
  {
    code: 'US',
    name: 'United States',
    flag: '🇺🇸',
    cities: [
      { name: 'New York, NY', center: [40.7128, -74.006], label: 'New York (Manhattan)' },
      { name: 'Los Angeles, CA', center: [34.0522, -118.2437], label: 'Los Angeles (Downtown)' },
      { name: 'Chicago, IL', center: [41.8781, -87.6298], label: 'Chicago (Loop)' },
      { name: 'Miami, FL', center: [25.7617, -80.1918], label: 'Miami (Brickell)' },
      { name: 'Austin, TX', center: [30.2672, -97.7431], label: 'Austin (Downtown)' },
      { name: 'San Francisco, CA', center: [37.7749, -122.4194], label: 'San Francisco (SoMa)' },
      { name: 'Seattle, WA', center: [47.6062, -122.3321], label: 'Seattle (Downtown)' },
      { name: 'Houston, TX', center: [29.7604, -95.3698], label: 'Houston (Metro)' },
    ],
  },
  {
    code: 'UK',
    name: 'United Kingdom',
    flag: '🇬🇧',
    cities: [
      { name: 'London, UK', center: [51.5074, -0.1278], label: 'London (City & West End)' },
      { name: 'Manchester, UK', center: [53.4808, -2.2426], label: 'Manchester (Central)' },
      { name: 'Birmingham, UK', center: [52.4862, -1.8904], label: 'Birmingham (City Centre)' },
      { name: 'Leeds, UK', center: [53.8008, -1.5491], label: 'Leeds (Central)' },
    ],
  },
  {
    code: 'CA',
    name: 'Canada',
    flag: '🇨🇦',
    cities: [
      { name: 'Toronto, ON', center: [43.6532, -79.3832], label: 'Toronto (Downtown)' },
      { name: 'Vancouver, BC', center: [49.2827, -123.1207], label: 'Vancouver (Central)' },
      { name: 'Montreal, QC', center: [45.5017, -73.5673], label: 'Montreal (Ville-Marie)' },
      { name: 'Calgary, AB', center: [51.0447, -114.0719], label: 'Calgary (Downtown)' },
    ],
  },
  {
    code: 'PK',
    name: 'Pakistan',
    flag: '🇵🇰',
    cities: [
      { name: 'Karachi, Gulshan-e-Iqbal', center: [24.9215, 67.0979], label: 'Karachi (Gulshan-e-Iqbal)' },
      { name: 'Karachi, Clifton & DHA', center: [24.8138, 67.0305], label: 'Karachi (Clifton & DHA)' },
      { name: 'Lahore, Gulberg', center: [31.5204, 74.3587], label: 'Lahore (Gulberg / MM Alam)' },
      { name: 'Lahore, DHA', center: [31.4707, 74.3986], label: 'Lahore (DHA Phase 5)' },
      { name: 'Islamabad, Blue Area', center: [33.7215, 73.0722], label: 'Islamabad (Blue Area / F-7)' },
      { name: 'Rawalpindi, Saddar', center: [33.5973, 73.0551], label: 'Rawalpindi (Saddar / Cantt)' },
    ],
  },
  {
    code: 'AE',
    name: 'United Arab Emirates',
    flag: '🇦🇪',
    cities: [
      { name: 'Dubai, Downtown', center: [25.2048, 55.2708], label: 'Dubai (Downtown & DIFC)' },
      { name: 'Dubai, Marina', center: [25.0805, 55.1403], label: 'Dubai (Marina & JBR)' },
      { name: 'Abu Dhabi, Central', center: [24.4539, 54.3773], label: 'Abu Dhabi (Corniche)' },
      { name: 'Sharjah, City', center: [25.3463, 55.4209], label: 'Sharjah (City Centre)' },
    ],
  },
  {
    code: 'AU',
    name: 'Australia',
    flag: '🇦🇺',
    cities: [
      { name: 'Sydney, NSW', center: [-33.8688, 151.2093], label: 'Sydney (CBD)' },
      { name: 'Melbourne, VIC', center: [-37.8136, 144.9631], label: 'Melbourne (CBD)' },
      { name: 'Brisbane, QLD', center: [-27.4698, 153.0251], label: 'Brisbane (City)' },
    ],
  },
  {
    code: 'DE',
    name: 'Germany',
    flag: '🇩🇪',
    cities: [
      { name: 'Berlin, Germany', center: [52.52, 13.405], label: 'Berlin (Mitte)' },
      { name: 'Munich, Germany', center: [48.1351, 11.582], label: 'Munich (Altstadt)' },
      { name: 'Frankfurt, Germany', center: [50.1109, 8.6821], label: 'Frankfurt (Innenstadt)' },
    ],
  },
  {
    code: 'OTHER',
    name: 'Other Region',
    flag: '🌍',
    cities: [
      { name: 'Custom', center: [24.9215, 67.0979], label: 'Custom Global City' },
    ],
  },
]

// ── Niche Presets ─────────────────────────────────────────────
interface NicheOption {
  value: string
  categoryKey: BusinessCategory
  label: string
  icon: React.ElementType
}

const NICHE_OPTIONS: NicheOption[] = [
  { value: 'all', categoryKey: 'retail', label: 'All High-Intent Niches', icon: Sparkles },
  { value: 'web_dev', categoryKey: 'retail', label: 'Web Dev & Software Prospects', icon: Laptop },
  { value: 'restaurant', categoryKey: 'restaurant', label: 'Restaurants & Dining', icon: Utensils },
  { value: 'cafe', categoryKey: 'cafe', label: 'Cafés & Bakeries', icon: Coffee },
  { value: 'salon', categoryKey: 'salon', label: 'Salons, Spas & Beauty', icon: Scissors },
  { value: 'clinic', categoryKey: 'clinic', label: 'Clinics, Medical & Dental', icon: Activity },
  { value: 'auto_service', categoryKey: 'auto_service', label: 'Auto Repair & Services', icon: Wrench },
  { value: 'retail', categoryKey: 'retail', label: 'Retail & Boutique Shops', icon: ShoppingBag },
  { value: 'gym', categoryKey: 'gym', label: 'Gyms, Yoga & Fitness', icon: Dumbbell },
  { value: 'real_estate', categoryKey: 'real_estate', label: 'Real Estate Agencies', icon: Home },
  { value: 'pharmacy', categoryKey: 'pharmacy', label: 'Pharmacies & Healthcare', icon: Pill },
  { value: 'tailor', categoryKey: 'tailor', label: 'Tailors & Fashion Designers', icon: Scissors },
  { value: 'jewellery', categoryKey: 'jewellery', label: 'Jewellery & Luxury Stores', icon: Star },
  { value: 'electronics', categoryKey: 'electronics', label: 'Electronics & Gadgets', icon: Monitor },
  { value: 'catering', categoryKey: 'catering', label: 'Catering & Event Venues', icon: Utensils },
  { value: 'other', categoryKey: 'retail', label: 'Other Custom Niche...', icon: Store },
]

// ── Radius Options ────────────────────────────────────────────
const RADIUS_OPTIONS = [
  { value: 1, label: '1 km (Hyperlocal - 5 min walk)' },
  { value: 3, label: '3 km (Neighborhood Hub)' },
  { value: 5, label: '5 km (Commercial District - Recommended)' },
  { value: 10, label: '10 km (Metro Zone)' },
  { value: 15, label: '15 km (Greater City Area)' },
  { value: 25, label: '25 km (Regional Suburbs)' },
  { value: 50, label: '50 km (Metropolitan Radius)' },
]

// ── Score indicator ───────────────────────────────────────────
function ScoreBadge({ score }: { score: number }) {
  const isHigh = score >= 80
  const isMed = score >= 50 && score < 80
  const color = isHigh ? 'text-(--primary) bg-(--primary-soft) border-(--primary)/30' : isMed ? 'text-amber-500 bg-amber-500/10 border-amber-500/20' : 'text-(--text-muted) bg-black/5 border-black/10'

  return (
    <div className={cn('px-2.5 py-1 rounded-xl font-mono text-xs font-bold border flex items-center gap-1 shrink-0', color)}>
      <span className="text-[10px] uppercase font-sans font-bold tracking-wider">Score</span>
      <span className="text-sm font-black">{score}</span>
    </div>
  )
}

// ── Lead Card Component ───────────────────────────────────────
function LeadCard({ lead, index, onClick }: { lead: Lead; index: number; onClick: () => void }) {
  const isNoWebsite = lead.websiteStatus === 'none' || !lead.websiteUrl
  const isOutdated = lead.websiteStatus === 'outdated'

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.4), duration: 0.2 }}
    >
      <div
        onClick={onClick}
        className="clay-raised p-4 rounded-xl hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group space-y-3 border border-transparent hover:border-(--primary)/30"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded-md bg-(--primary-soft) text-(--primary)">
                {getCategoryLabel(lead.category)}
              </span>
              {lead.distance != null && (
                <span className="text-[10px] text-(--text-muted) font-mono">
                  {lead.distance < 1 ? `${Math.round(lead.distance * 1000)}m away` : `${lead.distance.toFixed(1)}km away`}
                </span>
              )}
            </div>
            <h3 className="text-sm font-bold text-(--text-primary) truncate group-hover:text-(--primary) transition-colors">
              {lead.name}
            </h3>
            <p className="text-xs text-(--text-secondary) truncate flex items-center gap-1 mt-1">
              <MapPin className="h-3 w-3 text-(--primary) shrink-0" />
              <span>{lead.address || 'Address registered on OSM'}</span>
            </p>
          </div>

          <ScoreBadge score={lead.score} />
        </div>

        {/* Digital Gap Signals */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-(--border-subtle) text-[11px]">
          {isNoWebsite ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-500/10 text-red-500 font-bold border border-red-500/20">
              <Globe className="h-3 w-3" /> No Website (Instant Lead)
            </span>
          ) : isOutdated ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-500 font-semibold border border-amber-500/20">
              <Clock className="h-3 w-3" /> Outdated Web Stack
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-(--primary-soft) text-(--primary) font-semibold">
              <Globe className="h-3 w-3" /> Active Website
            </span>
          )}

          {lead.phone && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/5 text-(--text-secondary) font-mono">
              <Phone className="h-3 w-3 text-(--primary)" /> {lead.phone}
            </span>
          )}

          <div className="ml-auto">
            <span className="text-xs text-(--primary) font-bold group-hover:underline flex items-center gap-0.5">
              <span>View Audit</span>
              <ArrowRight className="h-3 w-3" />
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ── Progress indicator ────────────────────────────────────────
function ProgressIndicator({ steps }: { steps: ProgressStep[] }) {
  return (
    <div className="space-y-2 p-4 clay-inset rounded-xl">
      {steps.map((step) => (
        <div key={step.id} className="flex items-center gap-2.5 text-xs">
          {step.status === 'done' && <CheckCircle2 className="h-4 w-4 text-(--primary) shrink-0" />}
          {step.status === 'active' && <Loader2 className="h-4 w-4 animate-spin text-(--primary) shrink-0" />}
          {step.status === 'pending' && <div className="h-4 w-4 rounded-full border-2 border-zinc-400 opacity-40 shrink-0" />}
          <span className={step.status === 'active' ? 'font-bold text-(--text-primary)' : 'text-(--text-secondary)'}>
            {step.label}
          </span>
        </div>
      ))}
    </div>
  )
}

// ── Rectangular Leaflet Map Component ─────────────────────────
interface RectangularMapPanelProps {
  center: [number, number]
  radius: number
  leads: Lead[]
  locationTitle: string
  onMapClick: (lat: number, lng: number) => void
  onLeadClick: (id: string) => void
}

function RectangularMapPanel({
  center,
  radius,
  leads,
  locationTitle,
  onMapClick,
  onLeadClick,
}: RectangularMapPanelProps) {
  const mapRef = useRef<L.Map | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const centerMarkerRef = useRef<L.Marker | null>(null)
  const rectRef = useRef<L.Rectangle | null>(null)
  const leadMarkersRef = useRef<L.Marker[]>([])

  // Initialize map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return
    const map = L.map(containerRef.current, {
      center,
      zoom: 13,
      zoomControl: false,
    })

    // Custom sleek zoom control on bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(map)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map)

    mapRef.current = map

    map.on('click', (e: L.LeafletMouseEvent) => {
      onMapClick(e.latlng.lat, e.latlng.lng)
    })

    return () => {
      map.remove()
      mapRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Draw RECTANGULAR boundary (not circle!) + center marker
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    centerMarkerRef.current?.remove()
    rectRef.current?.remove()

    centerMarkerRef.current = L.marker(center, { icon: searchCenterIcon })
      .addTo(map)
      .bindPopup(
        `<div style="font-family:sans-serif;font-size:12px;padding:2px">
          <strong style="color:#101010">Search Origin</strong><br/>
          <span style="color:#666">${locationTitle}</span><br/>
          <small style="color:#4AC329;font-weight:700">Click anywhere to move center</small>
        </div>`
      )

    // Calculate rectangular bounding box based on radius km
    const latDelta = radius / 111.0
    const lngDelta = radius / (111.0 * Math.cos((center[0] * Math.PI) / 180))
    const bounds = L.latLngBounds(
      [center[0] - latDelta, center[1] - lngDelta],
      [center[0] + latDelta, center[1] + lngDelta]
    )

    // Draw crisp rectangular scanning frame in Lime Green
    rectRef.current = L.rectangle(bounds, {
      color: '#4AC329',
      weight: 2,
      dashArray: '8, 6',
      fillColor: '#4AC329',
      fillOpacity: 0.05,
    }).addTo(map)

    map.flyTo(center, radius <= 3 ? 14 : radius <= 10 ? 13 : 12, { duration: 1.0 })
  }, [center, radius, locationTitle])

  // Update lead markers
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    leadMarkersRef.current.forEach((m) => m.remove())
    leadMarkersRef.current = []

    leads.forEach((lead) => {
      if (lead.latitude == null || lead.longitude == null) return
      const m = L.marker([lead.latitude, lead.longitude], { icon: makeLeadIcon(lead.score) })
        .addTo(map)
        .bindPopup(
          `<div style="min-width:180px;font-family:sans-serif;padding:3px">
            <div style="font-size:10px;font-weight:800;color:#4AC329;text-transform:uppercase">${getCategoryLabel(lead.category)}</div>
            <strong style="font-size:13px;color:#101010;display:block;margin:2px 0">${lead.name}</strong>
            <div style="font-size:11px;color:#666">${lead.address || ''}</div>
            <div style="margin-top:6px;display:flex;align-items:center;justify-content:space-between">
              <span style="font-size:10px;font-weight:700;color:${lead.score >= 80 ? '#4AC329' : '#f59e0b'}">Score: ${lead.score}/100</span>
              <span style="font-size:10px;color:#888">${lead.websiteStatus === 'none' ? 'No website' : 'Has website'}</span>
            </div>
          </div>`
        )
      m.on('click', () => onLeadClick(lead.id))
      leadMarkersRef.current.push(m)
    })
  }, [leads, onLeadClick])

  return (
    <div className="relative w-full h-full min-h-[540px] rounded-2xl overflow-hidden shadow-xl border border-(--border-subtle) clay-floating">
      {/* Top Floating Rectangular Map Pill */}
      <div className="absolute top-3 left-3 z-[1000] flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/95 dark:bg-black/90 backdrop-blur-md shadow-md border border-black/10 text-xs">
        <Compass className="w-3.5 h-3.5 text-(--primary)" />
        <span className="font-bold text-(--text-primary) truncate max-w-56">{locationTitle}</span>
        <span className="font-mono text-[10px] text-(--text-muted) px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10">
          {radius} km scan
        </span>
      </div>

      {leads.length > 0 && (
        <div className="absolute top-3 right-3 z-[1000] flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/95 dark:bg-black/90 backdrop-blur-md shadow-md border border-black/10 text-xs font-bold text-(--primary)">
          <MapPin className="w-3.5 h-3.5" />
          <span>{leads.length} Discovered</span>
        </div>
      )}

      {/* Map Viewport Container */}
      <div ref={containerRef} className="w-full h-full min-h-[540px]" />
    </div>
  )
}

// ── Main Lead Discovery Page ──────────────────────────────────
export function LeadDiscoveryPage() {
  const setSelectedLeadId = useAppStore((s) => s.setSelectedLeadId)
  const setDiscoveryResults = useAppStore((s) => s.setDiscoveryResults)
  const discoveryResults = useAppStore((s) => s.discoveryResults)

  // Geographic Selection State
  const [selectedCountryCode, setSelectedCountryCode] = useState('PK')
  const [selectedCityName, setSelectedCityName] = useState('Karachi, Gulshan-e-Iqbal')
  const [customCityText, setCustomCityText] = useState('')
  const [isCustomCity, setIsCustomCity] = useState(false)

  // Niche Selection State
  const [selectedNiche, setSelectedNiche] = useState('all')
  const [customNicheText, setCustomNicheText] = useState('')
  const [isCustomNiche, setIsCustomNiche] = useState(false)

  // Search Bar (Compact width) & Map Settings
  const [geoSearch, setGeoSearch] = useState('')
  const [geoLoading, setGeoLoading] = useState(false)
  const [mapCenter, setMapCenter] = useState<[number, number]>([24.9215, 67.0979])
  const [locationText, setLocationText] = useState('Karachi, Gulshan-e-Iqbal')
  const [radius, setRadius] = useState(5)

  // Opportunity & Pipeline Filters
  const [scoreFilter, setScoreFilter] = useState<'all' | 'high' | 'medium' | 'critical'>('all')
  const [websiteFilter, setWebsiteFilter] = useState<'all' | 'none' | 'outdated' | 'has_website'>('all')
  const [sortBy, setSortBy] = useState<'score' | 'distance' | 'name'>('score')
  const [viewMode, setViewMode] = useState<'split' | 'map' | 'list'>('split')

  // Execution State
  const [isRunning, setIsRunning] = useState(false)
  const [steps, setSteps] = useState<ProgressStep[]>([])
  const [hasSearched, setHasSearched] = useState(false)
  const [discoveryError, setDiscoveryError] = useState<string | null>(null)

  // Current Country configuration
  const currentCountry = useMemo(() => {
    return COUNTRY_PRESETS.find((c) => c.code === selectedCountryCode) || COUNTRY_PRESETS[0]
  }, [selectedCountryCode])

  // Handle Country Change
  const handleCountryChange = (code: string) => {
    setSelectedCountryCode(code)
    const country = COUNTRY_PRESETS.find((c) => c.code === code)
    if (country && country.cities.length > 0) {
      if (country.code === 'OTHER') {
        setIsCustomCity(true)
        setSelectedCityName('Custom')
      } else {
        setIsCustomCity(false)
        const defaultCity = country.cities[0]
        setSelectedCityName(defaultCity.name)
        setMapCenter(defaultCity.center)
        setLocationText(defaultCity.name)
      }
    }
  }

  // Handle City Change
  const handleCityChange = (cityName: string) => {
    if (cityName === 'CUSTOM_ENTRY') {
      setIsCustomCity(true)
      setSelectedCityName('Custom')
      return
    }

    setIsCustomCity(false)
    setSelectedCityName(cityName)
    const city = currentCountry.cities.find((c) => c.name === cityName)
    if (city) {
      setMapCenter(city.center)
      setLocationText(city.name)
    }
  }

  // Handle Niche Change
  const handleNicheChange = (nicheVal: string) => {
    setSelectedNiche(nicheVal)
    if (nicheVal === 'other') {
      setIsCustomNiche(true)
    } else {
      setIsCustomNiche(false)
    }
  }

  // Geocode Search input via Nominatim
  const geocodeSearch = async (queryOverride?: string) => {
    const q = (queryOverride || geoSearch || customCityText || locationText).trim()
    if (!q) return
    setGeoLoading(true)
    try {
      const resp = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1`,
        {
          headers: {
            'Accept-Language': 'en',
            'User-Agent': 'ClientPilotAI/1.0 (https://clientpilotai.internal; info@clientpilotai.com)',
          },
        }
      )
      const data = (await resp.json()) as { lat: string; lon: string; display_name: string }[]
      if (data[0]) {
        const lat = parseFloat(data[0].lat)
        const lng = parseFloat(data[0].lon)
        setMapCenter([lat, lng])
        const cleanName = data[0].display_name.split(',').slice(0, 3).join(', ')
        setLocationText(cleanName)
        setGeoSearch('')
      }
    } catch (e) {
      console.error('Geocode search failed:', e)
    } finally {
      setGeoLoading(false)
    }
  }

  const handleMapClick = useCallback((lat: number, lng: number) => {
    setMapCenter([lat, lng])
    setLocationText(`${lat.toFixed(4)}, ${lng.toFixed(4)}`)
  }, [])

  const handleLeadClick = useCallback((id: string) => {
    setSelectedLeadId(id)
  }, [setSelectedLeadId])

  // Run Real Discovery Pipeline
  const handleDiscover = async () => {
    if (isRunning) return
    setIsRunning(true)
    setDiscoveryError(null)
    setSteps([])
    setDiscoveryResults([])
    setHasSearched(true)

    // Determine category query parameters
    let categoriesToSend: string[] = []
    if (isCustomNiche && customNicheText.trim()) {
      categoriesToSend = [customNicheText.trim()]
    } else if (selectedNiche === 'all') {
      categoriesToSend = ['restaurant', 'retail', 'salon', 'clinic', 'auto_service', 'cafe', 'gym', 'real_estate']
    } else {
      categoriesToSend = [selectedNiche]
    }

    try {
      const result = await discoverLeads(
        {
          location: locationText,
          lat: mapCenter[0],
          lng: mapCenter[1],
          categories: categoriesToSend,
          radiusKm: radius,
        },
        (updatedSteps) => setSteps(updatedSteps)
      )

      setDiscoveryResults(result.leads || [])
    } catch (err: unknown) {
      console.error('[Discover Leads Error]:', err)
      const message = err instanceof Error ? err.message : 'Discovery scan encountered an issue. Please adjust filters.'
      setDiscoveryError(message)
    } finally {
      setIsRunning(false)
    }
  }

  // Filter & Sort Results
  const filtered = useMemo(() => {
    return discoveryResults
      .filter((l) => {
        // Score filter
        if (scoreFilter === 'critical' && l.score < 85) return false
        if (scoreFilter === 'high' && l.score < 75) return false
        if (scoreFilter === 'medium' && (l.score < 50 || l.score >= 75)) return false

        // Website filter
        if (websiteFilter === 'none' && l.websiteStatus !== 'none') return false
        if (websiteFilter === 'outdated' && l.websiteStatus !== 'outdated') return false
        if (websiteFilter === 'has_website' && l.websiteStatus !== 'has_website') return false

        return true
      })
      .sort((a, b) => {
        if (sortBy === 'score') return b.score - a.score
        if (sortBy === 'distance') return (a.distance || 0) - (b.distance || 0)
        return a.name.localeCompare(b.name)
      })
  }, [discoveryResults, scoreFilter, websiteFilter, sortBy])

  return (
    <div className="flex flex-col h-full overflow-hidden text-(--text-primary)">
      {/* ── Top Header & Multi-Filter Control Center ── */}
      <div className="p-4 sm:p-5 shrink-0 space-y-3.5 z-10 clay-floating rounded-none border-b border-(--border-subtle) bg-(--surface)">
        {/* Row 1: Title, View Switchers, Discovered Count */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-heading font-extrabold text-(--text-primary) tracking-tight">
                Opportunity Discovery Radar
              </h1>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-(--primary-soft) text-(--primary) uppercase">
                AI + OpenStreetMap
              </span>
            </div>
            <p className="text-xs text-(--text-secondary) mt-0.5">
              Target local commercial markets, identify digital vulnerability signals, and score high-converting clients.
            </p>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1.5 self-start sm:self-center">
            <button
              onClick={() => setViewMode('split')}
              title="Split View (Rectangular Map + Cards)"
              className={cn(
                'px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer',
                viewMode === 'split' ? 'clay-raised text-(--primary) border border-(--primary)/30' : 'clay-inset text-(--text-muted) hover:text-(--text-primary)'
              )}
            >
              <MapIcon className="h-3.5 w-3.5" />
              <span>Split View</span>
            </button>

            <button
              onClick={() => setViewMode('map')}
              title="Rectangular Map View"
              className={cn(
                'px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer',
                viewMode === 'map' ? 'clay-raised text-(--primary) border border-(--primary)/30' : 'clay-inset text-(--text-muted) hover:text-(--text-primary)'
              )}
            >
              <Crosshair className="h-3.5 w-3.5" />
              <span>Map Only</span>
            </button>

            <button
              onClick={() => setViewMode('list')}
              title="List Cards View"
              className={cn(
                'px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer',
                viewMode === 'list' ? 'clay-raised text-(--primary) border border-(--primary)/30' : 'clay-inset text-(--text-muted) hover:text-(--text-primary)'
              )}
            >
              <List className="h-3.5 w-3.5" />
              <span>Cards Grid</span>
            </button>
          </div>
        </div>

        {/* Row 2: Comprehensive Dropdowns (Country, City, Niche, Radius) + Compact Search Bar */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Country Dropdown */}
          <div className="flex items-center gap-1.5">
            <Label className="text-xs font-bold text-(--text-muted) shrink-0">Country:</Label>
            <select
              value={selectedCountryCode}
              onChange={(e) => handleCountryChange(e.target.value)}
              className="h-9 px-3 text-xs font-semibold rounded-xl clay-inset bg-(--bg) text-(--text-primary) border-none focus:outline-none cursor-pointer"
            >
              {COUNTRY_PRESETS.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* City Dropdown */}
          <div className="flex items-center gap-1.5">
            <Label className="text-xs font-bold text-(--text-muted) shrink-0">City / District:</Label>
            <select
              value={isCustomCity ? 'CUSTOM_ENTRY' : selectedCityName}
              onChange={(e) => handleCityChange(e.target.value)}
              className="h-9 px-3 text-xs font-semibold rounded-xl clay-inset bg-(--bg) text-(--text-primary) border-none focus:outline-none cursor-pointer max-w-48 truncate"
            >
              {currentCountry.cities.map((city) => (
                <option key={city.name} value={city.name}>
                  {city.label}
                </option>
              ))}
              <option value="CUSTOM_ENTRY">✏️ Other City (Type Custom)...</option>
            </select>
          </div>

          {/* Custom City Inline Input if Selected */}
          {isCustomCity && (
            <div className="flex items-center gap-1">
              <Input
                value={customCityText}
                onChange={(e) => setCustomCityText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && geocodeSearch(customCityText)}
                placeholder="Enter custom city or area..."
                className="h-9 w-44 text-xs clay-inset border-none bg-(--bg)"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={() => geocodeSearch(customCityText)}
                className="h-9 px-2 text-xs"
              >
                Go
              </Button>
            </div>
          )}

          {/* Niche Dropdown */}
          <div className="flex items-center gap-1.5">
            <Label className="text-xs font-bold text-(--text-muted) shrink-0">Niche:</Label>
            <select
              value={selectedNiche}
              onChange={(e) => handleNicheChange(e.target.value)}
              className="h-9 px-3 text-xs font-semibold rounded-xl clay-inset bg-(--bg) text-(--text-primary) border-none focus:outline-none cursor-pointer max-w-56 truncate"
            >
              {NICHE_OPTIONS.map((niche) => (
                <option key={niche.value} value={niche.value}>
                  {niche.label}
                </option>
              ))}
            </select>
          </div>

          {/* Custom Niche Inline Input if Selected */}
          {isCustomNiche && (
            <Input
              value={customNicheText}
              onChange={(e) => setCustomNicheText(e.target.value)}
              placeholder="e.g. Roofing, Chiropractor..."
              className="h-9 w-40 text-xs clay-inset border-none bg-(--bg)"
            />
          )}

          {/* Radius Selector */}
          <div className="flex items-center gap-1.5">
            <Label className="text-xs font-bold text-(--text-muted) shrink-0">Radius:</Label>
            <select
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="h-9 px-3 text-xs font-semibold rounded-xl clay-inset bg-(--bg) text-(--text-primary) border-none focus:outline-none cursor-pointer"
            >
              {RADIUS_OPTIONS.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          {/* Compact Location Search Input (Decreased Size) */}
          <div className="relative w-56 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-(--text-muted)" />
            <Input
              value={geoSearch}
              onChange={(e) => setGeoSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && geocodeSearch()}
              placeholder="Quick search area..."
              className="pl-8 pr-7 h-9 text-xs clay-inset border-none bg-(--bg)"
            />
            {geoSearch && (
              <button
                onClick={() => setGeoSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-(--text-muted) hover:text-(--text-primary)"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* Action Trigger Button */}
          <Button
            onClick={handleDiscover}
            isLoading={isRunning}
            disabled={isRunning}
            className="clay-btn-primary h-9 px-4 text-xs font-bold gap-2 ml-auto shrink-0 shadow-sm"
          >
            <Wand2 className="h-4 w-4" />
            <span>{isRunning ? 'Discovering…' : 'Discover Opportunities'}</span>
          </Button>
        </div>

        {/* Row 3: Opportunity Filters & Sorting Pills */}
        <div className="flex items-center justify-between gap-3 flex-wrap pt-1 border-t border-(--border-subtle) text-xs">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Score Filter */}
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-(--text-muted)">Min Score:</span>
              {(['all', 'medium', 'high', 'critical'] as const).map((filterBand) => (
                <button
                  key={filterBand}
                  onClick={() => setScoreFilter(filterBand)}
                  className={cn(
                    'px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer',
                    scoreFilter === filterBand
                      ? 'clay-raised text-(--primary) border border-(--primary)/30'
                      : 'clay-inset text-(--text-muted) hover:text-(--text-primary)'
                  )}
                >
                  {filterBand === 'all' ? 'All (0+)' : filterBand === 'medium' ? '50-74' : filterBand === 'high' ? '75+' : '85+ Critical'}
                </button>
              ))}
            </div>

            {/* Website Status Filter */}
            <div className="flex items-center gap-1.5 ml-2">
              <span className="font-bold text-(--text-muted)">Website Gap:</span>
              <button
                onClick={() => setWebsiteFilter(websiteFilter === 'none' ? 'all' : 'none')}
                className={cn(
                  'px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1',
                  websiteFilter === 'none'
                    ? 'bg-red-500/10 text-red-500 border border-red-500/30'
                    : 'clay-inset text-(--text-muted) hover:text-(--text-primary)'
                )}
              >
                <span>🚨 Missing Website</span>
              </button>
              <button
                onClick={() => setWebsiteFilter(websiteFilter === 'outdated' ? 'all' : 'outdated')}
                className={cn(
                  'px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1',
                  websiteFilter === 'outdated'
                    ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30'
                    : 'clay-inset text-(--text-muted) hover:text-(--text-primary)'
                )}
              >
                <span>⚠️ Outdated</span>
              </button>
            </div>
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-(--text-muted) font-semibold">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="h-8 px-2.5 text-xs font-semibold rounded-lg clay-inset bg-(--bg) text-(--text-primary) border-none cursor-pointer"
            >
              <option value="score">Highest Opportunity Score</option>
              <option value="distance">Shortest Distance</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Main Viewport Area (Map + Results) ── */}
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row overflow-hidden p-4 sm:p-5 gap-5">
        {/* Map Pane: Increased size, rectangular frame (no circle) */}
        {(viewMode === 'split' || viewMode === 'map') && (
          <div className={cn(
            'flex flex-col transition-all duration-300',
            viewMode === 'map' ? 'w-full h-full' : 'w-full lg:w-[58%] shrink-0 h-full'
          )}>
            <RectangularMapPanel
              center={mapCenter}
              radius={radius}
              leads={filtered}
              locationTitle={locationText}
              onMapClick={handleMapClick}
              onLeadClick={handleLeadClick}
            />
          </div>
        )}

        {/* Results Pane */}
        {(viewMode === 'split' || viewMode === 'list') && (
          <div className={cn(
            'flex-1 flex flex-col min-w-0 overflow-y-auto space-y-4 pr-1',
            viewMode === 'list' ? 'w-full max-w-5xl mx-auto' : ''
          )}>
            {/* Progress Notification */}
            <AnimatePresence>
              {(isRunning || (steps.length > 0 && discoveryResults.length === 0 && hasSearched)) && (
                <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <Card className="clay-floating p-5 rounded-2xl border-none">
                    <div className="flex items-center gap-2 mb-3">
                      <Loader2 className="h-4 w-4 animate-spin text-(--primary)" />
                      <p className="text-sm font-bold text-(--text-primary)">
                        Scanning Commercial Entities in {locationText}...
                      </p>
                    </div>
                    <ProgressIndicator steps={steps} />
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error Message with Friendly Alert & Retry Button */}
            {discoveryError && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-200 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg"
              >
                <div className="flex items-center gap-2.5">
                  <AlertCircle className="h-4 w-4 text-amber-400 shrink-0" />
                  <div>
                    <p className="font-semibold text-amber-300">
                      {discoveryError.toLowerCase().includes('busy') || discoveryError.toLowerCase().includes('temporarily')
                        ? 'Search service is busy'
                        : 'Lead Discovery Notice'}
                    </p>
                    <p className="text-amber-200/90 text-[11px] mt-0.5">{discoveryError}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <Button
                    onClick={handleDiscover}
                    disabled={isRunning}
                    size="sm"
                    variant="outline"
                    className="gap-1.5 h-7 text-xs border-amber-500/30 text-amber-300 hover:bg-amber-500/20"
                  >
                    <RotateCcw className="h-3 w-3" />
                    Retry
                  </Button>
                  <button
                    onClick={() => setDiscoveryError(null)}
                    className="text-amber-400/80 hover:text-amber-200 text-xs font-semibold px-2 py-1"
                  >
                    Dismiss
                  </button>
                </div>
              </motion.div>
            )}

            {/* Empty State before discovery */}
            {!hasSearched && !isRunning && (
              <div className="h-full flex flex-col items-center justify-center py-16 text-center clay-raised rounded-2xl p-6">
                <div className="h-16 w-16 rounded-2xl clay-inset flex items-center justify-center text-(--primary) mb-4">
                  <Radar className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold font-heading text-(--text-primary)">
                  Target & Discover Commercial Prospects
                </h3>
                <p className="text-xs text-(--text-secondary) max-w-md mt-1 leading-relaxed">
                  Select your target Country, City, and Niche above, adjust the rectangular scan radius, and click{' '}
                  <strong className="text-(--primary)">Discover Opportunities</strong>. ClientPilot AI will pinpoint businesses with missing websites or outdated tech stacks.
                </p>
              </div>
            )}

            {/* Discovered Leads List */}
            {hasSearched && !isRunning && (
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <p className="text-xs font-bold text-(--text-secondary)">
                    Showing <span className="text-(--text-primary)">{filtered.length}</span> of {discoveryResults.length} leads
                  </p>
                  <span className="text-[11px] font-mono text-(--primary) font-semibold">
                    {locationText}
                  </span>
                </div>

                {filtered.length === 0 ? (
                  <div className="p-8 text-center clay-inset rounded-2xl space-y-2">
                    <AlertCircle className="w-6 h-6 text-(--text-muted) mx-auto" />
                    <p className="text-xs font-bold text-(--text-primary)">No prospects match the active filter criteria.</p>
                    <p className="text-[11px] text-(--text-muted)">Try adjusting the Minimum Score or Website Gap filters above.</p>
                  </div>
                ) : (
                  <div className={cn(
                    'grid gap-3',
                    viewMode === 'list' ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'
                  )}>
                    {filtered.map((lead, idx) => (
                      <LeadCard
                        key={lead.id}
                        lead={lead}
                        index={idx}
                        onClick={() => handleLeadClick(lead.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
