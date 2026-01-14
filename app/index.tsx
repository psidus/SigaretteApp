// app/index.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LogIn, Map as MapIcon } from 'lucide-react-native';

// Import Componenti
import MapView from '@/components/MapView'; // Il file MapView che abbiamo fatto
import { CategoryFilter } from '@/components/CategoryFilter';

// Dati e Helper
import { Place, CATEGORY_CONFIG } from '@/types/places';

// Dati di prova (Sostituisci poi con il tuo state globale o API)
const INITIAL_PLACES: Place[] = [
  {
    id: '1',
    name: 'Neon Bar Milano',
    description: 'Distributore icos.',
    lat: 45.4642,
    lng: 9.1900,
    categories: ['cigarettes'],
    open_time: '18:00',
    close_time: '02:00',
    address: 'Via Dante 1, Milano',
    image_url: 'https://images.unsplash.com/photo-1514362545857-3bc16549766b?auto=format&fit=crop&q=80',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Midnight Burger',
    description: 'Tabaccaio dentro il locale.',
    lat: 45.4660,
    lng: 9.1920,
    categories: ['cigarettes'],
    open_time: '19:00',
    close_time: '04:00',
    address: 'Corso Vittorio Emanuele, Milano',
    image_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

export default function HomeScreen() {
  const router = useRouter();
  
  // Stati
  const [places, setPlaces] = useState<Place[]>(INITIAL_PLACES);
  const [activeCategories, setActiveCategories] = useState<string[]>([]);

  // Logica Filtri
  const handleToggleCategory = (category: string) => {
    setActiveCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };

  // Filtra i luoghi
  const filteredPlaces = activeCategories.length > 0 
    ? places.filter(place => place.categories.some(cat => activeCategories.includes(cat)))
    : places;

  // Logica "isPlaceOpen" (Semplificata per demo)
  const isPlaceOpen = (place: Place): boolean => {
    const now = new Date();
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();
    
    // Parsing molto semplice HH:MM
    const [openH] = place.open_time.split(':').map(Number);
    const [closeH] = place.close_time.split(':').map(Number);
    
    // Logica base: se chiude dopo la mezzanotte (es. apre 18, chiude 02)
    if (closeH < openH) {
        return currentHours >= openH || currentHours < closeH;
    }
    return currentHours >= openH && currentHours < closeH;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      
      {/* 1. NAVBAR */}
      <View style={styles.navbar}>
        {/* Sinistra: Logo e Nome */}
        <View style={styles.logoContainer}>
          <View style={styles.logoIconBg}>
            <MapIcon size={20} color="#007AFF" />
          </View>
          <Text style={styles.appName}>NightMap</Text>
        </View>

        {/* Destra: Login Button */}
        <TouchableOpacity 
          style={styles.loginButton}
          onPress={() => router.push('./admin/login')}
        >
          <Text style={styles.loginText}>Admin</Text>
          <LogIn size={16} color="#94A3B8" style={{ marginLeft: 6 }} />
        </TouchableOpacity>
      </View>

      {/* 2. FILTRI (Sub-header) */}
      <View style={styles.filterContainer}>
        <CategoryFilter 
          activeCategories={activeCategories}
          onToggleCategory={handleToggleCategory}
        />
      </View>

      {/* 3. MAPPA (Main Content) */}
      <View style={styles.mapWrapper}>
        <MapView 
          places={filteredPlaces}
          isPlaceOpen={isPlaceOpen}
        />
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020817', // Sfondo scuro app
  },
  // Navbar Styles
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#020817',
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoIconBg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 122, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F8FAFC',
    letterSpacing: 0.5,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  loginText: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '500',
  },
  // Filter Styles
  filterContainer: {
    backgroundColor: '#020817',
    paddingBottom: 8,
    paddingTop: 4,
    // Ombra per staccare i filtri dalla mappa
    zIndex: 10,
  },
  // Map Wrapper
  mapWrapper: {
    flex: 1, // Occupa tutto lo spazio rimanente
    overflow: 'hidden',
    borderTopLeftRadius: 20, // Effetto "foglio" arrotondato sopra la mappa
    borderTopRightRadius: 20,
    marginTop: -10, // Piccolo overlap estetico se vuoi, altrimenti togli
    backgroundColor: '#000',
  }
});