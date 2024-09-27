import { _decorator, Component, Node, Sprite, SpriteFrame, UITransform } from 'cc';
import { TILE_TYPE_ENUM } from '../../Enums';
const { ccclass, property } = _decorator;

export const TILE_WIDTH = 55;
export const TILE_HEIGHT = 55;

@ccclass('TileManager')
export class TileManager extends Component {
    type: TILE_TYPE_ENUM;
    moveable: boolean;
    turnable: boolean;
    init(type: TILE_TYPE_ENUM, spriteFrames: SpriteFrame, i: number, j: number) {
        this.type = type;
        if (type.includes('WALL')) {
            this.moveable = false;
            this.turnable = false;
        } else if (type.includes('CLIFF')) {
            this.moveable = false;
            this.turnable = true;
        } else if (type.includes('FLOOR')) {
            this.moveable = true;
            this.turnable = true;
        }
        const sprite = this.addComponent(Sprite);
        sprite.spriteFrame = spriteFrames
        const transform = this.node.getComponent(UITransform)
        transform.setContentSize(TILE_WIDTH, TILE_HEIGHT);
        // transform.contentSize = new Vec2(TILE_WIDTH, TILE_HEIGHT);
        this.node.setPosition(i * TILE_WIDTH, -j * TILE_HEIGHT);
    }
}

