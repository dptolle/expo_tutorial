import { View, Image, ImageSourcePropType } from 'react-native';
import { GestureEvent, TapGestureHandler, TapGestureHandlerEventPayload, PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  useAnimatedGestureHandler,
  withSpring,
} from 'react-native-reanimated';

interface EmojiStickerProps {
    imageSize: number;
    stickerSource: ImageSourcePropType;
}

const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedImage = Animated.createAnimatedComponent(Image);

export default function EmojiSticker({ imageSize, stickerSource }: EmojiStickerProps) {

    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const scaleImage = useSharedValue(imageSize);

    const onDoubleTap: ((event: GestureEvent<TapGestureHandlerEventPayload>) => void) | undefined = useAnimatedGestureHandler({
        onActive: () => {
          if (scaleImage.value) {
            scaleImage.value = scaleImage.value * 2;
          }
        },
      });

      const imageStyle = useAnimatedStyle(() => {
        return {
          width: withSpring(scaleImage.value),
          height: withSpring(scaleImage.value),
        };
      });

      const onDrag = useAnimatedGestureHandler({
        onStart: (event, context: {translateX:number;translateY:number;}) => {
          context.translateX = translateX.value;
          context.translateY = translateY.value;
        },
        onActive: (event, context) => {
          translateX.value = event.translationX + context.translateX;
          translateY.value = event.translationY + context.translateY;
        },
      });

      const containerStyle = useAnimatedStyle(() => {
        return {
          transform: [
            {
              translateX: translateX.value,
            },
            {
              translateY: translateY.value,
            },
          ],
        };
      });


  return (
    <PanGestureHandler onGestureEvent={onDrag}>
    <AnimatedView style={[containerStyle,{ top: -350 }]}>
        <TapGestureHandler onGestureEvent={onDoubleTap} numberOfTaps={2}>
      <AnimatedImage
        source={stickerSource}
        resizeMode="contain"
        style={[imageStyle, { width: imageSize, height: imageSize }]}
      />
      </TapGestureHandler>
    </AnimatedView>
    </PanGestureHandler>
  );
}
