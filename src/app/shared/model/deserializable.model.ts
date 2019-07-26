export class Deserializable {
    public deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
    // deserialize(input: any): this;
}