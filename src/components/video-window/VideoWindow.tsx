import {useEffect, useRef} from 'react'
import {useLocation, useNavigate} from "react-router";
import {useStore} from "../../Store";
import {useWebSocket} from "../../hooks/useWebSocket.ts";

export function VideoWindow() {
    const localVideo = useRef<HTMLVideoElement | null>(null)
    const remoteVideo = useRef<HTMLVideoElement | null>(null)
    const pcRef = useRef<RTCPeerConnection | null>(null)
    const dataChannelRef = useRef<RTCDataChannel | null>(null)
    const room = useStore((state) => state.callId);
    const setRoom = useStore((state) => state.setCallId);
    const callStarted = useStore((state) => state.callStarted);
    const setCallStarted = useStore((state) => state.setCallStarted);
    const navigate = useNavigate();
    const apiInited = useStore((state) => state.apiInited);
    const {connect, disconnect, send, wsRef} = useWebSocket();
    const location = useLocation();

    useEffect(() => {
        if (!apiInited) {
            navigate('/login');
        }
        if (callStarted) {
            console.log("Call already started");
            return
        }
        if (room !== '') {
            startCall()
        }
    }, [apiInited, location, callStarted, room]);


    async function startCall(): Promise<void> {
        if (callStarted) return;
        setCallStarted(true);
        const ws = connect(`ws://192.168.1.4:18086/ws`, async (data) => {
            switch (data.type) {
                case "created":
                    await init(true);
                    break;
                case "joined":
                    await init(false);
                    break;
                case "join":
                    createOffer();
                    break;
                case "signal":
                    console.log("Received signal", data);
                    await handleSignal(data.data);
                    break;
            }
        });

        ws.onopen = () => {
            send({type: "create_or_join", room: room});
        };
        ws.onclose = () => console.log("WS closed");
    }

    function stopCall(): void {
        disconnect()
        setCallStarted(false);
        setRoom('')
        dataChannelRef.current?.close();
        pcRef.current?.close();

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
                wsRef.current?.send(JSON.stringify({
                    type: "signal",
                    room,
                    data: {type: "candidate", candidate: e.candidate, channel: room}
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

        wsRef.current?.send(JSON.stringify({type: "signal", room, data: offer}));
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

                wsRef.current?.send(JSON.stringify({
                    type: "signal",
                    room: room,
                    data: {...answer, type: 'answer', channel: room}
                }));
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
