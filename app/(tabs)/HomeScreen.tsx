import React from 'react';
import { View, ScrollView, Animated } from 'react-native';
import { Text, FAB, Divider, Chip } from 'react-native-paper';
import { MenuItem } from './index';
import { MenuItemCard } from './MenuItemCard';
import { styles } from './theme';

interface HomeScreenProps {
  menuItems: MenuItem[];
  onAddItem: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ menuItems, onAddItem }) => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.9)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        speed: 12,
        bounciness: 8,
        useNativeDriver: true,
      })
    ]).start();
  }, [menuItems]);

  const getItemsByCourse = (course: string) => {
    return menuItems.filter(item => item.course === course);
  };

  const getCourseStats = () => {
    const stats = {
      starter: getItemsByCourse('starter').length,
      main: getItemsByCourse('main').length,
      dessert: getItemsByCourse('dessert').length,
      drink: getItemsByCourse('drink').length,
    };
    return stats;
  };

  const courseStats = getCourseStats();
  const courseSections = [
    { key: 'starter' as const, title: 'Starters', count: courseStats.starter },
    { key: 'main' as const, title: 'Main Courses', count: courseStats.main },
    { key: 'dessert' as const, title: 'Desserts', count: courseStats.dessert },
    { key: 'drink' as const, title: 'Drinks', count: courseStats.drink }
  ];

  const totalPrice = menuItems.reduce((sum, item) => sum + item.price, 0);
  const averagePrice = menuItems.length > 0 ? totalPrice / menuItems.length : 0;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.screenContainer} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}>
          <Text style={styles.title}>🍽️ Chef's Menu</Text>
          
          <View style={styles.card}>
            <View style={{ padding: 16 }}>
              <Text style={styles.totalCount}>
                📊 Total Menu Items: {menuItems.length}
              </Text>
              
              {menuItems.length > 0 && (
                <View style={{ marginTop: 12 }}>
                  <Text style={{ textAlign: 'center', color: '#7F8C8D', marginBottom: 8 }}>
                    🏷️ Average Price: ${averagePrice.toFixed(2)}
                  </Text>
                  <View style={{ flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' }}>
                    {courseSections.map(section => (
                      section.count > 0 && (
                        <Chip 
                          key={section.key}
                          style={{ margin: 4 }}
                          textStyle={{ fontSize: 12 }}
                        >
                          {section.title}: {section.count}
                        </Chip>
                      )
                    ))}
                  </View>
                </View>
              )}
            </View>
          </View>

          <Divider style={{ marginVertical: 24, height: 2, backgroundColor: '#E0E0E0' }} />

          {courseSections.map(section => {
            const items = getItemsByCourse(section.key);
            if (items.length === 0) return null;

            return (
              <View key={section.key}>
                <Text style={styles.sectionHeader}>
                  {section.title} ({section.count})
                </Text>
                {items.map((item, index) => (
                  <MenuItemCard key={item.id} item={item} />
                ))}
              </View>
            );
          })}

          {menuItems.length === 0 && (
            <View style={{ alignItems: 'center', marginTop: 80 }}>
              <Text style={styles.emptyState}>
                🍳 No menu items yet!{'\n'}
                Tap the + button below to create your first delicious dish.
              </Text>
            </View>
          )}
        </Animated.View>
      </ScrollView>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={onAddItem}
        color="#FFFFFF"
        animated={true}
      />
    </View>
  );
};