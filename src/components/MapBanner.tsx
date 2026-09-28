/**
 * MapBanner.tsx
 *
 * Shared map viewport component implementing Leaflet integration.
 * References:
 * - AGENTS.md section 3 & 4 (FR-10, FR-11, record-detail, shell)
 * - state-mapping-rules.md (PositionLabel: Captured, Low Accuracy, Simulated ['Approximate'], Unknown; BlockSafetyFlag: Safe, Unsafe)
 * - react-architecture-rules.md (Shared component in src/components/)
 *
 * OPEN QUESTION Q7 / PLACEHOLDER TILE SOURCE:
 * Map provider remains unconfirmed in PRD baseline Open Questions (Q7).
 * OpenStreetMap public tiles are wired as a keyless, cost-free placeholder.
 *
 * PRD CONSTRAINTS:
 * 1. Read-only map: Boundary creation and vertex manipulation are mobile offline GPS tasks (FR-08)
 *    and strictly excluded here.
 * 2. Position quality reporting: Every marker popup/label displays its position quality.
 * 3. Exact location privacy: Exact coordinates are ONLY rendered if position is 'Captured'.
 *    Non-captured positions (Approximate, Low Accuracy, Unknown) never render exact coordinate readouts.
 * 4. Safety coloring: Polygon and marker colors strictly reflect safetyFlag ('Safe' | 'Unsafe').
 */

