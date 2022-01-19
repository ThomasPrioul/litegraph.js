export type SerializedLLink = [number, string, number, number, number, number];

export class LLink {
    constructor(
        public id: number,
        public type: string,
        public origin_id: number,
        public origin_slot: number,
        public target_id: number,
        public target_slot: number
    ) {}

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