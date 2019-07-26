import { Tag } from "app/tag/tag.model";

export interface Question {
    id : number;
    text : string;
    type : string;
    displayTitle : string;
    displayDescription : string; 
    metadata : string;
    optionMetadata : string;
    tags : Tag[];
}