import React, { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import type * as LeafletType from 'leaflet';
import {
  PositionLabel,
  getPositionDisplayLabel,
  BlockSafetyFlag,
  Coordinate,
  PersonMarker,
} from '../types/states';

export type { Coordinate, PersonMarker };

export interface MapBannerProps {
  positionType?: PositionLabel;
  treeCoordinate?: Coordinate;
  blockPolygon?: Coordinate[];
  blockName?: string;
  safetyFlag?: BlockSafetyFlag;
  peopleMarkers?: PersonMarker[];
  children?: React.ReactNode;
  className?: string;
  height?: string;
}

export const MapBanner: React.FC<MapBannerProps> = ({
  positionType,
  treeCoordinate,
  blockPolygon,
  blockName,
  safetyFlag = 'Safe',
  peopleMarkers,
  children,
  className = '',
  height = 'h-56 sm:h-64',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletType.Map | null>(null);

  // Position quality mapping per state-mapping-rules.md
  const effectivePositionType: PositionLabel = positionType || 'Simulated';
  const displayPositionLabel = getPositionDisplayLabel(effectivePositionType);
  const isCaptured = effectivePositionType === 'Captured';

  // Binary safety coloring per state-mapping-rules.md & design-tokens.json:
  // Safe: brand.700 (#2E5421) stroke, brand.500 (#3C7429) fill
  // Unsafe: error.600 (#C54A40) stroke, error.500 (#F1574C) fill
  const isUnsafe = safetyFlag === 'Unsafe';
  const strokeColor = isUnsafe ? '#C54A40' : '#2E5421';
  const fillColor = isUnsafe ? '#F1574C' : '#3C7429';

  useEffect(() => {
    let isMounted = true;

    const initializeMap = async () => {
      if (!mapContainerRef.current || !isMounted) return;

      // Dynamically load Leaflet to avoid Node/SSR window evaluation errors
      const LModule = await import('leaflet');
      if (!isMounted || !mapContainerRef.current) return;
      const L = (LModule.default || LModule) as unknown as typeof LeafletType;

      // Clean up any previously attached map instance on this container
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      if ((mapContainerRef.current as any)._leaflet_id) {
        delete (mapContainerRef.current as any)._leaflet_id;
      }

      // Initialize map container with read-only controls (no drawing or editing per PRD)
      const map = L.map(mapContainerRef.current, {
        zoomControl: true,
        attributionControl: true,
        dragging: true,
        scrollWheelZoom: false, // Prevents interfering with page scrolling
        doubleClickZoom: true,
      });

      mapInstanceRef.current = map;

      /**
       * PLACEHOLDER TILE LAYER: OpenStreetMap Public Tiles
       * Unresolved per PRD Section 11 / Open Questions Q7.
       * Used as keyless, zero-cost placeholder until production provider is decided.
       */
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors (Placeholder Tile Source)',
        maxZoom: 19,
      }).addTo(map);

      let hasFittedBounds = false;

      // 1. Render Block Polygon Boundary if provided
      if (blockPolygon && blockPolygon.length > 2) {
        const latLngs: LeafletType.LatLngExpression[] = blockPolygon.map((p) => [p.lat, p.lng]);

        const polygon = L.polygon(latLngs, {
          color: strokeColor,
          fillColor: fillColor,
          fillOpacity: 0.22,
          weight: 2.5,
          interactive: true,
        }).addTo(map);

        const polygonPopupHtml = `
          <div style="font-family: inherit; font-size: 12px; line-height: 1.45; padding: 4px; min-width: 170px;">
            <div style="font-weight: 700; color: #1C211B; font-size: 13px; margin-bottom: 4px;">
              ${blockName || 'Mapped Block Boundary'}
            </div>
            <div style="color: #5E625E; font-size: 11px; margin-bottom: 4px;">
              Perimeter: ${blockPolygon.length} boundary GPS points
            </div>
            <div style="display: inline-flex; align-items: center; gap: 4px; font-weight: 600; font-size: 11px; color: ${strokeColor}; background: ${isUnsafe ? '#FEEEED' : '#ECFAF7'}; border: 1px solid ${isUnsafe ? '#FAC4C0' : '#BEEFE3'}; padding: 2px 6px; border-radius: 4px;">
              <span>Status: ${safetyFlag}</span>
            </div>
          </div>
        `;
        polygon.bindPopup(polygonPopupHtml);

        map.fitBounds(polygon.getBounds(), {
          padding: [28, 28],
          maxZoom: 16,
        });
        hasFittedBounds = true;
      }

      // 2. Render Tree Marker if coordinate provided
      if (treeCoordinate) {
        const pinHtml = `
          <div style="
            width: 30px;
            height: 30px;
            background-color: ${strokeColor};
            border: 2.5px solid #FAFCFE;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.25);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
          ">
            <div style="
              width: 8px;
              height: 8px;
              background-color: #FAFCFE;
              border-radius: 50%;
              transform: rotate(45deg);
            "></div>
          </div>
        `;

        const customMarkerIcon = L.divIcon({
          html: pinHtml,
          className: 'tree-position-pin',
          iconSize: [30, 30],
          iconAnchor: [15, 30],
          popupAnchor: [0, -30],
        });

        const marker = L.marker([treeCoordinate.lat, treeCoordinate.lng], {
          icon: customMarkerIcon,
          draggable: false, // PRD constraint: Strictly non-draggable
        }).addTo(map);

        // PRD Privacy & Reporting Rules (Rule 4 & 5):
        // Never render exact coordinates for non-Captured positions.
        const coordinateHtml = isCaptured
          ? `<div style="font-size: 11px; font-family: monospace; color: #1C211B; background: #EEF0F2; padding: 3px 6px; border-radius: 4px; margin-top: 5px;">
               GPS: ${treeCoordinate.lat.toFixed(5)}, ${treeCoordinate.lng.toFixed(5)}
             </div>`
          : `<div style="font-size: 11px; color: #5E625E; font-style: italic; margin-top: 5px; background: #F5F8F4; padding: 3px 6px; border-radius: 4px;">
               Coordinates withheld (Position: ${displayPositionLabel})
             </div>`;

        const markerPopupHtml = `
          <div style="font-family: inherit; font-size: 12px; line-height: 1.45; padding: 4px; min-width: 180px;">
            ${blockName ? `<div style="font-size: 10px; font-weight: 700; color: #7B7E7B; text-transform: uppercase; letter-spacing: 0.05em;">${blockName}</div>` : ''}
            <div style="font-weight: 700; color: #1C211B; font-size: 13px; margin: 2px 0 4px 0;">
              Tree Position
            </div>
            <div style="display: inline-flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 600; background: #F5F8F4; border: 1px solid #D8E3D4; padding: 2px 6px; border-radius: 4px; color: #2E5421;">
              <span>Quality: ${displayPositionLabel}</span>
            </div>
            ${coordinateHtml}
            <div style="font-size: 11px; margin-top: 5px; color: ${strokeColor}; font-weight: 600;">
              Block Safety: ${safetyFlag}
            </div>
          </div>
        `;

        marker.bindPopup(markerPopupHtml);

        // Tooltip showing required position quality
        marker.bindTooltip(`Position: ${displayPositionLabel}`, {
          direction: 'top',
          offset: [0, -30],
        });

        if (!hasFittedBounds) {
          map.setView([treeCoordinate.lat, treeCoordinate.lng], 16);
          hasFittedBounds = true;
        }
      }

      // 3. Render People Markers (Officers & Custodians) anchored to block / sub-block
      if (peopleMarkers && peopleMarkers.length > 0) {
        // Group markers by coordinate location to stack people sharing the same block/sub-block
        const locationGroups = new Map<string, PersonMarker[]>();
        peopleMarkers.forEach((pm) => {
          const key = `${pm.coordinate.lat.toFixed(5)},${pm.coordinate.lng.toFixed(5)}`;
          const existing = locationGroups.get(key) || [];
          existing.push(pm);
          locationGroups.set(key, existing);
        });

        const peopleCoords: LeafletType.LatLngExpression[] = [];

        locationGroups.forEach((group) => {
          const primary = group[0];
          const count = group.length;
          const isStacked = count > 1;
          const lat = primary.coordinate.lat;
          const lng = primary.coordinate.lng;
          peopleCoords.push([lat, lng]);

          const effectivePos = primary.positionType || 'Simulated';
          const posLabel = getPositionDisplayLabel(effectivePos);
          const isCapturedPos = effectivePos === 'Captured';

          let markerHtml = '';

          if (primary.personType === 'officer') {
            // Task 2: Color each officer marker by the real, locked UserState (Active, Suspended, Pending, Deactivated).
            // Do NOT use Online/Offline for marker color!
            const officerState = primary.userState || 'Active';
            let stateColor = '#2E5421'; // Active (brand.700 green)
            if (officerState === 'Suspended') {
              stateColor = '#C54A40'; // Suspended (error.600 red)
            } else if (officerState === 'Pending') {
              stateColor = '#D89859'; // Pending (warning.500 warm amber)
            } else if (officerState === 'Deactivated') {
              stateColor = '#7B7E7B'; // Deactivated (neutral.500 slate grey)
            }

            if (isStacked) {
              markerHtml = `
                <div style="
                  position: relative;
                  width: 34px;
                  height: 34px;
                  border-radius: 50% 50% 50% 0;
                  transform: rotate(-45deg);
                  background-color: ${stateColor};
                  border: 2.5px solid #FAFCFE;
                  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.28);
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  cursor: pointer;
                ">
                  <div style="transform: rotate(45deg); display: flex; align-items: center; justify-content: center;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  </div>
                  <div style="
                    position: absolute;
                    top: -7px;
                    right: -7px;
                    transform: rotate(45deg);
                    background: #1C211B;
                    color: #FAFCFE;
                    font-size: 10px;
                    font-weight: 700;
                    width: 18px;
                    height: 18px;
                    border-radius: 50%;
                    border: 1.5px solid #FAFCFE;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.25);
                  ">${count}</div>
                </div>
              `;
            } else {
              markerHtml = `
                <div style="
                  position: relative;
                  width: 32px;
                  height: 32px;
                  border-radius: 50% 50% 50% 0;
                  transform: rotate(-45deg);
                  background-color: ${stateColor};
                  border: 2.5px solid #FAFCFE;
                  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.25);
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  cursor: pointer;
                ">
                  <div style="transform: rotate(45deg); display: flex; align-items: center; justify-content: center;">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>
                </div>
              `;
            }
          } else {
            // Task 3: Differentiate each custodian marker by Custodian Type (Individual vs Block)
            // Distinct icon SHAPE rather than color, using a neutral navy/slate palette (#1B365D / #34495E)
            // so block safety (green/red), officer state (green/red/amber/grey), and custodian type do not blur.
            const isBlockType = primary.custodianType === 'Block';
            const custodianBg = isBlockType ? '#1B365D' : '#34495E';

            if (isBlockType) {
              // Block Custodian: Square shape with rounded corners & 4-box cluster icon
              markerHtml = `
                <div style="
                  position: relative;
                  width: 32px;
                  height: 32px;
                  background-color: ${custodianBg};
                  border: 2.5px solid #FAFCFE;
                  border-radius: 7px;
                  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.25);
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  cursor: pointer;
                ">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                  </svg>
                  ${isStacked ? `
                    <div style="
                      position: absolute;
                      top: -6px;
                      right: -6px;
                      background: #1C211B;
                      color: #FAFCFE;
                      font-size: 10px;
                      font-weight: 700;
                      width: 18px;
                      height: 18px;
                      border-radius: 50%;
                      border: 1.5px solid #FAFCFE;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      box-shadow: 0 2px 4px rgba(0,0,0,0.25);
                    ">${count}</div>
                  ` : ''}
                </div>
              `;
            } else {
              // Individual Custodian: Diamond (rotated 45deg) with single user silhouette
              markerHtml = `
                <div style="
                  position: relative;
                  width: 30px;
                  height: 30px;
                  background-color: ${custodianBg};
                  border: 2.5px solid #FAFCFE;
                  transform: rotate(45deg);
                  border-radius: 4px;
                  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.25);
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  cursor: pointer;
                ">
                  <div style="transform: rotate(-45deg); display: flex; align-items: center; justify-content: center;">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>
                  ${isStacked ? `
                    <div style="
                      position: absolute;
                      top: -8px;
                      right: -8px;
                      transform: rotate(-45deg);
                      background: #1C211B;
                      color: #FAFCFE;
                      font-size: 10px;
                      font-weight: 700;
                      width: 18px;
                      height: 18px;
                      border-radius: 50%;
                      border: 1.5px solid #FAFCFE;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      box-shadow: 0 2px 4px rgba(0,0,0,0.25);
                    ">${count}</div>
                  ` : ''}
                </div>
              `;
            }
          }

          const icon = L.divIcon({
            html: markerHtml,
            className: 'person-map-marker',
            iconSize: [34, 34],
            iconAnchor: [17, 34],
            popupAnchor: [0, -34],
          });

          const marker = L.marker([lat, lng], {
            icon,
            draggable: false, // PRD constraint
          }).addTo(map);

          // Task 5: Position privacy rule - withhold coordinates unless Captured
          const coordinateHtml = isCapturedPos
            ? `<div style="font-size: 11px; font-family: monospace; color: #1C211B; background: #EEF0F2; padding: 3px 6px; border-radius: 4px; margin-top: 4px;">
                 GPS: ${lat.toFixed(5)}, ${lng.toFixed(5)} (Captured)
               </div>`
            : `<div style="font-size: 11px; color: #5E625E; font-style: italic; margin-top: 4px; background: #F5F8F4; padding: 3px 6px; border-radius: 4px;">
                 Coordinates withheld (Position: ${posLabel})
               </div>`;

          // Task 5: Signed-URL avatar thumbnails and person cards
          const peopleItemsHtml = group.map((p) => {
            const isOfficer = p.personType === 'officer';
            const badgeLabel = isOfficer ? (p.userState || 'Active') : `${p.custodianType || 'Individual'} Custodian`;

            let badgeStyle = 'background: #ECFAF7; color: #2E5421; border: 1px solid #94B389;';
            if (isOfficer) {
              if (p.userState === 'Suspended') badgeStyle = 'background: #FEEEED; color: #C54A40; border: 1px solid #FAC4C0;';
              else if (p.userState === 'Pending') badgeStyle = 'background: #FDF6E9; color: #94672C; border: 1px solid #F3D4A8;';
              else if (p.userState === 'Deactivated') badgeStyle = 'background: #EEF0F2; color: #5E625E; border: 1px solid #CBCDCE;';
            } else {
              badgeStyle = 'background: #EDF2FD; color: #1B365D; border: 1px solid #B8C7E8;';
            }

            const avatarHtml = p.avatarSignedUrl
              ? `<img src="${p.avatarSignedUrl}" alt="${p.name}" style="width: 28px; height: 28px; border-radius: 50%; object-fit: cover;" />`
              : `<div style="width: 28px; height: 28px; border-radius: 50%; background: #EEF0F2; color: #1C211B; font-weight: 700; font-size: 11px; display: flex; align-items: center; justify-content: center;">
                   ${p.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                 </div>`;

            return `
              <div style="display: flex; align-items: center; gap: 8px; padding: 6px 0; border-top: 1px solid #EEF0F2;">
                ${avatarHtml}
                <div style="flex: 1; min-width: 0;">
                  <div style="display: flex; align-items: center; justify-content: space-between; gap: 6px;">
                    <span style="font-weight: 700; color: #1C211B; font-size: 12px;">${p.name}</span>
                    <span style="font-size: 9px; font-weight: 600; padding: 1px 5px; border-radius: 9999px; ${badgeStyle}">
                      ${badgeLabel}
                    </span>
                  </div>
                  <div style="font-size: 10px; color: #5E625E; margin-top: 1px;">
                    ${p.role || (isOfficer ? 'Field Officer' : 'Custodian')}
                    ${p.phone ? ` &bull; ${p.phone}` : ''}
                  </div>
                </div>
              </div>
            `;
          }).join('');

          const popupHtml = `
            <div style="font-family: inherit; font-size: 12px; line-height: 1.45; padding: 4px; min-width: 220px; max-width: 280px;">
              <div style="font-size: 10px; font-weight: 700; color: #7B7E7B; text-transform: uppercase; letter-spacing: 0.05em;">
                ${primary.blockName || 'Assigned Block'} ${primary.subBlockName ? `&bull; ${primary.subBlockName}` : ''}
              </div>
              <div style="font-weight: 700; color: #1C211B; font-size: 13px; margin: 2px 0 4px 0;">
                ${isStacked ? `${count} People Stacked` : primary.name}
              </div>
              <div style="display: inline-flex; align-items: center; gap: 4px; font-size: 10px; font-weight: 600; background: #F5F8F4; border: 1px solid #D8E3D4; padding: 2px 6px; border-radius: 4px; color: #2E5421;">
                <span>Position: ${posLabel}</span>
              </div>
              ${coordinateHtml}
              <div style="margin-top: 6px;">
                ${peopleItemsHtml}
              </div>
            </div>
          `;

          marker.bindPopup(popupHtml);
          marker.bindTooltip(
            isStacked
              ? `${count} Assigned: ${group.map((p) => p.name).join(', ')}`
              : `${primary.name} (${primary.personType === 'officer' ? primary.userState : primary.custodianType})`,
            { direction: 'top', offset: [0, -34] }
          );
        });

        // Fit map bounds to encompass all people markers if no single tree coordinate was explicitly focused
        if (peopleCoords.length > 0 && !treeCoordinate) {
          if (peopleCoords.length === 1) {
            map.setView(peopleCoords[0], 15);
          } else {
            map.fitBounds(L.latLngBounds(peopleCoords), {
              padding: [36, 36],
              maxZoom: 16,
            });
          }
          hasFittedBounds = true;
        }
      }

      // 4. Fallback default center (Nigeria Kano baseline) if no coordinates passed
      if (!hasFittedBounds) {
        map.setView([12.0022, 8.5919], 13);
      }

      // Responsive layout adjustment
      setTimeout(() => {
        if (isMounted && mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 100);
    };

    initializeMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [
    treeCoordinate?.lat,
    treeCoordinate?.lng,
    blockPolygon,
    blockName,
    safetyFlag,
    positionType,
    effectivePositionType,
    displayPositionLabel,
    isCaptured,
    strokeColor,
    fillColor,
    peopleMarkers,
  ]);

  return (
    <div
      className={`relative w-full ${height} rounded-xl overflow-hidden border border-[#E2E5E6] bg-[#ECF1EA] shadow-inner ${className}`}
    >
      {/* Real Leaflet Map Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Top-Left: Block Name Tag */}
      {blockName && (
        <div className="absolute top-3 left-3 z-[1000] bg-[#FAFCFE]/95 backdrop-blur-xs px-3 py-1 rounded-md border border-[#E2E5E6] text-xs font-semibold text-[#1C211B] shadow-sm pointer-events-none">
          {blockName}
        </div>
      )}

      {/* Top-Right: Position Accuracy Tag (Simulated displays as 'Approximate' per state-mapping-rules.md) */}
      {positionType && (
        <div className="absolute top-3 right-3 z-[1000] bg-[#FAFCFE]/95 backdrop-blur-xs px-3 py-1 rounded-md border border-[#E2E5E6] text-xs font-medium text-[#424641] shadow-sm flex items-center gap-1.5 pointer-events-none">
          <span className={`w-1.5 h-1.5 rounded-full ${isUnsafe ? 'bg-[#C54A40]' : 'bg-[#3C7429]'}`} />
          <span>Position: {displayPositionLabel}</span>
        </div>
      )}

      {/* Top-Right: Safety Tag if no positionType */}
      {safetyFlag && !positionType && (
        <div className="absolute top-3 right-3 z-[1000] bg-[#FAFCFE]/95 backdrop-blur-xs px-3 py-1 rounded-md border border-[#E2E5E6] text-xs font-semibold shadow-sm flex items-center gap-1.5 pointer-events-none">
          <span className={`w-1.5 h-1.5 rounded-full ${isUnsafe ? 'bg-[#C54A40]' : 'bg-[#3C7429]'}`} />
          <span className={isUnsafe ? 'text-[#C54A40]' : 'text-[#2E5421]'}>
            Status: {safetyFlag}
          </span>
        </div>
      )}

      {/* Bottom-Left: Coordinate readout ONLY for 'Captured' positions (PRD Rule 5) */}
      {treeCoordinate && isCaptured && (
        <div className="absolute bottom-3 left-3 z-[1000] bg-[#FAFCFE]/95 backdrop-blur-xs px-2.5 py-1 rounded-md border border-[#E2E5E6] text-[11px] font-mono text-[#424641] shadow-sm pointer-events-none">
          GPS: {treeCoordinate.lat.toFixed(4)}, {treeCoordinate.lng.toFixed(4)} (Captured)
        </div>
      )}

      {/* Custom Children Slot */}
      {children}
    </div>
  );
};
