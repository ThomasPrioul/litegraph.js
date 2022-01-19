import { Vector2 } from "./basic-types";

export type SerializedLLink = [number, string, number, number, number, number];

export class LLink {
    id: number;
    type: string | null;
    origin_id: number;
    origin_slot: number;
    target_id: number;
    target_slot: number;
    data: any;
    pos: Vector2;

    constructor()
    constructor(
        id?: number,
        type?: string,
        origin_id?: number,
        origin_slot?: number,
        target_id?: number,
        target_slot?: number
    ) {
        this.id = id || 0;
        this.type = type || null;
        this.origin_id = origin_id || 0;
        this.origin_slot = origin_slot || 0;
        this.target_id = target_id || 0;
        this.target_slot = target_slot || 0;

        this.data = null;
        this.pos = [0, 0]; //center
    }

    configure(o: LLink | SerializedLLink) {
        if (o instanceof LLink) {
            this.id = o.id;
            this.type = o.type;
            this.origin_id = o.origin_id;
            this.origin_slot = o.origin_slot;
            this.target_id = o.target_id;
            this.target_slot = o.target_slot;
        } else {
            this.id = o[0];
            this.type = o[1];
            this.origin_id = o[2];
            this.origin_slot = o[3];
            this.target_id = o[4];
            this.target_slot = o[5];
        }
    }

    serialize(): SerializedLLink {
        return [
            this.id,
            this.type,
            this.origin_id,
            this.origin_slot,
            this.target_id,
            this.target_slot,
        ];
    }
}