import React, { useState, useEffect } from 'react';
import LocationPicker from './LocationPicker';
import { Input, Icon, Button } from '../atoms';

interface LocationFormFieldProps {
  label: string;
  name: string;
  value?: [number, number];
  onChange: (coords: [number, number]) => void;
  error?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  mapHeight?: string;
  defaultCenter?: [number, number];
  showManualInput?: boolean;
  className?: string;
}

const LocationFormField: React.FC<LocationFormFieldProps> = ({
  label,
  name,
  value,
  onChange,
  error,
  helperText,
  required = false,
  disabled = false,
  mapHeight = '400px',
  defaultCenter = [-17.3935, -66.1570],
  showManualInput = false,
  className = '',
}) => {
  const fieldId = `location-field-${name}`;
  const [manualInputVisible, setManualInputVisible] = useState(false);
  const [latInput, setLatInput] = useState('');
  const [lngInput, setLngInput] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Sync manual inputs with value prop
  useEffect(() => {
    if (value) {
      setLatInput(value[0].toString());
      setLngInput(value[1].toString());
    }
  }, [value]);

  const validateCoordinate = (lat: number, lng: number): string | null => {
    if (isNaN(lat) || isNaN(lng)) {
      return 'Las coordenadas deben ser números válidos';
    }
    if (lat < -90 || lat > 90) {
      return 'La latitud debe estar entre -90 y 90';
    }
    if (lng < -180 || lng > 180) {
      return 'La longitud debe estar entre -180 y 180';
    }
    return null;
  };

  const handleManualInputChange = () => {
    const lat = parseFloat(latInput);
    const lng = parseFloat(lngInput);

    const error = validateCoordinate(lat, lng);
    if (error) {
      setValidationError(error);
      return;
    }

    setValidationError(null);
    onChange([lat, lng]);
  };

  const handleLatInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLatInput(e.target.value);
  };

  const handleLngInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLngInput(e.target.value);
  };

  const handleManualInputBlur = () => {
    if (latInput && lngInput) {
      handleManualInputChange();
    }
  };

  const displayError = error || validationError;

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Label */}
      {label && (
        <label htmlFor={fieldId} className="block text-sm font-medium text-foreground">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}

      {/* Location Picker */}
      <LocationPicker
        value={value}
        onChange={onChange}
        defaultCenter={defaultCenter}
        height={mapHeight}
        disabled={disabled}
        showCoordinates={!showManualInput || !manualInputVisible}
        showCurrentLocationButton={true}
      />

      {/* Manual Input Toggle & Fields */}
      {showManualInput && (
        <div className="space-y-3">
          {/* Toggle Button */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setManualInputVisible(!manualInputVisible)}
            disabled={disabled}
          >
            <Icon name="edit" size="sm" className="mr-2" />
            {manualInputVisible ? 'Ocultar entrada manual' : 'Entrada manual de coordenadas'}
          </Button>

          {/* Manual Input Fields */}
          {manualInputVisible && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-muted/30 rounded-lg border border-border">
              <div>
                <label
                  htmlFor={`${fieldId}-lat`}
                  className="block text-sm font-medium text-foreground mb-1"
                >
                  Latitud
                </label>
                <Input
                  id={`${fieldId}-lat`}
                  type="number"
                  step="any"
                  value={latInput}
                  onChange={handleLatInputChange}
                  onBlur={handleManualInputBlur}
                  placeholder="-17.3935"
                  disabled={disabled}
                  variant={validationError ? 'error' : 'default'}
                />
                <p className="text-xs text-muted-foreground mt-1">Entre -90 y 90</p>
              </div>

              <div>
                <label
                  htmlFor={`${fieldId}-lng`}
                  className="block text-sm font-medium text-foreground mb-1"
                >
                  Longitud
                </label>
                <Input
                  id={`${fieldId}-lng`}
                  type="number"
                  step="any"
                  value={lngInput}
                  onChange={handleLngInputChange}
                  onBlur={handleManualInputBlur}
                  placeholder="-66.1570"
                  disabled={disabled}
                  variant={validationError ? 'error' : 'default'}
                />
                <p className="text-xs text-muted-foreground mt-1">Entre -180 y 180</p>
              </div>

              <div className="sm:col-span-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handleManualInputChange}
                  disabled={disabled || !latInput || !lngInput}
                  className="w-full sm:w-auto"
                >
                  Aplicar coordenadas
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error Display */}
      {displayError && (
        <div
          id={`${fieldId}-error`}
          className="flex items-center space-x-1 text-sm text-error"
          role="alert"
        >
          <Icon name="error" size="sm" />
          <span>{displayError}</span>
        </div>
      )}

      {/* Helper Text */}
      {helperText && !displayError && (
        <p id={`${fieldId}-helper`} className="text-sm text-muted-foreground">
          {helperText}
        </p>
      )}
    </div>
  );
};

export default LocationFormField;
