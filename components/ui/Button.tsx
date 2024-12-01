import { cn } from '@/utils';
import React, { FC, ReactNode } from 'react';
import { Pressable, PressableProps, View } from 'react-native';

interface Props extends PressableProps {
  className?: string;
  children: ReactNode;
}

const Button: FC<Props> = ({ className, children, ...rest }: Props) => {
  return (
    <Pressable {...rest}>
      {({ pressed }) => (
        <View
          className={cn(
            'mx-auto w-4/5 rounded-full bg-[#15A581] p-4',
            className
          )}
          style={pressed && { opacity: 0.8 }}
        >
          {children}
        </View>
      )}
    </Pressable>
  );
};

export default Button;
