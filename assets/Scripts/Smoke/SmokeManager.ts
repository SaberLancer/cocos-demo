import { _decorator, Component, Node, Sprite, UITransform, Animation, AnimationClip, animation, SpriteFrame, math } from 'cc';
import { CONTROLLER_ENUM, DIRECTION_ENUM, DIRECTION_ORIGIN_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM, PARAMS_NAME_ENUM } from '../../Enums';
import EventManager from '../../Runtime/EventManager';
import { EntityManager } from '../../Base/EntityManager';
import DataManager from '../../Runtime/DataManager';
import { SmokeStateMachine } from './SmokeStateMachine';
import { IEntity } from '../../Levels';
const { ccclass, property } = _decorator;

const ANIMATION_SPEED = 1 / 8

@ccclass('SmokeManager')
export class SmokeManager extends EntityManager {

    async init(params: IEntity) {
        this.fsm = this.addComponent(SmokeStateMachine)
        await this.fsm.init()
        super.init(params)

        EventManager.instance.on(EVENT_ENUM.OPEN_DOOR, this.onDeath, this)
    }

    protected onDestroy(): void {
        super.onDestroy()
        EventManager.instance.off(EVENT_ENUM.OPEN_DOOR, this.onDeath)
    }

    onDeath() {
        if (DataManager.instance.enemies.filter((enemy) => enemy.state !== ENTITY_STATE_ENUM.DEATH).length === 0 && this.state !== ENTITY_STATE_ENUM.DEATH) {
            this.state = ENTITY_STATE_ENUM.DEATH
        }
    }
}

