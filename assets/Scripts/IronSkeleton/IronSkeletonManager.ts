import { _decorator, Component, Node, Sprite, UITransform, Animation, AnimationClip, animation, SpriteFrame, math } from 'cc';
import { EnemyManager } from '../../Base/EnemyManager';
import { IEntity } from '../../Levels';
import { IronSkeletonStateMachine } from './IronSkeletonStateMachine';


const { ccclass, property } = _decorator;

@ccclass('IronSkeletonManager')
export class IronSkeletonManager extends EnemyManager {

    async init(params: IEntity) {
        this.fsm = this.addComponent(IronSkeletonStateMachine)
        await this.fsm.init()
        super.init(params)
    }
}

