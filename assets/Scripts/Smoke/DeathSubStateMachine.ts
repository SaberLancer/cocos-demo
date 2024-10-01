import { AnimationClip } from "cc";
import DirectionSubStateMachine from "../../Base/DirectionSubStateMachine";
import { StateMachine } from "../../Base/StateMachine";
import { DIRECTION_ENUM } from "../../Enums";
import State from "../../Base/State";

export const BASE_URL = 'texture/smoke/death/'

export default class DeathSubStateMachine extends DirectionSubStateMachine {
    constructor(fsm: StateMachine) {
        super(fsm)
        // this.fsm = fsm
        this.stateMachine.set(DIRECTION_ENUM.TOP, new State(fsm, `${BASE_URL}`))
        this.stateMachine.set(DIRECTION_ENUM.BOTTOM, new State(fsm, `${BASE_URL}`))
        this.stateMachine.set(DIRECTION_ENUM.LEFT, new State(fsm, `${BASE_URL}`))
        this.stateMachine.set(DIRECTION_ENUM.RIGHT, new State(fsm, `${BASE_URL}`))
    }
}
