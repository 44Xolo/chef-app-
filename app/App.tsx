import React, { useState, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MenuItem } from './(tabs)/index';
import { HomeScreen } from './(tabs)/HomeScreen';
import { AddMenuItemScreen } from './(tabs)/AddMenuItemScreen';
import { theme } from './(tabs)/theme';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'home' | 'add'>('home');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  const generateId = (): string => {
    return `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleAddItem = useCallback((newItemData: Omit<MenuItem, 'id'>) => {
    const newItem: MenuItem = {
      ...newItemData,
      id: generateId(),
    };
    
    setMenuItems(prev => [...prev, newItem]);
    setCurrentScreen('home');
  }, []);

  const handleCancelAdd = useCallback(() => {
    setCurrentScreen('home');
  }, []);

  const handleNavigateToAdd = useCallback(() => {
    setCurrentScreen('add');
  }, []);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return (
          <HomeScreen 
            menuItems={menuItems} 
            onAddItem={handleNavigateToAdd}
          />
        );
      case 'add':
        return (
          <AddMenuItemScreen 
            onAddItem={handleAddItem}
            onCancel={handleCancelAdd}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <StatusBar style="auto" backgroundColor="#FF6B35" />
        {renderScreen()}
      </PaperProvider>
    </SafeAreaProvider>
  );
}