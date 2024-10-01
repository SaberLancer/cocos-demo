import { _decorator, Component, director, Node } from 'cc';
import FadeManager from '../../Runtime/FadeManager';
import { SCENE_ENUM } from '../../Enums';
const { ccclass, property } = _decorator;

@ccclass('StartManager')
export class StartManager extends Component {
    onLoad() {
        FadeManager.instance.fadeOut(1000)
        this.node.once(Node.EventType.TOUCH_START, this.startGame, this)
    }

    async startGame() {
        await FadeManager.instance.fadeIn(300)
        director.loadScene(SCENE_ENUM.Battle)
    }
}

