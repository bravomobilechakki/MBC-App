import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

export default function OrderDoneAnimated() {
  const navigation = useNavigation();

  const circleScale = useRef(new Animated.Value(0)).current;
  const checkOpacity = useRef(new Animated.Value(0)).current;
  const subtitleTranslate = useRef(new Animated.Value(20)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;

  const confettiCount = 12;
  const confettis = useRef(
    Array.from({ length: confettiCount }).map(() => ({
      x: Math.random() * (width - 40) - (width / 2 - 20),
      anim: new Animated.Value(0),
      rotate: (Math.random() * 60 - 30) + 'deg',
      size: 6 + Math.random() * 8,
      color: ['#FF595E', '#FFCA3A', '#8AC926', '#1982C4', '#6A4C93'][Math.floor(Math.random() * 5)],
    }))
  ).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(circleScale, { toValue: 1, friction: 5, tension: 120, useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(checkOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.stagger( 
          30,
          confettis.map(c =>
            Animated.timing(c.anim, {
              toValue: 1,
              duration: 900 + Math.random() * 600,
              useNativeDriver: true,
            })
          )
        ),
        Animated.parallel([
          Animated.timing(subtitleTranslate, { toValue: 0, duration: 300, useNativeDriver: true }),
          Animated.timing(subtitleOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        ]),
      ]),
    ]).start(() => {
      // Animation complete, navigate to Orders page
      setTimeout(() => {
        navigation.replace('Profile');
      }, 1000); // Navigate after 1 second
    });
  }, []);

  return (
    <View style={styles.container}>
      {/* Confetti */}
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        {confettis.map((c, i) => {
          const translateY = c.anim.interpolate({ inputRange: [0, 1], outputRange: [-50, height / 2 + Math.random() * 100] });
          const translateX = c.anim.interpolate({ inputRange: [0, 1], outputRange: [0, c.x] });
          const rotate = c.anim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', c.rotate] });
          const opacity = c.anim.interpolate({ inputRange: [0, 0.6, 1], outputRange: [0, 1, 0] });

          return (
            <Animated.View
              key={i}
              style={{
                position: 'absolute',
                left: width / 2 - 10,
                top: height / 2 - 80,
                transform: [{ translateX }, { translateY }, { rotate }],
                opacity,
              }}
            >
              <View style={{ width: c.size, height: c.size, backgroundColor: c.color, borderRadius: 2 }} />
            </Animated.View>
          );
        })}
      </View>

      {/* Main Card */}
      <Animated.View style={[styles.card, { transform: [{ scale: circleScale }] }]}>
        <Animated.View style={[styles.circle, { transform: [{ scale: circleScale }] }]}>
          <Animated.Text style={[styles.check, { opacity: checkOpacity, transform: [{ scale: checkOpacity }] }]}>✓</Animated.Text>
        </Animated.View>
      </Animated.View>

      <Animated.View style={{ marginTop: 28, alignItems: 'center', transform: [{ translateY: subtitleTranslate }], opacity: subtitleOpacity }}>
        <Text style={styles.title}>Order Completed</Text>
        <Text style={styles.subtitle}>Thanks! For Order 🚚</Text>
      </Animated.View>
    </View>
  );
}

const CARD_SIZE = 160;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.03)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  circle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#0ea5a1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  check: {
    fontSize: 64,
    color: 'white',
    fontWeight: '700',
  },
  title: {
    fontSize: 22,
    color: 'white',
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 6,
  },
  button: {
    marginTop: 36,
    backgroundColor: 'white',
    paddingHorizontal: 36,
    paddingVertical: 12,
    borderRadius: 28,
  },
  buttonText: {
    color: '#0f172a',
    fontWeight: '700',
    fontSize: 16,
  },
});
