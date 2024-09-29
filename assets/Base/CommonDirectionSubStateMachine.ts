import { AnimationClip } from "cc";
import { DIRECTION_ENUM } from "../Enums";
import State from "./State";
import DirectionSubStateMachine from "./DirectionSubStateMachine";
import { StateMachine } from "./StateMachine";

export default class CommonDirectionSubStateMachine extends DirectionSubStateMachine {
    constructor(fsm: StateMachine, BASE_URL: string, isLoop: boolean = false) {
        super(fsm)
        // this.fsm = fsm
        this.stateMachine.set(DIRECTION_ENUM.TOP, new State(fsm, `${BASE_URL}top`, isLoop ? AnimationClip.WrapMode.Loop : null))
        this.stateMachine.set(DIRECTION_ENUM.BOTTOM, new State(fsm, `${BASE_URL}bottom`, isLoop ? AnimationClip.WrapMode.Loop : null))
        this.stateMachine.set(DIRECTION_ENUM.LEFT, new State(fsm, `${BASE_URL}left`, isLoop ? AnimationClip.WrapMode.Loop : null))
        this.stateMachine.set(DIRECTION_ENUM.RIGHT, new State(fsm, `${BASE_URL}right`, isLoop ? AnimationClip.WrapMode.Loop : null))
    }
}
