import { AnimationClip } from "cc";
import DirectionSubStateMachine from "../../Base/DirectionSubStateMachine";
import { DIRECTION_ENUM } from "../../Enums";
import State from "../../Base/State";
import { StateMachine } from "../../Base/StateMachine";

export const BASE_URL = 'texture/ironskeleton/idle/'

export default class IdleSubStateMachine extends DirectionSubStateMachine {
    constructor(fsm: StateMachine) {
        super(fsm)
        // this.fsm = fsm
        this.stateMachine.set(DIRECTION_ENUM.TOP, new State(fsm, `${BASE_URL}top`, AnimationClip.WrapMode.Loop))
        this.stateMachine.set(DIRECTION_ENUM.BOTTOM, new State(fsm, `${BASE_URL}bottom`, AnimationClip.WrapMode.Loop))
        this.stateMachine.set(DIRECTION_ENUM.LEFT, new State(fsm, `${BASE_URL}left`, AnimationClip.WrapMode.Loop))
        this.stateMachine.set(DIRECTION_ENUM.RIGHT, new State(fsm, `${BASE_URL}right`, AnimationClip.WrapMode.Loop))
    }
}
