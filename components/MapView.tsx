import { Place } from '@/types/places';
import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

interface MapViewProps {
  places: Place[];
  isPlaceOpen?: (place: Place) => boolean;
  // --- Nuove Props per l'Admin ---
  selectable?: boolean;
  onLocationSelect?: (coords: { latitude: number; longitude: number }) => void;
  selectedLocation?: { lat: number; lng: number } | null;
}

const MapComponent: React.FC<MapViewProps> = ({
  places,
  isPlaceOpen,
  selectable = false, // Default: sola lettura
  onLocationSelect,
  selectedLocation
}) => {
  if (Platform.OS === 'web') {
    // For web, show an embedded Google Map centered on Milano
    return (
      <View style={styles.container}>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5595.0!2d9.1900!3d45.4642!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4786c1491c5b6a3d%3A0x6b6c6b6c6b6c6b6c!2zTWlsYW5vLCBJdGFseQ!5e0!3m2!1sen!2sit!4v1638360000000!5m2!1sen!2sit"
          style={{ width: '100%', height: '100%', border: 'none' }}
          title="Milano Map"
          allowFullScreen
        />
        <View style={styles.overlay}>
          <Text style={styles.overlayText}>
            Interactive map with cigarette locations available on mobile app
          </Text>
        </View>
      </View>
    );
  }

  // Dynamic import for native platforms to avoid web import error
  const MapView = require('react-native-maps').default;
    const { Marker } = require('react-native-maps');

    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 45.4642,
            longitude: 9.1900,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
          // Se selectable è true, cattura il tocco, altrimenti non fa nulla
          onPress={(e: any) => {
            if (selectable && onLocationSelect) {
              onLocationSelect(e.nativeEvent.coordinate);
            }
          }}
        >
          {/* Mostra i posti esistenti (sola lettura) */}
          {places.map((place) => (
            <Marker
              key={place.id}
              coordinate={{ latitude: place.lat, longitude: place.lng }}
              pinColor="blue" // Posti esistenti in blu
              opacity={selectable ? 0.5 : 1} // Se stiamo scegliendo, rendiamo gli altri meno evidenti
            />
          ))}

          {/* Mostra il marker "Nuovo" solo se siamo in modalità selezione e c'è una coordinata */}
          {selectable && selectedLocation && (
            <Marker
              coordinate={{
                latitude: selectedLocation.lat,
                longitude: selectedLocation.lng
              }}
              pinColor="#EF4444" // Rosso acceso per il nuovo punto
              title="Nuova posizione"
            />
          )}
        </MapView>
      </View>
    );
  };

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  webText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#666',
    padding: 20,
  },
  overlay: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
    borderRadius: 5,
  },
  overlayText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 14,
  },
});

export default MapComponent;