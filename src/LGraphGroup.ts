import { Vector2, Vector4 } from "./basic-types";
import { node_colors } from "./colors";
import { LGraph } from "./LGraph";
import { LGraphNode } from "./LGraphNode";
import { overlapBounding } from "./utils";

export class LGraphGroup {
    title: string;
    private _bounding: Vector4;
    color: string;
    font: string;
    private _pos: any;
    private _size: Vector2;
    font_size: number;
    private _nodes: LGraphNode[];
    graph: LGraph;

    set pos(v) {
        if (!v || v.length < 2) {
            return;
        }
        this._pos[0] = v[0];
        this._pos[1] = v[1];
    }

    get pos() {
        return this._pos;
    }

    set size(v) {
        if (!v || v.length < 2) {
            return;
        }
        this._size[0] = Math.max(140, v[0]);
        this._size[1] = Math.max(80, v[1]);
    }

    get size() {
        return this._size;
    }

    constructor(title?: string) {
        this.title = title || "Group";
        this.font_size = 24;
        this.color = node_colors.pale_blue
            ? node_colors.pale_blue.groupcolor
            : "#AAA";
        this._bounding = [10, 10, 140, 80];
        this._pos = [ this._bounding[0], this._bounding[1] ];
        this._size = [ this._bounding[2], this._bounding[3] ];
        this._nodes = [];
        this.graph = null;
    }

    configure(o: SerializedLGraphGroup) {
        this.title = o.title;
        for (let index = 0; index < o.bounding.length; index++) this._bounding[index] = o.bounding[index];
        this.color = o.color;
        this.font = o.font;
    }

    serialize(): SerializedLGraphGroup {
        var b = this._bounding;
        return {
            title: this.title,
            bounding: [
                Math.round(b[0]),
                Math.round(b[1]),
                Math.round(b[2]),
                Math.round(b[3])
            ],
            color: this.color,
            font: this.font
        };
    }

    move(deltax: number, deltay: number, ignore_nodes?: boolean) {
        this._pos[0] += deltax;
        this._pos[1] += deltay;
        if (ignore_nodes) {
            return;
        }
        for (let i = 0; i < this._nodes.length; ++i) {
            let node = this._nodes[i];
            node.pos[0] += deltax;
            node.pos[1] += deltay;
        }
    }

    recomputeInsideNodes() {
        this._nodes.length = 0;
        let nodes = this.graph.nodes;
        let node_bounding: Vector4 = [0, 0, 0, 0];

        for (let i = 0; i < nodes.length; ++i) {
            let node = nodes[i];
            node.getBounding(node_bounding);
            if (!overlapBounding(this._bounding, node_bounding)) {
                continue;
            } //out of the visible area
            this._nodes.push(node);
        }
    }

    isPointInside = LGraphNode["isPointInside"];
    setDirtyCanvas = LGraphNode["setDirtyCanvas"];
}

export type SerializedLGraphGroup = {
    title: LGraphGroup["title"];
    bounding: LGraphGroup["_bounding"];
    color: LGraphGroup["color"];
    font: LGraphGroup["font"];
};