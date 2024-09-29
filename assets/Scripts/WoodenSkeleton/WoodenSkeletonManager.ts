import { _decorator, Component, Node, Sprite, UITransform, Animation, AnimationClip, animation, SpriteFrame, math } from 'cc';
import { WoodenSkeletonStateMachine } from './WoodenSkeletonStateMachine';
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM } from '../../Enums';
import EventManager from '../../Runtime/EventManager';
import DataManager from '../../Runtime/DataManager';
import { EnemyManager } from '../../Base/EnemyManager';
import { IENTITY } from '../../Levels';


const { ccclass, property } = _decorator;

@ccclass('WoodenSkeletonManager')
export class WoodenSkeletonManager extends EnemyManager {

    async init(params: IENTITY) {
        this.fsm = this.addComponent(WoodenSkeletonStateMachine)
        await this.fsm.init()
        super.init(params)
        EventManager.instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.onAttack, this)
    }

    protected onDestroy(): void {
        super.onDestroy()
        EventManager.instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.onAttack)
    }

    onAttack() {
        if (this.state === ENTITY_STATE_ENUM.DEATH || !DataManager.instance.player) return
        const { x: playerX, y: playerY } = DataManager.instance.player

        if ((this.x === playerX && Math.abs(this.y - playerY) <= 1) || (this.y === playerY && Math.abs(this.x - playerX) <= 1)) {
            this.state = ENTITY_STATE_ENUM.ATTACK
            EventManager.instance.emit(EVENT_ENUM.ATTACK_PLAYER, ENTITY_STATE_ENUM.DEATH)
        } else {
            this.state = ENTITY_STATE_ENUM.IDLE
        }
    }
}

