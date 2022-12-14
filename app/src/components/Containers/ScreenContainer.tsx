import React, {ReactNode} from 'react';
import {View} from 'native-base';
import {IViewProps} from 'native-base/lib/typescript/components/basic/View/types';

export default function Container({
  children,
  ...props
}: {children: ReactNode} & IViewProps) {
  return (
    <View flex="1" px="10px" {...props}>
      {children}
    </View>
  );
}
