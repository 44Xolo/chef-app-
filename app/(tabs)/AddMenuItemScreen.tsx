import React, { useState } from 'react';
import { View, ScrollView, Animated, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, RadioButton, Card, Title, HelperText } from 'react-native-paper';
import { MenuItem, CourseType } from './index';
import { COURSE_OPTIONS, getCourseIcon, getCourseColor } from './constants';
import { styles } from './theme';

interface AddMenuItemScreenProps {
  onAddItem: (item: Omit<MenuItem, 'id'>) => void;
  onCancel: () => void;
}

export const AddMenuItemScreen: React.FC<AddMenuItemScreenProps> = ({ 
  onAddItem, 
  onCancel 
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState<CourseType>('main');
  const [price, setPrice] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  
  const slideAnim = React.useRef(new Animated.Value(300)).current;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        speed: 12,
        bounciness: 8,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const validateField = (field: string, value: string): string => {
    switch (field) {
      case 'name':
        if (!value.trim()) return 'Dish name is required';
        if (value.trim().length < 2) return 'Dish name must be at least 2 characters';
        return '';
      
      case 'description':
        if (!value.trim()) return 'Description is required';
        if (value.trim().length < 10) return 'Description must be at least 10 characters';
        return '';
      
      case 'price':
        if (!value.trim()) return 'Price is required';
        const priceNum = parseFloat(value);
        if (isNaN(priceNum) || priceNum <= 0) return 'Price must be a valid number greater than 0';
        if (priceNum > 1000) return 'Price seems too high. Please verify.';
        return '';
      
      default:
        return '';
    }
  };

  const validateForm = (): boolean => {
    const newErrors = {
      name: validateField('name', name),
      description: validateField('description', description),
      price: validateField('price', price),
    };
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const error = validateField(field, field === 'price' ? price : field === 'name' ? name : description);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleSubmit = () => {
    setTouched({ name: true, description: true, price: true });
    
    if (validateForm()) {
      const newItem: Omit<MenuItem, 'id'> = {
        name: name.trim(),
        description: description.trim(),
        course,
        price: parseFloat(price),
      };
      
      onAddItem(newItem);
    }
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setCourse('main');
    setPrice('');
    setErrors({});
    setTouched({});
  };

  const handleAddAnother = () => {
    setTouched({ name: true, description: true, price: true });
    
    if (validateForm()) {
      const newItem: Omit<MenuItem, 'id'> = {
        name: name.trim(),
        description: description.trim(),
        course,
        price: parseFloat(price),
      };
      
      onAddItem(newItem);
      resetForm();
    }
  };

  const isFormValid = name.trim() && description.trim() && price.trim() && 
                     !errors.name && !errors.description && !errors.price;

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.screenContainer} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ 
          opacity: fadeAnim, 
          transform: [{ translateY: slideAnim }] 
        }}>
          <Title style={styles.title}>➕ Add New Menu Item</Title>

          <Card style={styles.card}>
            <Card.Content>
              <TextInput
                label="Dish Name *"
                value={name}
                onChangeText={setName}
                onBlur={() => handleBlur('name')}
                style={styles.input}
                error={!!errors.name && touched.name}
                mode="outlined"
                left={<TextInput.Icon icon="food" />}
                placeholder="Enter dish name (e.g., Garlic Bread)"
                autoCapitalize="words"
              />
              <HelperText type="error" visible={!!errors.name && touched.name}>
                {errors.name}
              </HelperText>

              <TextInput
                label="Description *"
                value={description}
                onChangeText={setDescription}
                onBlur={() => handleBlur('description')}
                style={styles.input}
                multiline
                numberOfLines={3}
                error={!!errors.description && touched.description}
                mode="outlined"
                left={<TextInput.Icon icon="text" />}
                placeholder="Describe the dish, ingredients, and special features..."
                autoCapitalize="sentences"
              />
              <HelperText type="error" visible={!!errors.description && touched.description}>
                {errors.description}
              </HelperText>

              <Text style={{ 
                fontSize: 16, 
                fontWeight: '700', 
                color: '#2D3436', 
                marginTop: 16, 
                marginBottom: 12 
              }}>
                🍽️ Select Course Type *
              </Text>
              
              <RadioButton.Group onValueChange={value => setCourse(value as CourseType)} value={course}>
                {COURSE_OPTIONS.map(option => (
                  <View key={option.value} style={styles.radioItem}>
                    <RadioButton.Item
                      label={option.label}
                      value={option.value}
                      position="leading"
                      labelStyle={{ 
                        textAlign: 'left', 
                        fontSize: 16,
                        color: '#2D3436',
                        fontWeight: '600'
                      }}
                      style={{ 
                        backgroundColor: course === option.value ? option.color + '20' : '#F8F9FA',
                        borderRadius: 8,
                      }}
                      color={option.color}
                    />
                  </View>
                ))}
              </RadioButton.Group>

              <TextInput
                label="Price ($) *"
                value={price}
                onChangeText={setPrice}
                onBlur={() => handleBlur('price')}
                style={styles.input}
                keyboardType="decimal-pad"
                error={!!errors.price && touched.price}
                mode="outlined"
                left={<TextInput.Icon icon="currency-usd" />}
                placeholder="0.00"
              />
              <HelperText type="error" visible={!!errors.price && touched.price}>
                {errors.price}
              </HelperText>

              <View style={{ 
                flexDirection: 'row', 
                justifyContent: 'space-between', 
                marginTop: 24,
                gap: 12 
              }}>
                <Button 
                  mode="outlined" 
                  onPress={onCancel}
                  style={[styles.button, { flex: 1 }]}
                  icon="arrow-left"
                >
                  Back
                </Button>
                
                <Button 
                  mode="contained" 
                  onPress={handleAddAnother}
                  style={[styles.button, { flex: 1 }]}
                  disabled={!isFormValid}
                  icon="plus-circle"
                >
                  Add More
                </Button>
                
                <Button 
                  mode="contained" 
                  onPress={handleSubmit}
                  style={[styles.button, { flex: 1 }]}
                  disabled={!isFormValid}
                  icon="check-circle"
                >
                  Save
                </Button>
              </View>

              <HelperText type="info" style={{ textAlign: 'center', marginTop: 16 }}>
                * Required fields
              </HelperText>
            </Card.Content>
          </Card>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};