import { Text } from "native-base";
import React, { useState } from "react";
import TypeWriter from 'react-native-typewriter';


const messages = ['Velo 60m    ', 'tachfine 4h   ', 'creativite 50     '];


const ReservationTypeWriter = () => {

  const [messageIndex, setMessageIndex] = useState(0);
  const [typing, setTyping] = useState(1);

  const handleTypinEnd = () => {

    if (typing === 1) {
      setTyping(-1);
    } else {
      const currentMessageIndex = messages.length - messageIndex === 1 ? 0 : messageIndex + 1;
      setMessageIndex(currentMessageIndex)
      setTyping(1);
    }
  }

  return (
    <TypeWriter typing={typing} onTypingEnd={handleTypinEnd} minDelay={200} maxDelay={400}>
                <Text fontSize="3xl" style={{
                  color: '#5f6067'
                }}>{messages[messageIndex]}</Text>
              </TypeWriter>
  )
}

export default ReservationTypeWriter;