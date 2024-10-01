import { _decorator, BlockInputEvents, Color, Component, game, Graphics, Node, UITransform, view } from 'cc';
const { ccclass, property } = _decorator;

const SCREEN_WIDTH = view.getVisibleSize().width
const SCREEN_HIGHT = view.getVisibleSize().height

enum FADE_STATE_ENUM {
    FADE_IN,
    FADE_OUT,
    IDLE
}

export const DEFAULT_DURATION = 2000

@ccclass('DrawManager')
export class DrawManager extends Component {
    private ctx: Graphics
    private duration: number = DEFAULT_DURATION
    private state: FADE_STATE_ENUM = FADE_STATE_ENUM.IDLE
    private oldTime: number = 0
    private fadeRevole: (value: PromiseLike<null>) => void
    private block: BlockInputEvents
    init() {
        this.block = this.addComponent(BlockInputEvents)
        this.ctx = this.addComponent(Graphics)
        const transform = this.node.getComponent(UITransform)
        transform.setContentSize(SCREEN_WIDTH, SCREEN_HIGHT);
        transform.setAnchorPoint(0.5, 0.5);

        this.setAlpha(1)
    }

    setAlpha(percent: number) {
        this.ctx.clear()
        this.ctx.rect(0, 0, SCREEN_WIDTH, SCREEN_HIGHT)
        this.ctx.fillColor = new Color(0, 0, 0, 255 * percent)
        this.ctx.fill()
        this.block.enabled = percent === 1
    }

    update() {
        const percent = (game.totalTime - this.oldTime) / this.duration
        switch (this.state) {
            case FADE_STATE_ENUM.FADE_IN:
                if (percent < 1) {
                    this.setAlpha(percent)
                } else {
                    this.setAlpha(1)
                    this.state = FADE_STATE_ENUM.IDLE
                    this.fadeRevole(null)
                }
                break
            case FADE_STATE_ENUM.FADE_OUT:
                if (percent < 1) {
                    this.setAlpha(1 - percent)
                } else {
                    this.setAlpha(0)
                    this.state = FADE_STATE_ENUM.IDLE
                    this.fadeRevole(null)
                }
                break
        }

    }

    fadeIn(duration = DEFAULT_DURATION) {
        this.setAlpha(0)
        this.oldTime = game.totalTime
        this.duration = duration
        this.state = FADE_STATE_ENUM.FADE_IN
        return new Promise((resolve) => {
            this.fadeRevole = resolve
        })
    }

    fadeOut(duration = DEFAULT_DURATION) {
        this.setAlpha(1)
        this.oldTime = game.totalTime
        this.duration = duration
        this.state = FADE_STATE_ENUM.FADE_OUT
        return new Promise((resolve) => {
            this.fadeRevole = resolve
        })
    }
}

