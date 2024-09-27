import { _decorator, Component, Node, Sprite, UITransform, Animation, AnimationClip, animation, SpriteFrame, math } from 'cc';
import { TILE_HEIGHT, TILE_WIDTH } from '../Tile/TileManager';
import ResourceManager from '../../Runtime/ResourceManager';
import { CONTROLLER_ENUM, DIRECTION_ENUM, DIRECTION_ORIGIN_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM, PARAMS_NAME_ENUM } from '../../Enums';
import EventManager from '../../Runtime/EventManager';
import { PlayerStateMachine } from './PlayerStateMachine';
import { EntityManager } from '../../Base/EntityManager';
import DataManager from '../../Runtime/DataManager';
const { ccclass, property } = _decorator;

const ANIMATION_SPEED = 1 / 8

@ccclass('PlayerManager')
export class PlayerManager extends EntityManager {
    TargetX: number = 2
    TargetY: number = 8

    private readonly speed: number = 0.1

    async init() {
        this.fsm = this.addComponent(PlayerStateMachine)
        await this.fsm.init()
        super.init({
            x: 0,
            y: 0,
            type: ENTITY_TYPE_ENUM.PLAYER,
            direction: DIRECTION_ENUM.TOP,
            state: ENTITY_STATE_ENUM.IDLE
        })
        this.x = this.TargetX
        this.y = this.TargetY

        EventManager.instance.on(EVENT_ENUM.PLAYER_CTRL, this.inputHandler, this)
    }

    protected onDestroy(): void {
        EventManager.instance.off(EVENT_ENUM.PLAYER_CTRL, this.inputHandler)
    }

    protected update(dt: number): void {
        this.updateXY()
        super.update(dt)
    }

    updateXY() {
        if (this.TargetX < this.x) {
            this.x -= this.speed
        } else if (this.TargetX > this.x) {
            this.x += this.speed
        }

        if (this.TargetY < this.y) {
            this.y -= this.speed
        } else if (this.TargetY > this.y) {
            this.y += this.speed
        }

        if (Math.abs(this.x - this.TargetX) < this.speed && Math.abs(this.y - this.TargetY) < this.speed) {
            this.x = this.TargetX
            this.y = this.TargetY
        }
    }

    inputHandler(playerDirection: CONTROLLER_ENUM) {
        if (this.willblock(playerDirection)) {
            console.log('block')
            return
        }
        this.move(playerDirection)
    }

    move(playerDirection: CONTROLLER_ENUM) {
        if (playerDirection === CONTROLLER_ENUM.TOP) {
            this.TargetY -= 1
        } else if (playerDirection === CONTROLLER_ENUM.BOTTOM) {
            this.TargetY += 1
        } else if (playerDirection === CONTROLLER_ENUM.LEFT) {
            this.TargetX -= 1
        } else if (playerDirection === CONTROLLER_ENUM.RIGHT) {
            this.TargetX += 1
        } else if (playerDirection === CONTROLLER_ENUM.TURNLEFT) {
            if (this.direction === DIRECTION_ENUM.TOP) {
                this.direction = DIRECTION_ENUM.LEFT
            } else if (this.direction === DIRECTION_ENUM.LEFT) {
                this.direction = DIRECTION_ENUM.BOTTOM
            } else if (this.direction === DIRECTION_ENUM.BOTTOM) {
                this.direction = DIRECTION_ENUM.RIGHT
            } else if (this.direction === DIRECTION_ENUM.RIGHT) {
                this.direction = DIRECTION_ENUM.TOP
            }
            this.state = ENTITY_STATE_ENUM.TURNLEFT
        }
    }

    willblock(playerDirection: CONTROLLER_ENUM) {
        const { TargetX: x, TargetY: y, direction } = this
        const tileInfo = DataManager.instance.tileInfo
        if (playerDirection === CONTROLLER_ENUM.TOP) {
            let playerTile
            let weaponTile
            if (direction === DIRECTION_ENUM.TOP) {
                let playerNextY = y - 1
                let weaponNextY = y - 2

                playerTile = tileInfo[x][playerNextY]
                weaponTile = tileInfo[x][weaponNextY]

            }
            if (direction === DIRECTION_ENUM.BOTTOM) {
                let playerNextY = y - 1
                let weaponNextY = y + 1

                playerTile = tileInfo[x][playerNextY]
                weaponTile = tileInfo[x][weaponNextY]
            }
            if (direction === DIRECTION_ENUM.LEFT) {
                let playerNextY = y - 1
                let weaponNextX = x - 1

                playerTile = tileInfo[x][playerNextY]
                weaponTile = tileInfo[weaponNextX][playerNextY]

            }
            if (direction === DIRECTION_ENUM.RIGHT) {
                let playerNextY = y - 1
                let weaponNextX = x + 1

                playerTile = tileInfo[x][playerNextY]
                weaponTile = tileInfo[weaponNextX][playerNextY]

            }

            if ((playerTile && playerTile.moveable && (!weaponTile || weaponTile.moveable))) {

            } else {
                return true
            }
        } else if (playerDirection === CONTROLLER_ENUM.BOTTOM) {

            // if (direction === DIRECTION_ENUM.TOP) {
            //     let playerNextY = y - 1
            //     let weaponNextY = y - 2

            //     const playerTile = tileInfo[x][playerNextY]
            //     const weaponTile = tileInfo[x][weaponNextY]

            //     if ((playerTile && playerTile.moveable && (!weaponTile || weaponTile.moveable))) {

            //     } else {
            //         return true
            //     }

            // }
        } else if (playerDirection === CONTROLLER_ENUM.LEFT) {
            if (direction === DIRECTION_ENUM.TOP) {
                let playerNextX = x - 1
                let weaponNextY = y - 1

                const playerTile = tileInfo[playerNextX][y]
                const weaponTile = tileInfo[playerNextX][weaponNextY]

                if ((playerTile && playerTile.moveable && (!weaponTile || weaponTile.moveable))) {

                } else {
                    return true
                }

            }
        } else if (playerDirection === CONTROLLER_ENUM.RIGHT) {
            if (direction === DIRECTION_ENUM.TOP) {
                let playerNextX = x + 1
                let weaponNextY = y - 1

                const playerTile = tileInfo[playerNextX][y]
                const weaponTile = tileInfo[playerNextX][weaponNextY]

                if ((playerTile && playerTile.moveable && (!weaponTile || weaponTile.moveable))) {

                } else {
                    return true
                }

            }
        } else if (playerDirection === CONTROLLER_ENUM.TURNLEFT) {
            let nextX
            let nextY
            if (direction === DIRECTION_ENUM.TOP) {
                nextX = x - 1
                nextY = y - 1
            } else if (direction === DIRECTION_ENUM.LEFT) {
                nextX = x - 1
                nextY = y + 1
            } else if (direction === DIRECTION_ENUM.BOTTOM) {
                nextX = x + 1
                nextY = y + 1
            } else if (direction === DIRECTION_ENUM.RIGHT) {
                nextX = x + 1
                nextY = y - 1
            }

            if (
                (!tileInfo[x][nextY] || tileInfo[x][nextY].turnable) &&
                (!tileInfo[nextX][nextY] || tileInfo[nextX][nextY].turnable) &&
                (!tileInfo[nextX][y] || tileInfo[nextX][y].turnable)
            ) { } else {
                return true
            }
        }

        return false
    }
}

