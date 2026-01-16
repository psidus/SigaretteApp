import { useRouter } from 'expo-router';
import { ArrowLeft, Trash2 } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView, Platform,
  ScrollView, StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

// IMPORTANTE: Importa il client supabase che hai creato
import { supabase } from '../../lib/superbase';

// UI Components
import { MapView as MapComponent } from '../../components/MapView';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Checkbox } from '../../components/ui/checkbox';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { CATEGORY_CONFIG, Place, PlaceCategory } from '../../types/places';

interface FormData {
  name: string;
  description: string;
  image_url: string;
  lat: string;
  lng: string;
  address: string;
  open_time: string;
  close_time: string;
  categories: PlaceCategory[];
}

const AdminDashboard = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [places, setPlaces] = useState<Place[]>([]);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    image_url: '',
    lat: '',
    lng: '',
    address: '',
    open_time: '09:00',
    close_time: '20:00',
    categories: [],
  });

  useEffect(() => {
    loadPlaces();
  }, []);

  // 1️⃣ LOAD: Legge i dati da Supabase
  const loadPlaces = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('places')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPlaces(data as Place[]);
    } catch (error: any) {
      Alert.alert('Errore Caricamento', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 2️⃣ CREATE: Inserisce un nuovo luogo
  const handleSubmit = async () => {
    if (!formData.name || formData.categories.length === 0 || !formData.lat || !formData.lng) {
      return Alert.alert('Errore', 'Compila tutti i campi obbligatori (*)');
    }

    setIsSubmitting(true);
    try {
      const placeToSave = {
        name: formData.name,
        description: formData.description,
        image_url: formData.image_url,
        lat: parseFloat(formData.lat),
        lng: parseFloat(formData.lng),
        categories: formData.categories,
        open_time: formData.open_time,
        close_time: formData.close_time,
        address: formData.address,
      };

      const { error } = await supabase.from('places').insert([placeToSave]);

      if (error) throw error;

      Alert.alert('Successo', 'Luogo aggiunto correttamente!');

      // Reset Form
      setFormData({
        name: '',
        description: '',
        image_url: '',
        lat: '',
        lng: '',
        address: '',
        open_time: '09:00',
        close_time: '20:00',
        categories: [],
      });
      
      loadPlaces(); // Ricarica la lista dal DB
    } catch (error: any) {
      Alert.alert('Errore Salvataggio', error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3️⃣ DELETE: Cancella dal database
  const deletePlaceFromDB = async (placeId: string) => {
    try {
      const { error } = await supabase
        .from('places')
        .delete()
        .eq('id', placeId);

      if (error) throw error;
      
      // Aggiorna lo stato locale per rimuovere l'elemento visivamente
      setPlaces(prev => prev.filter(p => p.id !== placeId));
    } catch (error: any) {
      Alert.alert('Errore durante l\'eliminazione', error.message);
    }
  };

  const handleCategoryToggle = (category: PlaceCategory) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category],
    }));
  };

  const handleDeleteConfirm = (id: string, name: string) => {
    Alert.alert(
      "Elimina Luogo",
      `Sei sicuro di voler eliminare "${name}"?`,
      [
        { text: "Annulla", style: "cancel" },
        { text: "Elimina", style: "destructive", onPress: () => deletePlaceFromDB(id) }
      ]
    );
  };

  const onLogout = () => {
    router.push('/admin/login');
  };

  const handleMapSelection = (location: { lat: number; lng: number }) => {
    setFormData(prev => ({
      ...prev,
      lat: location.lat.toString(),
      lng: location.lng.toString(),
    }));
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>

        {/* HEADER */}
        <View style={styles.header}>
          <Button variant="ghost" onPress={onLogout} style={styles.backButton}>
            <ArrowLeft size={16} color="#64748B" style={{ marginRight: 8 }} />
            <Text style={{ color: '#64748B' }}>Logout</Text>
          </Button>
          <Text style={styles.headerTitle}>Admin Dashboard</Text>
        </View>

        {/* FORM SECTION */}
        <Card style={styles.formCard}>
          <CardHeader>
            <CardTitle>Aggiungi Luogo</CardTitle>
            <CardDescription>Tocca la mappa per impostare le coordinate</CardDescription>
          </CardHeader>

          <CardContent style={{ gap: 16 }}>

            {/* MAPPA IN MODALITÀ SELEZIONE */}
            <View style={styles.mapPickerContainer}>
              <MapComponent
                places={places}
                selectable={true}
                onLocationSelect={handleMapSelection}
                selectedLocation={formData.lat && formData.lng ? {
                  lat: parseFloat(formData.lat),
                  lng: parseFloat(formData.lng)
                } : null}
              />
            </View>

            {/* Input numerici (che si aggiornano toccando la mappa) */}
            <View style={styles.rowGrid}>
              <View style={{ flex: 1 }}>
                <Label>Latitudine</Label>
                <Input value={formData.lat} readOnly />
              </View>
              <View style={{ flex: 1 }}>
                <Label>Longitudine</Label>
                <Input value={formData.lng} readOnly />
              </View>
            </View>

            {/* INPUT CAMPI */}
            <View>
              <Label>Nome *</Label>
              <Input value={formData.name} onChangeText={(t) => setFormData(p => ({ ...p, name: t }))} />
            </View>
            <View>
              <Label>Descrizione</Label>
              <Textarea value={formData.description} onChangeText={(t) => setFormData(p => ({ ...p, description: t }))} />
            </View>
            <View>
              <Label>URL Immagine</Label>
              <Input value={formData.image_url} onChangeText={(t) => setFormData(p => ({ ...p, image_url: t }))} />
            </View>
            <View>
              <Label>Indirizzo</Label>
              <Input value={formData.address} onChangeText={(t) => setFormData(p => ({ ...p, address: t }))} />
            </View>

            <View style={styles.rowGrid}>
              <View style={{ flex: 1 }}>
                <Label>Apertura</Label>
                <Input placeholder="HH:MM" value={formData.open_time} onChangeText={(t) => setFormData(p => ({ ...p, open_time: t }))} />
              </View>
              <View style={{ flex: 1 }}>
                <Label>Chiusura</Label>
                <Input placeholder="HH:MM" value={formData.close_time} onChangeText={(t) => setFormData(p => ({ ...p, close_time: t }))} />
              </View>
            </View>

            {/* CATEGORIE */}
            <View>
              <Label style={{ marginBottom: 8 }}>Categorie *</Label>
              <View style={styles.categoriesGrid}>
                {(Object.entries(CATEGORY_CONFIG) as [PlaceCategory, typeof CATEGORY_CONFIG[PlaceCategory]][]).map(([cat, conf]) => (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.categoryItem, formData.categories.includes(cat) && styles.categoryItemSelected]}
                    onPress={() => handleCategoryToggle(cat)}
                  >
                    <Checkbox checked={formData.categories.includes(cat)} onCheckedChange={() => handleCategoryToggle(cat)} />
                    <Text style={styles.categoryIcon}>{conf.icon}</Text>
                    <Text style={styles.categoryLabel}>{conf.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <Button onPress={handleSubmit} disabled={isSubmitting} style={{ marginTop: 10 }}>
              {isSubmitting ? 'Salvataggio...' : 'Aggiungi Luogo'}
            </Button>
          </CardContent>
        </Card>

        {/* LISTA LUOGHI ESISTENTI */}
        <Card style={{ marginBottom: 40 }}>
          <CardHeader><CardTitle>Luoghi ({places.length})</CardTitle></CardHeader>
          <CardContent>
            {isLoading ? (
              <Text style={styles.emptyText}>Caricamento...</Text>
            ) : places.length === 0 ? (
              <Text style={styles.emptyText}>Nessun luogo presente</Text>
            ) : (
              <View style={{ gap: 10 }}>
                {places.map((place) => (
                  <View key={place.id} style={styles.placeItem}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.placeName}>{place.name}</Text>
                      <Text style={styles.placeTime}>{place.open_time.slice(0, 5)} - {place.close_time.slice(0, 5)}</Text>
                    </View>

                    {/* Tasto Cancella */}
                    <TouchableOpacity onPress={() => handleDeleteConfirm(place.id, place.name)} style={{ padding: 8 }}>
                      <Trash2 size={20} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </CardContent>
        </Card>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
    backgroundColor: '#F8FAFC', // O background scuro se preferisci
  },
  header: {
    marginBottom: 24,
    marginTop: 10,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#020817',
  },
  warningCard: {
    borderColor: '#F59E0B', // Warning color
    borderWidth: 1,
    backgroundColor: '#FFFBEB',
    marginBottom: 20,
  },
  warningContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
  },
  warningTitle: {
    fontWeight: '600',
    color: '#D97706',
    marginBottom: 2,
  },
  warningText: {
    fontSize: 12,
    color: '#B45309',
  },
  formCard: {
    marginBottom: 24,
  },
  rowGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  iconInputContainer: {
    position: 'relative',
    justifyContent: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: 10,
    zIndex: 1,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F1F5F9', // muted
    borderWidth: 1,
    borderColor: 'transparent',
    width: '48%', // Circa 2 colonne
  },
  categoryItemSelected: {
    backgroundColor: '#EFF6FF', // bg-primary/10
    borderColor: '#007AFF',
  },
  categoryIcon: {
    marginLeft: 8,
    marginRight: 4,
    fontSize: 16,
  },
  categoryLabel: {
    fontSize: 13,
    color: '#0F172A',
  },
  disabled: {
    opacity: 0.5,
  },
  emptyText: {
    textAlign: 'center',
    color: '#64748B',
    padding: 20,
  },
  placeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  placeName: {
    fontWeight: '600',
    color: '#020817',
  },
  placeTime: {
    fontSize: 12,
    color: '#64748B',
  },

  mapPickerContainer: {
    height: 250,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
});

export default AdminDashboard;