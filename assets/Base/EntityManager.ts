import { _decorator, Component, Node, Sprite, UITransform, Animation, AnimationClip, animation, SpriteFrame, math } from 'cc';
import { TILE_HEIGHT, TILE_WIDTH } from '../Scripts/Tile/TileManager';
import ResourceManager from '../Runtime/ResourceManager';
import { CONTROLLER_ENUM, DIRECTION_ENUM, DIRECTION_ORIGIN_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM, PARAMS_NAME_ENUM } from '../Enums';
import EventManager from '../Runtime/EventManager';
import { PlayerStateMachine } from '../Scripts/Player/PlayerStateMachine';
import { IEntity } from '../Levels';
import { StateMachine } from './StateMachine';
import { randomByLen } from '../Utils';
const { ccclass, property } = _decorator;

const ANIMATION_SPEED = 1 / 8

@ccclass('EntityManager')
export class EntityManager extends Component {
    id: string = randomByLen(12)
    x: number = 0
    y: number = 0
    fsm: StateMachine
    type: ENTITY_TYPE_ENUM

    private _direction: DIRECTION_ENUM
    private _state: ENTITY_STATE_ENUM


    get direction(): DIRECTION_ENUM {
        return this._direction
    }
    set direction(value: DIRECTION_ENUM) {
        this._direction = value
        this.fsm.setParamsValue(PARAMS_NAME_ENUM.DIRECTION, DIRECTION_ORIGIN_ENUM[value])
    }

    get state(): ENTITY_STATE_ENUM {
        return this._state
    }
    set state(value: ENTITY_STATE_ENUM) {
        this._state = value
        this.fsm.setParamsValue(value, true)
    }

    async init(params: IEntity) {
        const sprite = this.addComponent(Sprite);
        sprite.sizeMode = Sprite.SizeMode.CUSTOM;

        const transform = this.node.getComponent(UITransform)
        transform.setContentSize(TILE_WIDTH * 4, TILE_HEIGHT * 4);

        this.x = params.x
        this.y = params.y
        this.type = params.type
        this.direction = params.direction
        this.state = params.state

    }

    protected update(dt: number): void {
        this.node.setPosition(this.x * TILE_WIDTH - 1.5 * TILE_WIDTH, -this.y * TILE_HEIGHT + 1.5 * TILE_HEIGHT)
    }

    protected onDestroy(): void {

    }
}

