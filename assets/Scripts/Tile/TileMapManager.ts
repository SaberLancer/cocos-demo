import { _decorator, Component, Layers, Node, resources, Sprite, SpriteFrame, UITransform } from 'cc';
const { ccclass, property } = _decorator;

import { createUINode, randomByRange } from '../../Utils';
import { TileManager } from './TileManager';
import DataManager from '../../Runtime/DataManager';
import ResourceManager from '../../Runtime/ResourceManager';

@ccclass('TileMapManager')
export class TileMapManager extends Component {
    async init() {
        const spriteFrames = await ResourceManager.instance.loadDir('texture/tile/tile')

        const mapInfo = DataManager.instance.mapInfo;
        const tileInfo = DataManager.instance.tileInfo;

        for (let i = 0; i < mapInfo.length; i++) {
            const column = mapInfo[i];
            tileInfo[i] = [];
            for (let j = 0; j < column.length; j++) {
                const item = column[j];
                if (item.type === null || item.src === null) {
                    continue;
                }

                let number = item.src;
                let type = item.type;
                if ((number === 1 || number === 5 || number === 9) && i % 2 === 0 && j % 2 === 0) {
                    number = number + randomByRange(0, 4)
                }

                const node = createUINode();
                const imgSrc = `tile (${number})`;
                const spriteFrame = spriteFrames.find((frame) => frame.name === imgSrc) || spriteFrames[0];

                const tileManager = node.addComponent(TileManager);
                tileInfo[i][j] = tileManager
                tileManager.init(type, spriteFrame, i, j);
                node.parent = this.node;
            }
        }
    }
}

