import { useEffect, useRef, useState } from "react";

import { Director, Publish } from "@millicast/sdk";
import { useDisclosure, useToast } from "@chakra-ui/react";
import { PublisherRoute } from "./index";

import { CONNECTION_STATUS } from "./PublisherRoute.constants";
import { useAtom } from "jotai";
import { inputAudio, inputVideo, devices } from "../../store/millicastConnection";

export const PublisherRouteContainer = () => {

    const streamRef = useRef(new MediaStream());

    const [audioDevice, setAudioDevice] = useAtom(inputAudio);
    const [videoDevice, setVideoDevice] = useAtom(inputVideo);

    const [availableDevices, setAvailableDevices] = useAtom(devices);
    useEffect(() => {
        if (!navigator.mediaDevices?.enumerateDevices) {
            console.log("enumerateDevices() not supported.");
        } else {
            navigator.mediaDevices
                .getUserMedia({ audio: true, video: true })
                .then((stream) => {
                    stream.getTracks().forEach((track) => track.stop());
                    navigator.mediaDevices
                        .enumerateDevices()
                        .then((devices) => {
                            // @ts-ignore
                            window.__DEVICES__ = devices;
                            setAvailableDevices(devices);
                        })
                        .catch((err) => {
                            console.error(`${err.name}: ${err.message}`);
                        });
                });
            // List cameras and microphones.
        }
    }, [setAvailableDevices]);

    const publishRef = useRef((() => {
        const searchParams = new URLSearchParams(window.location.search)
        const STREAM_NAME = searchParams.get("streamName") || process.env.REACT_APP_STREAM_NAME
        const PUBLISHING_TOKEN = searchParams.get("publishToken") || process.env.REACT_APP_PUBLISHING_TOKEN

        const tokenGenerator = () => Director.getPublisher({
            token: PUBLISHING_TOKEN,
            streamName: STREAM_NAME
        })

        return new Publish(STREAM_NAME, tokenGenerator);
    })());

    const toast = useToast({ position: "top" });
    const { isOpen: isMicOn, onToggle: toggleMic } = useDisclosure();
    const { isOpen: isCameraOn, onToggle: toggleCamera } = useDisclosure();

    const [connectionStatus, setConnectionStatus] = useState(
        CONNECTION_STATUS.NOT_CONNECTED
    );

    const handleConnect = () => {
        setConnectionStatus(CONNECTION_STATUS.CONNECTING);
        toast({
            title: "Starting stream...",
        });
        navigator.mediaDevices.getUserMedia({ audio: { deviceId: audioDevice || true }, video: { deviceId: videoDevice || true } }).then((newStream) => {
            newStream.getTracks().forEach((track) => {
                track.enabled = false
            });
            publishRef.current.connect({ mediaStream: newStream }).then(() => {
                toast({
                    title: "Stream started",
                });
                setConnectionStatus(CONNECTION_STATUS.CONNECTED);
            }).catch(() => {
                toast({
                    status: "error",
                    title: "Cannot start streaming, please check millicast details",
                });
                setConnectionStatus(CONNECTION_STATUS.NOT_CONNECTED);
            }).finally(() => {
                newStream.getTracks().forEach(track => track.stop())
                streamRef.current.getTracks().forEach((track) => {
                    publishRef.current.webRTCPeer.replaceTrack(track);
                });
            })
        }).catch(() => {
            toast({
                status: "error",
                title:
                    "Access to media devices is required in order to stream to millicast",
            });
        });
    }

    const handleDisconnect = () => {
        publishRef.current.stop()
        setConnectionStatus(CONNECTION_STATUS.NOT_CONNECTED)
        toast({
            status: "error",
            title: "Stream end"
        })
    }

    useEffect(() => {
        if (!isMicOn) {
            streamRef.current.getAudioTracks().forEach((track) => {
                track.stop();

                streamRef.current.removeTrack(track)
            })
            return
        }
        navigator.mediaDevices.getUserMedia({ audio: { deviceId: audioDevice || true } }).then((newStream) => {
            streamRef.current.getAudioTracks().forEach((track) => {
                track.stop();
                streamRef.current.removeTrack(track);
            });
            const newTracks = newStream.getAudioTracks()[0];
            streamRef.current.addTrack(newTracks)
            publishRef.current.webRTCPeer.replaceTrack(newTracks)

        })
    }, [isMicOn, audioDevice])

    useEffect(() => {
        if (!isCameraOn) {
            streamRef.current.getVideoTracks().forEach((track) => {
                track.stop();
                streamRef.current.removeTrack(track)
            })
            return
        }
        navigator.mediaDevices.getUserMedia({ video: { deviceId: videoDevice || true } }).then((newStream) => {
            streamRef.current.getVideoTracks().forEach((track) => {
                track.stop();
                streamRef.current.removeTrack(track);
            });
            const newTracks = newStream.getVideoTracks()[0];
            streamRef.current.addTrack(newTracks)
            publishRef.current.webRTCPeer.replaceTrack(newTracks)
        })
    }, [isCameraOn, videoDevice])

    return <PublisherRoute
        stream={streamRef.current}
        // mic
        isMicOn={isMicOn}
        onToggleMic={toggleMic}
        setAudio={setAudioDevice}
        // camera
        isCameraOn={isCameraOn}
        onToggleCamera={toggleCamera}
        setVideo={setVideoDevice}
        // connection
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
        connectionStatus={connectionStatus}
        availableDevices={availableDevices}
    />
}
