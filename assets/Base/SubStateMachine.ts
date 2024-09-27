import { _decorator } from 'cc';
import State from './State';
import { StateMachine } from './StateMachine';
const { ccclass, property } = _decorator;


export abstract class SubStateMachine {

    private _currentState: State

    stateMachine: Map<string, State> = new Map()

    constructor(public fsm: StateMachine) { }

    get currentState() {
        return this._currentState
    }

    set currentState(state: State) {
        this._currentState = state
        this._currentState.run()
    }

    abstract run(): void
}

