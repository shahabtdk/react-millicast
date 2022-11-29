import {
    Stack, Flex, Heading, Text, Box, Button, IconButton, Menu,
    MenuButton,
    MenuList,
    MenuItem,
} from '@chakra-ui/react'
import { useRef, useEffect } from 'react'
import { CONNECTION_STATUS } from './PublisherRoute.constants'
import {
    BiVideo,
    BiVideoOff,
    BiMicrophone,
    BiMicrophoneOff,
    BiChevronUp,
    BiChevronDown
} from "react-icons/bi";

export const PublisherRoute = ({
    stream,
    // mic
    isMicOn,
    onToggleMic,
    setAudio,
    // camera
    isCameraOn,
    onToggleCamera,
    setVideo,
    // connecting
    onConnect,
    onDisconnect,
    connectionStatus,
    availableDevices,
}) => {
    const videoElRef = useRef(null);
    useEffect(() => {
        videoElRef.current.srcObject = stream;
    }, [stream]);

    const isConnected = connectionStatus === CONNECTION_STATUS.CONNECTED;
    const isConnecting = connectionStatus === CONNECTION_STATUS.CONNECTING;

    // const availableDevices = useAtomValue(devices);


    return (
        <Stack w="100%" h="100%" gap={2}>
            <Flex justifyContent="space-between" alignItems="flex-end">
                <Box>
                    <Heading size="lg">React with Millicast</Heading>
                    <Text mt={0}>Lets Publish your Stream</Text>
                </Box>
                <Button
                    bg="black"
                    color="white"
                    isLoading={isConnecting}
                    isDisabled={isConnecting}
                    onClick={isConnected ? onDisconnect : onConnect}
                >
                    {isConnecting
                        ? "Connecting..."
                        : isConnected
                            ? "Stop Webinar"
                            : "Start Webinar"}
                </Button>
            </Flex>

            <Box
                w="100%"
                overflow="hidden"
                background="#eee"
                flex={1}
                borderRadius={8}
            >
                <Box
                    ref={videoElRef}
                    as="video"
                    muted
                    autoPlay
                    playsInline
                    w="100%"
                    h="100%"
                    objectFit="cover"
                    visibility={isCameraOn ? "visible" : "hidden"}
                />
            </Box>
            <Flex gap={2} justifyContent="center">
                <IconButton
                    colorScheme={isMicOn ? "gray" : "red"}
                    onClick={onToggleMic}
                >
                    {isMicOn ? <BiMicrophone /> : <BiMicrophoneOff />}
                </IconButton>
                <Menu>
                    {({ isOpen }) => (
                        <>
                            <MenuButton isActive={isOpen} as={Button} >
                                {isOpen ? <BiChevronUp /> : <BiChevronDown />}
                            </MenuButton>
                            <MenuList>
                                {availableDevices
                                    .filter((d) => d.kind === "audioinput")
                                    .map((device) => <MenuItem key={device.deviceId} value={device.deviceId} onClick={() => setAudio(device.deviceId)}>{device.label}</MenuItem>
                                    )}
                            </MenuList>
                        </>
                    )}
                </Menu>
                <IconButton
                    colorScheme={isCameraOn ? "gray" : "red"}
                    onClick={onToggleCamera}
                >
                    {isCameraOn ? <BiVideo /> : <BiVideoOff />}
                </IconButton>
                <Menu>
                    {({ isOpen }) => (
                        <>
                            <MenuButton isActive={isOpen} as={Button} >
                                {isOpen ? <BiChevronUp /> : <BiChevronDown />}
                            </MenuButton>
                            <MenuList>
                                {availableDevices
                                    .filter((d) => d.kind === "videoinput")
                                    .map((device) => <MenuItem key={device.deviceId} value={device.deviceId} onClick={() => setVideo(device.deviceId)}>{device.label}</MenuItem>
                                    )}
                            </MenuList>
                        </>
                    )}
                </Menu>

            </Flex>
        </Stack >
    )
}
