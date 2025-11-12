import { ResizeMode, Video } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef, useState } from 'react';
import { Animated, Dimensions, Image, PanResponder, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { IconSymbol } from './ui/IconSymbol';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25; // Threshold for completing swipe

interface TutorCardProps {
  tutor: {
    id: string;
    name: string;
    bio: string;
    rating: number;
    photoUrl: string;
    videoUrl?: string;
  };
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

export default function TutorCard({ tutor, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown }: TutorCardProps) {
  const position = new Animated.ValueXY();
  const fadeAnimation = useRef(new Animated.Value(1)).current;
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | 'up' | 'down' | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [lastTap, setLastTap] = useState(0);
  const videoRef = useRef<Video>(null);

  // Simple fade transition instead of flip
  const fadeToVideo = () => {    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    Animated.timing(fadeAnimation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setIsFlipped(true);
      Animated.timing(fadeAnimation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };

  // Fade back to front
  const fadeToFront = () => {
    Animated.timing(fadeAnimation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setIsFlipped(false);
      Animated.timing(fadeAnimation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };

  // Handle double tap on card to fade and show video
  const handleDoubleTap = () => {
    if (!isFlipped && tutor.videoUrl) {
      // haptic to confirm double-tap
      try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); } catch {}
      fadeToVideo();
      setTimeout(() => {
        setIsVideoPlaying(true);
        if (videoRef.current) {
          videoRef.current.playAsync();
        }
      }, 200); // Start video after fade animation
    }
  };

  // Handle single tap to detect double tap or pause/play video
  const handleTap = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;

    if (isFlipped) {
      // If video is showing, toggle play/pause
      if (isVideoPlaying) {
        // pause haptic
        try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}
        setIsVideoPlaying(false);
        if (videoRef.current) {
          videoRef.current.pauseAsync();
        }
      } else {
        // play haptic
        try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}
        setIsVideoPlaying(true);
        if (videoRef.current) {
          videoRef.current.playAsync();
        }
      }
      return;
    }

    // Check for double tap on front side
    if (lastTap && (now - lastTap) < DOUBLE_TAP_DELAY) {
      // Double tap detected
      handleDoubleTap();
      setLastTap(0); // Reset to prevent triple tap
    } else {
      // Single tap - wait to see if there's a second tap
      setLastTap(now);
    }
  };

  // Handle fade back (closes video)
  const handleFadeBack = () => {
    if (isFlipped) {
      // closing haptic
      try { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); } catch {}
      setIsVideoPlaying(false);
      if (videoRef.current) {
        videoRef.current.pauseAsync();
      }
      fadeToFront();
    }
  };

  // Pan responder for swipe gestures in all directions
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: (evt, gestureState) => {
      // Allow small movements for taps, larger movements for swipes
      return true;
    },
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      // Set pan responder for any significant movement
      return Math.abs(gestureState.dx) > 8 || Math.abs(gestureState.dy) > 8;
    },
    onPanResponderGrant: () => {
      // Reset animation values when starting a new gesture
      position.setOffset({
        x: (position.x as any)._value,
        y: (position.y as any)._value,
      });
      position.setValue({ x: 0, y: 0 });

      // subtle selection haptic to indicate gesture start
      try {
        Haptics.selectionAsync();
      } catch (e) {
        // ignore haptics failures
      }
    },
    onPanResponderMove: (_, gesture) => {
      // Update position during drag
      position.setValue({ x: gesture.dx, y: gesture.dy });
      
      // Determine swipe direction dynamically and provide haptic feedback
      const { dx, dy } = gesture;
      const threshold = 40;
      
      let newDirection: 'left' | 'right' | 'up' | 'down' | null = null;
      
      // Determine primary direction based on larger movement
      if (Math.abs(dx) > Math.abs(dy)) {
        // Horizontal movement is primary
        if (Math.abs(dx) > threshold) {
          newDirection = dx > 0 ? 'right' : 'left';
        }
      } else {
        // Vertical movement is primary
        if (Math.abs(dy) > threshold) {
          newDirection = dy > 0 ? 'down' : 'up';
        }
      }
      
      if (newDirection !== swipeDirection) {
        setSwipeDirection(newDirection);
        if (newDirection) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
      }
    },
    onPanResponderRelease: (_, gesture) => {
      position.flattenOffset();
      
      const { dx, dy, vx, vy } = gesture;
      const horizontalThreshold = SWIPE_THRESHOLD;
      const verticalThreshold = SWIPE_THRESHOLD * 0.8; // Slightly easier vertical swipes
      
      const hasHorizontalReach = Math.abs(dx) > horizontalThreshold;
      const hasVerticalReach = Math.abs(dy) > verticalThreshold;
      const hasGoodVelocity = Math.abs(vx) > 0.3 || Math.abs(vy) > 0.3;
      
      // Check if it's a tap (small movement, not flipped)
      if (!isFlipped && Math.abs(dx) < 15 && Math.abs(dy) < 15 && !hasGoodVelocity) {
        // It's a tap - handle single/double tap
        handleTap();
        setSwipeDirection(null);
        Animated.spring(position, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: true,
          tension: 50,
          friction: 7,
        }).start();
        return;
      }
      
      // Determine swipe direction based on movement and velocity
      let swipeDir: 'left' | 'right' | 'up' | 'down' | null = null;
      let targetX = 0, targetY = 0;
      
      if (hasHorizontalReach || Math.abs(vx) > 0.5) {
        if (dx > 0) {
          swipeDir = 'right';
          targetX = SCREEN_WIDTH * 1.5;
        } else {
          swipeDir = 'left';
          targetX = -SCREEN_WIDTH * 1.5;
        }
        targetY = dy;
      } else if (hasVerticalReach || Math.abs(vy) > 0.5) {
        if (dy > 0) {
          swipeDir = 'down';
          targetY = SCREEN_WIDTH * 1.5;
        } else {
          swipeDir = 'up';
          targetY = -SCREEN_WIDTH * 1.5;
        }
        targetX = dx;
      }
      
      if (swipeDir) {
        // Provide haptic feedback based on direction
        const feedbackType = swipeDir === 'right' || swipeDir === 'up' 
          ? Haptics.NotificationFeedbackType.Success 
          : Haptics.NotificationFeedbackType.Warning;
        
        Haptics.notificationAsync(feedbackType);

        // Animate card off screen
        Animated.timing(position, {
          toValue: { x: targetX, y: targetY },
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          // Call appropriate callback after animation completes
          switch(swipeDir) {
            case 'left':
              onSwipeLeft();
              break;
            case 'right':
              onSwipeRight();
              break;
            case 'up':
              onSwipeUp && onSwipeUp();
              break;
            case 'down':
              onSwipeDown && onSwipeDown();
              break;
          }
          
          // Reset position for next card
          position.setValue({ x: 0, y: 0 });
          setSwipeDirection(null);
        });
      } else {
        // Snap back to center
        setSwipeDirection(null);
        Animated.spring(position, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: true,
          tension: 50,
          friction: 7,
        }).start();
      }
    },
  });

  // Card rotation based on movement (more dynamic)
  const rotateCard = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
    outputRange: ['-15deg', '0deg', '15deg'],
    extrapolate: 'clamp',
  });

  const rotateCardY = position.y.interpolate({
    inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
    outputRange: ['-8deg', '0deg', '8deg'],
    extrapolate: 'clamp',
  });

  // Opacity for swipe direction indicators
  const leftOpacity = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, -40, 0],
    outputRange: [1, 0.8, 0],
    extrapolate: 'clamp',
  });

  const rightOpacity = position.x.interpolate({
    inputRange: [0, 40, SCREEN_WIDTH / 2],
    outputRange: [0, 0.8, 1],
    extrapolate: 'clamp',
  });

  const upOpacity = position.y.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, -40, 0],
    outputRange: [1, 0.8, 0],
    extrapolate: 'clamp',
  });

  const downOpacity = position.y.interpolate({
    inputRange: [0, 40, SCREEN_WIDTH / 2],
    outputRange: [0, 0.8, 1],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.card,
        {
          transform: [
            { translateX: position.x },
            { translateY: position.y },
            { rotate: rotateCard },
            { rotateY: rotateCardY },
          ],
        },
      ]}
    >
      {/* Left Swipe Indicator - Radial with depth */}
      <Animated.View style={[styles.swipeIndicator, styles.leftIndicator, { opacity: leftOpacity }]}>
        <LinearGradient
          colors={[
            'rgba(255,75,75,0.95)', // Bright red center
            'rgba(124,58,237,0.3)', // Purple blend
            'rgba(255,100,100,0.6)', // Red outer
            'rgba(255,75,75,0.2)', // Soft edge
          ]}
          style={[styles.indicatorGradient, styles.radialIndicator]}
          start={{ x: 0.5, y: 0.5 }}
          end={{ x: 1.2, y: 1.2 }}
        >
          <IconSymbol size={40} name="xmark.circle.fill" color="#FFF" />
          <ThemedText style={styles.indicatorText}>NOPE</ThemedText>
        </LinearGradient>
      </Animated.View>

      {/* Right Swipe Indicator - Radial with depth */}
      <Animated.View style={[styles.swipeIndicator, styles.rightIndicator, { opacity: rightOpacity }]}>
        <LinearGradient
          colors={[
            'rgba(75,255,75,0.95)', // Bright green center
            'rgba(196,181,253,0.4)', // Light purple blend
            'rgba(100,255,100,0.6)', // Green outer
            'rgba(75,255,75,0.2)', // Soft edge
          ]}
          style={[styles.indicatorGradient, styles.radialIndicator]}
          start={{ x: 0.5, y: 0.5 }}
          end={{ x: 1.2, y: 1.2 }}
        >
          <IconSymbol size={40} name="heart.circle.fill" color="#FFF" />
          <ThemedText style={styles.indicatorText}>LIKE</ThemedText>
        </LinearGradient>
      </Animated.View>

      {/* Up Swipe Indicator - Radial with depth */}
      <Animated.View style={[styles.swipeIndicator, styles.upIndicator, { opacity: upOpacity }]}>
        <LinearGradient
          colors={[
            'rgba(124,58,237,0.95)', // Purple center
            'rgba(196,181,253,0.6)', // Light purple
            'rgba(75,150,255,0.5)', // Blue blend
            'rgba(124,58,237,0.2)', // Purple edge
          ]}
          style={[styles.indicatorGradient, styles.radialIndicator]}
          start={{ x: 0.5, y: 0.5 }}
          end={{ x: 1.2, y: 1.2 }}
        >
          <IconSymbol size={40} name="star.circle.fill" color="#FFF" />
          <ThemedText style={styles.indicatorText}>SUPER</ThemedText>
        </LinearGradient>
      </Animated.View>

      {/* Down Swipe Indicator - Radial with depth */}
      <Animated.View style={[styles.swipeIndicator, styles.downIndicator, { opacity: downOpacity }]}>
        <LinearGradient
          colors={[
            'rgba(255,150,75,0.95)', // Orange center
            'rgba(124,58,237,0.25)', // Purple hint
            'rgba(255,170,100,0.6)', // Orange outer
            'rgba(255,150,75,0.2)', // Soft edge
          ]}
          style={[styles.indicatorGradient, styles.radialIndicator]}
          start={{ x: 0.5, y: 0.5 }}
          end={{ x: 1.2, y: 1.2 }}
        >
          <IconSymbol size={40} name="bookmark.circle.fill" color="#FFF" />
          <ThemedText style={styles.indicatorText}>SAVE</ThemedText>
        </LinearGradient>
      </Animated.View>

      {/* Front Side of Card */}
      {!isFlipped && (
        <Animated.View 
          style={[
            styles.cardSide,
            { 
              opacity: fadeAnimation,
            }
          ]}
        >
          <TouchableOpacity onPress={handleTap} activeOpacity={0.9} style={styles.cardTouchable}>
            <View style={styles.photoContainer}>
              <Image source={{ uri: tutor.photoUrl }} style={styles.photo} />
              <LinearGradient
                colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.7)']}
                style={styles.photoGradient}
              />
            </View>
            <LinearGradient
              colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.98)']}
              style={styles.infoGradient}
            >
              <ThemedView style={styles.infoContainer}>
                <ThemedView style={styles.nameRatingContainer}>
                  <ThemedText type="title" style={styles.name}>{tutor.name}</ThemedText>
                  <LinearGradient
                    colors={['rgba(255,215,0,0.2)', 'rgba(255,215,0,0.4)']}
                    style={styles.ratingContainer}
                  >
                    <ThemedText type="defaultSemiBold" style={styles.rating}>
                      {tutor.rating.toFixed(1)}
                    </ThemedText>
                    <ThemedText type="default" style={styles.starIcon}>★</ThemedText>
                  </LinearGradient>
                </ThemedView>
                <ThemedText style={styles.bio}>{tutor.bio}</ThemedText>
                {tutor.videoUrl && (
                  <ThemedText style={styles.tapHint}>Double-tap to see introduction video</ThemedText>
                )}
              </ThemedView>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Back Side of Card - Video */}
      {isFlipped && (
        <Animated.View 
          style={[
            styles.cardSide,
            styles.cardBack,
            { 
              opacity: fadeAnimation,
            }
          ]}
        >
        <TouchableOpacity 
          style={styles.videoCloseButton} 
          onPress={handleFadeBack}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[
              'rgba(124,58,237,0.4)', // Purple center
              'rgba(0,0,0,0.8)', // Dark blend
              'rgba(0,0,0,0.95)' // Very dark edge
            ]}
            style={[styles.closeButtonGradient, styles.radialButton]}
            start={{ x: 0.5, y: 0.5 }}
            end={{ x: 1.1, y: 1.1 }}
          >
            <IconSymbol size={30} name="xmark" color="#FFF" />
          </LinearGradient>
        </TouchableOpacity>
        
        {tutor.videoUrl && (
          <TouchableOpacity 
            style={styles.videoTouchable} 
            onPress={handleTap}
            activeOpacity={1}
          >
            <Video
              ref={videoRef}
              style={styles.video}
              source={{ uri: tutor.videoUrl }}
              useNativeControls={false}
              resizeMode={ResizeMode.CONTAIN}
              isLooping={false}
              shouldPlay={isVideoPlaying}
              onPlaybackStatusUpdate={(status) => {
                if (status.isLoaded && status.didJustFinish) {
                  handleFadeBack();
                }
              }}
            />
            
            {/* Play/Pause overlay indicator - Radial with depth */}
            {!isVideoPlaying && (
              <View style={styles.playPauseOverlay}>
                <LinearGradient
                  colors={[
                    'rgba(124,58,237,0.3)', // Purple center
                    'rgba(0,0,0,0.5)', // Dark blend
                    'rgba(0,0,0,0.7)', // Darker outer
                  ]}
                  style={[styles.playPauseContainer, styles.radialOverlay]}
                  start={{ x: 0.5, y: 0.5 }}
                  end={{ x: 1.1, y: 1.1 }}
                >
                  <IconSymbol size={60} name="play.circle.fill" color="#FFF" />
                  <ThemedText style={styles.playPauseText}>Tap to play</ThemedText>
                </LinearGradient>
              </View>
            )}
          </TouchableOpacity>
        )}
        
        <LinearGradient
          colors={[
            'transparent', 
            'rgba(124,58,237,0.2)', // Purple tint
            'rgba(0,0,0,0.6)', 
            'rgba(0,0,0,0.9)'
          ]}
          style={styles.videoInfo}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1.2 }}
        >
          <ThemedText style={styles.videoTitle}>Introduction by {tutor.name}</ThemedText>
          <ThemedText style={styles.videoSubtitle}>Get to know your potential tutor</ThemedText>
        </LinearGradient>
        </Animated.View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_WIDTH * 1.3, // Add explicit height
    backgroundColor: 'transparent',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    position: 'absolute',
    overflow: 'visible',
  },
  cardSide: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  cardBack: {
    backgroundColor: '#000',
  },
  cardTouchable: {
    width: '100%',
    height: '100%',
  },
  swipeIndicator: {
    position: 'absolute',
    top: 50,
    zIndex: 1000,
    borderRadius: 15,
    overflow: 'hidden',
  },
  leftIndicator: {
    left: 20,
  },
  rightIndicator: {
    right: 20,
  },
  upIndicator: {
    top: 20,
    left: '50%',
    marginLeft: -60, // Half of indicator width to center
  },
  downIndicator: {
    bottom: 20,
    left: '50%',
    marginLeft: -60, // Half of indicator width to center
  },
  indicatorGradient: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
  },
  indicatorText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  photoContainer: {
    position: 'relative',
    width: '100%',
    height: SCREEN_WIDTH,
  },
  photoGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 160,
  },
  infoGradient: {
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  photo: {
    width: '100%',
    height: SCREEN_WIDTH,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  playButtonOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  playButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingVertical: 20,
    borderRadius: 20,
  },
  playButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  videoCloseButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1001,
    borderRadius: 25,
    overflow: 'hidden',
  },
  closeButtonGradient: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  video: {
    flex: 1,
    width: '100%',
    backgroundColor: '#000',
  },
  videoTouchable: {
    flex: 1,
    width: '100%',
    position: 'relative',
  },
  playPauseOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  playPauseContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingVertical: 20,
    borderRadius: 20,
  },
  playPauseText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  videoInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  videoTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  videoSubtitle: {
    color: '#FFF',
    fontSize: 16,
    opacity: 0.9,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  infoContainer: {
    padding: 20,
  },
  nameRatingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  rating: {
    marginRight: 5,
  },
  starIcon: {
    color: '#FFD700',
  },
  bio: {
    fontSize: 16,
    lineHeight: 24,
  },
  tapHint: {
    fontSize: 14,
    fontStyle: 'italic',
    opacity: 0.8,
    marginTop: 10,
    textAlign: 'center',
    color: '#6366f1',
    fontWeight: '600',
  },
  // Radial gradient styles for depth effects
  radialIndicator: {
    borderRadius: 100, // Creates circular effect for indicators
  },
  radialOverlay: {
    borderRadius: 50, // Softer circular effect for overlays
  },
  radialButton: {
    borderRadius: 25, // Smaller circular effect for buttons
  },
});
