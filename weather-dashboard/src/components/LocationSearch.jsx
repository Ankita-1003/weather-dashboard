import React, { useState, useRef, useEffect, useContext } from "react";
import { Search, MapPin, Loader2, X } from "lucide-react";
import { WeatherContext } from "../context/WeatherContext";
import { fetchGeocoding } from "../services/weatherApi";
import dayjs from "dayjs";

const LocationSearch = () => {
  const { getWeatherData, selectedDate } = useContext(WeatherContext);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const timerRef = useRef(null);
  const wrapRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Debounced search via useEffect
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    if (query.trim().length < 2) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    timerRef.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetchGeocoding(query.trim());
        const list = Array.isArray(res?.data?.results) ? res.data.results : [];
        setResults(list);
        setShowDropdown(list.length > 0);
      } catch (e) {
        setResults([]);
        setShowDropdown(false);
      } finally {
        setIsLoading(false);
      }
    }, 350);

    return () => clearTimeout(timerRef.current);
  }, [query]);

  const handleSelect = (loc) => {
    const name = [loc.name, loc.admin1, loc.country_code].filter(Boolean).join(", ");
    setQuery(name);
    setShowDropdown(false);
    setResults([]);
    getWeatherData(
      loc.latitude,
      loc.longitude,
      name,
      selectedDate || dayjs().format("YYYY-MM-DD")
    );
  };

  return (
    <div ref={wrapRef} style={{ position: "relative", width: "100%", maxWidth: "440px" }}>
      {/* Input */}
      <div style={{ position: "relative" }}>
        <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
          {isLoading
            ? <Loader2 size={16} style={{ color: "#ffd60a", animation: "spin 1s linear infinite" }} />
            : <Search size={16} style={{ color: "#8e94af" }} />
          }
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { if (results.length > 0) setShowDropdown(true); }}
          placeholder="Search location..."
          autoComplete="off"
          style={{
            width: "100%",
            boxSizing: "border-box",
            paddingLeft: "42px",
            paddingRight: query ? "38px" : "16px",
            paddingTop: "10px",
            paddingBottom: "10px",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "9999px",
            color: "#ffffff",
            fontSize: "13px",
            fontWeight: "600",
            outline: "none",
          }}
        />
        {query && (
          <button
            onClick={() => { setQuery(""); setResults([]); setShowDropdown(false); }}
            style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#8e94af", display: "flex", alignItems: "center" }}
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && results.length > 0 && (
        <div style={{
          position: "absolute",
          top: "calc(100% + 6px)",
          left: 0,
          right: 0,
          zIndex: 99999,
          background: "#1a1c30",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: "14px",
          overflow: "hidden",
          boxShadow: "0 16px 48px rgba(0,0,0,0.6)",
        }}>
          {results.slice(0, 6).map((loc, i) => (
            <button
              key={loc.id ?? i}
              onMouseDown={(e) => { e.preventDefault(); handleSelect(loc); }}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "11px 14px",
                background: "none",
                border: "none",
                borderBottom: i < Math.min(results.length, 6) - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
                cursor: "pointer",
                textAlign: "left",
                color: "#fff",
                transition: "background 0.12s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,214,10,0.08)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
            >
              <MapPin size={13} style={{ color: "#ffd60a", flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "13px", fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {loc.name}
                </div>
                <div style={{ fontSize: "11px", color: "#8e94af", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {[loc.admin1, loc.country].filter(Boolean).join(", ")}
                </div>
              </div>
              <span style={{ fontSize: "10px", fontWeight: 900, color: "#8e94af", opacity: 0.5, letterSpacing: "0.08em", flexShrink: 0 }}>
                {loc.country_code}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationSearch;
