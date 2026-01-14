import React from "react";
import { View, Text, StyleSheet, ViewProps } from "react-native";

interface BadgeProps extends ViewProps {
  variant?: "default" | "secondary" | "destructive" | "outline";
  children: React.ReactNode;
  style?: any;
  textStyle?: any;
}

const styles = StyleSheet.create({
  // --- STILE BASE DEL CONTENITORE ---
  badge: {
    borderRadius: 9999, // rounded-full (un numero alto crea la pillola perfetta)
    borderWidth: 1,     // border
    paddingHorizontal: 10, // px-2.5 (2.5 * 4 = 10)
    paddingVertical: 2,    // py-0.5 (0.5 * 4 = 2)
    alignItems: 'center',
    justifyContent: 'center',
    // CRUCIALE: impedisce alla view di espandersi a tutta larghezza
    alignSelf: 'flex-start', 
    flexDirection: 'row',
  },
  
  // --- STILE BASE DEL TESTO ---
  text: {
    fontSize: 12,       // text-xs
    fontWeight: "600",  // font-semibold
    lineHeight: 14,     // Per centrare meglio verticalmente il testo piccolo
  },

  // --- VARIANTI (Sfondo e Bordo) ---
  bg_default: {
    backgroundColor: "#007AFF", // primary
    borderColor: "transparent",
  },
  bg_secondary: {
    backgroundColor: "#F3F4F6", // secondary (grigio chiaro)
    borderColor: "transparent",
  },
  bg_destructive: {
    backgroundColor: "#FF3B30", // destructive (rosso)
    borderColor: "transparent",
  },
  bg_outline: {
    backgroundColor: "transparent",
    borderColor: "#E5E7EB", // border color
  },

  // --- VARIANTI (Colore Testo) ---
  // In RN il colore del testo va gestito a parte!
  text_default: { color: "#FFFFFF" },     // primary-foreground
  text_secondary: { color: "#111827" },   // secondary-foreground
  text_destructive: { color: "#FFFFFF" }, // destructive-foreground
  text_outline: { color: "#020817" },     // foreground
});

const Badge: React.FC<BadgeProps> = ({ 
  variant = "default", 
  children, 
  style,      // Per override stile contenitore
  textStyle,  // Per override stile testo (opzionale)
  ...props 
}) => {
  return (
    <View
      style={[
        styles.badge,
        (styles as any)[`bg_${variant}`], // Seleziona lo stile sfondo dinamico
        style,
      ]}
      {...props}
    >
      <Text
        style={[
          styles.text,
          (styles as any)[`text_${variant}`], // Seleziona il colore testo dinamico
          textStyle,
        ]}
      >
        {children}
      </Text>
    </View>
  );
};

export { Badge };

//COME USARE IL BADGE:
/*import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, CardHeader, CardTitle, CardContent } from './components/Card';
import { Badge } from './components/Badge';

export default function OrderScreen() {
  return (
    <View style={styles.container}>
      
      <Card>
        <CardHeader>
          <View style={styles.rowBetween}>
            <CardTitle>Ordine rgba(68, 0, 64, 0.6)</CardTitle>
            {/* Badge Default }
            <Badge variant="default">Nuovo</Badge>
          </View>
        </CardHeader>

        <CardContent style={{ gap: 10 }}>
          
          <View style={styles.row}>
            <Text>Stato Pagamento:</Text>
            {/* Badge Outline /}
            <Badge variant="outline">In attesa</Badge>
          </View>

          <View style={styles.row}>
            <Text>Priorità:</Text>
            {/* Badge Destructive /}
            <Badge variant="destructive">Urgente</Badge>
          </View>

           <View style={styles.row}>
            <Text>Categoria:</Text>
            {/* Badge Secondary /}
            <Badge variant="secondary">Elettronica</Badge>
          </View>

        </CardContent>
      </Card>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  }
});
*/