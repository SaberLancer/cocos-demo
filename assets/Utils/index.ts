
import { _decorator, Component, Layers, Node, SpriteFrame, UITransform } from 'cc';
export const createUINode = (name: string = '') => {
    const node = new Node(name);

    const transform = node.addComponent(UITransform);

    transform.setAnchorPoint(0, 1)

    node.layer = Layers.Enum.UI_2D

    return node
}

export const randomByRange = (min: number, max: number) => Math.floor(Math.random() * (max - min) + min)

const reg = /\((\d+)\)/

const getNumberWithinString = (str: string) => parseInt(str.match(reg)[1] || '0')

export const sortSpriteFrames = (spriteFrames: Array<SpriteFrame>) =>
    spriteFrames.sort((a: any, b: any) => getNumberWithinString(a.name) - getNumberWithinString(b.name))
