import { _decorator, Component, Node, Sprite, UITransform, Animation, AnimationClip, animation, SpriteFrame, math } from 'cc';
import { CONTROLLER_ENUM, DIRECTION_ENUM, DIRECTION_ORIGIN_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM, PARAMS_NAME_ENUM } from '../../Enums';
import EventManager from '../../Runtime/EventManager';
import { EntityManager } from '../../Base/EntityManager';
import DataManager from '../../Runtime/DataManager';
import { DoorStateMachine } from './DoorStateMachine';
const { ccclass, property } = _decorator;

const ANIMATION_SPEED = 1 / 8

@ccclass('DoorManager')
export class DoorManager extends EntityManager {

    async init() {
        this.fsm = this.addComponent(DoorStateMachine)
        await this.fsm.init()
        super.init({
            x: 7,
            y: 8,
            type: ENTITY_TYPE_ENUM.DOOR,
            direction: DIRECTION_ENUM.TOP,
            state: ENTITY_STATE_ENUM.IDLE
        })

        EventManager.instance.on(EVENT_ENUM.OPEN_DOOR, this.onDeath, this)
    }

    onDeath() {
        if (DataManager.instance.enemies.filter((enemy) => enemy.state !== ENTITY_STATE_ENUM.DEATH).length === 0 && this.state !== ENTITY_STATE_ENUM.DEATH) {
            this.state = ENTITY_STATE_ENUM.DEATH
        }
    }
}

