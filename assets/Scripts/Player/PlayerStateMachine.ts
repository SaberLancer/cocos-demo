import { _decorator, AnimationClip, Animation } from 'cc';
import { ENTITY_STATE_ENUM, FSM_PARAM_TYPE_ENUM, PARAMS_NAME_ENUM } from '../../Enums';
import State from '../../Base/State';
import { getInitParamsNumber, getInitParamsTrigger, StateMachine } from '../../Base/StateMachine';
import IdleSubStateMachine from './IdleSubStateMachine';
import TurnLeftSubStateMachine from './TurnLeftSubStateMachine';
import BlockFrontSubStateMachine from './BlockFrontSubStateMachine';
import { EntityManager } from '../../Base/EntityManager';
import BlockTurnLeftSubStateMachine from './BlockTurnLeftSubStateMachine';
import TurnRightSubStateMachine from './TurnRightSubStateMachine';
import DeathSubStateMachine from './DeathSubStateMachine';
import AttackSubStateMachine from './AttackSubStateMachine';
import AirDeathSubStateMachine from './AirDeathSubStateMachine';
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
        this.params.set(PARAMS_NAME_ENUM.DIRECTION, getInitParamsNumber())
        this.params.set(PARAMS_NAME_ENUM.IDLE, getInitParamsTrigger())
        this.params.set(PARAMS_NAME_ENUM.TURNLEFT, getInitParamsTrigger())
        this.params.set(PARAMS_NAME_ENUM.TURNRIGHT, getInitParamsTrigger())
        this.params.set(PARAMS_NAME_ENUM.BLOCKFRONT, getInitParamsTrigger())
        this.params.set(PARAMS_NAME_ENUM.BLOCKTURNLEFT, getInitParamsTrigger())
        this.params.set(PARAMS_NAME_ENUM.DEATH, getInitParamsTrigger())
        this.params.set(PARAMS_NAME_ENUM.AIRDEATH, getInitParamsTrigger())
        this.params.set(PARAMS_NAME_ENUM.ATTACK, getInitParamsTrigger())
    }

    initStateMachine() {
        this.stateMachine.set(PARAMS_NAME_ENUM.IDLE, new IdleSubStateMachine(this))
        this.stateMachine.set(PARAMS_NAME_ENUM.TURNLEFT, new TurnLeftSubStateMachine(this))
        this.stateMachine.set(PARAMS_NAME_ENUM.TURNRIGHT, new TurnRightSubStateMachine(this))
        this.stateMachine.set(PARAMS_NAME_ENUM.BLOCKFRONT, new BlockFrontSubStateMachine(this))
        this.stateMachine.set(PARAMS_NAME_ENUM.BLOCKTURNLEFT, new BlockTurnLeftSubStateMachine(this))
        this.stateMachine.set(PARAMS_NAME_ENUM.DEATH, new DeathSubStateMachine(this))
        this.stateMachine.set(PARAMS_NAME_ENUM.AIRDEATH, new AirDeathSubStateMachine(this))
        this.stateMachine.set(PARAMS_NAME_ENUM.ATTACK, new AttackSubStateMachine(this))
    }

    initAnimationEvent() {
        this.animationComponent.on(Animation.EventType.FINISHED, () => {
            const name = this.animationComponent.defaultClip.name
            const whiteList = ['block', 'turn', 'attack']
            if (whiteList.some(item => name.includes(item))) {
                this.node.getComponent(EntityManager).state = ENTITY_STATE_ENUM.IDLE
            }
        })
    }

    run() {
        switch (this.currentState) {
            case this.stateMachine.get(PARAMS_NAME_ENUM.TURNLEFT):
            case this.stateMachine.get(PARAMS_NAME_ENUM.TURNRIGHT):
            case this.stateMachine.get(PARAMS_NAME_ENUM.IDLE):
            case this.stateMachine.get(PARAMS_NAME_ENUM.BLOCKFRONT):
            case this.stateMachine.get(PARAMS_NAME_ENUM.BLOCKTURNLEFT):
            case this.stateMachine.get(PARAMS_NAME_ENUM.ATTACK):
            case this.stateMachine.get(PARAMS_NAME_ENUM.DEATH):
            case this.stateMachine.get(PARAMS_NAME_ENUM.AIRDEATH):
                if (this.params.get(PARAMS_NAME_ENUM.IDLE).value) {
                    this.currentState = this.stateMachine.get(PARAMS_NAME_ENUM.IDLE)
                } else if (this.params.get(PARAMS_NAME_ENUM.DEATH).value) {
                    this.currentState = this.stateMachine.get(PARAMS_NAME_ENUM.DEATH)
                } else if (this.params.get(PARAMS_NAME_ENUM.AIRDEATH).value) {
                    this.currentState = this.stateMachine.get(PARAMS_NAME_ENUM.AIRDEATH)
                } else if (this.params.get(PARAMS_NAME_ENUM.ATTACK).value) {
                    this.currentState = this.stateMachine.get(PARAMS_NAME_ENUM.ATTACK)
                } else if (this.params.get(PARAMS_NAME_ENUM.TURNRIGHT).value) {
                    this.currentState = this.stateMachine.get(PARAMS_NAME_ENUM.TURNRIGHT)
                } else if (this.params.get(PARAMS_NAME_ENUM.TURNLEFT).value) {
                    this.currentState = this.stateMachine.get(PARAMS_NAME_ENUM.TURNLEFT)
                } else if (this.params.get(PARAMS_NAME_ENUM.BLOCKFRONT).value) {
                    this.currentState = this.stateMachine.get(PARAMS_NAME_ENUM.BLOCKFRONT)
                } else if (this.params.get(PARAMS_NAME_ENUM.BLOCKTURNLEFT).value) {
                    this.currentState = this.stateMachine.get(PARAMS_NAME_ENUM.BLOCKTURNLEFT)
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

