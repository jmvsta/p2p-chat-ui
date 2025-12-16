import ActionButton from "../action-button/ActionButton.tsx";
import {useStore} from "../../Store.ts";
import {useServices} from "../../Providers.tsx";
import {useEffect} from "react";
import {useNavigate} from "react-router";


const Calls = () => {

    const openListEditPopup = useStore((state) => state.openListEditPopup);
    const closeListEditPopup = useStore((state) => state.closeListEditPopup);
    const calls = useStore((state) => state.calls);
    const callStarted = useStore((state) => state.callStarted);
    const {callService} = useServices()
    const navigate = useNavigate();

    useEffect(() => {
        if (callStarted) return;
        const call = calls.filter(call => call.status === 'PENDING')
        if (call.length == 1) {
            openListEditPopup(`Test is calling`, null, null, [
                <ActionButton id='close-popup-button' name={'ANSWER'} onClick={() => {
                    callService.updateCall(call[0].id, call[0].chatId, 'ACCEPTED').then(() => {
                        navigate('/call')
                    })
                    closeListEditPopup()
                }}
                              style={{width: '100% !important', alignSelf: 'flex-center'}}/>,
                <ActionButton id='close-popup-button' name={'DENY'} onClick={() => {
                    callService.updateCall(call[0].id, call[0].chatId, 'DENIED')
                    closeListEditPopup()
                }}
                              style={{width: '100% !important', alignSelf: 'flex-center'}}/>
            ]);
        }

    }, [calls, callStarted]);
    return <></>
}

export default Calls;