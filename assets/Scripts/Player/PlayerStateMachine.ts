import { _decorator, AnimationClip, Animation } from 'cc';
import { FSM_PARAM_TYPE_ENUM, PARAMS_NAME_ENUM } from '../../Enums';
import State from '../../Base/State';
import { getInitParamsNumber, getInitParamsTrigger, StateMachine } from '../../Base/StateMachine';
import IdleSubStateMachine from './IdleSubStateMachine';
import TurnLeftSubStateMachine from './TurnLeftSubStateMachine';
const { ccclass, property } = _decorator;

@ccclass('PlayerStateMachine')
export class PlayerStateMachine extends StateMachine {

    async init() {
        this.animationComponent = this.addComponent(Animation);

        this.initParms()
        this.initStateMachine()
        this.initAnimationEvent()

        await Promise.all(this.waitingList)
    }

    initParms() {
        this.params.set(PARAMS_NAME_ENUM.IDLE, getInitParamsTrigger())
        this.params.set(PARAMS_NAME_ENUM.TURNLEFT, getInitParamsTrigger())
        this.params.set(PARAMS_NAME_ENUM.DIRECTION, getInitParamsNumber())
    }

    initStateMachine() {
        this.stateMachine.set(PARAMS_NAME_ENUM.IDLE, new IdleSubStateMachine(this))
        this.stateMachine.set(PARAMS_NAME_ENUM.TURNLEFT, new TurnLeftSubStateMachine(this))
    }

    initAnimationEvent() {
        this.animationComponent.on(Animation.EventType.FINISHED, () => {
            const name = this.animationComponent.defaultClip.name
            const whiteList = ['turn']
            if (whiteList.some(item => name.includes(item))) {
                this.setParamsValue(PARAMS_NAME_ENUM.IDLE, true)
            }
        })
    }

    run() {
        switch (this.currentState) {
            case this.stateMachine.get(PARAMS_NAME_ENUM.TURNLEFT):
            case this.stateMachine.get(PARAMS_NAME_ENUM.IDLE):
                if (this.params.get(PARAMS_NAME_ENUM.TURNLEFT).value) {
                    this.currentState = this.stateMachine.get(PARAMS_NAME_ENUM.TURNLEFT)
                } else if (this.params.get(PARAMS_NAME_ENUM.IDLE).value) {
                    this.currentState = this.stateMachine.get(PARAMS_NAME_ENUM.IDLE)
                } else {
                    this.currentState = this.currentState
                }
                break
            default:
                this.currentState = this.stateMachine.get(PARAMS_NAME_ENUM.IDLE)
        }
    }
}

