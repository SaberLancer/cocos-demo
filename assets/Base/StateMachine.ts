import { _decorator, Component, Animation, SpriteFrame } from 'cc';
import { FSM_PARAM_TYPE_ENUM } from '../Enums';
import State from './State';
import { SubStateMachine } from './SubStateMachine';
const { ccclass, property } = _decorator;

type ParamsValueType = boolean | number

export interface IParamsValue {
    type: FSM_PARAM_TYPE_ENUM
    value: ParamsValueType
}

export const getInitParamsTrigger = () => {
    return {
        type: FSM_PARAM_TYPE_ENUM.TRIGGER,
        value: false
    }
}

export const getInitParamsNumber = () => {
    return {
        type: FSM_PARAM_TYPE_ENUM.NUMBER,
        value: 0
    }
}

@ccclass('StateMachine')
export abstract class StateMachine extends Component {

    private _currentState: State | SubStateMachine = null

    params: Map<string, IParamsValue> = new Map()

    stateMachine: Map<string, State | SubStateMachine> = new Map()

    animationComponent: Animation

    waitingList: Array<Promise<SpriteFrame[]>> = []

    getParamsValue(paramsName: string) {
        return this.params.get(paramsName).value
    }

    setParamsValue(paramsName: string, value: ParamsValueType) {
        this.params.get(paramsName).value = value
        this.run()
        this.resetTrigger()
    }

    get currentState() {
        return this._currentState
    }

    set currentState(state: State | SubStateMachine) {
        this._currentState = state
        this._currentState.run()
    }

    resetTrigger() {
        for (const [_, value] of this.params) {
            if (value.type === FSM_PARAM_TYPE_ENUM.TRIGGER) {
                value.value = false
            }

        }
    }

    abstract init(): void
    abstract run(): void
}

