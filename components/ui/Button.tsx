import { cn } from '@/util';
import React, { FC, ReactNode } from 'react';
import { Pressable, PressableProps } from 'react-native';

interface Props extends PressableProps {
  className?: string;
  children: ReactNode;
}

const Button: FC<Props> = ({ className, children, ...rest }: Props) => {
  return (
    <Pressable
      className={cn('mx-auto w-4/5 rounded-full bg-[#15A581] p-4', className)}
      style={({ pressed }) => ({
        opacity: pressed ? 0.9 : 1,
      })}
      {...rest}
    >
      {children}
    </Pressable>
  );
};

export default Button;
