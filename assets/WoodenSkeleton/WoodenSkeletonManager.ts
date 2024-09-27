import { _decorator, Component, Node, Sprite, UITransform, Animation, AnimationClip, animation, SpriteFrame, math } from 'cc';
import { EntityManager } from '../Base/EntityManager';
import { WoodenSkeletonStateMachine } from './WoodenSkeletonStateMachine';
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM } from '../Enums';
import EventManager from '../Runtime/EventManager';
import DataManager from '../Runtime/DataManager';


const { ccclass, property } = _decorator;

@ccclass('WoodenSkeletonManager')
export class WoodenSkeletonManager extends EntityManager {

    async init() {
        this.fsm = this.addComponent(WoodenSkeletonStateMachine)
        await this.fsm.init()
        super.init({
            x: 2,
            y: 4,
            type: ENTITY_TYPE_ENUM.ENEMY,
            direction: DIRECTION_ENUM.TOP,
            state: ENTITY_STATE_ENUM.IDLE
        })

        EventManager.instance.on(EVENT_ENUM.PLAYER_BORN, this.onChangeDirection, this)
        EventManager.instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.onChangeDirection, this)
        EventManager.instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.onAttack, this)

        this.onChangeDirection(true)
    }

    onChangeDirection(isInit: boolean) {
        if (!DataManager.instance.player) return
        const { x: playerX, y: playerY } = DataManager.instance.player

        const disX = Math.abs(playerX - this.x)
        const disY = Math.abs(playerY - this.y)

        if (disX === disY && !isInit) {
            return
        }

        if (this.x <= playerX && this.y >= playerY) {
            this.direction = disX > disY ? DIRECTION_ENUM.RIGHT : DIRECTION_ENUM.TOP
        } else if (this.x <= playerX && this.y <= playerY) {
            this.direction = disX > disY ? DIRECTION_ENUM.RIGHT : DIRECTION_ENUM.BOTTOM
        } else if (this.x >= playerX && this.y <= playerY) {
            this.direction = disX > disY ? DIRECTION_ENUM.LEFT : DIRECTION_ENUM.BOTTOM
        } else if (this.x >= playerX && this.y >= playerY) {
            this.direction = disX > disY ? DIRECTION_ENUM.LEFT : DIRECTION_ENUM.TOP
        }
    }

    onAttack() {
        const { x: playerX, y: playerY } = DataManager.instance.player

        if ((this.x === playerX && Math.abs(this.y - playerY) <= 1) || (this.y === playerY && Math.abs(this.x - playerX) <= 1)) {
            this.state = ENTITY_STATE_ENUM.ATTACK
            EventManager.instance.emit(EVENT_ENUM.ATTACK_PLAYER, ENTITY_STATE_ENUM.DEATH)
        } else {
            this.state = ENTITY_STATE_ENUM.IDLE
        }
    }
}

