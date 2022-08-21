import React from 'react';
import {Button, Flex, Heading, HStack, Stack, Text, View} from 'native-base';
import {Room} from '@shared/types/Room';
import {getAvatar} from '@shared/constants/functions/getAvatar';
import ImageAvatar from '@components/Elements/ImageAvatar';
import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
import {NativeStackApp} from '@navigation/';

export default function RoomCard({room}: {room: Room}) {
  const navigation = useNavigation<NativeStackApp['navigation']>();

  let whenAdded = moment(room.createdAt).local().fromNow();
  whenAdded = whenAdded[0].toUpperCase() + whenAdded.slice(1);
  return (
    <View p="2px">
      <View borderRadius="20px" overflow="hidden" bg="white" shadow="1">
        <View
          bg="secondary"
          overflow="hidden"
          borderWidth="1px"
          borderColor="border">
          <Stack justifyContent="center" space={5} p="12px">
            <Stack flex="1">
              <Heading
                fontSize="subheader"
                color="text"
                noOfLines={1}
                textTransform="uppercase">
                {room.title}
              </Heading>
              <Text color="text" fontSize="sub" noOfLines={2}>
                {room.description}
              </Text>
            </Stack>

            {room.memebers.length > 0 ? (
              <Stack space={2}>
                <Heading textTransform="capitalize">Members</Heading>
                <HStack
                  alignItems="center"
                  h="100%"
                  flex="1"
                  overflow="hidden"
                  mr="5px">
                  {room.memebers.map((member, index) => (
                    <ImageAvatar
                      key={index}
                      mr="-20px"
                      uri={getAvatar(member.avatar)}
                    />
                  ))}
                </HStack>
              </Stack>
            ) : null}
            <Flex flexDir="row" justify="space-between" align="center">
              <HStack space={2} alignItems="center">
                <ImageAvatar
                  size="25px"
                  uri={getAvatar(room.ownerMember.avatar)}
                />
                <Text textTransform="capitalize">
                  {room.ownerMember.username}
                </Text>
              </HStack>
              <Text
                textAlign="right"
                fontSize="mono"
                textTransform="capitalize">
                {whenAdded}
              </Text>
              <Button
                alignSelf="flex-end"
                onPress={() => navigation.navigate('call', {id: room.id})}
                bg="primary"
                _text={{color: 'invert'}}
                px="30px"
                _pressed={{opacity: 0.8}}>
                View
              </Button>
            </Flex>
          </Stack>
        </View>
      </View>
    </View>
  );
}
