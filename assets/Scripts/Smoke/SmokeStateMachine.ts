import { _decorator, AnimationClip, Animation } from 'cc';
import { getInitParamsNumber, getInitParamsTrigger, StateMachine } from '../../Base/StateMachine';
import { ENTITY_STATE_ENUM, PARAMS_NAME_ENUM } from '../../Enums';
import IdleSubStateMachine from './IdleSubStateMachine';
import DeathSubStateMachine from './DeathSubStateMachine';
import { EntityManager } from '../../Base/EntityManager';
const { ccclass, property } = _decorator;

@ccclass('SmokeStateMachine')
export class SmokeStateMachine extends StateMachine {

    async init() {
        this.animationComponent = this.addComponent(Animation);

        this.initParms()
        this.initStateMachine()
        this.initAnimationEvent()

        await Promise.all(this.waitingList)
    }

    initParms() {
        this.params.set(PARAMS_NAME_ENUM.DIRECTION, getInitParamsNumber())
        this.params.set(PARAMS_NAME_ENUM.IDLE, getInitParamsTrigger())
        this.params.set(PARAMS_NAME_ENUM.DEATH, getInitParamsTrigger())
    }

    initStateMachine() {
        this.stateMachine.set(PARAMS_NAME_ENUM.IDLE, new IdleSubStateMachine(this))
        this.stateMachine.set(PARAMS_NAME_ENUM.DEATH, new DeathSubStateMachine(this))
    }

    initAnimationEvent() {
        this.animationComponent.on(Animation.EventType.FINISHED, () => {
            const name = this.animationComponent.defaultClip.name
            const whiteList = ['idle']
            if (whiteList.some(item => name.includes(item))) {
                this.node.getComponent(EntityManager).state = ENTITY_STATE_ENUM.DEATH
            }
        })
    }

    run() {
        switch (this.currentState) {
            case this.stateMachine.get(PARAMS_NAME_ENUM.IDLE):
            case this.stateMachine.get(PARAMS_NAME_ENUM.DEATH):
                if (this.params.get(PARAMS_NAME_ENUM.IDLE).value) {
                    this.currentState = this.stateMachine.get(PARAMS_NAME_ENUM.IDLE)
                } else if (this.params.get(PARAMS_NAME_ENUM.DEATH).value) {
                    this.currentState = this.stateMachine.get(PARAMS_NAME_ENUM.DEATH)
                } else {
                    this.currentState = this.currentState
                }
                break
            default:
                this.currentState = this.stateMachine.get(PARAMS_NAME_ENUM.IDLE)
                break
        }
    }
}

