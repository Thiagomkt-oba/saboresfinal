import { useState, useEffect } from 'react';

interface TrackingParameters {
  src: string | null;
  sck: string | null;
  utm_source: string | null;
  utm_campaign: string | null;
  utm_medium: string | null;
  utm_content: string | null;
  utm_term: string | null;
}

export const useTracking = () => {
  const [trackingParams, setTrackingParams] = useState<TrackingParameters>({
    src: null,
    sck: null,
    utm_source: null,
    utm_campaign: null,
    utm_medium: null,
    utm_content: null,
    utm_term: null
  });

  useEffect(() => {
    // Get URL parameters from current page
    const urlParams = new URLSearchParams(window.location.search);
    
    // Store tracking parameters in localStorage for persistence
    const params: TrackingParameters = {
      src: urlParams.get('src') || localStorage.getItem('tracking_src'),
      sck: urlParams.get('sck') || localStorage.getItem('tracking_sck'),
      utm_source: urlParams.get('utm_source') || localStorage.getItem('tracking_utm_source'),
      utm_campaign: urlParams.get('utm_campaign') || localStorage.getItem('tracking_utm_campaign'),
      utm_medium: urlParams.get('utm_medium') || localStorage.getItem('tracking_utm_medium'),
      utm_content: urlParams.get('utm_content') || localStorage.getItem('tracking_utm_content'),
      utm_term: urlParams.get('utm_term') || localStorage.getItem('tracking_utm_term')
    };

    // Save to localStorage for future use
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        localStorage.setItem(`tracking_${key}`, value);
      }
    });

    setTrackingParams(params);
  }, []);

  return trackingParams;
};