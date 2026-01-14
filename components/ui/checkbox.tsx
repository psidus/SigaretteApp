import React from 'react';
import { Pressable, StyleSheet, View, PressableProps } from 'react-native';
import { Check } from 'lucide-react-native'; // Usa la versione native!

// Definiamo i colori (in un progetto reale li importeresti dal tuo tema)
const COLORS = {
  primary: '#007AFF',    // Il colore del "fill" quando attivo
  background: '#FFFFFF', // Sfondo della checkbox
  border: '#9CA3AF',     // Bordo quando non è attiva
  foreground: '#FFFFFF', // Colore della spunta (Check)
};

interface CheckboxProps extends Omit<PressableProps, 'onPress'> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({ 
  checked = false,   // Stato (true/false)
  onCheckedChange,   // Funzione callback quando clicchi
  disabled = false, 
  style,              // Stili extra opzionali
  ...props
}) => {
  
  return (
    <Pressable
      // Invece di onClick, usiamo onPress
      onPress={() => onCheckedChange?.(!checked)}
      disabled={disabled}
      
      // Gestione stili condizionali
      style={[
        styles.base,
        // Se è checked, sfondo colorato e niente bordo. Se no, sfondo trasparente e bordo visibile.
        checked ? styles.checked : styles.unchecked,
        disabled && styles.disabled,
        style
      ] as any}
      {...props}
    >
      {/* Mostriamo l'icona SOLO se checked è true */}
      {checked && (
        <Check 
          size={14}             // h-4 w-4 equivale circa a 14-16px
          color={COLORS.foreground} 
          strokeWidth={3}       // Rende la spunta più "bold" (font-medium)
        />
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    height: 20, // Un po' più grande di 16px per facilitare il tocco
    width: 20,
    borderRadius: 4, // rounded-sm
    justifyContent: 'center',
    alignItems: 'center',
  },
  unchecked: {
    borderWidth: 1,
    borderColor: COLORS.border, // border-primary (o border-input)
    backgroundColor: 'transparent',
  },
  checked: {
    backgroundColor: COLORS.primary, // bg-primary
    borderWidth: 0, // Rimuoviamo il bordo o lo coloriamo come lo sfondo
  },
  disabled: {
    opacity: 0.5,
  }
});

export { Checkbox };

//COME USARE LA CHECKBOX:
/* 
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Checkbox } from './components/Checkbox';
import { Label } from './components/Label'; // Usiamo la Label creata prima

export default function SettingsScreen() {
  const [accettoTermini, setAccettoTermini] = useState(false);

  return (
    <View style={styles.container}>
      
      <View style={styles.row}>
        {/* Checkbox riceve lo stato e la funzione per cambiarlo.
           Nota: React Native non ha "event.target.checked", 
           ricevi direttamente il booleano o lo inverti nella funzione.
        }
        <Checkbox 
          checked={accettoTermini} 
          onCheckedChange={setAccettoTermini} 
        />
        
        {/* Cliccando la label invertiamo lo stato della checkbox manualmente }
        <Label onPress={() => setAccettoTermini(!accettoTermini)}>
          Accetto i termini e condizioni
        </Label>
      </View>

      <Text style={{ marginTop: 20 }}>
        Stato attuale: {accettoTermini ? "Accettato ✅" : "In attesa ❌"}
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  row: {
    flexDirection: 'row', // Allinea Checkbox e Label orizzontalmente
    alignItems: 'center', // Le centra verticalmente
    gap: 10, // Spazio tra i due
  }
}); */