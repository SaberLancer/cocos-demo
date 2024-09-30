import { _decorator, Component, Node, Sprite, UITransform, Animation, AnimationClip, animation, SpriteFrame, math } from 'cc';
import { BurstStateMachine } from './BurstStateMachine';
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM } from '../../Enums';
import EventManager from '../../Runtime/EventManager';
import DataManager from '../../Runtime/DataManager';
import { IENTITY } from '../../Levels';
import { EntityManager } from '../../Base/EntityManager';
import { TILE_HEIGHT, TILE_WIDTH } from '../Tile/TileManager';


const { ccclass, property } = _decorator;

@ccclass('BurstManager')
export class BurstManager extends EntityManager {

    async init(params: IENTITY) {
        this.fsm = this.addComponent(BurstStateMachine)
        await this.fsm.init()
        super.init(params)
        EventManager.instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.onBurst, this)

        const transform = this.node.getComponent(UITransform)
        transform.setContentSize(TILE_WIDTH, TILE_HEIGHT);
    }

    protected update(dt: number): void {
        super.update(dt)
        this.node.setPosition(this.x * TILE_WIDTH, -this.y * TILE_HEIGHT)
    }

    protected onDestroy(): void {
        super.onDestroy()
        EventManager.instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.onBurst)
    }

    onBurst() {
        if (this.state === ENTITY_STATE_ENUM.DEATH || !DataManager.instance.player) return
        const { x: playerX, y: playerY } = DataManager.instance.player

        if ((this.x === playerX && this.y === playerY) && this.state === ENTITY_STATE_ENUM.IDLE) {
            this.state = ENTITY_STATE_ENUM.ATTACK
        } else if (this.state === ENTITY_STATE_ENUM.ATTACK) {
            this.state = ENTITY_STATE_ENUM.DEATH
            if (this.x === playerX && this.y === playerY) {
                EventManager.instance.emit(EVENT_ENUM.ATTACK_PLAYER, ENTITY_STATE_ENUM.AIRDEATH)
            }
        }
    }

}

