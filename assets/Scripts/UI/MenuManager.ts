import { _decorator, Component, Node, Event } from 'cc';
import EventManager from '../../Runtime/EventManager';
import { EVENT_ENUM } from '../../Enums';
const { ccclass, property } = _decorator;

@ccclass('MenuManager')
export class MenuManager extends Component {
    handleUndo() {
        EventManager.instance.emit(EVENT_ENUM.REVOKE_STEP)
    }

    handleRestart() {
        EventManager.instance.emit(EVENT_ENUM.RESET_LEVEL)
    }

    handleOut() {
        EventManager.instance.emit(EVENT_ENUM.OUT_BATTLE)
    }
}

