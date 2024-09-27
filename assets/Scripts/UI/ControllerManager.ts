import { _decorator, Component, Node, Event } from 'cc';
import EventManager from '../../Runtime/EventManager';
import { EVENT_ENUM } from '../../Enums';
const { ccclass, property } = _decorator;

@ccclass('ControllerManager')
export class ControllerManager extends Component {
    handleCtrl(event: Event, type: string) {
        EventManager.instance.emit(EVENT_ENUM.PLAYER_CTRL, type)
    }
}

