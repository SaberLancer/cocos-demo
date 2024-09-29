import { DIRECTION_ORIGIN_ENUM, PARAMS_NAME_ENUM } from "../Enums"
import { SubStateMachine } from "./SubStateMachine"

export default class DirectionSubStateMachine extends SubStateMachine {

    run() {
        const value = this.fsm.getParamsValue(PARAMS_NAME_ENUM.DIRECTION)
        this.currentState = this.stateMachine.get(DIRECTION_ORIGIN_ENUM[value as number])
    }
}
