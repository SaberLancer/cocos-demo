import { _decorator, Component, Node, Sprite, UITransform, Animation, AnimationClip, animation, SpriteFrame, math } from 'cc';
import { EntityManager } from '../Base/EntityManager';
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM } from '../Enums';
import EventManager from '../Runtime/EventManager';
import DataManager from '../Runtime/DataManager';
import { IENTITY } from '../Levels';


const { ccclass, property } = _decorator;

@ccclass('EnemyManager')
export class EnemyManager extends EntityManager {

    async init(params: IENTITY) {
        super.init(params)

        EventManager.instance.on(EVENT_ENUM.PLAYER_BORN, this.onChangeDirection, this)
        EventManager.instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.onChangeDirection, this)
        EventManager.instance.on(EVENT_ENUM.ATTACK_ENEMY, this.onDeath, this)

        this.onChangeDirection(true)
    }

    protected onDestroy(): void {
        super.onDestroy()
        EventManager.instance.off(EVENT_ENUM.PLAYER_BORN, this.onChangeDirection)
        EventManager.instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.onChangeDirection)
        EventManager.instance.off(EVENT_ENUM.ATTACK_ENEMY, this.onDeath)
        // let index = DataManager.instance.enemies.indexOf(this)
        // DataManager.instance.enemies.splice(index, 1)
    }

    onChangeDirection(isInit: boolean) {
        if (this.state === ENTITY_STATE_ENUM.DEATH || !DataManager.instance.player) return
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

    onDeath(id: string) {
        if (id == this.id) {
            this.state = ENTITY_STATE_ENUM.DEATH
            // this.node.destroy()
        }
    }
}

