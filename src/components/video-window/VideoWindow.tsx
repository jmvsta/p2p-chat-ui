import {useEffect, useRef, useState} from 'react'
import {useNavigate} from "react-router";
import {useStore} from "../../Store";

let ws: WebSocket | null = null

export function VideoWindow() {
    const localVideo = useRef<HTMLVideoElement | null>(null)
    const remoteVideo = useRef<HTMLVideoElement | null>(null)
    const pcRef = useRef<RTCPeerConnection | null>(null)
    const dataChannelRef = useRef<RTCDataChannel | null>(null)
    const room = useStore((state) => state.callId);
    const callStarted = useStore((state) => state.callStarted);
    const setCallStarted = useStore((state) => state.setCallStarted);
    const navigate = useNavigate();
    const apiInited = useStore((state) => state.apiInited);

    useEffect(() => {
        if (!apiInited) {
            navigate('/login');
        } else if (!room) {
            navigate('/');
        }
        startCall()
        return () => {
            ws?.close();
            pcRef.current?.close();
        };
    }, [apiInited, room]);

    async function startCall(): Promise<void> {
        if (callStarted) return;
        setCallStarted(true);
        ws = new WebSocket(`ws://localhost:8082/ws`);
        ws.onopen = () => {
            ws!.send(JSON.stringify({type: "create_or_join", room: room}));
        };
        ws.onmessage = async (msg) => {
            const data = JSON.parse(msg.data);
            switch (data.type) {
                case "created":
                    console.log("Received created", data);
                    await init(true);
                    break;
                case "joined":
                    await init(false);
                    break;
                case "join":
                    createOffer();
                    break;
                case "signal":
                    await handleSignal(data.data);
                    break;
            }
        };
        ws.onclose = () => console.log("WS closed");
    }

    function stopCall(): void {
        dataChannelRef.current?.close();
        pcRef.current?.close();
        ws?.close();
        if (localVideo.current?.srcObject) {
            const stream = localVideo.current.srcObject as MediaStream;
            stream.getTracks().forEach(t => t.stop());
            localVideo.current.srcObject = null;
        }
        if (remoteVideo.current?.srcObject) {
            const stream = remoteVideo.current.srcObject as MediaStream;
            stream.getTracks().forEach(t => t.stop());
            remoteVideo.current.srcObject = null;
        }
        setCallStarted(false);
        navigate('/');
    }

    async function init(isCaller: boolean): Promise<void> {
        const pc = new RTCPeerConnection({
            iceServers: [{urls: ['stun:stun.l.google.com:19302']}],
            iceCandidatePoolSize: 10
        });
        pcRef.current = pc;

        const stream = await navigator.mediaDevices.getUserMedia({video: true, audio: true});
        localVideo.current!.srcObject = stream;
        stream.getTracks().forEach(track => pc.addTrack(track, stream));
        pc.ontrack = (e) => {
            remoteVideo.current!.srcObject = e.streams[0];
        };
        pc.onicecandidate = (e) => {
            if (e.candidate) {
                ws!.send(JSON.stringify({
                    event: "signal",
                    room,
                    data: {type: "candidate", candidate: e.candidate}
                }));
            }
        };
        if (isCaller) {
            const ch = pc.createDataChannel('chat');
            dataChannelRef.current = ch;
            setupDataChannel(ch);
        } else {
            pc.ondatachannel = (e) => {
                const ch = e.channel;
                dataChannelRef.current = ch;
                setupDataChannel(ch);
            };
        }
    }

    async function createOffer() {
        const pc = pcRef.current;
        const offer = await pc!.createOffer({iceRestart: true});
        await pc!.setLocalDescription(offer);

        ws!.send(JSON.stringify({type: "signal", room, data: offer}));
    }

    async function handleSignal(m: any) {
        const pc = pcRef.current;
        if (!pc) return;

        switch (m.type) {
            case "offer": {
                if (!pc.getSenders().length) {
                    const stream = await navigator.mediaDevices.getUserMedia({video: true, audio: true});
                    localVideo.current!.srcObject = stream;
                    stream.getTracks().forEach(t => pc.addTrack(t, stream));
                }

                await pc.setRemoteDescription(new RTCSessionDescription(m));
                const answer: RTCLocalSessionDescriptionInit = await pc.createAnswer();
                await pc.setLocalDescription(answer);

                ws!.send(JSON.stringify({type: "signal", room, data: answer}));
                break;
            }
            case "answer":
                await pc.setRemoteDescription(new RTCSessionDescription(m));
                break;
            case "candidate":
                await pc.addIceCandidate(m.candidate);
                break;
        }
    }

    function setupDataChannel(channel: RTCDataChannel) {
        channel.onopen = () => console.log("DC open");
        channel.onclose = () => console.log("DC closed");
        channel.onmessage = (e) => console.log("DC message", e.data);
    }

    return (
        <div
            style={{
                position: 'relative',
                width: '100vw',
                height: '100vh',
                overflow: 'hidden',
                background: '#000',
            }}
        >
            <video
                ref={remoteVideo}
                autoPlay
                playsInline
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    display: 'block',
                    background: '#000',
                }}
            />

            <video
                ref={localVideo}
                autoPlay
                muted
                playsInline
                style={{
                    position: 'absolute',
                    bottom: '16px',
                    right: '16px',
                    width: '200px',
                    height: '120px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    background: '#000',
                    boxShadow: '0 0 10px rgba(0,0,0,0.6)',
                    zIndex: 20,
                }}
            />

            {/*{!callStarted && (*/}
            {/*    <button*/}
            {/*        onClick={startCall}*/}
            {/*        style={{*/}
            {/*            position: 'absolute',*/}
            {/*            top: '16px',*/}
            {/*            left: '16px',*/}
            {/*            padding: '8px 16px',*/}
            {/*            fontSize: '16px',*/}
            {/*            zIndex: 30,*/}
            {/*        }}*/}
            {/*    >*/}
            {/*        Start*/}
            {/*    </button>*/}
            {/*)}*/}
            {callStarted && (
                <button
                    onClick={stopCall}
                    style={{
                        position: 'absolute',
                        top: '16px',
                        left: '16px',
                        padding: '8px 16px',
                        fontSize: '16px',
                        zIndex: 30,
                    }}
                >
                    Stop
                </button>
            )}

        </div>
    )
}
