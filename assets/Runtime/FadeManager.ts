import { game, RenderRoot2D, resources, SpriteFrame } from "cc"
import Singleton from "../Base/Singleton"
import { DrawManager } from "../Scripts/UI/DrawManager"
import { createUINode } from "../Utils"

export default class FadeManager extends Singleton {

    private _fade: DrawManager = null

    static get instance() {
        return super.getInstance<DrawManager>()
    }

    get fade() {
        if (this._fade) {
            return this._fade
        }

        const root = createUINode();
        root.addComponent(RenderRoot2D)

        const fadeNode = createUINode();
        fadeNode.parent = root
        this._fade = fadeNode.addComponent(DrawManager)
        this._fade.init()

        game.addPersistRootNode(root)
        return this._fade
    }

    fadeIn(duration = 2000) {
        return this.fade.fadeIn(duration)
    }

    fadeOut(duration = 2000) {
        return this.fade.fadeOut(duration)
    }
}
