import { useRouter } from 'expo-router';
import { LogIn, Map as MapIcon } from 'lucide-react-native';
import React, { useEffect, useState } from 'react'; // Aggiunto useEffect
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Import Supabase Client
import { supabase } from '../lib/superbase';

// Import Componenti
import { CategoryFilter } from '@/components/CategoryFilter';
import MapComponent from '../components/MapView';

// Dati e Helper
import { Place } from '@/types/places';

export default function HomeScreen() {
  const router = useRouter();
  
  // Stati
  const [places, setPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Stato per il caricamento
  const [activeCategories, setActiveCategories] = useState<string[]>([]);

  // 1. Caricamento dati dal Database
  useEffect(() => {
    fetchPlaces();
  }, []);

  const fetchPlaces = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('places')
        .select('*');

      if (error) throw error;

      setPlaces(data as Place[]);
    } catch (error) {
      console.error('Errore nel caricamento dei posti:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Logica Filtri
  const handleToggleCategory = (category: string) => {
    setActiveCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };

  // Filtra i luoghi in base alle categorie attive
  const filteredPlaces = activeCategories.length > 0 
    ? places.filter(place => place.categories.some(cat => activeCategories.includes(cat)))
    : places;

  // Logica "isPlaceOpen"
  const isPlaceOpen = (place: Place): boolean => {
    const now = new Date();
    const currentHours = now.getHours();
    
    // Parsing HH:MM:SS (Supabase restituisce spesso il formato completo)
    const [openH] = place.open_time.split(':').map(Number);
    const [closeH] = place.close_time.split(':').map(Number);
    
    if (closeH < openH) {
        return currentHours >= openH || currentHours < closeH;
    }
    return currentHours >= openH && currentHours < closeH;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      
      {/* 1. NAVBAR */}
      <View style={styles.navbar}>
        <View style={styles.logoContainer}>
          <View style={styles.logoIconBg}>
            <MapIcon size={20} color="#007AFF" />
          </View>
          <Text style={styles.appName}>NightMap</Text>
        </View>

        <TouchableOpacity 
          style={styles.loginButton}
          onPress={() => router.push('/admin/login')} // Corretto il path
        >
          <Text style={styles.loginText}>Admin</Text>
          <LogIn size={16} color="#94A3B8" style={{ marginLeft: 6 }} />
        </TouchableOpacity>
      </View>

      {/* 2. FILTRI */}
      <View style={styles.filterContainer}>
        <CategoryFilter 
          activeCategories={activeCategories}
          onToggleCategory={handleToggleCategory}
        />
      </View>

      {/* 3. MAPPA O CARICAMENTO */}
      <View style={styles.mapWrapper}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={{ marginTop: 10, color: '#94A3B8' }}>Cerco i posti...</Text>
          </View>
        ) : (
          <MapComponent
            places={filteredPlaces}
            isPlaceOpen={isPlaceOpen}
          />
        )}
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