import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Paragraph, Text, Icon, useTheme } from 'react-native-paper';
import { MenuItem } from './index';
import { getCourseIcon, getCourseColor } from './constants';
import { styles } from './theme';

interface MenuItemCardProps {
  item: MenuItem;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({ item }) => {
  const theme = useTheme();
  const courseColor = getCourseColor(item.course);

  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 }}>
          <Icon
            source={getCourseIcon(item.course)}
            color={courseColor}
            size={24}
          />
          <View style={{ flex: 1, marginLeft: 8 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Text style={[StyleSheet.flatten({ fontSize: 18, fontWeight: 'bold' as const, color: '#2D3436', flex: 1 })]}>
                {item.name}
              </Text>
              <Text style={styles.price}>
                ${item.price.toFixed(2)}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
              <View
                style={{
                  backgroundColor: courseColor + '20',
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderRadius: 12,
                  marginRight: 8,
                }}
              >
                <Text style={{ color: courseColor, fontSize: 12, fontWeight: 'bold' as const }}>
                  {getCourseIcon(item.course).toUpperCase()}
                </Text>
              </View>
              <Text style={{ fontSize: 14, color: '#7F8C8D' }}>
                {item.course.charAt(0).toUpperCase() + item.course.slice(1)}
              </Text>
            </View>
          </View>
        </View>

        <Paragraph style={[styles.text, { marginTop: 8 }]}>
          {item.description}
        </Paragraph>
      </Card.Content>
    </Card>
  );
};
