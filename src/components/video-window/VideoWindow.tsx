import {useEffect, useRef, useState} from 'react'
import io from 'socket.io-client'
import {useNavigate} from "react-router";
import {useStore} from "../../Store";

const socket = io('http://192.168.1.4:8181', {autoConnect: false})

export default function VideoWindow() {
    const localVideo = useRef<HTMLVideoElement | null>(null)
    const remoteVideo = useRef<HTMLVideoElement | null>(null)
    const pcRef = useRef<RTCPeerConnection | null>(null)
    const dataChannelRef = useRef<RTCDataChannel | null>(null)
    const room = useStore((state) => state.callId);
    const [callStarted, setCallStarted] = useState<boolean>(false)
    const navigate = useNavigate();
    const apiInited = useStore((state) => state.apiInited);

    useEffect(() => {
        if (!apiInited) {
            navigate('/login');
        } else if (!room) {
            navigate('/');
        }
        socket.on('created', async (room: string) => {
            console.log('[Socket] created room', room)
            await init(true)
        })

        socket.on('joined', async (room: string) => {
            console.log('[Socket] joined room', room)
            await init(false)
        })

        socket.on('join', () => {
            console.log('[Socket] another peer joined, sending offer...')
            createOffer();
        })

        socket.on('message', async (message: any) => {
            const pc = pcRef.current

            if (!pc) return

            if (message.type === 'offer') {
                if (!pc.getSenders().length) {
                    const stream = await navigator.mediaDevices.getUserMedia({video: true, audio: true})
                    if (localVideo.current) localVideo.current.srcObject = stream
                    stream.getTracks().forEach(track => pc.addTrack(track, stream))
                }
                await pc.setRemoteDescription(new RTCSessionDescription(message as RTCSessionDescriptionInit))
                const answer = await pc.createAnswer()
                await pc.setLocalDescription(answer)
                socket.emit('message', {...answer, channel: room})
            } else if (message.type === 'answer') {
                await pc.setRemoteDescription(new RTCSessionDescription(message as RTCSessionDescriptionInit))
            } else if (message.type === 'candidate') {
                try {
                    await pc.addIceCandidate(message.candidate as RTCIceCandidateInit)
                } catch (err) {
                    console.error('Error adding ICE candidate', err)
                }
            }
        })

        return () => {
            socket.off()
            pcRef.current?.close()
        }
    }, [apiInited]);

    async function startCall(): Promise<void> {
        if (callStarted) return
        setCallStarted(true)
        socket.connect()
        socket.emit('create or join', room)
    }

    function stopCall(): void {
        try {
            const dc = dataChannelRef.current
            if (dc && dc.readyState !== 'closed') {
                try {
                    dc.close()
                } catch {
                    console.warn('[Data] failed to close data channel')
                }
            }

            const pc = pcRef.current
            if (pc) {
                try {
                    pc.getSenders().forEach(s => {
                        try {
                            s.track?.stop()
                        } catch {
                            console.warn('[RTC] failed to stop remote tracks')
                        }
                    })
                } catch {
                    console.warn('[RTC] failed to stop local tracks')
                }
                try {
                    pc.close()
                } catch {
                    console.warn('[RTC] failed to close peer connection')
                }
                pcRef.current = null
            }

            const localEl = localVideo.current
            if (localEl && localEl.srcObject) {
                const stream = localEl.srcObject as MediaStream
                stream.getTracks().forEach(t => {
                    try {
                        t.stop()
                    } catch {
                    }
                })
                localEl.srcObject = null
            }

            const remoteEl = remoteVideo.current
            if (remoteEl && remoteEl.srcObject) {
                const rstream = remoteEl.srcObject as MediaStream
                rstream.getTracks().forEach(t => {
                    try {
                        t.stop()
                    } catch {
                        console.warn('[RTC] failed to stop remote track')
                    }
                })
                remoteEl.srcObject = null
            }

            try {
                socket.off()
            } catch {
                console.warn('[Socket] failed to detach socket listeners')
            }
            try {
                if (socket.connected) socket.disconnect()
            } catch {
                console.warn('[Socket] failed to disconnect socket')
            }
        } finally {
            setCallStarted(false)
            navigate('/')
        }
    }

    async function init(isCaller: boolean): Promise<void> {
        const config: RTCConfiguration = {
            iceServers: [
                {urls: ['stun:stun.l.google.com:19302']}
            ],
            iceCandidatePoolSize: 10
        }

        console.log('[RTC] initializing')
        const pc = new RTCPeerConnection(config)
        pcRef.current = pc

        const stream = await navigator.mediaDevices.getUserMedia({video: true, audio: true})
        if (localVideo.current) localVideo.current.srcObject = stream
        stream.getTracks().forEach(track => pc.addTrack(track, stream))

        pc.ontrack = (event: RTCTrackEvent) => {
            console.log('[RTC] remote stream received')
            if (remoteVideo.current) remoteVideo.current.srcObject = event.streams[0]
        }

        pc.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
            console.log('[RTC] on candidate')
            if (event.candidate) {
                socket.emit('message', {type: 'candidate', candidate: event.candidate, channel: room})
            }
        }

        pc.oniceconnectionstatechange = () => console.log('ICE state:', pc.iceConnectionState)

        if (isCaller) {
            console.log('[RTC] caller initialized')
            const channel = pc.createDataChannel('chat')
            dataChannelRef.current = channel
            setupDataChannel(channel)
        } else {
            console.log('[RTC] not caller initialized')
            pc.ondatachannel = (event: RTCDataChannelEvent) => {
                const channel = event.channel
                dataChannelRef.current = channel
                setupDataChannel(channel)
            }
        }
    }

    function setupDataChannel(channel: RTCDataChannel): void {
        channel.onopen = () => console.log('[Data] channel open')
        channel.onclose = () => console.log('[Data] channel closed')
        channel.onmessage = (e: MessageEvent<string>) => {
            console.log('[Data] message:', e.data)
            // setMessages(prev => [...prev, {from: 'remote', text: e.data}])
        }
    }

    async function createOffer(): Promise<void> {
        const pc = pcRef.current
        if (!pc) return
        const offer = await pc.createOffer({iceRestart: true})
        await pc.setLocalDescription(offer)
        socket.emit('message', {...offer, channel: room})
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

            {!callStarted && (
                <button
                    onClick={startCall}
                    style={{
                        position: 'absolute',
                        top: '16px',
                        left: '16px',
                        padding: '8px 16px',
                        fontSize: '16px',
                        zIndex: 30,
                    }}
                >
                    Start
                </button>
            )}
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
