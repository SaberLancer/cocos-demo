import { _decorator, AnimationClip, Animation } from 'cc';
import { getInitParamsNumber, getInitParamsTrigger, StateMachine } from '../Base/StateMachine';
import { ENTITY_STATE_ENUM, PARAMS_NAME_ENUM } from '../Enums';
import IdleSubStateMachine from './IdleSubStateMachine';
import AttackSubStateMachine from './AttackSubStateMachine';
import { EntityManager } from '../Base/EntityManager';
const { ccclass, property } = _decorator;

@ccclass('WoodenSkeletonStateMachine')
export class WoodenSkeletonStateMachine extends StateMachine {

    async init() {
        this.animationComponent = this.addComponent(Animation);

        this.initParms()
        this.initStateMachine()
        this.initAnimationEvent()

        await Promise.all(this.waitingList)
    }

    initParms() {
        this.params.set(PARAMS_NAME_ENUM.IDLE, getInitParamsTrigger())
        this.params.set(PARAMS_NAME_ENUM.DIRECTION, getInitParamsNumber())
        this.params.set(PARAMS_NAME_ENUM.ATTACK, getInitParamsNumber())
    }

    initStateMachine() {
        this.stateMachine.set(PARAMS_NAME_ENUM.IDLE, new IdleSubStateMachine(this))
        this.stateMachine.set(PARAMS_NAME_ENUM.ATTACK, new AttackSubStateMachine(this))
    }

    initAnimationEvent() {
        this.animationComponent.on(Animation.EventType.FINISHED, () => {
            const name = this.animationComponent.defaultClip.name
            const whiteList = ['attack']
            if (whiteList.some(item => name.includes(item))) {
                this.node.getComponent(EntityManager).state = ENTITY_STATE_ENUM.IDLE
            }
        })
    }

    run() {
        switch (this.currentState) {
            case this.stateMachine.get(PARAMS_NAME_ENUM.IDLE):
            case this.stateMachine.get(PARAMS_NAME_ENUM.ATTACK):
                if (this.params.get(PARAMS_NAME_ENUM.IDLE).value) {
                    this.currentState = this.stateMachine.get(PARAMS_NAME_ENUM.IDLE)
                } else if (this.params.get(PARAMS_NAME_ENUM.ATTACK).value) {
                    this.currentState = this.stateMachine.get(PARAMS_NAME_ENUM.ATTACK)
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

