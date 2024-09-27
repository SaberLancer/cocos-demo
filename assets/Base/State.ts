import { animation, AnimationClip, Sprite, SpriteFrame } from "cc";
import ResourceManager from "../Runtime/ResourceManager";
import { StateMachine } from "./StateMachine";

/**
 * 状态机
 * 1. 需要知道自己要执行的animationClip
 * 2. 要有播放动画的能力animation.play
 */

const ANIMATION_SPEED = 1 / 8

export default class State {
    animationClip: AnimationClip
    constructor(private fsm: StateMachine, private path: string = '', private wrapMode: AnimationClip.WrapMode = AnimationClip.WrapMode.Normal) {
        this.init()
    }

    async init() {

        const promise = ResourceManager.instance.loadDir(this.path)

        this.fsm.waitingList.push(promise)

        const spriteFrames = await promise

        this.animationClip = new AnimationClip();

        const track = new animation.ObjectTrack()
        track.path = new animation.TrackPath().toComponent(Sprite).toProperty('spriteFrame')

        const frames: Array<[number, SpriteFrame]> = spriteFrames.map((item, index) => [ANIMATION_SPEED * index, item])
        track.channel.curve.assignSorted(frames)

        this.animationClip.addTrack(track)
        this.animationClip.name = this.path
        this.animationClip.wrapMode = this.wrapMode
        this.animationClip.duration = frames.length * ANIMATION_SPEED;

    }

    run() {
        this.fsm.animationComponent.defaultClip = this.animationClip
        this.fsm.animationComponent.play()
    }
}
